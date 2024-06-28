import express from 'express'
import { getDataCreateProfile,getEmployee,getInstituteVaccancy } from '../controllers/Institute.mjs';
const router=express.Router();

router.post('/create_profile_data/:id',getDataCreateProfile,(req,res)=>{

})
router.post('/getEmployeesData/:id',getEmployee,(req,res)=>{

})
router.post('/get_vaccancy/:id',getInstituteVaccancy,(req,res)=>{

})


export default router;