import { emailQueue } from "./emailQueue";

interface ReminderData {
  task: any;
  email: string;
  dueDate: string | Date;
}

export async function scheduleEmailReminder({
  task,
  email,
  dueDate,
}: ReminderData) {
  const reminderTime = new Date(dueDate).getTime() - 30 * 60 * 1000;
  const delay = reminderTime - Date.now();

  if (delay > 0) {
    await emailQueue.add(
      "sendReminder",
      { task, email },
      {
        delay,
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: false,
        jobId: `reminder-${task._id}`,
      }
    );
    console.log("Reminder scheduled!");
  } else {
    console.log("Due date is too close or past. Skipping reminder.");
  }
}
