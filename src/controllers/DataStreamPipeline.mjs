//this controller is pipeline for common datafetching for all users like casteMaster, mothertoungeMaster, imageFetch etc(CDN)

import { executeReadQuery } from "../db/db_operation.mjs";
import { readQueries } from "../db/readQueries.mjs";

export const personalDetailsData = async (req, res) => {
  const response = {};
  try {
    response.castes = await executeReadQuery(readQueries.getCasts());
    response.mothertongue = await executeReadQuery(
      readQueries.getMothertounges()
    );
    response.religion = await executeReadQuery(readQueries.getReligion());
    response.category = await executeReadQuery(readQueries.getCatogary());
    response.pwdTypes = await executeReadQuery(readQueries.getPwd());
    response.instLeavingReason = await executeReadQuery(
      readQueries.getLeavingReason()
    );
    return res.status(200).send(response);
  } catch (error) {
    response.error = {
      msg: "SQL error" + error,
      code: 402,
    };
    return res.status(302).send(response);
  }
};
export const fetchMaritalStatusFormData = async (req, res) => {
  const response = {};
  try {
    response.pwdTypes = await executeReadQuery(readQueries.getPwd());
  } catch (error) {
    res.status(422);
    response.errorMsg = "SQL Error=> " + error;
  }
  res.send(response)
}
export const fetchEducationFormData = async (req, res) => {
  const response = {};

  try {
    response.universities = await executeReadQuery(
      readQueries.getUniversities()
    );
    response.educationalBoards = await executeReadQuery(
      readQueries.getEducationalBoards()
    );
  } catch (error) {
    response.err = "SQL ERR=> " + error;
  }
  //console.log(response)
  res.send(response);
};
export const fetchExperianceFormData = async (req, res) => {
  const response = {};

  try {
    response.offices = await executeReadQuery(readQueries.getOffices());
    response.leavingReason = await executeReadQuery(
      readQueries.getLeavingReason()
    );
    response.designations = await executeReadQuery(
      readQueries.getDesignations()
    );
    
    response.deputationLocation = await executeReadQuery(readQueries.getDteOffices());
    response.courses = await executeReadQuery(readQueries.getCourseGroups());
  } catch (error) {
    response.err = "SQL ERROR => " + error;
    res.status(302);
  } finally {
    res.send(response);
  }
};

export const fetchEmployeeCertificate = async (req, res) => {
  const desigationId = req.body.designationId;
  console.log(req.body);
  const response = {};
  try {
    response.cretiFicates = await executeReadQuery(
      readQueries.getCertificatesByDesig(),
      desigationId
    );
  } catch (error) {
    res.status(302);
    response.err = "SQL ERR ==>" + error;
  }
  res.send(response);
};
export const employeeExperiance = async (req, res) => {
  const eid = req.body.eid;

  const response = {};
  try {
    response.employeeExperiances = await executeReadQuery(
      readQueries.getEmployeeExperiances(),
      eid
    );
    return res.send(response);
  } catch (error) {
    return res.status(302).send("SQL ERROR" + error);
  }
};
export const getEmployeePersonalDetails = async (req, res) => {
  const response = {};
  try {
    response.employeePersonalDetails=await executeReadQuery(readQueries.getEmpPersonalDetail(),req.body.employeeID)
  } catch (error) {
    res.status(302);
    response.err = "SQL ERR ==>" + error;
    
  }
  return res.send(response)
}
export const getMaritialDetails = async (req, res) => {
  const response = {};
  try {
    response.maritialDetails=await executeReadQuery(readQueries.getMaritialDetails(),req.body.employeeID)
    response.childData=await executeReadQuery(readQueries.getChildData(),req.body.employeeID)

  } catch (error) {
    res.status(302);
    response.err = "SQL ERR ==>" + error;
    
  }
  return res.send(response)
}
export const getEmployeeEducation = async (req, res) => {
 
  const response = {};
  try {
    response.employeeEducation=await executeReadQuery(readQueries.getEmployeeEducation(),req.body.employeeID)
    
  } catch (error) {
    res.status(422);
    response.err = "SQL ERR ==>" + error;
    
  }
  return res.send(response)
}
export const getOtherDestils = async (req, res) => {
  const response = {};
  try {
    response.probationDetails=await executeReadQuery(readQueries.getEmployeeProbation(),req.body.employeeID)
    response.retirenmentDetails=await executeReadQuery(readQueries.getEmployeeRetirenment(),req.body.employeeID)
    response.getDepartMentalEnquiry=await executeReadQuery(readQueries.getDepartMentalEnquiry(),req.body.employeeID)

    
  } catch (error) {
    res.status(302);
    response.err = "SQL ERR ==>" + error;
    
  }
  return res.send(response)
}

export const getEmployeeSpacialPromotion = async (req, res) => {
  const response = {};
  const employeeId = req.body.employeeId;
  try {
      response.spacialPromotion=await executeReadQuery(readQueries.getEmployeeSpacialPromotion(),employeeId)
  } catch (error) {
    res.status(422);
    response.Error="SQL error =>"+error
  }
  res.send(response);
}