import { deterministicPick, deterministicShuffle } from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import type { KnowledgeFact, KnowledgeV1Difficulty } from "../../types";
import { GEO_RIV_001_CP001_REVIEWABLE_FACTS } from "./geo-riv-001-cp001-editorial-review";
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
  return GEO_RIV_001_CP001_REVIEWABLE_FACTS.filter(
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

function sourceIds(facts: readonly KnowledgeFact[]) {
  return [...new Set(facts.map((fact) => fact.source.sourceId))];
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
  if (wrongAnswers.length !== 3) {
    throw new Error(`${qlId} requires exactly three distractors`);
  }
  const optionRecords = deterministicShuffle(
    [
      { text: canonicalAnswer, correct: true },
      ...wrongAnswers.map((text) => ({ text, correct: false })),
    ],
    `${seed}:${qlId}:options`,
  );
  const options = optionRecords.map((entry) => entry.text);
  const correctIndex = optionRecords.findIndex((entry) => entry.correct);
  assertKnowledgeQuestionValid({
    stem,
    explanation,
    options,
    correctIndex,
    canonicalAnswer,
  });

  return {
    questionId: `GEO-RIV-001-CP001-REVIEW-${qlId}-${seed}`,
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

function pickThree<T>(items: readonly T[], seed: string) {
  if (items.length < 3) {
    throw new Error(`GEO-RIV-001 CP001 review pool has only ${items.length} distractors`);
  }
  return deterministicShuffle(items, seed).slice(0, 3);
}

function conceptAndPatternFacts() {
  return [
    ...relationFacts("defined_as"),
    ...relationFacts("drainage_pattern_defined_as"),
  ];
}

export function generateGeoRiv001Ql001Review(seed: string) {
  const qlId = "GEO-RIV-001-QL-001";
  const concepts = relationFacts("defined_as");
  const target = deterministicPick(concepts, `${seed}:target`);
  const wrongFacts = pickThree(
    conceptAndPatternFacts().filter((fact) => fact.factId !== target.factId),
    `${seed}:wrong`,
  );
  const stem = deterministicPick(
    [
      `Which term is correctly defined as ${textValue(target)}?`,
      `Identify the geographical term that means ${textValue(target)}.`,
      `Which of the following refers to ${textValue(target)}?`,
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
    `${entityLabel(target)} means ${textValue(target)}. Therefore, ${entityLabel(target)} is the correct term.`,
    [target, ...wrongFacts],
  );
}

export function generateGeoRiv001Ql002Review(seed: string) {
  const qlId = "GEO-RIV-001-QL-002";
  const concepts = relationFacts("defined_as");
  const target = deterministicPick(concepts, `${seed}:target`);
  const wrongFacts = pickThree(
    conceptAndPatternFacts().filter((fact) => fact.factId !== target.factId),
    `${seed}:wrong`,
  );
  const stem = deterministicPick(
    [
      `Which option best defines ${entityLabel(target)}?`,
      `What is meant by ${entityLabel(target)}?`,
      `Choose the correct definition of ${entityLabel(target)}.`,
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
    `${entityLabel(target)} is ${textValue(target)}. The other options describe different drainage concepts or patterns.`,
    [target, ...wrongFacts],
  );
}

export function generateGeoRiv001Ql003Review(seed: string) {
  const qlId = "GEO-RIV-001-QL-003";
  const patterns = relationFacts("drainage_pattern_defined_as");
  const target = deterministicPick(patterns, `${seed}:target`);
  const wrongFacts = patterns.filter((fact) => fact.factId !== target.factId);
  if (wrongFacts.length !== 3) {
    throw new Error("GEO-RIV-001 QL-003 requires exactly four reviewed drainage patterns");
  }
  const stem = deterministicPick(
    [
      `Which drainage pattern is described as ${textValue(target)}?`,
      `Identify the drainage pattern: ${textValue(target)}.`,
      `The description '${textValue(target)}' refers to which drainage pattern?`,
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
    `${entityLabel(target)} is the pattern in which ${textValue(target)}.`,
    patterns,
  );
}

const PATTERN_CONDITIONS: Record<string, string> = {
  "geo:drainage-pattern:dendritic":
    "streams follow the general slope and branch in a tree-like form",
  "geo:drainage-pattern:trellis":
    "primary tributaries run nearly parallel and secondary tributaries join them at approximately right angles",
  "geo:drainage-pattern:rectangular":
    "the terrain is strongly jointed and river courses show frequent right-angle bends",
  "geo:drainage-pattern:radial":
    "streams flow outward in different directions from a central hill, peak or dome",
};

export function generateGeoRiv001Ql004Review(seed: string) {
  const qlId = "GEO-RIV-001-QL-004";
  const patterns = relationFacts("drainage_pattern_defined_as");
  const target = deterministicPick(patterns, `${seed}:target`);
  const condition = PATTERN_CONDITIONS[target.entityId];
  if (!condition) throw new Error(`Missing drainage-pattern condition for ${target.entityId}`);
  const wrongFacts = patterns.filter((fact) => fact.factId !== target.factId);
  return finalize(
    qlId,
    seed,
    "Medium",
    `Which drainage pattern is most closely associated with a situation where ${condition}?`,
    entityLabel(target),
    wrongFacts.map(entityLabel),
    `${entityLabel(target)} matches this condition: ${condition}.`,
    patterns,
  );
}

function classificationFacts() {
  return relationFacts("classified_as_river_group");
}

function classId(fact: KnowledgeFact) {
  if (fact.value.kind !== "entity_ref") throw new Error(`${fact.factId} is not classification data`);
  return fact.value.entityId;
}

function oppositeClassLabel(fact: KnowledgeFact) {
  return entityRefValue(fact) === "Himalayan river"
    ? "Peninsular river"
    : "Himalayan river";
}

export function generateGeoRiv001Ql005Review(seed: string) {
  const qlId = "GEO-RIV-001-QL-005";
  const pool = classificationFacts();
  const requestedClass = deterministicPick(
    ["geo:river-class:himalayan", "geo:river-class:peninsular"],
    `${seed}:class`,
  );
  const matching = pool.filter((fact) => classId(fact) === requestedClass);
  const nonMatching = pool.filter((fact) => classId(fact) !== requestedClass);
  const target = deterministicPick(matching, `${seed}:target`);
  const wrongFacts = pickThree(nonMatching, `${seed}:wrong`);
  const label = entityRefValue(target);
  return finalize(
    qlId,
    seed,
    "Medium",
    `Which of the following is a ${label}?`,
    entityLabel(target),
    wrongFacts.map(entityLabel),
    `${entityLabel(target)} is classified as a ${label}. The other rivers in the options belong to the other major river group.`,
    [target, ...wrongFacts],
    "RELATION_CLASS_COMPOSER",
  );
}

function pairText(fact: KnowledgeFact, forcedClass?: string) {
  return `${entityLabel(fact)} — ${forcedClass ?? entityRefValue(fact)}`;
}

export function generateGeoRiv001Ql006Review(seed: string) {
  const qlId = "GEO-RIV-001-QL-006";
  const pool = classificationFacts();
  const target = deterministicPick(pool, `${seed}:target`);
  const wrongFacts = pickThree(
    pool.filter((fact) => fact.factId !== target.factId),
    `${seed}:wrong`,
  );
  return finalize(
    qlId,
    seed,
    "Medium",
    "Which of the following river-classification pairs is correct?",
    pairText(target),
    wrongFacts.map((fact) => pairText(fact, oppositeClassLabel(fact))),
    `${entityLabel(target)} is correctly classified as a ${entityRefValue(target)}. The other pairs deliberately place each river in the opposite major group.`,
    [target, ...wrongFacts],
    "RELATION_CLASS_COMPOSER",
  );
}

export function generateGeoRiv001Ql007Review(seed: string) {
  const qlId = "GEO-RIV-001-QL-007";
  const pool = classificationFacts();
  const falseFact = deterministicPick(pool, `${seed}:false`);
  const trueFacts = pickThree(
    pool.filter((fact) => fact.factId !== falseFact.factId),
    `${seed}:true`,
  );
  const falsePair = pairText(falseFact, oppositeClassLabel(falseFact));
  return finalize(
    qlId,
    seed,
    "Medium",
    "Which of the following river-classification pairs is incorrect?",
    falsePair,
    trueFacts.map(pairText),
    `${falsePair} is incorrect. ${entityLabel(falseFact)} belongs to the ${entityRefValue(falseFact)} group. The other three pairs are correctly classified.`,
    [falseFact, ...trueFacts],
    "RELATION_CLASS_COMPOSER",
  );
}

type Statement = {
  text: string;
  truth: boolean;
  fact: KnowledgeFact;
};

function classificationStatement(fact: KnowledgeFact, truth: boolean): Statement {
  const statedClass = truth ? entityRefValue(fact) : oppositeClassLabel(fact);
  return {
    text: `${entityLabel(fact)} is a ${statedClass}.`,
    truth,
    fact,
  };
}

function statementPairAnswer(first: boolean, second: boolean) {
  if (first && second) return "Both Statement I and Statement II are correct";
  if (first) return "Only Statement I is correct";
  if (second) return "Only Statement II is correct";
  return "Neither Statement I nor Statement II is correct";
}

const STATEMENT_PAIR_OPTIONS = [
  "Both Statement I and Statement II are correct",
  "Only Statement I is correct",
  "Only Statement II is correct",
  "Neither Statement I nor Statement II is correct",
] as const;

export function generateGeoRiv001Ql008Review(seed: string) {
  const qlId = "GEO-RIV-001-QL-008";
  const selected = deterministicShuffle(classificationFacts(), `${seed}:facts`).slice(0, 2);
  if (selected.length !== 2) throw new Error("GEO-RIV-001 QL-008 requires two facts");
  const truthPattern = deterministicPick(
    [
      [true, true],
      [true, false],
      [false, true],
      [false, false],
    ] as const,
    `${seed}:truth`,
  );
  const first = classificationStatement(selected[0]!, truthPattern[0]);
  const second = classificationStatement(selected[1]!, truthPattern[1]);
  const canonicalAnswer = statementPairAnswer(first.truth, second.truth);
  const wrongAnswers = STATEMENT_PAIR_OPTIONS.filter((option) => option !== canonicalAnswer);
  const stem = `Consider the following statements:\nI. ${first.text}\nII. ${second.text}\nWhich of the statements given above is/are correct?`;
  const explanation = [
    `Statement I is ${first.truth ? "correct" : "incorrect"}: ${entityLabel(first.fact)} is a ${entityRefValue(first.fact)}.`,
    `Statement II is ${second.truth ? "correct" : "incorrect"}: ${entityLabel(second.fact)} is a ${entityRefValue(second.fact)}.`,
    `Therefore, ${canonicalAnswer}.`,
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

const COUNT_LABELS = ["None", "One", "Two", "Three"] as const;

export function generateGeoRiv001Ql009Review(seed: string) {
  const qlId = "GEO-RIV-001-QL-009";
  const selected = deterministicShuffle(classificationFacts(), `${seed}:facts`).slice(0, 3);
  if (selected.length !== 3) throw new Error("GEO-RIV-001 QL-009 requires three facts");
  const truthPatterns = [
    [true, false, false],
    [false, true, true],
    [true, false, true],
    [true, true, true],
    [false, false, false],
  ] as const;
  const truthPattern = deterministicPick(truthPatterns, `${seed}:truth`);
  const statements = selected.map((fact, index) =>
    classificationStatement(fact, truthPattern[index]!),
  );
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
        `Statement ${index + 1} is ${statement.truth ? "correct" : "incorrect"}: ${entityLabel(statement.fact)} is a ${entityRefValue(statement.fact)}.`,
    ),
    `Hence, ${canonicalAnswer.toLowerCase()} of the three statements are correct.`,
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

export const GEO_RIV_001_CP001_REVIEW_GENERATORS: Record<
  string,
  (seed: string) => GeoRiv001Cp001ReviewQuestion
> = {
  "GEO-RIV-001-QL-001": generateGeoRiv001Ql001Review,
  "GEO-RIV-001-QL-002": generateGeoRiv001Ql002Review,
  "GEO-RIV-001-QL-003": generateGeoRiv001Ql003Review,
  "GEO-RIV-001-QL-004": generateGeoRiv001Ql004Review,
  "GEO-RIV-001-QL-005": generateGeoRiv001Ql005Review,
  "GEO-RIV-001-QL-006": generateGeoRiv001Ql006Review,
  "GEO-RIV-001-QL-007": generateGeoRiv001Ql007Review,
  "GEO-RIV-001-QL-008": generateGeoRiv001Ql008Review,
  "GEO-RIV-001-QL-009": generateGeoRiv001Ql009Review,
};

export function generateGeoRiv001Cp001Review(qlId: string, seed: string) {
  if (!seed.trim()) throw new Error("GEO-RIV-001 review generation requires a deterministic seed");
  const generator = GEO_RIV_001_CP001_REVIEW_GENERATORS[qlId];
  if (!generator) throw new Error(`Unknown GEO-RIV-001 CP001 QL ${qlId}`);
  return generator(seed);
}
