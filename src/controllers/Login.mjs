import { bcrypt_text,compare_bcrypt} from "../utility/bcrypt_js.mjs";
import jsonwebtoken from 'jsonwebtoken';
import { sendOtpSMS } from "../utility/otp.mjs";
import { select_from_table } from "../utility/Sql_Querries.mjs";
const HmacKey=process.env.HMAC;
import { executeReadQuery,executeWriteQuery} from "../db/db_operation.mjs";
import { update_table } from "../utility/Sql_Querries.mjs";
const verify_user= async(username,password)=>{
    const user=`select username,password,email,mobile from users_new where username='${username}'`; 
    try {
        const result=await executeReadQuery(user); 
      
        if (result.length>0){
            
                const authinticate=compare_bcrypt(password,result[0]['password']);
             
                if(authinticate){
                
                    return {
                        "res":true,
                        "data":result,
                        "msg":"Authentication Successfull",
                        "code":200


                    }
                }
                else{
                    return {
                        "res":false,
                        "data":null,
                        "msg":"Invalid Credentials!!",
                        "code":501
                    };
                }
        }else{
              return {
                "res":false,
                "data":null,
                "msg":"Invalid Credentials!!",
                "code":502

            };
        }
            
    } catch (error) {
        console.log(error)
    }
  
   

}
const login=async(req,res,next)=>{
   const resp=await verify_user(req.body.username,req.body.password);
   //console.log(req.body.username,req.body.password);
  if(resp.code==200){
    const uname = resp.data[0].username;
   const token=jsonwebtoken.sign({uname},HmacKey,{expiresIn:"120m",algorithm:"HS256"});
   await sendOtpSMS(resp.data[0].mobile,resp.data[0].username).then((res)=>{}).catch((e)=>console.log("error in sms api"+e));
   
  //console.log(resp.data[0].mobile)
   res.cookie("tid",token,{expire: 15000 + Date.now(),httpOnly: true, 
    secure: true, 
    sameSite: 'None' })
   res.status(200).send({"msg":resp.msg,"res":resp.res,"lid":token})
   next();

    
   }
   else{
    res.json(resp)
   }
 
}

const verify_otp=async(req,res)=>{
    const tes=await executeReadQuery(`select latest_otp,password,role from users_new where username='${req.user.uname}'`)
    if(tes[0].latest_otp==req.body.otp){
        const token =jsonwebtoken.sign({"uname":req.user.uname,"role":tes[0].role,"cred":tes[0].password},process.env.HMAC);
        const sql=await update_table("users_new","username",req.user.uname,['latest_otp'],[""])

        
        res.cookie("eid",token);
        res.status(200).json({
            "msg":"Validated",
             "role":tes[0].role,
             'lid':token

            
        });
    
    }
    else{
        res.status(200).json({
            "msg":"Invalid_Otp",
             "code":"401"

            
        })
    }
    
}
export {login,verify_otp,verify_user};