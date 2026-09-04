import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ArticleEditor from "./pages/ArticleEditor";
import PublicBlog from "./pages/PublicBlog";
import PublicArticle from "./pages/PublicArticle";

import Posts from "./pages/Posts";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/posts" element={<Posts />} />

        <Route path="/posts/new" element={<ArticleEditor />} />

        <Route path="/blog" element={<PublicBlog />} />

        <Route path="/blog/:slug" element={<PublicArticle />} />

        <Route path="/posts/:id/edit" element={<ArticleEditor />} />
      </Routes>
    </BrowserRouter>
  );
}
