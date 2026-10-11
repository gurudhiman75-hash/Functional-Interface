import type { QuestionStudioGenerationRequest, QuestionStudioGenerationResult } from "./engine-types";
import { resolveLegacyQuantExamProfile } from "./quant-exam-profile";
import { INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE as interest, generateInt001ChapterAdminQuestionStudioBatch } from "../quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/int-001-chapter-question-studio-admin-adapter-v1";
import { ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1 as algebra, buildAlgebraBankOnlyReviewPayload } from "../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/algebra-question-bank-activation-v1";
import { generateAlgebraStudioBatchV5, ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES_V5, type AlgebraStudioExamProfileV5 } from "../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/algebra-question-studio-runtime-v5";
import { ALGEBRA_QUESTION_STUDIO_PATTERNS } from "../quant-v4/topics/AdvancedMathematics/subtopics/Algebra/algebra-question-studio-runtime-v1";
const locks = { lifecycleStage: "REVIEW_ONLY", reviewSurfaceRequired: true, manualApprovalRequired: true,
  questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false,
  mockTestEligible: false, publiclyPublishable: false, automaticStudentPublication: false, productionReleaseAuthorized: false } as const;
export function interestAlgebraEnginePackages() {
  return [{ ...interest, ...locks, packageId: "INT-001", enabled: true, topic: "Arithmetic", subtopic: "Interest",
    cpIds: interest.checkpoints.map(entry => entry.checkpointId), supportedDifficulties: ["Easy", "Medium", "Hard"], difficultyFilterSupported: false,
    supportedRuntimeModes: [interest.runtimeMode], metadata: {permanentQlCount: interest.permanentQlCount, permanentQlIds: [...interest.permanentQlIds], checkpoints: interest.checkpoints, sourceFacade: "int-001-chapter-question-studio-admin-adapter-v1"}},
    {...algebra, packageId: "ALGEBRA", enabled: true, topic: "Advanced Mathematics", subtopic: "Algebra",
      cpIds: [...new Set(ALGEBRA_QUESTION_STUDIO_PATTERNS.map(entry => entry.cpId))], difficultyFilterSupported: true,
      supportedRuntimeModes: [algebra.runtimeMode], metadata: {permanentQlCount: algebra.qlCount,
        permanentQlIds: [...new Set(ALGEBRA_QUESTION_STUDIO_PATTERNS.map(entry => entry.qlId))],
        supportedExamProfiles: algebra.supportedExamProfiles, optionCountByExamProfile: algebra.optionCountByExamProfile,
        sourceFreezeAuthority: algebra.sourceFreezeAuthority, activationAuthority: algebra.activationAuthority, sourceFacade: "algebra-question-studio-runtime-v5"}}];
}
function algebraProfile(request: QuestionStudioGenerationRequest): AlgebraStudioExamProfileV5 {
  const selected = request.examProfile ?? request.exam;
  if (!selected) return "SSC_CORE";
  const upper = selected.toUpperCase();
  if (ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES_V5.includes(upper as any)) return upper as AlgebraStudioExamProfileV5;
  if (upper === "BANKING") return "BANKING_PRELIMS";
  const legacy = resolveLegacyQuantExamProfile(selected, request.exam);
  if (legacy === "BANKING_PRELIMS" || legacy === "BANKING_MAINS" || legacy === "PUNJAB_STATE") return legacy;
  if (legacy === "SSC_CGL_JSO") return "SSC_ADVANCED";
  if (legacy?.startsWith("SSC") || /^SSC(?:_|\b)/i.test(selected)) return "SSC_CORE";
  throw new Error(`Unsupported Algebra exam profile ${selected}`);
}
export async function generateInterestAlgebraEngineBatch(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult | null> {
  const selector = [request.packageId, request.canonicalProblemId, request.questionLanguageId, request.patternId].filter(Boolean).join(" ");
  const topic = request.subtopic || request.topic || "";
  const isInterest = /(?:^| )INT-/i.test(selector) || /^Interest$/i.test(topic);
  const isAlgebra = /(?:^| )(?:ALG-|ALGEBRA(?: |$))/i.test(selector) || /^Algebra$/i.test(topic);
  if (!isInterest && !isAlgebra) return null;
  try {
    if (isInterest && isAlgebra) throw new Error("Conflicting Interest and Algebra selectors");
    const count = request.count ?? 5;
    if (!Number.isInteger(count) || count < 1 || count > 50) throw new Error("Question count must be an integer between 1 and 50");
    const language = request.language ?? "en";
    if (!["en", "hi", "pa"].includes(language)) throw new Error("Unsupported chapter language");
    const seed = request.seed ?? (isInterest ? "interest-unified-review-v1" : "algebra-unified-review-v1");
    const packageId = isInterest ? "INT-001" : "ALGEBRA";
    if (request.packageId && request.packageId.toUpperCase() !== packageId) throw new Error("Chapter/package ownership mismatch");
    const runtimeMode = isInterest ? interest.runtimeMode : algebra.runtimeMode;
    if (request.runtimeMode && request.runtimeMode !== runtimeMode) throw new Error("Unsupported chapter runtime mode");
    if (isInterest) {
      if (request.patternId && !/^INT-(?:QL|CP)-\d{3}$/i.test(request.patternId)) throw new Error("Unsupported Interest pattern selector");
      if (request.difficulty && request.difficulty !== "Mixed") throw new Error("Interest chapter does not support a chapter-wide difficulty filter");
      const result = await generateInt001ChapterAdminQuestionStudioBatch({checkpointId: request.canonicalProblemId ?? (/^INT-CP-/i.test(request.patternId ?? "") ? request.patternId : undefined),
        questionLanguageId: request.questionLanguageId ?? (/^INT-QL-/i.test(request.patternId ?? "") ? request.patternId : undefined), language, seed, count});
      return { questions: result.questions.map(question => ({ ...question, ...locks, text: question.stem,
        options: [...question.options], correct: question.correctIndex, canonicalAnswer: question.answer,
        explanation: question.explanationLines.join("\n"), richExplanation: {steps: question.explanationLines, conclusion: question.answer},
        difficulty: question.difficultyBand, difficultyLabel: question.difficultyBand, topic: "Arithmetic", subtopic: "Interest", subject: "Quantitative Aptitude"})),
        generationContext: {engineId: "quant-v4", packageId, language, seed, count, difficultyFilterApplied: false, ...locks} };
    }
    if (request.difficulty && !["Mixed", "Easy", "Medium", "Hard"].includes(request.difficulty)) throw new Error("Unsupported Algebra difficulty");
    const result = generateAlgebraStudioBatchV5({language, seed, count, cpId: request.canonicalProblemId,
      qlId: request.questionLanguageId as any, patternId: request.patternId,
      difficulty: request.difficulty === "Mixed" ? undefined : request.difficulty as any, examProfile: algebraProfile(request)});
    return {questions: result.questions.map(question => { const payload = buildAlgebraBankOnlyReviewPayload(question); return {...payload, packageId: "ALGEBRA", sourcePackageId: question.packageId, options: [...question.options], generationContext: {...payload.generationContext, packageId: "ALGEBRA", sourcePackageId: question.packageId}}; }),
      generationContext: {engineId: "quant-v4", packageId, language, seed, count, examProfile: result.filters.examProfile,
        lifecycleStage: algebra.lifecycleStage, questionBankWritable: algebra.questionBankWritable,
        questionBankAcceptanceMode: algebra.questionBankAcceptanceMode, testEligible: false, mockTestEligible: false,
        publiclyPublishable: false, automaticStudentPublication: false, productionReleaseAuthorized: false}};
  } catch (error) {throw Object.assign(error instanceof Error ? error : new Error(String(error)), {statusCode: 400, code: "CHAPTER_REQUEST_INVALID"});}
}
