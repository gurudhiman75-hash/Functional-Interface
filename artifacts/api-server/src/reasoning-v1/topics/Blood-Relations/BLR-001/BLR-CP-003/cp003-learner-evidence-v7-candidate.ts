import { stableHash } from "../foundation/prng";
import {
  blrCp003V6CandidateAuthorityCounts,
  generateBlrCp003LearnerEvidenceV6Candidates,
  type BlrCp003V6CandidateAuthority,
  type BlrCp003V6CandidateRecord,
  type BlrCp003V6EvidencePath,
} from "./cp003-learner-evidence-v6-candidate";

export const BLR_CP003_LEARNER_EVIDENCE_V7_CANDIDATE_VERSION =
  "BLR_CP003_LEARNER_EVIDENCE_V7_CANDIDATE_V1" as const;

export type BlrCp003V7CandidateRecord = Omit<
  BlrCp003V6CandidateRecord,
  "metadata"
> & {
  metadata: Omit<
    BlrCp003V6CandidateRecord["metadata"],
    "runtimeVersion" | "semanticFingerprint"
  > & {
    runtimeVersion: "blr-cp003-learner-evidence-v7-candidate-v1";
    remediationVersion: typeof BLR_CP003_LEARNER_EVIDENCE_V7_CANDIDATE_VERSION;
    editorialRemediationApplied: true;
    semanticFingerprint: string;
  };
};

function pairKey(left: string, right: string): string {
  return [left, right].sort().join("::");
}

function answerLabel(index: number): "A" | "B" | "C" | "D" {
  return String.fromCharCode(65 + index) as "A" | "B" | "C" | "D";
}

function personLabel(record: BlrCp003V6CandidateRecord, personId: string): string {
  return (
    record.proceduralLogic.nodes.find((node) => node.id === personId)?.label ??
    personId
  );
}

function learnerFacingText(record: BlrCp003V7CandidateRecord): string {
  return [
    record.stem,
    ...record.editorial.coreConcept,
    ...record.editorial.stepByStepSolution,
    ...record.editorial.optionAnalysis.map((entry) => entry.explanation),
    record.editorial.conclusion,
    record.editorial.examShortcut,
    ...record.editorial.commonTraps,
  ].join(" ");
}

function buildEvidenceWalk(
  paths: readonly BlrCp003V6EvidencePath[],
): string[] {
  const first = paths[0];
  if (!first) throw new Error("V7 candidate requires at least one evidence path.");

  const walk = [...first.personIds];
  for (const path of paths.slice(1)) {
    if (path.referenceId !== first.referenceId) {
      throw new Error("V7 multi-path visual evidence must share one reference member.");
    }
    const reversed = [...path.personIds].reverse();
    if (walk.at(-1) !== reversed[0]) {
      throw new Error("V7 evidence paths cannot be joined into a connected visual walk.");
    }
    walk.push(...reversed.slice(1));
  }
  return walk;
}

function visualPairs(record: BlrCp003V7CandidateRecord): Set<string> {
  const ids = record.proceduralLogic.query?.pathPersonIds ?? [];
  return new Set(
    ids.slice(0, -1).map((personId, index) =>
      pairKey(personId, ids[index + 1]!),
    ),
  );
}

function diagramWithCompleteEvidence(
  record: BlrCp003V6CandidateRecord,
): BlrCp003V6CandidateRecord["proceduralLogic"] {
  if (record.evidencePaths.length === 1) return record.proceduralLogic;

  const query = record.proceduralLogic.query;
  if (!query) throw new Error("V7 multi-path candidate is missing a diagram query.");

  const pathPersonIds = buildEvidenceWalk(record.evidencePaths);
  const generationCount = new Set(
    record.proceduralLogic.nodes.map((node) => node.generation),
  ).size;
  const pathDescriptions = record.evidencePaths.map((path) =>
    path.personIds.map((personId) => personLabel(record, personId)).join(" to "),
  );

  return {
    ...record.proceduralLogic,
    query: {
      ...query,
      pathPersonIds,
    },
    accessibleSummary: `Family tree with ${record.proceduralLogic.nodes.length} people across ${generationCount} generations. The highlighted answer paths are ${pathDescriptions.join(" and ")}.`,
  };
}

