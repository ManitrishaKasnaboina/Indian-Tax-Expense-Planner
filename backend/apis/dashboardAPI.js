const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  getChartData
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/summary', getDashboardSummary);
router.get('/charts', getChartData);

module.exports = router;
