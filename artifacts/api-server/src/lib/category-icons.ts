import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ICON_EXTENSIONS = [".png", ".webp", ".jpg", ".jpeg", ".svg"];
const ICON_ROOTS = [
  path.resolve(__dirname, "../../../examtree/public/category-icons"),
  path.resolve(__dirname, "../../../examtree/dist/public/category-icons"),
];

function slugifyCategoryName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getBundledCategoryIconPath(name: string): string | null {
  const slug = slugifyCategoryName(name);
  if (!slug) return null;

  for (const root of ICON_ROOTS) {
    for (const extension of ICON_EXTENSIONS) {
      const filePath = path.join(root, `${slug}${extension}`);
      if (existsSync(filePath)) {
        return `/category-icons/${slug}${extension}`;
      }
    }
  }

  return null;
}

export function resolveCategoryIcon(name: string, currentIcon: string): string {
  return getBundledCategoryIconPath(name) ?? currentIcon;
}
