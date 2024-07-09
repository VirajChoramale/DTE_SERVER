import jsonwebtoken from 'jsonwebtoken';
import { verify_user } from '../controllers/Login.mjs';
import cookieParser from "cookie-parser";
 


const verifyToken = async (req, res, next) => {
  if (req.cookies.eid.expires) {
    return res.send({
      msg:"Token Error",
      status:302
    })
  }
  const udata = (JSON.parse(req.cookies.eid));
  try {
   
   
    const token =udata.token; 

    if (!token) {
      console.log(token)
      return res.send({
        msg:"Token Error",
        status:302
      })
    }
      const decoded =  jsonwebtoken.verify(token, process.env.HMAC);
    
      req.user = decoded; 
      next(); 
    } catch (error) {
      // Check for specific errors
       if (error.name === 'TokenExpiredError') {
          return res.status(401).json({
            code: 401,
            msg: "Token expired",
          });
    }
       else if (error.name == 'SyntaxError') {
        return 
    }
    
        // Handle other JWT errors
        console.error('Error verifying token:', error);
        return res.status(403).redirect("/")
      }

}
    

const verifyOtpToken = async (req, res, next) => {
  if (req.cookies.eid.expires< Date.now()) {
    return res.send({
      msg:"Token Error",
      status:302
    })
  }
  const udata = (JSON.parse(req.cookies.oid));
  
    const token =udata.token; 
  
    if (!token) {
      return res.send({
        msg:"Token Error",
        status:302
      })
    }
  
    
    try {
      const decoded =  jsonwebtoken.verify(token, process.env.HMAC);
    
      req.user = decoded; 
      next(); 
    } catch (error) {
      // Check for specific errors
    
       
        return res.send({
          msg: "Token Expired",
          status:302
        })
        
    
        // Handle other JWT errors
        
      }

    }
const Auth_req = (role) => {
  return (req, res, next) => {
    if(req.user.role!=role)
    {
      return res.send({
        msg: "Access denied!!",
        status:302
      })
    } else {
      next();
   }
    
 }

}

export {verifyToken,verifyOtpToken,Auth_req}