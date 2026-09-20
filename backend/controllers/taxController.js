const Tax = require('../models/Tax');
const User = require('../models/User');
const { calculateTaxAll } = require('../utils/calculateTax');

// @desc    Calculate tax based on inputs or user profile
// @route   POST /api/tax/calculate
// @access  Private
const calculateTax = async (req, res) => {
  const { grossIncome, deductions } = req.body;

  try {
    let incomeToUse = grossIncome;
    let deductionsToUse = deductions || {};

    // If no income is passed, fetch from user profile
    if (incomeToUse === undefined) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      incomeToUse = user.monthlyIncome * 12; // Convert monthly to annual gross
      deductionsToUse = user.deductions || {};
    }

    const taxResults = calculateTaxAll(incomeToUse, deductionsToUse);
    res.json(taxResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tax-saving suggestions based on current profile details
// @route   GET /api/tax/suggestions
// @access  Private
const getTaxSuggestions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const annualIncome = user.monthlyIncome * 12;
    const taxResults = calculateTaxAll(annualIncome, user.deductions || {});

    res.json({
      taxRegime: user.taxRegime,
      currentLiability: user.taxRegime === 'old' ? taxResults.oldRegime.totalTaxLiability : taxResults.newRegime.totalTaxLiability,
      suggestions: taxResults.suggestions,
      advisoryNote: taxResults.advisoryNote,
      maxedOutScenario: taxResults.maxedOutScenario
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save a tax calculation snapshot
// @route   POST /api/tax/save
// @access  Private
const saveTaxScenario = async (req, res) => {
  const { financialYear, regime, grossIncome, deductions } = req.body;

  if (!financialYear || !regime || grossIncome === undefined) {
    return res.status(400).json({ message: 'Financial year, regime, and gross income are required' });
  }

  try {
    const taxResults = calculateTaxAll(grossIncome, deductions || {});
    const regimeResults = regime === 'old' ? taxResults.oldRegime : taxResults.newRegime;

    const taxRecord = await Tax.create({
      user: req.user._id,
      financialYear,
      regime,
      grossIncome,
      standardDeduction: regimeResults.standardDeduction,
      deductions: regimeResults.appliedDeductions,
      taxableIncome: regimeResults.taxableIncome,
      calculatedTax: regimeResults.calculatedTax,
      cess: regimeResults.cess,
      rebate: regimeResults.rebate,
      totalTaxLiability: regimeResults.totalTaxLiability,
      comparison: {
        oldRegimeTax: taxResults.oldRegime.totalTaxLiability,
        newRegimeTax: taxResults.newRegime.totalTaxLiability,
        recommendedRegime: taxResults.recommendedRegime
      }
    });

    res.status(201).json(taxRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get historical tax calculations
// @route   GET /api/tax/history
// @access  Private
const getTaxHistory = async (req, res) => {
  try {
    const history = await Tax.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get detailed tax report
// @route   GET /api/tax/report
// @access  Private
const getTaxReport = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const annualIncome = user.monthlyIncome * 12;
    const taxResults = calculateTaxAll(annualIncome, user.deductions || {});
    const currentRegimeDetails = user.taxRegime === 'old' ? taxResults.oldRegime : taxResults.newRegime;

    res.json({
      user: {
        name: user.name,
        email: user.email,
        monthlyIncome: user.monthlyIncome,
        annualGrossIncome: annualIncome,
        selectedRegime: user.taxRegime
      },
      currentRegimeDetails,
      comparison: {
        oldRegimeTax: taxResults.oldRegime.totalTaxLiability,
        newRegimeTax: taxResults.newRegime.totalTaxLiability,
        savingsWithNewRegime: taxResults.oldRegime.totalTaxLiability - taxResults.newRegime.totalTaxLiability,
        recommendedRegime: taxResults.recommendedRegime
      },
      suggestions: taxResults.suggestions,
      advisoryNote: taxResults.advisoryNote
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  calculateTax,
  getTaxSuggestions,
  saveTaxScenario,
  getTaxHistory,
  getTaxReport
};
