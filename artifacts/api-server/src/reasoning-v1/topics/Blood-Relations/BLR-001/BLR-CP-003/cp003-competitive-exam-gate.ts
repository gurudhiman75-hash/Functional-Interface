import { solveRelationFromGraph } from "../foundation/graph-closure";
import { relationLabel } from "../foundation/relation-ontology";
import type { BlrRelationId, FamilyGraph } from "../foundation/types";
import { generateBlrCp003ExtendedGroup } from "./cp003-extended-generator";
import { generateBlrCp003ScenarioGroup } from "./cp003-generator";
import { generateBlrCp003LineageGroup } from "./cp003-lineage-generator";
import { BLR_CP003_LINEAGE_SCENARIOS } from "./cp003-lineage-scenarios";
import { generateBlrCp003MaritalGroup } from "./cp003-marital-generator";
import { BLR_CP003_SCENARIOS } from "./cp003-scenario-library";
import { generateBlrCp003SourceGapGroup } from "./cp003-source-gap-generator";
import type { BlrCp003TeacherReviewRecord } from "./cp003-teacher-editorial";

export const BLR_CP003_MIN_GRAPH_DISTANCE = 2 as const;
export const BLR_CP003_MAX_DIRECT_TEXT_MATCH = 0 as const;
export const BLR_CP003_REJECT_KEYWORDS = [
  "PAIR:",
  "QueryRoleDepth",
  "NON_SPOUSE",
  "NON_SIBLING",
  "NON_PARENT_CHILD",
  "PERSON_SET:",
  "CLAIM:",
  "supported family path",
  "shortest supported path",
  "reconstructed family graph",
  "subject-to-reference",
] as const;

interface RawOptionLike {
  text: string;
  semanticKey: string;
  isCorrect: boolean;
  errorLabel?: string;
}

interface RawAnswerLike {
  kind: string;
  relationId?: string;
  generationRelationId?: string;
  status?: string;
  gender?: string;
  subjectId?: string;
  referenceId?: string;
  personId?: string;
  personIds?: readonly string[];
}

interface RawQuestionLike {
  itemId: string;
  prototypeId: string;
  stem: string;
  options: readonly RawOptionLike[];
  correctIndex: number;
  answer: RawAnswerLike;
}

interface RawGroupLike {
  scenarioId: string;
  seed: number;
  sharedPrompt: string;
  personNames: Readonly<Record<string, string>>;
  reconstructedFamily: FamilyGraph;
  questions: readonly RawQuestionLike[];
}

export interface BlrCp003CompetitiveRawContext {
  scenarioId: string;
  seed: number;
  sharedPrompt: string;
  personNames: Readonly<Record<string, string>>;
  reconstructedFamily: FamilyGraph;
  question: RawQuestionLike;
}

export type BlrCp003CompetitiveRejectionReason =
  | "NO_RELATIONAL_TARGET"
  | "UNRESOLVED_TARGET"
  | "GRAPH_DISTANCE_BELOW_TWO"
  | "DIRECT_PREMISE_REPEATED"
  | "CLAIM_OPTION_DISTANCE_BELOW_TWO"
  | "CLAIM_OPTION_REPEATS_PREMISE";

export interface BlrCp003ReverseTrapAudit {
  optionLabel: "A" | "B" | "C" | "D";
  optionText: string;
  reverseRelationId: BlrRelationId;
}

export interface BlrCp003CompetitiveAudit {
  itemId: string;
  examEligible: boolean;
  targetPairCount: number;
  targetGraphDistances: readonly number[];
  minimumGraphDistance: number | null;
  directTextMatchCount: number;
  claimOptionMinimumGraphDistance: number | null;
  claimOptionDirectTextMatchCount: number;
  reverseTrap: BlrCp003ReverseTrapAudit | null;
  rejectionReasons: readonly BlrCp003CompetitiveRejectionReason[];
}

function contextKey(scenarioId: string, seed: number, itemId: string): string {
  return `${scenarioId}::${seed}::${itemId}`;
}

