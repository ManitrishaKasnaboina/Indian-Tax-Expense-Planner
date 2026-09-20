const express = require('express');
const router = express.Router();
const {
  getMonthlyTrends,
  getSavingsOverview,
  getTaxOverview,
  getReportsData
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/monthly-expenses', getMonthlyTrends);
router.get('/savings', getSavingsOverview);
router.get('/tax-overview', getTaxOverview);
router.get('/reports', getReportsData);

module.exports = router;
