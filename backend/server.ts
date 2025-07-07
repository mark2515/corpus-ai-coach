import express from "express";
import cors from "cors";
import dotenv from 'dotenv'
import users from "./data/users";
import connectDB from "./config/db";

const app = express();
app.use(cors());
dotenv.config();

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World from TypeScript!");
});

app.get('/api/users', (req, res) => {
    res.json(users);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT} under ${process.env.NODE_ENV} mode`);
});
