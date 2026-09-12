import {
  deterministicPick,
  deterministicShuffle,
} from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp002-editorial-review-v1";
import type { GeoRiv001Cp002ReviewQuestion } from "./geo-riv-001-cp002-review-types";

const FACTS = GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1;

function entityValue(fact: KnowledgeFact) {
  if (fact.value.kind !== "entity_ref") throw new Error(`${fact.factId} requires entity_ref value`);
  return fact.value.label.en;
}

function textValue(fact: KnowledgeFact) {
  if (fact.value.kind !== "text") throw new Error(`${fact.factId} requires text value`);
  return fact.value.text.en;
}

function valueText(fact: KnowledgeFact) {
  if (fact.value.kind === "entity_ref") return fact.value.label.en;
  if (fact.value.kind === "text") return fact.value.text.en;
  throw new Error(`${fact.factId} has unsupported CP002 review value kind ${fact.value.kind}`);
}

function sourceIds(facts: readonly KnowledgeFact[]) {
  return [...new Set(facts.map((fact) => fact.source.sourceId))];
}

function unique<T>(items: readonly T[]) {
  return [...new Set(items)];
}

function relationFacts(...relations: string[]) {
  const allowed = new Set(relations);
  return FACTS.filter((fact) => allowed.has(fact.relation));
}

const SOURCE_RELATIONS = new Set(["originates_from", "source_region", "source_area"]);
const SOURCE_FACTS = FACTS.filter((fact) => SOURCE_RELATIONS.has(fact.relation));
const SOURCE_VALUES = unique(SOURCE_FACTS.map(valueText));
const RIVER_LABELS = unique(
  FACTS.filter((fact) => fact.entityId.startsWith("geo:river:")).map((fact) => fact.entity.label.en),
);
const PARENT_RIVERS = ["Indus", "Jhelum", "Chenab", "Ravi", "Satluj"];
const PLACE_VALUES = unique(
  relationFacts("formed_at", "joins_river_at", "joins_parent_near").map(entityValue),
);

