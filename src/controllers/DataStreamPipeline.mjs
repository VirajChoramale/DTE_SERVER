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
    response.religion = await executeReadQuery(readQueries.getMothertounges());
    return res.status(200).send(response);
  } catch (error) {
    response.error = {
      msg: "SQL error" + error,
      code: 402,
    };
    return res.status(302).send(response);
  }
};
export const fetchExperianceFormData = async (req, res) => {
 
  const response = {};
  
  try {
    
    response.offices = await executeReadQuery(readQueries.getOffices());
       response.leavingReason = await executeReadQuery(readQueries.getLeavingReason());
    
  } catch (error) {
    response.err = "SQL ERROR => " + error
    res.status(302)
  }
  finally {
   
    res.send(response)
    }
 
}
export const employeeExperiance = async (req, res) => {
  const eid = req.body.eid;
  console.log("hit")
  const response = {}
  try {
    response.employeeExperiances=await executeReadQuery(readQueries.getEmployeeExperiances(),908)
    return res.send(response);
  } catch (error) {
    return res.status(302).send("SQL ERROR" + error);
  }
  

  
}