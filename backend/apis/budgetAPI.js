const express = require('express');
const router = express.Router();
const {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  getBudgetStatus
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/create', createBudget);
router.get('/', getBudgets);
router.get('/status/current', getBudgetStatus);

router.route('/:id')
  .get(getBudgetById);

router.put('/update/:id', updateBudget);
router.delete('/delete/:id', deleteBudget);

module.exports = router;
