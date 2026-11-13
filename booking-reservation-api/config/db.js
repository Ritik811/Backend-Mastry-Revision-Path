import mongoose from "mongoose";

const connectionDB = async () => {
  try {
    const MONGO_URL = process.env.MONGO_URL;
    await mongoose.connect(MONGO_URL);
    console.log("Database connected successfully");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default connectionDB;
