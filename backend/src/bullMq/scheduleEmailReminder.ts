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
  const reminderTime = new Date(dueDate).getTime() - 30 * 60 * 1000; // 30 mins before
  const delay = reminderTime - Date.now();

  const extraTime = new Date(new Date().getTime() + delay);

  console.log({
    task,
    email,
    dueDate,
    delay,
    extraTime,
  });
  console.log(
    "Reminder scheduled at:",
    new Date(Date.now() + delay).toLocaleString("en-IN")
  );

  if (delay > 0) {
    console.log("Scheduling email reminder...");
    await emailQueue.add(
      "sendReminder",
      { task, email },
      {
        delay,
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    console.log("Reminder scheduled!");
  } else {
    console.log("Due date is too close or past. Skipping reminder.");
  }
}
