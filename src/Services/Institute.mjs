import e from "express";
import { executeReadQuery } from "../db/db_operation.mjs";
import { readQueries } from "../db/readQueries.mjs";

export const getAllEmployeesRemarks = async (req, res) => {
  const inst_id = req.user.inst_id;
  console.log(inst_id);
  try {
    const allRemarks = await executeReadQuery(
      readQueries.getAllEmployeesRemarks(),
      inst_id
    );

    const requestTypesData = await executeReadQuery(
      readQueries.getRequesttype(),
      inst_id
    );
    // console.log(requestTypesData);
    const requestTypes = {};
    for (let i = 0; i < requestTypesData.length; i++) {
      if (requestTypes[requestTypesData[i].employee_id] === undefined) {
        requestTypes[requestTypesData[i].employee_id] =
          requestTypesData[i].requesttype !== null
            ? `${requestTypesData[i].requesttype}`
            : null;
      } else {
        requestTypes[
          requestTypesData[i].employee_id
        ] += `${requestTypesData[i].requesttype}`;
      }
    }
    // console.log(requestTypes);

    return res.send({ allRemarks, requestTypes });
  } catch (error) {
    return res.status(422).send({ msg: "Something went wrong" });
  }
};
