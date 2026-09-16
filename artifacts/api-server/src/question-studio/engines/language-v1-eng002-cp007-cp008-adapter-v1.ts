import { ENG002_CP007_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/sentence-improvement/ENG-002/CP007/eng-002-cp007-human-approval-v1";
import { generateEng002Cp007QuestionV1 } from "../../english-v1/chapters/sentence-improvement/ENG-002/CP007/eng-002-cp007-v1";
import { ENG002_CP008_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/sentence-improvement/ENG-002/CP008/eng-002-cp008-human-approval-v1";
import { generateEng002Cp008QuestionV1 } from "../../english-v1/chapters/sentence-improvement/ENG-002/CP008/eng-002-cp008-v1";
import type { ConjunctionRuleId, EnglishDifficulty, NounQuantifierRuleId } from "../../english-v1/core/types";
import { CONJUNCTION_RULE_BY_ID } from "../../english-v1/grammar/conjunctions-parallelism";
import { NOUN_QUANTIFIER_RULE_BY_ID } from "../../english-v1/grammar/nouns-quantifiers";
import type { QuestionStudioEngineAdapter, QuestionStudioGenerationRequest, QuestionStudioGenerationResult, QuestionStudioLanguage, QuestionStudioPackageDefinition } from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { ENG002_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng002-cp001-adapter-v1";
import { ENG002_CP006_STANDARD_REVIEW_ONLY_PACKAGE_V1 } from "./language-v1-eng002-cp006-adapter-v1";

export const ENG002_QUESTION_STUDIO_CP007_ID_V1 = "ENG-002-CP007" as const;
export const ENG002_QUESTION_STUDIO_CP008_ID_V1 = "ENG-002-CP008" as const;
export const ENG002_CP007_CP008_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const ENG002_CP007_CP008_REVISION_POLICY_V1 = "SOURCE_GENERATOR_ONLY" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const cp007RuleIds: ConjunctionRuleId[] = ["GR-CON-001", "GR-CON-002", "GR-CON-003", "GR-CON-004", "GR-CON-005", "GR-CON-006", "GR-CON-007", "GR-CON-008", "GR-CON-009", "GR-CON-010"];
const cp008RuleIds: NounQuantifierRuleId[] = ["GR-NQN-001", "GR-NQN-002", "GR-NQN-003", "GR-NQN-004", "GR-NQN-005", "GR-NQN-006", "GR-NQN-007", "GR-NQN-008", "GR-NQN-009", "GR-NQN-010"];
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language || language === "en") return "en";
  throw new Error(`ENG-002 CP007/CP008 currently supports English only; ${String(language)} is not approved`);
}
function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 20) throw new Error("ENG-002 CP007/CP008 review batches require count between 1 and 20");
  return count;
}
function normalizeDifficulty(value: QuestionStudioGenerationRequest["difficulty"]): EnglishDifficulty {
  const difficulty = text(value).toLowerCase();
  if (difficulty === "easy" || difficulty === "medium" || difficulty === "hard") return difficulty;
  if (!difficulty || difficulty === "mixed") return "medium";
  throw new Error("ENG-002 CP007/CP008 difficulty must be Easy, Medium, or Hard");
}
const capitalizeDifficulty = (value: EnglishDifficulty) => `${value[0]!.toUpperCase()}${value.slice(1)}` as "Easy" | "Medium" | "Hard";
const selectors = (request: QuestionStudioGenerationRequest) => [request.patternId, request.canonicalProblemId, request.questionLanguageId].map((value) => text(value).toUpperCase()).filter(Boolean);

export function isEng002Cp007QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const values = selectors(request);
  const topic = `${text(request.topic)} ${text(request.subtopic)}`.toLowerCase();
  const packageId = text(request.packageId).toLowerCase();
  return values.includes(ENG002_QUESTION_STUDIO_CP007_ID_V1)
    || values.some((value) => value.startsWith("GR-CON-"))
    || (packageId === ENG002_QUESTION_STUDIO_PACKAGE_ID_V1 && /(conjunction|parallel)/.test(topic));
}
export function isEng002Cp008QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const values = selectors(request);
  const topic = `${text(request.topic)} ${text(request.subtopic)}`.toLowerCase();
  const packageId = text(request.packageId).toLowerCase();
  return values.includes(ENG002_QUESTION_STUDIO_CP008_ID_V1)
    || values.some((value) => value.startsWith("GR-NQN-"))
    || (packageId === ENG002_QUESTION_STUDIO_PACKAGE_ID_V1 && /(noun|quantifier)/.test(topic));
}

