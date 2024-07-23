import jsonwebtoken, { decode } from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const { exp } = jsonwebtoken.decode(token);

      if (exp && exp > Math.floor(Date.now() / 1000)) {
        const decodedToken = jsonwebtoken.verify(token, process.env.HMAC);
        console.log(decodedToken);
        req.user = decodedToken;

        next();
      } else {
        res.status(401).send({ msg: "msg: 'Token Expired'," });
      }
    } catch (error) {
      console.log(error);
      return res.status(401).send({
        //ip blacklisting logic
        msg: `Token Verification Failed+${error.message}`,
        status: 401,
      });
    }
  } else {
    console.log(error);
    return res.status(401).send({
      msg: "Missing Token",
      status: 401,
    });
  }
};

const Auth_req = (role) => {
  return (req, res, next) => {
    if (req.user.role != role) {
      return res.status(401).send({
        msg: "Access denied!!",
        status: 401,
      });
    } else {
      next();
    }
  };
};

export { verifyToken, Auth_req };
