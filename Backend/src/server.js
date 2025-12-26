import express from "express";
import { ENV } from "./lib/env.js";
import dbConnect from "./lib/db.js";
import authRouter from "./routes/auth.route.js";
import cookiePraser from "cookie-parser"

const app = express();
dbConnect();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cookiePraser());

app.use("/api/auth", authRouter);

app.listen(ENV.PORT, () => {
  console.log(`Server is running on PORT ${ENV.PORT}`);
});
