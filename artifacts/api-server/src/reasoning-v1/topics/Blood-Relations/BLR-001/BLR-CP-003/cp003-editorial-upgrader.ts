import { stableHash } from "../foundation/prng";
import {
  generateBlrCp003EditorialReviewRecords,
  type BlrCp003ReviewRecord,
} from "./cp003-review-registry";

export type BlrCp003EditorialV2Record = Omit<
  BlrCp003ReviewRecord,
  "editorial" | "metadata"
> & {
  editorial: BlrCp003ReviewRecord["editorial"];
  metadata: Omit<BlrCp003ReviewRecord["metadata"], "runtimeVersion" | "semanticFingerprint"> & {
    runtimeVersion: "blr-cp003-editorial-review-v2";
    semanticFingerprint: string;
  };
};

const KINSHIP_ROLE_PATTERN =
  /\bis (father|mother|son|daughter|brother|sister|husband|wife|grandfather|grandmother|grandson|granddaughter|great-grandfather|great-grandmother|great-grandson|great-granddaughter|uncle|aunt|nephew|niece|cousin|father-in-law|mother-in-law|son-in-law|daughter-in-law|brother-in-law|sister-in-law) of\b/gi;

function naturalizeFact(line: string): string {
  return line.replace(KINSHIP_ROLE_PATTERN, "is the $1 of");
}

function naturalizeStem(prototypeId: string, stem: string): string {
  if (stem === "Which of the following pairs is married to each other?") {
    return "Which of the following pairs is a married couple?";
  }
  if (
    prototypeId === "BLR-CP003-PROT-SHARED-GENERATION" ||
    prototypeId === "BLR-CP003-PROT-SHARED-THREE-GENERATION-COMPARE"
  ) {
    const match = /^How is (.+) placed relative to (.+) by generation\?$/.exec(stem);
    if (match) {
      return `What is ${match[1]}'s generation position relative to ${match[2]}?`;
    }
  }
  return stem;
}

function learnerGenerationRows(rows: readonly string[]): string[] {
  return rows.map((row, index) => {
    const members = row.includes(":") ? row.slice(row.indexOf(":") + 1).trim() : row;
    const label =
      index === 0
        ? "Generation 1 (oldest displayed)"
        : `Generation ${index + 1}`;
    return `${label}: ${members}`;
  });
}

function upgradedConcept(
  prototypeId: string,
  current: readonly string[],
): readonly string[] {
  if (prototypeId === "BLR-CP003-PROT-SHARED-GENDER") {
    return [
      "Use gendered words such as husband, wife, son and daughter as direct evidence.",
      "Do not mark gender as unknown when the passage already uses a gender-specific relation.",
    ];
  }
  if (prototypeId === "BLR-CP003-PROT-SHARED-MARRIED-PAIR") {
    return [
      "A married pair must be connected by an explicit husband, wife or spouse relation.",
      "Being in the same generation or appearing together in the family does not prove marriage.",
    ];
  }
  if (
    prototypeId === "BLR-CP003-PROT-SHARED-RELATION" ||
    prototypeId === "BLR-CP003-PROT-SHARED-GREAT-RELATION"
  ) {
    return [
      "Reconstruct the shared family once, then trace only the two people named in the item.",
      "Read the path from the subject to the reference; reversing the direction changes the answer.",
    ];
  }
  return current;
}

function upgradedShortcut(prototypeId: string, current: string): string {
  if (prototypeId === "BLR-CP003-PROT-SHARED-GENDER") {
    return "Underline the first gender-specific word attached to the named person; that clue usually settles the item immediately.";
  }
  if (prototypeId === "BLR-CP003-PROT-SHARED-MARRIED-PAIR") {
    return "Scan the passage for husband or wife statements before testing the option pairs.";
  }
  if (
    prototypeId === "BLR-CP003-PROT-SHARED-RELATION" ||
    prototypeId === "BLR-CP003-PROT-SHARED-GREAT-RELATION"
  ) {
    return "Trace the shortest supported path from the first named person to the second, then label that direction.";
  }
  return current;
}

export function upgradeBlrCp003EditorialRecord(
  record: BlrCp003ReviewRecord,
): BlrCp003EditorialV2Record {
  const stem = naturalizeStem(record.prototypeId, record.stem);
  const normalizedFacts = record.editorial.normalizedFacts.map(naturalizeFact);
  const familyRows = learnerGenerationRows(record.editorial.familyRows);
  const coreConcept = upgradedConcept(
    record.prototypeId,
    record.editorial.coreConcept,
  );
  const examShortcut = upgradedShortcut(
    record.prototypeId,
    record.editorial.examShortcut,
  );

  return {
    ...record,
    stem,
    editorial: {
      ...record.editorial,
      coreConcept,
      normalizedFacts,
      familyRows,
      examShortcut,
    },
    metadata: {
      ...record.metadata,
      runtimeVersion: "blr-cp003-editorial-review-v2",
      semanticFingerprint: stableHash([
        record.metadata.semanticFingerprint,
        stem,
        ...normalizedFacts,
        ...familyRows,
        ...coreConcept,
        examShortcut,
      ]),
    },
  };
}

export function generateBlrCp003EditorialReviewV2Records(
  seeds: readonly number[] = [0, 1, 2, 3],
): BlrCp003EditorialV2Record[] {
  return generateBlrCp003EditorialReviewRecords(seeds).map(
    upgradeBlrCp003EditorialRecord,
  );
}
