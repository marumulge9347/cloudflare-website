import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  getCurrentUser,
  logout
} from "../lib/api";

export default function Dashboard() {
  const navigate =
    useNavigate();

  const [
    user,
    setUser
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data =
          await getCurrentUser();

        setUser(
          data.user
        );
      } catch {
        navigate(
          "/login"
        );
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [navigate]);

  async function handleLogout() {
    await logout();

    navigate(
      "/login"
    );
  }

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">
              Admin Dashboard
            </h1>

            <p className="text-sm text-slate-500">
              Cloudflare Website
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            Welcome, {user?.name}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {user?.email}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Link
              to="/posts"
              className="rounded-xl border p-5 hover:bg-slate-50"
            >
              <h3 className="font-semibold">
                Posts
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Manage blog posts
              </p>
            </Link>

            <Link
              to="/posts/new"
              className="rounded-xl border p-5 hover:bg-slate-50"
            >
              <h3 className="font-semibold">
                New Article
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create a new article
              </p>
            </Link>

            <div className="rounded-xl border p-5">
              <h3 className="font-semibold">
                AI Writer
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Coming next
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}