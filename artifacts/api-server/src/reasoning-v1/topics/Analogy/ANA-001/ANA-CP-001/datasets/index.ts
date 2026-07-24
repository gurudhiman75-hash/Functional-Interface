import type { SemanticFact } from "../../foundation/types";
import { relationDefinition } from "../relation-definitions";
import { COUNTRY_CAPITAL_PAIRS } from "./country-capital.en";
import { STATE_CAPITAL_PAIRS } from "./state-capital.en";
import { COUNTRY_CURRENCY_PAIRS } from "./country-currency.en";
import { ANIMAL_YOUNG_PAIRS } from "./animal-young.en";
import { MALE_FEMALE_PAIRS } from "./male-female.en";
import { ANIMAL_SOUND_PAIRS } from "./animal-sound.en";
import { ANIMAL_MOVEMENT_PAIRS } from "./animal-movement.en";
import { WORKER_WORKPLACE_PAIRS } from "./worker-workplace.en";
import { WORKER_TOOL_PAIRS } from "./worker-tool.en";
import { WORKER_PRODUCT_PAIRS } from "./worker-product.en";
import { INSTRUMENT_MEASUREMENT_PAIRS } from "./instrument-measurement.en";
import { QUANTITY_UNIT_PAIRS } from "./quantity-unit.en";
import { OBJECT_FUNCTION_PAIRS } from "./object-function.en";
import { PART_WHOLE_PAIRS } from "./part-whole.en";
import { MEMBER_CLASS_PAIRS } from "./member-class.en";
import { INDIVIDUAL_GROUP_PAIRS } from "./individual-group.en";
import { PRODUCT_MATERIAL_PAIRS } from "./product-material.en";
import { PLACE_PURPOSE_PAIRS } from "./place-purpose.en";
import type { SemanticPair } from "./types";

const DATASETS: readonly [string, readonly SemanticPair[]][] = [
  ["SEM_COUNTRY_CAPITAL", COUNTRY_CAPITAL_PAIRS], ["SEM_STATE_CAPITAL", STATE_CAPITAL_PAIRS],
  ["SEM_COUNTRY_CURRENCY", COUNTRY_CURRENCY_PAIRS], ["SEM_ANIMAL_YOUNG", ANIMAL_YOUNG_PAIRS],
  ["SEM_MALE_FEMALE", MALE_FEMALE_PAIRS], ["SEM_ANIMAL_SOUND", ANIMAL_SOUND_PAIRS],
  ["SEM_ANIMAL_MOVEMENT", ANIMAL_MOVEMENT_PAIRS], ["SEM_WORKER_WORKPLACE", WORKER_WORKPLACE_PAIRS],
  ["SEM_WORKER_TOOL", WORKER_TOOL_PAIRS], ["SEM_WORKER_PRODUCT", WORKER_PRODUCT_PAIRS],
  ["SEM_INSTRUMENT_MEASUREMENT", INSTRUMENT_MEASUREMENT_PAIRS], ["SEM_QUANTITY_UNIT", QUANTITY_UNIT_PAIRS],
  ["SEM_OBJECT_FUNCTION", OBJECT_FUNCTION_PAIRS], ["SEM_PART_WHOLE", PART_WHOLE_PAIRS],
  ["SEM_MEMBER_CLASS", MEMBER_CLASS_PAIRS], ["SEM_INDIVIDUAL_GROUP", INDIVIDUAL_GROUP_PAIRS],
  ["SEM_PRODUCT_MATERIAL", PRODUCT_MATERIAL_PAIRS], ["SEM_PLACE_PURPOSE", PLACE_PURPOSE_PAIRS],
];

const SCIENCE_RELATIONS = new Set(["SEM_INSTRUMENT_MEASUREMENT", "SEM_QUANTITY_UNIT"]);
const LANGUAGE_RELATIONS = new Set(["SEM_ANIMAL_SOUND", "SEM_ANIMAL_MOVEMENT", "SEM_OBJECT_FUNCTION"]);

function fill(template: string, left: string, right: string): string {
  return template.replace("{left}", left).replace("{right}", right);
}

export const ANA_CP001_FACTS: readonly SemanticFact[] = DATASETS.flatMap(([relation, pairs], relationIndex) => {
  const definition = relationDefinition(relation);
  return pairs.map(([left, right], pairIndex) => {
    const predicate = fill(definition.predicateTemplate, left, right);
    return {
      id: `ANA-SF-${String(relationIndex * 12 + pairIndex + 1).padStart(3, "0")}`,
      left, right, relation, direction: "FORWARD" as const,
      predicate, explanation: predicate,
      answerCategory: definition.answerCategory, sourceCategory: definition.sourceCategory,
      difficulty: pairIndex < 5 ? "EASY" as const : pairIndex < 10 ? "MEDIUM" as const : "HARD" as const,
      locale: "en-IN" as const, examSuitability: ["SSC", "BANKING", "PUNJAB"] as const,
      version: "2.0.0", status: "CURATED" as const, verifiedAt: "2026-07-24",
      sourceType: SCIENCE_RELATIONS.has(relation) ? "STANDARD_SCIENCE" as const
        : LANGUAGE_RELATIONS.has(relation) ? "STANDARD_LANGUAGE" as const
        : "STABLE_GENERAL_KNOWLEDGE" as const,
      factRisk: ["SEM_COUNTRY_CAPITAL", "SEM_STATE_CAPITAL", "SEM_COUNTRY_CURRENCY"].includes(relation)
        ? "MEDIUM" as const : "LOW" as const,
      editorialNote: left === "Punjab"
        ? "Chandigarh serves as the capital of both Punjab and Haryana and is a Union Territory."
        : undefined,
    };
  });
});

export type { SemanticPair } from "./types";
