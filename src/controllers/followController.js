const Follow = require("../models/Follow");
const User = require("../models/User");

const followUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const followerId = req.user._id;

    if (followerId.toString() === targetUserId) {
      res.status(400);
      throw new Error("Vous ne pouvez pas vous suivre vous-même");
    }

    const existing = await Follow.findOne({ follower: followerId, following: targetUserId });
    if (existing) {
      res.status(400);
      throw new Error("Vous suivez déjà cet utilisateur");
    }

    await Follow.create({ follower: followerId, following: targetUserId });
    await User.findByIdAndUpdate(targetUserId, { $push: { followers: followerId } });
    await User.findByIdAndUpdate(followerId, { $push: { following: targetUserId } });

    res.status(201).json({ success: true, message: "Utilisateur suivi !" });
  } catch (err) {
    next(err);
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const followerId = req.user._id;

    const deleted = await Follow.findOneAndDelete({ follower: followerId, following: targetUserId });
    if (!deleted) {
      res.status(400);
      throw new Error("Vous ne suivez pas cet utilisateur");
    }

    await User.findByIdAndUpdate(targetUserId, { $pull: { followers: followerId } });
    await User.findByIdAndUpdate(followerId, { $pull: { following: targetUserId } });

    res.json({ success: true, message: "Utilisateur non suivi" });
  } catch (err) {
    next(err);
  }
};

const getFollowers = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("followers", "username avatarURL");
    if (!user) {
      res.status(404);
      throw new Error("Utilisateur non trouvé");
    }
    res.json({ success: true, data: user.followers });
  } catch (err) {
    next(err);
  }
};

const getFollowing = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("following", "username avatarURL");
    if (!user) {
      res.status(404);
      throw new Error("Utilisateur non trouvé");
    }
    res.json({ success: true, data: user.following });
  } catch (err) {
    next(err);
  }
};

module.exports = { followUser, unfollowUser, getFollowers, getFollowing };
