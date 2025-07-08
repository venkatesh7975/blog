import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(req.user);
      req.user = { _id: decoded.id }; // Attach user ID to request
      console.log("Decoded JWT payload:", req.user);
      console.log("Decoded JWT payload:", decoded);

      next(); // Continue to next middleware/route
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

export default authMiddleware;
