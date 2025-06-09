import mongoose, { Schema, Document, model } from "mongoose";
import { IUser } from "./user.model";
import { IProject } from "./project.model";

export interface IChatMessage extends Document {
  sender: IUser["_id"];
  projectId: IProject["_id"];
  message: string;
  timestamp: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export default mongoose.models.ChatMessage ||
  model<IChatMessage>("ChatMessage", chatMessageSchema);
