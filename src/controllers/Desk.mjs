import { executeReadQuery, executeWriteQuery } from "../db/db_operation.mjs";
import { readQueries } from "../db/readQueries.mjs";
import { writeQueries} from "../db/writeQueries.mjs"
export const getOffices = async (req, res) => {
  const offices = await executeReadQuery(readQueries.getOffices());
  return res.send({
    offices: offices,
  });
};
export const getPost = async (req, res, next) => {
  const inst_id = req.params.id;

  if (inst_id == "" || inst_id == null) {
    return res.send({});
  }
  const post = await executeReadQuery(readQueries.getInstVaccancy(), inst_id);

  return res.send({
    post: post,
  });
};

export const updateVaccancy = async (req, res) => {
  const data = req.body.data;
  if (!(data.sanction_post || data.filled_post) || !data.id)
  {
    return res.status(400).json({ msg: "Missing required data", code: 400 });
  }
  const vaccent_post = data.sanction_post - data.filled_post;

  const values = [data.sanction_post, data.filled_post, vaccent_post];
  const columns = ["sensction_post", "filled_post", "vaccent_post"];
  try {
    const resp = await executeWriteQuery(
      writeQueries.updateTable("inst_vaccency_details", columns, "id", data.id),
      values
    );
    if (resp.affectedRows > 0) {
      return res.status(200).send({
        msg: "Vaccancy Updated Successfully",
        code: 200,
      });
    } else {
      return res.status().send({
        msg: "Failed To Update, Please contact IT Support",
        code: 401,
      });
    }
  } catch (error) {
    res.status(500).send({
      msg: "Failed To Update, Please contact IT Support",
      code: 500,
    });
  }
};

export const getDesignations = async (req, res) => {
  const designations = await executeReadQuery(readQueries.getDesignations());
  const courses = await executeReadQuery(readQueries.getCourses());
  res.status(200).send({
    designations: designations,
    courses: courses,
  });
};
