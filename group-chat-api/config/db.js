import mongoose from "mongoose";

const connectionDB = async () => {
  try {
    const MONGO_URL = process.env.MONGO_URL;
    await mongoose.connect(MONGO_URL);
    console.log("Database is Connected Successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectionDB;
