import {
  assertQuantV4OptionCount,
  getQuantV4ExamProfileContract,
  type QuantV4ExamProfileId,
} from "../../../common/exam-profile";
import {
  ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  ALGEBRA_QUESTION_STUDIO_PATTERNS,
  type AlgebraQuestionStudioPattern,
  type AlgebraStudioDifficulty,
  type AlgebraStudioLanguage,
} from "./algebra-question-studio-runtime-v1";
import {
  ALGEBRA_QUESTION_STUDIO_PACKAGE_V4,
  generateAlgebraStudioQuestionV4,
} from "./algebra-question-studio-runtime-v4";

export const ALGEBRA_QUESTION_STUDIO_DELIVERY_V5_AUTHORITY =
  "ALGEBRA-FROZEN-QUESTION-STUDIO-DELIVERY-V5-CENTRAL-OPTION-CONTRACT" as const;

export const ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES_V5 = [
  "SSC_CORE",
  "SSC_ADVANCED",
  "BANKING_PRELIMS",
  "BANKING_MAINS",
  "PUNJAB_STATE",
] as const;

export type AlgebraStudioExamProfileV5 =
  (typeof ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES_V5)[number];

const LABELS = ["A", "B", "C", "D", "E"] as const;

type OptionLabelV5 = (typeof LABELS)[number];

function hashText(text: string): number {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x7feb352d) >>> 0;
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 0x846ca68b) >>> 0;
  hash ^= hash >>> 16;
  return hash >>> 0;
}

function sourceProfile(profile: AlgebraStudioExamProfileV5) {
  if (profile === "BANKING_PRELIMS" || profile === "BANKING_MAINS") return "BANKING" as const;
  return profile;
}

export function centralProfileForAlgebraV5(profile: AlgebraStudioExamProfileV5): QuantV4ExamProfileId {
  if (profile === "SSC_ADVANCED") return "SSC_CGL_JSO";
  if (profile === "BANKING_PRELIMS") return "BANKING_PRELIMS";
  if (profile === "BANKING_MAINS") return "BANKING_MAINS";
  if (profile === "PUNJAB_STATE") return "GENERIC_PRACTICE";
  return "SSC_CGL_CHSL";
}

function phrase(language: AlgebraStudioLanguage, en: string, hi: string, pa: string) {
  return language === "hi" ? hi : language === "pa" ? pa : en;
}

function mutateLastInteger(text: string, delta: number): string | null {
  const matches = [...text.matchAll(/-?\d+/g)];
  const last = matches.at(-1);
  if (!last || last.index === undefined) return null;
  const value = Number(last[0]);
  if (!Number.isFinite(value)) return null;
  return `${text.slice(0, last.index)}${value + delta}${text.slice(last.index + last[0].length)}`;
}

function extraWrongCandidates(
  question: ReturnType<typeof generateAlgebraStudioQuestionV4>,
): string[] {
  const language = question.language;
  const none = phrase(language, "None of these", "इनमें से कोई नहीं", "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ");
  const cannot = phrase(language, "Cannot be determined", "निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ");
  const noSolution = phrase(language, "No solution", "कोई हल नहीं", "ਕੋਈ ਹੱਲ ਨਹੀਂ");
  const oneSolution = phrase(language, "Exactly one solution", "ठीक एक हल", "ਠੀਕ ਇੱਕ ਹੱਲ");
  const twoSolutions = phrase(language, "Two solutions", "दो हल", "ਦੋ ਹੱਲ");
  const infiniteSolutions = phrase(language, "Infinitely many solutions", "अनंत हल", "ਅਨੰਤ ਹੱਲ");
  const noRealRoots = phrase(language, "No real roots", "कोई वास्तविक मूल नहीं", "ਕੋਈ ਵਾਸਤਵਿਕ ਮੂਲ ਨਹੀਂ");
  const allReal = phrase(language, "All real numbers", "सभी वास्तविक संख्याएँ", "ਸਾਰੀਆਂ ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ");
  const emptySet = phrase(language, "Empty set", "रिक्त समुच्चय", "ਖਾਲੀ ਸਮੂਹ");
  const ds = [
    phrase(language, "Statement I alone is sufficient", "केवल कथन I पर्याप्त है", "ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ"),
    phrase(language, "Statement II alone is sufficient", "केवल कथन II पर्याप्त है", "ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ"),
    phrase(language, "Either statement alone is sufficient", "कोई भी एक कथन अकेले पर्याप्त है", "ਕੋਈ ਵੀ ਇੱਕ ਕਥਨ ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ"),
    phrase(language, "Both statements together are sufficient, but neither alone is sufficient", "दोनों कथन मिलकर पर्याप्त हैं, पर कोई भी अकेला पर्याप्त नहीं है", "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਕਾਫ਼ੀ ਹਨ, ਪਰ ਕੋਈ ਵੀ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ"),
    phrase(language, "Even both statements together are not sufficient", "दोनों कथन मिलकर भी पर्याप्त नहीं हैं", "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ"),
  ];
  const canonical = question.canonicalAnswer as { kind?: string } | string | null;
  const kind = typeof canonical === "object" && canonical ? String(canonical.kind ?? "") : "";
  const semantic = kind === "DATA_SUFFICIENCY"
    ? ds
    : [none, cannot, noSolution, oneSolution, twoSolutions, infiniteSolutions, noRealRoots, allReal, emptySet];
  return [
    ...semantic,
    mutateLastInteger(question.answer, 1),
    mutateLastInteger(question.answer, -1),
    mutateLastInteger(question.answer, 2),
    question.answer.includes(" + ") ? question.answer.replace(" + ", " - ") : null,
    question.answer.includes(" - ") ? question.answer.replace(" - ", " + ") : null,
  ].filter((value): value is string => Boolean(value?.trim()));
}

