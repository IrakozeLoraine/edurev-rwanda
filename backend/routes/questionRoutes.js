const express = require("express");
const Question = require("../models/Question");

const router = express.Router();

// GET questions by topic ID
router.get("/:topicId", async (req, res) => {
  try {
    const questions = await Question.find({ topic: req.params.topicId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
