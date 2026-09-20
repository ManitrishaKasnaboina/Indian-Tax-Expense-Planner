const express = require('express');
const router = express.Router();
const { getGoals, createGoal, addFundsToGoal, deleteGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.post('/:id/add-funds', addFundsToGoal);
router.delete('/:id', deleteGoal);

module.exports = router;
