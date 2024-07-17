import express from "express";
const router = express.Router();
import { createEmployee  } from "../controllers/commonController.mjs";
router.post("/createEmployee", createEmployee, (req, res) => {});



export default router;
