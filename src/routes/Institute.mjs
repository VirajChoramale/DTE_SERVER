import express from 'express'
import { getDataCreateProfile,getEmployee } from '../controllers/Institute.mjs';
const router=express.Router();

router.post('/create_profile_data/:id',getDataCreateProfile,(req,res)=>{

})
router.post('/getEmployeesData/:id',getEmployee,(req,res)=>{

})


export default router;