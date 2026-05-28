const express = require('express');
const router = express.Router();
const {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpensesByCategory,
  getMonthlySummary
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/add', addExpense);
router.get('/', getExpenses);
router.get('/summary/monthly', getMonthlySummary);
router.get('/category/:category', getExpensesByCategory);

router.route('/:id')
  .get(getExpenseById);

router.put('/update/:id', updateExpense);
router.delete('/delete/:id', deleteExpense);

module.exports = router;