function answerOptions(correct: string, pool: readonly string[], seed: string) {
  const distractors = deterministicShuffle(
    unique(pool.filter((value) => value !== correct)),
    `${seed}:distractors`,
  ).slice(0, 3);
  if (distractors.length !== 3) {
    throw new Error(`CP002 requires three distractors for ${correct}`);
  }
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
  options?: string[];
  correctIndex?: number;
  explanation: string;
  facts: readonly KnowledgeFact[];
  solverAuthority: GeoRiv001Cp002ReviewQuestion["solverAuthority"];
}): GeoRiv001Cp002ReviewQuestion {
  const optionData = args.options
    ? { options: args.options, correctIndex: args.correctIndex ?? -1 }
    : answerOptions(args.canonicalAnswer, [], args.seed);
  assertKnowledgeQuestionValid({
    stem: args.stem,
    explanation: args.explanation,
    options: optionData.options,
    correctIndex: optionData.correctIndex,
    canonicalAnswer: args.canonicalAnswer,
  });
  return {
    questionId: `GEO-RIV-001-CP002-V1-${args.qlId}-${args.seed}`,
    chapterId: "GEO-RIV-001",
    cpId: "GEO-RIV-001-CP002",
    qlId: args.qlId,
    qlName: args.qlName,
    difficulty: args.difficulty,
    stem: args.stem,
    options: optionData.options,
    correctIndex: optionData.correctIndex,
    canonicalAnswer: args.canonicalAnswer,
    explanation: args.explanation,
    sourceIds: sourceIds(args.facts),
    sourceFactIds: unique(args.facts.map((fact) => fact.factId)),
    solverAuthority: args.solverAuthority,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

function finalizeWithPool(args: Omit<Parameters<typeof finalize>[0], "options" | "correctIndex"> & { pool: readonly string[] }) {
  const optionData = answerOptions(args.canonicalAnswer, args.pool, `${args.seed}:${args.qlId}`);
  return finalize({ ...args, ...optionData });
}

function sourceStem(fact: KnowledgeFact) {
  return `Which of the following is associated with the source of the ${fact.entity.label.en} River?`;
}

function sourceExplanation(fact: KnowledgeFact) {
  const river = fact.entity.label.en;
  const value = valueText(fact);
  if (fact.relation === "originates_from") return `${river} originates from ${value}.`;
  return `The source of ${river} is associated with ${value}.`;
}

export function generateGeoRiv001Cp002Ql010(seed: string) {
  const fact = deterministicPick(SOURCE_FACTS, `${seed}:source`);
  return finalizeWithPool({
    qlId: "GEO-RIV-001-QL-010",
    qlName: "Direct river association",
    difficulty: "Easy",
    seed,
    stem: sourceStem(fact),
    canonicalAnswer: valueText(fact),
    pool: SOURCE_VALUES,
    explanation: sourceExplanation(fact),
    facts: [fact],
    solverAuthority: "CANONICAL_FACT_RELATION",
  });
}

export function generateGeoRiv001Cp002Ql011(seed: string) {
  const reverseable = SOURCE_FACTS.filter((fact) => {
    const value = valueText(fact);
    return new Set(SOURCE_FACTS.filter((other) => valueText(other) === value).map((other) => other.entityId)).size === 1;
  });
  const fact = deterministicPick(reverseable, `${seed}:reverse-source`);
  const place = valueText(fact);
  const river = fact.entity.label.en;
  const riverPool = unique(SOURCE_FACTS.map((entry) => entry.entity.label.en));
  return finalizeWithPool({
    qlId: "GEO-RIV-001-QL-011",
    qlName: "Reverse association",
    difficulty: "Easy",
    seed,
    stem: `Which river is associated with ${place} as its source or source area?`,
    canonicalAnswer: river,
    pool: riverPool,
    explanation: sourceExplanation(fact),
    facts: [fact],
    solverAuthority: "CANONICAL_FACT_RELATION",
  });
}

const TRIBUTARY_FACTS = relationFacts("main_tributary_of", "tributary_of", "headstream_of");

function tributaryStem(fact: KnowledgeFact) {
  if (fact.relation === "headstream_of") {
    return `${fact.entity.label.en} is a headstream of which river?`;
  }
  return `${fact.entity.label.en} is a tributary of which river?`;
}

function tributaryExplanation(fact: KnowledgeFact) {
  const child = fact.entity.label.en;
  const parent = entityValue(fact);
  if (fact.relation === "headstream_of") {
    return `${child} is one of the two headstreams that form the ${parent} River.`;
  }
  return `${child} is a tributary of the ${parent} River.`;
}

export function generateGeoRiv001Cp002Ql012(seed: string) {
  const fact = deterministicPick(TRIBUTARY_FACTS, `${seed}:tributary`);
  return finalizeWithPool({
    qlId: "GEO-RIV-001-QL-012",
    qlName: "Tributary and parent river",
    difficulty: fact.relation === "main_tributary_of" ? "Easy" : "Medium",
    seed,
    stem: tributaryStem(fact),
    canonicalAnswer: entityValue(fact),
    pool: PARENT_RIVERS,
    explanation: tributaryExplanation(fact),
    facts: [fact],
    solverAuthority: "CANONICAL_FACT_RELATION",
  });
}

const CONFLUENCE_FACTS = relationFacts("formed_at", "joins_river_at");
const FORMATION_FACT = FACTS.find((fact) => fact.relation === "formed_by")!;
const FORMATION_PAIR_OPTIONS = [
  "Chandra and Bhaga",
  "Ravi and Beas",
  "Jhelum and Ravi",
  "Spiti and Beas",
];

export function generateGeoRiv001Cp002Ql013(seed: string) {
  const mode = deterministicPick(["formation-pair", "place"] as const, `${seed}:mode`);
  if (mode === "formation-pair") {
    const canonicalAnswer = "Chandra and Bhaga";
    const optionData = answerOptions(canonicalAnswer, FORMATION_PAIR_OPTIONS, `${seed}:formation-pair`);
    return finalize({
      qlId: "GEO-RIV-001-QL-013",
      qlName: "Confluence and formation",
      difficulty: "Medium",
      seed,
      stem: "Which two rivers join to form the Chenab River?",
      canonicalAnswer,
      ...optionData,
      explanation: "The Chandra and Bhaga rivers meet at Tandi and form the Chenab (Chandrabhaga) River.",
      facts: [FORMATION_FACT, FACTS.find((fact) => fact.factId === "geo-riv-001-cp002-chenab-formation-tandi")!],
      solverAuthority: "RELATION_CLASS_COMPOSER",
    });
  }

  const fact = deterministicPick(CONFLUENCE_FACTS, `${seed}:confluence-place`);
  let stem: string;
  let explanation: string;
  if (fact.relation === "formed_at") {
    stem = "At which place do the Chandra and Bhaga rivers meet to form the Chenab?";
    explanation = `The Chandra and Bhaga rivers meet at ${entityValue(fact)} to form the Chenab.`;
  } else {
    const river = fact.entity.label.en;
    const parent = FACTS.find(
      (entry) => entry.entityId === fact.entityId && entry.relation === "joins_river",
    );
    stem = `At which place does the ${river} join the ${parent ? entityValue(parent) : "main river"}?`;
    explanation = `${river} joins the ${parent ? entityValue(parent) : "main river"} at ${entityValue(fact)}.`;
  }
  return finalizeWithPool({
    qlId: "GEO-RIV-001-QL-013",
    qlName: "Confluence and formation",
    difficulty: fact.difficulty,
    seed,
    stem,
    canonicalAnswer: entityValue(fact),
    pool: PLACE_VALUES,
    explanation,
    facts: [
      fact,
      ...(fact.relation === "joins_river_at"
        ? FACTS.filter((entry) => entry.entityId === fact.entityId && entry.relation === "joins_river")
        : []),
    ],
    solverAuthority: "CANONICAL_FACT_RELATION",
  });
}

function sourcePairFacts(seed: string) {
  const candidates = deterministicShuffle(SOURCE_FACTS, seed);
  const selected: KnowledgeFact[] = [];
  const entities = new Set<string>();
  const values = new Set<string>();
  for (const fact of candidates) {
    const value = valueText(fact);
    if (entities.has(fact.entityId) || values.has(value)) continue;
    entities.add(fact.entityId);
    values.add(value);
    selected.push(fact);
    if (selected.length === 4) break;
  }
  if (selected.length !== 4) throw new Error("CP002 source-pair composer needs four distinct river/source facts");
  return selected;
}

function pairText(fact: KnowledgeFact, value = valueText(fact)) {
  return `${fact.entity.label.en} — ${value}`;
}

export function generateGeoRiv001Cp002Ql014(seed: string) {
  const facts = sourcePairFacts(`${seed}:correct-pairs`);
  const targetIndex = deterministicPick([0, 1, 2, 3] as const, `${seed}:target`);
  const values = facts.map(valueText);
  const options = facts.map((fact, index) =>
    index === targetIndex ? pairText(fact) : pairText(fact, values[(index + 1) % values.length]!),
  );
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
    explanation: `${pairText(facts[targetIndex]!)} is correctly matched. ${sourceExplanation(facts[targetIndex]!)}`,
    facts,
    solverAuthority: "RELATION_CLASS_COMPOSER",
  });
}

