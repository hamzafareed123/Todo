import path from "path";
import { generateResetToken, generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import fs from "fs";
import { generateFileUrl } from "../lib/urlGenerator.js";
import { sendMail } from "../email/emailHandler.js";
import { generateEmailHTML } from "../email/emailTemplate.js";
import { ENV } from "../lib/env.js";
import jwt from "jsonwebtoken"

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

    sendMail({
      to: newUser.email,
      subject: "Welcome to Our Todo App,",
      text: `Hello ${newUser.fullName},\n\nThank you for signing up for our Todo App! We're excited to have you on board.\n\nBest Regards,\nTodo App Team`,
      html: generateEmailHTML(newUser.fullName),
    });
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

  userObject.profilePic = generateFileUrl(user.profilePic, req);

  res.status(200).json({
    ...userObject,
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const userId = req.user.id;
    const file = req.file;

    if (!fullName) {
      return res.status(400).json({ message: "Name is Required" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is Required" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email Pattern Should be Valid" });
    }

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

    user.fullName = fullName ?? user.fullName;

    user.email = email ?? user.email;

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

export const forgotPassword = async (req, res) => {
 
  console.log("email",req.body.email)
   const { email } = req.body;


  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = generateResetToken(user._id);

    const resetLink = `${ENV.CLIENT_URL}/reset-password?id=${user._id}&token=${resetToken}`;

     sendMail({
      to: user.email,
      subject: "password Reset Request",
      text: `Hello ${user.fullName},\n\nYou requested for a password reset. Please use the following link to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n\nBest Regards,\nTodo App Team`,
      html: `<p>Hello ${user.fullName},</p>
      <p>You requested for a password reset. Please use the following link to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>`,
    });

    res
      .status(200)
      .json({ message: "Password reset link has been send to your email" });
  } catch (error) {
    console.log("error in forgot password", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const decoded=jwt.verify(token,ENV.JWT_SECRET);
    if(decoded.userId!==user._id.toString()){
      return res.status(400).json({message:"Invalid or Expired Token"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashPassword;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log("error in reset password", error);
    res.status(500).json({ message: "Server Error" });
  }
};
