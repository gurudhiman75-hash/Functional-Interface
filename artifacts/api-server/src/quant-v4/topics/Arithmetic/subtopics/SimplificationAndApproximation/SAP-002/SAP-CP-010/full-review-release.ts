import {
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010,
  type SapCp010Package,
} from "./review-ready-runtime";

export interface SapCp010ReviewRecord extends SapCp010Package {
  readonly questionId: string;
}

function reviewSeeds(modeIndex: number): readonly number[] {
  const count = modeIndex < 11 ? 18 : 17;

  // QL-173: preserve the same answer-position residue pattern as seeds 1..18,
  // but force the human review to contain both square and cube percentage-power states.
  if (modeIndex === 7) {
    return Object.freeze([1, 58, 3, 60, 5, 62, 7, 64, 9, 66, 11, 68, 13, 70, 15, 72, 17, 74]);
  }

  // QL-178: sample both sides of the perfect square while preserving the
  // original modulo-4 answer-position pattern.
  if (modeIndex === 12) {
    return Object.freeze([1, 54, 3, 56, 5, 58, 7, 60, 9, 62, 11, 64, 13, 66, 15, 68, 17]);
  }

  // QL-179: cover all four material inverse states:
  // square/above, cube/above, square/below and cube/below.
  if (modeIndex === 13) {
    return Object.freeze([1, 26, 51, 76, 5, 30, 55, 80, 9, 34, 59, 84, 13, 38, 63, 88, 17]);
  }

  return Object.freeze(Array.from({ length: count }, (_, index) => index + 1));
}

export function generateSapCp010ReviewRecords(): readonly SapCp010ReviewRecord[] {
  const records: SapCp010ReviewRecord[] = [];
  SAP_CP010_PROTOTYPE_IDS.forEach((prototypeId, modeIndex) => {
    for (const seed of reviewSeeds(modeIndex)) {
      records.push(Object.freeze({
        ...generateSapCp010(prototypeId, seed),
        questionId: `SAP-CP010-REV-${String(records.length + 1).padStart(3, "0")}`,
      }));
    }
  });
  return Object.freeze(records);
}
