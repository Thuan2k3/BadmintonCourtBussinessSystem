const JWT = require("jsonwebtoken");

const authMiddleware = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];

      if (!token) {
        return res
          .status(401)
          .send({ message: "Token không tồn tại", success: false });
      }

      JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
          return res.status(401).send({
            message: "Auth Failed",
            success: false,
          });
        }

        req.body.userId = decode.id;
        req.user = decode;

        if (allowedRoles.length > 0 && !allowedRoles.includes(decode.role)) {
          return res.status(403).send({
            message: "Bạn không có quyền truy cập",
            success: false,
          });
        }

        next();
      });
    } catch (error) {
      console.log(error);
      res.status(401).send({
        message: "Auth Failed",
        success: false,
      });
    }
  };
};

module.exports = authMiddleware;
