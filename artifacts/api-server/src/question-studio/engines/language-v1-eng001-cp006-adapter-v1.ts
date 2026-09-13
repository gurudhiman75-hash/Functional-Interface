import { ENG001_CP006_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/error-spotting/ENG-001/CP006/eng-001-cp006-human-approval-v1";
import { generateEng001Cp006QuestionV1 } from "../../english-v1/chapters/error-spotting/ENG-001/CP006/eng-001-cp006-v1";
import type {
  ComparisonRuleId,
  Eng001QlId,
  Eng001Question,
  EnglishDifficulty,
} from "../../english-v1/core/types";
import { COMPARISON_RULE_BY_ID } from "../../english-v1/grammar/comparison";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { ENG001_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng001-adapter-v1";
import { ENG001_CP005_STANDARD_REVIEW_ONLY_PACKAGE_V1 } from "./language-v1-eng001-cp005-adapter-v1";

export const ENG001_QUESTION_STUDIO_CP006_ID_V1 = "ENG-001-CP006" as const;
export const ENG001_CP006_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const ENG001_CP006_REVISION_POLICY_V1 = "SOURCE_GENERATOR_ONLY" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const qlIds: Eng001QlId[] = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"];
const comparisonRuleIds: ComparisonRuleId[] = [
  "GR-CMP-001", "GR-CMP-002", "GR-CMP-003", "GR-CMP-004", "GR-CMP-005",
  "GR-CMP-006", "GR-CMP-007", "GR-CMP-008", "GR-CMP-009", "GR-CMP-010",
];

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language || language === "en") return "en";
  throw new Error(`ENG-001 CP006 currently supports English only; ${String(language)} is not approved`);
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("ENG-001 CP006 review batches require count between 1 and 50");
  }
  return count;
}

function normalizeDifficulty(value: QuestionStudioGenerationRequest["difficulty"]): EnglishDifficulty {
  const difficulty = text(value).toLowerCase();
  if (difficulty === "easy" || difficulty === "medium" || difficulty === "hard") return difficulty;
  if (!difficulty || difficulty === "mixed") return "medium";
  throw new Error("ENG-001 CP006 difficulty must be Easy, Medium, or Hard");
}

function capitalizeDifficulty(value: EnglishDifficulty) {
  return `${value[0].toUpperCase()}${value.slice(1)}` as "Easy" | "Medium" | "Hard";
}

function normalizeSelectors(request: QuestionStudioGenerationRequest) {
  const candidates = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);
  const qlMatches = candidates.filter((value): value is Eng001QlId => qlIds.includes(value as Eng001QlId));
  const cpMatches = candidates.filter((value) => value === ENG001_QUESTION_STUDIO_CP006_ID_V1);
  const ruleMatches = candidates.filter((value): value is ComparisonRuleId => comparisonRuleIds.includes(value as ComparisonRuleId));
  const allowed = new Set<string>([
    ENG001_QUESTION_STUDIO_PACKAGE_ID_V1,
    ENG001_QUESTION_STUDIO_CP006_ID_V1,
    ...qlIds,
    ...comparisonRuleIds,
  ]);
  const unknown = candidates.filter((value) => !allowed.has(value));
  if (unknown.length) throw new Error(`Unknown ENG-001 CP006 selector ${unknown[0]}`);
  if (new Set(qlMatches).size > 1) throw new Error(`Conflicting ENG-001 CP006 QL selectors ${qlMatches.join(", ")}`);
  if (new Set(cpMatches).size > 1) throw new Error(`Conflicting ENG-001 CP006 checkpoint selectors ${cpMatches.join(", ")}`);
  if (new Set(ruleMatches).size > 1) throw new Error(`Conflicting ENG-001 CP006 rule selectors ${ruleMatches.join(", ")}`);
  return { qlId: qlMatches[0], ruleId: ruleMatches[0] };
}

