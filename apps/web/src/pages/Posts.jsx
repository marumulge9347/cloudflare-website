import { useEffect, useState } from "react";

import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { getPosts, deletePost, updatePost } from "../lib/api";

export default function Posts() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [status, setStatus] = useState(searchParams.get("status") || "");

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");

  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    loadPosts();
  }, [page, searchParams.get("search"), searchParams.get("status")]);

  async function loadPosts() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("page", String(page));

      params.set("limit", "10");

      const currentSearch = searchParams.get("search");

      const currentStatus = searchParams.get("status");

      if (currentSearch) {
        params.set("search", currentSearch);
      }

      if (currentStatus) {
        params.set("status", currentStatus);
      }

      const data = await getPosts(`?${params.toString()}`);

      setPosts(data.posts || []);

      setPagination(data.pagination || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters(event) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (status) {
      params.set("status", status);
    }

    params.set("page", "1");

    setSearchParams(params);
  }

  function clearFilters() {
    setSearch("");

    setStatus("");

    setSearchParams({
      page: "1",
    });
  }

  function changePage(nextPage) {
    const params = new URLSearchParams(searchParams);

    params.set("page", String(nextPage));

    setSearchParams(params);
  }

  async function changeStatus(post, nextStatus) {
    try {
      setActionLoading(post._id);

      await updatePost(post._id, {
        status: nextStatus,
      });

      await loadPosts();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(post) {
    const confirmed = window.confirm(
      `Delete "${post.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(post._id);

      await deletePost(post._id);

      await loadPosts();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  }

  function statusBadge(postStatus) {
    const classes = {
      draft: "bg-slate-100 text-slate-700",

      published: "bg-green-100 text-green-700",

      archived: "bg-orange-100 text-orange-700",
    };

    return (
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
          classes[postStatus] || classes.draft
        }`}
      >
        {postStatus}
      </span>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Header */}

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">Posts</h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your blog content.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/dashboard"
              className="rounded-lg border bg-white px-4 py-2 text-sm"
            >
              Dashboard
            </Link>

            <Link
              to="/posts/new"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
            >
              + New Article
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        {/* Error */}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <form
            onSubmit={applyFilters}
            className="flex flex-col gap-3 md:flex-row"
          >
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search posts..."
              className="flex-1 rounded-lg border px-4 py-2 outline-none focus:ring-2"
            />

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-lg border px-4 py-2 outline-none focus:ring-2"
            >
              <option value="">All statuses</option>

              <option value="draft">Draft</option>

              <option value="published">Published</option>

              <option value="archived">Archived</option>
            </select>

            <button
              type="submit"
              className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white"
            >
              Search
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border px-5 py-2 text-sm"
            >
              Clear
            </button>
          </form>
        </div>

        {/* Stats */}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Posts</p>

            <p className="mt-2 text-3xl font-bold">{pagination.total || 0}</p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Current Page</p>

            <p className="mt-2 text-3xl font-bold">{pagination.page || page}</p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Pages</p>

            <p className="mt-2 text-3xl font-bold">
              {pagination.totalPages || 0}
            </p>
          </div>
        </div>

        {/* Posts */}

        <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading posts...
            </div>
          ) : posts.length === 0 ? (
            <div className="p-10 text-center">
              <h2 className="text-lg font-semibold">No posts found</h2>

              <p className="mt-2 text-sm text-slate-500">
                Create an article or change your filters.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead className="border-b bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Article
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Views
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {posts.map((post) => (
                      <tr key={post._id} className="border-b last:border-0">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            {post.featuredImage ? (
                              <img
                                src={post.featuredImage}
                                alt=""
                                className="h-14 w-20 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                                No image
                              </div>
                            )}

                            <div>
                              <p className="font-semibold">{post.title}</p>

                              <p className="mt-1 max-w-md truncate text-sm text-slate-500">
                                {post.excerpt}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                /{post.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm">
                          {post.category?.name || "—"}
                        </td>

                        <td className="px-6 py-5">
                          {statusBadge(post.status)}
                        </td>

                        <td className="px-6 py-5 text-sm">{post.views || 0}</td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/posts/${post._id}/edit`}
                              className="rounded-lg border px-3 py-2 text-xs"
                            >
                              Edit
                            </Link>

                            {post.status !== "published" && (
                              <button
                                type="button"
                                disabled={actionLoading === post._id}
                                onClick={() => changeStatus(post, "published")}
                                className="rounded-lg border px-3 py-2 text-xs"
                              >
                                Publish
                              </button>
                            )}

                            {post.status === "published" && (
                              <button
                                type="button"
                                disabled={actionLoading === post._id}
                                onClick={() => changeStatus(post, "draft")}
                                className="rounded-lg border px-3 py-2 text-xs"
                              >
                                Draft
                              </button>
                            )}

                            {post.status !== "archived" && (
                              <button
                                type="button"
                                disabled={actionLoading === post._id}
                                onClick={() => changeStatus(post, "archived")}
                                className="rounded-lg border px-3 py-2 text-xs"
                              >
                                Archive
                              </button>
                            )}

                            {post.status === "published" && (
                              <Link
                                to={`/blog/${post.slug}`}
                                target="_blank"
                                className="rounded-lg border px-3 py-2 text-xs"
                              >
                                View
                              </Link>
                            )}

                            <button
                              type="button"
                              disabled={actionLoading === post._id}
                              onClick={() => handleDelete(post)}
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}

              <div className="space-y-4 p-4 md:hidden">
                {posts.map((post) => (
                  <article key={post._id} className="rounded-xl border p-4">
                    <div className="flex gap-3">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt=""
                          className="h-16 w-20 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-20 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                          No image
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h2 className="font-semibold">{post.title}</h2>

                        <p className="mt-1 text-xs text-slate-500">
                          {post.category?.name}
                        </p>

                        <div className="mt-2">{statusBadge(post.status)}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        to={`/posts/${post._id}/edit`}
                        className="rounded-lg border px-3 py-2 text-xs"
                      >
                        Edit
                      </Link>

                      {post.status !== "published" && (
                        <button
                          type="button"
                          onClick={() => changeStatus(post, "published")}
                          className="rounded-lg border px-3 py-2 text-xs"
                        >
                          Publish
                        </button>
                      )}

                      {post.status === "published" && (
                        <button
                          type="button"
                          onClick={() => changeStatus(post, "draft")}
                          className="rounded-lg border px-3 py-2 text-xs"
                        >
                          Draft
                        </button>
                      )}

                      {post.status !== "archived" && (
                        <button
                          type="button"
                          onClick={() => changeStatus(post, "archived")}
                          className="rounded-lg border px-3 py-2 text-xs"
                        >
                          Archive
                        </button>
                      )}

                      {post.status === "published" && (
                        <Link
                          to={`/blog/${post.slug}`}
                          target="_blank"
                          className="rounded-lg border px-3 py-2 text-xs"
                        >
                          View
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(post)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}

        {!loading && posts.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              disabled={!pagination.hasPreviousPage}
              onClick={() => changePage(page - 1)}
              className="rounded-lg border bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            <span className="text-sm text-slate-500">
              Page {pagination.page || page} of {pagination.totalPages || 1}
            </span>

            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() => changePage(page + 1)}
              className="rounded-lg border bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
