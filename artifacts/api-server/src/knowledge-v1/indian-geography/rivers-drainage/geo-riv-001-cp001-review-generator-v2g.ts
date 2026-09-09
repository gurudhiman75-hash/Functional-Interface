import type { KnowledgeFact } from "../../types";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import { GEO_RIV_001_CP001_REVIEWABLE_FACTS_V2 } from "./geo-riv-001-cp001-editorial-review-v2";
import { generateGeoRiv001Cp001ReviewV2F } from "./geo-riv-001-cp001-review-generator-v2f";
import type { GeoRiv001Cp001ReviewQuestion } from "./geo-riv-001-cp001-review-types";

const FACT_BY_ID = new Map(
  GEO_RIV_001_CP001_REVIEWABLE_FACTS_V2.map((fact) => [fact.factId, fact]),
);

function factsForQuestion(question: GeoRiv001Cp001ReviewQuestion) {
  return question.sourceFactIds
    .map((factId) => FACT_BY_ID.get(factId))
    .filter((fact): fact is KnowledgeFact => Boolean(fact));
}

function entityRefValue(fact: KnowledgeFact) {
  if (fact.value.kind !== "entity_ref") throw new Error(`${fact.factId} is not an entity-ref fact`);
  return fact.value.label.en;
}

const CONCEPT_EXPLANATIONS: Record<string, string> = {
  Drainage:
    "Drainage refers to the river system of an area. It describes the river network itself, whereas a drainage basin is the land area drained by that network.",
  "Drainage basin":
    "A drainage basin is the area drained by a river and its river system. The term refers to the land area contributing water to that river system.",
  "Water divide":
    "A water divide is an elevated boundary separating neighbouring drainage basins. Water falling on opposite sides of the divide drains into different river systems.",
};

const PATTERN_EDITORIAL: Record<
  string,
  { identificationStem: string; conditionStem: string; explanation: string }
> = {
  "Dendritic drainage pattern": {
    identificationStem:
      "A river network branches repeatedly like the limbs of a tree. Which drainage pattern does this describe?",
    conditionStem:
      "Streams follow the general slope and branch like the limbs of a tree. Which drainage pattern is characteristic of this setting?",
    explanation:
      "A tree-like branching river network is characteristic of the dendritic drainage pattern. Its tributaries spread in a branching form resembling the limbs of a tree.",
  },
  "Trellis drainage pattern": {
    identificationStem:
      "Main tributaries run nearly parallel and smaller streams join them at about right angles. Which drainage pattern does this describe?",
    conditionStem:
      "Main tributaries tend to run nearly parallel, with smaller streams joining them at about right angles. Which drainage pattern is characteristic of this setting?",
    explanation:
      "Near-parallel main tributaries with smaller streams joining at approximately right angles are characteristic of the trellis drainage pattern.",
  },
  "Rectangular drainage pattern": {
    identificationStem:
      "River courses show frequent right-angle bends in strongly jointed rock terrain. Which drainage pattern does this describe?",
    conditionStem:
      "A river flows through strongly jointed rock and repeatedly bends at right angles. Which drainage pattern is most likely to develop?",
    explanation:
      "Frequent right-angle bends associated with strongly jointed rock terrain indicate a rectangular drainage pattern.",
  },
  "Radial drainage pattern": {
    identificationStem:
      "Streams flow outward in different directions from a central elevated area. Which drainage pattern does this describe?",
    conditionStem:
      "Streams descend outward in different directions from a central elevated area. Which drainage pattern is characteristic of this setting?",
    explanation:
      "When streams flow outward in different directions from a central elevated area, the resulting arrangement is a radial drainage pattern.",
  },
};

function conceptNameForQuestion(question: GeoRiv001Cp001ReviewQuestion) {
  if (CONCEPT_EXPLANATIONS[question.canonicalAnswer]) return question.canonicalAnswer;
  const target = factsForQuestion(question).find(
    (fact) => fact.value.kind === "text" && fact.value.text.en === question.canonicalAnswer,
  );
  return target?.entity.label.en;
}

