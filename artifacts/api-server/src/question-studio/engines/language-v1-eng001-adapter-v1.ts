import { generateEng001Cp001QuestionV4 } from "../../english-v1/chapters/error-spotting/ENG-001/CP001/eng-001-cp001-v4";
import { ENG001_CP001_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/error-spotting/ENG-001/CP001/eng-001-cp001-human-approval-v1";
import { generateEng001Cp002QuestionV1 } from "../../english-v1/chapters/error-spotting/ENG-001/CP002/eng-001-cp002-v1";
import { ENG001_CP002_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/error-spotting/ENG-001/CP002/eng-001-cp002-human-approval-v1";
import { generateEng001Cp003QuestionV1 } from "../../english-v1/chapters/error-spotting/ENG-001/CP003/eng-001-cp003-v1";
import { ENG001_CP003_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/error-spotting/ENG-001/CP003/eng-001-cp003-human-approval-v1";
import type {
  ArticleRuleId,
  Eng001CpId,
  Eng001QlId,
  Eng001Question,
  EnglishDifficulty,
  GrammarRuleId,
  SvaRuleId,
  TenseRuleId,
} from "../../english-v1/core/types";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const ENG001_QUESTION_STUDIO_PACKAGE_ID_V1 = "ENG-001" as const;
export const ENG001_QUESTION_STUDIO_CP001_ID_V1 = "ENG-001-CP001" as const;
export const ENG001_QUESTION_STUDIO_CP002_ID_V1 = "ENG-001-CP002" as const;
export const ENG001_QUESTION_STUDIO_CP003_ID_V1 = "ENG-001-CP003" as const;
/** @deprecated Use the CP-specific constants. Retained for CP001 callers. */
export const ENG001_QUESTION_STUDIO_CP_ID_V1 = ENG001_QUESTION_STUDIO_CP001_ID_V1;
export const ENG001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const ENG001_REVISION_POLICY_V1 = "SOURCE_GENERATOR_ONLY" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const supportedLanguages: QuestionStudioLanguage[] = ["en"];
const supportedDifficulties = ["Easy", "Medium", "Hard"] as const;
const qlIds: Eng001QlId[] = ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"];
const cpIds: Eng001CpId[] = [
  ENG001_QUESTION_STUDIO_CP001_ID_V1,
  ENG001_QUESTION_STUDIO_CP002_ID_V1,
  ENG001_QUESTION_STUDIO_CP003_ID_V1,
];

const svaRuleIds: SvaRuleId[] = [
  "GR-SVA-001", "GR-SVA-002", "GR-SVA-003", "GR-SVA-004", "GR-SVA-005",
  "GR-SVA-006", "GR-SVA-007", "GR-SVA-008", "GR-SVA-009", "GR-SVA-010",
];
const tenseRuleIds: TenseRuleId[] = [
  "GR-TNS-001", "GR-TNS-002", "GR-TNS-003", "GR-TNS-004", "GR-TNS-005",
  "GR-TNS-006", "GR-TNS-007", "GR-TNS-008", "GR-TNS-009", "GR-TNS-010",
];
const articleRuleIds: ArticleRuleId[] = [
  "GR-ART-001", "GR-ART-002", "GR-ART-003", "GR-ART-004", "GR-ART-005",
  "GR-ART-006", "GR-ART-007", "GR-ART-008", "GR-ART-009", "GR-ART-010",
];
const ruleIds: GrammarRuleId[] = [...svaRuleIds, ...tenseRuleIds, ...articleRuleIds];

const difficultiesByRule: Record<GrammarRuleId, readonly EnglishDifficulty[]> = {
  "GR-SVA-001": ["easy"],
  "GR-SVA-002": ["easy", "medium"],
  "GR-SVA-003": ["easy", "medium"],
  "GR-SVA-004": ["medium", "hard"],
  "GR-SVA-005": ["medium", "hard"],
  "GR-SVA-006": ["medium", "hard"],
  "GR-SVA-007": ["medium", "hard"],
  "GR-SVA-008": ["medium", "hard"],
  "GR-SVA-009": ["medium", "hard"],
  "GR-SVA-010": ["medium", "hard"],
  "GR-TNS-001": ["easy", "medium"],
  "GR-TNS-002": ["medium", "hard"],
  "GR-TNS-003": ["easy", "medium"],
  "GR-TNS-004": ["easy", "medium"],
  "GR-TNS-005": ["medium"],
  "GR-TNS-006": ["easy", "medium"],
  "GR-TNS-007": ["medium", "hard"],
  "GR-TNS-008": ["medium", "hard"],
  "GR-TNS-009": ["medium"],
  "GR-TNS-010": ["medium"],
  "GR-ART-001": ["easy", "medium"],
  "GR-ART-002": ["easy", "medium", "hard"],
  "GR-ART-003": ["easy", "medium"],
  "GR-ART-004": ["medium", "hard"],
  "GR-ART-005": ["medium", "hard"],
  "GR-ART-006": ["easy", "medium"],
  "GR-ART-007": ["hard"],
  "GR-ART-008": ["medium", "hard"],
  "GR-ART-009": ["medium", "hard"],
  "GR-ART-010": ["medium", "hard"],
};

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language || language === "en") return "en";
  throw new Error(`ENG-001 currently supports English only; ${String(language)} is not approved`);
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("ENG-001 review batches require count between 1 and 50");
  }
  return count;
}

