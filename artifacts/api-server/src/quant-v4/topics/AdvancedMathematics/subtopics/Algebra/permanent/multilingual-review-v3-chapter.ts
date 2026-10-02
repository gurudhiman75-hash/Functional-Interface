import { formatRational } from "../../../../../shared/algebra";
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

function localizeCp003Target(english: any, locale: AlgReviewLocale) {
  const state = english.v4RawCandidate?.state ?? english.state ?? {};
  const frame = ((Number(english.seed) % 4) + 4) % 4;

  if (english.prototypeId === "ALG-CP003-CAND-004" && state.kind === "ZERO_SUM_PAIRWISE") {
    const s = String(state.squareSum);
    const questionFrames = locale === "hi-IN"
      ? [
          `यदि a + b + c = 0 तथा a² + b² + c² = ${s}, तो ab + bc + ca ज्ञात कीजिए।`,
          `a + b + c = 0 और a² + b² + c² = ${s} दिया है। ab + bc + ca का मान क्या है?`,
          `a + b + c = 0 तथा a² + b² + c² = ${s} के लिए ab + bc + ca ज्ञात कीजिए।`,
          `चर a, b और c के लिए a + b + c = 0 तथा a² + b² + c² = ${s} है। ab + bc + ca का मान ज्ञात कीजिए।`,
        ]
      : [
          `ਜੇ a + b + c = 0 ਅਤੇ a² + b² + c² = ${s}, ਤਾਂ ab + bc + ca ਪਤਾ ਕਰੋ।`,
          `a + b + c = 0 ਅਤੇ a² + b² + c² = ${s} ਦਿੱਤਾ ਹੈ। ab + bc + ca ਦਾ ਮਾਨ ਕੀ ਹੈ?`,
          `a + b + c = 0 ਅਤੇ a² + b² + c² = ${s} ਲਈ ab + bc + ca ਪਤਾ ਕਰੋ।`,
          `ਚਰ a, b ਅਤੇ c ਲਈ a + b + c = 0 ਅਤੇ a² + b² + c² = ${s} ਹੈ। ab + bc + ca ਦਾ ਮਾਨ ਪਤਾ ਕਰੋ।`,
        ];
    const answer = String(english.answerText ?? english.canonicalAnswer ?? "");
    const explanation = locale === "hi-IN"
      ? [
          "सर्वसमिका (a + b + c)² = a² + b² + c² + 2(ab + bc + ca) का उपयोग करें।",
          `यहाँ a + b + c = 0 है, इसलिए बायाँ पक्ष 0 है। अतः 0 = ${s} + 2(ab + bc + ca)।`,
          `इससे 2(ab + bc + ca) = -${s} और ab + bc + ca = ${answer}।`,
        ].join(" ")
      : [
          "ਸਰਵਸਮਿਕਾ (a + b + c)² = a² + b² + c² + 2(ab + bc + ca) ਵਰਤੋ।",
          `ਇੱਥੇ a + b + c = 0 ਹੈ, ਇਸ ਲਈ ਖੱਬਾ ਪਾਸਾ 0 ਹੈ। ਇਸ ਕਰਕੇ 0 = ${s} + 2(ab + bc + ca)।`,
          `ਇਸ ਤੋਂ 2(ab + bc + ca) = -${s} ਅਤੇ ab + bc + ca = ${answer}।`,
        ].join(" ");
    return { question: questionFrames[frame]!, explanation };
  }

  if (english.prototypeId === "ALG-CP003-CAND-006" && state.kind === "CYCLIC_RECIPROCAL") {
    const q = String(state.q);
    const k = String(state.squareCoefficient);
    const questionFrames = locale === "hi-IN"
      ? [
          `यदि a + ${k}/b = ${q} तथा b + ${k}/c = ${q}, तो c + ${k}/a ज्ञात कीजिए।`,
          `a + ${k}/b = ${q} और b + ${k}/c = ${q} दिया है। c + ${k}/a का मान ज्ञात कीजिए।`,
          `संबंध a + ${k}/b = ${q} तथा b + ${k}/c = ${q} सत्य हैं। c + ${k}/a का मान क्या है?`,
          `a, b और c शून्येतर हैं तथा a + ${k}/b = ${q}, b + ${k}/c = ${q}। c + ${k}/a ज्ञात कीजिए।`,
        ]
      : [
          `ਜੇ a + ${k}/b = ${q} ਅਤੇ b + ${k}/c = ${q}, ਤਾਂ c + ${k}/a ਪਤਾ ਕਰੋ।`,
          `a + ${k}/b = ${q} ਅਤੇ b + ${k}/c = ${q} ਦਿੱਤਾ ਹੈ। c + ${k}/a ਦਾ ਮਾਨ ਪਤਾ ਕਰੋ।`,
          `ਸੰਬੰਧ a + ${k}/b = ${q} ਅਤੇ b + ${k}/c = ${q} ਸਹੀ ਹਨ। c + ${k}/a ਦਾ ਮਾਨ ਕੀ ਹੈ?`,
          `a, b ਅਤੇ c ਸਿਫ਼ਰ ਤੋਂ ਵੱਖ ਹਨ ਅਤੇ a + ${k}/b = ${q}, b + ${k}/c = ${q}। c + ${k}/a ਪਤਾ ਕਰੋ।`,
        ];
    const explanation = locale === "hi-IN"
      ? [
          `पहले संबंध a + ${k}/b = ${q} से b = ${k}/(${q} - a) मिलता है।`,
          `इस मान को b + ${k}/c = ${q} में रखने और सरल करने पर c = ${q} - ${k}/a मिलता है।`,
          `अतः c + ${k}/a = ${q}।`,
        ].join(" ")
      : [
          `ਪਹਿਲੇ ਸੰਬੰਧ a + ${k}/b = ${q} ਤੋਂ b = ${k}/(${q} - a) ਮਿਲਦਾ ਹੈ।`,
          `ਇਸ ਮਾਨ ਨੂੰ b + ${k}/c = ${q} ਵਿੱਚ ਰੱਖ ਕੇ ਸਰਲ ਕਰਨ ਤੇ c = ${q} - ${k}/a ਮਿਲਦਾ ਹੈ।`,
          `ਇਸ ਲਈ c + ${k}/a = ${q}।`,
        ].join(" ");
    return { question: questionFrames[frame]!, explanation };
  }

  return null;
}

