import type {Transporter} from "nodemailer";

import nodemailer from "nodemailer";

const handleSendEmail = async (emailTo: string, subject: string, html: string) => {
  if (!emailTo) return;

  const transporter: Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    await transporter.verify();
  } catch (error) {
    console.error(error);

    return;
  }

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: emailTo,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
};

export default handleSendEmail;
