import express from "express";
import { Logout, Signup } from "../controllers/auth.controller.js";
import { Signin } from "../controllers/auth.controller.js";
import { arjectProtect } from "../middleware/arject.middleware.js";

const router = express.Router();

router.use(arjectProtect)
router.post("/signup", Signup);
router.post("/signin", Signin);
router.post("/logout", Logout);

export default router;
