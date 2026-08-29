const Post = require("../models/Post");
const Category = require("../models/Category");
const Tag = require("../models/Tag");

const { getPagination, paginationResponse } = require("../utils/pagination");

/*
|--------------------------------------------------------------------------
| GET PUBLIC POSTS
|--------------------------------------------------------------------------
|
| GET /api/public/posts
|
| Examples:
|
| /api/public/posts
| /api/public/posts?page=1&limit=10
| /api/public/posts?search=cloudflare
| /api/public/posts?category=cloudflare
| /api/public/posts?tag=workers
|--------------------------------------------------------------------------
*/

async function getPublicPosts(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const { search, category, tag } = req.query;

    /*
    |--------------------------------------------------------------------------
    | IMPORTANT:
    | Public API ALWAYS returns published posts.
    |--------------------------------------------------------------------------
    */

    const filter = {
      status: "published",
    };

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
    | Category by slug
    |--------------------------------------------------------------------------
    */

    if (category) {
      const categoryDoc = await Category.findOne({
        slug: category.toLowerCase(),
        active: true,
      });

      if (!categoryDoc) {
        return res.json({
          success: true,
          posts: [],
          pagination: paginationResponse(page, limit, 0),
        });
      }

      filter.category = categoryDoc._id;
    }

    /*
    |--------------------------------------------------------------------------
    | Tag by slug
    |--------------------------------------------------------------------------
    */

    if (tag) {
      const tagDoc = await Tag.findOne({
        slug: tag.toLowerCase(),
        active: true,
      });

      if (!tagDoc) {
        return res.json({
          success: true,
          posts: [],
          pagination: paginationResponse(page, limit, 0),
        });
      }

      filter.tags = tagDoc._id;
    }

    /*
    |--------------------------------------------------------------------------
    | Get posts + total
    |--------------------------------------------------------------------------
    */

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate("category", "name slug")
        .populate("tags", "name slug")
        .populate("author", "name")
        .select(
          "title slug excerpt featuredImage category tags author publishedAt createdAt views seo",
        )
        .sort({
          publishedAt: -1,
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
| GET PUBLIC POST BY SLUG
|--------------------------------------------------------------------------
|
| GET /api/public/posts/:slug
|--------------------------------------------------------------------------
*/

async function getPublicPostBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({
      slug: slug.toLowerCase(),
      status: "published",
    })
      .populate("category", "name slug description")
      .populate("tags", "name slug description")
      .populate("author", "name");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Published post not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Increment view count
    |--------------------------------------------------------------------------
    */

    await Post.updateOne(
      {
        _id: post._id,
      },
      {
        $inc: {
          views: 1,
        },
      },
    );

    /*
    |--------------------------------------------------------------------------
    | Return public article
    |--------------------------------------------------------------------------
    */

    res.json({
      success: true,

      post: {
        id: post._id,

        title: post.title,

        slug: post.slug,

        excerpt: post.excerpt,

        content: post.content,

        featuredImage: post.featuredImage,

        category: post.category,

        tags: post.tags,

        author: post.author,

        publishedAt: post.publishedAt,

        views: post.views + 1,

        seo: {
          metaTitle: post.seo?.metaTitle || post.title,

          metaDescription: post.seo?.metaDescription || post.excerpt,

          keywords: post.seo?.keywords || [],

          canonicalUrl: post.seo?.canonicalUrl || "",
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| GET PUBLIC CATEGORIES
|--------------------------------------------------------------------------
|
| GET /api/public/categories
|--------------------------------------------------------------------------
*/

async function getPublicCategories(req, res, next) {
  try {
    const categories = await Category.find({
      active: true,
    })
      .sort({
        name: 1,
      })
      .select("name slug description");

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| GET PUBLIC TAGS
|--------------------------------------------------------------------------
|
| GET /api/public/tags
|--------------------------------------------------------------------------
*/

async function getPublicTags(req, res, next) {
  try {
    const tags = await Tag.find({
      active: true,
    })
      .sort({
        name: 1,
      })
      .select("name slug description");

    res.json({
      success: true,
      tags,
    });
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| GET FEATURED / LATEST POSTS
|--------------------------------------------------------------------------
|
| GET /api/public/featured
|--------------------------------------------------------------------------
*/

async function getFeaturedPosts(req, res, next) {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 20);

    const posts = await Post.find({
      status: "published",
    })
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .select(
        "title slug excerpt featuredImage category tags publishedAt views",
      )
      .sort({
        publishedAt: -1,
      })
      .limit(limit);

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPublicPosts,
  getPublicPostBySlug,
  getPublicCategories,
  getPublicTags,
  getFeaturedPosts,
};