function normalizeDifficulty(value: QuestionStudioGenerationRequest["difficulty"]): EnglishDifficulty {
  const difficulty = text(value).toLowerCase();
  if (difficulty === "easy" || difficulty === "medium" || difficulty === "hard") return difficulty;
  if (!difficulty || difficulty === "mixed") return "medium";
  throw new Error("ENG-001 difficulty must be Easy, Medium, or Hard");
}

function capitalizeDifficulty(value: EnglishDifficulty) {
  return `${value[0].toUpperCase()}${value.slice(1)}` as "Easy" | "Medium" | "Hard";
}

function cpForRule(ruleId: GrammarRuleId): Eng001CpId {
  if (ruleId.startsWith("GR-TNS-")) return ENG001_QUESTION_STUDIO_CP002_ID_V1;
  if (ruleId.startsWith("GR-ART-")) return ENG001_QUESTION_STUDIO_CP003_ID_V1;
  return ENG001_QUESTION_STUDIO_CP001_ID_V1;
}

function cpForSubtopic(subtopic: string): Eng001CpId | undefined {
  const normalized = subtopic.toLowerCase().replace(/[–—]/g, "-");
  if (!normalized) return undefined;
  if (normalized.includes("subject-verb agreement")) return ENG001_QUESTION_STUDIO_CP001_ID_V1;
  if (normalized.includes("tense")) return ENG001_QUESTION_STUDIO_CP002_ID_V1;
  if (normalized.includes("article") || normalized.includes("determiner")) return ENG001_QUESTION_STUDIO_CP003_ID_V1;
  return undefined;
}

function normalizeSelectors(request: QuestionStudioGenerationRequest) {
  const candidates = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);
  const qlMatches = candidates.filter((value): value is Eng001QlId => qlIds.includes(value as Eng001QlId));
  const cpMatches = candidates.filter((value): value is Eng001CpId => cpIds.includes(value as Eng001CpId));
  const ruleMatches = candidates.filter((value): value is GrammarRuleId => ruleIds.includes(value as GrammarRuleId));
  const unknown = candidates.filter(
    (value) =>
      value !== ENG001_QUESTION_STUDIO_PACKAGE_ID_V1 &&
      !qlIds.includes(value as Eng001QlId) &&
      !cpIds.includes(value as Eng001CpId) &&
      !ruleIds.includes(value as GrammarRuleId),
  );
  if (unknown.length) throw new Error(`Unknown ENG-001 selector ${unknown[0]}`);
  if (new Set(qlMatches).size > 1) throw new Error(`Conflicting ENG-001 QL selectors ${qlMatches.join(", ")}`);
  if (new Set(cpMatches).size > 1) throw new Error(`Conflicting ENG-001 CP selectors ${cpMatches.join(", ")}`);
  if (new Set(ruleMatches).size > 1) throw new Error(`Conflicting ENG-001 rule selectors ${ruleMatches.join(", ")}`);

  const ruleId = ruleMatches[0];
  const explicitCp = cpMatches[0];
  const ruleCp = ruleId ? cpForRule(ruleId) : undefined;
  const subtopicCp = cpForSubtopic(text(request.subtopic));
  const requestedCps = [explicitCp, ruleCp, subtopicCp].filter(Boolean) as Eng001CpId[];
  if (new Set(requestedCps).size > 1) {
    throw new Error(`Conflicting ENG-001 checkpoint selectors ${requestedCps.join(", ")}`);
  }

  const cpId = requestedCps[0] ?? ENG001_QUESTION_STUDIO_CP001_ID_V1;
  return { qlId: qlMatches[0], ruleId, cpId };
}

