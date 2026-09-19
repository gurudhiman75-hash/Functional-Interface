import { GEO_CLI_001_CP013_REVIEW_BATCH_V5 } from "./geo-cli-001-cp013-review-batch-v5";
import { GEO_CLI_001_OWNING_AUTHORITY_V3 } from "./geo-cli-001-owning-authority-v3";
import type {
  GeoCli001Cp013Difficulty,
  GeoCli001Cp013Question,
} from "./geo-cli-001-cp013-review-batch-v4";

function cleanStem(value: string): string {
  return value
    .replace(/\bbroadly\b/gi, "generally")
    .replace(/\bbroad\b/gi, "")
    .replace(/\bmainly\b/gi, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ +([,.;:?])/g, "$1")
    .replace(/\n[ \t]+/g, "\n")
    .trim();
}

function placeOptions(
  options: readonly string[],
  canonicalAnswer: string,
  correctIndex: number,
): readonly string[] {
  const distractors = options.filter((option) => option !== canonicalAnswer);
  const placed = [...distractors];
  placed.splice(correctIndex, 0, canonicalAnswer);
  return Object.freeze(placed);
}

const AUTHORITY_BY_ID = new Map(
  GEO_CLI_001_OWNING_AUTHORITY_V3.map((question) => [question.questionId, question] as const),
);

