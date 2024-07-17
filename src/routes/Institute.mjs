import express from "express";
import {
  getDataCreateProfile,
  getEmployee,
  getInstituteVaccancy,
  getEmployeeList,
  insertEmployee,
  getPostCountEmp,
} from "../controllers/Institute.mjs";
const router = express.Router();

router.post("/create_profile_data/:id", getDataCreateProfile, (req, res) => {});
router.post("/getEmployeesData/:id", getEmployee, (req, res) => {});
router.post("/get_vaccancy/:id", getInstituteVaccancy, (req, res) => {});
router.post("/getEmployeeList/:id", getEmployeeList, (req, res) => {});
router.post("/insertEmployee", insertEmployee, (req, res) => {});
router.post("/getPostCountEmp/:id", getPostCountEmp, (req, res) => {});

export default router;
