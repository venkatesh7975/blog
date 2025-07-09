import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; //read the token from the header
  console.log("authheader", authHeader);
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, "secret_key"); // verify the token using secret key

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
