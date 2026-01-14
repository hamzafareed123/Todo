import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
    },

    profilePic:{
        type:String,
        default:""
    },

    provider:{
        type:String,
        enum:["local","google"],
        default:"local"
    },

    googleId:{
        type:String
    }
},{timestamps:true})


const User = mongoose.model("User",userSchema);

export default User;