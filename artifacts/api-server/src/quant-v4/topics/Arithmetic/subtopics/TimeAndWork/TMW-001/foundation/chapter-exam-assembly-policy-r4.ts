export type TmwExamAssemblyTier = "CORE_EXAM_PATTERN" | "UPPER_EXAM_PRACTICE" | "ADVANCED_ENRICHMENT";

export interface TmwExamAssemblyPolicy {
  tier: TmwExamAssemblyTier;
  routineMockEligible: boolean;
  defaultRelativeWeight: number;
  purpose: "routine-mock" | "limited-mock-and-practice" | "practice-only";
}

const ADVANCED_IDS = new Set([
  "TMW-QL-075",
  "TMW-QL-098", "TMW-QL-101", "TMW-QL-102", "TMW-QL-103", "TMW-QL-105",
  "TMW-QL-139", "TMW-QL-143",
  "TMW-QL-187", "TMW-QL-188", "TMW-QL-189", "TMW-QL-190", "TMW-QL-191", "TMW-QL-192",
  "TMW-QL-206", "TMW-QL-207", "TMW-QL-208", "TMW-QL-210", "TMW-QL-211",
  "TMW-QL-229",
]);

const UPPER_IDS = new Set([
  ...Array.from({ length: 19 }, (_, index) => `TMW-QL-${String(63 + index).padStart(3, "0")}`),
  ...Array.from({ length: 24 }, (_, index) => `TMW-QL-${String(82 + index).padStart(3, "0")}`),
  "TMW-QL-121", "TMW-QL-122", "TMW-QL-123", "TMW-QL-126",
  ...Array.from({ length: 11 }, (_, index) => `TMW-QL-${String(133 + index).padStart(3, "0")}`),
  ...Array.from({ length: 7 }, (_, index) => `TMW-QL-${String(150 + index).padStart(3, "0")}`),
  ...Array.from({ length: 12 }, (_, index) => `TMW-QL-${String(175 + index).padStart(3, "0")}`),
  ...Array.from({ length: 15 }, (_, index) => `TMW-QL-${String(197 + index).padStart(3, "0")}`),
  "TMW-QL-224", "TMW-QL-225", "TMW-QL-226", "TMW-QL-227", "TMW-QL-228",
]);

function ordinal(qlId: string): number {
  const match = /^TMW-QL-(\d{3})$/.exec(qlId);
  if (!match) throw new Error(`Invalid TMW QL ID for exam assembly: ${qlId}`);
  const value = Number(match[1]);
  if (!Number.isInteger(value) || value < 1 || value > 229) throw new Error(`TMW QL outside 229-QL assembly range: ${qlId}`);
  return value;
}

export function tmw001ExamAssemblyPolicy(qlId: string): TmwExamAssemblyPolicy {
  ordinal(qlId);

  if (ADVANCED_IDS.has(qlId)) {
    return {
      tier: "ADVANCED_ENRICHMENT",
      routineMockEligible: false,
      defaultRelativeWeight: 0,
      purpose: "practice-only",
    };
  }

  if (UPPER_IDS.has(qlId)) {
    return {
      tier: "UPPER_EXAM_PRACTICE",
      routineMockEligible: true,
      defaultRelativeWeight: 0.35,
      purpose: "limited-mock-and-practice",
    };
  }

  return {
    tier: "CORE_EXAM_PATTERN",
    routineMockEligible: true,
    defaultRelativeWeight: 1,
    purpose: "routine-mock",
  };
}

export function tmw001ExamAssemblyTierCounts(): Record<TmwExamAssemblyTier, number> {
  const counts: Record<TmwExamAssemblyTier, number> = {
    CORE_EXAM_PATTERN: 0,
    UPPER_EXAM_PRACTICE: 0,
    ADVANCED_ENRICHMENT: 0,
  };
  for (let index = 1; index <= 229; index += 1) {
    const qlId = `TMW-QL-${String(index).padStart(3, "0")}`;
    counts[tmw001ExamAssemblyPolicy(qlId).tier] += 1;
  }
  return counts;
}
