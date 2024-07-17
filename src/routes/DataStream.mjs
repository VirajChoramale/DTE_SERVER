import express from "express";
const router = express.Router();
import { personalDetailsData} from '../controllers/DataStreamPipeline.mjs'
router.post("/personalDetailsData", personalDetailsData, (req, res) => { });



export default router;
