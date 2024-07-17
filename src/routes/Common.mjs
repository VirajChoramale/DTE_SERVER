import express from "express";
const router = express.Router();
import { createEmployee,createPersonalDetails  } from "../controllers/commonController.mjs";
router.post("/createEmployee", createEmployee, (req, res) => { });
router.post("/createPersonalDetails", createPersonalDetails, (req, res) => {});




export default router;
