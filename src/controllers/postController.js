const Post = require("../models/Post");
const User = require("../models/User");
const path = require("path");
const Comment = require("../models/Comment");
const Like = require("../models/Like");

const createPost = async (req, res, next) => {
  try {
    const { content, tags } = req.body;
    if (!content?.trim()) {
      res.status(400);
      throw new Error("Le contenu du post est requis");
    }
    if (content.length > 280) {
      res.status(400);
      throw new Error("Le contenu du post ne peut pas dépasser 280 caractères");
    }

    let mediaURL = "";
    if (req.file) {
      const { filename, size } = req.file;
      const ext = path.extname(filename).toLowerCase();
      const isImage = [".png", ".jpg", ".jpeg", ".gif"].includes(ext);
      if (isImage && size > 5 * 1024 * 1024) {
        res.status(400);
        throw new Error("Image trop volumineuse (max 5 Mo)");
      }
      mediaURL = `/uploads/media/${filename}`;
    }

    const tagsArray =
      typeof tags === "string"
        ? JSON.parse(tags)
        : Array.isArray(tags)
        ? tags
        : [];

    const newPost = await Post.create({
      author: req.user._id,
      content,
      tags: tagsArray,
      mediaURL,
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    next(err);
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .populate("author", "username avatarURL");
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};

const getFeed = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const followings = user.following.concat([req.user._id]);
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
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error("Post non trouvé");
    }
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Action interdite");
    }

    await Comment.deleteMany({ post: post._id });
    await Like.deleteMany({ post: post._id });

    await Post.findByIdAndDelete(post._id);

    res.json({ success: true, message: "Post supprimé" });
  } catch (err) {
    next(err);
  }
};

const modifyPost = async (req, res, next) => {
  try {
    const { content, tags } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error("Post non trouvé");
    }
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Action interdite");
    }

    if (content?.trim()) {
      if (content.length > 280) {
        res.status(400);
        throw new Error("Le contenu du post ne peut pas dépasser 280 caractères");
      }
      post.content = content;
    }

    const tagsArray =
      typeof tags === "string"
        ? JSON.parse(tags)
        : Array.isArray(tags)
        ? tags
        : undefined;
    if (tagsArray) {
      post.tags = tagsArray;
    }
    if (req.body.removeMedia === "true") {
      post.mediaURL = "";
    } else if (req.file) {
      const { filename, size } = req.file;
      const ext = path.extname(filename).toLowerCase();
      const isImage = [".png", ".jpg", ".jpeg", ".gif"].includes(ext);
      if (isImage && size > 5 * 1024 * 1024) {
        res.status(400);
        throw new Error("Image trop volumineuse (max 5 Mo)");
      }
      post.mediaURL = `/uploads/media/${filename}`;
    }

    await post.save();
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

const searchPost = async (req, res, next) => {
    const { query } = req.query;
    if (!query) {
        res.status(400);
        return res.json({ error: 'Query parameter is required' });
    }
    try {
        const tagRegex = /#(\w+)/g;
        const tags = [];
        let match;
        while ((match = tagRegex.exec(query)) !== null) {
            tags.push(match[1]);
        }
        const contentQuery = query.replace(tagRegex, '').trim();

        const searchConditions = [];
        if (tags.length > 0) {
            searchConditions.push({ tags: { $in: tags } });
        }
        if (contentQuery) {
            searchConditions.push({ content: { $regex: contentQuery, $options: 'i' } });
        }

        const searchCriteria = searchConditions.length > 0 ? { $or: searchConditions } : {};

        const results = await Post.find(searchCriteria).limit(15).populate("author", "username avatarURL");
        res.json({ success: true, data: results });
    } catch (err) {
        next(err);
    }
};

module.exports = {
  createPost,
  getUserPosts,
  getFeed,
  deletePost,
  modifyPost,
  searchPost
};
