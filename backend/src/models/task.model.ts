import mongoose, { Schema, Document, model } from "mongoose";
import { IUser } from "./user.model";
import { IProject } from "./project.model";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "To Do" | "In Progress" | "Done";
  dueDate?: Date;
  assignedTo?: IUser["_id"];
  projectId: IProject["_id"];
}

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
  },
  { timestamps: true }
);

export default mongoose.models.Task || model<ITask>("Task", taskSchema);
