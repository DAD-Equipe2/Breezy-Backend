const jwt = require("jsonwebtoken");

const generateToken = ({ id, username }) => {
  return jwt.sign(
    { id, username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;

