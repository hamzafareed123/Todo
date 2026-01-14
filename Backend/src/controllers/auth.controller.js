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
import { outputHandler } from "../middleware/outputHandler.middleware.js";

export const Signup = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      throw new customError("All Fields are Requires", 400);
    }

    if (password.length < 4 || password.length > 15) {
      throw new customError("Password Length must be 4", 400);
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      throw new customError("Email Pattern Should be Valid", 400);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new customError("User Already Exist", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName: fullName,
      email: email,
      password: hashPassword,
    });

    generateToken(newUser._id, res);
    // res.status(201).json({
    //   message: "SignUp Successfully",
    //   id: newUser._id,
    //   fullName: newUser.fullName,
    //   email: newUser.email,
    //   profilePic: newUser.profilePic,
    // });

    sendMail({
      to: newUser.email,
      subject: "Welcome to Our Todo App,",
      text: generateEmailHTML(newUser.fullName),
      html: generateEmailHTML(newUser.fullName),
    });

    req.result = {
      message: "SignUp Successfully",
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    };
    return outputHandler(201, req, res, next);
  } catch (error) {
    req.error = error.message;
    return outputHandler(error.status || 500, req, res, next);
    // next(error);
  }
};

export const Signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new customError("Email and Password required", 400);
    }
    const user = await User.findOne({ email });

    if (!user) {
      throw new customError("Invalid Email or Password", 404);
    }

    const decode = bcrypt.compare(password, user.password);

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
    const { fullName, email } = req.body;
    const userId = req.user.id;
    const file = req.file;

    if (!fullName) {
      throw new customError("Name is Required", 400);
    }

    if (!email) {
      throw new customError("Email is Required", 400);
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      throw new customError("Email Pattern Should be Valid", 400);
    }

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
  console.log("email", req.body.email);
  const { email } = req.body;

  try {
    if (!email) {
      throw new customError("Email is required", 400);
    }
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
  const { id, token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      throw new customError("User not found", 404);
    }

    if (!newPassword || newPassword.length < 4) {
      throw new customError("Password length should be at least 4", 400);
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
    next(error);
  }
};
