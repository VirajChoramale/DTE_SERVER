import { executeReadQuery } from "../db/db_operation.mjs";
import { readQueries } from "../db/Queries.mjs";

export const getOffices = async (req, res) => {
  const offices = await executeReadQuery(readQueries.getOffices());
  return res.send({
    offices: offices,
  });
};
export const getPost = async (req, res, next) => {
  console.log("e");
  const inst_id = req.params.id;
  const post = await executeReadQuery(readQueries.getInstVaccancy(), inst_id);

  return res.send({
    post: post,
  });
};
