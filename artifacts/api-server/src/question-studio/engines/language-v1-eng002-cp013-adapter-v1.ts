import { ENG002_CP013_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/sentence-improvement/ENG-002/CP013/eng-002-cp013-human-approval-v1";
import { generateEng002Cp013QuestionV1 } from "../../english-v1/chapters/sentence-improvement/ENG-002/CP013/eng-002-cp013-v1";
import type { EnglishDifficulty } from "../../english-v1/core/types";
import { IDIOMATIC_USAGE_RULE_BY_ID, type IdiomaticUsageRuleId } from "../../english-v1/grammar/idiomatic-usage";
import type { QuestionStudioEngineAdapter, QuestionStudioGenerationRequest, QuestionStudioGenerationResult, QuestionStudioLanguage, QuestionStudioPackageDefinition } from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { ENG002_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng002-cp001-adapter-v1";
import { ENG002_CP012_STANDARD_REVIEW_ONLY_PACKAGE_V1 } from "./language-v1-eng002-cp012-adapter-v1";

export const ENG002_QUESTION_STUDIO_CP013_ID_V1 = "ENG-002-CP013" as const;
export const ENG002_CP013_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const ENG002_CP013_REVISION_POLICY_V1 = "SOURCE_GENERATOR_ONLY" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const ruleIds: IdiomaticUsageRuleId[] = [
  "GR-USG-001", "GR-USG-002", "GR-USG-003", "GR-USG-004", "GR-USG-005",
  "GR-USG-006", "GR-USG-007", "GR-USG-008", "GR-USG-009",
];
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language || language === "en") return "en";
  throw new Error(`ENG-002 CP013 currently supports English only; ${String(language)} is not approved`);
}
function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 20) throw new Error("ENG-002 CP013 review batches require count between 1 and 20");
  return count;
}
function normalizeDifficulty(value: QuestionStudioGenerationRequest["difficulty"]): EnglishDifficulty {
  const difficulty = text(value).toLowerCase();
  if (difficulty === "easy" || difficulty === "medium" || difficulty === "hard") return difficulty;
  if (!difficulty || difficulty === "mixed") return "medium";
  throw new Error("ENG-002 CP013 difficulty must be Easy, Medium, or Hard");
}
const capitalizeDifficulty = (value: EnglishDifficulty) => `${value[0]!.toUpperCase()}${value.slice(1)}` as "Easy" | "Medium" | "Hard";
function normalizeRule(request: QuestionStudioGenerationRequest, difficulty: EnglishDifficulty): IdiomaticUsageRuleId | undefined {
  const candidates = [request.patternId, request.canonicalProblemId, request.questionLanguageId].map((value) => text(value).toUpperCase()).filter(Boolean);
  const allowed = new Set<string>([ENG002_QUESTION_STUDIO_CP013_ID_V1, ...ruleIds]);
  const unknown = candidates.filter((value) => !allowed.has(value));
  if (unknown.length) throw new Error(`Unknown ENG-002 CP013 selector ${unknown[0]}`);
  const rules = candidates.filter((value): value is IdiomaticUsageRuleId => ruleIds.includes(value as IdiomaticUsageRuleId));
  if (new Set(rules).size > 1) throw new Error(`Conflicting ENG-002 CP013 rule selectors ${rules.join(", ")}`);
  const ruleId = rules[0];
  if (ruleId && !IDIOMATIC_USAGE_RULE_BY_ID[ruleId].allowedDifficulties.includes(difficulty)) throw new Error(`${ruleId} does not support ${difficulty}`);
  return ruleId;
}

const priorMetadata = (ENG002_CP012_STANDARD_REVIEW_ONLY_PACKAGE_V1.metadata ?? {}) as Record<string, unknown>;
const priorRuleIds = Array.isArray(priorMetadata.grammarRuleIds) ? priorMetadata.grammarRuleIds : [];
const priorAuthorities = priorMetadata.registrationAuthorities && typeof priorMetadata.registrationAuthorities === "object" ? priorMetadata.registrationAuthorities as Record<string, unknown> : {};
const cpIds = [
  "ENG-002-CP001", "ENG-002-CP002", "ENG-002-CP003", "ENG-002-CP004", "ENG-002-CP005",
  "ENG-002-CP006", "ENG-002-CP007", "ENG-002-CP008", "ENG-002-CP009", "ENG-002-CP010",
  "ENG-002-CP011", "ENG-002-CP012", ENG002_QUESTION_STUDIO_CP013_ID_V1,
];

export const ENG002_CP013_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  ...ENG002_CP012_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  subtopic: "Subject–Verb Agreement + Tenses + Articles and Determiners + Pronouns + Prepositions + Adjectives, Adverbs and Comparison + Conjunctions and Parallelism + Nouns and Quantifiers + Gerunds, Infinitives and Participles + Modifiers and Placement + Conditionals + Voice and Narration + Common Usage and Idiomatic Grammar",
  label: "English · Sentence Improvement · ENG-002 · CP001–CP013",
  cpIds,
  metadata: {
    ...priorMetadata,
    registrationAuthorityId: "ENG-002-HUMAN-APPROVED-CHECKPOINTS-V1",
    registrationAuthorities: { ...priorAuthorities, "ENG-002-CP013": ENG002_CP013_HUMAN_EDITORIAL_APPROVAL_V1.authorityId },
    humanReviewApproved: true,
    reviewOnly: true,
    deterministicGeneration: true,
    grammarRuleIds: [...priorRuleIds, ...ruleIds],
    cpIds,
    revisionPolicy: ENG002_CP013_REVISION_POLICY_V1,
    questionStudioGenerationEnabled: true,
    productionDifficultyClaimsAuthorized: false,
  },
};

