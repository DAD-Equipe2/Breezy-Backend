const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Le contenu du post est requis"],
      maxlength: [280, "Le contenu ne peut pas dépasser 280 caractères"],
    },
    tags: [String],
    mediaURL: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);