function assertRuleDifficultyCompatibility(ruleId: ComparisonRuleId | undefined, difficulty: EnglishDifficulty) {
  if (!ruleId) return;
  const rule = COMPARISON_RULE_BY_ID[ruleId];
  if (rule.allowedDifficulties.includes(difficulty)) return;
  throw new Error(
    `${ruleId} is not approved for ${capitalizeDifficulty(difficulty)} difficulty; allowed: ${rule.allowedDifficulties.map(capitalizeDifficulty).join(", ")}`,
  );
}

function learnerOptions(question: Eng001Question) {
  return [
    ...question.segments,
    ...(question.options.includes("No error") ? ["No error"] : []),
  ];
}

function learnerText(stem: string, options: readonly string[]) {
  return [stem, ...options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`)].join("\n");
}

const priorMetadata = (ENG001_CP005_STANDARD_REVIEW_ONLY_PACKAGE_V1.metadata ?? {}) as Record<string, unknown>;
const priorAuthorities = (priorMetadata.registrationAuthorities ?? {}) as Record<string, unknown>;
const priorRuleIds = Array.isArray(priorMetadata.grammarRuleIds) ? priorMetadata.grammarRuleIds : [];
const priorCpIds = Array.isArray(ENG001_CP005_STANDARD_REVIEW_ONLY_PACKAGE_V1.cpIds)
  ? ENG001_CP005_STANDARD_REVIEW_ONLY_PACKAGE_V1.cpIds
  : [];

export const ENG001_CP006_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  ...ENG001_CP005_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  label: "English · Error Spotting · ENG-001 · CP001–CP006",
  cpIds: [...priorCpIds, ENG001_QUESTION_STUDIO_CP006_ID_V1],
  metadata: {
    ...priorMetadata,
    registrationAuthorityId: "ENG-001-HUMAN-APPROVED-CHECKPOINTS-V1",
    registrationAuthorities: {
      ...priorAuthorities,
      [ENG001_QUESTION_STUDIO_CP006_ID_V1]: ENG001_CP006_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
    },
    humanReviewApproved: true,
    reviewOnly: true,
    deterministicGeneration: true,
    grammarRuleIds: [...priorRuleIds, ...comparisonRuleIds],
    cpIds: [...priorCpIds, ENG001_QUESTION_STUDIO_CP006_ID_V1],
    revisionPolicy: ENG001_CP006_REVISION_POLICY_V1,
    questionStudioGenerationEnabled: true,
    productionDifficultyClaimsAuthorized: false,
  },
};

export function isEng001Cp006QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId && packageId !== ENG001_QUESTION_STUDIO_PACKAGE_ID_V1) return false;
  const subtopic = text(request.subtopic).toLowerCase();
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  return (
    selectors.includes(ENG001_QUESTION_STUDIO_CP006_ID_V1) ||
    selectors.some((value) => value.startsWith("GR-CMP-")) ||
    subtopic.includes("adjective") ||
    subtopic.includes("adverb") ||
    subtopic.includes("comparison")
  );
}

export const languageV1Eng001Cp006QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "language-v1",

  listPackages() {
    return [ENG001_CP006_STANDARD_REVIEW_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (!isEng001Cp006QuestionStudioRequestV1(request)) {
      throw new Error("language-v1 ENG-001 CP006 adapter requires an explicit CP006/adjective/adverb/comparison selector");
    }
    if (request.runtimeMode && request.runtimeMode !== ENG001_CP006_QUESTION_STUDIO_RUNTIME_MODE_V1) {
      throw new Error(`ENG-001 CP006 only supports ${ENG001_CP006_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const { qlId, ruleId } = normalizeSelectors(request);
    assertRuleDifficultyCompatibility(ruleId, difficulty);
    const baseSeed = request.seed?.trim() || "eng001-cp006-question-studio-approved-v1";
    const questions: Record<string, unknown>[] = [];
    const usedCandidateIds = new Set<string>();

    for (let index = 0; index < count; index += 1) {
      let accepted: Eng001Question | null = null;
      let acceptedSeed = "";
      for (let attempt = 0; attempt < 2_000; attempt += 1) {
        const seed = `${baseSeed}:${index}:${attempt}`;
        const generated = generateEng001Cp006QuestionV1({ seed, difficulty, qlId, ruleId });
        if (usedCandidateIds.has(generated.metadata.candidateId)) continue;
        usedCandidateIds.add(generated.metadata.candidateId);
        accepted = generated;
        acceptedSeed = seed;
        break;
      }
      if (!accepted) throw new Error(`ENG-001-CP006 could not produce ${count} distinct review questions`);

      const options = learnerOptions(accepted);
      const difficultyLabel = capitalizeDifficulty(accepted.metadata.difficulty);
      questions.push({
        ...lifecycle,
        id: accepted.questionId,
        questionId: accepted.questionId,
        packageId: ENG001_QUESTION_STUDIO_PACKAGE_ID_V1,
        patternId: accepted.metadata.qlId,
        qlId: accepted.metadata.qlId,
        cpId: ENG001_QUESTION_STUDIO_CP006_ID_V1,
        ruleId: accepted.metadata.ruleId,
        mutationId: accepted.metadata.mutationId,
        subject: "English",
        topic: "Error Spotting",
        subtopic: "Adjectives, Adverbs and Comparison",
        language,
        locale: "en-IN",
        stem: accepted.stem,
        text: learnerText(accepted.stem, options),
        segments: [...accepted.segments],
        options,
        correctIndex: accepted.correctOptionIndex,
        correct: accepted.correctOptionIndex,
        answerSegment: accepted.metadata.answerSegment,
        correctedSentence: accepted.correctedSentence,
        explanation: accepted.explanation,
        difficulty: difficultyLabel,
        difficultyLabel,
        dimensions: accepted.metadata.dimensions,
        candidateId: accepted.metadata.candidateId,
        generationSeed: acceptedSeed,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: ENG001_CP006_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
        authoringReviewApproved: true,
        humanReviewApproved: true,
        reviewOnly: true,
        questionStudioDiscoverable: true,
        questionStudioGenerationEnabled: true,
        runtimeRegistered: true,
        readOnly: true,
        revisionPolicy: ENG001_CP006_REVISION_POLICY_V1,
        productionReleased: false,
        questionStudioReview: {
          ...lifecycle,
          registrationStatus: "REGISTERED_REVIEW_ONLY" as const,
          registrationAuthorityId: ENG001_CP006_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
          runtimeMode: ENG001_CP006_QUESTION_STUDIO_RUNTIME_MODE_V1,
          authoringReviewApproved: true,
          humanReviewApproved: true,
          reviewOnly: true,
          deterministicGeneration: true,
          revisionPolicy: ENG001_CP006_REVISION_POLICY_V1,
          productionDifficultyClaimAuthorized: false,
        },
      });
    }

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "language-v1",
        packageId: ENG001_QUESTION_STUDIO_PACKAGE_ID_V1,
        cpId: ENG001_QUESTION_STUDIO_CP006_ID_V1,
        runtimeMode: ENG001_CP006_QUESTION_STUDIO_RUNTIME_MODE_V1,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: ENG001_CP006_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
        approvedReviewBlobSha: ENG001_CP006_HUMAN_EDITORIAL_APPROVAL_V1.approvedReviewBlobSha,
        approvedGeneratorHeadSha: ENG001_CP006_HUMAN_EDITORIAL_APPROVAL_V1.approvedGeneratorHeadSha,
        authoringReviewApproved: true,
        humanReviewApproved: true,
        reviewOnly: true,
        deterministicGeneration: true,
        revisionPolicy: ENG001_CP006_REVISION_POLICY_V1,
        language,
        requestedDifficulty: capitalizeDifficulty(difficulty),
        difficultyFilterApplied: true,
        productionDifficultyClaimAuthorized: false,
        qlSelection: qlId ?? "DETERMINISTIC_ACROSS_APPROVED_QLS",
        ruleSelection: ruleId ?? "DETERMINISTIC_ACROSS_ENG-001-CP006_APPROVED_RULES",
        permanentQlIds: [...qlIds],
        grammarRuleIds: [...comparisonRuleIds],
        seed: baseSeed,
        count,
      },
    };
  },
};
