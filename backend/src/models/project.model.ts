import mongoose, { Schema, Document, model } from "mongoose";
import { IUser } from "./user.model";

export interface IProject extends Document {
  title: string;
  description?: string;
  createdBy: IUser["_id"];
  members?: IUser["_id"][];
  pendingMembers?: IUser["_id"][]; // new field
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    pendingMembers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  model<IProject>("Project", projectSchema);
