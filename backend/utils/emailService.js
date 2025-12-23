const nodemailer = require('nodemailer');

const sendApprovalEmail = async (booking) => {
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
};

module.exports = { sendApprovalEmail };
