// main index file.

import express from "express";
import userRouter from "./routes/userRoutes";
import connectDB from "./config/db";
const app=express();
app.use(express.json());

app.use("/user", userRouter);

//mongo initialisation and connection logic
connectDB();


app.listen(8000, ()=>{
    console.log("Server Listening on port 8000")
})