function asRawGroup(group: unknown): RawGroupLike {
  return group as RawGroupLike;
}

function addRawGroup(
  contexts: Map<string, BlrCp003CompetitiveRawContext>,
  source: unknown,
): void {
  const group = asRawGroup(source);
  for (const question of group.questions) {
    contexts.set(contextKey(group.scenarioId, group.seed, question.itemId), {
      scenarioId: group.scenarioId,
      seed: group.seed,
      sharedPrompt: group.sharedPrompt,
      personNames: group.personNames,
      reconstructedFamily: group.reconstructedFamily,
      question,
    });
  }
}

export function buildBlrCp003CompetitiveRawContexts(
  seeds: readonly number[] = [0, 1, 2, 3],
): ReadonlyMap<string, BlrCp003CompetitiveRawContext> {
  const contexts = new Map<string, BlrCp003CompetitiveRawContext>();

  for (const scenario of BLR_CP003_SCENARIOS) {
    for (const seed of seeds) {
      addRawGroup(contexts, generateBlrCp003ScenarioGroup(scenario.scenarioId, seed));
    }
  }
  for (const seed of seeds) {
    addRawGroup(contexts, generateBlrCp003ExtendedGroup(seed));
    addRawGroup(contexts, generateBlrCp003MaritalGroup(seed));
    addRawGroup(contexts, generateBlrCp003SourceGapGroup(seed));
  }
  for (const scenario of BLR_CP003_LINEAGE_SCENARIOS) {
    for (const seed of seeds) {
      addRawGroup(contexts, generateBlrCp003LineageGroup(scenario.scenarioId, seed));
    }
  }

  return contexts;
}

function displayOptionLabel(index: number): "A" | "B" | "C" | "D" {
  return String.fromCharCode(65 + index) as "A" | "B" | "C" | "D";
}

function personIdForName(
  context: BlrCp003CompetitiveRawContext,
  name: string,
): string | null {
  const cleanName = name.trim();
  const matches = Object.entries(context.personNames)
    .filter(([, displayName]) => displayName === cleanName)
    .map(([personId]) => personId);
  return matches.length === 1 ? matches[0]! : null;
}

function relationStemNames(stem: string): readonly [string, string] | null {
  const patterns = [
    /^How is (.+) related to (.+)\?$/,
    /^What is the exact relation of (.+) to (.+)\?$/,
    /^What is (.+)'s generation position relative to (.+)\?$/,
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(stem);
    if (match) return [match[1]!, match[2]!];
  }
  return null;
}

function referenceNameFromStem(stem: string): string | null {
  const identify = /^Who is the .+ of (.+)\?$/.exec(stem);
  if (identify) return identify[1]!;
  const memberSet = /^Which option lists all the .+ of (.+)\?$/.exec(stem);
  return memberSet?.[1] ?? null;
}

function targetPairs(
  record: BlrCp003TeacherReviewRecord,
  context: BlrCp003CompetitiveRawContext,
): readonly (readonly [string, string])[] {
  const answer = context.question.answer;

  if (
    answer.kind === "CLAIM" &&
    typeof answer.subjectId === "string" &&
    typeof answer.referenceId === "string"
  ) {
    return [[answer.subjectId, answer.referenceId]];
  }

  if (answer.kind === "PAIR" && answer.personIds?.length === 2) {
    return [[answer.personIds[0]!, answer.personIds[1]!]];
  }

  if (answer.kind === "PERSON" && typeof answer.personId === "string") {
    const referenceName = referenceNameFromStem(record.stem);
    const referenceId = referenceName
      ? personIdForName(context, referenceName)
      : null;
    return referenceId ? [[answer.personId, referenceId]] : [];
  }

  if (answer.kind === "PERSON_SET" && answer.personIds?.length) {
    const referenceName = referenceNameFromStem(record.stem);
    const referenceId = referenceName
      ? personIdForName(context, referenceName)
      : null;
    return referenceId
      ? answer.personIds.map((personId) => [personId, referenceId] as const)
      : [];
  }

  if (
    answer.kind === "RELATION" ||
    answer.kind === "EXACT_LINEAGE" ||
    answer.kind === "GENERATION" ||
    answer.kind === "GENERATION_DISTANCE"
  ) {
    const names = relationStemNames(record.stem);
    if (!names) return [];
    const subjectId = personIdForName(context, names[0]);
    const referenceId = personIdForName(context, names[1]);
    return subjectId && referenceId ? [[subjectId, referenceId]] : [];
  }

  return [];
}

