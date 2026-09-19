import { GEO_CLI_001_CP001_REVIEW_BATCH_V4 } from "./geo-cli-001-cp001-review-batch-v4";
import { GEO_CLI_001_CP002_REVIEW_BATCH_V5 } from "./geo-cli-001-cp002-review-batch-v5";
import { GEO_CLI_001_CP003_REVIEW_BATCH_V2 } from "./geo-cli-001-cp003-review-batch-v2";
import { GEO_CLI_001_CP004_REVIEW_BATCH_V2 } from "./geo-cli-001-cp004-review-batch-v2";
import { GEO_CLI_001_CP005_REVIEW_BATCH_V1 } from "./geo-cli-001-cp005-review-batch-v1";
import { GEO_CLI_001_CP006_REVIEW_BATCH_V2 } from "./geo-cli-001-cp006-review-batch-v2";
import { GEO_CLI_001_CP007_REVIEW_BATCH_V1 } from "./geo-cli-001-cp007-review-batch-v1";
import { GEO_CLI_001_CP008_REVIEW_BATCH_V2 } from "./geo-cli-001-cp008-review-batch-v2";
import { GEO_CLI_001_CP009_REVIEW_BATCH_V2 } from "./geo-cli-001-cp009-review-batch-v2";
import { GEO_CLI_001_CP010_REVIEW_BATCH_V3 } from "./geo-cli-001-cp010-review-batch-v3";
import { GEO_CLI_001_CP011_REVIEW_BATCH_V1 } from "./geo-cli-001-cp011-review-batch-v1";
import { GEO_CLI_001_CP012_REVIEW_BATCH_V2 } from "./geo-cli-001-cp012-review-batch-v2";

export type GeoCli001OwningDifficulty = "Easy" | "Medium" | "Hard";

export interface GeoCli001OwningQuestionV2 {
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: GeoCli001OwningDifficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
  reviewOnly: true;
  runtimeRegistered: false;
}

type SourceQuestion = GeoCli001OwningQuestionV2;

const SOURCE_BATCHES: readonly Readonly<{ cpId: string; questions: readonly SourceQuestion[] }>[] = Object.freeze([
  { cpId: "CP001", questions: GEO_CLI_001_CP001_REVIEW_BATCH_V4 },
  { cpId: "CP002", questions: GEO_CLI_001_CP002_REVIEW_BATCH_V5 },
  { cpId: "CP003", questions: GEO_CLI_001_CP003_REVIEW_BATCH_V2 },
  { cpId: "CP004", questions: GEO_CLI_001_CP004_REVIEW_BATCH_V2 },
  { cpId: "CP005", questions: GEO_CLI_001_CP005_REVIEW_BATCH_V1 },
  { cpId: "CP006", questions: GEO_CLI_001_CP006_REVIEW_BATCH_V2 },
  { cpId: "CP007", questions: GEO_CLI_001_CP007_REVIEW_BATCH_V1 },
  { cpId: "CP008", questions: GEO_CLI_001_CP008_REVIEW_BATCH_V2 },
  { cpId: "CP009", questions: GEO_CLI_001_CP009_REVIEW_BATCH_V2 },
  { cpId: "CP010", questions: GEO_CLI_001_CP010_REVIEW_BATCH_V3 },
  { cpId: "CP011", questions: GEO_CLI_001_CP011_REVIEW_BATCH_V1 },
  { cpId: "CP012", questions: GEO_CLI_001_CP012_REVIEW_BATCH_V2 },
]);

const DUPLICATE_STEM_PATCHES: Readonly<Record<string, string>> = Object.freeze({
  "GEO-CLI-001-CP003-Q016": "Which pair correctly links winter land conditions with surface pressure over northern India?",
  "GEO-CLI-001-CP009-Q023": "Which pair correctly links a winter upper-air feature with its effect over northern India?",
  "GEO-CLI-001-CP004-Q035": "Which local pre-monsoon weather event is correctly matched with its region?",
  "GEO-CLI-001-CP005-Q011": "Which advancing-monsoon term is correctly matched with its meaning?",
  "GEO-CLI-001-CP009-Q041": "Which large-scale climate term is correctly matched with its defining pressure pattern?",
  "GEO-CLI-001-CP010-Q009": "Which region is correctly matched with the timing of southwest monsoon arrival?",
});

function cleanLearnerText(value: string): string {
  return value
    .replace(/\bbroadly\b/gi, "generally")
    .replace(/\bbroad\b/gi, "")
    .replace(/\bmainly\b/gi, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ +([,.;:?])/g, "$1")
    .replace(/\n[ \t]+/g, "\n")
    .trim();
}

