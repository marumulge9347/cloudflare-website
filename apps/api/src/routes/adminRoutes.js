const express = require("express");

const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", requireAuth, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Admin dashboard access granted",
    user: req.user,
  });
});

module.exports = router;
