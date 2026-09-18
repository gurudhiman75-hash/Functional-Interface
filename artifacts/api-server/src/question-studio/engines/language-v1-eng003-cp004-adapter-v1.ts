import { ENG003_CP004_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/grammar-fillers/ENG-003/CP004/eng-003-cp004-human-approval-v1";
import { generateEng003Cp004QuestionV1 } from "../../english-v1/chapters/grammar-fillers/ENG-003/CP004/eng-003-cp004-v1";
import type { EnglishDifficulty, PronounRuleId } from "../../english-v1/core/types";
import type { QuestionStudioEngineAdapter, QuestionStudioGenerationRequest, QuestionStudioGenerationResult, QuestionStudioLanguage } from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { ENG003_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng003-cp001-adapter-v1";

export const ENG003_QUESTION_STUDIO_CP004_ID_V1 = "ENG-003-CP004" as const;
export const ENG003_CP004_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const ENG003_CP004_REVISION_POLICY_V1 = "SOURCE_GENERATOR_ONLY" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const ruleIds: PronounRuleId[] = [
  "GR-PRN-001","GR-PRN-002","GR-PRN-003","GR-PRN-004","GR-PRN-005",
  "GR-PRN-006","GR-PRN-007","GR-PRN-008","GR-PRN-009","GR-PRN-010",
];
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language || language === "en") return "en";
  throw new Error(`ENG-003 CP004 currently supports English only; ${String(language)} is not approved`);
}
function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 20) throw new Error("ENG-003 CP004 review batches require count between 1 and 20");
  return count;
}
function normalizeDifficulty(value: QuestionStudioGenerationRequest["difficulty"]): EnglishDifficulty {
  const difficulty = text(value).toLowerCase();
  if (difficulty === "easy" || difficulty === "medium" || difficulty === "hard") return difficulty;
  if (!difficulty || difficulty === "mixed") return "medium";
  throw new Error("ENG-003 CP004 difficulty must be Easy, Medium, or Hard");
}
const capitalizeDifficulty = (value: EnglishDifficulty) => `${value[0].toUpperCase()}${value.slice(1)}` as "Easy" | "Medium" | "Hard";

function normalizeRule(request: QuestionStudioGenerationRequest): PronounRuleId | undefined {
  const candidates = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);
  const allowed = new Set<string>([ENG003_QUESTION_STUDIO_PACKAGE_ID_V1.toUpperCase(), ENG003_QUESTION_STUDIO_CP004_ID_V1, ...ruleIds]);
  const unknown = candidates.filter((value) => !allowed.has(value));
  if (unknown.length) throw new Error(`Unknown ENG-003 CP004 selector ${unknown[0]}`);
  const rules = candidates.filter((value): value is PronounRuleId => ruleIds.includes(value as PronounRuleId));
  if (new Set(rules).size > 1) throw new Error(`Conflicting ENG-003 CP004 rule selectors ${rules.join(", ")}`);
  return rules[0];
}

export function isEng003Cp004QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  if (selectors.includes(ENG003_QUESTION_STUDIO_CP004_ID_V1)) return true;
  const packageId = text(request.packageId).toLowerCase();
  const topic = `${text(request.topic)} ${text(request.subtopic)}`.toLowerCase();
  return packageId === ENG003_QUESTION_STUDIO_PACKAGE_ID_V1
    && (/pronoun/.test(topic) || selectors.some((value) => value.startsWith("GR-PRN-")));
}

export const languageV1Eng003Cp004QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "language-v1",
  listPackages() { return []; },
  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (!isEng003Cp004QuestionStudioRequestV1(request)) throw new Error("language-v1 ENG-003 CP004 adapter requires an explicit ENG-003 CP004 selector");
    if (request.runtimeMode && request.runtimeMode !== ENG003_CP004_QUESTION_STUDIO_RUNTIME_MODE_V1) throw new Error(`ENG-003 CP004 only supports ${ENG003_CP004_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const ruleId = normalizeRule(request);
    const baseSeed = request.seed?.trim() || "eng003-cp004-question-studio-approved-v1";
    const questions: Record<string, unknown>[] = [];
    for (let index = 0; index < count; index += 1) {
      const generationSeed = `${baseSeed}:${index}`;
      const question = generateEng003Cp004QuestionV1({ seed: generationSeed, difficulty, ruleId });
      const difficultyLabel = capitalizeDifficulty(question.metadata.difficulty);
      const learnerText = [question.stem, question.sentence, ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`)].join("\n");
      questions.push({
        ...lifecycle,
        id: question.questionId,
        questionId: question.questionId,
        packageId: ENG003_QUESTION_STUDIO_PACKAGE_ID_V1,
        patternId: question.metadata.ruleId,
        cpId: ENG003_QUESTION_STUDIO_CP004_ID_V1,
        ruleId: question.metadata.ruleId,
        mutationId: question.metadata.mutationId,
        subject: "English",
        topic: "Fill in the Blanks / Grammar Fillers",
        subtopic: "Pronouns",
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
        sceneId: question.metadata.sceneId,
        generationSeed,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: ENG003_CP004_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
        authoringReviewApproved: true,
        humanReviewApproved: true,
        reviewOnly: true,
        questionStudioDiscoverable: true,
        questionStudioGenerationEnabled: true,
        runtimeRegistered: true,
        readOnly: true,
        revisionPolicy: ENG003_CP004_REVISION_POLICY_V1,
        productionReleased: false,
      });
    }
    return { questions, generationContext: {
      ...lifecycle,
      engineId: "language-v1",
      packageId: ENG003_QUESTION_STUDIO_PACKAGE_ID_V1,
      cpId: ENG003_QUESTION_STUDIO_CP004_ID_V1,
      runtimeMode: ENG003_CP004_QUESTION_STUDIO_RUNTIME_MODE_V1,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: ENG003_CP004_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
      approvedReviewBlobSha: ENG003_CP004_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha,
      approvedGeneratorHeadSha: ENG003_CP004_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha,
      humanReviewApproved: true,
      reviewOnly: true,
      revisionPolicy: ENG003_CP004_REVISION_POLICY_V1,
      language,
      requestedDifficulty: capitalizeDifficulty(difficulty),
      ruleSelection: ruleId ?? "DETERMINISTIC_ACROSS_ENG-003-CP004_APPROVED_RULES",
      grammarRuleIds: [...ruleIds],
      seed: baseSeed,
      count,
    } };
  },
};
