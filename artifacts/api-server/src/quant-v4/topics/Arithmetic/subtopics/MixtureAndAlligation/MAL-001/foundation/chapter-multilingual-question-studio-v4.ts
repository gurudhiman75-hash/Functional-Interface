import { localizeMal001Text, type Mal001LocalizedLanguage } from "./chapter-multilingual-question-studio-v1";
import { applyMal001QuestionStudioLocalizationV3 } from "./chapter-multilingual-question-studio-v3";

export const MAL_001_MULTILINGUAL_QUESTION_STUDIO_V4 = Object.freeze({
  localizationId: "MAL-001-HI-PA-QUESTION-STUDIO-V4",
  stemPolicy: "NATIVE_QL_TEMPLATE_VARIANT_COMPLETE",
  mathematicalAuthorityLanguage: "en" as const,
});

type NativeStem = { text: string; variant: string } | null;

function ql001NativeStem(
  stem: string,
  language: Mal001LocalizedLanguage,
): NativeStem {
  const t = (value: string) => localizeMal001Text(value, language);
  const hi = language === "hi";
  const render = (
    lower: string,
    lowerPrice: string,
    higher: string,
    higherPrice: string,
    target: string,
    variant: string,
  ): NativeStem => ({
    variant,
    text: hi
      ? `${t(lower)} को ${t(lowerPrice)} और ${t(higher)} को ${t(higherPrice)} की दर से मिलाकर ${t(target)} मूल्य का मिश्रण बनाना है। दोनों को किस अनुपात में मिलाना चाहिए?`
      : `${t(lower)} ਨੂੰ ${t(lowerPrice)} ਅਤੇ ${t(higher)} ਨੂੰ ${t(higherPrice)} ਦੀ ਦਰ ਨਾਲ ਮਿਲਾ ਕੇ ${t(target)} ਮੁੱਲ ਦਾ ਮਿਸ਼ਰਣ ਬਣਾਉਣਾ ਹੈ। ਦੋਵੇਂ ਨੂੰ ਕਿਹੜੇ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਇਆ ਜਾਵੇ?`,
  });

  let m = /^An? .+? has (.+?) at (.+?) and (.+?) at (.+?)\. In what ratio should the two be mixed to obtain (.+?) worth (.+?)\?$/u.exec(stem);
  if (m) return render(m[1]!, m[2]!, m[3]!, m[4]!, m[6]!, "HAS_TWO_GRADES");

  m = /^To prepare (.+?) worth (.+?), in what ratio should .+? mix (.+?) costing (.+?) with (.+?) costing (.+?)\?$/u.exec(stem);
  if (m) return render(m[3]!, m[4]!, m[5]!, m[6]!, m[2]!, "TO_PREPARE_TARGET");

  m = /^The available grades are (.+?) at (.+?) and (.+?) at (.+?)\. What mixing ratio will produce a mixture worth (.+?)\?$/u.exec(stem);
  if (m) return render(m[1]!, m[2]!, m[3]!, m[4]!, m[5]!, "AVAILABLE_GRADES");

  m = /^An? .+? wants a mixture worth (.+?) from (.+?) at (.+?) and (.+?) at (.+?)\. What ratio of the two grades is required\?$/u.exec(stem);
  if (m) return render(m[2]!, m[3]!, m[4]!, m[5]!, m[1]!, "WANTS_TARGET");

  return null;
}

export function applyMal001QuestionStudioLocalizationV4<T extends Record<string, any>>(
  question: T,
  language: Mal001LocalizedLanguage,
): T {
  const localized = applyMal001QuestionStudioLocalizationV3(question, language) as T;
  if (localized.traceability?.nativeStemTemplateMatched === true) {
    return localized;
  }

  if (String(question.questionLanguageId ?? "") !== "MAL-QL-001") {
    return localized;
  }

  const native = ql001NativeStem(String(question.stem ?? ""), language);
  if (!native) return localized;

  return {
    ...localized,
    stem: native.text,
    traceability: {
      ...(localized.traceability ?? {}),
      localizationId: MAL_001_MULTILINGUAL_QUESTION_STUDIO_V4.localizationId,
      localizationStemTemplateId: `${question.questionLanguageId}-${language.toUpperCase()}-NATIVE-STEM-V2-${native.variant}`,
      nativeStemTemplateMatched: true,
      nativeStemVariant: native.variant,
    },
  } as T;
}