function normalizeCp007Rule(request: QuestionStudioGenerationRequest, difficulty: EnglishDifficulty): ConjunctionRuleId | undefined {
  const values = selectors(request);
  const allowed = new Set<string>([ENG002_QUESTION_STUDIO_CP007_ID_V1, ...cp007RuleIds]);
  const unknown = values.filter((value) => !allowed.has(value));
  if (unknown.length) throw new Error(`Unknown ENG-002 CP007 selector ${unknown[0]}`);
  const rules = values.filter((value): value is ConjunctionRuleId => cp007RuleIds.includes(value as ConjunctionRuleId));
  if (new Set(rules).size > 1) throw new Error(`Conflicting ENG-002 CP007 rule selectors ${rules.join(", ")}`);
  const ruleId = rules[0];
  if (ruleId && !CONJUNCTION_RULE_BY_ID[ruleId].allowedDifficulties.includes(difficulty)) throw new Error(`${ruleId} does not support ${difficulty}`);
  return ruleId;
}
function normalizeCp008Rule(request: QuestionStudioGenerationRequest, difficulty: EnglishDifficulty): NounQuantifierRuleId | undefined {
  const values = selectors(request);
  const allowed = new Set<string>([ENG002_QUESTION_STUDIO_CP008_ID_V1, ...cp008RuleIds]);
  const unknown = values.filter((value) => !allowed.has(value));
  if (unknown.length) throw new Error(`Unknown ENG-002 CP008 selector ${unknown[0]}`);
  const rules = values.filter((value): value is NounQuantifierRuleId => cp008RuleIds.includes(value as NounQuantifierRuleId));
  if (new Set(rules).size > 1) throw new Error(`Conflicting ENG-002 CP008 rule selectors ${rules.join(", ")}`);
  const ruleId = rules[0];
  if (ruleId && !NOUN_QUANTIFIER_RULE_BY_ID[ruleId].allowedDifficulties.includes(difficulty)) throw new Error(`${ruleId} does not support ${difficulty}`);
  return ruleId;
}

const priorMetadata = (ENG002_CP006_STANDARD_REVIEW_ONLY_PACKAGE_V1.metadata ?? {}) as Record<string, unknown>;
const priorRuleIds = Array.isArray(priorMetadata.grammarRuleIds) ? priorMetadata.grammarRuleIds : [];
const priorAuthorities = priorMetadata.registrationAuthorities && typeof priorMetadata.registrationAuthorities === "object" ? priorMetadata.registrationAuthorities as Record<string, unknown> : {};
const cpIds = ["ENG-002-CP001", "ENG-002-CP002", "ENG-002-CP003", "ENG-002-CP004", "ENG-002-CP005", "ENG-002-CP006", ENG002_QUESTION_STUDIO_CP007_ID_V1, ENG002_QUESTION_STUDIO_CP008_ID_V1];

export const ENG002_CP008_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  ...ENG002_CP006_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  subtopic: "Subject–Verb Agreement + Tenses + Articles and Determiners + Pronouns + Prepositions + Adjectives, Adverbs and Comparison + Conjunctions and Parallelism + Nouns and Quantifiers",
  label: "English · Sentence Improvement · ENG-002 · CP001–CP008",
  cpIds,
  metadata: {
    ...priorMetadata,
    registrationAuthorityId: "ENG-002-HUMAN-APPROVED-CHECKPOINTS-V1",
    registrationAuthorities: {
      ...priorAuthorities,
      "ENG-002-CP007": ENG002_CP007_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
      "ENG-002-CP008": ENG002_CP008_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
    },
    humanReviewApproved: true,
    reviewOnly: true,
    deterministicGeneration: true,
    grammarRuleIds: [...priorRuleIds, ...cp007RuleIds, ...cp008RuleIds],
    cpIds,
    revisionPolicy: ENG002_CP007_CP008_REVISION_POLICY_V1,
    questionStudioGenerationEnabled: true,
    productionDifficultyClaimsAuthorized: false,
  },
};

function underlinedSentence(question: { segments: readonly string[]; targetIndex: number }) {
  return question.segments.map((segment, index) => index === question.targetIndex ? `<u>${segment}</u>` : segment).join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
}

