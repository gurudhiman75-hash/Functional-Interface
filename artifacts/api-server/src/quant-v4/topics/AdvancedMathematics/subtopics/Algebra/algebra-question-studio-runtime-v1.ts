import {
  ALG_MULTILINGUAL_V2_FREEZE_ID,
  ALG_PERMANENT_ALLOCATION,
  generateAlgPermanentEnglishV3Frozen,
  generateAlgPermanentMultilingualV2Frozen,
  getAlgPermanentPrototypeIds,
  type AlgPermanentQlId,
  type AlgReviewLocale,
} from "./permanent";

export const ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY =
  "ALGEBRA-FROZEN-QUESTION-STUDIO-V1" as const;
export const ALGEBRA_QUESTION_STUDIO_PACKAGE_ID = "ALGEBRA" as const;
export const ALGEBRA_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const ALGEBRA_QUESTION_STUDIO_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export const ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES = [
  "SSC_CORE",
  "SSC_ADVANCED",
  "BANKING",
  "PUNJAB_STATE",
] as const;

export type AlgebraStudioLanguage = (typeof ALGEBRA_QUESTION_STUDIO_LANGUAGES)[number];
export type AlgebraStudioDifficulty = (typeof ALGEBRA_QUESTION_STUDIO_DIFFICULTIES)[number];
export type AlgebraStudioExamProfile = (typeof ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES)[number];

export interface AlgebraQuestionStudioPattern {
  readonly qlId: AlgPermanentQlId;
  readonly packageId: "ALG-001" | "ALG-002";
  readonly cpId: string;
  readonly title: string;
  readonly prototypeId: string;
  readonly variantIndex: number;
  readonly solveModeId: string;
  readonly evidenceLevel: string;
}

