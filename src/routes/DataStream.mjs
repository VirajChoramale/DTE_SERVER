import express from "express";
const router = express.Router();
import {
  personalDetailsData,
  fetchExperianceFormData,
  employeeExperiance
} from "../controllers/DataStreamPipeline.mjs";
router.post("/personalDetailsData", personalDetailsData, (req, res) => {});

router.post(
  "/fetchExperianceFormData",
  fetchExperianceFormData,
  (req, res) => {}
);
router.post("/employeeExperiance", employeeExperiance);

export default router;
