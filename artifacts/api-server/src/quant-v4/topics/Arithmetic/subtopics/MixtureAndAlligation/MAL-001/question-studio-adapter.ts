import { applyMal001DualMethodExplanationV2 } from "./foundation/chapter-compact-explanation-v1";
import type { Mal001LocalizedLanguage } from "./foundation/chapter-multilingual-question-studio-v1";
import { applyMal001QuestionStudioLocalizationV4 } from "./foundation/chapter-multilingual-question-studio-v4";
import {
  MAL_CP001_PERMANENT_ALLOCATION,
  type MalCp001PermanentQlId,
} from "./foundation/cp001-permanent-allocation";
import {
  runMalCp001EnglishReleasePipeline,
  type MalCp001ReleasedQuestion,
} from "./foundation/cp001-release";
import {
  MAL_CP002_PERMANENT_ALLOCATION,
  type MalCp002PermanentQlId,
  type MalCp002ReleasedQuestion,
} from "./foundation/cp002-permanent-runtime";
import { runMalCp002EnglishChapterClosureV4Pipeline } from "./foundation/cp002-chapter-closure-runtime-v4";
import {
  MAL_CP003_PERMANENT_ALLOCATION,
  type MalCp003PermanentQlId,
  type MalCp003ReleasedQuestion,
} from "./foundation/cp003-permanent-runtime";
import { runMalCp003EnglishEditorialV3Pipeline } from "./foundation/cp003-release-editorial-v3";
import {
  MAL_CP004_PERMANENT_ALLOCATION,
  type MalCp004PermanentQlId,
} from "./foundation/cp004-permanent-runtime";
import type { MalCp004ProductReviewQuestion } from "./foundation/cp004-product-review-remediation-v3";
import { runMalCp004EnglishChapterClosureV9Pipeline } from "./foundation/cp004-chapter-closure-runtime-v9";
import type { MalCp005PermanentQlId } from "./foundation/cp005-permanent-allocation-v1";
import {
  MAL_CP005_RELEASE_ALLOCATION,
  runMalCp005EnglishReleasePipeline,
  type MalCp005ReleasedQuestion,
} from "./foundation/cp005-permanent-runtime-v1";
import type { MalCp006PermanentQlId } from "./foundation/cp006-permanent-allocation";
import {
  MAL_CP006_REVIEW_ALLOCATION,
  generateMalCp006PermanentReviewQuestion,
  type MalCp006PermanentReviewQuestion,
} from "./foundation/cp006-permanent-review-runtime-v1";

export const MAL_001_QUESTION_STUDIO_CP_IDS = [
  "MAL-CP-001",
  "MAL-CP-002",
  "MAL-CP-003",
  "MAL-CP-004",
  "MAL-CP-005",
  "MAL-CP-006",
] as const;

export const MAL_001_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;

export type Mal001QuestionStudioLanguage =
  (typeof MAL_001_QUESTION_STUDIO_LANGUAGES)[number];

export type Mal001QuestionStudioCpId =
  (typeof MAL_001_QUESTION_STUDIO_CP_IDS)[number];

export type Mal001QuestionStudioQlId =
  | MalCp001PermanentQlId
  | MalCp002PermanentQlId
  | MalCp003PermanentQlId
  | MalCp004PermanentQlId
  | MalCp005PermanentQlId
  | MalCp006PermanentQlId;

type Difficulty = "Easy" | "Medium" | "Hard";

type AllocationEntry = {
  qlId: Mal001QuestionStudioQlId;
  difficulty: Difficulty;
};

function toCp006QuestionStudioQuestion(
  question: MalCp006PermanentReviewQuestion,
) {
  const explanationLines = [
    ...question.explanation.visibleLines,
    question.explanation.answerLine,
  ];
  const derivationNodes = question.explanation.visibleLines.map((line, index) => ({
    id: `derivation-${index + 1}`,
    kind: "DERIVATION" as const,
    text: line,
    dependsOn: [index === 0 ? "given-1" : `derivation-${index}`],
  }));
  const lastDerivation = derivationNodes.at(-1)?.id ?? "given-1";

  return {
    ...question,
    difficultyBand: question.difficulty,
    parameters: {
      requestedSeed: question.requestedSeed,
      selectedSeed: question.selectedSeed,
      permanentSolveModeId: question.permanentSolveModeId,
      sharedCoreId: question.sharedCoreId,
      questionStudioConnectionId: "MAL-CP006-QUESTION-STUDIO-V1",
    },
    explanationId: `${question.questionLanguageId}-EN-MULTI-VESSEL-QUESTION-STUDIO-V1`,
    explanation: {
      ...question.explanation,
      lines: explanationLines,
    },
    reasoningGraph: {
      nodes: [
        {
          id: "given-1",
          kind: "GIVEN" as const,
          text: question.stem,
          dependsOn: [] as string[],
        },
        ...derivationNodes,
        {
          id: "conclusion-1",
          kind: "CONCLUSION" as const,
          text: question.explanation.answerLine,
          dependsOn: [lastDerivation],
        },
      ],
    },
    runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    active: true as const,
    questionStudioDiscoverable: true as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
    traceability: {
      ...question.traceability,
      runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
      questionStudioConnected: true as const,
    },
  };
}

