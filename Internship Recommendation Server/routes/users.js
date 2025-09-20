const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("profile");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user.profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
router.put("/profile", auth, async (req, res) => {
  try {
    const { skills, ...updateData } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    Object.assign(user.profile, updateData);
    user.profile.skills = skills.split(",").map((s) => s.trim());
    await user.save();
    res.json({ msg: "Profile updated successfully", profile: user.profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
module.exports = router;
