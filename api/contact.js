const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  // ✅ CORS headers: allow all origins
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Respond to preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, service } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const hostEmailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.HOST_EMAIL,
    subject: "New Contact Form Submission",
    html: `
      <h2>New Contact Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> +${phone}</p>
      <p><strong>Service Type:</strong> ${service}</p>
    `,
  };

  const userEmailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Thank You for Contacting Us!",
    html: `
      <p><img src="${process.env.IMAGE_URL}" alt="logo" width="300"/></p>
      <h2>Thank You, ${name}!</h2>
      <p>We have received your request regarding <strong>${service}</strong>.</p>
      <p>Our team will contact you shortly at +${phone} or ${email}.</p>
      <p>— The Team</p>
    `,
  };

  try {
    await transporter.sendMail(hostEmailOptions);
    await transporter.sendMail(userEmailOptions);
    res.status(200).json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send emails" });
  }
};
