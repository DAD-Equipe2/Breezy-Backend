const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const register = async (req, res, next) => {
  try {
    const { username, email, password, bio } = req.body;

    const exists = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "Email ou pseudo déjà utilisé" });
    }

    let avatarURL = "";
    if (req.file) {
      avatarURL = `/uploads/avatars/${req.file.filename}`;
    } else if (req.body.avatarURL) {
      avatarURL = req.body.avatarURL;
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashed,
      bio: bio || "",
      avatarURL,
    });

    const token = jwt.sign(
      { id: user._id.toString(), username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatarURL: user.avatarURL,
        followers: user.followers,
        following: user.following,
        createdAt: user.createdAt,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};


const login = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Identifiants invalides" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Identifiants invalides" });
    }

    const token = jwt.sign(
      { id: user._id.toString(), username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatarURL: user.avatarURL,
        followers: user.followers,
        following: user.following,
        createdAt: user.createdAt,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
