import { createHash } from "node:crypto";

import {
  NUM_CP013_PERMANENT_ALLOCATION,
  type NumCp013PermanentQlId,
} from "./permanent-allocation.ts";
import { generateNumCp013Permanent } from "./permanent-runtime.ts";
import { generateNumCp013Localized } from "./localization/runtime.ts";
import type { NumCp013LocalizedLanguage } from "./localization/types.ts";

export const NUM_CP013_QUESTION_STUDIO_PACKAGE_ID = "NUM-002" as const;
export const NUM_CP013_QUESTION_STUDIO_CHECKPOINT_ID = "NUM-CP-013" as const;
export const NUM_CP013_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const NUM_CP013_QUESTION_STUDIO_QL_IDS = Object.freeze(
  NUM_CP013_PERMANENT_ALLOCATION.map((entry) => entry.qlId as NumCp013PermanentQlId),
);

export type NumCp013QuestionStudioLanguage = typeof NUM_CP013_QUESTION_STUDIO_LANGUAGES[number];
export type NumCp013QuestionStudioDifficulty = "Easy" | "Medium" | "Hard";

export type NumCp013QuestionStudioRequest = Readonly<{
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  topic?: string;
  subtopic?: string;
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
  difficulty?: unknown;
  language?: string;
  seed?: string;
  count?: number;
}>;

const RELEASE_ID = "NUM-CP-013-QS-MULTILINGUAL-FROZEN-V1" as const;
const EXPLANATION_STANDARD = "QUESTION_SPECIFIC_HUMAN_V1" as const;
const DIFFICULTY_SEARCH_WINDOW = 480;

function normalizeSelector(value: unknown) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function isCp013Ql(value: unknown): value is NumCp013PermanentQlId {
  return NUM_CP013_QUESTION_STUDIO_QL_IDS.includes(String(value ?? "") as NumCp013PermanentQlId);
}

/** CP013 claims only explicit checkpoint/pattern/QL selectors. Package-only NUM-002 remains fallback-owned. */
export function isNumCp013QuestionStudioRequest(request: NumCp013QuestionStudioRequest) {
  const patternId = normalizeSelector(request.patternId);
  const checkpointId = String(request.canonicalProblemId ?? request.cpId ?? "");
  return patternId.includes("num cp 013")
    || checkpointId === NUM_CP013_QUESTION_STUDIO_CHECKPOINT_ID
    || isCp013Ql(request.questionLanguageId);
}

function normalizeLanguage(value: unknown): NumCp013QuestionStudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`NUM-CP-013 does not support Question Studio language ${language}.`);
}

function normalizeDifficulty(value: unknown): NumCp013QuestionStudioDifficulty | undefined {
  const text = String(value ?? "").trim().toLowerCase();
  if (text === "easy") return "Easy";
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  return undefined;
}

function titleDifficulty(value: "EASY" | "MEDIUM" | "HARD"): NumCp013QuestionStudioDifficulty {
  return value === "EASY" ? "Easy" : value === "MEDIUM" ? "Medium" : "Hard";
}

function stablePositiveSeed(value: string) {
  const digest = createHash("sha256").update(value).digest();
  return (digest.readUInt32BE(0) % 2_000_000_000) + 1;
}

function generateAuthority(
  qlId: NumCp013PermanentQlId,
  seed: number,
  language: NumCp013QuestionStudioLanguage,
) {
  return language === "en"
    ? generateNumCp013Permanent(qlId, seed)
    : generateNumCp013Localized(qlId, seed, language as NumCp013LocalizedLanguage);
}

function tryGenerateMatchingDifficulty(
  qlId: NumCp013PermanentQlId,
  initialSeed: number,
  language: NumCp013QuestionStudioLanguage,
  difficulty?: NumCp013QuestionStudioDifficulty,
) {
  for (let offset = 0; offset < DIFFICULTY_SEARCH_WINDOW; offset += 1) {
    const seed = initialSeed + offset;
    const pkg = generateAuthority(qlId, seed, language);
    if (!difficulty || titleDifficulty(pkg.difficulty) === difficulty) return pkg;
  }
  return undefined;
}

