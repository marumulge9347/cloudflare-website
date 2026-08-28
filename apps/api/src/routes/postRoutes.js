const express = require("express");

const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| All post management routes require authentication
|--------------------------------------------------------------------------
*/

router.use(requireAuth, requireAdmin);

/*
|--------------------------------------------------------------------------
| GET /api/posts
|--------------------------------------------------------------------------
*/

router.get("/", getPosts);

/*
|--------------------------------------------------------------------------
| GET /api/posts/:id
|--------------------------------------------------------------------------
*/

router.get("/:id", getPost);

/*
|--------------------------------------------------------------------------
| POST /api/posts
|--------------------------------------------------------------------------
*/

router.post("/", createPost);

/*
|--------------------------------------------------------------------------
| PUT /api/posts/:id
|--------------------------------------------------------------------------
*/

router.put("/:id", updatePost);

/*
|--------------------------------------------------------------------------
| DELETE /api/posts/:id
|--------------------------------------------------------------------------
*/

router.delete("/:id", deletePost);

module.exports = router;
