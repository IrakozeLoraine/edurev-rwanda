const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
  questionText: String,
  options: [String],
  correctAnswer: Number
});

module.exports = mongoose.model("Question", questionSchema);