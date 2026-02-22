const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  title: String,
  notes: String,
  references: [String]
});

module.exports = mongoose.model("Topic", topicSchema);