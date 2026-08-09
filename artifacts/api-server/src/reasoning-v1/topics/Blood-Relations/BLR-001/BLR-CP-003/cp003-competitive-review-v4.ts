import { solveRelationFromGraph } from "../foundation/graph-closure";
import { stableHash } from "../foundation/prng";
import { relationLabel } from "../foundation/relation-ontology";
import type { BlrRelationId } from "../foundation/types";
import {
  auditAllBlrCp003CompetitiveRecords,
  type BlrCp003CompetitiveAudit,
  type BlrCp003CompetitiveRawContext,
} from "./cp003-competitive-exam-gate";
import { generateBlrCp003TeacherReviewV3Records } from "./cp003-teacher-editorial-finalizer";
import type {
  BlrCp003TeacherOptionAnalysis,
  BlrCp003TeacherReviewRecord,
} from "./cp003-teacher-editorial";

export type BlrCp003CompetitiveReviewV4Record = Omit<
  BlrCp003TeacherReviewRecord,
  "editorial" | "metadata"
> & {
  editorial: BlrCp003TeacherReviewRecord["editorial"];
  metadata: Omit<
    BlrCp003TeacherReviewRecord["metadata"],
    "runtimeVersion" | "semanticFingerprint"
  > & {
    runtimeVersion: "blr-cp003-competitive-review-v4";
    competitiveExamEligible: true;
    minimumGraphDistance: number;
    directTextMatchCount: 0;
    claimOptionMinimumGraphDistance: number | null;
    claimOptionDirectTextMatchCount: 0;
    hasAsciiFamilyTree: true;
    hasFourTierTeacherVoice: true;
    reverseTrapRequired: boolean;
    reverseTrapExplained: boolean;
    supplementalDerivedItem?: true;
    semanticFingerprint: string;
  };
};

export interface BlrCp003CompetitiveReviewV4RejectedRecord {
  scenarioId: string;
  topologyId: string;
  seed: number;
  itemId: string;
  prototypeId: string;
  stem: string;
  correctAnswer: string;
  audit: BlrCp003CompetitiveAudit;
}

export interface BlrCp003CompetitiveReviewV4Bundle {
  selected: readonly BlrCp003CompetitiveReviewV4Record[];
  rejected: readonly BlrCp003CompetitiveReviewV4RejectedRecord[];
  sourceRecordCount: number;
  sourceEligibleRecordCount: number;
  supplementalRecordCount: number;
}

interface DerivedSupplementSpec {
  scenarioId:
    | "BLR-CP003-SCN-SIBLING-SET-BRANCH"
    | "BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH";
  itemSuffix: string;
  relationId: "UNCLE" | "AUNT";
  answerPersonId: string;
  referencePersonId: string;
  bridgePersonId: string;
  commonParentId: string;
  candidatePersonIds: readonly [string, string, string, string];
  variantIndex: number;
}

const DERIVED_SUPPLEMENTS: readonly DerivedSupplementSpec[] = [
  {
    scenarioId: "BLR-CP003-SCN-SIBLING-SET-BRANCH",
    itemSuffix: "DERIVED-UNCLE",
    relationId: "UNCLE",
    answerPersonId: "D",
    referencePersonId: "G",
    bridgePersonId: "C",
    commonParentId: "A",
    candidatePersonIds: ["D", "C", "A", "E"],
    variantIndex: 0,
  },
  {
    scenarioId: "BLR-CP003-SCN-SIBLING-SET-BRANCH",
    itemSuffix: "DERIVED-AUNT",
    relationId: "AUNT",
    answerPersonId: "E",
    referencePersonId: "G",
    bridgePersonId: "C",
    commonParentId: "A",
    candidatePersonIds: ["E", "D", "C", "A"],
    variantIndex: 1,
  },
  {
    scenarioId: "BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH",
    itemSuffix: "DERIVED-UNCLE",
    relationId: "UNCLE",
    answerPersonId: "E",
    referencePersonId: "G",
    bridgePersonId: "C",
    commonParentId: "A",
    candidatePersonIds: ["E", "D", "C", "A"],
    variantIndex: 2,
  },
] as const;

function relationDirectionNames(stem: string): readonly [string, string] | null {
  const match = /^How is (.+) related to (.+)\?$/.exec(stem);
  return match ? [match[1]!, match[2]!] : null;
}

