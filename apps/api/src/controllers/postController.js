const mongoose = require("mongoose");

const Post = require("../models/Post");
const Category = require("../models/Category");
const Tag = require("../models/Tag");

const slugify = require("../utils/slugify");

const { getPagination, paginationResponse } = require("../utils/pagination");
const markdownToHtml = require("../utils/markdown");



/*
|--------------------------------------------------------------------------
| Helper: Validate MongoDB ObjectId
|--------------------------------------------------------------------------
*/

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/*
|--------------------------------------------------------------------------
| Helper: Generate unique slug
|--------------------------------------------------------------------------
*/

async function generateUniqueSlug(title, excludeId = null) {
  const baseSlug = slugify(title);

  if (!baseSlug) {
    throw new Error("Unable to generate slug from title");
  }

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const query = {
      slug,
    };

    if (excludeId) {
      query._id = {
        $ne: excludeId,
      };
    }

    const existing = await Post.findOne(query);

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

/*
|--------------------------------------------------------------------------
| Create Post
|--------------------------------------------------------------------------
|
| POST /api/posts
|--------------------------------------------------------------------------
*/

async function createPost(req, res, next) {
  try {
    const {
      title,
      excerpt = "",
      content = "",
      featuredImage = "",
      status = "draft",
      category = null,
      tags = [],
      seo = {},
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post title is required",
      });
    }

    if (!["draft", "published", "archived"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post status",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate category
    |--------------------------------------------------------------------------
    */

    if (category !== null) {
      if (!isValidObjectId(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      const categoryExists = await Category.findById(category);

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Validate tags
    |--------------------------------------------------------------------------
    */

    if (!Array.isArray(tags)) {
      return res.status(400).json({
        success: false,
        message: "Tags must be an array",
      });
    }

    for (const tagId of tags) {
      if (!isValidObjectId(tagId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid tag ID: ${tagId}`,
        });
      }
    }

    if (tags.length > 0) {
      const tagCount = await Tag.countDocuments({
        _id: {
          $in: tags,
        },
      });

      if (tagCount !== tags.length) {
        return res.status(400).json({
          success: false,
          message: "One or more tags do not exist",
        });
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Generate unique slug
    |--------------------------------------------------------------------------
    */

    const slug = await generateUniqueSlug(title);

    /*
    |--------------------------------------------------------------------------
    | Published date
    |--------------------------------------------------------------------------
    */

    const publishedAt = status === "published" ? new Date() : null;

    /*
    |--------------------------------------------------------------------------
    | Create post
    |--------------------------------------------------------------------------
    */

    const post = await Post.create({
      title: title.trim(),

      slug,

      excerpt: excerpt.trim(),

      content,

      featuredImage,

      status,

      category,

      tags,

      author: req.user.sub,

      seo: {
        metaTitle: seo.metaTitle || "",

        metaDescription: seo.metaDescription || "",

        keywords: Array.isArray(seo.keywords) ? seo.keywords : [],

        canonicalUrl: seo.canonicalUrl || "",
      },

      publishedAt,
    });

    /*
    |--------------------------------------------------------------------------
    | Return populated post
    |--------------------------------------------------------------------------
    */

    const populatedPost = await Post.findById(post._id)
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .populate("author", "name email");

    res.status(201).json({
      success: true,
      post: populatedPost,
    });
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| Get All Posts
|--------------------------------------------------------------------------
|
| GET /api/posts
|
| Query:
| ?page=1
| ?limit=10
| ?search=cloudflare
| ?status=draft
| ?category=ID
| ?tag=ID
|--------------------------------------------------------------------------
*/

async function getPosts(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const { search, status, category, tag } = req.query;

    const filter = {};

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      filter.$or = [
        {
          title: searchRegex,
        },
        {
          excerpt: searchRegex,
        },
        {
          content: searchRegex,
        },
      ];
    }

    /*
    |--------------------------------------------------------------------------
    | Status filter
    |--------------------------------------------------------------------------
    */

    if (status) {
      if (!["draft", "published", "archived"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status filter",
        });
      }

      filter.status = status;
    }

    /*
    |--------------------------------------------------------------------------
    | Category filter
    |--------------------------------------------------------------------------
    */

    if (category) {
      if (!isValidObjectId(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      filter.category = category;
    }

    /*
    |--------------------------------------------------------------------------
    | Tag filter
    |--------------------------------------------------------------------------
    */

    if (tag) {
      if (!isValidObjectId(tag)) {
        return res.status(400).json({
          success: false,
          message: "Invalid tag ID",
        });
      }

      filter.tags = tag;
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate("category", "name slug")
        .populate("tags", "name slug")
        .populate("author", "name email")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Post.countDocuments(filter),
    ]);

    res.json({
      success: true,

      posts,

      pagination: paginationResponse(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| Get Single Post
|--------------------------------------------------------------------------
|
| GET /api/posts/:id
|--------------------------------------------------------------------------
*/

async function getPost(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id)
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .populate("author", "name email");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| Update Post
|--------------------------------------------------------------------------
|
| PUT /api/posts/:id
|--------------------------------------------------------------------------
*/

async function updatePost(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const {
      title,
      excerpt,
      content,
      featuredImage,
      status,
      category,
      tags,
      seo,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Title
    |--------------------------------------------------------------------------
    */

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }

      post.title = title.trim();

      post.slug = await generateUniqueSlug(title, post._id);
    }

    /*
    |--------------------------------------------------------------------------
    | Basic fields
    |--------------------------------------------------------------------------
    */

    if (excerpt !== undefined) {
      post.excerpt = excerpt.trim();
    }

    if (content !== undefined) {
      post.content = content;
    }

    if (featuredImage !== undefined) {
      post.featuredImage = featuredImage;
    }

    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */

    if (category !== undefined) {
      if (category !== null) {
        if (!isValidObjectId(category)) {
          return res.status(400).json({
            success: false,
            message: "Invalid category ID",
          });
        }

        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
          return res.status(404).json({
            success: false,
            message: "Category not found",
          });
        }
      }

      post.category = category;
    }

    /*
    |--------------------------------------------------------------------------
    | Tags
    |--------------------------------------------------------------------------
    */

    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({
          success: false,
          message: "Tags must be an array",
        });
      }

      for (const tagId of tags) {
        if (!isValidObjectId(tagId)) {
          return res.status(400).json({
            success: false,
            message: `Invalid tag ID: ${tagId}`,
          });
        }
      }

      if (tags.length > 0) {
        const tagCount = await Tag.countDocuments({
          _id: {
            $in: tags,
          },
        });

        if (tagCount !== tags.length) {
          return res.status(400).json({
            success: false,
            message: "One or more tags do not exist",
          });
        }
      }

      post.tags = tags;
    }

    /*
    |--------------------------------------------------------------------------
    | SEO
    |--------------------------------------------------------------------------
    */

    if (seo !== undefined) {
      post.seo = {
        metaTitle: seo.metaTitle || "",

        metaDescription: seo.metaDescription || "",

        keywords: Array.isArray(seo.keywords) ? seo.keywords : [],

        canonicalUrl: seo.canonicalUrl || "",
      };
    }

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    if (status !== undefined) {
      if (!["draft", "published", "archived"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid post status",
        });
      }

      /*
      | Set publishedAt when
      | moving into published state.
      */

      if (status === "published" && post.status !== "published") {
        post.publishedAt = new Date();
      }

      /*
      | Clear publishedAt when
      | moving away from published.
      */

      if (status !== "published") {
        post.publishedAt = null;
      }

      post.status = status;
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .populate("author", "name email");

    res.json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| Delete Post
|--------------------------------------------------------------------------
|
| DELETE /api/posts/:id
|--------------------------------------------------------------------------
*/

async function deletePost(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};
