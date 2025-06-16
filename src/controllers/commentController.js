const Comment = require("../models/Comment");

const addComment = async (req, res, next) => {
  try {
    const { postId, content } = req.body;
    if (!content || content.length === 0) {
      res.status(400);
      throw new Error("Le contenu du commentaire est requis");
    }
    const newComment = await Comment.create({
      post: postId,
      author: req.user._id,
      content,
      replyTo: null,
    });
    res.status(201).json({ success: true, data: newComment });
  } catch (err) {
    next(err);
  }
};

const replyToComment = async (req, res, next) => {
  try {
    const { postId, content, parentCommentId } = req.body;
    if (!content || content.length === 0) {
      res.status(400);
      throw new Error("Le contenu du commentaire est requis");
    }
    const newComment = await Comment.create({
      post: postId,
      author: req.user._id,
      content,
      replyTo: parentCommentId,
    });
    res.status(201).json({ success: true, data: newComment });
  } catch (err) {
    next(err);
  }
};

const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: 1 })
      .populate("author", "username avatarURL")
      .populate("replies.author", "username avatarURL");
    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
};

module.exports = { addComment, replyToComment, getComments };
