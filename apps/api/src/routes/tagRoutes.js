const express = require("express");

const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const {
  createTag,
  getTags,
  getTag,
  updateTag,
  deleteTag,
} = require("../controllers/tagController");

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/", getTags);

router.get("/:id", getTag);

router.post("/", createTag);

router.put("/:id", updateTag);

router.delete("/:id", deleteTag);

module.exports = router;
