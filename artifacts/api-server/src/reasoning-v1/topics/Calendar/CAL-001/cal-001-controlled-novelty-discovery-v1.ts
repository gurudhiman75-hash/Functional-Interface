import {
  DeterministicRandom,
  addDays,
  enumerateWeekdayFrequency,
  ordinalDaysInMonth,
  ordinalWeekday,
  stableDigest,
  weekdayFrequencyInInclusiveRange,
} from "./foundation.ts";
import type { GregorianDate, Month, Weekday } from "./types.ts";
import {
  validateReasoningNoveltyCandidateV1,
  type ReasoningNoveltyAxisV1,
} from "../../../shared/reasoning-novelty-governance-v1";

export const CAL_001_CONTROLLED_NOVELTY_DISCOVERY_V1 =
  "CAL_001_CONTROLLED_NOVELTY_DISCOVERY_V1" as const;

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

function formatDate(date: GregorianDate): string {
  return `${date.day} ${MONTH_NAMES[date.month]} ${date.year}`;
}

function rotate<T>(values: readonly T[], amount: number): T[] {
  if (values.length === 0) return [];
  const offset = ((amount % values.length) + values.length) % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

function independentCount(
  startDate: GregorianDate,
  durationDays: number,
  namedWeekday: Weekday,
): number {
  let count = 0;
  for (let offset = 0; offset < durationDays; offset += 1) {
    const date = addDays(startDate, offset);
    if (ordinalWeekday(date) === namedWeekday) count += 1;
  }
  return count;
}

export interface CalControlledNovelImplicitRangeFrequencyCandidateV1 {
  readonly candidateId: string;
  readonly provenance: "CONTROLLED_NOVEL";
  readonly noveltyAxes: readonly ReasoningNoveltyAxisV1[];
  readonly parentQlIds: readonly ["CAL-QL-005", "CAL-QL-035"];
  readonly seed: number;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly semanticFingerprint: string;
  readonly solverAgreement: true;
  readonly permanentQlAllocated: false;
  readonly nextAvailableQl: "CAL-QL-037";
  readonly questionStudioNoveltyMixActivated: false;
  readonly humanReviewRequired: true;
  readonly falsePyqAttribution: false;
  readonly structuredState: {
    readonly startDate: GregorianDate;
    readonly endDate: GregorianDate;
    readonly durationDays: number;
    readonly namedWeekday: Weekday;
    readonly count: number;
  };
}

export function generateCalControlledNovelImplicitRangeFrequencyCandidateV1(
  seed: number,
): CalControlledNovelImplicitRangeFrequencyCandidateV1 {
  if (!Number.isSafeInteger(seed)) {
    throw new Error("CAL controlled-novel seed must be a safe integer.");
  }

  const rng = new DeterministicRandom(
    `${CAL_001_CONTROLLED_NOVELTY_DISCOVERY_V1}:${seed}`,
  );
  const year = rng.int(1995, 2095);
  const month = rng.int(1, 12) as Month;
  const maxStartDay = Math.min(24, ordinalDaysInMonth(year, month));
  const startDate: GregorianDate = {
    year,
    month,
    day: rng.int(1, maxStartDay),
  };
  const durationDays = rng.int(16, 45);
  const namedWeekday = rng.int(0, 6) as Weekday;
  const endDate = addDays(startDate, durationDays - 1);

  const primaryCount =
    weekdayFrequencyInInclusiveRange(startDate, endDate)[namedWeekday];
  const enumeratedFrequency = enumerateWeekdayFrequency(startDate, endDate);
  const enumeratedCount = enumeratedFrequency[namedWeekday];
  const independent = independentCount(startDate, durationDays, namedWeekday);

  if (primaryCount !== enumeratedCount || primaryCount !== independent) {
    throw new Error(
      "CAL controlled-novel frequency solvers disagree: " +
      JSON.stringify({ primaryCount, enumeratedCount, independent }),
    );
  }

  const distractors = [
    primaryCount,
    primaryCount - 1,
    primaryCount + 1,
    primaryCount + 2,
  ];
  if (Math.min(...distractors) < 0 || new Set(distractors).size !== 4) {
    throw new Error("CAL controlled-novel distractor construction failed.");
  }

  const optionValues = rotate(distractors, Math.abs(seed) % 4);
  const correctIndex = optionValues.indexOf(primaryCount);
  if (correctIndex < 0) {
    throw new Error("CAL controlled-novel correct option is missing.");
  }
  const options = optionValues.map(String);

  const stem =
    `A training programme begins on ${formatDate(startDate)} and runs for ${durationDays} consecutive days, counting the starting day as Day 1. How many ${WEEKDAY_NAMES[namedWeekday]}s occur during the programme?`;

  const noveltyAxes = [
    "INFORMATION_DISTRIBUTION",
    "MULTI_STAGE_COMPOSITION",
    "VALID_CROSS_FAMILY_COMPOSITION",
    "BOUNDARY_CONDITION",
  ] as const satisfies readonly ReasoningNoveltyAxisV1[];

  validateReasoningNoveltyCandidateV1({
    candidateId: "CAL-NOVEL-IMPLICIT-RANGE-FREQUENCY-" + seed,
    chapterId: "CAL-001",
    qlId: "CAL-QL-005+CAL-QL-035",
    provenance: "CONTROLLED_NOVEL",
    noveltyAxes,
    solverVerified: true,
    uniqueCorrectAnswer: true,
    plausibleDistractors: options.length === 4 && new Set(options).size === 4,
    examNatural: true,
    falseHistoricalAttribution: false,
    humanReviewRequired: true,
  });

  return {
    candidateId: "CAL-NOVEL-IMPLICIT-RANGE-FREQUENCY-" + seed,
    provenance: "CONTROLLED_NOVEL",
    noveltyAxes,
    parentQlIds: ["CAL-QL-005", "CAL-QL-035"],
    seed,
    stem,
    options,
    correctIndex,
    answer: options[correctIndex]!,
    semanticFingerprint: stableDigest({
      authority: CAL_001_CONTROLLED_NOVELTY_DISCOVERY_V1,
      startDate,
      endDate,
      durationDays,
      namedWeekday,
      count: primaryCount,
    }),
    solverAgreement: true,
    permanentQlAllocated: false,
    nextAvailableQl: "CAL-QL-037",
    questionStudioNoveltyMixActivated: false,
    humanReviewRequired: true,
    falsePyqAttribution: false,
    structuredState: {
      startDate,
      endDate,
      durationDays,
      namedWeekday,
      count: primaryCount,
    },
  };
}