function expandOptionsForProfile(
  base: ReturnType<typeof generateAlgebraStudioQuestionV4>,
  profile: AlgebraStudioExamProfileV5,
) {
  const centralProfile = centralProfileForAlgebraV5(profile);
  const optionCount = getQuantV4ExamProfileContract(centralProfile).optionCount;
  if (optionCount === 4) {
    assertQuantV4OptionCount(centralProfile, base.options.length, "Algebra Question Studio V5");
    return {
      options: [...base.options],
      correctIndex: base.correctIndex,
      answer: base.answer,
      optionDetails: base.optionDetails.map((option) => ({ ...option, label: option.label as OptionLabelV5 })),
      optionCount,
      centralProfile,
    };
  }

  const existing = new Set(base.options.map((value) => value.trim()));
  const extra = extraWrongCandidates(base).find((candidate) => {
    const normalized = candidate.trim();
    return normalized && normalized !== base.answer.trim() && !existing.has(normalized);
  });
  if (!extra) {
    throw new Error(`${base.qlId}/${base.prototypeId}: no fourth misconception-safe banking distractor was available.`);
  }

  const wrongs = [
    ...base.optionDetails.filter((option) => !option.isCorrect).map((option) => option.text),
    extra,
  ];
  if (new Set(wrongs).size !== 4 || wrongs.includes(base.answer)) {
    throw new Error(`${base.qlId}/${base.prototypeId}: banking distractor expansion is not unique.`);
  }
  const correctIndex = hashText(`${base.seed}:${base.prototypeId}:${profile}:v5-answer-position`) % 5;
  const options = [...wrongs];
  options.splice(correctIndex, 0, base.answer);
  const optionDetails = options.map((text, index) => ({
    label: LABELS[index]!,
    text,
    isCorrect: index === correctIndex,
    misconceptionId: index === correctIndex ? null : `ALG-DIST-V5-M${index + 1}`,
  }));
  assertQuantV4OptionCount(centralProfile, options.length, "Algebra Question Studio V5");
  return { options, correctIndex, answer: base.answer, optionDetails, optionCount, centralProfile };
}

export type AlgebraQuestionStudioQuestionV5 = Omit<
  ReturnType<typeof generateAlgebraStudioQuestionV4>,
  "examProfile" | "options" | "optionDetails" | "correctIndex" | "questionId" | "deliveryAuthority" | "validation"
> & {
  readonly examProfile: AlgebraStudioExamProfileV5;
  readonly centralExamProfile: QuantV4ExamProfileId;
  readonly optionCount: 4 | 5;
  readonly options: readonly string[];
  readonly optionDetails: readonly {
    label: OptionLabelV5;
    text: string;
    isCorrect: boolean;
    misconceptionId: string | null;
  }[];
  readonly correctIndex: number;
  readonly questionId: string;
  readonly deliveryAuthority: typeof ALGEBRA_QUESTION_STUDIO_DELIVERY_V5_AUTHORITY;
  readonly validation: ReturnType<typeof generateAlgebraStudioQuestionV4>["validation"] & {
    centralOptionCountConformant: boolean;
  };
};

