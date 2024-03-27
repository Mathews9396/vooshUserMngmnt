const jwt = require("jsonwebtoken");
const { BlacklistJWT } = require("@models");

// Middleware for checking if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    let existingJWT = await BlacklistJWT.findOne({ where: { blacklistedJWTs: token } });
    if (existingJWT) {
      return res.status(401).json({ message: "Please login again to continue!" });
    }
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        /*
          err = {
            name: 'TokenExpiredError',
            message: 'jwt expired',
            expiredAt: 1408621000
          }
        */
        return res.status(401).json({ message: "Unauthorized: Invalid token", error: err.message });
      } else {
        req.user = decoded;
        next();
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized: Invalid token", error: error.message });
  }
};
