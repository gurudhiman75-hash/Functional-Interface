import type { KnowledgeV1Difficulty } from "../../types";
import { GEO_PHY_001_CP001_REVIEW_BATCH_V1 as cp001 } from "./geo-phy-001-cp001-review-batch-v1";
import { GEO_PHY_001_CP002_REVIEW_BATCH_V1 as cp002 } from "./geo-phy-001-cp002-review-batch-v1";
import { GEO_PHY_001_CP003_REVIEW_BATCH_V1 as cp003 } from "./geo-phy-001-cp003-review-batch-v1";
import { GEO_PHY_001_CP004_REVIEW_BATCH_V1 as cp004 } from "./geo-phy-001-cp004-review-batch-v1";
import { GEO_PHY_001_CP005_REVIEW_BATCH_V1 as cp005 } from "./geo-phy-001-cp005-review-batch-v1";
import { GEO_PHY_001_CP006_REVIEW_BATCH_V1 as cp006 } from "./geo-phy-001-cp006-review-batch-v1";
import { GEO_PHY_001_CP007_REVIEW_BATCH_V1 as cp007 } from "./geo-phy-001-cp007-review-batch-v1";
import { GEO_PHY_001_CP008_REVIEW_BATCH_V1 as cp008 } from "./geo-phy-001-cp008-review-batch-v1";
import { GEO_PHY_001_CP009_REVIEW_BATCH_V1 as cp009 } from "./geo-phy-001-cp009-review-batch-v1";
import { GEO_PHY_001_CP010_REVIEW_BATCH_V1 as cp010 } from "./geo-phy-001-cp010-review-batch-v1";
import { GEO_PHY_001_CP011_REVIEW_BATCH_V4 as cp011 } from "./geo-phy-001-cp011-review-batch-v4";
import { GEO_PHY_001_CP012_REVIEW_BATCH_V1 as cp012 } from "./geo-phy-001-cp012-review-batch-v1";

export type GeoPhy001Cp013ReviewQuestion = {
  questionId: string;
  qlId: string;
  qlName: string;
  sourceCheckpoint: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
  reviewOnly: true;
  runtimeRegistered: false;
};

type SourceQuestion = Omit<GeoPhy001Cp013ReviewQuestion, "questionId" | "sourceCheckpoint"> & { questionId: string };

export const GEO_PHY_001_CP013_SOURCE_BATCHES_V1: readonly {
  checkpoint: string;
  firstQl: number;
  lastQl: number;
  questions: readonly SourceQuestion[];
}[] = Object.freeze([
  { checkpoint: "CP001", firstQl: 1, lastQl: 9, questions: cp001 },
  { checkpoint: "CP002", firstQl: 10, lastQl: 18, questions: cp002 },
  { checkpoint: "CP003", firstQl: 19, lastQl: 27, questions: cp003 },
  { checkpoint: "CP004", firstQl: 28, lastQl: 36, questions: cp004 },
  { checkpoint: "CP005", firstQl: 37, lastQl: 45, questions: cp005 },
  { checkpoint: "CP006", firstQl: 46, lastQl: 54, questions: cp006 },
  { checkpoint: "CP007", firstQl: 55, lastQl: 63, questions: cp007 },
  { checkpoint: "CP008", firstQl: 64, lastQl: 72, questions: cp008 },
  { checkpoint: "CP009", firstQl: 73, lastQl: 81, questions: cp009 },
  { checkpoint: "CP010", firstQl: 82, lastQl: 90, questions: cp010 },
  { checkpoint: "CP011", firstQl: 91, lastQl: 99, questions: cp011 },
  { checkpoint: "CP012", firstQl: 100, lastQl: 108, questions: cp012 },
]);

