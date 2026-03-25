import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token =
      req.headers.authorization ||
      req.body.token;

    if (!token) return res.status(401).json("No token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();
  } catch (err) {
    res.status(401).json("Invalid token");
  }
};

export default authMiddleware;