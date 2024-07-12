import { bcrypt_text, compare_bcrypt } from "../utility/bcrypt_js.mjs";
import jsonwebtoken from "jsonwebtoken";
import { configDotenv } from "dotenv";

import { sendOtpSMS } from "../utility/otp.mjs";
import { select_from_table } from "../utility/Sql_Querries.mjs";
const HmacKey = process.env.HMAC;
import { executeReadQuery, executeWriteQuery } from "../db/db_operation.mjs";
import { update_table } from "../utility/Sql_Querries.mjs";
configDotenv();

const verify_user = async (username, password) => {
  const user = `select name,username,password,email,mobile from users_new where username='${username}'`;
  try {
    const result = await executeReadQuery(user);

    if (result.length > 0) {
      const authinticate = compare_bcrypt(password, result[0]["password"]);

      if (authinticate) {
        return {
          res: true,
          data: result,
          msg: "Authentication Successfull",
          code: 200,
        };
      } else {
        return {
          res: false,
          data: null,
          msg: "Invalid Credentials!!",
          code: 501,
        };
      }
    } else {
      return {
        res: false,
        data: null,
        msg: "Invalid Credentials!!",
        code: 502,
      };
    }
  } catch (error) {
    console.log(error);
  }
};
const login = async (req, res, next) => {
  const resp = await verify_user(req.body.username, req.body.password);
  //console.log(req.body.username,req.body.password);
  if (resp.code == 200) {
    const uname = resp.data[0].username;
    const token = jsonwebtoken.sign({ uname }, HmacKey, {
      expiresIn: "120m",
      algorithm: "HS256",
    });
    let sms_resp = null;
    const resp_arr = {};
    await sendOtpSMS(
      resp.data[0].mobile,
      resp.data[0].username,
      resp.data[0].email,
      resp.data[0].name
    )
      .then((res) => {
        console.log(res);
        const resp_arr = res.split(",");
        sms_resp = resp_arr[0];
      })
      .catch((e) => console.log("error in sms api" + e));

    //console.log(resp.data[0].mobile)

    if (sms_resp === "402") {
      resp_arr.msg = `OTP has been successfully sent on ${resp.data[0].mobile} and ${resp.data[0].email}`;
      const userPayLoad = {
        token: token,
      };
      res.cookie("oid", JSON.stringify(userPayLoad), {
        expire: 10000 + Date.now(),
        httpOnly: process.env.PRODUCTION == "false" ? false : true,
        secure: process.env.PRODUCTION == "false" ? false : true,
        SameSite: "None",
      });
    } else {
      resp_arr.msg = `ERROR!! while sending the OTP, Kindly Contact DTE-IT Cell`;
    }
    res.status(200).send({ msg: resp_arr.msg, res: resp.res });
    next();
  } else {
    res.json(resp);
  }
};

const verify_otp = async (req, res) => {
  const tes = await executeReadQuery(
    `select latest_otp,password,role,inst_id from users_new where username='${req.user.uname}'`
  );
  if (tes[0].latest_otp == req.body.otp) {
    const token = jsonwebtoken.sign(
      { uname: req.user.uname, role: tes[0].role, inst_id: tes[0]["inst_id"] },
      process.env.HMAC
    );
    const sql = await update_table(
      "users_new",
      "username",
      req.user.uname,
      ["latest_otp"],
      [""]
    );
    const userPayLoad = {
      token: token,
      role: tes[0].role,
    };
    res.header('Authorization', `Bearer ${userPayLoad}`);
    res.cookie("eid", JSON.stringify(userPayLoad), {
      httpOnly: process.env.PRODUCTION == "false" ? false : true,
      secure: process.env.PRODUCTION == "false" ? false : true,
      SameSite: "None",
    });
    res.status(200).json({
      msg: "Validated",
      role: tes[0].role,
    });
  } else {
    res.status(200).json({
      msg: "Invalid Otp",
      code: "401",
    });
  }
};

export { login, verify_otp, verify_user };
