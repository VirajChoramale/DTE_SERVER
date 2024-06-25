import express from "express";
import { verifyToken } from "../middleware/Auth.mjs";
import { login, verify_otp } from "../controllers/Login.mjs";
const router=express.Router();

router.post('/login', login,async(req,res)=>{
    
})
router.post("/verify_otp",verifyToken,verify_otp,async(req,res)=>{
   
})

export default router;

