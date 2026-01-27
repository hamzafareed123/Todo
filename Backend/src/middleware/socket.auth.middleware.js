import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import User from "../models/User.js";
import { customError } from "../lib/customError.js";

export const socketMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    

    if (!token) {
      return next(new customError("Unauthorized! No token found", 401));
    }

    const decode = jwt.verify(token, ENV.JWT_SECRET);

    if (!decode) {
      return next(new customError("Unauthorized! Invalid Token", 403));
    }

    

    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return next(new customError("User not found", 404));
    }
    socket.user = user;
    socket.userId = user._id;

    next();
  } catch (error) {
    next(error);
  }
};
