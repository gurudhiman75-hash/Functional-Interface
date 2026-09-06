import { COM004_CANDIDATE_FACTS } from "./com004-candidate-fact-corpus";
import { COM004_DISTRACTOR_READINESS } from "./com004-distractor-readiness";
import { COM004_PERMANENT_QLS, auditCom004PermanentQlAllocation } from "./com004-permanent-ql-allocation";
import { COM004_REVIEW_SEEDS_BY_QL, auditCom004ReviewSeedBank } from "./com004-review-seed-bank";
import type { Com004ReviewQuestion } from "./com004-review-types";

const factById = new Map(COM004_CANDIDATE_FACTS.map((fact) => [fact.factId, fact]));
const qlById = new Map(COM004_PERMANENT_QLS.map((ql) => [ql.qlId, ql]));
const distractorByTask = new Map(COM004_DISTRACTOR_READINESS.map((entry) => [entry.taskId, entry]));

function orderedOptions(answer: string, distractors: readonly [string, string, string], correctIndex: number) {
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  return options;
}

function qlNumber(qlId: string) {
  return Number(qlId.match(/QL-(\d{3})$/)?.[1] ?? 0);
}

function polishStem(qlId: string, answer: string, surfaceMode: string, stem: string) {
  let result = stem.trim().replace(/\s+/g, " ");

  // Direct acronym prompts are legitimate exam surfaces, but bare five-word
  // prompts are too thin for this governed review corpus.
  if (result.length < 32) {
    result = result.replace(
      /^What does ([A-Za-z0-9*#]+) stand for\?$/i,
      "In computer-awareness terminology, what does $1 stand for?",
    );
  }

  // Remove answer leakage from contextual system-identification stems while
  // preserving the underlying scenario and source fact.
  if (qlId === "COM-004-QL-013" && answer === "UPI" && surfaceMode !== "ACRONYM_EXPANSION") {
    result = result.replace(/UPI-enabled/gi, "participating digital-payment");
  }
  if (qlId === "COM-004-QL-014" && answer === "USSD" && surfaceMode !== "ACRONYM_EXPANSION") {
    result = result.replace(/\bUSSD session\b/gi, "telecom service session");
  }

  // QL-017 must not teach rapidly changing operational trivia even in a
  // sentence that says such trivia is excluded.
  if (qlId === "COM-004-QL-017") {
    result = result.replace(
      /without relying on changing limits or charges/gi,
      "without relying on mutable operational details",
    );
  }
  return result;
}

function polishExplanation(qlId: string, explanation: string) {
  if (qlId !== "COM-004-QL-017") return explanation;
  return explanation.replace(
    /Monetary limits and charges are intentionally not used as the discriminator\./gi,
    "Mutable operational details are intentionally not used as the discriminator.",
  );
}

function editorialSurfaceFamily(
  base: Com004ReviewQuestion["examSurfaceFamily"],
  surfaceMode: string,
  stemVariant: number,
): Com004ReviewQuestion["examSurfaceFamily"] {
  // The same fact may appear in recall and applied wording without becoming a
  // new learner task. This labels the actual rendered surface, not just the seed.
  if (stemVariant === 1 && surfaceMode !== "ACRONYM_EXPANSION" && base !== "CONTEXT_SELECTION") {
    return "FUNCTIONAL_APPLICATION";
  }
  if (stemVariant === 2 && base === "CONTEXT_SELECTION") return "CONTRAST_DISCRIMINATION";
  return base;
}

export function generateCom004ReviewQuestionV1(qlId: string, questionIndex: number): Com004ReviewQuestion {
  const ql = qlById.get(qlId);
  if (!ql) throw new Error(`Unknown COM-004 QL ${qlId}`);
  if (!Number.isInteger(questionIndex) || questionIndex < 0 || questionIndex >= 12) {
    throw new Error("questionIndex must be an integer from 0 to 11");
  }

  const seeds = COM004_REVIEW_SEEDS_BY_QL[qlId];
  if (!seeds || seeds.length !== 4) throw new Error(`Missing four-seed review plan for ${qlId}`);
  const seedIndex = Math.floor(questionIndex / 3);
  const stemVariant = questionIndex % 3;
  const seed = seeds[seedIndex]!;
  const fact = factById.get(seed.factId);
  if (!fact) throw new Error(`Unknown COM-004 review target fact ${seed.factId}`);
  const taskTag = `provisional-task:${ql.sourceProvisionalTaskId}`;
  if (!fact.tags.includes(taskTag)) throw new Error(`Review seed ${seed.factId} does not belong to ${ql.sourceProvisionalTaskId}`);

  const distractor = distractorByTask.get(ql.sourceProvisionalTaskId);
  if (!distractor) throw new Error(`Missing distractor authority for ${ql.sourceProvisionalTaskId}`);
  const correctIndex = (qlNumber(qlId) + questionIndex) % 4;
  const options = orderedOptions(seed.answer, seed.distractors, correctIndex);
  const stem = polishStem(qlId, seed.answer, seed.surfaceMode, seed.stems[stemVariant]!);
  const explanation = polishExplanation(qlId, seed.explanation);

  return {
    questionId: `COM004-REVIEW-V1-${qlId}-${String(questionIndex + 1).padStart(2, "0")}`,
    qlId,
    cpId: ql.cpId as Com004ReviewQuestion["cpId"],
    surfaceMode: seed.surfaceMode,
    examSurfaceFamily: editorialSurfaceFamily(seed.examSurfaceFamily, seed.surfaceMode, stemVariant),
    targetFactId: seed.factId,
    stem,
    options,
    correctIndex,
    canonicalAnswer: seed.answer,
    explanation,
    sourceIds: [fact.source.sourceId],
    sourceFactIds: [fact.factId],
    distractorStrategy: distractor.strategy,
    controlledPoolId: seed.controlledPoolId ?? distractor.controlledPoolIds?.[0],
    versionScoped: ql.versionScoped,
    solverAuthority: "CANONICAL_FACT_RELATION",
    stemAuthority: "COM004_V1_CONTROLLED_EXAM_SURFACE_AUTHORITY",
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function buildCom004EnglishReviewCorpusV1() {
  return COM004_PERMANENT_QLS.flatMap((ql) =>
    Array.from({ length: 12 }, (_, index) => generateCom004ReviewQuestionV1(ql.qlId, index)),
  );
}

export const COM004_ENGLISH_REVIEW_CORPUS_V1 = buildCom004EnglishReviewCorpusV1();

function normalized(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function auditCom004EnglishReviewCorpusV1() {
  const issues: string[] = [];
  const allocation = auditCom004PermanentQlAllocation();
  const seedAudit = auditCom004ReviewSeedBank();
  if (!allocation.valid) issues.push(...allocation.issues.map((issue) => `ALLOCATION:${issue}`));
  if (!seedAudit.valid) issues.push(...seedAudit.issues.map((issue) => `SEEDS:${issue}`));

  const ids = new Set<string>();
  for (const question of COM004_ENGLISH_REVIEW_CORPUS_V1) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_QUESTION_ID:${question.questionId}`);
    ids.add(question.questionId);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`PREMATURE_RUNTIME_STATE:${question.questionId}`);
    if (question.options.length !== 4) issues.push(`OPTION_COUNT_NOT_FOUR:${question.questionId}:${question.options.length}`);
    if (new Set(question.options.map(normalized)).size !== 4) issues.push(`DUPLICATE_OPTIONS:${question.questionId}`);
    if (question.correctIndex < 0 || question.correctIndex > 3) issues.push(`INVALID_CORRECT_INDEX:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER_INDEX_DRIFT:${question.questionId}`);
    if (!question.stem.endsWith("?")) issues.push(`NON_QUESTION_STEM:${question.questionId}`);
    if (question.stem.length < 32) issues.push(`THIN_STEM:${question.questionId}:${question.stem.length}`);
    if (question.explanation.length < 80) issues.push(`THIN_EXPLANATION:${question.questionId}:${question.explanation.length}`);
    if (/correct (?:answer|option) is|is correct because|associated with the correct/i.test(question.explanation)) {
      issues.push(`BOILERPLATE_EXPLANATION:${question.questionId}`);
    }
    if (question.sourceFactIds.length !== 1 || question.sourceIds.length !== 1) issues.push(`UNEXPECTED_SOURCE_GEOMETRY:${question.questionId}`);
    const fact = factById.get(question.targetFactId);
    if (!fact) issues.push(`UNKNOWN_TARGET_FACT:${question.questionId}`);
    if (fact && question.sourceIds[0] !== fact.source.sourceId) issues.push(`SOURCE_ID_DRIFT:${question.questionId}`);
    if (question.versionScoped !== qlById.get(question.qlId)?.versionScoped) issues.push(`VERSION_SCOPE_DRIFT:${question.questionId}`);
  }

  for (const ql of COM004_PERMANENT_QLS) {
    const questions = COM004_ENGLISH_REVIEW_CORPUS_V1.filter((question) => question.qlId === ql.qlId);
    if (questions.length !== 12) issues.push(`QUESTION_COUNT_PER_QL:${ql.qlId}:${questions.length}`);
    const stems = new Set(questions.map((question) => normalized(question.stem)));
    if (stems.size !== 12) issues.push(`NON_UNIQUE_STEMS_PER_QL:${ql.qlId}:${stems.size}`);
    const explanations = new Set(questions.map((question) => normalized(question.explanation)));
    if (explanations.size < 4) issues.push(`THIN_EXPLANATION_DIVERSITY:${ql.qlId}:${explanations.size}`);
    const families = new Set(questions.map((question) => question.examSurfaceFamily));
    if (families.size < 2) issues.push(`THIN_EXAM_SURFACE_DIVERSITY:${ql.qlId}:${families.size}`);
    const answerPositions = new Set(questions.map((question) => question.correctIndex));
    if (answerPositions.size !== 4) issues.push(`ANSWER_POSITION_NOT_BALANCED:${ql.qlId}:${answerPositions.size}`);
  }

  const riskyHttpsClaims = COM004_ENGLISH_REVIEW_CORPUS_V1.filter((question) =>
    /https (?:guarantees|proves) (?:that )?(?:a )?(?:site|website).*(?:safe|genuine|honest|trustworthy)/i.test(question.explanation),
  );
  if (riskyHttpsClaims.length) issues.push(...riskyHttpsClaims.map((question) => `HTTPS_ABSOLUTE_CLAIM:${question.questionId}`));
  const mutablePaymentTrivia = COM004_ENGLISH_REVIEW_CORPUS_V1.filter((question) =>
    question.qlId === "COM-004-QL-017" && /₹|\brs\.?\s*\d|\bfee(?:s)?\b|\bcharge(?:s)?\b|\bminimum amount\b|\bmaximum amount\b/i.test(`${question.stem} ${question.explanation}`),
  );
  if (mutablePaymentTrivia.length) issues.push(...mutablePaymentTrivia.map((question) => `MUTABLE_PAYMENT_TRIVIA:${question.questionId}`));

  if (COM004_ENGLISH_REVIEW_CORPUS_V1.length !== 216) issues.push(`UNEXPECTED_REVIEW_CORPUS_COUNT:${COM004_ENGLISH_REVIEW_CORPUS_V1.length}`);

  return {
    valid: issues.length === 0,
    questionCount: COM004_ENGLISH_REVIEW_CORPUS_V1.length,
    qlCount: COM004_PERMANENT_QLS.length,
    questionsPerQl: 12,
    contentFrozen: false,
    questionStudioRuntimeAuthorized: false,
    questionBankWritable: false,
    testEligible: false,
    mockEligible: false,
    productionEligible: false,
    status: issues.length === 0 ? "ENGLISH_REVIEW_CORPUS_V1_READY_FOR_EDITORIAL_AUDIT" as const : "BLOCKED" as const,
    nextGate: issues.length === 0 ? "COM004_ENGLISH_REVIEW_CORPUS_V1_WHOLE_CHAPTER_EDITORIAL_AUDIT" as const : "BLOCKED" as const,
    issues,
  };
}
