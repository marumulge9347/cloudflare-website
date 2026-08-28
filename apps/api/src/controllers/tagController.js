const Tag = require("../models/Tag");

const slugify = require("../utils/slugify");

async function createTag(req, res, next) {
  try {
    const { name, description = "" } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Tag name is required",
      });
    }

    const slug = slugify(name);

    const existing = await Tag.findOne({
      $or: [{ name: name.trim() }, { slug }],
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Tag already exists",
      });
    }

    const tag = await Tag.create({
      name: name.trim(),
      slug,
      description,
    });

    res.status(201).json({
      success: true,
      tag,
    });
  } catch (error) {
    next(error);
  }
}

async function getTags(req, res, next) {
  try {
    const tags = await Tag.find().sort({ name: 1 });

    res.json({
      success: true,
      tags,
    });
  } catch (error) {
    next(error);
  }
}

async function getTag(req, res, next) {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    res.json({
      success: true,
      tag,
    });
  } catch (error) {
    next(error);
  }
}

async function updateTag(req, res, next) {
  try {
    const { name, description, active } = req.body;

    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    if (name) {
      tag.name = name.trim();

      tag.slug = slugify(name);
    }

    if (description !== undefined) {
      tag.description = description;
    }

    if (active !== undefined) {
      tag.active = active;
    }

    await tag.save();

    res.json({
      success: true,
      tag,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteTag(req, res, next) {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    res.json({
      success: true,
      message: "Tag deleted",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTag,
  getTags,
  getTag,
  updateTag,
  deleteTag,
};
