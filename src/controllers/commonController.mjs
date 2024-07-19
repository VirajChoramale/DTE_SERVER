import { executeReadQuery, executeWriteQuery } from "../db/db_operation.mjs";
import { readQueries } from "../db/readQueries.mjs";
import { writeQueries } from "../db/writeQueries.mjs";
import { deleteFromnTable, update_table } from "../utility/Sql_Querries.mjs";

//This controller for common operation which are common in different roles

/*---->create Employee form(1) create and update in one*/
export const createEmployee = async (req, res) => {
  const employeeData = req.body.data.employee;
  const experianceData = req.body.data.experiance;
  const inst_id = 1001;
  const is_inst = 1001;
  let eid = null;
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
        inst_id: inst_id,
        is_inst: is_inst,
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
    //inst id and is_inst pending
    const experiance = [
      {
        mode_of_inst_joining: experianceData.mode_of_inst_joining,
        order_date: experianceData.order_date,
        appoint_designation: experianceData.appoint_designation,
        appoint_cadre: experianceData.appoint_cadre,
        appoint_crs_lvl: experianceData.appoint_crs_lvl,
        appoint_course: experianceData.appoint_course,
        institute_id: inst_id,
        is_institute: is_inst,
        job_role: experianceData.job_role,
        promoted_under_cas: experianceData.promoted_under_cas,
        cas_designation: experianceData.cas_designation,
        designation: post[0].desigation_id,
        department: post[0].course_group,
        date_of_joining: experianceData.date_of_joining,
        letter_no: experianceData.current_posting_letter_number,
        is_past: 0,
        appointment_category: experianceData.appointment_category,
        employment_status: experianceData.employment_status,
        deputation_end_date: experianceData.deputation_end_date,
        deputed_or_lean_location: experianceData.deputed_or_lean_location,
        pay_scale: experianceData.pay_scale,
        end_date: experianceData.end_date,
        reason_for_leaving: experianceData.reason_for_leaving,
        appoint_remark: experianceData.appoint_remark,
        leave_remark: experianceData.leave_remark,
        updated_by: experianceData.updated_by,
      },
    ];

    const appointmentDetails = [
      {
        mode_of_selection: experianceData.mode_of_selection,
        letter_number: experianceData.appointment_letter_number,
        appoint_designation: experianceData.appoint_designation,
        appoint_course: experianceData.appoint_course,
        appoint_crs_lvl: experianceData.appoint_crs_lvl,
        pay_scale: experianceData.pay_scale,
        is_active: 1,
      },
    ];
    if (req.body.is_edit_mode == 0) {
      appointmentDetails[0].employee_id = eid;
      experiance[0].employee_id = eid;

      response.appointmentDetails = await executeWriteQuery(
        writeQueries.insertTable("employee_appointment_details"),
        appointmentDetails
      );

      response.experiance = await executeWriteQuery(
        writeQueries.insertTable("employee_experiance"),
        experiance
      );
    } else if (req.body.is_edit_mode == 1) {
      response.updateExperiance = await executeWriteQuery(
        writeQueries.updatebyMultiColumn(
          "employee_experiance",
          Object.keys(experiance[0]),
          ["employee_id", "is_past"],
          [employeeData.employee_id, 0]
        ),
        Object.values(experiance[0])
      );
      response.updateappointment = await executeWriteQuery(
        writeQueries.updatebyMultiColumn(
          "employee_appointment_details",
          Object.keys(appointmentDetails[0]),
          ["employee_id", "is_active"],
          [employeeData.employee_id, 1]
        ),
        Object.values(appointmentDetails[0])
      );
    }
    res.send(response);
  }
};

/* Personal Detail form(2) */
export const createPersonalDetails = async (req, res) => {
  const employeeId = req.body.data.personalDetails.employee_id;
  const data = req.body.data;
  const editMode = req.body.isEditMode;
  const response = {};
  try {
    if (editMode == 0) {
      response.insertPersonalDetails = await executeWriteQuery(
        writeQueries.insertTable("employee_personal_details"),
        data.personalDetails
      );
      if (data.personalDetails.caste > 2) {
        response.insertCasteDetails = await executeWriteQuery(
          writeQueries.insertTable("employee_cast_details"),
          data.castDetails
        );
      }
    } else if (editMode == 1) {
      response.updatePersonalDetails = await update_table(
        "employee_personal_details",
        "employee_id",
        employeeId,
        Object.keys(data.personalDetails),
        Object.values(data.personalDetails)
      );

      if (data.personalDetails.caste <= 2) {
        response.deleteCasteDetails = await deleteFromnTable(
          "employee_cast_details",
          "employee_id",
          employeeId
        );
        console.log(response.deleteCasteDetails);
      } else if (data.personalDetails.caste > 2) {
        response.updateCasteDetails = await update_table(
          "employee_cast_details",
          "employee_id",
          employeeId,
          Object.keys(data.castDetails),
          Object.values(data.castDetails)
        );
      }
    }
  } catch (err) {
    response.sqlError = err;
  }
  res.send(response);
};
/* Maritial Status form(3) */

