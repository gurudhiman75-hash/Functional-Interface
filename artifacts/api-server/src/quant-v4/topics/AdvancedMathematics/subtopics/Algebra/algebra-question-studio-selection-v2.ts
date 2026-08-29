import {
  ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  ALGEBRA_QUESTION_STUDIO_PATTERNS,
  type AlgebraQuestionStudioPattern,
  type AlgebraStudioDifficulty,
  type AlgebraStudioExamProfile,
  type AlgebraStudioLanguage,
} from "./algebra-question-studio-runtime-v1";
import {
  ALGEBRA_QUESTION_STUDIO_DELIVERY_V2_AUTHORITY,
  ALGEBRA_QUESTION_STUDIO_PACKAGE_V2,
  generateAlgebraStudioQuestionV2,
} from "./algebra-question-studio-runtime-v2";

function hashText(text: string): number {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function difficultyFor(pattern: AlgebraQuestionStudioPattern): AlgebraStudioDifficulty {
  if (/ALG-CP-(001|004|006)/.test(pattern.cpId)) return "Easy";
  if (/ALG-CP-(011|014)/.test(pattern.cpId)) return "Hard";
  if (["ALG-QL-009", "ALG-QL-031", "ALG-QL-036", "ALG-QL-041", "ALG-QL-042", "ALG-QL-043"].includes(pattern.qlId)) return "Hard";
  if (["ALG-QL-001", "ALG-QL-002", "ALG-QL-003", "ALG-QL-004", "ALG-QL-016", "ALG-QL-020", "ALG-QL-021"].includes(pattern.qlId)) return "Easy";
  return "Medium";
}

function profileWeight(pattern: AlgebraQuestionStudioPattern, profile: AlgebraStudioExamProfile): number {
  const cp = Number(pattern.cpId.slice(-3));
  if (profile === "BANKING") {
    if ([7, 10, 11, 14].includes(cp)) return 4;
    if ([6, 8, 9, 12, 13].includes(cp)) return 2.5;
    return 1;
  }
  if (profile === "PUNJAB_STATE") {
    if ([1, 2, 4, 6, 7, 9, 12, 13].includes(cp)) return 3.5;
    return 2;
  }
  if (profile === "SSC_ADVANCED") {
    if ([2, 3, 5, 7, 8, 9, 10, 12, 13].includes(cp)) return 3;
    return 2;
  }
  if ([1, 2, 4, 5, 6, 7, 8, 9, 10, 12].includes(cp)) return 3.5;
  return 1.25;
}

export function generateAlgebraStudioBatchV2(input: {
  language?: AlgebraStudioLanguage;
  examProfile?: AlgebraStudioExamProfile;
  difficulty?: AlgebraStudioDifficulty;
  cpId?: string;
  qlId?: AlgebraQuestionStudioPattern["qlId"];
  patternId?: string;
  seed: string;
  count: number;
}) {
  const language = input.language ?? "en";
  const examProfile = input.examProfile ?? "SSC_CORE";
  let patterns = ALGEBRA_QUESTION_STUDIO_PATTERNS.filter((pattern) => {
    if (input.cpId && pattern.cpId !== input.cpId) return false;
    if (input.qlId && pattern.qlId !== input.qlId) return false;
    if (input.patternId && pattern.prototypeId !== input.patternId) return false;
    if (input.difficulty && difficultyFor(pattern) !== input.difficulty) return false;
    return true;
  });
  if (!patterns.length) throw new Error("No frozen Algebra Question Studio patterns matched the request.");

  patterns = [...patterns].sort((left, right) => {
    const leftScore = hashText(`${input.seed}:${left.prototypeId}`) / profileWeight(left, examProfile);
    const rightScore = hashText(`${input.seed}:${right.prototypeId}`) / profileWeight(right, examProfile);
    return leftScore - rightScore;
  });

  const count = Math.max(1, Math.min(Math.floor(input.count), 50));
  const questions = Array.from({ length: count }, (_unused, index) => {
    const pattern = patterns[index % patterns.length]!;
    return generateAlgebraStudioQuestionV2({
      pattern,
      language,
      examProfile,
      seed: `${input.seed}:${index}`,
    });
  });

  return {
    authority: ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
    deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V2_AUTHORITY,
    package: ALGEBRA_QUESTION_STUDIO_PACKAGE_V2,
    filters: {
      language,
      examProfile,
      difficulty: input.difficulty ?? null,
      cpId: input.cpId ?? null,
      qlId: input.qlId ?? null,
      patternId: input.patternId ?? null,
    },
    questionCount: questions.length,
    questions,
    reviewOnly: true as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
  };
}
