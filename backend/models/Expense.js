const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    default: 'expense'
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  isTaxSaving: {
    type: Boolean,
    default: false
  },
  taxSection: {
    type: String,
    enum: ['', '80C', '80D', '80G', 'other'],
    default: ''
  }
}, {
  timestamps: true
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
