import mongoose, { Schema, Document, model } from "mongoose";
import { IUser } from "./user.model";
import { ITask } from "./task.model";

export interface IActivityLog extends Document {
  taskId: ITask["_id"];
  userId: IUser["_id"];
  action: "created" | "updated" | "moved" | "commented";
  details?: string;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: ["created", "updated", "moved", "commented"],
      required: true,
    },
    details: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.models.ActivityLog ||
  model<IActivityLog>("ActivityLog", activityLogSchema);
