import type { AlgPermanentQlId } from "./allocation";
import {
  generateAlgPermanentMultilingualV2Frozen,
} from "./multilingual-freeze-v2";
import type { AlgReviewLocale } from "./multilingual-review-v1";
import { localizeAlgLearnerTextV2Draft } from "./multilingual-review-v2";
import {
  generateAlgPermanentEnglishV4ChapterReview,
  isAlgEnglishV4TargetPrototype,
} from "./english-review-v4-chapter";

export const ALG_MULTILINGUAL_V3_CHAPTER_REVIEW_AUTHORITY =
  "ALG-ML-v3-chapter-review-candidate" as const;

function pick(locale: AlgReviewLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function localizeV4Question(text: string, locale: AlgReviewLocale): string {
  let m: RegExpMatchArray | null;
  if ((m = text.match(/^If (.+), find (.+)\.$/))) return pick(locale, `यदि ${m[1]}, तो ${m[2]} ज्ञात कीजिए।`, `ਜੇ ${m[1]}, ਤਾਂ ${m[2]} ਪਤਾ ਕਰੋ।`);
  if ((m = text.match(/^Given (.+), what is the value of (.+)\?$/))) return pick(locale, `${m[1]} दिया है। ${m[2]} का मान ज्ञात कीजिए।`, `${m[1]} ਦਿੱਤਾ ਹੈ। ${m[2]} ਦਾ ਮਾਨ ਪਤਾ ਕਰੋ।`);
  if ((m = text.match(/^For x ≠ 0, (.+)\. Determine (.+)\.$/))) return pick(locale, `x ≠ 0 और ${m[1]}। ${m[2]} ज्ञात कीजिए।`, `x ≠ 0 ਅਤੇ ${m[1]}। ${m[2]} ਪਤਾ ਕਰੋ।`);
  if ((m = text.match(/^If x satisfies (.+), calculate (.+)\.$/))) return pick(locale, `यदि x, ${m[1]} को संतुष्ट करता है, तो ${m[2]} ज्ञात कीजिए।`, `ਜੇ x, ${m[1]} ਨੂੰ ਸੰਤੁਸ਼ਟ ਕਰਦਾ ਹੈ, ਤਾਂ ${m[2]} ਪਤਾ ਕਰੋ।`);
  if ((m = text.match(/^Given that (.+), find (.+)\.$/))) return pick(locale, `यदि ${m[1]}, तो ${m[2]} ज्ञात कीजिए।`, `ਜੇ ${m[1]}, ਤਾਂ ${m[2]} ਪਤਾ ਕਰੋ।`);
  if ((m = text.match(/^If (.+) while (.+), what is the value of (.+)\?$/))) return pick(locale, `यदि ${m[1]} तथा ${m[2]}, तो ${m[3]} का मान ज्ञात कीजिए।`, `ਜੇ ${m[1]} ਅਤੇ ${m[2]}, ਤਾਂ ${m[3]} ਦਾ ਮਾਨ ਪਤਾ ਕਰੋ।`);
  if ((m = text.match(/^For (.+), determine (.+)\.$/))) return pick(locale, `${m[1]} के लिए ${m[2]} ज्ञात कीजिए।`, `${m[1]} ਲਈ ${m[2]} ਪਤਾ ਕਰੋ।`);
  if ((m = text.match(/^Factorise (.+)\.$/))) return pick(locale, `${m[1]} का गुणनखंड कीजिए।`, `${m[1]} ਦੇ ਗੁਣਨਖੰਡ ਕਰੋ।`);
  if ((m = text.match(/^Which factorisation is correct for (.+)\?$/))) return pick(locale, `${m[1]} का सही गुणनखंड रूप कौन-सा है?`, `${m[1]} ਦਾ ਸਹੀ ਗੁਣਨਖੰਡ ਰੂਪ ਕਿਹੜਾ ਹੈ?`);
  if ((m = text.match(/^Write (.+) in factorised form\.$/))) return pick(locale, `${m[1]} को गुणनखंड रूप में लिखिए।`, `${m[1]} ਨੂੰ ਗੁਣਨਖੰਡ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`);
  if ((m = text.match(/^Factorise the algebraic expression (.+) completely\.$/))) return pick(locale, `बीजीय व्यंजक ${m[1]} का पूर्ण गुणनखंड कीजिए।`, `ਬੀਜਗਣਿਤੀ ਵਿਆੰਜਕ ${m[1]} ਦੇ ਪੂਰੇ ਗੁਣਨਖੰਡ ਕਰੋ।`);
  if ((m = text.match(/^For what value of k does (.+) have equal roots\?$/))) return pick(locale, `k के किस मान पर ${m[1]} के समान मूल होंगे?`, `k ਦੇ ਕਿਹੜੇ ਮਾਨ ਲਈ ${m[1]} ਦੇ ਬਰਾਬਰ ਮੂਲ ਹੋਣਗੇ?`);
  if ((m = text.match(/^Find k if the quadratic (.+) has a repeated root\.$/))) return pick(locale, `यदि द्विघात ${m[1]} के समान मूल हैं, तो k ज्ञात कीजिए।`, `ਜੇ ਦੋ-ਘਾਤੀ ${m[1]} ਦੇ ਬਰਾਬਰ ਮੂਲ ਹਨ, ਤਾਂ k ਪਤਾ ਕਰੋ।`);
  if ((m = text.match(/^Determine k so that (.+) has two equal real roots\.$/))) return pick(locale, `${m[1]} के दो समान वास्तविक मूल होने के लिए k ज्ञात कीजिए।`, `${m[1]} ਦੇ ਦੋ ਬਰਾਬਰ ਵਾਸਤਵਿਕ ਮੂਲ ਹੋਣ ਲਈ k ਪਤਾ ਕਰੋ।`);
  if ((m = text.match(/^If (.+) has equal roots, calculate the value of k\.$/))) return pick(locale, `यदि ${m[1]} के समान मूल हैं, तो k का मान ज्ञात कीजिए।`, `ਜੇ ${m[1]} ਦੇ ਬਰਾਬਰ ਮੂਲ ਹਨ, ਤਾਂ k ਦਾ ਮਾਨ ਪਤਾ ਕਰੋ।`);
  if ((m = text.match(/^If x, y and z are positive real numbers with (.+), find the (?:least|minimum) value of (.+)\.$/))) return pick(locale, `यदि x, y और z धनात्मक वास्तविक संख्याएँ हैं तथा ${m[1]}, तो ${m[2]} का न्यूनतम मान ज्ञात कीजिए।`, `ਜੇ x, y ਅਤੇ z ਧਨਾਤਮਕ ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ ਹਨ ਅਤੇ ${m[1]}, ਤਾਂ ${m[2]} ਦਾ ਘੱਟੋ-ਘੱਟ ਮਾਨ ਪਤਾ ਕਰੋ।`);
  if ((m = text.match(/^For positive real numbers x, y and z satisfying (.+), what is the (?:least|minimum) (?:possible )?value of (.+)\?$/))) return pick(locale, `धनात्मक वास्तविक x, y, z के लिए, जहाँ ${m[1]}, ${m[2]} का न्यूनतम मान क्या है?`, `ਧਨਾਤਮਕ ਵਾਸਤਵਿਕ x, y, z ਲਈ, ਜਿੱਥੇ ${m[1]}, ${m[2]} ਦਾ ਘੱਟੋ-ਘੱਟ ਮਾਨ ਕੀ ਹੈ?`);
  if ((m = text.match(/^Given x, y, z > 0 and (.+), determine the (?:least possible value of|minimum of) (.+)\.$/))) return pick(locale, `x, y, z > 0 और ${m[1]} दिया है। ${m[2]} का न्यूनतम मान ज्ञात कीजिए।`, `x, y, z > 0 ਅਤੇ ${m[1]} ਦਿੱਤਾ ਹੈ। ${m[2]} ਦਾ ਘੱਟੋ-ਘੱਟ ਮਾਨ ਪਤਾ ਕਰੋ।`);
  if ((m = text.match(/^The positive real numbers x, y and z have sum (.+)\. Find the (?:minimum|least) possible value of (.+)\.$/))) return pick(locale, `धनात्मक वास्तविक संख्याओं x, y और z का योग ${m[1]} है। ${m[2]} का न्यूनतम संभव मान ज्ञात कीजिए।`, `ਧਨਾਤਮਕ ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ x, y ਅਤੇ z ਦਾ ਜੋੜ ${m[1]} ਹੈ। ${m[2]} ਦਾ ਘੱਟੋ-ਘੱਟ ਸੰਭਵ ਮਾਨ ਪਤਾ ਕਰੋ।`);
  if (/^Solve the following equations and compare x and y\./.test(text)) return text.replace(/^Solve the following equations and compare x and y\./, pick(locale, "निम्न समीकरण हल करके x और y की तुलना कीजिए।", "ਹੇਠਲੇ ਸਮੀਕਰਨ ਹੱਲ ਕਰਕੇ x ਅਤੇ y ਦੀ ਤੁਲਨਾ ਕਰੋ।")).replace(/Equation I:/g,pick(locale,"समीकरण I:","ਸਮੀਕਰਨ I:")).replace(/Equation II:/g,pick(locale,"समीकरण II:","ਸਮੀਕਰਨ II:"));
  if (/^Find the relation between x and y for the equations below\./.test(text)) return text.replace(/^Find the relation between x and y for the equations below\./, pick(locale, "नीचे दिए समीकरणों से x और y के बीच संबंध ज्ञात कीजिए।", "ਹੇਠਲੇ ਸਮੀਕਰਨਾਂ ਤੋਂ x ਅਤੇ y ਵਿਚਲਾ ਸੰਬੰਧ ਪਤਾ ਕਰੋ।"));
  if (/^Which relation between x and y is correct after solving these equations\?/.test(text)) return text.replace(/^Which relation between x and y is correct after solving these equations\?/, pick(locale, "इन समीकरणों को हल करने पर x और y के बीच सही संबंध कौन-सा है?", "ਇਨ੍ਹਾਂ ਸਮੀਕਰਨਾਂ ਨੂੰ ਹੱਲ ਕਰਨ ਤੇ x ਅਤੇ y ਵਿਚਲਾ ਸਹੀ ਸੰਬੰਧ ਕਿਹੜਾ ਹੈ?"));
  if (/^Solve both equations and determine the relation between x and y\./.test(text)) return text.replace(/^Solve both equations and determine the relation between x and y\./, pick(locale, "दोनों समीकरण हल करके x और y के बीच संबंध ज्ञात कीजिए।", "ਦੋਵੇਂ ਸਮੀਕਰਨ ਹੱਲ ਕਰਕੇ x ਅਤੇ y ਵਿਚਲਾ ਸੰਬੰਧ ਪਤਾ ਕਰੋ।")).replace(/Equation I:/g,pick(locale,"समीकरण I:","ਸਮੀਕਰਨ I:")).replace(/Equation II:/g,pick(locale,"समीकरण II:","ਸਮੀਕਰਨ II:"));
  if (/^Is the value of x uniquely determined from the following statements\?/.test(text)) return text.replace(/^Is the value of x uniquely determined from the following statements\?/, pick(locale, "क्या निम्न कथनों से x का मान अद्वितीय रूप से निर्धारित किया जा सकता है?", "ਕੀ ਹੇਠਲੇ ਕਥਨਾਂ ਤੋਂ x ਦਾ ਮਾਨ ਇਕੋ ਤਰੀਕੇ ਨਾਲ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?"));
  if (/^Can the value of x be determined uniquely using the statements below\?/.test(text)) return text.replace(/^Can the value of x be determined uniquely using the statements below\?/, pick(locale, "क्या नीचे दिए कथनों से x का एकमात्र मान ज्ञात किया जा सकता है?", "ਕੀ ਹੇਠਾਂ ਦਿੱਤੇ ਕਥਨਾਂ ਤੋਂ x ਦਾ ਇਕੋ ਮਾਨ ਪਤਾ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?"));
  if (/^Which of the following statements is sufficient to determine x uniquely\?/.test(text)) return text.replace(/^Which of the following statements is sufficient to determine x uniquely\?/, pick(locale, "x का एकमात्र मान निर्धारित करने के लिए निम्न में से कौन-सा कथन पर्याप्त है?", "x ਦਾ ਇਕੋ ਮਾਨ ਨਿਰਧਾਰਤ ਕਰਨ ਲਈ ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਕਾਫ਼ੀ ਹੈ?"));
  if (/^Determine whether the given statements are sufficient to find a unique value of x\./.test(text)) return text.replace(/^Determine whether the given statements are sufficient to find a unique value of x\./, pick(locale, "निर्धारित कीजिए कि दिए गए कथन x का एकमात्र मान ज्ञात करने के लिए पर्याप्त हैं या नहीं।", "ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ਦਿੱਤੇ ਕਥਨ x ਦਾ ਇਕੋ ਮਾਨ ਪਤਾ ਕਰਨ ਲਈ ਕਾਫ਼ੀ ਹਨ ਜਾਂ ਨਹੀਂ।"));
  return localizeAlgLearnerTextV2Draft(text, locale);
}

function polishV4Explanation(text: string, locale: AlgReviewLocale): string {
  let value = text;
  const pairs: readonly [RegExp, string, string][] = [
    [/Square both sides:/g, "दोनों पक्षों का वर्ग करें:", "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦਾ ਵਰਗ ਕਰੋ:"],
    [/Cube the relation using/g, "संबंध का घन करने के लिए प्रयोग करें", "ਸੰਬੰਧ ਦਾ ਘਣ ਕਰਨ ਲਈ ਵਰਤੋ"],
    [/Now subtract 2 from both sides/g, "अब दोनों पक्षों से 2 घटाएँ", "ਹੁਣ ਦੋਵੇਂ ਪਾਸਿਆਂ ਤੋਂ 2 ਘਟਾਓ"],
    [/Add 2 to both sides/g, "दोनों पक्षों में 2 जोड़ें", "ਦੋਵੇਂ ਪਾਸਿਆਂ ਵਿੱਚ 2 ਜੋੜੋ"],
    [/Use the identity/g, "सर्वसमिका का उपयोग करें", "ਸਰਵਸਮਿਕਾ ਵਰਤੋ"],
    [/For equal roots, the discriminant must be zero/g, "समान मूलों के लिए विविक्तकर शून्य होना चाहिए", "ਬਰਾਬਰ ਮੂਲਾਂ ਲਈ ਵਿਭੇਦਕ ਸਿਫ਼ਰ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ"],
    [/Therefore the equation has no real solution\./g, "अतः समीकरण का कोई वास्तविक हल नहीं है।", "ਇਸ ਲਈ ਸਮੀਕਰਨ ਦਾ ਕੋਈ ਵਾਸਤਵਿਕ ਹੱਲ ਨਹੀਂ ਹੈ।"],
    [/For positive x, y and z, use the Cauchy inequality:/g, "धनात्मक x, y और z के लिए कॉशी असमानता का उपयोग करें:", "ਧਨਾਤਮਕ x, y ਅਤੇ z ਲਈ ਕਾਊਸ਼ੀ ਅਸਮਾਨਤਾ ਵਰਤੋ:"],
    [/Use the Cauchy inequality/g, "कॉशी असमानता का उपयोग करें", "ਕਾਊਸ਼ੀ ਅਸਮਾਨਤਾ ਵਰਤੋ"],
    [/Equation I gives/g, "समीकरण I से मिलता है", "ਸਮੀਕਰਨ I ਤੋਂ ਮਿਲਦਾ ਹੈ"],
    [/Equation II gives/g, "समीकरण II से मिलता है", "ਸਮੀਕਰਨ II ਤੋਂ ਮਿਲਦਾ ਹੈ"],
    [/Therefore/g, "अतः", "ਇਸ ਲਈ"],
    [/Hence/g, "अतः", "ਇਸ ਲਈ"],
  ];
  for (const [pattern, hi, pa] of pairs) value = value.replace(pattern, pick(locale, hi, pa));
  return localizeAlgLearnerTextV2Draft(value, locale);
}

function localeToLanguage(locale: AlgReviewLocale) {
  return locale === "hi-IN" ? "hi" as const : "pa" as const;
}

export function generateAlgPermanentMultilingualV3ChapterReview(
  qlId: AlgPermanentQlId,
  seed: number,
  locale: AlgReviewLocale,
  requestedVariantIndex?: number,
) {
  const baseline = generateAlgPermanentMultilingualV2Frozen(
    qlId,
    seed,
    locale,
    requestedVariantIndex,
  );
  const english = generateAlgPermanentEnglishV4ChapterReview(
    qlId,
    seed,
    requestedVariantIndex,
  );

  if (!isAlgEnglishV4TargetPrototype(english.prototypeId)) {
    return Object.freeze({
      ...baseline,
      chapterReviewAuthority: ALG_MULTILINGUAL_V3_CHAPTER_REVIEW_AUTHORITY,
      chapterReviewSource: "V2_FROZEN_UNCHANGED" as const,
      chapterReviewCandidate: false as const,
    });
  }

  const question = localizeV4Question(english.question, locale);
  const explanation = english.explanation
    .split(/\n+/)
    .map((line) => polishV4Explanation(line, locale))
    .join("\n");

  if (!question.trim() || !explanation.trim()) {
    throw new Error(`${english.prototypeId}/${locale}: V3 multilingual draft localization is empty`);
  }

  return Object.freeze({
    ...baseline,
    question,
    explanation,
    englishQuestion: english.question,
    englishExplanation: english.explanation,
    canonicalAnswer: english.canonicalAnswer,
    language: localeToLanguage(locale),
    locale,
    chapterReviewAuthority: ALG_MULTILINGUAL_V3_CHAPTER_REVIEW_AUTHORITY,
    chapterReviewSource: "V4_ENGLISH_TO_V3_MULTILINGUAL_DRAFT" as const,
    chapterReviewCandidate: true as const,
    localizedLearnerContentFrozen: false as const,
    multilingualImplementationFrozen: false as const,
    maturity: "MULTILINGUAL_V3_CHAPTER_REVIEW_CANDIDATE" as const,
    reviewStatus: "HUMAN_LOCALIZATION_REVIEW_REQUIRED" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  });
}
