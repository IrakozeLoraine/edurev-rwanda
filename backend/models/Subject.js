const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: String,
  level: String, enum: ["O-level", "A-level"],
});

module.exports = mongoose.model("Subject", subjectSchema);