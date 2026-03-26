import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  console.log("BODY:", req.body);

  try {
    const { name, email, password } = req.body;

    // ✅ SAFE VALIDATION
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const lowerEmail = email?.toLowerCase();

    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: lowerEmail,
      password: hashed
    });

    res.json({
      message: "Registered successfully",
      user: newUser
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message }); // 🔥 REAL ERROR
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  console.log("LOGIN BODY:", req.body);

  try {
    const { email, password } = req.body;

    // ✅ SAFE VALIDATION
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const lowerEmail = email?.toLowerCase();

    const user = await User.findOne({ email: lowerEmail });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret123"
    );

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message }); // 🔥 REAL ERROR
  }
});

export default router;
