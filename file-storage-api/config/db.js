import mongoose from "mongoose";

export const connectionDB = async () => {
  try {
    const MONGO_URL = process.env.MONGO_URI;
    await mongoose.connect(MONGO_URL);
    console.log("Database is Connected Successfully");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
