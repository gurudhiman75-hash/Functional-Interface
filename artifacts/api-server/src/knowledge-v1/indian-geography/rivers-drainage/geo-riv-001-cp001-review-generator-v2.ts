import { deterministicPick, deterministicShuffle } from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import type { KnowledgeFact, KnowledgeV1Difficulty } from "../../types";
import { GEO_RIV_001_CP001_REVIEWABLE_FACTS_V2 } from "./geo-riv-001-cp001-editorial-review-v2";
import type { GeoRiv001Cp001ReviewQuestion } from "./geo-riv-001-cp001-review-types";

const CHAPTER_ID = "GEO-RIV-001" as const;
const CP_ID = "GEO-RIV-001-CP001" as const;

const QL_NAMES: Record<string, string> = {
  "GEO-RIV-001-QL-001": "Definition recall",
  "GEO-RIV-001-QL-002": "Reverse definition",
  "GEO-RIV-001-QL-003": "Drainage pattern identification",
  "GEO-RIV-001-QL-004": "Pattern-condition association",
  "GEO-RIV-001-QL-005": "River classification",
  "GEO-RIV-001-QL-006": "Correct pair",
  "GEO-RIV-001-QL-007": "Incorrect pair / exception",
  "GEO-RIV-001-QL-008": "Statement pair",
  "GEO-RIV-001-QL-009": "Multi-statement classification",
};

function relationFacts(relation: string) {
  return GEO_RIV_001_CP001_REVIEWABLE_FACTS_V2.filter(
    (fact) => fact.relation === relation && fact.review.status === "REVIEW_REQUIRED",
  );
}

function entityLabel(fact: KnowledgeFact) {
  return fact.entity.label.en;
}

function textValue(fact: KnowledgeFact) {
  if (fact.value.kind !== "text") throw new Error(`${fact.factId} is not a text fact`);
  return fact.value.text.en;
}

function entityRefValue(fact: KnowledgeFact) {
  if (fact.value.kind !== "entity_ref") {
    throw new Error(`${fact.factId} is not an entity-ref fact`);
  }
  return fact.value.label.en;
}

function entityRefId(fact: KnowledgeFact) {
  if (fact.value.kind !== "entity_ref") {
    throw new Error(`${fact.factId} is not an entity-ref fact`);
  }
  return fact.value.entityId;
}

function sourceIds(facts: readonly KnowledgeFact[]) {
  return [...new Set(facts.map((fact) => fact.source.sourceId))];
}

function pickThree<T>(items: readonly T[], seed: string) {
  if (items.length < 3) {
    throw new Error(`GEO-RIV-001 CP001 V2 review pool has only ${items.length} distractors`);
  }
  return deterministicShuffle(items, seed).slice(0, 3);
}

