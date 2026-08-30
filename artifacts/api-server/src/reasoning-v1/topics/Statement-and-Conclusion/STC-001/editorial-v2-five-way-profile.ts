import { generateStcV2EditorialQuestion } from "./editorial-v2-generator.ts";
import { STC_V2_FIVE_WAY_EITHER_AUTHORITIES } from "./editorial-v2-five-way-either-authorities.ts";
import { stcExclusiveEither } from "./truth-model-solver.ts";
import type { StcLocale, StcQlId } from "./types.ts";
import type { StcV2AnswerClass } from "./editorial-v2-types.ts";

export type StcV2FiveWayAnswerClass = StcV2AnswerClass | "EITHER";

const OPTIONS: Record<StcLocale, readonly [string, string, string, string, string]> = {
  "en-IN": [
    "Only conclusion I follows",
    "Only conclusion II follows",
    "Either conclusion I or II follows",
    "Neither conclusion I nor II follows",
    "Both conclusions I and II follow",
  ],
  "hi-IN": [
    "केवल निष्कर्ष I अनुसरण करता है",
    "केवल निष्कर्ष II अनुसरण करता है",
    "या तो निष्कर्ष I या II अनुसरण करता है",
    "न तो निष्कर्ष I और न ही II अनुसरण करता है",
    "निष्कर्ष I और II दोनों अनुसरण करते हैं",
  ],
  "pa-IN": [
    "ਕੇਵਲ ਨਤੀਜਾ I ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ",
    "ਕੇਵਲ ਨਤੀਜਾ II ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ",
    "ਜਾਂ ਨਤੀਜਾ I ਜਾਂ II ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ",
    "ਨਾ ਨਤੀਜਾ I ਅਤੇ ਨਾ ਹੀ II ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ",
    "ਨਤੀਜੇ I ਅਤੇ II ਦੋਵੇਂ ਅਨੁਸਰਣ ਕਰਦੇ ਹਨ",
  ],
};

function positiveModulo(value: number, divisor: number): number {
  const integer = Number.isFinite(value) ? Math.trunc(value) : 0;
  return ((integer % divisor) + divisor) % divisor;
}

function fiveWayIndex(answerClass: StcV2AnswerClass): number {
  switch (answerClass) {
    case "ONLY_I": return 0;
    case "ONLY_II": return 1;
    case "NEITHER": return 3;
    case "BOTH": return 4;
  }
}

function quoteText(value: string): string {
  return value.trim().replace(/[.!?।]+$/u, "");
}

function eitherExplanation(locale: StcLocale, first: string, second: string): string {
  const firstQuoted = quoteText(first);
  const secondQuoted = quoteText(second);
  if (locale === "en-IN") {
    return `Exactly one of these two outcomes must hold: “${firstQuoted}” or “${secondQuoted}”. The statement rules out both together but does not determine which one holds. Therefore, either I or II follows.`;
  }
  if (locale === "hi-IN") {
    return `इन दोनों परिणामों में से ठीक एक सत्य होना अनिवार्य है: “${firstQuoted}” या “${secondQuoted}”। कथन दोनों को एक साथ अस्वीकार करता है, लेकिन यह तय नहीं करता कि कौन-सा सत्य है। इसलिए या तो निष्कर्ष I या II अनुसरण करता है।`;
  }
  return `ਇਨ੍ਹਾਂ ਦੋ ਨਤੀਜਿਆਂ ਵਿੱਚੋਂ ਠੀਕ ਇੱਕ ਸੱਚ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ: “${firstQuoted}” ਜਾਂ “${secondQuoted}”। ਕਥਨ ਦੋਵਾਂ ਨੂੰ ਇਕੱਠੇ ਰੱਦ ਕਰਦਾ ਹੈ, ਪਰ ਇਹ ਨਹੀਂ ਦੱਸਦਾ ਕਿ ਕਿਹੜਾ ਸੱਚ ਹੈ। ਇਸ ਲਈ ਜਾਂ ਨਤੀਜਾ I ਜਾਂ II ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ।`;
}

export function generateStcV2FiveWayQuestion(input: {
  readonly qlId: StcQlId;
  readonly locale: StcLocale;
  readonly seed: number;
}) {
  const normalizedSeed = Number.isFinite(input.seed) ? Math.trunc(input.seed) : 0;
  if (input.qlId === "STC-QL-002" && positiveModulo(normalizedSeed, 4) === 0) {
    const authorityIndex = positiveModulo(Math.trunc(normalizedSeed / 4), STC_V2_FIVE_WAY_EITHER_AUTHORITIES.length);
    const scenario = STC_V2_FIVE_WAY_EITHER_AUTHORITIES[authorityIndex]!;
    const first = scenario.candidates[0];
    const second = scenario.candidates[1];
    if (!stcExclusiveEither(scenario.premises, first.expression, second.expression)) {
      throw new Error(`${scenario.id}: V2 five-way authority is not a valid exclusive either-or pair.`);
    }
    const reverse = Boolean(authorityIndex & 1);
    const ordered = reverse ? [second, first] as const : [first, second] as const;
    const firstText = ordered[0].text[input.locale];
    const secondText = ordered[1].text[input.locale];
    return {
      chapterId: "STC-001" as const,
      version: "V2" as const,
      checkpointId: "STC-CP-001" as const,
      qlId: "STC-QL-002" as const,
      scenarioId: scenario.id,
      locale: input.locale,
      seed: input.seed,
      difficulty: scenario.difficulty,
      surfaceArchetype: scenario.surfaceArchetype,
      stem: scenario.statement[input.locale],
      conclusions: [firstText, secondText] as const,
      options: OPTIONS[input.locale],
      correctIndex: 2,
      answerClass: "EITHER" as const,
      explanation: eitherExplanation(input.locale, firstText, secondText),
      presentationProfile: "FIVE_WAY_EITHER" as const,
      metadata: {
        authority: "CURATED_EDITORIAL_EITHER_V2" as const,
        surfaceArchetype: scenario.surfaceArchetype,
        repeatedInstructionEmbeddedInStem: false as const,
        localizedByScenarioId: true as const,
        reviewOnly: true as const,
        questionBankWritable: false as const,
        testEligible: false as const,
        mockEligible: false as const,
        publicEligible: false as const,
        automaticPublication: false as const,
      },
    };
  }

  const base = generateStcV2EditorialQuestion(input);
  return {
    ...base,
    presentationProfile: "FIVE_WAY_EITHER" as const,
    options: OPTIONS[input.locale],
    correctIndex: fiveWayIndex(base.answerClass),
    answerClass: base.answerClass as StcV2FiveWayAnswerClass,
  };
}
