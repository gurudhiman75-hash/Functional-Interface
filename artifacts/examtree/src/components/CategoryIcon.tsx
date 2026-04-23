import { FC } from "react";
import * as Icons from "lucide-react";

interface CategoryIconProps {
  icon: string;
  className?: string;
}

/**
 * Flexible icon renderer that supports:
 * - Lucide icon names (e.g., "Heart", "Banknote")
 * - Image URLs (e.g., "https://...", "/icons/...")
 * - Emoji (e.g., "🏦", "❤️")
 */
export const CategoryIcon: FC<CategoryIconProps> = ({ icon, className = "h-5 w-5" }) => {
  if (!icon) {
    return <Icons.BookOpen className={className} />;
  }

  // If it's a URL (starts with http, /, or data:), render as image
  if (icon.startsWith("http") || icon.startsWith("/") || icon.startsWith("data:")) {
    return (
      <img
        src={icon}
        alt="category-icon"
        className={`object-contain ${className}`}
      />
    );
  }

  // If it's a single emoji character (1-2 chars typically), render directly
  if (icon.length <= 2) {
    return <span className={className}>{icon}</span>;
  }

  // Otherwise, treat it as Lucide icon name
  const IconComponent = (Icons as Record<string, FC>)[icon];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }

  // Fallback icon if not found
  return <Icons.BookOpen className={className} />;
};
