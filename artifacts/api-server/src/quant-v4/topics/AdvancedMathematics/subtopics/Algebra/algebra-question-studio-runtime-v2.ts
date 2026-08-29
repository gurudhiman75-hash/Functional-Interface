import {
  ALG_MULTILINGUAL_V2_FREEZE_ID,
  generateAlgPermanentEnglishV3Frozen,
  generateAlgPermanentMultilingualV2Frozen,
  type AlgReviewLocale,
} from "./permanent";
import {
  ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  ALGEBRA_QUESTION_STUDIO_PACKAGE_V1,
  ALGEBRA_QUESTION_STUDIO_PATTERNS,
  generateAlgebraStudioBatchV1,
  generateAlgebraStudioQuestionV1,
  type AlgebraQuestionStudioPattern,
  type AlgebraQuestionStudioQuestion,
  type AlgebraStudioDifficulty,
  type AlgebraStudioExamProfile,
  type AlgebraStudioLanguage,
} from "./algebra-question-studio-runtime-v1";

export const ALGEBRA_QUESTION_STUDIO_DELIVERY_V2_AUTHORITY =
  "ALGEBRA-FROZEN-QUESTION-STUDIO-DELIVERY-V2" as const;

export type AlgebraQuestionStudioQuestionV2 = AlgebraQuestionStudioQuestion & {
  readonly deliveryAuthority: typeof ALGEBRA_QUESTION_STUDIO_DELIVERY_V2_AUTHORITY;
};

export const ALGEBRA_QUESTION_STUDIO_PACKAGE_V2 = Object.freeze({
  ...ALGEBRA_QUESTION_STUDIO_PACKAGE_V1,
  label: "Algebra · Frozen Full Chapter · Delivery V2",
  deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V2_AUTHORITY,
  reviewStatus: "QUESTION_STUDIO_REVIEW_CONNECTED_DELIVERY_HARDENED" as const,
});

const LABELS = ["A", "B", "C", "D"] as const;

function hashText(text: string): number {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function integerSeed(seed: string): number {
  const trailing = /(?:^|:)(\d+)$/.exec(seed)?.[1];
  return trailing === undefined ? hashText(seed) : Number(trailing) >>> 0;
}

function localeFor(language: AlgebraStudioLanguage): "en-IN" | "hi-IN" | "pa-IN" {
  return language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
}

function frozenSource(pattern: AlgebraQuestionStudioPattern, seed: number, language: AlgebraStudioLanguage): any {
  if (language === "en") return generateAlgPermanentEnglishV3Frozen(pattern.qlId, seed, pattern.variantIndex);
  return generateAlgPermanentMultilingualV2Frozen(
    pattern.qlId,
    seed,
    localeFor(language) as AlgReviewLocale,
    pattern.variantIndex,
  );
}

function jsonSafe(value: unknown): unknown {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return value.map(jsonSafe);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, child]) => [key, jsonSafe(child)]),
    );
  }
  return value;
}

function rationalParts(value: any): [bigint, bigint] | null {
  if (!value || value.numerator === undefined || value.denominator === undefined) return null;
  try {
    return [BigInt(value.numerator), BigInt(value.denominator)];
  } catch {
    return null;
  }
}

function rationalText(value: any): string {
  const parts = rationalParts(value);
  if (!parts) return String(value ?? "");
  const [n, d] = parts;
  if (d === 1n) return String(n);
  return `${n}/${d}`;
}

function addRational(left: any, delta: bigint): { numerator: string; denominator: string } {
  const parts = rationalParts(left);
  if (!parts) return { numerator: String(delta), denominator: "1" };
  const [n, d] = parts;
  return { numerator: String(n + delta * d), denominator: String(d) };
}

function surdTermText(term: any): string {
  const pParts = rationalParts(term?.p) ?? [0n, 1n];
  const qParts = rationalParts(term?.q) ?? [0n, 1n];
  const [pn, pd] = pParts;
  const [qn, qd] = qParts;
  const d = String(term?.d ?? "");
  const p = rationalText(term?.p);
  const qAbs = qn < 0n ? -qn : qn;
  const qMagnitude = qd === 1n && qAbs === 1n ? "" : qd === 1n ? String(qAbs) : `${qAbs}/${qd}`;
  const radical = `${qMagnitude}√${d}`;
  if (qn === 0n) return p;
  if (pn === 0n) return qn < 0n ? `-${radical}` : radical;
  return `${p} ${qn < 0n ? "-" : "+"} ${radical}`;
}