export const languageV1Eng002Cp007Cp008QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "language-v1",
  listPackages() { return [ENG002_CP008_STANDARD_REVIEW_ONLY_PACKAGE_V1]; },
  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const cp007 = isEng002Cp007QuestionStudioRequestV1(request);
    const cp008 = isEng002Cp008QuestionStudioRequestV1(request);
    if (cp007 === cp008) throw new Error("language-v1 ENG-002 CP007/CP008 adapter requires one explicit CP007/CP008 grammar selector");
    if (request.runtimeMode && request.runtimeMode !== ENG002_CP007_CP008_QUESTION_STUDIO_RUNTIME_MODE_V1) throw new Error(`ENG-002 CP007/CP008 only supports ${ENG002_CP007_CP008_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const baseSeed = request.seed?.trim() || (cp007 ? "eng002-cp007-question-studio-approved-v1" : "eng002-cp008-question-studio-approved-v1");
    const questions: Record<string, unknown>[] = [];

    if (cp007) {
      const ruleId = normalizeCp007Rule(request, difficulty);
      for (let index = 0; index < count; index += 1) {
        const generationSeed = `${baseSeed}:${index}`;
        const question = generateEng002Cp007QuestionV1({ seed: generationSeed, difficulty, ruleId });
        const difficultyLabel = capitalizeDifficulty(question.metadata.difficulty);
        const sentence = underlinedSentence(question);
        const learnerText = [question.stem, sentence, ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`)].join("\n");
        questions.push({
          ...lifecycle, id: question.questionId, questionId: question.questionId,
          packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1, patternId: question.metadata.ruleId,
          cpId: ENG002_QUESTION_STUDIO_CP007_ID_V1, ruleId: question.metadata.ruleId,
          mutationId: question.metadata.mutationId, subject: "English", topic: "Sentence Improvement",
          subtopic: "Conjunctions and Parallelism", language, locale: "en-IN", stem: question.stem,
          sentence, text: learnerText, targetText: question.targetText, targetIndex: question.targetIndex,
          options: [...question.options], correctIndex: question.correctOptionIndex, correct: question.correctOptionIndex,
          correctedSentence: question.correctedSentence, explanation: question.explanation, difficulty: difficultyLabel,
          difficultyLabel, dimensions: question.metadata.dimensions, semanticDomain: question.metadata.semanticDomain,
          generationSeed, registrationStatus: "REGISTERED_REVIEW_ONLY",
          registrationAuthorityId: ENG002_CP007_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
          authoringReviewApproved: true, humanReviewApproved: true, reviewOnly: true,
          questionStudioDiscoverable: true, questionStudioGenerationEnabled: true, runtimeRegistered: true,
          readOnly: true, revisionPolicy: ENG002_CP007_CP008_REVISION_POLICY_V1, productionReleased: false,
        });
      }
      return { questions, generationContext: {
        ...lifecycle, engineId: "language-v1", packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1,
        cpId: ENG002_QUESTION_STUDIO_CP007_ID_V1, runtimeMode: ENG002_CP007_CP008_QUESTION_STUDIO_RUNTIME_MODE_V1,
        registrationStatus: "REGISTERED_REVIEW_ONLY", registrationAuthorityId: ENG002_CP007_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
        approvedReviewBlobSha: ENG002_CP007_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha,
        approvedGeneratorHeadSha: ENG002_CP007_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha,
        humanReviewApproved: true, reviewOnly: true, revisionPolicy: ENG002_CP007_CP008_REVISION_POLICY_V1,
        language, requestedDifficulty: capitalizeDifficulty(difficulty), ruleSelection: ruleId ?? "DETERMINISTIC_ACROSS_ENG-002-CP007_APPROVED_RULES",
        grammarRuleIds: [...cp007RuleIds], seed: baseSeed, count,
      } };
    }

    const ruleId = normalizeCp008Rule(request, difficulty);
    for (let index = 0; index < count; index += 1) {
      const generationSeed = `${baseSeed}:${index}`;
      const question = generateEng002Cp008QuestionV1({ seed: generationSeed, difficulty, ruleId });
      const difficultyLabel = capitalizeDifficulty(question.metadata.difficulty);
      const sentence = underlinedSentence(question);
      const learnerText = [question.stem, sentence, ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`)].join("\n");
      questions.push({
        ...lifecycle, id: question.questionId, questionId: question.questionId,
        packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1, patternId: question.metadata.ruleId,
        cpId: ENG002_QUESTION_STUDIO_CP008_ID_V1, ruleId: question.metadata.ruleId,
        mutationId: question.metadata.mutationId, subject: "English", topic: "Sentence Improvement",
        subtopic: "Nouns and Quantifiers", language, locale: "en-IN", stem: question.stem,
        sentence, text: learnerText, targetText: question.targetText, targetIndex: question.targetIndex,
        options: [...question.options], correctIndex: question.correctOptionIndex, correct: question.correctOptionIndex,
        correctedSentence: question.correctedSentence, explanation: question.explanation, difficulty: difficultyLabel,
        difficultyLabel, dimensions: question.metadata.dimensions, semanticDomain: question.metadata.semanticDomain,
        generationSeed, registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: ENG002_CP008_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
        authoringReviewApproved: true, humanReviewApproved: true, reviewOnly: true,
        questionStudioDiscoverable: true, questionStudioGenerationEnabled: true, runtimeRegistered: true,
        readOnly: true, revisionPolicy: ENG002_CP007_CP008_REVISION_POLICY_V1, productionReleased: false,
      });
    }
    return { questions, generationContext: {
      ...lifecycle, engineId: "language-v1", packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1,
      cpId: ENG002_QUESTION_STUDIO_CP008_ID_V1, runtimeMode: ENG002_CP007_CP008_QUESTION_STUDIO_RUNTIME_MODE_V1,
      registrationStatus: "REGISTERED_REVIEW_ONLY", registrationAuthorityId: ENG002_CP008_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
      approvedReviewBlobSha: ENG002_CP008_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha,
      approvedGeneratorHeadSha: ENG002_CP008_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha,
      humanReviewApproved: true, reviewOnly: true, revisionPolicy: ENG002_CP007_CP008_REVISION_POLICY_V1,
      language, requestedDifficulty: capitalizeDifficulty(difficulty), ruleSelection: ruleId ?? "DETERMINISTIC_ACROSS_ENG-002-CP008_APPROVED_RULES",
      grammarRuleIds: [...cp008RuleIds], seed: baseSeed, count,
    } };
  },
};
