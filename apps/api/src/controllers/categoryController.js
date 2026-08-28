const Category = require("../models/Category");

const slugify = require("../utils/slugify");

async function createCategory(req, res, next) {
  try {
    const { name, description = "" } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const slug = slugify(name);

    const existing = await Category.findOne({
      $or: [{ name: name.trim() }, { slug }],
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      slug,
      description,
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
}

async function getCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
}

async function getCategory(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { name, description, active } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (name) {
      category.name = name.trim();

      category.slug = slugify(name);
    }

    if (description !== undefined) {
      category.description = description;
    }

    if (active !== undefined) {
      category.active = active;
    }

    await category.save();

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category deleted",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
