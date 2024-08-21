import express from "express";
const router = express.Router();
import {
  createEmployee,
  createPersonalDetails,
  createMaritialStatus,
  createeducationalDetails,
  createExperianceDetails,
  createOtherDetails,
  getDataCreateProfile,
  getEmployee,
  getInstituteVaccancy,
  getEmployeeList,
  insertEmployee,
  getPostCountEmp,
  createSpacialPromotion,
  createEmployeeCertificates,
  confirmPost,
  submitEmployeeForms,
  RaiseQuery,
  getEmployeeDetails,
} from "../controllers/commonController.mjs";

router.post("/create_profile_data", getDataCreateProfile, (req, res) => {});
router.post("/getEmployeesData/", getEmployee, (req, res) => {});
router.post("/get_vaccancy", getInstituteVaccancy, (req, res) => {});
router.post("/getEmployeeList", getEmployeeList, (req, res) => {});
router.post("/insertEmployee", insertEmployee, (req, res) => {});
router.post("/getPostCountEmp/:id", getPostCountEmp, (req, res) => {});
router.post("/confirmPost", confirmPost, (req, res) => {});

/* */
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
router.post(
  "/createSpacialPromotion",
  createSpacialPromotion,
  (req, res) => {}
);
router.post(
  "/createEmployeeCertificates",
  createEmployeeCertificates,
  (req, res) => {}
);
router.post("/submitEmployeeForms", submitEmployeeForms, (req, res) => {});

router.post("/RaiseQuery", RaiseQuery, (req, res) => {});

router.get("/getemployeeStatus", getEmployeeDetails, (req, res) => {});

export default router;
