import express from "express";
import userRouter from "./routes/users.js";

const app = express();
const port = 3000;

// API Middlewares

app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
