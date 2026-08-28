const express = require("express");

const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/", getCategories);

router.get("/:id", getCategory);

router.post("/", createCategory);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);

module.exports = router;
