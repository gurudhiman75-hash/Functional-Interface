import { deterministicShuffle, hashKnowledgeSeed } from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP001_REVIEWABLE_FACTS_V2 } from "./geo-riv-001-cp001-editorial-review-v2";
import { generateGeoRiv001Cp001ReviewV2E } from "./geo-riv-001-cp001-review-generator-v2e";
import type { GeoRiv001Cp001ReviewQuestion } from "./geo-riv-001-cp001-review-types";

function mixedPick<T>(items: readonly T[], seed: string): T {
  if (items.length === 0) throw new Error("GEO-RIV-001 V2F cannot pick from an empty pool");
  const hash = hashKnowledgeSeed(seed);
  const mixed = (hash ^ (hash >>> 16)) >>> 0;
  return items[mixed % items.length]!;
}

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

function sourceIds(facts: readonly KnowledgeFact[]) {
  return [...new Set(facts.map((fact) => fact.source.sourceId))];
}

function normalizeBaseQuestion(question: GeoRiv001Cp001ReviewQuestion) {
  const normalize = (text: string) =>
    text
      .replace(/\ba east-flowing\b/gi, "an east-flowing")
      .replace(/Correct fact:\s*/g, "");
  const options = question.options.map(normalize);
  const canonicalAnswer = normalize(question.canonicalAnswer);
  if (options[question.correctIndex] !== canonicalAnswer) {
    throw new Error(`GEO-RIV-001 V2F normalization changed answer alignment for ${question.questionId}`);
  }
  const normalized = {
    ...question,
    questionId: question.questionId.replace(/CP001-V2E/g, "CP001-V2F"),
    stem: normalize(question.stem),
    options,
    canonicalAnswer,
    explanation: normalize(question.explanation),
  };
  assertKnowledgeQuestionValid({
    stem: normalized.stem,
    explanation: normalized.explanation,
    options: normalized.options,
    correctIndex: normalized.correctIndex,
    canonicalAnswer: normalized.canonicalAnswer,
  });
  return normalized;
}

const RIVER_RELATIONS = [
  "classified_as_river_group",
  "has_flow_direction",
  "drains_into",
  "has_mouth_type",
] as const;

function riverFacts() {
  return RIVER_RELATIONS.flatMap((relation) => relationFacts(relation));
}

function groupFacts() {
  return relationFacts("has_group_characteristic");
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
  const opposite = opposites[relation]?.[value];
  if (!opposite) throw new Error(`No GEO-RIV-001 V2F opposite for ${relation}:${value}`);
  return opposite;
}

function riverStatementText(fact: KnowledgeFact, truth: boolean) {
  const river = entityLabel(fact);
  const actual = entityRefValue(fact);
  const shown = truth ? actual : oppositeValue(fact.relation, actual);
  if (fact.relation === "classified_as_river_group") return `${river} is a ${shown}.`;
  if (fact.relation === "has_flow_direction") {
    return `${river} is ${shown === "East-flowing" ? "an" : "a"} ${shown.toLowerCase()} river.`;
  }
  if (fact.relation === "drains_into") return `${river} drains into the ${shown}.`;
  if (fact.relation === "has_mouth_type") {
    return `${river} forms ${shown === "Estuary" ? "an estuary" : "a delta"} at its mouth.`;
  }
  throw new Error(`Unsupported GEO-RIV-001 V2F statement relation ${fact.relation}`);
}

function groupStatementText(fact: KnowledgeFact) {
  const value = entityRefValue(fact);
  if (value === "Mostly perennial") return `${entityLabel(fact)} are mostly perennial.`;
  if (value === "Many are seasonal or strongly rain-fed") {
    return `Many ${entityLabel(fact).toLowerCase()} are seasonal or strongly rain-fed.`;
  }
  throw new Error(`Unsupported GEO-RIV-001 V2F group characteristic ${value}`);
}

function correctSentence(fact: KnowledgeFact) {
  return fact.relation === "has_group_characteristic"
    ? groupStatementText(fact)
    : riverStatementText(fact, true);
}

function distinctRiverFacts(count: number, seed: string) {
  const selected: KnowledgeFact[] = [];
  const seenEntities = new Set<string>();
  for (const fact of deterministicShuffle(riverFacts(), seed)) {
    if (seenEntities.has(fact.entityId)) continue;
    seenEntities.add(fact.entityId);
    selected.push(fact);
    if (selected.length === count) break;
  }
  if (selected.length !== count) {
    throw new Error(`GEO-RIV-001 V2F selected ${selected.length}/${count} distinct river entities`);
  }
  return selected;
}

type StatementRecord = {
  fact: KnowledgeFact;
  text: string;
  truth: boolean;
};

function riverStatement(fact: KnowledgeFact, truth: boolean): StatementRecord {
  return { fact, text: riverStatementText(fact, truth), truth };
}

function groupStatement(fact: KnowledgeFact): StatementRecord {
  return { fact, text: groupStatementText(fact), truth: true };
}

