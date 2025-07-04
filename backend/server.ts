import express from "express";
import cors from "cors";
import users from "./data/users";

const app = express();
app.use(cors());
const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World from TypeScript!");
});

app.get('/api/users', (req, res) => {
    res.json(users);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
