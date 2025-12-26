import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

export const Signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All Fields are Requires" });
    }

    if (password.length < 4) {
      return res.status(400).json({ message: "Password length should be 4" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email Pattern Should be Valid" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User Already Exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName: fullName,
      email: email,
      password: hashPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      res.status(201).json({
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    }
  } catch (error) {
    console.log("error in creating User", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const Signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid Email or Password" });
    }

    const decode = await bcrypt.compare(password, user.password);

    if (!decode) {
      return res.status(400).json({ message: "Password does not match" });
    }

    generateToken(user._id, res);
    res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("error ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const Logout = async (_,res)=>{
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"Logout Successfully"});
}
