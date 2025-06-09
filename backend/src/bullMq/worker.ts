import { Worker } from "bullmq";
import { connection } from "./redis";
import { sendEmail } from "./mailer";

const worker = new Worker(
  "sendReminder",
  async (job) => {
    const { email, task } = job.data;

    await sendEmail({ email, task });
    console.log(`Email sent to ${email} for task ${task.id || task._id}`);
  },
  { connection }
);

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
