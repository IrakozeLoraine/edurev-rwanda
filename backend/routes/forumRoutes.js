const express = require("express");
const { query } = require("../config/db");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET all forum posts for a topic
router.get("/:topicId", async (req, res) => {
  try {
    const result = await query(
      `SELECT
        fp.id AS _id,
        fp.topic_id AS topic,
        fp.title,
        fp.content,
        fp.created_at AS "createdAt",
        fp.updated_at AS "updatedAt",
        json_build_object('_id', u.id, 'name', u.name) AS user
      FROM forum_posts fp
      JOIN users u ON fp.user_id = u.id
      WHERE fp.topic_id = $1
      ORDER BY fp.created_at DESC`,
      [req.params.topicId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST create a new forum post (authenticated)
router.post("/:topicId", protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const result = await query(
      `INSERT INTO forum_posts (topic_id, user_id, title, content)
       VALUES ($1, $2, $3, $4)
       RETURNING id AS _id, topic_id AS topic, title, content, created_at AS "createdAt", updated_at AS "updatedAt"`,
      [req.params.topicId, req.user, title, content]
    );
    const post = result.rows[0];

    const userResult = await query("SELECT id AS _id, name FROM users WHERE id = $1", [req.user]);
    post.user = userResult.rows[0];

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
