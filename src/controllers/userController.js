const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Like = require("../models/Like")
const Follow = require("../models/Follow");

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
    const { username, bio, avatarURL } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }
    if (typeof username === "string" && username.trim()) user.username = username.trim();
    if (typeof bio === "string") user.bio = bio;
    if (typeof avatarURL === "string") user.avatarURL = avatarURL;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
      return res.status(409).json({ success: false, message: "Ce nom d'utilisateur est déjà pris." });
    }
    next(err);
  }
};

const searchProfiles = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Query manquante" });

  const regex = new RegExp(query, "i");
  try {
    const users = await User.find({ username: regex })
      .select("_id username followers following")
      .lean();

    const usersWithCounts = users.map(user => ({
      _id: user._id,
      username: user.username,
      followersCount: user.followers ? user.followers.length : 0,
      followingCount: user.following ? user.following.length : 0,
    }));

    res.json(usersWithCounts);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const deleteProfile = async (req, res, next) => {
  try {

    const userId = req.user._id;

    await Post.deleteMany({ author: userId });
    await Comment.deleteMany({ author: userId });
    await Like.deleteMany({ user: userId });
    await Follow.deleteMany({ $or: [{ follower: userId }, { following: userId }] });

    await User.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );
    await User.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );
    
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }
    res.json({ success: true, message: "Profil supprimé avec succès" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMe,
  getProfile,
  updateProfile,
  searchProfiles,
  deleteProfile
};
