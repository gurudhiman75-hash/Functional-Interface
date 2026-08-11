import {
  SAP_CP006_CATALOGUE,
  SAP_CP006_PROTOTYPE_IDS,
  generateSapCp006,
  type SapCp006Package,
  type SapCp006PrototypeId,
} from "./runtime";

export type SapCp006ReviewRecord = SapCp006Package & { readonly questionId: string };

export const SAP_CP006_REVIEW_COUNT_PER_PROTOTYPE = 10;

function targetPositions(): readonly number[] {
  return Object.freeze(Array.from({ length: 120 }, (_, index) => index % 4));
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
      if (seed > 50_000) throw new Error(`${prototypeId}: unable to find balanced unique review records.`);
      const pkg = generateSapCp006(prototypeId as SapCp006PrototypeId, seed);
      seed += 1;
      if (!pkg.validation.ok) continue;
      if (pkg.correctIndex !== targets[reviewIndex]) continue;
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
