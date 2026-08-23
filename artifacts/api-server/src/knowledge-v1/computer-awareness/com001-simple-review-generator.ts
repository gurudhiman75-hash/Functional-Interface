import { deterministicPick, deterministicShuffle } from "../deterministic";
import { canonicalKnowledgeValueKey } from "../distractors";
import { assertKnowledgeQuestionValid } from "../question-validation";
import type { KnowledgeFact } from "../types";
import { COM001_MEMORY_STORAGE_ALL_CANDIDATES } from "./com001-memory-storage-readiness";
import type { Com001ReviewQuestion } from "./com001-review-types";

function relationFacts(relation: string) {
  return COM001_MEMORY_STORAGE_ALL_CANDIDATES.filter(
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
        "Which of the following belongs to the volatile memory/storage class?",
        "Which option loses its working contents when normal operating power is removed?",
        "Identify the volatile item among the following.",
      ]
    : [
        "Which of the following belongs to the non-volatile memory/storage class?",
        "Which option can retain stored data without normal operating power?",
        "Identify the non-volatile item among the following.",
      ];
  const stem = deterministicPick(variants, `${seed}:stem`);
  return finalize(
    qlId,
    seed,
    stem,
    entityLabel(target),
    wrongFacts.map(entityLabel),
    `${entityLabel(target)} is ${targetClass}. Therefore it is the only option matching the requested data-retention class.`,
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
      `Identify the item that belongs to the ${layer} layer.`,
      `Which option correctly represents ${layer}?`,
    ],
    `${seed}:stem`,
  );
  return finalize(
    qlId,
    seed,
    stem,
    entityLabel(target),
    wrongFacts.map(entityLabel),
    `${entityLabel(target)} is classified as ${layer}; the other options belong to different memory/storage layers.`,
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
      `What is the defining role of ${entityLabel(target)}?`,
      `Which option best describes the primary function of ${entityLabel(target)}?`,
      `${entityLabel(target)} is primarily used to do which of the following?`,
    ],
    `${seed}:stem`,
  );
  return finalize(
    qlId,
    seed,
    stem,
    textValue(target),
    wrongFacts.map(textValue),
    `${entityLabel(target)} is defined here by its primary function: ${textValue(target)}.`,
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
      `Which of the following is a subtype of ${parent}?`,
      `Identify the member of the ${parent} family.`,
      `Which option is correctly classified under ${parent}?`,
    ],
    `${seed}:stem`,
  );
  return finalize(
    qlId,
    seed,
    stem,
    entityLabel(target),
    wrongFacts.map(entityLabel),
    `${entityLabel(target)} is a subtype of ${parent}; the other options belong to different technology or memory families.`,
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
      `Identify the ${medium} storage device or medium.`,
      `Which option is correctly classified as ${medium} storage?`,
    ],
    `${seed}:stem`,
  );
  return finalize(
    qlId,
    seed,
    stem,
    entityLabel(target),
    wrongFacts.map(entityLabel),
    `${entityLabel(target)} uses ${medium} storage technology. The distractors are drawn from other storage-medium classes.`,
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
      { targetRank: 4, stem: "Which item is farthest from the processor in this broad memory/storage hierarchy?" },
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
    `The broad order used by this QL is CPU registers → cache → main memory (RAM) → secondary storage.`,
    pool,
    "ORDERED_HIERARCHY",
  );
}

function numberAnswer(fact: KnowledgeFact) {
  if (fact.value.kind !== "number") throw new Error(`${fact.factId} is not numeric`);
  return `${fact.value.value} ${fact.value.unit ?? ""}`.trim();
}

export function generateCom001Ql009Review(seed: string): Com001ReviewQuestion {
  const qlId = "COM-001-QL-009";
  const numericPool = relationFacts("capacity_unit_relation").filter(
    (fact) => fact.value.kind === "number",
  );
  const target = deterministicPick(numericPool, `${seed}:target`);
  const stem = deterministicPick(
    [
      `${entityLabel(target)} is equal to which of the following?`,
      `Choose the correct canonical capacity relation for ${entityLabel(target)}.`,
      `According to the explicit SI/IEC convention used here, what does ${entityLabel(target)} equal?`,
    ],
    `${seed}:stem`,
  );

  let wrongAnswers: string[];
  let evidenceFacts: KnowledgeFact[] = [target];
  if (target.value.kind === "number" && target.value.unit === "bits") {
    wrongAnswers = ["4 bits", "16 bits", "32 bits"];
  } else {
    const wrongFacts = pickThree(
      numericPool.filter(
        (fact) =>
          fact.factId !== target.factId &&
          fact.value.kind === "number" &&
          fact.value.unit === target.value.kind && false,
      ),
      `${seed}:wrong-unreachable`,
    );
    wrongAnswers = wrongFacts.map(numberAnswer);
    evidenceFacts = [target, ...wrongFacts];
  }

  // The branch above intentionally special-cases bit-based questions. For byte
  // relations, select other byte-denominated values as misconception traps.
  if (target.value.kind === "number" && target.value.unit !== "bits") {
    const wrongFacts = pickThree(
      numericPool.filter(
        (fact) =>
          fact.factId !== target.factId &&
          fact.value.kind === "number" &&
          fact.value.unit === target.value.unit,
      ),
      `${seed}:wrong`,
    );
    wrongAnswers = wrongFacts.map(numberAnswer);
    evidenceFacts = [target, ...wrongFacts];
  }

  return finalize(
    qlId,
    seed,
    stem,
    numberAnswer(target),
    wrongAnswers,
    `${entityLabel(target)} has the canonical relation ${numberAnswer(target)}. Decimal SI prefixes and binary IEC prefixes are kept distinct by this QL.`,
    evidenceFacts,
  );
}
