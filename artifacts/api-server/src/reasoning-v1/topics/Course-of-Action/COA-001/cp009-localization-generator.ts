import { COA_CURRENT_ENGLISH_AUTHORITIES } from "./english-authorities.ts";
import { COA_CP008_EITHER_AUTHORITIES, COA_CP008_THREE_ACTION_AUTHORITIES } from "./cp008-profile-authorities.ts";
import { getCoaCp009Calibration, type CoaCp009Locale } from "./cp009-localization-calibration.ts";
import type { CoaAnswerClass } from "./types.ts";

export const COA_CP009_CHECKPOINT_ID = "COA-CP-009" as const;
export const COA_CP009_LOCALIZATION_STATUS = "CALIBRATION_HUMAN_REVIEW_PENDING" as const;

const FOUR_WAY_OPTIONS = Object.freeze({
  "hi-IN": Object.freeze([
    "केवल कार्रवाई I सही है",
    "केवल कार्रवाई II सही है",
    "दोनों कार्रवाइयाँ I और II सही हैं",
    "न तो कार्रवाई I और न ही कार्रवाई II सही है",
  ] as const),
  "pa-IN": Object.freeze([
    "ਕੇਵਲ ਕਾਰਵਾਈ I ਸਹੀ ਹੈ",
    "ਕੇਵਲ ਕਾਰਵਾਈ II ਸਹੀ ਹੈ",
    "ਦੋਵੇਂ ਕਾਰਵਾਈਆਂ I ਅਤੇ II ਸਹੀ ਹਨ",
    "ਨਾ ਤਾਂ ਕਾਰਵਾਈ I ਅਤੇ ਨਾ ਹੀ ਕਾਰਵਾਈ II ਸਹੀ ਹੈ",
  ] as const),
});

const FIVE_WAY_OPTIONS = Object.freeze({
  "hi-IN": Object.freeze([
    "केवल कार्रवाई I सही है",
    "केवल कार्रवाई II सही है",
    "कार्रवाई I या II में से कोई एक सही है",
    "न तो कार्रवाई I और न ही कार्रवाई II सही है",
    "दोनों कार्रवाइयाँ I और II सही हैं",
  ] as const),
  "pa-IN": Object.freeze([
    "ਕੇਵਲ ਕਾਰਵਾਈ I ਸਹੀ ਹੈ",
    "ਕੇਵਲ ਕਾਰਵਾਈ II ਸਹੀ ਹੈ",
    "ਕਾਰਵਾਈ I ਜਾਂ II ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਸਹੀ ਹੈ",
    "ਨਾ ਤਾਂ ਕਾਰਵਾਈ I ਅਤੇ ਨਾ ਹੀ ਕਾਰਵਾਈ II ਸਹੀ ਹੈ",
    "ਦੋਵੇਂ ਕਾਰਵਾਈਆਂ I ਅਤੇ II ਸਹੀ ਹਨ",
  ] as const),
});

const INSTRUCTION = Object.freeze({
  "hi-IN": "दिए गए कथन के आधार पर तय कीजिए कि कौन-सी कार्रवाई उचित है।",
  "pa-IN": "ਦਿੱਤੇ ਬਿਆਨ ਦੇ ਆਧਾਰ ਤੇ ਤੈਅ ਕਰੋ ਕਿ ਕਿਹੜੀ ਕਾਰਵਾਈ ਠੀਕ ਹੈ।",
});

function fourWayIndex(answerClass: CoaAnswerClass): number {
  if (answerClass === "ONLY_I") return 0;
  if (answerClass === "ONLY_II") return 1;
  if (answerClass === "BOTH") return 2;
  return 3;
}

function verdictLead(locale: CoaCp009Locale, label: string, follows: boolean): string {
  if (locale === "hi-IN") return `कार्रवाई ${label} ${follows ? "सही है" : "सही नहीं है"}:`;
  return `ਕਾਰਵਾਈ ${label} ${follows ? "ਸਹੀ ਹੈ" : "ਸਹੀ ਨਹੀਂ ਹੈ"}:`;
}

function threeActionOption(locale: CoaCp009Locale, mask: number): string {
  const labels = ["I", "II", "III"].filter((_, index) => Boolean(mask & (1 << index)));
  if (locale === "hi-IN") {
    if (labels.length === 0) return "I, II और III में से कोई भी सही नहीं है";
    if (labels.length === 3) return "I, II और III सभी सही हैं";
    if (labels.length === 1) return `केवल कार्रवाई ${labels[0]} सही है`;
    return `केवल कार्रवाइयाँ ${labels.join(" और ")} सही हैं`;
  }
  if (labels.length === 0) return "I, II ਅਤੇ III ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਸਹੀ ਨਹੀਂ ਹੈ";
  if (labels.length === 3) return "I, II ਅਤੇ III ਤਿੰਨੇ ਸਹੀ ਹਨ";
  if (labels.length === 1) return `ਕੇਵਲ ਕਾਰਵਾਈ ${labels[0]} ਸਹੀ ਹੈ`;
  return `ਕੇਵਲ ਕਾਰਵਾਈਆਂ ${labels.join(" ਅਤੇ ")} ਸਹੀ ਹਨ`;
}

