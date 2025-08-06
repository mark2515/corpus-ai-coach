import express from "express";
import cors from "cors";
import dotenv from 'dotenv'
import connectDB from "./config/db";
import usersRoute from "./routers/usersRouter";
import wordListsRoute from "./routers/wordListsRouter";
import messagesRoute from "./routers/messagesRouter";
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
  res.send("The server is running");
});

app.use('/api/users', usersRoute);

app.use('/api/wordLists', wordListsRoute);

app.use('/api/messages', messagesRoute);

app.use(notFound)
app.use(errorHandler)

// run the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT} under ${process.env.NODE_ENV} mode`);
});
