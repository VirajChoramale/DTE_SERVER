import { executeReadQuery, executeWriteQuery } from "../db/db_operation.mjs";
import { readQueries } from "../db/readQueries.mjs";
import { writeQueries } from "../db/writeQueries.mjs";
import { deleteFromnTable, update_table } from "../utility/Sql_Querries.mjs";

//This controller for common operation which are common in different roles

/* create prof -->*/
export const getDataCreateProfile = async (req, res) => {
  const inst_id = req.user.inst_id;
  const typ = req.query.type;
  console.log(typ);
  let data = null;
  let query = "";
  if (typ == 1) {
    query =
      "SELECT id,designation_type,designation_name_marathi,designation_name FROM designation_master where class='A' and designation_type in (1,2) order by priority ;";
    data = await executeReadQuery(query);
  } else if (typ == 2) {
    query =
      "SELECT * FROM designation_master where designation_type=2 and class in ('C','D') order by class;";
    data = await executeReadQuery(query);
  } else {
    return res.json("Invalid type ");
  }
  const cours_query = "select * from course_group; ";
  const post_query = `SELECT ivd.id,ivd.shift,dm.designation_name,dm.designation_name_marathi,crs.coursename,crs.course_marathi_name,ivd.filled_post,ivd.sensction_post as senction_post,ivd.vaccent_post from inst_vaccency_details as ivd
                      left join course_group as cg on ivd.course_group=cg.id
                      left join courses as crs on ivd.course_id=crs.id
                      left join designation_master as dm on ivd.desigation_id=dm.id
                      WHERE ivd.inst_id=${inst_id} ${
    typ == 2 ? "and ivd.course_group=0" : ""
  };`;
  const employement_query = `SELECT * FROM employbility_status`;
  const leave_query = "SELECT * FROM `leave_reason`";
  const app_query = "SELECT * FROM category";
  const dteOffice_loc = "select * from dte_offices";
  const dteOffices = await executeReadQuery(dteOffice_loc);
  const app_category = await executeReadQuery(app_query);
  const leave_reason = await executeReadQuery(leave_query);
  const employement_status = await executeReadQuery(employement_query);
  const courses = await executeReadQuery(cours_query);
  const post = await executeReadQuery(post_query);
  return res.send({
    designations: data,
    courses: courses,
    post: post,
    employement_status: employement_status,
    leave_reason: leave_reason,
    appointment_category: app_category,
    deputationLocation: dteOffices,
  });
};

export const getEmployee = async (req, res) => {
  const inst_id = req.user.inst_id;

  const eid = req.query.empid;

  const employee = await executeReadQuery(
    readQueries.getEmployeeCurrentDetails(),
    [eid, inst_id]
  );
  return res.send({
    employeeData: employee[0],
  });
};
export const insertEmployee = (req, res) => {
  console.log(req.body);
  res.send(req.body);
};
export const getInstituteVaccancy = async (req, res) => {
  const inst_id = req.user.inst_id;
  const vaccancy_data = await executeReadQuery(
    readQueries.getInstVaccancy(),
    inst_id
  );
  return res.send({
    vaccancy_data: vaccancy_data,
  });
};

export const getEmployeeList = async (req, res) => {
  const inst_id = req.user.inst_id;
  const employee = await executeReadQuery(
    readQueries.getInstEmployee(),
    inst_id
  );
  return res.send({
    employeeData: employee,
  });
};
export const getPostCountEmp = async (req, res) => {
  const post_id = req.params.id;

  const count = await executeReadQuery(readQueries.getPostCountEmp(), post_id);
  return res.send({
    EmployeeCount: count[0].count,
  });
};

/* create prof <---*/

