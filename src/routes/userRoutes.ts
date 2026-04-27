// express.Router routing 

import express from "express";
import redis from "../config/redis";
import mongoose from "mongoose";
import User from "../database/userSchema";
import bcrypt from "bcrypt";
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
    if (!user) {
  return res.status(404).json({ message: "User not found" });
}
    // WRITE TO CACHE after DB hit
    await redis.set(key, JSON.stringify(user), "EX", 1200); // EX expiry time expire after 1200 seconds Short TTL => reliable cache hit.  Strong TTL hot data.
    res.status(200).json(user);
} catch (err){
res.status(500).json({
    "message": "Server Error"
})
}

});

userRouter.put("/:id", async(req,res)=> {
    const {id} = req.params;
// cache invalidation.
const updatedData = req.body;

if (!mongoose.Types.ObjectId.isValid(id)){
    res.status(400).json({
        message : "Invalid ID of the user!"
    })
}

const key= `user:${id}`
try {
    const updatedUser = await User.findByIdAndUpdate(id, 
        updatedData,
        {new : true}
    );
     if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // invalidate the cache
    await redis.del(key);
    console.log("Cache invalidated for", key);
    return res.status(200).json(updatedUser);


} catch (err){
     return res.status(500).json({
      message: "Server Error",
    });
}

});

userRouter.post("/", async(req,res) => {
    const {firstName, lastName, email, password, age} = req.body;
    if (!firstName || !lastName || !email || !password || !age){
        return res.status(400).json({
            message : "Please fill all details First and Last Name and Email and Password and age"
        })
    }
    try {
        // existing user?
        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(400).json({
                message: "User already exists"
            })
        }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = await User.create ({
                firstName,
                lastName,
                email,
                password :hashedPassword,
                age,
            })
            // remove password from response
            const userResponse = newUser.toObject();
            delete userResponse.password;
            return res.status(201).json(userResponse);

    } catch (err){
        return res.status(500).json({
            message: "Error while creating a user!"
        })
    }
})

export default userRouter;