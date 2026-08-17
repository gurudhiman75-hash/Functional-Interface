import {
  SAP_CP008_CATALOGUE,
  SAP_CP008_PROTOTYPE_IDS,
  generateSapCp008,
  type SapCp008Package,
  type SapCp008PrototypeId,
} from "./runtime-v4";

export type SapCp008ReviewRecord = SapCp008Package & { readonly questionId: string };
export const SAP_CP008_REVIEW_TOTAL = 300;

export function reviewCountForPrototype(prototypeId: SapCp008PrototypeId): number {
  const index = SAP_CP008_PROTOTYPE_IDS.indexOf(prototypeId);
  return index < 12 ? 17 : 16;
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
  let state = 0x8c08a91d;
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
    if (!repaired) throw new Error(`Unable to repair CP-008 answer-position run at ${index}.`);
  }
  return Object.freeze(positions);
}

const UNITS = [10, 100] as const;
const RELATIONS = ["A < B", "A = B", "A > B"] as const;
const OVER_UNDER = ["Overestimate", "Underestimate"] as const;

function passesVariety(prototypeId: SapCp008PrototypeId, accepted: number, pkg: SapCp008Package): boolean {
  const d = pkg.oracle.data;
  if ([
    "SAP-CP008-PROT-APPROX-INTEGER-SUM",
    "SAP-CP008-PROT-APPROX-INTEGER-DIFFERENCE",
    "SAP-CP008-PROT-SIGNED-ADDITIVE-CHAIN",
    "SAP-CP008-PROT-BRACKETED-ADDITIVE-CHAIN",
    "SAP-CP008-PROT-COMPATIBLE-ADDENDS",
    "SAP-CP008-PROT-MISSING-ADDEND-APPROX-EQUALITY",
    "SAP-CP008-PROT-MISSING-SUBTRAHEND-APPROX-EQUALITY",
    "SAP-CP008-PROT-NEAREST-OPTION-ADDITIVE",
    "SAP-CP008-PROT-SUM-ROUNDING-BOUNDS",
    "SAP-CP008-PROT-DIFFERENCE-ROUNDING-BOUNDS",
  ].includes(prototypeId)) return Number(d.unit) === UNITS[accepted % 2];
  if (prototypeId === "SAP-CP008-PROT-COMPARE-ADDITIVE-ESTIMATES") return pkg.canonicalAnswer === RELATIONS[accepted % 3];
  if (prototypeId === "SAP-CP008-PROT-OVER-UNDER-CLASS") return pkg.canonicalAnswer === OVER_UNDER[accepted % 2];
  return true;
}

export function generateSapCp008ReviewRecords(): readonly SapCp008ReviewRecord[] {
  const targets = targetPositions();
  const records: SapCp008ReviewRecord[] = [];
  const payloads = new Set<string>();
  let reviewIndex = 0;

  for (const prototypeId of SAP_CP008_PROTOTYPE_IDS) {
    const count = reviewCountForPrototype(prototypeId);
    let accepted = 0;
    let seed = 1;
    while (accepted < count) {
      if (seed > 100_000) throw new Error(`${prototypeId}: unable to find balanced diverse CP-008 review records.`);
      const pkg = generateSapCp008(prototypeId, seed);
      seed += 1;
      if (!pkg.validation.ok) continue;
      if (pkg.correctIndex !== targets[reviewIndex]) continue;
      if (!passesVariety(prototypeId, accepted, pkg)) continue;
      if (payloads.has(pkg.canonicalPayloadKey)) continue;
      payloads.add(pkg.canonicalPayloadKey);
      records.push(Object.freeze({ ...pkg, questionId: `SAP-CP008-REV-${String(reviewIndex + 1).padStart(3, "0")}` }) as SapCp008ReviewRecord);
      accepted += 1;
      reviewIndex += 1;
    }
  }

  if (records.length !== SAP_CP008_REVIEW_TOTAL) throw new Error(`Expected ${SAP_CP008_REVIEW_TOTAL} CP-008 review records, got ${records.length}.`);
  return Object.freeze(records);
}

export { SAP_CP008_CATALOGUE, SAP_CP008_PROTOTYPE_IDS };