export function generateCoaCp009CalibrationQuestion(input: {
  readonly semanticAuthorityId: string;
  readonly locale: CoaCp009Locale;
}) {
  const localized = getCoaCp009Calibration(input.semanticAuthorityId, input.locale);

  if (localized.kind === "TWO_ACTION") {
    const english = COA_CURRENT_ENGLISH_AUTHORITIES.find((entry) => entry.id === localized.semanticAuthorityId);
    if (!english) throw new Error(`${localized.semanticAuthorityId}: English semantic authority missing`);
    if (english.qlId !== localized.qlId) throw new Error(`${localized.semanticAuthorityId}: localized QL drift`);
    for (let i = 0; i < 2; i += 1) {
      if (localized.actions[i]!.semanticActionId !== english.actions[i]!.id) {
        throw new Error(`${localized.semanticAuthorityId}: localized action ID/order drift`);
      }
    }
    const correctIndex = fourWayIndex(english.expectedAnswerClass);
    const explanation = localized.actions.map((action, index) =>
      `${verdictLead(input.locale, index === 0 ? "I" : "II", english.actions[index]!.expectedVerdict === "FOLLOWS")} ${action.explanation}`
    ).join(" ");

    return Object.freeze({
      chapterId: "COA-001" as const,
      checkpointId: COA_CP009_CHECKPOINT_ID,
      localizationStatus: COA_CP009_LOCALIZATION_STATUS,
      locale: input.locale,
      presentationProfile: "TWO_ACTION_FOUR_WAY" as const,
      semanticAuthorityId: english.id,
      qlId: english.qlId,
      difficulty: english.difficulty,
      domain: english.domain,
      statement: localized.statement,
      instruction: INSTRUCTION[input.locale],
      courses: Object.freeze(localized.actions.map((action, index) => Object.freeze({
        label: (index === 0 ? "I" : "II") as "I" | "II",
        text: action.text,
        semanticActionId: action.semanticActionId,
      }))),
      answerOptions: FOUR_WAY_OPTIONS[input.locale],
      answerClass: english.expectedAnswerClass,
      correctIndex,
      explanation,
      reviewOnly: true as const,
      questionStudioRegistered: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockEligible: false as const,
      publicEligible: false as const,
    });
  }

  if (localized.kind === "EITHER") {
    const english = COA_CP008_EITHER_AUTHORITIES.find((entry) => entry.id === localized.semanticAuthorityId);
    if (!english) throw new Error(`${localized.semanticAuthorityId}: English exclusive-either authority missing`);
    for (let i = 0; i < 2; i += 1) {
      if (localized.actions[i]!.semanticActionId !== english.actions[i]!.id) {
        throw new Error(`${localized.semanticAuthorityId}: localized Either action ID/order drift`);
      }
    }
    const explanation = localized.actions.map((action, index) =>
      `${verdictLead(input.locale, index === 0 ? "I" : "II", true)} ${action.explanation}`
    ).join(" ") + " " + localized.pairReason;

    return Object.freeze({
      chapterId: "COA-001" as const,
      checkpointId: COA_CP009_CHECKPOINT_ID,
      localizationStatus: COA_CP009_LOCALIZATION_STATUS,
      locale: input.locale,
      presentationProfile: "TWO_ACTION_FIVE_CODE" as const,
      semanticAuthorityId: english.id,
      difficulty: english.difficulty,
      domain: english.domain,
      statement: localized.statement,
      instruction: INSTRUCTION[input.locale],
      courses: Object.freeze(localized.actions.map((action, index) => Object.freeze({
        label: (index === 0 ? "I" : "II") as "I" | "II",
        text: action.text,
        semanticActionId: action.semanticActionId,
      }))),
      answerOptions: FIVE_WAY_OPTIONS[input.locale],
      answerClass: "EITHER" as const,
      correctIndex: 2,
      explanation,
      pairRelation: "MUTUALLY_EXCLUSIVE_ALTERNATIVES" as const,
      reviewOnly: true as const,
      questionStudioRegistered: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockEligible: false as const,
      publicEligible: false as const,
    });
  }

  const english = COA_CP008_THREE_ACTION_AUTHORITIES.find((entry) => entry.id === localized.semanticAuthorityId);
  if (!english) throw new Error(`${localized.semanticAuthorityId}: English three-action authority missing`);
  for (let i = 0; i < 3; i += 1) {
    if (localized.actions[i]!.semanticActionId !== english.actions[i]!.id) {
      throw new Error(`${localized.semanticAuthorityId}: localized three-action ID/order drift`);
    }
  }
  const answerOptions = Object.freeze(english.optionMasks.map((mask) => threeActionOption(input.locale, mask)) as [string, string, string, string]);
  const correctIndex = english.optionMasks.indexOf(english.correctMask);
  const explanation = localized.actions.map((action, index) =>
    `${verdictLead(input.locale, ["I", "II", "III"][index]!, english.actions[index]!.expectedVerdict === "FOLLOWS")} ${action.explanation}`
  ).join(" ");

  return Object.freeze({
    chapterId: "COA-001" as const,
    checkpointId: COA_CP009_CHECKPOINT_ID,
    localizationStatus: COA_CP009_LOCALIZATION_STATUS,
    locale: input.locale,
    presentationProfile: "THREE_ACTION_COMBINATION" as const,
    semanticAuthorityId: english.id,
    difficulty: english.difficulty,
    domain: english.domain,
    statement: localized.statement,
    instruction: INSTRUCTION[input.locale],
    courses: Object.freeze(localized.actions.map((action, index) => Object.freeze({
      label: (["I", "II", "III"] as const)[index]!,
      text: action.text,
      semanticActionId: action.semanticActionId,
    }))),
    answerOptions,
    answerMask: english.correctMask,
    correctIndex,
    explanation,
    reviewOnly: true as const,
    questionStudioRegistered: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockEligible: false as const,
    publicEligible: false as const,
  });
}
