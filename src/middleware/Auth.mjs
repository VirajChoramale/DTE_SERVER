import jsonwebtoken from 'jsonwebtoken';
import { verify_user } from '../controllers/Login.mjs';


const verifyToken = async (req, res, next) => {
    
    const token = req.cookies.tid;
  
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing access token' });
    }
  
    
    try {
      const decoded = jsonwebtoken.verify(token, process.env.HMAC);
      req.user = decoded; // Attach decoded user information to request object (optional)
      next(); 
    } catch (error) {
        // Check for specific errors
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({
            code: 401,
            msg: "Token expired",
          });
        }
    
        // Handle other JWT errors
        console.error('Error verifying token:', error);
        return res.status(403).json({
          code: 403,
          msg: "Failed to authenticate token",
        });
      }

    }
const Auth_req=(res,req,next)=>{
    console.log(req.cookies);
    //const decode=jsonwebtoken.decode(req.cookis.eid);
    // /console.log(decode)

}

export {verifyToken,Auth_req}