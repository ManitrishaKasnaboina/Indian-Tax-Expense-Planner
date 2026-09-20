const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        taxRegime: user.taxRegime,
        monthlyIncome: user.monthlyIncome,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        taxRegime: user.taxRegime,
        monthlyIncome: user.monthlyIncome,
        deductions: user.deductions,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        taxRegime: user.taxRegime,
        monthlyIncome: user.monthlyIncome,
        financialYear: user.financialYear,
        deductions: user.deductions,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile / tax details
// @route   PUT /api/auth/update-profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.taxRegime = req.body.taxRegime || user.taxRegime;
      user.monthlyIncome = req.body.monthlyIncome !== undefined ? req.body.monthlyIncome : user.monthlyIncome;
      user.financialYear = req.body.financialYear || user.financialYear;
      
      if (req.body.deductions) {
        user.deductions = {
          section80C: req.body.deductions.section80C !== undefined ? req.body.deductions.section80C : user.deductions.section80C,
          section80D: req.body.deductions.section80D !== undefined ? req.body.deductions.section80D : user.deductions.section80D,
          nps: req.body.deductions.nps !== undefined ? req.body.deductions.nps : user.deductions.nps,
          hraReceived: req.body.deductions.hraReceived !== undefined ? req.body.deductions.hraReceived : user.deductions.hraReceived,
          rentPaid: req.body.deductions.rentPaid !== undefined ? req.body.deductions.rentPaid : user.deductions.rentPaid,
          homeLoanInterest: req.body.deductions.homeLoanInterest !== undefined ? req.body.deductions.homeLoanInterest : user.deductions.homeLoanInterest,
          otherDeductions: req.body.deductions.otherDeductions !== undefined ? req.body.deductions.otherDeductions : user.deductions.otherDeductions
        };
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        taxRegime: updatedUser.taxRegime,
        monthlyIncome: updatedUser.monthlyIncome,
        financialYear: updatedUser.financialYear,
        deductions: updatedUser.deductions,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
};
