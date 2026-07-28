import { buildPnc002ProductionTeacherStudentPresentation } from "./student-presentation-teacher-production";
import type {
  PncStudentExplanationSection,
  PncStudentSourcePackage,
} from "./student-presentation";
import {
  formatLocalizedOption,
  localizedSectionHeading,
  localizedUnitLabel,
  parsePositiveInteger,
} from "./localization-glossary";
import type {
  PncLocalizedStudentPresentation,
  PncStudentLocale,
} from "./localization-types";

export const PNC_002_CP007_LOCALIZATION_PILOT = Object.freeze({
  releaseId: "PNC-002-CP007-HI-PA-v1-CANDIDATE",
  packageId: "PNC-002",
  canonicalProblemId: "PNC-CP-007",
  languages: ["hi-IN", "pa-IN"] as const,
  qlRange: ["PNC-QL-107", "PNC-QL-124"] as const,
  qlCount: 18,
  status: "MANUAL_REVIEW",
  editorialStatus: "PENDING",
  publiclyPublishable: false,
  createdAt: "2026-07-28",
});

const CORE_TITLES: Record<string, Record<PncStudentLocale, string>> = {
  "PNC-QL-107": { "hi-IN": "दो व्यक्तियों को एक ब्लॉक मानना", "pa-IN": "ਦੋ ਵਿਅਕਤੀਆਂ ਨੂੰ ਇੱਕ ਬਲਾਕ ਮੰਨਣਾ" },
  "PNC-QL-108": { "hi-IN": "किताबों के समूह को एक ब्लॉक मानना", "pa-IN": "ਕਿਤਾਬਾਂ ਦੇ ਸਮੂਹ ਨੂੰ ਇੱਕ ਬਲਾਕ ਮੰਨਣਾ" },
  "PNC-QL-109": { "hi-IN": "कुल में से साथ बैठने वाले क्रम घटाना", "pa-IN": "ਕੁੱਲ ਵਿੱਚੋਂ ਨਾਲ-ਨਾਲ ਬੈਠਣ ਵਾਲੇ ਕ੍ਰਮ ਘਟਾਉਣਾ" },
  "PNC-QL-110": { "hi-IN": "कुल में से लगातार आने वाला निषिद्ध ब्लॉक घटाना", "pa-IN": "ਕੁੱਲ ਵਿੱਚੋਂ ਲਗਾਤਾਰ ਆਉਣ ਵਾਲਾ ਮਨਾਹੀ ਬਲਾਕ ਘਟਾਉਣਾ" },
  "PNC-QL-111": { "hi-IN": "दो अलग जोड़ों के दो ब्लॉक", "pa-IN": "ਦੋ ਵੱਖਰੇ ਜੋੜਿਆਂ ਦੇ ਦੋ ਬਲਾਕ" },
  "PNC-QL-112": { "hi-IN": "एक जोड़ा और एक तिकड़ी—दो अलग ब्लॉक", "pa-IN": "ਇੱਕ ਜੋੜਾ ਅਤੇ ਇੱਕ ਤਿੱਕੜੀ—ਦੋ ਵੱਖਰੇ ਬਲਾਕ" },
  "PNC-QL-113": { "hi-IN": "तीन जोड़े, तीन अलग ब्लॉक", "pa-IN": "ਤਿੰਨ ਜੋੜੇ, ਤਿੰਨ ਵੱਖਰੇ ਬਲਾਕ" },
  "PNC-QL-114": { "hi-IN": "किताबों के दो स्वतंत्र ब्लॉक", "pa-IN": "ਕਿਤਾਬਾਂ ਦੇ ਦੋ ਸੁਤੰਤਰ ਬਲਾਕ" },
  "PNC-QL-115": { "hi-IN": "एक अनिवार्य ब्लॉक और एक निषिद्ध जोड़ा", "pa-IN": "ਇੱਕ ਲਾਜ਼ਮੀ ਬਲਾਕ ਅਤੇ ਇੱਕ ਮਨਾਹੀ ਜੋੜਾ" },
  "PNC-QL-116": { "hi-IN": "दिए गए परिणाम से n ज्ञात करना", "pa-IN": "ਦਿੱਤੇ ਨਤੀਜੇ ਤੋਂ n ਪਤਾ ਕਰਨਾ" },
  "PNC-QL-117": { "hi-IN": "अलग बैठने की शर्त से n ज्ञात करना", "pa-IN": "ਵੱਖ ਬੈਠਣ ਦੀ ਸ਼ਰਤ ਤੋਂ n ਪਤਾ ਕਰਨਾ" },
  "PNC-QL-118": { "hi-IN": "दिए गए परिणाम से ब्लॉक का आकार ज्ञात करना", "pa-IN": "ਦਿੱਤੇ ਨਤੀਜੇ ਤੋਂ ਬਲਾਕ ਦਾ ਆਕਾਰ ਪਤਾ ਕਰਨਾ" },
  "PNC-QL-119": { "hi-IN": "दो जोड़े साथ, पर दोनों ब्लॉक अलग", "pa-IN": "ਦੋ ਜੋੜੇ ਇਕੱਠੇ, ਪਰ ਦੋਵੇਂ ਬਲਾਕ ਵੱਖ" },
  "PNC-QL-120": { "hi-IN": "जोड़ा और तिकड़ी साथ, पर दोनों ब्लॉक अलग", "pa-IN": "ਜੋੜਾ ਅਤੇ ਤਿੱਕੜੀ ਇਕੱਠੇ, ਪਰ ਦੋਵੇਂ ਬਲਾਕ ਵੱਖ" },
  "PNC-QL-121": { "hi-IN": "बड़ा ब्लॉक और उसके पास न बैठने वाला व्यक्ति", "pa-IN": "ਵੱਡਾ ਬਲਾਕ ਅਤੇ ਉਸਦੇ ਕੋਲ ਨਾ ਖੜ੍ਹਨ ਵਾਲਾ ਵਿਅਕਤੀ" },
  "PNC-QL-122": { "hi-IN": "एक जोड़ा साथ, दूसरी तिकड़ी लगातार नहीं", "pa-IN": "ਇੱਕ ਜੋੜਾ ਇਕੱਠਾ, ਦੂਜੀ ਤਿੱਕੜੀ ਲਗਾਤਾਰ ਨਹੀਂ" },
  "PNC-QL-123": { "hi-IN": "कम-से-कम एक जोड़ा अलग", "pa-IN": "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਜੋੜਾ ਵੱਖ" },
  "PNC-QL-124": { "hi-IN": "ब्लॉकों की दूरी की शर्त से n ज्ञात करना", "pa-IN": "ਬਲਾਕਾਂ ਦੀ ਦੂਰੀ ਦੀ ਸ਼ਰਤ ਤੋਂ n ਪਤਾ ਕਰਨਾ" },
};

function numericTokens(value: string): string[] {
  return [...value.matchAll(/\d[\d,]*/g)].map((match) => match[0]!);
}

function requiredToken(tokens: string[], index: number, qlId: string): string {
  const value = tokens[index];
  if (value === undefined) throw new Error(`${qlId}: missing numeric token ${index}`);
  return value;
}

