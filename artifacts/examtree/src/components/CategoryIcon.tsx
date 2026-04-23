import { FC, useEffect, useState } from "react";
import * as Icons from "lucide-react";

interface CategoryIconProps {
  icon: string;
  className?: string;
}

export function isImageIcon(icon: string): boolean {
  return icon.startsWith("http") || icon.startsWith("/") || icon.startsWith("data:");
}

/**
 * Flexible icon renderer that supports:
 * - Lucide icon names (e.g., "Heart", "Banknote")
 * - Image URLs (e.g., "https://...", "/icons/...")
 * - Emoji (e.g., "🏦", "❤️")
 */
export const CategoryIcon: FC<CategoryIconProps> = ({ icon, className = "h-5 w-5" }) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [icon]);

  if (!icon) {
    return <Icons.BookOpen className={className} />;
  }

  // If it's a URL (starts with http, /, or data:), render as image
  if (isImageIcon(icon) && !imageFailed) {
    return (
      <img
        src={icon}
        alt="category-icon"
        className="block h-full w-full object-contain"
        draggable={false}
        onError={() => setImageFailed(true)}
      />
    );
  }

  if (isImageIcon(icon) && imageFailed) {
    return null;
  }

  // If it's a single emoji character (1-2 chars typically), render directly
  if (icon.length <= 2) {
    return <span className={className}>{icon}</span>;
  }

  // Otherwise, treat it as Lucide icon name
  const IconComponent = (Icons as unknown as Record<string, FC<{ className?: string }>>)[icon];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }

  // Fallback icon if not found
  return <Icons.BookOpen className={className} />;
};
