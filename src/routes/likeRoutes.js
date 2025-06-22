const express = require("express");
const router = express.Router();
const { likePost, unlikePost, getPostLikes } = require("../controllers/likeController");
const { authMiddleware }  = require("../middlewares/authMiddleware");

router.post("/post/:id", authMiddleware, likePost);
router.delete("/post/:id", authMiddleware, unlikePost);
router.get("/post/:id", authMiddleware, getPostLikes);

module.exports = router;
