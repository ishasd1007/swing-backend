import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ADD SCORE
router.post("/add", async (req, res) => {
  try {
console.log("BODY:", req.body);
console.log("HEADERS:", req.headers);
    const { value } = req.body;

    const user = await User.findOne(); // temp

    if (!user) return res.status(404).json("User not found");

    // ⭐ PRD LOGIC
    if (user.scores.length >= 5) {
      user.scores.shift(); // oldest remove
    }

    user.scores.push({
      value,
      date: new Date()
    });

    await user.save();

    res.json(user.scores);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// GET SCORES
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    res.json(user.scores.reverse()); // latest first
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;