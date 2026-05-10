import type { RealizerLanguage } from "../types";

export type ColorEntity = {
  id: string;
  display: Record<RealizerLanguage, string>;
  hex: string;
};

export const COLORS: ColorEntity[] = [
  {
    id: "red",
    display: { en: "Red", hi: "लाल", pa: "ਲਾਲ" },
    hex: "#ef4444",
  },
  {
    id: "blue",
    display: { en: "Blue", hi: "नीला", pa: "ਨੀਲਾ" },
    hex: "#3b82f6",
  },
  {
    id: "green",
    display: { en: "Green", hi: "हरा", pa: "ਹਰਾ" },
    hex: "#22c55e",
  },
  {
    id: "yellow",
    display: { en: "Yellow", hi: "पीला", pa: "ਪੀਲਾ" },
    hex: "#eab308",
  },
];