export const createMaritialStatus = async (req, res) => {
  const isEditMode = req.body.isEditMode;
  const employeeID = req.body.employee_id;
  const employeeMaritialData = req.body.data.spouseDetails;
  const isChild = req.body.isChild;
  const response = {};
  try {
    if (isEditMode == 0) {
      response.insertSpouse = await executeWriteQuery(
        writeQueries.insertTable("Employee_spouse"),
        employeeMaritialData
      );
      if (isChild == 1) {
        const childData = req.body.data.childDetails;
        let resArr = [];
        for (const element of childData) {
          const respond = await executeWriteQuery(
            writeQueries.insertTable("Employee_child"),
            element
          );
          resArr.push(respond);
        }

        response.childResponse = resArr;
      }
    } else if (isEditMode == 1) {
      response.updateSpouse = await update_table(
        "Employee_spouse",
        "employee_id",
        employeeID,
        Object.keys(employeeMaritialData),
        Object.values(employeeMaritialData)
      );
    }
    if (isChild == 1) {
      response.deleteChild = await deleteFromnTable(
        "Employee_child",
        "employee_id",
        employeeID
      );
      const childData = req.body.data.childDetails;
      let resArr = [];
      for (const element of childData) {
        const respond = await executeWriteQuery(
          writeQueries.insertTable("Employee_child"),
          element
        );
        resArr.push(respond);
      }

      response.updateChild = resArr;
    }

    return res.send(response);
  } catch (error) {
    response.error = "SQL ERROR=> " + error;
  }
  return res.send(response);
};
/* Educational  Details  form(4) */

export const createeducationalDetails = async (req, res) => {
  console.log(req.body.data.education);
  const employeeId = req.body.employee_id;
  const isEditMode = req.body.isEditMode;
  const education = req.body.data.education;

  const response = {};
  try {
    if (isEditMode == 0) {
      response.insertEducation = await executeWriteQuery(
        writeQueries.insertTable("employee_educational_details"),
        education
      );
      res.status(201);
    } else if (isEditMode == 1) {
      const row = req.body.updateRowId;
      response.updateEducation = await update_table(
        "employee_educational_details",
        "id",
        row,
        Object.keys(education),
        Object.values(education)
      );
    } else if (isEditMode == 3) {
      const row = req.body.deleteRowId;
      response.deleteEducation = await deleteFromnTable(
        "employee_educational_details",
        "id",
        row
      );
    }
  } catch (error) {
    response.err = `SQL Error =>${error}`;
  }
  res.send(response);
};
/* Experiance  Details  form(5) */
export const createExperianceDetails = async (req, res) => {
  const employeeId = req.body.employee_id;
  const isEditMode = req.body.isEditMode;
  const experiance = req.body.data.experiance;
  const response = {};
  experiance.is_past = 1;

  try {
    if (isEditMode == 0) {
      response.createExperiance = await executeWriteQuery(
        writeQueries.insertTable("employee_experiance"),
        experiance
      );
    } else if (isEditMode == 1) {
      const row = req.body.rowId;
      response.updateExperinace = await update_table(
        "employee_experiance",
        "id",
        row,
        Object.keys(experiance),
        Object.values(experiance)
      );
    } else if (isEditMode == 3) {
      const row = req.body.rowId;
      response.deleteEducation = await deleteFromnTable(
        "employee_experiance",
        "id",
        row
      );
    }
  } catch (error) {
    res.status(301);
    response.Error = "SQL ERROR => " + error;
  }
  res.send(response);
};

export const createOtherDetails = async (req, res) => {
  const employeeId = req.body.employee_id;
  const isEditMode = req.body.isEditMode;
  const isTechnical = req.body.isTechnical;

  const retirenmentDetails = req.body.data.retirenmentDetails;
  const departmentalEnquiry = req.body.data.departmentalEnquiry;
  const response = {};
  try {
    if (isEditMode == 0) {
      if (isTechnical == 1) {
        response.insertProbation = await executeWriteQuery(
          writeQueries.insertTable("employee_probation_details"),
          req.body.data.probation
        );
        response.departmentalInsert = await executeWriteQuery(
          writeQueries.insertTable("employee_deparmental_enquiry_details"),
          departmentalEnquiry
        );
        response.retirenmentInsert = await executeWriteQuery(
          writeQueries.insertTable("employee_retirement_details"),
          retirenmentDetails
        );
      } else if (isEditMode == 2) {
        if (isTechnical) {
          response.updateProbation = await update_table(
            "employee_probation_details",
            "employee_id",
            employeeId,
            Object.keys(req.body.data.probation),
            Object.values(req.body.data.probation)
          );
        }
      }
    }
  } catch (error) {
    res.status(302);
    response.Error = "SQL ERROR => " + error;
  }
  return res.send(response);
};
