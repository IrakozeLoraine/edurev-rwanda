const express = require("express");
const Question = require("../models/Question");

const router = express.Router();

// GET questions by topic ID (correctAnswer excluded)
router.get("/:topicId", async (req, res) => {
  try {
    const questions = await Question.find({ topic: req.params.topicId }).select("-correctAnswer");
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST submit answers and get score + correct answers
router.post("/:topicId/submit", async (req, res) => {
  try {
    const { answers } = req.body; // { [questionId]: selectedIndex }
    const questions = await Question.find({ topic: req.params.topicId });

    let score = 0;
    const results = questions.map((q) => {
      const selected = answers?.[q._id.toString()];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) score++;
      return { questionId: q._id, correctAnswer: q.correctAnswer, isCorrect };
    });

    res.json({ score, total: questions.length, results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
