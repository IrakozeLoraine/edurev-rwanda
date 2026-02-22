const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ["O-Level", "A-Level"], required: true },
});

module.exports = mongoose.model("Subject", subjectSchema);