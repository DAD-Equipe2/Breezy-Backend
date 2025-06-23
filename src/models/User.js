const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Le nom d’utilisateur est requis"],
      unique: true,
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      required: [true, "L’email est requis"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
    },
    bio: {
      type: String,
      default: "",
      maxlength: 100,
    },
    avatarURL: {
      type: String,
      default: "",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    role: {
      type: String,
      enum: ["user", "moderator", "administrator"],
      default: "user",
    },
    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
