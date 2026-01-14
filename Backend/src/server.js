import express from "express";
import { ENV } from "./lib/env.js";
import dbConnect from "./lib/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import todoRouter from "./routes/todo.route.js";
import googleRouter from "./routes/googleAuth.route.js";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();
dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

app.use("/uploads", express.static("uploads"));
app.use("/api/google", googleRouter);

app.use("/api/auth", authRouter);
app.use("/api/todo", todoRouter);

app.use(errorMiddleware);

app.listen(ENV.PORT, () => {
  console.log(`Server is running on PORT ${ENV.PORT}`);
});