export const ALGEBRA_QUESTION_STUDIO_PACKAGE_V5 = Object.freeze({
  ...ALGEBRA_QUESTION_STUDIO_PACKAGE_V4,
  label: "Algebra · Frozen Full Chapter · Delivery V5 Central Profile Conformant",
  deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V5_AUTHORITY,
  supportedExamProfiles: ALGEBRA_QUESTION_STUDIO_EXAM_PROFILES_V5,
  reviewStatus: "QUESTION_STUDIO_REVIEW_CONNECTED_CENTRAL_OPTION_PROFILE_CONFORMANT" as const,
  optionCountByExamProfile: Object.freeze({
    SSC_CORE: 4,
    SSC_ADVANCED: 4,
    BANKING_PRELIMS: 5,
    BANKING_MAINS: 5,
    PUNJAB_STATE: 4,
  }),
});

export function generateAlgebraStudioQuestionV5(input: {
  pattern: AlgebraQuestionStudioPattern;
  language?: AlgebraStudioLanguage;
  examProfile?: AlgebraStudioExamProfileV5;
  seed: string;
}): AlgebraQuestionStudioQuestionV5 {
  const language = input.language ?? "en";
  const examProfile = input.examProfile ?? "SSC_CORE";
  const base = generateAlgebraStudioQuestionV4({
    pattern: input.pattern,
    language,
    examProfile: sourceProfile(examProfile),
    seed: input.seed,
  });
  const delivery = expandOptionsForProfile(base, examProfile);
  const questionId = `ALG-QS5-${hashText(`${base.questionLanguageId}:${examProfile}:${delivery.optionCount}`).toString(16).padStart(8, "0")}`;
  const distinct = new Set(delivery.options).size === delivery.optionCount;
  const oneCorrect = delivery.optionDetails.filter((option) => option.isCorrect).length === 1;
  const parity = delivery.options[delivery.correctIndex] === delivery.answer;
  const centralOptionCountConformant = delivery.options.length === getQuantV4ExamProfileContract(delivery.centralProfile).optionCount;
  return Object.freeze({
    ...base,
    examProfile,
    centralExamProfile: delivery.centralProfile,
    optionCount: delivery.optionCount,
    options: delivery.options,
    optionDetails: delivery.optionDetails,
    correctIndex: delivery.correctIndex,
    answer: delivery.answer,
    questionId,
    deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V5_AUTHORITY,
    validation: {
      ...base.validation,
      valid: base.validation.valid && distinct && oneCorrect && parity && centralOptionCountConformant,
      fourDistinctOptions: delivery.optionCount === 4 ? distinct : base.validation.fourDistinctOptions,
      exactlyOneCorrect: oneCorrect,
      answerParity: parity,
      centralOptionCountConformant,
    },
  });
}

function difficultyForPattern(pattern: AlgebraQuestionStudioPattern): AlgebraStudioDifficulty {
  const probe = generateAlgebraStudioQuestionV4({ pattern, seed: `alg-v5-difficulty:${pattern.prototypeId}` });
  return probe.difficultyBand;
}

function weightForProfile(pattern: AlgebraQuestionStudioPattern, profile: AlgebraStudioExamProfileV5) {
  const cp = Number(pattern.cpId.slice(-3));
  if (profile === "BANKING_PRELIMS" || profile === "BANKING_MAINS") {
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

export function generateAlgebraStudioBatchV5(input: {
  language?: AlgebraStudioLanguage;
  examProfile?: AlgebraStudioExamProfileV5;
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
    if (input.difficulty && difficultyForPattern(pattern) !== input.difficulty) return false;
    return true;
  });
  if (!patterns.length) throw new Error("No frozen Algebra Question Studio patterns matched the request.");
  patterns = [...patterns].sort((left, right) => {
    const leftScore = hashText(`${input.seed}:${left.prototypeId}`) / weightForProfile(left, examProfile);
    const rightScore = hashText(`${input.seed}:${right.prototypeId}`) / weightForProfile(right, examProfile);
    return leftScore - rightScore;
  });
  const count = Math.max(1, Math.min(Math.floor(input.count), 50));
  const questions = Array.from({ length: count }, (_unused, index) => generateAlgebraStudioQuestionV5({
    pattern: patterns[index % patterns.length]!,
    language,
    examProfile,
    seed: `${input.seed}:${index}`,
  }));
  return {
    authority: ALGEBRA_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
    deliveryAuthority: ALGEBRA_QUESTION_STUDIO_DELIVERY_V5_AUTHORITY,
    package: ALGEBRA_QUESTION_STUDIO_PACKAGE_V5,
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
  };
}
