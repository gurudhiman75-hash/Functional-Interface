import { lexicalRelationDefinition } from "../relation-definitions";
import { SYNONYM_PAIRS } from "./synonym.en";
import { ANTONYM_PAIRS } from "./antonym.en";
import { INTENSITY_UP_PAIRS } from "./intensity-up.en";
import { INTENSITY_DOWN_PAIRS } from "./intensity-down.en";
import { CAUSE_EFFECT_PAIRS } from "./cause-effect.en";
import { EFFECT_CAUSE_PAIRS } from "./effect-cause.en";
import { CONDITION_SYMPTOM_PAIRS } from "./condition-symptom.en";
import { ACTION_RESULT_PAIRS } from "./action-result.en";
import { OBJECT_CHARACTERISTIC_PAIRS } from "./object-characteristic.en";
import { WORD_DEFINITION_PAIRS } from "./word-definition.en";
import { DEFICIENCY_QUALITY_PAIRS } from "./deficiency-quality.en";
import { STUDY_SUBJECT_PAIRS } from "./study-subject.en";
import type { LexicalFact, LexicalPair } from "./types";

const DATASETS: readonly [string, readonly LexicalPair[]][] = [
  ["LEX_SYNONYM", SYNONYM_PAIRS], ["LEX_ANTONYM", ANTONYM_PAIRS],
  ["LEX_INTENSITY_UP", INTENSITY_UP_PAIRS], ["LEX_INTENSITY_DOWN", INTENSITY_DOWN_PAIRS],
  ["LEX_CAUSE_EFFECT", CAUSE_EFFECT_PAIRS], ["LEX_EFFECT_CAUSE", EFFECT_CAUSE_PAIRS],
  ["LEX_CONDITION_SYMPTOM", CONDITION_SYMPTOM_PAIRS], ["LEX_ACTION_RESULT", ACTION_RESULT_PAIRS],
  ["LEX_OBJECT_CHARACTERISTIC", OBJECT_CHARACTERISTIC_PAIRS], ["LEX_WORD_DEFINITION", WORD_DEFINITION_PAIRS],
  ["LEX_DEFICIENCY_MISSING_QUALITY", DEFICIENCY_QUALITY_PAIRS], ["LEX_STUDY_SUBJECT", STUDY_SUBJECT_PAIRS],
];

function fill(template: string, left: string, right: string): string {
  return template.replace("{left}", left).replace("{right}", right);
}

export const ANA_CP002_FACTS: readonly LexicalFact[] = DATASETS.flatMap(([relation, pairs], relationIndex) => {
  const definition = lexicalRelationDefinition(relation);
  return pairs.map(([left, right], pairIndex) => ({
    id: `ANA-LF-${String(relationIndex * 12 + pairIndex + 1).padStart(3, "0")}`,
    left, right, relation,
    predicate: fill(definition.predicateTemplate, left, right),
    sourceCategory: definition.sourceCategory,
    answerCategory: definition.answerCategory,
    difficulty: pairIndex < 5 ? "EASY" as const : pairIndex < 10 ? "MEDIUM" as const : "HARD" as const,
    locale: "en-IN" as const,
    examSuitability: ["SSC", "BANKING", "PUNJAB"] as const,
    version: "1.0.0", status: "CURATED" as const, verifiedAt: "2026-07-24",
    sourceType: ["LEX_SYNONYM","LEX_ANTONYM","LEX_INTENSITY_UP","LEX_INTENSITY_DOWN","LEX_WORD_DEFINITION","LEX_DEFICIENCY_MISSING_QUALITY"].includes(relation)
      ? "STANDARD_DICTIONARY" as const : "STANDARD_GENERAL_KNOWLEDGE" as const,
  }));
});

export type { LexicalFact, LexicalPair } from "./types";
