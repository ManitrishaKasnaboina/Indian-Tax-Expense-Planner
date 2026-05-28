const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const SalarySlip = require('../models/SalarySlip');
const User = require('../models/User');

// Helper to extract a number following a keyword from PDF text
const extractComponent = (text, keywords) => {
  for (const keyword of keywords) {
    // Search for the keyword, followed by optional symbols (colon, spaces, hyphen, currency symbols like Rs, ₹), and a number with commas/decimals
    const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`${escapedKeyword}\\s*[:\\-–—=]?\\s*(?:Rs\\.?|INR|₹)?\\s*([0-9,]+(?:\\.[0-9]{2})?)`, 'i');
    const match = text.match(regex);
    if (match) {
      // Remove commas and convert to number
      return parseFloat(match[1].replace(/,/g, ''));
    }
  }
  return 0;
};

// @desc    Upload & Parse Salary Slip PDF
// @route   POST /api/salary/upload
// @access  Private
const uploadSalarySlip = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a PDF salary slip' });
  }

  const filePath = req.file.path;
  const fileName = req.file.originalname;

  try {
    const dataBuffer = fs.readFileSync(filePath);
    let extractedText = '';
    
    try {
      const parsedPdf = await pdfParse(dataBuffer);
      extractedText = parsedPdf.text;
    } catch (pdfError) {
      console.error('PDF parsing error, falling back to manual entry:', pdfError.message);
      // We will continue with empty extractedText so the user gets a structured form to fill
    }

    // Attempt to extract fields
    const basic = extractComponent(extractedText, ['basic salary', 'basic pay', 'basic', 'bp']);
    const hra = extractComponent(extractedText, ['hra', 'house rent allowance', 'house rent']);
    const lta = extractComponent(extractedText, ['lta', 'leave travel allowance', 'leave travel']);
    const pf = extractComponent(extractedText, ['provident fund', 'pf', 'epf', 'employee pf']);
    const pt = extractComponent(extractedText, ['professional tax', 'pt', 'prof tax']);
    const taxDeducted = extractComponent(extractedText, ['income tax', 'tds', 'it tax', 'it deduction']);
    const gross = extractComponent(extractedText, ['gross salary', 'gross pay', 'gross earning', 'total earnings', 'gross']);
    const net = extractComponent(extractedText, ['net salary', 'net pay', 'net take home', 'net take-home', 'take home', 'net earning', 'net']);

    // Attempt to extract month/year
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    let slipMonth = 'Unknown Month';
    
    // Simple month finder
    const textLower = extractedText.toLowerCase();
    for (const m of months) {
      const mRegex = new RegExp(`\\b${m}\\b\\s*([0-9]{4})?`, 'i');
      const match = textLower.match(mRegex);
      if (match) {
        const yearMatch = textLower.match(/\b(202[0-9])\b/);
        const year = yearMatch ? yearMatch[1] : new Date().getFullYear();
        slipMonth = `${m.charAt(0).toUpperCase() + m.slice(1)} ${year}`;
        break;
      }
    }

    if (slipMonth === 'Unknown Month') {
      const date = new Date();
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      slipMonth = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }

    // Default calculations if Gross/Net are zero but we parsed Basic etc.
    const calculatedGross = gross || (basic + hra + lta + (gross > 0 ? gross - (basic + hra + lta) : 0));
    const calculatedNet = net || (calculatedGross - (pf + pt + taxDeducted));

    const parsedData = {
      basicSalary: basic,
      hra,
      lta,
      providentFund: pf,
      professionalTax: pt,
      incomeTaxDeducted: taxDeducted,
      otherAllowances: Math.max(0, calculatedGross - (basic + hra + lta)),
      grossSalary: calculatedGross,
      netSalary: calculatedNet
    };

    // Save metadata and parsed data (temporarily)
    const salarySlip = await SalarySlip.create({
      user: req.user._id,
      fileName,
      filePath,
      month: slipMonth,
      parsedData,
      isAnalyzed: false
    });

    res.status(201).json({
      _id: salarySlip._id,
      fileName: salarySlip.fileName,
      month: salarySlip.month,
      parsedData: salarySlip.parsedData,
      message: 'Salary slip uploaded and parsed successfully. Please verify the components.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Analyze and finalize salary components, sync to user profile
// @route   POST /api/salary/analyze
// @access  Private
const analyzeSalaryComponents = async (req, res) => {
  const { id, parsedData, syncToProfile } = req.body;

  if (!id || !parsedData) {
    return res.status(400).json({ message: 'Slip ID and finalized parsedData are required' });
  }

  try {
    const slip = await SalarySlip.findOne({ _id: id, user: req.user._id });

    if (!slip) {
      return res.status(404).json({ message: 'Salary slip not found' });
    }

    // Update with finalized data edited by the user
    slip.parsedData = parsedData;
    slip.isAnalyzed = true;
    await slip.save();

    if (syncToProfile) {
      // Sync basic details back to user profile for tax estimations
      const user = await User.findById(req.user._id);
      if (user) {
        // Sync monthlyIncome with gross salary
        user.monthlyIncome = parsedData.grossSalary || user.monthlyIncome;
        
        // Sync PF & Professional Tax deductions automatically (multiplied by 12 for annual limits)
        user.deductions.section80C = Math.min(150000, (user.deductions.section80C || 0) + (parsedData.providentFund * 12));
        user.deductions.otherDeductions = (user.deductions.otherDeductions || 0) + (parsedData.professionalTax * 12);
        
        // Setup HRA details in user deductions
        user.deductions.hraReceived = parsedData.hra || user.deductions.hraReceived;
        
        await user.save();
      }
    }

    res.json({
      message: 'Salary slip components analyzed and locked. Profile updated if requested.',
      slip
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get details of the latest uploaded slip
// @route   GET /api/salary/details
// @access  Private
const getLatestSalarySlip = async (req, res) => {
  try {
    const slip = await SalarySlip.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    if (!slip) {
      return res.status(404).json({ message: 'No salary slips uploaded yet' });
    }

    res.json(slip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get upload history
// @route   GET /api/salary/history
// @access  Private
const getSalaryHistory = async (req, res) => {
  try {
    const slips = await SalarySlip.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(slips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete salary slip and its file
// @route   DELETE /api/salary/delete/:id
// @access  Private
const deleteSalarySlip = async (req, res) => {
  try {
    const slip = await SalarySlip.findOne({ _id: req.params.id, user: req.user._id });

    if (!slip) {
      return res.status(404).json({ message: 'Salary slip not found' });
    }

    // Delete the file from local storage
    if (fs.existsSync(slip.filePath)) {
      fs.unlinkSync(slip.filePath);
    }

    await SalarySlip.findByIdAndDelete(req.params.id);

    res.json({ message: 'Salary slip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadSalarySlip,
  analyzeSalaryComponents,
  getLatestSalarySlip,
  getSalaryHistory,
  deleteSalarySlip
};
