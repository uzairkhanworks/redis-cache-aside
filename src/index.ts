// main index file.
import dotenv from "dotenv";
import express from "express";
import userRouter from "./routes/userRoutes";
import connectDB from "./config/db";
const app=express();
app.use(express.json());
dotenv.config();

app.use("/user", userRouter);

//mongo initialisation and connection logic
connectDB();


app.listen(8000, ()=>{
    console.log("Server Listening on port 8000")
})