import mongoose, { Schema, Document, model } from "mongoose";
import { IUser } from "./user.model";
import { IProject } from "./project.model";

export interface IAttachment {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url?: string;
}

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "To Do" | "In Progress" | "Done";
  dueDate?: Date;
  assignedTo?: IUser["_id"];
  projectId: IProject["_id"];

  priority: "low" | "medium" | "high";
  labels: string[]; // e.g., ['bug', 'frontend', 'urgent']

  attachments: IAttachment[];
}

const attachmentSchema = new Schema<IAttachment>({
  filename: { type: String, required: true },
  originalname: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String },
});

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    dueDate: { type: Date },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    labels: {
      type: [String],
      default: [],
    },

    attachments: {
      type: [attachmentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Task || model<ITask>("Task", taskSchema);
