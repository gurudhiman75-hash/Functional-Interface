import {
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010,
  type SapCp010Package,
} from "./root-depth-final-runtime";

export interface SapCp010RootDepthReviewRecord extends SapCp010Package { readonly questionId: string; }

function residueSeed(originalSeed: number, min: number, max: number, occurrence: number): number {
  const candidates: number[] = [];
  for (let seed = min; seed <= max; seed += 1) {
    if ((seed - originalSeed) % 4 === 0) candidates.push(seed);
  }
  const selected = candidates[occurrence];
  if (selected == null) throw new Error(`No matching review seed.`);
  return selected;
}

function reviewSeeds(mode: number): readonly number[] {
  const count = mode < 11 ? 18 : 17;
  if (mode === 0 || mode === 1 || mode === 2 || mode === 14 || mode === 16) {
    return Object.freeze(Array.from({ length: count }, (_, i) => {
      const band = i % 5;
      return residueSeed(i + 1, band * 20 + 1, band * 20 + 20, Math.floor(i / 5));
    }));
  }
  if (mode === 3 || mode === 4) {
    return Object.freeze(Array.from({ length: count }, (_, i) => {
      const band = i % 4;
      return residueSeed(i + 1, band * 25 + 1, band * 25 + 25, Math.floor(i / 4));
    }));
  }
  if (mode === 7) return Object.freeze([1, 58, 3, 60, 5, 62, 7, 64, 9, 66, 11, 68, 13, 70, 15, 72, 17, 74]);
  if (mode === 12) return Object.freeze([1, 54, 3, 56, 5, 58, 7, 60, 9, 62, 11, 64, 13, 66, 15, 68, 17]);
  if (mode === 13) return Object.freeze([1, 26, 51, 76, 5, 30, 55, 80, 9, 34, 59, 84, 13, 38, 63, 88, 17]);
  return Object.freeze(Array.from({ length: count }, (_, i) => i + 1));
}

export function generateSapCp010RootDepthReviewRecords(): readonly SapCp010RootDepthReviewRecord[] {
  const out: SapCp010RootDepthReviewRecord[] = [];
  SAP_CP010_PROTOTYPE_IDS.forEach((id, mode) => {
    for (const seed of reviewSeeds(mode)) {
      out.push(Object.freeze({ ...generateSapCp010(id, seed), questionId: `SAP-CP010-RD-${String(out.length + 1).padStart(3, "0")}` }));
    }
  });
  return Object.freeze(out);
}
