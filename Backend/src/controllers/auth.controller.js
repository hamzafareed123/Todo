import path from "path";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import fs from "fs";
import { generateFileUrl } from "../lib/urlGenerator.js";

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
        message: "SignUp Successfully",
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
      message: "Login Successfully",
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

export const Logout = async (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logout Successfully" });
};

export const checkAuth = async (req, res) => {


  const user = await User.findById(req.user.id).select("-password");
  const userObject = user.toObject();
  
  userObject.profilePic=generateFileUrl(user.profilePic,req);


  res.status(200).json({
    ...userObject
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const userId = req.user.id;
    const file = req.file;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email: email });

      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    if (file && user.profilePic) {
      const oldImage = path.join(process.cwd(), user.profilePic);

      if (fs.existsSync(oldImage)) {
        fs.unlinkSync(oldImage);
      }
    }

    if (fullName) {
      user.fullName = fullName;
    }

    if (email) {
      user.email = email;
    }

    if (file) {
      user.profilePic = `/uploads/profile-pics/${file.filename}`;
    }

    await user.save();

    const userObject = user.toObject();

    userObject.profilePic = generateFileUrl(user.profilePic, req);

    res
      .status(200)
      .json({ message: "Profile Updated Successfully", ...userObject });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.log("error is", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "No User Found" });
    }

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
