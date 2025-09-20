const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Internship = require("../models/Internship");
const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.isAdmin)
      return res.status(403).json({ msg: "Access denied: Not an admin." });
    next();
  } catch (err) {
    res.status(500).send("Server error");
  }
};
router.post("/internships", auth, adminAuth, async (req, res) => {
  try {
    const newInternship = new Internship(req.body);
    await newInternship.save();
    res.status(201).json(newInternship);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
router.put("/internships/:id", auth, adminAuth, async (req, res) => {
  try {
    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!internship)
      return res.status(404).json({ msg: "Internship not found" });
    res.json(internship);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
router.delete("/internships/:id", auth, adminAuth, async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    if (!internship)
      return res.status(404).json({ msg: "Internship not found" });
    res.json({ msg: "Internship removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
module.exports = router;
