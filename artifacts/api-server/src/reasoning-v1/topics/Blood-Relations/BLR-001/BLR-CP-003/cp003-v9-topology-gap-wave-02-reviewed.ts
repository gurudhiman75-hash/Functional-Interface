import { stableHash } from "../foundation/prng";
import {
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_VERSION,
  BLR_CP003_V9_WAVE_02_SEEDS,
  generateBlrCp003V9TopologyGapWave02Candidates,
  type BlrCp003V9Wave02CandidateRecord,
} from "./cp003-v9-topology-gap-wave-02";

export const BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_REVIEWED_VERSION =
  "BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_REVIEWED_V1" as const;

export type BlrCp003V9Wave02ReviewedRecord = Omit<
  BlrCp003V9Wave02CandidateRecord,
  "metadata"
> & {
  metadata: BlrCp003V9Wave02CandidateRecord["metadata"] & {
    reviewedVersion: typeof BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_REVIEWED_VERSION;
    manualEditorialAuditApplied: true;
    pairGrammarRemediated: boolean;
    passageExclusionRemediated: boolean;
    unaryStatusVisualAligned: boolean;
    statusRoleLabelsAvailable: true;
    stemPersonalized: boolean;
    shortcutPersonalized: true;
    conclusionPersonalized: true;
    semanticFingerprint: string;
  };
};

function personNames(
  record: BlrCp003V9Wave02CandidateRecord,
): Readonly<Record<string, string>> {
  return Object.fromEntries(
    record.proceduralLogic.nodes.map((node) => [node.id, node.label]),
  );
}

function lowerFirst(value: string): string {
  return value.length ? `${value[0]!.toLocaleLowerCase("en-IN")}${value.slice(1)}` : value;
}

function polishPairGrammar(text: string): string {
  return text.replace(
    /\b([A-Z][a-z]+ and [A-Z][a-z]+) is the\b/g,
    "$1 form the",
  );
}

function hasPairGrammar(record: BlrCp003V9Wave02CandidateRecord): boolean {
  return /\b[A-Z][a-z]+ and [A-Z][a-z]+ is the\b/.test(
    [
      record.stem,
      ...record.editorial.coreConcept,
      ...record.editorial.stepByStepSolution,
      ...record.editorial.solutionPhases.flatMap((phase) => phase.points),
      ...record.editorial.optionAnalysis.map((entry) => entry.explanation),
      record.editorial.conclusion,
      record.editorial.examShortcut,
      ...record.editorial.commonTraps,
    ].join(" "),
  );
}

function reviewedPassage(
  record: BlrCp003V9Wave02CandidateRecord,
  names: Readonly<Record<string, string>>,
): string {
  if (
    record.topologyId !== "UNSTATED_SPOUSE_SINGLE_PARENT_BRANCH" ||
    record.seed % 3 !== 2
  ) {
    return record.sharedPrompt;
  }
  return `Study the following information. Treat an unnamed spouse as unknown, not as proof of being unmarried.\n\nAmong the three children of ${names.A} and ${names.B}, ${names.F} is explicitly unmarried and has no child. ${names.D} is not the mother of ${names.I}; she is the mother of ${names.J}, and her spouse is not identified. ${names.J} is neither ${names.I}'s sibling nor ${names.C}'s child. ${names.A} and ${names.B} are married. ${names.C} and ${names.E} are married and have one daughter, ${names.I}.`;
}

function reviewedStem(record: BlrCp003V9Wave02CandidateRecord): string {
  if (record.seed < 4) return record.stem;
  const prefix =
    record.seed === 4
      ? "After applying every exclusion"
      : "From the completed family map";
  return `${prefix}, ${lowerFirst(record.stem)}`;
}

function evidenceTrail(record: BlrCp003V9Wave02CandidateRecord): string {
  const names = personNames(record);
  return record.evidencePaths
    .map((path) => path.personIds.map((id) => names[id] ?? id).join(" → "))
    .join(" and ");
}

function reviewedShortcut(record: BlrCp003V9Wave02CandidateRecord): string {
  const answer = record.options[record.correctIndex]!.text;
  const trail = evidenceTrail(record);
  const unknownNames = record.metadata.unknownSpouseBoundaryIds
    .map((id) => personNames(record)[id] ?? id)
    .join(" and ");
  const suffixes = [
    `In this set, verify ${answer} against every exclusion before locking the answer.`,
    `Here, the decisive family trail is ${trail}.`,
    `Keep ${unknownNames || "every unnamed spouse"} unresolved while testing ${answer}.`,
    `Use the positive links first, then let the negative clues eliminate the alternatives to ${answer}.`,
    `For this family, the last check is whether ${answer} satisfies both the relation and boundary evidence.`,
    `After mapping the generations, compare ${answer} with the complete trail ${trail}.`,
  ] as const;
  return `${record.editorial.examShortcut} ${suffixes[record.seed % suffixes.length]!}`;
}

function reviewedConclusion(record: BlrCp003V9Wave02CandidateRecord): string {
  return `${polishPairGrammar(record.editorial.conclusion)} The decisive trail is ${evidenceTrail(record)}.`;
}