function cleanExistingExplanation(text: string): string {
  return text
    .replace(/^✅\s*Option [A-D](?: is correct)?[.!]?\s*/i, "")
    .replace(/^⚠️\s*Don't fall for Option [A-D]!?\s*/i, "")
    .trim();
}

function optionAnalysisV4(
  record: BlrCp003TeacherReviewRecord,
  audit: BlrCp003CompetitiveAudit,
): readonly BlrCp003TeacherOptionAnalysis[] {
  const direction = relationDirectionNames(record.stem);
  return record.editorial.optionAnalysis.map((entry) => {
    const existing = cleanExistingExplanation(entry.explanation);
    if (entry.isCorrect) {
      return {
        ...entry,
        explanation: `✅ Option ${entry.optionLabel} is correct. ${existing}`,
      };
    }
    if (audit.reverseTrap?.optionLabel === entry.optionLabel && direction) {
      return {
        ...entry,
        explanation: `⚠️ Don't fall for Option ${entry.optionLabel}! This gives the reverse relation—how ${direction[1]} is related to ${direction[0]}. The question asks how ${direction[0]} is related to ${direction[1]}.`,
      };
    }
    return {
      ...entry,
      explanation: `⚠️ Don't fall for Option ${entry.optionLabel}! ${existing}`,
    };
  });
}

function stepByStepV4(
  record: BlrCp003TeacherReviewRecord,
): readonly string[] {
  const direction = relationDirectionNames(record.stem);
  if (!direction) return record.editorial.stepByStepSolution;
  const directionLine = `Keep the direction fixed: ${direction[0]} → ${direction[1]}. The final answer must describe ${direction[0]}.`;
  const conclusionIndex = record.editorial.stepByStepSolution.findIndex((line) =>
    line.startsWith("Therefore, "),
  );
  if (conclusionIndex < 0) {
    return [...record.editorial.stepByStepSolution, directionLine];
  }
  return [
    ...record.editorial.stepByStepSolution.slice(0, conclusionIndex),
    directionLine,
    ...record.editorial.stepByStepSolution.slice(conclusionIndex),
  ];
}

function commonTrapsV4(
  record: BlrCp003TeacherReviewRecord,
  audit: BlrCp003CompetitiveAudit,
): readonly string[] {
  const direction = relationDirectionNames(record.stem);
  const traps = record.editorial.commonTraps.map((line) =>
    line.startsWith("⚠️") ? line : `⚠️ ${line}`,
  );
  if (!audit.reverseTrap || !direction) return traps;
  const reverseWarning = `⚠️ Don't fall for Option ${audit.reverseTrap.optionLabel} (${audit.reverseTrap.optionText})! It answers the reverse question—how ${direction[1]} is related to ${direction[0]}—instead of how ${direction[0]} is related to ${direction[1]}.`;
  return [reverseWarning, ...traps.filter((line) => !line.includes("reverse question"))];
}

function upgradeSelectedRecord(
  record: BlrCp003TeacherReviewRecord,
  context: BlrCp003CompetitiveRawContext,
  audit: BlrCp003CompetitiveAudit,
): BlrCp003CompetitiveReviewV4Record {
  if (
    !audit.examEligible ||
    audit.minimumGraphDistance === null ||
    audit.directTextMatchCount !== 0 ||
    audit.claimOptionDirectTextMatchCount !== 0
  ) {
    throw new Error(`Ineligible CP-003 item reached V4 upgrade: ${record.itemId}.`);
  }

  const optionAnalysis = optionAnalysisV4(record, audit);
  const stepByStepSolution = stepByStepV4(record);
  const commonTraps = commonTrapsV4(record, audit);
  const reverseTrapExplained =
    audit.reverseTrap === null ||
    (optionAnalysis.some(
      (entry) =>
        entry.optionLabel === audit.reverseTrap?.optionLabel &&
        entry.explanation.includes("reverse relation"),
    ) &&
      commonTraps.some(
        (line) =>
          line.includes(`Option ${audit.reverseTrap?.optionLabel}`) &&
          line.includes("reverse question"),
      ));

  return {
    ...record,
    editorial: {
      ...record.editorial,
      stepByStepSolution,
      optionAnalysis,
      commonTraps,
    },
    metadata: {
      ...record.metadata,
      runtimeVersion: "blr-cp003-competitive-review-v4",
      competitiveExamEligible: true,
      minimumGraphDistance: audit.minimumGraphDistance,
      directTextMatchCount: 0,
      claimOptionMinimumGraphDistance: audit.claimOptionMinimumGraphDistance,
      claimOptionDirectTextMatchCount: 0,
      hasAsciiFamilyTree: true,
      hasFourTierTeacherVoice: true,
      reverseTrapRequired: audit.reverseTrap !== null,
      reverseTrapExplained,
      semanticFingerprint: stableHash([
        record.metadata.semanticFingerprint,
        context.question.prototypeId,
        audit.minimumGraphDistance,
        audit.claimOptionMinimumGraphDistance ?? "NO_CLAIM_OPTIONS",
        ...stepByStepSolution,
        ...optionAnalysis.flatMap((entry) => [
          entry.optionLabel,
          entry.optionText,
          entry.explanation,
        ]),
        ...commonTraps,
      ]),
    },
  };
}

function rotate<T>(values: readonly T[], shift: number): T[] {
  const offset = ((shift % values.length) + values.length) % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

function optionLabel(index: number): "A" | "B" | "C" | "D" {
  return String.fromCharCode(65 + index) as "A" | "B" | "C" | "D";
}

function normalisePremise(text: string): string {
  return text
    .toLocaleLowerCase("en-IN")
    .replace(/[’']/g, "")
    .replace(/[–—-]/g, " ")
    .replace(/\b(the|a|an)\b/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function assertSupplementIsDerived(
  context: BlrCp003CompetitiveRawContext,
  spec: DerivedSupplementSpec,
): number {
  const solved = solveRelationFromGraph(
    context.reconstructedFamily,
    spec.answerPersonId,
    spec.referencePersonId,
  );
  if (
    solved.relationId !== spec.relationId ||
    solved.path.steps.length < 2
  ) {
    throw new Error(
      `Invalid CP-003 V4 supplement ${spec.itemSuffix}: ${solved.relationId}/${solved.path.steps.length}.`,
    );
  }
  const proposition = normalisePremise(
    `${context.personNames[spec.answerPersonId]} is the ${relationLabel(spec.relationId).toLocaleLowerCase("en-IN")} of ${context.personNames[spec.referencePersonId]}.`,
  );
  const promptStatements = new Set(
    context.sharedPrompt
      .split(/[.\n]+/)
      .map(normalisePremise)
      .filter(Boolean),
  );
  if (promptStatements.has(proposition)) {
    throw new Error(`CP-003 V4 supplement repeats its answer premise: ${spec.itemSuffix}.`);
  }
  return solved.path.steps.length;
}

function actualRelationSentence(
  context: BlrCp003CompetitiveRawContext,
  personId: string,
  referenceId: string,
): string {
  try {
    const relationId = solveRelationFromGraph(
      context.reconstructedFamily,
      personId,
      referenceId,
    ).relationId;
    return `${context.personNames[personId]} is the ${relationLabel(relationId).toLocaleLowerCase("en-IN")} of ${context.personNames[referenceId]}`;
  } catch {
    return `${context.personNames[personId]} does not have the required relation to ${context.personNames[referenceId]}`;
  }
}

function buildDerivedSupplement(
  base: BlrCp003TeacherReviewRecord,
  context: BlrCp003CompetitiveRawContext,
  spec: DerivedSupplementSpec,
): BlrCp003CompetitiveReviewV4Record {
  const distance = assertSupplementIsDerived(context, spec);
  const targetLabel = relationLabel(spec.relationId);
  const targetLower = targetLabel.toLocaleLowerCase("en-IN");
  const answerName = context.personNames[spec.answerPersonId]!;
  const referenceName = context.personNames[spec.referencePersonId]!;
  const bridgeName = context.personNames[spec.bridgePersonId]!;
  const commonParentName = context.personNames[spec.commonParentId]!;
  const orderedIds = rotate(
    spec.candidatePersonIds,
    base.seed + spec.variantIndex,
  );
  const options = orderedIds.map((personId) => ({
    text: context.personNames[personId]!,
    isCorrect: personId === spec.answerPersonId,
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) {
    throw new Error(`Invalid CP-003 V4 supplemental options for ${spec.itemSuffix}.`);
  }
  const optionAnalysis: BlrCp003TeacherOptionAnalysis[] = orderedIds.map(
    (personId, index) => {
      const label = optionLabel(index);
      const actual = actualRelationSentence(
        context,
        personId,
        spec.referencePersonId,
      );
      return {
        optionLabel: label,
        optionText: context.personNames[personId]!,
        isCorrect: personId === spec.answerPersonId,
        explanation:
          personId === spec.answerPersonId
            ? `✅ Option ${label} is correct. ${answerName} is the ${targetLower} of ${referenceName}.`
            : `⚠️ Don't fall for Option ${label}! ${actual}, not the ${targetLower}.`,
      };
    },
  );
  const wrongWarnings = optionAnalysis
    .filter((entry) => !entry.isCorrect)
    .map(
      (entry) =>
        `⚠️ Don't fall for Option ${entry.optionLabel} (${entry.optionText})! ${entry.explanation.replace(/^⚠️ Don't fall for Option [A-D]!\s*/, "")}`,
    );
  const stem = `Who is the ${targetLower} of ${referenceName}?`;
  const conclusion = `${answerName} is the ${targetLower} of ${referenceName}.`;
  const stepByStepSolution = [
    "First, let's draw the family members generation by generation using the diagram below.",
    `${bridgeName} is the parent of ${referenceName}.`,
    `${answerName} and ${bridgeName} are siblings because both are children of ${commonParentName}.`,
    `${answerName} is therefore the ${targetLower} of ${referenceName}. This conclusion uses two family links, not a sentence copied from the passage.`,
    `Therefore, ${conclusion}`,
  ];

  return {
    ...base,
    itemId: `${spec.scenarioId}-V4-${spec.itemSuffix}`,
    prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-PERSON",
    stem,
    options,
    correctIndex,
    editorial: {
      coreConcept: [
        `To find an ${targetLower}, first locate the parent of the person named in the question, then identify that parent's ${spec.relationId === "UNCLE" ? "brother" : "sister"}.`,
        "A competitive-exam item should require at least two family links; a relation copied directly from one passage sentence is not enough.",
      ],
      familyTreeGrid: base.editorial.familyTreeGrid,
      stepByStepSolution,
      optionAnalysis,
      conclusion,
      examShortcut: `Find ${referenceName}'s parent first, then move sideways to that parent's ${spec.relationId === "UNCLE" ? "brother" : "sister"}. This two-move check reaches ${answerName} quickly.`,
      commonTraps: wrongWarnings,
    },
    metadata: {
      ...base.metadata,
      runtimeVersion: "blr-cp003-competitive-review-v4",
      competitiveExamEligible: true,
      minimumGraphDistance: distance,
      directTextMatchCount: 0,
      claimOptionMinimumGraphDistance: null,
      claimOptionDirectTextMatchCount: 0,
      hasAsciiFamilyTree: true,
      hasFourTierTeacherVoice: true,
      reverseTrapRequired: false,
      reverseTrapExplained: true,
      supplementalDerivedItem: true,
      semanticFingerprint: stableHash([
        base.metadata.semanticFingerprint,
        spec.itemSuffix,
        spec.relationId,
        spec.answerPersonId,
        spec.referencePersonId,
        ...orderedIds,
        ...stepByStepSolution,
      ]),
    },
  };
}

export function generateBlrCp003CompetitiveReviewV4Bundle(
  seeds: readonly number[] = [0, 1, 2, 3],
): BlrCp003CompetitiveReviewV4Bundle {
  const source = generateBlrCp003TeacherReviewV3Records(seeds);
  const audited = auditAllBlrCp003CompetitiveRecords(source, seeds);
  const selected: BlrCp003CompetitiveReviewV4Record[] = [];
  const rejected: BlrCp003CompetitiveReviewV4RejectedRecord[] = [];

  for (const entry of audited) {
    if (entry.audit.examEligible) {
      selected.push(upgradeSelectedRecord(entry.record, entry.context, entry.audit));
    } else {
      rejected.push({
        scenarioId: entry.record.scenarioId,
        topologyId: entry.record.topologyId,
        seed: entry.record.seed,
        itemId: entry.record.itemId,
        prototypeId: entry.record.prototypeId,
        stem: entry.record.stem,
        correctAnswer: entry.record.options[entry.record.correctIndex]!.text,
        audit: entry.audit,
      });
    }
  }

  const sourceEligibleRecordCount = selected.length;
  for (const seed of seeds) {
    for (const spec of DERIVED_SUPPLEMENTS) {
      const sourceEntry = audited.find(
        (entry) =>
          entry.record.scenarioId === spec.scenarioId &&
          entry.record.seed === seed,
      );
      if (!sourceEntry) {
        throw new Error(
          `Missing CP-003 V4 supplement source for ${spec.scenarioId}/${seed}.`,
        );
      }
      selected.push(
        buildDerivedSupplement(sourceEntry.record, sourceEntry.context, spec),
      );
    }
  }

  return {
    selected,
    rejected,
    sourceRecordCount: source.length,
    sourceEligibleRecordCount,
    supplementalRecordCount: selected.length - sourceEligibleRecordCount,
  };
}

export function generateBlrCp003CompetitiveReviewV4Records(
  seeds: readonly number[] = [0, 1, 2, 3],
): readonly BlrCp003CompetitiveReviewV4Record[] {
  return generateBlrCp003CompetitiveReviewV4Bundle(seeds).selected;
}
