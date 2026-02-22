const express = require("express");
const Topic = require("../models/Topic");

const router = express.Router();

// GET topics by subject ID
router.get("/:subjectId", async (req, res) => {
  try {
    const topics = await Topic.find({ subject: req.params.subjectId })
      .populate("subject", "name level");

    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;