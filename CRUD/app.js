import express from "express";
import connectDB from "./config/db.js";
import {
  createItems,
  deleteItem,
  getItem,
  updateItem,
} from "./controllers/itemsControllers.js";

const app = express();

app.use(express.json());

connectDB();

const PORT = 5000;

app.post("/api/items", createItems);
app.get("/api/items", getItem);
app.patch("/api/items/:id", updateItem);
app.delete("/api/items/:id", deleteItem);

app.listen(PORT, () => {
  console.log(`Port is Listing ${PORT}`);
});
