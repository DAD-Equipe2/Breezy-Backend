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
      parent: null,
      children: [],
    });
    res.status(201).json({ success: true, data: newComment });
  } catch (err) {
    next(err);
  }
};

const replyToComment = async (req, res, next) => {
  try {
    const { content, parentId, postId } = req.body;
    if (!content || content.length === 0) {
      res.status(400);
      throw new Error("Le contenu du commentaire est requis");
    }

    const reply = await Comment.create({
      post: postId,
      author: req.user._id,
      content,
      parent: parentId,
      children: [],
    });

    await Comment.findByIdAndUpdate(parentId, { $push: { children: reply._id } })

    res.status(201).json({ success: true, data: reply });
  } catch (err) {
    next(err);
  }
}

async function populateAllChildren(comment) {
  await comment.populate("author", "username avatarURL");
  await comment.populate({
    path: "children",
    populate: { path: "author", select: "username avatarURL" }
  });
  for (let child of comment.children) {
    await populateAllChildren(child);
  }
}

const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    let comments = await Comment.find({ post: postId, parent: null })
      .sort({ createdAt: 1 })
      .populate("author", "username avatarURL")
      .populate({
        path: "children",
        populate: { path: "author", select: "username avatarURL" }
      });

    for (let comment of comments) {
      await populateAllChildren(comment);
    }

    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
};

const deleteCommentRecursively = async (commentId) => {
  const c = await Comment.findById(commentId);
  if (!c) return;
  for (const childId of c.children) {
    await deleteCommentRecursively(childId);
  }
  await Comment.findByIdAndDelete(commentId);
};

const deleteComment = async (req, res, next) => {
  try {
    const { id  } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      res.status(404);
      throw new Error("Commentaire non trouvé");
    }
    if (comment.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Action interdite");
    }

    await deleteCommentRecursively(id);
    res.json({ success: true, message: "Commentaire supprimé" });
  } catch (err) {
    next(err);
  }
}

module.exports = { addComment, replyToComment, getComments, deleteComment };
