import { executeReadQuery } from "../db/db_operation.mjs";

const getDataCreateProfile=async(req,res)=>{
   const inst_id=req.params.id;
  const typ=req.query.type
  console.log(typ)
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
     const post_query=`SELECT ivd.id,ivd.shift,dm.designation_name,dm.designation_name_marathi,crs.coursename,crs.course_marathi_name,ivd.filled_post,ivd.sensction_post as senction_post,ivd.vaccent_post from inst_vaccency_details as ivd
                      left join course_group as cg on ivd.course_group=cg.id
                      left join courses as crs on ivd.course_id=crs.id
                      left join designation_master as dm on ivd.desigation_id=dm.id
                      WHERE ivd.inst_id=${inst_id};`
    const employement_query=`SELECT * FROM employbility_status`;
    const leave_query="SELECT * FROM `leave_reason`";
    const app_query='SELECT * FROM category';
    const dteOffice_loc="select * from dte_offices";
    const dteOffices=await executeReadQuery(dteOffice_loc);
    const app_category=await executeReadQuery(app_query)
    const leave_reason=await executeReadQuery(leave_query);
    const employement_status=await executeReadQuery(employement_query);
     const courses=await executeReadQuery(cours_query);
     const post=await  executeReadQuery(post_query)
    return res.send({
        "designations":data,
        "courses":courses,
        "post":post,
        "employement_status":employement_status,
        "leave_reason":leave_reason,
        "appointment_category":app_category,
        "deputationLocation":dteOffices
        
    })
        
             
            
           
       
    

}
const getEmployee =async(req,res)=>{
  const inst_id=req.params.id;
  const eid=req.query.empid
  const employee_query=`SELECT * FROM employee where id=${eid} and inst_id=${inst_id}`;
  const employee=await executeReadQuery(employee_query);
  return res.send({
    "employeeData":employee
  })

}
export{
    getDataCreateProfile,
    getEmployee
}