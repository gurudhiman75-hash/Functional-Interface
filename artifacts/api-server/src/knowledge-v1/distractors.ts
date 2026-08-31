import { deterministicTieBreak } from "./deterministic";
import type { KnowledgeFact } from "./types";

function overlap(left: readonly string[] = [], right: readonly string[] = []) {
  const rightSet = new Set(right);
  return left.some((entry) => rightSet.has(entry));
}

export function canonicalKnowledgeValueKey(fact: KnowledgeFact) {
  const value = fact.value;
  if (value.kind === "text") return `text:${value.text.en.trim().toLowerCase()}`;
  if (value.kind === "entity_ref") return `entity:${value.entityId}`;
  if (value.kind === "number") return `number:${value.value}:${value.unit ?? ""}`;
  if (value.kind === "date") return `date:${value.isoDate}`;
  return `boolean:${String(value.value)}`;
}

export function semanticDistractorScore(
  target: KnowledgeFact,
  candidate: KnowledgeFact,
) {
  let score = 0;
  if (candidate.relation === target.relation) score += 6;
  if (candidate.contextGroupId === target.contextGroupId) score += 5;
  if (
    overlap(
      target.distractorGroupIds ?? [],
      candidate.distractorGroupIds ?? [],
    )
  ) {
    score += 4;
  }
  if (candidate.cpId === target.cpId) score += 2;
  if (candidate.chapterId === target.chapterId) score += 1;
  if (candidate.subject === target.subject) score += 1;
  if (candidate.difficulty === target.difficulty) score += 1;
  return score;
}

export function selectSemanticDistractors(
  facts: readonly KnowledgeFact[],
  target: KnowledgeFact,
  options: {
    count: number;
    seed: string;
    minScore?: number;
    acceptsFact?: (fact: KnowledgeFact) => boolean;
  },
) {
  const targetValueKey = canonicalKnowledgeValueKey(target);
  const minScore = options.minScore ?? 10;
  const seenValues = new Set<string>([targetValueKey]);

  const ranked = facts
    .filter((candidate) => candidate.factId !== target.factId)
    .filter((candidate) =>
      options.acceptsFact ? options.acceptsFact(candidate) : true,
    )
    .map((candidate) => ({
      candidate,
      score: semanticDistractorScore(target, candidate),
      tieBreak: deterministicTieBreak(options.seed, candidate.factId),
    }))
    .filter((entry) => entry.score >= minScore)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.tieBreak - right.tieBreak ||
        left.candidate.factId.localeCompare(right.candidate.factId),
    );

  const selected: KnowledgeFact[] = [];
  for (const entry of ranked) {
    const valueKey = canonicalKnowledgeValueKey(entry.candidate);
    if (seenValues.has(valueKey)) continue;
    seenValues.add(valueKey);
    selected.push(entry.candidate);
    if (selected.length === options.count) break;
  }

  if (selected.length !== options.count) {
    throw new Error(
      `Knowledge fact ${target.factId} has only ${selected.length} strong semantic distractors; ${options.count} required.`,
    );
  }

  return selected;
}