export const GEO_CLI_001_CP013_REVIEW_BATCH_V6: readonly GeoCli001Cp013Question[] = Object.freeze(
  GEO_CLI_001_CP013_REVIEW_BATCH_V5.map((prior, index) => {
    const source = AUTHORITY_BY_ID.get(prior.sourceQuestionId);
    if (!source) throw new Error("Missing V3 owning authority source for " + prior.sourceQuestionId);

    const correctIndex = index % 4;
    const semanticChanged = prior.canonicalAnswer !== source.canonicalAnswer;
    const stem = semanticChanged ? source.stem : cleanStem(prior.stem);

    return Object.freeze({
      questionId: prior.questionId,
      sourceQuestionId: source.questionId,
      qlId: source.qlId,
      qlName: source.qlName,
      difficulty: source.difficulty,
      stem,
      options: placeOptions(source.options, source.canonicalAnswer, correctIndex),
      correctIndex,
      canonicalAnswer: source.canonicalAnswer,
      explanation: source.explanation,
      sourceIds: source.sourceIds,
      sourceFactIds: source.sourceFactIds,
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED_LEARNER_TEXT =
  /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|\bNCERT\b|\bIMD\b|\bbroad(?:ly)?\b|\bmainly\b|\bassociated with\b/i;
const WEAK_STEM_OPENERS =
  /^(?:compare\b|for\s+(?:cool-season rain|india[’']s? winter climate|a climate summary)\b)/i;

export function auditGeoCli001Cp013ReviewBatchV6() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const sourceIds = new Set<string>();
  const stems = new Set<string>();
  const semantics = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Cp013Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  let semanticRefreshCount = 0;
  let stemRefreshCount = 0;

  for (let index = 0; index < GEO_CLI_001_CP013_REVIEW_BATCH_V6.length; index += 1) {
    const question = GEO_CLI_001_CP013_REVIEW_BATCH_V6[index];
    const prior = GEO_CLI_001_CP013_REVIEW_BATCH_V5[index];
    const source = AUTHORITY_BY_ID.get(question.sourceQuestionId);

    if (!source) {
      issues.push("MISSING_SOURCE:" + question.sourceQuestionId);
      continue;
    }

    if (ids.has(question.questionId)) issues.push("DUPLICATE_ID:" + question.questionId);
    ids.add(question.questionId);
    if (sourceIds.has(question.sourceQuestionId)) issues.push("DUPLICATE_SOURCE:" + question.sourceQuestionId);
    sourceIds.add(question.sourceQuestionId);

    const normalizedStem = question.stem.replace(/\s+/g, " ").trim().toLowerCase();
    if (stems.has(normalizedStem)) issues.push("DUPLICATE_STEM:" + question.questionId);
    stems.add(normalizedStem);

    const semantic = normalizedStem + "::" + question.canonicalAnswer.toLowerCase();
    if (semantics.has(semantic)) issues.push("DUPLICATE_SEMANTIC:" + question.questionId);
    semantics.add(semantic);

    const normalizedExplanation = question.explanation.replace(/\s+/g, " ").trim().toLowerCase();
    if (explanations.has(normalizedExplanation)) issues.push("DUPLICATE_EXPLANATION:" + question.questionId);
    explanations.add(normalizedExplanation);

    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;

    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push("OPTIONS:" + question.questionId);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push("ANSWER:" + question.questionId);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push("PROVENANCE:" + question.questionId);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push("LIFECYCLE:" + question.questionId);
    if (question.stem.length < 20 || question.stem.length > 360 || !question.stem.trim().endsWith("?")) {
      issues.push("STEM_SHAPE:" + question.questionId);
    }
    if (WEAK_STEM_OPENERS.test(question.stem.trim())) issues.push("WEAK_STEM_OPENER:" + question.questionId);
    if (question.explanation.length < 45) issues.push("SHORT_EXPLANATION:" + question.questionId);

    const learnerText = question.stem + "\n" + question.options.join("\n") + "\n" + question.explanation;
    if (BANNED_LEARNER_TEXT.test(learnerText)) issues.push("LEARNER_TEXT:" + question.questionId);

    if (
      question.qlId !== source.qlId ||
      question.qlName !== source.qlName ||
      question.difficulty !== source.difficulty ||
      question.canonicalAnswer !== source.canonicalAnswer ||
      question.explanation !== source.explanation ||
      JSON.stringify(question.sourceIds) !== JSON.stringify(source.sourceIds) ||
      JSON.stringify(question.sourceFactIds) !== JSON.stringify(source.sourceFactIds)
    ) {
      issues.push("SOURCE_DRIFT:" + question.questionId);
    }

    const sortedQuestionOptions = [...question.options].sort();
    const sortedSourceOptions = [...source.options].sort();
    if (JSON.stringify(sortedQuestionOptions) !== JSON.stringify(sortedSourceOptions)) {
      issues.push("OPTION_SET_DRIFT:" + question.questionId);
    }

    if (prior.canonicalAnswer !== question.canonicalAnswer) semanticRefreshCount += 1;
    if (prior.stem !== question.stem) stemRefreshCount += 1;
  }

  if (GEO_CLI_001_CP013_REVIEW_BATCH_V6.length !== 108) {
    issues.push("COUNT:" + GEO_CLI_001_CP013_REVIEW_BATCH_V6.length);
  }

  for (let n = 1; n <= 108; n += 1) {
    const qlId = "GEO-CLI-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 1) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }

  if (difficultyCounts.Easy !== 36 || difficultyCounts.Medium !== 60 || difficultyCounts.Hard !== 12) {
    issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  }
  if (answerPositions.join(",") !== "27,27,27,27") {
    issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  }
  if (stems.size !== 108) issues.push("STEM_COUNT:" + stems.size);
  if (semantics.size !== 108) issues.push("SEMANTIC_COUNT:" + semantics.size);
  if (explanations.size !== 108) issues.push("EXPLANATION_COUNT:" + explanations.size);
  if (semanticRefreshCount < 1) issues.push("NO_SEMANTIC_REFRESH");
  if (stemRefreshCount < 1) issues.push("NO_STEM_REFRESH");

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_CLI_001_CP013_REVIEW_BATCH_V6.length,
    qlCount: Object.keys(qlCounts).length,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
    stemCount: stems.size,
    semanticCount: semantics.size,
    explanationCount: explanations.size,
    semanticRefreshCount,
    stemRefreshCount,
    sourceAuthorityQuestionCount: GEO_CLI_001_OWNING_AUTHORITY_V3.length,
  });
}
