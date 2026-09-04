import { useEffect, useMemo, useState } from "react";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../lib/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories();

      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setName("");
    setDescription("");
    setEditingId(null);
  }

  function startEdit(category) {
    setEditingId(category._id);
    setName(category.name);
    setDescription(category.description || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await updateCategory(editingId, {
          name: name.trim(),
          description: description.trim(),
        });

        setSuccess("Category updated successfully.");
      } else {
        await createCategory({
          name: name.trim(),
          description: description.trim(),
        });

        setSuccess("Category created successfully.");
      }

      resetForm();

      await loadCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(category) {
    try {
      setError("");

      await updateCategory(category._id, {
        active: !category.active,
      });

      await loadCategories();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(category) {
    const confirmed = window.confirm(
      `Delete category "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteCategory(category._id);

      setSuccess("Category deleted successfully.");

      await loadCategories();
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredCategories = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return categories;
    }

    return categories.filter((category) => {
      return (
        category.name.toLowerCase().includes(value) ||
        (category.description || "")
          .toLowerCase()
          .includes(value)
      );
    });
  }, [categories, search]);

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <h1 className="text-2xl font-bold">
            Categories
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Organize your articles into categories.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Form */}

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">
              {editingId
                ? "Edit Category"
                : "Create Category"}
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium">
                Name
              </label>

              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Example: Cloudflare"
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Category description..."
                rows="3"
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Category"
                  : "Create Category"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border px-5 py-2 text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search */}

        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search categories..."
            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
          />
        </div>

        {/* List */}

        <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading categories...
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No categories found.
            </div>
          ) : (
            <div className="divide-y">
              {filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">
                        {category.name}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          category.active
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {category.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {category.description ||
                        "No description"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      /{category.slug}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        startEdit(category)
                      }
                      className="rounded-lg border px-3 py-2 text-xs"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleActive(category)
                      }
                      className="rounded-lg border px-3 py-2 text-xs"
                    >
                      {category.active
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(category)
                      }
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}