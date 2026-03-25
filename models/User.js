import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  // PRD features
  isSubscribed: { type: Boolean, default: false },
  plan: { type: String, enum: ["monthly", "yearly"], default: "monthly" },

  scores: [
    {
      value: Number,
      date: Date
    }
  ],

  charity: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);