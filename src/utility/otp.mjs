
import crypto from "crypto"
import https from "https";
import  qs  from "qs";
import { update_table } from "./Sql_Querries.mjs";


function generateOtp(){
    const length=Math.floor(Math.random() * 3) + 4;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const username = 'dtemumbai';
const password = 'Dtems#456@123';
const deptSecureKey = 'b939a112-d103-4469-b22b-3c80b65328e5';
const senderid = 'DTEMUM';
const templateid='1307170668791675721'
function generateKey(message) {
  return crypto
    .createHash('sha512')
    .update(`${username}${senderid}${message}${deptSecureKey}`)
    .digest('hex');
}


async function sendOtpSMS( mobileno,uname) {
   
    const OTP=generateOtp();
    const message=`Dear S/M, OTP for EMIS is :  ${OTP} Thank you , DTE, Mumbai`

  const encryp_password = crypto.createHash('sha1').update(password).digest('hex');
  const key = generateKey(message);
  const sql=await update_table("users_new","username",uname,['latest_otp'],[`${OTP}`])
  const data = {
    username,
    password: encryp_password,
    senderid,
    content: message,
    smsservicetype: 'otpmsg',
    mobileno,
    key,
    templateid,
  };

  const postData = qs.stringify(data); 

  const options = {
    hostname: 'msdgweb.mgov.gov.ind',
    path: '/esms/sendsmsrequestDLT',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length,
    },
    // Enable SSL verification for production (remove rejectUnauthorized if using a trusted certificate)
    rejectUnauthorized: false,
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        resolve(responseBody);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

export  { sendOtpSMS }; // Export the function as a module