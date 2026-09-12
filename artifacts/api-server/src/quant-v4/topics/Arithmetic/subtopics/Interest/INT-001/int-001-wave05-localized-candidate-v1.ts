import type { Rational } from "./cp003-exam-model";
import type { Int001Wave03QlId } from "./int-001-wave03-permanent-allocation-v1";
import {
  INT_001_WAVE05_ENGLISH_FREEZE_ID,
  INT_001_WAVE05_ENGLISH_FREEZE_APPROVAL,
  generateInt001Wave05EnglishFrozenQuestion,
} from "./int-001-wave05-english-freeze-v1";

export const INT_001_WAVE05_LOCALIZED_VERSION = "INT-001-WAVE05-HI-PA-v1-review" as const;
export const INT_001_WAVE05_LOCALIZED_LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const);
export type Int001Wave05LocalizedLocale = (typeof INT_001_WAVE05_LOCALIZED_LOCALES)[number];

export const INT_001_WAVE05_LOCALIZATION_DECISION = Object.freeze({
  sourceFreezeId: INT_001_WAVE05_ENGLISH_FREEZE_ID,
  sourceApproval: INT_001_WAVE05_ENGLISH_FREEZE_APPROVAL.authority,
  qlIds: Object.freeze(["INT-QL-132", "INT-QL-133", "INT-QL-134"] as const),
  locales: INT_001_WAVE05_LOCALIZED_LOCALES,
  localizationStatus: "HI_PA_REVIEW_CANDIDATE" as const,
  explanationStyle: "DIRECT_CALCULATION" as const,
  questionStudioActivationAuthorized: false as const,
});

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function number(value: Rational): number { return Number(value.numerator) / Number(value.denominator); }
function decimal(value: Rational): string { return number(value).toFixed(8).replace(/0+$/u, "").replace(/\.$/u, ""); }
function money(value: Rational): string {
  const rounded = Math.round(number(value) * 100) / 100;
  const paise = Math.abs(rounded - Math.round(rounded)) > 1e-9;
  return `₹${rounded.toLocaleString("en-IN", { minimumFractionDigits: paise ? 2 : 0, maximumFractionDigits: 2 })}`;
}

function stemTemplateIndex(stemFamilyId: string): number {
  const match = stemFamilyId.match(/(\d+)$/u);
  return match ? Math.abs(Number(match[1]) - 1) % 3 : 0;
}