function graphDistance(
  graph: FamilyGraph,
  subjectId: string,
  referenceId: string,
): number | null {
  try {
    return solveRelationFromGraph(graph, subjectId, referenceId).path.steps.length;
  } catch {
    return null;
  }
}

function normalisePremiseText(text: string): string {
  return text
    .toLocaleLowerCase("en-IN")
    .replace(/[’']/g, "")
    .replace(/[–—-]/g, " ")
    .replace(/\b(the|a|an)\b/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function promptStatementSet(prompt: string): ReadonlySet<string> {
  return new Set(
    prompt
      .split(/[.\n]+/)
      .map(normalisePremiseText)
      .filter((statement) => statement.length > 0),
  );
}

function relationProposition(
  context: BlrCp003CompetitiveRawContext,
  subjectId: string,
  referenceId: string,
): string | null {
  try {
    const relationId = solveRelationFromGraph(
      context.reconstructedFamily,
      subjectId,
      referenceId,
    ).relationId;
    return `${context.personNames[subjectId]} is the ${relationLabel(relationId).toLocaleLowerCase("en-IN")} of ${context.personNames[referenceId]}.`;
  } catch {
    return null;
  }
}

function targetPremisePhrases(
  record: BlrCp003TeacherReviewRecord,
  context: BlrCp003CompetitiveRawContext,
  pairs: readonly (readonly [string, string])[],
): readonly string[] {
  const phrases = new Set<string>();
  const correctOption = context.question.options[context.question.correctIndex];
  if (correctOption && /\bis\b/i.test(correctOption.text)) {
    phrases.add(correctOption.text);
  }
  for (const [subjectId, referenceId] of pairs) {
    const proposition = relationProposition(context, subjectId, referenceId);
    if (proposition) phrases.add(proposition);
  }
  void record;
  return [...phrases];
}

function directMatchCount(prompt: string, phrases: readonly string[]): number {
  const statements = promptStatementSet(prompt);
  return phrases.filter((phrase) => statements.has(normalisePremiseText(phrase))).length;
}

function claimOptionAudits(
  context: BlrCp003CompetitiveRawContext,
): {
  minimumDistance: number | null;
  directTextMatchCount: number;
} {
  const claimOptions = context.question.options.filter((option) =>
    option.semanticKey.startsWith("CLAIM:"),
  );
  if (claimOptions.length === 0) {
    return { minimumDistance: null, directTextMatchCount: 0 };
  }

  const distances: number[] = [];
  const statements = promptStatementSet(context.sharedPrompt);
  let directMatches = 0;
  for (const option of claimOptions) {
    const match = /^CLAIM:([^:]+):([^:]+):([^:]+)$/.exec(option.semanticKey);
    if (!match) continue;
    const distance = graphDistance(
      context.reconstructedFamily,
      match[1]!,
      match[3]!,
    );
    if (distance !== null) distances.push(distance);
    if (statements.has(normalisePremiseText(option.text))) directMatches += 1;
  }

  return {
    minimumDistance: distances.length > 0 ? Math.min(...distances) : null,
    directTextMatchCount: directMatches,
  };
}

function reverseTrapAudit(
  context: BlrCp003CompetitiveRawContext,
  pairs: readonly (readonly [string, string])[],
): BlrCp003ReverseTrapAudit | null {
  if (context.question.answer.kind !== "RELATION" || pairs.length !== 1) return null;
  const [subjectId, referenceId] = pairs[0]!;
  let reverseRelationId: BlrRelationId;
  try {
    reverseRelationId = solveRelationFromGraph(
      context.reconstructedFamily,
      referenceId,
      subjectId,
    ).relationId;
  } catch {
    return null;
  }
  const optionIndex = context.question.options.findIndex(
    (option) => option.semanticKey === `RELATION:${reverseRelationId}` && !option.isCorrect,
  );
  if (optionIndex < 0) return null;
  return {
    optionLabel: displayOptionLabel(optionIndex),
    optionText: context.question.options[optionIndex]!.text,
    reverseRelationId,
  };
}

export function auditBlrCp003CompetitiveRecord(
  record: BlrCp003TeacherReviewRecord,
  context: BlrCp003CompetitiveRawContext,
): BlrCp003CompetitiveAudit {
  const pairs = targetPairs(record, context);
  const distances = pairs
    .map(([subjectId, referenceId]) =>
      graphDistance(context.reconstructedFamily, subjectId, referenceId),
    )
    .filter((distance): distance is number => distance !== null);
  const minimumGraphDistance =
    distances.length > 0 ? Math.min(...distances) : null;
  const directTextMatches = directMatchCount(
    context.sharedPrompt,
    targetPremisePhrases(record, context, pairs),
  );
  const claimAudit = claimOptionAudits(context);
  const rejectionReasons: BlrCp003CompetitiveRejectionReason[] = [];

  if (pairs.length === 0) rejectionReasons.push("NO_RELATIONAL_TARGET");
  if (pairs.length > 0 && distances.length !== pairs.length) {
    rejectionReasons.push("UNRESOLVED_TARGET");
  }
  if (
    minimumGraphDistance !== null &&
    minimumGraphDistance < BLR_CP003_MIN_GRAPH_DISTANCE
  ) {
    rejectionReasons.push("GRAPH_DISTANCE_BELOW_TWO");
  }
  if (directTextMatches > BLR_CP003_MAX_DIRECT_TEXT_MATCH) {
    rejectionReasons.push("DIRECT_PREMISE_REPEATED");
  }
  if (
    claimAudit.minimumDistance !== null &&
    claimAudit.minimumDistance < BLR_CP003_MIN_GRAPH_DISTANCE
  ) {
    rejectionReasons.push("CLAIM_OPTION_DISTANCE_BELOW_TWO");
  }
  if (
    claimAudit.directTextMatchCount > BLR_CP003_MAX_DIRECT_TEXT_MATCH
  ) {
    rejectionReasons.push("CLAIM_OPTION_REPEATS_PREMISE");
  }

  return {
    itemId: record.itemId,
    examEligible:
      pairs.length > 0 &&
      distances.length === pairs.length &&
      minimumGraphDistance !== null &&
      rejectionReasons.length === 0,
    targetPairCount: pairs.length,
    targetGraphDistances: distances,
    minimumGraphDistance,
    directTextMatchCount: directTextMatches,
    claimOptionMinimumGraphDistance: claimAudit.minimumDistance,
    claimOptionDirectTextMatchCount: claimAudit.directTextMatchCount,
    reverseTrap: reverseTrapAudit(context, pairs),
    rejectionReasons,
  };
}

export function auditAllBlrCp003CompetitiveRecords(
  records: readonly BlrCp003TeacherReviewRecord[],
  seeds: readonly number[] = [0, 1, 2, 3],
): readonly {
  record: BlrCp003TeacherReviewRecord;
  context: BlrCp003CompetitiveRawContext;
  audit: BlrCp003CompetitiveAudit;
}[] {
  const contexts = buildBlrCp003CompetitiveRawContexts(seeds);
  return records.map((record) => {
    const context = contexts.get(
      contextKey(record.scenarioId, record.seed, record.itemId),
    );
    if (!context) {
      throw new Error(`Missing CP-003 competitive context for ${record.itemId}.`);
    }
    return {
      record,
      context,
      audit: auditBlrCp003CompetitiveRecord(record, context),
    };
  });
}
