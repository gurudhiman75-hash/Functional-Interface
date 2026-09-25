import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
} from "../../punjabi-v1/core/types";
import { CP001_FAMILIES } from "../../punjabi-v1/packages/PUN-001/checkpoints/CP001";
import { CP002_FAMILIES } from "../../punjabi-v1/packages/PUN-001/checkpoints/CP002";
import { CP003_FAMILIES } from "../../punjabi-v1/packages/PUN-001/checkpoints/CP003";
import { CP004_FAMILIES } from "../../punjabi-v1/packages/PUN-001/checkpoints/CP004";
import { CP005_FAMILIES } from "../../punjabi-v1/packages/PUN-001/checkpoints/CP005";
import { CP006_FAMILIES } from "../../punjabi-v1/packages/PUN-001/checkpoints/CP006";
import { CP007_FAMILIES } from "../../punjabi-v1/packages/PUN-001/checkpoints/CP007";
import { CP008_FAMILIES } from "../../punjabi-v1/packages/PUN-001/checkpoints/CP008";
import { CP009_FAMILIES } from "../../punjabi-v1/packages/PUN-001/checkpoints/CP009";
import { CP010_FAMILIES } from "../../punjabi-v1/packages/PUN-001/checkpoints/CP010";
import { CP011_FAMILIES } from "../../punjabi-v1/packages/PUN-001/checkpoints/CP011";
import { CP012_FAMILIES } from "../../punjabi-v1/packages/PUN-001/checkpoints/CP012";
import { CP013_FAMILIES } from "../../punjabi-v1/packages/PUN-001/checkpoints/CP013";
import { CP014_FAMILIES } from "../../punjabi-v1/packages/PUN-001/checkpoints/CP014";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const PUN_001_QUESTION_STUDIO_PACKAGE_ID_V1 = "PUN-001" as const;
export const PUN_001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const PUN_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1 =
  "PUN-001-OWNER-APPROVED-CHAPTER-INTEGRATION-2026-09-20" as const;
export const PUN_001_REVISION_POLICY_V1 = "SOURCE_GENERATOR_ONLY" as const;

type PunjabiFamily = Readonly<{
  familyId: string;
  subtype: string;
  targetDifficulties: readonly PunjabiDifficulty[];
  generate: (seed: number, difficulty: PunjabiDifficulty) => PunjabiGeneratedQuestion;
}>;

type CpDefinition = Readonly<{
  cpId: string;
  families: readonly PunjabiFamily[];
}>;

const cpDefinitions: readonly CpDefinition[] = [
  { cpId: "PUN-001-CP001", families: CP001_FAMILIES as readonly PunjabiFamily[] },
  { cpId: "PUN-001-CP002", families: CP002_FAMILIES as readonly PunjabiFamily[] },
  { cpId: "PUN-001-CP003", families: CP003_FAMILIES as readonly PunjabiFamily[] },
  { cpId: "PUN-001-CP004", families: CP004_FAMILIES as readonly PunjabiFamily[] },
  { cpId: "PUN-001-CP005", families: CP005_FAMILIES as readonly PunjabiFamily[] },
  { cpId: "PUN-001-CP006", families: CP006_FAMILIES as readonly PunjabiFamily[] },
  { cpId: "PUN-001-CP007", families: CP007_FAMILIES as readonly PunjabiFamily[] },
  { cpId: "PUN-001-CP008", families: CP008_FAMILIES as readonly PunjabiFamily[] },
  { cpId: "PUN-001-CP009", families: CP009_FAMILIES as readonly PunjabiFamily[] },
  { cpId: "PUN-001-CP010", families: CP010_FAMILIES as readonly PunjabiFamily[] },
  { cpId: "PUN-001-CP011", families: CP011_FAMILIES as readonly PunjabiFamily[] },
  { cpId: "PUN-001-CP012", families: CP012_FAMILIES as readonly PunjabiFamily[] },
  { cpId: "PUN-001-CP013", families: CP013_FAMILIES as readonly PunjabiFamily[] },
  { cpId: "PUN-001-CP014", families: CP014_FAMILIES as readonly PunjabiFamily[] },
];

