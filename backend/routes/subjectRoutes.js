const express = require("express");
const { query } = require("../config/db");

const router = express.Router();

// GET all subjects
router.get("/", async (req, res) => {
  try {
    const result = await query("SELECT id AS _id, name, level FROM subjects ORDER BY name");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET single subject by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await query("SELECT id AS _id, name, level FROM subjects WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Subject not found" });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
