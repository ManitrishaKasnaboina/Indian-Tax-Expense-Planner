const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// @desc    Add a new expense
// @route   POST /api/expenses/add
// @access  Private
const addExpense = async (req, res) => {
  const { amount, category, description, date, isTaxSaving, taxSection, type } = req.body;

  if (!amount || !category) {
    return res.status(400).json({ message: 'Amount and category are required' });
  }

  try {
    const expense = await Expense.create({
      user: req.user._id,
      type: type || 'expense',
      amount,
      category,
      description,
      date: date || new Date(),
      isTaxSaving: isTaxSaving || false,
      taxSection: taxSection || ''
    });

    // Check if a budget exists for this category, month, and year (only for expenses)
    if (type === 'expense' || !type) {
      const expDate = new Date(expense.date);
      const month = expDate.getMonth() + 1;
      const year = expDate.getFullYear();

      const budget = await Budget.findOne({ user: req.user._id, category, month, year });
      let budgetWarning = null;

      if (budget) {
        // Calculate total spent in this category for the month
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

        const totalSpentRes = await Expense.aggregate([
          {
            $match: {
              user: req.user._id,
              category,
              type: 'expense',
              date: { $gte: startOfMonth, $lte: endOfMonth }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);

        const totalSpent = totalSpentRes.length > 0 ? totalSpentRes[0].total : 0;

        if (totalSpent > budget.limit) {
          budget.alertTriggered = true;
          await budget.save();
          budgetWarning = `Warning: You have exceeded your budget of ₹${budget.limit} for ${category}. Total spent: ₹${totalSpent}`;
        }
      }

      res.status(201).json({
        expense,
        budgetWarning
      });
    } else {
      res.status(201).json({
        expense
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all expenses for the user (with optional query filters)
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  const { category, isTaxSaving, taxSection, startDate, endDate, page = 1, limit = 10 } = req.query;

  const query = { user: req.user._id };

  if (category) {
    query.category = category;
  }

  if (isTaxSaving !== undefined) {
    query.isTaxSaving = isTaxSaving === 'true';
  }

  if (taxSection) {
    query.taxSection = taxSection;
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) {
      query.date.$gte = new Date(startDate);
    }
    if (endDate) {
      query.date.$lte = new Date(endDate);
    }
  }

  try {
    const skip = (page - 1) * limit;

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Expense.countDocuments(query);

    res.json({
      expenses,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get expense by ID
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/update/:id
// @access  Private
const updateExpense = async (req, res) => {
  const { amount, category, description, date, isTaxSaving, taxSection } = req.body;

  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    expense.amount = amount !== undefined ? amount : expense.amount;
    expense.category = category || expense.category;
    expense.description = description !== undefined ? description : expense.description;
    expense.date = date || expense.date;
    expense.isTaxSaving = isTaxSaving !== undefined ? isTaxSaving : expense.isTaxSaving;
    expense.taxSection = taxSection !== undefined ? taxSection : expense.taxSection;

    const updatedExpense = await expense.save();

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/delete/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get expenses by category
// @route   GET /api/expenses/category/:category
// @access  Private
const getExpensesByCategory = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user._id,
      category: req.params.category
    }).sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get monthly expense summary (category wise totals for current month)
// @route   GET /api/expenses/summary/monthly
// @access  Private
const getMonthlySummary = async (req, res) => {
  const now = new Date();
  const year = req.query.year ? Number(req.query.year) : now.getFullYear();
  const month = req.query.month ? Number(req.query.month) : now.getMonth() + 1; // 1-12

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  try {
    const summary = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalAmount: 1,
          count: 1
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);

    const grandTotalRes = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const grandTotal = grandTotalRes.length > 0 ? grandTotalRes[0].total : 0;

    res.json({
      month,
      year,
      grandTotal,
      categories: summary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpensesByCategory,
  getMonthlySummary
};
