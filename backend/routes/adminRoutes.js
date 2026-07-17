const express = require('express');
const router = express.Router();
const { getPendingDrivers, approveDriver } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/pending-drivers', protect, admin, getPendingDrivers);
router.put('/approve-driver/:id', protect, admin, approveDriver);

module.exports = router;
