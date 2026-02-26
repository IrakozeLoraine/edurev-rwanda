const express = require("express");
const Topic = require("../models/Topic");

const router = express.Router();

// GET topics by subject ID
router.get("/:subjectId", async (req, res) => {
  try {
    const { sortBy } = req.query;

    let sortOption;
    switch (sortBy) {
      case "difficulty":
        // beginner → intermediate → advanced
        sortOption = { difficulty: 1, chapter: 1, order: 1 };
        break;
      case "title":
        sortOption = { title: 1 };
        break;
      case "chapter":
      default:
        sortOption = { chapter: 1, order: 1 };
        break;
    }

    const topics = await Topic.find({ subject: req.params.subjectId })
      .sort(sortOption)
      .populate("subject", "name level");

    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single topic by ID
router.get("/detail/:topicId", async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.topicId)
      .populate("subject", "name level");

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;