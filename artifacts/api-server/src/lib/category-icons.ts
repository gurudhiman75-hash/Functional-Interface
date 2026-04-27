import { existsSync, readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ICON_EXTENSIONS = [".png", ".webp", ".jpg", ".jpeg", ".svg"];
const ICON_ROOTS = [
  path.resolve(__dirname, "../../../../artifacts/examtree/public/category-icons"),
  path.resolve(__dirname, "../../../../artifacts/examtree/dist/public/category-icons"),
];

function slugifyCategoryName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findIconBySlug(root: string, slug: string): string | null {
  if (!existsSync(root)) {
    return null;
  }

  for (const extension of ICON_EXTENSIONS) {
    const slugFile = `${slug}${extension}`;
    const files = readdirSync(root);
    const found = files.find(f => f.toLowerCase() === slugFile.toLowerCase());
    if (found) {
      return path.join(root, found);
    }
  }

  return null;
}

export function getBundledCategoryIconPath(name: string): string | null {
  const slug = slugifyCategoryName(name);
  if (!slug) return null;

  for (const root of ICON_ROOTS) {
    const filePath = findIconBySlug(root, slug);
    if (filePath) {
      return `/category-icons/${path.basename(filePath)}`;
    }
  }

  return null;
}

export function resolveCategoryIcon(name: string, currentIcon: string): string {
  return getBundledCategoryIconPath(name) ?? currentIcon;
}
