const express = require("express");

const { login, me, logout } = require("../controllers/authController");

const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);

router.get("/me", requireAuth, me);

router.post("/logout", logout);

module.exports = router;