function relationGroupSentence(relation: string, value: string, entities: readonly string[]) {
  const names = entities.join(", ");
  const singular = entities.length === 1;
  if (relation === "classified_as_river_group") {
    const adjective = value === "Himalayan river" ? "Himalayan" : "Peninsular";
    return singular
      ? `${names} is a ${adjective} river.`
      : `${names} are ${adjective} rivers.`;
  }
  if (relation === "has_flow_direction") {
    const direction = value.toLowerCase();
    return singular
      ? `${names} is a ${direction} river.`
      : `${names} are ${direction} rivers.`;
  }
  if (relation === "drains_into") {
    return `${names} ${singular ? "drains" : "drain"} into the ${value}.`;
  }
  if (relation === "has_mouth_type") {
    const mouth = value === "Estuary"
      ? singular
        ? "an estuary"
        : "estuaries"
      : singular
        ? "a delta"
        : "deltas";
    return `${names} ${singular ? "forms" : "form"} ${mouth} at ${singular ? "its" : "their"} ${singular ? "mouth" : "mouths"}.`;
  }
  return `${names} — ${value}.`;
}

function relationSummary(facts: readonly KnowledgeFact[]) {
  if (facts.length === 0) return "";
  const relation = facts[0]!.relation;
  const groups = new Map<string, string[]>();
  for (const fact of facts) {
    if (fact.relation !== relation || fact.value.kind !== "entity_ref") continue;
    const value = entityRefValue(fact);
    const labels = groups.get(value) ?? [];
    if (!labels.includes(fact.entity.label.en)) labels.push(fact.entity.label.en);
    groups.set(value, labels);
  }
  return [...groups.entries()]
    .map(([value, entities]) => relationGroupSentence(relation, value, entities))
    .join(" ");
}

function improve(question: GeoRiv001Cp001ReviewQuestion) {
  let stem = question.stem;
  let explanation = question.explanation;

  if (question.qlId === "GEO-RIV-001-QL-001" || question.qlId === "GEO-RIV-001-QL-002") {
    const conceptName = conceptNameForQuestion(question);
    if (conceptName) explanation = CONCEPT_EXPLANATIONS[conceptName] ?? explanation;
  }

  if (question.qlId === "GEO-RIV-001-QL-003") {
    const editorial = PATTERN_EDITORIAL[question.canonicalAnswer];
    if (editorial) {
      stem = editorial.identificationStem;
      explanation = editorial.explanation;
    }
  }

  if (question.qlId === "GEO-RIV-001-QL-004") {
    const editorial = PATTERN_EDITORIAL[question.canonicalAnswer];
    if (editorial) {
      stem = editorial.conditionStem;
      explanation = editorial.explanation;
    }
  }

  if (
    question.qlId === "GEO-RIV-001-QL-005" ||
    question.qlId === "GEO-RIV-001-QL-006" ||
    question.qlId === "GEO-RIV-001-QL-007"
  ) {
    const summary = relationSummary(factsForQuestion(question));
    if (question.qlId === "GEO-RIV-001-QL-005") {
      explanation = summary;
    } else if (question.qlId === "GEO-RIV-001-QL-006") {
      explanation = `${question.canonicalAnswer} is correctly matched. ${summary}`;
    } else {
      explanation = `${question.canonicalAnswer} is the mismatched pair. ${summary}`;
    }
  }

  const improved: GeoRiv001Cp001ReviewQuestion = {
    ...question,
    questionId: question.questionId.replace(/CP001-V2F/g, "CP001-V2G"),
    stem,
    explanation,
  };
  assertKnowledgeQuestionValid({
    stem: improved.stem,
    explanation: improved.explanation,
    options: improved.options,
    correctIndex: improved.correctIndex,
    canonicalAnswer: improved.canonicalAnswer,
  });
  return improved;
}

export function generateGeoRiv001Cp001ReviewV2G(qlId: string, seed: string) {
  if (!seed.trim()) throw new Error("GEO-RIV-001 CP001 V2G review generation requires an explicit seed");
  return improve(generateGeoRiv001Cp001ReviewV2F(qlId, seed));
}
