import { ENV } from "../lib/env.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { customError } from "../lib/customError.js";

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw new customError("Unauthorized - No Token Found", 401);
    }

    const decode = jwt.verify(token, ENV.JWT_SECRET);

    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      throw new customError("No user Found", 404);
    }

    req.user = user;
    next();
  } catch (error) {

    if(error.name === "JsonWebTokenError"){
      return next(new customError("Unauthorized - Invalid token", 401));
    }
    if(error.name === "TokenExpiredError"){
      return next(new customError("Unauthorized - Invalid token",401));
    }
    next(error);
  }
};

export default protectedRoute;
