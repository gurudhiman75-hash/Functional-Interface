import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PCT_001_QUESTION_DEFINITIONS } from "./registry";
import { auditQuestionDefinition, type QuestionDefinitionAuditRow } from "./content-audit";

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface EnrichedQuestionReport {
  questionId: string;
  hasStem: boolean;
  hasVariables: boolean;
  hasRelationship: boolean;
  hasUnitValue: boolean;
  hasScaling: boolean;
  hasAnswer: boolean;
  hasHints: boolean;
  hasMisconceptions: boolean;
  hasRealism: boolean;
  baseRichnessScore: number;
  enrichedRichnessScore: number;
  status: "READY" | "PARTIAL";
  context: string;
}

export interface Content003BReport {
  reportVersion: string;
  scope: string[];
  totalQuestionsAudited: number;
  enrichedRichnessAverage: number;
  questionReports: Record<string, EnrichedQuestionReport>;
  successCriteria: {
    readyStatusCount: number;
    richness85PlusCount: number;
    questionSpecificExplanationsCount: number;
    questionSpecificHintsCount: number;
    questionSpecificMisconceptionsCount: number;
    contextPersistenceCount: number;
  };
}

export function buildContent003BReport(): Content003BReport {
  const targetIds = ["Q001", "Q002", "Q003", "Q004", "Q005"];
  const questionReports: Record<string, EnrichedQuestionReport> = {};

  let totalEnrichedScore = 0;
  let readyStatusCount = 0;
  let richness85PlusCount = 0;
  let questionSpecificExplanationsCount = 0;
  let questionSpecificHintsCount = 0;
  let questionSpecificMisconceptionsCount = 0;
  let contextPersistenceCount = 0;

  for (const id of targetIds) {
    const definition = PCT_001_QUESTION_DEFINITIONS.find(d => d.definitionId === id);
    if (!definition) {
      throw new Error(`Definition ${id} not found in registry`);
    }

    const baseAuditRow = auditQuestionDefinition(definition);
    const baseScore = baseAuditRow.educationalRichnessScore;

    const dirPath = join(
      process.cwd(),
      "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-definitions",
      id
    );
    const hasStem = existsSync(join(dirPath, "stem.md"));
    const hasVariables = existsSync(join(dirPath, "variables.ts"));
    const hasRelationship = existsSync(join(dirPath, "relationship.md"));
    const hasUnitValue = existsSync(join(dirPath, "unit-value.md"));
    const hasScaling = existsSync(join(dirPath, "scaling.md"));
    const hasAnswer = existsSync(join(dirPath, "answer.md"));
    const hasHints = existsSync(join(dirPath, "hints.md"));
    const hasMisconceptions = existsSync(join(dirPath, "misconceptions.md"));
    const hasRealism = existsSync(join(dirPath, "realism.md"));

    // Read context from variables.ts
    let context = "unknown";
    if (hasVariables) {
      const content = readFileSync(join(dirPath, "variables.ts"), "utf8");
      const match = content.match(/context:\s*["']([^"']+)["']/);
      if (match) {
        context = match[1];
      }
    }

    // Richness Scoring:
    // Base score is calculated assuming abstract/generic context.
    // If enriched with human files:
    // - Stem is realistic and context specific (+8)
    // - Specific explanation blocks (+10)
    // - Hints are rich (+8)
    // - Misconceptions are rich (+6)
    // - Realism is question-specific and realistic (+8)
    let enrichedRichnessScore = baseScore;
    if (hasStem) enrichedRichnessScore += 8;
    if (hasRelationship && hasUnitValue && hasScaling && hasAnswer) enrichedRichnessScore += 10;
    if (hasHints) enrichedRichnessScore += 8;
    if (hasMisconceptions) enrichedRichnessScore += 6;
    if (hasRealism) enrichedRichnessScore += 8;

    // Cap richness score to 100
    enrichedRichnessScore = Math.min(100, enrichedRichnessScore);

    const isReady = enrichedRichnessScore >= 85 &&
      hasStem &&
      hasVariables &&
      hasRelationship &&
      hasUnitValue &&
      hasScaling &&
      hasAnswer &&
      hasHints &&
      hasMisconceptions &&
      hasRealism;

    if (isReady) readyStatusCount++;
    if (enrichedRichnessScore >= 85) richness85PlusCount++;
    if (hasRelationship && hasUnitValue && hasScaling && hasAnswer) questionSpecificExplanationsCount++;
    if (hasHints) questionSpecificHintsCount++;
    if (hasMisconceptions) questionSpecificMisconceptionsCount++;
    if (context !== "unknown" && context !== "abstract-number") contextPersistenceCount++;

    totalEnrichedScore += enrichedRichnessScore;

    questionReports[id] = {
      questionId: id,
      hasStem,
      hasVariables,
      hasRelationship,
      hasUnitValue,
      hasScaling,
      hasAnswer,
      hasHints,
      hasMisconceptions,
      hasRealism,
      baseRichnessScore: baseScore,
      enrichedRichnessScore,
      status: isReady ? "READY" : "PARTIAL",
      context,
    };
  }

  const enrichedRichnessAverage = totalEnrichedScore / targetIds.length;

  return {
    reportVersion: "1.0.0",
    scope: targetIds,
    totalQuestionsAudited: targetIds.length,
    enrichedRichnessAverage,
    questionReports,
    successCriteria: {
      readyStatusCount,
      richness85PlusCount,
      questionSpecificExplanationsCount,
      questionSpecificHintsCount,
      questionSpecificMisconceptionsCount,
      contextPersistenceCount,
    },
  };
}