function finalizeStatements(
  qlId: string,
  qlName: string,
  difficulty: GeoRiv001Cp001ReviewQuestion["difficulty"],
  seed: string,
  stem: string,
  canonicalAnswer: string,
  wrongAnswers: readonly string[],
  explanation: string,
  statements: readonly StatementRecord[],
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
  const facts = statements.map((statement) => statement.fact);
  return {
    questionId: `GEO-RIV-001-CP001-V2F-${qlId}-${seed}`,
    chapterId: "GEO-RIV-001",
    cpId: "GEO-RIV-001-CP001",
    qlId,
    qlName,
    difficulty,
    stem,
    options,
    correctIndex,
    canonicalAnswer,
    explanation,
    sourceIds: sourceIds(facts),
    sourceFactIds: [...new Set(facts.map((fact) => fact.factId))],
    solverAuthority: "STATEMENT_COMPOSITION_VERIFIER",
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

const PAIR_OPTIONS = [
  "Both Statement I and Statement II are correct",
  "Only Statement I is correct",
  "Only Statement II is correct",
  "Neither Statement I nor Statement II is correct",
] as const;

function pairAnswer(first: boolean, second: boolean) {
  if (first && second) return PAIR_OPTIONS[0];
  if (first) return PAIR_OPTIONS[1];
  if (second) return PAIR_OPTIONS[2];
  return PAIR_OPTIONS[3];
}

export function generateGeoRiv001Ql008ReviewV2F(seed: string) {
  const mode = mixedPick(["river", "group"] as const, `${seed}:mode`);
  let statements: StatementRecord[];

  if (mode === "group") {
    const group = mixedPick(groupFacts(), `${seed}:group`);
    const river = distinctRiverFacts(1, `${seed}:river`)[0]!;
    const truth = mixedPick([true, false] as const, `${seed}:river-truth`);
    statements = deterministicShuffle(
      [groupStatement(group), riverStatement(river, truth)],
      `${seed}:statement-order`,
    );
  } else {
    const facts = distinctRiverFacts(2, `${seed}:rivers`);
    const truth = mixedPick(
      [[true, true], [true, false], [false, true], [false, false]] as const,
      `${seed}:truth`,
    );
    statements = facts.map((fact, index) => riverStatement(fact, truth[index]!));
  }

  const canonicalAnswer = pairAnswer(statements[0]!.truth, statements[1]!.truth);
  const wrongAnswers = PAIR_OPTIONS.filter((option) => option !== canonicalAnswer);
  const stem = [
    "Consider the following statements:",
    `I. ${statements[0]!.text}`,
    `II. ${statements[1]!.text}`,
    "Which of the statements given above is/are correct?",
  ].join("\n");
  const explanation = [
    `Statement I is ${statements[0]!.truth ? "correct" : "incorrect"}. ${correctSentence(statements[0]!.fact)}`,
    `Statement II is ${statements[1]!.truth ? "correct" : "incorrect"}. ${correctSentence(statements[1]!.fact)}`,
    `Therefore, ${canonicalAnswer}.`,
  ].join(" ");
  return finalizeStatements(
    "GEO-RIV-001-QL-008",
    "Statement pair",
    "Medium",
    seed,
    stem,
    canonicalAnswer,
    wrongAnswers,
    explanation,
    statements,
  );
}

const COUNT_OPTIONS = ["None", "One", "Two", "Three"] as const;

export function generateGeoRiv001Ql009ReviewV2F(seed: string) {
  const mode = mixedPick(["river", "group"] as const, `${seed}:mode`);
  let statements: StatementRecord[];

  if (mode === "group") {
    const group = mixedPick(groupFacts(), `${seed}:group`);
    const facts = distinctRiverFacts(2, `${seed}:rivers`);
    const truth = mixedPick(
      [[true, true], [true, false], [false, true], [false, false]] as const,
      `${seed}:truth`,
    );
    statements = deterministicShuffle(
      [
        groupStatement(group),
        riverStatement(facts[0]!, truth[0]),
        riverStatement(facts[1]!, truth[1]),
      ],
      `${seed}:statement-order`,
    );
  } else {
    const facts = distinctRiverFacts(3, `${seed}:rivers`);
    const truth = mixedPick(
      [
        [true, false, false],
        [false, true, true],
        [true, false, true],
        [true, true, true],
        [false, false, false],
      ] as const,
      `${seed}:truth`,
    );
    statements = facts.map((fact, index) => riverStatement(fact, truth[index]!));
  }

  const correctCount = statements.filter((statement) => statement.truth).length;
  const canonicalAnswer = COUNT_OPTIONS[correctCount]!;
  const wrongAnswers = COUNT_OPTIONS.filter((option) => option !== canonicalAnswer);
  const stem = [
    "Consider the following statements:",
    ...statements.map((statement, index) => `${index + 1}. ${statement.text}`),
    "How many of the statements given above are correct?",
  ].join("\n");
  const explanation = [
    ...statements.map(
      (statement, index) =>
        `Statement ${index + 1} is ${statement.truth ? "correct" : "incorrect"}. ${correctSentence(statement.fact)}`,
    ),
    `${correctCount} of the three statements ${correctCount === 1 ? "is" : "are"} correct. Therefore, the answer is ${canonicalAnswer}.`,
  ].join(" ");
  return finalizeStatements(
    "GEO-RIV-001-QL-009",
    "Multi-statement classification",
    "Hard",
    seed,
    stem,
    canonicalAnswer,
    wrongAnswers,
    explanation,
    statements,
  );
}

export function generateGeoRiv001Cp001ReviewV2F(qlId: string, seed: string) {
  if (!seed.trim()) throw new Error("GEO-RIV-001 CP001 V2F review generation requires an explicit seed");
  if (qlId === "GEO-RIV-001-QL-008") return generateGeoRiv001Ql008ReviewV2F(seed);
  if (qlId === "GEO-RIV-001-QL-009") return generateGeoRiv001Ql009ReviewV2F(seed);
  return normalizeBaseQuestion(generateGeoRiv001Cp001ReviewV2E(qlId, seed));
}