export type MalCp006QuestionStudioQuestion = ReturnType<
  typeof toCp006QuestionStudioQuestion
>;

export type Mal001QuestionStudioQuestion =
  | MalCp001ReleasedQuestion
  | MalCp002ReleasedQuestion
  | MalCp003ReleasedQuestion
  | MalCp004ProductReviewQuestion
  | MalCp005ReleasedQuestion
  | MalCp006QuestionStudioQuestion;

const ALLOCATIONS_BY_CP: Record<
  Mal001QuestionStudioCpId,
  readonly AllocationEntry[]
> = {
  "MAL-CP-001": MAL_CP001_PERMANENT_ALLOCATION,
  "MAL-CP-002": MAL_CP002_PERMANENT_ALLOCATION,
  "MAL-CP-003": MAL_CP003_PERMANENT_ALLOCATION,
  "MAL-CP-004": MAL_CP004_PERMANENT_ALLOCATION,
  "MAL-CP-005": MAL_CP005_RELEASE_ALLOCATION,
  "MAL-CP-006": MAL_CP006_REVIEW_ALLOCATION,
};

export function listMal001QuestionStudioCpIdsForDifficulty(
  difficulty?: Difficulty,
): readonly Mal001QuestionStudioCpId[] {
  if (!difficulty) return MAL_001_QUESTION_STUDIO_CP_IDS;
  return MAL_001_QUESTION_STUDIO_CP_IDS.filter((cpId) =>
    ALLOCATIONS_BY_CP[cpId].some((entry) => entry.difficulty === difficulty),
  );
}

