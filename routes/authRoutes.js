import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  console.log("BODY:", req.body); // 🔥 DEBUG LINE

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log("VALIDATION FAILED"); // 🔥 DEBUG
      return res.status(400).json({ message: "All fields required" });
    }

    const lowerEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) {
      console.log("USER EXISTS"); // 🔥 DEBUG
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: lowerEmail,
      password: hashed
    });

    console.log("USER CREATED SUCCESS"); // 🔥 DEBUG

    res.json({ message: "Registered successfully" });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  console.log("LOGIN BODY:", req.body); // 🔥 DEBUG

  try {
    const { email, password } = req.body;

    const lowerEmail = email.toLowerCase();

    const user = await User.findOne({ email: lowerEmail });

    if (!user) {
      console.log("USER NOT FOUND"); // 🔥 DEBUG
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("WRONG PASSWORD"); // 🔥 DEBUG
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret123"
    );

    console.log("LOGIN SUCCESS"); // 🔥 DEBUG

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
