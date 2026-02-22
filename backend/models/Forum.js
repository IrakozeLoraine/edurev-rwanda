const mongoose = require("mongoose");

const forumPostSchema = new mongoose.Schema({
  topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String
}, { timestamps: true });

module.exports = mongoose.model("ForumPost", forumPostSchema);