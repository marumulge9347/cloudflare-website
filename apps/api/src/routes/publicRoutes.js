const express = require("express");

const {
  getPublicPosts,
  getPublicPostBySlug,
  getPublicCategories,
  getPublicTags,
  getFeaturedPosts,
} = require("../controllers/publicController");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Blog Routes
|--------------------------------------------------------------------------
|
| NO AUTHENTICATION REQUIRED
|
*/

/*
| Posts
*/

router.get("/posts", getPublicPosts);

/*
| Single article
|
| This route must come after /posts.
*/

router.get("/posts/:slug", getPublicPostBySlug);

/*
| Categories
*/

router.get("/categories", getPublicCategories);

/*
| Tags
*/

router.get("/tags", getPublicTags);

/*
| Latest / featured posts
*/

router.get("/featured", getFeaturedPosts);

module.exports = router;
