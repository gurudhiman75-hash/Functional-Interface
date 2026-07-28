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

export const PNC_002_CP008_LOCALIZATION_CANDIDATE = Object.freeze({
  releaseId: "PNC-002-CP008-HI-PA-v1-CANDIDATE",
  packageId: "PNC-002",
  canonicalProblemId: "PNC-CP-008",
  languages: ["hi-IN", "pa-IN"] as const,
  qlRange: ["PNC-QL-125", "PNC-QL-147"] as const,
  qlCount: 23,
  status: "MANUAL_REVIEW",
  editorialStatus: "PENDING",
  publiclyPublishable: false,
  createdAt: "2026-07-28",
});

const CORE_TITLES: Record<string, Record<PncStudentLocale, string>> = {
  "PNC-QL-125": { "hi-IN": "एक निश्चित स्थान भरना", "pa-IN": "ਇੱਕ ਪੱਕੀ ਥਾਂ ਭਰਨਾ" },
  "PNC-QL-126": { "hi-IN": "दो सिरों में से एक चुनना", "pa-IN": "ਦੋ ਸਿਰਿਆਂ ਵਿੱਚੋਂ ਇੱਕ ਚੁਣਨਾ" },
  "PNC-QL-127": { "hi-IN": "दो निश्चित व्यक्तियों को दोनों सिरों पर रखना", "pa-IN": "ਦੋ ਖਾਸ ਵਿਅਕਤੀਆਂ ਨੂੰ ਦੋਵੇਂ ਸਿਰਿਆਂ ਉੱਤੇ ਰੱਖਣਾ" },
  "PNC-QL-128": { "hi-IN": "सिरों को छोड़कर स्थान चुनना", "pa-IN": "ਸਿਰੇ ਛੱਡ ਕੇ ਥਾਂ ਚੁਣਨਾ" },
  "PNC-QL-129": { "hi-IN": "A का B से पहले आना", "pa-IN": "A ਦਾ B ਤੋਂ ਪਹਿਲਾਂ ਆਉਣਾ" },
  "PNC-QL-130": { "hi-IN": "तीन फाइलों का निश्चित आपसी क्रम", "pa-IN": "ਤਿੰਨ ਫਾਈਲਾਂ ਦਾ ਪੱਕਾ ਆਪਸੀ ਕ੍ਰਮ" },
  "PNC-QL-131": { "hi-IN": "चार कार्यों का निश्चित आपसी क्रम", "pa-IN": "ਚਾਰ ਕੰਮਾਂ ਦਾ ਪੱਕਾ ਆਪਸੀ ਕ੍ਰਮ" },
  "PNC-QL-132": { "hi-IN": "दो स्वतंत्र पहले-बाद की शर्तें", "pa-IN": "ਦੋ ਸੁਤੰਤਰ ਪਹਿਲਾਂ-ਬਾਅਦ ਦੀਆਂ ਸ਼ਰਤਾਂ" },
  "PNC-QL-133": { "hi-IN": "बराबर समूहों का बारी-बारी क्रम", "pa-IN": "ਬਰਾਬਰ ਗਰੁੱਪਾਂ ਦਾ ਵਾਰੀ-ਵਾਰੀ ਕ੍ਰਮ" },
  "PNC-QL-134": { "hi-IN": "एक अतिरिक्त सदस्य के साथ बारी-बारी क्रम", "pa-IN": "ਇੱਕ ਵੱਧ ਮੈਂਬਰ ਨਾਲ ਵਾਰੀ-ਵਾਰੀ ਕ੍ਰਮ" },
  "PNC-QL-135": { "hi-IN": "पहला रंग निश्चित रखते हुए बारी-बारी क्रम", "pa-IN": "ਪਹਿਲਾ ਰੰਗ ਪੱਕਾ ਰੱਖ ਕੇ ਵਾਰੀ-ਵਾਰੀ ਕ੍ਰਮ" },
  "PNC-QL-136": { "hi-IN": "खाली स्थानों में महिलाओं को रखना", "pa-IN": "ਖਾਲੀ ਥਾਵਾਂ ਵਿੱਚ ਔਰਤਾਂ ਨੂੰ ਰੱਖਣਾ" },
  "PNC-QL-137": { "hi-IN": "निश्चित व्यक्तियों को अलग-अलग खाली स्थानों में रखना", "pa-IN": "ਖਾਸ ਵਿਅਕਤੀਆਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਖਾਲੀ ਥਾਵਾਂ ਵਿੱਚ ਰੱਖਣਾ" },
  "PNC-QL-138": { "hi-IN": "दो व्यक्तियों के स्थानों का ठीक अंतर", "pa-IN": "ਦੋ ਵਿਅਕਤੀਆਂ ਦੀਆਂ ਥਾਵਾਂ ਦਾ ਠੀਕ ਫਰਕ" },
  "PNC-QL-139": { "hi-IN": "दो व्यक्तियों के बीच कम-से-कम दूरी", "pa-IN": "ਦੋ ਵਿਅਕਤੀਆਂ ਵਿਚਕਾਰ ਘੱਟੋ-ਘੱਟ ਫਾਸਲਾ" },
  "PNC-QL-140": { "hi-IN": "निश्चित किताबों के लिए सम स्थान", "pa-IN": "ਖਾਸ ਕਿਤਾਬਾਂ ਲਈ ਜੋੜ ਥਾਵਾਂ" },
  "PNC-QL-141": { "hi-IN": "विषम स्थानों पर ठीक निर्धारित संख्या", "pa-IN": "ਟਾਂਕ ਥਾਵਾਂ ਉੱਤੇ ਠੀਕ ਨਿਰਧਾਰਤ ਗਿਣਤੀ" },
  "PNC-QL-142": { "hi-IN": "सीमित मान जाँचकर दूरी ज्ञात करना", "pa-IN": "ਸੀਮਿਤ ਮੁੱਲ ਜਾਂਚ ਕੇ ਫਾਸਲਾ ਪਤਾ ਕਰਨਾ" },
  "PNC-QL-143": { "hi-IN": "तीन फाइलों के अलग-अलग निश्चित स्थान", "pa-IN": "ਤਿੰਨ ਫਾਈਲਾਂ ਦੀਆਂ ਵੱਖ-ਵੱਖ ਪੱਕੀਆਂ ਥਾਵਾਂ" },
  "PNC-QL-144": { "hi-IN": "तीन किताबों को दिए गए स्थानों में रखना", "pa-IN": "ਤਿੰਨ ਕਿਤਾਬਾਂ ਨੂੰ ਦਿੱਤੀਆਂ ਥਾਵਾਂ ਵਿੱਚ ਰੱਖਣਾ" },
  "PNC-QL-145": { "hi-IN": "दो व्यक्तियों के बीच अधिकतम दूरी", "pa-IN": "ਦੋ ਵਿਅਕਤੀਆਂ ਵਿਚਕਾਰ ਵੱਧ ਤੋਂ ਵੱਧ ਫਾਸਲਾ" },
  "PNC-QL-146": { "hi-IN": "A के बाद निश्चित दूरी पर B", "pa-IN": "A ਤੋਂ ਬਾਅਦ ਪੱਕੇ ਫਾਸਲੇ ਉੱਤੇ B" },
  "PNC-QL-147": { "hi-IN": "विषम स्थानों पर कम-से-कम निर्धारित संख्या", "pa-IN": "ਟਾਂਕ ਥਾਵਾਂ ਉੱਤੇ ਘੱਟੋ-ਘੱਟ ਨਿਰਧਾਰਤ ਗਿਣਤੀ" },
};

function numericTokens(value: string): string[] {
  return [...value.matchAll(/\d[\d,]*/g)].map((match) => match[0]!);
}

function mathTokens(value: string): string[] {
  return [...value.matchAll(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$/g)].map((match) => match[0]!);
}

function requiredToken(tokens: string[], index: number, qlId: string): string {
  const value = tokens[index];
  if (value === undefined) throw new Error(`${qlId}: missing numeric token ${index}`);
  return value;
}

function requiredMathToken(tokens: string[], index: number, qlId: string): string {
  const value = tokens[index];
  if (value === undefined) throw new Error(`${qlId}: missing math token ${index}`);
  return value;
}

