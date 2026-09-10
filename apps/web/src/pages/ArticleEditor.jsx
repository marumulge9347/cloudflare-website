import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createPost,
  updatePost,
  getPost,
  getCategories,
  getTags,
  generateAIArticle,
  generateAISEO,
  improveAIContent,
} from "../lib/api";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  status: "draft",
  category: "",
  tags: [],
  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    canonicalUrl: "",
  },
};

export default function ArticleEditor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [keywordInput, setKeywordInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // AI state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAction, setAiAction] = useState("");
  const [aiTopic, setAiTopic] = useState("");
  const [aiInstruction, setAiInstruction] = useState(
    "Improve clarity, readability, structure and technical explanations.",
  );
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    loadEditor();
  }, [id]);

  async function loadEditor() {
    try {
      setLoading(true);
      setError("");

      const [categoryData, tagData] = await Promise.all([
        getCategories(),
        getTags(),
      ]);

      setCategories(categoryData.categories || []);
      setTags(tagData.tags || []);

      if (isEditing) {
        const postData = await getPost(id);
        const post = postData.post;

        setForm({
          title: post.title || "",
          excerpt: post.excerpt || "",
          content: post.content || "",
          featuredImage: post.featuredImage || "",
          status: post.status || "draft",

          category: post.category?._id || post.category || "",

          tags: Array.isArray(post.tags)
            ? post.tags.map((tag) =>
                typeof tag === "object" ? tag._id : tag,
              )
            : [],

          seo: {
            metaTitle: post.seo?.metaTitle || "",
            metaDescription: post.seo?.metaDescription || "",
            keywords: post.seo?.keywords || [],
            canonicalUrl: post.seo?.canonicalUrl || "",
          },
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateSeoField(field, value) {
    setForm((current) => ({
      ...current,
      seo: {
        ...current.seo,
        [field]: value,
      },
    }));
  }

  function toggleTag(tagId) {
    setForm((current) => {
      const exists = current.tags.includes(tagId);

      return {
        ...current,
        tags: exists
          ? current.tags.filter((id) => id !== tagId)
          : [...current.tags, tagId],
      };
    });
  }

  function addKeyword(event) {
    if (event.key !== "Enter" && event.key !== ",") {
      return;
    }

    event.preventDefault();

    const keyword = keywordInput.trim();

    if (!keyword) {
      return;
    }

    if (!form.seo.keywords.includes(keyword)) {
      updateSeoField("keywords", [...form.seo.keywords, keyword]);
    }

    setKeywordInput("");
  }

  function removeKeyword(keyword) {
    updateSeoField(
      "keywords",
      form.seo.keywords.filter((item) => item !== keyword),
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      let result;

      if (isEditing) {
        result = await updatePost(id, form);
      } else {
        result = await createPost(form);
      }

      setSuccess(
        isEditing
          ? "Article updated successfully."
          : "Article created successfully.",
      );

      if (!isEditing) {
        const createdId = result.post?._id;

        if (createdId) {
          navigate(`/posts/${createdId}/edit`);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ------------------------------------------------------------
  // AI: Generate Article
  // ------------------------------------------------------------

  async function handleAIGenerate() {
    if (!aiTopic.trim()) {
      setAiError("Enter a topic first.");
      return;
    }

    setAiLoading(true);
    setAiAction("generate");
    setAiError("");
    setError("");
    setSuccess("");

    try {
      const response = await generateAIArticle({
        topic: aiTopic.trim(),
        tone: "professional",
        length: "medium",
        keywords: form.seo.keywords,
      });

      setForm((current) => ({
        ...current,
        content: response.content || "",
      }));

      setSuccess("AI article generated successfully.");
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
      setAiAction("");
    }
  }

  // ------------------------------------------------------------
  // AI: Improve Content
  // ------------------------------------------------------------

  async function handleAIImprove() {
    if (!form.content.trim()) {
      setAiError("Write some content first.");
      return;
    }

    setAiLoading(true);
    setAiAction("improve");
    setAiError("");
    setError("");
    setSuccess("");

    try {
      const response = await improveAIContent({
        content: form.content,
        instruction: aiInstruction.trim(),
      });

      setForm((current) => ({
        ...current,
        content: response.content || "",
      }));

      setSuccess("Content improved successfully.");
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
      setAiAction("");
    }
  }

  // ------------------------------------------------------------
  // AI: Generate SEO
  // ------------------------------------------------------------

  async function handleAIGenerateSEO() {
    if (!form.title.trim()) {
      setAiError("Article title is required for SEO generation.");
      return;
    }

    if (!form.content.trim()) {
      setAiError("Article content is required for SEO generation.");
      return;
    }

    setAiLoading(true);
    setAiAction("seo");
    setAiError("");
    setError("");
    setSuccess("");

    try {
      const response = await generateAISEO({
        title: form.title,
        content: form.content,
      });

      const seo = response.seo || {};

      setForm((current) => ({
        ...current,

        seo: {
          ...current.seo,

          metaTitle: seo.metaTitle || "",

          metaDescription: seo.metaDescription || "",

          keywords: Array.isArray(seo.keywords)
            ? seo.keywords
            : current.seo.keywords,
        },
      }));

      setSuccess("SEO metadata generated successfully.");
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
      setAiAction("");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">
        <div className="mx-auto max-w-7xl rounded-xl bg-white p-8 shadow-sm">
          Loading editor...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Header */}

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Edit Article" : "Create Article"}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create, optimize and publish your blog article.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/posts")}
            className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-slate-50"
          >
            Back to Posts
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto max-w-7xl px-6 py-8">
        {/* Global messages */}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ================================================== */}
          {/* MAIN EDITOR */}
          {/* ================================================== */}

          <section className="space-y-6 lg:col-span-2">
            {/* Title */}

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <label className="block text-sm font-medium">
                Article Title
              </label>

              <input
                value={form.title}
                onChange={(event) =>
                  updateField("title", event.target.value)
                }
                placeholder="Enter article title..."
                className="mt-2 w-full rounded-lg border px-4 py-3 text-xl outline-none focus:ring-2"
                required
              />
            </div>

            {/* Excerpt */}

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <label className="block text-sm font-medium">
                Excerpt
              </label>

              <textarea
                value={form.excerpt}
                onChange={(event) =>
                  updateField("excerpt", event.target.value)
                }
                rows={4}
                placeholder="Short description of the article..."
                className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              />

              <p className="mt-1 text-xs text-slate-500">
                {form.excerpt.length}/500 characters
              </p>
            </div>

            {/* Content */}

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">
                  Content
                </label>

                <span className="text-xs text-slate-500">
                  {form.content.length} characters
                </span>
              </div>

              <textarea
                value={form.content}
                onChange={(event) =>
                  updateField("content", event.target.value)
                }
                rows={24}
                placeholder="Write your article here..."
                className="mt-2 w-full rounded-lg border px-4 py-3 font-mono text-sm leading-6 outline-none focus:ring-2"
                required
              />

              <p className="mt-2 text-xs text-slate-500">
                Markdown-style/plain text content is currently supported.
              </p>
            </div>

            {/* ================================================== */}
            {/* AI WRITER */}
            {/* ================================================== */}

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-lg font-semibold">
                  AI Writer
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Generate articles, improve content and create SEO metadata.
                </p>
              </div>

              {aiError && (
                <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                  {aiError}
                </div>
              )}

              {/* Generate Article */}

              <div className="mt-6 rounded-lg border bg-slate-50 p-4">
                <h3 className="font-medium">
                  Generate Article
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Give AI a topic and it will create article content.
                </p>

                <input
                  value={aiTopic}
                  onChange={(event) =>
                    setAiTopic(event.target.value)
                  }
                  placeholder="Example: Getting started with Cloudflare Workers"
                  className="mt-4 w-full rounded-lg border bg-white px-4 py-2 outline-none focus:ring-2"
                />

                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={aiLoading}
                  className="mt-3 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {aiLoading && aiAction === "generate"
                    ? "Generating..."
                    : "Generate Article"}
                </button>
              </div>

              {/* Improve Content */}

              <div className="mt-4 rounded-lg border bg-slate-50 p-4">
                <h3 className="font-medium">
                  Improve Content
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  AI will rewrite your existing content according to your instruction.
                </p>

                <textarea
                  value={aiInstruction}
                  onChange={(event) =>
                    setAiInstruction(event.target.value)
                  }
                  rows={3}
                  className="mt-4 w-full rounded-lg border bg-white px-4 py-2 text-sm outline-none focus:ring-2"
                />

                <button
                  type="button"
                  onClick={handleAIImprove}
                  disabled={aiLoading || !form.content.trim()}
                  className="mt-3 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {aiLoading && aiAction === "improve"
                    ? "Improving..."
                    : "Improve Content"}
                </button>
              </div>

              {/* SEO */}

              <div className="mt-4 rounded-lg border bg-slate-50 p-4">
                <h3 className="font-medium">
                  Generate SEO
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Generate meta title, description and keywords from your article.
                </p>

                <button
                  type="button"
                  onClick={handleAIGenerateSEO}
                  disabled={
                    aiLoading ||
                    !form.title.trim() ||
                    !form.content.trim()
                  }
                  className="mt-4 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {aiLoading && aiAction === "seo"
                    ? "Generating SEO..."
                    : "Generate SEO"}
                </button>
              </div>
            </div>

            {/* ================================================== */}
            {/* SEO */}
            {/* ================================================== */}

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    SEO
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Search engine metadata for this article.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAIGenerateSEO}
                  disabled={
                    aiLoading ||
                    !form.title.trim() ||
                    !form.content.trim()
                  }
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {aiLoading && aiAction === "seo"
                    ? "Generating..."
                    : "AI Generate SEO"}
                </button>
              </div>

              <div className="mt-5 space-y-5">
                {/* Meta title */}

                <div>
                  <label className="block text-sm font-medium">
                    Meta Title
                  </label>

                  <input
                    value={form.seo.metaTitle}
                    onChange={(event) =>
                      updateSeoField(
                        "metaTitle",
                        event.target.value,
                      )
                    }
                    placeholder="SEO title..."
                    className="mt-2 w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
                  />

                  <p className="mt-1 text-xs text-slate-500">
                    {form.seo.metaTitle.length} characters
                  </p>
                </div>

                {/* Meta description */}

                <div>
                  <label className="block text-sm font-medium">
                    Meta Description
                  </label>

                  <textarea
                    value={form.seo.metaDescription}
                    onChange={(event) =>
                      updateSeoField(
                        "metaDescription",
                        event.target.value,
                      )
                    }
                    rows={4}
                    placeholder="SEO description..."
                    className="mt-2 w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
                  />

                  <p className="mt-1 text-xs text-slate-500">
                    {form.seo.metaDescription.length} characters
                  </p>
                </div>

                {/* Keywords */}

                <div>
                  <label className="block text-sm font-medium">
                    Keywords
                  </label>

                  <input
                    value={keywordInput}
                    onChange={(event) =>
                      setKeywordInput(event.target.value)
                    }
                    onKeyDown={addKeyword}
                    placeholder="Type keyword and press Enter..."
                    className="mt-2 w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
                  />

                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.seo.keywords.map((keyword) => (
                      <button
                        type="button"
                        key={keyword}
                        onClick={() =>
                          removeKeyword(keyword)
                        }
                        className="rounded-full bg-slate-100 px-3 py-1 text-sm hover:bg-slate-200"
                      >
                        {keyword} ×
                      </button>
                    ))}
                  </div>
                </div>

                {/* Canonical URL */}

                <div>
                  <label className="block text-sm font-medium">
                    Canonical URL
                  </label>

                  <input
                    type="url"
                    value={form.seo.canonicalUrl}
                    onChange={(event) =>
                      updateSeoField(
                        "canonicalUrl",
                        event.target.value,
                      )
                    }
                    placeholder="https://example.com/article"
                    className="mt-2 w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ================================================== */}
          {/* SIDEBAR */}
          {/* ================================================== */}

          <aside className="space-y-6">
            {/* Publishing */}

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="font-semibold">
                Publishing
              </h2>

              <label className="mt-5 block text-sm font-medium">
                Status
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value,
                  )
                }
                className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
              >
                <option value="draft">
                  Draft
                </option>

                <option value="published">
                  Published
                </option>

                <option value="archived">
                  Archived
                </option>
              </select>

              <button
                type="submit"
                disabled={saving}
                className="mt-5 w-full rounded-lg bg-black px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : isEditing
                    ? "Update Article"
                    : "Save Article"}
              </button>
            </div>

            {/* Category */}

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="font-semibold">
                Category
              </h2>

              <select
                value={form.category}
                onChange={(event) =>
                  updateField(
                    "category",
                    event.target.value,
                  )
                }
                className="mt-4 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
              >
                <option value="">
                  No category
                </option>

                {categories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="font-semibold">
                Tags
              </h2>

              <div className="mt-4 space-y-2">
                {tags.map((tag) => (
                  <label
                    key={tag._id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={form.tags.includes(tag._id)}
                      onChange={() =>
                        toggleTag(tag._id)
                      }
                    />

                    <span className="text-sm">
                      {tag.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Featured image */}

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="font-semibold">
                Featured Image
              </h2>

              <input
                type="url"
                value={form.featuredImage}
                onChange={(event) =>
                  updateField(
                    "featuredImage",
                    event.target.value,
                  )
                }
                placeholder="Image URL..."
                className="mt-4 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
              />

              {form.featuredImage && (
                <img
                  src={form.featuredImage}
                  alt=""
                  className="mt-4 aspect-video w-full rounded-lg object-cover"
                />
              )}
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
}