export const PUN_001_QUESTION_STUDIO_CP_IDS_V1 = Object.freeze(
  cpDefinitions.map((definition) => definition.cpId),
);

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const difficulties: readonly PunjabiDifficulty[] = ["Easy", "Medium", "Hard"];

function normalizedText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stableSeed(value: string) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0) + 1;
}

function at<T>(items: readonly T[], index: number): T {
  if (!items.length) throw new Error("PUN-001 deterministic selection received an empty pool");
  return items[((index % items.length) + items.length) % items.length]!;
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("PUN-001 review generation requires count between 1 and 50");
  }
  return count;
}

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]) {
  if (!language || language === "pa") return "pa" as const;
  throw new Error("PUN-001 Question Studio supports approved Punjabi (pa) learner text only");
}

function normalizeDifficulty(
  difficulty: QuestionStudioGenerationRequest["difficulty"],
): PunjabiDifficulty | "Mixed" {
  if (!difficulty || difficulty === "Mixed") return "Mixed";
  if (difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard") {
    return difficulty;
  }
  throw new Error("PUN-001 difficulty must be Easy, Medium, Hard, or Mixed");
}

function selectorValues(request: QuestionStudioGenerationRequest) {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => normalizedText(value).toUpperCase())
    .filter(Boolean);
}

type Selection = Readonly<{
  cpId?: string;
  familyId?: string;
}>;

function parseSelector(value: string): Selection | null {
  if (value === PUN_001_QUESTION_STUDIO_PACKAGE_ID_V1) return {};
  const match = value.match(/^PUN-001-CP(00[1-9]|01[0-4])(?:-(F\d{2}))?$/);
  if (!match) return null;
  return {
    cpId: `PUN-001-CP${match[1]}`,
    familyId: match[2],
  };
}

function normalizeSelection(request: QuestionStudioGenerationRequest): Selection {
  const values = selectorValues(request);
  const parsed = values.map((value) => ({ value, parsed: parseSelector(value) }));
  const unknown = parsed.find((entry) => !entry.parsed);
  if (unknown) throw new Error(`Unknown PUN-001 selector ${unknown.value}`);

  const cpIds = parsed.flatMap((entry) => entry.parsed?.cpId ? [entry.parsed.cpId] : []);
  const familySelections = parsed.flatMap((entry) =>
    entry.parsed?.familyId && entry.parsed.cpId
      ? [`${entry.parsed.cpId}-${entry.parsed.familyId}`]
      : [],
  );
  if (new Set(cpIds).size > 1) {
    throw new Error(`Conflicting PUN-001 CP selectors ${cpIds.join(", ")}`);
  }
  if (new Set(familySelections).size > 1) {
    throw new Error(`Conflicting PUN-001 family selectors ${familySelections.join(", ")}`);
  }

  const familySelection = familySelections[0];
  return {
    cpId: cpIds[0],
    familyId: familySelection?.split("-").at(-1),
  };
}

function findCp(cpId: string) {
  const cp = cpDefinitions.find((definition) => definition.cpId === cpId);
  if (!cp) throw new Error(`Unknown PUN-001 checkpoint ${cpId}`);
  return cp;
}

function chooseDifficulty(
  requested: PunjabiDifficulty | "Mixed",
  family: PunjabiFamily | undefined,
  seed: number,
): PunjabiDifficulty {
  if (family) {
    if (requested !== "Mixed") {
      if (!family.targetDifficulties.includes(requested)) {
        throw new Error(
          `PUN-001 family ${family.familyId} does not support ${requested}`,
        );
      }
      return requested;
    }
    return at(family.targetDifficulties, seed - 1);
  }
  return requested === "Mixed" ? at(difficulties, seed - 1) : requested;
}

