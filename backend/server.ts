import express from "express";
import cors from "cors";
import dotenv from 'dotenv'
import connectDB from "./config/db";
import usersRoutes from "./routers/usersRouters";
import wordListsRoutes from "./routers/wordListsRouters";
import { notFound, errorHandler } from './middleware/errorMiddleware'

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
connectDB();

app.use((req, res, next) => {
    console.log(req.originalUrl)
    next()
})

app.get("/", (req, res) => {
  res.send("Hello World from TypeScript!");
});

app.use('/api/users', usersRoutes);

app.use('/api/wordLists', wordListsRoutes);

app.use(notFound)
app.use(errorHandler)

// run the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT} under ${process.env.NODE_ENV} mode`);
});
