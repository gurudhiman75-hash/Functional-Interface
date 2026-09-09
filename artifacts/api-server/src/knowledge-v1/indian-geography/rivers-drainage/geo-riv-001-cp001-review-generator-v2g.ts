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

const SIMPLE_DEFINITIONS: Record<string, string> = {
  Drainage: "the river system of an area",
  "Drainage basin": "the area drained by a river and its tributaries",
  "Water divide": "a highland that separates two drainage basins",
};

const DEFINITION_OPTION_REWRITES: Record<string, string> = {
  "the area drained by a river and its river system":
    "the area drained by a river and its tributaries",
  "an elevated boundary that separates neighbouring drainage basins":
    "a highland that separates two drainage basins",
  "a pattern in which tributaries tend to follow near-parallel courses and smaller streams join them at approximately right angles":
    "a pattern in which main streams run nearly parallel and smaller streams join at right angles",
  "a drainage pattern associated with strongly jointed rock terrain and frequent right-angle bends":
    "a pattern with frequent right-angle bends in jointed rocks",
  "a branching drainage pattern resembling the branches of a tree":
    "a tree-like branching drainage pattern",
};

const CONCEPT_EDITORIAL: Record<
  string,
  { directStem: string; reverseStem: string; explanation: string }
> = {
  Drainage: {
    directStem: "Which term refers to the river system of an area?",
    reverseStem: "What is meant by drainage?",
    explanation:
      "Drainage means the river system of an area. A drainage basin, on the other hand, is the area drained by that river system.",
  },
  "Drainage basin": {
    directStem: "The area drained by a river and its tributaries is called:",
    reverseStem: "What is a drainage basin?",
    explanation:
      "A drainage basin is the area drained by a river and its tributaries. All the water in this area drains into the same river system.",
  },
  "Water divide": {
    directStem: "A highland that separates two drainage basins is called:",
    reverseStem: "What is a water divide?",
    explanation:
      "A water divide is a highland that separates two drainage basins. Water on the two sides flows into different river systems.",
  },
};

const PATTERN_EDITORIAL: Record<
  string,
  { identificationStem: string; conditionStem: string; explanation: string }
> = {
  "Dendritic drainage pattern": {
    identificationStem:
      "A river network looks like the branches of a tree. Which drainage pattern is this?",
    conditionStem:
      "Which drainage pattern develops when streams follow the general slope and branch like a tree?",
    explanation:
      "In a dendritic pattern, the river and its tributaries form a tree-like network. The streams branch in different directions like the branches of a tree.",
  },
  "Trellis drainage pattern": {
    identificationStem:
      "Main streams run nearly parallel and smaller streams join them at right angles. Which drainage pattern is this?",
    conditionStem:
      "Which drainage pattern develops when main streams run nearly parallel and smaller streams join them at right angles?",
    explanation:
      "In a trellis pattern, the main streams run nearly parallel and smaller streams join them at about right angles.",
  },
  "Rectangular drainage pattern": {
    identificationStem:
      "A river takes frequent right-angle turns in jointed rocks. Which drainage pattern is this?",
    conditionStem:
      "Which drainage pattern is likely where rivers follow joints in rocks and take frequent right-angle turns?",
    explanation:
      "A rectangular drainage pattern develops where rivers follow joints in rocks and take frequent right-angle turns.",
  },
  "Radial drainage pattern": {
    identificationStem:
      "Streams flow outward from a central highland. Which drainage pattern is this?",
    conditionStem:
      "Which drainage pattern develops when streams flow outward from a central highland?",
    explanation:
      "In a radial pattern, streams flow outward in different directions from a central highland.",
  },
};

function conceptNameForQuestion(question: GeoRiv001Cp001ReviewQuestion) {
  if (CONCEPT_EDITORIAL[question.canonicalAnswer]) return question.canonicalAnswer;
  const target = factsForQuestion(question).find(
    (fact) => fact.value.kind === "text" && fact.value.text.en === question.canonicalAnswer,
  );
  return target?.entity.label.en;
}

