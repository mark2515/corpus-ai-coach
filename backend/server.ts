import express from "express";
import cors from "cors";
import dotenv from 'dotenv'
import connectDB from "./config/db";
import usersRoute from "./routers/usersRouter";
import messagesRoute from "./routers/messagesRouter";
import assistantsRoute from "./routers/assistantsRouter";
import sessionsRoute from "./routers/sessionsRouter";
import { notFound, errorHandler } from './middleware/errorMiddleware'

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(req.originalUrl)
    next()
})

app.get("/", (req, res) => {
  res.send("The server is running");
});

app.use('/api/users', usersRoute);

app.use('/api/messages', messagesRoute);

app.use('/api/assistants', assistantsRoute);

app.use('/api/sessions', sessionsRoute);

app.use(notFound)
app.use(errorHandler)

// run the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT} under ${process.env.NODE_ENV} mode`);
});