const metaLanguage = /\bNCERT\b|sourceFact|review-only|runtimeRegistered|generator|qualification gate|provenance|administrative dataset/i;
const heavyPhrasing = /physiographic|physical division|geologically|correctly classified|incorrectly classified|structurally folded|depositional surface|structural continuity|relief contrast/i;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function learnerText(question: Pick<SourceQuestion, "stem" | "options" | "explanation">): string {
  return `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
}

function simplifyLearnerText(text: string): string {
  return text
    .replace(/physiographic divisions/gi, "major physical regions")
    .replace(/physiographic division/gi, "major physical region")
    .replace(/physiographic/gi, "physical")
    .replace(/physical division/gi, "physical region")
    .replace(/geologically/gi, "by age and formation")
    .replace(/correctly classified/gi, "correctly matched")
    .replace(/incorrectly classified/gi, "wrongly matched")
    .replace(/structurally folded/gi, "folded")
    .replace(/depositional surface/gi, "plain surface")
    .replace(/structural continuity/gi, "continuity")
    .replace(/relief contrast/gi, "landform contrast")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function isSoundSource(question: SourceQuestion): boolean {
  return question.options.length === 4
    && new Set(question.options).size === 4
    && question.options[question.correctIndex] === question.canonicalAnswer
    && question.sourceIds.length > 0
    && question.sourceFactIds.length > 0
    && question.reviewOnly === true
    && question.runtimeRegistered === false
    && !metaLanguage.test(learnerText(question));
}

function candidateScore(question: SourceQuestion, rotation: number): number {
  const heavyPenalty = heavyPhrasing.test(learnerText(question)) ? 200 : 0;
  return heavyPenalty + wordCount(question.stem) * 4 + wordCount(question.explanation) + rotation;
}

function sourceCheckpointForQl(ql: number) {
  const owner = GEO_PHY_001_CP013_SOURCE_BATCHES_V1.find((batch) => ql >= batch.firstQl && ql <= batch.lastQl);
  if (!owner) throw new Error(`No owner for QL${String(ql).padStart(3, "0")}`);
  return owner;
}

function buildRepresentative(source: SourceQuestion, targetIndex: number) {
  const canonicalAnswer = simplifyLearnerText(source.canonicalAnswer);
  const distractors = source.options
    .filter((option) => option !== source.canonicalAnswer)
    .map((option) => simplifyLearnerText(option));
  if (distractors.length !== 3) return null;
  const options = [...distractors];
  options.splice(targetIndex, 0, canonicalAnswer);
  if (new Set(options).size !== 4) return null;

  const stem = simplifyLearnerText(source.stem);
  const explanation = simplifyLearnerText(source.explanation);
  const learner = `${stem}\n${options.join("\n")}\n${explanation}`;
  if (metaLanguage.test(learner) || heavyPhrasing.test(learner)) return null;

  return { stem, options, canonicalAnswer, explanation };
}

export function generateGeoPhy001Cp013ReviewBatchV1(): GeoPhy001Cp013ReviewQuestion[] {
  const output: GeoPhy001Cp013ReviewQuestion[] = [];

  for (let ql = 1; ql <= 108; ql += 1) {
    const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
    const owner = sourceCheckpointForQl(ql);
    const candidates = owner.questions.filter((question) => question.qlId === qlId);
    if (candidates.length !== 6) throw new Error(`${qlId} must expose exactly 6 owning payloads; found ${candidates.length}`);

    const rotationStart = (ql - 1) % candidates.length;
    const ranked = candidates
      .map((question, index) => ({ question, rotation: (index - rotationStart + candidates.length) % candidates.length }))
      .filter(({ question }) => isSoundSource(question))
      .sort((a, b) => candidateScore(a.question, a.rotation) - candidateScore(b.question, b.rotation));

    const targetIndex = (ql - 1) % 4;
    let selected: { source: SourceQuestion; built: NonNullable<ReturnType<typeof buildRepresentative>> } | null = null;
    for (const { question } of ranked) {
      const built = buildRepresentative(question, targetIndex);
      if (built) {
        selected = { source: question, built };
        break;
      }
    }
    if (!selected) throw new Error(`${qlId} has no sound representative after learner-language normalization`);

    output.push({
      questionId: `GEO-PHY-001-CP013-Q${String(ql).padStart(3, "0")}`,
      qlId: selected.source.qlId,
      qlName: simplifyLearnerText(selected.source.qlName),
      sourceCheckpoint: owner.checkpoint,
      difficulty: selected.source.difficulty,
      stem: selected.built.stem,
      options: Object.freeze(selected.built.options),
      correctIndex: targetIndex,
      canonicalAnswer: selected.built.canonicalAnswer,
      explanation: selected.built.explanation,
      sourceIds: Object.freeze([...selected.source.sourceIds]),
      sourceFactIds: Object.freeze([...selected.source.sourceFactIds]),
      reviewOnly: true,
      runtimeRegistered: false,
    });
  }

  return output;
}

export const GEO_PHY_001_CP013_REVIEW_BATCH_V1 = Object.freeze(
  generateGeoPhy001Cp013ReviewBatchV1().map((question) => Object.freeze(question)),
);

export function auditGeoPhy001Cp013ReviewBatchV1() {
  const issues: string[] = [];
  const semantics = new Set<string>();
  const qlCounts = new Map<string, number>();
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const sourceCheckpoints = new Set<string>();
  const hardAnswers = new Set<string>();

  for (const question of GEO_PHY_001_CP013_REVIEW_BATCH_V1) {
    const qlNumber = Number(question.qlId.slice(-3));
    const semantic = `${question.stem.trim().toLowerCase()}::${question.canonicalAnswer.trim().toLowerCase()}`;
    if (semantics.has(semantic)) issues.push(`DUPLICATE_SEMANTIC:${question.questionId}`);
    semantics.add(semantic);
    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;
    sourceCheckpoints.add(question.sourceCheckpoint);
    if (question.difficulty === "Hard") hardAnswers.add(question.canonicalAnswer);

    if (!Number.isInteger(qlNumber) || qlNumber < 1 || qlNumber > 108) issues.push(`OUT_OF_RANGE_QL:${question.questionId}`);
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    const learner = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (metaLanguage.test(learner)) issues.push(`META_LANGUAGE:${question.questionId}`);
    if (heavyPhrasing.test(learner)) issues.push(`HEAVY_WORDING:${question.questionId}`);
    if (wordCount(question.stem) > (question.difficulty === "Hard" ? 55 : 30)) issues.push(`LONG_STEM:${question.questionId}`);
    if (wordCount(question.explanation) > 45) issues.push(`LONG_EXPLANATION:${question.questionId}`);
  }

  if (GEO_PHY_001_CP013_REVIEW_BATCH_V1.length !== 108) issues.push(`COUNT:${GEO_PHY_001_CP013_REVIEW_BATCH_V1.length}`);
  if (semantics.size !== 108) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  if (qlCounts.size !== 108) issues.push(`QL_BREADTH:${qlCounts.size}`);
  for (let ql = 1; ql <= 108; ql += 1) {
    const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
    if (qlCounts.get(qlId) !== 1) issues.push(`QL_REPRESENTATION:${qlId}:${qlCounts.get(qlId) ?? 0}`);
  }
  if (answerPositions.join(",") !== "27,27,27,27") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (sourceCheckpoints.size !== 12) issues.push(`SOURCE_CHECKPOINT_BREADTH:${sourceCheckpoints.size}`);
  if (difficultyCounts.Easy + difficultyCounts.Medium + difficultyCounts.Hard !== 108) issues.push("DIFFICULTY_TOTAL");
  if (difficultyCounts.Hard < 10) issues.push(`HARD_DEPTH:${difficultyCounts.Hard}`);
  if (hardAnswers.size < 6) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_PHY_001_CP013_REVIEW_BATCH_V1.length,
    semanticCount: semantics.size,
    permanentQlBreadth: qlCounts.size,
    sourceCheckpointBreadth: sourceCheckpoints.size,
    difficultyCounts,
    answerPositions,
    hardAnswerVariety: hardAnswers.size,
  };
}
