const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");

const getMe = async (req, res, next) => {
  try {
    res.json({ success: true, data: req.user });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: "ID utilisateur manquant" });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "ID utilisateur invalide" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("author", "username avatarURL");

    return res.json({
      success: true,
      data: { user, posts },
    });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { bio, avatarURL } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }
    if (typeof bio === "string") user.bio = bio;
    if (typeof avatarURL === "string") user.avatarURL = avatarURL;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMe,
  getProfile,
  updateProfile,
};
