import { STC_FIVE_WAY_EITHER_AUTHORITIES } from "./five-way-either-authorities.ts";
import { STC_FIVE_WAY_EITHER_EXPANSION_V1 } from "./five-way-either-expansion-v1.ts";
import { generateStcQuestion } from "./chapter-generator.ts";
import { stcExclusiveEither } from "./truth-model-solver.ts";
import type { GeneratedStcQuestion, StcLocale, StcQlId } from "./types.ts";

export type StcFiveWayAnswerClass = GeneratedStcQuestion["answerClass"] | "EITHER";
export type GeneratedStcFiveWayQuestion = Omit<GeneratedStcQuestion, "options" | "correctIndex" | "answerClass"> & {
  readonly presentationProfile: "FIVE_WAY_EITHER";
  readonly options: readonly [string, string, string, string, string];
  readonly correctIndex: number;
  readonly answerClass: StcFiveWayAnswerClass;
};

const EITHER_AUTHORITIES = [...STC_FIVE_WAY_EITHER_AUTHORITIES, ...STC_FIVE_WAY_EITHER_EXPANSION_V1] as const;

const OPTIONS: Record<StcLocale, readonly [string, string, string, string, string]> = {
  "en-IN": ["Only conclusion I follows", "Only conclusion II follows", "Either conclusion I or II follows", "Neither conclusion I nor II follows", "Both conclusions I and II follow"],
  "hi-IN": ["केवल निष्कर्ष I अनुसरण करता है", "केवल निष्कर्ष II अनुसरण करता है", "या तो निष्कर्ष I या II अनुसरण करता है", "न तो निष्कर्ष I और न ही II अनुसरण करता है", "निष्कर्ष I और II दोनों अनुसरण करते हैं"],
  "pa-IN": ["ਕੇਵਲ ਨਤੀਜਾ I ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ", "ਕੇਵਲ ਨਤੀਜਾ II ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ", "ਜਾਂ ਨਤੀਜਾ I ਜਾਂ II ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ", "ਨਾ ਨਤੀਜਾ I ਅਤੇ ਨਾ ਹੀ II ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ", "ਨਤੀਜੇ I ਅਤੇ II ਦੋਵੇਂ ਅਨੁਸਰਣ ਕਰਦੇ ਹਨ"],
};

const STEM: Record<StcLocale, string> = {
  "en-IN": "Read the statement and decide which conclusion(s) logically follow. Choose the either-or option only when exactly one of the two conclusions must be true but the statement does not determine which one.",
  "hi-IN": "कथन पढ़िए और तय कीजिए कि कौन-सा/से निष्कर्ष तार्किक रूप से अनुसरण करता/करते हैं। 'या तो I या II' तभी चुनें जब दोनों में से ठीक एक निष्कर्ष सत्य होना अनिवार्य हो, लेकिन कथन यह निश्चित न करे कि कौन-सा।",
  "pa-IN": "ਕਥਨ ਪੜ੍ਹੋ ਅਤੇ ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ਕਿਹੜਾ/ਕਿਹੜੇ ਨਤੀਜੇ ਤਰਕਸੰਗਤ ਤੌਰ ਤੇ ਅਨੁਸਰਣ ਕਰਦੇ ਹਨ। 'ਜਾਂ I ਜਾਂ II' ਕੇਵਲ ਤਦੋਂ ਚੁਣੋ ਜਦੋਂ ਦੋਵਾਂ ਵਿੱਚੋਂ ਠੀਕ ਇੱਕ ਨਤੀਜਾ ਲਾਜ਼ਮੀ ਸੱਚ ਹੋਵੇ, ਪਰ ਕਥਨ ਇਹ ਨਿਰਧਾਰਤ ਨਾ ਕਰੇ ਕਿ ਕਿਹੜਾ।",
};

function quoteText(value: string): string {
  return value.trim().replace(/[.!?।]+$/u, "");
}

function eitherExplanation(locale: StcLocale, first: string, second: string): string {
  const firstQuoted = quoteText(first);
  const secondQuoted = quoteText(second);
  if (locale === "en-IN") {
    return `The statement guarantees exactly one of these two outcomes: “${firstQuoted}” or “${secondQuoted}”. It rules out both occurring together but does not identify which one occurs. Therefore, either I or II follows.`;
  }
  if (locale === "hi-IN") {
    return `कथन इन दो परिणामों में से ठीक एक को अनिवार्य करता है: “${firstQuoted}” या “${secondQuoted}”। दोनों एक साथ नहीं हो सकते, लेकिन कथन यह निश्चित नहीं करता कि कौन-सा होगा। इसलिए या तो I या II अनुसरण करता है।`;
  }
  return `ਕਥਨ ਇਨ੍ਹਾਂ ਦੋ ਨਤੀਜਿਆਂ ਵਿੱਚੋਂ ਠੀਕ ਇੱਕ ਨੂੰ ਲਾਜ਼ਮੀ ਕਰਦਾ ਹੈ: “${firstQuoted}” ਜਾਂ “${secondQuoted}”। ਦੋਵੇਂ ਇਕੱਠੇ ਨਹੀਂ ਹੋ ਸਕਦੇ, ਪਰ ਕਥਨ ਇਹ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕਰਦਾ ਕਿ ਕਿਹੜਾ ਹੋਵੇਗਾ। ਇਸ ਲਈ ਜਾਂ I ਜਾਂ II ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ।`;
}

function fiveWayIndex(answerClass: GeneratedStcQuestion["answerClass"]): number {
  switch (answerClass) {
    case "ONLY_I": return 0;
    case "ONLY_II": return 1;
    case "NEITHER": return 3;
    case "BOTH": return 4;
  }
}

export function generateStcFiveWayQuestion(input: { readonly qlId: StcQlId; readonly locale: StcLocale; readonly seed: number }): GeneratedStcFiveWayQuestion {
  if (input.qlId === "STC-QL-002" && Math.abs(input.seed) % 4 === 0) {
    const scenario = EITHER_AUTHORITIES[(Math.abs(input.seed) / 4) % EITHER_AUTHORITIES.length]!;
    const first = scenario.candidates[0];
    const second = scenario.candidates[1];
    if (!stcExclusiveEither(scenario.premises, first.expression, second.expression)) {
      throw new Error(`${scenario.id}: authority is not a valid exclusive either-or pair`);
    }
    const reverse = Boolean((Math.abs(input.seed) >>> 2) & 1);
    const ordered = reverse ? [second, first] as const : [first, second] as const;
    const firstText = ordered[0].text[input.locale];
    const secondText = ordered[1].text[input.locale];
    return {
      chapterId: "STC-001", checkpointId: "STC-CP-001", qlId: "STC-QL-002", scenarioId: scenario.id,
      locale: input.locale, seed: input.seed, difficulty: scenario.difficulty,
      stem: `${STEM[input.locale]}\n\n${scenario.statement[input.locale]}`,
      conclusions: [firstText, secondText], options: OPTIONS[input.locale], correctIndex: 2, answerClass: "EITHER",
      explanation: eitherExplanation(input.locale, firstText, secondText), presentationProfile: "FIVE_WAY_EITHER",
      metadata: { solver: "TRUTH_MODEL_ENTAILMENT_V1", reviewOnly: true, questionBankWritable: false, testEligible: false, mockEligible: false, publicEligible: false },
    };
  }

  const base = generateStcQuestion(input);
  return { ...base, presentationProfile: "FIVE_WAY_EITHER", options: OPTIONS[input.locale], correctIndex: fiveWayIndex(base.answerClass), answerClass: base.answerClass };
}
