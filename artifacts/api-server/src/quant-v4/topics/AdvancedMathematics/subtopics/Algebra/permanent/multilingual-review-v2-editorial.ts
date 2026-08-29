import type { AlgPermanentQlId } from "./allocation";
import {
  generateAlgPermanentMultilingualReviewV2 as generateV2,
  type AlgPermanentMultilingualReviewV2Item,
} from "./multilingual-review-v2";
import type { AlgReviewLocale } from "./multilingual-review-v1";

type Pair = readonly [hi: string, pa: string];
function t(locale: AlgReviewLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function directQuestion(locale: AlgReviewLocale, prototypeId: string, english: string, fallback: string): string {
  let m: RegExpMatchArray | null;

  if ((m = english.match(/^Factorise (.+)\.$/))) return t(locale, `${m[1]} का गुणनखंड कीजिए।`, `${m[1]} ਦੇ ਗੁਣਨਖੰਡ ਕਰੋ।`);
  if ((m = english.match(/^Find the remainder when (.+) is divided by (.+)\.$/))) return t(locale, `${m[1]} को ${m[2]} से भाग देने पर शेषफल ज्ञात कीजिए।`, `${m[1]} ਨੂੰ ${m[2]} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ਪਤਾ ਕਰੋ।`);
  if ((m = english.match(/^Is (.+) a factor of (.+)\?$/))) return t(locale, `क्या ${m[1]}, ${m[2]} का गुणनखंड है?`, `ਕੀ ${m[1]}, ${m[2]} ਦਾ ਗੁਣਨਖੰਡ ਹੈ?`);
  if ((m = english.match(/^Solve for x: (.+)\.$/))) return t(locale, `x के लिए हल कीजिए: ${m[1]}।`, `x ਲਈ ਹੱਲ ਕਰੋ: ${m[1]}।`);
  if ((m = english.match(/^Solve the system: (.+)\.$/))) return t(locale, `समीकरण-तंत्र हल कीजिए: ${m[1]}।`, `ਸਮੀਕਰਨ-ਤੰਤਰ ਹੱਲ ਕਰੋ: ${m[1]}।`);
  if ((m = english.match(/^Solve (.+)\.$/))) return t(locale, `${m[1]} को हल कीजिए।`, `${m[1]} ਨੂੰ ਹੱਲ ਕਰੋ।`);
  if ((m = english.match(/^Classify the system: (.+)\.$/))) return t(locale, `समीकरण-तंत्र का प्रकार बताइए: ${m[1]}।`, `ਸਮੀਕਰਨ-ਤੰਤਰ ਦੀ ਕਿਸਮ ਦੱਸੋ: ${m[1]}।`);
  if ((m = english.match(/^For what value of k does the system (.+) have no solution\?$/))) return t(locale, `k के किस मान पर समीकरण-तंत्र ${m[1]} का कोई हल नहीं होगा?`, `k ਦੇ ਕਿਹੜੇ ਮਾਨ ਲਈ ਸਮੀਕਰਨ-ਤੰਤਰ ${m[1]} ਦਾ ਕੋਈ ਹੱਲ ਨਹੀਂ ਹੋਵੇਗਾ?`);
  if ((m = english.match(/^In the algebraic fraction (.+), which value of x is not allowed\?$/))) return t(locale, `बीजीय भिन्न ${m[1]} में x का कौन-सा मान मान्य नहीं है?`, `ਬੀਜਗਣਿਤੀ ਭਿੰਨ ${m[1]} ਵਿੱਚ x ਦਾ ਕਿਹੜਾ ਮਾਨ ਮਨਜ਼ੂਰ ਨਹੀਂ ਹੈ?`);
  if ((m = english.match(/^Describe the solution set of (.+)\.$/))) return t(locale, `${m[1]} का हल-समुच्चय बताइए।`, `${m[1]} ਦਾ ਹੱਲ-ਸਮੂਹ ਦੱਸੋ।`);
  if ((m = english.match(/^How many real roots does (.+) have\?$/))) return t(locale, `${m[1]} के कितने वास्तविक मूल हैं?`, `${m[1]} ਦੇ ਕਿੰਨੇ ਵਾਸਤਵਿਕ ਮੂਲ ਹਨ?`);
  if ((m = english.match(/^For what value of k does (.+) have equal roots\?$/))) return t(locale, `k के किस मान पर ${m[1]} के समान मूल होंगे?`, `k ਦੇ ਕਿਹੜੇ ਮਾਨ ਲਈ ${m[1]} ਦੇ ਬਰਾਬਰ ਮੂਲ ਹੋਣਗੇ?`);
  if ((m = english.match(/^(.+) and give the roots in exact form\.$/))) return t(locale, `${m[1]} को हल कीजिए और मूलों को सटीक रूप में लिखिए।`, `${m[1]} ਨੂੰ ਹੱਲ ਕਰੋ ਅਤੇ ਮੂਲਾਂ ਨੂੰ ਸਹੀ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`);
  if ((m = english.match(/^x = (.+) is a root of (.+)\. Find k\.$/))) return t(locale, `x = ${m[1]}, ${m[2]} का एक मूल है। k ज्ञात कीजिए।`, `x = ${m[1]}, ${m[2]} ਦਾ ਇੱਕ ਮੂਲ ਹੈ। k ਪਤਾ ਕਰੋ।`);
  if ((m = english.match(/^x = (.+) is a solution of (.+)\. Find k\.$/))) return t(locale, `x = ${m[1]}, समीकरण ${m[2]} का एक हल है। k ज्ञात कीजिए।`, `x = ${m[1]}, ਸਮੀਕਰਨ ${m[2]} ਦਾ ਇੱਕ ਹੱਲ ਹੈ। k ਪਤਾ ਕਰੋ।`);
  if ((m = english.match(/^(.+) is a factor of (.+)\. Find k\.$/))) return t(locale, `${m[1]}, ${m[2]} का गुणनखंड है। k ज्ञात कीजिए।`, `${m[1]}, ${m[2]} ਦਾ ਗੁਣਨਖੰਡ ਹੈ। k ਪਤਾ ਕਰੋ।`);
  if ((m = english.match(/^(.+) leaves remainder (.+) when divided by (.+)\. Find k\.$/))) return t(locale, `${m[1]} को ${m[3]} से भाग देने पर शेषफल ${m[2]} मिलता है। k ज्ञात कीजिए।`, `${m[1]} ਨੂੰ ${m[3]} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${m[2]} ਮਿਲਦਾ ਹੈ। k ਪਤਾ ਕਰੋ।`);
  if ((m = english.match(/^(.+); (.+) is a factor and division by (.+) leaves remainder (.+)\. Find k and m\.$/))) return t(locale, `${m[1]}; ${m[2]} इसका गुणनखंड है और ${m[3]} से भाग देने पर शेषफल ${m[4]} मिलता है। k और m ज्ञात कीजिए।`, `${m[1]}; ${m[2]} ਇਸ ਦਾ ਗੁਣਨਖੰਡ ਹੈ ਅਤੇ ${m[3]} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${m[4]} ਮਿਲਦਾ ਹੈ। k ਅਤੇ m ਪਤਾ ਕਰੋ।`);
  if ((m = english.match(/^The polynomials (.+) and (.+) leave the same remainder when divided by (.+)\. Find k and the common remainder\.$/))) return t(locale, `बहुपद ${m[1]} और ${m[2]} को ${m[3]} से भाग देने पर समान शेषफल मिलता है। k और वह समान शेषफल ज्ञात कीजिए।`, `ਬਹੁਪਦ ${m[1]} ਅਤੇ ${m[2]} ਨੂੰ ${m[3]} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਇੱਕੋ ਬਾਕੀ ਮਿਲਦਾ ਹੈ। k ਅਤੇ ਉਹ ਸਾਂਝਾ ਬਾਕੀ ਪਤਾ ਕਰੋ।`);
  if ((m = english.match(/^How many integer values of x satisfy (.+)\?$/))) return t(locale, `${m[1]} को संतुष्ट करने वाले x के कितने पूर्णांक मान हैं?`, `${m[1]} ਨੂੰ ਸੰਤੁਸ਼ਟ ਕਰਨ ਵਾਲੇ x ਦੇ ਕਿੰਨੇ ਪੂਰਨ ਅੰਕ ਮਾਨ ਹਨ?`);
  if ((m = english.match(/^Quantity I can take either (.+) or (.+)\. Quantity II can take either (.+) or (.+)\. Compare the quantities using all admissible cases\.$/))) return t(locale, `राशि I का मान ${m[1]} या ${m[2]} हो सकता है। राशि II का मान ${m[3]} या ${m[4]} हो सकता है। सभी मान्य स्थितियों में दोनों राशियों की तुलना कीजिए।`, `ਰਾਸ਼ੀ I ਦਾ ਮਾਨ ${m[1]} ਜਾਂ ${m[2]} ਹੋ ਸਕਦਾ ਹੈ। ਰਾਸ਼ੀ II ਦਾ ਮਾਨ ${m[3]} ਜਾਂ ${m[4]} ਹੋ ਸਕਦਾ ਹੈ। ਸਾਰੀਆਂ ਮਨਜ਼ੂਰ ਸਥਿਤੀਆਂ ਵਿੱਚ ਦੋਵੇਂ ਰਾਸ਼ੀਆਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।`);
  if (english.startsWith("Is the value of x uniquely determined?")) {
    const rest = english.slice("Is the value of x uniquely determined?".length);
    return t(locale, `क्या x का मान अद्वितीय रूप से निर्धारित होता है?${rest}`, `ਕੀ x ਦਾ ਮਾਨ ਇਕੋ ਤਰੀਕੇ ਨਾਲ ਨਿਰਧਾਰਤ ਹੁੰਦਾ ਹੈ?${rest}`);
  }
  if ((m = english.match(/^For what values of k is (.+) for every real x\?$/))) return t(locale, `k के किन मानों पर ${m[1]} प्रत्येक वास्तविक x के लिए सत्य है?`, `k ਦੇ ਕਿਹੜੇ ਮਾਨਾਂ ਲਈ ${m[1]} ਹਰ ਵਾਸਤਵਿਕ x ਲਈ ਸੱਚ ਹੈ?`);

  if (prototypeId === "ALG-CP010-CAND-012") {
    if ((m = english.match(/^α, β and γ are the roots of (.+)\. Find (.+)\.$/))) return t(locale, `α, β और γ, ${m[1]} के मूल हैं। ${m[2]} ज्ञात कीजिए।`, `α, β ਅਤੇ γ, ${m[1]} ਦੇ ਮੂਲ ਹਨ। ${m[2]} ਪਤਾ ਕਰੋ।`);
  }

  return fallback;
}

function whyFor(locale: AlgReviewLocale, prototypeId: string, englishExplanation: string, current: string): string | null {
  if (prototypeId === "ALG-CP010-CAND-012") {
    if (/Required: α \+ β \+ γ\./.test(englishExplanation)) return t(locale,
      "यह विधि क्यों: घन समीकरण में मूलों का योग वीटा से सीधे α + β + γ = -B/A मिलता है; अलग-अलग मूल निकालने की आवश्यकता नहीं है।",
      "ਇਹ ਵਿਧੀ ਕਿਉਂ: ਘਣ ਸਮੀਕਰਨ ਵਿੱਚ ਮੂਲਾਂ ਦਾ ਜੋੜ ਵੀਏਟਾ ਤੋਂ ਸਿੱਧਾ α + β + γ = -B/A ਮਿਲਦਾ ਹੈ; ਵੱਖ-ਵੱਖ ਮੂਲ ਕੱਢਣ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।");
    if (/Required: αβ \+ βγ \+ γα\./.test(englishExplanation)) return t(locale,
      "यह विधि क्यों: घन समीकरण में मूलों के युग्म-गुणनफलों का योग वीटा से सीधे αβ + βγ + γα = C/A मिलता है; अलग-अलग मूल निकालने की आवश्यकता नहीं है।",
      "ਇਹ ਵਿਧੀ ਕਿਉਂ: ਘਣ ਸਮੀਕਰਨ ਵਿੱਚ ਮੂਲਾਂ ਦੇ ਜੋੜਾ-ਗੁਣਨਫਲਾਂ ਦਾ ਜੋੜ ਵੀਏਟਾ ਤੋਂ ਸਿੱਧਾ αβ + βγ + γα = C/A ਮਿਲਦਾ ਹੈ; ਵੱਖ-ਵੱਖ ਮੂਲ ਕੱਢਣ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।");
    if (/Required: αβγ\./.test(englishExplanation)) return t(locale,
      "यह विधि क्यों: घन समीकरण में मूलों का गुणनफल वीटा से सीधे αβγ = -D/A मिलता है; अलग-अलग मूल निकालने की आवश्यकता नहीं है।",
      "ਇਹ ਵਿਧੀ ਕਿਉਂ: ਘਣ ਸਮੀਕਰਨ ਵਿੱਚ ਮੂਲਾਂ ਦਾ ਗੁਣਨਫਲ ਵੀਏਟਾ ਤੋਂ ਸਿੱਧਾ αβγ = -D/A ਮਿਲਦਾ ਹੈ; ਵੱਖ-ਵੱਖ ਮੂਲ ਕੱਢਣ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।");
  }
  if (prototypeId === "ALG-CP012-CAND-009") {
    const e = englishExplanation;
    if (/stay positive for every real x/i.test(e)) return t(locale,
      "यह विधि क्यों: द्विघात प्रत्येक वास्तविक x के लिए धनात्मक रहना चाहिए। परवलय ऊपर खुलना चाहिए और x-अक्ष को छूना भी नहीं चाहिए; इसलिए D < 0 आवश्यक है।",
      "ਇਹ ਵਿਧੀ ਕਿਉਂ: ਦੋ-ਘਾਤੀ ਹਰ ਵਾਸਤਵਿਕ x ਲਈ ਧਨਾਤਮਕ ਰਹਿਣਾ ਚਾਹੀਦਾ ਹੈ। ਪਰਾਬੋਲਾ ਉੱਪਰ ਖੁੱਲ੍ਹਣਾ ਚਾਹੀਦਾ ਹੈ ਅਤੇ x-ਅਕਸ ਨੂੰ ਛੂਹਣਾ ਵੀ ਨਹੀਂ ਚਾਹੀਦਾ; ਇਸ ਲਈ D < 0 ਲਾਜ਼ਮੀ ਹੈ।");
    if (/stay non-negative for every real x/i.test(e)) return t(locale,
      "यह विधि क्यों: द्विघात प्रत्येक वास्तविक x के लिए ऋणेतर रहना चाहिए। परवलय ऊपर खुलता है और x-अक्ष को छू सकता है, पर काट नहीं सकता; इसलिए D ≤ 0 आवश्यक है।",
      "ਇਹ ਵਿਧੀ ਕਿਉਂ: ਦੋ-ਘਾਤੀ ਹਰ ਵਾਸਤਵਿਕ x ਲਈ ਗੈਰ-ਰਣਾਤਮਕ ਰਹਿਣਾ ਚਾਹੀਦਾ ਹੈ। ਪਰਾਬੋਲਾ ਉੱਪਰ ਖੁੱਲ੍ਹਦਾ ਹੈ ਅਤੇ x-ਅਕਸ ਨੂੰ ਛੂਹ ਸਕਦਾ ਹੈ, ਪਰ ਕੱਟ ਨਹੀਂ ਸਕਦਾ; ਇਸ ਲਈ D ≤ 0 ਲਾਜ਼ਮੀ ਹੈ।");
    if (/stay negative for every real x/i.test(e)) return t(locale,
      "यह विधि क्यों: द्विघात प्रत्येक वास्तविक x के लिए ऋणात्मक रहना चाहिए। परवलय नीचे खुलना चाहिए और x-अक्ष को छूना भी नहीं चाहिए; इसलिए D < 0 आवश्यक है।",
      "ਇਹ ਵਿਧੀ ਕਿਉਂ: ਦੋ-ਘਾਤੀ ਹਰ ਵਾਸਤਵਿਕ x ਲਈ ਰਣਾਤਮਕ ਰਹਿਣਾ ਚਾਹੀਦਾ ਹੈ। ਪਰਾਬੋਲਾ ਹੇਠਾਂ ਖੁੱਲ੍ਹਣਾ ਚਾਹੀਦਾ ਹੈ ਅਤੇ x-ਅਕਸ ਨੂੰ ਛੂਹਣਾ ਵੀ ਨਹੀਂ ਚਾਹੀਦਾ; ਇਸ ਲਈ D < 0 ਲਾਜ਼ਮੀ ਹੈ।");
    if (/stay non-positive for every real x/i.test(e)) return t(locale,
      "यह विधि क्यों: द्विघात प्रत्येक वास्तविक x के लिए धनेतर रहना चाहिए। परवलय नीचे खुलता है और x-अक्ष को छू सकता है, पर काट नहीं सकता; इसलिए D ≤ 0 आवश्यक है।",
      "ਇਹ ਵਿਧੀ ਕਿਉਂ: ਦੋ-ਘਾਤੀ ਹਰ ਵਾਸਤਵਿਕ x ਲਈ ਗੈਰ-ਧਨਾਤਮਕ ਰਹਿਣਾ ਚਾਹੀਦਾ ਹੈ। ਪਰਾਬੋਲਾ ਹੇਠਾਂ ਖੁੱਲ੍ਹਦਾ ਹੈ ਅਤੇ x-ਅਕਸ ਨੂੰ ਛੂਹ ਸਕਦਾ ਹੈ, ਪਰ ਕੱਟ ਨਹੀਂ ਸਕਦਾ; ਇਸ ਲਈ D ≤ 0 ਲਾਜ਼ਮੀ ਹੈ।");
  }
  return current.startsWith("Why this method:") ? null : null;
}

function translateCriticalLine(locale: AlgReviewLocale, prototypeId: string, line: string, englishExplanation: string): string | null {
  const L = (hi: string, pa: string) => t(locale, hi, pa);
  let m: RegExpMatchArray | null;

  if (line.startsWith("Given:")) {
    const content = line.slice(6).trim();
    return L(`दिया है: ${directQuestion(locale, prototypeId, content.endsWith(".") ? content : `${content}.`, content).replace(/[।.]$/, "")}।`, `ਦਿੱਤਾ ਹੈ: ${directQuestion(locale, prototypeId, content.endsWith(".") ? content : `${content}.`, content).replace(/[।.]$/, "")}।`);
  }
  if (line.startsWith("Required:")) return L(`ज्ञात करना है:${line.slice(9)}`, `ਪਤਾ ਕਰਨਾ ਹੈ:${line.slice(9)}`);
  if (line.startsWith("Why this method:")) return whyFor(locale, prototypeId, englishExplanation, line) ?? null;

  // CP004 factorisation.
  if ((m = line.match(/^Both terms have a common factor (.+)\.$/))) return L(`दोनों पदों में ${m[1]} एक समान गुणनखंड है।`, `ਦੋਵੇਂ ਪਦਾਂ ਵਿੱਚ ${m[1]} ਇੱਕ ਸਾਂਝਾ ਗੁਣਨਖੰਡ ਹੈ।`);
  if ((m = line.match(/^Taking it outside gives (.+)\.$/))) return L(`इस समान गुणनखंड को बाहर निकालने पर ${m[1]} मिलता है।`, `ਇਸ ਸਾਂਝੇ ਗੁਣਨਖੰਡ ਨੂੰ ਬਾਹਰ ਕੱਢਣ ਤੇ ${m[1]} ਮਿਲਦਾ ਹੈ।`);
  if ((m = line.match(/^Multiplying (.+) back into the bracket reproduces (.+), so the factorisation is complete\.$/))) return L(`${m[1]} को वापस कोष्ठक में गुणा करने पर ${m[2]} ही मिलता है, इसलिए गुणनखंड पूर्ण है।`, `${m[1]} ਨੂੰ ਵਾਪਸ ਕੋਠੀ ਵਿੱਚ ਗੁਣਾ ਕਰਨ ਤੇ ${m[2]} ਹੀ ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ ਗੁਣਨਖੰਡ ਪੂਰਾ ਹੈ।`);
  if ((m = line.match(/^For a monic quadratic, find two numbers whose sum is the coefficient of x and whose product is the constant term\.$/))) return L("मोनिक द्विघात के लिए ऐसी दो संख्याएँ खोजें जिनका योग x का गुणांक और गुणनफल अचर पद हो।", "ਮੋਨਿਕ ਦੋ-ਘਾਤੀ ਲਈ ਅਜਿਹੀਆਂ ਦੋ ਸੰਖਿਆਵਾਂ ਲੱਭੋ ਜਿਨ੍ਹਾਂ ਦਾ ਜੋੜ x ਦਾ ਗੁਣਾਂਕ ਅਤੇ ਗੁਣਨਫਲ ਅਚਲ ਪਦ ਹੋਵੇ।");
  if ((m = line.match(/^Here (.+) and (.+)\.$/))) return L(`यहाँ ${m[1]} और ${m[2]}।`, `ਇੱਥੇ ${m[1]} ਅਤੇ ${m[2]}।`);
  if ((m = line.match(/^Therefore (.+)\.$/))) return L(`अतः ${m[1]}।`, `ਇਸ ਲਈ ${m[1]}।`);
  if ((m = line.match(/^This is a difference of squares: (.+)\.$/))) return L(`यह वर्गों का अंतर है: ${m[1]}।`, `ਇਹ ਵਰਗਾਂ ਦਾ ਅੰਤਰ ਹੈ: ${m[1]}।`);
  if ((m = line.match(/^Using (.+), we get (.+)\.$/))) return L(`${m[1]} का उपयोग करने पर ${m[2]} मिलता है।`, `${m[1]} ਵਰਤਣ ਤੇ ${m[2]} ਮਿਲਦਾ ਹੈ।`);
  if (line === "The first and last terms are squares, and the middle term is twice their product.") return L("पहला और अंतिम पद वर्ग हैं तथा मध्य पद उनके गुणनफल का दुगुना है।", "ਪਹਿਲਾ ਅਤੇ ਆਖਰੀ ਪਦ ਵਰਗ ਹਨ ਅਤੇ ਵਿਚਕਾਰਲਾ ਪਦ ਉਨ੍ਹਾਂ ਦੇ ਗੁਣਨਫਲ ਦਾ ਦੁੱਗਣਾ ਹੈ।");
  if ((m = line.match(/^Thus the trinomial matches (.+), giving the perfect square (.+)\.$/))) return L(`अतः त्रिपद ${m[1]} के रूप से मेल खाता है और पूर्ण वर्ग ${m[2]} मिलता है।`, `ਇਸ ਲਈ ਤ੍ਰਿਪਦ ${m[1]} ਦੇ ਰੂਪ ਨਾਲ ਮਿਲਦਾ ਹੈ ਅਤੇ ਪੂਰਨ ਵਰਗ ${m[2]} ਮਿਲਦਾ ਹੈ।`);
  if ((m = line.match(/^The middle coefficient is (.+)\.$/))) return L(`मध्य गुणांक ${m[1]} है।`, `ਵਿਚਕਾਰਲਾ ਗੁਣਾਂਕ ${m[1]} ਹੈ।`);
  if ((m = line.match(/^Split it as (.+)\.$/))) return L(`इसे ${m[1]} के रूप में विभाजित करें।`, `ਇਸ ਨੂੰ ${m[1]} ਦੇ ਰੂਪ ਵਿੱਚ ਵੰਡੋ।`);
  if ((m = line.match(/^Then group the terms: (.+)\.$/))) return L(`फिर पदों को समूहित करें: ${m[1]}।`, `ਫਿਰ ਪਦਾਂ ਨੂੰ ਸਮੂਹਿਤ ਕਰੋ: ${m[1]}।`);
  if ((m = line.match(/^Taking the common bracket gives (.+)\.$/))) return L(`समान कोष्ठक बाहर निकालने पर ${m[1]} मिलता है।`, `ਸਾਂਝੀ ਕੋਠੀ ਬਾਹਰ ਕੱਢਣ ਤੇ ${m[1]} ਮਿਲਦਾ ਹੈ।`);

  // CP005 remainder/factor theorem.
  if ((m = line.match(/^By the Remainder Theorem, division by (.+) leaves the remainder (.+)\.$/))) return L(`शेषफल प्रमेय से ${m[1]} से भाग देने पर शेषफल ${m[2]} है।`, `ਬਾਕੀ ਪ੍ਰਮੇਯ ਤੋਂ ${m[1]} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${m[2]} ਹੈ।`);
  if ((m = line.match(/^For the divisor (.+), set (.+), so (.+)\.$/))) return L(`भाजक ${m[1]} के लिए ${m[2]} रखें; तब ${m[3]}।`, `ਭਾਜਕ ${m[1]} ਲਈ ${m[2]} ਰੱਖੋ; ਤਦ ${m[3]}।`);
  if ((m = line.match(/^The remainder is (.+)\.$/))) return L(`शेषफल ${m[1]} है।`, `ਬਾਕੀ ${m[1]} ਹੈ।`);
  if ((m = line.match(/^A linear divisor ax \+ b therefore leaves the remainder (.+)\.$/))) return L(`अतः रैखिक भाजक ax + b के लिए शेषफल ${m[1]} होता है।`, `ਇਸ ਲਈ ਰੇਖੀ ਭਾਜਕ ax + b ਲਈ ਬਾਕੀ ${m[1]} ਹੁੰਦਾ ਹੈ।`);
  if ((m = line.match(/^Substitute x = (.+) into (.+)\.$/))) return L(`${m[2]} में x = ${m[1]} रखें।`, `${m[2]} ਵਿੱਚ x = ${m[1]} ਰੱਖੋ।`);
  if ((m = line.match(/^Exact evaluation gives (.+), so the remainder is (.+)\.$/))) return L(`सटीक गणना से ${m[1]} मिलता है, इसलिए शेषफल ${m[2]} है।`, `ਸਹੀ ਗਣਨਾ ਤੋਂ ${m[1]} ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ ਬਾਕੀ ${m[2]} ਹੈ।`);
  if ((m = line.match(/^Because (.+) is a factor, (.+)\.$/))) return L(`क्योंकि ${m[1]} गुणनखंड है, इसलिए ${m[2]}।`, `ਕਿਉਂਕਿ ${m[1]} ਗੁਣਨਖੰਡ ਹੈ, ਇਸ ਲਈ ${m[2]}।`);
  if ((m = line.match(/^After substituting x = (.+), the known terms combine to (.+), so (.+)\.$/))) return L(`x = ${m[1]} रखने पर ज्ञात पदों का योग ${m[2]} है, इसलिए ${m[3]}।`, `x = ${m[1]} ਰੱਖਣ ਤੇ ਪਤਾ ਪਦਾਂ ਦਾ ਜੋੜ ${m[2]} ਹੈ, ਇਸ ਲਈ ${m[3]}।`);
  if ((m = line.match(/^Hence (.+), giving (.+)\.$/))) return L(`अतः ${m[1]}, जिससे ${m[2]} मिलता है।`, `ਇਸ ਲਈ ${m[1]}, ਜਿਸ ਤੋਂ ${m[2]} ਮਿਲਦਾ ਹੈ।`);
  if ((m = line.match(/^Synthetic division then gives remainder (.+), confirming the factor\.$/))) return L(`कृत्रिम भाग से शेषफल ${m[1]} मिलता है, जो गुणनखंड की पुष्टि करता है।`, `ਕ੍ਰਿਤ੍ਰਿਮ ਭਾਗ ਤੋਂ ਬਾਕੀ ${m[1]} ਮਿਲਦਾ ਹੈ, ਜੋ ਗੁਣਨਖੰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹੈ।`);
  if ((m = line.match(/^The Remainder Theorem gives (.+)\.$/))) return L(`शेषफल प्रमेय से ${m[1]}।`, `ਬਾਕੀ ਪ੍ਰਮੇਯ ਤੋਂ ${m[1]}।`);
  if ((m = line.match(/^Substitution combines the known terms to (.+), so (.+)\.$/))) return L(`प्रतिस्थापन के बाद ज्ञात पद ${m[1]} बनते हैं, इसलिए ${m[2]}।`, `ਪ੍ਰਤਿਸਥਾਪਨ ਤੋਂ ਬਾਅਦ ਪਤਾ ਪਦ ${m[1]} ਬਣਦੇ ਹਨ, ਇਸ ਲਈ ${m[2]}।`);
  if ((m = line.match(/^Substitution back gives the stated remainder exactly\.$/))) return L("मान वापस रखने पर दिया गया शेषफल ठीक प्राप्त होता है।", "ਮਾਨ ਵਾਪਸ ਰੱਖਣ ਤੇ ਦਿੱਤਾ ਬਾਕੀ ਠੀਕ ਮਿਲਦਾ ਹੈ।");
  if ((m = line.match(/^By the Factor Theorem, (.+) is a factor exactly when (.+)\.$/))) return L(`गुणनखंड प्रमेय से ${m[1]} तभी गुणनखंड है जब ${m[2]}।`, `ਗੁਣਨਖੰਡ ਪ੍ਰਮੇਯ ਤੋਂ ${m[1]} ਤਦ ਹੀ ਗੁਣਨਖੰਡ ਹੈ ਜਦੋਂ ${m[2]}।`);
  if ((m = line.match(/^Substituting x = (.+) into (.+) gives (.+)\.$/))) return L(`${m[2]} में x = ${m[1]} रखने पर ${m[3]} मिलता है।`, `${m[2]} ਵਿੱਚ x = ${m[1]} ਰੱਖਣ ਤੇ ${m[3]} ਮਿਲਦਾ ਹੈ।`);
  if (line === "Therefore the statement is true.") return L("अतः कथन सत्य है।", "ਇਸ ਲਈ ਕਥਨ ਸੱਚ ਹੈ।");
  if ((m = line.match(/^The factor condition gives (.+), which simplifies to (.+)\.$/))) return L(`गुणनखंड की शर्त से ${m[1]} मिलता है, जो सरल होकर ${m[2]} बनता है।`, `ਗੁਣਨਖੰਡ ਦੀ ਸ਼ਰਤ ਤੋਂ ${m[1]} ਮਿਲਦਾ ਹੈ, ਜੋ ਸਰਲ ਹੋ ਕੇ ${m[2]} ਬਣਦਾ ਹੈ।`);
  if ((m = line.match(/^The second remainder condition gives (.+), which simplifies to (.+)\.$/))) return L(`दूसरी शेषफल शर्त से ${m[1]} मिलता है, जो सरल होकर ${m[2]} बनता है।`, `ਦੂਜੀ ਬਾਕੀ ਸ਼ਰਤ ਤੋਂ ${m[1]} ਮਿਲਦਾ ਹੈ, ਜੋ ਸਰਲ ਹੋ ਕੇ ${m[2]} ਬਣਦਾ ਹੈ।`);
  if ((m = line.match(/^Solving these two linear equations gives (.+)\.$/))) return L(`इन दोनों रैखिक समीकरणों को हल करने पर ${m[1]} मिलता है।`, `ਇਹ ਦੋਵੇਂ ਰੇਖੀ ਸਮੀਕਰਨ ਹੱਲ ਕਰਨ ਤੇ ${m[1]} ਮਿਲਦਾ ਹੈ।`);
  if (line === "Substitution verifies both original remainder conditions.") return L("प्रतिस्थापन दोनों मूल शेषफल शर्तों की पुष्टि करता है।", "ਪ੍ਰਤਿਸਥਾਪਨ ਦੋਵੇਂ ਮੂਲ ਬਾਕੀ ਸ਼ਰਤਾਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹੈ।");
  if (line === "Equal remainders mean P(1) = Q(1).") return L("समान शेषफल का अर्थ है P(1) = Q(1)।", "ਇੱਕੋ ਬਾਕੀ ਦਾ ਅਰਥ ਹੈ P(1) = Q(1)।");
  if ((m = line.match(/^Evaluating (.+) gives (.+)\.$/))) return L(`${m[1]} की गणना से ${m[2]} मिलता है।`, `${m[1]} ਦੀ ਗਣਨਾ ਤੋਂ ${m[2]} ਮਿਲਦਾ ਹੈ।`);
  if ((m = line.match(/^For P, the known terms total (.+), so (.+)\.$/))) return L(`P में ज्ञात पदों का योग ${m[1]} है, इसलिए ${m[2]}।`, `P ਵਿੱਚ ਪਤਾ ਪਦਾਂ ਦਾ ਜੋੜ ${m[1]} ਹੈ, ਇਸ ਲਈ ${m[2]}।`);
  if ((m = line.match(/^Substitution into either polynomial gives the common remainder (.+)\.$/))) return L(`किसी भी बहुपद में मान रखने पर समान शेषफल ${m[1]} मिलता है।`, `ਕਿਸੇ ਵੀ ਬਹੁਪਦ ਵਿੱਚ ਮਾਨ ਰੱਖਣ ਤੇ ਸਾਂਝਾ ਬਾਕੀ ${m[1]} ਮਿਲਦਾ ਹੈ।`);

  // CP006 linear equations.
  if ((m = line.match(/^Move the constant term to the other side: (.+)\.$/))) return L(`अचर पद को दूसरी ओर ले जाएँ: ${m[1]}।`, `ਅਚਲ ਪਦ ਨੂੰ ਦੂਜੇ ਪਾਸੇ ਲਿਜਾਓ: ${m[1]}।`);
  if ((m = line.match(/^Divide both sides by (.+), giving (.+)\.$/))) return L(`दोनों पक्षों को ${m[1]} से भाग दें; ${m[2]} मिलता है।`, `ਦੋਵੇਂ ਪਾਸਿਆਂ ਨੂੰ ${m[1]} ਨਾਲ ਭਾਗ ਦਿਓ; ${m[2]} ਮਿਲਦਾ ਹੈ।`);
  if (line === "Substitution in the original equation confirms the value.") return L("मूल समीकरण में प्रतिस्थापन इस मान की पुष्टि करता है।", "ਮੂਲ ਸਮੀਕਰਨ ਵਿੱਚ ਪ੍ਰਤਿਸਥਾਪਨ ਇਸ ਮਾਨ ਦੀ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹੈ।");
  if (line === "Bring the x-terms to one side and constants to the other.") return L("x वाले पद एक ओर और अचर पद दूसरी ओर ले जाएँ।", "x ਵਾਲੇ ਪਦ ਇੱਕ ਪਾਸੇ ਅਤੇ ਅਚਲ ਪਦ ਦੂਜੇ ਪਾਸੇ ਲਿਜਾਓ।");
  if ((m = line.match(/^This gives (.+)\.$/))) return L(`इससे ${m[1]} मिलता है।`, `ਇਸ ਨਾਲ ${m[1]} ਮਿਲਦਾ ਹੈ।`);
  if ((m = line.match(/^Dividing by (.+) gives (.+)\.$/))) return L(`${m[1]} से भाग देने पर ${m[2]} मिलता है।`, `${m[1]} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ${m[2]} ਮਿਲਦਾ ਹੈ।`);
  if ((m = line.match(/^First expand the bracket: (.+) becomes (.+)\.$/))) return L(`पहले कोष्ठक खोलें: ${m[1]} से ${m[2]} मिलता है।`, `ਪਹਿਲਾਂ ਕੋਠੀ ਖੋਲ੍ਹੋ: ${m[1]} ਤੋਂ ${m[2]} ਮਿਲਦਾ ਹੈ।`);
  if (line === "Then collect x-terms and constants on opposite sides.") return L("फिर x वाले पद और अचर पद विपरीत ओर एकत्र करें।", "ਫਿਰ x ਵਾਲੇ ਪਦ ਅਤੇ ਅਚਲ ਪਦ ਵੱਖ-ਵੱਖ ਪਾਸਿਆਂ ਤੇ ਇਕੱਠੇ ਕਰੋ।");
  if ((m = line.match(/^Solving gives (.+), which satisfies the original bracketed equation\.$/))) return L(`हल करने पर ${m[1]} मिलता है, जो मूल कोष्ठक वाले समीकरण को संतुष्ट करता है।`, `ਹੱਲ ਕਰਨ ਤੇ ${m[1]} ਮਿਲਦਾ ਹੈ, ਜੋ ਮੂਲ ਕੋਠੀ ਵਾਲੇ ਸਮੀਕਰਨ ਨੂੰ ਸੰਤੁਸ਼ਟ ਕਰਦਾ ਹੈ।`);
  if ((m = line.match(/^Subtract (.+) from both sides, then divide by the coefficient (.+)\.$/))) return L(`दोनों पक्षों से ${m[1]} घटाएँ, फिर गुणांक ${m[2]} से भाग दें।`, `ਦੋਵੇਂ ਪਾਸਿਆਂ ਤੋਂ ${m[1]} ਘਟਾਓ, ਫਿਰ ਗੁਣਾਂਕ ${m[2]} ਨਾਲ ਭਾਗ ਦਿਓ।`);
  if (line === "Substitution verifies the exact fractional solution.") return L("प्रतिस्थापन सटीक भिन्नात्मक हल की पुष्टि करता है।", "ਪ੍ਰਤਿਸਥਾਪਨ ਸਹੀ ਭਿੰਨਾਤਮਕ ਹੱਲ ਦੀ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹੈ।");
  if ((m = line.match(/^Substitute x = (.+) into the equation\.$/))) return L(`समीकरण में x = ${m[1]} रखें।`, `ਸਮੀਕਰਨ ਵਿੱਚ x = ${m[1]} ਰੱਖੋ।`);
  if ((m = line.match(/^Solving this linear equation in k gives (.+)\.$/))) return L(`k के इस रैखिक समीकरण को हल करने पर ${m[1]} मिलता है।`, `k ਦੀ ਇਹ ਰੇਖੀ ਸਮੀਕਰਨ ਹੱਲ ਕਰਨ ਤੇ ${m[1]} ਮਿਲਦਾ ਹੈ।`);
  if ((m = line.match(/^Using that value makes x = (.+) satisfy the original equation\.$/))) return L(`इस मान पर x = ${m[1]} मूल समीकरण को संतुष्ट करता है।`, `ਇਸ ਮਾਨ ਤੇ x = ${m[1]} ਮੂਲ ਸਮੀਕਰਨ ਨੂੰ ਸੰਤੁਸ਼ਟ ਕਰਦਾ ਹੈ।`);

  // CP007 systems.
  if ((m = line.match(/^Eliminate x by combining the two equations\. this gives (.+), so (.+)\.$/i))) return L(`दोनों समीकरणों को मिलाकर x हटाएँ। इससे ${m[1]}, इसलिए ${m[2]}।`, `ਦੋਵੇਂ ਸਮੀਕਰਨਾਂ ਨੂੰ ਮਿਲਾ ਕੇ x ਹਟਾਓ। ਇਸ ਨਾਲ ${m[1]}, ਇਸ ਲਈ ${m[2]}।`);
  if ((m = line.match(/^Substitute into the first equation: (.+)\.$/))) return L(`पहले समीकरण में मान रखें: ${m[1]}।`, `ਪਹਿਲੇ ਸਮੀਕਰਨ ਵਿੱਚ ਮਾਨ ਰੱਖੋ: ${m[1]}।`);
  if ((m = line.match(/^Solving gives (.+)\.$/))) return L(`हल करने पर ${m[1]} मिलता है।`, `ਹੱਲ ਕਰਨ ਤੇ ${m[1]} ਮਿਲਦਾ ਹੈ।`);
  if ((m = line.match(/^Now (.+)\.$/))) return L(`अब ${m[1]}।`, `ਹੁਣ ${m[1]}।`);
  if ((m = line.match(/^Hence (.+)\.$/))) return L(`अतः ${m[1]}।`, `ਇਸ ਲਈ ${m[1]}।`);
  if ((m = line.match(/^Therefore (.+) and (.+)\.$/))) return L(`अतः ${m[1]} और ${m[2]}।`, `ਇਸ ਲਈ ${m[1]} ਅਤੇ ${m[2]}।`);
  if (line === "Substitution in both original equations confirms the pair.") return L("दोनों मूल समीकरणों में प्रतिस्थापन इस युग्म की पुष्टि करता है।", "ਦੋਵੇਂ ਮੂਲ ਸਮੀਕਰਨਾਂ ਵਿੱਚ ਪ੍ਰਤਿਸਥਾਪਨ ਇਸ ਜੋੜੇ ਦੀ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹੈ।");
  if ((m = line.match(/^The x- and y-coefficients of the second equation are exactly (.+) times those of the first, but its constant is not (.+) times the first constant\.$/))) return L(`दूसरे समीकरण के x और y के गुणांक पहले समीकरण के ठीक ${m[1]} गुने हैं, पर उसका अचर पहले अचर का ${m[2]} गुना नहीं है।`, `ਦੂਜੇ ਸਮੀਕਰਨ ਦੇ x ਅਤੇ y ਦੇ ਗੁਣਾਂਕ ਪਹਿਲੇ ਸਮੀਕਰਨ ਦੇ ਠੀਕ ${m[1]} ਗੁਣਾ ਹਨ, ਪਰ ਉਸ ਦਾ ਅਚਲ ਪਹਿਲੇ ਅਚਲ ਦਾ ${m[2]} ਗੁਣਾ ਨਹੀਂ ਹੈ।`);
  if (line === "The lines are parallel and distinct, so the system has no solution.") return L("रेखाएँ समांतर और भिन्न हैं, इसलिए समीकरण-तंत्र का कोई हल नहीं है।", "ਰੇਖਾਵਾਂ ਸਮਾਂਤਰ ਅਤੇ ਵੱਖ ਹਨ, ਇਸ ਲਈ ਸਮੀਕਰਨ-ਤੰਤਰ ਦਾ ਕੋਈ ਹੱਲ ਨਹੀਂ ਹੈ।");
  if ((m = line.match(/^Every coefficient and the constant in the second equation are exactly (.+) times the first equation\.$/))) return L(`दूसरे समीकरण का प्रत्येक गुणांक और अचर पहले समीकरण का ठीक ${m[1]} गुना है।`, `ਦੂਜੇ ਸਮੀਕਰਨ ਦਾ ਹਰ ਗੁਣਾਂਕ ਅਤੇ ਅਚਲ ਪਹਿਲੇ ਸਮੀਕਰਨ ਦਾ ਠੀਕ ${m[1]} ਗੁਣਾ ਹੈ।`);
  if (line === "Both equations describe the same line, so the system has infinitely many solutions.") return L("दोनों समीकरण एक ही रेखा दर्शाते हैं, इसलिए समीकरण-तंत्र के अनंत हल हैं।", "ਦੋਵੇਂ ਸਮੀਕਰਨ ਇੱਕੋ ਰੇਖਾ ਦਰਸਾਉਂਦੇ ਹਨ, ਇਸ ਲਈ ਸਮੀਕਰਨ-ਤੰਤਰ ਦੇ ਅਨੰਤ ਹੱਲ ਹਨ।");
  if (line === "For no solution, the x- and y-coefficients must be proportional while the constants are not.") return L("कोई हल न होने के लिए x और y के गुणांक समानुपाती होने चाहिए, जबकि अचर उसी अनुपात में नहीं होने चाहिए।", "ਕੋਈ ਹੱਲ ਨਾ ਹੋਣ ਲਈ x ਅਤੇ y ਦੇ ਗੁਣਾਂਕ ਅਨੁਪਾਤੀ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ, ਜਦਕਿ ਅਚਲ ਉਸੇ ਅਨੁਪਾਤ ਵਿੱਚ ਨਹੀਂ ਹੋਣੇ ਚਾਹੀਦੇ।");
  if ((m = line.match(/^The y-coefficient in the second equation is (.+) times the first, so its x-coefficient must also be (.+) times (.+): (.+)\.$/))) return L(`दूसरे समीकरण में y का गुणांक पहले का ${m[1]} गुना है, इसलिए x का गुणांक भी ${m[2]} गुना ${m[3]} होना चाहिए: ${m[4]}।`, `ਦੂਜੇ ਸਮੀਕਰਨ ਵਿੱਚ y ਦਾ ਗੁਣਾਂਕ ਪਹਿਲੇ ਦਾ ${m[1]} ਗੁਣਾ ਹੈ, ਇਸ ਲਈ x ਦਾ ਗੁਣਾਂਕ ਵੀ ${m[2]} ਗੁਣਾ ${m[3]} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ: ${m[4]}।`);
  if (line === "The constants are not in that same ratio, so this value makes the lines parallel and distinct.") return L("अचर उसी अनुपात में नहीं हैं, इसलिए यह मान रेखाओं को समांतर और भिन्न बनाता है।", "ਅਚਲ ਉਸੇ ਅਨੁਪਾਤ ਵਿੱਚ ਨਹੀਂ ਹਨ, ਇਸ ਲਈ ਇਹ ਮਾਨ ਰੇਖਾਵਾਂ ਨੂੰ ਸਮਾਂਤਰ ਅਤੇ ਵੱਖ ਬਣਾਉਂਦਾ ਹੈ।");
  if (line === "Call the three equations E1, E2 and E3.") return L("तीनों समीकरणों को E1, E2 और E3 नाम दें।", "ਤਿੰਨੋਂ ਸਮੀਕਰਨਾਂ ਨੂੰ E1, E2 ਅਤੇ E3 ਨਾਮ ਦਿਓ।");
  if ((m = line.match(/^Eliminate x from (.+) to get (.+)\.$/))) return L(`${m[1]} से x हटाने पर ${m[2]} मिलता है।`, `${m[1]} ਤੋਂ x ਹਟਾਉਣ ਤੇ ${m[2]} ਮਿਲਦਾ ਹੈ।`);
  if ((m = line.match(/^Substitute these in E1: (.+)\.$/))) return L(`इन मानों को E1 में रखें: ${m[1]}।`, `ਇਹ ਮਾਨ E1 ਵਿੱਚ ਰੱਖੋ: ${m[1]}।`);
  if ((m = line.match(/^Therefore \(x, y, z\) = (.+)\. substitution satisfies all three original equations\.$/i))) return L(`अतः (x, y, z) = ${m[1]}। प्रतिस्थापन तीनों मूल समीकरणों को संतुष्ट करता है।`, `ਇਸ ਲਈ (x, y, z) = ${m[1]}। ਪ੍ਰਤਿਸਥਾਪਨ ਤਿੰਨੋਂ ਮੂਲ ਸਮੀਕਰਨਾਂ ਨੂੰ ਸੰਤੁਸ਼ਟ ਕਰਦਾ ਹੈ।`);

  // CP008 rational/domain.
  if (line === "The denominator cannot be zero.") return L("हर शून्य नहीं हो सकता।", "ਹਰ ਸਿਫ਼ਰ ਨਹੀਂ ਹੋ ਸਕਦਾ।");
  if ((m = line.match(/^Set (.+), which gives (.+)\.$/))) return L(`${m[1]} रखें; इससे ${m[2]} मिलता है।`, `${m[1]} ਰੱਖੋ; ਇਸ ਨਾਲ ${m[2]} ਮਿਲਦਾ ਹੈ।`);
  if ((m = line.match(/^Therefore (.+) is excluded from the domain\.$/))) return L(`अतः ${m[1]} मान्य क्षेत्र से वर्जित है।`, `ਇਸ ਲਈ ${m[1]} ਮਨਜ਼ੂਰ ਖੇਤਰ ਤੋਂ ਬਾਹਰ ਹੈ।`);
  if ((m = line.match(/^First note (.+)\.$/))) return L(`पहले ध्यान दें: ${m[1]}।`, `ਪਹਿਲਾਂ ਧਿਆਨ ਦਿਓ: ${m[1]}।`);
  if ((m = line.match(/^Multiply by the nonzero denominator (.+): (.+)\.$/))) return L(`गैर-शून्य हर ${m[1]} से गुणा करें: ${m[2]}।`, `ਗੈਰ-ਸਿਫ਼ਰ ਹਰ ${m[1]} ਨਾਲ ਗੁਣਾ ਕਰੋ: ${m[2]}।`);
  if ((m = line.match(/^Collecting x-terms gives (.+), so (.+)\.$/))) return L(`x वाले पद एकत्र करने पर ${m[1]}, इसलिए ${m[2]}।`, `x ਵਾਲੇ ਪਦ ਇਕੱਠੇ ਕਰਨ ਤੇ ${m[1]}, ਇਸ ਲਈ ${m[2]}।`);
  if (line === "This value is not excluded and satisfies the original fraction equation.") return L("यह मान वर्जित नहीं है और मूल भिन्न समीकरण को संतुष्ट करता है।", "ਇਹ ਮਾਨ ਮਨਾਹੀ ਨਹੀਂ ਹੈ ਅਤੇ ਮੂਲ ਭਿੰਨ ਸਮੀਕਰਨ ਨੂੰ ਸੰਤੁਸ਼ਟ ਕਰਦਾ ਹੈ।");
  if ((m = line.match(/^The original denominators require (.+)\.$/))) return L(`मूल हरों के कारण ${m[1]} होना चाहिए।`, `ਮੂਲ ਹਰਾਂ ਕਰਕੇ ${m[1]} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`);
  if ((m = line.match(/^Cross-multiplying gives (.+)\.$/))) return L(`क्रॉस-गुणा करने पर ${m[1]} मिलता है।`, `ਕ੍ਰਾਸ-ਗੁਣਾ ਕਰਨ ਤੇ ${m[1]} ਮਿਲਦਾ ਹੈ।`);
  if ((m = line.match(/^Expanding and collecting x-terms gives (.+), so (.+)\.$/))) return L(`विस्तार करके x वाले पद एकत्र करने पर ${m[1]}, इसलिए ${m[2]}।`, `ਵਿਸਥਾਰ ਕਰਕੇ x ਵਾਲੇ ਪਦ ਇਕੱਠੇ ਕਰਨ ਤੇ ${m[1]}, ਇਸ ਲਈ ${m[2]}।`);
  if (line === "Direct substitution in the original equation confirms the value is valid.") return L("मूल समीकरण में सीधा प्रतिस्थापन पुष्टि करता है कि मान वैध है।", "ਮੂਲ ਸਮੀਕਰਨ ਵਿੱਚ ਸਿੱਧਾ ਪ੍ਰਤਿਸਥਾਪਨ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹੈ ਕਿ ਮਾਨ ਠੀਕ ਹੈ।");
  if ((m = line.match(/^From the original denominator, (.+) is not allowed\.$/))) return L(`मूल हर के कारण ${m[1]} मान्य नहीं है।`, `ਮੂਲ ਹਰ ਕਰਕੇ ${m[1]} ਮਨਜ਼ੂਰ ਨਹੀਂ ਹੈ।`);
  if ((m = line.match(/^The numerator factors as (.+), giving candidates (.+)\.$/))) return L(`अंश का गुणनखंड ${m[1]} है, जिससे संभावित मान ${m[2]} मिलते हैं।`, `ਅੰਸ਼ ਦਾ ਗੁਣਨਖੰਡ ${m[1]} ਹੈ, ਜਿਸ ਤੋਂ ਸੰਭਾਵਿਤ ਮਾਨ ${m[2]} ਮਿਲਦੇ ਹਨ।`);
  if ((m = line.match(/^Reject (.+) because it makes the original denominator zero\.$/))) return L(`${m[1]} को अस्वीकार करें क्योंकि इससे मूल हर शून्य हो जाता है।`, `${m[1]} ਨੂੰ ਰੱਦ ਕਰੋ ਕਿਉਂਕਿ ਇਸ ਨਾਲ ਮੂਲ ਹਰ ਸਿਫ਼ਰ ਹੋ ਜਾਂਦਾ ਹੈ।`);
  if ((m = line.match(/^Therefore the only valid solution is (.+)\.$/))) return L(`अतः एकमात्र मान्य हल ${m[1]} है।`, `ਇਸ ਲਈ ਇਕੱਲਾ ਮਨਜ਼ੂਰ ਹੱਲ ${m[1]} ਹੈ।`);
  if ((m = line.match(/^The denominator makes (.+) invalid\.$/))) return L(`हर के कारण ${m[1]} अमान्य है।`, `ਹਰ ਕਰਕੇ ${m[1]} ਅਮਾਨਯ ਹੈ।`);
  if ((m = line.match(/^The numerator is (.+), so the cross-multiplied equation gives only (.+)\.$/))) return L(`अंश ${m[1]} है, इसलिए क्रॉस-गुणा किया समीकरण केवल ${m[2]} देता है।`, `ਅੰਸ਼ ${m[1]} ਹੈ, ਇਸ ਲਈ ਕ੍ਰਾਸ-ਗੁਣਾ ਕੀਤਾ ਸਮੀਕਰਨ ਕੇਵਲ ${m[2]} ਦਿੰਦਾ ਹੈ।`);
  if (line === "That candidate is outside the original domain, hence the rational equation has no solution.") return L("वह संभावित मान मूल मान्य क्षेत्र से बाहर है, इसलिए परिमेय समीकरण का कोई हल नहीं है।", "ਉਹ ਸੰਭਾਵਿਤ ਮਾਨ ਮੂਲ ਮਨਜ਼ੂਰ ਖੇਤਰ ਤੋਂ ਬਾਹਰ ਹੈ, ਇਸ ਲਈ ਪਰਿਮੇਯ ਸਮੀਕਰਨ ਦਾ ਕੋਈ ਹੱਲ ਨਹੀਂ ਹੈ।");
  if ((m = line.match(/^The denominator first gives (.+)\.$/))) return L(`हर से पहले ${m[1]} मिलता है।`, `ਹਰ ਤੋਂ ਪਹਿਲਾਂ ${m[1]} ਮਿਲਦਾ ਹੈ।`);
  if ((m = line.match(/^Move -1 to the right: (.+)\.$/))) return L(`-1 को दाईं ओर ले जाएँ: ${m[1]}।`, `-1 ਨੂੰ ਸੱਜੇ ਪਾਸੇ ਲਿਜਾਓ: ${m[1]}।`);
  if ((m = line.match(/^Invert both nonzero sides to get (.+), hence (.+)\.$/))) return L(`दोनों गैर-शून्य पक्षों का व्युत्क्रम लेने पर ${m[1]}, अतः ${m[2]}।`, `ਦੋਵੇਂ ਗੈਰ-ਸਿਫ਼ਰ ਪਾਸਿਆਂ ਦਾ ਵਿਉਤਕ੍ਰਮ ਲੈਣ ਤੇ ${m[1]}, ਇਸ ਲਈ ${m[2]}।`);
  if ((m = line.match(/^Since (.+) is not excluded, it is valid\.$/))) return L(`क्योंकि ${m[1]} वर्जित नहीं है, इसलिए यह मान्य है।`, `ਕਿਉਂਕਿ ${m[1]} ਮਨਾਹੀ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਇਹ ਮਨਜ਼ੂਰ ਹੈ।`);
  if (line === "The numerator and denominator are the same, so the fraction equals 1 wherever it is defined.") return L("अंश और हर समान हैं, इसलिए जहाँ भी भिन्न परिभाषित है वहाँ उसका मान 1 है।", "ਅੰਸ਼ ਅਤੇ ਹਰ ਇੱਕੋ ਹਨ, ਇਸ ਲਈ ਜਿੱਥੇ ਵੀ ਭਿੰਨ ਪਰਿਭਾਸ਼ਿਤ ਹੈ ਉੱਥੇ ਉਸ ਦਾ ਮਾਨ 1 ਹੈ।");
  if ((m = line.match(/^But (.+) makes the original denominator zero\.$/))) return L(`लेकिन ${m[1]} मूल हर को शून्य कर देता है।`, `ਪਰ ${m[1]} ਮੂਲ ਹਰ ਨੂੰ ਸਿਫ਼ਰ ਕਰ ਦਿੰਦਾ ਹੈ।`);
  if ((m = line.match(/^Therefore every real x except (.+) satisfies the equation\.$/))) return L(`अतः ${m[1]} को छोड़कर प्रत्येक वास्तविक x समीकरण को संतुष्ट करता है।`, `ਇਸ ਲਈ ${m[1]} ਤੋਂ ਇਲਾਵਾ ਹਰ ਵਾਸਤਵਿਕ x ਸਮੀਕਰਨ ਨੂੰ ਸੰਤੁਸ਼ਟ ਕਰਦਾ ਹੈ।`);

  // CP009 quadratics.
  if ((m = line.match(/^Factor the quadratic: (.+) becomes (.+)\.$/))) return L(`द्विघात का गुणनखंड करें: ${m[1]} से ${m[2]} मिलता है।`, `ਦੋ-ਘਾਤੀ ਦੇ ਗੁਣਨਖੰਡ ਕਰੋ: ${m[1]} ਤੋਂ ${m[2]} ਮਿਲਦਾ ਹੈ।`);
  if ((m = line.match(/^Since the nonzero scalar does not affect the zeros, the zero-product rule gives (.+)\.$/))) return L(`गैर-शून्य अदिश मूलों को नहीं बदलता, इसलिए शून्य-गुणनफल नियम से ${m[1]} मिलता है।`, `ਗੈਰ-ਸਿਫ਼ਰ ਅਦਿਸ਼ ਮੂਲਾਂ ਨੂੰ ਨਹੀਂ ਬਦਲਦਾ, ਇਸ ਲਈ ਸਿਫ਼ਰ-ਗੁਣਨਫਲ ਨਿਯਮ ਤੋਂ ${m[1]} ਮਿਲਦਾ ਹੈ।`);
  if (line === "Both values satisfy the original equation.") return L("दोनों मान मूल समीकरण को संतुष्ट करते हैं।", "ਦੋਵੇਂ ਮਾਨ ਮੂਲ ਸਮੀਕਰਨ ਨੂੰ ਸੰਤੁਸ਼ਟ ਕਰਦੇ ਹਨ।");
  if ((m = line.match(/^The left side is a perfect square and factors as (.+)\.$/))) return L(`बायाँ पक्ष पूर्ण वर्ग है और उसका गुणनखंड ${m[1]} है।`, `ਖੱਬਾ ਪਾਸਾ ਪੂਰਨ ਵਰਗ ਹੈ ਅਤੇ ਉਸ ਦਾ ਗੁਣਨਖੰਡ ${m[1]} ਹੈ।`);
  if (line === "The same factor occurs twice, hence this is a repeated root.") return L("एक ही गुणनखंड दो बार आता है, इसलिए यह दोहरा मूल है।", "ਇੱਕੋ ਗੁਣਨਖੰਡ ਦੋ ਵਾਰ ਆਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਦੁਹਰਾਇਆ ਮੂਲ ਹੈ।");
  if ((m = line.match(/^Compare with ax² \+ bx \+ c: (.+)\.$/))) return L(`ax² + bx + c से तुलना करें: ${m[1]}।`, `ax² + bx + c ਨਾਲ ਤੁਲਨਾ ਕਰੋ: ${m[1]}।`);
  if ((m = line.match(/^For (.+), D = b² - 4ac = (.+)\.$/))) return L(`${m[1]} के लिए D = b² - 4ac = ${m[2]}।`, `${m[1]} ਲਈ D = b² - 4ac = ${m[2]}।`);
  if (line === "Use the quadratic formula x = [-b ± √D]/(2a).") return L("द्विघात सूत्र x = [-b ± √D]/(2a) का उपयोग करें।", "ਦੋ-ਘਾਤੀ ਸੂਤਰ x = [-b ± √D]/(2a) ਵਰਤੋ।");
  if ((m = line.match(/^Substitute a, b and D: (.+)\.$/))) return L(`a, b और D के मान रखें: ${m[1]}।`, `a, b ਅਤੇ D ਦੇ ਮਾਨ ਰੱਖੋ: ${m[1]}।`);
  if ((m = line.match(/^Simplify the surd and divide by 2: (.+)\.$/))) return L(`करणी सरल करके 2 से भाग दें: ${m[1]}।`, `ਕਰਣੀ ਸਰਲ ਕਰਕੇ 2 ਨਾਲ ਭਾਗ ਦਿਓ: ${m[1]}।`);
  if (line === "These are exact roots, so no decimal approximation is needed.") return L("ये सटीक मूल हैं, इसलिए दशमलव सन्निकटन की आवश्यकता नहीं है।", "ਇਹ ਸਹੀ ਮੂਲ ਹਨ, ਇਸ ਲਈ ਦਸ਼ਮਲਵ ਅਨੁਮਾਨ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।");
  if (line === "For a quadratic, real roots require D = b² - 4ac ≥ 0.") return L("द्विघात के वास्तविक मूलों के लिए D = b² - 4ac ≥ 0 होना चाहिए।", "ਦੋ-ਘਾਤੀ ਦੇ ਵਾਸਤਵਿਕ ਮੂਲਾਂ ਲਈ D = b² - 4ac ≥ 0 ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।");
  if ((m = line.match(/^Here D = (.+), which is negative\.$/))) return L(`यहाँ D = ${m[1]}, जो ऋणात्मक है।`, `ਇੱਥੇ D = ${m[1]}, ਜੋ ਰਣਾਤਮਕ ਹੈ।`);
  if (line === "Therefore the equation has no real roots.") return L("अतः समीकरण का कोई वास्तविक मूल नहीं है।", "ਇਸ ਲਈ ਸਮੀਕਰਨ ਦਾ ਕੋਈ ਵਾਸਤਵਿਕ ਮੂਲ ਨਹੀਂ ਹੈ।");
  if (line === "Equal roots require D = 0.") return L("समान मूलों के लिए D = 0 होना चाहिए।", "ਬਰਾਬਰ ਮੂਲਾਂ ਲਈ D = 0 ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।");
  if ((m = line.match(/^Here D = (.+), so (.+)\.$/))) return L(`यहाँ D = ${m[1]}, इसलिए ${m[2]}।`, `ਇੱਥੇ D = ${m[1]}, ਇਸ ਲਈ ${m[2]}।`);
  if ((m = line.match(/^With this value, the repeated root is (.+)\.$/))) return L(`इस मान पर दोहरा मूल ${m[1]} है।`, `ਇਸ ਮਾਨ ਤੇ ਦੁਹਰਾਇਆ ਮੂਲ ${m[1]} ਹੈ।`);
  if (line === "A root makes the polynomial zero.") return L("मूल रखने पर बहुपद का मान शून्य होता है।", "ਮੂਲ ਰੱਖਣ ਤੇ ਬਹੁਪਦ ਦਾ ਮਾਨ ਸਿਫ਼ਰ ਹੁੰਦਾ ਹੈ।");
  if ((m = line.match(/^The known terms total (.+), so (.+)\.$/))) return L(`ज्ञात पदों का योग ${m[1]} है, इसलिए ${m[2]}।`, `ਪਤਾ ਪਦਾਂ ਦਾ ਜੋੜ ${m[1]} ਹੈ, ਇਸ ਲਈ ${m[2]}।`);

  // CP013 absolute value.
  if ((m = line.match(/^The expression inside the absolute value can be (.+) or (.+)\.$/))) return L(`परम मान के अंदर का व्यंजक ${m[1]} या ${m[2]} हो सकता है।`, `ਪਰਮ ਮਾਨ ਦੇ ਅੰਦਰਲਾ ਵਿਆੰਜਕ ${m[1]} ਜਾਂ ${m[2]} ਹੋ ਸਕਦਾ ਹੈ।`);
  if ((m = line.match(/^Thus (.+) gives (.+), while (.+) gives (.+)\.$/))) return L(`अतः ${m[1]} से ${m[2]} और ${m[3]} से ${m[4]} मिलता है।`, `ਇਸ ਲਈ ${m[1]} ਤੋਂ ${m[2]} ਅਤੇ ${m[3]} ਤੋਂ ${m[4]} ਮਿਲਦਾ ਹੈ।`);
  if (line === "Use two branches.") return L("दो शाखाएँ लें।", "ਦੋ ਸ਼ਾਖਾਵਾਂ ਲਓ।");
  if ((m = line.match(/^From (.+), we get (.+), so (.+)\.$/))) return L(`${m[1]} से ${m[2]}, इसलिए ${m[3]}।`, `${m[1]} ਤੋਂ ${m[2]}, ਇਸ ਲਈ ${m[3]}।`);
  if (line === "An absolute value is zero only when its inside expression is zero.") return L("परम मान केवल तभी शून्य होता है जब अंदर का व्यंजक शून्य हो।", "ਪਰਮ ਮਾਨ ਕੇਵਲ ਤਦ ਹੀ ਸਿਫ਼ਰ ਹੁੰਦਾ ਹੈ ਜਦੋਂ ਅੰਦਰਲਾ ਵਿਆੰਜਕ ਸਿਫ਼ਰ ਹੋਵੇ।");
  if (line === "An absolute value can never be negative.") return L("परम मान कभी ऋणात्मक नहीं हो सकता।", "ਪਰਮ ਮਾਨ ਕਦੇ ਰਣਾਤਮਕ ਨਹੀਂ ਹੋ ਸਕਦਾ।");
  if ((m = line.match(/^The right-hand side is (.+), so no real value of x can satisfy the equation\.$/))) return L(`दायाँ पक्ष ${m[1]} है, इसलिए x का कोई वास्तविक मान समीकरण को संतुष्ट नहीं कर सकता।`, `ਸੱਜਾ ਪਾਸਾ ${m[1]} ਹੈ, ਇਸ ਲਈ x ਦਾ ਕੋਈ ਵਾਸਤਵਿਕ ਮਾਨ ਸਮੀਕਰਨ ਨੂੰ ਸੰਤੁਸ਼ਟ ਨਹੀਂ ਕਰ ਸਕਦਾ।`);
  if ((m = line.match(/^The two absolute values are the distances from x to (.+) and (.+)\.$/))) return L(`दोनों परम मान x की ${m[1]} और ${m[2]} से दूरियाँ हैं।`, `ਦੋਵੇਂ ਪਰਮ ਮਾਨ x ਦੀ ${m[1]} ਅਤੇ ${m[2]} ਤੋਂ ਦੂਰੀਆਂ ਹਨ।`);
  if ((m = line.match(/^An equally distant point lies at their midpoint: (.+)\.$/))) return L(`दोनों से समान दूरी वाला बिंदु उनके मध्यबिंदु पर होगा: ${m[1]}।`, `ਦੋਵੇਂ ਤੋਂ ਬਰਾਬਰ ਦੂਰੀ ਵਾਲਾ ਬਿੰਦੂ ਉਨ੍ਹਾਂ ਦੇ ਮੱਧ-ਬਿੰਦੂ ਤੇ ਹੋਵੇਗਾ: ${m[1]}।`);
  if ((m = line.match(/^Being less than (.+) means the inside expression must stay between (.+) and (.+)\.$/))) return L(`${m[1]} से छोटा परम मान होने का अर्थ है कि अंदर का व्यंजक ${m[2]} और ${m[3]} के बीच रहे।`, `${m[1]} ਤੋਂ ਛੋਟਾ ਪਰਮ ਮਾਨ ਹੋਣ ਦਾ ਅਰਥ ਹੈ ਕਿ ਅੰਦਰਲਾ ਵਿਆੰਜਕ ${m[2]} ਅਤੇ ${m[3]} ਦੇ ਵਿਚਕਾਰ ਰਹੇ।`);
  if ((m = line.match(/^Being at most (.+) means the inside expression must stay between (.+) and (.+)\.$/))) return L(`परम मान अधिकतम ${m[1]} होने का अर्थ है कि अंदर का व्यंजक ${m[2]} और ${m[3]} के बीच रहे।`, `ਪਰਮ ਮਾਨ ਵੱਧ ਤੋਂ ਵੱਧ ${m[1]} ਹੋਣ ਦਾ ਅਰਥ ਹੈ ਕਿ ਅੰਦਰਲਾ ਵਿਆੰਜਕ ${m[2]} ਅਤੇ ${m[3]} ਦੇ ਵਿਚਕਾਰ ਰਹੇ।`);
  if ((m = line.match(/^Solve (.+)\.$/))) return L(`${m[1]} को हल करें।`, `${m[1]} ਨੂੰ ਹੱਲ ਕਰੋ।`);
  if ((m = line.match(/^Solving this compound inequality for x gives (.+)\.$/))) return L(`इस संयुक्त असमानता को x के लिए हल करने पर ${m[1]} मिलता है।`, `ਇਸ ਸੰਯੁਕਤ ਅਸਮਾਨਤਾ ਨੂੰ x ਲਈ ਹੱਲ ਕਰਨ ਤੇ ${m[1]} ਮਿਲਦਾ ਹੈ।`);
  if ((m = line.match(/^The absolute value is at least (.+) when the inside expression lies beyond either boundary: (.+)\.$/))) return L(`परम मान कम-से-कम ${m[1]} तब होगा जब अंदर का व्यंजक किसी एक सीमा के बाहर हो: ${m[2]}।`, `ਪਰਮ ਮਾਨ ਘੱਟੋ-ਘੱਟ ${m[1]} ਤਦ ਹੋਵੇਗਾ ਜਦੋਂ ਅੰਦਰਲਾ ਵਿਆੰਜਕ ਕਿਸੇ ਇੱਕ ਸੀਮਾ ਤੋਂ ਬਾਹਰ ਹੋਵੇ: ${m[2]}।`);
  if ((m = line.match(/^The absolute value is greater than (.+) when the inside expression lies beyond either boundary: (.+)\.$/))) return L(`परम मान ${m[1]} से बड़ा तब होगा जब अंदर का व्यंजक किसी एक सीमा के बाहर हो: ${m[2]}।`, `ਪਰਮ ਮਾਨ ${m[1]} ਤੋਂ ਵੱਡਾ ਤਦ ਹੋਵੇਗਾ ਜਦੋਂ ਅੰਦਰਲਾ ਵਿਆੰਜਕ ਕਿਸੇ ਇੱਕ ਸੀਮਾ ਤੋਂ ਬਾਹਰ ਹੋਵੇ: ${m[2]}।`);
  if ((m = line.match(/^Solving both linear branches and taking their union gives (.+)\.$/))) return L(`दोनों रैखिक शाखाएँ हल करके उनका संघ लेने पर ${m[1]} मिलता है।`, `ਦੋਵੇਂ ਰੇਖੀ ਸ਼ਾਖਾਵਾਂ ਹੱਲ ਕਰਕੇ ਉਨ੍ਹਾਂ ਦਾ ਸੰਘ ਲੈਣ ਤੇ ${m[1]} ਮਿਲਦਾ ਹੈ।`);
  if (line === "Every absolute value is non-negative, so the inequality is true for every real x.") return L("हर परम मान ऋणेतर होता है, इसलिए असमानता प्रत्येक वास्तविक x के लिए सत्य है।", "ਹਰ ਪਰਮ ਮਾਨ ਗੈਰ-ਰਣਾਤਮਕ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ਅਸਮਾਨਤਾ ਹਰ ਵਾਸਤਵਿਕ x ਲਈ ਸੱਚ ਹੈ।");
  if (line === "The solution is all real numbers.") return L("हल सभी वास्तविक संख्याएँ हैं।", "ਹੱਲ ਸਾਰੀਆਂ ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ ਹਨ।");
  if ((m = line.match(/^First convert the absolute-value inequality into its bounded interval\.$/))) return L("पहले परम-मान असमानता को उसके सीमित अंतराल में बदलें।", "ਪਹਿਲਾਂ ਪਰਮ-ਮਾਨ ਅਸਮਾਨਤਾ ਨੂੰ ਉਸ ਦੇ ਸੀਮਿਤ ਅੰਤਰਾਲ ਵਿੱਚ ਬਦਲੋ।");
  if ((m = line.match(/^This gives (.+)\.$/))) return L(`इससे ${m[1]} मिलता है।`, `ਇਸ ਨਾਲ ${m[1]} ਮਿਲਦਾ ਹੈ।`);
  if ((m = line.match(/^Counting only the integers contained in that exact interval gives (.+)\.$/))) return L(`उस सटीक अंतराल में आने वाले केवल पूर्णांकों को गिनने पर ${m[1]} मिलता है।`, `ਉਸ ਸਹੀ ਅੰਤਰਾਲ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਕੇਵਲ ਪੂਰਨ ਅੰਕ ਗਿਣਣ ਤੇ ${m[1]} ਮਿਲਦਾ ਹੈ।`);

  // CP014 comparison and data sufficiency.
  if ((m = line.match(/^Substitute x = (.+) in both quantities\.$/))) return L(`दोनों राशियों में x = ${m[1]} रखें।`, `ਦੋਵੇਂ ਰਾਸ਼ੀਆਂ ਵਿੱਚ x = ${m[1]} ਰੱਖੋ।`);
  if ((m = line.match(/^Quantity I becomes (.+) and Quantity II becomes (.+)\.$/))) return L(`राशि I का मान ${m[1]} और राशि II का मान ${m[2]} हो जाता है।`, `ਰਾਸ਼ੀ I ਦਾ ਮਾਨ ${m[1]} ਅਤੇ ਰਾਸ਼ੀ II ਦਾ ਮਾਨ ${m[2]} ਹੋ ਜਾਂਦਾ ਹੈ।`);
  if ((m = line.match(/^Therefore Quantity I (.+) Quantity II\.$/))) return L(`अतः राशि I ${m[1]} राशि II।`, `ਇਸ ਲਈ ਰਾਸ਼ੀ I ${m[1]} ਰਾਸ਼ੀ II।`);
  if (line === "Check every allowed pairing, not just one convenient pair.") return L("सिर्फ एक सुविधाजनक युग्म नहीं, हर मान्य युग्म जाँचें।", "ਸਿਰਫ਼ ਇੱਕ ਸੁਵਿਧਾਜਨਕ ਜੋੜਾ ਨਹੀਂ, ਹਰ ਮਨਜ਼ੂਰ ਜੋੜਾ ਜਾਂਚੋ।");
  if ((m = line.match(/^Even the smallest possible Quantity I \((.+)\) is greater than the largest possible Quantity II \((.+)\)\.$/))) return L(`राशि I का सबसे छोटा संभव मान (${m[1]}) भी राशि II के सबसे बड़े संभव मान (${m[2]}) से बड़ा है।`, `ਰਾਸ਼ੀ I ਦਾ ਸਭ ਤੋਂ ਛੋਟਾ ਸੰਭਵ ਮਾਨ (${m[1]}) ਵੀ ਰਾਸ਼ੀ II ਦੇ ਸਭ ਤੋਂ ਵੱਡੇ ਸੰਭਵ ਮਾਨ (${m[2]}) ਤੋਂ ਵੱਡਾ ਹੈ।`);
  if (line === "Different allowed pairings give different relationships: Quantity I can be smaller in one case and larger in another.") return L("अलग-अलग मान्य युग्म अलग संबंध देते हैं: एक स्थिति में राशि I छोटी और दूसरी में बड़ी हो सकती है।", "ਵੱਖ-ਵੱਖ ਮਨਜ਼ੂਰ ਜੋੜੇ ਵੱਖ ਸੰਬੰਧ ਦਿੰਦੇ ਹਨ: ਇੱਕ ਸਥਿਤੀ ਵਿੱਚ ਰਾਸ਼ੀ I ਛੋਟੀ ਅਤੇ ਦੂਜੀ ਵਿੱਚ ਵੱਡੀ ਹੋ ਸਕਦੀ ਹੈ।");
  if (line === "Since one relation does not hold for every admissible case, the relationship cannot be determined.") return L("क्योंकि एक ही संबंध हर मान्य स्थिति में सत्य नहीं है, इसलिए संबंध निर्धारित नहीं किया जा सकता।", "ਕਿਉਂਕਿ ਇੱਕੋ ਸੰਬੰਧ ਹਰ ਮਨਜ਼ੂਰ ਸਥਿਤੀ ਵਿੱਚ ਸੱਚ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਸੰਬੰਧ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।");
  if (line === "Statement I fixes x at one exact value, so it is sufficient by itself.") return L("कथन I, x का एक सटीक मान निर्धारित करता है, इसलिए वह अकेला पर्याप्त है।", "ਕਥਨ I, x ਦਾ ਇੱਕ ਸਹੀ ਮਾਨ ਨਿਰਧਾਰਤ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਉਹ ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ।");
  if (line === "Statement II only restricts x to a range and allows many values.") return L("कथन II केवल x को एक सीमा में बाँधता है और अनेक मान संभव रहते हैं।", "ਕਥਨ II ਕੇਵਲ x ਨੂੰ ਇੱਕ ਹੱਦ ਵਿੱਚ ਬੰਨ੍ਹਦਾ ਹੈ ਅਤੇ ਕਈ ਮਾਨ ਸੰਭਵ ਰਹਿੰਦੇ ਹਨ।");
  if (line === "Therefore Statement I alone is sufficient.") return L("अतः कथन I अकेला पर्याप्त है।", "ਇਸ ਲਈ ਕਥਨ I ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ।");
  if (line === "Statement I gives only a range of possible x-values, so it is insufficient.") return L("कथन I केवल x के संभावित मानों की सीमा देता है, इसलिए वह अपर्याप्त है।", "ਕਥਨ I ਕੇਵਲ x ਦੇ ਸੰਭਵ ਮਾਨਾਂ ਦੀ ਹੱਦ ਦਿੰਦਾ ਹੈ, ਇਸ ਲਈ ਉਹ ਅਪਰਿਆਪਤ ਹੈ।");
  if (line === "Statement II gives one exact x-value and is sufficient by itself.") return L("कथन II, x का एक सटीक मान देता है और अकेला पर्याप्त है।", "ਕਥਨ II, x ਦਾ ਇੱਕ ਸਹੀ ਮਾਨ ਦਿੰਦਾ ਹੈ ਅਤੇ ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ।");
  if (line === "Therefore Statement II alone is sufficient.") return L("अतः कथन II अकेला पर्याप्त है।", "ਇਸ ਲਈ ਕਥਨ II ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ।");
  if (line === "Statement I alone gives one exact value of x.") return L("कथन I अकेला x का एक सटीक मान देता है।", "ਕਥਨ I ਇਕੱਲਾ x ਦਾ ਇੱਕ ਸਹੀ ਮਾਨ ਦਿੰਦਾ ਹੈ।");
  if (line === "Statement II alone also gives one exact value of x, and the statements are consistent.") return L("कथन II अकेला भी x का वही सटीक मान देता है और दोनों कथन संगत हैं।", "ਕਥਨ II ਇਕੱਲਾ ਵੀ x ਦਾ ਉਹੀ ਸਹੀ ਮਾਨ ਦਿੰਦਾ ਹੈ ਅਤੇ ਦੋਵੇਂ ਕਥਨ ਸੰਗਤ ਹਨ।");
  if (line === "Therefore either statement alone is sufficient.") return L("अतः किसी भी एक कथन से अकेले उत्तर मिल जाता है।", "ਇਸ ਲਈ ਕਿਸੇ ਵੀ ਇੱਕ ਕਥਨ ਨਾਲ ਇਕੱਲੇ ਉੱਤਰ ਮਿਲ ਜਾਂਦਾ ਹੈ।");
  if (line === "Each statement alone is one equation in two unknowns, so x is not fixed.") return L("प्रत्येक कथन अकेला दो अज्ञातों वाला एक समीकरण है, इसलिए x निश्चित नहीं होता।", "ਹਰ ਕਥਨ ਇਕੱਲਾ ਦੋ ਅਣਜਾਣਾਂ ਵਾਲੀ ਇੱਕ ਸਮੀਕਰਨ ਹੈ, ਇਸ ਲਈ x ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੁੰਦਾ।");
  if (line === "Taken together, the two equations are independent and have one unique solution.") return L("दोनों को साथ लेने पर समीकरण स्वतंत्र हैं और एक अद्वितीय हल मिलता है।", "ਦੋਵੇਂ ਨੂੰ ਇਕੱਠੇ ਲੈਣ ਤੇ ਸਮੀਕਰਨ ਸੁਤੰਤਰ ਹਨ ਅਤੇ ਇੱਕ ਇਕੋ ਹੱਲ ਮਿਲਦਾ ਹੈ।");
  if (line === "Therefore both statements together are sufficient, but neither alone is sufficient.") return L("अतः दोनों कथन साथ में पर्याप्त हैं, पर कोई भी अकेला पर्याप्त नहीं है।", "ਇਸ ਲਈ ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਕਾਫ਼ੀ ਹਨ, ਪਰ ਕੋਈ ਵੀ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।");
  if (line === "Statement II is only a multiple of Statement I, so the two statements describe the same line rather than two independent constraints.") return L("कथन II केवल कथन I का गुणज है, इसलिए दोनों कथन दो स्वतंत्र शर्तों के बजाय एक ही रेखा दर्शाते हैं।", "ਕਥਨ II ਕੇਵਲ ਕਥਨ I ਦਾ ਗੁਣਜ ਹੈ, ਇਸ ਲਈ ਦੋਵੇਂ ਕਥਨ ਦੋ ਸੁਤੰਤਰ ਸ਼ਰਤਾਂ ਦੀ ਬਜਾਏ ਇੱਕੋ ਰੇਖਾ ਦਰਸਾਉਂਦੇ ਹਨ।");
  if (line === "Infinitely many (x, y) pairs remain possible, so x is still not unique.") return L("अनंत (x, y) युग्म संभव रहते हैं, इसलिए x अभी भी अद्वितीय नहीं है।", "ਅਨੰਤ (x, y) ਜੋੜੇ ਸੰਭਵ ਰਹਿੰਦੇ ਹਨ, ਇਸ ਲਈ x ਅਜੇ ਵੀ ਇਕੋ ਨਹੀਂ ਹੈ।");
  if (line === "Therefore even both statements together are not sufficient.") return L("अतः दोनों कथन साथ लेने पर भी पर्याप्त नहीं हैं।", "ਇਸ ਲਈ ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਲੈਣ ਤੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ।");

  // Cubic Vieta and global sign dynamic lines.
  if ((m = line.match(/^For a cubic Ax³ \+ Bx² \+ Cx \+ D = 0, Vieta gives (.+)\.$/))) return L(`घन समीकरण Ax³ + Bx² + Cx + D = 0 के लिए वीटा से ${m[1]} मिलता है।`, `ਘਣ ਸਮੀਕਰਨ Ax³ + Bx² + Cx + D = 0 ਲਈ ਵੀਏਟਾ ਤੋਂ ${m[1]} ਮਿਲਦਾ ਹੈ।`);
  if ((m = line.match(/^For the asked (.+), use only (.+); the other two Vieta relations are not needed for the calculation\.$/))) return L(`माँगी गई ${m[1]} के लिए केवल ${m[2]} का उपयोग करें; गणना में वीटा के अन्य दो संबंध आवश्यक नहीं हैं।`, `ਮੰਗੀ ${m[1]} ਲਈ ਕੇਵਲ ${m[2]} ਵਰਤੋ; ਗਣਨਾ ਵਿੱਚ ਵੀਏਟਾ ਦੇ ਹੋਰ ਦੋ ਸੰਬੰਧ ਲੋੜੀਂਦੇ ਨਹੀਂ ਹਨ।`);
  if ((m = line.match(/^Here the (.+) is (.+), so the required value is (.+)\.$/))) return L(`यहाँ ${m[1]} ${m[2]} है, इसलिए आवश्यक मान ${m[3]} है।`, `ਇੱਥੇ ${m[1]} ${m[2]} ਹੈ, ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਮਾਨ ${m[3]} ਹੈ।`);
  if (line === "The individual roots do not need to be solved.") return L("अलग-अलग मूल निकालने की आवश्यकता नहीं है।", "ਵੱਖ-ਵੱਖ ਮੂਲ ਕੱਢਣ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।");
  if ((m = line.match(/^Use D = b² - 4ac\. Here D = (.+)\.$/))) return L(`D = b² - 4ac का उपयोग करें। यहाँ D = ${m[1]}।`, `D = b² - 4ac ਵਰਤੋ। ਇੱਥੇ D = ${m[1]}।`);
  if ((m = line.match(/^Apply the required discriminant condition: (.+)\.$/))) return L(`आवश्यक विविक्तकर शर्त लगाएँ: ${m[1]}।`, `ਲੋੜੀਂਦੀ ਵਿਭੇਦਕ ਸ਼ਰਤ ਲਗਾਓ: ${m[1]}।`);
  if ((m = line.match(/^Rearrange: (.+)\.$/))) return L(`पुनर्व्यवस्थित करें: ${m[1]}।`, `ਦੁਬਾਰਾ ਵਿਵਸਥਿਤ ਕਰੋ: ${m[1]}।`);
  if ((m = line.match(/^Divide by (.+): (.+)\.$/))) return L(`${m[1]} से भाग दें: ${m[2]}।`, `${m[1]} ਨਾਲ ਭਾਗ ਦਿਓ: ${m[2]}।`);

  return null;
}

function criticalFamily(prototypeId: string): boolean {
  return ["ALG-CP004-", "ALG-CP005-", "ALG-CP006-", "ALG-CP007-", "ALG-CP008-", "ALG-CP009-", "ALG-CP013-", "ALG-CP014-"].some((prefix) => prototypeId.startsWith(prefix))
    || prototypeId === "ALG-CP010-CAND-012"
    || prototypeId === "ALG-CP012-CAND-009";
}

function directExplanation(item: AlgPermanentMultilingualReviewV2Item): string {
  if (!criticalFamily(item.prototypeId)) return item.explanation;
  const fallbackLines = item.explanation.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const englishLines = item.englishExplanation.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  return englishLines.map((line, index) => {
    const direct = translateCriticalLine(item.locale, item.prototypeId, line, item.englishExplanation);
    if (direct) return direct;
    return fallbackLines[index] ?? line;
  }).join("\n");
}

export function generateAlgPermanentMultilingualReviewV2Editorial(
  qlId: AlgPermanentQlId,
  seed: number,
  locale: AlgReviewLocale,
  requestedVariantIndex?: number,
): AlgPermanentMultilingualReviewV2Item {
  const item = generateV2(qlId, seed, locale, requestedVariantIndex);
  return {
    ...item,
    question: directQuestion(locale, item.prototypeId, item.englishQuestion, item.question),
    explanation: directExplanation(item),
  };
}
