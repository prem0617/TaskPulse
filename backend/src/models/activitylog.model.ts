import mongoose, { Schema, Document, model } from "mongoose";
import { IUser } from "./user.model";
import { IProject } from "./project.model";
import { ITask } from "./task.model";

export interface IActivityLog extends Document {
  userId: IUser["_id"]; // Who did the action
  projectId: IProject["_id"]; // Project related to the action
  taskId?: ITask["_id"]; // Optional: specific task involved
  action: string; // e.g., 'assigned task', 'status changed'
  extraInfo?: string; // e.g., task title, old status
  timestamp: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    taskId: { type: Schema.Types.ObjectId, ref: "Task" },
    action: { type: String, required: true },
    extraInfo: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ActivityLog ||
  model<IActivityLog>("ActivityLog", activityLogSchema);
