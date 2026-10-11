import { createHash } from "node:crypto";
import type { QuestionStudioGenerationRequest, QuestionStudioGenerationResult } from "./engine-types";
import { generateNum001EngineBatch } from "./quant-number-system-num001";
import { NUMBER_SYSTEM_FINAL_CHECKPOINT_ALLOCATIONS as allocations, formatNumberSystemQlId } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/design/number-system-final-allocation-authority";
import { runNumCp002PermanentPipeline } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-001/NUM-CP-002/permanent/runtime";
import { runNumCp002LocalizedFinalPipeline } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-001/NUM-CP-002/localization/runtime-final";
import { runNumCp005PermanentPipeline } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-001/NUM-CP-005/permanent/runtime";
import { generateNumCp005LocalizedQuestion } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-001/NUM-CP-005/localization/runtime";
import { runNumCp006PermanentPipeline } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-001/NUM-CP-006/permanent/runtime";
import { generateNumCp006LocalizedQuestion } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-001/NUM-CP-006/localization/runtime";
import { runNumCp007PermanentPipeline } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-007/permanent/runtime";
import { generateNumCp007LocalizedQuestion } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-007/localization/runtime";
import { runNumCp003LocalizedFinalV2ForQl } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-001/NUM-CP-003/localization/runtime-final-v2";
import { runNumCp004LocalizedReviewFinalForQl } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-001/NUM-CP-004/localization/runtime-review-human-final";
import { generateNumCp008QuestionStudioBatch } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-008/question-studio-integration";
import { generateNumCp009QuestionStudioBatch } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-009/question-studio-integration";
import { generateNumCp010QuestionStudioBatch } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-010/question-studio-integration";
import { generateNumCp011QuestionStudioBatch } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-011/question-studio-integration";
import { generateNumCp012QuestionStudioBatch } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-012/question-studio-integration";
import { generateNumCp013QuestionStudioBatch } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-013/question-studio-integration";
import { generateNumCp014QuestionStudioBatch } from "../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-014/question-studio-integration";

const locks = { lifecycleStage: "REVIEW_ONLY", reviewSurfaceRequired: true, manualApprovalRequired: true,
  questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE",
  testEligible: false, mockTestEligible: false, publiclyPublishable: false,
  automaticStudentPublication: false, productionReleaseAuthorized: false } as const;
