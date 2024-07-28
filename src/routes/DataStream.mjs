import express from "express";
const router = express.Router();
import {
  personalDetailsData,
  fetchExperianceFormData,
  fetchEducationFormData,
  employeeExperiance,
  fetchEmployeeCertificate,
  getEmployeePersonalDetails,
  getMaritialDetails,
  getEmployeeEducation,
  getOtherDestils,
  fetchMaritalStatusFormData,
  getEmployeeSpacialPromotion,
  getEmployeeFormStatus
} from "../controllers/DataStreamPipeline.mjs";
router.post("/personalDetailsData", personalDetailsData, (req, res) => {});
router.post(
  "/fetchEducationFormData",
  fetchEducationFormData,
  (req, res) => {}
);
router.post(
  "/fetchMaritalStatusFormData",
  fetchMaritalStatusFormData,
  (req, res) => {}
);


router.post(
  "/fetchExperianceFormData",
  fetchExperianceFormData,
  (req, res) => {}
);
router.post("/getEmployeePersonalDetails", getEmployeePersonalDetails);
router.post("/getMaritialDetails", getMaritialDetails);
router.post("/employeeExperiance", employeeExperiance);
router.post("/getEmployeeEducation", getEmployeeEducation);
router.post("/fetchEmployeeCertificate", fetchEmployeeCertificate);
router.post("/getOtherDestils", getOtherDestils);
router.post("/getEmployeeSpacialPromotion", getEmployeeSpacialPromotion);
router.post("/getEmployeeFormStatus", getEmployeeFormStatus);


export default router;
