import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: "https://swing-for-good.vercel.app"
  })
);
// routes
app.use("/api/auth", authRoutes);

// DB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.log(err));

// test route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// server start
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});