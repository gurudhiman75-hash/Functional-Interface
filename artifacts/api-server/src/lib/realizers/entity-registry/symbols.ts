import type { RealizerLanguage } from "../types";

export type SymbolEntity = {
  id: string;
  display: Record<RealizerLanguage, string>;
};

export const SYMBOLS: SymbolEntity[] = [
  {
    id: "circle",
    display: { en: "Circle", hi: "वृत्त", pa: "ਚੱਕਰ" },
  },
  {
    id: "triangle",
    display: { en: "Triangle", hi: "त्रिभुज", pa: "ਤਿਕੋਣ" },
  },
  {
    id: "square",
    display: { en: "Square", hi: "वर्ग", pa: "ਵਰਗ" },
  },
  {
    id: "star",
    display: { en: "Star", hi: "तारा", pa: "ਤਾਰਾ" },
  },
];
