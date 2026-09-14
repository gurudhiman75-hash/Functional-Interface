import type { KnowledgeV1Difficulty } from "../../types";
import {
  SCI_PHYSICS_EXHAUSTIVE_CP_META_V2,
  SCI_PHYSICS_EXHAUSTIVE_TARGET_CAPACITY_V2,
} from "./sci-physics-exhaustive-domain-v2";
import type { PhysicsExhaustiveAnchorV2 } from "./sci-physics-exhaustive-types-v2";

export type PhysicsExhaustiveQuestionV2 = {
  questionId: string;
  chapterId: "SCI-001";
  cpId: `SCI-CP-${string}`;
  family: "direct-anchor" | "correct-statement" | "incorrect-statement" | "two-statement-composition";
  difficulty: KnowledgeV1Difficulty;
  topicIds: string[];
  anchorIds: string[];
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  reviewOnly: true;
  runtimeRegistered: false;
};

const STATEMENT_OPTIONS = ["Both I and II", "I only", "II only", "Neither I nor II"] as const;
const unique = <T>(values: readonly T[]): T[] => [...new Set(values)];

function placeAnswer<T>(values: readonly T[], answer: T, targetIndex: number): T[] {
  const out = values.filter((value) => value !== answer);
  out.splice(targetIndex, 0, answer);
  return out;
}

function buildDirect(anchor: PhysicsExhaustiveAnchorV2, ordinal: number): PhysicsExhaustiveQuestionV2 {
  const options = placeAnswer([anchor.answer, ...anchor.distractors], anchor.answer, ordinal % 4);
  return {
    questionId: `${anchor.id}-DIRECT`, chapterId: "SCI-001", cpId: anchor.cpId,
    family: "direct-anchor", difficulty: anchor.difficulty, topicIds: [anchor.topicId], anchorIds: [anchor.id],
    stem: anchor.stem, options, correctIndex: options.indexOf(anchor.answer), canonicalAnswer: anchor.answer,
    explanation: anchor.explanation, sourceIds: [...anchor.sourceIds], reviewOnly: true, runtimeRegistered: false,
  };
}

function buildCorrectStatement(anchor: PhysicsExhaustiveAnchorV2, peers: readonly PhysicsExhaustiveAnchorV2[], ordinal: number): PhysicsExhaustiveQuestionV2 {
  const options = placeAnswer([anchor.trueStatement, ...peers.map((peer) => peer.falseStatement)], anchor.trueStatement, ordinal % 4);
  return {
    questionId: `${anchor.id}-CORRECT-STMT`, chapterId: "SCI-001", cpId: anchor.cpId,
    family: "correct-statement", difficulty: anchor.difficulty === "Hard" ? "Hard" : "Medium",
    topicIds: unique([anchor.topicId, ...peers.map((peer) => peer.topicId)]), anchorIds: [anchor.id, ...peers.map((peer) => peer.id)],
    stem: "Which of the following statements is correct?", options,
    correctIndex: options.indexOf(anchor.trueStatement), canonicalAnswer: anchor.trueStatement,
    explanation: anchor.explanation, sourceIds: unique([...anchor.sourceIds, ...peers.flatMap((peer) => peer.sourceIds)]),
    reviewOnly: true, runtimeRegistered: false,
  };
}

function buildIncorrectStatement(anchor: PhysicsExhaustiveAnchorV2, peers: readonly PhysicsExhaustiveAnchorV2[], ordinal: number): PhysicsExhaustiveQuestionV2 {
  const options = placeAnswer([anchor.falseStatement, ...peers.map((peer) => peer.trueStatement)], anchor.falseStatement, ordinal % 4);
  return {
    questionId: `${anchor.id}-INCORRECT-STMT`, chapterId: "SCI-001", cpId: anchor.cpId,
    family: "incorrect-statement", difficulty: anchor.difficulty === "Hard" ? "Hard" : "Medium",
    topicIds: unique([anchor.topicId, ...peers.map((peer) => peer.topicId)]), anchorIds: [anchor.id, ...peers.map((peer) => peer.id)],
    stem: "Which of the following statements is incorrect?", options,
    correctIndex: options.indexOf(anchor.falseStatement), canonicalAnswer: anchor.falseStatement,
    explanation: `${anchor.falseStatement} is incorrect. ${anchor.explanation}`,
    sourceIds: unique([...anchor.sourceIds, ...peers.flatMap((peer) => peer.sourceIds)]), reviewOnly: true, runtimeRegistered: false,
  };
}

function pairTruthPattern(pairOrdinal: number): readonly [boolean, boolean, string] {
  if (pairOrdinal % 4 === 0) return [true, true, "Both I and II"];
  if (pairOrdinal % 4 === 1) return [true, false, "I only"];
  if (pairOrdinal % 4 === 2) return [false, true, "II only"];
  return [false, false, "Neither I nor II"];
}

