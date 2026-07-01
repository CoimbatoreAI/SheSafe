const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // In a real production app, use actual SMTP settings
  // For now, we simulate success or use Ethereal (fake SMTP service)
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER || 'ethereal_user',
        pass: process.env.EMAIL_PASS || 'ethereal_pass',
      },
    });

    // We skip actual sending if credentials are not real, simulating success
    if (process.env.EMAIL_HOST) {
       await transporter.sendMail({
        from: '"SheSafeIn" <noreply@shesafe.in>',
        to: options.email,
        subject: options.subject,
        html: options.html,
      });
    }
    
    console.log(`Mock Email Sent to ${options.email} - Subject: ${options.subject}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
  }
};

module.exports = sendEmail;
