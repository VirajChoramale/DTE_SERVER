import express from "express";
const router = express.Router();
import {
  personalDetailsData,
  fetchExperianceFormData,
  fetchEducationFormData,
  employeeExperiance,
} from "../controllers/DataStreamPipeline.mjs";
router.post("/personalDetailsData", personalDetailsData, (req, res) => {});
router.post(
  "/fetchEducationFormData",
  fetchEducationFormData,
  (req, res) => {}
);

router.post(
  "/fetchExperianceFormData",
  fetchExperianceFormData,
  (req, res) => {}
);
router.post("/employeeExperiance", employeeExperiance);

export default router;
