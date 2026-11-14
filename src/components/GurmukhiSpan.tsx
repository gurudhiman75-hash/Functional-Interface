import type { ReactNode } from "react";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;

export function containsGurmukhiText(value: string) {
  return GURMUKHI_RE.test(value);
}

export function GurmukhiSpan({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      lang="pa"
      className={`punjabi-text inline leading-relaxed [font-size:1.1em] ${className}`}
    >
      {children}
    </span>
  );
}
