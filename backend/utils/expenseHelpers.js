const getMonthlyExpenseSummary = (expenses) => {
  const summary = expenses.reduce((acc, expense) => {
    const category = expense.category;
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  return Object.keys(summary).map(category => ({
    category,
    amount: summary[category]
  }));
};

module.exports = {
  getMonthlyExpenseSummary
};
