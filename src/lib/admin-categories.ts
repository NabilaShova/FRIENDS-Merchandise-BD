import { categories as seedCategories } from "@/data/categories";
import { slugify } from "@/lib/utils";
import type { Category } from "@/lib/types";

/**
 * Admin-editable categories. Seeded from the default catalogue and persisted to
 * localStorage for the demo; maps onto the Prisma `Category` model so the admin
 * UI can be pointed at `/api/admin/categories` later with no UI changes.
 */
const STORAGE_KEY = "fmbd.adminCategories.v1";

export function loadCategories(): Category[] {
  if (typeof window === "undefined") return seedCategories;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Category[]) : seedCategories;
  } catch {
    return seedCategories;
  }
}

export function saveCategories(categories: Category[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

export interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  image: string;
}

export function blankCategoryForm(): CategoryFormValues {
  return { name: "", slug: "", description: "", image: "" };
}

export function toCategoryForm(c: Category): CategoryFormValues {
  return { name: c.name, slug: c.slug, description: c.description, image: c.image };
}

export function applyCategoryForm(
  values: CategoryFormValues,
  existing?: Category,
): Category {
  return {
    slug: existing ? existing.slug : values.slug.trim() || slugify(values.name),
    name: values.name,
    description: values.description,
    image: values.image,
    productCount: existing?.productCount ?? 0,
  };
}