export function isEng002Cp013QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId].map((value) => text(value).toUpperCase());
  const topic = `${text(request.topic)} ${text(request.subtopic)}`.toLowerCase();
  const packageId = text(request.packageId).toLowerCase();
  return selectors.includes(ENG002_QUESTION_STUDIO_CP013_ID_V1)
    || selectors.some((value) => value.startsWith("GR-USG-"))
    || (packageId === ENG002_QUESTION_STUDIO_PACKAGE_ID_V1 && /(idiomatic|common usage|fixed usage|prefer|senior|junior|different|capable|insist|prevent|despite|spite|no sooner|hardly|scarcely)/.test(topic));
}
function underlinedSentence(question: ReturnType<typeof generateEng002Cp013QuestionV1>) {
  return question.segments
    .map((segment, index) => {
      if (index !== question.targetIndex) return segment;
      const punctuation = segment.match(/([,.;:!?]+)$/)?.[1] ?? "";
      const body = punctuation ? segment.slice(0, -punctuation.length) : segment;
      return `<u>${body}</u>${punctuation}`;
    })
    .join(" ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export const languageV1Eng002Cp013QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "language-v1",
  listPackages() { return [ENG002_CP013_STANDARD_REVIEW_ONLY_PACKAGE_V1]; },
  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (!isEng002Cp013QuestionStudioRequestV1(request)) throw new Error("language-v1 ENG-002 CP013 adapter requires an explicit CP013/common-usage selector");
    if (request.runtimeMode && request.runtimeMode !== ENG002_CP013_QUESTION_STUDIO_RUNTIME_MODE_V1) throw new Error(`ENG-002 CP013 only supports ${ENG002_CP013_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const ruleId = normalizeRule(request, difficulty);
    const baseSeed = request.seed?.trim() || "eng002-cp013-question-studio-approved-v1";
    const questions: Record<string, unknown>[] = [];
    for (let index = 0; index < count; index += 1) {
      const generationSeed = `${baseSeed}:${index}`;
      const question = generateEng002Cp013QuestionV1({ seed: generationSeed, difficulty, ruleId });
      const difficultyLabel = capitalizeDifficulty(question.metadata.difficulty);
      const sentence = underlinedSentence(question);
      const learnerText = [question.stem, sentence, ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`)].join("\n");
      questions.push({
        ...lifecycle, id: question.questionId, questionId: question.questionId,
        packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1, patternId: question.metadata.ruleId,
        cpId: ENG002_QUESTION_STUDIO_CP013_ID_V1, ruleId: question.metadata.ruleId,
        mutationId: question.metadata.mutationId, subject: "English", topic: "Sentence Improvement",
        subtopic: "Common Usage / Idiomatic Grammar", language, locale: "en-IN", stem: question.stem,
        sentence, text: learnerText, targetText: question.targetText, targetIndex: question.targetIndex,
        options: [...question.options], correctIndex: question.correctOptionIndex, correct: question.correctOptionIndex,
        correctedSentence: question.correctedSentence, explanation: question.explanation, difficulty: difficultyLabel,
        difficultyLabel, dimensions: question.metadata.dimensions, semanticDomain: question.metadata.semanticDomain,
        generationSeed, registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: ENG002_CP013_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
        authoringReviewApproved: true, humanReviewApproved: true, reviewOnly: true,
        questionStudioDiscoverable: true, questionStudioGenerationEnabled: true, runtimeRegistered: true,
        readOnly: true, revisionPolicy: ENG002_CP013_REVISION_POLICY_V1, productionReleased: false,
      });
    }
    return { questions, generationContext: {
      ...lifecycle, engineId: "language-v1", packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1,
      cpId: ENG002_QUESTION_STUDIO_CP013_ID_V1, runtimeMode: ENG002_CP013_QUESTION_STUDIO_RUNTIME_MODE_V1,
      registrationStatus: "REGISTERED_REVIEW_ONLY", registrationAuthorityId: ENG002_CP013_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
      approvedReviewBlobSha: ENG002_CP013_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha,
      approvedGeneratorHeadSha: ENG002_CP013_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha,
      humanReviewApproved: true, reviewOnly: true, revisionPolicy: ENG002_CP013_REVISION_POLICY_V1,
      language, requestedDifficulty: capitalizeDifficulty(difficulty), ruleSelection: ruleId ?? "DETERMINISTIC_ACROSS_ENG-002-CP013_APPROVED_RULES",
      grammarRuleIds: [...ruleIds], seed: baseSeed, count,
    } };
  },
};
