import express from 'express'
import { getDataCreateProfile } from '../controllers/Institute.mjs';
const router=express.Router();

router.post('/create_profile_data/:id',getDataCreateProfile,(req,res)=>{

})

export default router;