function chooseFamily(
  cp: CpDefinition,
  difficulty: PunjabiDifficulty,
  explicitFamilyId: string | undefined,
  seed: number,
) {
  if (explicitFamilyId) {
    const family = cp.families.find((candidate) => candidate.familyId === explicitFamilyId);
    if (!family) {
      throw new Error(`${cp.cpId} has no family ${explicitFamilyId}`);
    }
    if (!family.targetDifficulties.includes(difficulty)) {
      throw new Error(`${cp.cpId} ${family.familyId} does not support ${difficulty}`);
    }
    return family;
  }

  const eligible = cp.families.filter((family) =>
    family.targetDifficulties.includes(difficulty),
  );
  if (!eligible.length) {
    throw new Error(`${cp.cpId} has no ${difficulty} family`);
  }
  return at(eligible, seed - 1);
}

export const PUN_001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "language-v1",
  packageId: PUN_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Punjabi",
  topic: "Punjabi Grammar",
  subtopic: "Complete Chapter",
  label: "Punjabi · Grammar · PUN-001 · CP001–CP014",
  enabled: true,
  cpIds: [...PUN_001_QUESTION_STUDIO_CP_IDS_V1],
  supportedLanguages: ["pa"],
  supportedDifficulties: [...difficulties],
  difficultyFilterSupported: true,
  runtimeMode: PUN_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [PUN_001_QUESTION_STUDIO_RUNTIME_MODE_V1],
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
    ...lifecycle,
    registrationAuthorityId: PUN_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
    approvedChapterIntegrationCommit: "a0b29d6f44269e052c28193c49fb97c0c9e11066",
    approvedCombinedContentTip: "b1c416e0463dd16c4e388864ba75877e0c727934",
    finalGapClosureMergeCommit: "b1c416e0463dd16c4e388864ba75877e0c727934",
    finalClosureDate: "2026-09-24",
    chapterFreezeStatus: "OWNER_APPROVED_REVIEW_ONLY",
    atomicAuthorityCount: 3828,
    questionFamilyCount: 133,
    aggregateSemanticCapacity: 9755590464,
    humanReviewApproved: true,
    chapterContentComplete: true,
    reviewOnly: true,
    deterministicGeneration: true,
    sourceGeneratorOnly: true,
    revisionPolicy: PUN_001_REVISION_POLICY_V1,
    questionStudioGenerationEnabled: true,
    permanentQlAllocation: "NOT_ALLOCATED",
    cpCount: PUN_001_QUESTION_STUDIO_CP_IDS_V1.length,
    productionDifficultyClaimsAuthorized: false,
  },
};

export function isPun001QuestionStudioRequestV1(
  request: QuestionStudioGenerationRequest,
) {
  const packageId = normalizedText(request.packageId).toUpperCase();
  if (packageId) return packageId === PUN_001_QUESTION_STUDIO_PACKAGE_ID_V1;

  if (selectorValues(request).some((value) => value.startsWith("PUN-001"))) {
    return true;
  }

  const subject = normalizedText(request.subject).toLowerCase();
  const topic = normalizedText(request.topic).toLowerCase();
  const subtopic = normalizedText(request.subtopic).toLowerCase();
  return (
    subject === "punjabi" &&
    (topic === "punjabi grammar" || topic === "grammar") &&
    (!subtopic || subtopic === "complete chapter")
  );
}

