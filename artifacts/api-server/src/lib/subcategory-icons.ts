import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ICON_EXTENSIONS = [".png", ".webp", ".jpg", ".jpeg", ".svg"];
const ICON_ROOTS = [
  path.resolve(__dirname, "../../../examtree/public/subcategory-icons"),
  path.resolve(__dirname, "../../../examtree/dist/public/subcategory-icons"),
];

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getBundledSubcategoryIconPath(categoryName: string, subcategoryName: string): string | null {
  const categorySlug = slugify(categoryName);
  const subcategorySlug = slugify(subcategoryName);
  const normalizedSubcategorySlug =
    subcategorySlug.startsWith(`${categorySlug}-`)
      ? subcategorySlug.slice(categorySlug.length + 1)
      : subcategorySlug === categorySlug
        ? ""
        : subcategorySlug;
  const slug = [categorySlug, normalizedSubcategorySlug].filter(Boolean).join("-");
  if (!slug) return null;

  for (const root of ICON_ROOTS) {
    for (const extension of ICON_EXTENSIONS) {
      const filePath = path.join(root, `${slug}${extension}`);
      if (existsSync(filePath)) {
        return `/subcategory-icons/${slug}${extension}`;
      }
    }
  }

  return null;
}

export function resolveSubcategoryIcon(categoryName: string, subcategoryName: string, currentIcon?: string | null): string | null {
  return getBundledSubcategoryIconPath(categoryName, subcategoryName) ?? currentIcon ?? null;
}
