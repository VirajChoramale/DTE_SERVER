import { compare_bcrypt } from "../utility/bcrypt_js.mjs";
import jsonwebtoken from "jsonwebtoken";
import { configDotenv } from "dotenv";
import { sendOtpSMS } from "../utility/otp.mjs";
import { executeReadQuery } from "../db/db_operation.mjs";
import { readQueries } from "../db/readQueries.mjs";
import { update_table } from "../utility/Sql_Querries.mjs";
configDotenv();
const HmacKey = process.env.HMAC;

const verify_user = async (username, password) => {
  try {
    const result = await executeReadQuery(readQueries.getUserInfo(), username);

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

  if (resp.code == 200) {
    const uname = resp.data[0].username;
    const token = jsonwebtoken.sign({ uname }, HmacKey, {
      expiresIn: "15m",
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
        const resp_arr = res.split(",");
        sms_resp = resp_arr[0];
      })
      .catch((e) => console.log("error in sms api" + e));

    if (sms_resp === "402") {
      resp_arr.msg = `OTP has been successfully sent on ${resp.data[0].mobile} and ${resp.data[0].email}`;
      resp_arr.statusCode = 200;
      res.setHeader("Authorization", `Bearer ${token}`);
    } else {
      resp_arr.msg = `ERROR!! while sending the OTP, Kindly Contact DTE-IT Cell`;
      resp_arr.statusCode = 501;
    }
    res.status(200).send(resp_arr);
  } else {
    res.json(resp);
  }
};

const verify_otp = async (req, res) => {
  const tes = await executeReadQuery(readQueries.getUserInfo(), req.user.uname);

  if (tes[0].latest_otp == req.body.otp) {
    const token = jsonwebtoken.sign(
      {
        uname: req.user.uname,
        role: tes[0].role,
        inst_id: tes[0]["inst_id"],
        is_inst: tes[0]["is_inst"],
        name: tes[0]["name"],
      },

      HmacKey,
      {
        expiresIn: "480m",
        algorithm: "HS256",
      }
    );

    await update_table(
      "users_new",
      "username",
      req.user.uname,
      ["latest_otp"],
      [""]
    );

    res.setHeader("Authorization", `Bearer ${token}`);
    res.setHeader("role", `role ${tes[0].role}`);
    res.setHeader("is_inst", `is_inst ${tes[0].is_inst}`);
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

//reset pass request
export const resetPassword =async (req, res) => {
  
 
    const userName = req.body.username;
  const user = await executeReadQuery(readQueries.getUserInfo(), userName);
  if (user[0]) {
    const uname = user[0].username;
    const token = jsonwebtoken.sign({ uname }, HmacKey, {
      expiresIn: "15m",
      algorithm: "HS256",
    });
    let sms_resp = null;
    const resp_arr = {};
    await sendOtpSMS(
      user[0].mobile,
      user[0].username,
      user[0].email,
      user[0].name
    )
      .then((res) => {
        const resp_arr = res.split(",");
        sms_resp = resp_arr[0];
      })
      .catch((e) => console.log("error in sms api" + e));

    if (sms_resp === "402") {
      resp_arr.msg = `OTP has been successfully sent on ${user[0].mobile} and ${user[0].email}`;
      resp_arr.statusCode = 200;
      res.setHeader("Authorization", `Bearer ${token}`);
    } else {
      resp_arr.msg = `ERROR!! while sending the OTP, Kindly Contact DTE-IT Cell`;
      resp_arr.statusCode = 501;
    }
    res.status(200).send(resp_arr);
  } else {
   
  }
  
  
}
export const verifyOtpPassReset = async (req,res) => {
 
  const tes = await executeReadQuery(readQueries.getUserInfo(), req.user.uname);

  if (tes[0].latest_otp == req.body.otp) {
    const token = jsonwebtoken.sign(
      {
        uname: req.user.uname,
        
      },

      HmacKey,
      {
        expiresIn: "5m",
        algorithm: "HS256",
      }
    );

    await update_table(
      "users_new",
      "username",
      req.user.uname,
      ["latest_otp"],
      [""]
    );

    res.setHeader("Authorization", `Bearer ${token}`);
   
    res.status(200).json({
      msg: "Validated",
      
    });
  } else {
    res.status(200).json({
      msg: "Invalid Otp",
      code: "401",
    });
  }
}
export const updatePass = async (req, res) => {
  
  res.status(401).send();
}


export { login, verify_otp, verify_user };
