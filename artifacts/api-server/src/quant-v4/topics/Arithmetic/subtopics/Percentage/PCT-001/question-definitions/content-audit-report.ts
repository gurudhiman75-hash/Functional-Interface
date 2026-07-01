import {
  buildQ001Q020ContentAudit,
  type QuestionDefinitionAuditRow,
} from "./content-audit";

function distribution(
  values: readonly string[],
): Record<string, number> {
  return values.reduce<Record<string, number>>((result, value) => {
    result[value] = (result[value] ?? 0) + 1;
    return result;
  }, {});
}

function ranked(
  rows: readonly QuestionDefinitionAuditRow[],
  direction: "asc" | "desc",
): readonly string[] {
  return [...rows]
    .sort((left, right) => {
      const delta =
        left.educationalRichnessScore - right.educationalRichnessScore;
      return direction === "asc" ? delta : -delta;
    })
    .map((row) => row.questionId);
}

export interface Q001Q020ContentAuditReport {
  questionCount: number;
  realisticStemCount: number;
  abstractStemCount: number;
  contextDistribution: Record<string, number>;
  explanationDistribution: Record<string, number>;
  difficultyDistribution: Record<string, number>;
  hintDistribution: Record<string, number>;
  misconceptionDistribution: Record<string, number>;
  educationalRichnessDistribution: {
    minimum: number;
    maximum: number;
    average: number;
  };
  migrationReadinessDistribution: Record<string, number>;
  immediatelySuitableForPackageMigration: readonly string[];
  structurallyMigratableDefinitions: readonly string[];
  strongestDefinitions: readonly string[];
  weakestDefinitions: readonly string[];
  humanEffortEstimate: {
    level: "HIGH";
    unchangedAssetsPerDefinition: readonly string[];
    humanAssetsStillRequiredPerDefinition: readonly string[];
  };
  recommendedMigrationOrder: readonly string[];
  recommendation: string;
}

export function buildQ001Q020ContentAuditReport(
  rows = buildQ001Q020ContentAudit(),
): Q001Q020ContentAuditReport {
  const scores = rows.map((row) => row.educationalRichnessScore);
  const strongestScore = Math.max(...scores);
  const weakestScore = Math.min(...scores);
  const preferred = [...rows]
    .sort(
      (left, right) =>
        right.educationalRichnessScore -
          left.educationalRichnessScore ||
        left.questionId.localeCompare(right.questionId),
    )
    .map((row) => row.questionId);
  return {
    questionCount: rows.length,
    realisticStemCount: rows.filter((row) => row.stemRealistic).length,
    abstractStemCount: rows.filter(
      (row) => row.contextType === "Abstract quantity",
    ).length,
    contextDistribution: distribution(
      rows.map((row) => row.contextType),
    ),
    explanationDistribution: distribution(
      rows.map((row) => row.explanationClassification),
    ),
    difficultyDistribution: distribution(
      rows.map((row) => row.difficultyClassification),
    ),
    hintDistribution: distribution(rows.map((row) => row.hintPresence)),
    misconceptionDistribution: distribution(
      rows.map((row) => row.misconceptionPresence),
    ),
    educationalRichnessDistribution: {
      minimum: weakestScore,
      maximum: strongestScore,
      average:
        scores.reduce((sum, score) => sum + score, 0) / scores.length,
    },
    migrationReadinessDistribution: distribution(
      rows.map((row) => row.migrationReadiness),
    ),
    immediatelySuitableForPackageMigration: rows
      .filter((row) => row.migrationReadiness === "READY")
      .map((row) => row.questionId),
    structurallyMigratableDefinitions: rows.map((row) => row.questionId),
    strongestDefinitions: ranked(
      rows.filter(
        (row) => row.educationalRichnessScore === strongestScore,
      ),
      "desc",
    ),
    weakestDefinitions: ranked(
      rows.filter(
        (row) => row.educationalRichnessScore === weakestScore,
      ),
      "asc",
    ),
    humanEffortEstimate: {
      level: "HIGH",
      unchangedAssetsPerDefinition: [
        "metadata",
        "approved QL stem reference",
        "variable ranges",
        "difficulty emergence",
        "detail-mode and role selection",
        "validation rule IDs",
      ],
      humanAssetsStillRequiredPerDefinition: [
        "question-specific contextual stem decision",
        "authored hint text",
        "authored misconception teaching text",
        "question-specific explanation language or explicit reuse approval",
        "context-specific realism constraints",
      ],
    },
    recommendedMigrationOrder: preferred,
    recommendation:
      "Migrate Q001-Q020 into package structure before authoring Q021-Q060, " +
      "but treat every definition as PARTIAL. Preserve its structural assets " +
      "unchanged and require human completion of educational wording and context assets before approval.",
  };
}

export const Q001_Q020_CONTENT_AUDIT_REPORT =
  buildQ001Q020ContentAuditReport();

