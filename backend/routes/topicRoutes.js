const express = require("express");
const { query } = require("../config/db");

const router = express.Router();

// GET topics by subject ID
router.get("/:subjectId", async (req, res) => {
  try {
    const { sortBy } = req.query;

    let orderClause;
    switch (sortBy) {
      case "difficulty":
        orderClause =
          "CASE t.difficulty " +
          "WHEN 'beginner' THEN 1 " +
          "WHEN 'intermediate' THEN 2 " +
          "WHEN 'advanced' THEN 3 " +
          "ELSE 4 END, " +
          "t.chapter ASC, t.\"order\" ASC";
        break;
      case "title":
        orderClause = "t.title ASC";
        break;
      case "chapter":
      default:
        orderClause = "t.chapter ASC, t.\"order\" ASC";
        break;
    }

    const result = await query(
      `SELECT
        t.id AS _id,
        t.title,
        t.chapter,
        t.chapter_title AS "chapterTitle",
        t."order",
        t.difficulty,
        t.notes,
        t.summary,
        t.content,
        t."references",
        json_build_object('_id', s.id, 'name', s.name, 'level', s.level) AS subject
      FROM topics t
      JOIN subjects s ON t.subject_id = s.id
      WHERE t.subject_id = $1
      ORDER BY ${orderClause}`,
      [req.params.subjectId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single topic by ID
router.get("/detail/:topicId", async (req, res) => {
  try {
    const result = await query(
      `SELECT
        t.id AS _id,
        t.title,
        t.chapter,
        t.chapter_title AS "chapterTitle",
        t."order",
        t.difficulty,
        t.notes,
        t.summary,
        t.content,
        t."references",
        json_build_object('_id', s.id, 'name', s.name, 'level', s.level) AS subject
      FROM topics t
      JOIN subjects s ON t.subject_id = s.id
      WHERE t.id = $1`,
      [req.params.topicId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
