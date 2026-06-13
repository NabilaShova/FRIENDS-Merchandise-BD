"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Boxes, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import {
  applyForm,
  blankProductForm,
  toFormValues,
  type ProductFormValues,
} from "@/lib/admin-catalog";
import { api } from "@/lib/api";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";

export function AdminProducts() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [editing, setEditing] = React.useState<Product | "new" | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    api.products.list().then(setProducts).catch(() => setProducts([]));
  }, []);

  const handleSave = async (values: ProductFormValues) => {
    setSaving(true);
    try {
      if (editing === "new") {
        const { product } = await api.products.create(applyForm(values));
        setProducts((prev) => [product, ...prev]);
      } else if (editing) {
        const { product } = await api.products.update(
          editing.id,
          applyForm(values, editing),
        );
        setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
      }
      setEditing(null);
    } catch (err) {
      alert(`Could not save product: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    await api.products.remove(id).catch(() => {});
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="heading-display text-2xl md:text-3xl">Products</h1>
          <p className="text-muted-foreground">{products.length} products in catalogue.</p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus className="h-4 w-4" /> Add product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card py-16 text-center shadow-soft">
          <Boxes className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No products yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-card shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {p.images[0] ? (
                            <Image
                              src={p.images[0].url}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-medium">
                            {p.name}
                            {p.isFeatured ? (
                              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                            ) : null}
                          </div>
                          <div className="text-xs text-muted-foreground">{p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">
                      {p.category.replace("-", " ")}
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-semibold",
                          p.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-destructive/10 text-destructive",
                        )}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          aria-label="Edit"
                          onClick={() => setEditing(p)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete"
                          onClick={() => remove(p.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {editing !== null ? (
          <ProductFormModal
            product={editing === "new" ? undefined : editing}
            busy={saving}
            onClose={() => setEditing(null)}
            onSave={handleSave}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ProductFormModal({
  product,
  busy,
  onClose,
  onSave,
}: {
  product?: Product;
  busy?: boolean;
  onClose: () => void;
  onSave: (values: ProductFormValues) => void;
}) {
  const [form, setForm] = React.useState<ProductFormValues>(
    product ? toFormValues(product) : blankProductForm(),
  );
  const [cats, setCats] = React.useState<Category[]>([]);
  React.useEffect(() => {
    api.categories.list().then(setCats).catch(() => setCats([]));
  }, []);

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setImageAt = (index: number, url: string) =>
    setForm((f) => {
      const images = [...f.images];
      if (url) images[index] = url;
      else images.splice(index, 1);
      return { ...f, images };
    });

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
        className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-background p-6 shadow-lift"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">
            {product ? "Edit product" : "New product"}
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
          className="grid gap-4 sm:grid-cols-2"
        >
          <Field label="Name" className="sm:col-span-2" value={form.name} onChange={(v) => set("name", v)} required />
          <Field label="SKU" value={form.sku} onChange={(v) => set("sku", v)} required />
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Category</span>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {cats.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <Field label="Price (৳)" type="number" value={String(form.price)} onChange={(v) => set("price", Number(v))} required />
          <Field
            label="Compare price (৳)"
            type="number"
            value={form.comparePrice ? String(form.comparePrice) : ""}
            onChange={(v) => set("comparePrice", v ? Number(v) : undefined)}
          />
          <Field label="Stock" type="number" value={String(form.stock)} onChange={(v) => set("stock", Number(v))} required />

          <div className="flex flex-col gap-3 sm:col-span-2">
            <span className="text-sm font-medium">Product images</span>
            <div className="flex flex-wrap gap-4">
              {form.images.map((url, i) => (
                <div key={i} className="w-full sm:w-auto">
                  <ImageUpload
                    label={i === 0 ? "Main image" : `Image ${i + 1}`}
                    value={url}
                    onChange={(next) => setImageAt(i, next)}
                  />
                </div>
              ))}
              <div className="w-full sm:w-auto">
                <ImageUpload
                  label={form.images.length === 0 ? "Main image" : "Add image"}
                  value=""
                  onChange={(next) => next && setForm((f) => ({ ...f, images: [...f.images, next] }))}
                />
              </div>
            </div>
          </div>

          <Field
            label="Sizes (comma separated)"
            className="sm:col-span-2"
            value={form.sizes}
            onChange={(v) => set("sizes", v)}
          />
          <Field
            label="Colors — Name:#hex (comma separated)"
            className="sm:col-span-2"
            value={form.colors}
            onChange={(v) => set("colors", v)}
          />
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-sm font-medium">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="flex items-center gap-2.5 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => set("isFeatured", e.target.checked)}
              className="h-4 w-4 accent-brand"
            />
            Feature on homepage
          </label>

          <div className="mt-2 flex gap-3 sm:col-span-2">
            <Button type="submit" className="flex-1" disabled={busy}>
              {busy ? "Saving…" : product ? "Save changes" : "Create product"}
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

function Field({
  label,
  value,
  onChange,
  type = "text",
  className,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
  required?: boolean;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-sm font-medium">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}