export function generateGeoRiv001Cp002Ql015(seed: string) {
  const facts = sourcePairFacts(`${seed}:incorrect-pairs`);
  const targetIndex = deterministicPick([0, 1, 2, 3] as const, `${seed}:target`);
  const values = facts.map(valueText);
  const options = facts.map((fact, index) =>
    index === targetIndex ? pairText(fact, values[(index + 1) % values.length]!) : pairText(fact),
  );
  const canonicalAnswer = options[targetIndex]!;
  const target = facts[targetIndex]!;
  return finalize({
    qlId: "GEO-RIV-001-QL-015",
    qlName: "Incorrect pair",
    difficulty: "Medium",
    seed,
    stem: "Which of the following river-source pairs is incorrectly matched?",
    canonicalAnswer,
    options,
    correctIndex: targetIndex,
    explanation: `${canonicalAnswer} is incorrectly matched. ${sourceExplanation(target)}`,
    facts,
    solverAuthority: "RELATION_CLASS_COMPOSER",
  });
}

const JOIN_FACTS = relationFacts("joins_river");

export function generateGeoRiv001Cp002Ql016(seed: string) {
  const mode = deterministicPick(["beas-chain", "chenab-pair", "sequence", "jhelum-chain"] as const, `${seed}:mode`);
  if (mode === "beas-chain") {
    const facts = JOIN_FACTS.filter((fact) => ["Beas", "Satluj"].includes(fact.entity.label.en));
    return finalizeWithPool({
      qlId: "GEO-RIV-001-QL-016",
      qlName: "Joining relation chain",
      difficulty: "Hard",
      seed,
      stem: "The Beas first joins which river, which later joins the Chenab?",
      canonicalAnswer: "Satluj",
      pool: ["Jhelum", "Ravi", "Satluj", "Indus", "Chenab"],
      explanation: "The Beas joins the Satluj. Farther downstream, the Satluj joins the Chenab at Panjnad.",
      facts,
      solverAuthority: "JOIN_CHAIN_VERIFIER",
    });
  }
  if (mode === "chenab-pair") {
    const canonicalAnswer = "Jhelum and Ravi";
    const pool = [
      canonicalAnswer,
      "Beas and Ravi",
      "Jhelum and Beas",
      "Beas and Satluj",
      "Ravi and Satluj",
    ];
    const optionData = answerOptions(canonicalAnswer, pool, `${seed}:chenab-pair`);
    const facts = JOIN_FACTS.filter((fact) => ["Jhelum", "Ravi"].includes(fact.entity.label.en));
    return finalize({
      qlId: "GEO-RIV-001-QL-016",
      qlName: "Joining relation chain",
      difficulty: "Hard",
      seed,
      stem: "Which pair of rivers joins the Chenab in the Indus river system?",
      canonicalAnswer,
      ...optionData,
      explanation: "The Jhelum and Ravi both join the Chenab. The Beas joins the Satluj first.",
      facts,
      solverAuthority: "JOIN_CHAIN_VERIFIER",
    });
  }
  if (mode === "jhelum-chain") {
    const facts = JOIN_FACTS.filter((fact) => ["Jhelum", "Satluj"].includes(fact.entity.label.en));
    return finalizeWithPool({
      qlId: "GEO-RIV-001-QL-016",
      qlName: "Joining relation chain",
      difficulty: "Hard",
      seed,
      stem: "Which river does the Jhelum join before the combined system later receives the Satluj?",
      canonicalAnswer: "Chenab",
      pool: ["Indus", "Chenab", "Ravi", "Beas", "Satluj"],
      explanation: "The Jhelum joins the Chenab at Trimmu. Farther downstream, the Satluj joins the Chenab system at Panjnad.",
      facts,
      solverAuthority: "JOIN_CHAIN_VERIFIER",
    });
  }
  const canonicalAnswer = "Beas → Satluj → Chenab";
  const pool = [
    canonicalAnswer,
    "Beas → Ravi → Chenab",
    "Jhelum → Satluj → Chenab",
    "Ravi → Beas → Satluj",
    "Satluj → Beas → Chenab",
  ];
  const optionData = answerOptions(canonicalAnswer, pool, `${seed}:sequence`);
  const facts = JOIN_FACTS.filter((fact) => ["Beas", "Satluj"].includes(fact.entity.label.en));
  return finalize({
    qlId: "GEO-RIV-001-QL-016",
    qlName: "Joining relation chain",
    difficulty: "Hard",
    seed,
    stem: "Which sequence correctly shows the joining relation among these rivers?",
    canonicalAnswer,
    ...optionData,
    explanation: "The Beas joins the Satluj, and the Satluj later joins the Chenab. Hence, Beas → Satluj → Chenab is correct.",
    facts,
    solverAuthority: "JOIN_CHAIN_VERIFIER",
  });
}

