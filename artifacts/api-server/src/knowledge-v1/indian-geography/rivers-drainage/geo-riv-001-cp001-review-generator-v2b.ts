import { deterministicPick, deterministicShuffle } from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP001_REVIEWABLE_FACTS_V2 } from "./geo-riv-001-cp001-editorial-review-v2";
import type { GeoRiv001Cp001ReviewQuestion } from "./geo-riv-001-cp001-review-types";
import {
  generateGeoRiv001Ql001ReviewV2,
  generateGeoRiv001Ql002ReviewV2,
  generateGeoRiv001Ql003ReviewV2,
  generateGeoRiv001Ql004ReviewV2,
  generateGeoRiv001Ql005ReviewV2,
  generateGeoRiv001Ql008ReviewV2,
  generateGeoRiv001Ql009ReviewV2,
} from "./geo-riv-001-cp001-review-generator-v2";

const COMPOSABLE_RELATIONS = [
  "classified_as_river_group",
  "has_flow_direction",
  "drains_into",
  "has_mouth_type",
] as const;

function relationFacts(relation: string) {
  return GEO_RIV_001_CP001_REVIEWABLE_FACTS_V2.filter(
    (fact) => fact.relation === relation && fact.review.status === "REVIEW_REQUIRED",
  );
}

function entityLabel(fact: KnowledgeFact) {
  return fact.entity.label.en;
}

function entityRefValue(fact: KnowledgeFact) {
  if (fact.value.kind !== "entity_ref") throw new Error(`${fact.factId} is not an entity-ref fact`);
  return fact.value.label.en;
}

function oppositeValue(relation: string, value: string) {
  const opposites: Record<string, Record<string, string>> = {
    classified_as_river_group: {
      "Himalayan river": "Peninsular river",
      "Peninsular river": "Himalayan river",
    },
    has_flow_direction: {
      "East-flowing": "West-flowing",
      "West-flowing": "East-flowing",
    },
    drains_into: {
      "Bay of Bengal": "Arabian Sea",
      "Arabian Sea": "Bay of Bengal",
    },
    has_mouth_type: {
      Delta: "Estuary",
      Estuary: "Delta",
    },
  };
  const answer = opposites[relation]?.[value];
  if (!answer) throw new Error(`No opposite value for ${relation}:${value}`);
  return answer;
}

function relationDisplay(relation: string, value: string) {
  if (relation === "classified_as_river_group") return value;
  if (relation === "has_flow_direction") return `${value} river`;
  if (relation === "drains_into") return `drains into ${value}`;
  if (relation === "has_mouth_type") {
    return value === "Estuary" ? "forms an estuary" : "forms a delta";
  }
  return value;
}

function pairText(fact: KnowledgeFact, forceWrong = false) {
  const actual = entityRefValue(fact);
  const shown = forceWrong ? oppositeValue(fact.relation, actual) : actual;
  return `${entityLabel(fact)} — ${relationDisplay(fact.relation, shown)}`;
}

function sourceIds(facts: readonly KnowledgeFact[]) {
  return [...new Set(facts.map((fact) => fact.source.sourceId))];
}

function pickThree<T>(items: readonly T[], seed: string) {
  if (items.length < 3) throw new Error(`GEO-RIV-001 V2B has only ${items.length} distractors`);
  return deterministicShuffle(items, seed).slice(0, 3);
}