export interface AlgebraQuestionStudioQuestion {
  readonly packageId: "ALG-001" | "ALG-002";
  readonly cpId: string;
  readonly patternId: string;
  readonly qlId: AlgPermanentQlId;
  readonly prototypeId: string;
  readonly variantIndex: number;
  readonly questionId: string;
  readonly canonicalItemId: string;
  readonly questionLanguageId: string;
  readonly language: AlgebraStudioLanguage;
  readonly locale: "en-IN" | "hi-IN" | "pa-IN";
  readonly examProfile: AlgebraStudioExamProfile;
  readonly difficultyBand: AlgebraStudioDifficulty;
  readonly stem: string;
  readonly options: readonly string[];
  readonly optionDetails: readonly {
    label: "A" | "B" | "C" | "D";
    text: string;
    isCorrect: boolean;
    misconceptionId: string | null;
  }[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly canonicalAnswer: unknown;
  readonly explanation: {
    steps: readonly string[];
    shortcut: string;
    traps: readonly string[];
  };
  readonly solveMode: string;
  readonly renderer: "TEXT_MATH";
  readonly sourceAuthority: typeof ALG_MULTILINGUAL_V2_FREEZE_ID | "ALG-EN-v3-frozen";
  readonly sourceMaturity: string;
  readonly sourceReviewStatus: string;
  readonly integrationAuthority: typeof ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY;
  readonly validation: {
    valid: boolean;
    fourDistinctOptions: boolean;
    exactlyOneCorrect: boolean;
    answerParity: boolean;
    frozenSourcePreserved: boolean;
    questionBankLocked: boolean;
    testMockLocked: boolean;
    publicationLocked: boolean;
  };
  readonly seed: string;
}

const LABELS = ["A", "B", "C", "D"] as const;

export const ALGEBRA_QUESTION_STUDIO_PATTERNS: readonly AlgebraQuestionStudioPattern[] =
  ALG_PERMANENT_ALLOCATION.flatMap((allocation) =>
    getAlgPermanentPrototypeIds(allocation.qlId).map((prototypeId, variantIndex) => ({
      qlId: allocation.qlId,
      packageId: allocation.packageId,
      cpId: allocation.cpId,
      title: allocation.title,
      prototypeId,
      variantIndex,
      solveModeId: allocation.solveModeId,
      evidenceLevel: allocation.evidenceLevel,
    })),
  );

export const ALGEBRA_QUESTION_STUDIO_CANONICAL_PROBLEMS = Array.from(
  new Map(
    ALGEBRA_QUESTION_STUDIO_PATTERNS.map((pattern) => [
      pattern.cpId,
      {
        cpId: pattern.cpId,
        title: pattern.cpId.replace("ALG-CP-", "Algebra CP "),
        qlCount: new Set(
          ALGEBRA_QUESTION_STUDIO_PATTERNS
            .filter((row) => row.cpId === pattern.cpId)
            .map((row) => row.qlId),
        ).size,
        patternCount: ALGEBRA_QUESTION_STUDIO_PATTERNS.filter((row) => row.cpId === pattern.cpId).length,
      },
    ]),
  ).values(),
);

export const ALGEBRA_QUESTION_STUDIO_PACKAGE_V1 = Object.freeze({
  packageId: ALGEBRA_QUESTION_STUDIO_PACKAGE_ID,
  label: "Algebra · Frozen Full Chapter",
  integrationAuthority: ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  sourceFreezeAuthority: ALG_MULTILINGUAL_V2_FREEZE_ID,
  canonicalProblemCount: ALGEBRA_QUESTION_STUDIO_CANONICAL_PROBLEMS.length,
  qlCount: ALG_PERMANENT_ALLOCATION.length,
  patternCount: ALGEBRA_QUESTION_STUDIO_PATTERNS.length,
  canonicalProblems: ALGEBRA_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  patterns: ALGEBRA_QUESTION_STUDIO_PATTERNS,
  supportedLanguages: ALGEBRA_QUESTION_STUDIO_LANGUAGES,
  supportedDifficulties: ALGEBRA_QUESTION_STUDIO_DIFFICULTIES,
  supportedExamProfiles: ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES,
  defaultExamProfile: "SSC_CORE" as const,
  runtimeMode: "FROZEN_CHAPTER_REVIEW_RUNTIME" as const,
  reviewStatus: "QUESTION_STUDIO_REVIEW_CONNECTED" as const,
  questionStudioDiscoverable: true as const,
  persistenceAllowed: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  manualApprovalRequired: true as const,
  automaticStudentPublication: false as const,
});

function hashText(text: string): number {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function asIntegerSeed(seed: string): number {
  const trailing = /(?:^|:)(\d+)$/.exec(seed)?.[1];
  return trailing === undefined ? hashText(seed) : Number(trailing) >>> 0;
}

function localeFor(language: AlgebraStudioLanguage): "en-IN" | "hi-IN" | "pa-IN" {
  if (language === "hi") return "hi-IN";
  if (language === "pa") return "pa-IN";
  return "en-IN";
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
  return d === 1n ? String(n) : `${n}/${d}`;
}

function canonicalAnswerText(answer: any, language: AlgebraStudioLanguage): string {
  if (typeof answer === "string") {
    const comparison: Record<string, readonly [string, string, string]> = {
      X_GREATER_THAN_Y: ["x > y", "x > y", "x > y"],
      X_LESS_THAN_Y: ["x < y", "x < y", "x < y"],
      X_GREATER_THAN_OR_EQUAL_TO_Y: ["x ≥ y", "x ≥ y", "x ≥ y"],
      X_LESS_THAN_OR_EQUAL_TO_Y: ["x ≤ y", "x ≤ y", "x ≤ y"],
      X_EQUAL_TO_Y: ["x = y", "x = y", "x = y"],
      RELATION_CANNOT_BE_ESTABLISHED: ["Cannot be determined", "निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"],
      CANNOT_BE_DETERMINED: ["Cannot be determined", "निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"],
    };
    const tuple = comparison[answer];
    if (tuple) return tuple[language === "en" ? 0 : language === "hi" ? 1 : 2];
    return answer;
  }
  if (!answer || typeof answer !== "object") return String(answer ?? "");
  if (typeof answer.text === "string" && answer.text.trim()) return localizeCategoryText(answer.text, language);

  switch (answer.kind) {
    case "RATIONAL":
    case "UNIQUE_VALUE":
    case "PARAMETER_VALUE":
    case "EXCLUDED_VALUE":
      return rationalText(answer.value);
    case "BOOLEAN":
      return answer.value ? yesNo(language, true) : yesNo(language, false);
    case "NO_SOLUTION":
      return category(language, "No solution", "कोई हल नहीं", "ਕੋਈ ਹੱਲ ਨਹੀਂ");
    case "INFINITE_SOLUTIONS":
      return category(language, "Infinitely many solutions", "अनंत हल", "ਅਨੰਤ ਹੱਲ");
    case "NO_REAL_ROOTS":
      return category(language, "No real roots", "कोई वास्तविक मूल नहीं", "ਕੋਈ ਵਾਸਤਵਿਕ ਮੂਲ ਨਹੀਂ");
    case "INFINITE_ON_DOMAIN":
      return `${category(language, "All allowed real values except", "सभी मान्य वास्तविक मान, सिवाय", "ਸਾਰੇ ਮੰਨਯੋਗ ਵਾਸਤਵਿਕ ਮਾਨ, ਸਿਵਾਏ")} ${
        (answer.excludedValues ?? []).map(rationalText).join(", ")
      }`;
    case "ROOT_SET":
    case "RATIONAL_ROOT_SET":
      return (answer.values ?? []).map(rationalText).join(", ");
    case "ORDERED_PAIR":
      return `(${rationalText(answer.x)}, ${rationalText(answer.y)})`;
    case "ORDERED_TRIPLE":
      return `(${rationalText(answer.x)}, ${rationalText(answer.y)}, ${rationalText(answer.z)})`;
    case "COEFFICIENT_PAIR":
      return `k = ${rationalText(answer.k)}, m = ${rationalText(answer.m)}`;
    case "PARAMETER_REMAINDER":
      return `k = ${rationalText(answer.parameter)}, r = ${rationalText(answer.remainder)}`;
    case "QUADRATIC_EQUATION": {
      const value = answer.value ?? {};
      return quadraticText(value.a, value.b, value.c);
    }
    default:
      return typeof answer.value === "string" ? localizeCategoryText(answer.value, language) : String(answer.kind ?? "Answer");
  }
}

function category(language: AlgebraStudioLanguage, en: string, hi: string, pa: string): string {
  return language === "en" ? en : language === "hi" ? hi : pa;
}

function yesNo(language: AlgebraStudioLanguage, yes: boolean): string {
  if (yes) return category(language, "Yes", "हाँ", "ਹਾਂ");
  return category(language, "No", "नहीं", "ਨਹੀਂ");
}

function localizeCategoryText(text: string, language: AlgebraStudioLanguage): string {
  if (language === "en") return text;
  const hi: Record<string, string> = {
    "Quantity I > Quantity II": "राशि I > राशि II",
    "Quantity I < Quantity II": "राशि I < राशि II",
    "Quantity I = Quantity II": "राशि I = राशि II",
    "The relationship cannot be determined": "संबंध निर्धारित नहीं किया जा सकता",
    "Statement I alone is sufficient": "केवल कथन I पर्याप्त है",
    "Statement II alone is sufficient": "केवल कथन II पर्याप्त है",
    "Either statement alone is sufficient": "कोई भी एक कथन अकेले पर्याप्त है",
    "Both statements together are sufficient": "दोनों कथन मिलकर पर्याप्त हैं",
    "Even both statements together are not sufficient": "दोनों कथन मिलकर भी पर्याप्त नहीं हैं",
  };
  const pa: Record<string, string> = {
    "Quantity I > Quantity II": "ਰਾਸ਼ੀ I > ਰਾਸ਼ੀ II",
    "Quantity I < Quantity II": "ਰਾਸ਼ੀ I < ਰਾਸ਼ੀ II",
    "Quantity I = Quantity II": "ਰਾਸ਼ੀ I = ਰਾਸ਼ੀ II",
    "The relationship cannot be determined": "ਸੰਬੰਧ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ",
    "Statement I alone is sufficient": "ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ",
    "Statement II alone is sufficient": "ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ",
    "Either statement alone is sufficient": "ਕੋਈ ਵੀ ਇੱਕ ਕਥਨ ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ",
    "Both statements together are sufficient": "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਕਾਫ਼ੀ ਹਨ",
    "Even both statements together are not sufficient": "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ",
  };
  return (language === "hi" ? hi : pa)[text] ?? text;
}

function signedTerm(value: any, variable: string): string {
  const parts = rationalParts(value);
  if (!parts) return ` + ${rationalText(value)}${variable}`;
  const [n, d] = parts;
  if (n === 0n) return "";
  const abs = n < 0n ? -n : n;
  const coeff = d === 1n && abs === 1n ? "" : d === 1n ? String(abs) : `${abs}/${d}`;
  return `${n < 0n ? " - " : " + "}${coeff}${variable}`;
}

function quadraticText(a: any, b: any, c: any): string {
  const ap = rationalParts(a);
  const lead = ap && ap[0] === 1n && ap[1] === 1n ? "x²" : ap && ap[0] === -1n && ap[1] === 1n ? "-x²" : `${rationalText(a)}x²`;
  return `${lead}${signedTerm(b, "x")}${signedTerm(c, "")} = 0`;
}

function numericDistractors(answer: any): string[] {
  const value = answer?.value ?? answer;
  const parts = rationalParts(value);
  if (!parts) return [];
  const [n, d] = parts;
  const candidates: Array<[bigint, bigint]> = [
    [-n, d],
    [n + d, d],
    [n - d, d],
    [n === 0n ? 1n : d, n === 0n ? 1n : n],
    [n + 2n * d, d],
  ];
  return candidates
    .filter(([, denominator]) => denominator !== 0n)
    .map(([num, den]) => den === 1n ? String(num) : `${num}/${den}`);
}

function relationOptions(language: AlgebraStudioLanguage): string[] {
  return [
    "x > y",
    "x < y",
    "x = y",
    category(language, "Cannot be determined", "निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"),
  ];
}

function dataSufficiencyOptions(language: AlgebraStudioLanguage): string[] {
  return [
    localizeCategoryText("Statement I alone is sufficient", language),
    localizeCategoryText("Statement II alone is sufficient", language),
    localizeCategoryText("Both statements together are sufficient", language),
    localizeCategoryText("Even both statements together are not sufficient", language),
    localizeCategoryText("Either statement alone is sufficient", language),
  ];
}

function quantityRelationOptions(language: AlgebraStudioLanguage): string[] {
  return [
    localizeCategoryText("Quantity I > Quantity II", language),
    localizeCategoryText("Quantity I < Quantity II", language),
    localizeCategoryText("Quantity I = Quantity II", language),
    localizeCategoryText("The relationship cannot be determined", language),
  ];
}

function textMutations(correct: string): string[] {
  const values = new Set<string>();
  const flipFirstSign = correct.replace(/\s\+\s/, " - ") !== correct
    ? correct.replace(/\s\+\s/, " - ")
    : correct.replace(/\s-\s/, " + ");
  values.add(flipFirstSign);
  values.add(correct.replace(/(-?\d+)(?!.*\d)/, (match) => String(Number(match) + 1)));
  values.add(correct.replace(/(-?\d+)(?!.*\d)/, (match) => String(Number(match) - 1)));
  values.add(correct.replace(/[\[(]/, (ch) => ch === "[" ? "(" : "[").replace(/[\])]/, (ch) => ch === "]" ? ")" : "]"));
  values.delete(correct);
  values.delete("");
  return [...values];
}

function buildDistractorCandidates(answer: any, correct: string, language: AlgebraStudioLanguage): string[] {
  if (typeof answer === "string") return relationOptions(language);
  const kind = answer?.kind;
  if (["RATIONAL", "UNIQUE_VALUE", "PARAMETER_VALUE", "EXCLUDED_VALUE"].includes(kind)) {
    return numericDistractors(answer);
  }
  if (kind === "BOOLEAN") {
    return [
      yesNo(language, true),
      yesNo(language, false),
      category(language, "Cannot be determined", "निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"),
      category(language, "Insufficient information", "जानकारी अपर्याप्त है", "ਜਾਣਕਾਰੀ ਅਧੂਰੀ ਹੈ"),
    ];
  }
  if (kind === "DATA_SUFFICIENCY") return dataSufficiencyOptions(language);
  if (kind === "QUANTITY_RELATION") return quantityRelationOptions(language);
  if (["NO_SOLUTION", "INFINITE_SOLUTIONS", "NO_REAL_ROOTS", "INFINITE_ON_DOMAIN"].includes(kind)) {
    return [
      category(language, "No solution", "कोई हल नहीं", "ਕੋਈ ਹੱਲ ਨਹੀਂ"),
      category(language, "Exactly one solution", "ठीक एक हल", "ਠੀਕ ਇੱਕ ਹੱਲ"),
      category(language, "Two solutions", "दो हल", "ਦੋ ਹੱਲ"),
      category(language, "Infinitely many solutions", "अनंत हल", "ਅਨੰਤ ਹੱਲ"),
      category(language, "No real roots", "कोई वास्तविक मूल नहीं", "ਕੋਈ ਵਾਸਤਵਿਕ ਮੂਲ ਨਹੀਂ"),
    ];
  }
  if (["ROOT_SET", "RATIONAL_ROOT_SET"].includes(kind)) {
    const values = Array.isArray(answer.values) ? answer.values.map(rationalText) : [];
    const joined = values.join(", ");
    return [
      values.length > 1 ? values.slice(0, 1).join(", ") : String(-Number(values[0] ?? 0)),
      values.map((value: string) => String(-Number(value))).join(", "),
      category(language, "No solution", "कोई हल नहीं", "ਕੋਈ ਹੱਲ ਨਹੀਂ"),
      values.length ? `${joined}, 0` : "0",
    ];
  }
  if (kind === "ORDERED_PAIR") {
    const x = rationalText(answer.x); const y = rationalText(answer.y);
    return [`(${y}, ${x})`, `(${-Number(x)}, ${y})`, `(${x}, ${-Number(y)})`, `(${Number(x) + 1}, ${y})`];
  }
  if (kind === "ORDERED_TRIPLE") {
    const x = rationalText(answer.x); const y = rationalText(answer.y); const z = rationalText(answer.z);
    return [`(${y}, ${x}, ${z})`, `(${x}, ${z}, ${y})`, `(${-Number(x)}, ${y}, ${z})`, `(${x}, ${y}, ${Number(z) + 1})`];
  }
  if (kind === "COEFFICIENT_PAIR") {
    const k = rationalText(answer.k); const m = rationalText(answer.m);
    return [`k = ${m}, m = ${k}`, `k = ${-Number(k)}, m = ${m}`, `k = ${k}, m = ${-Number(m)}`, `k = ${Number(k) + 1}, m = ${m}`];
  }
  if (kind === "PARAMETER_REMAINDER") {
    const k = rationalText(answer.parameter); const r = rationalText(answer.remainder);
    return [`k = ${r}, r = ${k}`, `k = ${-Number(k)}, r = ${r}`, `k = ${k}, r = ${-Number(r)}`, `k = ${Number(k) + 1}, r = ${r}`];
  }
  return textMutations(correct);
}

function buildOptions(answer: any, language: AlgebraStudioLanguage, seed: string): {
  options: string[];
  optionDetails: AlgebraQuestionStudioQuestion["optionDetails"];
  correctIndex: number;
  answer: string;
} {
  const correct = canonicalAnswerText(answer, language);
  const candidatePool = [
    ...buildDistractorCandidates(answer, correct, language),
    ...textMutations(correct),
    category(language, "Cannot be determined", "निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"),
    category(language, "None of these", "इनमें से कोई नहीं", "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ"),
  ];
  const wrongs = [...new Set(candidatePool.map((value) => value.trim()).filter((value) => value && value !== correct))].slice(0, 3);
  if (wrongs.length !== 3) {
    throw new Error(`Algebra Question Studio could not build three distinct distractors for '${correct}'`);
  }
  const correctIndex = hashText(`${seed}:answer-position`) % 4;
  const options = [...wrongs];
  options.splice(correctIndex, 0, correct);
  const misconceptionIds = ["SIGN_OR_DIRECTION", "NEARBY_OPERATION", "STRUCTURE_OR_DOMAIN"] as const;
  let wrongIndex = 0;
  const optionDetails = options.map((text, index) => ({
    label: LABELS[index]!,
    text,
    isCorrect: index === correctIndex,
    misconceptionId: index === correctIndex ? null : `ALG-DIST-${misconceptionIds[wrongIndex++]}`,
  }));
  return { options, optionDetails, correctIndex, answer: correct };
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

function frozenSource(
  pattern: AlgebraQuestionStudioPattern,
  sourceSeed: number,
  language: AlgebraStudioLanguage,
): any {
  if (language === "en") {
    return generateAlgPermanentEnglishV3Frozen(pattern.qlId, sourceSeed, pattern.variantIndex);
  }
  return generateAlgPermanentMultilingualV2Frozen(
    pattern.qlId,
    sourceSeed,
    localeFor(language) as AlgReviewLocale,
    pattern.variantIndex,
  );
}

function sourceQuestion(source: any, language: AlgebraStudioLanguage): string {
  return language === "en" ? String(source.question) : String(source.question);
}

function sourceExplanation(source: any): string[] {
  return String(source.explanation ?? "")
    .split(/\n+/)
    .map((step) => step.trim())
    .filter(Boolean);
}

export function generateAlgebraStudioQuestionV1(input: {
  pattern: AlgebraQuestionStudioPattern;
  language?: AlgebraStudioLanguage;
  examProfile?: AlgebraStudioExamProfile;
  seed: string;
}): AlgebraQuestionStudioQuestion {
  const language = input.language ?? "en";
  const examProfile = input.examProfile ?? "SSC_CORE";
  const locale = localeFor(language);
  const sourceSeed = asIntegerSeed(`${input.seed}:${input.pattern.qlId}:${input.pattern.variantIndex}`);
  const source = frozenSource(input.pattern, sourceSeed, language);
  const optionLayer = buildOptions(source.canonicalAnswer, language, `${input.seed}:${input.pattern.prototypeId}:${language}`);
  const steps = sourceExplanation(source);
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
  const distinct = new Set(optionLayer.options).size === 4;
  const oneCorrect = optionLayer.optionDetails.filter((option) => option.isCorrect).length === 1;
  const parity = optionLayer.options[optionLayer.correctIndex] === optionLayer.answer;

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
    language,
    locale,
    examProfile,
    difficultyBand: difficultyFor(input.pattern),
    stem: sourceQuestion(source, language),
    options: optionLayer.options,
    optionDetails: optionLayer.optionDetails,
    correctIndex: optionLayer.correctIndex,
    answer: optionLayer.answer,
    canonicalAnswer: source.canonicalAnswer,
    explanation: {
      steps,
      shortcut: "",
      traps: [],
    },
    solveMode: String(source.prototypeSolveMode),
    renderer: "TEXT_MATH",
    sourceAuthority: language === "en" ? "ALG-EN-v3-frozen" : ALG_MULTILINGUAL_V2_FREEZE_ID,
    sourceMaturity: String(source.maturity),
    sourceReviewStatus: String(source.reviewStatus),
    integrationAuthority: ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
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

export function generateAlgebraStudioBatchV1(input: {
  language?: AlgebraStudioLanguage;
  examProfile?: AlgebraStudioExamProfile;
  difficulty?: AlgebraStudioDifficulty;
  cpId?: string;
  qlId?: AlgPermanentQlId;
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
    return generateAlgebraStudioQuestionV1({
      pattern,
      language,
      examProfile,
      seed: `${input.seed}:${index}`,
    });
  });

  return {
    authority: ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
    package: ALGEBRA_QUESTION_STUDIO_PACKAGE_V1,
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
    publiclyPublishable: false as const,
  };
}
