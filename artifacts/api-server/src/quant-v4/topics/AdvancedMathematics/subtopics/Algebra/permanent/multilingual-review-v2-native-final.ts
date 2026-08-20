import type { AlgPermanentQlId } from "./allocation";
import type { AlgReviewLocale } from "./multilingual-review-v1";
import {
  generateAlgPermanentMultilingualReviewV2Final,
} from "./multilingual-review-v2-final";
import type { AlgPermanentMultilingualReviewV2Item } from "./multilingual-review-v2";

function local(locale: AlgReviewLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function rewriteQuestion(item: AlgPermanentMultilingualReviewV2Item): string {
  const locale = item.locale;
  const en = item.englishQuestion;
  let m: RegExpMatchArray | null;

  if (item.prototypeId === "ALG-CP009-CAND-003" && (m = en.match(/^Solve (.+) and give the roots in exact form\.$/))) {
    return local(locale, `${m[1]} को हल कीजिए और मूलों को सटीक रूप में लिखिए।`, `${m[1]} ਨੂੰ ਹੱਲ ਕਰੋ ਅਤੇ ਮੂਲਾਂ ਨੂੰ ਸਹੀ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`);
  }
  if (item.prototypeId === "ALG-CP010-CAND-009" && (m = en.match(/^One root of (.+) is (.+)\. Find the other root\.$/))) {
    return local(locale, `${m[1]} का एक मूल ${m[2]} है। दूसरा मूल ज्ञात कीजिए।`, `${m[1]} ਦਾ ਇੱਕ ਮੂਲ ${m[2]} ਹੈ। ਦੂਜਾ ਮੂਲ ਪਤਾ ਕਰੋ।`);
  }
  if (item.prototypeId === "ALG-CP010-CAND-011" && (m = en.match(/^(.+)\. Form the monic quadratic whose roots are (.+)\.$/))) {
    return local(locale, `${m[1]}। ऐसा मोनिक द्विघात समीकरण बनाइए जिसके मूल ${m[2]} हों।`, `${m[1]}। ਅਜਿਹਾ ਮੋਨਿਕ ਦੋ-ਘਾਤੀ ਸਮੀਕਰਨ ਬਣਾਓ ਜਿਸ ਦੇ ਮੂਲ ${m[2]} ਹੋਣ।`);
  }
  if (item.prototypeId === "ALG-CP005-CAND-008" && (m = en.match(/^The polynomials (.+) and (.+) leave the same remainder when divided by (.+)\. Find k and the common remainder\.$/))) {
    return local(locale, `बहुपद ${m[1]} और ${m[2]} को ${m[3]} से भाग देने पर समान शेषफल मिलता है। k और वह समान शेषफल ज्ञात कीजिए।`, `ਬਹੁਪਦ ${m[1]} ਅਤੇ ${m[2]} ਨੂੰ ${m[3]} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਇੱਕੋ ਬਾਕੀ ਮਿਲਦਾ ਹੈ। k ਅਤੇ ਉਹ ਸਾਂਝਾ ਬਾਕੀ ਪਤਾ ਕਰੋ।`);
  }
  if (item.prototypeId === "ALG-CP012-CAND-011" && (m = en.match(/^x, y and z are positive real numbers and (.+)\. Find the least value of (.+)\.$/))) {
    return local(locale, `x, y और z धनात्मक वास्तविक संख्याएँ हैं तथा ${m[1]}। ${m[2]} का सबसे छोटा मान ज्ञात कीजिए।`, `x, y ਅਤੇ z ਧਨਾਤਮਕ ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ ਹਨ ਅਤੇ ${m[1]}। ${m[2]} ਦਾ ਸਭ ਤੋਂ ਘੱਟ ਮਾਨ ਪਤਾ ਕਰੋ।`);
  }
  if (item.prototypeId === "ALG-CP012-CAND-012" && (m = en.match(/^x, y and z are positive real numbers and (.+)\. Find the minimum value of (.+)\.$/))) {
    return local(locale, `x, y और z धनात्मक वास्तविक संख्याएँ हैं तथा ${m[1]}। ${m[2]} का न्यूनतम मान ज्ञात कीजिए।`, `x, y ਅਤੇ z ਧਨਾਤਮਕ ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ ਹਨ ਅਤੇ ${m[1]}। ${m[2]} ਦਾ ਘੱਟੋ-ਘੱਟ ਮਾਨ ਪਤਾ ਕਰੋ।`);
  }
  return item.question;
}

function rewritePrototypeExplanation(item: AlgPermanentMultilingualReviewV2Item): string {
  const locale = item.locale;
  let value = item.explanation;

  if (item.prototypeId === "ALG-CP001-CAND-006") {
    value = value.replace(/^At x = (.+), the denominator is nonzero, so the expression is defined\.$/gmi,
      local(locale, "x = $1 पर हर गैर-शून्य है, इसलिए व्यंजक परिभाषित है।", "x = $1 ਤੇ ਹਰ ਗੈਰ-ਸਿਫ਼ਰ ਹੈ, ਇਸ ਲਈ ਵਿਆੰਜਕ ਪਰਿਭਾਸ਼ਿਤ ਹੈ।"));
    value = value.replace(/^(?:पर|ਤੇ) x = (.+?), (?:हर|ਹਰ) (?:है|ਹੈ) non-(?:शून्य|ਸਿਫ਼ਰ), (?:इसलिए|ਇਸ ਲਈ) (?:व्यंजक|ਵਿਆੰਜਕ) (?:है|ਹੈ) (?:परिभाषित|ਪਰਿਭਾਸ਼ਿਤ)।$/gm,
      local(locale, "x = $1 पर हर गैर-शून्य है, इसलिए व्यंजक परिभाषित है।", "x = $1 ਤੇ ਹਰ ਗੈਰ-ਸਿਫ਼ਰ ਹੈ, ਇਸ ਲਈ ਵਿਆੰਜਕ ਪਰਿਭਾਸ਼ਿਤ ਹੈ।"));
  }

  if (item.prototypeId === "ALG-CP003-CAND-006") {
    value = value
      .replace(/^मान रखें यह b में (.+)\.$/gm, local(locale, "इस b का मान $1 में रखें।", "ਇਸ b ਦਾ ਮਾਨ $1 ਵਿੱਚ ਰੱਖੋ।"))
      .replace(/^ਮਾਨ ਰੱਖੋ ਇਹ b ਵਿੱਚ (.+)\.$/gm, "ਇਸ b ਦਾ ਮਾਨ $1 ਵਿੱਚ ਰੱਖੋ।")
      .replace(/^(.+) और सरल करें को obtain (.+) को अलग करें।$/gm, local(locale, "$1 को अलग करके सरल करें; $2 मिलता है।", "$1 ਨੂੰ ਅਲੱਗ ਕਰਕੇ ਸਰਲ ਕਰੋ; $2 ਮਿਲਦਾ ਹੈ।"))
      .replace(/^(.+) ਅਤੇ ਸਰਲ ਕਰੋ ਨੂੰ obtain (.+) ਨੂੰ ਅਲੱਗ ਕਰੋ।$/gm, "$1 ਨੂੰ ਅਲੱਗ ਕਰਕੇ ਸਰਲ ਕਰੋ; $2 ਮਿਲਦਾ ਹੈ।")
      .replace(/^अब मान रखें में आवश्यक व्यंजक: (.+)\.$/gm, local(locale, "अब आवश्यक व्यंजक में मान रखें: $1।", "ਹੁਣ ਲੋੜੀਂਦੇ ਵਿਆੰਜਕ ਵਿੱਚ ਮਾਨ ਰੱਖੋ: $1।"))
      .replace(/^ਹੁਣ ਮਾਨ ਰੱਖੋ ਵਿੱਚ ਲੋੜੀਂਦਾ ਵਿਆੰਜਕ: (.+)\.$/gm, "ਹੁਣ ਲੋੜੀਂਦੇ ਵਿਆੰਜਕ ਵਿੱਚ ਮਾਨ ਰੱਖੋ: $1।");
  }

  if (item.prototypeId === "ALG-CP005-CAND-008") {
    const given = item.englishQuestion.match(/^The polynomials (.+) and (.+) leave the same remainder when divided by (.+)\. Find k and the common remainder\.$/);
    if (given) {
      value = value.replace(/^दिया है:.*$/m, `दिया है: बहुपद ${given[1]} और ${given[2]} को ${given[3]} से भाग देने पर समान शेषफल मिलता है।`);
      value = value.replace(/^ਦਿੱਤਾ ਹੈ:.*$/m, `ਦਿੱਤਾ ਹੈ: ਬਹੁਪਦ ${given[1]} ਅਤੇ ${given[2]} ਨੂੰ ${given[3]} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਇੱਕੋ ਬਾਕੀ ਮਿਲਦਾ ਹੈ।`);
    }
    value = value
      .replace(/Equal remainders mean/gi, local(locale, "समान शेषफल का अर्थ है", "ਇੱਕੋ ਬਾਕੀ ਦਾ ਅਰਥ ਹੈ"))
      .replace(/equal remainders/gi, local(locale, "समान शेषफल", "ਇੱਕੋ ਬਾਕੀ"));
  }

  if (item.prototypeId === "ALG-CP009-CAND-002") {
    value = value
      .replace(/^left (?:ओर|ਪਾਸੇ) (?:है|ਹੈ) a (?:पूर्ण|ਪੂਰਨ) (?:वर्ग|ਵਰਗ) (?:और|ਅਤੇ) (?:गुणनखंड|ਗੁਣਨਖੰਡ) (?:के रूप में|ਦੇ ਰੂਪ ਵਿੱਚ) (.+)\.$/gm,
        local(locale, "बायाँ पक्ष पूर्ण वर्ग है और उसका गुणनखंड $1 है।", "ਖੱਬਾ ਪਾਸਾ ਪੂਰਨ ਵਰਗ ਹੈ ਅਤੇ ਉਸ ਦਾ ਗੁਣਨਖੰਡ $1 ਹੈ।"));
  }

  if (item.prototypeId === "ALG-CP010-CAND-009") {
    value = value
      .replace(/\bother (?:मूल|ਮੂਲ)\b/gi, local(locale, "दूसरा मूल", "ਦੂਜਾ ਮੂਲ"))
      .replace(/^दिया है: एक मूल का (.+) है (.+)।$/gm, "दिया है: $1 का एक मूल $2 है।")
      .replace(/^ਦਿੱਤਾ ਹੈ: ਇੱਕ ਮੂਲ ਦਾ (.+) ਹੈ (.+)।$/gm, "ਦਿੱਤਾ ਹੈ: $1 ਦਾ ਇੱਕ ਮੂਲ $2 ਹੈ।")
      .replace(/^ज्ञात करना है: दूसरा मूल।$/gm, "ज्ञात करना है: दूसरा मूल।")
      .replace(/^ਪਤਾ ਕਰਨਾ ਹੈ: ਦੂਜਾ ਮੂਲ।$/gm, "ਪਤਾ ਕਰਨਾ ਹੈ: ਦੂਜਾ ਮੂਲ।");
  }

  if (item.prototypeId === "ALG-CP010-CAND-011") {
    value = value.replace(/\bwhose (?:मूल|ਮੂਲ) (?:हैं|ਹਨ)\b/gi, local(locale, "जिसके मूल हैं", "ਜਿਸ ਦੇ ਮੂਲ ਹਨ"));
  }

  if (item.prototypeId === "ALG-CP011-CAND-006") {
    value = value
      .replace(/(?:अतः|ਇਸ ਲਈ) (?:संबंध|ਸੰਬੰਧ) (?:नहीं किया जा सकता|ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ) (?:हो|ਹੋਵੇ) established।/g,
        local(locale, "अतः संबंध निर्धारित नहीं किया जा सकता।", "ਇਸ ਲਈ ਸੰਬੰਧ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।"))
      .replace(/established/gi, local(locale, "निर्धारित", "ਨਿਰਧਾਰਤ"));
  }

  if (item.prototypeId === "ALG-CP014-CAND-001" || item.prototypeId.startsWith("ALG-CP014-")) {
    value = value
      .replace(/\bQuantity I\b/g, local(locale, "राशि I", "ਰਾਸ਼ੀ I"))
      .replace(/\bQuantity II\b/g, local(locale, "राशि II", "ਰਾਸ਼ੀ II"))
      .replace(/\bquantities\b/gi, local(locale, "राशियाँ", "ਰਾਸ਼ੀਆਂ"))
      .replace(/\bquantity\b/gi, local(locale, "राशि", "ਰਾਸ਼ੀ"));
  }

  if (item.prototypeId === "ALG-CP012-CAND-001") {
    value = value
      .replace(/अचर पद इसलिए चर पद है isolated को दूसरी ओर ले जाएँ।/g, "अचर पद को दूसरी ओर ले जाकर चर पद अलग करें।")
      .replace(/ਅਚਲ ਪਦ ਇਸ ਲਈ ਚਲ ਪਦ ਹੈ isolated ਨੂੰ ਦੂਜੇ ਪਾਸੇ ਲਿਜਾਓ।/g, "ਅਚਲ ਪਦ ਨੂੰ ਦੂਜੇ ਪਾਸੇ ਲਿਜਾ ਕੇ ਚਲ ਪਦ ਅਲੱਗ ਕਰੋ।")
      .replace(/भाग देने पर से (.+?) keeps असमानता sign unchanged/g, "$1 से भाग देने पर असमानता का चिन्ह नहीं बदलता")
      .replace(/ਭਾਗ [^।]* ਤੋਂ (.+?) keeps ਅਸਮਾਨਤਾ sign unchanged/g, "$1 ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਅਸਮਾਨਤਾ ਦਾ ਚਿੰਨ੍ਹ ਨਹੀਂ ਬਦਲਦਾ");
  }

  if (item.prototypeId === "ALG-CP012-CAND-002") {
    value = value
      .replace(/के बाद moving अचर पद, x है multiplied से (.+?)।/g, "अचर पद दूसरी ओर ले जाने पर x का गुणांक $1 है।")
      .replace(/ਤੋਂ ਬਾਅਦ moving ਅਚਲ ਪਦ, x ਹੈ multiplied ਤੋਂ (.+?)।/g, "ਅਚਲ ਪਦ ਦੂਜੇ ਪਾਸੇ ਲਿਜਾਣ ਤੇ x ਦਾ ਗੁਣਾਂਕ $1 ਹੈ।");
  }

  if (item.prototypeId === "ALG-CP012-CAND-003") {
    value = value
      .replace(/उनका intersection है (.+?) मिलता है।/g, "दोनों का प्रतिच्छेद $1 है।")
      .replace(/उनਦਾ intersection ਹੈ (.+?) ਮਿਲਦਾ ਹੈ।/g, "ਦੋਵਾਂ ਦਾ ਸਾਂਝਾ ਅੰਤਰਾਲ $1 ਹੈ।");
  }

  if (item.prototypeId === "ALG-CP012-CAND-005") {
    value = value
      .replace(/included/gi, local(locale, "शामिल", "ਸ਼ਾਮਲ"))
      .replace(/including/gi, local(locale, "सहित", "ਸਮੇਤ"));
  }

  if (item.prototypeId === "ALG-CP012-CAND-006") {
    value = value
      .replace(/\bnever\b/gi, local(locale, "कभी नहीं", "ਕਦੇ ਨਹੀਂ"))
      .replace(/\bitself\b/gi, local(locale, "स्वयं", "ਆਪ"));
  }

  if (item.prototypeId === "ALG-CP012-CAND-010") {
    value = value
      .replace(/\bcounting\b/gi, local(locale, "गिनने पर", "ਗਿਣਣ ਤੇ"))
      .replace(/\bincluding\b/gi, local(locale, "सहित", "ਸਮੇਤ"))
      .replace(/\bincluded\b/gi, local(locale, "शामिल", "ਸ਼ਾਮਲ"));
  }

  if (item.prototypeId === "ALG-CP012-CAND-011") {
    value = value
      .replace(/\bestimate\b/gi, local(locale, "अनुमान", "ਅਨੁਮਾਨ"))
      .replace(/\bproves\b/gi, local(locale, "सिद्ध करता है", "ਸਾਬਤ ਕਰਦਾ ਹੈ"))
      .replace(/\brather\b/gi, local(locale, "बल्कि", "ਸਗੋਂ"));
  }

  if (item.prototypeId === "ALG-CP013-CAND-007") {
    value = value.replace(/\bequals\b/gi, local(locale, "के बराबर है", "ਦੇ ਬਰਾਬਰ ਹੈ"));
  }

  return value;
}

const RESIDUAL_TOKEN_RULES: ReadonlyArray<readonly [RegExp, string, string]> = [
  [/\bcounting\b/gi, "गिनने पर", "ਗਿਣਣ ਤੇ"],
  [/\bequal\b/gi, "समान", "ਬਰਾਬਰ"],
  [/\bequals\b/gi, "के बराबर है", "ਦੇ ਬਰਾਬਰ ਹੈ"],
  [/\bestablished\b/gi, "निर्धारित", "ਨਿਰਧਾਰਤ"],
  [/\bestimate\b/gi, "अनुमान", "ਅਨੁਮਾਨ"],
  [/\bfunction\b/gi, "फलन", "ਫਲਨ"],
  [/\bgive\b/gi, "दीजिए", "ਦਿਓ"],
  [/\bincluded\b/gi, "शामिल", "ਸ਼ਾਮਲ"],
  [/\bincluding\b/gi, "सहित", "ਸਮੇਤ"],
  [/\bintersection\b/gi, "प्रतिच्छेद", "ਸਾਂਝਾ ਅੰਤਰਾਲ"],
  [/\bisolate\b/gi, "अलग करें", "ਅਲੱਗ ਕਰੋ"],
  [/\bisolated\b/gi, "अलग", "ਅਲੱਗ"],
  [/\bitself\b/gi, "स्वयं", "ਆਪ"],
  [/\bkeeps\b/gi, "बनाए रखता है", "ਬਰਕਰਾਰ ਰੱਖਦਾ ਹੈ"],
  [/\blast\b/gi, "अंतिम", "ਆਖਰੀ"],
  [/\bleft\b/gi, "बायाँ", "ਖੱਬਾ"],
  [/\bright\b/gi, "दायाँ", "ਸੱਜਾ"],
  [/\bmean\b/gi, "अर्थ है", "ਅਰਥ ਹੈ"],
  [/\bmiddle\b/gi, "मध्य", "ਵਿਚਕਾਰਲਾ"],
  [/\bmoving\b/gi, "ले जाने पर", "ਲਿਜਾਣ ਤੇ"],
  [/\bmultiplied\b/gi, "से गुणा है", "ਨਾਲ ਗੁਣਾ ਹੈ"],
  [/\bnever\b/gi, "कभी नहीं", "ਕਦੇ ਨਹੀਂ"],
  [/\bnon-(?=शून्य|ਸਿਫ਼ਰ)/gi, "गैर-", "ਗੈਰ-"],
  [/\bobtain\b/gi, "प्राप्त करें", "ਪ੍ਰਾਪਤ ਕਰੋ"],
  [/\bon\b/gi, "पर", "ਤੇ"],
  [/\bother\b/gi, "दूसरा", "ਦੂਜਾ"],
  [/\bproves\b/gi, "सिद्ध करता है", "ਸਾਬਤ ਕਰਦਾ ਹੈ"],
  [/\bquantities\b/gi, "राशियाँ", "ਰਾਸ਼ੀਆਂ"],
  [/\bquantity\b/gi, "राशि", "ਰਾਸ਼ੀ"],
  [/\brather\b/gi, "बल्कि", "ਸਗੋਂ"],
  [/\breciprocals\b/gi, "व्युत्क्रम", "ਵਿਉਤਕ੍ਰਮ"],
  [/\bremainders\b/gi, "शेषफल", "ਬਾਕੀ"],
  [/\bseparately\b/gi, "अलग-अलग", "ਵੱਖ-ਵੱਖ"],
  [/\btwice\b/gi, "दुगुना", "ਦੁੱਗਣਾ"],
  [/\bwhose\b/gi, "जिसके", "ਜਿਸ ਦੇ"],
  [/\bsign\b/gi, "चिन्ह", "ਚਿੰਨ੍ਹ"],
  [/\bunchanged\b/gi, "अपरिवर्तित", "ਬਿਨਾਂ ਬਦਲੇ"],
  [/\bform\b/gi, "रूप", "ਰੂਪ"],
];

function applyResidualTokens(locale: AlgReviewLocale, text: string): string {
  let value = text;
  for (const [pattern, hi, pa] of RESIDUAL_TOKEN_RULES) {
    value = value.replace(pattern, locale === "hi-IN" ? hi : pa);
  }
  if (locale === "pa-IN") {
    const scriptFixes: ReadonlyArray<readonly [RegExp, string]> = [
      [/सबसे/g, "ਸਭ ਤੋਂ"], [/रूप/g, "ਰੂਪ"], [/उनका/g, "ਉਨ੍ਹਾਂ ਦਾ"], [/उनकी/g, "ਉਨ੍ਹਾਂ ਦੀ"],
      [/देने/g, "ਦੇਣ"], [/पहला/g, "ਪਹਿਲਾ"], [/अंतिम/g, "ਆਖਰੀ"], [/मध्य/g, "ਵਿਚਕਾਰਲਾ"],
      [/दुगुना/g, "ਦੁੱਗਣਾ"], [/दूसरा/g, "ਦੂਜਾ"], [/स्वयं/g, "ਆਪ"], [/प्रतिच्छेद/g, "ਸਾਂਝਾ ਅੰਤਰਾਲ"],
      [/अनुमान/g, "ਅਨੁਮਾਨ"], [/सिद्ध करता है/g, "ਸਾਬਤ ਕਰਦਾ ਹੈ"], [/बल्कि/g, "ਸਗੋਂ"],
      [/अलग-अलग/g, "ਵੱਖ-ਵੱਖ"], [/अलग/g, "ਅਲੱਗ"], [/प्राप्त/g, "ਪ੍ਰਾਪਤ"], [/करें/g, "ਕਰੋ"],
      [/अपरिवर्तित/g, "ਬਿਨਾਂ ਬਦਲੇ"], [/चिन्ह/g, "ਚਿੰਨ੍ਹ"], [/राशियाँ/g, "ਰਾਸ਼ੀਆਂ"], [/राशि/g, "ਰਾਸ਼ੀ"],
    ];
    for (const [pattern, replacement] of scriptFixes) value = value.replace(pattern, replacement);
  }
  return value.replace(/\s{2,}/g, " ").trim();
}

export function generateAlgPermanentMultilingualReviewV2NativeFinal(
  qlId: AlgPermanentQlId,
  seed: number,
  locale: AlgReviewLocale,
  requestedVariantIndex?: number,
): AlgPermanentMultilingualReviewV2Item {
  const item = generateAlgPermanentMultilingualReviewV2Final(qlId, seed, locale, requestedVariantIndex);
  const question = applyResidualTokens(locale, rewriteQuestion(item));
  const explanation = applyResidualTokens(locale, rewritePrototypeExplanation(item));
  return { ...item, question, explanation };
}
