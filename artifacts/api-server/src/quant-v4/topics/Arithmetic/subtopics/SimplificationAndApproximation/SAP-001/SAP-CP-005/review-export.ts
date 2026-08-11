import {
  SAP_CP005_CATALOGUE,
  SAP_CP005_PROTOTYPE_IDS,
  type SapCp005Package,
  type SapCp005PrototypeId,
} from "./runtime";
import {
  SAP_CP005_WAVE2_CATALOGUE,
  SAP_CP005_WAVE2_PROTOTYPE_IDS,
  type SapCp005Wave2Package,
  type SapCp005Wave2PrototypeId,
} from "./runtime-wave2";
import {
  generateSapCp005Editorial,
  generateSapCp005Wave2EditorialV2,
} from "./editorial-runtime-v2";

export type SapCp005ReviewPrototypeId = SapCp005PrototypeId | SapCp005Wave2PrototypeId;
export type SapCp005ReviewBasePackage = SapCp005Package | SapCp005Wave2Package;
export type SapCp005ReviewRecord = SapCp005ReviewBasePackage & { readonly questionId: string };

export const SAP_CP005_REVIEW_PROTOTYPE_IDS: readonly SapCp005ReviewPrototypeId[] = Object.freeze([
  ...SAP_CP005_PROTOTYPE_IDS,
  ...SAP_CP005_WAVE2_PROTOTYPE_IDS,
]);

export const SAP_CP005_REVIEW_CATALOGUE = Object.freeze([
  ...SAP_CP005_CATALOGUE,
  ...SAP_CP005_WAVE2_CATALOGUE,
]);

const REVIEW_COUNT_PER_PROTOTYPE = 15;

const LONG_EXPRESSION_LIMITS: Partial<Record<SapCp005ReviewPrototypeId, number>> = {
  "SAP-CP005-PROT-PRODUCT-OF-RECIPROCALS": 105,
  "SAP-CP005-PROT-TELESCOPING-SUM": 135,
  "SAP-CP005-PROT-TELESCOPING-PRODUCT": 105,
  "SAP-CP005-PROT-ONE-PLUS-MINUS-CHAIN": 135,
};

export function sapCp005ReviewStemLimit(prototypeId: SapCp005ReviewPrototypeId): number {
  return LONG_EXPRESSION_LIMITS[prototypeId] ?? 170;
}

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
  let state = 0x5a17c005;
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
    if (!repaired) throw new Error(`Unable to repair answer-position run at index ${index}.`);
  }

  return Object.freeze(positions);
}

function generatePackage(prototypeId: SapCp005ReviewPrototypeId, seed: number): SapCp005ReviewBasePackage {
  if ((SAP_CP005_PROTOTYPE_IDS as readonly string[]).includes(prototypeId)) {
    return generateSapCp005Editorial(prototypeId as SapCp005PrototypeId, seed);
  }
  return generateSapCp005Wave2EditorialV2(prototypeId as SapCp005Wave2PrototypeId, seed);
}

export function generateSapCp005ReviewRecords(): readonly SapCp005ReviewRecord[] {
  const targetPositions = reviewAnswerPositionSequence();
  const records: SapCp005ReviewRecord[] = [];
  const globalPayloads = new Set<string>();
  let reviewIndex = 0;

  for (const prototypeId of SAP_CP005_REVIEW_PROTOTYPE_IDS) {
    let accepted = 0;
    let seed = 1;
    const maxStemLength = sapCp005ReviewStemLimit(prototypeId);
    while (accepted < REVIEW_COUNT_PER_PROTOTYPE) {
      if (seed > 100_000) throw new Error(`${prototypeId}: unable to find ${REVIEW_COUNT_PER_PROTOTYPE} balanced unique review payloads.`);
      const pkg = generatePackage(prototypeId, seed);
      seed += 1;
      if (!pkg.validation.ok) continue;
      if (pkg.stem.length > maxStemLength) continue;
      if (pkg.correctIndex !== targetPositions[reviewIndex]) continue;
      if (globalPayloads.has(pkg.canonicalPayloadKey)) continue;
      globalPayloads.add(pkg.canonicalPayloadKey);
      records.push(Object.freeze({
        ...pkg,
        questionId: `SAP-CP005-REV-${String(reviewIndex + 1).padStart(3, "0")}`,
      }) as SapCp005ReviewRecord);
      accepted += 1;
      reviewIndex += 1;
    }
  }

  if (records.length !== 300) throw new Error(`Expected 300 review records, received ${records.length}.`);
  return Object.freeze(records);
}

export const SAP_CP005_REVIEW_COUNT_PER_PROTOTYPE = REVIEW_COUNT_PER_PROTOTYPE;
