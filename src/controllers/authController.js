const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });

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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .json({
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
        accessToken
        }
    })
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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .json({
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
        accessToken
      }
    });
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json(
      { success: false,
        message: "Pas de token"
      });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json(
        { success: false,
          message: "Token invalide"
        });
    }
    const accessToken = generateAccessToken(user);
    res.json({ success: true, accessToken });
  } catch (err) {
    res.status(401).json(
      { success: false,
        message: "Token invalide / expiré"
      });
  }
}

const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json(
      { success: false, 
        message: "Pas de token"
      });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    await User.findByIdAndUpdate(decoded.id, { refreshToken: "" });
  } catch (err) {}

  res.clearCookie("refreshToken")
  res.json(
    { success: true,
      message: "Déconnexion réussie"
    });
}

module.exports = { register, login, refreshToken, logout };
