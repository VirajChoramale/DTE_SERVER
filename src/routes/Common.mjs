import express from "express";
const router = express.Router();
import {
  createEmployee,
  createPersonalDetails,
  createMaritialStatus,
  createeducationalDetails,
  createExperianceDetails,
  createOtherDetails,
} from "../controllers/commonController.mjs";
router.post("/createEmployee", createEmployee, (req, res) => {});
router.post("/createPersonalDetails", createPersonalDetails, (req, res) => {});
router.post("/createMaritialStatus", createMaritialStatus, (req, res) => {});
router.post(
  "/createeducationalDetails",
  createeducationalDetails,
  (req, res) => {}
);
router.post("/createExperiance", createExperianceDetails, (req, res) => {});
router.post("/createOtherDetails", createOtherDetails, (req, res) => {});

export default router;
