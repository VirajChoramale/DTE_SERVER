import jsonwebtoken from "jsonwebtoken";
import { verify_user } from "../controllers/Login.mjs";
import cookieParser from "cookie-parser";

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  try {
    if (!token) {
      console.log(token);
      return res.send({
        msg: "Token Error",
        status: 302,
      });
    }
    const decoded = jsonwebtoken.verify(token, process.env.HMAC);

    req.user = decoded;
    next();
  } catch (error) {
    // Check for specific errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        code: 302,
        msg: "Token expired",
      });
    } else if (error.name == "SyntaxError") {
      return;
    }

    // Handle other JWT errors
    console.error("Error verifying token:", error);
    return res.status(403).redirect("/");
  }
};

const Auth_req = (role) => {
  return (req, res, next) => {
    if (req.user.role != role) {
      return res.send({
        msg: "Access denied!!",
        status: 302,
      });
    } else {
      next();
    }
  };
};

export { verifyToken, Auth_req };
