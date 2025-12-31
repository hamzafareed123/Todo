import jwt from "jsonwebtoken";
import { ENV } from "./env.js";


export const generateToken = async (userId,res)=>{
    const token = jwt.sign({userId},ENV.JWT_SECRET,{expiresIn:"7d"});

    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        sameSite:"lax"
    });

    return token;
}


export const generateResetToken= (userId)=>{
    const resetToken = jwt.sign({userId},ENV.JWT_SECRET,{expiresIn:"1h"});
    return resetToken;
}
