function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getSubcategoryIconPath(categoryName: string, subcategoryName: string): string {
  const categorySlug = slugify(categoryName);
  const subcategorySlug = slugify(subcategoryName);
  const normalizedSubcategorySlug =
    subcategorySlug.startsWith(`${categorySlug}-`)
      ? subcategorySlug.slice(categorySlug.length + 1)
      : subcategorySlug === categorySlug
        ? ""
        : subcategorySlug;
  const slug = [categorySlug, normalizedSubcategorySlug].filter(Boolean).join("-");
  return `/subcategory-icons/${slug}.png`;
}
