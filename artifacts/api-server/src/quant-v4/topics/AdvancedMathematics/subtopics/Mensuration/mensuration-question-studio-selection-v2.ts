import {
  MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  MENSURATION_QUESTION_STUDIO_DIFFICULTIES,
  MENSURATION_QUESTION_STUDIO_EXAM_PROFILES,
  MENSURATION_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  MENSURATION_QUESTION_STUDIO_LANGUAGES,
  MENSURATION_QUESTION_STUDIO_PACKAGE_V2,
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
  generateMensurationStudioQuestionV2,
  getMensurationPatternRealismMetadataV2,
  type MensurationQuestionStudioCpId,
  type MensurationQuestionStudioDifficulty,
  type MensurationQuestionStudioExamProfile,
  type MensurationQuestionStudioPattern,
  type MensurationQuestionStudioQuestionV2,
} from "./mensuration-question-studio-runtime-v2";

function hashText(text: string) {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

function mixedHash(text: string) {
  let value = hashText(text) >>> 0;
  value ^= value >>> 16;
  value = Math.imul(value, 0x7feb352d) >>> 0;
  value ^= value >>> 15;
  value = Math.imul(value, 0x846ca68b) >>> 0;
  value ^= value >>> 16;
  return value >>> 0;
}

function unitInterval(seed: string) {
  return mixedHash(seed) / 0x100000000;
}

function weightedPattern(
  eligible: readonly MensurationQuestionStudioPattern[],
  examProfile: MensurationQuestionStudioExamProfile,
  seed: string,
) {
  const rows = eligible.map((pattern) => ({
    pattern,
    weight: getMensurationPatternRealismMetadataV2(pattern).profileWeights[examProfile],
  }));
  const total = rows.reduce((sum, row) => sum + row.weight, 0);
  let ticket = unitInterval(seed) * total;
  for (const row of rows) {
    ticket -= row.weight;
    if (ticket < 0) return row.pattern;
  }
  return rows[rows.length - 1]!.pattern;
}

export function generateMensurationStudioBatchV2(input: {
  cpId?: MensurationQuestionStudioCpId;
  patternId?: string;
  difficulty?: MensurationQuestionStudioDifficulty;
  examProfile?: MensurationQuestionStudioExamProfile;
  seed?: string;
  count?: number;
}) {
  const count = Math.max(1, Math.min(50, Math.floor(input.count ?? 5)));
  const seed = input.seed?.trim() || "mensuration-question-studio";
  const examProfile = input.examProfile ?? "SSC_CORE";
  let eligible = MENSURATION_QUESTION_STUDIO_PATTERNS.filter((row) => !input.cpId || row.cpId === input.cpId);
  if (input.patternId) eligible = eligible.filter((row) => row.patternId === input.patternId);
  if (!eligible.length) throw new Error("No Mensuration patterns matched the requested filters.");

  const questions: MensurationQuestionStudioQuestionV2[] = [];
  const exactStates = new Set<string>();
  const numericalStates = new Set<string>();
  const recentPatterns: string[] = [];
  let repeatedAttempts = 0;

  for (let attempt = 0; questions.length < count && attempt < count * 2048; attempt += 1) {
    const pattern = input.patternId
      ? eligible[0]!
      : weightedPattern(eligible, examProfile, `${seed}:pattern:${attempt}`);
    if (!input.patternId && eligible.length >= 8 && recentPatterns.slice(-3).includes(pattern.patternId)) continue;

    const question = generateMensurationStudioQuestionV2({
      patternId: pattern.patternId,
      seed: `${seed}:${attempt}`,
      examProfile,
    });
    if (input.difficulty && question.difficultyBand !== input.difficulty) continue;

    const exact = `${question.patternId}|${question.stem}|${question.options.join("|")}`;
    const repeated = exactStates.has(exact) || numericalStates.has(question.realism.numericalStateSignature);
    if (repeated && repeatedAttempts < Math.max(32, count * 8)) {
      repeatedAttempts += 1;
      continue;
    }

    repeatedAttempts = 0;
    exactStates.add(exact);
    numericalStates.add(question.realism.numericalStateSignature);
    recentPatterns.push(question.patternId);
    questions.push(question);
  }

  if (questions.length !== count) {
    throw new Error(`Unable to construct ${count} Mensuration questions for the requested filters and realism profile.`);
  }

  return {
    package: MENSURATION_QUESTION_STUDIO_PACKAGE_V2,
    questions,
    filters: {
      cpId: input.cpId ?? null,
      patternId: input.patternId ?? null,
      difficulty: input.difficulty ?? null,
      examProfile,
    },
    seed,
    realismAuthority: MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
  };
}

export {
  MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  MENSURATION_QUESTION_STUDIO_DIFFICULTIES,
  MENSURATION_QUESTION_STUDIO_EXAM_PROFILES,
  MENSURATION_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  MENSURATION_QUESTION_STUDIO_LANGUAGES,
  MENSURATION_QUESTION_STUDIO_PACKAGE_V2,
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
  generateMensurationStudioQuestionV2,
  getMensurationPatternRealismMetadataV2,
};
export type {
  MensurationQuestionStudioCpId,
  MensurationQuestionStudioDifficulty,
  MensurationQuestionStudioExamProfile,
  MensurationQuestionStudioPattern,
  MensurationQuestionStudioQuestionV2,
};
