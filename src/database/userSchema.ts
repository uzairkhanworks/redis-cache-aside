// user data model
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    age: Number,
    
})

const User = mongoose.model('User', userSchema);
export default User;