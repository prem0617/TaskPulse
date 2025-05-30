import mongoose, { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  profilePic?: string;
  role: "admin" | "member";
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profilePic: { type: String },
    role: { type: String, enum: ["admin", "member"], default: "member" },
  },
  { timestamps: true }
);

userSchema.virtual("id").get(function (this: IUser) {
  return this._id.toHexString();
});

// ✅ Include virtuals when converting document to JSON
userSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.models.User || model<IUser>("User", userSchema);