export const languageV1Pun001QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "language-v1",

  listPackages() {
    return [PUN_001_STANDARD_REVIEW_ONLY_PACKAGE_V1];
  },

  async generate(
    request: QuestionStudioGenerationRequest,
  ): Promise<QuestionStudioGenerationResult> {
    if (!isPun001QuestionStudioRequestV1(request)) {
      throw new Error("language-v1 PUN-001 adapter requires a PUN-001 request");
    }
    if (
      request.runtimeMode &&
      request.runtimeMode !== PUN_001_QUESTION_STUDIO_RUNTIME_MODE_V1
    ) {
      throw new Error(
        `PUN-001 only supports ${PUN_001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`,
      );
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const requestedDifficulty = normalizeDifficulty(request.difficulty);
    const selection = normalizeSelection(request);
    const baseSeed = normalizedText(request.seed) || "pun001-question-studio-review-v1";
    const cpOffset = stableSeed(`${baseSeed}:cp`) - 1;
    const questions: Record<string, unknown>[] = [];

    for (let index = 0; index < count; index += 1) {
      const cp = selection.cpId
        ? findCp(selection.cpId)
        : at(cpDefinitions, cpOffset + index);
      const preliminarySeed = stableSeed(
        `${baseSeed}:${index}:${cp.cpId}:${selection.familyId ?? "AUTO"}`,
      );

      const explicitFamily = selection.familyId
        ? cp.families.find((family) => family.familyId === selection.familyId)
        : undefined;
      if (selection.familyId && !explicitFamily) {
        throw new Error(`${cp.cpId} has no family ${selection.familyId}`);
      }

      const difficulty = chooseDifficulty(
        requestedDifficulty,
        explicitFamily,
        requestedDifficulty === "Mixed" && !explicitFamily ? index + 1 : preliminarySeed,
      );
      const family = chooseFamily(
        cp,
        difficulty,
        selection.familyId,
        preliminarySeed,
      );
      const generationSeed = stableSeed(
        `${baseSeed}:${index}:${cp.cpId}:${family.familyId}:${difficulty}`,
      );
      const question = family.generate(generationSeed, difficulty);

      if (question.metadata.cpId !== cp.cpId) {
        throw new Error(
          `PUN-001 generator returned ${question.metadata.cpId} for selected ${cp.cpId}`,
        );
      }
      if (question.metadata.familyId !== family.familyId) {
        throw new Error(
          `PUN-001 generator returned family ${question.metadata.familyId} for selected ${family.familyId}`,
        );
      }

      questions.push({
        ...lifecycle,
        id: question.id,
        questionId: question.id,
        packageId: PUN_001_QUESTION_STUDIO_PACKAGE_ID_V1,
        patternId: `${cp.cpId}-${family.familyId}`,
        cpId: cp.cpId,
        familyId: family.familyId,
        subtype: question.metadata.subtype,
        subject: "Punjabi",
        topic: "Punjabi Grammar",
        subtopic: cp.cpId,
        language,
        locale: "pa-IN",
        script: "Guru",
        stem: question.stem,
        text: question.stem,
        options: [...question.options],
        correctIndex: question.correctIndex,
        correct: question.correctIndex,
        explanation: question.explanation,
        difficulty: question.difficulty,
        difficultyLabel: question.difficulty,
        authorityIds: [...question.metadata.authorityIds],
        generatorRevision: question.metadata.generatorRevision,
        fingerprint: question.metadata.fingerprint,
        sourceLifecycle: question.metadata.lifecycle,
        generationSeed,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: PUN_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
        humanReviewApproved: true,
        reviewOnly: true,
        questionStudioDiscoverable: true,
        questionStudioGenerationEnabled: true,
        runtimeRegistered: true,
        readOnly: true,
        revisionPolicy: PUN_001_REVISION_POLICY_V1,
        permanentQlAllocation: "NOT_ALLOCATED",
        questionBankWritable: false,
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
        productionReleased: false,
      });
    }

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "language-v1",
        packageId: PUN_001_QUESTION_STUDIO_PACKAGE_ID_V1,
        runtimeMode: PUN_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: PUN_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
        humanReviewApproved: true,
        reviewOnly: true,
        revisionPolicy: PUN_001_REVISION_POLICY_V1,
        permanentQlAllocation: "NOT_ALLOCATED",
        language,
        requestedDifficulty,
        selectedCpId: selection.cpId ?? "DETERMINISTIC_CHAPTER_ROTATION",
        selectedFamilyId: selection.familyId ?? "DETERMINISTIC_ELIGIBLE_FAMILY",
        seed: baseSeed,
        count,
      },
    };
  },
};