function finalize(
  qlId: string,
  seed: string,
  difficulty: KnowledgeV1Difficulty,
  stem: string,
  canonicalAnswer: string,
  wrongAnswers: readonly string[],
  explanation: string,
  facts: readonly KnowledgeFact[],
  solverAuthority: GeoRiv001Cp001ReviewQuestion["solverAuthority"] =
    "CANONICAL_FACT_RELATION",
): GeoRiv001Cp001ReviewQuestion {
  if (wrongAnswers.length !== 3) throw new Error(`${qlId} requires exactly three distractors`);
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
    questionId: `GEO-RIV-001-CP001-V2-${qlId}-${seed}`,
    chapterId: CHAPTER_ID,
    cpId: CP_ID,
    qlId,
    qlName: QL_NAMES[qlId] ?? qlId,
    difficulty,
    stem,
    options,
    correctIndex,
    canonicalAnswer,
    explanation,
    sourceIds: sourceIds(facts),
    sourceFactIds: [...new Set(facts.map((fact) => fact.factId))],
    solverAuthority,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

function conceptAndPatternFacts() {
  return [
    ...relationFacts("defined_as"),
    ...relationFacts("drainage_pattern_defined_as"),
  ];
}

export function generateGeoRiv001Ql001ReviewV2(seed: string) {
  const qlId = "GEO-RIV-001-QL-001";
  const target = deterministicPick(relationFacts("defined_as"), `${seed}:target`);
  const wrongFacts = pickThree(
    conceptAndPatternFacts().filter((fact) => fact.factId !== target.factId),
    `${seed}:wrong`,
  );
  const stem = deterministicPick(
    [
      `${textValue(target).replace(/^the /, "The ")} is known as:`,
      `Which geographical term refers to ${textValue(target)}?`,
      `Identify the term that means ${textValue(target)}.`,
    ],
    `${seed}:stem`,
  );
  return finalize(
    qlId,
    seed,
    "Easy",
    stem,
    entityLabel(target),
    wrongFacts.map(entityLabel),
    `${entityLabel(target)} is the term used for ${textValue(target)}.`,
    [target, ...wrongFacts],
  );
}

export function generateGeoRiv001Ql002ReviewV2(seed: string) {
  const qlId = "GEO-RIV-001-QL-002";
  const target = deterministicPick(relationFacts("defined_as"), `${seed}:target`);
  const wrongFacts = pickThree(
    conceptAndPatternFacts().filter((fact) => fact.factId !== target.factId),
    `${seed}:wrong`,
  );
  const stem = deterministicPick(
    [
      `Which option best defines ${entityLabel(target)}?`,
      `What is meant by ${entityLabel(target)}?`,
      `Choose the correct meaning of ${entityLabel(target)}.`,
    ],
    `${seed}:stem`,
  );
  return finalize(
    qlId,
    seed,
    "Easy",
    stem,
    textValue(target),
    wrongFacts.map(textValue),
    `${entityLabel(target)} means ${textValue(target)}. The other choices describe different drainage terms or patterns.`,
    [target, ...wrongFacts],
  );
}

const PATTERN_CONDITIONS: Record<string, string> = {
  "geo:drainage-pattern:dendritic": "streams follow the general slope and branch like the limbs of a tree",
  "geo:drainage-pattern:trellis": "main tributaries tend to run nearly parallel and smaller streams join them at about right angles",
  "geo:drainage-pattern:rectangular": "the rock is strongly jointed and river courses repeatedly bend at right angles",
  "geo:drainage-pattern:radial": "streams flow outward in different directions from a central elevated area",
};

export function generateGeoRiv001Ql003ReviewV2(seed: string) {
  const qlId = "GEO-RIV-001-QL-003";
  const patterns = relationFacts("drainage_pattern_defined_as");
  const target = deterministicPick(patterns, `${seed}:target`);
  const wrongFacts = patterns.filter((fact) => fact.factId !== target.factId);
  const stem = deterministicPick(
    [
      `Which drainage pattern matches this description: ${textValue(target)}?`,
      `Identify the drainage pattern described here: ${textValue(target)}.`,
      `The following description refers to which drainage pattern: ${textValue(target)}?`,
    ],
    `${seed}:stem`,
  );
  return finalize(
    qlId,
    seed,
    "Medium",
    stem,
    entityLabel(target),
    wrongFacts.map(entityLabel),
    `${entityLabel(target)} matches the stated branching or structural arrangement. Its defining description is: ${textValue(target)}.`,
    patterns,
  );
}

export function generateGeoRiv001Ql004ReviewV2(seed: string) {
  const qlId = "GEO-RIV-001-QL-004";
  const patterns = relationFacts("drainage_pattern_defined_as");
  const target = deterministicPick(patterns, `${seed}:target`);
  const condition = PATTERN_CONDITIONS[target.entityId];
  if (!condition) throw new Error(`Missing V2 drainage-pattern condition for ${target.entityId}`);
  const wrongFacts = patterns.filter((fact) => fact.factId !== target.factId);
  return finalize(
    qlId,
    seed,
    "Medium",
    `Which drainage pattern is most likely where ${condition}?`,
    entityLabel(target),
    wrongFacts.map(entityLabel),
    `${entityLabel(target)} is associated with this setting because ${condition}.`,
    patterns,
  );
}

function factsWithValue(relation: string, valueId: string) {
  return relationFacts(relation).filter((fact) => entityRefId(fact) === valueId);
}

function directClassificationTask(seed: string) {
  const tasks = [
    { relation: "classified_as_river_group", valueId: "geo:river-class:himalayan", label: "Himalayan river" },
    { relation: "classified_as_river_group", valueId: "geo:river-class:peninsular", label: "Peninsular river" },
    { relation: "has_flow_direction", valueId: "geo:flow-direction:west", label: "west-flowing Peninsular river" },
    { relation: "drains_into", valueId: "geo:sea:arabian-sea", label: "river that drains into the Arabian Sea" },
    { relation: "drains_into", valueId: "geo:bay:bay-of-bengal", label: "river that drains into the Bay of Bengal" },
    { relation: "has_mouth_type", valueId: "geo:mouth-type:estuary", label: "river that forms an estuary at its mouth" },
  ] as const;
  return deterministicPick(tasks, `${seed}:task`);
}

export function generateGeoRiv001Ql005ReviewV2(seed: string) {
  const qlId = "GEO-RIV-001-QL-005";
  const task = directClassificationTask(seed);
  const pool = relationFacts(task.relation);
  const matching = factsWithValue(task.relation, task.valueId);
  const nonMatching = pool.filter((fact) => entityRefId(fact) !== task.valueId);
  const target = deterministicPick(matching, `${seed}:target`);
  const wrongFacts = pickThree(nonMatching, `${seed}:wrong`);
  return finalize(
    qlId,
    seed,
    "Easy",
    `Which of the following is a ${task.label}?`,
    entityLabel(target),
    wrongFacts.map(entityLabel),
    `${entityLabel(target)} matches the required classification: ${entityRefValue(target)}. The other options belong to the contrasting relation class for this question.`,
    [target, ...wrongFacts],
    "RELATION_CLASS_COMPOSER",
  );
}

const COMPOSABLE_RELATIONS = [
  "classified_as_river_group",
  "has_flow_direction",
  "drains_into",
  "has_mouth_type",
] as const;

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
  if (relation === "has_mouth_type") return `forms an ${value.toLowerCase() === "estuary" ? "estuary" : "delta"}`;
  return value;
}

