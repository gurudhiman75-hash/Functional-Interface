import { ENG003_CP001_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/grammar-fillers/ENG-003/CP001/eng-003-cp001-human-approval-v1";
import { ENG003_CP002_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/grammar-fillers/ENG-003/CP002/eng-003-cp002-human-approval-v1";
import { ENG003_CP003_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/grammar-fillers/ENG-003/CP003/eng-003-cp003-human-approval-v1";
import { ENG003_CP004_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/grammar-fillers/ENG-003/CP004/eng-003-cp004-human-approval-v1";
import { ENG003_CP005_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/grammar-fillers/ENG-003/CP005/eng-003-cp005-human-approval-v1";
import { ENG003_CP006_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/grammar-fillers/ENG-003/CP006/eng-003-cp006-human-approval-v1";
import { ENG003_CP007_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/grammar-fillers/ENG-003/CP007/eng-003-cp007-human-approval-v1";
import { generateEng003Cp001QuestionV1 } from "../../english-v1/chapters/grammar-fillers/ENG-003/CP001/eng-003-cp001-v1";
import type { EnglishDifficulty, SvaRuleId } from "../../english-v1/core/types";
import type { QuestionStudioEngineAdapter, QuestionStudioGenerationRequest, QuestionStudioGenerationResult, QuestionStudioLanguage, QuestionStudioPackageDefinition } from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const ENG003_QUESTION_STUDIO_PACKAGE_ID_V1 = "english-eng003-grammar-fillers-v1" as const;
export const ENG003_QUESTION_STUDIO_CP001_ID_V1 = "ENG-003-CP001" as const;
export const ENG003_CP001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const ENG003_CP001_REVISION_POLICY_V1 = "SOURCE_GENERATOR_ONLY" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const ruleIds: SvaRuleId[] = ["GR-SVA-001", "GR-SVA-002", "GR-SVA-003", "GR-SVA-004", "GR-SVA-005", "GR-SVA-006", "GR-SVA-007", "GR-SVA-008", "GR-SVA-009", "GR-SVA-010"];
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language || language === "en") return "en";
  throw new Error(`ENG-003 CP001 currently supports English only; ${String(language)} is not approved`);
}
function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 20) throw new Error("ENG-003 CP001 review batches require count between 1 and 20");
  return count;
}
function normalizeDifficulty(value: QuestionStudioGenerationRequest["difficulty"]): EnglishDifficulty {
  const difficulty = text(value).toLowerCase();
  if (difficulty === "easy" || difficulty === "medium" || difficulty === "hard") return difficulty;
  if (!difficulty || difficulty === "mixed") return "medium";
  throw new Error("ENG-003 CP001 difficulty must be Easy, Medium, or Hard");
}
const capitalizeDifficulty = (value: EnglishDifficulty) => `${value[0].toUpperCase()}${value.slice(1)}` as "Easy" | "Medium" | "Hard";

function normalizeRule(request: QuestionStudioGenerationRequest): SvaRuleId | undefined {
  const candidates = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);
  const allowed = new Set<string>([ENG003_QUESTION_STUDIO_PACKAGE_ID_V1.toUpperCase(), ENG003_QUESTION_STUDIO_CP001_ID_V1, ...ruleIds]);
  const unknown = candidates.filter((value) => !allowed.has(value));
  if (unknown.length) throw new Error(`Unknown ENG-003 CP001 selector ${unknown[0]}`);
  const rules = candidates.filter((value): value is SvaRuleId => ruleIds.includes(value as SvaRuleId));
  if (new Set(rules).size > 1) throw new Error(`Conflicting ENG-003 CP001 rule selectors ${rules.join(", ")}`);
  return rules[0];
}

export const ENG003_CP001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "language-v1",
  packageId: ENG003_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "English",
  topic: "Fill in the Blanks / Grammar Fillers",
  subtopic: "Approved Grammar Fillers",
  label: "English · Grammar Fillers · ENG-003 · CP001–CP007",
  enabled: true,
  cpIds: [ENG003_QUESTION_STUDIO_CP001_ID_V1, "ENG-003-CP002", "ENG-003-CP003", "ENG-003-CP004", "ENG-003-CP005", "ENG-003-CP006", "ENG-003-CP007"],
  supportedLanguages: ["en"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: ENG003_CP001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [ENG003_CP001_QUESTION_STUDIO_RUNTIME_MODE_V1],
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
    registrationAuthorityId: ENG003_CP001_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
    checkpointRegistrationAuthorityIds: [ENG003_CP001_HUMAN_EDITORIAL_APPROVAL_V1.authorityId, ENG003_CP002_HUMAN_EDITORIAL_APPROVAL_V1.authorityId, ENG003_CP003_HUMAN_EDITORIAL_APPROVAL_V1.authorityId, ENG003_CP004_HUMAN_EDITORIAL_APPROVAL_V1.authorityId, ENG003_CP005_HUMAN_EDITORIAL_APPROVAL_V1.authorityId, ENG003_CP006_HUMAN_EDITORIAL_APPROVAL_V1.authorityId, ENG003_CP007_HUMAN_EDITORIAL_APPROVAL_V1.authorityId],
    approvedReviewBlobSha: ENG003_CP001_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha,
    approvedReviewBlobShas: [ENG003_CP001_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha, ENG003_CP002_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha, ENG003_CP003_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha, ENG003_CP004_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha, ENG003_CP005_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha, ENG003_CP006_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha, ENG003_CP007_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha],
    approvedGeneratorHeadSha: ENG003_CP001_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha,
    approvedGeneratorHeadShas: [ENG003_CP001_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha, ENG003_CP002_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha, ENG003_CP003_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha, ENG003_CP004_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha, ENG003_CP005_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha, ENG003_CP006_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha, ENG003_CP007_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha],
    humanReviewApproved: true,
    reviewOnly: true,
    deterministicGeneration: true,
    grammarRuleIds: [...ruleIds, "GR-TNS-001", "GR-TNS-002", "GR-TNS-003", "GR-TNS-004", "GR-TNS-005", "GR-TNS-006", "GR-TNS-007", "GR-TNS-008", "GR-TNS-009", "GR-TNS-010", "GR-ART-001", "GR-ART-002", "GR-ART-003", "GR-ART-004", "GR-ART-005", "GR-ART-006", "GR-ART-007", "GR-ART-008", "GR-ART-009", "GR-ART-010", "GR-PRN-001", "GR-PRN-002", "GR-PRN-003", "GR-PRN-004", "GR-PRN-005", "GR-PRN-006", "GR-PRN-007", "GR-PRN-008", "GR-PRN-009", "GR-PRN-010", "GR-PRP-001", "GR-PRP-002", "GR-PRP-003", "GR-PRP-004", "GR-PRP-005", "GR-PRP-006", "GR-PRP-007", "GR-PRP-008", "GR-PRP-009", "GR-PRP-010", "GR-CMP-001", "GR-CMP-002", "GR-CMP-003", "GR-CMP-004", "GR-CMP-005", "GR-CMP-006", "GR-CMP-007", "GR-CMP-008", "GR-CMP-009", "GR-CMP-010", "GR-CON-001", "GR-CON-002", "GR-CON-003", "GR-CON-004", "GR-CON-005", "GR-CON-006", "GR-CON-007", "GR-CON-008", "GR-CON-009", "GR-CON-010"],
    revisionPolicy: ENG003_CP001_REVISION_POLICY_V1,
    questionStudioGenerationEnabled: true,
    productionDifficultyClaimsAuthorized: false,
  },
};

export function isEng003Cp001QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = text(request.packageId).toLowerCase();
  if (packageId === ENG003_QUESTION_STUDIO_PACKAGE_ID_V1) return true;
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  const topic = `${text(request.topic)} ${text(request.subtopic)}`.toLowerCase();
  if (selectors.includes(ENG003_QUESTION_STUDIO_CP001_ID_V1)) return true;
  return selectors.some((value) => value.startsWith("GR-SVA-")) && /fill|blank|grammar filler/.test(topic);
}