function buildExplanation(
  pkg: ReturnType<typeof generateAuthority>,
  language: NumCp013QuestionStudioLanguage,
) {
  const answerLabel = language === "hi" ? "उत्तर" : language === "pa" ? "ਉੱਤਰ" : "Answer";
  const lines = Object.freeze([
    pkg.explanation.coreConcept,
    pkg.explanation.strategy,
    ...pkg.explanation.steps,
    `${answerLabel}: ${pkg.explanation.finalAnswer}`,
  ]);
  return Object.freeze({
    standard: EXPLANATION_STANDARD,
    coreConcept: pkg.explanation.coreConcept,
    strategy: pkg.explanation.strategy,
    steps: pkg.explanation.steps,
    finalAnswer: pkg.explanation.finalAnswer,
    lines,
  });
}

function normalizedPackage(
  pkg: ReturnType<typeof generateAuthority>,
  language: NumCp013QuestionStudioLanguage,
  seedText: string,
) {
  const identity = createHash("sha256")
    .update(JSON.stringify({
      qlId: pkg.permanentQlId,
      language,
      seed: pkg.seed,
      stem: pkg.stem,
      options: pkg.options.map((option) => option.value),
      answer: pkg.canonicalAnswer,
    }))
    .digest("hex")
    .slice(0, 20);

  const sourceLifecycle = pkg.lifecycle;
  const validationOk = pkg.canonicalAnswer === pkg.verifierAnswer
    && pkg.options[pkg.correctIndex]?.isCorrect === true
    && pkg.options[pkg.correctIndex]?.value === pkg.canonicalAnswer;
  if (!validationOk) throw new Error(`${pkg.permanentQlId}: frozen answer/verifier/option binding drift.`);
  if (
    sourceLifecycle.questionBankWritable
    || sourceLifecycle.testEligible
    || sourceLifecycle.mockTestEligible
    || sourceLifecycle.publiclyPublishable
    || sourceLifecycle.automaticStudentPublication
  ) {
    throw new Error(`${pkg.permanentQlId}: downstream lifecycle lock unexpectedly opened.`);
  }

  const explanation = buildExplanation(pkg, language);

  return Object.freeze({
    packageId: NUM_CP013_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: NUM_CP013_QUESTION_STUDIO_CHECKPOINT_ID,
    questionLanguageId: pkg.permanentQlId,
    explanationId: `${pkg.permanentQlId}-EXP-${language.toUpperCase()}`,
    questionId: `NUM-CP013-${pkg.permanentQlId.slice(-3)}-${language.toUpperCase()}-${identity}`,
    stem: pkg.stem,
    options: Object.freeze(pkg.options.map((option) => option.value)),
    optionMetadata: Object.freeze(pkg.options.map((option) => Object.freeze({
      isCorrect: option.isCorrect,
      misconceptionId: option.misconceptionId,
    }))),
    correctIndex: pkg.correctIndex,
    answer: pkg.canonicalAnswer,
    verifierAnswer: pkg.verifierAnswer,
    difficultyBand: titleDifficulty(pkg.difficulty),
    language,
    locale: language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN",
    runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
    reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY" as const,
    questionStudioDiscoverable: true as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    explanation,
    explanationStandard: EXPLANATION_STANDARD,
    authorityId: pkg.authorityId,
    authorityLabel: pkg.authorityLabel,
    taskKind: pkg.taskKind,
    representation: pkg.representation,
    answerSemantic: pkg.answerSemantic,
    sourceAnswerSemantic: pkg.sourceAnswerSemantic,
    temporaryPrototypeId: pkg.temporaryPrototypeId,
    hiddenState: pkg.hiddenState,
    permanentSeed: pkg.seed,
    sourceSeed: pkg.sourceSeed,
    resolvedSourceSeed: pkg.sourceSeed,
    requestSeed: seedText,
    mathematicalFingerprint: pkg.mathematicalFingerprint,
    validation: Object.freeze({
      ok: true as const,
      valid: true as const,
      errors: Object.freeze([] as string[]),
    }),
    traceability: Object.freeze({
      releaseId: RELEASE_ID,
      packageId: NUM_CP013_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: NUM_CP013_QUESTION_STUDIO_CHECKPOINT_ID,
      permanentQlId: pkg.permanentQlId,
      permanentSeed: pkg.seed,
      sourceSeed: pkg.sourceSeed,
      authorityId: pkg.authorityId,
      temporaryPrototypeId: pkg.temporaryPrototypeId,
      sourceAncestry: pkg.sourceAncestry,
      prototypeAncestry: pkg.prototypeAncestry,
      mathematicalFingerprint: pkg.mathematicalFingerprint,
      sourceLifecycle,
      englishAuthorityStatus: "ENGLISH_FROZEN" as const,
      localizationStatus: language === "en" ? "NOT_APPLICABLE" as const : "HI_PA_FROZEN" as const,
      explanationStandard: EXPLANATION_STANDARD,
      questionStudioDiscoverable: true as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  });
}

function toPreview(pkg: ReturnType<typeof normalizedPackage>, index: number, count: number) {
  const canonicalAnswer = Object.freeze({
    kind: "symbolic",
    value: pkg.answer,
    display: pkg.answer,
    rendered: pkg.answer,
    rounding: "exact",
  });
  return Object.freeze({
    text: pkg.stem,
    stem: pkg.stem,
    options: pkg.options,
    correct: pkg.correctIndex,
    correctIndex: pkg.correctIndex,
    answer: pkg.answer,
    canonicalAnswer,
    explanation: pkg.explanation.lines.join("\n\n"),
    packageExplanation: pkg.explanation,
    explanationStandard: pkg.explanationStandard,
    difficulty: pkg.difficultyBand,
    difficultyLabel: pkg.difficultyBand,
    patternId: NUM_CP013_QUESTION_STUDIO_PACKAGE_ID,
    section: "Quant",
    topic: "Arithmetic",
    subtopic: "Number System",
    generationBackend: "quant-v4",
    debugSource: "quant-v4-num-cp013-frozen-multilingual-runtime",
    packageSource: "quant-v4-num-cp013-frozen-multilingual-runtime",
    packageId: NUM_CP013_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: NUM_CP013_QUESTION_STUDIO_CHECKPOINT_ID,
    questionLanguageId: pkg.questionLanguageId,
    explanationId: pkg.explanationId,
    qlId: pkg.questionLanguageId,
    questionId: pkg.questionId,
    seed: pkg.requestSeed,
    permanentSeed: pkg.permanentSeed,
    sourceSeed: pkg.sourceSeed,
    language: pkg.language,
    locale: pkg.locale,
    runtimeMode: pkg.runtimeMode,
    reviewStatus: pkg.reviewStatus,
    questionStudioDiscoverable: pkg.questionStudioDiscoverable,
    questionBankStatus: pkg.questionBankStatus,
    questionBankWritable: pkg.questionBankWritable,
    testEligibility: pkg.testEligibility,
    testEligible: pkg.testEligible,
    mockTestEligible: pkg.mockTestEligible,
    publiclyPublishable: pkg.publiclyPublishable,
    automaticStudentPublication: pkg.automaticStudentPublication,
    authorityId: pkg.authorityId,
    authorityLabel: pkg.authorityLabel,
    taskKind: pkg.taskKind,
    representation: pkg.representation,
    answerSemantic: pkg.answerSemantic,
    sourceAnswerSemantic: pkg.sourceAnswerSemantic,
    optionMetadata: pkg.optionMetadata,
    validation: pkg.validation,
    semanticMetadata: pkg.traceability,
    traceability: pkg.traceability,
    proceduralLogic: pkg.hiddenState,
    logic: pkg.hiddenState,
    mathematicalFingerprint: pkg.mathematicalFingerprint,
    questionIndex: index + 1,
    questionCount: count,
  });
}

export function listNumCp013QuestionStudioPackages() {
  return [Object.freeze({
    id: NUM_CP013_QUESTION_STUDIO_PACKAGE_ID,
    packageId: NUM_CP013_QUESTION_STUDIO_PACKAGE_ID,
    type: "quant-v4",
    section: "Quant",
    domain: "quant",
    subject: "Quantitative Aptitude",
    topic: "Arithmetic",
    subtopic: "Number System",
    name: "NUM-002 Number System — Positional Bases and Numeral Conversion",
    label: "Number System — Positional Bases and Numeral Conversion",
    generationDomain: "quant-v4",
    cpIds: Object.freeze([NUM_CP013_QUESTION_STUDIO_CHECKPOINT_ID]),
    canonicalProblems: Object.freeze([Object.freeze({
      id: NUM_CP013_QUESTION_STUDIO_CHECKPOINT_ID,
      label: "Positional bases and numeral conversion",
    })]),
    permanentQlCount: NUM_CP013_QUESTION_STUDIO_QL_IDS.length,
    permanentQlIds: NUM_CP013_QUESTION_STUDIO_QL_IDS,
    supportedDifficulties: Object.freeze(["Easy", "Medium", "Hard"]),
    supportedLanguages: NUM_CP013_QUESTION_STUDIO_LANGUAGES,
    enabled: true,
    runtimeMode: "QUESTION_STUDIO_ACTIVE",
    supportedRuntimeModes: Object.freeze(["QUESTION_STUDIO_ACTIVE"]),
    reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY",
    explanationStandard: EXPLANATION_STANDARD,
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    releaseId: RELEASE_ID,
  })];
}

export async function generateNumCp013QuestionStudioBatch(request: NumCp013QuestionStudioRequest = {}) {
  const language = normalizeLanguage(request.language);
  const difficulty = normalizeDifficulty(request.difficulty);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const explicitQl = String(request.questionLanguageId ?? "") || undefined;
  if (explicitQl && !isCp013Ql(explicitQl)) throw new Error(`${explicitQl} is not owned by NUM-CP-013.`);

  const explicitCp = String(request.canonicalProblemId ?? request.cpId ?? "") || undefined;
  if (explicitCp && explicitCp !== NUM_CP013_QUESTION_STUDIO_CHECKPOINT_ID) {
    throw new Error(`NUM-CP-013 integration cannot serve canonical problem ${explicitCp}.`);
  }

  const batchSeed = request.seed?.trim()
    || `question-studio:NUM-002:NUM-CP-013:${language}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const qlOffset = stablePositiveSeed(`${batchSeed}:ql-offset`) % NUM_CP013_QUESTION_STUDIO_QL_IDS.length;
  const questionPackages = [];
  const questions = [];

  for (let index = 0; index < count; index += 1) {
    let selectedFrozen: ReturnType<typeof generateAuthority> | undefined;
    let itemSeedText = "";
    const qlCandidates = explicitQl
      ? [explicitQl as NumCp013PermanentQlId]
      : Array.from({ length: NUM_CP013_QUESTION_STUDIO_QL_IDS.length }, (_, scan) =>
          NUM_CP013_QUESTION_STUDIO_QL_IDS[(qlOffset + index + scan) % NUM_CP013_QUESTION_STUDIO_QL_IDS.length]!,
        );

    for (const qlId of qlCandidates) {
      const candidateSeedText = `${batchSeed}:${qlId}:${index}`;
      const candidateSeed = stablePositiveSeed(candidateSeedText);
      const frozen = tryGenerateMatchingDifficulty(qlId, candidateSeed, language, difficulty);
      if (frozen) {
        selectedFrozen = frozen;
        itemSeedText = candidateSeedText;
        break;
      }
    }

    if (!selectedFrozen) {
      if (explicitQl && difficulty) throw new Error(`${explicitQl} does not expose ${difficulty} in its frozen difficulty reach.`);
      throw new Error(`No NUM-CP-013 frozen QL can satisfy requested ${String(difficulty ?? "difficulty")} filter.`);
    }

    const normalized = normalizedPackage(selectedFrozen, language, itemSeedText);
    questionPackages.push(normalized);
    questions.push(toPreview(normalized, index, count));
  }

  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "quant-v4",
      packageId: NUM_CP013_QUESTION_STUDIO_PACKAGE_ID,
      chapterId: NUM_CP013_QUESTION_STUDIO_CHECKPOINT_ID,
      canonicalProblemId: NUM_CP013_QUESTION_STUDIO_CHECKPOINT_ID,
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: "QUESTION_STUDIO_ACTIVE",
      reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY",
      lifecycleStatus: "QUESTION_STUDIO_ACTIVE_SOURCE_ONLY",
      permanentQlCount: NUM_CP013_QUESTION_STUDIO_QL_IDS.length,
      explanationStandard: EXPLANATION_STANDARD,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      releaseId: RELEASE_ID,
      language,
      explicitQl: explicitQl ?? null,
      difficulty: difficulty ?? null,
    }),
    questionPackages: Object.freeze(questionPackages),
    questions: Object.freeze(questions),
  });
}
