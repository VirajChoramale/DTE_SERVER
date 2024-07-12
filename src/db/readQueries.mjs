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
  return `select case when dm.class='A' THEN 1 WHEN dm.class='C' OR dm.class='D' THEN 2 end  as tech_type ,emp.id,emp.title,emp.full_name,dm.designation_name,
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
                  where inst_id=? order by dm.priority;`;
};
readQueries.getPostCountEmp = () => {
  return `select count(id) as count from employee where post_id= ? and is_working=1`;
};
readQueries.updateTable = (table_name, colms, identifier, identifierValue) => {
  const setClause = colms.map((col, index) => `${col} = ?`).join(", ");

  return `update ${table_name} set ${setClause} where ${identifier} = ${identifierValue} `;
};
//email template queries//

readQueries.getEmailTemplates = () => {
  return "SELECT * FROM email_template"
}
readQueries.getEmailTemplate = () => {
  return "SELECT * FROM email_template where id=?"
}
readQueries.getUserInfo = () => {
  //get user information from usertable
  return "select latest_otp,role,inst_id,username,password,email,mobile from users_new where username=?"
}
export { readQueries };
