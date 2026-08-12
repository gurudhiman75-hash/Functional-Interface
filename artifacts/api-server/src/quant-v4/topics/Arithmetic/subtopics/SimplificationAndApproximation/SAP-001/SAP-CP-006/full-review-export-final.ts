import {
  SAP_CP006_FULL_REVIEW_CATALOGUE,
  SAP_CP006_FULL_REVIEW_PROTOTYPE_IDS,
  SAP_CP006_FULL_REVIEW_TOTAL,
  sapCp006FullReviewCountForPrototype,
  type SapCp006FullReviewBasePackage,
  type SapCp006FullReviewPrototypeId,
  type SapCp006FullReviewRecord,
} from "./full-review-export";
import { SAP_CP006_PROTOTYPE_IDS, type SapCp006PrototypeId } from "./runtime";
import { generateSapCp006Editorial } from "./editorial-runtime-v3";
import { SAP_CP006_WAVE2_PROTOTYPE_IDS, type SapCp006Wave2PrototypeId } from "./runtime-wave2";
import { generateSapCp006Wave2Editorial } from "./wave2-editorial";
import { generateSapCp006Wave3, type SapCp006Wave3PrototypeId } from "./runtime-wave3-v3";

export {
  SAP_CP006_FULL_REVIEW_CATALOGUE,
  SAP_CP006_FULL_REVIEW_PROTOTYPE_IDS,
  SAP_CP006_FULL_REVIEW_TOTAL,
  sapCp006FullReviewCountForPrototype,
};
export type {
  SapCp006FullReviewBasePackage,
  SapCp006FullReviewPrototypeId,
  SapCp006FullReviewRecord,
} from "./full-review-export";

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

function targetPositions(): readonly number[] {
  const positions = [0, 1, 2, 3].flatMap((position) => Array.from({ length: 75 }, () => position));
  let state = 0x6c06e71a;
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
    if (!repaired) throw new Error(`Unable to repair answer-position run at ${index}.`);
  }
  return Object.freeze(positions);
}

const COMPARISON_SEQUENCE = ["A < B", "A = B", "A > B"] as const;
const FACTORIAL_INPUT_SEQUENCE = ["3", "4", "5", "6"] as const;
const DS_SEQUENCE = [
  "I alone is sufficient",
  "II alone is sufficient",
  "Both together are sufficient",
  "Even together are insufficient",
] as const;

function generatePackage(prototypeId: SapCp006FullReviewPrototypeId, seed: number): SapCp006FullReviewBasePackage {
  if ((SAP_CP006_PROTOTYPE_IDS as readonly string[]).includes(prototypeId)) {
    return generateSapCp006Editorial(prototypeId as SapCp006PrototypeId, seed);
  }
  if ((SAP_CP006_WAVE2_PROTOTYPE_IDS as readonly string[]).includes(prototypeId)) {
    return generateSapCp006Wave2Editorial(prototypeId as SapCp006Wave2PrototypeId, seed);
  }
  return generateSapCp006Wave3(prototypeId as SapCp006Wave3PrototypeId, seed);
}

function passesVarietyTarget(prototypeId: SapCp006FullReviewPrototypeId, accepted: number, pkg: SapCp006FullReviewBasePackage): boolean {
  if (prototypeId === "SAP-CP006-PROT-COMPARE-EXACT-EXPRESSIONS") {
    return pkg.canonicalAnswer === COMPARISON_SEQUENCE[accepted % COMPARISON_SEQUENCE.length];
  }
  if (prototypeId === "SAP-CP006-PROT-ORDER-MIXED-REPRESENTATIONS") {
    const shouldUseTable = accepted % 2 === 0;
    return (pkg.oracle.data.tableWrapper === 1) === shouldUseTable;
  }
  if (prototypeId === "SAP-CP006-PROT-COMPOSED-FACTORIAL-MISSING") {
    return pkg.canonicalAnswer === FACTORIAL_INPUT_SEQUENCE[accepted % FACTORIAL_INPUT_SEQUENCE.length];
  }
  if (prototypeId === "SAP-CP006-PROT-EXACT-ARITHMETIC-DATA-SUFFICIENCY") {
    return pkg.canonicalAnswer === DS_SEQUENCE[accepted % DS_SEQUENCE.length];
  }
  return true;
}

export function generateSapCp006FullReviewRecords(): readonly SapCp006FullReviewRecord[] {
  const targets = targetPositions();
  const records: SapCp006FullReviewRecord[] = [];
  const payloads = new Set<string>();
  let reviewIndex = 0;

  for (const prototypeId of SAP_CP006_FULL_REVIEW_PROTOTYPE_IDS) {
    const targetCount = sapCp006FullReviewCountForPrototype(prototypeId);
    let accepted = 0;
    let seed = 1;
    while (accepted < targetCount) {
      if (seed > 100_000) throw new Error(`${prototypeId}: unable to find balanced diverse review records.`);
      const pkg = generatePackage(prototypeId, seed);
      seed += 1;
      if (!pkg.validation.ok) continue;
      if (pkg.correctIndex !== targets[reviewIndex]) continue;
      if (!passesVarietyTarget(prototypeId, accepted, pkg)) continue;
      if (payloads.has(pkg.canonicalPayloadKey)) continue;
      payloads.add(pkg.canonicalPayloadKey);
      records.push(Object.freeze({
        ...pkg,
        questionId: `SAP-CP006-FULL-REV-${String(reviewIndex + 1).padStart(3, "0")}`,
      }) as SapCp006FullReviewRecord);
      accepted += 1;
      reviewIndex += 1;
    }
  }

  if (records.length !== SAP_CP006_FULL_REVIEW_TOTAL) throw new Error(`Expected ${SAP_CP006_FULL_REVIEW_TOTAL} full-review records, received ${records.length}.`);
  return Object.freeze(records);
}