function buildPair(a: PhysicsExhaustiveAnchorV2, b: PhysicsExhaustiveAnchorV2, pairOrdinal: number, overallOrdinal: number): PhysicsExhaustiveQuestionV2 {
  const [truthA, truthB, canonicalAnswer] = pairTruthPattern(pairOrdinal);
  const statementA = truthA ? a.trueStatement : a.falseStatement;
  const statementB = truthB ? b.trueStatement : b.falseStatement;
  const options = placeAnswer(STATEMENT_OPTIONS, canonicalAnswer, overallOrdinal % 4);
  return {
    questionId: `SCI-PHYS-V2-${a.cpId}-PAIR-${a.id.slice(-3)}-${b.id.slice(-3)}`,
    chapterId: "SCI-001", cpId: a.cpId, family: "two-statement-composition",
    difficulty: a.difficulty === "Hard" || b.difficulty === "Hard" ? "Hard" : "Medium",
    topicIds: unique([a.topicId, b.topicId]), anchorIds: [a.id, b.id],
    stem: `Consider the statements:\nI. ${statementA}\nII. ${statementB}\nWhich is correct?`, options,
    correctIndex: options.indexOf(canonicalAnswer), canonicalAnswer,
    explanation: `Statement I is ${truthA ? "correct" : "incorrect"}. ${a.explanation} Statement II is ${truthB ? "correct" : "incorrect"}. ${b.explanation}`,
    sourceIds: unique([...a.sourceIds, ...b.sourceIds]), reviewOnly: true, runtimeRegistered: false,
  };
}

export function generatePhysicsExhaustiveCpV2(cpId: `SCI-CP-${string}`): PhysicsExhaustiveQuestionV2[] {
  const meta = SCI_PHYSICS_EXHAUSTIVE_CP_META_V2.find((entry) => entry.cpId === cpId);
  if (!meta) throw new Error(`Unknown Physics CP: ${cpId}`);
  const out: PhysicsExhaustiveQuestionV2[] = [];
  meta.anchors.forEach((anchor) => out.push(buildDirect(anchor, out.length)));
  meta.anchors.forEach((anchor, index) => {
    const peers = [1, 2, 3].map((offset) => meta.anchors[(index + offset) % meta.anchors.length]);
    out.push(buildCorrectStatement(anchor, peers, out.length));
  });
  meta.anchors.forEach((anchor, index) => {
    const peers = [1, 2, 3].map((offset) => meta.anchors[(index + offset) % meta.anchors.length]);
    out.push(buildIncorrectStatement(anchor, peers, out.length));
  });
  let pairOrdinal = 0;
  for (let i = 0; i < meta.anchors.length; i += 1) {
    for (let j = i + 1; j < meta.anchors.length; j += 1) {
      out.push(buildPair(meta.anchors[i], meta.anchors[j], pairOrdinal, out.length));
      pairOrdinal += 1;
    }
  }
  return out;
}

export function generatePhysicsExhaustiveAllV2(): PhysicsExhaustiveQuestionV2[] {
  return SCI_PHYSICS_EXHAUSTIVE_CP_META_V2.flatMap((cp) => generatePhysicsExhaustiveCpV2(cp.cpId));
}

export function generatePhysicsExhaustiveBalancedReviewV2(cpId: `SCI-CP-${string}`): PhysicsExhaustiveQuestionV2[] {
  const all = generatePhysicsExhaustiveCpV2(cpId);
  const direct = all.filter((q) => q.family === "direct-anchor");
  const correct = all.filter((q) => q.family === "correct-statement");
  const incorrect = all.filter((q) => q.family === "incorrect-statement");
  const pairs = all.filter((q) => q.family === "two-statement-composition");
  const spreadPick = (pool: PhysicsExhaustiveQuestionV2[], count: number, offset: number) =>
    Array.from({ length: count }, (_, index) => pool[(Math.floor((index * pool.length) / count) + offset) % pool.length]);
  return [...direct, ...spreadPick(correct, 12, 1), ...spreadPick(incorrect, 12, 5), ...spreadPick(pairs, 12, 11)];
}

export type PhysicsExhaustiveAuditV2 = {
  valid: boolean; errors: string[]; totalQuestions: number; cpCounts: Record<string, number>;
  cpTopicCounts: Record<string, number>; cpDirectCounts: Record<string, number>;
  cpCorrectStatementCounts: Record<string, number>; cpIncorrectStatementCounts: Record<string, number>;
  cpStatementCounts: Record<string, number>; cpAnswerPositions: Record<string, [number, number, number, number]>;
};

