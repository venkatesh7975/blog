import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import postRoutes from "./routes/postRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

// Use more specific base paths for clarity
app.use("/api", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

connectDB();

app.listen(3002, () => {
  console.log("Server running on http://localhost:3002");
});