function finalizePair(
  qlId: string,
  qlName: string,
  seed: string,
  stem: string,
  canonicalAnswer: string,
  wrongAnswers: string[],
  explanation: string,
  facts: KnowledgeFact[],
): GeoRiv001Cp001ReviewQuestion {
  const records = deterministicShuffle(
    [
      { text: canonicalAnswer, correct: true },
      ...wrongAnswers.map((text) => ({ text, correct: false })),
    ],
    `${seed}:${qlId}:options`,
  );
  const options = records.map((entry) => entry.text);
  const correctIndex = records.findIndex((entry) => entry.correct);
  assertKnowledgeQuestionValid({ stem, explanation, options, correctIndex, canonicalAnswer });
  return {
    questionId: `GEO-RIV-001-CP001-V2B-${qlId}-${seed}`,
    chapterId: "GEO-RIV-001",
    cpId: "GEO-RIV-001-CP001",
    qlId,
    qlName,
    difficulty: "Medium",
    stem,
    options,
    correctIndex,
    canonicalAnswer,
    explanation,
    sourceIds: sourceIds(facts),
    sourceFactIds: [...new Set(facts.map((fact) => fact.factId))],
    solverAuthority: "RELATION_CLASS_COMPOSER",
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generateGeoRiv001Ql006ReviewV2B(seed: string) {
  const qlId = "GEO-RIV-001-QL-006";
  const relation = deterministicPick(COMPOSABLE_RELATIONS, `${seed}:relation`);
  const pool = relationFacts(relation);
  const target = deterministicPick(pool, `${seed}:target`);
  const wrongFacts = pickThree(pool.filter((fact) => fact.factId !== target.factId), `${seed}:wrong`);
  return finalizePair(
    qlId,
    "Correct pair",
    seed,
    "Which of the following river-association pairs is correctly matched?",
    pairText(target),
    wrongFacts.map((fact) => pairText(fact, true)),
    `${pairText(target)} is correct. Each of the other pairs reverses the reviewed relation for that river.`,
    [target, ...wrongFacts],
  );
}

export function generateGeoRiv001Ql007ReviewV2B(seed: string) {
  const qlId = "GEO-RIV-001-QL-007";
  const relation = deterministicPick(COMPOSABLE_RELATIONS, `${seed}:relation`);
  const pool = relationFacts(relation);
  const falseFact = deterministicPick(pool, `${seed}:false`);
  const trueFacts = pickThree(pool.filter((fact) => fact.factId !== falseFact.factId), `${seed}:true`);
  const falsePair = pairText(falseFact, true);
  return finalizePair(
    qlId,
    "Incorrect pair / exception",
    seed,
    "Which of the following river-association pairs is incorrectly matched?",
    falsePair,
    trueFacts.map((fact) => pairText(fact)),
    `${falsePair} is incorrect. The correct relation is ${pairText(falseFact)}. The other three pairs are correctly matched.`,
    [falseFact, ...trueFacts],
  );
}

export const GEO_RIV_001_CP001_REVIEW_GENERATORS_V2B: Record<
  string,
  (seed: string) => GeoRiv001Cp001ReviewQuestion
> = {
  "GEO-RIV-001-QL-001": generateGeoRiv001Ql001ReviewV2,
  "GEO-RIV-001-QL-002": generateGeoRiv001Ql002ReviewV2,
  "GEO-RIV-001-QL-003": generateGeoRiv001Ql003ReviewV2,
  "GEO-RIV-001-QL-004": generateGeoRiv001Ql004ReviewV2,
  "GEO-RIV-001-QL-005": generateGeoRiv001Ql005ReviewV2,
  "GEO-RIV-001-QL-006": generateGeoRiv001Ql006ReviewV2B,
  "GEO-RIV-001-QL-007": generateGeoRiv001Ql007ReviewV2B,
  "GEO-RIV-001-QL-008": generateGeoRiv001Ql008ReviewV2,
  "GEO-RIV-001-QL-009": generateGeoRiv001Ql009ReviewV2,
};

export function generateGeoRiv001Cp001ReviewV2B(qlId: string, seed: string) {
  const generator = GEO_RIV_001_CP001_REVIEW_GENERATORS_V2B[qlId];
  if (!generator) throw new Error(`Unknown GEO-RIV-001 CP001 V2B QL ${qlId}`);
  if (!seed.trim()) throw new Error("GEO-RIV-001 CP001 V2B review generation requires an explicit seed");
  return generator(seed);
}
