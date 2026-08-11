import {
  SAP_CP006_CATALOGUE,
  SAP_CP006_PROTOTYPE_IDS,
  type SapCp006Package,
  type SapCp006PrototypeId,
} from "./runtime";
import { generateSapCp006Editorial } from "./editorial-runtime-v2";

export type SapCp006ReviewRecord = SapCp006Package & { readonly questionId: string };

export const SAP_CP006_REVIEW_COUNT_PER_PROTOTYPE = 10;

function targetPositions(): readonly number[] {
  return Object.freeze(Array.from({ length: 120 }, (_, index) => index % 4));
}

const COMPARISON_REVIEW_SEQUENCE = ["A < B", "A = B", "A > B"] as const;

function passesReviewVarietyTarget(prototypeId: SapCp006PrototypeId, accepted: number, pkg: SapCp006Package): boolean {
  if (prototypeId === "SAP-CP006-PROT-COMPARE-EXACT-EXPRESSIONS") {
    return pkg.canonicalAnswer === COMPARISON_REVIEW_SEQUENCE[accepted % COMPARISON_REVIEW_SEQUENCE.length];
  }
  return true;
}

export function generateSapCp006ReviewRecords(): readonly SapCp006ReviewRecord[] {
  const targets = targetPositions();
  const records: SapCp006ReviewRecord[] = [];
  const payloads = new Set<string>();
  let reviewIndex = 0;

  for (const prototypeId of SAP_CP006_PROTOTYPE_IDS) {
    let accepted = 0;
    let seed = 1;
    while (accepted < SAP_CP006_REVIEW_COUNT_PER_PROTOTYPE) {
      if (seed > 50_000) throw new Error(`${prototypeId}: unable to find balanced, diverse, unique review records.`);
      const pkg = generateSapCp006Editorial(prototypeId as SapCp006PrototypeId, seed);
      seed += 1;
      if (!pkg.validation.ok) continue;
      if (pkg.correctIndex !== targets[reviewIndex]) continue;
      if (!passesReviewVarietyTarget(prototypeId, accepted, pkg)) continue;
      if (payloads.has(pkg.canonicalPayloadKey)) continue;
      payloads.add(pkg.canonicalPayloadKey);
      records.push(Object.freeze({
        ...pkg,
        questionId: `SAP-CP006-REV-${String(reviewIndex + 1).padStart(3, "0")}`,
      }));
      accepted += 1;
      reviewIndex += 1;
    }
  }

  if (records.length !== 120) throw new Error(`Expected 120 review records, received ${records.length}.`);
  return Object.freeze(records);
}

export const SAP_CP006_REVIEW_CATALOGUE = SAP_CP006_CATALOGUE;
