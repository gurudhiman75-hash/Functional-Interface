import type { Int001Wave03QlId } from "./int-001-wave03-permanent-allocation-v1";
import {
  generateInt001Wave05EnglishFrozenQuestion,
  INT_001_WAVE05_ENGLISH_FREEZE_VERSION,
} from "./int-001-wave05-english-freeze-v1";

export const INT_001_WAVE05_LOCALIZATION_VERSION = "INT-001-WAVE05-LOCALIZATION-v1" as const;
export const INT_001_WAVE05_LOCALIZED_LANGUAGES = ["hi", "pa"] as const;
export type Int001Wave05LocalizedLanguage = (typeof INT_001_WAVE05_LOCALIZED_LANGUAGES)[number];

type RationalLike = Readonly<{ numerator: bigint; denominator: bigint }>;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function numeric(value: RationalLike) {
  return Number(value.numerator) / Number(value.denominator);
}

function decimal(value: RationalLike, digits = 8) {
  return numeric(value).toFixed(digits).replace(/0+$/u, "").replace(/\.$/u, "");
}

function money(value: RationalLike) {
  const amount = Math.round(numeric(value) * 100) / 100;
  const hasPaise = Math.abs(amount - Math.round(amount)) > 1e-9;
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: hasPaise ? 2 : 0, maximumFractionDigits: 2 })}`;
}

function localizedStem(qlId: Int001Wave03QlId, state: any, language: Int001Wave05LocalizedLanguage) {
  if (language === "hi") {
    if (qlId === "INT-QL-132") {
      const first = state.stageOrder === "SI_THEN_CI"
        ? `${money(state.principal)} पर पहले ${decimal(state.simpleRatePercent)}% वार्षिक साधारण ब्याज से ${state.simpleYears} वर्ष और फिर प्राप्त राशि पर ${decimal(state.compoundRatePercent)}% वार्षिक चक्रवृद्धि ब्याज से ${state.compoundYears} वर्ष`
        : `${money(state.principal)} पर पहले ${decimal(state.compoundRatePercent)}% वार्षिक चक्रवृद्धि ब्याज से ${state.compoundYears} वर्ष और फिर प्राप्त राशि पर ${decimal(state.simpleRatePercent)}% वार्षिक साधारण ब्याज से ${state.simpleYears} वर्ष`;
      return `${first} निवेश किया गया। अंत में राशि कितनी होगी?`;
    }
    if (qlId === "INT-QL-133") {
      const order = state.stageOrder === "SI_THEN_CI"
        ? `पहले ${decimal(state.simpleRatePercent)}% वार्षिक साधारण ब्याज से ${state.simpleYears} वर्ष और फिर ${decimal(state.compoundRatePercent)}% वार्षिक चक्रवृद्धि ब्याज से ${state.compoundYears} वर्ष`
        : `पहले ${decimal(state.compoundRatePercent)}% वार्षिक चक्रवृद्धि ब्याज से ${state.compoundYears} वर्ष और फिर ${decimal(state.simpleRatePercent)}% वार्षिक साधारण ब्याज से ${state.simpleYears} वर्ष`;
      return `किसी मूलधन को ${order} लगाने पर अंतिम राशि ${money(state.finalAmount)} हो जाती है। मूलधन ज्ञात कीजिए।`;
    }
    const frequency = state.compoundPeriodsPerYear === 2 ? "अर्धवार्षिक चक्रवृद्धि" : "वार्षिक चक्रवृद्धि";
    return `एक व्यक्ति समान मूलधन को ${decimal(state.borrowSimpleRatePercent)}% वार्षिक साधारण ब्याज पर ${state.years} वर्ष के लिए उधार लेता है और उसी मूलधन को ${decimal(state.lendNominalCompoundRatePercent)}% वार्षिक दर पर ${frequency} ब्याज में लगाता है। दोनों अंतिम राशियों का अंतर ${money(state.netGain)} है। मूलधन ज्ञात कीजिए।`;
  }

  if (qlId === "INT-QL-132") {
    const first = state.stageOrder === "SI_THEN_CI"
      ? `${money(state.principal)} ਉੱਤੇ ਪਹਿਲਾਂ ${decimal(state.simpleRatePercent)}% ਸਾਲਾਨਾ ਸਧਾਰਨ ਵਿਆਜ ਨਾਲ ${state.simpleYears} ਸਾਲ ਅਤੇ ਫਿਰ ਮਿਲੀ ਰਕਮ ਉੱਤੇ ${decimal(state.compoundRatePercent)}% ਸਾਲਾਨਾ ਚੱਕਰਵਰਧੀ ਵਿਆਜ ਨਾਲ ${state.compoundYears} ਸਾਲ`
      : `${money(state.principal)} ਉੱਤੇ ਪਹਿਲਾਂ ${decimal(state.compoundRatePercent)}% ਸਾਲਾਨਾ ਚੱਕਰਵਰਧੀ ਵਿਆਜ ਨਾਲ ${state.compoundYears} ਸਾਲ ਅਤੇ ਫਿਰ ਮਿਲੀ ਰਕਮ ਉੱਤੇ ${decimal(state.simpleRatePercent)}% ਸਾਲਾਨਾ ਸਧਾਰਨ ਵਿਆਜ ਨਾਲ ${state.simpleYears} ਸਾਲ`;
    return `${first} ਨਿਵੇਸ਼ ਕੀਤਾ ਗਿਆ। ਅੰਤ ਵਿੱਚ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?`;
  }
  if (qlId === "INT-QL-133") {
    const order = state.stageOrder === "SI_THEN_CI"
      ? `ਪਹਿਲਾਂ ${decimal(state.simpleRatePercent)}% ਸਾਲਾਨਾ ਸਧਾਰਨ ਵਿਆਜ ਨਾਲ ${state.simpleYears} ਸਾਲ ਅਤੇ ਫਿਰ ${decimal(state.compoundRatePercent)}% ਸਾਲਾਨਾ ਚੱਕਰਵਰਧੀ ਵਿਆਜ ਨਾਲ ${state.compoundYears} ਸਾਲ`
      : `ਪਹਿਲਾਂ ${decimal(state.compoundRatePercent)}% ਸਾਲਾਨਾ ਚੱਕਰਵਰਧੀ ਵਿਆਜ ਨਾਲ ${state.compoundYears} ਸਾਲ ਅਤੇ ਫਿਰ ${decimal(state.simpleRatePercent)}% ਸਾਲਾਨਾ ਸਧਾਰਨ ਵਿਆਜ ਨਾਲ ${state.simpleYears} ਸਾਲ`;
    return `ਕਿਸੇ ਮੂਲਧਨ ਨੂੰ ${order} ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ਅੰਤਿਮ ਰਕਮ ${money(state.finalAmount)} ਹੋ ਜਾਂਦੀ ਹੈ। ਮੂਲਧਨ ਕੱਢੋ।`;
  }
  const frequency = state.compoundPeriodsPerYear === 2 ? "ਛਿਮਾਹੀ ਚੱਕਰਵਰਧੀ" : "ਸਾਲਾਨਾ ਚੱਕਰਵਰਧੀ";
  return `ਇੱਕ ਵਿਅਕਤੀ ਇੱਕੋ ਮੂਲਧਨ ਨੂੰ ${decimal(state.borrowSimpleRatePercent)}% ਸਾਲਾਨਾ ਸਧਾਰਨ ਵਿਆਜ ਉੱਤੇ ${state.years} ਸਾਲ ਲਈ ਉਧਾਰ ਲੈਂਦਾ ਹੈ ਅਤੇ ਉਸੇ ਮੂਲਧਨ ਨੂੰ ${decimal(state.lendNominalCompoundRatePercent)}% ਸਾਲਾਨਾ ਦਰ ਉੱਤੇ ${frequency} ਵਿਆਜ ਵਿੱਚ ਲਗਾਉਂਦਾ ਹੈ। ਦੋਵੇਂ ਅੰਤਿਮ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ${money(state.netGain)} ਹੈ। ਮੂਲਧਨ ਕੱਢੋ।`;
}

function translateStep(step: string, language: Int001Wave05LocalizedLanguage) {
  if (language === "hi") {
    return step
      .replace(/^Amount after SI =/u, "SI के बाद राशि =")
      .replace(/^Amount after CI =/u, "CI के बाद राशि =")
      .replace(/^Now apply CI on /u, "अब CI लगाएँ: ")
      .replace(/^SI on /u, "SI = ")
      .replace(/^Final amount =/u, "अंतिम राशि =")
      .replace(/^Therefore, final amount =/u, "अतः अंतिम राशि =")
      .replace(/^Before the CI stage =/u, "CI चरण से पहले राशि =")
      .replace(/^Before the SI stage =/u, "SI चरण से पहले राशि =")
      .replace(/^Original principal =/u, "मूलधन =")
      .replace(/^Therefore, original principal =/u, "अतः मूलधन =")
      .replace(/^For ₹100, SI amount =/u, "₹100 पर SI राशि =")
      .replace(/^CI rate per period =/u, "प्रति अवधि CI दर =")
      .replace(/; number of periods =/u, "; अवधियों की संख्या =")
      .replace(/^For ₹100, CI amount =/u, "₹100 पर CI राशि =")
      .replace(/^Difference on ₹100 =/u, "₹100 पर अंतर =")
      .replace(/^Actual difference is /u, "वास्तविक अंतर ")
      .replace(/, so principal =/u, ", इसलिए मूलधन =")
      .replace(/^Therefore, principal =/u, "अतः मूलधन =");
  }
  return step
    .replace(/^Amount after SI =/u, "SI ਤੋਂ ਬਾਅਦ ਰਕਮ =")
    .replace(/^Amount after CI =/u, "CI ਤੋਂ ਬਾਅਦ ਰਕਮ =")
    .replace(/^Now apply CI on /u, "ਹੁਣ CI ਲਗਾਓ: ")
    .replace(/^SI on /u, "SI = ")
    .replace(/^Final amount =/u, "ਅੰਤਿਮ ਰਕਮ =")
    .replace(/^Therefore, final amount =/u, "ਇਸ ਲਈ ਅੰਤਿਮ ਰਕਮ =")
    .replace(/^Before the CI stage =/u, "CI ਪੜਾਅ ਤੋਂ ਪਹਿਲਾਂ ਰਕਮ =")
    .replace(/^Before the SI stage =/u, "SI ਪੜਾਅ ਤੋਂ ਪਹਿਲਾਂ ਰਕਮ =")
    .replace(/^Original principal =/u, "ਮੂਲਧਨ =")
    .replace(/^Therefore, original principal =/u, "ਇਸ ਲਈ ਮੂਲਧਨ =")
    .replace(/^For ₹100, SI amount =/u, "₹100 ਉੱਤੇ SI ਰਕਮ =")
    .replace(/^CI rate per period =/u, "ਪ੍ਰਤੀ ਅਵਧੀ CI ਦਰ =")
    .replace(/; number of periods =/u, "; ਅਵਧੀਆਂ ਦੀ ਗਿਣਤੀ =")
    .replace(/^For ₹100, CI amount =/u, "₹100 ਉੱਤੇ CI ਰਕਮ =")
    .replace(/^Difference on ₹100 =/u, "₹100 ਉੱਤੇ ਅੰਤਰ =")
    .replace(/^Actual difference is /u, "ਅਸਲ ਅੰਤਰ ")
    .replace(/, so principal =/u, ", ਇਸ ਲਈ ਮੂਲਧਨ =")
    .replace(/^Therefore, principal =/u, "ਇਸ ਲਈ ਮੂਲਧਨ =");
}

export function generateInt001Wave05LocalizedQuestion(
  qlId: Int001Wave03QlId,
  seed: string | number,
  language: Int001Wave05LocalizedLanguage,
) {
  if (!(INT_001_WAVE05_LOCALIZED_LANGUAGES as readonly string[]).includes(language)) {
    throw new Error(`Unsupported Wave05 localization language '${String(language)}'.`);
  }
  const source = generateInt001Wave05EnglishFrozenQuestion(qlId, seed) as any;
  const steps = Object.freeze((source.explanation.steps as readonly string[]).map((step) => translateStep(String(step), language)));
  const finalAnswer = language === "hi"
    ? String(source.explanation.finalAnswer).replace(/^Therefore, /u, "अतः ")
    : String(source.explanation.finalAnswer).replace(/^Therefore, /u, "ਇਸ ਲਈ ");

  return deepFreeze({
    ...source,
    localizationVersion: INT_001_WAVE05_LOCALIZATION_VERSION,
    sourceEnglishFreezeVersion: INT_001_WAVE05_ENGLISH_FREEZE_VERSION,
    language,
    locale: language === "hi" ? "hi-IN" as const : "pa-IN" as const,
    stem: localizedStem(qlId, source.mathematicalState, language),
    explanation: {
      ...source.explanation,
      steps,
      finalAnswer,
    },
    localizationStatus: "SEMANTIC_PARITY_CANDIDATE" as const,
    lifecycle: {
      ...source.lifecycle,
      learnerContentFrozen: true as const,
      reviewStatus: "LOCALIZED_REVIEW_CANDIDATE" as const,
      localeReviewStatus: "SEMANTIC_PARITY_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    },
  });
}