function localizedStem(qlId: Int001Wave03QlId, state: any, stemFamilyId: string, locale: Int001Wave05LocalizedLocale): string {
  const hi = locale === "hi-IN";
  const t = stemTemplateIndex(stemFamilyId);
  if (qlId === "INT-QL-132") {
    const siFirst = state.stageOrder === "SI_THEN_CI";
    const first = siFirst
      ? (hi ? `${money(state.principal)} पर पहले ${state.simpleYears} वर्ष के लिए ${decimal(state.simpleRatePercent)}% वार्षिक साधारण ब्याज लगाया जाता है` : `${money(state.principal)} ਉੱਤੇ ਪਹਿਲਾਂ ${state.simpleYears} ਸਾਲ ਲਈ ${decimal(state.simpleRatePercent)}% ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਲੱਗਦਾ ਹੈ`)
      : (hi ? `${money(state.principal)} पर पहले ${state.compoundYears} वर्ष के लिए ${decimal(state.compoundRatePercent)}% वार्षिक चक्रवृद्धि ब्याज लगाया जाता है` : `${money(state.principal)} ਉੱਤੇ ਪਹਿਲਾਂ ${state.compoundYears} ਸਾਲ ਲਈ ${decimal(state.compoundRatePercent)}% ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਲੱਗਦਾ ਹੈ`);
    const second = siFirst
      ? (hi ? `फिर प्राप्त राशि पर ${state.compoundYears} वर्ष के लिए ${decimal(state.compoundRatePercent)}% वार्षिक चक्रवृद्धि ब्याज लगता है` : `ਫਿਰ ਮਿਲੀ ਰਕਮ ਉੱਤੇ ${state.compoundYears} ਸਾਲ ਲਈ ${decimal(state.compoundRatePercent)}% ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਲੱਗਦਾ ਹੈ`)
      : (hi ? `फिर प्राप्त राशि पर ${state.simpleYears} वर्ष के लिए ${decimal(state.simpleRatePercent)}% वार्षिक साधारण ब्याज लगता है` : `ਫਿਰ ਮਿਲੀ ਰਕਮ ਉੱਤੇ ${state.simpleYears} ਸਾਲ ਲਈ ${decimal(state.simpleRatePercent)}% ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਲੱਗਦਾ ਹੈ`);
    const endings = hi ? ["अंतिम राशि ज्ञात कीजिए।", "दोनों चरणों के बाद कितनी राशि मिलेगी?", "अंत में मिलने वाली कुल राशि कितनी होगी?"] : ["ਅੰਤਿਮ ਰਕਮ ਪਤਾ ਕਰੋ।", "ਦੋਵੇਂ ਪੜਾਅਾਂ ਤੋਂ ਬਾਅਦ ਕਿੰਨੀ ਰਕਮ ਮਿਲੇਗੀ?", "ਅੰਤ ਵਿੱਚ ਮਿਲਣ ਵਾਲੀ ਕੁੱਲ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?"];
    return `${first}। ${second}। ${endings[t]}`;
  }
  if (qlId === "INT-QL-133") {
    const final = money(state.finalAmount);
    const siFirst = state.stageOrder === "SI_THEN_CI";
    const order = siFirst
      ? (hi ? `पहले ${state.simpleYears} वर्ष ${decimal(state.simpleRatePercent)}% साधारण ब्याज और फिर ${state.compoundYears} वर्ष ${decimal(state.compoundRatePercent)}% वार्षिक चक्रवृद्धि ब्याज` : `ਪਹਿਲਾਂ ${state.simpleYears} ਸਾਲ ${decimal(state.simpleRatePercent)}% ਸਧਾਰਣ ਵਿਆਜ ਅਤੇ ਫਿਰ ${state.compoundYears} ਸਾਲ ${decimal(state.compoundRatePercent)}% ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ`)
      : (hi ? `पहले ${state.compoundYears} वर्ष ${decimal(state.compoundRatePercent)}% वार्षिक चक्रवृद्धि ब्याज और फिर ${state.simpleYears} वर्ष ${decimal(state.simpleRatePercent)}% साधारण ब्याज` : `ਪਹਿਲਾਂ ${state.compoundYears} ਸਾਲ ${decimal(state.compoundRatePercent)}% ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਅਤੇ ਫਿਰ ${state.simpleYears} ਸਾਲ ${decimal(state.simpleRatePercent)}% ਸਧਾਰਣ ਵਿਆਜ`);
    const frames = hi ? [
      `${order} लगाने के बाद राशि ${final} हो जाती है। मूलधन ज्ञात कीजिए।`,
      `एक मूलधन पर ${order} लगाया गया और अंतिम राशि ${final} मिली। प्रारंभिक मूलधन कितना था?`,
      `${order} के क्रम के बाद कुल राशि ${final} है। आरंभिक राशि ज्ञात कीजिए।`,
    ] : [
      `${order} ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ਰਕਮ ${final} ਹੋ ਜਾਂਦੀ ਹੈ। ਮੂਲਧਨ ਪਤਾ ਕਰੋ।`,
      `ਇੱਕ ਮੂਲਧਨ ਉੱਤੇ ${order} ਲਗਾਇਆ ਗਿਆ ਅਤੇ ਅੰਤਿਮ ਰਕਮ ${final} ਮਿਲੀ। ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਕਿੰਨਾ ਸੀ?`,
      `${order} ਦੇ ਕ੍ਰਮ ਤੋਂ ਬਾਅਦ ਕੁੱਲ ਰਕਮ ${final} ਹੈ। ਸ਼ੁਰੂਆਤੀ ਰਕਮ ਪਤਾ ਕਰੋ।`,
    ];
    return frames[t]!;
  }
  const periods = state.compoundPeriodsPerYear === 2 ? (hi ? "अर्धवार्षिक" : "ਅੱਧ-ਸਾਲਾਨਾ") : (hi ? "वार्षिक" : "ਸਾਲਾਨਾ");
  const frames = hi ? [
    `एक व्यक्ति समान मूलधन को ${state.years} वर्ष के लिए ${decimal(state.borrowSimpleRatePercent)}% साधारण ब्याज पर उधार लेता है और उसे ${decimal(state.lendNominalCompoundRatePercent)}% ${periods} चक्रवृद्धि ब्याज पर उधार देता है। दोनों अंतिम राशियों का अंतर ${money(state.netGain)} है। मूलधन ज्ञात कीजिए।`,
    `किसी राशि को ${decimal(state.borrowSimpleRatePercent)}% साधारण ब्याज पर लिया और उसी राशि को ${decimal(state.lendNominalCompoundRatePercent)}% ${periods} चक्रवृद्धि ब्याज पर ${state.years} वर्ष के लिए दिया गया। प्राप्त अंतर ${money(state.netGain)} है। राशि ज्ञात कीजिए।`,
    `${state.years} वर्ष में ${decimal(state.borrowSimpleRatePercent)}% SI और ${decimal(state.lendNominalCompoundRatePercent)}% ${periods} CI वाली समान मूलधन की दो योजनाओं की अंतिम राशियों में ${money(state.netGain)} का अंतर है। मूलधन कितना है?`,
  ] : [
    `ਇੱਕ ਵਿਅਕਤੀ ਇੱਕੋ ਮੂਲਧਨ ਨੂੰ ${state.years} ਸਾਲ ਲਈ ${decimal(state.borrowSimpleRatePercent)}% ਸਧਾਰਣ ਵਿਆਜ 'ਤੇ ਉਧਾਰ ਲੈਂਦਾ ਹੈ ਅਤੇ ਉਸੇ ਨੂੰ ${decimal(state.lendNominalCompoundRatePercent)}% ${periods} ਚੱਕਰਵੱਧੀ ਵਿਆਜ 'ਤੇ ਉਧਾਰ ਦਿੰਦਾ ਹੈ। ਦੋਵੇਂ ਅੰਤਿਮ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ${money(state.netGain)} ਹੈ। ਮੂਲਧਨ ਪਤਾ ਕਰੋ।`,
    `ਕਿਸੇ ਰਕਮ ਨੂੰ ${decimal(state.borrowSimpleRatePercent)}% ਸਧਾਰਣ ਵਿਆਜ 'ਤੇ ਲਿਆ ਅਤੇ ਉਸੇ ਰਕਮ ਨੂੰ ${decimal(state.lendNominalCompoundRatePercent)}% ${periods} ਚੱਕਰਵੱਧੀ ਵਿਆਜ 'ਤੇ ${state.years} ਸਾਲ ਲਈ ਦਿੱਤਾ ਗਿਆ। ਮਿਲਿਆ ਅੰਤਰ ${money(state.netGain)} ਹੈ। ਰਕਮ ਪਤਾ ਕਰੋ।`,
    `${state.years} ਸਾਲ ਵਿੱਚ ${decimal(state.borrowSimpleRatePercent)}% SI ਅਤੇ ${decimal(state.lendNominalCompoundRatePercent)}% ${periods} CI ਵਾਲੀਆਂ ਇੱਕੋ ਮੂਲਧਨ ਦੀਆਂ ਦੋ ਯੋਜਨਾਵਾਂ ਦੀਆਂ ਅੰਤਿਮ ਰਕਮਾਂ ਵਿੱਚ ${money(state.netGain)} ਦਾ ਅੰਤਰ ਹੈ। ਮੂਲਧਨ ਕਿੰਨਾ ਹੈ?`,
  ];
  return frames[t]!;
}

