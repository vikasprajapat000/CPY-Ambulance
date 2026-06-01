const nodemailer = require('nodemailer');

const sendApprovalEmail = async (booking) => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_EMAIL_PASSWORD) {
    console.log('⚠️  [emailService] ADMIN_EMAIL or ADMIN_EMAIL_PASSWORD not configured. Skipping approval email.');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: `"CPY Ambulance" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: '🚑 Ambulance Booking Approved',
      html: `
        <h2>Booking Approved</h2>
        <p><b>Booking ID:</b> ${booking.bookingId}</p>
        <p><b>Patient:</b> ${booking.patientName}</p>
        <p><b>Phone:</b> ${booking.phone}</p>
        <p><b>Emergency:</b> ${booking.emergencyType}</p>
        <p><b>Address:</b> ${booking.address}</p>
        <p><b>Status:</b> ${booking.status}</p>
        <br/>
        <p>CPY Ambulance (Care • Protect • You)</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ [emailService] Approval email sent to ${process.env.ADMIN_EMAIL} for booking ${booking.bookingId}`);
  } catch (error) {
    console.error('❌ [emailService] Failed to send approval email:', error.message);
  }
};

module.exports = { sendApprovalEmail };

