const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const User = require('../models/User');
const { calculateTaxAll } = require('../utils/calculateTax');

// @desc    Get summary numbers for dashboard widgets
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  try {
    // 1. Calculate Monthly Expense Total
    const totalExpensesRes = await Expense.aggregate([
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
    const monthlyExpenseTotal = totalExpensesRes.length > 0 ? totalExpensesRes[0].total : 0;

    // 2. Budget status counts
    const budgets = await Budget.find({ user: req.user._id, month, year });
    const totalBudgets = budgets.length;

    // Fetch actual spent by category to calculate exceeded count
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

    let exceededBudgets = 0;
    budgets.forEach(b => {
      if ((expenseMap[b.category] || 0) > b.limit) {
        exceededBudgets++;
      }
    });

    // 3. Tax info
    const user = await User.findById(req.user._id);
    const annualIncome = user.monthlyIncome * 12;
    const taxResults = calculateTaxAll(annualIncome, user.deductions || {});
    const taxLiability = user.taxRegime === 'old' ? taxResults.oldRegime.totalTaxLiability : taxResults.newRegime.totalTaxLiability;

    res.json({
      expenseSummary: {
        totalSpent: monthlyExpenseTotal,
        month,
        year
      },
      budgetSummary: {
        totalBudgets,
        exceededBudgets,
        budgetLimit: budgets.reduce((acc, curr) => acc + curr.limit, 0)
      },
      taxSummary: {
        annualGrossIncome: annualIncome,
        selectedRegime: user.taxRegime,
        taxLiability,
        recommendedRegime: taxResults.recommendedRegime,
        potentialSavings: Math.abs(taxResults.oldRegime.totalTaxLiability - taxResults.newRegime.totalTaxLiability)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chart data for monthly categories and budget vs actual
// @route   GET /api/dashboard/charts
// @access  Private
const getChartData = async (req, res) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  try {
    // Category Pie Chart data
    const categoryTotals = await Expense.aggregate([
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
          value: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: 1
        }
      },
      {
        $sort: { value: -1 }
      }
    ]);

    // Budget vs Actual data
    const budgets = await Budget.find({ user: req.user._id, month, year });
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

    const budgetVsActual = budgets.map(b => ({
      category: b.category,
      limit: b.limit,
      spent: expenseMap[b.category] || 0
    }));

    res.json({
      categoryPie: categoryTotals,
      budgetVsActual
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get 6-month historical expense trends
// @route   GET /api/analytics/monthly-expenses
// @access  Private
const getMonthlyTrends = async (req, res) => {
  const now = new Date();
  // Start from 5 months ago
  const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  try {
    const monthlyData = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          date: { $gte: start }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Map to a cleaner format e.g. "Jun 2026"
    const trends = monthlyData.map(d => ({
      period: `${monthNames[d._id.month - 1]} ${d._id.year}`,
      totalSpent: d.total
    }));

    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get details about tax savings investments
// @route   GET /api/analytics/savings
// @access  Private
const getSavingsOverview = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      investments: [
        { name: 'Section 80C (PPF, ELSS, EPF)', limit: 150000, current: user.deductions.section80C || 0 },
        { name: 'Section 80D (Health Insurance)', limit: 25000, current: user.deductions.section80D || 0 },
        { name: 'NPS Section 80CCD(1B)', limit: 50000, current: user.deductions.nps || 0 }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get detailed old vs new regime comparison statistics
// @route   GET /api/analytics/tax-overview
// @access  Private
const getTaxOverview = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const annualIncome = user.monthlyIncome * 12;
    const taxResults = calculateTaxAll(annualIncome, user.deductions || {});

    res.json({
      grossIncome: annualIncome,
      selectedRegime: user.taxRegime,
      oldRegimeTax: taxResults.oldRegime.totalTaxLiability,
      newRegimeTax: taxResults.newRegime.totalTaxLiability,
      savingsInNewRegime: taxResults.oldRegime.totalTaxLiability - taxResults.newRegime.totalTaxLiability,
      recommendedRegime: taxResults.recommendedRegime,
      deductionsTotal: taxResults.oldRegime.totalDeductions,
      advisoryNote: taxResults.advisoryNote
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get detailed reports data
// @route   GET /api/analytics/reports
// @access  Private
const getReportsData = async (req, res) => {
  const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

  try {
    // Monthly income vs expense
    const monthlyData = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfYear, $lte: endOfYear }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyData = monthNames.map((m, index) => ({
      name: m,
      income: 0,
      expense: 0
    }));

    monthlyData.forEach(d => {
      const monthIndex = d._id.month - 1;
      if (d._id.type === 'income') {
        formattedMonthlyData[monthIndex].income = d.total;
      } else {
        formattedMonthlyData[monthIndex].expense = d.total;
      }
    });

    // Category breakdown for expenses
    const categoryData = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          date: { $gte: startOfYear, $lte: endOfYear }
        }
      },
      {
        $group: {
          _id: '$category',
          value: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: 1
        }
      },
      {
        $sort: { value: -1 }
      }
    ]);

    res.json({
      monthlyData: formattedMonthlyData,
      categoryData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardSummary,
  getChartData,
  getMonthlyTrends,
  getSavingsOverview,
  getTaxOverview,
  getReportsData
};
