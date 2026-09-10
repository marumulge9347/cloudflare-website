const express = require("express");

const {
  generateArticleController,
  generateSEOController,
  improveContentController,
} = require("../controllers/aiController");

const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);

router.post("/article", generateArticleController);

router.post("/seo", generateSEOController);

router.post("/improve", improveContentController);

module.exports = router;
