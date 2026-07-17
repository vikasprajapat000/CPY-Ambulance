const User = require('../models/User');

// @desc    Get all pending drivers
// @route   GET /api/admin/pending-drivers
// @access  Private/Admin
exports.getPendingDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'DRIVER', isApproved: false }).select('-password');
    res.json({ success: true, data: drivers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Approve a driver
// @route   PUT /api/admin/approve-driver/:id
// @access  Private/Admin
exports.approveDriver = async (req, res) => {
  try {
    const driver = await User.findById(req.params.id);
    
    if (!driver || driver.role !== 'DRIVER') {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    driver.isApproved = true;
    await driver.save();

    res.json({ success: true, message: 'Driver approved successfully', data: driver });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
