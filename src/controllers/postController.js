const Post = require("../models/Post");
const User = require("../models/User");

const createPost = async (req, res, next) => {
  try {
    const { content, tags, mediaURL } = req.body;
    if (!content || content.trim().length === 0) {
      res.status(400);
      throw new Error("Le contenu du post est requis");
    }
    if (content.length > 280) {
      res.status(400);
      throw new Error("Le contenu du post ne peut pas dépasser 280 caractères");
    }
    const newPost = await Post.create({
      author: req.user._id,
      content,
      tags: tags || [],
      mediaURL: mediaURL || "",
    });
    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    next(err);
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};

const getFeed = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const followings = user.following.concat([userId]);
    const posts = await Post.find({ author: { $in: followings } })
      .sort({ createdAt: -1 })
      .populate("author", "username avatarURL");
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404);
      throw new Error("Post non trouvé");
    }
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Action interdite");
    }
    await post.remove();
    res.json({ success: true, message: "Post supprimé" });
  } catch (err) {
    next(err);
  }
};

module.exports = { createPost, getUserPosts, getFeed, deletePost };