function surdSetText(answer: any): string {
  return (Array.isArray(answer?.values) ? answer.values : []).map(surdTermText).join(", ");
}

function mutateSurd(answer: any, mode: "RADICAND" | "OFFSET" | "SIGN"): string {
  const values = (Array.isArray(answer?.values) ? answer.values : []).map((term: any, index: number) => {
    if (mode === "RADICAND") {
      const d = BigInt(term?.d ?? 0);
      return { ...term, d: String(d + 1n) };
    }
    if (mode === "OFFSET") {
      return index === 0 ? { ...term, p: addRational(term?.p, 1n) } : term;
    }
    const parts = rationalParts(term?.q);
    if (!parts) return term;
    const [n, d] = parts;
    return { ...term, q: { numerator: String(n < 0n ? -n : n), denominator: String(d) } };
  });
  return values.map(surdTermText).join(", ");
}

function difficultyFor(pattern: AlgebraQuestionStudioPattern): AlgebraStudioDifficulty {
  if (/ALG-CP-(001|004|006)/.test(pattern.cpId)) return "Easy";
  if (/ALG-CP-(011|014)/.test(pattern.cpId)) return "Hard";
  if (["ALG-QL-009", "ALG-QL-031", "ALG-QL-036", "ALG-QL-041", "ALG-QL-042", "ALG-QL-043"].includes(pattern.qlId)) return "Hard";
  if (["ALG-QL-001", "ALG-QL-002", "ALG-QL-003", "ALG-QL-004", "ALG-QL-016", "ALG-QL-020", "ALG-QL-021"].includes(pattern.qlId)) return "Easy";
  return "Medium";
}