export const languageV1Eng003Cp001QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "language-v1",
  listPackages() { return [ENG003_CP001_STANDARD_REVIEW_ONLY_PACKAGE_V1]; },
  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (!isEng003Cp001QuestionStudioRequestV1(request)) throw new Error("language-v1 ENG-003 CP001 adapter requires an explicit ENG-003 CP001 selector");
    if (request.runtimeMode && request.runtimeMode !== ENG003_CP001_QUESTION_STUDIO_RUNTIME_MODE_V1) throw new Error(`ENG-003 CP001 only supports ${ENG003_CP001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const ruleId = normalizeRule(request);
    const baseSeed = request.seed?.trim() || "eng003-cp001-question-studio-approved-v1";
    const questions: Record<string, unknown>[] = [];
    for (let index = 0; index < count; index += 1) {
      const generationSeed = `${baseSeed}:${index}`;
      const question = generateEng003Cp001QuestionV1({ seed: generationSeed, difficulty, ruleId });
      const difficultyLabel = capitalizeDifficulty(question.metadata.difficulty);
      const learnerText = [question.stem, question.sentence, ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`)].join("\n");
      questions.push({
        ...lifecycle,
        id: question.questionId,
        questionId: question.questionId,
        packageId: ENG003_QUESTION_STUDIO_PACKAGE_ID_V1,
        patternId: question.metadata.ruleId,
        cpId: ENG003_QUESTION_STUDIO_CP001_ID_V1,
        ruleId: question.metadata.ruleId,
        mutationId: question.metadata.mutationId,
        subject: "English",
        topic: "Fill in the Blanks / Grammar Fillers",
        subtopic: "Subject–Verb Agreement",
        language,
        locale: "en-IN",
        stem: question.stem,
        sentence: question.sentence,
        text: learnerText,
        blankIndex: question.blankIndex,
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
        registrationAuthorityId: ENG003_CP001_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
        authoringReviewApproved: true,
        humanReviewApproved: true,
        reviewOnly: true,
        questionStudioDiscoverable: true,
        questionStudioGenerationEnabled: true,
        runtimeRegistered: true,
        readOnly: true,
        revisionPolicy: ENG003_CP001_REVISION_POLICY_V1,
        productionReleased: false,
      });
    }
    return { questions, generationContext: {
      ...lifecycle,
      engineId: "language-v1",
      packageId: ENG003_QUESTION_STUDIO_PACKAGE_ID_V1,
      cpId: ENG003_QUESTION_STUDIO_CP001_ID_V1,
      runtimeMode: ENG003_CP001_QUESTION_STUDIO_RUNTIME_MODE_V1,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: ENG003_CP001_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
      approvedReviewBlobSha: ENG003_CP001_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha,
      approvedGeneratorHeadSha: ENG003_CP001_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha,
      humanReviewApproved: true,
      reviewOnly: true,
      revisionPolicy: ENG003_CP001_REVISION_POLICY_V1,
      language,
      requestedDifficulty: capitalizeDifficulty(difficulty),
      ruleSelection: ruleId ?? "DETERMINISTIC_ACROSS_ENG-003-CP001_APPROVED_RULES",
      grammarRuleIds: [...ruleIds],
      seed: baseSeed,
      count,
    } };
  },
};
