import { ENG001_CP009_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/error-spotting/ENG-001/CP009/eng-001-cp009-human-approval-v1";
import { generateEng001Cp009QuestionV1 } from "../../english-v1/chapters/error-spotting/ENG-001/CP009/eng-001-cp009-v1";
import type { Eng001QlId, Eng001Question, EnglishDifficulty, GerundInfinitiveParticipleRuleId } from "../../english-v1/core/types";
import { GERUND_INFINITIVE_PARTICIPLE_RULE_BY_ID } from "../../english-v1/grammar/gerunds-infinitives-participles";
import type { QuestionStudioEngineAdapter, QuestionStudioGenerationRequest, QuestionStudioGenerationResult, QuestionStudioLanguage, QuestionStudioPackageDefinition } from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { ENG001_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng001-adapter-v1";
import { ENG001_CP008_STANDARD_REVIEW_ONLY_PACKAGE_V1 } from "./language-v1-eng001-cp008-adapter-v1";

export const ENG001_QUESTION_STUDIO_CP009_ID_V1 = "ENG-001-CP009" as const;
export const ENG001_CP009_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const ENG001_CP009_REVISION_POLICY_V1 = "SOURCE_GENERATOR_ONLY" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const qlIds: Eng001QlId[] = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"];
const gipRuleIds: GerundInfinitiveParticipleRuleId[] = [
  "GR-GIP-001", "GR-GIP-002", "GR-GIP-003", "GR-GIP-004", "GR-GIP-005",
  "GR-GIP-006", "GR-GIP-007", "GR-GIP-008", "GR-GIP-009", "GR-GIP-010",
];

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language || language === "en") return "en";
  throw new Error(`ENG-001 CP009 currently supports English only; ${String(language)} is not approved`);
}
function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 20) throw new Error("ENG-001 CP009 review batches require count between 1 and 20");
  return count;
}
function normalizeDifficulty(value: QuestionStudioGenerationRequest["difficulty"]): EnglishDifficulty {
  const difficulty = text(value).toLowerCase();
  if (difficulty === "easy" || difficulty === "medium" || difficulty === "hard") return difficulty;
  if (!difficulty || difficulty === "mixed") return "medium";
  throw new Error("ENG-001 CP009 difficulty must be Easy, Medium, or Hard");
}
const capitalizeDifficulty = (value: EnglishDifficulty) => `${value[0].toUpperCase()}${value.slice(1)}` as "Easy" | "Medium" | "Hard";
function normalizeSelectors(request: QuestionStudioGenerationRequest) {
  const candidates = [request.patternId, request.canonicalProblemId, request.questionLanguageId].map((value) => text(value).toUpperCase()).filter(Boolean);
  const qlMatches = candidates.filter((value): value is Eng001QlId => qlIds.includes(value as Eng001QlId));
  const ruleMatches = candidates.filter((value): value is GerundInfinitiveParticipleRuleId => gipRuleIds.includes(value as GerundInfinitiveParticipleRuleId));
  const allowed = new Set<string>([ENG001_QUESTION_STUDIO_PACKAGE_ID_V1, ENG001_QUESTION_STUDIO_CP009_ID_V1, ...qlIds, ...gipRuleIds]);
  const unknown = candidates.filter((value) => !allowed.has(value));
  if (unknown.length) throw new Error(`Unknown ENG-001 CP009 selector ${unknown[0]}`);
  if (new Set(qlMatches).size > 1) throw new Error(`Conflicting ENG-001 CP009 QL selectors ${qlMatches.join(", ")}`);
  if (new Set(ruleMatches).size > 1) throw new Error(`Conflicting ENG-001 CP009 rule selectors ${ruleMatches.join(", ")}`);
  return { qlId: qlMatches[0], ruleId: ruleMatches[0] };
}
function assertRuleDifficultyCompatibility(ruleId: GerundInfinitiveParticipleRuleId | undefined, difficulty: EnglishDifficulty) {
  if (!ruleId) return;
  const rule = GERUND_INFINITIVE_PARTICIPLE_RULE_BY_ID[ruleId];
  if (rule.allowedDifficulties.includes(difficulty)) return;
  throw new Error(`${ruleId} is not approved for ${capitalizeDifficulty(difficulty)} difficulty`);
}
const learnerOptions = (question: Eng001Question) => [...question.segments, ...(question.options.includes("No error") ? ["No error"] : [])];
const learnerText = (stem: string, options: readonly string[]) => [stem, ...options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`)].join("\n");

const priorMetadata = (ENG001_CP008_STANDARD_REVIEW_ONLY_PACKAGE_V1.metadata ?? {}) as Record<string, unknown>;
const priorAuthorities = (priorMetadata.registrationAuthorities ?? {}) as Record<string, unknown>;
const priorRuleIds = Array.isArray(priorMetadata.grammarRuleIds) ? priorMetadata.grammarRuleIds : [];
const priorCpIds = Array.isArray(ENG001_CP008_STANDARD_REVIEW_ONLY_PACKAGE_V1.cpIds) ? ENG001_CP008_STANDARD_REVIEW_ONLY_PACKAGE_V1.cpIds : [];

export const ENG001_CP009_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  ...ENG001_CP008_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  label: "English · Error Spotting · ENG-001 · CP001–CP009",
  cpIds: [...priorCpIds, ENG001_QUESTION_STUDIO_CP009_ID_V1],
  metadata: {
    ...priorMetadata,
    registrationAuthorityId: "ENG-001-HUMAN-APPROVED-CHECKPOINTS-V1",
    registrationAuthorities: { ...priorAuthorities, [ENG001_QUESTION_STUDIO_CP009_ID_V1]: ENG001_CP009_HUMAN_EDITORIAL_APPROVAL_V1.authorityId },
    humanReviewApproved: true,
    reviewOnly: true,
    deterministicGeneration: true,
    grammarRuleIds: [...priorRuleIds, ...gipRuleIds],
    cpIds: [...priorCpIds, ENG001_QUESTION_STUDIO_CP009_ID_V1],
    revisionPolicy: ENG001_CP009_REVISION_POLICY_V1,
    questionStudioGenerationEnabled: true,
    productionDifficultyClaimsAuthorized: false,
  },
};

export function isEng001Cp009QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId && packageId !== ENG001_QUESTION_STUDIO_PACKAGE_ID_V1) return false;
  const subtopic = text(request.subtopic).toLowerCase();
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId].map((value) => text(value).toUpperCase());
  const hasGipSubtopic = /\bgerunds?\b/.test(subtopic) || /\binfinitives?\b/.test(subtopic) || /\bparticiples?\b/.test(subtopic);
  return selectors.includes(ENG001_QUESTION_STUDIO_CP009_ID_V1) || selectors.some((value) => value.startsWith("GR-GIP-")) || hasGipSubtopic;
}

export const languageV1Eng001Cp009QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "language-v1",
  listPackages() { return [ENG001_CP009_STANDARD_REVIEW_ONLY_PACKAGE_V1]; },
  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (!isEng001Cp009QuestionStudioRequestV1(request)) throw new Error("language-v1 ENG-001 CP009 adapter requires an explicit CP009/gerund/infinitive/participle selector");
    if (request.runtimeMode && request.runtimeMode !== ENG001_CP009_QUESTION_STUDIO_RUNTIME_MODE_V1) throw new Error(`ENG-001 CP009 only supports ${ENG001_CP009_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const { qlId, ruleId } = normalizeSelectors(request);
    assertRuleDifficultyCompatibility(ruleId, difficulty);
    const baseSeed = request.seed?.trim() || "eng001-cp009-question-studio-approved-v1";
    const questions: Record<string, unknown>[] = [];
    const usedCandidateIds = new Set<string>();
    for (let index = 0; index < count; index += 1) {
      let accepted: Eng001Question | null = null;
      let acceptedSeed = "";
      for (let attempt = 0; attempt < 2_000; attempt += 1) {
        const seed = `${baseSeed}:${index}:${attempt}`;
        const generated = generateEng001Cp009QuestionV1({ seed, difficulty, qlId, ruleId });
        if (usedCandidateIds.has(generated.metadata.candidateId)) continue;
        usedCandidateIds.add(generated.metadata.candidateId);
        accepted = generated;
        acceptedSeed = seed;
        break;
      }
      if (!accepted) throw new Error(`ENG-001-CP009 could not produce ${count} distinct review questions`);
      const options = learnerOptions(accepted);
      const difficultyLabel = capitalizeDifficulty(accepted.metadata.difficulty);
      questions.push({
        ...lifecycle, id: accepted.questionId, questionId: accepted.questionId, packageId: ENG001_QUESTION_STUDIO_PACKAGE_ID_V1,
        patternId: accepted.metadata.qlId, qlId: accepted.metadata.qlId, cpId: ENG001_QUESTION_STUDIO_CP009_ID_V1,
        ruleId: accepted.metadata.ruleId, mutationId: accepted.metadata.mutationId, subject: "English", topic: "Error Spotting",
        subtopic: "Gerunds, Infinitives & Participles", language, locale: "en-IN", stem: accepted.stem, text: learnerText(accepted.stem, options),
        segments: [...accepted.segments], options, correctIndex: accepted.correctOptionIndex, correct: accepted.correctOptionIndex,
        answerSegment: accepted.metadata.answerSegment, correctedSentence: accepted.correctedSentence, explanation: accepted.explanation,
        difficulty: difficultyLabel, difficultyLabel, dimensions: accepted.metadata.dimensions, candidateId: accepted.metadata.candidateId,
        generationSeed: acceptedSeed, registrationStatus: "REGISTERED_REVIEW_ONLY", registrationAuthorityId: ENG001_CP009_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
        authoringReviewApproved: true, humanReviewApproved: true, reviewOnly: true, questionStudioDiscoverable: true, questionStudioGenerationEnabled: true,
        runtimeRegistered: true, readOnly: true, revisionPolicy: ENG001_CP009_REVISION_POLICY_V1, productionReleased: false,
        questionStudioReview: { ...lifecycle, registrationStatus: "REGISTERED_REVIEW_ONLY" as const, registrationAuthorityId: ENG001_CP009_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
          runtimeMode: ENG001_CP009_QUESTION_STUDIO_RUNTIME_MODE_V1, authoringReviewApproved: true, humanReviewApproved: true, reviewOnly: true,
          deterministicGeneration: true, revisionPolicy: ENG001_CP009_REVISION_POLICY_V1, productionDifficultyClaimAuthorized: false },
      });
    }
    return { questions, generationContext: {
      ...lifecycle, engineId: "language-v1", packageId: ENG001_QUESTION_STUDIO_PACKAGE_ID_V1, cpId: ENG001_QUESTION_STUDIO_CP009_ID_V1,
      runtimeMode: ENG001_CP009_QUESTION_STUDIO_RUNTIME_MODE_V1, registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: ENG001_CP009_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
      approvedReviewBlobSha: ENG001_CP009_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha,
      approvedGeneratorHeadSha: ENG001_CP009_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha,
      authoringReviewApproved: true, humanReviewApproved: true, reviewOnly: true, deterministicGeneration: true,
      revisionPolicy: ENG001_CP009_REVISION_POLICY_V1, language, requestedDifficulty: capitalizeDifficulty(difficulty), difficultyFilterApplied: true,
      productionDifficultyClaimAuthorized: false, qlSelection: qlId ?? "DETERMINISTIC_ACROSS_APPROVED_QLS",
      ruleSelection: ruleId ?? "DETERMINISTIC_ACROSS_ENG-001-CP009_APPROVED_RULES", permanentQlIds: [...qlIds], grammarRuleIds: [...gipRuleIds], seed: baseSeed, count,
    } };
  },
};
