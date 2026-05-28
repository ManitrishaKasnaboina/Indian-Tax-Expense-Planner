const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// @desc    Create a new budget limit
// @route   POST /api/budget/create
// @access  Private
const createBudget = async (req, res) => {
  const { category, limit, month, year } = req.body;

  if (!category || !limit || !month || !year) {
    return res.status(400).json({ message: 'Category, limit, month, and year are required' });
  }

  try {
    // Check if budget already exists for this category, month, and year
    const budgetExists = await Budget.findOne({
      user: req.user._id,
      category,
      month,
      year
    });

    if (budgetExists) {
      return res.status(400).json({ message: 'Budget limit already exists for this category and period' });
    }

    const budget = await Budget.create({
      user: req.user._id,
      category,
      limit,
      month,
      year
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all budgets for a user (with optional month/year filter)
// @route   GET /api/budget
// @access  Private
const getBudgets = async (req, res) => {
  const { month, year } = req.query;
  const query = { user: req.user._id };

  if (month) query.month = Number(month);
  if (year) query.year = Number(year);

  try {
    const budgets = await Budget.find(query).sort({ year: -1, month: -1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get budget by ID
// @route   GET /api/budget/:id
// @access  Private
const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a budget limit
// @route   PUT /api/budget/update/:id
// @access  Private
const updateBudget = async (req, res) => {
  const { limit, alertTriggered } = req.body;

  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    budget.limit = limit !== undefined ? limit : budget.limit;
    budget.alertTriggered = alertTriggered !== undefined ? alertTriggered : budget.alertTriggered;

    const updatedBudget = await budget.save();
    res.json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a budget limit
// @route   DELETE /api/budget/delete/:id
// @access  Private
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current month's budget vs actual status
// @route   GET /api/budget/status/current
// @access  Private
const getBudgetStatus = async (req, res) => {
  const now = new Date();
  const year = req.query.year ? Number(req.query.year) : now.getFullYear();
  const month = req.query.month ? Number(req.query.month) : now.getMonth() + 1;

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  try {
    // Get all budgets for the specified month
    const budgets = await Budget.find({ user: req.user._id, month, year });

    // Get aggregated expenses for the specified month
    const expensesAgg = await Expense.aggregate([
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
          totalSpent: { $sum: '$amount' }
        }
      }
    ]);

    const expenseMap = {};
    expensesAgg.forEach(exp => {
      expenseMap[exp._id] = exp.totalSpent;
    });

    const status = budgets.map(budget => {
      const spent = expenseMap[budget.category] || 0;
      const percentUsed = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
      const isExceeded = spent > budget.limit;

      return {
        _id: budget._id,
        category: budget.category,
        limit: budget.limit,
        spent,
        percentUsed: Number(percentUsed.toFixed(2)),
        isExceeded,
        month,
        year
      };
    });

    // Check if there are expenses in categories without budgets
    const budgetedCategories = budgets.map(b => b.category);
    const nonBudgeted = [];
    
    Object.keys(expenseMap).forEach(cat => {
      if (!budgetedCategories.includes(cat)) {
        nonBudgeted.push({
          category: cat,
          limit: 0,
          spent: expenseMap[cat],
          percentUsed: 100,
          isExceeded: true,
          month,
          year
        });
      }
    });

    res.json({
      month,
      year,
      budgeted: status,
      nonBudgeted
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  getBudgetStatus
};
