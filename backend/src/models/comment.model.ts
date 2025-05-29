import mongoose, { Schema, Document, model } from "mongoose";
import { IUser } from "./user.model";
import { ITask } from "./task.model";

export interface IComment extends Document {
  taskId: ITask["_id"];
  userId: IUser["_id"];
  content: string;
}

const commentSchema = new Schema<IComment>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Comment ||
  model<IComment>("Comment", commentSchema);
