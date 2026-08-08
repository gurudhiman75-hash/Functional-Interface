import {
  SAP_CP004_PROTOTYPE_IDS,
  generateSapCp004Package,
  type SapCp004Package,
  type SapCp004PrototypeId,
} from "./final-runtime";

export interface SapCp004ReviewRecord extends SapCp004Package {
  readonly questionId: string;
}

const REVIEW_COUNT_BY_PROTOTYPE: Readonly<Record<SapCp004PrototypeId, number>> = Object.freeze(
  Object.fromEntries(
    SAP_CP004_PROTOTYPE_IDS.map((prototypeId, index) => [prototypeId, index < 15 ? 16 : 15]),
  ) as Record<SapCp004PrototypeId, number>,
);

function nextState(value: number): number {
  let state = value >>> 0;
  state ^= (state << 13) >>> 0;
  state ^= state >>> 17;
  state ^= (state << 5) >>> 0;
  return state >>> 0;
}

function createsTriple(sequence: readonly number[], index: number): boolean {
  for (let cursor = Math.max(2, index - 2); cursor <= Math.min(sequence.length - 1, index + 2); cursor += 1) {
    if (sequence[cursor] === sequence[cursor - 1] && sequence[cursor] === sequence[cursor - 2]) return true;
  }
  return false;
}

function reviewAnswerPositionSequence(): readonly number[] {
  const positions = [0, 1, 2, 3].flatMap((position) => Array.from({ length: 75 }, () => position));
  let state = 0x5a17c0de;
  for (let index = positions.length - 1; index > 0; index -= 1) {
    state = nextState(state);
    const swapIndex = state % (index + 1);
    [positions[index], positions[swapIndex]] = [positions[swapIndex]!, positions[index]!];
  }

  for (let index = 2; index < positions.length; index += 1) {
    if (positions[index] !== positions[index - 1] || positions[index] !== positions[index - 2]) continue;
    let repaired = false;
    for (let swapIndex = index + 1; swapIndex < positions.length; swapIndex += 1) {
      if (positions[swapIndex] === positions[index]) continue;
      [positions[index], positions[swapIndex]] = [positions[swapIndex]!, positions[index]!];
      if (!createsTriple(positions, index) && !createsTriple(positions, swapIndex)) {
        repaired = true;
        break;
      }
      [positions[index], positions[swapIndex]] = [positions[swapIndex]!, positions[index]!];
    }
    if (!repaired) throw new Error(`Unable to repair a three-answer run at review index ${index}.`);
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
