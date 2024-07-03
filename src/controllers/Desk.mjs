import { executeReadQuery } from "../db/db_operation.mjs";
import { readQueries } from "../db/Queries.mjs";

export const getOffices = async (req, res) => {
  const offices = await executeReadQuery(readQueries.getOffices());
  return res.send({
    offices: offices,
  });
};
export const getPost = async (req, res, next) => {

  const inst_id = req.params.id;

  if (inst_id == '' || inst_id == null) {
    return res.send({});
  }
  const post = await executeReadQuery(readQueries.getInstVaccancy(), inst_id);

  return res.send({
    post: post,
  });
};
