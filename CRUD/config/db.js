import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb://localhost:27017/interviewDB",
    );
    console.log("Database connected");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default connectDB;