function pairText(fact: KnowledgeFact, forceWrong = false) {
  const actual = entityRefValue(fact);
  const shown = forceWrong ? oppositeValue(fact.relation, actual) : actual;
  return `${entityLabel(fact)} — ${relationDisplay(fact.relation, shown)}`;
}

export function generateGeoRiv001Ql006ReviewV2(seed: string) {
  const qlId = "GEO-RIV-001-QL-006";
  const relation = deterministicPick(COMPOSABLE_RELATIONS, `${seed}:relation`);
  const pool = relationFacts(relation);
  const target = deterministicPick(pool, `${seed}:target`);
  const wrongFacts = pickThree(pool.filter((fact) => fact.factId !== target.factId), `${seed}:wrong`);
  return finalize(
    qlId,
    seed,
    "Medium",
    "Which of the following river-association pairs is correctly matched?",
    pairText(target),
    wrongFacts.map((fact) => pairText(fact, true)),
    `${pairText(target)} is correct. Each of the other pairs reverses the reviewed relation for that river.`,
    [target, ...wrongFacts],
    "RELATION_CLASS_COMPOSER",
  );
}

export function generateGeoRiv001Ql007ReviewV2(seed: string) {
  const qlId = "GEO-RIV-001-QL-007";
  const relation = deterministicPick(COMPOSABLE_RELATIONS, `${seed}:relation`);
  const pool = relationFacts(relation);
  const falseFact = deterministicPick(pool, `${seed}:false`);
  const trueFacts = pickThree(pool.filter((fact) => fact.factId !== falseFact.factId), `${seed}:true`);
  const falsePair = pairText(falseFact, true);
  return finalize(
    qlId,
    seed,
    "Medium",
    "Which of the following river-association pairs is incorrectly matched?",
    falsePair,
    trueFacts.map((fact) => pairText(fact)),
    `${falsePair} is incorrect. The reviewed relation is ${pairText(falseFact)}. The other three pairs are correctly matched.`,
    [falseFact, ...trueFacts],
    "RELATION_CLASS_COMPOSER",
  );
}

type Statement = { text: string; truth: boolean; fact: KnowledgeFact };

function statementText(fact: KnowledgeFact, shownValue: string) {
  const river = entityLabel(fact);
  if (fact.relation === "classified_as_river_group") return `${river} is a ${shownValue}.`;
  if (fact.relation === "has_flow_direction") return `${river} is a ${shownValue.toLowerCase()} river.`;
  if (fact.relation === "drains_into") return `${river} drains into the ${shownValue}.`;
  if (fact.relation === "has_mouth_type") return `${river} forms ${shownValue === "Estuary" ? "an estuary" : "a delta"} at its mouth.`;
  throw new Error(`Unsupported statement relation ${fact.relation}`);
}

function relationStatement(fact: KnowledgeFact, truth: boolean): Statement {
  const actual = entityRefValue(fact);
  const shown = truth ? actual : oppositeValue(fact.relation, actual);
  return { text: statementText(fact, shown), truth, fact };
}

function statementFactPool() {
  return COMPOSABLE_RELATIONS.flatMap((relation) => relationFacts(relation));
}

const STATEMENT_PAIR_OPTIONS = [
  "Both Statement I and Statement II are correct",
  "Only Statement I is correct",
  "Only Statement II is correct",
  "Neither Statement I nor Statement II is correct",
] as const;

function statementPairAnswer(first: boolean, second: boolean) {
  if (first && second) return STATEMENT_PAIR_OPTIONS[0];
  if (first) return STATEMENT_PAIR_OPTIONS[1];
  if (second) return STATEMENT_PAIR_OPTIONS[2];
  return STATEMENT_PAIR_OPTIONS[3];
}

