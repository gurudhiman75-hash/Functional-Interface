import { existsSync, readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ICON_EXTENSIONS = [".png", ".webp", ".jpg", ".jpeg", ".svg"];
const ICON_ROOTS = [
  path.resolve(__dirname, "../../../examtree/public/category-icons"),
  path.resolve(__dirname, "../../../examtree/dist/public/category-icons"),
];

type IconIndex = ReadonlyMap<string, string>;
const ICON_INDEX_CACHE = new Map<string, IconIndex>();

function slugifyCategoryName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getIconIndex(root: string): IconIndex {
  const cached = ICON_INDEX_CACHE.get(root);
  if (cached) return cached;

  const index = new Map<string, string>();
  if (!existsSync(root)) {
    ICON_INDEX_CACHE.set(root, index);
    return index;
  }

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isFile()) continue;

    const extension = path.extname(entry.name).toLowerCase();
    if (!ICON_EXTENSIONS.includes(extension)) continue;

    const key = entry.name.toLowerCase();
    const existing = index.get(key);
    if (existing && existing !== entry.name) {
      throw new Error(
        `Case-insensitive category icon collision in ${root}: ${existing} and ${entry.name}`,
      );
    }

    index.set(key, entry.name);
  }

  ICON_INDEX_CACHE.set(root, index);
  return index;
}

export function getBundledCategoryIconPath(name: string): string | null {
  const slug = slugifyCategoryName(name);
  if (!slug) return null;

  for (const root of ICON_ROOTS) {
    const index = getIconIndex(root);
    for (const extension of ICON_EXTENSIONS) {
      const filename = index.get(`${slug}${extension}`.toLowerCase());
      if (filename) {
        return `/category-icons/${filename}`;
      }
    }
  }

  return null;
}

export function resolveCategoryIcon(name: string, currentIcon: string): string {
  return getBundledCategoryIconPath(name) ?? currentIcon;
}
