const readQueries = {};
readQueries.getOffices = () => {
  return `select * from office_master`;
};
readQueries.getOffice = () => {
  return `select * from office_master where id = ?`;
};
readQueries.getEmployee = () => {
  return "select * from employee where id = ?";
};
readQueries.getInstEmployee = () => {
  return `select case when dm.class='A' THEN 1 WHEN dm.class='C' OR dm.class='D' THEN 2 end  as tech_type ,emp.employee_type,emp.sevarth_no,emp.id,emp.designation_id,emp.title,emp.full_name,emp.dob,dm.designation_name,
case when emp.course_id=0 OR emp.course_id=NULL then "-" END as coursename,crs.coursename,cg.course_group_name_eng as course_group from employee as emp
left join designation_master as dm on emp.designation_id=dm.id 
left join course_group as cg on emp.course_group=cg.id
left join courses as crs on emp.course_id=crs.id
where emp.inst_id=? order by dm.priority asc`;
};
readQueries.getInstCourses = () => {
  //this will return combo crs_group and crs
  return `select ivd.course_level_id, om.office_name,om.office_name_marathi,crs.coursename,crs.course_marathi_name,
        cg.course_group_name_eng as course_group_name ,cg.course_grp_marathi from inst_vaccency_details as ivd
        left join courses as crs on ivd.course_id=crs.id
        left join office_master as om on ivd.inst_id=om.id
        left join course_group as cg on ivd.course_group=cg.id
        where ivd.inst_id=?
        GROUP by ivd.course_id,ivd.course_group;`;
};
readQueries.getCourses = () => {
  return `select * from courses`;
};
readQueries.getCourse = () => {
  return `select * from courses where id = ?`;
};
readQueries.getCourseGroups = () => {
  return "Select * from course_group";
};
readQueries.getCourseGroup = () => {
  return "select * from course_group where id = ?";
};
readQueries.getInstCourseGroup = () => {
  return `select ivd.course_level_id, om.office_name,om.office_name_marathi,cg.course_group_name_eng as course_group_name ,
        cg.course_grp_marathi from inst_vaccency_details as ivd
        left join office_master as om on ivd.inst_id=om.id
        left join course_group as cg on ivd.course_group=cg.id
        where ivd.inst_id=?
        GROUP by ivd.course_group;`;
};

//-->Masters<--

readQueries.getReligion = () => {
  return "select * from religion";
};
readQueries.getPwd = () => {
  return "select * FROM pwd";
};
readQueries.getCasts = () => {
  return "select * from caste_master";
};
readQueries.getMothertounges = () => {
  return "select * from mothertongue";
};
readQueries.getCatogary = () => {
  return "select *  FROM category";
};
readQueries.getUniversities = () => {
  return "SELECT * FROM university_master";
};
readQueries.getEducationalBoards = () => {
  return "SELECT * FROM education_boards";
};
readQueries.getDteOffices = () => {
  return "select * from office_master where is_institute=2";
};
//---->Designation<-----------//
readQueries.getDesignations = () => {
  return "select * from designation_master";
};
readQueries.getDesignation = () => {
  return "select * from designation_master where id = ?";
};
readQueries.getInstDesignations = () => {
  return `select om.office_name,om.office_name_marathi,dm.designation_name,dm.designation_name_marathi,dm.class from inst_vaccency_details as ivd
left join office_master as om on ivd.inst_id=om.id
left join designation_master as dm on ivd.desigation_id=dm.id
where ivd.inst_id=? order by dm.class asc `;
};
readQueries.getInstVaccancy = () => {
  return `select ivd.id, dm.designation_name,
                 case when ivd.course_id=0 OR ivd.course_id=NULL then "-"   
                 WHEN  ivd.course_id!=0 OR ivd.course_id!=NULL then crs.coursename
                 END as coursename,
                  case when dm.class='A' then 1
                 WHEN dm.class='C' OR dm.class='D' then 2
                 END as tech_type,
                  ivd.filled_post,ivd.sensction_post as sanction_post,
                  ivd.vaccent_post from inst_vaccency_details as ivd 
                  left join office_master as om on ivd.inst_id=om.id
                  left join courses as crs on ivd.course_id=crs.id
                  left join course_group as cg on ivd.course_group=cg.id
                  left JOIN designation_master as dm on ivd.desigation_id=dm.id
                  where inst_id=? order by dm.class asc ,dm.priority asc;`;
};
readQueries.isPostConfirm = () => {
  return "select * from is_post_confirm where inst_id=?";
};
readQueries.getPostDetails = () => {
  //get post details
  return `SELECT ivd.id,ivd.course_id,ivd.course_level_id,ivd.course_group,ivd.desigation_id,desig.designation_name,crs.coursename,crs.course_marathi_name,cg.course_group_name_eng,cg.course_grp_marathi
FROM inst_vaccency_details as ivd
left join designation_master as desig on ivd.desigation_id=desig.id
left join course_group as cg on ivd.course_group=cg.id
left join courses as crs on ivd.course_id=crs.id
where ivd.id=?;`;
};
readQueries.getPost = () => {
  return "select * from inst_vaccency_details where id =?";
};
readQueries.getPostCountEmp = () => {
  //get post wise employee count
  return `select count(id) as count from employee where post_id= ? and is_working=1`;
};
readQueries.updateTable = (table_name, colms, identifier, identifierValue) => {
  const setClause = colms.map((col, index) => `${col} = ?`).join(", ");

  return `update ${table_name} set ${setClause} where ${identifier} = ${identifierValue} `;
};
readQueries.getLeavingReason = () => {
  return "SELECT * FROM leave_reason";
};
//email template queries//

