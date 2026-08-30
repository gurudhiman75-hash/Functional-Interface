import type { StcQlId } from "./types.ts";
import type { StcV2AnswerClass } from "./editorial-v2-types.ts";

/**
 * V2.1 presentation scheduling deliberately separates semantic-authority order
 * from raw seed modulo order. The 16 slots cover every one of the eight
 * authorities twice: once in canonical conclusion order and once reversed.
 *
 * This is an anti-gaming correction only. It does NOT make the chapter
 * saturation-ready; the finite 16-presentation ceiling per QL is explicitly
 * governed elsewhere until a variableized surface engine is added.
 */
export const STC_V2_PRESENTATION_SLOTS_PER_QL = 16 as const;
export const STC_V2_AUTHORITIES_PER_QL = 8 as const;

const BASE_SLOT_PERMUTATION = [3, 13, 15, 0, 4, 6, 8, 11, 2, 7, 14, 9, 12, 1, 10, 5] as const;

const QL_OFFSETS: Readonly<Record<StcQlId, number>> = Object.freeze({
  "STC-QL-001": 0,
  "STC-QL-002": 5,
  "STC-QL-003": 9,
  "STC-QL-004": 13,
  "STC-QL-005": 3,
  "STC-QL-006": 11,
});

function positiveModulo(value: number, divisor: number): number {
  const integer = Number.isFinite(value) ? Math.trunc(value) : 0;
  return ((integer % divisor) + divisor) % divisor;
}

function mixBlock(block: number, qlOffset: number): number {
  // A small integer mixer used only to rotate/reverse the 16-slot schedule
  // between seed blocks. It cannot create new textual authorities, so it is
  // not counted as saturation.
  let value = (block ^ (qlOffset * 0x45d9f3b)) >>> 0;
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b) >>> 0;
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b) >>> 0;
  return (value ^ (value >>> 16)) >>> 0;
}

export type StcV2ScheduledPresentation = Readonly<{
  authorityIndex: number;
  reverseConclusions: boolean;
  presentationSlot: number;
  scheduleBlock: number;
}>;

export function scheduleStcV2Presentation(input: {
  readonly qlId: StcQlId;
  readonly seed: number;
}): StcV2ScheduledPresentation {
  const integerSeed = Number.isFinite(input.seed) ? Math.trunc(input.seed) : 0;
  const seedWithinBlock = positiveModulo(integerSeed, STC_V2_PRESENTATION_SLOTS_PER_QL);
  const block = Math.floor(integerSeed / STC_V2_PRESENTATION_SLOTS_PER_QL);
  const offset = QL_OFFSETS[input.qlId];
  const mixed = mixBlock(block, offset);
  const rotation = positiveModulo(offset + (mixed & 15), STC_V2_PRESENTATION_SLOTS_PER_QL);
  const reverseSchedule = Boolean(mixed & 16);
  const scheduledIndex = reverseSchedule
    ? positiveModulo(rotation - seedWithinBlock, STC_V2_PRESENTATION_SLOTS_PER_QL)
    : positiveModulo(rotation + seedWithinBlock, STC_V2_PRESENTATION_SLOTS_PER_QL);
  const presentationSlot = BASE_SLOT_PERMUTATION[scheduledIndex]!;

  return Object.freeze({
    authorityIndex: presentationSlot % STC_V2_AUTHORITIES_PER_QL,
    reverseConclusions: presentationSlot >= STC_V2_AUTHORITIES_PER_QL,
    presentationSlot,
    scheduleBlock: block,
  });
}

/** Returns the seed in the first schedule block that presents one authority in canonical conclusion order. */
export function canonicalReviewSeedForAuthorityIndex(qlId: StcQlId, authorityIndex: number): number {
  if (!Number.isInteger(authorityIndex) || authorityIndex < 0 || authorityIndex >= STC_V2_AUTHORITIES_PER_QL) {
    throw new Error(`STC V2 authority index out of range: ${authorityIndex}`);
  }
  for (let seed = 0; seed < STC_V2_PRESENTATION_SLOTS_PER_QL; seed += 1) {
    const scheduled = scheduleStcV2Presentation({ qlId, seed });
    if (scheduled.authorityIndex === authorityIndex && !scheduled.reverseConclusions) return seed;
  }
  throw new Error(`${qlId}: no canonical review seed found for authority index ${authorityIndex}`);
}

export function reverseStcV2AnswerClass(answerClass: StcV2AnswerClass): StcV2AnswerClass {
  switch (answerClass) {
    case "ONLY_I": return "ONLY_II";
    case "ONLY_II": return "ONLY_I";
    case "BOTH": return "BOTH";
    case "NEITHER": return "NEITHER";
  }
}
