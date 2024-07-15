import { executeReadQuery } from "../db/db_operation.mjs";
import { readQueries } from "../db/readQueries.mjs";
import { writeQueries } from "../db/writeQueries.mjs";

//This controller for common operation which are common in different roles
export const createEmployee = async (req, res) => {
  const employeeData = req.body.data;
  const emp_ct = await executeReadQuery(readQueries.getPostCountEmp(), 15);
  const post = await executeReadQuery(
    readQueries.getPost(),
    employeeData.post_id
    );
   
  if ((emp_ct.count < post[0].filled_post)) {
    return res.status(400).json({
      msg: "Employees are already added for this post.. Kindly visit Dashboard to check Vaccancy status of Post",
      code: 400,
    });
  } else {
    const employee = [//inst_id and is_inst painding...
      {
        job_role: employeeData.job_role,
        employment_status: employeeData.employment_status,

        date_of_joining: employeeData.date_of_joining,
        designation_id: post[0].desigation_id,
        course_id: post[0].course_id,
        course_group: post[0].course_group,
        crs_level: post[0].course_level_id,
        shift: post[0].shift,
        
        post_id:  post[0].id,
        title: employeeData.title,
        full_name: employeeData.full_name,
        name_in_marathi: employeeData.name_in_marathi,
        gender: employeeData.gender,
        dob: employeeData.dob,
        email: employeeData.email,
        contact_no: employeeData.contact_no,
        on_leave_type: employeeData.on_leave_type,
        s_date: employeeData.s_date,
            e_date: employeeData.e_date,
     
      },
      ];
      let sqlResponse = '';
      try {
           sqlResponse = await executeReadQuery(writeQueries.insertTable("employee"), employee);
           res.json(sqlResponse.insertId);
        
      } catch (error) {
        sqlResponse=error
      }
      return res.send({
           sqlResponse
       })
    }
    

  /* {
   "insertFlag":1,
   "data":{
       "job_role":1 ,
       "employment_status"	,int
       "date_of_joining",
       "designation_id",
       "course_id" ,
       "course_group"
       "crs_level",
       "shift",
       "post_name",
       "post_id",
       "title",
       "full_name",
       "name_in_marathi"
       "gender Male/Female",
       "dob",
       "email",
       "contact_no",
       "on_leave_type",
       "s_date	",
       "e_date",
       //experiance
       employee_id ,
       appointment_type 
       mode_of_inst_joining
       order_date
       appoint_designation 
       appoint_cadre 
       appoint_crs_lvl 
       appoint_course
       institute_id
       is_institute
       job_role
       promoted_under_cas,
      cas_designation,
      designation
       department 
       date_of_joining 
       letter_no
       appointment_category
       employment_status
       deputation_start_date
       deputation_end_date
       deputed_or_lean_location
       pay_scale
       end_date
       reason_for_leaving
       appoint_remark	
       leave_remark
       updated_by
       
       
       
       
       
       
   }
}
     
     
     
     
     
     
     
     
     
     
     
     */
  console.log("hit");
};
