import { deterministicPick, deterministicShuffle } from "../deterministic";
import { canonicalKnowledgeValueKey } from "../distractors";
import { assertKnowledgeQuestionValid } from "../question-validation";
import type { KnowledgeFact } from "../types";
import { COM001_EDITORIAL_REVIEWABLE_FACTS } from "./com001-editorial-review";
import type { Com001ReviewQuestion } from "./com001-review-types";

function relationFacts(relation: string) {
  return COM001_EDITORIAL_REVIEWABLE_FACTS.filter(
    (fact) => fact.relation === relation && fact.review.status === "REVIEW_REQUIRED",
  );
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

function entityLabel(fact: KnowledgeFact) {
  return fact.entity.label.en;
}

function sourceIds(facts: readonly KnowledgeFact[]) {
  return [...new Set(facts.map((fact) => fact.source.sourceId))];
}

function finalize(
  qlId: string,
  seed: string,
  stem: string,
  canonicalAnswer: string,
  wrongAnswers: string[],
  explanation: string,
  facts: readonly KnowledgeFact[],
  solverAuthority = "CANONICAL_FACT_RELATION",
): Com001ReviewQuestion {
  const records = deterministicShuffle(
    [
      { text: canonicalAnswer, correct: true },
      ...wrongAnswers.map((text) => ({ text, correct: false })),
    ],
    `${seed}:${qlId}:options`,
  );
  const options = records.map((entry) => entry.text);
  const correctIndex = records.findIndex((entry) => entry.correct);
  assertKnowledgeQuestionValid({
    stem,
    explanation,
    options,
    correctIndex,
    canonicalAnswer,
  });
  return {
    questionId: `COM001-REVIEW-${qlId}-${seed}`,
    qlId,
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
  if (items.length < 3) throw new Error(`COM-001 review pool has only ${items.length} distractors`);
  return deterministicShuffle(items, seed).slice(0, 3);
}

export function generateCom001Ql001Review(seed: string): Com001ReviewQuestion {
  const qlId = "COM-001-QL-001";
  const pool = relationFacts("has_volatility");
  const target = deterministicPick(pool, `${seed}:target`);
  const targetClass = textValue(target);
  const wrongFacts = pickThree(
    pool.filter((fact) => textValue(fact) !== targetClass),
    `${seed}:wrong`,
  );
  const variants = targetClass === "volatile"
    ? [
        "Which of the following is volatile memory?",
        "Which of the following loses its stored contents when power is switched off?",
        "Identify the volatile memory from the following options.",
      ]
    : [
        "Which of the following is non-volatile?",
        "Which of the following can retain stored data even when power is switched off?",
        "Identify the non-volatile memory or storage device from the following options.",
      ];
  const stem = deterministicPick(variants, `${seed}:stem`);
  const explanation = targetClass === "volatile"
    ? `${entityLabel(target)} is volatile, so it needs power to retain its contents. Therefore, ${entityLabel(target)} is the correct answer.`
    : `${entityLabel(target)} is non-volatile, so its stored data is retained even when power is removed. Therefore, ${entityLabel(target)} is the correct answer.`;
  return finalize(
    qlId,
    seed,
    stem,
    entityLabel(target),
    wrongFacts.map(entityLabel),
    explanation,
    [target, ...wrongFacts],
  );
}

export function generateCom001Ql002Review(seed: string): Com001ReviewQuestion {
  const qlId = "COM-001-QL-002";
  const pool = relationFacts("classified_as_memory_layer");
  const target = deterministicPick(pool, `${seed}:target`);
  const layer = entityRefValue(target);
  const targetKey = canonicalKnowledgeValueKey(target);
  const wrongFacts = pickThree(
    pool.filter((fact) => canonicalKnowledgeValueKey(fact) !== targetKey),
    `${seed}:wrong`,
  );
  const stem = deterministicPick(
    [
      `Which of the following is classified as ${layer}?`,
      `Which option belongs to ${layer}?`,
      `Identify the ${layer} item from the following options.`,
    ],
    `${seed}:stem`,
  );
  return finalize(
    qlId,
    seed,
    stem,
    entityLabel(target),
    wrongFacts.map(entityLabel),
    `${entityLabel(target)} is classified as ${layer}. The other options belong to different levels or categories of memory and storage.`,
    [target, ...wrongFacts],
  );
}

export function generateCom001Ql003Review(seed: string): Com001ReviewQuestion {
  const qlId = "COM-001-QL-003";
  const pool = relationFacts("has_primary_function");
  const target = deterministicPick(pool, `${seed}:target`);
  const wrongFacts = pickThree(
    pool.filter((fact) => canonicalKnowledgeValueKey(fact) !== canonicalKnowledgeValueKey(target)),
    `${seed}:wrong`,
  );
  const stem = deterministicPick(
    [
      `What is the main function of ${entityLabel(target)}?`,
      `Which option best describes the purpose of ${entityLabel(target)}?`,
      `${entityLabel(target)} is primarily used for which of the following?`,
    ],
    `${seed}:stem`,
  );
  return finalize(
    qlId,
    seed,
    stem,
    textValue(target),
    wrongFacts.map(textValue),
    `${entityLabel(target)} is used to ${textValue(target)}. Hence that option correctly describes its main function.`,
    [target, ...wrongFacts],
  );
}

export function generateCom001Ql004Review(seed: string): Com001ReviewQuestion {
  const qlId = "COM-001-QL-004";
  const pool = relationFacts("is_subtype_of");
  const target = deterministicPick(pool, `${seed}:target`);
  const parent = entityRefValue(target);
  const targetKey = canonicalKnowledgeValueKey(target);
  const wrongFacts = pickThree(
    pool.filter((fact) => canonicalKnowledgeValueKey(fact) !== targetKey),
    `${seed}:wrong`,
  );
  const stem = deterministicPick(
    [
      `Which of the following is a type of ${parent}?`,
      `Which option belongs to the ${parent} family?`,
      `Identify the item correctly classified under ${parent}.`,
    ],
    `${seed}:stem`,
  );
  return finalize(
    qlId,
    seed,
    stem,
    entityLabel(target),
    wrongFacts.map(entityLabel),
    `${entityLabel(target)} belongs to the ${parent} family. The other options belong to different memory or storage families.`,
    [target, ...wrongFacts],
  );
}

export function generateCom001Ql005Review(seed: string): Com001ReviewQuestion {
  const qlId = "COM-001-QL-005";
  const pool = relationFacts("uses_storage_medium");
  const target = deterministicPick(pool, `${seed}:target`);
  const medium = textValue(target);
  const wrongFacts = pickThree(
    pool.filter((fact) => textValue(fact) !== medium),
    `${seed}:wrong`,
  );
  const stem = deterministicPick(
    [
      `Which of the following uses ${medium} storage technology?`,
      `Which option is a ${medium} storage device or medium?`,
      `Identify the ${medium} storage option.`,
    ],
    `${seed}:stem`,
  );
  return finalize(
    qlId,
    seed,
    stem,
    entityLabel(target),
    wrongFacts.map(entityLabel),
    `${entityLabel(target)} uses ${medium} storage technology, so it matches the classification asked in the question.`,
    [target, ...wrongFacts],
  );
}

export function generateCom001Ql006Review(seed: string): Com001ReviewQuestion {
  const qlId = "COM-001-QL-006";
  const pool = relationFacts("memory_hierarchy_rank").sort((left, right) => {
    const leftRank = left.value.kind === "number" ? left.value.value : 99;
    const rightRank = right.value.kind === "number" ? right.value.value : 99;
    return leftRank - rightRank;
  });
  if (pool.length !== 4) throw new Error("COM-001 broad hierarchy review requires exactly four canonical layers");
  const task = deterministicPick(
    [
      { targetRank: 1, stem: "Which item is closest to the processor in the broad memory hierarchy?" },
      { targetRank: 2, stem: "Which item comes immediately below CPU registers in the broad memory hierarchy?" },
      { targetRank: 3, stem: "Which item comes immediately after cache in the broad memory hierarchy?" },
      { targetRank: 4, stem: "Which item is farthest from the processor in the broad memory hierarchy?" },
    ],
    `${seed}:task`,
  );
  const target = pool.find(
    (fact) => fact.value.kind === "number" && fact.value.value === task.targetRank,
  );
  if (!target) throw new Error(`COM-001 hierarchy rank ${task.targetRank} is missing`);
  const wrongFacts = pool.filter((fact) => fact.factId !== target.factId);
  return finalize(
    qlId,
    seed,
    task.stem,
    entityLabel(target),
    wrongFacts.map(entityLabel),
    `The broad order is CPU registers → cache → main memory (RAM) → secondary storage. Therefore, ${entityLabel(target)} matches the position asked in the question.`,
    pool,
    "ORDERED_HIERARCHY",
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function numberAnswer(fact: KnowledgeFact) {
  if (fact.value.kind !== "number") throw new Error(`${fact.factId} is not numeric`);
  return `${formatNumber(fact.value.value)} ${fact.value.unit ?? ""}`.trim();
}

const CAPACITY_DISTRACTORS: Record<string, string[]> = {
  "1 byte": ["4 bits", "16 bits", "32 bits"],
  "1 KiB": ["1,000 bytes", "512 bytes", "2,048 bytes"],
  "1 MiB": ["1,000,000 bytes", "1,024 bytes", "1,073,741,824 bytes"],
  "1 GiB": ["1,000,000,000 bytes", "1,048,576 bytes", "1,024,000,000 bytes"],
  "1 kB": ["1,024 bytes", "100 bytes", "10,000 bytes"],
  "1 MB": ["1,048,576 bytes", "1,024,000 bytes", "100,000 bytes"],
  "1 GB": ["1,073,741,824 bytes", "1,024,000,000 bytes", "100,000,000 bytes"],
  "1 TB": ["1,099,511,627,776 bytes", "1,024,000,000,000 bytes", "100,000,000,000 bytes"],
};

function capacityStem(target: KnowledgeFact, seed: string) {
  const label = entityLabel(target);
  if (target.value.kind !== "number") {
    throw new Error(`COM-001 QL-009 target ${target.factId} must be numeric`);
  }
  if (target.value.unit === "bits") {
    return deterministicPick(
      [
        "How many bits are there in one byte?",
        "One byte is equal to how many bits?",
        "Choose the correct bit-to-byte relation.",
      ],
      `${seed}:stem`,
    );
  }
  if (/KiB|MiB|GiB/.test(label)) {
    return deterministicPick(
      [
        `Using IEC binary prefixes, ${label} is equal to how many bytes?`,
        `Under the IEC binary-prefix convention, what is the value of ${label}?`,
        `Choose the correct byte value for ${label} under the binary-prefix convention.`,
      ],
      `${seed}:stem`,
    );
  }
  return deterministicPick(
    [
      `Using SI decimal prefixes, ${label} is equal to how many bytes?`,
      `Under the SI decimal-prefix convention, what is the value of ${label}?`,
      `Choose the correct byte value for ${label} under the decimal-prefix convention.`,
    ],
    `${seed}:stem`,
  );
}

function capacityExplanation(target: KnowledgeFact) {
  const label = entityLabel(target);
  const answer = numberAnswer(target);
  if (target.value.kind !== "number") {
    throw new Error(`COM-001 QL-009 target ${target.factId} must be numeric`);
  }
  if (target.value.unit === "bits") {
    return `A byte contains 8 bits. Therefore, ${label} = ${answer}.`;
  }
  if (/KiB|MiB|GiB/.test(label)) {
    return `${label} uses the IEC binary-prefix convention. Therefore, ${label} = ${answer}.`;
  }
  return `${label} uses the SI decimal-prefix convention. Therefore, ${label} = ${answer}.`;
}

export function generateCom001Ql009Review(seed: string): Com001ReviewQuestion {
  const qlId = "COM-001-QL-009";
  const numericPool = relationFacts("capacity_unit_relation").filter(
    (fact) => fact.value.kind === "number",
  );
  const target = deterministicPick(numericPool, `${seed}:target`);
  const wrongAnswers = CAPACITY_DISTRACTORS[entityLabel(target)];
  if (!wrongAnswers || wrongAnswers.length !== 3) {
    throw new Error(`COM-001 QL-009 distractors missing for ${entityLabel(target)}`);
  }

  return finalize(
    qlId,
    seed,
    capacityStem(target, seed),
    numberAnswer(target),
    wrongAnswers,
    capacityExplanation(target),
    [target],
  );
}
