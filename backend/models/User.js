const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  taxRegime: {
    type: String,
    enum: ['old', 'new'],
    default: 'new'
  },
  monthlyIncome: {
    type: Number,
    default: 0
  },
  financialYear: {
    type: String,
    default: '2025-26'
  },
  deductions: {
    section80C: { type: Number, default: 0 },
    section80D: { type: Number, default: 0 },
    nps: { type: Number, default: 0 },
    hraReceived: { type: Number, default: 0 },
    rentPaid: { type: Number, default: 0 },
    homeLoanInterest: { type: Number, default: 0 },
    otherDeductions: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
