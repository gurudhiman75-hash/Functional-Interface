import {
  getFactByEntityId,
} from "./repository";
import type {
  KnowledgeFact,
  KnowledgeLanguage,
} from "./types";

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function sequenceDistance(
  a?: number,
  b?: number,
) {
  if (
    typeof a !== "number" ||
    typeof b !== "number"
  ) {
    return 9999;
  }
  return Math.abs(a - b);
}

function scoreDistractor(
  target: KnowledgeFact,
  candidate: KnowledgeFact,
) {
  let score = 0;

  if (candidate.contextGroupId === target.contextGroupId) score += 50;
  if (candidate.factType === target.factType) score += 25;
  if (candidate.topic === target.topic) score += 15;
  if (candidate.subtopic === target.subtopic) score += 10;
  if (candidate.subject === target.subject) score += 8;
  if (
    candidate.tags.some((tag) =>
      target.tags.includes(tag),
    )
  ) {
    score += 8;
  }

  const distance = sequenceDistance(
    target.sequenceIndex,
    candidate.sequenceIndex,
  );

  if (distance <= 5) score += 8;
  else if (distance <= 50) score += 4;

  return score;
}

export function getSemanticDistractorFacts(
  facts: KnowledgeFact[],
  target: KnowledgeFact,
  count = 3,
) {
  const curated = (target.distractorPool ?? [])
    .map((entityId) =>
      getFactByEntityId(entityId, facts),
    )
    .filter(
      (fact): fact is KnowledgeFact =>
        Boolean(fact) &&
        fact.entityId !== target.entityId,
    );

  const ranked = facts
    .filter(
      (candidate) =>
        candidate.entityId !== target.entityId,
    )
    .sort(
      (a, b) =>
        scoreDistractor(target, b) -
        scoreDistractor(target, a),
    );

  return unique([
    ...curated,
    ...ranked,
  ]).slice(0, count);
}

export function buildDistractorOptions(
  facts: KnowledgeFact[],
  target: KnowledgeFact,
  answerKind: "entity" | "fact",
  language: KnowledgeLanguage,
) {
  const answer =
    answerKind === "entity"
      ? target.data.entity[language]
      : target.data.fact[language];
  const distractors =
    getSemanticDistractorFacts(
      facts,
      target,
      6,
    )
      .map((fact) =>
        answerKind === "entity"
          ? fact.data.entity[language]
          : fact.data.fact[language],
      )
      .filter(
        (value) => value && value !== answer,
      );

  return unique([
    answer,
    ...distractors,
  ]).slice(0, 4);
}

export function buildMatchRows(
  facts: KnowledgeFact[],
  target: KnowledgeFact,
) {
  const rows = [
    target,
    ...getSemanticDistractorFacts(
      facts,
      target,
      6,
    ),
  ].slice(0, 4);

  return rows.length >= 4 ? rows : undefined;
}