function genderRemediation(
  record: BlrCp003V6CandidateRecord,
): Pick<BlrCp003V7CandidateRecord, "prototypeId" | "stem" | "editorial"> {
  const target = personLabel(record, "E");
  const father = personLabel(record, "C");
  const reference = personLabel(record, "G");
  const grandparent = personLabel(record, "A");
  const reasons: Readonly<Record<string, string>> = {
    "GENDER:MALE": `${target} is the only sibling of ${father} explicitly stated to be unmarried, and the passage separately identifies ${target} as a son of ${grandparent}.`,
    "GENDER:FEMALE": `The selected unmarried sibling is identified as a son, not a daughter.`,
    "GENDER:UNKNOWN": `The unmarried clue identifies ${target}, and the separate son clue fixes the gender.`,
    "GENDER:CONTRADICTORY": `No clue assigns a conflicting gender to ${target}.`,
  };
  const optionAnalysis = record.options.map((option, index) => {
    const label = answerLabel(index);
    const reason = reasons[option.semanticKey];
    if (!reason) throw new Error(`Missing V7 gender option reason for ${option.semanticKey}.`);
    return {
      optionLabel: label,
      optionText: option.text,
      isCorrect: option.isCorrect,
      explanation: option.isCorrect
        ? `✅ Option ${label} is correct. ${reason}`
        : `⚠️ Don't fall for Option ${label}! ${reason}`,
    };
  });

  return {
    prototypeId: "BLR-CP003-PROT-SHARED-GENDER-V7",
    stem: `What is the gender of ${reference}'s father's sibling who is explicitly stated to be unmarried?`,
    editorial: {
      coreConcept: [
        "Use the gender-neutral relation ‘sibling’ to identify the target member.",
        "Apply the explicit unmarried clue first, then use a separate son-or-daughter clue to determine gender.",
      ],
      stepByStepSolution: [
        `${father} is the father of ${reference}.`,
        `${target} is a sibling of ${father} and is explicitly stated to be unmarried.`,
        `This status clue identifies ${target} as the required sibling.`,
        `The passage separately states that ${target} is a son of ${grandparent}, so the gender is Male.`,
      ],
      optionAnalysis,
      conclusion: `The explicitly unmarried sibling of ${reference}'s father is ${target}, and ${target} is male.`,
      examShortcut: `First locate ${reference}'s father, choose the sibling carrying the explicit unmarried fact, and only then read that person's son-or-daughter clue.`,
      commonTraps: [
        "⚠️ Do not infer gender from a person's name.",
        "⚠️ Do not treat the absence of a spouse as proof of being unmarried; use the explicit status statement.",
      ],
    },
  };
}

function pairRemediation(
  record: BlrCp003V6CandidateRecord,
): Pick<BlrCp003V7CandidateRecord, "stem" | "editorial"> {
  return {
    stem: "Which of the following pairs consists of cousins?",
    editorial: {
      ...record.editorial,
      coreConcept: [
        "A pair names the same two people whichever name is written first.",
        "Cousins are children of siblings.",
      ],
    },
  };
}

function fingerprint(record: Omit<BlrCp003V7CandidateRecord, "metadata">): string {
  return stableHash([
    BLR_CP003_LEARNER_EVIDENCE_V7_CANDIDATE_VERSION,
    record.provisionalAuthority,
    record.itemId,
    record.stem,
    record.answerSemanticKey,
    ...record.options.flatMap((option) => [
      option.semanticKey,
      option.text,
      option.isCorrect,
    ]),
    ...record.evidencePaths.flatMap((path) => [
      path.relationId,
      ...path.personIds,
    ]),
    ...(record.proceduralLogic.query?.pathPersonIds ?? []),
    ...record.editorial.coreConcept,
    ...record.editorial.stepByStepSolution,
    record.editorial.conclusion,
    record.editorial.examShortcut,
    ...record.editorial.commonTraps,
  ]);
}

