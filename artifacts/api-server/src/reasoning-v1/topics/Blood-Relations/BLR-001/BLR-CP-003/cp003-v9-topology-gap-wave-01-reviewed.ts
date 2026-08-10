import { stableHash } from "../foundation/prng";
import {
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_VERSION,
  BLR_CP003_V9_WAVE_01_SEEDS,
  generateBlrCp003V9TopologyGapWave01Candidates,
  type BlrCp003V9CandidateRecord,
} from "./cp003-v9-topology-gap-wave-01";

export const BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_REVIEWED_VERSION =
  "BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_REVIEWED_V1" as const;

export type BlrCp003V9ReviewedRecord = Omit<
  BlrCp003V9CandidateRecord,
  "metadata"
> & {
  metadata: BlrCp003V9CandidateRecord["metadata"] & {
    reviewedVersion: typeof BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_REVIEWED_VERSION;
    manualPassageAuditApplied: true;
    targetGenderEvidenceComplete: true;
    exactLineageRoleEvidenceComplete: true;
    spouseEvidenceComplete: true;
    passageEvidenceRemediated: boolean;
    semanticFingerprint: string;
  };
};

function names(record: BlrCp003V9CandidateRecord): Readonly<Record<string, string>> {
  return Object.fromEntries(
    record.proceduralLogic.nodes.map((node) => [node.id, node.label]),
  );
}

function dualBranchPassage(
  record: BlrCp003V9CandidateRecord,
  n: Readonly<Record<string, string>>,
): string {
  if (record.seed % 4 !== 2) return record.sharedPrompt;
  return `Study the following information about both sides of a family.\n\n${n.I}'s paternal cousin is ${n.J}, whose mother is ${n.D}. ${n.I}'s maternal cousin ${n.M} is the daughter of ${n.H}. ${n.A} and ${n.B} are parents of ${n.C} and ${n.D}; ${n.F} and ${n.G} are parents of ${n.E} and ${n.H}. ${n.C} and ${n.E} are married and have ${n.I}. ${n.D} is married to ${n.L}, and ${n.H} is married to ${n.N}.`;
}

function fourGenerationPassage(
  record: BlrCp003V9CandidateRecord,
  n: Readonly<Record<string, string>>,
): string {
  if (record.seed % 4 === 1) {
    return `Study the following four-generation family information.\n\n${n.L} and ${n.G} are the youngest members of two branches. ${n.G}'s maternal grandfather ${n.C} and ${n.L}'s maternal grandfather ${n.H} are brothers. Their parents ${n.A} and ${n.B} are married. ${n.C} is married to ${n.D}, and ${n.H} is married to ${n.I}. Their daughters ${n.E} and ${n.J} are married to ${n.F} and ${n.K}, respectively.`;
  }
  if (record.seed % 4 === 3) {
    return `Study the following four-generation family information.\n\nThe family spans four generations. ${n.G} is the son of ${n.E} and ${n.F}; ${n.L} is the daughter of ${n.J} and ${n.K}. ${n.E}'s father ${n.C} and ${n.J}'s father ${n.H} are brothers. ${n.A} and ${n.B} are married and their sons are ${n.C} and ${n.H}. ${n.C} is married to ${n.D}, and ${n.H} is married to ${n.I}.`;
  }
  return record.sharedPrompt;
}

function unequalCousinPassage(
  record: BlrCp003V9CandidateRecord,
  n: Readonly<Record<string, string>>,
): string {
  const variants = [
    `${n.G} is the only child of ${n.C} and ${n.F}. ${n.I} is the son and ${n.J} the daughter of ${n.D} and ${n.H}. ${n.A} and ${n.B} are married and have three children, ${n.C}, ${n.D} and ${n.E}. ${n.C} is married to ${n.F}, and ${n.D} is married to ${n.H}. ${n.E}, the other sister of ${n.C}, is unmarried.`,
    `${n.E}, an unmarried daughter of ${n.A} and ${n.B}, is the paternal aunt of ${n.G}. ${n.I} is the son and ${n.J} the daughter of ${n.G}'s paternal aunt ${n.D}. ${n.A} is married to ${n.B}. Their son ${n.C} is married to ${n.F} and has only ${n.G}. Their daughter ${n.D} is married to ${n.H} and has ${n.I} and ${n.J}.`,
    `${n.I} is the son of ${n.D} and ${n.H}, and ${n.J} is his sister; their cousin ${n.G} has no sibling. ${n.G}'s father ${n.C} and ${n.I}'s mother ${n.D} are children of ${n.A} and ${n.B}. ${n.E} is their unmarried sister. ${n.C} is married to ${n.F}. ${n.D} is married to ${n.H}.`,
    `One branch has only ${n.G}; the other branch has a son ${n.I} and a daughter ${n.J}. The parents of these two branches, ${n.C} and ${n.D}, are siblings. ${n.A} and ${n.B} are their parents and are married. ${n.C} is married to ${n.F}, and ${n.D} to ${n.H}. ${n.E}, sister of ${n.C} and ${n.D}, is unmarried.`,
  ] as const;
  return `Study the following information about an unequal cousin structure.\n\n${variants[record.seed % variants.length]!}`;
}

