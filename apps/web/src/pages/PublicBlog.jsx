import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useSearchParams
} from "react-router-dom";

import {
  getPublicPosts,
  getPublicCategories
} from "../lib/api";

export default function PublicBlog() {
  const [
    searchParams,
    setSearchParams
  ] = useSearchParams();

  const [
    posts,
    setPosts
  ] = useState([]);

  const [
    categories,
    setCategories
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  const search =
    searchParams.get(
      "search"
    ) || "";

  const category =
    searchParams.get(
      "category"
    ) || "";

  const page =
    Number(
      searchParams.get(
        "page"
      )
    ) || 1;

  useEffect(() => {
    loadBlog();
  }, [
    search,
    category,
    page
  ]);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadBlog() {
    try {
      setLoading(true);
      setError("");

      const params =
        new URLSearchParams();

      params.set(
        "page",
        page
      );

      params.set(
        "limit",
        "9"
      );

      if (search) {
        params.set(
          "search",
          search
        );
      }

      if (category) {
        params.set(
          "category",
          category
        );
      }

      const data =
        await getPublicPosts(
          `?${params.toString()}`
        );

      setPosts(
        data.posts || []
      );
    } catch (err) {
      setError(
        err.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const data =
        await getPublicCategories();

      setCategories(
        data.categories || []
      );
    } catch {
      // Categories are optional for rendering.
    }
  }

  function updateSearch(
    value
  ) {
    const params =
      new URLSearchParams(
        searchParams
      );

    if (value) {
      params.set(
        "search",
        value
      );
    } else {
      params.delete(
        "search"
      );
    }

    params.delete(
      "page"
    );

    setSearchParams(
      params
    );
  }

  function selectCategory(
    slug
  ) {
    const params =
      new URLSearchParams(
        searchParams
      );

    if (slug) {
      params.set(
        "category",
        slug
      );
    } else {
      params.delete(
        "category"
      );
    }

    params.delete(
      "page"
    );

    setSearchParams(
      params
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Cloudflare Website
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Cloudflare Automation Blog
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Tutorials, automation guides,
            development notes and
            Cloudflare technology.
          </p>

          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <input
              value={search}
              onChange={(event) =>
                updateSearch(
                  event.target.value
                )
              }
              placeholder="Search articles..."
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 md:max-w-md"
            />

            <select
              value={category}
              onChange={(event) =>
                selectCategory(
                  event.target.value
                )
              }
              className="rounded-lg border px-4 py-3 outline-none focus:ring-2"
            >
              <option value="">
                All categories
              </option>

              {categories.map(
                (item) => (
                  <option
                    key={item._id}
                    value={item.slug}
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-slate-500">
            Loading articles...
          </p>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <h2 className="text-xl font-semibold">
              No articles found
            </h2>

            <p className="mt-2 text-slate-500">
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post._id}
                className="overflow-hidden rounded-xl border bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                {post.featuredImage ? (
                  <img
                    src={
                      post.featuredImage
                    }
                    alt={post.title}
                    className="aspect-video w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-slate-100 text-sm text-slate-400">
                    No image
                  </div>
                )}

                <div className="p-5">
                  {post.category && (
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {post.category.name}
                    </p>
                  )}

                  <h2 className="mt-2 text-xl font-bold">
                    {post.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {post.excerpt}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {post.publishedAt
                        ? new Date(
                            post.publishedAt
                          ).toLocaleDateString()
                        : ""}
                    </span>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-sm font-semibold underline"
                    >
                      Read article
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}