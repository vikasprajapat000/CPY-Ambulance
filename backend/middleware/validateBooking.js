/**
 * Middleware to validate booking payloads before database entry
 */
module.exports = (req, res, next) => {
  const { patientName, phone, emergencyType, address, latitude, longitude } = req.body;

  const errors = [];

  if (!patientName || typeof patientName !== 'string' || !patientName.trim()) {
    errors.push('Patient full name is required.');
  }

  if (!phone || !/^[0-9]{10}$/.test(phone)) {
    errors.push('A valid 10-digit Indian phone number is required.');
  }

  if (!emergencyType || typeof emergencyType !== 'string' || !emergencyType.trim()) {
    errors.push('Emergency type selection is required.');
  }

  if (!address || typeof address !== 'string' || !address.trim()) {
    errors.push('Pickup address description is required.');
  }

  if (latitude === undefined || latitude === null || isNaN(Number(latitude))) {
    errors.push('Valid latitude coordinate is required.');
  }

  if (longitude === undefined || longitude === null || isNaN(Number(longitude))) {
    errors.push('Valid longitude coordinate is required.');
  }

  if (errors.length > 0) {
    console.log(`[Validation Failed] Errors: ${errors.join(', ')}`);
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the highlighted errors.',
      errors
    });
  }

  next();
};
