const API_BASE = "/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },

    ...options,
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = {
      success: false,
      message: "Invalid server response",
    };
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

export function login(email, password) {
  return request("/auth/login", {
    method: "POST",

    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export function getCurrentUser() {
  return request("/auth/me");
}

export function logout() {
  return request("/auth/logout", {
    method: "POST",
  });
}

/*
|--------------------------------------------------------------------------
| Posts
|--------------------------------------------------------------------------
*/

export function getPosts(query = "") {
  return request(`/posts${query}`);
}

export function getPost(id) {
  return request(`/posts/${id}`);
}

export function createPost(post) {
  return request("/posts", {
    method: "POST",
    body: JSON.stringify(post),
  });
}

export function updatePost(id, post) {
  return request(`/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(post),
  });
}

export function deletePost(id) {
  return request(`/posts/${id}`, {
    method: "DELETE",
  });
}

/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
*/

export function getCategories() {
  return request("/categories");
}

export function createCategory(category) {
  return request("/categories", {
    method: "POST",
    body: JSON.stringify(category),
  });
}

export function getCategory(id) {
  return request(`/categories/${id}`);
}

export function updateCategory(id, category) {
  return request(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(category),
  });
}

export function deleteCategory(id) {
  return request(`/categories/${id}`, {
    method: "DELETE",
  });
}

/*
|--------------------------------------------------------------------------
| Tags
|--------------------------------------------------------------------------
*/

export function getTags() {
  return request("/tags");
}

export function createTag(tag) {
  return request("/tags", {
    method: "POST",
    body: JSON.stringify(tag),
  });
}
export function getTag(id) {
  return request(`/tags/${id}`);
}

export function updateTag(id, tag) {
  return request(`/tags/${id}`, {
    method: "PUT",
    body: JSON.stringify(tag),
  });
}

export function deleteTag(id) {
  return request(`/tags/${id}`, {
    method: "DELETE",
  });
}

/*
|--------------------------------------------------------------------------
| Public Blog
|--------------------------------------------------------------------------
*/

export function getPublicPosts(query = "") {
  return request(`/public/posts${query}`);
}

export function getPublicPost(slug) {
  return request(`/public/posts/${slug}`);
}

export function getPublicCategories() {
  return request("/public/categories");
}

export function getPublicTags() {
  return request("/public/tags");
}

export function getFeaturedPosts(limit = 5) {
  return request(`/public/featured?limit=${limit}`);
}

/*
|--------------------------------------------------------------------------
| AI Writer
|--------------------------------------------------------------------------
*/

export function generateAIArticle({
  topic,
  tone = "professional",
  length = "medium",
  keywords = [],
}) {
  return request("/ai/article", {
    method: "POST",

    body: JSON.stringify({
      topic,
      tone,
      length,
      keywords,
    }),
  });
}

export function generateAISEO({
  title,
  content,
}) {
  return request("/ai/seo", {
    method: "POST",

    body: JSON.stringify({
      title,
      content,
    }),
  });
}

export function improveAIContent({
  content,
  instruction,
}) {
  return request("/ai/improve", {
    method: "POST",

    body: JSON.stringify({
      content,
      instruction,
    }),
  });
}