function localizeStep(step: string, locale: Int001Wave05LocalizedLocale): string {
  const hi = locale === "hi-IN";
  if (hi) return step
    .replace(/^SI =/u, "SI =")
    .replace(/^Amount after SI =/u, "SI के बाद राशि =")
    .replace(/^Amount after CI =/u, "CI के बाद राशि =")
    .replace(/^SI on (₹[^=]+) =/u, "$1 पर SI =")
    .replace(/^Final amount =/u, "अंतिम राशि =")
    .replace(/^Now apply CI on (₹[^:]+):/u, "$1 पर अब CI:")
    .replace(/^Before the CI stage =/u, "CI चरण से पहले राशि =")
    .replace(/^Before the SI stage =/u, "SI चरण से पहले राशि =")
    .replace(/^Original principal =/u, "मूल मूलधन =")
    .replace(/^For ₹100, SI amount =/u, "₹100 पर SI राशि =")
    .replace(/^CI rate per period =/u, "प्रति अवधि CI दर =")
    .replace(/; number of periods =/u, "; अवधियों की संख्या =")
    .replace(/^For ₹100, CI amount =/u, "₹100 पर CI राशि =")
    .replace(/^Difference on ₹100 =/u, "₹100 पर अंतर =")
    .replace(/^Actual difference is ([^,]+), so principal =/u, "वास्तविक अंतर $1 है, इसलिए मूलधन =")
    .replace(/^Therefore, final amount =/u, "अतः अंतिम राशि =")
    .replace(/^Therefore, original principal =/u, "अतः मूलधन =")
    .replace(/^Therefore, principal =/u, "अतः मूलधन =");
  return step
    .replace(/^SI =/u, "SI =")
    .replace(/^Amount after SI =/u, "SI ਤੋਂ ਬਾਅਦ ਰਕਮ =")
    .replace(/^Amount after CI =/u, "CI ਤੋਂ ਬਾਅਦ ਰਕਮ =")
    .replace(/^SI on (₹[^=]+) =/u, "$1 ਉੱਤੇ SI =")
    .replace(/^Final amount =/u, "ਅੰਤਿਮ ਰਕਮ =")
    .replace(/^Now apply CI on (₹[^:]+):/u, "$1 ਉੱਤੇ ਹੁਣ CI:")
    .replace(/^Before the CI stage =/u, "CI ਪੜਾਅ ਤੋਂ ਪਹਿਲਾਂ ਰਕਮ =")
    .replace(/^Before the SI stage =/u, "SI ਪੜਾਅ ਤੋਂ ਪਹਿਲਾਂ ਰਕਮ =")
    .replace(/^Original principal =/u, "ਮੂਲ ਮੂਲਧਨ =")
    .replace(/^For ₹100, SI amount =/u, "₹100 ਉੱਤੇ SI ਰਕਮ =")
    .replace(/^CI rate per period =/u, "ਪ੍ਰਤੀ ਅਵਧੀ CI ਦਰ =")
    .replace(/; number of periods =/u, "; ਅਵਧੀਆਂ ਦੀ ਗਿਣਤੀ =")
    .replace(/^For ₹100, CI amount =/u, "₹100 ਉੱਤੇ CI ਰਕਮ =")
    .replace(/^Difference on ₹100 =/u, "₹100 ਉੱਤੇ ਅੰਤਰ =")
    .replace(/^Actual difference is ([^,]+), so principal =/u, "ਅਸਲ ਅੰਤਰ $1 ਹੈ, ਇਸ ਲਈ ਮੂਲਧਨ =")
    .replace(/^Therefore, final amount =/u, "ਇਸ ਲਈ ਅੰਤਿਮ ਰਕਮ =")
    .replace(/^Therefore, original principal =/u, "ਇਸ ਲਈ ਮੂਲਧਨ =")
    .replace(/^Therefore, principal =/u, "ਇਸ ਲਈ ਮੂਲਧਨ =");
}

