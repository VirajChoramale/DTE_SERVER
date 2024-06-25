import { executeReadQuery } from "../db/db_operation.mjs";

const getDataCreateProfile=async(req,res)=>{
   const typ=req.params.type;
  
   let data=null;
   let query='';
      if(typ==1){
        query="SELECT id,designation_type,designation_name_marathi,designation_name FROM designation_master where class='A' and designation_type in (1,2) order by priority ;"
        data=await executeReadQuery(query);
       
       
      } else if(typ==2){
        query="SELECT * FROM designation_master where designation_type=2 and class in ('C','D') order by class;"
        data=await executeReadQuery(query);
       
      } else{
        return res.json("Invalid type ")
      }
     const cours_query="select * from course_group; "
     const courses=await executeReadQuery(cours_query);
    return res.send({
        "designations":data,
        "courses":courses
        
    })
        
             
            
           
       
    

}
export{
    getDataCreateProfile
}