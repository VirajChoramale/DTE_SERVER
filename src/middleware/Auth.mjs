import jsonwebtoken, { decode } from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  //return res.status(401).send();

  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const { exp } = jsonwebtoken.decode(token);
      if (exp && exp > Math.floor(Date.now() / 1000)) {
        const decodedToken = jsonwebtoken.verify(token, process.env.HMAC);

        req.user = decodedToken;
        next();
      }
    } catch (error) {
      return res.send({
        //ip blacklisting logic
        msg: `Token Verification Failed+${error.message}`,
        status: 302,
      });
    }
  } else {
    return res.send({
      msg: "Missing Token",
      status: 302,
    });
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