type StatementRecord = { fact: KnowledgeFact; text: string; truth: boolean };

const STATEMENT_FACTS = FACTS.filter((fact) =>
  SOURCE_RELATIONS.has(fact.relation) ||
  ["main_tributary_of", "tributary_of", "headstream_of", "joins_river", "formed_at", "flows_through", "enters_india_via"].includes(fact.relation),
);

function factFamily(fact: KnowledgeFact) {
  if (SOURCE_RELATIONS.has(fact.relation)) return "source";
  if (["main_tributary_of", "tributary_of", "headstream_of"].includes(fact.relation)) return "parent";
  if (fact.relation === "joins_river") return "join";
  if (fact.relation === "formed_at") return "formation-place";
  if (fact.relation === "flows_through") return "lake";
  if (fact.relation === "enters_india_via") return "pass";
  return fact.relation;
}

function familyValuePool(fact: KnowledgeFact) {
  const family = factFamily(fact);
  if (family === "source") return SOURCE_VALUES;
  if (family === "parent" || family === "join") return PARENT_RIVERS;
  if (family === "formation-place") return PLACE_VALUES;
  if (family === "lake") return ["Wular Lake", "Dal Lake", "Mansarovar Lake", "Pangong Lake"];
  if (family === "pass") return ["Shipkila", "Rohtang Pass", "Baralacha Pass", "Zoji La"];
  return [];
}

