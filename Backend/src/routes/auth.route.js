import express from "express";
import { Logout, Signup ,Signin,checkAuth} from "../controllers/auth.controller.js";
import { arjectProtect } from "../middleware/arject.middleware.js";
import protectedRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(arjectProtect)
router.post("/signup", Signup);
router.post("/signin", Signin);
router.post("/logout", Logout);

router.get("/check",protectedRoute,checkAuth)

export default router;
