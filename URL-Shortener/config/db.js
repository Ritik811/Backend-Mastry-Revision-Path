import mongoose from "mongoose";

const databaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database Connected Successfully");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default databaseConnection;
