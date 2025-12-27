import express from "express";
import { ENV } from "./lib/env.js";
import dbConnect from "./lib/db.js";
import authRouter from "./routes/auth.route.js";
import cookiePraser from "cookie-parser"
import todoRouter from "./routes/todo.route.js"

const app = express();
dbConnect();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cookiePraser());

app.use('/uploads', express.static('uploads'));
app.use("/api/auth", authRouter);
app.use("/api/todo",todoRouter);



app.listen(ENV.PORT, () => {
  console.log(`Server is running on PORT ${ENV.PORT}`);
});
