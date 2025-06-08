import { Queue } from "bullmq";
import { connection } from "../bullMq/redis";

export const emailQueue = new Queue("sendReminder", { connection });
