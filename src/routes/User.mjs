import express from "express";
import { verifyToken } from "../middleware/Auth.mjs";
import { login, verify_otp,resetPassword } from "../controllers/Login.mjs";
const router = express.Router();

router.post("/login", login, async (req, res) => {});
router.post("/resetPassword", resetPassword, async (req, res) => {});

router.post("/verify_otp", verifyToken, verify_otp, async (req, res) => { });

export default router;