function localizedStem(english: string, qlId: string, locale: PncStudentLocale): string {
  const t = numericTokens(english);
  const m = mathTokens(english);
  const hi = locale === "hi-IN";
  switch (qlId) {
    case "PNC-QL-125": {
      const n = requiredToken(t, 0, qlId);
      const p = requiredToken(t, 1, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों को सीधी पंक्ति में खड़ा करना है। यदि एक निश्चित व्यक्ति को स्थान ${p} पर ही खड़ा होना हो, तो कुल कितने तरीके हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਨੂੰ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹਾ ਕਰਨਾ ਹੈ। ਜੇ ਇੱਕ ਖਾਸ ਵਿਅਕਤੀ ਨੇ ਥਾਂ ${p} ਉੱਤੇ ਹੀ ਖੜ੍ਹਨਾ ਹੋਵੇ, ਤਾਂ ਕੁੱਲ ਕਿੰਨੇ ਤਰੀਕੇ ਹਨ?`;
    }
    case "PNC-QL-126": {
      const n = requiredToken(t, 0, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों को सीधी पंक्ति में खड़ा करना है। यदि एक निश्चित व्यक्ति को किसी एक सिरे पर खड़ा होना हो, तो कितने तरीके संभव हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਨੂੰ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹਾ ਕਰਨਾ ਹੈ। ਜੇ ਇੱਕ ਖਾਸ ਵਿਅਕਤੀ ਨੇ ਕਿਸੇ ਇੱਕ ਸਿਰੇ ਉੱਤੇ ਖੜ੍ਹਨਾ ਹੋਵੇ, ਤਾਂ ਕਿੰਨੇ ਤਰੀਕੇ ਸੰਭਵ ਹਨ?`;
    }
    case "PNC-QL-127": {
      const n = requiredToken(t, 0, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों को सीधी पंक्ति में खड़ा करना है। यदि दो निश्चित व्यक्तियों को दोनों सिरों पर, किसी भी क्रम में, खड़ा होना हो, तो कितने तरीके हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਨੂੰ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹਾ ਕਰਨਾ ਹੈ। ਜੇ ਦੋ ਖਾਸ ਵਿਅਕਤੀਆਂ ਨੇ ਦੋਵੇਂ ਸਿਰਿਆਂ ਉੱਤੇ, ਕਿਸੇ ਵੀ ਕ੍ਰਮ ਵਿੱਚ, ਖੜ੍ਹਨਾ ਹੋਵੇ, ਤਾਂ ਕਿੰਨੇ ਤਰੀਕੇ ਹਨ?`;
    }
    case "PNC-QL-128": {
      const n = requiredToken(t, 0, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों को सीधी पंक्ति में खड़ा करना है। यदि एक निश्चित व्यक्ति किसी भी सिरे पर खड़ा नहीं हो सकता, तो कितने तरीके संभव हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਨੂੰ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹਾ ਕਰਨਾ ਹੈ। ਜੇ ਇੱਕ ਖਾਸ ਵਿਅਕਤੀ ਕਿਸੇ ਵੀ ਸਿਰੇ ਉੱਤੇ ਨਹੀਂ ਖੜ੍ਹ ਸਕਦਾ, ਤਾਂ ਕਿੰਨੇ ਤਰੀਕੇ ਸੰਭਵ ਹਨ?`;
    }
    case "PNC-QL-129": {
      const n = requiredToken(t, 0, qlId);
      return hi
        ? `${n} अलग-अलग किताबों को एक पंक्ति में लगाना है। कितनी व्यवस्थाओं में किताब A, किताब B से पहले आएगी?`
        : `${n} ਵੱਖ-ਵੱਖ ਕਿਤਾਬਾਂ ਨੂੰ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਲਗਾਉਣਾ ਹੈ। ਕਿੰਨੇ ਕ੍ਰਮਾਂ ਵਿੱਚ ਕਿਤਾਬ A, ਕਿਤਾਬ B ਤੋਂ ਪਹਿਲਾਂ ਆਵੇਗੀ?`;
    }
    case "PNC-QL-130": {
      const n = requiredToken(t, 0, qlId);
      return hi
        ? `${n} अलग-अलग फाइलों को एक पंक्ति में लगाना है। तीन निश्चित फाइलें A, B और C इसी आपसी क्रम में आएँ, पर उनका लगातार होना जरूरी न हो। कितने तरीके हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਫਾਈਲਾਂ ਨੂੰ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਲਗਾਉਣਾ ਹੈ। ਤਿੰਨ ਖਾਸ ਫਾਈਲਾਂ A, B ਅਤੇ C ਇਸੇ ਆਪਸੀ ਕ੍ਰਮ ਵਿੱਚ ਆਉਣ, ਪਰ ਉਹਨਾਂ ਦਾ ਲਗਾਤਾਰ ਹੋਣਾ ਜ਼ਰੂਰੀ ਨਾ ਹੋਵੇ। ਕਿੰਨੇ ਤਰੀਕੇ ਹਨ?`;
    }
    case "PNC-QL-131": {
      const n = requiredToken(t, 0, qlId);
      return hi
        ? `${n} अलग-अलग कार्यों को एक क्रम में रखना है। चार निश्चित कार्यों का दिया गया आपसी क्रम बना रहे और बाकी कार्य कहीं भी आ सकें। कुल कितने क्रम संभव हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਕੰਮਾਂ ਨੂੰ ਇੱਕ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖਣਾ ਹੈ। ਚਾਰ ਖਾਸ ਕੰਮਾਂ ਦਾ ਦਿੱਤਾ ਆਪਸੀ ਕ੍ਰਮ ਬਣਿਆ ਰਹੇ ਅਤੇ ਬਾਕੀ ਕੰਮ ਕਿਤੇ ਵੀ ਆ ਸਕਣ। ਕੁੱਲ ਕਿੰਨੇ ਕ੍ਰਮ ਸੰਭਵ ਹਨ?`;
    }
    case "PNC-QL-132": {
      const n = requiredToken(t, 0, qlId);
      return hi
        ? `${n} अलग-अलग किताबों में A को B से पहले और, स्वतंत्र रूप से, C को D से पहले आना है। दोनों शर्तें पूरी करने वाली कितनी व्यवस्थाएँ हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਕਿਤਾਬਾਂ ਵਿੱਚ A ਨੇ B ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ, ਸੁਤੰਤਰ ਤੌਰ ਉੱਤੇ, C ਨੇ D ਤੋਂ ਪਹਿਲਾਂ ਆਉਣਾ ਹੈ। ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਨ ਵਾਲੇ ਕਿੰਨੇ ਕ੍ਰਮ ਹਨ?`;
    }
    case "PNC-QL-133": {
      const boys = requiredToken(t, 0, qlId);
      const girls = requiredToken(t, 1, qlId);
      return hi
        ? `${boys} अलग-अलग लड़कों और ${girls} अलग-अलग लड़कियों को सीधी पंक्ति में इस प्रकार खड़ा करना है कि लड़का और लड़की बारी-बारी आएँ। कितने तरीके हैं?`
        : `${boys} ਵੱਖ-ਵੱਖ ਮੁੰਡਿਆਂ ਅਤੇ ${girls} ਵੱਖ-ਵੱਖ ਕੁੜੀਆਂ ਨੂੰ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਇਸ ਤਰ੍ਹਾਂ ਖੜ੍ਹਾ ਕਰਨਾ ਹੈ ਕਿ ਮੁੰਡਾ ਅਤੇ ਕੁੜੀ ਵਾਰੀ-ਵਾਰੀ ਆਉਣ। ਕਿੰਨੇ ਤਰੀਕੇ ਹਨ?`;
    }
    case "PNC-QL-134": {
      const boys = requiredToken(t, 0, qlId);
      const girls = requiredToken(t, 1, qlId);
      return hi
        ? `${boys} अलग-अलग लड़कों और ${girls} अलग-अलग लड़कियों को पूरी तरह बारी-बारी सीधी पंक्ति में खड़ा करना है। लड़कों की संख्या लड़कियों से एक अधिक है। कितने तरीके हैं?`
        : `${boys} ਵੱਖ-ਵੱਖ ਮੁੰਡਿਆਂ ਅਤੇ ${girls} ਵੱਖ-ਵੱਖ ਕੁੜੀਆਂ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵਾਰੀ-ਵਾਰੀ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹਾ ਕਰਨਾ ਹੈ। ਮੁੰਡਿਆਂ ਦੀ ਗਿਣਤੀ ਕੁੜੀਆਂ ਤੋਂ ਇੱਕ ਵੱਧ ਹੈ। ਕਿੰਨੇ ਤਰੀਕੇ ਹਨ?`;
    }
    case "PNC-QL-135": {
      const red = requiredToken(t, 0, qlId);
      const blue = requiredToken(t, 1, qlId);
      return hi
        ? `${red} अलग-अलग लाल कार्ड और ${blue} अलग-अलग नीले कार्ड एक पंक्ति में बारी-बारी लगाने हैं। यदि पहला कार्ड लाल होना जरूरी हो, तो कितने तरीके हैं?`
        : `${red} ਵੱਖ-ਵੱਖ ਲਾਲ ਕਾਰਡ ਅਤੇ ${blue} ਵੱਖ-ਵੱਖ ਨੀਲੇ ਕਾਰਡ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਵਾਰੀ-ਵਾਰੀ ਲਗਾਉਣੇ ਹਨ। ਜੇ ਪਹਿਲਾ ਕਾਰਡ ਲਾਲ ਹੋਣਾ ਜ਼ਰੂਰੀ ਹੋਵੇ, ਤਾਂ ਕਿੰਨੇ ਤਰੀਕੇ ਹਨ?`;
    }
    case "PNC-QL-136": {
      const men = requiredToken(t, 0, qlId);
      const women = requiredToken(t, 1, qlId);
      return hi
        ? `${men} अलग-अलग पुरुषों और ${women} अलग-अलग महिलाओं को सीधी पंक्ति में खड़ा करना है। यदि कोई भी दो महिलाएँ पास-पास न हों, तो कितने तरीके हैं?`
        : `${men} ਵੱਖ-ਵੱਖ ਮਰਦਾਂ ਅਤੇ ${women} ਵੱਖ-ਵੱਖ ਔਰਤਾਂ ਨੂੰ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹਾ ਕਰਨਾ ਹੈ। ਜੇ ਕੋਈ ਵੀ ਦੋ ਔਰਤਾਂ ਨਾਲ-ਨਾਲ ਨਾ ਖੜ੍ਹਨ, ਤਾਂ ਕਿੰਨੇ ਤਰੀਕੇ ਹਨ?`;
    }
    case "PNC-QL-137": {
      const n = requiredToken(t, 0, qlId);
      const k = requiredToken(t, 1, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों में ${k} निश्चित व्यक्तियों को इस प्रकार सीधी पंक्ति में खड़ा करना है कि उनमें से कोई भी दो पास-पास न हों। कुल कितने तरीके हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਵਿੱਚੋਂ ${k} ਖਾਸ ਵਿਅਕਤੀਆਂ ਨੂੰ ਇਸ ਤਰ੍ਹਾਂ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹਾ ਕਰਨਾ ਹੈ ਕਿ ਉਹਨਾਂ ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਦੋ ਨਾਲ-ਨਾਲ ਨਾ ਹੋਣ। ਕੁੱਲ ਕਿੰਨੇ ਤਰੀਕੇ ਹਨ?`;
    }
    case "PNC-QL-138": {
      const n = requiredToken(t, 0, qlId);
      const d = requiredToken(t, 1, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों की सीधी पंक्ति में दो निश्चित व्यक्तियों के स्थान क्रमांकों का अंतर ठीक ${d} हो। ऐसी कितनी व्यवस्थाएँ संभव हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਦੀ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਦੋ ਖਾਸ ਵਿਅਕਤੀਆਂ ਦੀਆਂ ਥਾਵਾਂ ਦੇ ਨੰਬਰਾਂ ਦਾ ਫਰਕ ਠੀਕ ${d} ਹੋਵੇ। ਅਜਿਹੇ ਕਿੰਨੇ ਤਰੀਕੇ ਸੰਭਵ ਹਨ?`;
    }
    case "PNC-QL-139": {
      const n = requiredToken(t, 0, qlId);
      const gap = requiredToken(t, 1, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों की सीधी पंक्ति में दो निश्चित व्यक्तियों के बीच कम-से-कम ${gap} व्यक्ति होने चाहिए। कितनी व्यवस्थाएँ संभव हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਦੀ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਦੋ ਖਾਸ ਵਿਅਕਤੀਆਂ ਵਿਚਕਾਰ ਘੱਟੋ-ਘੱਟ ${gap} ਵਿਅਕਤੀ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ। ਕਿੰਨੇ ਤਰੀਕੇ ਸੰਭਵ ਹਨ?`;
    }
    case "PNC-QL-140": {
      const n = requiredToken(t, 0, qlId);
      const k = requiredToken(t, 1, qlId);
      return hi
        ? `${n} अलग-अलग किताबों की व्यवस्था में ${k} निश्चित किताबें सभी सम क्रमांक वाले स्थानों पर हों। ऐसी कितनी व्यवस्थाएँ हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਕਿਤਾਬਾਂ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ${k} ਖਾਸ ਕਿਤਾਬਾਂ ਸਾਰੀਆਂ ਜੋੜ ਨੰਬਰ ਵਾਲੀਆਂ ਥਾਵਾਂ ਉੱਤੇ ਹੋਣ। ਅਜਿਹੇ ਕਿੰਨੇ ਕ੍ਰਮ ਹਨ?`;
    }
    case "PNC-QL-141": {
      const n = requiredToken(t, 0, qlId);
      const r = requiredToken(t, 1, qlId);
      const k = requiredToken(t, 2, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों में ${k} निश्चित व्यक्ति हैं। इनमें से ठीक ${r} व्यक्ति विषम क्रमांक वाले स्थानों पर हों। कितनी व्यवस्थाएँ संभव हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਵਿੱਚ ${k} ਖਾਸ ਵਿਅਕਤੀ ਹਨ। ਉਹਨਾਂ ਵਿੱਚੋਂ ਠੀਕ ${r} ਵਿਅਕਤੀ ਟਾਂਕ ਨੰਬਰ ਵਾਲੀਆਂ ਥਾਵਾਂ ਉੱਤੇ ਹੋਣ। ਕਿੰਨੇ ਤਰੀਕੇ ਸੰਭਵ ਹਨ?`;
    }
    case "PNC-QL-142": {
      const n = requiredToken(t, 0, qlId);
      const target = requiredToken(t, 1, qlId);
      const d1 = requiredMathToken(m, 0, qlId);
      const d2 = requiredMathToken(m, 1, qlId);
      const range = requiredMathToken(m, 2, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों की व्यवस्थाओं में दो निश्चित व्यक्तियों के बीच ठीक ${d1} व्यक्ति होने वाली व्यवस्थाओं की संख्या ${target} है। ${d2} ज्ञात कीजिए, जहाँ ${range}।`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਦੇ ਕ੍ਰਮਾਂ ਵਿੱਚ ਦੋ ਖਾਸ ਵਿਅਕਤੀਆਂ ਵਿਚਕਾਰ ਠੀਕ ${d1} ਵਿਅਕਤੀ ਹੋਣ ਵਾਲੇ ਤਰੀਕਿਆਂ ਦੀ ਗਿਣਤੀ ${target} ਹੈ। ${d2} ਪਤਾ ਕਰੋ, ਜਿੱਥੇ ${range}।`;
    }
    case "PNC-QL-143": {
      const n = requiredToken(t, 0, qlId);
      const p1 = requiredToken(t, 1, qlId);
      const p2 = requiredToken(t, 2, qlId);
      const p3 = requiredToken(t, 3, qlId);
      return hi
        ? `${n} अलग-अलग फाइलों में फाइल A, B और C को क्रमशः स्थान ${p1}, ${p2} और ${p3} पर रखना है। ऐसी कितनी व्यवस्थाएँ संभव हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਫਾਈਲਾਂ ਵਿੱਚ ਫਾਈਲ A, B ਅਤੇ C ਨੂੰ ਕ੍ਰਮਵਾਰ ਥਾਂ ${p1}, ${p2} ਅਤੇ ${p3} ਉੱਤੇ ਰੱਖਣਾ ਹੈ। ਅਜਿਹੇ ਕਿੰਨੇ ਕ੍ਰਮ ਸੰਭਵ ਹਨ?`;
    }
    case "PNC-QL-144": {
      const n = requiredToken(t, 0, qlId);
      const p1 = requiredToken(t, 1, qlId);
      const p2 = requiredToken(t, 2, qlId);
      const p3 = requiredToken(t, 3, qlId);
      return hi
        ? `${n} अलग-अलग किताबों में तीन निश्चित किताबों को स्थान ${p1}, ${p2} और ${p3} पर किसी भी क्रम में रखना है। कितनी व्यवस्थाएँ संभव हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਕਿਤਾਬਾਂ ਵਿੱਚ ਤਿੰਨ ਖਾਸ ਕਿਤਾਬਾਂ ਨੂੰ ਥਾਂ ${p1}, ${p2} ਅਤੇ ${p3} ਉੱਤੇ ਕਿਸੇ ਵੀ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖਣਾ ਹੈ। ਕਿੰਨੇ ਕ੍ਰਮ ਸੰਭਵ ਹਨ?`;
    }
    case "PNC-QL-145": {
      const n = requiredToken(t, 0, qlId);
      const gap = requiredToken(t, 1, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों की सीधी पंक्ति में दो निश्चित व्यक्तियों के बीच अधिक-से-अधिक ${gap} व्यक्ति हों। ऐसी कितनी व्यवस्थाएँ हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਦੀ ਸਿੱਧੀ ਕਤਾਰ ਵਿੱਚ ਦੋ ਖਾਸ ਵਿਅਕਤੀਆਂ ਵਿਚਕਾਰ ਵੱਧ ਤੋਂ ਵੱਧ ${gap} ਵਿਅਕਤੀ ਹੋਣ। ਅਜਿਹੇ ਕਿੰਨੇ ਤਰੀਕੇ ਹਨ?`;
    }
    case "PNC-QL-146": {
      const n = requiredToken(t, 0, qlId);
      const d = requiredToken(t, 1, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों की व्यवस्था में A, B से पहले आए और B का स्थान A के स्थान से ठीक ${d} आगे हो। कितनी व्यवस्थाएँ संभव हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਦੇ ਕ੍ਰਮ ਵਿੱਚ A, B ਤੋਂ ਪਹਿਲਾਂ ਆਵੇ ਅਤੇ B ਦੀ ਥਾਂ A ਦੀ ਥਾਂ ਤੋਂ ਠੀਕ ${d} ਅੱਗੇ ਹੋਵੇ। ਕਿੰਨੇ ਤਰੀਕੇ ਸੰਭਵ ਹਨ?`;
    }
    case "PNC-QL-147": {
      const n = requiredToken(t, 0, qlId);
      const minimum = requiredToken(t, 1, qlId);
      const k = requiredToken(t, 2, qlId);
      return hi
        ? `${n} अलग-अलग व्यक्तियों में ${k} निश्चित व्यक्ति हैं। इनमें से कम-से-कम ${minimum} व्यक्ति विषम क्रमांक वाले स्थानों पर हों। कितनी व्यवस्थाएँ संभव हैं?`
        : `${n} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਵਿੱਚ ${k} ਖਾਸ ਵਿਅਕਤੀ ਹਨ। ਉਹਨਾਂ ਵਿੱਚੋਂ ਘੱਟੋ-ਘੱਟ ${minimum} ਵਿਅਕਤੀ ਟਾਂਕ ਨੰਬਰ ਵਾਲੀਆਂ ਥਾਵਾਂ ਉੱਤੇ ਹੋਣ। ਕਿੰਨੇ ਤਰੀਕੇ ਸੰਭਵ ਹਨ?`;
    }
    default:
      throw new Error(`${qlId}: CP-008 stem localization is missing`);
  }
}

type FamilyKey = "position" | "relativeOrder" | "alternation" | "separation" | "distance" | "positionClass" | "inverse";

function familyFor(qlId: string): FamilyKey {
  const numeric = Number(qlId.slice(-3));
  if ([125, 126, 127, 128, 143, 144].includes(numeric)) return "position";
  if (numeric >= 129 && numeric <= 132) return "relativeOrder";
  if (numeric >= 133 && numeric <= 135) return "alternation";
  if (numeric === 136 || numeric === 137) return "separation";
  if ([138, 139, 145, 146].includes(numeric)) return "distance";
  if ([140, 141, 147].includes(numeric)) return "positionClass";
  return "inverse";
}

const CORE_LINES: Record<FamilyKey, Record<PncStudentLocale, string[]>> = {
  position: {
    "hi-IN": ["पहले निश्चित व्यक्ति या वस्तु के लिए आवश्यक स्थान तय कीजिए।", "फिर बचे हुए अलग-अलग सदस्यों को बाकी स्थानों पर स्वतंत्र रूप से सजाइए।"],
    "pa-IN": ["ਪਹਿਲਾਂ ਖਾਸ ਵਿਅਕਤੀ ਜਾਂ ਵਸਤੂ ਲਈ ਲੋੜੀਂਦੀ ਥਾਂ ਪੱਕੀ ਕਰੋ।", "ਫਿਰ ਬਚੇ ਹੋਏ ਵੱਖ-ਵੱਖ ਮੈਂਬਰਾਂ ਨੂੰ ਬਾਕੀ ਥਾਵਾਂ ਉੱਤੇ ਖੁੱਲ੍ਹੇ ਤੌਰ ਉੱਤੇ ਲਗਾਓ।"],
  },
  relativeOrder: {
    "hi-IN": ["जिन सदस्यों का आपसी क्रम निश्चित है, उनके सभी संभावित आपसी क्रम बराबर संख्या में आते हैं।", "इसलिए कुल व्यवस्थाओं को उस निश्चित श्रृंखला के क्रमों की संख्या से भाग दीजिए।"],
    "pa-IN": ["ਜਿਨ੍ਹਾਂ ਮੈਂਬਰਾਂ ਦਾ ਆਪਸੀ ਕ੍ਰਮ ਪੱਕਾ ਹੈ, ਉਹਨਾਂ ਦੇ ਸਾਰੇ ਸੰਭਵ ਆਪਸੀ ਕ੍ਰਮ ਬਰਾਬਰ ਗਿਣਤੀ ਵਿੱਚ ਆਉਂਦੇ ਹਨ।", "ਇਸ ਲਈ ਕੁੱਲ ਤਰੀਕਿਆਂ ਨੂੰ ਉਸ ਪੱਕੀ ਲੜੀ ਦੇ ਕ੍ਰਮਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।"],
  },
  alternation: {
    "hi-IN": ["पहले तय कीजिए कि दोनों वर्गों के स्थान किस नमूने में आएँगे।", "फिर हर वर्ग के अलग-अलग सदस्यों को उनके निर्धारित स्थानों पर सजाकर दोनों गणनाएँ गुणा कीजिए।"],
    "pa-IN": ["ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਦੋਵੇਂ ਵਰਗਾਂ ਦੀਆਂ ਥਾਵਾਂ ਕਿਹੜੇ ਨਮੂਨੇ ਵਿੱਚ ਆਉਣਗੀਆਂ।", "ਫਿਰ ਹਰ ਵਰਗ ਦੇ ਵੱਖ-ਵੱਖ ਮੈਂਬਰਾਂ ਨੂੰ ਉਹਨਾਂ ਦੀਆਂ ਪੱਕੀਆਂ ਥਾਵਾਂ ਉੱਤੇ ਲਗਾ ਕੇ ਦੋਵੇਂ ਗਿਣਤੀਆਂ ਗੁਣਾ ਕਰੋ।"],
  },
  separation: {
    "hi-IN": ["पहले बिना रोक वाले बड़े समूह को सजाइए; इससे उसके आगे, बीच और पीछे खाली स्थान बनते हैं।", "प्रतिबंधित सदस्यों को अलग-अलग खाली स्थानों में चुनकर रखिए, ताकि कोई दो पास-पास न आएँ।"],
    "pa-IN": ["ਪਹਿਲਾਂ ਬਿਨਾਂ ਰੋਕ ਵਾਲੇ ਵੱਡੇ ਗਰੁੱਪ ਨੂੰ ਲਗਾਓ; ਇਸ ਨਾਲ ਉਸਦੇ ਅੱਗੇ, ਵਿਚਕਾਰ ਅਤੇ ਪਿੱਛੇ ਖਾਲੀ ਥਾਵਾਂ ਬਣਦੀਆਂ ਹਨ।", "ਰੋਕ ਵਾਲੇ ਮੈਂਬਰਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਖਾਲੀ ਥਾਵਾਂ ਵਿੱਚ ਚੁਣ ਕੇ ਰੱਖੋ, ਤਾਂ ਜੋ ਕੋਈ ਦੋ ਨਾਲ-ਨਾਲ ਨਾ ਆਉਣ।"],
  },
  distance: {
    "hi-IN": ["दो निश्चित व्यक्तियों के लिए शर्त पूरी करने वाले स्थान-जोड़े पहले गिनिए।", "उन स्थानों पर दोनों व्यक्तियों का क्रम तय करने के बाद बाकी व्यक्तियों को शेष स्थानों पर सजाइए।"],
    "pa-IN": ["ਦੋ ਖਾਸ ਵਿਅਕਤੀਆਂ ਲਈ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਥਾਂ-ਜੋੜੀਆਂ ਪਹਿਲਾਂ ਗਿਣੋ।", "ਉਹਨਾਂ ਥਾਵਾਂ ਉੱਤੇ ਦੋਵੇਂ ਵਿਅਕਤੀਆਂ ਦਾ ਕ੍ਰਮ ਤੈਅ ਕਰਨ ਤੋਂ ਬਾਅਦ ਬਾਕੀ ਵਿਅਕਤੀਆਂ ਨੂੰ ਬਚੀਆਂ ਥਾਵਾਂ ਉੱਤੇ ਲਗਾਓ।"],
  },
  positionClass: {
    "hi-IN": ["विषम या सम स्थानों की उपलब्ध संख्या अलग से गिनिए।", "निश्चित सदस्यों के लिए उपयुक्त स्थान चुनकर उन्हें सजाइए और फिर बाकी सदस्यों को शेष स्थानों पर रखिए।"],
    "pa-IN": ["ਟਾਂਕ ਜਾਂ ਜੋੜ ਥਾਵਾਂ ਦੀ ਉਪਲਬਧ ਗਿਣਤੀ ਵੱਖਰੇ ਤੌਰ ਉੱਤੇ ਗਿਣੋ।", "ਖਾਸ ਮੈਂਬਰਾਂ ਲਈ ਢੁੱਕਵੀਆਂ ਥਾਵਾਂ ਚੁਣ ਕੇ ਉਹਨਾਂ ਨੂੰ ਲਗਾਓ ਅਤੇ ਫਿਰ ਬਾਕੀ ਮੈਂਬਰਾਂ ਨੂੰ ਬਚੀਆਂ ਥਾਵਾਂ ਉੱਤੇ ਰੱਖੋ।"],
  },
  inverse: {
    "hi-IN": ["दूरी के लिए केवल दी गई छोटी सीमा के मान जाँचिए।", "हर मान से बनने वाली व्यवस्था-संख्या निकालकर वही मान रखिए जो दी गई संख्या से मेल खाए।"],
    "pa-IN": ["ਫਾਸਲੇ ਲਈ ਸਿਰਫ਼ ਦਿੱਤੀ ਛੋਟੀ ਹੱਦ ਦੇ ਮੁੱਲ ਜਾਂਚੋ।", "ਹਰ ਮੁੱਲ ਨਾਲ ਬਣਦੇ ਤਰੀਕਿਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢ ਕੇ ਉਹੀ ਮੁੱਲ ਰੱਖੋ ਜੋ ਦਿੱਤੀ ਗਿਣਤੀ ਨਾਲ ਮਿਲੇ।"],
  },
};

const STEP_PLANS: Record<FamilyKey, Record<PncStudentLocale, Array<{ label: string; text: string }>>> = {
  position: {
    "hi-IN": [
      { label: "निश्चित स्थान पहचानें", text: "शर्त के अनुसार पहले आरक्षित स्थान या स्थानों को अलग कीजिए।" },
      { label: "बचे स्थान गिनें", text: "अब देखें कि बाकी अलग-अलग सदस्यों के लिए कितने स्थान खुले हैं।" },
      { label: "स्वतंत्र क्रम बनाएं", text: "बचे सदस्यों को खुले स्थानों पर सजाने की गणना लिखिए।" },
      { label: "गणना सरल करें", text: "फैक्टोरियल और गुणन को क्रम से खोलकर मान निकालिए।" },
    ],
    "pa-IN": [
      { label: "ਪੱਕੀ ਥਾਂ ਪਛਾਣੋ", text: "ਸ਼ਰਤ ਮੁਤਾਬਕ ਪਹਿਲਾਂ ਰਾਖਵੀਂ ਥਾਂ ਜਾਂ ਥਾਵਾਂ ਵੱਖ ਕਰੋ।" },
      { label: "ਬਚੀਆਂ ਥਾਵਾਂ ਗਿਣੋ", text: "ਹੁਣ ਵੇਖੋ ਕਿ ਬਾਕੀ ਵੱਖ-ਵੱਖ ਮੈਂਬਰਾਂ ਲਈ ਕਿੰਨੀਆਂ ਥਾਵਾਂ ਖੁੱਲ੍ਹੀਆਂ ਹਨ।" },
      { label: "ਖੁੱਲ੍ਹਾ ਕ੍ਰਮ ਬਣਾਓ", text: "ਬਚੇ ਮੈਂਬਰਾਂ ਨੂੰ ਖੁੱਲ੍ਹੀਆਂ ਥਾਵਾਂ ਉੱਤੇ ਲਗਾਉਣ ਦੀ ਗਿਣਤੀ ਲਿਖੋ।" },
      { label: "ਗਿਣਤੀ ਸੌਖੀ ਕਰੋ", text: "ਫੈਕਟੋਰੀਅਲ ਅਤੇ ਗੁਣਾ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਖੋਲ੍ਹ ਕੇ ਮੁੱਲ ਕੱਢੋ।" },
    ],
  },
  relativeOrder: {
    "hi-IN": [
      { label: "कुल क्रम गिनें", text: "पहले सभी अलग-अलग सदस्यों के बिना-शर्त क्रम लिखिए।" },
      { label: "आपसी क्रम की बराबरी समझें", text: "निश्चित सदस्यों के सभी आपसी क्रम समान संख्या में आते हैं।" },
      { label: "सही हिस्सा लें", text: "दिए गए आपसी क्रम वाला भाग रखने के लिए आवश्यक भाग दीजिए।" },
      { label: "मान निकालें", text: "फैक्टोरियल या भाग को सरल करके अंतिम संख्या तक पहुँचिए।" },
    ],
    "pa-IN": [
      { label: "ਕੁੱਲ ਕ੍ਰਮ ਗਿਣੋ", text: "ਪਹਿਲਾਂ ਸਾਰੇ ਵੱਖ-ਵੱਖ ਮੈਂਬਰਾਂ ਦੇ ਬਿਨਾਂ-ਸ਼ਰਤ ਕ੍ਰਮ ਲਿਖੋ।" },
      { label: "ਆਪਸੀ ਕ੍ਰਮ ਦੀ ਬਰਾਬਰੀ ਸਮਝੋ", text: "ਖਾਸ ਮੈਂਬਰਾਂ ਦੇ ਸਾਰੇ ਆਪਸੀ ਕ੍ਰਮ ਬਰਾਬਰ ਗਿਣਤੀ ਵਿੱਚ ਆਉਂਦੇ ਹਨ।" },
      { label: "ਸਹੀ ਹਿੱਸਾ ਲਵੋ", text: "ਦਿੱਤੇ ਆਪਸੀ ਕ੍ਰਮ ਵਾਲਾ ਹਿੱਸਾ ਰੱਖਣ ਲਈ ਲੋੜੀਂਦਾ ਭਾਗ ਦਿਓ।" },
      { label: "ਮੁੱਲ ਕੱਢੋ", text: "ਫੈਕਟੋਰੀਅਲ ਜਾਂ ਭਾਗ ਨੂੰ ਸੌਖਾ ਕਰਕੇ ਅੰਤਿਮ ਗਿਣਤੀ ਤੱਕ ਪਹੁੰਚੋ।" },
    ],
  },
  alternation: {
    "hi-IN": [
      { label: "स्थान-नमूना तय करें", text: "पहले दोनों वर्गों के बारी-बारी आने वाला मान्य ढाँचा बनाइए।" },
      { label: "पहला वर्ग सजाएँ", text: "पहले वर्ग के अलग-अलग सदस्यों को उसके स्थानों पर सजाइए।" },
      { label: "दूसरा वर्ग सजाएँ", text: "दूसरे वर्ग के सदस्यों को बची हुई निर्धारित जगहों पर सजाइए।" },
      { label: "सभी मान्य शुरुआतें जोड़ें", text: "यदि एक से अधिक शुरुआती नमूने संभव हों तो उन्हें भी शामिल कीजिए।" },
    ],
    "pa-IN": [
      { label: "ਥਾਂ-ਨਮੂਨਾ ਤੈਅ ਕਰੋ", text: "ਪਹਿਲਾਂ ਦੋਵੇਂ ਵਰਗਾਂ ਦੇ ਵਾਰੀ-ਵਾਰੀ ਆਉਣ ਵਾਲਾ ਸਹੀ ਢਾਂਚਾ ਬਣਾਓ।" },
      { label: "ਪਹਿਲਾ ਵਰਗ ਲਗਾਓ", text: "ਪਹਿਲੇ ਵਰਗ ਦੇ ਵੱਖ-ਵੱਖ ਮੈਂਬਰਾਂ ਨੂੰ ਉਸ ਦੀਆਂ ਥਾਵਾਂ ਉੱਤੇ ਲਗਾਓ।" },
      { label: "ਦੂਜਾ ਵਰਗ ਲਗਾਓ", text: "ਦੂਜੇ ਵਰਗ ਦੇ ਮੈਂਬਰਾਂ ਨੂੰ ਬਚੀਆਂ ਪੱਕੀਆਂ ਥਾਵਾਂ ਉੱਤੇ ਲਗਾਓ।" },
      { label: "ਸਾਰੀਆਂ ਸਹੀ ਸ਼ੁਰੂਆਤਾਂ ਜੋੜੋ", text: "ਜੇ ਇੱਕ ਤੋਂ ਵੱਧ ਸ਼ੁਰੂਆਤੀ ਨਮੂਨੇ ਸੰਭਵ ਹੋਣ ਤਾਂ ਉਹਨਾਂ ਨੂੰ ਵੀ ਸ਼ਾਮਲ ਕਰੋ।" },
    ],
  },
  separation: {
    "hi-IN": [
      { label: "मुख्य समूह सजाएँ", text: "पहले उन सदस्यों को सजाइए जिन पर पास-पास न होने की रोक नहीं है।" },
      { label: "खाली स्थान बनाएँ", text: "इस क्रम के आगे, बीच और पीछे बने अलग-अलग खाली स्थान गिनिए।" },
      { label: "अलग स्थान चुनें", text: "प्रतिबंधित सदस्यों के लिए अलग-अलग खाली स्थान चुनिए।" },
      { label: "प्रतिबंधित सदस्य सजाएँ", text: "चुने स्थानों में इन अलग-अलग सदस्यों के क्रम भी गिनिए।" },
    ],
    "pa-IN": [
      { label: "ਮੁੱਖ ਗਰੁੱਪ ਲਗਾਓ", text: "ਪਹਿਲਾਂ ਉਹ ਮੈਂਬਰ ਲਗਾਓ ਜਿਨ੍ਹਾਂ ਉੱਤੇ ਨਾਲ-ਨਾਲ ਨਾ ਹੋਣ ਦੀ ਰੋਕ ਨਹੀਂ ਹੈ।" },
      { label: "ਖਾਲੀ ਥਾਵਾਂ ਬਣਾਓ", text: "ਇਸ ਕ੍ਰਮ ਦੇ ਅੱਗੇ, ਵਿਚਕਾਰ ਅਤੇ ਪਿੱਛੇ ਬਣੀਆਂ ਵੱਖ-ਵੱਖ ਖਾਲੀ ਥਾਵਾਂ ਗਿਣੋ।" },
      { label: "ਵੱਖਰੀਆਂ ਥਾਵਾਂ ਚੁਣੋ", text: "ਰੋਕ ਵਾਲੇ ਮੈਂਬਰਾਂ ਲਈ ਵੱਖ-ਵੱਖ ਖਾਲੀ ਥਾਵਾਂ ਚੁਣੋ।" },
      { label: "ਰੋਕ ਵਾਲੇ ਮੈਂਬਰ ਲਗਾਓ", text: "ਚੁਣੀਆਂ ਥਾਵਾਂ ਵਿੱਚ ਇਹਨਾਂ ਵੱਖ-ਵੱਖ ਮੈਂਬਰਾਂ ਦੇ ਕ੍ਰਮ ਵੀ ਗਿਣੋ।" },
    ],
  },
  distance: {
    "hi-IN": [
      { label: "मान्य दूरी पहचानें", text: "शर्त को स्थान-क्रमांकों के अंतर में बदलिए।" },
      { label: "स्थान-जोड़े गिनें", text: "उस अंतर को पूरा करने वाले आरंभ और अंत के स्थान गिनिए।" },
      { label: "दोनों व्यक्तियों का क्रम रखें", text: "जहाँ दिशा निश्चित नहीं है वहाँ दोनों आपसी क्रम शामिल कीजिए।" },
      { label: "बाकी व्यक्तियों को सजाएँ", text: "शेष व्यक्तियों को बचे स्थानों पर स्वतंत्र रूप से लगाइए।" },
    ],
    "pa-IN": [
      { label: "ਸਹੀ ਫਾਸਲਾ ਪਛਾਣੋ", text: "ਸ਼ਰਤ ਨੂੰ ਥਾਵਾਂ ਦੇ ਨੰਬਰਾਂ ਦੇ ਫਰਕ ਵਿੱਚ ਬਦਲੋ।" },
      { label: "ਥਾਂ-ਜੋੜੀਆਂ ਗਿਣੋ", text: "ਉਸ ਫਰਕ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੀਆਂ ਸ਼ੁਰੂ ਅਤੇ ਅੰਤ ਦੀਆਂ ਥਾਵਾਂ ਗਿਣੋ।" },
      { label: "ਦੋਵੇਂ ਵਿਅਕਤੀਆਂ ਦਾ ਕ੍ਰਮ ਰੱਖੋ", text: "ਜਿੱਥੇ ਦਿਸ਼ਾ ਪੱਕੀ ਨਹੀਂ, ਉੱਥੇ ਦੋਵੇਂ ਆਪਸੀ ਕ੍ਰਮ ਸ਼ਾਮਲ ਕਰੋ।" },
      { label: "ਬਾਕੀ ਵਿਅਕਤੀ ਲਗਾਓ", text: "ਬਚੇ ਵਿਅਕਤੀਆਂ ਨੂੰ ਬਾਕੀ ਥਾਵਾਂ ਉੱਤੇ ਖੁੱਲ੍ਹੇ ਤੌਰ ਉੱਤੇ ਲਗਾਓ।" },
    ],
  },
  positionClass: {
    "hi-IN": [
      { label: "स्थान-वर्ग गिनें", text: "विषम या सम क्रमांक वाले उपलब्ध स्थान पहले गिनिए।" },
      { label: "निश्चित सदस्य चुनें", text: "शर्त के अनुसार निश्चित सदस्यों में से आवश्यक संख्या चुनिए।" },
      { label: "उपयुक्त स्थान चुनें", text: "चुने सदस्यों के लिए सही वर्ग के स्थान चुनकर उनके क्रम गिनिए।" },
      { label: "बाकी स्थान भरें", text: "शेष सभी सदस्यों को बाकी खुले स्थानों पर सजाइए।" },
    ],
    "pa-IN": [
      { label: "ਥਾਂ-ਵਰਗ ਗਿਣੋ", text: "ਟਾਂਕ ਜਾਂ ਜੋੜ ਨੰਬਰ ਵਾਲੀਆਂ ਉਪਲਬਧ ਥਾਵਾਂ ਪਹਿਲਾਂ ਗਿਣੋ।" },
      { label: "ਖਾਸ ਮੈਂਬਰ ਚੁਣੋ", text: "ਸ਼ਰਤ ਮੁਤਾਬਕ ਖਾਸ ਮੈਂਬਰਾਂ ਵਿੱਚੋਂ ਲੋੜੀਂਦੀ ਗਿਣਤੀ ਚੁਣੋ।" },
      { label: "ਢੁੱਕਵੀਆਂ ਥਾਵਾਂ ਚੁਣੋ", text: "ਚੁਣੇ ਮੈਂਬਰਾਂ ਲਈ ਸਹੀ ਵਰਗ ਦੀਆਂ ਥਾਵਾਂ ਚੁਣ ਕੇ ਉਹਨਾਂ ਦੇ ਕ੍ਰਮ ਗਿਣੋ।" },
      { label: "ਬਾਕੀ ਥਾਵਾਂ ਭਰੋ", text: "ਬਚੇ ਸਾਰੇ ਮੈਂਬਰਾਂ ਨੂੰ ਬਾਕੀ ਖੁੱਲ੍ਹੀਆਂ ਥਾਵਾਂ ਉੱਤੇ ਲਗਾਓ।" },
    ],
  },
  inverse: {
    "hi-IN": [
      { label: "संभावित मान लिखें", text: "दी गई सीमा में दूरी के सभी संभव मानों की छोटी सूची बनाइए।" },
      { label: "हर मान की संख्या निकालें", text: "प्रत्येक मान को सीधे व्यवस्था-सूत्र में रखकर परिणाम निकालिए।" },
      { label: "दी गई संख्या से मिलाएँ", text: "हर परिणाम की तुलना प्रश्न में दी गई व्यवस्था-संख्या से कीजिए।" },
      { label: "एकमात्र सही मान चुनें", text: "जो मान ठीक मेल खाता है वही स्वीकार कीजिए।" },
    ],
    "pa-IN": [
      { label: "ਸੰਭਵ ਮੁੱਲ ਲਿਖੋ", text: "ਦਿੱਤੀ ਹੱਦ ਵਿੱਚ ਫਾਸਲੇ ਦੇ ਸਾਰੇ ਸੰਭਵ ਮੁੱਲਾਂ ਦੀ ਛੋਟੀ ਸੂਚੀ ਬਣਾਓ।" },
      { label: "ਹਰ ਮੁੱਲ ਦੀ ਗਿਣਤੀ ਕੱਢੋ", text: "ਹਰ ਮੁੱਲ ਨੂੰ ਸਿੱਧਾ ਤਰੀਕਿਆਂ ਵਾਲੇ ਸੂਤਰ ਵਿੱਚ ਰੱਖ ਕੇ ਨਤੀਜਾ ਕੱਢੋ।" },
      { label: "ਦਿੱਤੀ ਗਿਣਤੀ ਨਾਲ ਮਿਲਾਓ", text: "ਹਰ ਨਤੀਜੇ ਦੀ ਤੁਲਨਾ ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੀ ਤਰੀਕਿਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਕਰੋ।" },
      { label: "ਇੱਕੋ ਸਹੀ ਮੁੱਲ ਚੁਣੋ", text: "ਜੋ ਮੁੱਲ ਠੀਕ ਮਿਲਦਾ ਹੈ ਉਹੀ ਮੰਨੋ।" },
    ],
  },
};

const TRAP_TEXT: Record<FamilyKey, Record<PncStudentLocale, string[]>> = {
  position: {
    "hi-IN": ["यह उत्तर निश्चित स्थान को फिर से चुनने की गलती से बन सकता है।", "यहाँ बचे हुए सदस्यों की संख्या या उनके खुले स्थान गलत गिने गए हैं।", "सिरों या दिए गए स्थानों के संभव आपसी क्रमों में से कोई गुणक छूट गया है।"],
    "pa-IN": ["ਇਹ ਉੱਤਰ ਪੱਕੀ ਥਾਂ ਨੂੰ ਮੁੜ ਚੁਣਨ ਦੀ ਗਲਤੀ ਨਾਲ ਬਣ ਸਕਦਾ ਹੈ।", "ਇੱਥੇ ਬਚੇ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ ਜਾਂ ਉਹਨਾਂ ਦੀਆਂ ਖੁੱਲ੍ਹੀਆਂ ਥਾਵਾਂ ਗਲਤ ਗਿਣੀਆਂ ਗਈਆਂ ਹਨ।", "ਸਿਰਿਆਂ ਜਾਂ ਦਿੱਤੀਆਂ ਥਾਵਾਂ ਦੇ ਸੰਭਵ ਆਪਸੀ ਕ੍ਰਮਾਂ ਵਿੱਚੋਂ ਕੋਈ ਗੁਣਕ ਛੁੱਟ ਗਿਆ ਹੈ।"],
  },
  relativeOrder: {
    "hi-IN": ["इस विकल्प में निश्चित श्रृंखला को लगातार ब्लॉक मान लिया गया है, जबकि केवल आपसी क्रम दिया है।", "यह कुल क्रमों को आवश्यक क्रम-संख्या से सही भाग नहीं देता।", "दो स्वतंत्र क्रम-शर्तों में से एक शर्त या उसका भाग छूट गया है।"],
    "pa-IN": ["ਇਸ ਚੋਣ ਵਿੱਚ ਪੱਕੀ ਲੜੀ ਨੂੰ ਲਗਾਤਾਰ ਬਲਾਕ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ, ਜਦਕਿ ਸਿਰਫ਼ ਆਪਸੀ ਕ੍ਰਮ ਦਿੱਤਾ ਹੈ।", "ਇਹ ਕੁੱਲ ਕ੍ਰਮਾਂ ਨੂੰ ਲੋੜੀਂਦੀ ਕ੍ਰਮ-ਗਿਣਤੀ ਨਾਲ ਠੀਕ ਭਾਗ ਨਹੀਂ ਦਿੰਦਾ।", "ਦੋ ਸੁਤੰਤਰ ਕ੍ਰਮ-ਸ਼ਰਤਾਂ ਵਿੱਚੋਂ ਇੱਕ ਸ਼ਰਤ ਜਾਂ ਉਸਦਾ ਭਾਗ ਛੁੱਟ ਗਿਆ ਹੈ।"],
  },
  alternation: {
    "hi-IN": ["इसमें बारी-बारी आने वाले स्थान-नमूने की शर्त टूट रही है।", "किसी एक वर्ग के अलग-अलग सदस्यों के आंतरिक क्रम पूरे नहीं गिने गए।", "शुरुआती वर्ग निश्चित होने पर भी अतिरिक्त आरंभिक नमूना जोड़ दिया गया है या मान्य नमूना छोड़ा गया है।"],
    "pa-IN": ["ਇਸ ਵਿੱਚ ਵਾਰੀ-ਵਾਰੀ ਆਉਣ ਵਾਲੀਆਂ ਥਾਵਾਂ ਦਾ ਨਮੂਨਾ ਟੁੱਟ ਰਿਹਾ ਹੈ।", "ਕਿਸੇ ਇੱਕ ਵਰਗ ਦੇ ਵੱਖ-ਵੱਖ ਮੈਂਬਰਾਂ ਦੇ ਅੰਦਰਲੇ ਕ੍ਰਮ ਪੂਰੇ ਨਹੀਂ ਗਿਣੇ ਗਏ।", "ਸ਼ੁਰੂਆਤੀ ਵਰਗ ਪੱਕਾ ਹੋਣ ਦੇ ਬਾਵਜੂਦ ਵਾਧੂ ਸ਼ੁਰੂਆਤੀ ਨਮੂਨਾ ਜੋੜਿਆ ਗਿਆ ਹੈ ਜਾਂ ਸਹੀ ਨਮੂਨਾ ਛੱਡਿਆ ਗਿਆ ਹੈ।"],
  },
  separation: {
    "hi-IN": ["प्रतिबंधित सदस्यों को अलग-अलग खाली स्थानों में रखने के बजाय पास-पास आने दिया गया है।", "खाली स्थानों की संख्या में दोनों सिरों में से कोई एक भूल गया है।", "स्थान चुनने और अलग-अलग सदस्यों को उन स्थानों पर सजाने में से एक चरण छूट गया है।"],
    "pa-IN": ["ਰੋਕ ਵਾਲੇ ਮੈਂਬਰਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਖਾਲੀ ਥਾਵਾਂ ਵਿੱਚ ਰੱਖਣ ਦੀ ਥਾਂ ਨਾਲ-ਨਾਲ ਆਉਣ ਦਿੱਤਾ ਗਿਆ ਹੈ।", "ਖਾਲੀ ਥਾਵਾਂ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਦੋਵੇਂ ਸਿਰਿਆਂ ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਭੁੱਲ ਗਿਆ ਹੈ।", "ਥਾਵਾਂ ਚੁਣਨ ਅਤੇ ਵੱਖ-ਵੱਖ ਮੈਂਬਰਾਂ ਨੂੰ ਉਹਨਾਂ ਥਾਵਾਂ ਉੱਤੇ ਲਗਾਉਣ ਵਿੱਚੋਂ ਇੱਕ ਕਦਮ ਛੁੱਟ ਗਿਆ ਹੈ।"],
  },
  distance: {
    "hi-IN": ["व्यक्तियों के बीच की संख्या और उनके स्थान-क्रमांकों के अंतर को एक ही मान लिया गया है।", "दोनों व्यक्तियों के उलटे आपसी क्रम को गलत तरीके से जोड़ा या छोड़ा गया है।", "मान्य दूरी के सभी स्थान-जोड़े लेने के बजाय केवल एक जोड़ा गिना गया है।"],
    "pa-IN": ["ਵਿਅਕਤੀਆਂ ਵਿਚਕਾਰ ਦੀ ਗਿਣਤੀ ਅਤੇ ਉਹਨਾਂ ਦੀਆਂ ਥਾਵਾਂ ਦੇ ਨੰਬਰਾਂ ਦੇ ਫਰਕ ਨੂੰ ਇੱਕੋ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।", "ਦੋਵੇਂ ਵਿਅਕਤੀਆਂ ਦੇ ਉਲਟ ਆਪਸੀ ਕ੍ਰਮ ਨੂੰ ਗਲਤ ਤਰੀਕੇ ਨਾਲ ਜੋੜਿਆ ਜਾਂ ਛੱਡਿਆ ਗਿਆ ਹੈ।", "ਸਹੀ ਫਾਸਲੇ ਦੀਆਂ ਸਾਰੀਆਂ ਥਾਂ-ਜੋੜੀਆਂ ਲੈਣ ਦੀ ਥਾਂ ਸਿਰਫ਼ ਇੱਕ ਜੋੜੀ ਗਿਣੀ ਗਈ ਹੈ।"],
  },
  positionClass: {
    "hi-IN": ["विषम और सम स्थानों की उपलब्ध संख्या आपस में बदल दी गई है।", "निश्चित सदस्यों को चुनने या उनके स्थान चुनने में से एक चयन छूट गया है।", "चुने सदस्यों और बाकी सदस्यों के आंतरिक क्रमों में से कोई फैक्टोरियल नहीं गिना गया।"],
    "pa-IN": ["ਟਾਂਕ ਅਤੇ ਜੋੜ ਥਾਵਾਂ ਦੀ ਉਪਲਬਧ ਗਿਣਤੀ ਆਪਸ ਵਿੱਚ ਬਦਲ ਦਿੱਤੀ ਗਈ ਹੈ।", "ਖਾਸ ਮੈਂਬਰ ਚੁਣਨ ਜਾਂ ਉਹਨਾਂ ਦੀਆਂ ਥਾਵਾਂ ਚੁਣਨ ਵਿੱਚੋਂ ਇੱਕ ਚੋਣ ਛੁੱਟ ਗਈ ਹੈ।", "ਚੁਣੇ ਮੈਂਬਰਾਂ ਅਤੇ ਬਾਕੀ ਮੈਂਬਰਾਂ ਦੇ ਅੰਦਰਲੇ ਕ੍ਰਮਾਂ ਵਿੱਚੋਂ ਕੋਈ ਫੈਕਟੋਰੀਅਲ ਨਹੀਂ ਗਿਣਿਆ ਗਿਆ।"],
  },
  inverse: {
    "hi-IN": ["यह मान सूत्र को दी गई संख्या तक नहीं पहुँचाता।", "बीच के व्यक्तियों की संख्या और स्थान-अंतर में एक की गलती की गई है।", "दी गई सीमा के सभी मान जाँचने से पहले ही उत्तर चुन लिया गया है।"],
    "pa-IN": ["ਇਹ ਮੁੱਲ ਸੂਤਰ ਨੂੰ ਦਿੱਤੀ ਗਿਣਤੀ ਤੱਕ ਨਹੀਂ ਲੈ ਜਾਂਦਾ।", "ਵਿਚਕਾਰਲੇ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ ਅਤੇ ਥਾਂ-ਫਰਕ ਵਿੱਚ ਇੱਕ ਦੀ ਗਲਤੀ ਕੀਤੀ ਗਈ ਹੈ।", "ਦਿੱਤੀ ਹੱਦ ਦੇ ਸਾਰੇ ਮੁੱਲ ਜਾਂਚਣ ਤੋਂ ਪਹਿਲਾਂ ਹੀ ਉੱਤਰ ਚੁਣ ਲਿਆ ਗਿਆ ਹੈ।"],
  },
};

function getSection(sections: PncStudentExplanationSection[], kind: PncStudentExplanationSection["kind"]): PncStudentExplanationSection {
  const section = sections.find((candidate) => candidate.kind === kind);
  if (!section) throw new Error(`PNC CP-008 English presentation is missing ${kind}`);
  return section;
}

function formulaPhrase(tokens: string[], locale: PncStudentLocale): string {
  if (tokens.length === 0) return "";
  const separator = locale === "hi-IN" ? " तथा " : " ਅਤੇ ";
  return locale === "hi-IN"
    ? `यहाँ ${tokens.join(separator)} प्राप्त होता है।`
    : `ਇੱਥੇ ${tokens.join(separator)} ਮਿਲਦਾ ਹੈ।`;
}

function localizedSteps(
  english: PncStudentExplanationSection,
  qlId: string,
  answerLabel: string,
  locale: PncStudentLocale,
): PncStudentExplanationSection {
  const plan = STEP_PLANS[familyFor(qlId)][locale];
  return {
    kind: "stepByStep",
    heading: localizedSectionHeading("stepByStep", locale),
    lines: english.lines.map((line, index) => {
      const stage = plan[Math.min(index, plan.length - 1)]!;
      const formula = formulaPhrase(mathTokens(line), locale);
      const isLast = index === english.lines.length - 1;
      const conclusion = isLast
        ? (locale === "hi-IN" ? ` इसलिए सही उत्तर ${answerLabel} है।` : ` ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answerLabel} ਹੈ।`)
        : "";
      return `${index + 1}. **${stage.label}:** ${stage.text}${formula ? ` ${formula}` : ""}${conclusion}`;
    }),
  };
}

function shortcutLead(qlId: string, locale: PncStudentLocale): string {
  const family = familyFor(qlId);
  const hi = locale === "hi-IN";
  if (family === "position") return hi ? "निश्चित स्थान पहले काट दें; फिर केवल बचे स्थानों का फैक्टोरियल या आवश्यक सिरा-गुणक लगाएँ।" : "ਪੱਕੀਆਂ ਥਾਵਾਂ ਪਹਿਲਾਂ ਕੱਟ ਦਿਓ; ਫਿਰ ਸਿਰਫ਼ ਬਚੀਆਂ ਥਾਵਾਂ ਦਾ ਫੈਕਟੋਰੀਅਲ ਜਾਂ ਲੋੜੀਂਦਾ ਸਿਰਾ-ਗੁਣਕ ਲਗਾਓ।";
  if (family === "relativeOrder") return hi ? "केवल आपसी क्रम दिया हो तो ब्लॉक न बनाइए; कुल क्रमों का बराबर वाला हिस्सा सीधे लीजिए।" : "ਸਿਰਫ਼ ਆਪਸੀ ਕ੍ਰਮ ਦਿੱਤਾ ਹੋਵੇ ਤਾਂ ਬਲਾਕ ਨਾ ਬਣਾਓ; ਕੁੱਲ ਕ੍ਰਮਾਂ ਦਾ ਬਰਾਬਰ ਵਾਲਾ ਹਿੱਸਾ ਸਿੱਧਾ ਲਵੋ।";
  if (family === "alternation") return hi ? "पहले रंग या वर्ग का स्थान-नमूना लिख लें; फिर हर वर्ग के फैक्टोरियल गुणा करें।" : "ਪਹਿਲਾਂ ਰੰਗ ਜਾਂ ਵਰਗ ਦੀਆਂ ਥਾਵਾਂ ਦਾ ਨਮੂਨਾ ਲਿਖ ਲਵੋ; ਫਿਰ ਹਰ ਵਰਗ ਦੇ ਫੈਕਟੋਰੀਅਲ ਗੁਣਾ ਕਰੋ।";
  if (family === "separation") return hi ? "बड़े समूह को पहले सजाकर बने खाली स्थानों में से अलग स्थान चुनना सबसे तेज़ तरीका है।" : "ਵੱਡੇ ਗਰੁੱਪ ਨੂੰ ਪਹਿਲਾਂ ਲਗਾ ਕੇ ਬਣੀਆਂ ਖਾਲੀ ਥਾਵਾਂ ਵਿੱਚੋਂ ਵੱਖਰੀਆਂ ਥਾਵਾਂ ਚੁਣਨਾ ਸਭ ਤੋਂ ਤੇਜ਼ ਤਰੀਕਾ ਹੈ।";
  if (family === "distance") return hi ? "बीच में लोगों की संख्या हो तो स्थान-अंतर में एक जोड़ें; फिर मान्य आरंभिक स्थान तुरंत गिनें।" : "ਵਿਚਕਾਰ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ ਹੋਵੇ ਤਾਂ ਥਾਂ-ਫਰਕ ਵਿੱਚ ਇੱਕ ਜੋੜੋ; ਫਿਰ ਸਹੀ ਸ਼ੁਰੂਆਤੀ ਥਾਵਾਂ ਤੁਰੰਤ ਗਿਣੋ।";
  if (family === "positionClass") return hi ? "विषम और सम स्थानों की संख्या पहले किनारे लिखें; फिर चयन और क्रम के चरण अलग रखें।" : "ਟਾਂਕ ਅਤੇ ਜੋੜ ਥਾਵਾਂ ਦੀ ਗਿਣਤੀ ਪਹਿਲਾਂ ਪਾਸੇ ਲਿਖੋ; ਫਿਰ ਚੋਣ ਅਤੇ ਕ੍ਰਮ ਦੇ ਕਦਮ ਵੱਖ ਰੱਖੋ।";
  return hi ? "छोटी सीमा में हर संभव दूरी की एक पंक्ति बनाकर परिणाम मिलाना बीजगणित से तेज़ है।" : "ਛੋਟੀ ਹੱਦ ਵਿੱਚ ਹਰ ਸੰਭਵ ਫਾਸਲੇ ਦੀ ਇੱਕ ਕਤਾਰ ਬਣਾ ਕੇ ਨਤੀਜਾ ਮਿਲਾਉਣਾ ਬੀਜਗਣਿਤ ਤੋਂ ਤੇਜ਼ ਹੈ।";
}

function localizedShortcut(
  english: PncStudentExplanationSection,
  qlId: string,
  locale: PncStudentLocale,
): PncStudentExplanationSection {
  const tokens = mathTokens(english.lines.join("\n"));
  const formula = formulaPhrase(tokens, locale);
  return {
    kind: "examSpeedShortcut",
    heading: localizedSectionHeading("examSpeedShortcut", locale),
    lines: [`${shortcutLead(qlId, locale)}${formula ? ` ${formula}` : ""}`],
  };
}

function optionIndexFromEnglishTrap(line: string, fallback: number): number {
  const match = line.match(/Option\s+([A-D])/i);
  if (!match) return fallback;
  return match[1]!.toUpperCase().charCodeAt(0) - 65;
}

function localizedTraps(
  english: PncStudentExplanationSection,
  qlId: string,
  displayOptions: string[],
  correctIndex: number,
  locale: PncStudentLocale,
): PncStudentExplanationSection {
  const wrongIndices = [0, 1, 2, 3].filter((index) => index !== correctIndex);
  const messages = TRAP_TEXT[familyFor(qlId)][locale];
  return {
    kind: "commonTrapWarning",
    heading: localizedSectionHeading("commonTrapWarning", locale),
    lines: english.lines.map((line, index) => {
      const fallback = wrongIndices[index] ?? wrongIndices[0] ?? 0;
      const optionIndex = optionIndexFromEnglishTrap(line, fallback);
      const letter = String.fromCharCode(65 + optionIndex);
      const prefix = locale === "hi-IN" ? `विकल्प ${letter}` : `ਚੋਣ ${letter}`;
      const formula = formulaPhrase(mathTokens(line), locale);
      return `${prefix} (${displayOptions[optionIndex]!}): ${messages[index % messages.length]!}${formula ? ` ${formula}` : ""}`;
    }),
  };
}

export function buildPnc002Cp008LocalizedPresentation(
  source: PncStudentSourcePackage,
  locale: PncStudentLocale,
): PncLocalizedStudentPresentation {
  if (source.canonicalProblemId !== "PNC-CP-008") {
    throw new Error(`${source.questionLanguageId}: CP-008 localization received ${source.canonicalProblemId}`);
  }
  const numericId = Number(source.questionLanguageId.slice(-3));
  if (!Number.isInteger(numericId) || numericId < 125 || numericId > 147) {
    throw new Error(`${source.questionLanguageId}: outside CP-008 localization range`);
  }

  const english = buildPnc002ProductionTeacherStudentPresentation(source);
  const displayOptions = source.options.map((option) => formatLocalizedOption(option, english.optionUnit, locale));
  const answerLabel = displayOptions[source.correctIndex]!;
  const answerNumeric = parsePositiveInteger(source.answer);
  const coreTitle = CORE_TITLES[source.questionLanguageId]?.[locale];
  if (!coreTitle) throw new Error(`${source.questionLanguageId}: CP-008 core title is missing`);

  const englishSteps = getSection(english.explanationSections, "stepByStep");
  const englishShortcut = getSection(english.explanationSections, "examSpeedShortcut");
  const englishTraps = getSection(english.explanationSections, "commonTrapWarning");

  return {
    ...english,
    locale,
    sourceLocale: "en-GB",
    stem: localizedStem(english.stem, source.questionLanguageId, locale),
    optionUnit: localizedUnitLabel(english.optionUnit, answerNumeric, locale),
    displayOptions,
    answerLabel,
    explanationSections: [
      {
        kind: "coreConcept",
        heading: locale === "hi-IN" ? `📌 मूल अवधारणा — ${coreTitle}` : `📌 ਮੁੱਖ ਵਿਚਾਰ — ${coreTitle}`,
        lines: [...CORE_LINES[familyFor(source.questionLanguageId)][locale]],
      },
      localizedSteps(englishSteps, source.questionLanguageId, answerLabel, locale),
      localizedShortcut(englishShortcut, source.questionLanguageId, locale),
      localizedTraps(englishTraps, source.questionLanguageId, displayOptions, source.correctIndex, locale),
    ],
    editorialStatus: "PENDING",
    publiclyPublishable: false,
  };
}
