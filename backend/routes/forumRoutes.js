const express = require("express");
const ForumPost = require("../models/Forum");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET all forum posts for a topic
router.get("/:topicId", async (req, res) => {
  try {
    const posts = await ForumPost.find({ topic: req.params.topicId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new forum post (authenticated)
router.post("/:topicId", protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const post = await ForumPost.create({
      topic: req.params.topicId,
      user: req.user,
      title,
      content,
    });

    const populated = await post.populate("user", "name");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;