readQueries.getEmailTemplates = () => {
  return "SELECT * FROM email_template";
};
readQueries.getEmailTemplate = () => {
  return "SELECT * FROM email_template where id=?";
};
readQueries.getUserInfo = () => {
  //get user information from usertable
  return "select latest_otp,role,inst_id,is_inst,username,name,password,email,mobile from users_new where username=?";
};

//---->employee queries(for office)
readQueries.getEmpPersonalDetail = () => {
  return `SELECT epd.*,ecd.caste,ecd.castCertificateNumber,ecd.castCertificateDate,ecd.castCertificateAuthority,ecd.castValidityNumber,ecd.castValidityDate,
ecd.castValidityAuthority,enc.old_name,enc.gazet_for_name_change,enc.date FROM employee_personal_details as epd
left join employee_cast_details as ecd on epd.employee_id=ecd.employee_id
left join employee_name_change as enc on epd.employee_id=enc.employee_id
 where epd.employee_id=?`;
};
readQueries.getMaritialDetails = () => {
  return `select * from Employee_spouse where employee_id=?`;
};
readQueries.getChildData = () => {
  return `select * from Employee_child where employee_id=?`;
};
readQueries.getEmployeeEducation = () => {
  return `select * from employee_educational_details where employee_id=?`;
};
readQueries.getEmployeeCurrentDetails = () => {
  //employee current experiance (inst_id required)
  return `SELECT emp.*,exp.mode_of_inst_joining,exp.appointment_type,exp.letter_no as current_posting_letter_number,exp.order_date,
  exp.appointment_category,exp.appoint_cadre,exp.appoint_course,exp.designation as appoint_desig,exp.pay_scale,exp.appoint_remark,
  exp.promoted_under_cas,exp.cas_designation as new_designation,exp.deputation_order_date,exp.deputation_order_number ,exp.deputed_or_lean_location as depu_location,exp.deputation_start_date,exp.deputation_end_date
  ,ead.mode_of_selection,ead.letter_number as appointment_letter_number
  FROM employee as emp left JOIN employee_experiance as exp on emp.id=exp.employee_id and exp.is_past=0 
  left join employee_appointment_details as ead on emp.id=ead.employee_id
  where emp.id=? and emp.inst_id=? and exp.is_past=0`;
};
readQueries.getEmployeeExperiances = () => {
  return `SELECT exp.*, om.office_name,om.office_name_marathi,crs.course_group_name_eng,desig.designation_name,appointment_type.appointment_type as mode_of_joining FROM employee_experiance as exp
left join office_master as om on exp.institute_id=om.id
left join course_group as crs on exp.appoint_course=crs.id
left join designation_master as desig on exp.appoint_designation=desig.id
left join appointment_type on exp.appointment_type=appointment_type.id
WHERE exp.employee_id=? and exp.is_past=1;`;
};
readQueries.getEmployeeProbation = () => {
  return `select * from employee_probation_details where employee_id=?`;
};
readQueries.getEmployeeRetirenment = () => {
  return `select * from employee_retirement_details where employee_id=?`;
};
readQueries.getDepartMentalEnquiry = () => {
  return `select * from employee_deparmental_enquiry_details where employee_id=?`;
};

