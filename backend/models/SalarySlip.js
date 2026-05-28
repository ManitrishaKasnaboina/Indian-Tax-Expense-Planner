const mongoose = require('mongoose');

const salarySlipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  parsedData: {
    basicSalary: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    lta: { type: Number, default: 0 },
    providentFund: { type: Number, default: 0 },
    professionalTax: { type: Number, default: 0 },
    incomeTaxDeducted: { type: Number, default: 0 },
    otherAllowances: { type: Number, default: 0 },
    grossSalary: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 }
  },
  isAnalyzed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const SalarySlip = mongoose.model('SalarySlip', salarySlipSchema);
module.exports = SalarySlip;
