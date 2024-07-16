import { executeReadQuery, executeWriteQuery } from "../db/db_operation.mjs";
import { readQueries } from "../db/readQueries.mjs";
import { writeQueries } from "../db/writeQueries.mjs";
import { update_table } from "../utility/Sql_Querries.mjs";

//This controller for common operation which are common in different roles
export const createEmployee = async (req, res) => {
  const employeeData = req.body;
  let eid = "";
  const response = {};
  const emp_ct = await executeReadQuery(readQueries.getPostCountEmp(), 15);
  const post = await executeReadQuery(
    readQueries.getPost(),
    15 // employeeData.post_id
  );

  if (emp_ct.count < post[0].filled_post) {
    return res.status(400).json({
      msg: "Employees are already added for this post.. Kindly visit Dashboard to check Vaccancy status of Post",
      code: 400,
    });
  } else {
    const employee = [
      {
        job_role: employeeData.job_role,
        employment_status: employeeData.employment_status,
        sevarth_no: employeeData.sevarth_no,
        date_of_joining: employeeData.date_of_joining,
        designation_id: post[0].desigation_id,
        course_id: post[0].course_id,
        course_group: post[0].course_group,
        crs_level: post[0].course_level_id,
        shift: post[0].shift,
        post_id: post[0].id,
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
    try {
      if (req.body.is_edit_mode == 0) {
        response.employeeTableInsert = await executeWriteQuery(
          writeQueries.insertTable("employee"),
          employee
        );

        eid = response.employeeTableInsert.insertId;
      } else {
        response.updateEmployee = await update_table(
          "employee",
          "id",
          employeeData.employee_id,

          Object.keys(employee[0]),
          Object.values(employee[0])
        );
      }
    } catch (error) {
      response.error = error;
    }

    const appointmentDetails = [
      {
        mode_of_inst_joining: employeeData.mode_of_inst_joining,
        order_date: employeeData.order_date,
        appoint_designation: employeeData.appoint_designation,
        appoint_cadre: employeeData.appoint_cadre,
        appoint_crs_lvl: employeeData.appoint_crs_lvl,
        appoint_course: employeeData.appoint_course,
        institute_id: req.inst_id,
        is_institute: req.is_institute,
        job_role: employeeData.job_role,
        promoted_under_cas: employeeData.promoted_under_cas,
        cas_designation: employeeData.cas_designation,
        designation: employeeData.designation,
        department: employeeData.department,
        date_of_joining: employeeData.date_of_joining,
        letter_no: employeeData.letter_no,
        is_past: 0,
        appointment_category: employeeData.appointment_category,
        employment_status: employeeData.employment_status,
        deputation_start_date: employeeData.deputation_start_date,
        deputation_end_date: employeeData.deputation_end_date,
        deputed_or_lean_location: employeeData.deputed_or_lean_location,
        pay_scale: employeeData.pay_scale,
        end_date: employeeData.end_date,
        reason_for_leaving: employeeData.reason_for_leaving,
        appoint_remark: employeeData.appoint_remark,
        leave_remark: employeeData.leave_remark,
        updated_by: employeeData.updated_by,
      },
    ];
    if (req.body.is_edit_mode == 1) {
      appointmentDetails[0].employee_id = eid;
      console.log(appointmentDetails);
    }
    res.send(response);
  }
};
