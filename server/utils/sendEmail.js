const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (toEmail, token) => {
  const verifyURL = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"Deep Focus" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '✅ Verify your Deep Focus account',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #1e40af;">Welcome to Deep Focus 🎯</h2>
        <p>Apna account verify karne ke liye neeche button click karo:</p>
        <a href="${verifyURL}" 
           style="display:inline-block; margin-top:16px; padding: 12px 24px; background:#2563eb; color:white; border-radius:8px; text-decoration:none; font-weight:bold;">
          Verify Email
        </a>
        <p style="margin-top:24px; color:#6b7280; font-size:13px;">
          Agar tumne register nahi kiya, is email ko ignore karo.<br/>
          Link 24 ghante mein expire ho jayega.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };