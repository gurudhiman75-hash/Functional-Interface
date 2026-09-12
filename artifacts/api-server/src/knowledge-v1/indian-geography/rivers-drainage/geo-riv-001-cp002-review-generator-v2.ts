import {
  deterministicPick,
  deterministicShuffle,
} from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp002-editorial-review-v1";
import { generateGeoRiv001Cp002ReviewV1 } from "./geo-riv-001-cp002-review-generator-v1";
import type { GeoRiv001Cp002ReviewQuestion } from "./geo-riv-001-cp002-review-types";

const FACTS = GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1;
const SOURCE_RELATIONS = new Set(["originates_from", "source_region", "source_area"]);
const SOURCE_FACTS = FACTS.filter((fact) => SOURCE_RELATIONS.has(fact.relation));
const PARENT_OPTIONS = ["Indus", "Jhelum", "Chenab", "Ravi", "Satluj"];

function valueText(fact: KnowledgeFact) {
  if (fact.value.kind === "entity_ref") return fact.value.label.en;
  if (fact.value.kind === "text") return fact.value.text.en;
  throw new Error(`${fact.factId} has unsupported CP002 V2 value kind`);
}

function sourceIds(facts: readonly KnowledgeFact[]) {
  return [...new Set(facts.map((fact) => fact.source.sourceId))];
}

function unique<T>(items: readonly T[]) {
  return [...new Set(items)];
}

function isTrueSourceValue(entityId: string, value: string) {
  return SOURCE_FACTS.some(
    (fact) => fact.entityId === entityId && valueText(fact) === value,
  );
}

function sourceExplanation(fact: KnowledgeFact) {
  const river = fact.entity.label.en;
  const value = valueText(fact);
  return fact.relation === "originates_from"
    ? `${river} originates from ${value}.`
    : `The source of ${river} is associated with ${value}.`;
}

function optionsFromPool(correct: string, pool: readonly string[], seed: string) {
  const distractors = deterministicShuffle(
    unique(pool.filter((value) => value !== correct)),
    `${seed}:distractors`,
  ).slice(0, 3);
  if (distractors.length !== 3) throw new Error(`CP002 V2 needs three distractors for ${correct}`);
  const records = deterministicShuffle(
    [
      { text: correct, correct: true },
      ...distractors.map((text) => ({ text, correct: false })),
    ],
    `${seed}:options`,
  );
  return {
    options: records.map((record) => record.text),
    correctIndex: records.findIndex((record) => record.correct),
  };
}

function finalize(args: {
  qlId: string;
  qlName: string;
  difficulty: GeoRiv001Cp002ReviewQuestion["difficulty"];
  seed: string;
  stem: string;
  canonicalAnswer: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  facts: readonly KnowledgeFact[];
  solverAuthority: GeoRiv001Cp002ReviewQuestion["solverAuthority"];
}): GeoRiv001Cp002ReviewQuestion {
  assertKnowledgeQuestionValid({
    stem: args.stem,
    explanation: args.explanation,
    options: args.options,
    correctIndex: args.correctIndex,
    canonicalAnswer: args.canonicalAnswer,
  });
  return {
    questionId: `GEO-RIV-001-CP002-V2-${args.qlId}-${args.seed}`,
    chapterId: "GEO-RIV-001",
    cpId: "GEO-RIV-001-CP002",
    qlId: args.qlId,
    qlName: args.qlName,
    difficulty: args.difficulty,
    stem: args.stem,
    options: args.options,
    correctIndex: args.correctIndex,
    canonicalAnswer: args.canonicalAnswer,
    explanation: args.explanation,
    sourceIds: sourceIds(args.facts),
    sourceFactIds: unique(args.facts.map((fact) => fact.factId)),
    solverAuthority: args.solverAuthority,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generateGeoRiv001Cp002Ql010V2(seed: string) {
  const fact = deterministicPick(SOURCE_FACTS, `${seed}:source`);
  const correct = valueText(fact);
  const safePool = SOURCE_FACTS
    .map(valueText)
    .filter((value) => value === correct || !isTrueSourceValue(fact.entityId, value));
  const optionData = optionsFromPool(correct, safePool, `${seed}:ql010`);
  return finalize({
    qlId: "GEO-RIV-001-QL-010",
    qlName: "Direct river association",
    difficulty: "Easy",
    seed,
    stem: `Which of the following is correctly associated with the source of the ${fact.entity.label.en} River?`,
    canonicalAnswer: correct,
    ...optionData,
    explanation: sourceExplanation(fact),
    facts: [fact],
    solverAuthority: "CANONICAL_FACT_RELATION",
  });
}

const TRIBUTARY_FACTS = FACTS.filter((fact) =>
  ["main_tributary_of", "tributary_of", "headstream_of"].includes(fact.relation),
);

export function generateGeoRiv001Cp002Ql012V2(seed: string) {
  const fact = deterministicPick(TRIBUTARY_FACTS, `${seed}:fact`);
  const answer = valueText(fact);
  let stem: string;
  let explanation: string;
  if (fact.relation === "main_tributary_of") {
    stem = `${fact.entity.label.en} is one of the five main tributaries of which major river system?`;
    explanation = `${fact.entity.label.en} is listed among the five main tributaries of the Indus River.`;
  } else if (fact.relation === "headstream_of") {
    stem = `${fact.entity.label.en} is one of the headstreams that form which river?`;
    explanation = `${fact.entity.label.en} joins the other headstream at Tandi to form the Chenab River.`;
  } else {
    stem = `${fact.entity.label.en} is a tributary of which river?`;
    explanation = `${fact.entity.label.en} is a tributary of the ${answer} River.`;
  }
  const optionData = optionsFromPool(answer, PARENT_OPTIONS, `${seed}:ql012`);
  return finalize({
    qlId: "GEO-RIV-001-QL-012",
    qlName: "Tributary and parent river",
    difficulty: fact.relation === "main_tributary_of" ? "Easy" : "Medium",
    seed,
    stem,
    canonicalAnswer: answer,
    ...optionData,
    explanation,
    facts: [fact],
    solverAuthority: "CANONICAL_FACT_RELATION",
  });
}

function distinctSourceFacts(count: number, seed: string) {
  const selected: KnowledgeFact[] = [];
  const entities = new Set<string>();
  const values = new Set<string>();
  for (const fact of deterministicShuffle(SOURCE_FACTS, seed)) {
    const value = valueText(fact);
    if (entities.has(fact.entityId) || values.has(value)) continue;
    entities.add(fact.entityId);
    values.add(value);
    selected.push(fact);
    if (selected.length === count) break;
  }
  if (selected.length !== count) throw new Error(`CP002 V2 needs ${count} distinct source facts`);
  return selected;
}

function wrongSourceValue(fact: KnowledgeFact, used: Set<string>, seed: string) {
  const pool = SOURCE_FACTS
    .map(valueText)
    .filter(
      (value) =>
        !used.has(value) &&
        !isTrueSourceValue(fact.entityId, value),
    );
  if (!pool.length) throw new Error(`No safe wrong source value for ${fact.factId}`);
  return deterministicPick(pool, seed);
}

function pairText(fact: KnowledgeFact, value = valueText(fact)) {
  return `${fact.entity.label.en} — ${value}`;
}

export function generateGeoRiv001Cp002Ql014V2(seed: string) {
  const facts = distinctSourceFacts(4, `${seed}:facts`);
  const targetIndex = deterministicPick([0, 1, 2, 3] as const, `${seed}:target`);
  const used = new Set<string>();
  const options = facts.map((fact, index) => {
    if (index === targetIndex) {
      const text = pairText(fact);
      used.add(valueText(fact));
      return text;
    }
    const wrong = wrongSourceValue(fact, used, `${seed}:wrong:${index}`);
    used.add(wrong);
    return pairText(fact, wrong);
  });
  const canonicalAnswer = options[targetIndex]!;
  return finalize({
    qlId: "GEO-RIV-001-QL-014",
    qlName: "Correct pair",
    difficulty: "Medium",
    seed,
    stem: "Which of the following river-source pairs is correctly matched?",
    canonicalAnswer,
    options,
    correctIndex: targetIndex,
    explanation: `${canonicalAnswer} is correctly matched. ${sourceExplanation(facts[targetIndex]!)}`,
    facts,
    solverAuthority: "RELATION_CLASS_COMPOSER",
  });
}

export function generateGeoRiv001Cp002Ql015V2(seed: string) {
  const facts = distinctSourceFacts(4, `${seed}:facts`);
  const targetIndex = deterministicPick([0, 1, 2, 3] as const, `${seed}:target`);
  const used = new Set(facts.filter((_, index) => index !== targetIndex).map(valueText));
  const wrong = wrongSourceValue(facts[targetIndex]!, used, `${seed}:wrong-target`);
  const options = facts.map((fact, index) =>
    index === targetIndex ? pairText(fact, wrong) : pairText(fact),
  );
  const canonicalAnswer = options[targetIndex]!;
  return finalize({
    qlId: "GEO-RIV-001-QL-015",
    qlName: "Incorrect pair",
    difficulty: "Medium",
    seed,
    stem: "Which of the following river-source pairs is incorrectly matched?",
    canonicalAnswer,
    options,
    correctIndex: targetIndex,
    explanation: `${canonicalAnswer} is incorrectly matched. ${sourceExplanation(facts[targetIndex]!)}`,
    facts,
    solverAuthority: "RELATION_CLASS_COMPOSER",
  });
}

const JOIN_FACTS = FACTS.filter((fact) => fact.relation === "joins_river");

export function generateGeoRiv001Cp002Ql016V2(seed: string) {
  const mode = deterministicPick(["beas-chain", "pre-panjnad-pair", "sequence", "jhelum-chain"] as const, `${seed}:mode`);
  let stem: string;
  let canonicalAnswer: string;
  let pool: string[];
  let explanation: string;
  let facts: KnowledgeFact[];

  if (mode === "beas-chain") {
    stem = "The Beas first joins which river, which later joins the Chenab?";
    canonicalAnswer = "Satluj";
    pool = ["Satluj", "Jhelum", "Ravi", "Indus", "Chenab"];
    explanation = "The Beas joins the Satluj at Harike. The Satluj later joins the Chenab at Panjnad.";
    facts = JOIN_FACTS.filter((fact) => ["Beas", "Satluj"].includes(fact.entity.label.en));
  } else if (mode === "pre-panjnad-pair") {
    stem = "Which pair of rivers joins the Chenab before Panjnad?";
    canonicalAnswer = "Jhelum and Ravi";
    pool = [
      canonicalAnswer,
      "Jhelum and Beas",
      "Ravi and Beas",
      "Beas and Satluj",
      "Jhelum and Indus",
    ];
    explanation = "The Jhelum joins the Chenab at Trimmu, and the Ravi also joins the Chenab before Panjnad. The Beas joins the Satluj instead.";
    facts = JOIN_FACTS.filter((fact) => ["Jhelum", "Ravi"].includes(fact.entity.label.en));
  } else if (mode === "jhelum-chain") {
    stem = "The Jhelum joins which river before the Satluj later joins the same river system at Panjnad?";
    canonicalAnswer = "Chenab";
    pool = ["Chenab", "Indus", "Ravi", "Beas", "Satluj"];
    explanation = "The Jhelum joins the Chenab at Trimmu. The Satluj later joins the Chenab at Panjnad.";
    facts = JOIN_FACTS.filter((fact) => ["Jhelum", "Satluj"].includes(fact.entity.label.en));
  } else {
    stem = "Which sequence correctly shows the joining relation among these rivers?";
    canonicalAnswer = "Beas → Satluj → Chenab";
    pool = [
      canonicalAnswer,
      "Beas → Ravi → Chenab",
      "Jhelum → Satluj → Chenab",
      "Ravi → Beas → Satluj",
      "Satluj → Beas → Chenab",
    ];
    explanation = "The Beas joins the Satluj, and the Satluj later joins the Chenab. Therefore, Beas → Satluj → Chenab is the correct sequence.";
    facts = JOIN_FACTS.filter((fact) => ["Beas", "Satluj"].includes(fact.entity.label.en));
  }

  const optionData = optionsFromPool(canonicalAnswer, pool, `${seed}:ql016`);
  return finalize({
    qlId: "GEO-RIV-001-QL-016",
    qlName: "Joining relation chain",
    difficulty: "Hard",
    seed,
    stem,
    canonicalAnswer,
    ...optionData,
    explanation,
    facts,
    solverAuthority: "JOIN_CHAIN_VERIFIER",
  });
}

const SAFE_STATEMENT_FACTS = FACTS.filter((fact) =>
  SOURCE_RELATIONS.has(fact.relation) ||
  ["headstream_of", "joins_river", "formed_at", "flows_through", "enters_india_via"].includes(fact.relation),
);

function statementFamily(fact: KnowledgeFact) {
  if (SOURCE_RELATIONS.has(fact.relation)) return "source";
  return fact.relation;
}

function trueFamilyValue(entityId: string, family: string, value: string) {
  return SAFE_STATEMENT_FACTS.some(
    (fact) =>
      fact.entityId === entityId &&
      statementFamily(fact) === family &&
      valueText(fact) === value,
  );
}

function familyPool(fact: KnowledgeFact) {
  const family = statementFamily(fact);
  if (family === "source") return unique(SOURCE_FACTS.map(valueText));
  if (family === "headstream_of" || family === "joins_river") return PARENT_OPTIONS;
  if (family === "formed_at") return ["Tandi", "Trimmu", "Harike", "Panjnad"];
  if (family === "flows_through") return ["Wular Lake", "Dal Lake", "Mansarovar Lake", "Pangong Lake"];
  if (family === "enters_india_via") return ["Shipkila", "Rohtang Pass", "Baralacha Pass", "Zoji La"];
  throw new Error(`No CP002 V2 family pool for ${fact.factId}`);
}

function shownValue(fact: KnowledgeFact, truth: boolean, seed: string) {
  if (truth) return valueText(fact);
  const family = statementFamily(fact);
  const pool = familyPool(fact).filter(
    (value) => !trueFamilyValue(fact.entityId, family, value),
  );
  if (!pool.length) throw new Error(`No false value for ${fact.factId}`);
  return deterministicPick(pool, seed);
}

function statementText(fact: KnowledgeFact, truth: boolean, seed: string) {
  const river = fact.entity.label.en;
  const value = shownValue(fact, truth, `${seed}:value`);
  const family = statementFamily(fact);
  if (family === "source") return `${river} has its source at or near ${value}.`;
  if (family === "headstream_of") return `${river} is a headstream of the ${value} River.`;
  if (family === "joins_river") return `${river} joins the ${value} River.`;
  if (family === "formed_at") return `${river} is formed at ${value}.`;
  if (family === "flows_through") return `${river} flows through ${value}.`;
  if (family === "enters_india_via") return `${river} enters India through ${value}.`;
  throw new Error(`Unsupported CP002 V2 statement ${fact.factId}`);
}

function distinctStatementFacts(count: number, seed: string) {
  const selected: KnowledgeFact[] = [];
  const entities = new Set<string>();
  for (const fact of deterministicShuffle(SAFE_STATEMENT_FACTS, seed)) {
    if (entities.has(fact.entityId)) continue;
    entities.add(fact.entityId);
    selected.push(fact);
    if (selected.length === count) break;
  }
  if (selected.length !== count) throw new Error(`CP002 V2 could not select ${count} statement entities`);
  return selected;
}

const PAIR_ANSWERS = [
  "Both Statement I and Statement II are correct",
  "Only Statement I is correct",
  "Only Statement II is correct",
  "Neither Statement I nor Statement II is correct",
] as const;
const COUNT_ANSWERS = ["None", "One", "Two", "Three"] as const;

function pairAnswer(first: boolean, second: boolean) {
  if (first && second) return PAIR_ANSWERS[0];
  if (first) return PAIR_ANSWERS[1];
  if (second) return PAIR_ANSWERS[2];
  return PAIR_ANSWERS[3];
}

export function generateGeoRiv001Cp002Ql017V2(seed: string) {
  const facts = distinctStatementFacts(2, `${seed}:facts`);
  const truth = deterministicPick(
    [[true, true], [true, false], [false, true], [false, false]] as const,
    `${seed}:truth`,
  );
  const text = facts.map((fact, index) => statementText(fact, truth[index]!, `${seed}:${index}`));
  const canonicalAnswer = pairAnswer(truth[0], truth[1]);
  const optionData = optionsFromPool(canonicalAnswer, PAIR_ANSWERS, `${seed}:answers`);
  const explanation = facts
    .map(
      (fact, index) =>
        `Statement ${index === 0 ? "I" : "II"} is ${truth[index] ? "correct" : "incorrect"}. ${statementText(fact, true, `${seed}:correct:${index}`)}`,
    )
    .join(" ");
  return finalize({
    qlId: "GEO-RIV-001-QL-017",
    qlName: "Statement pair",
    difficulty: "Medium",
    seed,
    stem: [
      "Consider the following statements:",
      `I. ${text[0]}`,
      `II. ${text[1]}`,
      "Which of the above statements is/are correct?",
    ].join("\n"),
    canonicalAnswer,
    ...optionData,
    explanation,
    facts,
    solverAuthority: "STATEMENT_COMPOSITION_VERIFIER",
  });
}

export function generateGeoRiv001Cp002Ql018V2(seed: string) {
  const facts = distinctStatementFacts(3, `${seed}:facts`);
  const truth = deterministicPick(
    [
      [false, false, false],
      [true, false, false],
      [true, true, false],
      [true, true, true],
      [false, true, true],
      [true, false, true],
    ] as const,
    `${seed}:truth`,
  );
  const text = facts.map((fact, index) => statementText(fact, truth[index]!, `${seed}:${index}`));
  const correctCount = truth.filter(Boolean).length;
  const canonicalAnswer = COUNT_ANSWERS[correctCount]!;
  const optionData = optionsFromPool(canonicalAnswer, COUNT_ANSWERS, `${seed}:answers`);
  const explanation = facts
    .map(
      (fact, index) =>
        `Statement ${index + 1} is ${truth[index] ? "correct" : "incorrect"}. ${statementText(fact, true, `${seed}:correct:${index}`)}`,
    )
    .join(" ");
  return finalize({
    qlId: "GEO-RIV-001-QL-018",
    qlName: "Multi-statement count",
    difficulty: "Hard",
    seed,
    stem: [
      "Consider the following statements:",
      ...text.map((statement, index) => `${index + 1}. ${statement}`),
      "How many of the above statements are correct?",
    ].join("\n"),
    canonicalAnswer,
    ...optionData,
    explanation: `${explanation} Therefore, ${correctCount} statement${correctCount === 1 ? " is" : "s are"} correct.`,
    facts,
    solverAuthority: "STATEMENT_COMPOSITION_VERIFIER",
  });
}

export function generateGeoRiv001Cp002ReviewV2(qlId: string, seed: string) {
  if (!seed.trim()) throw new Error("GEO-RIV-001 CP002 V2 review generation requires an explicit seed");
  if (qlId === "GEO-RIV-001-QL-010") return generateGeoRiv001Cp002Ql010V2(seed);
  if (qlId === "GEO-RIV-001-QL-012") return generateGeoRiv001Cp002Ql012V2(seed);
  if (qlId === "GEO-RIV-001-QL-014") return generateGeoRiv001Cp002Ql014V2(seed);
  if (qlId === "GEO-RIV-001-QL-015") return generateGeoRiv001Cp002Ql015V2(seed);
  if (qlId === "GEO-RIV-001-QL-016") return generateGeoRiv001Cp002Ql016V2(seed);
  if (qlId === "GEO-RIV-001-QL-017") return generateGeoRiv001Cp002Ql017V2(seed);
  if (qlId === "GEO-RIV-001-QL-018") return generateGeoRiv001Cp002Ql018V2(seed);
  const base = generateGeoRiv001Cp002ReviewV1(qlId, seed);
  return {
    ...base,
    questionId: base.questionId.replace(/CP002-V1/g, "CP002-V2"),
  };
}
