import { type FC, useEffect, useState } from "react";
import {
  BadgeCheck,
  Banknote,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Heart,
  Landmark,
  Monitor,
  type LucideIcon,
} from "lucide-react";

interface CategoryIconProps {
  icon: string;
  className?: string;
}

const lucideCategoryIcons: Readonly<Record<string, LucideIcon>> = {
  Landmark,
  BadgeCheck,
  Building2,
  GraduationCap,
  BriefcaseBusiness,
  Monitor,
  Heart,
  Banknote,
};

export function isImageIcon(icon: string): boolean {
  return icon.startsWith("http") || icon.startsWith("/") || icon.startsWith("data:");
}

/**
 * Flexible icon renderer that supports:
 * - the bounded Lucide category icon set used by the canonical/fallback catalog
 * - image URLs (e.g., "https://...", "/icons/...")
 * - emoji (e.g., "🏦", "❤️")
 *
 * Unknown Lucide names intentionally use BookOpen instead of importing the full
 * Lucide namespace. This keeps category rendering tree-shakable and prevents the
 * icon catalog from becoming a shared public-route bundle.
 */
export const CategoryIcon: FC<CategoryIconProps> = ({ icon, className = "h-5 w-5" }) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [icon]);

  if (!icon) {
    return <BookOpen className={className} />;
  }

  // If it's a URL (starts with http, /, or data:), render as image
  if (isImageIcon(icon) && !imageFailed) {
    return (
      <img
        src={icon}
        alt="category-icon"
        className="block h-full w-full object-contain"
        draggable={false}
        loading="eager"
        fetchPriority="high"
        decoding="async"
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

  const IconComponent = lucideCategoryIcons[icon];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }

  // Fallback icon if not found
  return <BookOpen className={className} />;
};