export function generateInt001Wave05LocalizedCandidate(
  qlId: Int001Wave03QlId,
  seed: string | number,
  locale: Int001Wave05LocalizedLocale,
) {
  if (!INT_001_WAVE05_LOCALIZED_LOCALES.includes(locale)) throw new Error(`${qlId}: unsupported locale ${String(locale)}`);
  const source = generateInt001Wave05EnglishFrozenQuestion(qlId, seed) as any;
  const language = locale === "hi-IN" ? "hi" : "pa";
  const steps = Object.freeze((source.explanation.steps as readonly string[]).map((step) => localizeStep(String(step), locale)));
  if (steps.some((step) => /multiplier|factor|गुणक|ਗੁਣਕ/iu.test(step))) throw new Error(`${qlId}/${locale}: abstract narration survived localization.`);
  return deepFreeze({
    ...source,
    localizedVersion: INT_001_WAVE05_LOCALIZED_VERSION,
    localizedFromFreezeId: INT_001_WAVE05_ENGLISH_FREEZE_ID,
    language,
    locale,
    stem: localizedStem(qlId, source.mathematicalState, source.stemFamilyId, locale),
    options: Object.freeze(source.options.map((option: any) => deepFreeze({ ...option, text: String(option.text) }))),
    explanation: {
      whatAsked: "",
      keyIdea: "",
      steps,
      shortcut: "",
      commonTrap: "",
      finalAnswer: source.explanation.finalAnswer,
    },
    explanationStyle: "DIRECT_CALCULATION" as const,
    localizationStatus: "HI_PA_REVIEW_CANDIDATE" as const,
    editorialStatus: "LOCALIZED_REVIEW" as const,
    approvalStatus: "PENDING_LOCALIZED_REVIEW" as const,
    lifecycle: {
      ...source.lifecycle,
      learnerContentFrozen: false as const,
      reviewStatus: "LOCALIZED_REVIEW_CANDIDATE" as const,
      localeReviewStatus: "PENDING_HUMAN_REVIEW" as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    },
    provenance: {
      ...source.provenance,
      localizedFromFreezeId: INT_001_WAVE05_ENGLISH_FREEZE_ID,
      localizedFromApproval: INT_001_WAVE05_ENGLISH_FREEZE_APPROVAL.authority,
      semanticParityRequired: true as const,
      learnerExplanationStyle: "DIRECT_CALCULATION" as const,
    },
  });
}