function isTrueFamilyValue(fact: KnowledgeFact, value: string) {
  const family = factFamily(fact);
  return FACTS.some(
    (candidate) =>
      candidate.entityId === fact.entityId &&
      factFamily(candidate) === family &&
      valueText(candidate) === value,
  );
}

function falseValue(fact: KnowledgeFact, seed: string) {
  const pool = familyValuePool(fact).filter((value) => !isTrueFamilyValue(fact, value));
  if (!pool.length) throw new Error(`No CP002 false-value pool for ${fact.factId}`);
  return deterministicPick(pool, seed);
}

function statementText(fact: KnowledgeFact, truth: boolean, seed: string) {
  const shown = truth ? valueText(fact) : falseValue(fact, `${seed}:false`);
  const river = fact.entity.label.en;
  const family = factFamily(fact);
  if (family === "source") return `${river} has its source at or near ${shown}.`;
  if (fact.relation === "headstream_of") return `${river} is a headstream of the ${shown} River.`;
  if (family === "parent") return `${river} is a tributary of the ${shown} River.`;
  if (family === "join") return `${river} joins the ${shown} River.`;
  if (family === "formation-place") return `${river} is formed at ${shown}.`;
  if (family === "lake") return `${river} flows through ${shown}.`;
  if (family === "pass") return `${river} enters India through ${shown}.`;
  throw new Error(`Unsupported CP002 statement fact ${fact.factId}`);
}

function correctStatementText(fact: KnowledgeFact) {
  return statementText(fact, true, `${fact.factId}:correct`);
}

function statementRecord(fact: KnowledgeFact, truth: boolean, seed: string): StatementRecord {
  return { fact, truth, text: statementText(fact, truth, seed) };
}

function distinctStatementFacts(count: number, seed: string) {
  const selected: KnowledgeFact[] = [];
  const entities = new Set<string>();
  for (const fact of deterministicShuffle(STATEMENT_FACTS, seed)) {
    if (entities.has(fact.entityId)) continue;
    entities.add(fact.entityId);
    selected.push(fact);
    if (selected.length === count) break;
  }
  if (selected.length !== count) throw new Error(`Could not select ${count} distinct CP002 statement entities`);
  return selected;
}

const PAIR_ANSWERS = [
  "Both Statement I and Statement II are correct",
  "Only Statement I is correct",
  "Only Statement II is correct",
  "Neither Statement I nor Statement II is correct",
] as const;

function pairAnswer(first: boolean, second: boolean) {
  if (first && second) return PAIR_ANSWERS[0];
  if (first) return PAIR_ANSWERS[1];
  if (second) return PAIR_ANSWERS[2];
  return PAIR_ANSWERS[3];
}

