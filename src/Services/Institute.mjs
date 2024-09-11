import e from "express";
import { executeReadQuery, executeWriteQuery } from "../db/db_operation.mjs";
import { readQueries } from "../db/readQueries.mjs";
import { writeQueries } from "../db/writeQueries.mjs";

export const getAllEmployeesRemarks = async (req, res) => {
  const inst_id = req.user.inst_id;
  console.log(inst_id);
  try {
    const allRemarks = await executeReadQuery(
      readQueries.getAllEmployeesRemarks(),
      inst_id
    );

    const requestTypesData = await executeReadQuery(
      readQueries.getAppliedForTransferStatus(),
      inst_id
    );
    // console.log(requestTypesData);
    const typesOfAppliedTransfer = {};
    for (let i = 0; i < requestTypesData.length; i++) {
      if (
        typesOfAppliedTransfer[requestTypesData[i].employee_id] === undefined
      ) {
        typesOfAppliedTransfer[requestTypesData[i].employee_id] =
          requestTypesData[i].requesttype !== null
            ? `${requestTypesData[i].requesttype}`
            : null;
      } else {
        typesOfAppliedTransfer[
          requestTypesData[i].employee_id
        ] += `${requestTypesData[i].requesttype}`;
      }
    }
    // console.log(typesOfAppliedTransfer);

    return res.send({ allRemarks, typesOfAppliedTransfer });
  } catch (error) {
    return res.status(422).send({ msg: "Something went wrong" });
  }
};

export const getEmployeeAllRemarks = async (req, res) => {
  const id = req.params.id;
  try {
    const employeeRemarkStatus = await executeReadQuery(
      readQueries.getSingleEmployeeAppliedTransferStatus(),
      id
    );

    const remarkStatus = {};
    for (let i = 0; i < employeeRemarkStatus.length; i++) {
      if (remarkStatus[employeeRemarkStatus[i].employee_id] === undefined) {
        remarkStatus[employeeRemarkStatus[i].employee_id] =
          employeeRemarkStatus[i].requesttype !== null
            ? `${employeeRemarkStatus[i].requesttype}`
            : null;
      } else {
        remarkStatus[
          employeeRemarkStatus[i].employee_id
        ] += `${employeeRemarkStatus[i].requesttype}`;
      }
    }

    const choiceorder = await executeReadQuery(
      readQueries.getChoiceOrder(),
      id
    );

    const transferOfficeRemarks = await executeReadQuery(
      readQueries.getTransferOfficeRemarks()
    );

    const principalOtherRemark = await executeReadQuery(
      readQueries.getprincipalRemarks(),
      id
    );

    // console.log(principalOtherRemark);

    return res.send({
      status: remarkStatus[id],
      choiceorder,
      transferOfficeRemarks,
      principalOtherRemark: principalOtherRemark[0]?.principal_other_remark,
      principalRemark: principalOtherRemark[0]?.principal_remark,
    });
  } catch (error) {
    return res.status(422).send({ msg: "Something went wrong" });
  }
};

export const submitEmployeRemark = async (req, res) => {
  const { id } = req.params;
  const { principal_remark, principal_other_remark } = req.body;
  try {
    const data = {
      employee_id: id,
      principal_remark: principal_remark,
      principal_other_remark: principal_other_remark || "",
    };
    const submitRemark = await executeWriteQuery(
      writeQueries.insertTable("employee_transfer_remarks"),
      data
    );

    res.send({ msg: "Remark submitted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(502).send({ msg: "Internal server error", err: error });
  }
};

export const upadteRemark = async (req, res) => {
  // console.log("=>", req.body);
  const id = req.params.id;
  const { principal_remark, principal_other_remark } = req.body;
  try {
    const query = `
      UPDATE employee_transfer_remarks
      SET principal_remark = ?, principal_other_remark = ?
      WHERE employee_id = ?;
    `;
    const data = await executeWriteQuery(query, [
      principal_remark,
      principal_other_remark || "",
      id,
    ]);
    return res.send({ msg: "Remark updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(422).send({ msg: "Something went wrong" });
  }
};

export const deleteRemark = async (req, res) => {
  const id = req.params.id;
  try {
    const query = `
      DELETE FROM employee_transfer_remarks
      WHERE employee_id = ?;
    `;
    const data = await executeWriteQuery(query, [id]);
    return res.send({ msg: "Remark deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(422).send({ msg: "Something went wrong" });
  }
};
