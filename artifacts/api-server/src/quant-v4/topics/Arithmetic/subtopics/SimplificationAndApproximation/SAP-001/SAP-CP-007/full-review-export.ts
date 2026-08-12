import {
  SAP_CP007_CATALOGUE,
  SAP_CP007_PROTOTYPE_IDS,
  generateSapCp007,
  type SapCp007Package,
  type SapCp007PrototypeId,
} from "./editorial-runtime";
import {
  SAP_CP007_WAVE2_CATALOGUE,
  SAP_CP007_WAVE2_PROTOTYPE_IDS,
  generateSapCp007Wave2,
  type SapCp007Wave2Package,
  type SapCp007Wave2PrototypeId,
} from "./wave2-editorial";

export type SapCp007FullReviewPrototypeId = SapCp007PrototypeId | SapCp007Wave2PrototypeId;
export type SapCp007FullReviewBasePackage = SapCp007Package | SapCp007Wave2Package;
export type SapCp007FullReviewRecord = SapCp007FullReviewBasePackage & { readonly questionId: string };

export const SAP_CP007_FULL_REVIEW_PROTOTYPE_IDS: readonly SapCp007FullReviewPrototypeId[] = Object.freeze([
  ...SAP_CP007_PROTOTYPE_IDS,
  ...SAP_CP007_WAVE2_PROTOTYPE_IDS,
]);

export const SAP_CP007_FULL_REVIEW_CATALOGUE = Object.freeze([
  ...SAP_CP007_CATALOGUE,
  ...SAP_CP007_WAVE2_CATALOGUE,
]);

export const SAP_CP007_FULL_REVIEW_TOTAL = 300;

export function sapCp007FullReviewCountForPrototype(prototypeId: SapCp007FullReviewPrototypeId): number {
  return (SAP_CP007_PROTOTYPE_IDS as readonly string[]).includes(prototypeId) ? 19 : 18;
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

function targetPositions(): readonly number[] {
  const positions = [0, 1, 2, 3].flatMap((position) => Array.from({ length: 75 }, () => position));
  let state = 0x7a07d14f;
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
    if (!repaired) throw new Error(`Unable to repair CP-007 answer-position run at ${index}.`);
  }
  return Object.freeze(positions);
}

function generatePackage(prototypeId: SapCp007FullReviewPrototypeId, seed: number): SapCp007FullReviewBasePackage {
  if ((SAP_CP007_PROTOTYPE_IDS as readonly string[]).includes(prototypeId)) {
    return generateSapCp007(prototypeId as SapCp007PrototypeId, seed);
  }
  return generateSapCp007Wave2(prototypeId as SapCp007Wave2PrototypeId, seed);
}

const UNIT_SEQUENCE = [10, 100, 1000] as const;
const DP_SEQUENCE = [1, 2, 3] as const;
const ERROR_SEQUENCE = ["0.01", "0.02", "0.03", "0.04", "0.05"] as const;
const RELATION_SEQUENCE = ["A = B", "A < B", "A > B"] as const;
const MAX_ERROR_CASE_SEQUENCE = [0, 1, 2, 3] as const;

function passesVarietyTarget(
  prototypeId: SapCp007FullReviewPrototypeId,
  accepted: number,
  pkg: SapCp007FullReviewBasePackage,
): boolean {
  const d = pkg.oracle.data;
  if (prototypeId === "SAP-CP007-PROT-ROUND-INTEGER-DECLARED-PLACE" ||
      prototypeId === "SAP-CP007-PROT-IDENTIFY-DECIDING-DIGIT" ||
      prototypeId === "SAP-CP007-PROT-REVERSE-INTEGER-ROUNDING-INTERVAL" ||
      prototypeId === "SAP-CP007-PROT-LEAST-INTEGER-FOR-ROUNDED-TARGET" ||
      prototypeId === "SAP-CP007-PROT-GREATEST-INTEGER-FOR-ROUNDED-TARGET") {
    return d.unit === UNIT_SEQUENCE[accepted % UNIT_SEQUENCE.length];
  }
  if (prototypeId === "SAP-CP007-PROT-ROUND-DECIMAL-PLACES") {
    return d.targetDp === DP_SEQUENCE[accepted % DP_SEQUENCE.length];
  }
  if (prototypeId === "SAP-CP007-PROT-NEGATIVE-HALFWAY-EXPLICIT-RULE") {
    return d.targetDp === accepted % 2;
  }
  if (prototypeId === "SAP-CP007-PROT-CORRECT-PRECISION-REPRESENTATION") {
    return d.carryCase === accepted % 2;
  }
  if (prototypeId === "SAP-CP007-PROT-MISSING-DIGIT-FOR-ROUNDING") {
    return d.roundUp === accepted % 2;
  }
  if (prototypeId === "SAP-CP007-PROT-ABSOLUTE-ROUNDING-ERROR") {
    return pkg.canonicalAnswer === ERROR_SEQUENCE[accepted % ERROR_SEQUENCE.length];
  }
  if (prototypeId === "SAP-CP007-PROT-COMPARE-ROUNDED-PRECISIONS") {
    return pkg.canonicalAnswer === RELATION_SEQUENCE[accepted % RELATION_SEQUENCE.length];
  }
  if (prototypeId === "SAP-CP007-PROT-MAXIMUM-POSSIBLE-ROUNDING-ERROR") {
    return d.caseIndex === MAX_ERROR_CASE_SEQUENCE[accepted % MAX_ERROR_CASE_SEQUENCE.length];
  }
  if (prototypeId === "SAP-CP007-PROT-RELATIVE-ROUNDING-ERROR") {
    return d.unit === UNIT_SEQUENCE[accepted % UNIT_SEQUENCE.length];
  }
  if (prototypeId === "SAP-CP007-PROT-PREMATURE-ROUNDING-DIAGNOSIS") {
    return Number(d.aScaled) % 100 === (accepted % 2 === 0 ? 51 : 49);
  }
  return true;
}

export function generateSapCp007FullReviewRecords(): readonly SapCp007FullReviewRecord[] {
  const targets = targetPositions();
  const records: SapCp007FullReviewRecord[] = [];
  const payloads = new Set<string>();
  let reviewIndex = 0;

  for (const prototypeId of SAP_CP007_FULL_REVIEW_PROTOTYPE_IDS) {
    const targetCount = sapCp007FullReviewCountForPrototype(prototypeId);
    let accepted = 0;
    let seed = 1;
    while (accepted < targetCount) {
      if (seed > 100_000) throw new Error(`${prototypeId}: unable to find balanced diverse CP-007 review records.`);
      const pkg = generatePackage(prototypeId, seed);
      seed += 1;
      if (!pkg.validation.ok) continue;
      if (pkg.correctIndex !== targets[reviewIndex]) continue;
      if (!passesVarietyTarget(prototypeId, accepted, pkg)) continue;
      if (payloads.has(pkg.canonicalPayloadKey)) continue;
      payloads.add(pkg.canonicalPayloadKey);
      records.push(Object.freeze({
        ...pkg,
        questionId: `SAP-CP007-REV-${String(reviewIndex + 1).padStart(3, "0")}`,
      }) as SapCp007FullReviewRecord);
      accepted += 1;
      reviewIndex += 1;
    }
  }

  if (records.length !== SAP_CP007_FULL_REVIEW_TOTAL) throw new Error(`Expected ${SAP_CP007_FULL_REVIEW_TOTAL} CP-007 review records, received ${records.length}.`);
  return Object.freeze(records);
}
