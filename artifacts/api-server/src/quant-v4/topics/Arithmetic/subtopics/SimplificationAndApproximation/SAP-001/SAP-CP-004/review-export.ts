import {
  SAP_CP004_PROTOTYPE_IDS,
  generateSapCp004Package,
  type SapCp004Package,
  type SapCp004PrototypeId,
} from "./runtime";

export interface SapCp004ReviewRecord extends SapCp004Package {
  readonly questionId: string;
}

const REVIEW_COUNT_BY_PROTOTYPE: Readonly<Record<SapCp004PrototypeId, number>> = Object.freeze(
  Object.fromEntries(
    SAP_CP004_PROTOTYPE_IDS.map((prototypeId, index) => [prototypeId, index < 15 ? 16 : 15]),
  ) as Record<SapCp004PrototypeId, number>,
);

function hash(value: string): number {
  let state = 2166136261 >>> 0;
  for (const char of value) {
    state ^= char.charCodeAt(0);
    state = Math.imul(state, 16777619) >>> 0;
  }
  state ^= state >>> 16;
  return state >>> 0;
}

function reviewAnswerPositionSequence(): readonly number[] {
  const permutations: readonly (readonly number[])[] = [
    [0, 1, 2, 3], [0, 1, 3, 2], [0, 2, 1, 3], [0, 2, 3, 1], [0, 3, 1, 2], [0, 3, 2, 1],
    [1, 0, 2, 3], [1, 0, 3, 2], [1, 2, 0, 3], [1, 2, 3, 0], [1, 3, 0, 2], [1, 3, 2, 0],
    [2, 0, 1, 3], [2, 0, 3, 1], [2, 1, 0, 3], [2, 1, 3, 0], [2, 3, 0, 1], [2, 3, 1, 0],
    [3, 0, 1, 2], [3, 0, 2, 1], [3, 1, 0, 2], [3, 1, 2, 0], [3, 2, 0, 1], [3, 2, 1, 0],
  ];
  const positions: number[] = [];
  let previous = -1;
  for (let block = 0; block < 75; block += 1) {
    const offset = hash(`SAP-CP004-REVIEW-BLOCK-${block}`) % permutations.length;
    let selected: readonly number[] | undefined;
    for (let attempt = 0; attempt < permutations.length; attempt += 1) {
      const candidate = permutations[(offset + attempt * 7) % permutations.length]!;
      if (candidate[0] !== previous) {
        selected = candidate;
        break;
      }
    }
    selected ??= permutations[offset]!;
    positions.push(...selected);
    previous = selected[3]!;
  }
  return Object.freeze(positions);
}

export function generateSapCp004ReviewRecords(): readonly SapCp004ReviewRecord[] {
  const targetPositions = reviewAnswerPositionSequence();
  const records: SapCp004ReviewRecord[] = [];
  const globalPayloads = new Set<string>();
  let reviewIndex = 0;

  for (const prototypeId of SAP_CP004_PROTOTYPE_IDS) {
    const required = REVIEW_COUNT_BY_PROTOTYPE[prototypeId];
    let accepted = 0;
    let seed = 1;
    while (accepted < required) {
      if (seed > 20_000) throw new Error(`${prototypeId}: unable to find ${required} unique review payloads.`);
      const pkg = generateSapCp004Package(prototypeId, seed, targetPositions[reviewIndex]);
      seed += 1;
      if (!pkg.validation.ok || globalPayloads.has(pkg.canonicalPayloadKey)) continue;
      globalPayloads.add(pkg.canonicalPayloadKey);
      records.push(Object.freeze({
        ...pkg,
        questionId: `SAP-CP004-REV-${String(reviewIndex + 1).padStart(3, "0")}`,
      }));
      reviewIndex += 1;
      accepted += 1;
    }
  }

  if (records.length !== 300) throw new Error(`Expected 300 review records, received ${records.length}.`);
  return Object.freeze(records);
}

export const SAP_CP004_REVIEW_COUNT_BY_PROTOTYPE = REVIEW_COUNT_BY_PROTOTYPE;
