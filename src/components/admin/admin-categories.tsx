"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Pencil, Plus, Trash2, X } from "lucide-react";
import type { Category } from "@/lib/types";
import {
  applyCategoryForm,
  blankCategoryForm,
  toCategoryForm,
  type CategoryFormValues,
} from "@/lib/admin-categories";
import { api } from "@/lib/api";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";

export function AdminCategories() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [editing, setEditing] = React.useState<Category | "new" | null>(null);

  React.useEffect(() => {
    api.categories.list().then(setCategories).catch(() => setCategories([]));
  }, []);

  const handleSave = async (values: CategoryFormValues) => {
    try {
      if (editing === "new") {
        const created = applyCategoryForm(values);
        if (categories.some((c) => c.slug === created.slug)) return;
        const { category } = await api.categories.create(created);
        setCategories((prev) => [...prev, category]);
      } else if (editing) {
        const { category } = await api.categories.update(
          editing.slug,
          applyCategoryForm(values, editing),
        );
        setCategories((prev) =>
          prev.map((c) => (c.slug === category.slug ? category : c)),
        );
      }
      setEditing(null);
    } catch (err) {
      alert(`Could not save category: ${(err as Error).message}`);
    }
  };

  const remove = async (slug: string) => {
    await api.categories.remove(slug).catch(() => {});
    setCategories((prev) => prev.filter((c) => c.slug !== slug));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="heading-display text-2xl md:text-3xl">Categories</h1>
          <p className="text-muted-foreground">
            {categories.length} collections shown across the storefront.
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus className="h-4 w-4" /> Add category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card py-16 text-center shadow-soft">
          <LayoutGrid className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No categories yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.slug} className="overflow-hidden rounded-2xl bg-card shadow-soft">
              <div className="relative h-32 w-full bg-muted">
                {c.image ? (
                  <Image src={c.image} alt={c.name} fill sizes="320px" className="object-cover" />
                ) : null}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display font-bold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">/{c.slug}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      aria-label="Edit"
                      onClick={() => setEditing(c)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete"
                      onClick={() => remove(c.slug)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {c.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing !== null ? (
          <CategoryModal
            category={editing === "new" ? undefined : editing}
            onClose={() => setEditing(null)}
            onSave={handleSave}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function CategoryModal({
  category,
  onClose,
  onSave,
}: {
  category?: Category;
  onClose: () => void;
  onSave: (values: CategoryFormValues) => void;
}) {
  const [form, setForm] = React.useState<CategoryFormValues>(
    category ? toCategoryForm(category) : blankCategoryForm(),
  );
  const set = <K extends keyof CategoryFormValues>(key: K, value: CategoryFormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-background p-6 shadow-lift"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">
            {category ? "Edit category" : "New category"}
          </h2>
          <button type="button" aria-label="Close" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Name</span>
            <input
              value={form.name}
              required
              onChange={(e) => {
                const name = e.target.value;
                setForm((f) => ({
                  ...f,
                  name,
                  slug: category ? f.slug : slugify(name),
                }));
              }}
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Slug</span>
            <input
              value={form.slug}
              required
              disabled={Boolean(category)}
              onChange={(e) => set("slug", slugify(e.target.value))}
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <ImageUpload
            label="Cover image"
            value={form.image}
            onChange={(url) => set("image", url)}
          />
          <div className="mt-2 flex gap-3">
            <Button type="submit" className="flex-1">
              {category ? "Save changes" : "Create category"}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </>
  );
}