/*---->create Employee form(1) create and update in one*/
export const createEmployee = async (req, res) => {
  const employeeData = req.body.data.employee;
  const experianceData = req.body.data.experiance;
  const inst_id = req.user.inst_id;
  const is_inst = req.user.is_inst;
  let eid = null;
  const response = {};
  const emp_ct = await executeReadQuery(
    readQueries.getPostCountEmp(),
    employeeData.post_id
  );
  const post = await executeReadQuery(
    readQueries.getPost(),
    employeeData.post_id
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
        employee_type: employeeData.employee_type,
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
        response.returnEmployeeData = {
          employeeData,
          employeeId: response.employeeTableInsert.insertId,
        };
      } else {
        response.updateEmployee = await update_table(
          "employee",
          "id",
          employeeData.employee_id,

          Object.keys(employee[0]),
          Object.values(employee[0])
        );
        response.returnEmployeeData = {
          employeeData,
          employeeId: response.employeeTableInsert.insertId,
        };
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
      console.log(experiance);
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
      if (data.personalDetails.change_in_name == 1) {
        response.insertNameChange = await executeWriteQuery(
          writeQueries.insertTable("employee_name_change"),
          data.changeInName
        );
      }
      response.insertPersonalDetails = await executeWriteQuery(
        writeQueries.insertTable("employee_personal_details"),
        data.personalDetails
      );
      if (data.personalDetails.caste > 1) {
        response.insertCasteDetails = await executeWriteQuery(
          writeQueries.insertTable("employee_cast_details"),
          data.castDetails
        );
      }
      response.employeePersonalDetails = await executeReadQuery(
        readQueries.getEmpPersonalDetail(),
        employeeId
      );
    } else if (editMode == 1) {
      if (data.personalDetails.change_in_name == 1) {
        response.deleteChangeInName = await deleteFromnTable(
          "employee_name_change",
          "employee_id",
          employeeId
        );
        response.insertNameChange = await executeWriteQuery(
          writeQueries.insertTable("employee_name_change"),
          data.changeInName
        );
      } else if (data.personalDetails.change_in_name == 0) {
        response.deleteChangeInName = await deleteFromnTable(
          "employee_name_change",
          "employee_id",
          employeeId
        );
      }
      response.updatePersonalDetails = await update_table(
        "employee_personal_details",
        "employee_id",
        employeeId,
        Object.keys(data.personalDetails),
        Object.values(data.personalDetails)
      );

      if (data.personalDetails.caste <= 1) {
        response.deleteCasteDetails = await deleteFromnTable(
          "employee_cast_details",
          "employee_id",
          employeeId
        );
      } else if (data.personalDetails.caste > 1) {
        response.updateCasteDetails = await update_table(
          "employee_cast_details",
          "employee_id",
          employeeId,
          Object.keys(data.castDetails),
          Object.values(data.castDetails)
        );
        if (response.updateCasteDetails.affectedRows < 1) {
          response.insertCasteDetails = await executeWriteQuery(
            writeQueries.insertTable("employee_cast_details"),
            data.castDetails
          );
        }
      }
      response.employeePersonalDetails = await executeReadQuery(
        readQueries.getEmpPersonalDetail(),
        employeeId
      );
    }
  } catch (err) {
    response.sqlError = "SQL ERR " + err;
  }
  res.send(response);
};
/* Maritial Status form(3) */

export const createMaritialStatus = async (req, res) => {
  const isEditMode = req.body.isEditMode;

  const response = {};
  try {
    if (isEditMode == 0) {
      const employeeID = req.body.employee_id;
      const employeeMaritialData = req.body.data.spouseDetails;
      const isChild = req.body.isChild;
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
      const employeeID = req.body.employee_id;
      const employeeMaritialData = req.body.data.spouseDetails;
      const isChild = req.body.isChild;
      response.updateSpouse = await update_table(
        "Employee_spouse",
        "employee_id",
        employeeID,
        Object.keys(employeeMaritialData),
        Object.values(employeeMaritialData)
      );

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
    } else if (isEditMode == 3) {
      const rowId = req.body.rowID;
      response.deleteChild = await deleteFromnTable(
        "Employee_child",
        "id",
        rowId
      );
      response.deletedRowId = rowId;
    }

    return res.send(response);
  } catch (error) {
    response.error = "SQL ERROR=> " + error;
  }
  return res.send(response);
};
/* Educational  Details  form(4) */

