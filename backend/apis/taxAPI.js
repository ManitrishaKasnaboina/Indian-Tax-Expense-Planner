const express = require('express');
const router = express.Router();
const {
  calculateTax,
  getTaxSuggestions,
  saveTaxScenario,
  getTaxHistory,
  getTaxReport
} = require('../controllers/taxController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/calculate', calculateTax);
router.get('/suggestions', getTaxSuggestions);
router.post('/save', saveTaxScenario);
router.get('/history', getTaxHistory);
router.get('/report', getTaxReport);

module.exports = router;
