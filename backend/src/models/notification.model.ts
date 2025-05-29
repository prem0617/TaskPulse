import mongoose, { Schema, Document, model } from "mongoose";
import { IUser } from "./user.model";

export interface INotification extends Document {
  userId: IUser["_id"];
  type: "reminder" | "task-update";
  content?: string;
  isRead: boolean;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["reminder", "task-update"],
      required: true,
    },
    content: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  model<INotification>("Notification", notificationSchema);
