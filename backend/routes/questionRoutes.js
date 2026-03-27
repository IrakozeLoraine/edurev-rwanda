const express = require("express");
const { query } = require("../config/db");

const router = express.Router();

// GET questions by topic ID (correctAnswer excluded)
router.get("/:topicId", async (req, res) => {
  try {
    const result = await query(
      "SELECT id AS _id, topic_id, question_text AS \"questionText\", options FROM questions WHERE topic_id = $1",
      [req.params.topicId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST submit answers and get score + correct answers
router.post("/:topicId/submit", async (req, res) => {
  try {
    const { answers } = req.body;
    const result = await query(
      "SELECT id AS _id, correct_answer AS \"correctAnswer\" FROM questions WHERE topic_id = $1",
      [req.params.topicId]
    );
    const questions = result.rows;

    let score = 0;
    const results = questions.map((q) => {
      const selected = answers?.[q._id];
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