function assertRuleDifficultyCompatibility(ruleId: GrammarRuleId | undefined, difficulty: EnglishDifficulty) {
  if (!ruleId) return;
  const allowed = difficultiesByRule[ruleId];
  if (allowed.includes(difficulty)) return;
  throw new Error(
    `${ruleId} is not approved for ${capitalizeDifficulty(difficulty)} difficulty; allowed: ${allowed.map(capitalizeDifficulty).join(", ")}`,
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

function cpAuthority(cpId: Eng001CpId) {
  if (cpId === ENG001_QUESTION_STUDIO_CP003_ID_V1) return ENG001_CP003_HUMAN_EDITORIAL_APPROVAL_V1;
  if (cpId === ENG001_QUESTION_STUDIO_CP002_ID_V1) return ENG001_CP002_HUMAN_EDITORIAL_APPROVAL_V1;
  return ENG001_CP001_HUMAN_EDITORIAL_APPROVAL_V1;
}

function cpSubtopic(cpId: Eng001CpId) {
  if (cpId === ENG001_QUESTION_STUDIO_CP003_ID_V1) return "Articles and Determiners";
  if (cpId === ENG001_QUESTION_STUDIO_CP002_ID_V1) return "Tenses and Sequence of Tenses";
  return "Subject–Verb Agreement";
}

function cpRuleIds(cpId: Eng001CpId): readonly GrammarRuleId[] {
  if (cpId === ENG001_QUESTION_STUDIO_CP003_ID_V1) return articleRuleIds;
  if (cpId === ENG001_QUESTION_STUDIO_CP002_ID_V1) return tenseRuleIds;
  return svaRuleIds;
}

function generateForCp(input: {
  cpId: Eng001CpId;
  seed: string;
  difficulty: EnglishDifficulty;
  qlId?: Eng001QlId;
  ruleId?: GrammarRuleId;
}): Eng001Question {
  if (input.cpId === ENG001_QUESTION_STUDIO_CP003_ID_V1) {
    return generateEng001Cp003QuestionV1({
      seed: input.seed,
      difficulty: input.difficulty,
      qlId: input.qlId,
      ruleId: input.ruleId as ArticleRuleId | undefined,
    });
  }
  if (input.cpId === ENG001_QUESTION_STUDIO_CP002_ID_V1) {
    return generateEng001Cp002QuestionV1({
      seed: input.seed,
      difficulty: input.difficulty,
      qlId: input.qlId,
      ruleId: input.ruleId as TenseRuleId | undefined,
    });
  }
  return generateEng001Cp001QuestionV4({
    seed: input.seed,
    difficulty: input.difficulty,
    qlId: input.qlId,
    ruleId: input.ruleId as SvaRuleId | undefined,
  });
}

export const ENG001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "language-v1",
  packageId: ENG001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "English",
  topic: "Error Spotting",
  subtopic: "Approved grammar checkpoints",
  label: "English · Error Spotting · ENG-001 · CP001–CP003",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages,
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: ENG001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [ENG001_QUESTION_STUDIO_RUNTIME_MODE_V1],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
  manualApprovalRequired: lifecycle.manualApprovalRequired,
  questionBankStatus: lifecycle.questionBankStatus,
  questionBankWritable: lifecycle.questionBankWritable,
  questionBankAcceptanceMode: lifecycle.questionBankAcceptanceMode ?? undefined,
  questionBankAcceptanceAuthority: lifecycle.questionBankAcceptanceAuthority,
  testEligibility: lifecycle.testEligibility,
  testEligible: lifecycle.testEligible,
  mockTestEligible: lifecycle.mockTestEligible,
  publiclyPublishable: lifecycle.publiclyPublishable,
  automaticStudentPublication: lifecycle.automaticStudentPublication,
  productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  metadata: {
    ...lifecycle,
    registrationAuthorityId: "ENG-001-HUMAN-APPROVED-CHECKPOINTS-V1",
    registrationAuthorities: {
      [ENG001_QUESTION_STUDIO_CP001_ID_V1]: ENG001_CP001_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
      [ENG001_QUESTION_STUDIO_CP002_ID_V1]: ENG001_CP002_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
      [ENG001_QUESTION_STUDIO_CP003_ID_V1]: ENG001_CP003_HUMAN_EDITORIAL_APPROVAL_V1.authorityId,
    },
    humanReviewApproved: true,
    reviewOnly: true,
    deterministicGeneration: true,
    permanentQlIds: [...qlIds],
    grammarRuleIds: [...ruleIds],
    cpIds: [...cpIds],
    revisionPolicy: ENG001_REVISION_POLICY_V1,
    questionStudioGenerationEnabled: true,
    productionDifficultyClaimsAuthorized: false,
  },
};

export function isEng001QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId) return packageId === ENG001_QUESTION_STUDIO_PACKAGE_ID_V1;
  const subject = text(request.subject).toLowerCase();
  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  return (
    selectors.some((value) =>
      value.startsWith("ENG-001") ||
      value.startsWith("GR-SVA-") ||
      value.startsWith("GR-TNS-") ||
      value.startsWith("GR-ART-"),
    ) ||
    (subject === "english" && topic === "error spotting" && (
      subtopic.includes("subject") ||
      subtopic.includes("tense") ||
      subtopic.includes("article") ||
      subtopic.includes("determiner") ||
      subtopic === ""
    ))
  );
}

