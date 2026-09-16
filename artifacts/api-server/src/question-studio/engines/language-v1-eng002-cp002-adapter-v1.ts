import { ENG002_CP002_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/sentence-improvement/ENG-002/CP002/eng-002-cp002-human-approval-v1";
import { generateEng002Cp002QuestionV1 } from "../../english-v1/chapters/sentence-improvement/ENG-002/CP002/eng-002-cp002-v1";
import type { EnglishDifficulty, TenseRuleId } from "../../english-v1/core/types";
import { TENSE_SEQUENCE_RULE_BY_ID } from "../../english-v1/grammar/tenses-sequence";
import type { QuestionStudioEngineAdapter, QuestionStudioGenerationRequest, QuestionStudioGenerationResult, QuestionStudioLanguage, QuestionStudioPackageDefinition } from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { ENG002_CP001_STANDARD_REVIEW_ONLY_PACKAGE_V1, ENG002_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng002-cp001-adapter-v1";

export const ENG002_QUESTION_STUDIO_CP002_ID_V1 = "ENG-002-CP002" as const;
export const ENG002_CP002_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const ENG002_CP002_REVISION_POLICY_V1 = "SOURCE_GENERATOR_ONLY" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const ruleIds: TenseRuleId[] = ["GR-TNS-001", "GR-TNS-002", "GR-TNS-003", "GR-TNS-004", "GR-TNS-005", "GR-TNS-006", "GR-TNS-007", "GR-TNS-008", "GR-TNS-009", "GR-TNS-010"];
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language || language === "en") return "en";
  throw new Error(`ENG-002 CP002 currently supports English only; ${String(language)} is not approved`);
}
function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 20) throw new Error("ENG-002 CP002 review batches require count between 1 and 20");
  return count;
}
function normalizeDifficulty(value: QuestionStudioGenerationRequest["difficulty"]): EnglishDifficulty {
  const difficulty = text(value).toLowerCase();
  if (difficulty === "easy" || difficulty === "medium" || difficulty === "hard") return difficulty;
  if (!difficulty || difficulty === "mixed") return "medium";
  throw new Error("ENG-002 CP002 difficulty must be Easy, Medium, or Hard");
}
const capitalizeDifficulty = (value: EnglishDifficulty) => `${value[0].toUpperCase()}${value.slice(1)}` as "Easy" | "Medium" | "Hard";
function normalizeRule(request: QuestionStudioGenerationRequest, difficulty: EnglishDifficulty): TenseRuleId | undefined {
  const candidates = [request.patternId, request.canonicalProblemId, request.questionLanguageId].map((value) => text(value).toUpperCase()).filter(Boolean);
  const allowed = new Set<string>([ENG002_QUESTION_STUDIO_CP002_ID_V1, ...ruleIds]);
  const unknown = candidates.filter((value) => !allowed.has(value));
  if (unknown.length) throw new Error(`Unknown ENG-002 CP002 selector ${unknown[0]}`);
  const rules = candidates.filter((value): value is TenseRuleId => ruleIds.includes(value as TenseRuleId));
  if (new Set(rules).size > 1) throw new Error(`Conflicting ENG-002 CP002 rule selectors ${rules.join(", ")}`);
  const ruleId = rules[0];
  if (ruleId && !TENSE_SEQUENCE_RULE_BY_ID[ruleId].allowedDifficulties.includes(difficulty)) throw new Error(`${ruleId} does not support ${difficulty}`);
  return ruleId;
}

const priorMetadata = (ENG002_CP001_STANDARD_REVIEW_ONLY_PACKAGE_V1.metadata ?? {}) as Record<string, unknown>;
const priorRuleIds = Array.isArray(priorMetadata.grammarRuleIds) ? priorMetadata.grammarRuleIds : [];
export const ENG002_CP002_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  ...ENG002_CP001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  subtopic: "Subject–Verb Agreement + Tenses and Sequence of Tenses",
  label: "English · Sentence Improvement · ENG-002 · CP001–CP002",
  cpIds: ["ENG-002-CP001", ENG002_QUESTION_STUDIO_CP002_ID_V1],
  metadata: {
    ...priorMetadata,
    registrationAuthorityId: "ENG-002-HUMAN-APPROVED-CHECKPOINTS-V1",
    registrationAuthorities: {
      "ENG-002-CP002": ENG002_CP002_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
    },
    humanReviewApproved: true,
    reviewOnly: true,
    deterministicGeneration: true,
    grammarRuleIds: [...priorRuleIds, ...ruleIds],
    cpIds: ["ENG-002-CP001", ENG002_QUESTION_STUDIO_CP002_ID_V1],
    revisionPolicy: ENG002_CP002_REVISION_POLICY_V1,
    questionStudioGenerationEnabled: true,
    productionDifficultyClaimsAuthorized: false,
  },
};