function inferCpFromQl(
  value: Mal001QuestionStudioQlId | string | undefined,
): Mal001QuestionStudioCpId | undefined {
  const match = /^MAL-QL-(\d{3})$/u.exec(String(value ?? ""));
  if (!match) return undefined;
  const number = Number(match[1]);
  if (number >= 1 && number <= 11) return "MAL-CP-001";
  if (number >= 12 && number <= 28) return "MAL-CP-002";
  if (number >= 29 && number <= 37) return "MAL-CP-003";
  if (number >= 38 && number <= 47) return "MAL-CP-004";
  if (number >= 48 && number <= 60) return "MAL-CP-005";
  if (number >= 61 && number <= 67) return "MAL-CP-006";
  return undefined;
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function resolveCpId(
  requestedCpId: Mal001QuestionStudioCpId,
  input: {
    difficulty?: Difficulty;
    questionLanguageId?: Mal001QuestionStudioQlId | string;
    seed?: string;
  },
): Mal001QuestionStudioCpId {
  const inferredFromQl = inferCpFromQl(input.questionLanguageId);
  if (inferredFromQl) return inferredFromQl;
  if (!input.difficulty) return requestedCpId;
  if (
    ALLOCATIONS_BY_CP[requestedCpId].some(
      (entry) => entry.difficulty === input.difficulty,
    )
  ) {
    return requestedCpId;
  }
  const eligibleCpIds = listMal001QuestionStudioCpIdsForDifficulty(
    input.difficulty,
  );
  if (eligibleCpIds.length === 0) {
    throw new Error(`MAL-001 has no Question Studio QLs for ${input.difficulty}.`);
  }
  const seed = input.seed ?? `mal-001-question-studio:${input.difficulty}`;
  return eligibleCpIds[hash(`${seed}:difficulty-cp`) % eligibleCpIds.length]!;
}

function chooseQl<T extends AllocationEntry>(
  cpId: Mal001QuestionStudioCpId,
  allocations: readonly T[],
  input: {
    difficulty?: Difficulty;
    questionLanguageId?: Mal001QuestionStudioQlId | string;
    seed?: string;
  },
): T["qlId"] {
  const entries = allocations.filter(
    (entry) => !input.difficulty || entry.difficulty === input.difficulty,
  );
  if (entries.length === 0) {
    throw new Error(
      `No active ${cpId} QLs match${
        input.difficulty ? ` difficulty ${input.difficulty}` : " the request"
      }.`,
    );
  }
  if (input.questionLanguageId) {
    const explicit = entries.find(
      (entry) => entry.qlId === input.questionLanguageId,
    );
    if (!explicit) {
      throw new Error(
        `${input.questionLanguageId} is not active for ${cpId}${
          input.difficulty ? ` / ${input.difficulty}` : ""
        }.`,
      );
    }
    return explicit.qlId;
  }
  const seed = input.seed ?? `mal-001-question-studio:${cpId}`;
  return entries[hash(seed) % entries.length]!.qlId;
}

function englishQuestion(
  selectedCpId: Mal001QuestionStudioCpId,
  input: {
    difficulty?: Difficulty;
    questionLanguageId?: Mal001QuestionStudioQlId | string;
    seed?: string;
  },
): Mal001QuestionStudioQuestion {
  if (selectedCpId === "MAL-CP-001") {
    const questionLanguageId = chooseQl(
      selectedCpId,
      MAL_CP001_PERMANENT_ALLOCATION,
      input,
    ) as MalCp001PermanentQlId;
    return applyMal001DualMethodExplanationV2(
      runMalCp001EnglishReleasePipeline({
        questionLanguageId,
        seed: input.seed,
        language: "en",
      }),
    );
  }

  if (selectedCpId === "MAL-CP-002") {
    const questionLanguageId = chooseQl(
      selectedCpId,
      MAL_CP002_PERMANENT_ALLOCATION,
      input,
    ) as MalCp002PermanentQlId;
    return applyMal001DualMethodExplanationV2(
      runMalCp002EnglishChapterClosureV4Pipeline({
        questionLanguageId,
        seed: input.seed,
        language: "en",
      }),
    );
  }

  if (selectedCpId === "MAL-CP-003") {
    const questionLanguageId = chooseQl(
      selectedCpId,
      MAL_CP003_PERMANENT_ALLOCATION,
      input,
    ) as MalCp003PermanentQlId;
    return applyMal001DualMethodExplanationV2(
      runMalCp003EnglishEditorialV3Pipeline({
        questionLanguageId,
        seed: input.seed,
        language: "en",
      }),
    );
  }

  if (selectedCpId === "MAL-CP-004") {
    const questionLanguageId = chooseQl(
      selectedCpId,
      MAL_CP004_PERMANENT_ALLOCATION,
      input,
    ) as MalCp004PermanentQlId;
    return applyMal001DualMethodExplanationV2(
      runMalCp004EnglishChapterClosureV9Pipeline({
        questionLanguageId,
        seed: input.seed,
        language: "en",
      }),
    );
  }

  if (selectedCpId === "MAL-CP-005") {
    const questionLanguageId = chooseQl(
      selectedCpId,
      MAL_CP005_RELEASE_ALLOCATION,
      input,
    ) as MalCp005PermanentQlId;
    return applyMal001DualMethodExplanationV2(
      runMalCp005EnglishReleasePipeline({
        questionLanguageId,
        seed: input.seed,
        language: "en",
      }),
    );
  }

  const questionLanguageId = chooseQl(
    selectedCpId,
    MAL_CP006_REVIEW_ALLOCATION,
    input,
  ) as MalCp006PermanentQlId;
  return toCp006QuestionStudioQuestion(
    generateMalCp006PermanentReviewQuestion(questionLanguageId, input.seed),
  );
}

export function runMal001QuestionStudioPipeline(
  cpId: Mal001QuestionStudioCpId,
  input: {
    difficulty?: Difficulty;
    language?: Mal001QuestionStudioLanguage;
    questionLanguageId?: Mal001QuestionStudioQlId | string;
    seed?: string;
  } = {},
): Mal001QuestionStudioQuestion {
  if (!MAL_001_QUESTION_STUDIO_CP_IDS.includes(cpId)) {
    throw new Error(`Unknown canonical problem '${cpId}' for package MAL-001.`);
  }

  const language = input.language ?? "en";
  if (!MAL_001_QUESTION_STUDIO_LANGUAGES.includes(language)) {
    throw new Error(`MAL-001 does not support Question Studio language ${language}.`);
  }

  const selectedCpId = resolveCpId(cpId, input);
  const base = englishQuestion(selectedCpId, input);
  if (language === "en") return base;
  return applyMal001QuestionStudioLocalizationV4(
    base as unknown as Record<string, any>,
    language as Mal001LocalizedLanguage,
  ) as unknown as Mal001QuestionStudioQuestion;
}
