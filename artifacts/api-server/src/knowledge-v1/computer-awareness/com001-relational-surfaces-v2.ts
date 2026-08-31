import { deterministicIndex, deterministicPick, deterministicShuffle } from "../deterministic";
import { assertKnowledgeQuestionValid } from "../question-validation";
import type { KnowledgeFact } from "../types";
import { COM001_EDITORIAL_REVIEWABLE_FACTS } from "./com001-editorial-review";
import { generateCom001ReviewQuestion } from "./com001-review-synthesis";
import type { Com001ReviewQuestion } from "./com001-review-types";

function relationFacts(relation: string) {
  return COM001_EDITORIAL_REVIEWABLE_FACTS.filter((fact) => fact.relation === relation);
}

function entityLabel(fact: KnowledgeFact) {
  return fact.entity.label.en;
}

function textValue(fact: KnowledgeFact) {
  if (fact.value.kind !== "text") throw new Error(`${fact.factId} must have a text value`);
  return fact.value.text.en;
}

function entityRefValue(fact: KnowledgeFact) {
  if (fact.value.kind !== "entity_ref") throw new Error(`${fact.factId} must have an entity-ref value`);
  return fact.value.label.en;
}

function sourceIds(facts: readonly KnowledgeFact[]) {
  return [...new Set(facts.map((fact) => fact.source.sourceId))];
}

function positionOptions(canonicalAnswer: string, wrongAnswers: string[], seed: string) {
  const shuffledWrong = deterministicShuffle(wrongAnswers, `${seed}:wrong-options`);
  const correctIndex = deterministicIndex(`${seed}:correct-position`, shuffledWrong.length + 1);
  const options = [...shuffledWrong];
  options.splice(correctIndex, 0, canonicalAnswer);
  return { options, correctIndex };
}

function repositionQuestion(question: Com001ReviewQuestion, seed: string): Com001ReviewQuestion {
  const wrongAnswers = question.options.filter((_, index) => index !== question.correctIndex);
  const { options, correctIndex } = positionOptions(question.canonicalAnswer, wrongAnswers, seed);
  assertKnowledgeQuestionValid({
    stem: question.stem,
    explanation: question.explanation,
    options,
    correctIndex,
    canonicalAnswer: question.canonicalAnswer,
  });
  return { ...question, options, correctIndex };
}

