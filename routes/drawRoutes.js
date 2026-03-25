import express from "express";
import User from "../models/User.js";

const router = express.Router();

// RUN DRAW
router.get("/run", async (req, res) => {
  try {
    // random 5 numbers
    const drawNumbers = [];
    while (drawNumbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!drawNumbers.includes(num)) {
        drawNumbers.push(num);
      }
    }

    const users = await User.find();

    const results = [];

    users.forEach((user) => {
      let matchCount = 0;

      user.scores.forEach((s) => {
        if (drawNumbers.includes(s.value)) {
          matchCount++;
        }
      });

      results.push({
        user: user.email,
        matches: matchCount
      });
    });

    res.json({
      drawNumbers,
      results
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;