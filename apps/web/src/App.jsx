import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ArticleEditor from "./pages/ArticleEditor";
import PublicBlog from "./pages/PublicBlog";
import PublicArticle from "./pages/PublicArticle";
import Categories from "./pages/Categories";
import Tags from "./pages/Tags";
import Posts from "./pages/Posts";

import { getCurrentUser } from "./lib/api";
import { useEffect, useState } from "react";

/*
|--------------------------------------------------------------------------
| Protected Route
|--------------------------------------------------------------------------
|
| Checks whether the user is authenticated.
|
| If authenticated:
|     allow access to admin pages.
|
| If not authenticated:
|     redirect to /login.
|
*/

function ProtectedRoute() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAuthentication() {
      try {
        await getCurrentUser();

        if (mounted) {
          setAuthenticated(true);
        }
      } catch {
        if (mounted) {
          setAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    }

    checkAuthentication();

    return () => {
      mounted = false;
    };
  }, []);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-slate-500">Checking authentication...</div>
      </main>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

/*
|--------------------------------------------------------------------------
| Application
|--------------------------------------------------------------------------
*/

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}

        <Route path="/" element={<Navigate to="/blog" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/blog" element={<PublicBlog />} />

        <Route path="/blog/:slug" element={<PublicArticle />} />

        {/* Protected admin routes */}

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/posts" element={<Posts />} />

          <Route path="/posts/new" element={<ArticleEditor />} />

          <Route path="/posts/:id/edit" element={<ArticleEditor />} />

          <Route path="/categories" element={<Categories />} />

          <Route path="/tags" element={<Tags />} />
        </Route>

        {/* Unknown route */}

        <Route path="*" element={<Navigate to="/blog" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