function localizedStem(english: string, qlId: string, locale: PncStudentLocale): string {
  const t = numericTokens(english);
  const hi = locale === "hi-IN";
  switch (qlId) {
    case "PNC-QL-107": {
      const n = requiredToken(t, 0, qlId);
      return hi
        ? `${n} व्यक्तियों को एक सीधी पंक्ति में बैठाना है। यदि दो निश्चित व्यक्तियों को एक-दूसरे के पास बैठना हो, तो कुल कितने तरीके हैं?`
        : `${n} ਵਿਅਕਤੀਆਂ ਨੂੰ ਇੱਕ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਬਿਠਾਉਣਾ ਹੈ। ਜੇ ਦੋ ਖਾਸ ਵਿਅਕਤੀ ਨਾਲ-ਨਾਲ ਬੈਠਣ, ਤਾਂ ਕੁੱਲ ਕਿੰਨੇ ਤਰੀਕੇ ਹਨ?`;
    }
    case "PNC-QL-108": {
      const n = requiredToken(t, 0, qlId);
      const k = requiredToken(t, 1, qlId);
      return hi
        ? `${n} अलग-अलग किताबों को शेल्फ पर सजाना है। यदि ${k} निश्चित किताबें हमेशा साथ रहें, तो कितने तरीके संभव हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਕਿਤਾਬਾਂ ਨੂੰ ਸ਼ੈਲਫ਼ ਉੱਤੇ ਲਗਾਉਣਾ ਹੈ। ਜੇ ${k} ਖਾਸ ਕਿਤਾਬਾਂ ਹਮੇਸ਼ਾਂ ਇਕੱਠੀਆਂ ਰਹਿਣ, ਤਾਂ ਕਿੰਨੇ ਤਰੀਕੇ ਸੰਭਵ ਹਨ?`;
    }
    case "PNC-QL-109": {
      const n = requiredToken(t, 0, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों को एक सीधी पंक्ति में बैठाना है। यदि दो निश्चित व्यक्ति एक-दूसरे के पास न बैठें, तो कितने तरीके हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਨੂੰ ਇੱਕ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਬਿਠਾਉਣਾ ਹੈ। ਜੇ ਦੋ ਖਾਸ ਵਿਅਕਤੀ ਨਾਲ-ਨਾਲ ਨਾ ਬੈਠਣ, ਤਾਂ ਕਿੰਨੇ ਤਰੀਕੇ ਹਨ?`;
    }
    case "PNC-QL-110": {
      const n = requiredToken(t, 0, qlId);
      const k = requiredToken(t, 1, qlId);
      return hi
        ? `${n} अलग-अलग फाइलों को एक पंक्ति में लगाना है। यदि ${k} निश्चित फाइलें सभी एक साथ लगातार न आएँ, तो कितने तरीके हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਫਾਈਲਾਂ ਨੂੰ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਲਗਾਉਣਾ ਹੈ। ਜੇ ${k} ਖਾਸ ਫਾਈਲਾਂ ਸਾਰੀਆਂ ਇਕੱਠੀਆਂ ਲਗਾਤਾਰ ਨਾ ਆਉਣ, ਤਾਂ ਕਿੰਨੇ ਤਰੀਕੇ ਹਨ?`;
    }
    case "PNC-QL-111": {
      const n = requiredToken(t, 0, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों में दो निश्चित जोड़े हैं। यदि हर जोड़े के दोनों व्यक्ति साथ रहें, तो रैखिक व्यवस्थाओं की संख्या क्या होगी?`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਵਿੱਚ ਦੋ ਖਾਸ ਜੋੜੇ ਹਨ। ਜੇ ਹਰ ਜੋੜੇ ਦੇ ਦੋਵੇਂ ਵਿਅਕਤੀ ਇਕੱਠੇ ਰਹਿਣ, ਤਾਂ ਸਿੱਧੀ ਕਤਾਰ ਦੇ ਕਿੰਨੇ ਤਰੀਕੇ ਹੋਣਗੇ?`;
    }
    case "PNC-QL-112": {
      const n = requiredToken(t, 0, qlId);
      return hi
        ? `${n} अलग-अलग कलाकारों में एक निश्चित जोड़ा और उससे अलग एक निश्चित तिकड़ी है। दोनों समूहों को अपने-अपने सदस्यों के साथ रहना है। कितने रैखिक क्रम संभव हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਕਲਾਕਾਰਾਂ ਵਿੱਚ ਇੱਕ ਖਾਸ ਜੋੜਾ ਅਤੇ ਉਸ ਤੋਂ ਵੱਖ ਇੱਕ ਖਾਸ ਤਿੱਕੜੀ ਹੈ। ਦੋਵੇਂ ਸਮੂਹ ਆਪਣੇ ਮੈਂਬਰਾਂ ਸਮੇਤ ਇਕੱਠੇ ਰਹਿਣ। ਕਿੰਨੇ ਸਿੱਧੇ ਕ੍ਰਮ ਸੰਭਵ ਹਨ?`;
    }
    case "PNC-QL-113": {
      const n = requiredToken(t, 0, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों में तीन अलग निश्चित जोड़े हैं। यदि हर जोड़ा साथ रहे, तो कितने रैखिक क्रम संभव हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਵਿੱਚ ਤਿੰਨ ਵੱਖਰੇ ਖਾਸ ਜੋੜੇ ਹਨ। ਜੇ ਹਰ ਜੋੜਾ ਇਕੱਠਾ ਰਹੇ, ਤਾਂ ਕਿੰਨੇ ਸਿੱਧੇ ਕ੍ਰਮ ਸੰਭਵ ਹਨ?`;
    }
    case "PNC-QL-114": {
      const n = requiredToken(t, 0, qlId);
      const a = requiredToken(t, 1, qlId);
      const b = requiredToken(t, 2, qlId);
      return hi
        ? `एक शेल्फ पर ${n} अलग-अलग किताबें रखनी हैं। ${a} किताबों का एक निश्चित समूह और उससे अलग ${b} किताबों का दूसरा समूह अपने-अपने सदस्यों के साथ रहे। कितने तरीके संभव हैं?`
        : `ਇੱਕ ਸ਼ੈਲਫ਼ ਉੱਤੇ ${n} ਵੱਖ-ਵੱਖ ਕਿਤਾਬਾਂ ਲਗਾਉਣੀਆਂ ਹਨ। ${a} ਕਿਤਾਬਾਂ ਦਾ ਇੱਕ ਖਾਸ ਸਮੂਹ ਅਤੇ ਉਸ ਤੋਂ ਵੱਖ ${b} ਕਿਤਾਬਾਂ ਦਾ ਦੂਜਾ ਸਮੂਹ ਆਪਣੇ-ਆਪਣੇ ਮੈਂਬਰਾਂ ਸਮੇਤ ਇਕੱਠਾ ਰਹੇ। ਕਿੰਨੇ ਤਰੀਕੇ ਸੰਭਵ ਹਨ?`;
    }
    case "PNC-QL-115": {
      const n = requiredToken(t, 0, qlId);
      const k = requiredToken(t, 1, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों में ${k} व्यक्तियों का एक निश्चित समूह साथ रहना चाहिए, जबकि दो अन्य निश्चित व्यक्ति एक-दूसरे के पास नहीं बैठ सकते। कितने रैखिक क्रम संभव हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਵਿੱਚ ${k} ਵਿਅਕਤੀਆਂ ਦਾ ਇੱਕ ਖਾਸ ਸਮੂਹ ਇਕੱਠਾ ਰਹੇ, ਪਰ ਦੋ ਹੋਰ ਖਾਸ ਵਿਅਕਤੀ ਨਾਲ-ਨਾਲ ਨਾ ਬੈਠਣ। ਕਿੰਨੇ ਸਿੱਧੇ ਕ੍ਰਮ ਸੰਭਵ ਹਨ?`;
    }
    case "PNC-QL-116": {
      const target = requiredToken(t, 0, qlId);
      const low = requiredToken(t, 1, qlId);
      const high = requiredToken(t, 2, qlId);
      return hi
        ? `$n$ अलग-अलग व्यक्तियों में दो निश्चित व्यक्तियों को साथ रखने पर ${target} रैखिक व्यवस्थाएँ बनती हैं। $n$ ज्ञात कीजिए, जहाँ $${low} \\le n \\le ${high}$.`
        : `$n$ ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਵਿੱਚ ਦੋ ਖਾਸ ਵਿਅਕਤੀਆਂ ਨੂੰ ਇਕੱਠਾ ਰੱਖਣ ਉੱਤੇ ${target} ਸਿੱਧੇ ਕ੍ਰਮ ਬਣਦੇ ਹਨ। $n$ ਪਤਾ ਕਰੋ, ਜਿੱਥੇ $${low} \\le n \\le ${high}$.`;
    }
    case "PNC-QL-117": {
      const target = requiredToken(t, 0, qlId);
      const low = requiredToken(t, 1, qlId);
      const high = requiredToken(t, 2, qlId);
      return hi
        ? `$n$ अलग-अलग व्यक्तियों में दो निश्चित व्यक्तियों को पास न बैठाने पर ${target} रैखिक व्यवस्थाएँ बनती हैं। $n$ ज्ञात कीजिए, जहाँ $${low} \\le n \\le ${high}$.`
        : `$n$ ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਵਿੱਚ ਦੋ ਖਾਸ ਵਿਅਕਤੀਆਂ ਨੂੰ ਨਾਲ-ਨਾਲ ਨਾ ਬਿਠਾਉਣ ਉੱਤੇ ${target} ਸਿੱਧੇ ਕ੍ਰਮ ਬਣਦੇ ਹਨ। $n$ ਪਤਾ ਕਰੋ, ਜਿੱਥੇ $${low} \\le n \\le ${high}$.`;
    }
    case "PNC-QL-118": {
      const n = requiredToken(t, 0, qlId);
      const target = requiredToken(t, 1, qlId);
      const low = requiredToken(t, 2, qlId);
      const high = requiredToken(t, 3, qlId);
      return hi
        ? `${n} अलग-अलग किताबें एक पंक्ति में रखी जाती हैं। यदि $k$ निश्चित किताबों को साथ रखने पर ${target} व्यवस्थाएँ बनती हैं, तो $k$ ज्ञात कीजिए, जहाँ $${low} \\le k \\le ${high}$.`
        : `${n} ਵੱਖ-ਵੱਖ ਕਿਤਾਬਾਂ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਲਗਾਈਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਜੇ $k$ ਖਾਸ ਕਿਤਾਬਾਂ ਨੂੰ ਇਕੱਠਾ ਰੱਖਣ ਉੱਤੇ ${target} ਤਰੀਕੇ ਬਣਦੇ ਹਨ, ਤਾਂ $k$ ਪਤਾ ਕਰੋ, ਜਿੱਥੇ $${low} \\le k \\le ${high}$.`;
    }
    case "PNC-QL-119": {
      const n = requiredToken(t, 0, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों में दो निश्चित जोड़े हैं। हर जोड़ा साथ रहे, लेकिन बने हुए दोनों जोड़ा-ब्लॉक एक-दूसरे के पास न हों। कितने रैखिक क्रम संभव हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਵਿੱਚ ਦੋ ਖਾਸ ਜੋੜੇ ਹਨ। ਹਰ ਜੋੜਾ ਇਕੱਠਾ ਰਹੇ, ਪਰ ਬਣੇ ਹੋਏ ਦੋਵੇਂ ਜੋੜਾ-ਬਲਾਕ ਨਾਲ-ਨਾਲ ਨਾ ਹੋਣ। ਕਿੰਨੇ ਸਿੱਧੇ ਕ੍ਰਮ ਸੰਭਵ ਹਨ?`;
    }
    case "PNC-QL-120": {
      const n = requiredToken(t, 0, qlId);
      return hi
        ? `${n} अलग-अलग कलाकारों में एक निश्चित जोड़ा और एक अलग निश्चित तिकड़ी है। दोनों अपने-अपने ब्लॉक में साथ रहें, लेकिन दोनों ब्लॉक एक-दूसरे के पास न हों। कितने रैखिक क्रम संभव हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਕਲਾਕਾਰਾਂ ਵਿੱਚ ਇੱਕ ਖਾਸ ਜੋੜਾ ਅਤੇ ਇੱਕ ਵੱਖਰੀ ਖਾਸ ਤਿੱਕੜੀ ਹੈ। ਦੋਵੇਂ ਆਪਣੇ-ਆਪਣੇ ਬਲਾਕ ਵਿੱਚ ਇਕੱਠੇ ਰਹਿਣ, ਪਰ ਦੋਵੇਂ ਬਲਾਕ ਨਾਲ-ਨਾਲ ਨਾ ਹੋਣ। ਕਿੰਨੇ ਸਿੱਧੇ ਕ੍ਰਮ ਸੰਭਵ ਹਨ?`;
    }
    case "PNC-QL-121": {
      const n = requiredToken(t, 0, qlId);
      const k = requiredToken(t, 1, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों की पंक्ति में ${k} निश्चित व्यक्तियों का समूह साथ रहना चाहिए। एक अन्य निश्चित व्यक्ति उस ब्लॉक के ठीक पहले या बाद में नहीं खड़ा हो सकता। कितने तरीके हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਦੀ ਕਤਾਰ ਵਿੱਚ ${k} ਖਾਸ ਵਿਅਕਤੀਆਂ ਦਾ ਸਮੂਹ ਇਕੱਠਾ ਰਹੇ। ਇੱਕ ਹੋਰ ਖਾਸ ਵਿਅਕਤੀ ਉਸ ਬਲਾਕ ਦੇ ਬਿਲਕੁਲ ਅੱਗੇ ਜਾਂ ਪਿੱਛੇ ਨਾ ਖੜ੍ਹੇ। ਕਿੰਨੇ ਤਰੀਕੇ ਹਨ?`;
    }
    case "PNC-QL-122": {
      const n = requiredToken(t, 0, qlId);
      return hi
        ? `${n} अलग-अलग फाइलों में एक निश्चित जोड़ा साथ रहना चाहिए, जबकि उससे अलग निश्चित तिकड़ी की तीनों फाइलें लगातार नहीं आनी चाहिए। कितने रैखिक क्रम संभव हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਫਾਈਲਾਂ ਵਿੱਚ ਇੱਕ ਖਾਸ ਜੋੜਾ ਇਕੱਠਾ ਰਹੇ, ਪਰ ਉਸ ਤੋਂ ਵੱਖ ਖਾਸ ਤਿੱਕੜੀ ਦੀਆਂ ਤਿੰਨੋਂ ਫਾਈਲਾਂ ਲਗਾਤਾਰ ਨਾ ਆਉਣ। ਕਿੰਨੇ ਸਿੱਧੇ ਕ੍ਰਮ ਸੰਭਵ ਹਨ?`;
    }
    case "PNC-QL-123": {
      const n = requiredToken(t, 0, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों में दो अलग निश्चित जोड़े हैं। कितने रैखिक क्रमों में कम-से-कम एक जोड़े के दोनों व्यक्ति साथ नहीं होंगे?`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਵਿੱਚ ਦੋ ਵੱਖਰੇ ਖਾਸ ਜੋੜੇ ਹਨ। ਕਿੰਨੇ ਸਿੱਧੇ ਕ੍ਰਮਾਂ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਜੋੜੇ ਦੇ ਦੋਵੇਂ ਵਿਅਕਤੀ ਇਕੱਠੇ ਨਹੀਂ ਹੋਣਗੇ?`;
    }
    case "PNC-QL-124": {
      const target = requiredToken(t, 0, qlId);
      const low = requiredToken(t, 1, qlId);
      const high = requiredToken(t, 2, qlId);
      return hi
        ? `$n$ अलग-अलग व्यक्तियों में दो निश्चित जोड़े अपने-अपने ब्लॉक में साथ रहें, पर दोनों ब्लॉक पास-पास न हों। यदि व्यवस्थाओं की संख्या ${target} है, तो $n$ ज्ञात कीजिए, जहाँ $${low} \\le n \\le ${high}$.`
        : `$n$ ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਵਿੱਚ ਦੋ ਖਾਸ ਜੋੜੇ ਆਪਣੇ-ਆਪਣੇ ਬਲਾਕ ਵਿੱਚ ਇਕੱਠੇ ਰਹਿਣ, ਪਰ ਦੋਵੇਂ ਬਲਾਕ ਨਾਲ-ਨਾਲ ਨਾ ਹੋਣ। ਜੇ ਤਰੀਕਿਆਂ ਦੀ ਗਿਣਤੀ ${target} ਹੈ, ਤਾਂ $n$ ਪਤਾ ਕਰੋ, ਜਿੱਥੇ $${low} \\le n \\le ${high}$.`;
    }
    default:
      throw new Error(`${qlId}: CP-007 stem localization is missing`);
  }
}

function translateNarrative(value: string, locale: PncStudentLocale): string {
  const hi = locale === "hi-IN";
  let match: RegExpMatchArray | null;
  if ((match = value.match(/^Treat the two particular people as one temporary unit because they must occupy consecutive places\.$/))) {
    return hi ? "दो निश्चित व्यक्तियों को एक अस्थायी ब्लॉक मानिए, क्योंकि उन्हें लगातार स्थानों पर बैठना है।" : "ਦੋ ਖਾਸ ਵਿਅਕਤੀਆਂ ਨੂੰ ਇੱਕ ਅਸਥਾਈ ਬਲਾਕ ਮੰਨੋ, ਕਿਉਂਕਿ ਉਹਨਾਂ ਨੇ ਲਗਾਤਾਰ ਥਾਵਾਂ ਉੱਤੇ ਬੈਠਣਾ ਹੈ।";
  }
  if ((match = value.match(/^The required (people|books) move together as one outer unit, but their different orders inside that block must still be counted\.$/))) {
    const books = match[1] === "books";
    if (hi) return books ? "जरूरी किताबें बाहर से एक इकाई की तरह चलती हैं, लेकिन ब्लॉक के भीतर उनके सभी अलग क्रम भी गिने जाते हैं।" : "जरूरी व्यक्ति बाहर से एक इकाई की तरह चलते हैं, लेकिन ब्लॉक के भीतर उनके सभी अलग क्रम भी गिने जाते हैं।";
    return books ? "ਲੋੜੀਂਦੀਆਂ ਕਿਤਾਬਾਂ ਬਾਹਰੋਂ ਇੱਕ ਇਕਾਈ ਵਾਂਗ ਚਲਦੀਆਂ ਹਨ, ਪਰ ਬਲਾਕ ਦੇ ਅੰਦਰ ਉਹਨਾਂ ਦੇ ਸਾਰੇ ਵੱਖਰੇ ਕ੍ਰਮ ਵੀ ਗਿਣੇ ਜਾਂਦੇ ਹਨ।" : "ਲੋੜੀਂਦੇ ਵਿਅਕਤੀ ਬਾਹਰੋਂ ਇੱਕ ਇਕਾਈ ਵਾਂਗ ਚਲਦੇ ਹਨ, ਪਰ ਬਲਾਕ ਦੇ ਅੰਦਰ ਉਹਨਾਂ ਦੇ ਸਾਰੇ ਵੱਖਰੇ ਕ੍ਰਮ ਵੀ ਗਿਣੇ ਜਾਂਦੇ ਹਨ।";
  }
  if ((match = value.match(/^This leaves (\d+) units to arrange, and the two people can switch places inside their unit\.$/))) {
    return hi ? `अब ${match[1]} इकाइयों को सजाना है और ब्लॉक के भीतर दोनों व्यक्ति अपनी जगह बदल सकते हैं।` : `ਹੁਣ ${match[1]} ਇਕਾਈਆਂ ਨੂੰ ਲਗਾਉਣਾ ਹੈ ਅਤੇ ਬਲਾਕ ਦੇ ਅੰਦਰ ਦੋਵੇਂ ਵਿਅਕਤੀ ਆਪਣੀ ਥਾਂ ਬਦਲ ਸਕਦੇ ਹਨ।`;
  }
  if ((match = value.match(/^The (\d+) particular books have to travel as one block on the shelf\.$/))) {
    return hi ? `${match[1]} निश्चित किताबों को शेल्फ पर एक ही ब्लॉक की तरह रखना होगा।` : `${match[1]} ਖਾਸ ਕਿਤਾਬਾਂ ਨੂੰ ਸ਼ੈਲਫ਼ ਉੱਤੇ ਇੱਕੋ ਬਲਾਕ ਵਾਂਗ ਰੱਖਣਾ ਹੋਵੇਗਾ।`;
  }
  if (value === "Arrange that block with the remaining books, then arrange the books inside the block in every possible order.") {
    return hi ? "उस ब्लॉक को बाकी किताबों के साथ सजाइए, फिर ब्लॉक के भीतर किताबों के सभी संभव क्रम गिनिए।" : "ਉਸ ਬਲਾਕ ਨੂੰ ਬਾਕੀ ਕਿਤਾਬਾਂ ਨਾਲ ਲਗਾਓ, ਫਿਰ ਬਲਾਕ ਦੇ ਅੰਦਰ ਕਿਤਾਬਾਂ ਦੇ ਸਾਰੇ ਸੰਭਵ ਕ੍ਰਮ ਗਿਣੋ।";
  }
  if (value === "Begin with every unrestricted arrangement and remove the arrangements in which the particular pair is together.") {
    return hi ? "पहले सभी बिना-शर्त व्यवस्थाएँ गिनिए, फिर वे व्यवस्थाएँ घटाइए जिनमें निश्चित जोड़ा साथ है।" : "ਪਹਿਲਾਂ ਸਾਰੇ ਬਿਨਾਂ-ਸ਼ਰਤ ਕ੍ਰਮ ਗਿਣੋ, ਫਿਰ ਉਹ ਕ੍ਰਮ ਘਟਾਓ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਖਾਸ ਜੋੜਾ ਇਕੱਠਾ ਹੈ।";
  }
  if ((match = value.match(/^Count all arrangements of the (people|files), then subtract the cases in which the restricted items form the forbidden block\.$/))) {
    const files = match[1] === "files";
    if (hi) return files ? "फाइलों के सभी क्रम गिनकर उन मामलों को घटाइए जिनमें प्रतिबंधित फाइलें निषिद्ध ब्लॉक बनाती हैं।" : "व्यक्तियों के सभी क्रम गिनकर उन मामलों को घटाइए जिनमें प्रतिबंधित व्यक्ति निषिद्ध ब्लॉक बनाते हैं।";
    return files ? "ਫਾਈਲਾਂ ਦੇ ਸਾਰੇ ਕ੍ਰਮ ਗਿਣ ਕੇ ਉਹ ਮਾਮਲੇ ਘਟਾਓ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਰੋਕੀਆਂ ਫਾਈਲਾਂ ਮਨਾਹੀ ਬਲਾਕ ਬਣਾਉਂਦੀਆਂ ਹਨ।" : "ਵਿਅਕਤੀਆਂ ਦੇ ਸਾਰੇ ਕ੍ਰਮ ਗਿਣ ਕੇ ਉਹ ਮਾਮਲੇ ਘਟਾਓ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਰੋਕੇ ਵਿਅਕਤੀ ਮਨਾਹੀ ਬਲਾਕ ਬਣਾਉਂਦੇ ਹਨ।";
  }
  if (value === "When together, the pair forms one unit and also has two internal orders.") {
    return hi ? "साथ होने पर जोड़ा एक इकाई बनता है और उसके भीतर दो क्रम संभव होते हैं।" : "ਇਕੱਠੇ ਹੋਣ ਉੱਤੇ ਜੋੜਾ ਇੱਕ ਇਕਾਈ ਬਣਦਾ ਹੈ ਅਤੇ ਉਸਦੇ ਅੰਦਰ ਦੋ ਕ੍ਰਮ ਸੰਭਵ ਹੁੰਦੇ ਹਨ।";
  }
  if ((match = value.match(/^The condition excludes only the arrangements in which all (\d+) particular files form one consecutive block\.$/))) {
    return hi ? `शर्त केवल उन व्यवस्थाओं को हटाती है जिनमें सभी ${match[1]} निश्चित फाइलें एक लगातार ब्लॉक बनाती हैं।` : `ਸ਼ਰਤ ਸਿਰਫ਼ ਉਹ ਕ੍ਰਮ ਹਟਾਉਂਦੀ ਹੈ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਸਾਰੀਆਂ ${match[1]} ਖਾਸ ਫਾਈਲਾਂ ਇੱਕ ਲਗਾਤਾਰ ਬਲਾਕ ਬਣਾਉਂਦੀਆਂ ਹਨ।`;
  }
  if (value === "Count every unrestricted arrangement, count the forbidden block arrangements, and subtract.") {
    return hi ? "सभी बिना-शर्त क्रम गिनिए, निषिद्ध ब्लॉक वाले क्रम गिनिए और दोनों का अंतर लीजिए।" : "ਸਾਰੇ ਬਿਨਾਂ-ਸ਼ਰਤ ਕ੍ਰਮ ਗਿਣੋ, ਮਨਾਹੀ ਬਲਾਕ ਵਾਲੇ ਕ੍ਰਮ ਗਿਣੋ ਅਤੇ ਦੋਵਾਂ ਦਾ ਅੰਤਰ ਲਓ।";
  }
  if (value === "Each particular pair is compressed into its own block; the two blocks are separate units.") {
    return hi ? "हर निश्चित जोड़े को उसका अपना ब्लॉक मानिए; दोनों ब्लॉक अलग इकाइयाँ हैं।" : "ਹਰ ਖਾਸ ਜੋੜੇ ਨੂੰ ਉਸਦਾ ਆਪਣਾ ਬਲਾਕ ਮੰਨੋ; ਦੋਵੇਂ ਬਲਾਕ ਵੱਖਰੀਆਂ ਇਕਾਈਆਂ ਹਨ।";
  }
  if ((match = value.match(/^Arrange the resulting (\d+) units, then allow both pairs to reverse internally\.$/))) {
    return hi ? `बनी हुई ${match[1]} इकाइयों को सजाइए, फिर दोनों जोड़ों के भीतर उलटे क्रम भी गिनिए।` : `ਬਣੀਆਂ ${match[1]} ਇਕਾਈਆਂ ਨੂੰ ਲਗਾਓ, ਫਿਰ ਦੋਵੇਂ ਜੋੜਿਆਂ ਦੇ ਅੰਦਰ ਉਲਟੇ ਕ੍ਰਮ ਵੀ ਗਿਣੋ।`;
  }
  if (value === "The particular pair and the particular trio become two independent blocks.") {
    return hi ? "निश्चित जोड़ा और निश्चित तिकड़ी दो स्वतंत्र ब्लॉक बनते हैं।" : "ਖਾਸ ਜੋੜਾ ਅਤੇ ਖਾਸ ਤਿੱਕੜੀ ਦੋ ਸੁਤੰਤਰ ਬਲਾਕ ਬਣਦੇ ਹਨ।";
  }
  if ((match = value.match(/^After arranging the (\d+) outside units, multiply by the internal orders of the pair and the trio\.$/))) {
    return hi ? `बाहर बनी ${match[1]} इकाइयों को सजाने के बाद जोड़े और तिकड़ी के भीतर के क्रमों से गुणा कीजिए।` : `ਬਾਹਰ ਬਣੀਆਂ ${match[1]} ਇਕਾਈਆਂ ਨੂੰ ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ਜੋੜੇ ਅਤੇ ਤਿੱਕੜੀ ਦੇ ਅੰਦਰਲੇ ਕ੍ਰਮਾਂ ਨਾਲ ਗੁਣਾ ਕਰੋ।`;
  }
  if (value === "Compress each of the three particular pairs into a separate block.") {
    return hi ? "तीनों निश्चित जोड़ों में से हर एक को अलग ब्लॉक बनाइए।" : "ਤਿੰਨਾਂ ਖਾਸ ਜੋੜਿਆਂ ਵਿੱਚੋਂ ਹਰ ਇੱਕ ਨੂੰ ਵੱਖਰਾ ਬਲਾਕ ਬਣਾਓ।";
  }
  if ((match = value.match(/^The (\d+) resulting units can be arranged freely, and every pair may swap its two members\.$/))) {
    return hi ? `बनी हुई ${match[1]} इकाइयों को स्वतंत्र रूप से सजाया जा सकता है और हर जोड़े के दोनों सदस्य आपस में जगह बदल सकते हैं।` : `ਬਣੀਆਂ ${match[1]} ਇਕਾਈਆਂ ਨੂੰ ਖੁੱਲ੍ਹੇ ਤੌਰ ਉੱਤੇ ਲਗਾਇਆ ਜਾ ਸਕਦਾ ਹੈ ਅਤੇ ਹਰ ਜੋੜੇ ਦੇ ਦੋਵੇਂ ਮੈਂਬਰ ਆਪਸ ਵਿੱਚ ਥਾਂ ਬਦਲ ਸਕਦੇ ਹਨ।`;
  }
  if (value === "The two required groups are treated as two blocks, while every remaining book stays as a single unit.") {
    return hi ? "दोनों जरूरी समूहों को दो ब्लॉक मानिए और बाकी हर किताब को एक अलग इकाई रहने दीजिए।" : "ਦੋਵੇਂ ਲੋੜੀਂਦੇ ਸਮੂਹਾਂ ਨੂੰ ਦੋ ਬਲਾਕ ਮੰਨੋ ਅਤੇ ਬਾਕੀ ਹਰ ਕਿਤਾਬ ਨੂੰ ਇੱਕ ਵੱਖਰੀ ਇਕਾਈ ਰਹਿਣ ਦਿਓ।";
  }
  if ((match = value.match(/^Arrange the (\d+) units and then multiply by the internal arrangements of both blocks\.$/))) {
    return hi ? `${match[1]} इकाइयों को सजाइए और फिर दोनों ब्लॉकों के भीतर के क्रमों से गुणा कीजिए।` : `${match[1]} ਇਕਾਈਆਂ ਨੂੰ ਲਗਾਓ ਅਤੇ ਫਿਰ ਦੋਵੇਂ ਬਲਾਕਾਂ ਦੇ ਅੰਦਰਲੇ ਕ੍ਰਮਾਂ ਨਾਲ ਗੁਣਾ ਕਰੋ।`;
  }
  if ((match = value.match(/^First compress the required group into one block; this creates (\d+) units\.$/))) {
    return hi ? `पहले जरूरी समूह को एक ब्लॉक बनाइए; इससे ${match[1]} इकाइयाँ बनती हैं।` : `ਪਹਿਲਾਂ ਲੋੜੀਂਦੇ ਸਮੂਹ ਨੂੰ ਇੱਕ ਬਲਾਕ ਬਣਾਓ; ਇਸ ਨਾਲ ${match[1]} ਇਕਾਈਆਂ ਬਣਦੀਆਂ ਹਨ।`;
  }
  if (value === "Among those units, remove the cases in which the other particular pair is adjacent, then restore the internal orders of the required block.") {
    return hi ? "इन इकाइयों में वे मामले घटाइए जिनमें दूसरा निश्चित जोड़ा पास-पास है, फिर जरूरी ब्लॉक के भीतर के क्रम जोड़िए।" : "ਇਨ੍ਹਾਂ ਇਕਾਈਆਂ ਵਿੱਚੋਂ ਉਹ ਮਾਮਲੇ ਘਟਾਓ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਦੂਜਾ ਖਾਸ ਜੋੜਾ ਨਾਲ-ਨਾਲ ਹੈ, ਫਿਰ ਲੋੜੀਂਦੇ ਬਲਾਕ ਦੇ ਅੰਦਰਲੇ ਕ੍ਰਮ ਜੋੜੋ।";
  }
  if (value === "For each allowed value of $n$, two particular people together are treated as one unit with two internal orders.") {
    return hi ? "$n$ के हर अनुमत मान पर दो निश्चित व्यक्तियों को एक इकाई मानिए और उनके भीतर के दो क्रम भी गिनिए।" : "$n$ ਦੇ ਹਰ ਮਨਜ਼ੂਰ ਮੁੱਲ ਉੱਤੇ ਦੋ ਖਾਸ ਵਿਅਕਤੀਆਂ ਨੂੰ ਇੱਕ ਇਕਾਈ ਮੰਨੋ ਅਤੇ ਉਹਨਾਂ ਦੇ ਅੰਦਰਲੇ ਦੋ ਕ੍ਰਮ ਵੀ ਗਿਣੋ।";
  }
  if (value === "For each allowed $n$, subtract the pair-together arrangements from all $n!$ arrangements.") {
    return hi ? "$n$ के हर अनुमत मान पर कुल $n!$ व्यवस्थाओं में से जोड़ा-साथ वाली व्यवस्थाएँ घटाइए।" : "$n$ ਦੇ ਹਰ ਮਨਜ਼ੂਰ ਮੁੱਲ ਉੱਤੇ ਕੁੱਲ $n!$ ਕ੍ਰਮਾਂ ਵਿੱਚੋਂ ਜੋੜਾ-ਇਕੱਠਾ ਵਾਲੇ ਕ੍ਰਮ ਘਟਾਓ।";
  }
  if (value === "For each allowed $k$, compress the particular books into one block and include all $k!$ internal orders.") {
    return hi ? "$k$ के हर अनुमत मान पर निश्चित किताबों को एक ब्लॉक बनाइए और भीतर के सभी $k!$ क्रम गिनिए।" : "$k$ ਦੇ ਹਰ ਮਨਜ਼ੂਰ ਮੁੱਲ ਉੱਤੇ ਖਾਸ ਕਿਤਾਬਾਂ ਨੂੰ ਇੱਕ ਬਲਾਕ ਬਣਾਓ ਅਤੇ ਅੰਦਰਲੇ ਸਾਰੇ $k!$ ਕ੍ਰਮ ਗਿਣੋ।";
  }
  if (value === "For each allowed value of $n$, form the two pair-blocks and exclude arrangements where those two blocks are adjacent.") {
    return hi ? "$n$ के हर अनुमत मान पर दोनों जोड़ा-ब्लॉक बनाइए और वे क्रम हटाइए जिनमें दोनों ब्लॉक पास-पास हैं।" : "$n$ ਦੇ ਹਰ ਮਨਜ਼ੂਰ ਮੁੱਲ ਉੱਤੇ ਦੋਵੇਂ ਜੋੜਾ-ਬਲਾਕ ਬਣਾਓ ਅਤੇ ਉਹ ਕ੍ਰਮ ਹਟਾਓ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਦੋਵੇਂ ਬਲਾਕ ਨਾਲ-ਨਾਲ ਹਨ।";
  }
  if (/^This (arrangement|grouping|shelf-arrangement) question asks for a missing parameter/.test(value)) {
    return hi ? "यहाँ व्यवस्थाओं की संख्या नहीं, बल्कि अज्ञात मान पूछा गया है। केवल दी गई सीमा के मान जाँचिए और वही मान चुनिए जो लक्ष्य संख्या देता है।" : "ਇੱਥੇ ਕ੍ਰਮਾਂ ਦੀ ਗਿਣਤੀ ਨਹੀਂ, ਸਗੋਂ ਅਣਜਾਣ ਮੁੱਲ ਪੁੱਛਿਆ ਗਿਆ ਹੈ। ਸਿਰਫ਼ ਦਿੱਤੀ ਹੱਦ ਦੇ ਮੁੱਲ ਜਾਂਚੋ ਅਤੇ ਉਹੀ ਮੁੱਲ ਚੁਣੋ ਜੋ ਟੀਚਾ ਗਿਣਤੀ ਦਿੰਦਾ ਹੈ।";
  }
  if (value === "First make each particular pair into its own two-person block.") {
    return hi ? "पहले हर निश्चित जोड़े को दो व्यक्तियों का अलग ब्लॉक बनाइए।" : "ਪਹਿਲਾਂ ਹਰ ਖਾਸ ਜੋੜੇ ਨੂੰ ਦੋ ਵਿਅਕਤੀਆਂ ਦਾ ਵੱਖਰਾ ਬਲਾਕ ਬਣਾਓ।";
  }
  if (value === "Arrange all resulting units, but remove the unit arrangements in which the two pair-blocks touch; each pair still has two internal orders.") {
    return hi ? "सभी बनी इकाइयों को सजाइए, लेकिन वे क्रम हटाइए जिनमें दोनों जोड़ा-ब्लॉक पास-पास हैं; हर जोड़े के भीतर दो क्रम फिर भी गिने जाएँगे।" : "ਸਾਰੀਆਂ ਬਣੀਆਂ ਇਕਾਈਆਂ ਨੂੰ ਲਗਾਓ, ਪਰ ਉਹ ਕ੍ਰਮ ਹਟਾਓ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਦੋਵੇਂ ਜੋੜਾ-ਬਲਾਕ ਨਾਲ-ਨਾਲ ਹਨ; ਹਰ ਜੋੜੇ ਦੇ ਅੰਦਰ ਦੋ ਕ੍ਰਮ ਫਿਰ ਵੀ ਗਿਣੇ ਜਾਣਗੇ।";
  }
  if (value === "Compress the particular pair and trio into two separate blocks.") {
    return hi ? "निश्चित जोड़े और तिकड़ी को दो अलग ब्लॉक बनाइए।" : "ਖਾਸ ਜੋੜੇ ਅਤੇ ਤਿੱਕੜੀ ਨੂੰ ਦੋ ਵੱਖਰੇ ਬਲਾਕ ਬਣਾਓ।";
  }
  if (value === "Count all unit arrangements and subtract those where the two formed blocks are adjacent, then restore the internal orders of both blocks.") {
    return hi ? "सभी इकाई-क्रम गिनिए, दोनों ब्लॉकों के पास-पास वाले क्रम घटाइए और फिर दोनों ब्लॉकों के भीतर के क्रम जोड़िए।" : "ਸਾਰੇ ਇਕਾਈ-ਕ੍ਰਮ ਗਿਣੋ, ਦੋਵੇਂ ਬਲਾਕਾਂ ਦੇ ਨਾਲ-ਨਾਲ ਵਾਲੇ ਕ੍ਰਮ ਘਟਾਓ ਅਤੇ ਫਿਰ ਦੋਵੇਂ ਬਲਾਕਾਂ ਦੇ ਅੰਦਰਲੇ ਕ੍ਰਮ ਜੋੜੋ।";
  }
  if (value === "Treat the particular group as one block, while the named outsider remains a separate unit.") {
    return hi ? "निश्चित समूह को एक ब्लॉक मानिए और बताए गए बाहरी व्यक्ति को अलग इकाई रखिए।" : "ਖਾਸ ਸਮੂਹ ਨੂੰ ਇੱਕ ਬਲਾਕ ਮੰਨੋ ਅਤੇ ਦੱਸੇ ਹੋਏ ਬਾਹਰਲੇ ਵਿਅਕਤੀ ਨੂੰ ਵੱਖਰੀ ਇਕਾਈ ਰੱਖੋ।";
  }
  if (value === "From all unit arrangements, remove the cases in which that outsider is immediately before or after the block, and then arrange the people inside the block.") {
    return hi ? "सभी इकाई-क्रमों में से वे मामले घटाइए जिनमें बाहरी व्यक्ति ब्लॉक के ठीक पहले या बाद में है, फिर ब्लॉक के भीतर व्यक्तियों को सजाइए।" : "ਸਾਰੇ ਇਕਾਈ-ਕ੍ਰਮਾਂ ਵਿੱਚੋਂ ਉਹ ਮਾਮਲੇ ਘਟਾਓ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਬਾਹਰਲਾ ਵਿਅਕਤੀ ਬਲਾਕ ਦੇ ਬਿਲਕੁਲ ਅੱਗੇ ਜਾਂ ਪਿੱਛੇ ਹੈ, ਫਿਰ ਬਲਾਕ ਦੇ ਅੰਦਰ ਵਿਅਕਤੀਆਂ ਨੂੰ ਲਗਾਓ।";
  }
  if (value === "Begin by keeping the required pair together as one unit.") {
    return hi ? "पहले जरूरी जोड़े को एक इकाई के रूप में साथ रखिए।" : "ਪਹਿਲਾਂ ਲੋੜੀਂਦੇ ਜੋੜੇ ਨੂੰ ਇੱਕ ਇਕਾਈ ਵਜੋਂ ਇਕੱਠਾ ਰੱਖੋ।";
  }
  if (value === "From those pair-together arrangements, subtract the cases in which the separate trio also forms a complete consecutive block.") {
    return hi ? "जोड़ा-साथ वाली व्यवस्थाओं में से वे मामले घटाइए जिनमें अलग तिकड़ी भी पूरा लगातार ब्लॉक बनाती है।" : "ਜੋੜਾ-ਇਕੱਠਾ ਵਾਲੇ ਕ੍ਰਮਾਂ ਵਿੱਚੋਂ ਉਹ ਮਾਮਲੇ ਘਟਾਓ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਵੱਖਰੀ ਤਿੱਕੜੀ ਵੀ ਪੂਰਾ ਲਗਾਤਾਰ ਬਲਾਕ ਬਣਾਉਂਦੀ ਹੈ।";
  }
  if (value === "The phrase at least one pair is not together excludes only the arrangements in which both particular pairs form blocks at the same time.") {
    return hi ? "‘कम-से-कम एक जोड़ा साथ नहीं’ का अर्थ है कि केवल वे क्रम हटाने हैं जिनमें दोनों निश्चित जोड़े एक ही समय ब्लॉक बनाते हैं।" : "‘ਘੱਟੋ-ਘੱਟ ਇੱਕ ਜੋੜਾ ਇਕੱਠਾ ਨਹੀਂ’ ਦਾ ਅਰਥ ਹੈ ਕਿ ਸਿਰਫ਼ ਉਹ ਕ੍ਰਮ ਹਟਾਉਣੇ ਹਨ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਦੋਵੇਂ ਖਾਸ ਜੋੜੇ ਇੱਕੋ ਵੇਲੇ ਬਲਾਕ ਬਣਾਉਂਦੇ ਹਨ।";
  }
  if (value === "Count every unrestricted row and subtract the simultaneous two-block arrangements, including the internal reversals of both pairs.") {
    return hi ? "हर बिना-शर्त पंक्ति गिनिए और दोनों ब्लॉकों के एक साथ बनने वाले क्रम घटाइए; दोनों जोड़ों के भीतर उलटे क्रम भी शामिल करें।" : "ਹਰ ਬਿਨਾਂ-ਸ਼ਰਤ ਕਤਾਰ ਗਿਣੋ ਅਤੇ ਦੋਵੇਂ ਬਲਾਕਾਂ ਦੇ ਇੱਕੋ ਵੇਲੇ ਬਣਨ ਵਾਲੇ ਕ੍ਰਮ ਘਟਾਓ; ਦੋਵੇਂ ਜੋੜਿਆਂ ਦੇ ਅੰਦਰ ਉਲਟੇ ਕ੍ਰਮ ਵੀ ਸ਼ਾਮਲ ਕਰੋ।";
  }
  throw new Error(`PNC CP-007 narrative localization is missing: ${value}`);
}

function localizedStepLabel(label: string, locale: PncStudentLocale): string {
  const hi = locale === "hi-IN";
  const labels: Record<string, [string, string]> = {
    "Interpret the condition": ["शर्त को समझें", "ਸ਼ਰਤ ਨੂੰ ਸਮਝੋ"],
    "Count the next stage": ["अगला चरण गिनें", "ਅਗਲਾ ਕਦਮ ਗਿਣੋ"],
    "Expand the arrangement factor": ["व्यवस्था गुणक खोलें", "ਕ੍ਰਮ ਵਾਲਾ ਗੁਣਕ ਖੋਲ੍ਹੋ"],
    "Combine the evaluated stages": ["गिने हुए चरण जोड़ें", "ਗਿਣੇ ਹੋਏ ਕਦਮ ਜੋੜੋ"],
    "Verify the successful candidate": ["सही मान की जाँच करें", "ਸਹੀ ਮੁੱਲ ਦੀ ਜਾਂਚ ਕਰੋ"],
    "Final answer": ["अंतिम उत्तर", "ਅੰਤਿਮ ਉੱਤਰ"],
  };
  const localized = labels[label];
  if (!localized) throw new Error(`PNC CP-007 step label localization is missing: ${label}`);
  return localized[hi ? 0 : 1];
}

function localizedStepLine(
  line: string,
  locale: PncStudentLocale,
  answerLabel: string,
): string {
  const match = line.match(/^(\d+)\. \*\*([^*]+):\*\*\s*(.*)$/);
  if (!match) throw new Error(`PNC CP-007 step line has an unsupported shape: ${line}`);
  const number = match[1]!;
  const label = match[2]!;
  const body = match[3]!;
  let localizedBody = body;
  if (label === "Interpret the condition" || label === "Count the next stage") {
    localizedBody = translateNarrative(body, locale);
  } else if (label === "Final answer") {
    localizedBody = answerLabel;
  }
  return `${number}. **${localizedStepLabel(label, locale)}:** ${localizedBody}`;
}

function extractInlineMath(value: string): string {
  const matches = [...value.matchAll(/\$([^$\n]+)\$/g)];
  const math = matches.at(-1)?.[1];
  if (!math) throw new Error(`PNC CP-007 shortcut has no inline formula: ${value}`);
  return math;
}

function localizedShortcut(
  qlId: string,
  englishLine: string,
  locale: PncStudentLocale,
): string {
  const formula = extractInlineMath(englishLine);
  const hi = locale === "hi-IN";
  if (["PNC-QL-107", "PNC-QL-108", "PNC-QL-111", "PNC-QL-112", "PNC-QL-113", "PNC-QL-114"].includes(qlId)) {
    return hi
      ? `हर जरूरी समूह को एक ब्लॉक मानिए, बाहर बनी इकाइयों को सजाइए और हर ब्लॉक के भीतर के क्रमों से गुणा कीजिए: $${formula}$.`
      : `ਹਰ ਲੋੜੀਂਦੇ ਸਮੂਹ ਨੂੰ ਇੱਕ ਬਲਾਕ ਮੰਨੋ, ਬਾਹਰ ਬਣੀਆਂ ਇਕਾਈਆਂ ਨੂੰ ਲਗਾਓ ਅਤੇ ਹਰ ਬਲਾਕ ਦੇ ਅੰਦਰਲੇ ਕ੍ਰਮਾਂ ਨਾਲ ਗੁਣਾ ਕਰੋ: $${formula}$.`;
  }
  if (["PNC-QL-109", "PNC-QL-110"].includes(qlId)) {
    return hi
      ? `कुल बिना-शर्त व्यवस्थाओं में से निषिद्ध ब्लॉक वाली व्यवस्थाएँ घटाइए: $${formula}$.`
      : `ਕੁੱਲ ਬਿਨਾਂ-ਸ਼ਰਤ ਕ੍ਰਮਾਂ ਵਿੱਚੋਂ ਮਨਾਹੀ ਬਲਾਕ ਵਾਲੇ ਕ੍ਰਮ ਘਟਾਓ: $${formula}$.`;
  }
  if (qlId === "PNC-QL-115") {
    return hi
      ? `पहले अनिवार्य समूह को ब्लॉक बनाइए, फिर दूसरे जोड़े के पास-पास होने वाले क्रम घटाइए: $${formula}$.`
      : `ਪਹਿਲਾਂ ਲਾਜ਼ਮੀ ਸਮੂਹ ਨੂੰ ਬਲਾਕ ਬਣਾਓ, ਫਿਰ ਦੂਜੇ ਜੋੜੇ ਦੇ ਨਾਲ-ਨਾਲ ਹੋਣ ਵਾਲੇ ਕ੍ਰਮ ਘਟਾਓ: $${formula}$.`;
  }
  if (["PNC-QL-116", "PNC-QL-117", "PNC-QL-118", "PNC-QL-124"].includes(qlId)) {
    return hi
      ? `सूत्र को उल्टा हल करने की जगह दी गई सीमा के मान एक-एक करके रखिए; जो मान लक्ष्य संख्या देता है वही उत्तर है: $${formula}$.`
      : `ਸੂਤਰ ਨੂੰ ਉਲਟ ਹੱਲ ਕਰਨ ਦੀ ਥਾਂ ਦਿੱਤੀ ਹੱਦ ਦੇ ਮੁੱਲ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਪਾਓ; ਜੋ ਮੁੱਲ ਟੀਚਾ ਗਿਣਤੀ ਦਿੰਦਾ ਹੈ ਉਹੀ ਉੱਤਰ ਹੈ: $${formula}$.`;
  }
  if (["PNC-QL-119", "PNC-QL-120"].includes(qlId)) {
    return hi
      ? `दोनों ब्लॉक बनाकर सभी बाहरी क्रम गिनिए, फिर दोनों ब्लॉकों के पास-पास वाले क्रम घटाइए और भीतर के क्रम जोड़िए: $${formula}$.`
      : `ਦੋਵੇਂ ਬਲਾਕ ਬਣਾਕੇ ਸਾਰੇ ਬਾਹਰਲੇ ਕ੍ਰਮ ਗਿਣੋ, ਫਿਰ ਦੋਵੇਂ ਬਲਾਕਾਂ ਦੇ ਨਾਲ-ਨਾਲ ਵਾਲੇ ਕ੍ਰਮ ਘਟਾਓ ਅਤੇ ਅੰਦਰਲੇ ਕ੍ਰਮ ਜੋੜੋ: $${formula}$.`;
  }
  if (qlId === "PNC-QL-121") {
    return hi
      ? `समूह को ब्लॉक बनाइए और बाहरी व्यक्ति के ब्लॉक के ठीक पहले या बाद में आने वाले दो स्थान घटाइए: $${formula}$.`
      : `ਸਮੂਹ ਨੂੰ ਬਲਾਕ ਬਣਾਓ ਅਤੇ ਬਾਹਰਲੇ ਵਿਅਕਤੀ ਦੇ ਬਲਾਕ ਦੇ ਬਿਲਕੁਲ ਅੱਗੇ ਜਾਂ ਪਿੱਛੇ ਆਉਣ ਵਾਲੀਆਂ ਦੋ ਥਾਵਾਂ ਘਟਾਓ: $${formula}$.`;
  }
  if (qlId === "PNC-QL-122") {
    return hi
      ? `पहले अनिवार्य जोड़े को ब्लॉक बनाकर गिनिए, फिर उस गणना में से अलग तिकड़ी के लगातार ब्लॉक वाले क्रम घटाइए: $${formula}$.`
      : `ਪਹਿਲਾਂ ਲਾਜ਼ਮੀ ਜੋੜੇ ਨੂੰ ਬਲਾਕ ਬਣਾਕੇ ਗਿਣੋ, ਫਿਰ ਉਸ ਗਿਣਤੀ ਵਿੱਚੋਂ ਵੱਖਰੀ ਤਿੱਕੜੀ ਦੇ ਲਗਾਤਾਰ ਬਲਾਕ ਵਾਲੇ ਕ੍ਰਮ ਘਟਾਓ: $${formula}$.`;
  }
  if (qlId === "PNC-QL-123") {
    return hi
      ? `‘कम-से-कम एक जोड़ा अलग’ के लिए कुल क्रमों में से केवल दोनों जोड़ों के एक साथ ब्लॉक बनने वाले क्रम घटाइए: $${formula}$.`
      : `‘ਘੱਟੋ-ਘੱਟ ਇੱਕ ਜੋੜਾ ਵੱਖ’ ਲਈ ਕੁੱਲ ਕ੍ਰਮਾਂ ਵਿੱਚੋਂ ਸਿਰਫ਼ ਦੋਵੇਂ ਜੋੜਿਆਂ ਦੇ ਇੱਕੋ ਵੇਲੇ ਬਲਾਕ ਬਣਨ ਵਾਲੇ ਕ੍ਰਮ ਘਟਾਓ: $${formula}$.`;
  }
  throw new Error(`${qlId}: CP-007 shortcut localization is missing`);
}

function localizedTrapReason(reason: string, locale: PncStudentLocale): string {
  const hi = locale === "hi-IN";
  if (/use the unrestricted factorial and ignore the condition/.test(reason)) {
    return hi ? "यह तब होता है जब आप बिना-शर्त फैक्टोरियल लगा देते हैं और दी गई शर्त को नज़रअंदाज़ कर देते हैं।" : "ਇਹ ਉਸ ਵੇਲੇ ਹੁੰਦਾ ਹੈ ਜਦੋਂ ਤੁਸੀਂ ਬਿਨਾਂ-ਸ਼ਰਤ ਫੈਕਟੋਰੀਅਲ ਲਗਾ ਦਿੰਦੇ ਹੋ ਅਤੇ ਦਿੱਤੀ ਸ਼ਰਤ ਨੂੰ ਨਜ਼ਰਅੰਦਾਜ਼ ਕਰ ਦਿੰਦੇ ਹੋ।";
  }
  if (/use an incomplete block or complement count/.test(reason)) {
    return hi ? "यह मान तब आता है जब बाहरी इकाइयों की व्यवस्था, ब्लॉक के भीतर का क्रम या जरूरी घटाव—इनमें से कोई चरण छूट जाता है।" : "ਇਹ ਮੁੱਲ ਉਸ ਵੇਲੇ ਆਉਂਦਾ ਹੈ ਜਦੋਂ ਬਾਹਰਲੀਆਂ ਇਕਾਈਆਂ ਦੀ ਵਿਵਸਥਾ, ਬਲਾਕ ਦੇ ਅੰਦਰਲਾ ਕ੍ਰਮ ਜਾਂ ਲੋੜੀਂਦਾ ਘਟਾਅ—ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਕਦਮ ਛੁੱਟ ਜਾਂਦਾ ਹੈ।";
  }
  const countOnly = reason.match(/count only (\$[^$]+\$) and stop/);
  if (countOnly) {
    return hi ? `यह तब होता है जब आप केवल ${countOnly[1]} गिनकर रुक जाते हैं और बाकी जरूरी गुणक या शर्त नहीं लगाते।` : `ਇਹ ਉਸ ਵੇਲੇ ਹੁੰਦਾ ਹੈ ਜਦੋਂ ਤੁਸੀਂ ਸਿਰਫ਼ ${countOnly[1]} ਗਿਣ ਕੇ ਰੁਕ ਜਾਂਦੇ ਹੋ ਅਤੇ ਬਾਕੀ ਲੋੜੀਂਦਾ ਗੁਣਕ ਜਾਂ ਸ਼ਰਤ ਨਹੀਂ ਲਗਾਉਂਦੇ।`;
  }
  if (/count only the forbidden together cases/.test(reason)) {
    return hi ? "यह केवल निषिद्ध ‘साथ’ वाले मामलों की गिनती है; प्रश्न स्वीकार्य व्यवस्थाएँ पूछता है।" : "ਇਹ ਸਿਰਫ਼ ਮਨਾਹੀ ‘ਇਕੱਠੇ’ ਵਾਲੇ ਮਾਮਲਿਆਂ ਦੀ ਗਿਣਤੀ ਹੈ; ਸਵਾਲ ਮਨਜ਼ੂਰ ਕ੍ਰਮ ਪੁੱਛਦਾ ਹੈ।";
  }
  if (/miss or duplicate the two internal orders/.test(reason)) {
    return hi ? "यह तब होता है जब किसी जोड़े के भीतर के दो क्रमों को या तो छोड़ दिया जाता है या दो बार गिन लिया जाता है।" : "ਇਹ ਉਸ ਵੇਲੇ ਹੁੰਦਾ ਹੈ ਜਦੋਂ ਕਿਸੇ ਜੋੜੇ ਦੇ ਅੰਦਰਲੇ ਦੋ ਕ੍ਰਮ ਜਾਂ ਤਾਂ ਛੱਡ ਦਿੱਤੇ ਜਾਂਦੇ ਹਨ ਜਾਂ ਦੋ ਵਾਰ ਗਿਣ ਲਏ ਜਾਂਦੇ ਹਨ।";
  }
  if (/use the wrong admissible positions, gaps or relative-order factor/.test(reason)) {
    return hi ? "यह मान ब्लॉक के लिए उपलब्ध सही स्थानों या दूरी की शर्त को गलत गिनने से आता है।" : "ਇਹ ਮੁੱਲ ਬਲਾਕ ਲਈ ਉਪਲਬਧ ਸਹੀ ਥਾਵਾਂ ਜਾਂ ਦੂਰੀ ਦੀ ਸ਼ਰਤ ਨੂੰ ਗਲਤ ਗਿਣਣ ਨਾਲ ਆਉਂਦਾ ਹੈ।";
  }
  if (/do not reproduce the stated target count/.test(reason)) {
    return hi ? "इस मान को सूत्र में रखने पर दी गई लक्ष्य संख्या नहीं मिलती, इसलिए यह स्वीकार्य उत्तर नहीं है।" : "ਇਸ ਮੁੱਲ ਨੂੰ ਸੂਤਰ ਵਿੱਚ ਪਾਉਣ ਉੱਤੇ ਦਿੱਤੀ ਟੀਚਾ ਗਿਣਤੀ ਨਹੀਂ ਮਿਲਦੀ, ਇਸ ਲਈ ਇਹ ਮਨਜ਼ੂਰ ਉੱਤਰ ਨਹੀਂ ਹੈ।";
  }
  throw new Error(`PNC CP-007 trap reason localization is missing: ${reason}`);
}

function localizedTrapLine(
  line: string,
  localizedOptions: string[],
  locale: PncStudentLocale,
): string {
  const match = line.match(/^Don't fall for Option ([A-D]) \([^)]*\)\.\s*(.*)$/);
  if (!match) throw new Error(`PNC CP-007 trap line has an unsupported shape: ${line}`);
  const letter = match[1]!;
  const index = letter.charCodeAt(0) - 65;
  const option = localizedOptions[index];
  if (!option) throw new Error(`PNC CP-007 trap option ${letter} is unavailable`);
  const reason = localizedTrapReason(match[2]!, locale);
  return locale === "hi-IN"
    ? `विकल्प ${letter} (${option}) से सावधान रहें। ${reason}`
    : `ਚੋਣ ${letter} (${option}) ਤੋਂ ਸਾਵਧਾਨ ਰਹੋ। ${reason}`;
}

function localizedCoreHeading(qlId: string, locale: PncStudentLocale): string {
  const title = CORE_TITLES[qlId]?.[locale];
  if (!title) throw new Error(`${qlId}: CP-007 core title localization is missing`);
  return locale === "hi-IN" ? `📌 मूल अवधारणा — ${title}` : `📌 ਮੁੱਖ ਵਿਚਾਰ — ${title}`;
}

export function buildPnc002Cp007LocalizedPresentation(
  source: PncStudentSourcePackage,
  locale: PncStudentLocale,
): PncLocalizedStudentPresentation {
  if (source.canonicalProblemId !== "PNC-CP-007") {
    throw new Error(`${source.questionLanguageId}: CP-007 localizer received ${source.canonicalProblemId}`);
  }
  const english = buildPnc002ProductionTeacherStudentPresentation(source);
  const localizedOptions = source.options.map((option) => formatLocalizedOption(option, english.optionUnit, locale));
  const answerLabel = localizedOptions[source.correctIndex];
  if (!answerLabel) throw new Error(`${source.questionLanguageId}: localized answer label is missing`);
  const numericAnswer = parsePositiveInteger(source.answer);
  const optionUnit = localizedUnitLabel(english.optionUnit, numericAnswer, locale);

  const explanationSections: PncStudentExplanationSection[] = english.explanationSections.map((section) => {
    if (section.kind === "coreConcept") {
      return {
        ...section,
        heading: localizedCoreHeading(source.questionLanguageId, locale),
        lines: section.lines.map((line) => translateNarrative(line, locale)),
      };
    }
    if (section.kind === "stepByStep") {
      return {
        ...section,
        heading: localizedSectionHeading("stepByStep", locale),
        lines: section.lines.map((line) => localizedStepLine(line, locale, answerLabel)),
      };
    }
    if (section.kind === "examSpeedShortcut") {
      return {
        ...section,
        heading: localizedSectionHeading("examSpeedShortcut", locale),
        lines: section.lines.map((line) => localizedShortcut(source.questionLanguageId, line, locale)),
      };
    }
    return {
      ...section,
      heading: localizedSectionHeading("commonTrapWarning", locale),
      lines: section.lines.map((line) => localizedTrapLine(line, localizedOptions, locale)),
    };
  });

  return {
    ...english,
    locale,
    sourceLocale: "en-GB",
    stem: localizedStem(english.stem, source.questionLanguageId, locale),
    optionUnit,
    displayOptions: localizedOptions,
    answerLabel,
    explanationSections,
    editorialStatus: "PENDING",
    publiclyPublishable: false,
  };
}