function rebalanceOptions(
  options: readonly string[],
  canonicalAnswer: string,
  correctIndex: number,
): readonly string[] {
  const distractors = options.filter((option) => option !== canonicalAnswer);
  const placed = [...distractors];
  placed.splice(correctIndex, 0, canonicalAnswer);
  return Object.freeze(placed);
}

const SOURCE_FLAT: readonly SourceQuestion[] = Object.freeze(SOURCE_BATCHES.flatMap((batch) => batch.questions));

export const GEO_CLI_001_OWNING_AUTHORITY_V2: readonly GeoCli001OwningQuestionV2[] = Object.freeze(
  SOURCE_FLAT.map((source, globalIndex) => {
    const canonicalAnswer = cleanLearnerText(source.canonicalAnswer);
    const cleanedOptions = source.options.map(cleanLearnerText);
    const correctIndex = globalIndex % 4;
    const baseStem = DUPLICATE_STEM_PATCHES[source.questionId] ?? source.stem;
    return Object.freeze({
      ...source,
      stem: cleanLearnerText(baseStem),
      options: rebalanceOptions(cleanedOptions, canonicalAnswer, correctIndex),
      correctIndex,
      canonicalAnswer,
      explanation: cleanLearnerText(source.explanation),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED_LEARNER_TEXT = /\bbroad(?:ly)?\b|\bmainly\b/i;

function cpIdOf(questionId: string): string {
  const match = questionId.match(/GEO-CLI-001-(CP\d{3})-/);
  return match?.[1] ?? "UNKNOWN";
}

function qlNumber(qlId: string): number {
  return Number(qlId.slice(-3));
}

export function auditGeoCli001OwningAuthorityV2() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const cpCounts: Record<string, number> = {};
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001OwningDifficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const question of GEO_CLI_001_OWNING_AUTHORITY_V2) {
    const cpId = cpIdOf(question.questionId);
    cpCounts[cpId] = (cpCounts[cpId] ?? 0) + 1;
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;

    if (ids.has(question.questionId)) issues.push("DUPLICATE_ID:" + question.questionId);
    ids.add(question.questionId);

    const normalizedStem = question.stem.replace(/\s+/g, " ").trim().toLowerCase();
    if (stems.has(normalizedStem)) issues.push("DUPLICATE_STEM:" + question.questionId);
    stems.add(normalizedStem);

    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push("OPTIONS:" + question.questionId);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push("ANSWER:" + question.questionId);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push("PROVENANCE:" + question.questionId);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push("LIFECYCLE:" + question.questionId);
    if (question.stem.length < 20 || question.stem.length > 360 || !question.stem.trim().endsWith("?")) {
      issues.push("STEM_SHAPE:" + question.questionId);
    }
    if (question.explanation.length < 40) issues.push("SHORT_EXPLANATION:" + question.questionId);

    const learnerText = question.stem + "\n" + question.options.join("\n") + "\n" + question.explanation;
    if (BANNED_LEARNER_TEXT.test(learnerText)) issues.push("STYLE_TEXT:" + question.questionId);
  }

  if (GEO_CLI_001_OWNING_AUTHORITY_V2.length !== 648) {
    issues.push("COUNT:" + GEO_CLI_001_OWNING_AUTHORITY_V2.length);
  }

  for (let cp = 1; cp <= 12; cp += 1) {
    const cpId = "CP" + String(cp).padStart(3, "0");
    if (cpCounts[cpId] !== 54) issues.push("CP_COUNT:" + cpId + ":" + (cpCounts[cpId] ?? 0));
  }

  for (let ql = 1; ql <= 108; ql += 1) {
    const qlId = "GEO-CLI-001-QL-" + String(ql).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }

  if (Object.keys(qlCounts).some((qlId) => qlNumber(qlId) < 1 || qlNumber(qlId) > 108)) {
    issues.push("UNKNOWN_QL");
  }

  if (difficultyCounts.Easy !== 216 || difficultyCounts.Medium !== 360 || difficultyCounts.Hard !== 72) {
    issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  }

  if (answerPositions.join(",") !== "162,162,162,162") {
    issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  }

  if (stems.size !== 648) issues.push("STEM_COUNT:" + stems.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_CLI_001_OWNING_AUTHORITY_V2.length,
    stemCount: stems.size,
    cpCounts: Object.freeze(cpCounts),
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
    duplicateStemPatchCount: Object.keys(DUPLICATE_STEM_PATCHES).length,
  });
}
