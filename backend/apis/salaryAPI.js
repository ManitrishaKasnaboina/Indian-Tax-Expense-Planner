const express = require('express');
const router = express.Router();
const {
  uploadSalarySlip,
  analyzeSalaryComponents,
  getLatestSalarySlip,
  getSalaryHistory,
  deleteSalarySlip
} = require('../controllers/salaryController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.post('/upload', upload.single('salarySlip'), uploadSalarySlip);
router.post('/analyze', analyzeSalaryComponents);
router.get('/details', getLatestSalarySlip);
router.get('/history', getSalaryHistory);
router.delete('/delete/:id', deleteSalarySlip);

module.exports = router;
