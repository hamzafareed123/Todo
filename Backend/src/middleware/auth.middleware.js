import { ENV } from "../lib/env.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorize No Token Found" });
    }

    const decode = jwt.verify(token, ENV.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({ message: "Unauthorize Invalid token" });
    }

    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server Issue" });
  }
};

export default protectedRoute;
