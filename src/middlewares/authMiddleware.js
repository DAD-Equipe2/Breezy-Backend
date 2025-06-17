const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
  let token;
  const authHeader = req.headers.authorization;
  console.log("authHeader:", authHeader);

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    console.log("token extrait:", token);
  }

  if (!token) {
    res.status(401);
    return next(new Error("Non autorisé, token manquant"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded token:", decoded);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    console.error("Erreur JWT:", err.message);
    res.status(401);
    return next(new Error("Token non valide"));
  }
}

module.exports = authMiddleware;
