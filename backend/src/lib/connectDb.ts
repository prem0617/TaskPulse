import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MONGODB CONNECTED");
  } catch (error) {
    console.log(error);
    console.log("MONGO DB CONNECTION FAILED");
  }
}

export default connectDB;
