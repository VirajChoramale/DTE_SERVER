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
    response.courses = await executeReadQuery(readQueries.getCourseGroups());
  } catch (error) {
    response.err = "SQL ERROR => " + error;
    res.status(302);
  } finally {
    res.send(response);
  }
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
