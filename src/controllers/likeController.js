const Post = require("../models/Post");
const Like = require("../models/Like");

const likePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const existingLike = await Like.findOne({ post: postId, user: userId });
    if (existingLike) {
      res.status(400);
      throw new Error("Vous avez déjà liké ce post");
    }

    const newLike = await Like.create({ post: postId, user: userId });
    await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });

    res.status(201).json({ success: true, data: newLike });
  } catch (err) {
    next(err);
  }
};

const unlikePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const deleted = await Like.findOneAndDelete({ post: postId, user: userId });
    if (!deleted) {
      res.status(400);
      throw new Error("Vous n’avez pas liké ce post");
    }

    await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });

    res.json({ success: true, message: "Like retiré" });
  } catch (err) {
    next(err);
  }
};

const getPostLikes = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const likes = await Like.find({ post: postId }).populate("user", "username avatarURL");
    res.json({ success: true, data: likes });
  } catch (err) {
    next(err);
  }
};

module.exports = { likePost, unlikePost, getPostLikes };