export function generateGeoRiv001Ql008ReviewV2(seed: string) {
  const qlId = "GEO-RIV-001-QL-008";
  const selected = deterministicShuffle(statementFactPool(), `${seed}:facts`).slice(0, 2);
  if (selected.length !== 2) throw new Error("GEO-RIV-001 QL-008 V2 requires two facts");
  const truthPattern = deterministicPick(
    [[true, true], [true, false], [false, true], [false, false]] as const,
    `${seed}:truth`,
  );
  const first = relationStatement(selected[0]!, truthPattern[0]);
  const second = relationStatement(selected[1]!, truthPattern[1]);
  const canonicalAnswer = statementPairAnswer(first.truth, second.truth);
  const wrongAnswers = STATEMENT_PAIR_OPTIONS.filter((option) => option !== canonicalAnswer);
  const stem = `Consider the following statements:\nI. ${first.text}\nII. ${second.text}\nWhich of the statements given above is/are correct?`;
  const explanation = [
    `Statement I is ${first.truth ? "correct" : "incorrect"}. The reviewed relation is: ${statementText(first.fact, entityRefValue(first.fact))}`,
    `Statement II is ${second.truth ? "correct" : "incorrect"}. The reviewed relation is: ${statementText(second.fact, entityRefValue(second.fact))}`,
    `Therefore, ${canonicalAnswer}.`,
  ].join(" ");
  return finalize(
    qlId,
    seed,
    "Medium",
    stem,
    canonicalAnswer,
    wrongAnswers,
    explanation,
    selected,
    "STATEMENT_COMPOSITION_VERIFIER",
  );
}

const COUNT_LABELS = ["None", "One", "Two", "Three"] as const;

export function generateGeoRiv001Ql009ReviewV2(seed: string) {
  const qlId = "GEO-RIV-001-QL-009";
  const selected = deterministicShuffle(statementFactPool(), `${seed}:facts`).slice(0, 3);
  if (selected.length !== 3) throw new Error("GEO-RIV-001 QL-009 V2 requires three facts");
  const truthPattern = deterministicPick(
    [[true, false, false], [false, true, true], [true, false, true], [true, true, true], [false, false, false]] as const,
    `${seed}:truth`,
  );
  const statements = selected.map((fact, index) => relationStatement(fact, truthPattern[index]!));
  const correctCount = statements.filter((statement) => statement.truth).length;
  const canonicalAnswer = COUNT_LABELS[correctCount]!;
  const wrongAnswers = COUNT_LABELS.filter((label) => label !== canonicalAnswer);
  const stem = [
    "Consider the following statements:",
    ...statements.map((statement, index) => `${index + 1}. ${statement.text}`),
    "How many of the statements given above are correct?",
  ].join("\n");
  const explanation = [
    ...statements.map(
      (statement, index) =>
        `Statement ${index + 1} is ${statement.truth ? "correct" : "incorrect"}. Correct relation: ${statementText(statement.fact, entityRefValue(statement.fact))}`,
    ),
    `${correctCount} of the three statements ${correctCount === 1 ? "is" : "are"} correct. Therefore, the answer is ${canonicalAnswer}.`,
  ].join(" ");
  return finalize(
    qlId,
    seed,
    "Hard",
    stem,
    canonicalAnswer,
    wrongAnswers,
    explanation,
    selected,
    "STATEMENT_COMPOSITION_VERIFIER",
  );
}

export const GEO_RIV_001_CP001_REVIEW_GENERATORS_V2: Record<
  string,
  (seed: string) => GeoRiv001Cp001ReviewQuestion
> = {
  "GEO-RIV-001-QL-001": generateGeoRiv001Ql001ReviewV2,
  "GEO-RIV-001-QL-002": generateGeoRiv001Ql002ReviewV2,
  "GEO-RIV-001-QL-003": generateGeoRiv001Ql003ReviewV2,
  "GEO-RIV-001-QL-004": generateGeoRiv001Ql004ReviewV2,
  "GEO-RIV-001-QL-005": generateGeoRiv001Ql005ReviewV2,
  "GEO-RIV-001-QL-006": generateGeoRiv001Ql006ReviewV2,
  "GEO-RIV-001-QL-007": generateGeoRiv001Ql007ReviewV2,
  "GEO-RIV-001-QL-008": generateGeoRiv001Ql008ReviewV2,
  "GEO-RIV-001-QL-009": generateGeoRiv001Ql009ReviewV2,
};

export function generateGeoRiv001Cp001ReviewV2(qlId: string, seed: string) {
  const generator = GEO_RIV_001_CP001_REVIEW_GENERATORS_V2[qlId];
  if (!generator) throw new Error(`Unknown GEO-RIV-001 CP001 V2 QL ${qlId}`);
  if (!seed.trim()) throw new Error("GEO-RIV-001 CP001 V2 review generation requires an explicit seed");
  return generator(seed);
}
