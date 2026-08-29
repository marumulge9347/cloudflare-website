import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useParams
} from "react-router-dom";

import {
  getPublicPost
} from "../lib/api";

export default function PublicArticle() {
  const { slug } =
    useParams();

  const [
    post,
    setPost
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  useEffect(() => {
    loadArticle();
  }, [slug]);

  async function loadArticle() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getPublicPost(
          slug
        );

      setPost(
        data.post
      );

      if (
        data.post?.seo
          ?.metaTitle
      ) {
        document.title =
          data.post.seo.metaTitle;
      }
    } catch (err) {
      setError(
        err.message
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        Loading article...
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-2xl font-bold">
          Article not found
        </h1>

        <p className="mt-2 text-slate-500">
          {error}
        </p>

        <Link
          to="/blog"
          className="mt-6 inline-block underline"
        >
          Back to blog
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-4xl px-6 py-12">
        <Link
          to="/blog"
          className="text-sm font-medium underline"
        >
          ← Back to blog
        </Link>

        <div className="mt-10">
          {post.category && (
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              {post.category.name}
            </p>
          )}

          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            {post.title}
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            {post.excerpt}
          </p>

          <div className="mt-5 flex gap-4 text-sm text-slate-500">
            <span>
              {post.author?.name}
            </span>

            <span>•</span>

            <span>
              {post.publishedAt
                ? new Date(
                    post.publishedAt
                  ).toLocaleDateString()
                : ""}
            </span>

            <span>•</span>

            <span>
              {post.views} views
            </span>
          </div>

          {post.featuredImage && (
            <img
              src={
                post.featuredImage
              }
              alt={post.title}
              className="mt-10 w-full rounded-2xl object-cover"
            />
          )}

          <div className="mt-10 whitespace-pre-wrap text-lg leading-8 text-slate-700">
            {post.content}
          </div>

          {post.tags?.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t pt-6">
              {post.tags.map(
                (tag) => (
                  <span
                    key={tag._id}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm"
                  >
                    #{tag.name}
                  </span>
                )
              )}
            </div>
          )}
        </div>
      </article>
    </main>
  );
}