function statusVisual(
  record: BlrCp003V9Wave02CandidateRecord,
): BlrCp003V9Wave02CandidateRecord["proceduralLogic"] {
  const statusRecord =
    record.provisionalAuthority === "IDENTIFY_MEMBER_BY_MARITAL_STATUS" ||
    record.provisionalAuthority ===
      "IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS";
  if (!statusRecord) return record.proceduralLogic;

  const answerId = record.answerSemanticKey.split(":")[1]!;
  const answerNode = record.proceduralLogic.nodes.find(
    (node) => node.id === answerId,
  );
  if (!answerNode?.roleLabel) {
    throw new Error(`Missing status role label for ${record.itemId}.`);
  }
  return {
    ...record.proceduralLogic,
    query: {
      answerLabel: record.options[record.correctIndex]!.text,
      pathPersonIds: [answerId],
    },
    accessibleSummary: `Family tree with ${record.proceduralLogic.nodes.length} people. ${answerNode.label} is highlighted as the answer. Status evidence on the node: ${answerNode.roleLabel}.`,
  };
}

function reviewedEditorial(
  record: BlrCp003V9Wave02CandidateRecord,
): BlrCp003V9Wave02CandidateRecord["editorial"] {
  const solutionPhases = record.editorial.solutionPhases.map((phase) => ({
    ...phase,
    points: phase.points.map(polishPairGrammar),
  }));
  return {
    coreConcept: record.editorial.coreConcept.map(polishPairGrammar),
    stepByStepSolution: solutionPhases.flatMap((phase) =>
      phase.points.map((point) => `${phase.title}: ${point}`),
    ),
    optionAnalysis: record.editorial.optionAnalysis.map((entry) => ({
      ...entry,
      explanation: polishPairGrammar(entry.explanation),
    })),
    conclusion: reviewedConclusion(record),
    examShortcut: reviewedShortcut(record),
    commonTraps: record.editorial.commonTraps.map(polishPairGrammar),
    solutionPhases,
  };
}

function reviewRecord(
  record: BlrCp003V9Wave02CandidateRecord,
): BlrCp003V9Wave02ReviewedRecord {
  const names = personNames(record);
  const sharedPrompt = reviewedPassage(record, names);
  const stem = reviewedStem(record);
  const editorial = reviewedEditorial(record);
  const proceduralLogic = statusVisual(record);
  const pairGrammarRemediated = hasPairGrammar(record);
  const passageExclusionRemediated = sharedPrompt !== record.sharedPrompt;
  const unaryStatusVisualAligned = proceduralLogic !== record.proceduralLogic;

  const reviewed: BlrCp003V9Wave02ReviewedRecord = {
    ...record,
    sharedPrompt,
    stem,
    proceduralLogic,
    editorial,
    metadata: {
      ...record.metadata,
      reviewedVersion: BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_REVIEWED_VERSION,
      manualEditorialAuditApplied: true,
      pairGrammarRemediated,
      passageExclusionRemediated,
      unaryStatusVisualAligned,
      statusRoleLabelsAvailable: true,
      stemPersonalized: stem !== record.stem,
      shortcutPersonalized: true,
      conclusionPersonalized: true,
      semanticFingerprint: stableHash([
        record.metadata.semanticFingerprint,
        BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_REVIEWED_VERSION,
        sharedPrompt,
        stem,
        editorial.conclusion,
        editorial.examShortcut,
        proceduralLogic.accessibleSummary,
        ...(proceduralLogic.query?.pathPersonIds ?? []),
      ]),
    },
  };

  const learnerText = [
    reviewed.sharedPrompt,
    reviewed.stem,
    ...reviewed.editorial.coreConcept,
    ...reviewed.editorial.stepByStepSolution,
    ...reviewed.editorial.optionAnalysis.map((entry) => entry.explanation),
    reviewed.editorial.conclusion,
    reviewed.editorial.examShortcut,
    ...reviewed.editorial.commonTraps,
  ].join(" ");
  if (/\b[A-Z][a-z]+ and [A-Z][a-z]+ is the\b/.test(learnerText)) {
    throw new Error(`Pair grammar remains in ${reviewed.itemId}.`);
  }
  if (/not married to (?:Anita|Gurleen)/i.test(reviewed.sharedPrompt)) {
    throw new Error(`Weak same-gender spouse exclusion remains in ${reviewed.itemId}.`);
  }
  return reviewed;
}

export function generateBlrCp003V9TopologyGapWave02ReviewedCandidates(
  seeds: readonly number[] = BLR_CP003_V9_WAVE_02_SEEDS,
): readonly BlrCp003V9Wave02ReviewedRecord[] {
  const records = generateBlrCp003V9TopologyGapWave02Candidates(seeds).map(
    reviewRecord,
  );
  const fingerprints = new Set<string>();
  for (const record of records) {
    if (fingerprints.has(record.metadata.semanticFingerprint)) {
      throw new Error(`Duplicate V9 Wave 02 reviewed fingerprint ${record.metadata.semanticFingerprint}.`);
    }
    fingerprints.add(record.metadata.semanticFingerprint);
    if (
      record.metadata.humanReviewApproved ||
      record.metadata.wave02StructuralStagingApproved ||
      record.metadata.editorialBaselineApproved ||
      record.metadata.structuralSaturationApproved ||
      record.metadata.productionStagingApproved ||
      record.permanentQlId !== null ||
      record.publiclyPublishable ||
      record.questionStudioVisible ||
      record.questionBankEligible ||
      record.mockTestEligible
    ) {
      throw new Error(`V9 Wave 02 reviewed layer leaked a release flag for ${record.itemId}.`);
    }
  }
  return records;
}

export {
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_VERSION,
  BLR_CP003_V9_WAVE_02_SEEDS,
};
export type { BlrCp003V9Wave02CandidateRecord };