export function auditPhysicsExhaustiveV2(): PhysicsExhaustiveAuditV2 {
  const errors: string[] = [];
  const all = generatePhysicsExhaustiveAllV2();
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const cpCounts: Record<string, number> = {}, cpTopicCounts: Record<string, number> = {}, cpDirectCounts: Record<string, number> = {};
  const cpCorrectStatementCounts: Record<string, number> = {}, cpIncorrectStatementCounts: Record<string, number> = {}, cpStatementCounts: Record<string, number> = {};
  const cpAnswerPositions: Record<string, [number, number, number, number]> = {};

  for (const cp of SCI_PHYSICS_EXHAUSTIVE_CP_META_V2) {
    if (cp.anchors.length !== 24) errors.push(`${cp.cpId}: expected 24 semantic anchors, found ${cp.anchors.length}`);
    cpTopicCounts[cp.cpId] = new Set(cp.anchors.map((anchor) => anchor.topicId)).size;
    if (cpTopicCounts[cp.cpId] < 15) errors.push(`${cp.cpId}: expected at least 15 distinct microtopics, found ${cpTopicCounts[cp.cpId]}`);
    for (const anchor of cp.anchors) {
      if (anchor.trueStatement === anchor.falseStatement) errors.push(`${anchor.id}: true/false statements are identical`);
      if (new Set([anchor.answer, ...anchor.distractors]).size !== 4) errors.push(`${anchor.id}: duplicate direct options`);
      if (!anchor.sourceIds.length) errors.push(`${anchor.id}: missing provenance`);
    }
  }

  for (const question of all) {
    if (ids.has(question.questionId)) errors.push(`duplicate questionId ${question.questionId}`);
    ids.add(question.questionId);
    const semanticKey = question.family === "direct-anchor" ? `D|${question.anchorIds[0]}`
      : question.family === "correct-statement" ? `C|${question.anchorIds[0]}`
      : question.family === "incorrect-statement" ? `I|${question.anchorIds[0]}`
      : `P|${[...question.anchorIds].sort().join("|")}`;
    const keyedSemantic = `${question.cpId}|${semanticKey}`;
    if (semantics.has(keyedSemantic)) errors.push(`duplicate semantic payload ${question.questionId}`);
    semantics.add(keyedSemantic);
    if (question.options.length !== 4 || new Set(question.options).size !== 4) errors.push(`${question.questionId}: invalid options`);
    if (question.correctIndex < 0 || question.options[question.correctIndex] !== question.canonicalAnswer) errors.push(`${question.questionId}: invalid answer key`);
    if (!question.sourceIds.length) errors.push(`${question.questionId}: missing source IDs`);
    if (!question.reviewOnly || question.runtimeRegistered) errors.push(`${question.questionId}: lifecycle lock broken`);
    cpCounts[question.cpId] = (cpCounts[question.cpId] ?? 0) + 1;
    if (question.family === "direct-anchor") cpDirectCounts[question.cpId] = (cpDirectCounts[question.cpId] ?? 0) + 1;
    if (question.family === "correct-statement") cpCorrectStatementCounts[question.cpId] = (cpCorrectStatementCounts[question.cpId] ?? 0) + 1;
    if (question.family === "incorrect-statement") cpIncorrectStatementCounts[question.cpId] = (cpIncorrectStatementCounts[question.cpId] ?? 0) + 1;
    if (question.family === "two-statement-composition") cpStatementCounts[question.cpId] = (cpStatementCounts[question.cpId] ?? 0) + 1;
    cpAnswerPositions[question.cpId] ??= [0, 0, 0, 0];
    cpAnswerPositions[question.cpId][question.correctIndex] += 1;
  }

  for (const cp of SCI_PHYSICS_EXHAUSTIVE_CP_META_V2) {
    if ((cpCounts[cp.cpId] ?? 0) !== SCI_PHYSICS_EXHAUSTIVE_TARGET_CAPACITY_V2) errors.push(`${cp.cpId}: capacity drift`);
    if ((cpDirectCounts[cp.cpId] ?? 0) !== 24) errors.push(`${cp.cpId}: direct-anchor count drift`);
    if ((cpCorrectStatementCounts[cp.cpId] ?? 0) !== 24) errors.push(`${cp.cpId}: correct-statement count drift`);
    if ((cpIncorrectStatementCounts[cp.cpId] ?? 0) !== 24) errors.push(`${cp.cpId}: incorrect-statement count drift`);
    if ((cpStatementCounts[cp.cpId] ?? 0) !== 276) errors.push(`${cp.cpId}: statement-composition count drift`);
    const positions = cpAnswerPositions[cp.cpId] ?? [0, 0, 0, 0];
    if (positions.some((value) => value !== 87)) errors.push(`${cp.cpId}: answer positions must be A87/B87/C87/D87; found ${positions.join("/")}`);
  }
  if (all.length !== 3480) errors.push(`Physics total capacity must be 3480; found ${all.length}`);
  return { valid: errors.length === 0, errors, totalQuestions: all.length, cpCounts, cpTopicCounts, cpDirectCounts, cpCorrectStatementCounts, cpIncorrectStatementCounts, cpStatementCounts, cpAnswerPositions };
}
