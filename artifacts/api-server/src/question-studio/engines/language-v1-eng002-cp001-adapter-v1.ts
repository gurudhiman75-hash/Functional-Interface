import { ENG002_CP001_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/sentence-improvement/ENG-002/CP001/eng-002-cp001-human-approval-v1";
import { generateEng002Cp001QuestionV1 } from "../../english-v1/chapters/sentence-improvement/ENG-002/CP001/eng-002-cp001-v1";
import type { EnglishDifficulty, SvaRuleId } from "../../english-v1/core/types";
import type { QuestionStudioEngineAdapter, QuestionStudioGenerationRequest, QuestionStudioGenerationResult, QuestionStudioLanguage, QuestionStudioPackageDefinition } from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const ENG002_QUESTION_STUDIO_PACKAGE_ID_V1 = "english-eng002-sentence-improvement-v1" as const;
export const ENG002_QUESTION_STUDIO_CP001_ID_V1 = "ENG-002-CP001" as const;
export const ENG002_CP001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const ENG002_CP001_REVISION_POLICY_V1 = "SOURCE_GENERATOR_ONLY" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const ruleIds: SvaRuleId[] = ["GR-SVA-001", "GR-SVA-002", "GR-SVA-003", "GR-SVA-004", "GR-SVA-005", "GR-SVA-006", "GR-SVA-007", "GR-SVA-008", "GR-SVA-009", "GR-SVA-010"];
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language || language === "en") return "en";
  throw new Error(`ENG-002 CP001 currently supports English only; ${String(language)} is not approved`);
}
function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 20) throw new Error("ENG-002 CP001 review batches require count between 1 and 20");
  return count;
}
function normalizeDifficulty(value: QuestionStudioGenerationRequest["difficulty"]): EnglishDifficulty {
  const difficulty = text(value).toLowerCase();
  if (difficulty === "easy" || difficulty === "medium" || difficulty === "hard") return difficulty;
  if (!difficulty || difficulty === "mixed") return "medium";
  throw new Error("ENG-002 CP001 difficulty must be Easy, Medium, or Hard");
}
const capitalizeDifficulty = (value: EnglishDifficulty) => `${value[0].toUpperCase()}${value.slice(1)}` as "Easy" | "Medium" | "Hard";

function normalizeRule(request: QuestionStudioGenerationRequest): SvaRuleId | undefined {
  const candidates = [request.patternId, request.canonicalProblemId, request.questionLanguageId].map((value) => text(value).toUpperCase()).filter(Boolean);
  const allowed = new Set<string>([ENG002_QUESTION_STUDIO_PACKAGE_ID_V1.toUpperCase(), ENG002_QUESTION_STUDIO_CP001_ID_V1, ...ruleIds]);
  const unknown = candidates.filter((value) => !allowed.has(value));
  if (unknown.length) throw new Error(`Unknown ENG-002 CP001 selector ${unknown[0]}`);
  const rules = candidates.filter((value): value is SvaRuleId => ruleIds.includes(value as SvaRuleId));
  if (new Set(rules).size > 1) throw new Error(`Conflicting ENG-002 CP001 rule selectors ${rules.join(", ")}`);
  return rules[0];
}

export const ENG002_CP001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "language-v1",
  packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "English",
  topic: "Sentence Improvement",
  subtopic: "Subject–Verb Agreement",
  label: "English · Sentence Improvement · ENG-002 · CP001",
  enabled: true,
  cpIds: [ENG002_QUESTION_STUDIO_CP001_ID_V1],
  supportedLanguages: ["en"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: ENG002_CP001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [ENG002_CP001_QUESTION_STUDIO_RUNTIME_MODE_V1],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
  manualApprovalRequired: lifecycle.manualApprovalRequired,
  questionBankStatus: lifecycle.questionBankStatus,
  questionBankWritable: false,
  testEligibility: lifecycle.testEligibility,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  productionReleaseAuthorized: false,
  metadata: {
    registrationAuthorityId: ENG002_CP001_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
    approvedReviewBlobSha: ENG002_CP001_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha,
    approvedGeneratorHeadSha: ENG002_CP001_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha,
    humanReviewApproved: true,
    reviewOnly: true,
    deterministicGeneration: true,
    grammarRuleIds: [...ruleIds],
    revisionPolicy: ENG002_CP001_REVISION_POLICY_V1,
    questionStudioGenerationEnabled: true,
    productionDifficultyClaimsAuthorized: false,
  },
};

