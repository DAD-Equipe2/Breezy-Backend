const express = require("express");
const router = express.Router();
const { addComment, replyToComment, getComments, deleteComment } = require("../controllers/commentController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, addComment);
router.post("/reply", authMiddleware, replyToComment);
router.get("/post/:postId", authMiddleware, getComments);

router.delete("/:id", authMiddleware, deleteComment)

module.exports = router;
