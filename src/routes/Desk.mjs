import express from "express";
import { getOffices, getPost } from "../controllers/Desk.mjs";
const router = express.Router();

router.post("/getOffices", getOffices, (req, res) => {});
router.post("/getInstPosts/:id", getPost, (req, res) => {});

export default router;