export const createeducationalDetails = async (req, res) => {
  const employeeId = req.body.employee_id;
  const isEditMode = req.body.isEditMode;

  const response = {};
  try {
    if (isEditMode == 0) {
      const education = req.body.data.education;

      response.insertEducation = await executeWriteQuery(
        writeQueries.insertTable("employee_educational_details"),
        education
      );
    } else if (isEditMode == 1) {
      const education = req.body.data.education;

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
    response.EmployeeEducation = await executeReadQuery(
      readQueries.getEmployeeEducation(),
      employeeId
    );
  } catch (error) {
    response.err = `SQL Error =>${error}`;
  }
  res.send(response);
};
/* Experiance  Details  form(5) */
export const createExperianceDetails = async (req, res) => {
  const employeeId = req.body.employee_id;
  const isEditMode = req.body.isEditMode;
  const response = {};

  try {
    if (isEditMode == 0) {
      const experiance = req.body.data.experiance;
      experiance.is_past = 1;

      response.createExperiance = await executeWriteQuery(
        writeQueries.insertTable("employee_experiance"),
        experiance
      );
    } else if (isEditMode == 1) {
      const experiance = req.body.data.experiance;
      experiance.is_past = 1;

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
      response.deleteExperiance = await deleteFromnTable(
        "employee_experiance",
        "id",
        row
      );
    }
    response.employeeExperiance = await executeReadQuery(
      readQueries.getEmployeeExperiances(),
      employeeId
    );
  } catch (error) {
    res.status(422);
    response.Error = "SQL ERROR => " + error;
  }
  res.send(response);
};
export const createEmployeeCertificates = async (req, res) => {
  const data = req.body.dataToSubmit;

  const response = {};
  const employeeId = req.body.employeeId;
  const extractedData = {};
  if (req.body.isEditMode == 1) {
    try {
      const del = await deleteFromnTable(
        "employee_certificate_details",
        "employee_id",
        employeeId
      );
      response.updateCert = del;
    } catch (error) {
      console.log(error);
    }
  }

  Object.keys(data).forEach((certificateName) => {
    const { issued, issueDate, issueNo } = data[certificateName];
    extractedData[certificateName] = issued ? 1 : 0;
    extractedData[`${certificateName}_date`] = issueDate;
    extractedData[`${certificateName}_no`] = issueNo;
  });
  extractedData.employee_id = employeeId;
  extractedData.mscit_certificate_exemp_no = req.body.execemptions.mscit_certificate_exemp_no || null;
  extractedData.mscit_exemp_date = req.body.execemptions.mscit_exemp_date || null;

  
  try {
    const insertCertificate = await executeWriteQuery(
      writeQueries.insertTable("employee_certificate_details"),
      extractedData
    );
    response.inserted = insertCertificate;
  } catch (error) {
    console.log(error);
    res.status(422);
    response.Error = "error while create" + error;
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
      }
      response.departmentalInsert = await executeWriteQuery(
        writeQueries.insertTable("employee_deparmental_enquiry_details"),
        departmentalEnquiry
      );
      response.retirenmentInsert = await executeWriteQuery(
        writeQueries.insertTable("employee_retirement_details"),
        retirenmentDetails
      );
    } else if (isEditMode == 1) {
      if (isTechnical == 1) {
        if (req.body.data.probation.is_probation == 1) {
          response.updateProbation = await update_table(
            "employee_probation_details",
            "employee_id",
            employeeId,
            Object.keys(req.body.data.probation),
            Object.values(req.body.data.probation)
          );
        }
      }

      response.updateDepartmental = await update_table(
        "employee_deparmental_enquiry_details",
        "employee_id",
        employeeId,
        Object.keys(departmentalEnquiry),
        Object.values(departmentalEnquiry)
      );

      response.updateRetirenmentDetails = await update_table(
        "employee_retirement_details",
        "employee_id",
        employeeId,
        Object.keys(retirenmentDetails),
        Object.values(retirenmentDetails)
      );
    }
  } catch (error) {
    res.status(302);
    response.Error = "SQL ERROR => " + error;
  }
  return res.send(response);
};
export const createSpacialPromotion = async (req, res) => {
  const response = {};
  const isEditMode = req.body.isEditMode;
  const employeeId = req.body.employeeId;

  try {
    if (isEditMode == 0) {
      response.insertPromotion = await executeWriteQuery(
        writeQueries.insertTable("timebound_10_20_promotion"),
        req.body.data.promotion
      );
    } else if (isEditMode == 1) {
      response.delReq = await deleteFromnTable(
        "timebound_10_20_promotion",
        "employee_id",
        employeeId
      );
      response.insertPromotion = await executeWriteQuery(
        writeQueries.insertTable("timebound_10_20_promotion"),
        req.body.data.promotion
      );
    }
  } catch (error) {
    res.status(422);
    response.Error = "SQL Error  => " + error;
  }

  return res.send(response);
};
