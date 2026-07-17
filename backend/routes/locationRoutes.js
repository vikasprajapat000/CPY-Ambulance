const express    = require('express');
const router     = express.Router();
const { updateLocation, getLocation } = require('../controllers/locationController');

// POST /api/location/update — ambulance driver sends GPS position
router.post('/update', updateLocation);

// GET  /api/location/:bookingId — patient/admin fetches current ambulance position
router.get('/:bookingId', getLocation);

module.exports = router;
