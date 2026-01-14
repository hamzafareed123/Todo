import express from "express"
import { googleLogin,googleCallback } from "../controllers/googleAuth.controller.js";


const router = express.Router();

router.get("/",googleLogin);
router.get("/callback",googleCallback);

export default router; 