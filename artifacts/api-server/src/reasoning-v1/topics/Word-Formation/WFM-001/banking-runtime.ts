import {
  WFM_SELECTED_LETTER_FIXTURES,
  selectedFixtureLetters,
  type WfmSelectedLetterFixture,
} from "./authorities";
import {
  WFM_BANKING_ORDERED_EXTRACTION_FIXTURES,
  extractOrderedBankingLetters,
  type WfmOrderedExtractionFixture,
  type WfmOrderedExtractionOptionAuthority,
} from "./banking-authorities";
import type {
  WfmDifficulty,
  WfmGeneratedQuestion,
  WfmLanguage,
  WfmOption,
} from "./types";

const OPTION_IDS = ["A", "B", "C", "D", "E"] as const;

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function rngFor(seed: number): () => number {
  let state = (seed >>> 0) ^ 0x85ebca6b;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(values: readonly T[], seed: number): T[] {
  const out = [...values];
  const rng = rngFor(seed);
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function lifecycleMetadata() {
  return {
    runtimeVersion: "WFM-001-RUNTIME-V2-REVIEW" as const,
    optionCount: 5 as const,
    sourceEvidenceStatus: "SOURCE_BACKED_WORD_FORMATION" as const,
    lifecycle: "REVIEW_ONLY" as const,
    questionStudioVisible: false as const,
    questionBankStored: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    difficultyBasis: "GENERATED_INSTANCE" as const,
    ownershipDecision: "APPROVED_REAS_WFM" as const,
  };
}

function optionize(entries: readonly Omit<WfmOption, "id">[], seed: number): readonly WfmOption[] {
  const ordered = shuffled(entries, seed ^ 0x9e3779b9);
  return ordered.map((entry, index) => ({ id: OPTION_IDS[index]!, ...entry }));
}

function correctId(options: readonly WfmOption[], predicate: (option: WfmOption) => boolean): WfmOption["id"] {
  const matches = options.filter(predicate);
  if (matches.length !== 1) throw new Error(`WFM Banking expected exactly one correct option; found ${matches.length}`);
  return matches[0]!.id;
}

function orderedFixture(seed: number, difficulty: WfmDifficulty): WfmOrderedExtractionFixture {
  const candidates = WFM_BANKING_ORDERED_EXTRACTION_FIXTURES.filter((fixture) => fixture.difficulty === difficulty);
  if (candidates.length === 0) throw new Error(`No WFM Banking ordered-extraction fixture for ${difficulty}`);
  return candidates[mod(seed * 11 + 7, candidates.length)]!;
}

function renderOrderedOption(option: WfmOrderedExtractionOptionAuthority): string {
  if (option.words.length === 1) {
    return `${option.words[0]} — positions ${option.positions.join(", ")}`;
  }
  const parts = option.words.map((word, index) => `${word}(${option.positions[index]})`);
  return parts.join(" · ");
}

function orderedStem(language: WfmLanguage, fixture: WfmOrderedExtractionFixture): string {
  if (fixture.mode === "SINGLE_WORD_POSITIONS") {
    if (language === "hi-IN") return "हर विकल्प में दिए शब्द से बताई गई स्थितियों के अक्षर बाएँ से उसी क्रम में पढ़िए। अक्षरों को बदले बिना किस विकल्प से अर्थपूर्ण अंग्रेज़ी शब्द बनता है?";
    if (language === "pa-IN") return "ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਦਿੱਤੇ ਸ਼ਬਦ ਤੋਂ ਦੱਸੀਆਂ ਥਾਵਾਂ ਦੇ ਅੱਖਰ ਖੱਬੇ ਤੋਂ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਪੜ੍ਹੋ। ਅੱਖਰਾਂ ਦਾ ਕ੍ਰਮ ਬਦਲੇ ਬਿਨਾਂ ਕਿਹੜੇ ਵਿਕਲਪ ਤੋਂ ਅਰਥਪੂਰਨ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ ਬਣਦਾ ਹੈ?";
    return "In each option, read the letters at the stated positions from left to right. Which option forms a meaningful English word without rearranging the letters?";
  }
  if (language === "hi-IN") return "हर विकल्प में कोष्ठक में दी गई स्थिति से प्रत्येक शब्द का अक्षर उसी क्रम में लीजिए। अक्षरों को बदले बिना किस विकल्प से अर्थपूर्ण अंग्रेज़ी शब्द बनता है?";
  if (language === "pa-IN") return "ਹਰ ਵਿਕਲਪ ਵਿੱਚ ਕੋਠਿਆਂ ਵਿੱਚ ਦਿੱਤੀ ਥਾਂ ਤੋਂ ਹਰ ਸ਼ਬਦ ਦਾ ਅੱਖਰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਲਵੋ। ਅੱਖਰਾਂ ਦਾ ਕ੍ਰਮ ਬਦਲੇ ਬਿਨਾਂ ਕਿਹੜੇ ਵਿਕਲਪ ਤੋਂ ਅਰਥਪੂਰਨ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ ਬਣਦਾ ਹੈ?";
  return "For each option, take the stated-position letter from each word in the same order. Which option forms a meaningful English word without rearranging the letters?";
}

function orderedExplanation(language: WfmLanguage, fixture: WfmOrderedExtractionFixture): string {
  const correct = fixture.options.find((option) => option.meaningful)!;
  const word = extractOrderedBankingLetters(correct);
  const display = renderOrderedOption(correct);
  if (language === "hi-IN") return `${display} से अक्षर उसी क्रम में ${word} बनते हैं। यह अर्थपूर्ण अंग्रेज़ी शब्द है, इसलिए यही सही विकल्प है।`;
  if (language === "pa-IN") return `${display} ਤੋਂ ਅੱਖਰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ${word} ਬਣਦੇ ਹਨ। ਇਹ ਅਰਥਪੂਰਨ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ ਹੈ, ਇਸ ਲਈ ਇਹੀ ਸਹੀ ਵਿਕਲਪ ਹੈ।`;
  return `${display} gives ${word} in the stated order. ${word} is a meaningful English word, so that option is correct.`;
}

export function generateWfmBankingOrderedExtraction(input: {
  readonly seed: number;
  readonly language: WfmLanguage;
  readonly difficulty: WfmDifficulty;
}): WfmGeneratedQuestion {
  const fixture = orderedFixture(input.seed, input.difficulty);
  const entries = fixture.options.map((option) => ({
    text: renderOrderedOption(option),
    provenance: option.meaningful
      ? "MEANINGFUL_ORDERED_EXTRACTION" as const
      : "NONWORD_ORDERED_EXTRACTION" as const,
  }));
  const options = optionize(entries, input.seed);
  const answerId = correctId(options, (option) => option.provenance === "MEANINGFUL_ORDERED_EXTRACTION");

  return {
    chapterId: "WFM-001",
    checkpointId: "WFM-CP-004",
    qlId: "WFM-QL-005",
    task: "ORDERED_POSITION_EXTRACTION",
    renderer: fixture.mode === "SINGLE_WORD_POSITIONS"
      ? "BANKING_SINGLE_WORD_POSITION_OPTION"
      : "BANKING_MULTI_WORD_POSITION_OPTION",
    seed: input.seed,
    language: input.language,
    examProfile: "BANKING_5",
    difficulty: fixture.difficulty,
    stem: orderedStem(input.language, fixture),
    structuredPrompt: {
      fixtureId: fixture.id,
      mode: fixture.mode,
      options: fixture.options.map((option) => ({
        words: option.words,
        positions: option.positions,
        extraction: extractOrderedBankingLetters(option),
        meaningful: option.meaningful,
      })),
    },
    options,
    correctOptionId: answerId,
    explanation: orderedExplanation(input.language, fixture),
    metadata: lifecycleMetadata(),
  };
}

type SentinelConvention = "NONE_X_MULTI_Y" | "MULTI_X_NONE_Y";

function uniqueFixtureDifficulty(fixture: WfmSelectedLetterFixture): WfmDifficulty {
  const letters = selectedFixtureLetters(fixture);
  const count = fixture.acceptedWords.length;
  if (count === 1 && letters.length <= 3) return "EASY";
  if ((count === 0 || count === 2 || count === 1) && letters.length <= 4) return "MEDIUM";
  return "HARD";
}

function chooseUniqueFixture(seed: number, difficulty: WfmDifficulty): WfmSelectedLetterFixture {
  const candidates = WFM_SELECTED_LETTER_FIXTURES.filter((fixture) => uniqueFixtureDifficulty(fixture) === difficulty);
  if (candidates.length === 0) throw new Error(`No WFM Banking unique-word fixture for ${difficulty}`);
  return candidates[mod(seed * 17 + 5, candidates.length)]!;
}

function conventionFor(seed: number): SentinelConvention {
  return mod(seed, 2) === 0 ? "NONE_X_MULTI_Y" : "MULTI_X_NONE_Y";
}

function ordinal(language: WfmLanguage, n: number): string {
  const enSuffix = n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th";
  const hi: Record<number, string> = { 1: "पहला", 2: "दूसरा", 3: "तीसरा", 4: "चौथा" };
  const pa: Record<number, string> = { 1: "ਪਹਿਲਾ", 2: "ਦੂਜਾ", 3: "ਤੀਜਾ", 4: "ਚੌਥਾ" };
  if (language === "hi-IN") return hi[n] ?? `${n}वाँ`;
  if (language === "pa-IN") return pa[n] ?? `${n}ਵਾਂ`;
  return `${n}${enSuffix}`;
}

function selectedPositionsText(language: WfmLanguage, positions: readonly number[]): string {
  const values = positions.map((position) => ordinal(language, position));
  const conjunction = language === "hi-IN" ? "और" : language === "pa-IN" ? "ਅਤੇ" : "and";
  if (values.length === 2) return `${values[0]} ${conjunction} ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} ${conjunction} ${values[values.length - 1]}`;
}

function sentinelText(language: WfmLanguage, convention: SentinelConvention): string {
  if (language === "hi-IN") return convention === "NONE_X_MULTI_Y"
    ? "यदि कोई शब्द न बने तो X और एक से अधिक शब्द बनें तो Y चुनिए।"
    : "यदि एक से अधिक शब्द बनें तो X और कोई शब्द न बने तो Y चुनिए।";
  if (language === "pa-IN") return convention === "NONE_X_MULTI_Y"
    ? "ਜੇ ਕੋਈ ਸ਼ਬਦ ਨਾ ਬਣੇ ਤਾਂ X ਅਤੇ ਇੱਕ ਤੋਂ ਵੱਧ ਸ਼ਬਦ ਬਣਨ ਤਾਂ Y ਚੁਣੋ।"
    : "ਜੇ ਇੱਕ ਤੋਂ ਵੱਧ ਸ਼ਬਦ ਬਣਨ ਤਾਂ X ਅਤੇ ਕੋਈ ਸ਼ਬਦ ਨਾ ਬਣੇ ਤਾਂ Y ਚੁਣੋ।";
  return convention === "NONE_X_MULTI_Y"
    ? "If no word can be formed, choose X; if more than one word can be formed, choose Y."
    : "If more than one word can be formed, choose X; if no word can be formed, choose Y.";
}

function uniqueStem(
  language: WfmLanguage,
  fixture: WfmSelectedLetterFixture,
  requestedPosition: number,
  convention: SentinelConvention,
): string {
  const positions = selectedPositionsText(language, fixture.positions);
  const output = ordinal(language, requestedPosition);
  if (language === "hi-IN") return `शब्द ‘${fixture.sourceWord}’ के ${positions} अक्षरों से सभी चुने अक्षरों का एक-एक बार प्रयोग करके यदि केवल एक अर्थपूर्ण अंग्रेज़ी शब्द बनता है, तो उस शब्द का बाएँ से ${output} अक्षर चुनिए। ${sentinelText(language, convention)}`;
  if (language === "pa-IN") return `ਸ਼ਬਦ ‘${fixture.sourceWord}’ ਦੇ ${positions} ਅੱਖਰਾਂ ਨਾਲ ਸਾਰੇ ਚੁਣੇ ਅੱਖਰ ਇੱਕ-ਇੱਕ ਵਾਰ ਵਰਤ ਕੇ ਜੇ ਕੇਵਲ ਇੱਕ ਅਰਥਪੂਰਨ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ ਬਣਦਾ ਹੈ, ਤਾਂ ਉਸ ਸ਼ਬਦ ਦਾ ਖੱਬੇ ਤੋਂ ${output} ਅੱਖਰ ਚੁਣੋ। ${sentinelText(language, convention)}`;
  return `Using the ${positions} letters of ‘${fixture.sourceWord}’, if exactly one meaningful English word can be formed using every selected letter once, choose its ${output} letter from the left. ${sentinelText(language, convention)}`;
}

function sentinelAnswer(fixture: WfmSelectedLetterFixture, convention: SentinelConvention): string | null {
  if (fixture.acceptedWords.length === 0) return convention === "NONE_X_MULTI_Y" ? "X" : "Y";
  if (fixture.acceptedWords.length > 1) return convention === "NONE_X_MULTI_Y" ? "Y" : "X";
  return null;
}

function outputOptions(
  fixture: WfmSelectedLetterFixture,
  requestedPosition: number,
  convention: SentinelConvention,
  seed: number,
): { options: readonly WfmOption[]; answer: string } {
  const sentinel = sentinelAnswer(fixture, convention);
  const selectedLetters = selectedFixtureLetters(fixture).toUpperCase();
  const uniqueWord = fixture.acceptedWords.length === 1 ? fixture.acceptedWords[0]!.toUpperCase() : null;
  const answer = sentinel ?? uniqueWord![requestedPosition - 1]!;
  const letterPool = [...new Set([...selectedLetters, ...(uniqueWord ?? "")])]
    .filter((letter) => letter !== answer && letter !== "X" && letter !== "Y");
  const extras = shuffled(letterPool, seed).slice(0, sentinel ? 3 : 2);
  while (extras.length < (sentinel ? 3 : 2)) {
    const fallback = String.fromCharCode(65 + mod(seed + extras.length * 7, 26));
    if (fallback !== answer && fallback !== "X" && fallback !== "Y" && !extras.includes(fallback)) extras.push(fallback);
  }
  const values = sentinel
    ? ["X", "Y", ...extras.slice(0, 3)]
    : [answer, "X", "Y", ...extras.slice(0, 2)];
  const entries = [...new Set(values)].map((value) => ({
    text: value,
    provenance: value === answer
      ? (sentinel ? "AMBIGUITY_SENTINEL" : "UNIQUE_WORD_OUTPUT") as const
      : "OUTPUT_NEAR_MISS" as const,
  }));
  if (entries.length !== 5) throw new Error("WFM Banking unique-word output requires five unique options");
  const options = optionize(entries, seed);
  return { options, answer };
}

function uniqueExplanation(
  language: WfmLanguage,
  fixture: WfmSelectedLetterFixture,
  requestedPosition: number,
  convention: SentinelConvention,
  answer: string,
): string {
  const letters = selectedFixtureLetters(fixture).split("").join(", ");
  const words = fixture.acceptedWords;
  if (language === "hi-IN") {
    if (words.length === 0) return `चुने गए अक्षर ${letters} हैं। इनसे कोई स्वीकृत अर्थपूर्ण अंग्रेज़ी शब्द नहीं बनता, इसलिए नियम के अनुसार उत्तर ${answer} है।`;
    if (words.length > 1) return `चुने गए अक्षर ${letters} हैं। इनसे ${words.join(", ")} सहित एक से अधिक स्वीकृत शब्द बनते हैं, इसलिए नियम के अनुसार उत्तर ${answer} है।`;
    return `चुने गए अक्षर ${letters} हैं और उनसे केवल ${words[0]} बनता है। बाएँ से ${ordinal(language, requestedPosition)} अक्षर ${answer} है।`;
  }
  if (language === "pa-IN") {
    if (words.length === 0) return `ਚੁਣੇ ਅੱਖਰ ${letters} ਹਨ। ਇਨ੍ਹਾਂ ਨਾਲ ਕੋਈ ਮਨਜ਼ੂਰ ਅਰਥਪੂਰਨ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ ਨਹੀਂ ਬਣਦਾ, ਇਸ ਲਈ ਦਿੱਤੇ ਨਿਯਮ ਅਨੁਸਾਰ ਉੱਤਰ ${answer} ਹੈ।`;
    if (words.length > 1) return `ਚੁਣੇ ਅੱਖਰ ${letters} ਹਨ। ਇਨ੍ਹਾਂ ਨਾਲ ${words.join(", ")} ਸਮੇਤ ਇੱਕ ਤੋਂ ਵੱਧ ਮਨਜ਼ੂਰ ਸ਼ਬਦ ਬਣਦੇ ਹਨ, ਇਸ ਲਈ ਦਿੱਤੇ ਨਿਯਮ ਅਨੁਸਾਰ ਉੱਤਰ ${answer} ਹੈ।`;
    return `ਚੁਣੇ ਅੱਖਰ ${letters} ਹਨ ਅਤੇ ਇਨ੍ਹਾਂ ਨਾਲ ਕੇਵਲ ${words[0]} ਬਣਦਾ ਹੈ। ਖੱਬੇ ਤੋਂ ${ordinal(language, requestedPosition)} ਅੱਖਰ ${answer} ਹੈ।`;
  }
  if (words.length === 0) return `The selected letters are ${letters}. No governed meaningful English word can be formed, so under the stated rule the answer is ${answer}.`;
  if (words.length > 1) return `The selected letters are ${letters}. More than one governed word can be formed (${words.join(", ")}), so under the stated rule the answer is ${answer}.`;
  return `The selected letters are ${letters} and they form only ${words[0]}. Its ${ordinal(language, requestedPosition)} letter from the left is ${answer}.`;
}

export function generateWfmBankingUniqueWordOutput(input: {
  readonly seed: number;
  readonly language: WfmLanguage;
  readonly difficulty: WfmDifficulty;
}): WfmGeneratedQuestion {
  const fixture = chooseUniqueFixture(input.seed, input.difficulty);
  const convention = conventionFor(input.seed);
  const wordLength = fixture.acceptedWords.length === 1
    ? fixture.acceptedWords[0]!.length
    : selectedFixtureLetters(fixture).length;
  const requestedPosition = 1 + mod(input.seed * 5 + 3, Math.max(1, Math.min(4, wordLength)));
  const { options, answer } = outputOptions(fixture, requestedPosition, convention, input.seed);
  const answerId = correctId(options, (option) => option.text === answer);

  return {
    chapterId: "WFM-001",
    checkpointId: "WFM-CP-005",
    qlId: "WFM-QL-006",
    task: "UNIQUE_WORD_OUTPUT",
    renderer: "BANKING_UNIQUE_WORD_OUTPUT",
    seed: input.seed,
    language: input.language,
    examProfile: "BANKING_5",
    difficulty: uniqueFixtureDifficulty(fixture),
    stem: uniqueStem(input.language, fixture, requestedPosition, convention),
    sourceWord: fixture.sourceWord,
    structuredPrompt: {
      sourceWord: fixture.sourceWord,
      positions: fixture.positions,
      selectedLetters: selectedFixtureLetters(fixture),
      acceptedCommonWords: fixture.acceptedWords,
      requestedPosition,
      sentinelConvention: convention,
    },
    options,
    correctOptionId: answerId,
    explanation: uniqueExplanation(input.language, fixture, requestedPosition, convention, answer),
    metadata: lifecycleMetadata(),
  };
}