function surdQuestion(input: {
  pattern: AlgebraQuestionStudioPattern;
  language: AlgebraStudioLanguage;
  examProfile: AlgebraStudioExamProfile;
  seed: string;
}): AlgebraQuestionStudioQuestionV2 {
  const sourceSeed = integerSeed(`${input.seed}:${input.pattern.qlId}:${input.pattern.variantIndex}`);
  const source = frozenSource(input.pattern, sourceSeed, input.language);
  if (source?.canonicalAnswer?.kind !== "SURD_ROOT_SET") {
    throw new Error(`${input.pattern.qlId}/${input.pattern.prototypeId}: expected SURD_ROOT_SET fallback source`);
  }
  const correct = surdSetText(source.canonicalAnswer);
  const candidates = [
    mutateSurd(source.canonicalAnswer, "RADICAND"),
    mutateSurd(source.canonicalAnswer, "OFFSET"),
    mutateSurd(source.canonicalAnswer, "SIGN"),
    input.language === "en" ? "No real roots" : input.language === "hi" ? "कोई वास्तविक मूल नहीं" : "ਕੋਈ ਵਾਸਤਵਿਕ ਮੂਲ ਨਹੀਂ",
  ];
  const wrongs = [...new Set(candidates.filter((value) => value && value !== correct))].slice(0, 3);
  if (wrongs.length !== 3) {
    throw new Error(`${input.pattern.qlId}/${input.pattern.prototypeId}: SURD_ROOT_SET needs three distinct distractors`);
  }
  const correctIndex = hashText(`${input.seed}:${input.pattern.prototypeId}:${input.language}:answer-position`) % 4;
  const options = [...wrongs];
  options.splice(correctIndex, 0, correct);
  const optionDetails = options.map((text, index) => ({
    label: LABELS[index]!,
    text,
    isCorrect: index === correctIndex,
    misconceptionId: index === correctIndex ? null : `ALG-DIST-SURD-${index + 1}`,
  }));
  const steps = String(source.explanation ?? "").split(/\n+/).map((step) => step.trim()).filter(Boolean);
  const locale = localeFor(input.language);
  const canonicalItemId = `${input.pattern.qlId}:${input.pattern.prototypeId}:${sourceSeed}`;
  const questionLanguageId = `${canonicalItemId}:${locale}`;
  const questionId = `ALG-QS-${hashText(questionLanguageId).toString(16).padStart(8, "0")}`;
  const sourceLifecycleLocked =
    source.active === false
    && source.questionStudioDiscoverable === false
    && source.questionBankStatus === "NOT_STORED"
    && source.questionBankWritable === false
    && source.testEligibility === "INELIGIBLE"
    && source.testEligible === false
    && source.publiclyPublishable === false;
  const distinct = new Set(options).size === 4;
  const oneCorrect = optionDetails.filter((option) => option.isCorrect).length === 1;
  const parity = options[correctIndex] === correct;

  return Object.freeze({
    packageId: input.pattern.packageId,
    cpId: input.pattern.cpId,
    patternId: input.pattern.prototypeId,
    qlId: input.pattern.qlId,
    prototypeId: input.pattern.prototypeId,
    variantIndex: input.pattern.variantIndex,
    questionId,
    canonicalItemId,
    questionLanguageId,
    language: input.language,
    locale,
    examProfile: input.examProfile,
    difficultyBand: difficultyFor(input.pattern),
    stem: String(source.question),
    options,
    optionDetails,
    correctIndex,
    answer: correct,
    canonicalAnswer: jsonSafe(source.canonicalAnswer),
    explanation: { steps, shortcut: "", traps: [] },
    solveMode: String(source.prototypeSolveMode),
    renderer: "TEXT_MATH",
    sourceAuthority: input.language === "en" ? "ALG-EN-v3-frozen" : ALG_MULTILINGUAL_V2_FREEZE_ID,
    sourceMaturity: String(source.maturity),
    sourceReviewStatus: String(source.reviewStatus),
    integrationAuthority: ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
    deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V2_AUTHORITY,
    validation: {
      valid: distinct && oneCorrect && parity && steps.length > 0 && sourceLifecycleLocked,
      fourDistinctOptions: distinct,
      exactlyOneCorrect: oneCorrect,
      answerParity: parity,
      frozenSourcePreserved: sourceLifecycleLocked,
      questionBankLocked: source.questionBankWritable === false && source.questionBankStatus === "NOT_STORED",
      testMockLocked: source.testEligible === false && source.testEligibility === "INELIGIBLE",
      publicationLocked: source.publiclyPublishable === false,
    },
    seed: input.seed,
  });
}

export function generateAlgebraStudioQuestionV2(input: {
  pattern: AlgebraQuestionStudioPattern;
  language?: AlgebraStudioLanguage;
  examProfile?: AlgebraStudioExamProfile;
  seed: string;
}): AlgebraQuestionStudioQuestionV2 {
  const language = input.language ?? "en";
  const examProfile = input.examProfile ?? "SSC_CORE";
  try {
    const base = generateAlgebraStudioQuestionV1({ ...input, language, examProfile });
    return Object.freeze({
      ...base,
      canonicalAnswer: jsonSafe(base.canonicalAnswer),
      deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V2_AUTHORITY,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("SURD_ROOT_SET")) {
      return surdQuestion({ pattern: input.pattern, language, examProfile, seed: input.seed });
    }
    throw error;
  }
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
  const sourceBatch = generateAlgebraStudioBatchV1(input);
  const byKey = new Map(ALGEBRA_QUESTION_STUDIO_PATTERNS.map((pattern) => [`${pattern.qlId}:${pattern.prototypeId}`, pattern]));
  const questions = sourceBatch.questions.map((base, index) => {
    const pattern = byKey.get(`${base.qlId}:${base.prototypeId}`);
    if (!pattern) throw new Error(`Question Studio pattern identity missing for ${base.qlId}/${base.prototypeId}`);
    return generateAlgebraStudioQuestionV2({
      pattern,
      language: input.language,
      examProfile: input.examProfile,
      seed: `${input.seed}:${index}`,
    });
  });
  return {
    ...sourceBatch,
    authority: ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
    deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V2_AUTHORITY,
    package: ALGEBRA_QUESTION_STUDIO_PACKAGE_V2,
    questions,
  };
}
