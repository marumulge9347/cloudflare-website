import { useEffect, useMemo, useState } from "react";

import { createTag, deleteTag, getTags, updateTag } from "../lib/api";

export default function Tags() {
  const [tags, setTags] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadTags();
  }, []);

  async function loadTags() {
    try {
      setLoading(true);
      setError("");

      const data = await getTags();

      setTags(data.tags || []);
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

  function startEdit(tag) {
    setEditingId(tag._id);
    setName(tag.name);
    setDescription(tag.description || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Tag name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await updateTag(editingId, {
          name: name.trim(),
          description: description.trim(),
        });

        setSuccess("Tag updated successfully.");
      } else {
        await createTag({
          name: name.trim(),
          description: description.trim(),
        });

        setSuccess("Tag created successfully.");
      }

      resetForm();

      await loadTags();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(tag) {
    try {
      setError("");

      await updateTag(tag._id, {
        active: !tag.active,
      });

      await loadTags();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(tag) {
    const confirmed = window.confirm(`Delete tag "${tag.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteTag(tag._id);

      setSuccess("Tag deleted successfully.");

      await loadTags();
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredTags = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return tags;
    }

    return tags.filter((tag) => {
      return (
        tag.name.toLowerCase().includes(value) ||
        (tag.description || "").toLowerCase().includes(value)
      );
    });
  }, [tags, search]);

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <h1 className="text-2xl font-bold">Tags</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage tags used by your articles.
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
          <h2 className="mb-5 text-lg font-semibold">
            {editingId ? "Edit Tag" : "Create Tag"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Example: Workers"
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Tag description..."
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
                {saving ? "Saving..." : editingId ? "Update Tag" : "Create Tag"}
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
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tags..."
            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
          />
        </div>

        {/* List */}

        <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading tags...
            </div>
          ) : filteredTags.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No tags found.
            </div>
          ) : (
            <div className="divide-y">
              {filteredTags.map((tag) => (
                <div
                  key={tag._id}
                  className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{tag.name}</h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          tag.active
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {tag.active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {tag.description || "No description"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">/{tag.slug}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(tag)}
                      className="rounded-lg border px-3 py-2 text-xs"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleActive(tag)}
                      className="rounded-lg border px-3 py-2 text-xs"
                    >
                      {tag.active ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(tag)}
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