export function isEng002Cp001QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = text(request.packageId).toLowerCase();
  if (packageId === ENG002_QUESTION_STUDIO_PACKAGE_ID_V1) return true;
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId].map((value) => text(value).toUpperCase());
  const topic = `${text(request.topic)} ${text(request.subtopic)}`.toLowerCase();
  return selectors.includes(ENG002_QUESTION_STUDIO_CP001_ID_V1) || selectors.some((value) => value.startsWith("GR-SVA-")) && /sentence improvement/.test(topic);
}

function underlinedSentence(question: ReturnType<typeof generateEng002Cp001QuestionV1>) {
  return question.segments.map((segment, index) => index === question.targetIndex ? `<u>${segment}</u>` : segment).join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
}

export const languageV1Eng002Cp001QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "language-v1",
  listPackages() { return [ENG002_CP001_STANDARD_REVIEW_ONLY_PACKAGE_V1]; },
  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (!isEng002Cp001QuestionStudioRequestV1(request)) throw new Error("language-v1 ENG-002 CP001 adapter requires an explicit ENG-002 CP001 selector");
    if (request.runtimeMode && request.runtimeMode !== ENG002_CP001_QUESTION_STUDIO_RUNTIME_MODE_V1) throw new Error(`ENG-002 CP001 only supports ${ENG002_CP001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const ruleId = normalizeRule(request);
    const baseSeed = request.seed?.trim() || "eng002-cp001-question-studio-approved-v1";
    const questions: Record<string, unknown>[] = [];
    for (let index = 0; index < count; index += 1) {
      const generationSeed = `${baseSeed}:${index}`;
      const question = generateEng002Cp001QuestionV1({ seed: generationSeed, difficulty, ruleId });
      const difficultyLabel = capitalizeDifficulty(question.metadata.difficulty);
      const sentence = underlinedSentence(question);
      const learnerText = [question.stem, sentence, ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`)].join("\n");
      questions.push({
        ...lifecycle,
        id: question.questionId,
        questionId: question.questionId,
        packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1,
        patternId: question.metadata.ruleId,
        cpId: ENG002_QUESTION_STUDIO_CP001_ID_V1,
        ruleId: question.metadata.ruleId,
        mutationId: question.metadata.mutationId,
        subject: "English",
        topic: "Sentence Improvement",
        subtopic: "Subject–Verb Agreement",
        language,
        locale: "en-IN",
        stem: question.stem,
        sentence,
        text: learnerText,
        targetText: question.targetText,
        targetIndex: question.targetIndex,
        options: [...question.options],
        correctIndex: question.correctOptionIndex,
        correct: question.correctOptionIndex,
        correctedSentence: question.correctedSentence,
        explanation: question.explanation,
        difficulty: difficultyLabel,
        difficultyLabel,
        dimensions: question.metadata.dimensions,
        semanticDomain: question.metadata.semanticDomain,
        generationSeed,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: ENG002_CP001_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
        authoringReviewApproved: true,
        humanReviewApproved: true,
        reviewOnly: true,
        questionStudioDiscoverable: true,
        questionStudioGenerationEnabled: true,
        runtimeRegistered: true,
        readOnly: true,
        revisionPolicy: ENG002_CP001_REVISION_POLICY_V1,
        productionReleased: false,
      });
    }
    return { questions, generationContext: {
      ...lifecycle,
      engineId: "language-v1",
      packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1,
      cpId: ENG002_QUESTION_STUDIO_CP001_ID_V1,
      runtimeMode: ENG002_CP001_QUESTION_STUDIO_RUNTIME_MODE_V1,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: ENG002_CP001_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
      approvedReviewBlobSha: ENG002_CP001_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha,
      approvedGeneratorHeadSha: ENG002_CP001_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha,
      humanReviewApproved: true,
      reviewOnly: true,
      revisionPolicy: ENG002_CP001_REVISION_POLICY_V1,
      language,
      requestedDifficulty: capitalizeDifficulty(difficulty),
      ruleSelection: ruleId ?? "DETERMINISTIC_ACROSS_ENG-002-CP001_APPROVED_RULES",
      grammarRuleIds: [...ruleIds],
      seed: baseSeed,
      count,
    } };
  },
};
