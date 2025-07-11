const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
  let token;
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  
  if (!token) {
    console.log("Token extrait :", token);
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error("Non autorisé, token manquant"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé :", decoded);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    console.error("Erreur JWT:", err.message);
    res.status(401);
    return next(new Error("Token non valide"));
  }
}

async function visitorOrAdmin(req, res, next) {
  let token;

  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token){
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === "administrator"){
      req.user = decoded
      return next()
    }
    return res.status(403).json({ success: false, message: "Accès interdit : Vous avez déjà un compte !" });
  } catch {
    return next();
  }
}


module.exports = {authMiddleware, visitorOrAdmin}
