import express from "express";
import {
  getOffices,
  getPost,
  updateVaccancy,
  getDesignations,
} from "../controllers/Desk.mjs";
const router = express.Router();

router.post("/getOffices", getOffices, (req, res) => {});
router.post("/getInstPosts/:id", getPost, (req, res) => {});
router.post("/updateVaccancy", updateVaccancy, (req, res) => {});
router.post("/getDesignations", getDesignations, (req, res) => {});

export default router;
