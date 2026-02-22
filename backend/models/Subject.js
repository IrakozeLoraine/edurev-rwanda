const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: String,
  level: String // O-Level or A-Level
});

module.exports = mongoose.model("Subject", subjectSchema);