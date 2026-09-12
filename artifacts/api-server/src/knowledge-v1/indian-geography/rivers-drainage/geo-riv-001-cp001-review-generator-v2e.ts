import { deterministicPick, deterministicShuffle } from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP001_REVIEWABLE_FACTS_V2 } from "./geo-riv-001-cp001-editorial-review-v2";
import { generateGeoRiv001Cp001ReviewV2D } from "./geo-riv-001-cp001-review-generator-v2d";
import type { GeoRiv001Cp001ReviewQuestion } from "./geo-riv-001-cp001-review-types";

const FACT_BY_ID = new Map(
  GEO_RIV_001_CP001_REVIEWABLE_FACTS_V2.map((fact) => [fact.factId, fact]),
);

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

function capitalizeSentence(text: string) {
  const index = text.search(/[A-Za-z]/);
  if (index < 0) return text;
  return `${text.slice(0, index)}${text[index]!.toUpperCase()}${text.slice(index + 1)}`;
}

function sourceIds(facts: readonly KnowledgeFact[]) {
  return [...new Set(facts.map((fact) => fact.source.sourceId))];
}

function finalize(
  qlId: string,
  qlName: string,
  difficulty: GeoRiv001Cp001ReviewQuestion["difficulty"],
  seed: string,
  stem: string,
  canonicalAnswer: string,
  wrongAnswers: readonly string[],
  explanation: string,
  facts: readonly KnowledgeFact[],
  solverAuthority: GeoRiv001Cp001ReviewQuestion["solverAuthority"],
): GeoRiv001Cp001ReviewQuestion {
  if (wrongAnswers.length !== 3) throw new Error(`${qlId} V2E requires exactly three distractors`);
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
    questionId: `GEO-RIV-001-CP001-V2E-${qlId}-${seed}`,
    chapterId: "GEO-RIV-001",
    cpId: "GEO-RIV-001-CP001",
    qlId,
    qlName,
    difficulty,
    stem: capitalizeSentence(stem),
    options,
    correctIndex,
    canonicalAnswer,
    explanation: capitalizeSentence(explanation),
    sourceIds: sourceIds(facts),
    sourceFactIds: [...new Set(facts.map((fact) => fact.factId))],
    solverAuthority,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

function targetFact(question: GeoRiv001Cp001ReviewQuestion) {
  return question.sourceFactIds
    .map((factId) => FACT_BY_ID.get(factId))
    .find((fact) => fact?.entity.label.en === question.canonicalAnswer);
}

function directFactExplanation(fact: KnowledgeFact) {
  const river = entityLabel(fact);
  const value = entityRefValue(fact);
  if (fact.relation === "classified_as_river_group") {
    return `${river} is a ${value}. Therefore, ${river} is the correct option.`;
  }
  if (fact.relation === "has_flow_direction") {
    return `${river} is a ${value.toLowerCase()} river. Therefore, ${river} is the correct option.`;
  }
  if (fact.relation === "drains_into") {
    return `${river} drains into the ${value}. Therefore, ${river} is the correct option.`;
  }
  if (fact.relation === "has_mouth_type") {
    return `${river} forms ${value === "Estuary" ? "an estuary" : "a delta"} at its mouth. Therefore, ${river} is the correct option.`;
  }
  return `${river} matches the reviewed relation in the question.`;
}

function improveBaseQuestion(
  question: GeoRiv001Cp001ReviewQuestion,
  seed: string,
): GeoRiv001Cp001ReviewQuestion {
  let stem = capitalizeSentence(question.stem);
  let explanation = capitalizeSentence(question.explanation);

  if (question.qlId === "GEO-RIV-001-QL-003") {
    const fact = question.sourceFactIds
      .map((factId) => FACT_BY_ID.get(factId))
      .find((entry) => entry?.entity.label.en === question.canonicalAnswer);
    if (fact?.value.kind === "text") {
      explanation = `${question.canonicalAnswer} is correct because it is ${fact.value.text.en}.`;
    }
  }

  if (question.qlId === "GEO-RIV-001-QL-004") {
    const match = stem.match(/^Which drainage pattern is most likely where (.+)\?$/i);
    if (match?.[1]) {
      const condition = match[1];
      stem = deterministicPick(
        [
          `Which drainage pattern is most likely where ${condition}?`,
          `Identify the drainage pattern associated with a setting in which ${condition}.`,
          `A drainage network in which ${condition} is characteristic of which pattern?`,
        ],
        `${seed}:ql004-editorial-stem`,
      );
    }
  }

  if (question.qlId === "GEO-RIV-001-QL-005") {
    const fact = targetFact(question);
    if (fact) explanation = directFactExplanation(fact);
  }

  const improved = {
    ...question,
    questionId: question.questionId.replace(/CP001-V2D/g, "CP001-V2E"),
    stem: capitalizeSentence(stem),
    explanation: capitalizeSentence(explanation),
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

const RIVER_STATEMENT_RELATIONS = [
  "classified_as_river_group",
  "has_flow_direction",
  "drains_into",
  "has_mouth_type",
] as const;

function riverStatementFacts() {
  return RIVER_STATEMENT_RELATIONS.flatMap((relation) => relationFacts(relation));
}

function groupCharacteristicFacts() {
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
  if (!opposite) throw new Error(`No GEO-RIV-001 V2E opposite for ${relation}:${value}`);
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
  throw new Error(`Unsupported GEO-RIV-001 V2E statement relation ${fact.relation}`);
}

function groupStatementText(fact: KnowledgeFact) {
  const label = entityLabel(fact);
  const value = entityRefValue(fact);
  if (value === "Mostly perennial") return `${label} are mostly perennial.`;
  if (value === "Many are seasonal or strongly rain-fed") {
    return `Many ${label.toLowerCase()} are seasonal or strongly rain-fed.`;
  }
  throw new Error(`Unsupported GEO-RIV-001 V2E group characteristic ${value}`);
}

function correctRelationSentence(fact: KnowledgeFact) {
  if (fact.relation === "has_group_characteristic") return groupStatementText(fact);
  return riverStatementText(fact, true);
}

function distinctRiverFacts(count: number, seed: string) {
  const selected: KnowledgeFact[] = [];
  const entityIds = new Set<string>();
  for (const fact of deterministicShuffle(riverStatementFacts(), seed)) {
    if (entityIds.has(fact.entityId)) continue;
    entityIds.add(fact.entityId);
    selected.push(fact);
    if (selected.length === count) break;
  }
  if (selected.length !== count) {
    throw new Error(`GEO-RIV-001 V2E could select only ${selected.length}/${count} distinct river entities`);
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

export function generateGeoRiv001Ql008ReviewV2E(seed: string) {
  const qlId = "GEO-RIV-001-QL-008";
  const mode = deterministicPick(["river", "group"] as const, `${seed}:mode`);
  let statements: StatementRecord[];

  if (mode === "group") {
    const group = deterministicPick(groupCharacteristicFacts(), `${seed}:group`);
    const river = distinctRiverFacts(1, `${seed}:river`)[0]!;
    const riverTruth = deterministicPick([true, false] as const, `${seed}:river-truth`);
    statements = deterministicShuffle(
      [groupStatement(group), riverStatement(river, riverTruth)],
      `${seed}:statement-order`,
    );
  } else {
    const rivers = distinctRiverFacts(2, `${seed}:rivers`);
    const truthPattern = deterministicPick(
      [[true, true], [true, false], [false, true], [false, false]] as const,
      `${seed}:truth`,
    );
    statements = rivers.map((fact, index) => riverStatement(fact, truthPattern[index]!));
  }

  const canonicalAnswer = statementPairAnswer(statements[0]!.truth, statements[1]!.truth);
  const wrongAnswers = STATEMENT_PAIR_OPTIONS.filter((option) => option !== canonicalAnswer);
  const stem = [
    "Consider the following statements:",
    `I. ${statements[0]!.text}`,
    `II. ${statements[1]!.text}`,
    "Which of the statements given above is/are correct?",
  ].join("\n");
  const explanation = [
    `Statement I is ${statements[0]!.truth ? "correct" : "incorrect"}. Correct fact: ${correctRelationSentence(statements[0]!.fact)}`,
    `Statement II is ${statements[1]!.truth ? "correct" : "incorrect"}. Correct fact: ${correctRelationSentence(statements[1]!.fact)}`,
    `Therefore, ${canonicalAnswer}.`,
  ].join(" ");
  return finalize(
    qlId,
    "Statement pair",
    "Medium",
    seed,
    stem,
    canonicalAnswer,
    wrongAnswers,
    explanation,
    statements.map((statement) => statement.fact),
    "STATEMENT_COMPOSITION_VERIFIER",
  );
}

const COUNT_LABELS = ["None", "One", "Two", "Three"] as const;

export function generateGeoRiv001Ql009ReviewV2E(seed: string) {
  const qlId = "GEO-RIV-001-QL-009";
  const mode = deterministicPick(["river", "group"] as const, `${seed}:mode`);
  let statements: StatementRecord[];

  if (mode === "group") {
    const group = deterministicPick(groupCharacteristicFacts(), `${seed}:group`);
    const rivers = distinctRiverFacts(2, `${seed}:rivers`);
    const truthPattern = deterministicPick(
      [[true, true], [true, false], [false, true], [false, false]] as const,
      `${seed}:truth`,
    );
    statements = deterministicShuffle(
      [
        groupStatement(group),
        riverStatement(rivers[0]!, truthPattern[0]),
        riverStatement(rivers[1]!, truthPattern[1]),
      ],
      `${seed}:statement-order`,
    );
  } else {
    const rivers = distinctRiverFacts(3, `${seed}:rivers`);
    const truthPattern = deterministicPick(
      [
        [true, false, false],
        [false, true, true],
        [true, false, true],
        [true, true, true],
        [false, false, false],
      ] as const,
      `${seed}:truth`,
    );
    statements = rivers.map((fact, index) => riverStatement(fact, truthPattern[index]!));
  }

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
        `Statement ${index + 1} is ${statement.truth ? "correct" : "incorrect"}. Correct fact: ${correctRelationSentence(statement.fact)}`,
    ),
    `${correctCount} of the three statements ${correctCount === 1 ? "is" : "are"} correct. Therefore, the answer is ${canonicalAnswer}.`,
  ].join(" ");
  return finalize(
    qlId,
    "Multi-statement classification",
    "Hard",
    seed,
    stem,
    canonicalAnswer,
    wrongAnswers,
    explanation,
    statements.map((statement) => statement.fact),
    "STATEMENT_COMPOSITION_VERIFIER",
  );
}

export function generateGeoRiv001Cp001ReviewV2E(qlId: string, seed: string) {
  if (!seed.trim()) throw new Error("GEO-RIV-001 CP001 V2E review generation requires an explicit seed");
  if (qlId === "GEO-RIV-001-QL-008") return generateGeoRiv001Ql008ReviewV2E(seed);
  if (qlId === "GEO-RIV-001-QL-009") return generateGeoRiv001Ql009ReviewV2E(seed);
  return improveBaseQuestion(generateGeoRiv001Cp001ReviewV2D(qlId, seed), seed);
}
