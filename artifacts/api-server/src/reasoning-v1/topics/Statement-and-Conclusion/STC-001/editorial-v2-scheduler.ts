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
  const seedWithinBlock = positiveModulo(integerSeed, 16);
  const block = Math.floor(integerSeed / 16);
  const offset = QL_OFFSETS[input.qlId];
  const mixed = mixBlock(block, offset);
  const rotation = positiveModulo(offset + (mixed & 15), 16);
  const reverseSchedule = Boolean(mixed & 16);
  const scheduledIndex = reverseSchedule
    ? positiveModulo(rotation - seedWithinBlock, 16)
    : positiveModulo(rotation + seedWithinBlock, 16);
  const presentationSlot = BASE_SLOT_PERMUTATION[scheduledIndex]!;

  return Object.freeze({
    authorityIndex: presentationSlot % 8,
    reverseConclusions: presentationSlot >= 8,
    presentationSlot,
    scheduleBlock: block,
  });
}

export function reverseStcV2AnswerClass(answerClass: StcV2AnswerClass): StcV2AnswerClass {
  switch (answerClass) {
    case "ONLY_I": return "ONLY_II";
    case "ONLY_II": return "ONLY_I";
    case "BOTH": return "BOTH";
    case "NEITHER": return "NEITHER";
  }
}
