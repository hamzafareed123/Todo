import mongoose from "mongoose"
import { ENV } from "./env.js"

const dbConnect=async()=>{
    try {
        await mongoose.connect(ENV.MONGO_URL);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Error in Connecting Database ",error)
    }
}

export default dbConnect;