export function generateGeoRiv001Cp002Ql017(seed: string) {
  const facts = distinctStatementFacts(2, `${seed}:facts`);
  const truth = deterministicPick(
    [[true, true], [true, false], [false, true], [false, false]] as const,
    `${seed}:truth`,
  );
  const statements = facts.map((fact, index) => statementRecord(fact, truth[index]!, `${seed}:${index}`));
  const canonicalAnswer = pairAnswer(statements[0]!.truth, statements[1]!.truth);
  const optionData = answerOptions(canonicalAnswer, PAIR_ANSWERS, `${seed}:pair-answers`);
  const explanation = [
    `Statement I is ${statements[0]!.truth ? "correct" : "incorrect"}. ${correctStatementText(statements[0]!.fact)}`,
    `Statement II is ${statements[1]!.truth ? "correct" : "incorrect"}. ${correctStatementText(statements[1]!.fact)}`,
  ].join(" ");
  return finalize({
    qlId: "GEO-RIV-001-QL-017",
    qlName: "Statement pair",
    difficulty: "Medium",
    seed,
    stem: [
      "Consider the following statements:",
      `I. ${statements[0]!.text}`,
      `II. ${statements[1]!.text}`,
      "Which of the above statements is/are correct?",
    ].join("\n"),
    canonicalAnswer,
    ...optionData,
    explanation,
    facts,
    solverAuthority: "STATEMENT_COMPOSITION_VERIFIER",
  });
}

const COUNT_ANSWERS = ["None", "One", "Two", "Three"] as const;

export function generateGeoRiv001Cp002Ql018(seed: string) {
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
  const statements = facts.map((fact, index) => statementRecord(fact, truth[index]!, `${seed}:${index}`));
  const correctCount = statements.filter((statement) => statement.truth).length;
  const canonicalAnswer = COUNT_ANSWERS[correctCount]!;
  const optionData = answerOptions(canonicalAnswer, COUNT_ANSWERS, `${seed}:count-answers`);
  const explanation = statements
    .map(
      (statement, index) =>
        `Statement ${index + 1} is ${statement.truth ? "correct" : "incorrect"}. ${correctStatementText(statement.fact)}`,
    )
    .join(" ");
  return finalize({
    qlId: "GEO-RIV-001-QL-018",
    qlName: "Multi-statement count",
    difficulty: "Hard",
    seed,
    stem: [
      "Consider the following statements:",
      ...statements.map((statement, index) => `${index + 1}. ${statement.text}`),
      "How many of the above statements are correct?",
    ].join("\n"),
    canonicalAnswer,
    ...optionData,
    explanation: `${explanation} Therefore, ${correctCount} statement${correctCount === 1 ? " is" : "s are"} correct.`,
    facts,
    solverAuthority: "STATEMENT_COMPOSITION_VERIFIER",
  });
}

export function generateGeoRiv001Cp002ReviewV1(qlId: string, seed: string) {
  if (!seed.trim()) throw new Error("GEO-RIV-001 CP002 review generation requires an explicit seed");
  const generators: Record<string, (value: string) => GeoRiv001Cp002ReviewQuestion> = {
    "GEO-RIV-001-QL-010": generateGeoRiv001Cp002Ql010,
    "GEO-RIV-001-QL-011": generateGeoRiv001Cp002Ql011,
    "GEO-RIV-001-QL-012": generateGeoRiv001Cp002Ql012,
    "GEO-RIV-001-QL-013": generateGeoRiv001Cp002Ql013,
    "GEO-RIV-001-QL-014": generateGeoRiv001Cp002Ql014,
    "GEO-RIV-001-QL-015": generateGeoRiv001Cp002Ql015,
    "GEO-RIV-001-QL-016": generateGeoRiv001Cp002Ql016,
    "GEO-RIV-001-QL-017": generateGeoRiv001Cp002Ql017,
    "GEO-RIV-001-QL-018": generateGeoRiv001Cp002Ql018,
  };
  const generator = generators[qlId];
  if (!generator) throw new Error(`Unknown GEO-RIV-001 CP002 QL ${qlId}`);
  return generator(seed);
}