readQueries.getCertificatesByDesig = () => {
  return `SELECT designation_id, Group_CONCAT( CASE WHEN medical_certificate = 1 THEN 'medical_certificate,' ELSE '' END,
   CASE WHEN mscit_certificate = 1 THEN 'mscit_certificate,' ELSE '' END,
    CASE WHEN language_exemption = 1 THEN 'language_exemption,' ELSE '' END,
        CASE WHEN marathi_exemption_order = 1 THEN 'marathi_exemption_order,' ELSE '' END,
CASE WHEN hindi_exemption_order = 1 THEN 'hindi_exemption_order,' ELSE '' END,
     CASE WHEN steno_speed_certificate = 1 THEN 'steno_speed_certificate,' ELSE '' END,
      CASE WHEN marathi_typing_certificate = 1 THEN 'marathi_typing_certificate,' ELSE '' END, 
CASE WHEN PRT_exam = 1 THEN 'PRT_exam,' ELSE '' END,
      CASE WHEN english_typing_certificate = 1 THEN 'english_typing_certificate,' ELSE '' END,
       CASE WHEN permanent_certificate = 1 THEN 'permanent_certificate,' ELSE '' END,
        CASE WHEN police_verification = 1 THEN 'police_verification,' ELSE '' END, 
        CASE WHEN SRT_Exam = 1 THEN 'SRT_Exam,' ELSE '' END )
         AS required_certificates FROM designation_and_required_certificate WHERE designation_id = ? `;
};
readQueries.getEmployeeSpacialPromotion = () => {
  return `SELECT timebound_10_20_promotion.*,designation_master.designation_name
FROM timebound_10_20_promotion
LEFT JOIN  designation_master
ON timebound_10_20_promotion.timebound_designation=designation_master.id where timebound_10_20_promotion.employee_id = ? `;
};
//----> employee_queries(for emp login)

readQueries.getEmployeeProfile = () => {
  return;
};

readQueries.getEmployeesData = () => {
  return `SELECT id,sevarth_no,full_name,email FROM employee
  where sevarth_no like ? or full_name like ?`;
};

readQueries.getEmployeeBasicDetails = () => {
  return `SELECT id,sevarth_no,full_name,email,is_profile_confirmed,is_data_locked,transfer_lock,inst_id,course_group FROM employee
  where id like ?`;
};

readQueries.getEmployeeInstitute = () => {
  return `select office_name FROM office_master where id=?`;
};

readQueries.getEmployeeCourseGroup = () => {
  return `select course_group_name_eng FROM course_group where id=?`;
};

readQueries.getEmployeeRemarks = () => {
  return `select principal_remark,ro_remark FROM employee_transfer_remarks where employee_id=?`;
};

readQueries.appliedForTransfer = () => {
  return `select emp_id FROM transferdata where emp_id=?`;
};

readQueries.getContactDetails = () => {
  return `select * from institute_contact_details`;
};

readQueries.getAllEmployeesRemarks = () => {
  return `select emp.id,is_profile_confirmed,full_name,sevarth_no,designation_name,coursename,principal_remark,ro_remark from employee as emp
left join designation_master as dm on emp.designation_id = dm.id
left join courses as cn on emp.course_id = cn.id
left join employee_transfer_remarks as etr on emp.id = etr.employee_id
WHERE emp.inst_id = ?`;
};

readQueries.getAppliedForTransferStatus = () => {
  return `SELECT employee.id AS employee_id, transferdata.requesttype
FROM employee 
LEFT JOIN transferdata 
    ON transferdata.emp_id = employee.id
WHERE employee.inst_id = ?
GROUP BY employee.id, transferdata.requesttype
ORDER BY employee.id, transferdata.requesttype;`;
};

readQueries.getSingleEmployeeAppliedTransferStatus = () => {
  return `SELECT employee.id AS employee_id, transferdata.requesttype
FROM employee 
LEFT JOIN transferdata 
    ON transferdata.emp_id = employee.id
WHERE employee.id = ?
GROUP BY employee.id, transferdata.requesttype
ORDER BY employee.id, transferdata.requesttype;`;
};

readQueries.getChoiceOrder = () => {
  return `SELECT choiceorder,inst_name,requesttype,trasnfer_reason FROM transferdata left join institutes on transferdata.selected_inst = institutes.id  where emp_id = ? order by requesttype,choiceorder`;
};

readQueries.getTransferOfficeRemarks = () => {
  return `SELECT * FROM transfer_office_remarks`;
};

readQueries.getprincipalRemarks = () => {
  return `SELECT principal_other_remark,principal_remark FROM employee_transfer_remarks where employee_id = ?;`;
};

export { readQueries };
