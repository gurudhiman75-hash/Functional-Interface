import { localizeMal001Text, type Mal001LocalizedLanguage } from "./chapter-multilingual-question-studio-v1";
import { applyMal001QuestionStudioLocalizationV3 } from "./chapter-multilingual-question-studio-v3";
import { formatRational } from "./rational";

export const MAL_001_MULTILINGUAL_QUESTION_STUDIO_V4 = Object.freeze({
  localizationId: "MAL-001-HI-PA-QUESTION-STUDIO-V4",
  stemPolicy: "STRUCTURED_NATIVE_CP001_THEN_NATIVE_QL_TEMPLATE",
  mathematicalAuthorityLanguage: "en" as const,
});

function renderNumber(value: any): string {
  if (
    value &&
    typeof value === "object" &&
    typeof value.numerator === "bigint" &&
    typeof value.denominator === "bigint"
  ) {
    return formatRational(value);
  }
  return String(value ?? "");
}

function renderCp001StructuredStem(
  question: Record<string, any>,
  language: Mal001LocalizedLanguage,
): string | null {
  const qlId = String(question.questionLanguageId ?? "");
  const qlNumber = Number(/^MAL-QL-(\d{3})$/u.exec(qlId)?.[1] ?? 0);
  if (qlNumber < 1 || qlNumber > 11) return null;

  const parameters = question.parameters;
  const request = parameters?.request;
  const context = parameters?.context;
  if (!request || !context) return null;

  const hi = language === "hi";
  const t = (value: unknown) => localizeMal001Text(String(value ?? ""), language);
  const unit = context.quantityUnit === "kg"
    ? (hi ? "किग्रा" : "ਕਿਲੋਗ੍ਰਾਮ")
    : (hi ? "लीटर" : "ਲੀਟਰ");
  const perUnit = context.quantityUnit === "kg"
    ? (hi ? "प्रति किग्रा" : "ਪ੍ਰਤੀ ਕਿਲੋਗ੍ਰਾਮ")
    : (hi ? "प्रति लीटर" : "ਪ੍ਰਤੀ ਲੀਟਰ");
  const q = (value: any) => `${renderNumber(value)} ${unit}`;
  const p = (value: any) => `₹${renderNumber(value)} ${perUnit}`;
  const r = (a: any, b: any) => `${renderNumber(a)}:${renderNumber(b)}`;
  const label = (value: unknown) => t(value);

  switch (qlId) {
    case "MAL-QL-001": {
      if (request.mode !== "TWO_COMPONENT_RATIO_FROM_TARGET") return null;
      return hi
        ? `${label(context.lowerLabel)} का मूल्य ${p(request.lowerValue)} और ${label(context.higherLabel)} का मूल्य ${p(request.higherValue)} है। ${p(request.targetValue)} मूल्य का मिश्रण बनाने के लिए दोनों को किस अनुपात में मिलाया जाए?`
        : `${label(context.lowerLabel)} ਦਾ ਮੁੱਲ ${p(request.lowerValue)} ਅਤੇ ${label(context.higherLabel)} ਦਾ ਮੁੱਲ ${p(request.higherValue)} ਹੈ। ${p(request.targetValue)} ਮੁੱਲ ਦਾ ਮਿਸ਼ਰਣ ਬਣਾਉਣ ਲਈ ਦੋਵੇਂ ਨੂੰ ਕਿਹੜੇ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਇਆ ਜਾਵੇ?`;
    }
    case "MAL-QL-002": {
      if (request.mode !== "MEAN_FROM_COMPONENTS" || request.components?.length !== 2) return null;
      const [a, b] = request.components;
      return hi
        ? `${q(a.quantity)} ${label(a.label)} को ${p(a.value)} की दर से और ${q(b.quantity)} ${label(b.label)} को ${p(b.value)} की दर से मिलाया जाता है। बने मिश्रण का औसत मूल्य कितना है?`
        : `${q(a.quantity)} ${label(a.label)} ਨੂੰ ${p(a.value)} ਦੀ ਦਰ ਨਾਲ ਅਤੇ ${q(b.quantity)} ${label(b.label)} ਨੂੰ ${p(b.value)} ਦੀ ਦਰ ਨਾਲ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਬਣੇ ਮਿਸ਼ਰਣ ਦਾ ਔਸਤ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`;
    }
    case "MAL-QL-003": {
      if (request.mode !== "MEAN_FROM_COMPONENTS" || request.components?.length !== 2) return null;
      const [a, b] = request.components;
      const ratio = r(a.quantity, b.quantity);
      return hi
        ? `${label(a.label)} और ${label(b.label)} को ${ratio} के अनुपात में मिलाया जाता है। इनके मूल्य क्रमशः ${p(a.value)} और ${p(b.value)} हैं। मिश्रण का औसत मूल्य कितना होगा?`
        : `${label(a.label)} ਅਤੇ ${label(b.label)} ਨੂੰ ${ratio} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਇਨ੍ਹਾਂ ਦੇ ਮੁੱਲ ਕ੍ਰਮਵਾਰ ${p(a.value)} ਅਤੇ ${p(b.value)} ਹਨ। ਮਿਸ਼ਰਣ ਦਾ ਔਸਤ ਮੁੱਲ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
    }
    case "MAL-QL-004": {
      if (request.mode !== "MEAN_FROM_COMPONENTS" || request.components?.length !== 3) return null;
      const [a, b, c] = request.components;
      return hi
        ? `${q(a.quantity)} ${label(a.label)} को ${p(a.value)}, ${q(b.quantity)} ${label(b.label)} को ${p(b.value)} और ${q(c.quantity)} ${label(c.label)} को ${p(c.value)} की दर से मिलाया जाता है। तीनों से बने मिश्रण का औसत मूल्य कितना है?`
        : `${q(a.quantity)} ${label(a.label)} ਨੂੰ ${p(a.value)}, ${q(b.quantity)} ${label(b.label)} ਨੂੰ ${p(b.value)} ਅਤੇ ${q(c.quantity)} ${label(c.label)} ਨੂੰ ${p(c.value)} ਦੀ ਦਰ ਨਾਲ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਤਿੰਨਾਂ ਤੋਂ ਬਣੇ ਮਿਸ਼ਰਣ ਦਾ ਔਸਤ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`;
    }
    case "MAL-QL-005": {
      if (request.mode !== "UNKNOWN_COMPONENT_VALUE" || request.knownComponents?.length !== 1) return null;
      const known = request.knownComponents[0];
      return hi
        ? `${q(known.quantity)} ${label(known.label)} को ${p(known.value)} की दर से और ${q(request.unknownQuantity)} ${label(request.unknownComponentLabel)} को मिलाने पर मिश्रण का औसत मूल्य ${p(request.targetValue)} है। ${label(request.unknownComponentLabel)} का मूल्य कितना है?`
        : `${q(known.quantity)} ${label(known.label)} ਨੂੰ ${p(known.value)} ਦੀ ਦਰ ਨਾਲ ਅਤੇ ${q(request.unknownQuantity)} ${label(request.unknownComponentLabel)} ਨੂੰ ਮਿਲਾਉਣ 'ਤੇ ਮਿਸ਼ਰਣ ਦਾ ਔਸਤ ਮੁੱਲ ${p(request.targetValue)} ਹੈ। ${label(request.unknownComponentLabel)} ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`;
    }
    case "MAL-QL-006": {
      if (request.mode !== "SOURCE_VALUE_FROM_RATIO") return null;
      const knownLabel = request.knownSide === "LOWER" ? request.lowerComponentLabel : request.higherComponentLabel;
      const unknownLabel = request.knownSide === "LOWER" ? request.higherComponentLabel : request.lowerComponentLabel;
      const ratio = r(request.lowerRatioPart, request.higherRatioPart);
      return hi
        ? `${label(request.lowerComponentLabel)} और ${label(request.higherComponentLabel)} को ${ratio} के अनुपात में मिलाकर ${p(request.targetValue)} मूल्य का मिश्रण बनता है। ${label(knownLabel)} का मूल्य ${p(request.knownValue)} है। ${label(unknownLabel)} का मूल्य कितना है?`
        : `${label(request.lowerComponentLabel)} ਅਤੇ ${label(request.higherComponentLabel)} ਨੂੰ ${ratio} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾ ਕੇ ${p(request.targetValue)} ਮੁੱਲ ਦਾ ਮਿਸ਼ਰਣ ਬਣਦਾ ਹੈ। ${label(knownLabel)} ਦਾ ਮੁੱਲ ${p(request.knownValue)} ਹੈ। ${label(unknownLabel)} ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`;
    }
    case "MAL-QL-007": {
      if (request.mode === "ADD_SOURCE_TO_REACH_TARGET") {
        const initial = request.initialComponents?.[0];
        if (!initial) return null;
        return hi
          ? `${q(initial.quantity)} ${label(initial.label)} का मूल्य ${p(initial.value)} है। इसमें ${p(request.addedValue)} मूल्य वाला ${label(request.addedComponentLabel)} कितना मिलाया जाए ताकि मिश्रण का औसत मूल्य ${p(request.targetValue)} हो जाए?`
          : `${q(initial.quantity)} ${label(initial.label)} ਦਾ ਮੁੱਲ ${p(initial.value)} ਹੈ। ਇਸ ਵਿੱਚ ${p(request.addedValue)} ਮੁੱਲ ਵਾਲਾ ${label(request.addedComponentLabel)} ਕਿੰਨਾ ਮਿਲਾਇਆ ਜਾਵੇ ਤਾਂ ਕਿ ਮਿਸ਼ਰਣ ਦਾ ਔਸਤ ਮੁੱਲ ${p(request.targetValue)} ਹੋ ਜਾਵੇ?`;
      }
      if (request.mode === "UNKNOWN_COMPONENT_QUANTITY") {
        const known = request.knownComponents?.[0];
        if (!known) return null;
        return hi
          ? `${q(known.quantity)} ${label(known.label)} का मूल्य ${p(known.value)} है। इसमें ${p(request.unknownValue)} मूल्य वाला ${label(request.unknownComponentLabel)} कितना मिलाया जाए ताकि मिश्रण का औसत मूल्य ${p(request.targetValue)} हो?`
          : `${q(known.quantity)} ${label(known.label)} ਦਾ ਮੁੱਲ ${p(known.value)} ਹੈ। ਇਸ ਵਿੱਚ ${p(request.unknownValue)} ਮੁੱਲ ਵਾਲਾ ${label(request.unknownComponentLabel)} ਕਿੰਨਾ ਮਿਲਾਇਆ ਜਾਵੇ ਤਾਂ ਕਿ ਮਿਸ਼ਰਣ ਦਾ ਔਸਤ ਮੁੱਲ ${p(request.targetValue)} ਹੋਵੇ?`;
      }
      return null;
    }
    case "MAL-QL-008": {
      if (request.mode !== "UNKNOWN_COMPONENT_QUANTITY" || request.knownComponents?.length !== 2) return null;
      const [a, b] = request.knownComponents;
      return hi
        ? `${q(a.quantity)} ${label(a.label)} को ${p(a.value)} और ${q(b.quantity)} ${label(b.label)} को ${p(b.value)} की दर से मिलाया जाता है। ${p(request.unknownValue)} मूल्य वाला ${label(request.unknownComponentLabel)} कितना मिलाया जाए ताकि तीनों का औसत मूल्य ${p(request.targetValue)} हो?`
        : `${q(a.quantity)} ${label(a.label)} ਨੂੰ ${p(a.value)} ਅਤੇ ${q(b.quantity)} ${label(b.label)} ਨੂੰ ${p(b.value)} ਦੀ ਦਰ ਨਾਲ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ। ${p(request.unknownValue)} ਮੁੱਲ ਵਾਲਾ ${label(request.unknownComponentLabel)} ਕਿੰਨਾ ਮਿਲਾਇਆ ਜਾਵੇ ਤਾਂ ਕਿ ਤਿੰਨਾਂ ਦਾ ਔਸਤ ਮੁੱਲ ${p(request.targetValue)} ਹੋਵੇ?`;
    }
    case "MAL-QL-009": {
      if (request.mode !== "TWO_QUANTITIES_FROM_TOTAL_AND_TARGET") return null;
      return hi
        ? `कुल ${q(request.totalQuantity)} मिश्रण का औसत मूल्य ${p(request.targetValue)} है। ${label(request.lowerComponentLabel)} और ${label(request.higherComponentLabel)} के मूल्य क्रमशः ${p(request.lowerValue)} और ${p(request.higherValue)} हैं। दोनों की मात्राएँ कितनी हैं?`
        : `ਕੁੱਲ ${q(request.totalQuantity)} ਮਿਸ਼ਰਣ ਦਾ ਔਸਤ ਮੁੱਲ ${p(request.targetValue)} ਹੈ। ${label(request.lowerComponentLabel)} ਅਤੇ ${label(request.higherComponentLabel)} ਦੇ ਮੁੱਲ ਕ੍ਰਮਵਾਰ ${p(request.lowerValue)} ਅਤੇ ${p(request.higherValue)} ਹਨ। ਦੋਵਾਂ ਦੀਆਂ ਮਾਤਰਾਵਾਂ ਕਿੰਨੀਆਂ ਹਨ?`;
    }
    case "MAL-QL-010": {
      if (request.mode !== "COMPONENT_SHARE_FROM_TARGET") return null;
      const requestedLabel = request.requestedSide === "LOWER" ? request.lowerComponentLabel : request.higherComponentLabel;
      return hi
        ? `${q(request.totalQuantity)} के मिश्रण में ${label(request.lowerComponentLabel)} का मूल्य ${p(request.lowerValue)} और ${label(request.higherComponentLabel)} का मूल्य ${p(request.higherValue)} है। मिश्रण का औसत मूल्य ${p(request.targetValue)} है। ${label(requestedLabel)} की मात्रा कितनी है?`
        : `${q(request.totalQuantity)} ਦੇ ਮਿਸ਼ਰਣ ਵਿੱਚ ${label(request.lowerComponentLabel)} ਦਾ ਮੁੱਲ ${p(request.lowerValue)} ਅਤੇ ${label(request.higherComponentLabel)} ਦਾ ਮੁੱਲ ${p(request.higherValue)} ਹੈ। ਮਿਸ਼ਰਣ ਦਾ ਔਸਤ ਮੁੱਲ ${p(request.targetValue)} ਹੈ। ${label(requestedLabel)} ਦੀ ਮਾਤਰਾ ਕਿੰਨੀ ਹੈ?`;
    }
    case "MAL-QL-011": {
      if (request.mode !== "TWO_STAGE_BLEND_MEAN" || request.stageOneComponents?.length !== 2) return null;
      const [a, b] = request.stageOneComponents;
      const c = request.finalComponent;
      if (!c) return null;
      return hi
        ? `पहले ${q(a.quantity)} ${label(a.label)} को ${p(a.value)} और ${q(b.quantity)} ${label(b.label)} को ${p(b.value)} की दर से मिलाया जाता है। इस पहले मिश्रण में से ${q(request.stageOneQuantityUsed)} लेकर उसे ${q(c.quantity)} ${label(c.label)} के साथ ${p(c.value)} की दर पर मिलाया जाता है। अंतिम मिश्रण का औसत मूल्य कितना है?`
        : `ਪਹਿਲਾਂ ${q(a.quantity)} ${label(a.label)} ਨੂੰ ${p(a.value)} ਅਤੇ ${q(b.quantity)} ${label(b.label)} ਨੂੰ ${p(b.value)} ਦੀ ਦਰ ਨਾਲ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਇਸ ਪਹਿਲੇ ਮਿਸ਼ਰਣ ਵਿੱਚੋਂ ${q(request.stageOneQuantityUsed)} ਲੈ ਕੇ ਉਸ ਨੂੰ ${q(c.quantity)} ${label(c.label)} ਨਾਲ ${p(c.value)} ਦੀ ਦਰ 'ਤੇ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਅੰਤਿਮ ਮਿਸ਼ਰਣ ਦਾ ਔਸਤ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`;
    }
  }
  return null;
}

export function applyMal001QuestionStudioLocalizationV4<T extends Record<string, any>>(
  question: T,
  language: Mal001LocalizedLanguage,
): T {
  const localized = applyMal001QuestionStudioLocalizationV3(question, language) as T;
  const structuredStem = renderCp001StructuredStem(question, language);
  if (!structuredStem) return localized;

  return {
    ...localized,
    stem: structuredStem,
    traceability: {
      ...(localized.traceability ?? {}),
      localizationId: MAL_001_MULTILINGUAL_QUESTION_STUDIO_V4.localizationId,
      localizationStemTemplateId: `${question.questionLanguageId}-${language.toUpperCase()}-STRUCTURED-NATIVE-V1`,
      nativeStemTemplateMatched: true,
      nativeStemSource: "STRUCTURED_CP001_PARAMETERS",
    },
  } as T;
}
