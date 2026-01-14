import nodemailer from "nodemailer";
import { ENV } from "../lib/env.js";

const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  secure: false,
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
});

export async function sendMail({  to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: ENV.SMTP_USER,
      to,
      subject,
      text,
      html,
    });

    console.log("Email send Successfully:", info.messageId);
    return info;
  } catch (error) {
   next(error)
  }
}
