// express.Router routing 

import express from "express";
import redis from "../config/redis";
import mongoose, { Mongoose } from "mongoose";
import User from "../database/userSchema";
const userRouter=express.Router();

userRouter.get("/:id", async(req,res)=> {
// check if this is valid mongo Object Id
const {id} = req.params;
if (!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({
        "message": "Invalid User Id!"
    })
}
// redis key 
  const key = `user:${id}`;
try {
    // check cache data
    const cachedData = await redis.get(key);
    if (cachedData){
        console.log("CACHE HIT");
        return res.json(JSON.parse(cachedData));
    }
    console.log("CACHE MISS!");
    // SIMULATE A REAL DB Call
    const user = await User.findById(id);
    res.status(200).json(user);
} catch (err){
res.status(500).json({
    "message": "Server Error"
})
}


});

export default userRouter;