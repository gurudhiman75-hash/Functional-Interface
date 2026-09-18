import { COA_CURRENT_ENGLISH_AUTHORITIES } from "./english-authorities.ts";
import {
  COA_CP008_EITHER_AUTHORITIES,
  COA_CP008_THREE_ACTION_AUTHORITIES,
} from "./cp008-profile-authorities.ts";
import {
  getCoaCp009LocalizedEither,
  getCoaCp009LocalizedOrdinary,
  getCoaCp009LocalizedThreeAction,
} from "./cp009-full-localization-registry.ts";
import type { CoaAnswerClass } from "./types.ts";
import type { CoaCp009FullLocale } from "./cp009-localization-types.ts";

export const COA_CP009_FULL_LOCALIZATION_STATUS = "APPROVED_FROZEN" as const;

const INSTRUCTION = Object.freeze({
  "hi-IN": "दिए गए कथन के आधार पर तय कीजिए कि कौन-सी कार्रवाई उचित है।",
  "pa-IN": "ਦਿੱਤੇ ਬਿਆਨ ਦੇ ਆਧਾਰ ਤੇ ਤੈਅ ਕਰੋ ਕਿ ਕਿਹੜੀ ਕਾਰਵਾਈ ਠੀਕ ਹੈ।",
});

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

function fourWayIndex(answerClass: CoaAnswerClass): number {
  if (answerClass === "ONLY_I") return 0;
  if (answerClass === "ONLY_II") return 1;
  if (answerClass === "BOTH") return 2;
  return 3;
}

function verdictLead(locale: CoaCp009FullLocale, label: string, follows: boolean): string {
  if (locale === "hi-IN") return `कार्रवाई ${label} ${follows ? "सही है" : "सही नहीं है"}:`;
  return `ਕਾਰਵਾਈ ${label} ${follows ? "ਸਹੀ ਹੈ" : "ਸਹੀ ਨਹੀਂ ਹੈ"}:`;
}

function threeActionOption(locale: CoaCp009FullLocale, mask: number): string {
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

export function generateCoaCp009LocalizedQuestion(input: {
  readonly semanticAuthorityId: string;
  readonly locale: CoaCp009FullLocale;
}) {
  const ordinary = COA_CURRENT_ENGLISH_AUTHORITIES.find((entry) => entry.id === input.semanticAuthorityId);
  if (ordinary) {
    const localized = getCoaCp009LocalizedOrdinary(ordinary.id, input.locale);
    const correctIndex = fourWayIndex(ordinary.expectedAnswerClass);
    const explanation = localized.actions.map((action, index) =>
      `${verdictLead(input.locale, index === 0 ? "I" : "II", ordinary.actions[index]!.expectedVerdict === "FOLLOWS")} ${action.explanation}`
    ).join(" ");

    return Object.freeze({
      chapterId: "COA-001" as const,
      checkpointId: "COA-CP-009" as const,
      localizationStatus: COA_CP009_FULL_LOCALIZATION_STATUS,
      locale: input.locale,
      presentationProfile: "TWO_ACTION_FOUR_WAY" as const,
      semanticAuthorityId: ordinary.id,
      qlId: ordinary.qlId,
      legacySemanticQl: ordinary.qlId === "COA-QL-007",
      difficulty: ordinary.difficulty,
      domain: ordinary.domain,
      statement: localized.statement,
      instruction: INSTRUCTION[input.locale],
      courses: Object.freeze(localized.actions.map((action, index) => Object.freeze({
        label: (index === 0 ? "I" : "II") as "I" | "II",
        text: action.text,
        semanticActionId: action.semanticActionId,
      }))),
      answerOptions: FOUR_WAY_OPTIONS[input.locale],
      answerClass: ordinary.expectedAnswerClass,
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

  const either = COA_CP008_EITHER_AUTHORITIES.find((entry) => entry.id === input.semanticAuthorityId);
  if (either) {
    const localized = getCoaCp009LocalizedEither(either.id, input.locale);
    const explanation = localized.actions.map((action, index) =>
      `${verdictLead(input.locale, index === 0 ? "I" : "II", true)} ${action.explanation}`
    ).join(" ") + " " + localized.pairReason;

    return Object.freeze({
      chapterId: "COA-001" as const,
      checkpointId: "COA-CP-009" as const,
      localizationStatus: COA_CP009_FULL_LOCALIZATION_STATUS,
      locale: input.locale,
      presentationProfile: "TWO_ACTION_FIVE_CODE" as const,
      semanticAuthorityId: either.id,
      difficulty: either.difficulty,
      domain: either.domain,
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
      pairRelation: "MUTUALLY_EXCLUSIVE_ALTERNATIVES" as const,
      explanation,
      reviewOnly: true as const,
      questionStudioRegistered: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockEligible: false as const,
      publicEligible: false as const,
    });
  }

  const three = COA_CP008_THREE_ACTION_AUTHORITIES.find((entry) => entry.id === input.semanticAuthorityId);
  if (!three) throw new Error(`Unknown COA semantic authority: ${input.semanticAuthorityId}`);
  const localized = getCoaCp009LocalizedThreeAction(three.id, input.locale);
  const answerOptions = Object.freeze(three.optionMasks.map((mask) => threeActionOption(input.locale, mask)) as [string, string, string, string]);
  const correctIndex = three.optionMasks.indexOf(three.correctMask);
  const explanation = localized.actions.map((action, index) =>
    `${verdictLead(input.locale, ["I", "II", "III"][index]!, three.actions[index]!.expectedVerdict === "FOLLOWS")} ${action.explanation}`
  ).join(" ");

  return Object.freeze({
    chapterId: "COA-001" as const,
    checkpointId: "COA-CP-009" as const,
    localizationStatus: COA_CP009_FULL_LOCALIZATION_STATUS,
    locale: input.locale,
    presentationProfile: "THREE_ACTION_COMBINATION" as const,
    semanticAuthorityId: three.id,
    difficulty: three.difficulty,
    domain: three.domain,
    statement: localized.statement,
    instruction: INSTRUCTION[input.locale],
    courses: Object.freeze(localized.actions.map((action, index) => Object.freeze({
      label: (["I", "II", "III"] as const)[index]!,
      text: action.text,
      semanticActionId: action.semanticActionId,
    }))),
    answerOptions,
    answerMask: three.correctMask,
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