function localizeCp011Target(english: any, locale: AlgReviewLocale) {
  if (english.prototypeId !== "ALG-CP011-CAND-005") return null;
  const raw = english.v4RawCandidate ?? {};
  const equationX = raw.equationX;
  const equationY = raw.equationY;
  if (!equationX || !equationY) return null;

  const eq = (e: any, v: "x" | "y") =>
    `${formatRational(e.a)}${v}² + ${formatRational(e.b)}${v} + ${formatRational(e.c)} = 0`;

  const question = locale === "hi-IN"
    ? `निम्न दोनों समीकरणों को हल करके x और y की तुलना कीजिए।\nसमीकरण I: ${eq(equationX, "x")}\nसमीकरण II: ${eq(equationY, "y")}`
    : `ਹੇਠਾਂ ਦਿੱਤੇ ਦੋਵੇਂ ਸਮੀਕਰਨ ਹੱਲ ਕਰਕੇ x ਅਤੇ y ਦੀ ਤੁਲਨਾ ਕਰੋ।\nਸਮੀਕਰਨ I: ${eq(equationX, "x")}\nਸਮੀਕਰਨ II: ${eq(equationY, "y")}`;

  const explanation = locale === "hi-IN"
    ? "दोनों द्विघात समीकरण पूर्ण वर्ग हैं। समीकरण I से x का एक ही मूल मिलता है और समीकरण II से y का भी वही एकमात्र मूल मिलता है। इसलिए x = y।"
    : "ਦੋਵੇਂ ਦੋ-ਘਾਤੀ ਸਮੀਕਰਨ ਪੂਰਨ ਵਰਗ ਹਨ। ਸਮੀਕਰਨ I ਤੋਂ x ਦਾ ਇਕੋ ਮੂਲ ਮਿਲਦਾ ਹੈ ਅਤੇ ਸਮੀਕਰਨ II ਤੋਂ y ਦਾ ਵੀ ਉਹੀ ਇਕੋ ਮੂਲ ਮਿਲਦਾ ਹੈ। ਇਸ ਲਈ x = y।";

  return { question, explanation };
}

function localizeCp009Target(english: any, locale: AlgReviewLocale) {
  if (english.prototypeId !== "ALG-CP009-CAND-005") return null;
  const raw = english.v4RawCandidate ?? {};
  const equation = raw.equation;
  if (!equation) return null;

  const a = formatRational(equation.a);
  const b = formatRational(equation.b);
  const cTerm = formatRational(equation.c);
  const parameterValue = String(raw.answerText ?? "");
  const question = locale === "hi-IN"
    ? `k के किस मान पर ${a}x² + ${b}x + ${cTerm} = 0 के समान मूल होंगे?`
    : `k ਦੇ ਕਿਹੜੇ ਮਾਨ ਲਈ ${a}x² + ${b}x + ${cTerm} = 0 ਦੇ ਬਰਾਬਰ ਮੂਲ ਹੋਣਗੇ?`;

  const explanation = locale === "hi-IN"
    ? [
        "समान मूलों के लिए विविक्तकर शून्य होना चाहिए: D = b² - 4ac = 0।",
        `दिए गए द्विघात में a = ${a} और b = ${b} है। विविक्तकर में मान रखने पर k के लिए एक रैखिक समीकरण प्राप्त होता है।`,
        `इसे हल करने पर k = ${parameterValue} मिलता है। यही समान मूलों की शर्त को संतुष्ट करता है।`,
      ].join(" ")
    : [
        "ਬਰਾਬਰ ਮੂਲਾਂ ਲਈ ਵਿਭੇਦਕ ਸਿਫ਼ਰ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ: D = b² - 4ac = 0।",
        `ਦਿੱਤੇ ਦੋ-ਘਾਤੀ ਵਿੱਚ a = ${a} ਅਤੇ b = ${b} ਹੈ। ਵਿਭੇਦਕ ਵਿੱਚ ਮਾਨ ਰੱਖਣ ਤੇ k ਲਈ ਇੱਕ ਰੇਖੀ ਸਮੀਕਰਨ ਮਿਲਦਾ ਹੈ।`,
        `ਇਸ ਨੂੰ ਹੱਲ ਕਰਨ ਤੇ k = ${parameterValue} ਮਿਲਦਾ ਹੈ। ਇਹੀ ਬਰਾਬਰ ਮੂਲਾਂ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦਾ ਹੈ।`,
      ].join(" ");

  return { question, explanation };
}

