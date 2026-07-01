import { PCT_001_QUESTION_DEFINITIONS } from "./registry";
import { instantiatePct001QuestionDefinition } from "./resolver";

function countBy<T extends string>(values: readonly T[]): Record<T, number> {
  return values.reduce(
    (counts, value) => {
      counts[value] = (counts[value] ?? 0) + 1;
      return counts;
    },
    {} as Record<T, number>,
  );
}

export interface Pct001QuestionDefinitionReport {
  definitionCount: number;
  definitionRange: "20-30";
  qlCoverage: Record<string, number>;
  difficultyCoverage: Record<string, number>;
  detailModeCoverage: Record<string, number>;
  directionCoverage: Record<string, number>;
  arithmeticCoverage: Record<string, number>;
  approvedStemProvenance: number;
  fallbackStemProvenance: number;
  questionSpecificVariableOwnership: number;
  questionSpecificExplanationOwnership: number;
  hintCoverage: readonly string[];
  misconceptionCoverage: readonly string[];
  validationRuleCoverage: readonly string[];
  productionLayersModified: readonly string[];
  knownScopeLimits: readonly string[];
}

export function buildPct001QuestionDefinitionReport(
  seed = "CONTENT-001-REPORT",
): Pct001QuestionDefinitionReport {
  const instances = PCT_001_QUESTION_DEFINITIONS.map((definition) =>
    instantiatePct001QuestionDefinition(definition.definitionId, seed),
  );
  return {
    definitionCount: PCT_001_QUESTION_DEFINITIONS.length,
    definitionRange: "20-30",
    qlCoverage: countBy(
      PCT_001_QUESTION_DEFINITIONS.map((definition) => definition.stem.qlId),
    ),
    difficultyCoverage: countBy(
      instances.map((instance) => instance.difficulty),
    ),
    detailModeCoverage: countBy(
      PCT_001_QUESTION_DEFINITIONS.map(
        (definition) => definition.explanation.detailMode,
      ),
    ),
    directionCoverage: countBy(
      PCT_001_QUESTION_DEFINITIONS.flatMap((definition) =>
        definition.variables.ratePairs.map((pair) => pair.direction),
      ),
    ),
    arithmeticCoverage: countBy(
      PCT_001_QUESTION_DEFINITIONS.map(
        (definition) => definition.variables.arithmeticBehavior,
      ),
    ),
    approvedStemProvenance: PCT_001_QUESTION_DEFINITIONS.filter(
      (definition) => definition.stem.provenanceStatus === "APPROVED",
    ).length,
    fallbackStemProvenance: 0,
    questionSpecificVariableOwnership: PCT_001_QUESTION_DEFINITIONS.filter(
      (definition) =>
        definition.variables.ratePairs.length > 0 &&
        definition.variables.unitValues.length > 0,
    ).length,
    questionSpecificExplanationOwnership:
      PCT_001_QUESTION_DEFINITIONS.filter(
        (definition) =>
          definition.explanation.requiredRoles.length > 0 &&
          definition.explanation.roleSelectionAuthority ===
            "QUESTION_DEFINITION",
      ).length,
    hintCoverage: [
      ...new Set(
        PCT_001_QUESTION_DEFINITIONS.flatMap(
          (definition) => definition.hintIds,
        ),
      ),
    ].sort(),
    misconceptionCoverage: [
      ...new Set(
        PCT_001_QUESTION_DEFINITIONS.flatMap(
          (definition) => definition.misconceptionIds,
        ),
      ),
    ].sort(),
    validationRuleCoverage: [
      ...new Set(
        PCT_001_QUESTION_DEFINITIONS.flatMap(
          (definition) => definition.validationRuleIds,
        ),
      ),
    ].sort(),
    productionLayersModified: [],
    knownScopeLimits: [
      "Definitions are additive and are not yet wired into the production generator.",
      "Stem wording remains limited to the five existing approved PCT-CP-002 English QL assets.",
      "Contextual stems require future human-authored question assets; none were invented in CONTENT-001.",
      "Question definitions currently qualify English generation only.",
    ],
  };
}

export const PCT_001_QUESTION_DEFINITION_REPORT =
  buildPct001QuestionDefinitionReport();

