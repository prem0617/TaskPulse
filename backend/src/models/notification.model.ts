import mongoose, { Schema, Document, model } from "mongoose";
import { IUser } from "./user.model";
import { IProject } from "./project.model";

export interface INotification extends Document {
  userId: IUser["_id"]; // The recipient
  sender: IUser["_id"]; // The sender or initiator of the action
  projectId: IProject["_id"]; // The sender or initiator of the action
  type: "project-invite" | "task-assigned";
  content?: string;
  isRead: boolean;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Recipient
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Initiator
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },

    type: {
      type: String,
      enum: ["project-invite", "task-assigned"],
      required: true,
    },

    content: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  model<INotification>("Notification", notificationSchema);