export const languageV1Eng001QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "language-v1",

  listPackages() {
    return [ENG001_STANDARD_REVIEW_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = text(request.packageId).toUpperCase();
    if (packageId && packageId !== ENG001_QUESTION_STUDIO_PACKAGE_ID_V1) {
      throw new Error(`language-v1 ENG-001 adapter cannot generate package ${String(request.packageId)}`);
    }
    if (request.runtimeMode && request.runtimeMode !== ENG001_QUESTION_STUDIO_RUNTIME_MODE_V1) {
      throw new Error(`ENG-001 only supports ${ENG001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const { qlId, ruleId, cpId } = normalizeSelectors(request);
    assertRuleDifficultyCompatibility(ruleId, difficulty);
    const authority = cpAuthority(cpId);
    const subtopic = cpSubtopic(cpId);
    const baseSeed = request.seed?.trim() || `eng001-${cpId.toLowerCase()}-question-studio-approved-v1`;
    const questions: Record<string, unknown>[] = [];
    const usedCandidateIds = new Set<string>();

    for (let index = 0; index < count; index += 1) {
      let accepted: Eng001Question | null = null;
      let acceptedSeed = "";
      for (let attempt = 0; attempt < 2_000; attempt += 1) {
        const seed = `${baseSeed}:${index}:${attempt}`;
        const generated = generateForCp({ cpId, seed, difficulty, qlId, ruleId });
        if (usedCandidateIds.has(generated.metadata.candidateId)) continue;
        usedCandidateIds.add(generated.metadata.candidateId);
        accepted = generated;
        acceptedSeed = seed;
        break;
      }
      if (!accepted) throw new Error(`${cpId} could not produce ${count} distinct review questions`);

      const options = learnerOptions(accepted);
      const difficultyLabel = capitalizeDifficulty(accepted.metadata.difficulty);
      questions.push({
        ...lifecycle,
        id: accepted.questionId,
        questionId: accepted.questionId,
        packageId: ENG001_QUESTION_STUDIO_PACKAGE_ID_V1,
        patternId: accepted.metadata.qlId,
        qlId: accepted.metadata.qlId,
        cpId,
        ruleId: accepted.metadata.ruleId,
        mutationId: accepted.metadata.mutationId,
        subject: "English",
        topic: "Error Spotting",
        subtopic,
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
        registrationAuthorityId: authority.authorityId,
        authoringReviewApproved: true,
        humanReviewApproved: true,
        reviewOnly: true,
        questionStudioDiscoverable: true,
        questionStudioGenerationEnabled: true,
        runtimeRegistered: true,
        readOnly: true,
        revisionPolicy: ENG001_REVISION_POLICY_V1,
        productionReleased: false,
        questionStudioReview: {
          ...lifecycle,
          registrationStatus: "REGISTERED_REVIEW_ONLY" as const,
          registrationAuthorityId: authority.authorityId,
          runtimeMode: ENG001_QUESTION_STUDIO_RUNTIME_MODE_V1,
          authoringReviewApproved: true,
          humanReviewApproved: true,
          reviewOnly: true,
          deterministicGeneration: true,
          revisionPolicy: ENG001_REVISION_POLICY_V1,
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
        cpId,
        runtimeMode: ENG001_QUESTION_STUDIO_RUNTIME_MODE_V1,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: authority.authorityId,
        approvedReviewBlobSha: authority.approvedReviewBlobSha,
        approvedGeneratorHeadSha: authority.approvedGeneratorHeadSha,
        authoringReviewApproved: true,
        humanReviewApproved: true,
        reviewOnly: true,
        deterministicGeneration: true,
        revisionPolicy: ENG001_REVISION_POLICY_V1,
        language,
        requestedDifficulty: capitalizeDifficulty(difficulty),
        difficultyFilterApplied: true,
        productionDifficultyClaimAuthorized: false,
        qlSelection: qlId ?? "DETERMINISTIC_ACROSS_APPROVED_QLS",
        ruleSelection: ruleId ?? `DETERMINISTIC_ACROSS_${cpId}_APPROVED_RULES`,
        permanentQlIds: [...qlIds],
        grammarRuleIds: [...cpRuleIds(cpId)],
        seed: baseSeed,
        count,
      },
    };
  },
};
