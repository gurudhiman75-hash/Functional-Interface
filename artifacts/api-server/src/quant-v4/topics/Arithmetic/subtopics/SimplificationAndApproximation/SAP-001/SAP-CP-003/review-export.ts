import { SAP_CP003_PROTOTYPE_IDS, type SapCp003PrototypeId, type SapCp003ReviewRecord } from "./types";
import { generateSapCp003Package } from "./runtime";

const TARGETS: Readonly<Record<SapCp003PrototypeId, number>> = Object.freeze(
  Object.fromEntries(SAP_CP003_PROTOTYPE_IDS.map((prototypeId, index) => [prototypeId, index < 15 ? 16 : 15])) as Record<SapCp003PrototypeId, number>,
);

export function generateSapCp003ReviewRecords(): readonly SapCp003ReviewRecord[] {
  const records: SapCp003ReviewRecord[] = [];
  const canonicalKeys = new Set<string>();
  const identities = new Set<string>();

  for (const prototypeId of SAP_CP003_PROTOTYPE_IDS) {
    const target = TARGETS[prototypeId];
    let accepted = 0;
    let seed = 1;
    while (accepted < target && seed <= 20_000) {
      const pkg = generateSapCp003Package(prototypeId, seed);
      seed += 1;
      if (!pkg.validation.ok) continue;
      if (canonicalKeys.has(pkg.canonicalPayloadKey)) continue;
      if (identities.has(pkg.generationIdentity)) throw new Error(`Duplicate generation identity ${pkg.generationIdentity}.`);
      canonicalKeys.add(pkg.canonicalPayloadKey);
      identities.add(pkg.generationIdentity);
      records.push(Object.freeze({
        questionId: `SAP-CP003-REV-${String(records.length + 1).padStart(3, "0")}`,
        prototypeId: pkg.prototypeId,
        solveMode: pkg.solveMode,
        difficulty: pkg.difficulty,
        stem: pkg.stem,
        options: pkg.options,
        correctIndex: pkg.correctIndex,
        correctAnswer: pkg.canonicalAnswer,
        canonicalPayloadKey: pkg.canonicalPayloadKey,
        generationIdentity: pkg.generationIdentity,
      }));
      accepted += 1;
    }
    if (accepted !== target) {
      throw new Error(`${prototypeId} produced only ${accepted} unique validated review records; ${target} are required.`);
    }
  }

  if (records.length !== 300) throw new Error(`Expected 300 review records, received ${records.length}.`);
  if (canonicalKeys.size !== 300) throw new Error("Review records must have 300 unique canonical payloads.");
  if (identities.size !== 300) throw new Error("Review records must have 300 unique generation identities.");
  return Object.freeze(records);
}

export const SAP_CP003_REVIEW_TARGETS = TARGETS;
