const express = require("express");
const router = express.Router();
const { addComment, replyToComment, getComments, deleteComment } = require("../controllers/commentController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

router.post("/", authMiddleware, authorizeRoles("user", "moderator", "administrator"), addComment);
router.post("/reply", authMiddleware, authorizeRoles("user", "moderator", "administrator"), replyToComment);
router.get("/post/:postId", authMiddleware, authorizeRoles("user", "moderator", "administrator"), getComments);

router.delete("/:id", authMiddleware, authorizeRoles("user", "moderator", "administrator"), deleteComment)

module.exports = router;
