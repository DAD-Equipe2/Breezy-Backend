const express = require("express");
const router = express.Router();
const { addComment, replyToComment, getComments } = require("../controllers/commentController");
const  authMiddleware  = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, addComment);
router.post("/reply", authMiddleware, replyToComment);
router.get("/post/:postId", authMiddleware, getComments);

module.exports = router;
