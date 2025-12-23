// backend/utils/whatsappService.js

/**
 * Generate WhatsApp URL for new ambulance booking
 * @param {Object} booking - Booking document from database
 * @returns {string} WhatsApp URL
 */

exports.generateWhatsAppUrl = (booking) => {
  if (!booking) {
    return null;
  }

  const ADMIN_WHATSAPP_NUMBER = '916350086738';

  // 📝 WhatsApp message format
  const message = `
🚑 *NEW AMBULANCE BOOKING RECEIVED*

👤 Patient Name:
${booking.patientName}

📞 Contact Number:
${booking.phone}

🚨 Emergency Type:
${booking.emergencyType}

📍 Pickup Address:
${booking.address}

🗺 Google Maps Location:
https://www.google.com/maps?q=${booking.latitude},${booking.longitude}

📝 Additional Information:
${booking.additionalInfo || 'N/A'}

⏱ Please respond immediately.
`;

  // ✅ CORRECT WhatsApp URL FORMAT
  const whatsappUrl = `https://wa.me/916350086738?text=${encodeURIComponent(
    message
  )}`;

  return whatsappUrl;
};
