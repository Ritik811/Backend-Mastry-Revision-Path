import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import databaseConnection from "./config/db.js";

configDotenv();
databaseConnection();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is listen PROT : ", PORT);
});
