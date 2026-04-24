// main index file.

import express from "express";
import userRouter from "./routes/userRoutes";
const app=express();
app.use(express.json());

app.use("/user", userRouter);