function localizeCp007Target(english: any, locale: AlgReviewLocale) {
  const raw = english.v4RawCandidate ?? {};
  const system = raw.system;
  if (!system || !["ALG-CP007-CAND-005", "ALG-CP007-CAND-006"].includes(english.prototypeId)) return null;

  const a1 = formatRational(system.a1), b1 = formatRational(system.b1), c1 = formatRational(system.c1);
  const a2 = formatRational(system.a2), b2 = formatRational(system.b2), c2 = formatRational(system.c2);
  const question = locale === "hi-IN"
    ? `निम्न समीकरण-युग्म की प्रकृति बताइए: ${a1}x + ${b1}y = ${c1} और ${a2}x + ${b2}y = ${c2}।`
    : `ਹੇਠਾਂ ਦਿੱਤੇ ਸਮੀਕਰਨ-ਜੋੜ ਦੀ ਪ੍ਰਕਿਰਤੀ ਦੱਸੋ: ${a1}x + ${b1}y = ${c1} ਅਤੇ ${a2}x + ${b2}y = ${c2}।`;

  const noSolution = english.prototypeId === "ALG-CP007-CAND-005";
  const explanation = locale === "hi-IN"
    ? (noSolution
        ? "दोनों समीकरणों में x और y के गुणांकों का अनुपात समान है, लेकिन नियत पदों का अनुपात समान नहीं है। इसलिए दोनों रेखाएँ समांतर और भिन्न हैं। अतः इस समीकरण-युग्म का कोई हल नहीं है।"
        : "दोनों समीकरणों में x, y और नियत पद—तीनों के अनुपात समान हैं। इसलिए दोनों समीकरण एक ही रेखा को दर्शाते हैं। अतः इस समीकरण-युग्म के अनंत हल हैं।")
    : (noSolution
        ? "ਦੋਵੇਂ ਸਮੀਕਰਨਾਂ ਵਿੱਚ x ਅਤੇ y ਦੇ ਗੁਣਾਂਕਾਂ ਦਾ ਅਨੁਪਾਤ ਇੱਕੋ ਹੈ, ਪਰ ਅਚਲ ਪਦਾਂ ਦਾ ਅਨੁਪਾਤ ਇੱਕੋ ਨਹੀਂ ਹੈ। ਇਸ ਲਈ ਦੋਵੇਂ ਰੇਖਾਵਾਂ ਸਮਾਂਤਰ ਅਤੇ ਵੱਖਰੀਆਂ ਹਨ। ਇਸ ਕਰਕੇ ਇਸ ਸਮੀਕਰਨ-ਜੋੜ ਦਾ ਕੋਈ ਹੱਲ ਨਹੀਂ ਹੈ।"
        : "ਦੋਵੇਂ ਸਮੀਕਰਨਾਂ ਵਿੱਚ x, y ਅਤੇ ਅਚਲ ਪਦ—ਤਿੰਨਾਂ ਦੇ ਅਨੁਪਾਤ ਇੱਕੋ ਹਨ। ਇਸ ਲਈ ਦੋਵੇਂ ਸਮੀਕਰਨ ਇੱਕੋ ਰੇਖਾ ਨੂੰ ਦਰਸਾਉਂਦੇ ਹਨ। ਇਸ ਕਰਕੇ ਇਸ ਸਮੀਕਰਨ-ਜੋੜ ਦੇ ਅਨੰਤ ਹੱਲ ਹਨ।");

  return { question, explanation };
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

  const cp003 = localizeCp003Target(english, locale);
  const cp007 = localizeCp007Target(english, locale);
  const cp009 = localizeCp009Target(english, locale);
  const cp011 = localizeCp011Target(english, locale);
  const question = cp003?.question ?? cp007?.question ?? cp009?.question ?? cp011?.question ?? localizeV4Question(english.question, locale);
  const explanation = cp003?.explanation ?? cp007?.explanation ?? cp009?.explanation ?? cp011?.explanation ?? english.explanation
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
