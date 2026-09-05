import { deterministicIndex, deterministicShuffle } from "../deterministic";
import { assertKnowledgeQuestionValid } from "../question-validation";
import type { KnowledgeFact } from "../types";
import { COM003_EDITORIALLY_APPROVED_FACTS, COM003_EDITORIAL_TARGET_FACTS } from "./com003-editorial-fact-review";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { generateCom003ReviewQuestion } from "./com003-review-synthesis-v1";
import type { Com003ReviewQuestion } from "./com003-review-types";

function textValue(fact: KnowledgeFact) {
  if (fact.value.kind !== "text") throw new Error(`${fact.factId} must carry a text value`);
  return fact.value.text.en.trim();
}

function unique(values: readonly string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

const approvedFactById = new Map(COM003_EDITORIALLY_APPROVED_FACTS.map((fact) => [fact.factId, fact]));

function ql012Reverse(base: Com003ReviewQuestion, seed: string, index: number): Com003ReviewQuestion {
  const target = approvedFactById.get(base.targetFactId);
  if (!target) throw new Error(`Missing approved COM-003 fact ${base.targetFactId}`);
  const pool = COM003_EDITORIALLY_APPROVED_FACTS.filter(
    (fact) => fact.relation === "excel_data_feature" && fact.tags.includes("provisional-task:COM003-PT-012"),
  );
  const canonicalAnswer = textValue(target);
  const candidates = deterministicShuffle(
    pool.filter((fact) => fact.factId !== target.factId),
    `${seed}:ql012-reverse:distractors`,
  );
  const seen = new Set([canonicalAnswer.toLowerCase()]);
  const distractorFacts: KnowledgeFact[] = [];
  for (const fact of candidates) {
    const answer = textValue(fact);
    if (!answer || seen.has(answer.toLowerCase())) continue;
    seen.add(answer.toLowerCase());
    distractorFacts.push(fact);
    if (distractorFacts.length === 3) break;
  }
  if (distractorFacts.length !== 3) {
    throw new Error(`COM-003 QL-012 reverse pool too thin for ${target.factId}`);
  }
  const wrongAnswers = distractorFacts.map(textValue);
  const correctIndex = deterministicIndex(`${seed}:ql012-reverse:correct-position`, 4);
  const options = [...wrongAnswers];
  options.splice(correctIndex, 0, canonicalAnswer);
  const stems = [
    `What is the main effect of the Excel feature ${target.entity.label.en}?`,
    `Which description correctly states what ${target.entity.label.en} does in a worksheet?`,
    `${target.entity.label.en} is used for which spreadsheet task?`,
    `Select the behavior that correctly matches the Excel feature ${target.entity.label.en}.`,
    `Which worksheet action is performed by ${target.entity.label.en}?`,
    `What does the Excel feature ${target.entity.label.en} primarily do?`,
  ];
  const stem = stems[index % stems.length]!;
  const explanation = `${target.entity.label.en} ${canonicalAnswer}.`;
  assertKnowledgeQuestionValid({ stem, explanation, options, correctIndex, canonicalAnswer });
  return {
    ...base,
    questionId: base.questionId.replace("COM003-REVIEW-", "COM003-REVIEW-V2-"),
    surfaceMode: "EFFECT_FROM_FEATURE",
    stem,
    options,
    correctIndex,
    canonicalAnswer,
    explanation,
    sourceIds: unique([target.source.sourceId, ...distractorFacts.map((fact) => fact.source.sourceId)]),
    sourceFactIds: unique([target.factId, ...distractorFacts.map((fact) => fact.factId)]),
  };
}

function enforceVersionContext(question: Com003ReviewQuestion): Com003ReviewQuestion {
  if (
    question.versionScoped &&
    /SHORTCUT|ACCESS|SLIDESHOW/i.test(question.surfaceMode) &&
    !/Windows desktop/i.test(question.stem)
  ) {
    return {
      ...question,
      stem: `In Windows desktop context, ${question.stem.charAt(0).toLowerCase()}${question.stem.slice(1)}`,
    };
  }
  return question;
}

export function generateCom003ReviewQuestionV2(qlId: string, seed: string, index = 0) {
  const base = generateCom003ReviewQuestion(qlId, seed, index);
  const remediated = qlId === "COM-003-QL-012" && index % 2 === 1
    ? ql012Reverse(base, seed, index)
    : base;
  return enforceVersionContext(remediated);
}

export function buildCom003EnglishReviewCorpusV2(options: { perQl?: number; seedPrefix?: string } = {}) {
  const perQl = options.perQl ?? 12;
  const seedPrefix = options.seedPrefix ?? "com003-review-v2";
  if (!Number.isInteger(perQl) || perQl < 1 || perQl > 50) throw new Error("perQl must be between 1 and 50");
  return COM003_PERMANENT_QLS.flatMap((ql) =>
    Array.from({ length: perQl }, (_, index) =>
      generateCom003ReviewQuestionV2(ql.qlId, `${seedPrefix}:${ql.qlId}:${index}`, index),
    ),
  );
}

export const COM003_ENGLISH_REVIEW_CORPUS_V2 = buildCom003EnglishReviewCorpusV2();

export function auditCom003EnglishReviewSynthesisV2() {
  const issues: string[] = [];
  const corpus = COM003_ENGLISH_REVIEW_CORPUS_V2;
  const targetIds = new Set(COM003_EDITORIAL_TARGET_FACTS.map((fact) => fact.factId));
  const allocatedQlIds = COM003_PERMANENT_QLS.map((ql) => ql.qlId).sort();
  const generatedQlIds = [...new Set(corpus.map((question) => question.qlId))].sort();
  if (JSON.stringify(allocatedQlIds) !== JSON.stringify(generatedQlIds)) issues.push("REVIEW_CORPUS_DOES_NOT_COVER_ALL_PERMANENT_QLS");

  for (const question of corpus) {
    if (!targetIds.has(question.targetFactId)) issues.push(`NON_TARGET_FACT_USED:${question.questionId}:${question.targetFactId}`);
    if (question.options.length !== 4) issues.push(`OPTION_COUNT:${question.questionId}:${question.options.length}`);
    if (new Set(question.options.map((option) => option.trim().toLowerCase())).size !== 4) issues.push(`DUPLICATE_OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`CANONICAL_ANSWER_POSITION:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`MISSING_PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE_DRIFT:${question.questionId}`);
    if (/all of the above|none of the above/i.test(question.options.join(" "))) issues.push(`META_OPTION_LEAK:${question.questionId}`);
    if (question.versionScoped && /SHORTCUT|ACCESS|SLIDESHOW/i.test(question.surfaceMode) && !/Windows desktop/i.test(question.stem)) {
      issues.push(`VERSION_CONTEXT_MISSING:${question.questionId}`);
    }
  }

  const coverage = COM003_PERMANENT_QLS.map((ql) => {
    const questions = corpus.filter((question) => question.qlId === ql.qlId);
    const stems = new Set(questions.map((question) => question.stem));
    const surfaceModes = new Set(questions.map((question) => question.surfaceMode));
    if (questions.length !== 12) issues.push(`QL_REVIEW_COUNT:${ql.qlId}:${questions.length}`);
    if (stems.size < 6) issues.push(`THIN_STEM_DIVERSITY:${ql.qlId}:${stems.size}`);
    if (ql.supportedSolveModes.length >= 4 && surfaceModes.size < 2) issues.push(`THIN_SURFACE_MODE_DIVERSITY:${ql.qlId}:${surfaceModes.size}`);
    return { qlId: ql.qlId, questionCount: questions.length, uniqueStemCount: stems.size, surfaceModes: [...surfaceModes].sort() };
  });

  const fingerprints = new Set(corpus.map((question) => `${question.stem}|${question.options.join("|")}|${question.correctIndex}`));
  if (fingerprints.size !== corpus.length) issues.push(`DUPLICATE_REVIEW_QUESTIONS:${corpus.length - fingerprints.size}`);
  if (corpus.length !== 228) issues.push(`UNEXPECTED_REVIEW_CORPUS_SIZE:${corpus.length}`);

  return {
    valid: issues.length === 0,
    questionCount: corpus.length,
    qlCount: generatedQlIds.length,
    perQl: 12,
    coverage,
    reviewOnly: true,
    contentFrozen: false,
    runtimeRegistered: false,
    productionReleased: false,
    v1Remediation: {
      versionContextEnforced: true,
      ql012ReverseSurfaceAdded: true,
    },
    issues,
  };
}
