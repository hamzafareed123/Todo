import path from "path";
import { generateResetToken, generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import fs from "fs";
import { generateFileUrl } from "../lib/urlGenerator.js";
import { sendMail } from "../email/emailHandler.js";
import { generateEmailHTML } from "../email/emailTemplate.js";
import { ENV } from "../lib/env.js";
import jwt from "jsonwebtoken";
import { resetEmailTemplate } from "../email/resetEmailTemplate.js";
import { customError } from "../lib/customError.js";

export const Signup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.validatedData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new customError("User Already Exist", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashPassword,
    });

    generateToken(newUser._id, res);
    res.status(201).json({
      message: "SignUp Successfully",
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });

    sendMail({
      to: newUser.email,
      subject: "Welcome to Our Todo App",
      html: generateEmailHTML(newUser.fullName),
    }).catch((err) => console.log("Email error:", err));
  } catch (error) {
    next(error);
  }
};

export const Signin = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData;

    const user = await User.findOne({ email });

    if (!user) {
      throw new customError("Invalid Email or Password", 400);
    }

    const decode = await bcrypt.compare(password, user.password);

    if (!decode) {
      throw new customError("Password does not match", 400);
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
    next(error);
  }
};

export const Logout = async (_, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    next(error);
  }
};

export const checkAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const userObject = user.toObject();

    userObject.profilePic = generateFileUrl(user.profilePic, req);

    res.status(200).json({
      ...userObject,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, email } = req.validatedData;
    const userId = req.user.id;
    const file = req.file;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new customError("User Not Found", 404);
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email: email });

      if (emailExists) {
        throw new customError("Email already in use", 400);
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
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new customError("No User Found", 404);
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.validatedData;

    const user = await User.findOne({ email });
    if (!user) {
      throw new customError("User not found", 404);
    }

    const resetToken = generateResetToken(user._id);

    const resetLink = `${ENV.CLIENT_URL}/reset-password?id=${user._id}&token=${resetToken}`;

    sendMail({
      to: user.email,
      subject: "password Reset Request",
      text: `Hello ${user.fullName},\n\nYou requested for a password reset. Please use the following link to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n\nBest Regards,\nTodo App Team`,
      html: resetEmailTemplate(user.fullName, resetLink),
    });

    res
      .status(200)
      .json({ message: "Password reset link has been send to your email" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { id, token } = req.params;
    const { newPassword } = req.validatedData;
    const user = await User.findById(id);
    if (!user) {
      throw new customError("User not found", 404);
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (decoded.userId.toString() !== user._id.toString()) {
      throw new customError("Invalid or Expired Token", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashPassword;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new customError("Reset Link Expired", 401));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new customError("Invalid Reset Link", 401));
    }
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const Users = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    if (!Users) {
      throw new customError("All User not Found", 404);
    }

    const allUsers= Users.map((user)=>{
      const userObject = user.toObject();
      userObject.profilePic=generateFileUrl(userObject.profilePic,req);
      return userObject;
    })

    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};