export function isEng002Cp002QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId].map((value) => text(value).toUpperCase());
  const topic = `${text(request.topic)} ${text(request.subtopic)}`.toLowerCase();
  const packageId = text(request.packageId).toLowerCase();
  return selectors.includes(ENG002_QUESTION_STUDIO_CP002_ID_V1)
    || selectors.some((value) => value.startsWith("GR-TNS-"))
    || (packageId === ENG002_QUESTION_STUDIO_PACKAGE_ID_V1 && /tense/.test(topic));
}
function underlinedSentence(question: ReturnType<typeof generateEng002Cp002QuestionV1>) {
  return question.segments.map((segment, index) => index === question.targetIndex ? `<u>${segment}</u>` : segment).join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
}

export const languageV1Eng002Cp002QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "language-v1",
  listPackages() { return [ENG002_CP002_STANDARD_REVIEW_ONLY_PACKAGE_V1]; },
  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (!isEng002Cp002QuestionStudioRequestV1(request)) throw new Error("language-v1 ENG-002 CP002 adapter requires an explicit CP002/tense selector");
    if (request.runtimeMode && request.runtimeMode !== ENG002_CP002_QUESTION_STUDIO_RUNTIME_MODE_V1) throw new Error(`ENG-002 CP002 only supports ${ENG002_CP002_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const ruleId = normalizeRule(request, difficulty);
    const baseSeed = request.seed?.trim() || "eng002-cp002-question-studio-approved-v1";
    const questions: Record<string, unknown>[] = [];
    for (let index = 0; index < count; index += 1) {
      const generationSeed = `${baseSeed}:${index}`;
      const question = generateEng002Cp002QuestionV1({ seed: generationSeed, difficulty, ruleId });
      const difficultyLabel = capitalizeDifficulty(question.metadata.difficulty);
      const sentence = underlinedSentence(question);
      const learnerText = [question.stem, sentence, ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`)].join("\n");
      questions.push({
        ...lifecycle, id: question.questionId, questionId: question.questionId,
        packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1, patternId: question.metadata.ruleId,
        cpId: ENG002_QUESTION_STUDIO_CP002_ID_V1, ruleId: question.metadata.ruleId,
        mutationId: question.metadata.mutationId, subject: "English", topic: "Sentence Improvement",
        subtopic: "Tenses and Sequence of Tenses", language, locale: "en-IN", stem: question.stem,
        sentence, text: learnerText, targetText: question.targetText, targetIndex: question.targetIndex,
        options: [...question.options], correctIndex: question.correctOptionIndex, correct: question.correctOptionIndex,
        correctedSentence: question.correctedSentence, explanation: question.explanation, difficulty: difficultyLabel,
        difficultyLabel, dimensions: question.metadata.dimensions, semanticDomain: question.metadata.semanticDomain,
        generationSeed, registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: ENG002_CP002_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
        authoringReviewApproved: true, humanReviewApproved: true, reviewOnly: true,
        questionStudioDiscoverable: true, questionStudioGenerationEnabled: true, runtimeRegistered: true,
        readOnly: true, revisionPolicy: ENG002_CP002_REVISION_POLICY_V1, productionReleased: false,
      });
    }
    return { questions, generationContext: {
      ...lifecycle, engineId: "language-v1", packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1,
      cpId: ENG002_QUESTION_STUDIO_CP002_ID_V1, runtimeMode: ENG002_CP002_QUESTION_STUDIO_RUNTIME_MODE_V1,
      registrationStatus: "REGISTERED_REVIEW_ONLY", registrationAuthorityId: ENG002_CP002_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
      approvedReviewBlobSha: ENG002_CP002_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha,
      approvedGeneratorHeadSha: ENG002_CP002_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha,
      humanReviewApproved: true, reviewOnly: true, revisionPolicy: ENG002_CP002_REVISION_POLICY_V1,
      language, requestedDifficulty: capitalizeDifficulty(difficulty), ruleSelection: ruleId ?? "DETERMINISTIC_ACROSS_ENG-002-CP002_APPROVED_RULES",
      grammarRuleIds: [...ruleIds], seed: baseSeed, count,
    } };
  },
};
