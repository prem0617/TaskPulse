import { Worker } from "bullmq";
import { connection } from "./redis";
import { sendEmail } from "./mailer";

const worker = new Worker(
  "sendReminder",
  async (job) => {
    const { email, task } = job.data;

    // Calculate and log when email is being sent in IST
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istTime = new Date(now.getTime() + istOffset);
    console.log(
      `📨 Sending email at IST time: ${istTime.toLocaleString("en-IN")}`
    );

    await sendEmail({ email, task });
    console.log(`Email sent to ${email} for task ${task.id || task._id}`);
  },
  { connection }
);

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
