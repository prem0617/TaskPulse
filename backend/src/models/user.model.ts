import mongoose, { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  name: string;
  email: string;
  passwordHash: string;
  profilePic?: string;
  role: "admin" | "member";
  rooms: string[];
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profilePic: { type: String },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    rooms: [{ type: String }],
  },
  { timestamps: true }
);

userSchema.virtual("id").get(function (this: IUser) {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.models.User || model<IUser>("User", userSchema);
