const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  financialYear: {
    type: String,
    required: true,
    default: '2025-26'
  },
  regime: {
    type: String,
    enum: ['old', 'new'],
    required: true
  },
  grossIncome: {
    type: Number,
    required: true
  },
  standardDeduction: {
    type: Number,
    required: true
  },
  deductions: {
    section80C: { type: Number, default: 0 },
    section80D: { type: Number, default: 0 },
    nps: { type: Number, default: 0 },
    hraExemption: { type: Number, default: 0 },
    homeLoanInterest: { type: Number, default: 0 },
    otherDeductions: { type: Number, default: 0 }
  },
  taxableIncome: {
    type: Number,
    required: true
  },
  calculatedTax: {
    type: Number,
    required: true
  },
  cess: {
    type: Number,
    required: true
  },
  rebate: {
    type: Number,
    default: 0
  },
  totalTaxLiability: {
    type: Number,
    required: true
  },
  comparison: {
    oldRegimeTax: { type: Number },
    newRegimeTax: { type: Number },
    recommendedRegime: { type: String }
  }
}, {
  timestamps: true
});

const Tax = mongoose.model('Tax', taxSchema);
module.exports = Tax;
