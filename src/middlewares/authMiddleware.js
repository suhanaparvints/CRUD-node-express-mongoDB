import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("authHeaders>>>", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  console.log("token>>>", token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded>>", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token or Expired" });
  }
};

export const verifyAdmin = async (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access Denied: Admin only" });
    }
    next();
  });
};

export const verifyUser = async (req, res, next) => {
  verifyToken(req, res, () => {
    next(); // any logged in user can access
  });
};