function finalize(
  qlId: string,
  seed: string,
  stem: string,
  canonicalAnswer: string,
  wrongAnswers: string[],
  explanation: string,
  facts: readonly KnowledgeFact[],
): Com001ReviewQuestion {
  if (wrongAnswers.length !== 3) throw new Error(`${qlId} V2 requires exactly three distractors`);
  const { options, correctIndex } = positionOptions(
    canonicalAnswer,
    wrongAnswers,
    `${seed}:${qlId}:v2-options`,
  );
  assertKnowledgeQuestionValid({ stem, explanation, options, correctIndex, canonicalAnswer });
  return {
    questionId: `COM001-V2REL-${qlId}-${seed}`,
    qlId,
    stem,
    options,
    correctIndex,
    canonicalAnswer,
    explanation,
    sourceIds: sourceIds(facts),
    sourceFactIds: [...new Set(facts.map((fact) => fact.factId))],
    solverAuthority: "CANONICAL_FACT_RELATION",
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

function pickThreeDistinct<T>(items: readonly T[], seed: string) {
  if (items.length < 3) throw new Error(`COM-001 V2 pool has only ${items.length} distractor candidates`);
  return deterministicShuffle(items, seed).slice(0, 3);
}

function patchQl003Forward(question: Com001ReviewQuestion, seed: string) {
  const entity = question.stem.match(/main function of (.+)\?$/u)?.[1]
    ?? question.stem.match(/purpose of (.+)\?$/u)?.[1]
    ?? question.stem.match(/^(.+) is primarily used for which/u)?.[1];
  if (!entity) throw new Error(`${question.questionId}: unable to recover QL-003 entity`);
  return repositionQuestion({
    ...question,
    questionId: `${question.questionId}-V2FORWARD`,
    explanation: `${entity} ${question.canonicalAnswer}. Therefore, this option correctly states its main function.`,
  }, `${seed}:ql003-forward`);
}

export function generateCom001Ql001RelationalV2(seed: string) {
  const mode = deterministicPick(["ENTITY_SELECTION", "ENTITY_SELECTION", "MATCHED_PAIR"] as const, `${seed}:mode`);
  if (mode === "ENTITY_SELECTION") {
    return {
      question: repositionQuestion(
        generateCom001ReviewQuestion({ qlId: "COM-001-QL-001", seed }),
        `${seed}:ql001-forward`,
      ),
      surfaceMode: mode,
    };
  }

  const qlId = "COM-001-QL-001";
  const pool = relationFacts("has_volatility");
  const target = deterministicPick(pool, `${seed}:target`);
  const wrongFacts = pickThreeDistinct(pool.filter((fact) => fact.factId !== target.factId), `${seed}:wrong-facts`);
  const targetClass = textValue(target);
  const canonicalAnswer = `${entityLabel(target)} — ${targetClass}`;
  const wrongAnswers = wrongFacts.map((fact) => {
    const wrongClass = textValue(fact) === "volatile" ? "non-volatile" : "volatile";
    return `${entityLabel(fact)} — ${wrongClass}`;
  });
  const stem = deterministicPick(
    [
      "Which of the following memory/storage classifications is correctly matched?",
      "Identify the correctly classified memory or storage item.",
      "Which option correctly matches an item with its volatility class?",
    ],
    `${seed}:stem`,
  );
  return {
    question: finalize(
      qlId,
      seed,
      stem,
      canonicalAnswer,
      wrongAnswers,
      `${entityLabel(target)} is ${targetClass}. Therefore, ${canonicalAnswer} is the correctly matched classification.`,
      [target, ...wrongFacts],
    ),
    surfaceMode: mode,
  };
}

export function generateCom001Ql002RelationalV2(seed: string) {
  const mode = deterministicPick(["LAYER_TO_ENTITY", "ENTITY_TO_LAYER"] as const, `${seed}:mode`);
  if (mode === "LAYER_TO_ENTITY") {
    const question = generateCom001ReviewQuestion({ qlId: "COM-001-QL-002", seed });
    const layer = question.stem.match(/classified as (.+)\?$/u)?.[1]
      ?? question.stem.match(/belongs to (.+)\?$/u)?.[1]
      ?? question.stem.match(/^Identify the (.+) item from/u)?.[1];
    if (!layer) throw new Error(`${question.questionId}: unable to recover QL-002 layer`);
    return {
      question: repositionQuestion({
        ...question,
        questionId: `${question.questionId}-V2FORWARD`,
        explanation: `The correct classification for ${question.canonicalAnswer} is ${layer}. The other options belong to different memory or storage categories.`,
      }, `${seed}:ql002-forward`),
      surfaceMode: mode,
    };
  }

  const qlId = "COM-001-QL-002";
  const pool = relationFacts("classified_as_memory_layer");
  const target = deterministicPick(pool, `${seed}:target`);
  const correctLayer = entityRefValue(target);
  const allLayers = [...new Set(pool.map(entityRefValue))];
  const wrongLayers = pickThreeDistinct(allLayers.filter((layer) => layer !== correctLayer), `${seed}:wrong-layers`);
  const stem = deterministicPick(
    [
      `${entityLabel(target)} belongs to which memory/storage layer?`,
      `How is ${entityLabel(target)} classified in the broad memory/storage hierarchy?`,
      `${entityLabel(target)} is best classified as:`,
    ],
    `${seed}:stem`,
  );
  return {
    question: finalize(
      qlId,
      seed,
      stem,
      correctLayer,
      wrongLayers,
      `The correct classification for ${entityLabel(target)} is ${correctLayer}.`,
      [target],
    ),
    surfaceMode: mode,
  };
}

export function generateCom001Ql003RelationalV2(seed: string) {
  const mode = deterministicPick(["COMPONENT_TO_FUNCTION", "FUNCTION_TO_COMPONENT"] as const, `${seed}:mode`);
  if (mode === "COMPONENT_TO_FUNCTION") {
    return {
      question: patchQl003Forward(
        generateCom001ReviewQuestion({ qlId: "COM-001-QL-003", seed }),
        seed,
      ),
      surfaceMode: mode,
    };
  }

  const qlId = "COM-001-QL-003";
  const pool = relationFacts("has_primary_function");
  const target = deterministicPick(pool, `${seed}:target`);
  const wrongFacts = pickThreeDistinct(pool.filter((fact) => fact.factId !== target.factId), `${seed}:wrong-facts`);
  const functionText = textValue(target);
  const stem = deterministicPick(
    [
      `Which component ${functionText}?`,
      `Which component is correctly described by this function: ${functionText}?`,
      `Identify the component whose main function is: ${functionText}.`,
    ],
    `${seed}:stem`,
  );
  return {
    question: finalize(
      qlId,
      seed,
      stem,
      entityLabel(target),
      wrongFacts.map(entityLabel),
      `${entityLabel(target)} ${functionText}. Therefore, ${entityLabel(target)} is the correct answer.`,
      [target, ...wrongFacts],
    ),
    surfaceMode: mode,
  };
}

export function generateCom001Ql004RelationalV2(seed: string) {
  const mode = deterministicPick(["PARENT_TO_ENTITY", "ENTITY_TO_PARENT"] as const, `${seed}:mode`);
  if (mode === "PARENT_TO_ENTITY") {
    return {
      question: repositionQuestion(
        generateCom001ReviewQuestion({ qlId: "COM-001-QL-004", seed }),
        `${seed}:ql004-forward`,
      ),
      surfaceMode: mode,
    };
  }

  const qlId = "COM-001-QL-004";
  const pool = relationFacts("is_subtype_of");
  const target = deterministicPick(pool, `${seed}:target`);
  const correctParent = entityRefValue(target);
  const parents = [...new Set(pool.map(entityRefValue))];
  const wrongParents = pickThreeDistinct(parents.filter((parent) => parent !== correctParent), `${seed}:wrong-parents`);
  const stem = deterministicPick(
    [
      `${entityLabel(target)} is a type of which of the following?`,
      `Which family or storage-technology group does ${entityLabel(target)} belong to?`,
      `How is ${entityLabel(target)} best classified?`,
    ],
    `${seed}:stem`,
  );
  return {
    question: finalize(
      qlId,
      seed,
      stem,
      correctParent,
      wrongParents,
      `The correct parent category for ${entityLabel(target)} is ${correctParent}.`,
      [target],
    ),
    surfaceMode: mode,
  };
}

export function generateCom001Ql005RelationalV2(seed: string) {
  const mode = deterministicPick(["MEDIUM_TO_ENTITY", "MEDIUM_TO_ENTITY", "MATCHED_PAIR"] as const, `${seed}:mode`);
  if (mode === "MEDIUM_TO_ENTITY") {
    return {
      question: repositionQuestion(
        generateCom001ReviewQuestion({ qlId: "COM-001-QL-005", seed }),
        `${seed}:ql005-forward`,
      ),
      surfaceMode: mode,
    };
  }

  const qlId = "COM-001-QL-005";
  const pool = relationFacts("uses_storage_medium");
  const target = deterministicPick(pool, `${seed}:target`);
  const wrongFacts = pickThreeDistinct(pool.filter((fact) => fact.factId !== target.factId), `${seed}:wrong-facts`);
  const media = [...new Set(pool.map(textValue))];
  const canonicalAnswer = `${entityLabel(target)} — ${textValue(target)}`;
  const wrongAnswers = wrongFacts.map((fact, index) => {
    const candidates = media.filter((medium) => medium !== textValue(fact));
    const wrongMedium = deterministicPick(candidates, `${seed}:wrong-medium:${index}`);
    return `${entityLabel(fact)} — ${wrongMedium}`;
  });
  const stem = deterministicPick(
    [
      "Which of the following storage device–technology pairs is correctly matched?",
      "Identify the correctly matched storage-medium pair.",
      "Which option correctly matches a storage device with its storage technology?",
    ],
    `${seed}:stem`,
  );
  return {
    question: finalize(
      qlId,
      seed,
      stem,
      canonicalAnswer,
      wrongAnswers,
      `${entityLabel(target)} uses ${textValue(target)} storage technology. Therefore, ${canonicalAnswer} is correctly matched.`,
      [target, ...wrongFacts],
    ),
    surfaceMode: mode,
  };
}
