const express = require("express");
const Subject = require("../models/Subject");

const router = express.Router();

// GET all subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;