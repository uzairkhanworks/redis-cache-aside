import mongoose from "mongoose";

const connectDB = async() =>{
    try{
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    } catch(err){
        console.log("Error Occured while connecting to DB", err);
        process.exit(1);
    }
}
export default connectDB;