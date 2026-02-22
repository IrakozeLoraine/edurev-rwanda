const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  title: { type: String, required: true },
  notes: String,
  references: [String]
});

module.exports = mongoose.model("Topic", topicSchema);