const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader || !authHeader.startsWith("Bearer"))
      return res
        .status(401)
        .json({ message: "Access denied. No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "JWT_SECRETE_KEY");
    req.userData = decoded;
    next();
  } catch (err) {
    console.log("auth middleware: ", err);
    res
      .status(403)
      .json({ message: err.message || "Invalid token or expired token" });
  }
};

module.exports = authMiddleware;