const qls = (entry: typeof allocations[number]) => Array.from({length: entry.permanentQlCount}, (_, i) => formatNumberSystemQlId(entry.firstQlNumber + i));
export function numberSystemEnginePackages() {
  return ["NUM-001", "NUM-002"].map(packageId => {
    const owned = allocations.filter(entry => entry.packageId === packageId);
    const permanentQlIds = owned.flatMap(qls);
    return { packageId, topic: "Arithmetic", subtopic: "Number System", label: `${packageId} · Number System · ${permanentQlIds.length} QLs`,
      enabled: true, cpIds: owned.map(entry => entry.cpId), canonicalProblems: owned.map(entry => ({id: entry.cpId, label: entry.title})),
      supportedLanguages: ["en", "hi", "pa"], supportedDifficulties: ["Easy", "Medium", "Hard"], difficultyFilterSupported: false,
      runtimeMode: "QUESTION_STUDIO_ACTIVE", supportedRuntimeModes: ["QUESTION_STUDIO_ACTIVE"], ...locks,
      metadata: { permanentQlIds, permanentQlCount: permanentQlIds.length, allocationAuthority: "NUMBER_SYSTEM_FINAL_CHECKPOINT_ALLOCATIONS",
        cpLanguagePolicy: Object.fromEntries(owned.map(entry => [entry.cpId, ["en", "hi", "pa"]])),
        controlledReviewCpIds: owned.filter(entry => ["NUM-CP-003", "NUM-CP-004"].includes(entry.cpId)).map(entry => entry.cpId),
        sourceStatusPreserved: true, sourceFacade: "number-system-final-allocation/direct-checkpoint-runtimes" } };
  });
}
function normalizeQuestion(source: any, packageId: string, cpId: string, language: string, seed: string) {
  const options = source.options.map((option: any) => typeof option === "string" ? option : option.value ?? option.text);
  const answer = source.canonicalAnswer ?? source.answer;
  if (options[source.correctIndex] !== answer || (source.verifierAnswer !== undefined && source.verifierAnswer !== answer && source.verifierAnswer !== source.localization?.canonicalAnswer)) throw new Error(`${source.permanentQlId}: answer binding drift`);
  const explanation = source.explanation;
  const lines = [explanation.coreConcept ?? explanation.concept, explanation.strategy,
    ...(explanation.solution ?? explanation.steps ?? []), explanation.finalAnswer].filter(Boolean);
  const reviewIdentity = createHash("sha256").update(JSON.stringify({sourceQuestionId: source.questionId, language, seed, policy: "NUMBER-SYSTEM-UNIFIED-REVIEW-V1"})).digest("hex").slice(0, 20);
  return { ...source, ...locks, questionId: `NUM-QS-${source.permanentQlId}-${language}-${reviewIdentity}`, canonicalQuestionId: source.questionId, packageId, canonicalProblemId: cpId, checkpointId: cpId,
    qlId: source.permanentQlId, questionLanguageId: source.permanentQlId,
    language, seed, sourceSeed: source.seed, topic: "Arithmetic", subtopic: "Number System", subject: "Quantitative Aptitude",
    text: source.stem, options, optionMetadata: source.options, correct: source.correctIndex, answer,
    canonicalAnswer: answer, richExplanation: explanation, explanation: lines.join("\n"),
    difficulty: String(source.difficulty).toLowerCase().replace(/^./, (s: string) => s.toUpperCase()),
    difficultyLabel: String(source.difficulty).toLowerCase().replace(/^./, (s: string) => s.toUpperCase()),
    sourceLifecycle: source.lifecycle, sourceVerifierAnswer: source.verifierAnswer, sourceReviewStatus: source.reviewStatus,
    runtimeMode: "QUESTION_STUDIO_ACTIVE", questionStudioDiscoverable: true,
    traceability: { ...source.traceability, sourceRuntimeLifecycle: source.lifecycle, sourceReviewStatus: source.reviewStatus } };
}
export async function generateNumberSystemEngineBatch(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult | null> {
  const matches = /^NUM-/i.test(request.packageId ?? "") || /^NUM-/i.test(request.canonicalProblemId ?? "") || /^NUM-/i.test(request.questionLanguageId ?? "")
    || /^num[ -]/i.test(request.patternId ?? "") || /^(number system|numbers|number theory)$/i.test(request.subtopic ?? request.topic ?? "");
  if (!matches) return null;
  try {
    const count = request.count ?? 5;
    if (!Number.isInteger(count) || count < 1 || count > 50) throw new Error("Question count must be an integer between 1 and 50");
    if (request.runtimeMode && request.runtimeMode !== "QUESTION_STUDIO_ACTIVE") throw new Error("Unsupported Number System runtime mode");
    const language = request.language ?? "en";
    if (!["en", "hi", "pa"].includes(language)) throw new Error("Unsupported Number System language");
    if (request.difficulty && request.difficulty !== "Mixed") throw new Error("Number System chapter does not support a chapter-wide difficulty filter");
    if (request.patternId && !/^NUM-(?:QL|CP)-\d{3}$/i.test(request.patternId) && !/^NUM-00[12]$/i.test(request.patternId)) throw new Error("Unsupported Number System pattern selector");
    const explicitQl = request.questionLanguageId?.toUpperCase() ?? (/^NUM-QL-/i.test(request.patternId ?? "") ? request.patternId!.toUpperCase() : undefined);
    const explicitCp = request.canonicalProblemId?.toUpperCase() ?? (/^NUM-CP-/i.test(request.patternId ?? "") ? request.patternId!.toUpperCase() : undefined);
    const owner = explicitQl ? allocations.find(entry => qls(entry).includes(explicitQl as any)) : undefined;
    if (explicitQl && !owner) throw new Error(`Unknown Number System QL ${explicitQl}`);
    if (explicitCp && !allocations.some(entry => entry.cpId === explicitCp)) throw new Error(`Unknown Number System CP ${explicitCp}`);
    if (owner && explicitCp && owner.cpId !== explicitCp) throw new Error("Number System CP/QL ownership mismatch");
    const packageId = request.packageId?.toUpperCase() ?? (/^NUM-00[12]$/i.test(request.patternId ?? "") ? request.patternId!.toUpperCase() : undefined) ?? owner?.packageId ?? allocations.find(entry => entry.cpId === explicitCp)?.packageId ?? "NUM-001";
    if (!["NUM-001", "NUM-002"].includes(packageId)) throw new Error(`Unknown Number System package ${packageId}`);
    const selected = allocations.filter(entry => entry.packageId === packageId && (!explicitCp || entry.cpId === explicitCp));
    if (owner && owner.packageId !== packageId || !selected.length) throw new Error("Number System package/CP/QL ownership mismatch");
    const pool = explicitQl ? [explicitQl] : selected.flatMap(qls);
    const batchSeed = request.seed ?? "number-system-unified-review-v1";
    const questions: Record<string, any>[] = [];
    for (let index = 0; index < count; index++) {
      const qlId = pool[index % pool.length]!;
      const cp = allocations.find(entry => qls(entry).includes(qlId as any))!.cpId;
      const cpNumber = Number(cp.slice(-3));
      const seed = `${batchSeed}:${index}`;
      const numericSeed = createHash("sha256").update(seed).digest().readUInt32BE(0) % 240 + 1;
      const input = {questionLanguageId: qlId, seed: numericSeed, locale: language === "hi" ? "hi-IN" : "pa-IN"} as any;
      if (cpNumber === 1 || language === "en" && [3,4].includes(cpNumber)) {
        const result = await generateNum001EngineBatch({...request, packageId: "NUM-001", canonicalProblemId: cp, questionLanguageId: qlId, seed, count: 1, difficulty: undefined});
        questions.push({...result!.questions[0], qlId, permanentQlId: qlId, questionLanguageId: qlId, canonicalProblemId: cp, checkpointId: cp, stem: result!.questions[0].stem ?? result!.questions[0].text});
      } else if (cpNumber >= 8) {
        const provider = checkpointProviders[cpNumber]!;
        const result = await provider({...request, packageId: "NUM-002", canonicalProblemId: cp, questionLanguageId: qlId, seed, count: 1, difficulty: undefined});
        questions.push({...result.questions[0], qlId, permanentQlId: qlId, questionLanguageId: qlId, canonicalProblemId: cp, checkpointId: cp, stem: result.questions[0].stem ?? result.questions[0].text});
      } else {
        let source: any;
        if (cpNumber === 2) source = language === "en" ? runNumCp002PermanentPipeline(input) : runNumCp002LocalizedFinalPipeline(input);
        if (cpNumber === 3) source = runNumCp003LocalizedFinalV2ForQl(qlId as any, seed, language as any);
        if (cpNumber === 4) source = runNumCp004LocalizedReviewFinalForQl(qlId as any, numericSeed, language as any);
        if (cpNumber === 5) source = language === "en" ? runNumCp005PermanentPipeline(input) : generateNumCp005LocalizedQuestion(input);
        if (cpNumber === 6) source = language === "en" ? runNumCp006PermanentPipeline(input) : generateNumCp006LocalizedQuestion(input);
        if (cpNumber === 7) source = language === "en" ? runNumCp007PermanentPipeline(input) : generateNumCp007LocalizedQuestion(input);
        questions.push(normalizeQuestion(source, packageId, cp, language, seed));
      }
    }
    return {questions, generationContext: {engineId: "quant-v4", packageId, count, language, seed: batchSeed, difficultyFilterApplied: false, ...locks}};
  } catch (error) { throw Object.assign(error instanceof Error ? error : new Error(String(error)), {statusCode: 400, code: "NUMBER_SYSTEM_REQUEST_INVALID"}); }
}

const checkpointProviders: Record<number, (request: any) => Promise<any>> = {
  8: generateNumCp008QuestionStudioBatch,
  9: generateNumCp009QuestionStudioBatch,
  10: generateNumCp010QuestionStudioBatch,
  11: generateNumCp011QuestionStudioBatch,
  12: generateNumCp012QuestionStudioBatch,
  13: generateNumCp013QuestionStudioBatch,
  14: generateNumCp014QuestionStudioBatch,
};
