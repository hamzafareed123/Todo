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
  getAllUsers
} from "../controllers/auth.controller.js";
import { arjectProtect } from "../middleware/arject.middleware.js";
import protectedRoute from "../middleware/auth.middleware.js";
import upload from "../lib/multer.js";
import { validate } from "../middleware/validationMiddleware.js";
import {
  signupSchema,
  signinSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/userValidator.js";

const router = express.Router();

// router.use(arjectProtect);
router.post("/signup", validate(signupSchema), Signup);
router.post("/signin", validate(signinSchema), Signin);
router.post("/logout", Logout);

router.get("/check", protectedRoute, checkAuth);
router.put(
  "/update-profile",
  protectedRoute,
  upload.single("profilePic"),
  validate(updateProfileSchema),
  updateProfile
);
router.get("/userProfile", protectedRoute, getUserProfile);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post(
  "/reset-password/:id/:token",
  validate(resetPasswordSchema),
  resetPassword
);

router.get("/getAllUsers",protectedRoute,getAllUsers);


export default router;