function remediateRecord(
  source: BlrCp003V6CandidateRecord,
): BlrCp003V7CandidateRecord {
  const itemId = source.itemId.replace("-V6-", "-V7-");
  const base = {
    ...source,
    itemId,
    proceduralLogic: diagramWithCompleteEvidence(source),
  };

  const remediated =
    source.provisionalAuthority === "DETERMINE_MEMBER_GENDER"
      ? { ...base, ...genderRemediation(source) }
      : source.provisionalAuthority === "SELECT_UNORDERED_FAMILY_PAIR"
        ? { ...base, ...pairRemediation(source) }
        : base;

  const withoutMetadata = remediated as Omit<BlrCp003V7CandidateRecord, "metadata">;
  return {
    ...withoutMetadata,
    metadata: {
      ...source.metadata,
      runtimeVersion: "blr-cp003-learner-evidence-v7-candidate-v1",
      remediationVersion: BLR_CP003_LEARNER_EVIDENCE_V7_CANDIDATE_VERSION,
      editorialRemediationApplied: true,
      semanticFingerprint: fingerprint(withoutMetadata),
    },
  };
}

function assertGenderStemIsNotTautological(record: BlrCp003V7CandidateRecord): void {
  if (
    /\b(?:uncle|aunt|brother|sister|son|daughter|husband|wife|father|mother)\s*\?$/i.test(
      record.stem,
    )
  ) {
    throw new Error(`V7 gender stem reveals the answer through a gendered target relation: ${record.stem}`);
  }
}

function assertVisualEvidenceComplete(record: BlrCp003V7CandidateRecord): void {
  const highlightedPairs = visualPairs(record);
  const highlightedNodes = new Set(
    record.proceduralLogic.query?.pathPersonIds ?? [],
  );
  for (const path of record.evidencePaths) {
    for (const personId of path.personIds) {
      if (!highlightedNodes.has(personId)) {
        throw new Error(`V7 diagram omits evidence node ${personId} for ${record.itemId}.`);
      }
    }
    for (let index = 0; index < path.personIds.length - 1; index += 1) {
      const edge = pairKey(path.personIds[index]!, path.personIds[index + 1]!);
      if (!highlightedPairs.has(edge)) {
        throw new Error(`V7 diagram omits evidence edge ${edge} for ${record.itemId}.`);
      }
    }
  }
}

function assertRemediation(record: BlrCp003V7CandidateRecord): void {
  if (record.provisionalAuthority === "DETERMINE_MEMBER_GENDER") {
    assertGenderStemIsNotTautological(record);
    if (/paternal uncle/i.test(learnerFacingText(record))) {
      throw new Error(`V7 gender learner text retained the tautological relation for ${record.itemId}.`);
    }
  }
  if (record.provisionalAuthority === "SELECT_UNORDERED_FAMILY_PAIR") {
    if (/\bunordered\b/i.test(learnerFacingText(record))) {
      throw new Error(`V7 pair learner text retained internal jargon for ${record.itemId}.`);
    }
  }
  assertVisualEvidenceComplete(record);
}

export function generateBlrCp003LearnerEvidenceV7Candidates(): readonly BlrCp003V7CandidateRecord[] {
  const records = generateBlrCp003LearnerEvidenceV6Candidates().map(remediateRecord);
  const itemIds = new Set<string>();
  const fingerprints = new Set<string>();
  for (const record of records) {
    if (itemIds.has(record.itemId)) throw new Error(`Duplicate V7 item ID ${record.itemId}.`);
    if (fingerprints.has(record.metadata.semanticFingerprint)) {
      throw new Error(`Duplicate V7 fingerprint ${record.metadata.semanticFingerprint}.`);
    }
    itemIds.add(record.itemId);
    fingerprints.add(record.metadata.semanticFingerprint);
    assertRemediation(record);
  }
  return records;
}

export function blrCp003V7CandidateAuthorityCounts(
  records: readonly BlrCp003V7CandidateRecord[] =
    generateBlrCp003LearnerEvidenceV7Candidates(),
): Readonly<Record<BlrCp003V6CandidateAuthority, number>> {
  return blrCp003V6CandidateAuthorityCounts(records);
}

export function blrCp003V7VisualPairs(
  record: BlrCp003V7CandidateRecord,
): ReadonlySet<string> {
  return visualPairs(record);
}