function joinNames(entities: readonly string[]) {
  if (entities.length <= 1) return entities[0] ?? "";
  if (entities.length === 2) return `${entities[0]} and ${entities[1]}`;
  return `${entities.slice(0, -1).join(", ")} and ${entities.at(-1)}`;
}

function relationGroupSentence(relation: string, value: string, entities: readonly string[]) {
  const names = joinNames(entities);
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

function simplifyStatementLanguage(text: string) {
  return text
    .replace(
      /Many peninsular rivers are seasonal or strongly rain-fed\./g,
      "Many Peninsular rivers are seasonal and largely rain-fed.",
    )
    .replace(
      /Which of the statements given above is\/are correct\?/g,
      "Which of the above statements is/are correct?",
    )
    .replace(
      /How many of the statements given above are correct\?/g,
      "How many of the above statements are correct?",
    )
    .replace(
      /Therefore, Both Statement I and Statement II are correct\./g,
      "Hence, both statements are correct.",
    )
    .replace(
      /Therefore, Only Statement I is correct\./g,
      "Hence, only Statement I is correct.",
    )
    .replace(
      /Therefore, Only Statement II is correct\./g,
      "Hence, only Statement II is correct.",
    )
    .replace(
      /Therefore, Neither Statement I nor Statement II is correct\./g,
      "Hence, neither statement is correct.",
    )
    .replace(
      /0 of the three statements are correct\. Therefore, the answer is None\./g,
      "Hence, none of the statements is correct.",
    )
    .replace(
      /1 of the three statements is correct\. Therefore, the answer is One\./g,
      "Hence, one statement is correct.",
    )
    .replace(
      /2 of the three statements are correct\. Therefore, the answer is Two\./g,
      "Hence, two statements are correct.",
    )
    .replace(
      /3 of the three statements are correct\. Therefore, the answer is Three\./g,
      "Hence, all three statements are correct.",
    );
}

function simplifyRiverStem(stem: string) {
  return stem
    .replace(
      "Which of the following is a river that drains into the ",
      "Which of the following rivers drains into the ",
    )
    .replace(
      "Which of the following is a river that forms an estuary at its mouth?",
      "Which of the following rivers forms an estuary at its mouth?",
    );
}

function improve(question: GeoRiv001Cp001ReviewQuestion) {
  let stem = simplifyStatementLanguage(question.stem);
  let explanation = simplifyStatementLanguage(question.explanation);
  let options = [...question.options];
  let canonicalAnswer = question.canonicalAnswer;

  if (question.qlId === "GEO-RIV-001-QL-001" || question.qlId === "GEO-RIV-001-QL-002") {
    const conceptName = conceptNameForQuestion(question);
    const editorial = conceptName ? CONCEPT_EDITORIAL[conceptName] : undefined;
    if (editorial) {
      stem = question.qlId === "GEO-RIV-001-QL-001" ? editorial.directStem : editorial.reverseStem;
      explanation = editorial.explanation;
    }
    if (question.qlId === "GEO-RIV-001-QL-002") {
      options = options.map((option) => DEFINITION_OPTION_REWRITES[option] ?? option);
      if (conceptName) canonicalAnswer = SIMPLE_DEFINITIONS[conceptName] ?? canonicalAnswer;
    }
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
      stem = simplifyRiverStem(stem);
      explanation = summary;
    } else if (question.qlId === "GEO-RIV-001-QL-006") {
      stem = "Which of the following pairs is correctly matched?";
      explanation = `${question.canonicalAnswer} is correctly matched. ${summary}`;
    } else {
      stem = "Which of the following pairs is incorrectly matched?";
      explanation = `${question.canonicalAnswer} is incorrectly matched. ${summary}`;
    }
  }

  const improved: GeoRiv001Cp001ReviewQuestion = {
    ...question,
    questionId: question.questionId.replace(/CP001-V2F/g, "CP001-V2G"),
    stem,
    options,
    canonicalAnswer,
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
