import { getQuestionEntry } from "../library";
import { PCT_001_QUESTION_DEFINITIONS } from "./registry";
import type { Pct001QuestionDefinition } from "./types";

export type ContentContextClassification =
  | "Abstract quantity"
  | "Salary"
  | "Students"
  | "Books"
  | "Marks"
  | "Profit"
  | "Revenue"
  | "Savings"
  | "Employees"
  | "Workers"
  | "Population"
  | "Other";
export type ExplanationClassification =
  | "Generic"
  | "Semi-specific"
  | "Question-specific";
export type DifficultyClassification =
  | "Label-driven"
  | "Micro-emergent"
  | "Mixed";
export type AssetRichness = "Absent" | "Minimal" | "Rich";
export type MigrationReadiness = "READY" | "PARTIAL" | "WEAK";

export interface QuestionDefinitionAuditRow {
  questionId: string;
  qlId: string;
  stem: string;
  stemRealistic: boolean;
  stemSpecificity: "GENERIC_APPROVED_ASSET";
  variableOwnership: string;
  difficultyOwnership: string;
  difficultyClassification: DifficultyClassification;
  explanationPolicies: string;
  explanationClassification: ExplanationClassification;
  hintPresence: AssetRichness;
  hintCount: number;
  misconceptionPresence: AssetRichness;
  misconceptionCount: number;
  validationRules: string;
  validationRuleCount: number;
  contextType: ContentContextClassification;
  arithmeticCharacteristics: string;
  educationalRichnessScore: number;
  migrationReadiness: MigrationReadiness;
  migratableUnchanged: string;
  humanWorkRemaining: string;
}

function richness(count: number, richThreshold: number): AssetRichness {
  if (count === 0) return "Absent";
  return count >= richThreshold ? "Rich" : "Minimal";
}

function classifyContext(
  definition: Pct001QuestionDefinition,
): ContentContextClassification {
  if (definition.realism.contextProfile === "ABSTRACT_NUMBER") {
    return "Abstract quantity";
  }
  return "Other";
}

function explanationClassification(
  definition: Pct001QuestionDefinition,
): ExplanationClassification {
  const hasQuestionOwnedSelection =
    definition.explanation.roleSelectionAuthority === "QUESTION_DEFINITION";
  const hasQuestionSpecificLanguage =
    definition.explanation.languageAssetAuthority !==
    "EEV2_HUMAN_LANGUAGE_FAMILY";
  if (hasQuestionSpecificLanguage) return "Question-specific";
  if (hasQuestionOwnedSelection) return "Semi-specific";
  return "Generic";
}

function stemIsRealistic(definition: Pct001QuestionDefinition): boolean {
  return (
    definition.stem.qlId === "PCT-QL-017" ||
    definition.stem.qlId === "PCT-QL-217"
  );
}

function richnessScore(definition: Pct001QuestionDefinition): number {
  const approvedGenericStem =
    definition.stem.provenanceStatus === "APPROVED" ? 4 : 0;
  const naturalStem = stemIsRealistic(definition) ? 4 : 0;
  const variables =
    definition.variables.ratePairs.length > 0 &&
    definition.variables.unitValues.length > 0
      ? 18
      : 0;
  const difficulty =
    definition.difficulty.authority === "QUESTION_DEFINITION" ? 15 : 0;
  const explanation =
    explanationClassification(definition) === "Semi-specific" ? 10 : 0;
  const hints = Math.min(7, definition.hintIds.length * 2);
  const misconceptions = Math.min(
    8,
    definition.misconceptionIds.length * 2,
  );
  const validation = definition.validationRuleIds.length >= 6 ? 10 : 5;
  const realism =
    definition.realism.contextProfile === "ABSTRACT_NUMBER" ? 2 : 10;
  return (
    approvedGenericStem +
    naturalStem +
    variables +
    difficulty +
    explanation +
    hints +
    misconceptions +
    validation +
    realism
  );
}

function readiness(score: number): MigrationReadiness {
  if (score >= 80) return "READY";
  if (score >= 50) return "PARTIAL";
  return "WEAK";
}

function rateSummary(definition: Pct001QuestionDefinition): string {
  return definition.variables.ratePairs
    .map(
      (pair) =>
        `${pair.knownRate}->${pair.targetRate}:${pair.direction}`,
    )
    .join("|");
}

export function auditQuestionDefinition(
  definition: Pct001QuestionDefinition,
): QuestionDefinitionAuditRow {
  const score = richnessScore(definition);
  const stem = getQuestionEntry(
    "PCT-CP-002",
    definition.stem.qlId,
    "en",
  ).template;
  return {
    questionId: definition.definitionId,
    qlId: definition.stem.qlId,
    stem,
    stemRealistic: stemIsRealistic(definition),
    stemSpecificity: "GENERIC_APPROVED_ASSET",
    variableOwnership: `rates=${rateSummary(definition)};unitValues=${definition.variables.unitValues.join("|")}`,
    difficultyOwnership: `authority=${definition.difficulty.authority};factors=${definition.difficulty.factors.join("|")}`,
    difficultyClassification: "Micro-emergent",
    explanationPolicies:
      `mode=${definition.explanation.detailMode};` +
      `verification=${definition.explanation.verificationPolicy};` +
      `roles=${definition.explanation.requiredRoles.join("|")}`,
    explanationClassification: explanationClassification(definition),
    hintPresence: richness(definition.hintIds.length, 4),
    hintCount: definition.hintIds.length,
    misconceptionPresence: richness(
      definition.misconceptionIds.length,
      5,
    ),
    misconceptionCount: definition.misconceptionIds.length,
    validationRules: definition.validationRuleIds.join("|"),
    validationRuleCount: definition.validationRuleIds.length,
    contextType: classifyContext(definition),
    arithmeticCharacteristics:
      `${definition.variables.arithmeticBehavior};` +
      `${definition.variables.exactnessPolicy};` +
      `${definition.variables.roundingBoundary}`,
    educationalRichnessScore: score,
    migrationReadiness: readiness(score),
    migratableUnchanged:
      "metadata;approved stem reference;variable ranges;difficulty emergence;role selection;validation rule IDs",
    humanWorkRemaining:
      "question-specific stem/context review;authored hint text;authored misconception teaching;question-specific explanation language;context realism",
  };
}

export function buildQ001Q020ContentAudit(): readonly QuestionDefinitionAuditRow[] {
  return PCT_001_QUESTION_DEFINITIONS.map(auditQuestionDefinition);
}

function csvCell(value: string | number | boolean): string {
  const text = String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function serializeQ001Q020AuditCsv(
  rows = buildQ001Q020ContentAudit(),
): string {
  const headers: readonly (keyof QuestionDefinitionAuditRow)[] = [
    "questionId",
    "qlId",
    "stem",
    "stemRealistic",
    "stemSpecificity",
    "variableOwnership",
    "difficultyOwnership",
    "difficultyClassification",
    "explanationPolicies",
    "explanationClassification",
    "hintPresence",
    "hintCount",
    "misconceptionPresence",
    "misconceptionCount",
    "validationRules",
    "validationRuleCount",
    "contextType",
    "arithmeticCharacteristics",
    "educationalRichnessScore",
    "migrationReadiness",
    "migratableUnchanged",
    "humanWorkRemaining",
  ];
  return [
    headers.map(csvCell).join(","),
    ...rows.map((row) =>
      headers.map((header) => csvCell(row[header])).join(","),
    ),
  ].join("\n") + "\n";
}
