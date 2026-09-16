import type { KnowledgeV1Difficulty } from "../../types";
import { SCI_CP002_REVIEW_SPECS_A_V1, type SciCp002ReviewSpec } from "./sci-cp002-review-specs-a-v1";
import { SCI_CP002_REVIEW_SPECS_B_V1 } from "./sci-cp002-review-specs-b-v1";

export type SciCp002ReviewQuestion = {
  questionId: string;
  chapterId: "SCI-001";
  cpId: "SCI-CP-002";
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
  reviewOnly: true;
  runtimeRegistered: false;
};

const SOURCE_IDS = Object.freeze(["NCERT-SCIENCE-IX-MOTION", "NCERT-SCIENCE-IX-FORCE-LAWS-MOTION"]);

export const SCI_CP002_QL_NAMES_V1: Record<number, string> = {
  1: "Motion quantities and definitions",
  2: "Speed-distance-time calculation",
  3: "Acceleration and velocity change",
  4: "Newton law identification",
  5: "Inertia in everyday situations",
  6: "Momentum",
  7: "Friction",
  8: "Force-mass-acceleration application",
  9: "Statement I/II",
  10: "Mixed motion-force application",
};

const REVIEW_SPECS: readonly SciCp002ReviewSpec[] = Object.freeze([
  ...SCI_CP002_REVIEW_SPECS_A_V1,
  ...SCI_CP002_REVIEW_SPECS_B_V1,
]);

function positionAnswer(answer: string, distractors: readonly [string, string, string], target: number) {
  const options = [answer, ...distractors];
  [options[0], options[target]] = [options[target], options[0]];
  return options;
}

export function generateSciCp002ReviewBatchV1(): SciCp002ReviewQuestion[] {
  return REVIEW_SPECS.map((spec, index) => {
    const [ql, difficulty, stem, answer, distractors, explanation, factIds] = spec;
    const correctIndex = index % 4;
    return {
      questionId: `SCI-CP002-V1-${String(index + 1).padStart(3, "0")}`,
      chapterId: "SCI-001",
      cpId: "SCI-CP-002",
      qlId: `SCI-002-QL-${String(ql).padStart(3, "0")}`,
      qlName: SCI_CP002_QL_NAMES_V1[ql],
      difficulty,
      stem,
      options: positionAnswer(answer, distractors, correctIndex),
      correctIndex,
      canonicalAnswer: answer,
      explanation,
      sourceIds: [...SOURCE_IDS],
      sourceFactIds: [...factIds],
      reviewOnly: true,
      runtimeRegistered: false,
    };
  });
}

export const SCI_CP002_REVIEW_BATCH_V1 = Object.freeze(
  generateSciCp002ReviewBatchV1().map((question) => Object.freeze(question)),
);

export function auditSciCp002ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const question of SCI_CP002_REVIEW_BATCH_V1) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);
    const semantic = `${question.stem}::${question.canonicalAnswer}`;
    if (semantics.has(semantic)) issues.push(`DUPLICATE_SEMANTIC:${question.questionId}`);
    semantics.add(semantic);
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    if (/NCERT|NIOS|sourceFact|review-only|runtimeRegistered|generator/i.test(`${question.stem}\n${question.options.join("\n")}\n${question.explanation}`)) issues.push(`META:${question.questionId}`);
  }

  if (SCI_CP002_REVIEW_BATCH_V1.length !== 60) issues.push(`COUNT:${SCI_CP002_REVIEW_BATCH_V1.length}`);
  if (semantics.size !== 60) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  for (let ql = 1; ql <= 10; ql += 1) {
    const qlId = `SCI-002-QL-${String(ql).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 12) {
    issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  }
  if (answerPositions.join(",") !== "15,15,15,15") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);

  return {
    valid: issues.length === 0,
    issues,
    questionCount: SCI_CP002_REVIEW_BATCH_V1.length,
    semanticCount: semantics.size,
    qlCounts,
    difficultyCounts,
    answerPositions,
  };
}
