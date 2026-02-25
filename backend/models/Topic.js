const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  title: { type: String, required: true },
  chapter: { type: Number, required: true, default: 1 },
  chapterTitle: { type: String, default: "" },
  order: { type: Number, required: true, default: 1 },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
  notes: String,
  references: [String]
});

module.exports = mongoose.model("Topic", topicSchema);