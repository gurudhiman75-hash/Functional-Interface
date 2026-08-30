import { STC_V2_EDITORIAL_AUTHORITIES } from "./editorial-v2-authorities.ts";
import { getStcV2LocalizedText } from "./editorial-v2-localization.ts";
import { reverseStcV2AnswerClass, scheduleStcV2Presentation } from "./editorial-v2-scheduler.ts";
import type { StcLocale, StcQlId } from "./types.ts";
import type { GeneratedStcV2EditorialQuestion, StcV2AnswerClass } from "./editorial-v2-types.ts";

const OPTIONS: Record<StcLocale, readonly [string, string, string, string]> = {
  "en-IN": [
    "Only conclusion I follows",
    "Only conclusion II follows",
    "Both conclusions I and II follow",
    "Neither conclusion I nor II follows",
  ],
  "hi-IN": [
    "केवल निष्कर्ष I अनुसरण करता है",
    "केवल निष्कर्ष II अनुसरण करता है",
    "निष्कर्ष I और II दोनों अनुसरण करते हैं",
    "न तो निष्कर्ष I और न ही II अनुसरण करता है",
  ],
  "pa-IN": [
    "ਕੇਵਲ ਨਤੀਜਾ I ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ",
    "ਕੇਵਲ ਨਤੀਜਾ II ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ",
    "ਨਤੀਜੇ I ਅਤੇ II ਦੋਵੇਂ ਅਨੁਸਰਣ ਕਰਦੇ ਹਨ",
    "ਨਾ ਨਤੀਜਾ I ਅਤੇ ਨਾ ਹੀ II ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ",
  ],
};

function indexForAnswer(answerClass: StcV2AnswerClass): number {
  switch (answerClass) {
    case "ONLY_I": return 0;
    case "ONLY_II": return 1;
    case "BOTH": return 2;
    case "NEITHER": return 3;
  }
}

function followsFlags(answerClass: StcV2AnswerClass): readonly [boolean, boolean] {
  switch (answerClass) {
    case "ONLY_I": return [true, false];
    case "ONLY_II": return [false, true];
    case "BOTH": return [true, true];
    case "NEITHER": return [false, false];
  }
}

function checkpointFor(qlId: StcQlId): "STC-CP-001" | "STC-CP-002" | "STC-CP-003" {
  if (qlId === "STC-QL-001" || qlId === "STC-QL-002") return "STC-CP-001";
  if (qlId === "STC-QL-003" || qlId === "STC-QL-004") return "STC-CP-002";
  return "STC-CP-003";
}

function explanationLine(locale: StcLocale, label: "I" | "II", follows: boolean, reason: string): string {
  if (locale === "en-IN") return `${label} ${follows ? "follows" : "does not follow"}: ${reason}`;
  if (locale === "hi-IN") return `निष्कर्ष ${label} ${follows ? "अनुसरण करता है" : "अनुसरण नहीं करता है"}: ${reason}`;
  return `ਨਤੀਜਾ ${label} ${follows ? "ਅਨੁਸਰਣ ਕਰਦਾ ਹੈ" : "ਅਨੁਸਰਣ ਨਹੀਂ ਕਰਦਾ"}: ${reason}`;
}

export function generateStcV2EditorialQuestion(input: {
  readonly qlId: StcQlId;
  readonly locale: StcLocale;
  readonly seed: number;
}): GeneratedStcV2EditorialQuestion {
  const pool = STC_V2_EDITORIAL_AUTHORITIES.filter((authority) => authority.qlId === input.qlId);
  if (pool.length !== 8) {
    throw new Error(`STC V2 requires exactly 8 editorial authorities for ${input.qlId}; found ${pool.length}.`);
  }

  const schedule = scheduleStcV2Presentation({ qlId: input.qlId, seed: input.seed });
  const authority = pool[schedule.authorityIndex]!;
  const localized = input.locale === "en-IN"
    ? { statement: authority.statement, conclusions: authority.conclusions, explanation: authority.explanation }
    : getStcV2LocalizedText(authority.id, input.locale);

  const answerClass = schedule.reverseConclusions
    ? reverseStcV2AnswerClass(authority.answerClass)
    : authority.answerClass;
  const conclusions = schedule.reverseConclusions
    ? [localized.conclusions[1], localized.conclusions[0]] as const
    : localized.conclusions;
  const reasons = schedule.reverseConclusions
    ? [localized.explanation[1], localized.explanation[0]] as const
    : localized.explanation;
  const [firstFollows, secondFollows] = followsFlags(answerClass);
  const explanation = [
    explanationLine(input.locale, "I", firstFollows, reasons[0]),
    explanationLine(input.locale, "II", secondFollows, reasons[1]),
  ].join(" ");

  return {
    chapterId: "STC-001",
    version: "V2.1",
    checkpointId: checkpointFor(input.qlId),
    qlId: input.qlId,
    scenarioId: authority.id,
    locale: input.locale,
    seed: input.seed,
    difficulty: authority.difficulty,
    surfaceArchetype: authority.surfaceArchetype,
    stem: localized.statement,
    conclusions,
    options: OPTIONS[input.locale],
    correctIndex: indexForAnswer(answerClass),
    answerClass,
    explanation,
    metadata: {
      authority: "CURATED_EDITORIAL_ENTAILMENT_V2",
      surfaceArchetype: authority.surfaceArchetype,
      repeatedInstructionEmbeddedInStem: false,
      localizedByScenarioId: true,
      antiGamingScheduler: "STC_V2_1_NON_PERIODIC_16_SLOT",
      presentationSlot: schedule.presentationSlot,
      scheduleBlock: schedule.scheduleBlock,
      conclusionsReversed: schedule.reverseConclusions,
      saturationReady: false,
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockEligible: false,
      publicEligible: false,
      automaticPublication: false,
    },
  };
}
