import nodemailer from "nodemailer";

import "dotenv/config";

export const sendEmail = async (data: any) => {
  const { email, task } = data;
  try {
    console.log(task);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your gmail email
        pass: process.env.GMAIL_PASS, // your gmail app password
      },
    });

    const mailOptions = {
      from: `"" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Task Due Date Reminder",
      text: `Reminder: Your task "${task.title}" is due at ${new Date(
        task.dueDate
      ).toLocaleString("en-IN")}.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