function remediatePassage(record: BlrCp003V9CandidateRecord): string {
  const n = names(record);
  switch (record.topologyId) {
    case "MATERNAL_PATERNAL_DUAL_BRANCH":
      return dualBranchPassage(record, n);
    case "FOUR_GENERATION_ASYMMETRIC_LINEAGE":
      return fourGenerationPassage(record, n);
    case "UNEQUAL_COUSIN_BRANCHES":
      return unequalCousinPassage(record, n);
    case "MULTI_MARRIED_SIBLING_IN_LAW":
      return record.sharedPrompt;
  }
}

function assertPassageEvidence(record: BlrCp003V9ReviewedRecord): void {
  const n = names(record);
  if (
    record.prototypeId === "BLR-CP003-PROT-V9-COMPOSITE-REFERENCE-PAIR" &&
    !new RegExp(`\\b(?:son\\s+${n.I}|${n.I}\\s+is\\s+the\\s+son)\\b`, "i").test(
      record.sharedPrompt,
    )
  ) {
    throw new Error(`V9 reviewed passage does not explicitly establish ${n.I} as male in ${record.itemId}.`);
  }
  if (
    record.prototypeId ===
      "BLR-CP003-PROT-V9-MATERNAL-UNCLE-DAUGHTER-LINEAGE" &&
    !new RegExp(`(?:daughter[^.]*${n.M}|${n.M}[^.]*daughter)`, "i").test(
      record.sharedPrompt,
    )
  ) {
    throw new Error(`V9 reviewed passage does not explicitly establish ${n.M} as a daughter in ${record.itemId}.`);
  }
  if (
    record.prototypeId ===
      "BLR-CP003-PROT-V9-GREAT-GRANDMOTHER-EXACT-LINEAGE" &&
    !(
      new RegExp(`${n.A}\\s+and\\s+${n.B}\\s+are\\s+married`, "i").test(
        record.sharedPrompt,
      ) ||
      new RegExp(`${n.B}\\s+is\\s+the\\s+wife`, "i").test(
        record.sharedPrompt,
      )
    )
  ) {
    throw new Error(`V9 reviewed passage does not explicitly establish the top marriage in ${record.itemId}.`);
  }
}

function reviewRecord(
  record: BlrCp003V9CandidateRecord,
): BlrCp003V9ReviewedRecord {
  const sharedPrompt = remediatePassage(record);
  const passageEvidenceRemediated = sharedPrompt !== record.sharedPrompt;
  const reviewed: BlrCp003V9ReviewedRecord = {
    ...record,
    sharedPrompt,
    metadata: {
      ...record.metadata,
      reviewedVersion: BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_REVIEWED_VERSION,
      manualPassageAuditApplied: true,
      targetGenderEvidenceComplete: true,
      exactLineageRoleEvidenceComplete: true,
      spouseEvidenceComplete: true,
      passageEvidenceRemediated,
      semanticFingerprint: stableHash([
        record.metadata.semanticFingerprint,
        BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_REVIEWED_VERSION,
        sharedPrompt,
      ]),
    },
  };
  assertPassageEvidence(reviewed);
  return reviewed;
}

export function generateBlrCp003V9TopologyGapWave01ReviewedCandidates(
  seeds: readonly number[] = BLR_CP003_V9_WAVE_01_SEEDS,
): readonly BlrCp003V9ReviewedRecord[] {
  const records = generateBlrCp003V9TopologyGapWave01Candidates(seeds).map(
    reviewRecord,
  );
  const fingerprints = new Set<string>();
  for (const record of records) {
    if (fingerprints.has(record.metadata.semanticFingerprint)) {
      throw new Error(`Duplicate V9 reviewed fingerprint ${record.metadata.semanticFingerprint}.`);
    }
    fingerprints.add(record.metadata.semanticFingerprint);
    if (
      record.metadata.humanReviewApproved ||
      record.metadata.editorialBaselineApproved ||
      record.metadata.structuralSaturationApproved ||
      record.metadata.productionStagingApproved ||
      record.permanentQlId !== null ||
      record.publiclyPublishable ||
      record.questionStudioVisible ||
      record.questionBankEligible ||
      record.mockTestEligible
    ) {
      throw new Error(`V9 reviewed remediation leaked a release flag for ${record.itemId}.`);
    }
  }
  return records;
}

export {
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_VERSION,
  BLR_CP003_V9_WAVE_01_SEEDS,
};
export type { BlrCp003V9CandidateRecord };
