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
  getEmployees,
  getEmployeeData,
  updateLockUnlock,
  getContactDetails,
} from "../controllers/commonController.mjs";
import {
  deleteRemark,
  getAllEmployeesRemarks,
  getEmployeeAllRemarks,
  submitEmployeRemark,
  upadteRemark,
} from "../Services/Institute.mjs";

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

router.post("/getallemployees", getEmployees, (req, res) => {});

router.post("/getemployeeData/:id", getEmployeeData, (req, res) => {});

router.post("/updateLockUnlock/:id", updateLockUnlock, (req, res) => {});

router.post("/getContactDetails", getContactDetails, (req, res) => {});

router.post("/getallemployeeremarks", getAllEmployeesRemarks, (req, res) => {});

router.post(
  "/getEmployeeAllRemarks/:id",
  getEmployeeAllRemarks,
  (req, res) => {}
);

router.post("/submitRemark/:id", submitEmployeRemark, (req, res) => {});

router.post("/updateRemark/:id", upadteRemark, (req, res) => {});

router.post("/deleteRemark/:id", deleteRemark, (req, res) => {});

export default router;
