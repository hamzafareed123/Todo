import express from "express";
import {
  Logout,
  Signup,
  Signin,
  checkAuth,
  updateProfile,
  getUserProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { arjectProtect } from "../middleware/arject.middleware.js";
import protectedRoute from "../middleware/auth.middleware.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.use(arjectProtect);
router.post("/signup", Signup);
router.post("/signin", Signin);
router.post("/logout", Logout);

router.get("/check", protectedRoute, checkAuth);
router.put(
  "/update-profile",
  protectedRoute,
  upload.single("profilePic"),
  updateProfile
);
router.get("/userProfile", protectedRoute, getUserProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);

export default router;
