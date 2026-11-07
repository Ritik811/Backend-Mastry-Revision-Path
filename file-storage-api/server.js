import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import { connectionDB } from "./config/db.js";
import fileRouters from "./routers/file.js";

configDotenv();
connectionDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/files", fileRouters);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is Running PORT : ${PORT}`);
});
