const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { env } = require("../config/env");

function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

function comparePassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

function createToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    },
  );
}

function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

module.exports = {
  hashPassword,
  comparePassword,
  createToken,
  verifyToken,
};
