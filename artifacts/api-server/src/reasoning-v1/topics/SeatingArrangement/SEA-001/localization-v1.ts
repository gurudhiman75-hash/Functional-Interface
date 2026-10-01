import { buildSea001EnglishReviewPackV1, type Sea001EnglishReviewPackItemV1 } from "./english-review-pack-v1.ts";
import { localizeSea001NativeNames } from "./localization-name-pack-v2.ts";

export type Sea001LocaleV1 = "hi-IN" | "pa-IN";

export interface Sea001LocalizedReviewItemV1 extends Omit<Sea001EnglishReviewPackItemV1, "stem" | "options" | "explanation" | "reviewStatus"> {
  locale: Sea001LocaleV1;
  stem: string;
  options: readonly string[];
  explanation: string;
  sourceEnglishItemId: string;
  reviewStatus: "LOCALIZATION_REVIEW_REQUIRED";
}

function tr(locale: Sea001LocaleV1, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function names(text: string, locale: Sea001LocaleV1): string {
  return localizeSea001NativeNames(text, locale);
}

function relation(value: string, locale: Sea001LocaleV1): string {
  const base = value
    .replace(/^Immediately to the left$/i, tr(locale, "तुरंत बाईं ओर", "ਤੁਰੰਤ ਖੱਬੇ ਪਾਸੇ"))
    .replace(/^Immediately to the right$/i, tr(locale, "तुरंत दाईं ओर", "ਤੁਰੰਤ ਸੱਜੇ ਪਾਸੇ"))
    .replace(/^Second to the left$/i, tr(locale, "बाईं ओर दूसरे स्थान पर", "ਖੱਬੇ ਪਾਸੇ ਦੂਜੇ ਸਥਾਨ 'ਤੇ"))
    .replace(/^Second to the right$/i, tr(locale, "दाईं ओर दूसरे स्थान पर", "ਸੱਜੇ ਪਾਸੇ ਦੂਜੇ ਸਥਾਨ 'ਤੇ"))
    .replace(/^Third to the left$/i, tr(locale, "बाईं ओर तीसरे स्थान पर", "ਖੱਬੇ ਪਾਸੇ ਤੀਜੇ ਸਥਾਨ 'ਤੇ"))
    .replace(/^Third to the right$/i, tr(locale, "दाईं ओर तीसरे स्थान पर", "ਸੱਜੇ ਪਾਸੇ ਤੀਜੇ ਸਥਾਨ 'ਤੇ"))
    .replace(/ - North$/i, tr(locale, " - उत्तर की ओर", " - ਉੱਤਰ ਵੱਲ"))
    .replace(/ - South$/i, tr(locale, " - दक्षिण की ओर", " - ਦੱਖਣ ਵੱਲ"));
  return names(base, locale);
}

function stemNative(text: string, locale: Sea001LocaleV1): string {
  let m: RegExpMatchArray | null;
  if (text === "Who sits at the left end of the row?") return tr(locale, "पंक्ति के बाएँ छोर पर कौन बैठा है?", "ਕਤਾਰ ਦੇ ਖੱਬੇ ਸਿਰੇ 'ਤੇ ਕੌਣ ਬੈਠਾ ਹੈ?");
  if (text === "Which pair sits at the two extreme ends of the row?") return tr(locale, "पंक्ति के दोनों छोरों पर कौन-सा जोड़ा बैठा है?", "ਕਤਾਰ ਦੇ ਦੋਵੇਂ ਸਿਰਿਆਂ 'ਤੇ ਕਿਹੜੀ ਜੋੜੀ ਬੈਠੀ ਹੈ?");
  if (text === "Which of the following statements is definitely true?") return tr(locale, "निम्नलिखित में से कौन-सा कथन निश्चित रूप से सत्य है?", "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਸਹੀ ਹੈ?");
  if ((m = text.match(/^Who sits second to the (left|right) of (.+)\?$/))) {
    return names(tr(locale,
      `${m[2]} के ${m[1] === "left" ? "बाईं" : "दाईं"} ओर दूसरे स्थान पर कौन बैठा है?`,
      `${m[2]} ਦੇ ${m[1] === "left" ? "ਖੱਬੇ" : "ਸੱਜੇ"} ਪਾਸੇ ਦੂਜੇ ਸਥਾਨ 'ਤੇ ਕੌਣ ਬੈਠਾ ਹੈ?`,
    ), locale);
  }
  if ((m = text.match(/^Who sits immediately to the (left|right) of (.+)\?$/))) {
    return names(tr(locale,
      `${m[2]} के तुरंत ${m[1] === "left" ? "बाईं" : "दाईं"} ओर कौन बैठा है?`,
      `${m[2]} ਦੇ ਤੁਰੰਤ ${m[1] === "left" ? "ਖੱਬੇ" : "ਸੱਜੇ"} ਪਾਸੇ ਕੌਣ ਬੈਠਾ ਹੈ?`,
    ), locale);
  }
  if ((m = text.match(/^Who are the immediate neighbours of (.+)\?$/))) return names(tr(locale, `${m[1]} के दोनों ओर तुरंत कौन-कौन बैठा है?`, `${m[1]} ਦੇ ਦੋਵੇਂ ਪਾਸਿਆਂ ਤੁਰੰਤ ਕੌਣ-ਕੌਣ ਬੈਠੇ ਹਨ?`), locale);
  if ((m = text.match(/^How many persons sit between (.+) and (.+)\?$/))) return names(tr(locale, `${m[1]} और ${m[2]} के बीच कितने व्यक्ति बैठे हैं?`, `${m[1]} ਅਤੇ ${m[2]} ਦੇ ਵਿਚਕਾਰ ਕਿੰਨੇ ਵਿਅਕਤੀ ਬੈਠੇ ਹਨ?`), locale);
  if ((m = text.match(/^Who sits opposite (.+)\?$/))) return names(tr(locale, `${m[1]} के ठीक सामने कौन बैठा है?`, `${m[1]} ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਕੌਣ ਬੈਠਾ ਹੈ?`), locale);
  if ((m = text.match(/^What is the position of (.+) with respect to (.+)\?$/))) return names(tr(locale, `${m[2]} के सापेक्ष ${m[1]} का स्थान क्या है?`, `${m[2]} ਦੇ ਸਬੰਧ ਵਿੱਚ ${m[1]} ਦੀ ਸਥਿਤੀ ਕੀ ਹੈ?`), locale);
  if ((m = text.match(/^How many persons are facing (north|south)\?$/))) return tr(locale, `${m[1] === "north" ? "उत्तर" : "दक्षिण"} की ओर मुख करके कितने व्यक्ति बैठे हैं?`, `${m[1] === "north" ? "ਉੱਤਰ" : "ਦੱਖਣ"} ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਕਿੰਨੇ ਵਿਅਕਤੀ ਬੈਠੇ ਹਨ?`);
  if ((m = text.match(/^Who sits at the extreme (right|left) end and which direction does that person face\?$/))) return tr(locale, `सबसे ${m[1] === "right" ? "दाएँ" : "बाएँ"} छोर पर कौन बैठा है और उसका मुख किस दिशा में है?`, `ਸਭ ਤੋਂ ${m[1] === "right" ? "ਸੱਜੇ" : "ਖੱਬੇ"} ਸਿਰੇ 'ਤੇ ਕੌਣ ਬੈਠਾ ਹੈ ਅਤੇ ਉਸ ਦਾ ਮੂੰਹ ਕਿਸ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`);
  if ((m = text.match(/^If everyone changes their facing direction, who will sit second to the left of (.+)\?$/))) return names(tr(locale, `यदि सभी व्यक्ति अपने मुख की दिशा बदल लें, तो ${m[1]} के बाईं ओर दूसरे स्थान पर कौन बैठेगा?`, `ਜੇ ਸਾਰੇ ਵਿਅਕਤੀ ਆਪਣੇ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਬਦਲ ਲੈਣ, ਤਾਂ ${m[1]} ਦੇ ਖੱਬੇ ਪਾਸੇ ਦੂਜੇ ਸਥਾਨ 'ਤੇ ਕੌਣ ਬੈਠੇਗਾ?`), locale);
  if ((m = text.match(/^How many persons sit (clockwise|anticlockwise) between (.+) and (.+)\?$/))) return names(tr(locale, `${m[2]} से ${m[3]} तक ${m[1] === "clockwise" ? "घड़ी की दिशा में" : "घड़ी की विपरीत दिशा में"} कितने व्यक्ति बीच में बैठे हैं?`, `${m[2]} ਤੋਂ ${m[3]} ਤੱਕ ${m[1] === "clockwise" ? "ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ" : "ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ"} ਵਿਚਕਾਰ ਕਿੰਨੇ ਵਿਅਕਤੀ ਬੈਠੇ ਹਨ?`), locale);
  if ((m = text.match(/^How many persons sit between (.+) and (.+) when counted clockwise from (.+)\?$/))) return names(tr(locale, `${m[3]} से घड़ी की दिशा में गिनने पर ${m[1]} और ${m[2]} के बीच कितने व्यक्ति बैठे हैं?`, `${m[3]} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਗਿਣਣ 'ਤੇ ${m[1]} ਅਤੇ ${m[2]} ਦੇ ਵਿਚਕਾਰ ਕਿੰਨੇ ਵਿਅਕਤੀ ਬੈਠੇ ਹਨ?`), locale);
  if ((m = text.match(/^Which sequence lists the next three persons clockwise from (.+)\?$/))) return names(tr(locale, `${m[1]} से घड़ी की दिशा में अगले तीन व्यक्तियों का सही क्रम कौन-सा है?`, `${m[1]} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਅਗਲੇ ਤਿੰਨ ਵਿਅਕਤੀਆਂ ਦਾ ਸਹੀ ਕ੍ਰਮ ਕਿਹੜਾ ਹੈ?`), locale);
  throw new Error(`SEA-001 localization: unsupported stem "${text}"`);
}

function optionNative(value: string, locale: Sea001LocaleV1): string {
  let output = relation(value, locale);
  output = output
    .replace(/\band\b/gi, tr(locale, "और", "ਅਤੇ"))
    .replace(/sits second to the left of/gi, tr(locale, "के बाईं ओर दूसरे स्थान पर बैठा है", "ਦੇ ਖੱਬੇ ਪਾਸੇ ਦੂਜੇ ਸਥਾਨ 'ਤੇ ਬੈਠਾ ਹੈ"))
    .replace(/sits second to the right of/gi, tr(locale, "के दाईं ओर दूसरे स्थान पर बैठा है", "ਦੇ ਸੱਜੇ ਪਾਸੇ ਦੂਜੇ ਸਥਾਨ 'ਤੇ ਬੈਠਾ ਹੈ"))
    .replace(/sits immediately to the left of/gi, tr(locale, "के तुरंत बाईं ओर बैठा है", "ਦੇ ਤੁਰੰਤ ਖੱਬੇ ਪਾਸੇ ਬੈਠਾ ਹੈ"))
    .replace(/sits immediately to the right of/gi, tr(locale, "के तुरंत दाईं ओर बैठा है", "ਦੇ ਤੁਰੰਤ ਸੱਜੇ ਪਾਸੇ ਬੈਠਾ ਹੈ"));
  return names(output, locale);
}

function facingNative(raw: string, locale: Sea001LocaleV1): string {
  if (raw === "north") return tr(locale, "उत्तर की ओर", "ਉੱਤਰ ਵੱਲ");
  if (raw === "south") return tr(locale, "दक्षिण की ओर", "ਦੱਖਣ ਵੱਲ");
  if (raw === "the centre") return tr(locale, "केंद्र की ओर", "ਕੇਂਦਰ ਵੱਲ");
  if (raw === "outward") return tr(locale, "बाहर की ओर", "ਬਾਹਰ ਵੱਲ");
  return raw;
}

function directionNative(raw: string, locale: Sea001LocaleV1): string {
  if (raw === "clockwise") return tr(locale, "घड़ी की दिशा में", "ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ");
  if (raw === "anticlockwise") return tr(locale, "घड़ी की विपरीत दिशा में", "ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ");
  if (raw === "left") return tr(locale, "बाएँ", "ਖੱਬੇ");
  if (raw === "right") return tr(locale, "दाएँ", "ਸੱਜੇ");
  return raw;
}

function explanationNative(text: string, locale: Sea001LocaleV1): string {
  let m: RegExpMatchArray | null;

  if ((m = text.match(/^(.+) is shown in seat (\d+), which is the left-end seat\.$/))) {
    return names(tr(locale, `${m[1]} सीट ${m[2]} पर है, जो पंक्ति का बायाँ छोर है।`, `${m[1]} ਸੀਟ ${m[2]} 'ਤੇ ਹੈ, ਜੋ ਕਤਾਰ ਦਾ ਖੱਬਾ ਸਿਰਾ ਹੈ।`), locale);
  }
  if ((m = text.match(/^(.+) faces (north|south)\. Applying that person's right-direction rule and moving two seats reaches (.+)\.$/))) {
    return names(tr(locale, `${m[1]} का मुख ${facingNative(m[2]!, locale)} है। उस व्यक्ति के दाएँ की दिशा लेकर दो स्थान आगे बढ़ने पर ${m[3]} मिलता है।`, `${m[1]} ਦਾ ਮੂੰਹ ${facingNative(m[2]!, locale)} ਹੈ। ਉਸ ਵਿਅਕਤੀ ਦੇ ਸੱਜੇ ਪਾਸੇ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਦੋ ਸਥਾਨ ਅੱਗੇ ਜਾਣ 'ਤੇ ${m[3]} ਮਿਲਦਾ ਹੈ।`), locale);
  }
  if ((m = text.match(/^Count only the seats strictly between (.+) and (.+)\. The count is (\d+)\.$/))) {
    return names(tr(locale, `${m[1]} और ${m[2]} के बीच की सीटें ही गिनें। कुल ${m[3]} व्यक्ति बैठते हैं।`, `${m[1]} ਅਤੇ ${m[2]} ਦੇ ਵਿਚਕਾਰ ਵਾਲੀਆਂ ਸੀਟਾਂ ਹੀ ਗਿਣੋ। ਕੁੱਲ ${m[3]} ਵਿਅਕਤੀ ਬੈਠਦੇ ਹਨ।`), locale);
  }
  if ((m = text.match(/^(.+) faces (north|south)\. Therefore, .+'s left is towards the (left|right) end of the row\. Moving two seats in that direction reaches (.+)\.$/))) {
    return names(tr(locale, `${m[1]} का मुख ${facingNative(m[2]!, locale)} है। इसलिए उसका बायाँ पंक्ति के ${directionNative(m[3]!, locale)} छोर की ओर होगा। उसी दिशा में दो स्थान बढ़ने पर ${m[4]} मिलता है।`, `${m[1]} ਦਾ ਮੂੰਹ ${facingNative(m[2]!, locale)} ਹੈ। ਇਸ ਲਈ ਉਸਦਾ ਖੱਬਾ ਕਤਾਰ ਦੇ ${directionNative(m[3]!, locale)} ਸਿਰੇ ਵੱਲ ਹੋਵੇਗਾ। ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਦੋ ਸਥਾਨ ਅੱਗੇ ਜਾਣ 'ਤੇ ${m[4]} ਮਿਲਦਾ ਹੈ।`), locale);
  }
  if ((m = text.match(/^(.+) faces (north|south)\. Hence, .+'s right is towards the (left|right) end of the row, where (.+) is seated\.$/))) {
    return names(tr(locale, `${m[1]} का मुख ${facingNative(m[2]!, locale)} है। इसलिए उसका दायाँ पंक्ति के ${directionNative(m[3]!, locale)} छोर की ओर होगा, जहाँ ${m[4]} बैठा है।`, `${m[1]} ਦਾ ਮੂੰਹ ${facingNative(m[2]!, locale)} ਹੈ। ਇਸ ਲਈ ਉਸਦਾ ਸੱਜਾ ਕਤਾਰ ਦੇ ${directionNative(m[3]!, locale)} ਸਿਰੇ ਵੱਲ ਹੋਵੇਗਾ, ਜਿੱਥੇ ${m[4]} ਬੈਠਾ ਹੈ।`), locale);
  }
  if ((m = text.match(/^(.+) and (.+) occupy the two seats directly beside (.+)\.(?: Facing does not change (?:physical )?adjacency\.)?$/))) {
    return names(tr(locale, `${m[1]} और ${m[2]}, ${m[3]} के दोनों ओर वाली सीटों पर बैठे हैं। मुख की दिशा से पास-पास बैठने का संबंध नहीं बदलता।`, `${m[1]} ਅਤੇ ${m[2]}, ${m[3]} ਦੇ ਦੋਵੇਂ ਪਾਸਿਆਂ ਵਾਲੀਆਂ ਸੀਟਾਂ 'ਤੇ ਬੈਠੇ ਹਨ। ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਨਾਲ ਨਾਲ-ਨਾਲ ਬੈਠਣ ਦਾ ਸੰਬੰਧ ਨਹੀਂ ਬਦਲਦਾ।`), locale);
  }
  if ((m = text.match(/^(.+) and (.+) are (\d+) seats apart, so (\d+) − 1 = (\d+) (?:person sits|persons sit) between them\.$/))) {
    return names(tr(locale, `${m[1]} और ${m[2]} की सीटों में ${m[3]} स्थान का अंतर है। इसलिए ${m[4]} − 1 = ${m[5]}; अतः उनके बीच ${m[5]} व्यक्ति बैठते हैं।`, `${m[1]} ਅਤੇ ${m[2]} ਦੀਆਂ ਸੀਟਾਂ ਵਿੱਚ ${m[3]} ਸਥਾਨਾਂ ਦਾ ਫਰਕ ਹੈ। ਇਸ ਲਈ ${m[4]} − 1 = ${m[5]}; ਇਸ ਕਰਕੇ ਉਨ੍ਹਾਂ ਦੇ ਵਿਚਕਾਰ ${m[5]} ਵਿਅਕਤੀ ਬੈਠਦੇ ਹਨ।`), locale);
  }
  if ((m = text.match(/^All persons face the centre, so left means clockwise\. Moving two seats clockwise from (.+) reaches (.+)\.$/))) {
    return names(tr(locale, `सभी व्यक्ति केंद्र की ओर मुख किए हैं, इसलिए बायाँ घड़ी की दिशा में होगा। ${m[1]} से घड़ी की दिशा में दो स्थान आगे बढ़ने पर ${m[2]} मिलता है।`, `ਸਾਰੇ ਵਿਅਕਤੀ ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ, ਇਸ ਲਈ ਖੱਬਾ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਹੋਵੇਗਾ। ${m[1]} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਦੋ ਸਥਾਨ ਅੱਗੇ ਜਾਣ 'ਤੇ ${m[2]} ਮਿਲਦਾ ਹੈ।`), locale);
  }
  if ((m = text.match(/^Everyone faces outward, so left means anticlockwise\. Moving two seats anticlockwise from (.+) reaches (.+)\.$/))) {
    return names(tr(locale, `सभी व्यक्ति बाहर की ओर मुख किए हैं, इसलिए बायाँ घड़ी की विपरीत दिशा में होगा। ${m[1]} से उसी दिशा में दो स्थान आगे बढ़ने पर ${m[2]} मिलता है।`, `ਸਾਰੇ ਵਿਅਕਤੀ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ, ਇਸ ਲਈ ਖੱਬਾ ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਹੋਵੇਗਾ। ${m[1]} ਤੋਂ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਦੋ ਸਥਾਨ ਅੱਗੇ ਜਾਣ 'ਤੇ ${m[2]} ਮਿਲਦਾ ਹੈ।`), locale);
  }
  if ((m = text.match(/^The clockwise distance is (\d+) seats, so (\d+) − 1 = (\d+)(?:; therefore, (?:1 person lies|\d+ persons lie)| (?:person sits|persons sit)) strictly between them\.$/))) {
    return tr(locale, `घड़ी की दिशा में दूरी ${m[1]} सीट है। इसलिए ${m[2]} − 1 = ${m[3]}; दोनों के बीच ${m[3]} व्यक्ति बैठते हैं।`, `ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਦੂਰੀ ${m[1]} ਸੀਟਾਂ ਹੈ। ਇਸ ਲਈ ${m[2]} − 1 = ${m[3]}; ਦੋਵਾਂ ਦੇ ਵਿਚਕਾਰ ${m[3]} ਵਿਅਕਤੀ ਬੈਠਦੇ ਹਨ।`);
  }
  if ((m = text.match(/^In a circle of (\d+) persons, the opposite seat is (\d+) positions away\. (?:That seat is occupied by (.+)|(.+) occupies that seat)\.$/))) {
    const who = m[3] ?? m[4]!;
    return names(tr(locale, `${m[1]} व्यक्तियों के वृत्त में सामने वाली सीट ${m[2]} स्थान दूर होती है। उस सीट पर ${who} बैठा है।`, `${m[1]} ਵਿਅਕਤੀਆਂ ਦੇ ਘੇਰੇ ਵਿੱਚ ਸਾਹਮਣੇ ਵਾਲੀ ਸੀਟ ${m[2]} ਸਥਾਨ ਦੂਰ ਹੁੰਦੀ ਹੈ। ਉਸ ਸੀਟ 'ਤੇ ${who} ਬੈਠਾ ਹੈ।`), locale);
  }
  if ((m = text.match(/^With (\d+) seats, the opposite position is (\d+) seats away\. (.+) occupies it\.$/))) {
    return names(tr(locale, `${m[1]} सीटों में सामने वाली स्थिति ${m[2]} सीट दूर होती है। वहाँ ${m[3]} बैठा है।`, `${m[1]} ਸੀਟਾਂ ਵਿੱਚ ਸਾਹਮਣੇ ਵਾਲੀ ਸਥਿਤੀ ${m[2]} ਸੀਟਾਂ ਦੂਰ ਹੁੰਦੀ ਹੈ। ਉੱਥੇ ${m[3]} ਬੈਠਾ ਹੈ।`), locale);
  }
  if ((m = text.match(/^Starting immediately clockwise from (.+), the next three persons are (.+)\.$/))) {
    return names(tr(locale, `${m[1]} के तुरंत बाद घड़ी की दिशा में अगले तीन व्यक्ति क्रमशः ${m[2]} हैं।`, `${m[1]} ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਅਗਲੇ ਤਿੰਨ ਵਿਅਕਤੀ ਕ੍ਰਮਵਾਰ ${m[2]} ਹਨ।`), locale);
  }
  if ((m = text.match(/^(.+) faces (the centre|outward)\. Therefore, .+'s left is (clockwise|anticlockwise)\. Moving two seats in that direction reaches (.+)\.$/))) {
    return names(tr(locale, `${m[1]} का मुख ${facingNative(m[2]!, locale)} है। इसलिए उसका बायाँ ${directionNative(m[3]!, locale)} होगा। उसी दिशा में दो स्थान आगे बढ़ने पर ${m[4]} मिलता है।`, `${m[1]} ਦਾ ਮੂੰਹ ${facingNative(m[2]!, locale)} ਹੈ। ਇਸ ਲਈ ਉਸਦਾ ਖੱਬਾ ${directionNative(m[3]!, locale)} ਹੋਵੇਗਾ। ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਦੋ ਸਥਾਨ ਅੱਗੇ ਜਾਣ 'ਤੇ ${m[4]} ਮਿਲਦਾ ਹੈ।`), locale);
  }
  if ((m = text.match(/^(.+) faces (the centre|outward)\. Hence, .+'s right is (clockwise|anticlockwise), where (.+) is seated\.$/))) {
    return names(tr(locale, `${m[1]} का मुख ${facingNative(m[2]!, locale)} है। इसलिए उसका दायाँ ${directionNative(m[3]!, locale)} होगा, जहाँ ${m[4]} बैठा है।`, `${m[1]} ਦਾ ਮੂੰਹ ${facingNative(m[2]!, locale)} ਹੈ। ਇਸ ਲਈ ਉਸਦਾ ਸੱਜਾ ${directionNative(m[3]!, locale)} ਹੋਵੇਗਾ, ਜਿੱਥੇ ${m[4]} ਬੈਠਾ ਹੈ।`), locale);
  }
  if ((m = text.match(/^(.+) originally faces (the centre|outward); after everyone changes facing, .+ faces (the centre|outward)\. Under that new facing, left is (clockwise|anticlockwise), so the second person to the left is (.+)\.$/))) {
    return names(tr(locale, `${m[1]} का मुख पहले ${facingNative(m[2]!, locale)} है। सभी की मुख-दिशा बदलने पर उसका मुख ${facingNative(m[3]!, locale)} हो जाता है। नई स्थिति में बायाँ ${directionNative(m[4]!, locale)} है, इसलिए बाईं ओर दूसरे स्थान पर ${m[5]} बैठा है।`, `${m[1]} ਦਾ ਮੂੰਹ ਪਹਿਲਾਂ ${facingNative(m[2]!, locale)} ਹੈ। ਸਭ ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਬਦਲਣ 'ਤੇ ਉਸਦਾ ਮੂੰਹ ${facingNative(m[3]!, locale)} ਹੋ ਜਾਂਦਾ ਹੈ। ਨਵੀਂ ਸਥਿਤੀ ਵਿੱਚ ਖੱਬਾ ${directionNative(m[4]!, locale)} ਹੈ, ਇਸ ਲਈ ਖੱਬੇ ਪਾਸੇ ਦੂਜੇ ਸਥਾਨ 'ਤੇ ${m[5]} ਬੈਠਾ ਹੈ।`), locale);
  }
  if ((m = text.match(/^(.+) occupy the two extreme seats in the verified row\. Hence, that pair is correct\.$/))) {
    return tr(locale, `सत्यापित पंक्ति में ${optionNative(m[1]!, locale)} दोनों अंतिम छोरों पर बैठे हैं। इसलिए यही जोड़ी सही है।`, `ਪੱਕੀ ਕੀਤੀ ਕਤਾਰ ਵਿੱਚ ${optionNative(m[1]!, locale)} ਦੋਵੇਂ ਅੰਤਲੇ ਸਿਰਿਆਂ 'ਤੇ ਬੈਠੇ ਹਨ। ਇਸ ਲਈ ਇਹੀ ਜੋੜੀ ਸਹੀ ਹੈ।`);
  }
  if ((m = text.match(/^Trace the target person from the reference in the verified circular arrangement\. The relation is (.+)\. Hence, that option is correct\.$/))) {
    return names(tr(locale, `सत्यापित वृत्ताकार व्यवस्था में संदर्भ व्यक्ति से लक्ष्य व्यक्ति की स्थिति देखें। संबंध ${relation(m[1]!, locale)} है, इसलिए वही विकल्प सही है।`, `ਪੱਕੀ ਕੀਤੀ ਗੋਲ ਵਿਵਸਥਾ ਵਿੱਚ ਹਵਾਲਾ ਵਿਅਕਤੀ ਤੋਂ ਲਕਸ਼ ਵਿਅਕਤੀ ਦੀ ਸਥਿਤੀ ਵੇਖੋ। ਸੰਬੰਧ ${relation(m[1]!, locale)} ਹੈ, ਇਸ ਲਈ ਉਹੀ ਵਿਕਲਪ ਸਹੀ ਹੈ।`), locale);
  }
  if ((m = text.match(/^Check each option against the verified arrangement\. Only “(.+)” matches the actual positions, so it is definitely true\.$/))) {
    return names(tr(locale, `हर विकल्प को सत्यापित व्यवस्था से मिलाएँ। केवल “${optionNative(m[1]!, locale)}” वास्तविक स्थानों से मेल खाता है, इसलिए यही कथन निश्चित रूप से सत्य है।`, `ਹਰ ਵਿਕਲਪ ਨੂੰ ਪੱਕੀ ਕੀਤੀ ਵਿਵਸਥਾ ਨਾਲ ਮਿਲਾਓ। ਸਿਰਫ਼ “${optionNative(m[1]!, locale)}” ਅਸਲ ਸਥਿਤੀਆਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਕਥਨ ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਸਹੀ ਹੈ।`), locale);
  }
  if ((m = text.match(/^Count only the people facing the direction named in the question\. The verified facing pattern gives (\d+), so that is the correct answer\.$/))) {
    return tr(locale, `प्रश्न में दी गई दिशा की ओर मुख किए व्यक्तियों को ही गिनें। सत्यापित विन्यास में संख्या ${m[1]} है, इसलिए यही सही उत्तर है।`, `ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਦਿਸ਼ਾ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਵਿਅਕਤੀਆਂ ਨੂੰ ਹੀ ਗਿਣੋ। ਪੱਕੇ ਵਿਨਿਆਸ ਵਿੱਚ ਗਿਣਤੀ ${m[1]} ਹੈ, ਇਸ ਲਈ ਇਹੀ ਸਹੀ ਉੱਤਰ ਹੈ।`);
  }
  if ((m = text.match(/^Read the requested extreme seat, then note that person's facing from the verified mixed-facing row\. The correct person-direction pair is (.+)\.$/))) {
    return names(tr(locale, `माँगे गए अंतिम छोर की सीट देखें और सत्यापित मिश्रित-मुख पंक्ति में उस व्यक्ति की दिशा नोट करें। सही व्यक्ति-दिशा जोड़ी ${optionNative(m[1]!, locale)} है।`, `ਮੰਗੇ ਗਏ ਅੰਤਲੇ ਸਿਰੇ ਦੀ ਸੀਟ ਵੇਖੋ ਅਤੇ ਪੱਕੀ ਕੀਤੀ ਮਿਲੀ-ਜੁਲੀ ਮੂੰਹ ਵਾਲੀ ਕਤਾਰ ਵਿੱਚ ਉਸ ਵਿਅਕਤੀ ਦੀ ਦਿਸ਼ਾ ਨੋਟ ਕਰੋ। ਸਹੀ ਵਿਅਕਤੀ-ਦਿਸ਼ਾ ਜੋੜੀ ${optionNative(m[1]!, locale)} ਹੈ।`), locale);
  }

  throw new Error(`SEA-001 localization: unsupported explanation "${text}"`);
}

export function localizeSea001ReviewItemV1(
  item: Sea001EnglishReviewPackItemV1,
  locale: Sea001LocaleV1,
): Sea001LocalizedReviewItemV1 {
  return Object.freeze({
    ...item,
    locale,
    stem: stemNative(item.stem, locale),
    options: Object.freeze(item.options.map((option) => optionNative(option, locale))),
    explanation: explanationNative(item.explanation, locale),
    sourceEnglishItemId: item.itemId,
    reviewStatus: "LOCALIZATION_REVIEW_REQUIRED",
  });
}

export function buildSea001LocalizationReviewPackV1(locale: Sea001LocaleV1): readonly Sea001LocalizedReviewItemV1[] {
  return Object.freeze(buildSea001EnglishReviewPackV1().map((item) => localizeSea001ReviewItemV1(item, locale)));
}

export const SEA_001_LOCALIZATION_V1 = Object.freeze({
  authorityId: "SEA_001_LOCALIZATION_V2_NATIVE",
  sourceEnglishAuthority: "SEA_001_ENGLISH_FREEZE_V1",
  locales: ["hi-IN", "pa-IN"] as const,
  semanticStateSource: "FROZEN_ENGLISH",
  answerIndexParityRequired: true,
  qlParityRequired: true,
  difficultyParityRequired: true,
  diagramPolicy: "EXPLANATION_ONLY",
  nativeSentenceRendering: true,
  manualLocalizationReviewRequired: true,
  multilingualFreezePermitted: false,
  questionStudioRegistered: false,
  downstreamActivationPermitted: false,
});
