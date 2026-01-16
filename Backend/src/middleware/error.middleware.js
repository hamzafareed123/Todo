import { customError } from "../lib/customError.js";

export const errorMiddleware = (err, req, res, next) => {
  if (err instanceof customError) {
    return res.status(err.status).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  const status = err.status || 500;
  const message = err.message || "Server Error";

  return res.status(status).json({
    success: false,
    status: status,
    message: message,
  });
};


