const express = require("express");
const router = express.Router();
const { followUser, unfollowUser, getFollowers, getFollowing } = require("../controllers/followController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/follow/:id", authMiddleware, followUser);
router.post("/unfollow/:id", authMiddleware, unfollowUser);
router.get("/followers/:id", authMiddleware, getFollowers);
router.get("/following/:id", authMiddleware, getFollowing);

module.exports = router;
