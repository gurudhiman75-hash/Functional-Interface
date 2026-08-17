import type { SapTranslationLanguage } from "./types";

function L(language: SapTranslationLanguage, hi: string, pa: string) {
  return language === "hi" ? hi : pa;
}

function clean(value: string) {
  return value.replace(/\s+([?.!,।])/gu, "$1").replace(/\s{2,}/gu, " ").trim();
}

function localizeOf(value: string, language: SapTranslationLanguage) {
  return value
    .replace(/\\text\{of\}/gu, language === "hi" ? "\\text{का}" : "\\text{ਦਾ}")
    .replace(/\bof\b/gu, language === "hi" ? "का" : "ਦਾ");
}

function estimateExpression(english: string) {
  const match = /(?:Estimate|estimate)\s+([\s\S]+?)[.]?$/u.exec(english);
  return match?.[1]?.replace(/[.]$/u, "") ?? english;
}

function valueAfterColon(english: string) {
  const index = english.indexOf(":");
  return index >= 0 ? english.slice(index + 1).trim().replace(/[.]$/u, "") : english.replace(/[.]$/u, "");
}

function directExpression(english: string) {
  return english
    .replace(/^(?:What is the exact value of|What is the value of|Find the exact value of|Find the value of|Evaluate|Simplify)\s*:?[ ]*/u, "")
    .replace(/[?.]$/u, "")
    .trim();
}

function roundUnit(language: SapTranslationLanguage, unit: string) {
  const u = unit.toLowerCase();
  if (u === "integer" || u === "whole number") return L(language, "पूर्णांक", "ਪੂਰਨ ਅੰਕ");
  if (u === "ten") return L(language, "दस", "ਦਸ");
  if (u === "hundred") return L(language, "सौ", "ਸੌ");
  if (u === "thousand") return L(language, "हज़ार", "ਹਜ਼ਾਰ");
  if (u === "multiple of 10") return L(language, "10 के गुणज", "10 ਦੇ ਗੁਣਜ");
  return unit;
}

function qlStem(base: any, current: string, language: SapTranslationLanguage) {
  const ql = String(base.questionLanguageId ?? "");
  const e = String(base.stem ?? "").trim();
  let m: RegExpExecArray | null;

  if (["SAP-QL-008", "SAP-QL-009", "SAP-QL-010"].includes(ql)) {
    return L(language, `सटीक मान ज्ञात कीजिए: ${directExpression(e)}`, `ਸਟੀਕ ਮੁੱਲ ਕੱਢੋ: ${directExpression(e)}`);
  }
  if (ql === "SAP-QL-012") {
    m = /^Without changing the grouping, compare (.+) and (.+)\.$/su.exec(e);
    if (m) return L(language, `समूहबद्धता बदले बिना ${m[1]} और ${m[2]} की तुलना कीजिए।`, `ਸਮੂਹਬੰਦੀ ਬਦਲੇ ਬਿਨਾਂ ${m[1]} ਅਤੇ ${m[2]} ਦੀ ਤੁਲਨਾ ਕਰੋ।`);
    m = /^Compare the values of Left = (.+) and Right = (.+)\.$/su.exec(e);
    if (m) return L(language, `बायाँ मान = ${m[1]} और दायाँ मान = ${m[2]}। दोनों की तुलना कीजिए।`, `ਖੱਬਾ ਮੁੱਲ = ${m[1]} ਅਤੇ ਸੱਜਾ ਮੁੱਲ = ${m[2]}। ਦੋਵਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।`);
  }
  if (ql === "SAP-QL-013") {
    m = /(?:correct grouping of|equivalent to) (.+)\?$/su.exec(e);
    const x = m?.[1] ?? directExpression(e);
    return L(language, `${x} के बराबर सही समूहबद्ध व्यंजक चुनिए।`, `${x} ਦੇ ਬਰਾਬਰ ਸਹੀ ਸਮੂਹਬੱਧ ਵਿਆੰਜਕ ਚੁਣੋ।`);
  }
  if (ql === "SAP-QL-014") {
    m = /(?:simplifying|solution of) (.+)\?$/su.exec(e);
    const x = m?.[1] ?? directExpression(e);
    return L(language, `${x} को हल करने का सही पहला कदम कौन-सा है?`, `${x} ਨੂੰ ਹੱਲ ਕਰਨ ਦਾ ਸਹੀ ਪਹਿਲਾ ਕਦਮ ਕਿਹੜਾ ਹੈ?`);
  }
  if (ql === "SAP-QL-015") {
    const block = e.replace(/^The following steps were used for /u, "").replace(/^Check the worked solution for /u, "").replace(/^A student simplifies /u, "");
    const localizedBlock = block
      .replace(/Identify the earliest incorrect step\.$/u, L(language, "सबसे पहला गलत चरण बताइए।", "ਸਭ ਤੋਂ ਪਹਿਲਾ ਗਲਤ ਕਦਮ ਦੱਸੋ।"))
      .replace(/Which step is incorrect first\?$/u, L(language, "सबसे पहला गलत चरण कौन-सा है?", "ਸਭ ਤੋਂ ਪਹਿਲਾ ਗਲਤ ਕਦਮ ਕਿਹੜਾ ਹੈ?"))
      .replace(/Which is the first incorrect step\?$/u, L(language, "सबसे पहला गलत चरण कौन-सा है?", "ਸਭ ਤੋਂ ਪਹਿਲਾ ਗਲਤ ਕਦਮ ਕਿਹੜਾ ਹੈ?"))
      .replace(/Step\s+(\d+):/gu, (_x, n) => L(language, `चरण ${n}:`, `ਕਦਮ ${n}:`));
    return clean(localizedBlock);
  }
  if (ql === "SAP-QL-016") {
    m = /^After replacing (.+) by (.+) in (.+), what value is obtained\?$/su.exec(e);
    if (m) return L(language, `${m[3]} में ${m[1]} की जगह ${m[2]} रखने पर मान ज्ञात कीजिए।`, `${m[3]} ਵਿੱਚ ${m[1]} ਦੀ ਥਾਂ ${m[2]} ਰੱਖ ਕੇ ਮੁੱਲ ਕੱਢੋ।`);
    m = /^Evaluate (.+), given that (.+)\.$/su.exec(e);
    if (m) return L(language, `${m[2]} दिया है। ${m[1]} का मान ज्ञात कीजिए।`, `${m[2]} ਦਿੱਤਾ ਹੈ। ${m[1]} ਦਾ ਮੁੱਲ ਕੱਢੋ।`);
  }

  if (["SAP-QL-019", "SAP-QL-027", "SAP-QL-028"].includes(ql)) {
    const x = directExpression(e).replace(/ Answer.*$/u, "");
    return L(language, `सटीक मान ज्ञात कीजिए और उत्तर को सरल भिन्न में लिखिए: ${x}`, `ਸਟੀਕ ਮੁੱਲ ਕੱਢੋ ਅਤੇ ਉੱਤਰ ਸਭ ਤੋਂ ਸਰਲ ਭਿੰਨ ਵਿੱਚ ਲਿਖੋ: ${x}`);
  }
  if (["SAP-QL-021", "SAP-QL-022"].includes(ql)) {
    const x = e.replace(/^Find the value of /u, "").replace(/ using correct fraction operations\.$/u, "");
    return L(language, `सही भिन्न संक्रियाओं का उपयोग करके मान ज्ञात कीजिए: ${x}`, `ਸਹੀ ਭਿੰਨ ਕਿਰਿਆਵਾਂ ਵਰਤ ਕੇ ਮੁੱਲ ਕੱਢੋ: ${x}`);
  }
  if (ql === "SAP-QL-030") {
    const x = e.replace(/^Find the value of the blank:\s*/u, "").replace(/[.]$/u, "");
    return L(language, `रिक्त स्थान का मान ज्ञात कीजिए: ${x}`, `ਖਾਲੀ ਥਾਂ ਦਾ ਮੁੱਲ ਕੱਢੋ: ${x}`);
  }
  if (ql === "SAP-QL-032") {
    m = /^Find the value of (.+) and choose the equivalent fraction in lowest terms\.$/su.exec(e);
    if (m) return L(language, `${m[1]} का मान ज्ञात कीजिए और समतुल्य सरल भिन्न चुनिए।`, `${m[1]} ਦਾ ਮੁੱਲ ਕੱਢੋ ਅਤੇ ਬਰਾਬਰ ਸਭ ਤੋਂ ਸਰਲ ਭਿੰਨ ਚੁਣੋ।`);
  }

  if (ql === "SAP-QL-049") return localizeOf(current, language);
  if (ql === "SAP-QL-050") {
    const s = localizeOf(e, language)
      .replace(/^A = /u, "A = ")
      .replace(/; B = /u, "; B = ")
      .replace(/\. Which relation between A and B must be true\?$/u, L(language, "। A और B के बीच कौन-सा संबंध हमेशा सत्य है?", "। A ਅਤੇ B ਵਿਚਕਾਰ ਕਿਹੜਾ ਸੰਬੰਧ ਹਮੇਸ਼ਾ ਸਹੀ ਹੈ?"))
      .replace(/\. Which relation is correct\?$/u, L(language, "। A और B के बीच सही संबंध चुनिए।", "। A ਅਤੇ B ਵਿਚਕਾਰ ਸਹੀ ਸੰਬੰਧ ਚੁਣੋ।"));
    return clean(s);
  }

  if (["SAP-QL-053", "SAP-QL-054", "SAP-QL-064"].includes(ql)) {
    return L(language, `सटीक मान ज्ञात कीजिए: ${directExpression(e)}`, `ਸਟੀਕ ਮੁੱਲ ਕੱਢੋ: ${directExpression(e)}`);
  }
  if (ql === "SAP-QL-059") {
    m = /^Find the principal fourth root of (.+)\.$/u.exec(e);
    if (m) return L(language, `${m[1]} का मुख्य चौथा मूल ज्ञात कीजिए।`, `${m[1]} ਦਾ ਮੁੱਖ ਚੌਥਾ ਮੂਲ ਕੱਢੋ।`);
  }
  if (ql === "SAP-QL-063") {
    const math = e.match(/\\\([\s\S]*?\\\)/u)?.[0] ?? directExpression(e);
    return L(language, `सटीक मान ज्ञात कीजिए: ${math}`, `ਸਟੀਕ ਮੁੱਲ ਕੱਢੋ: ${math}`);
  }
  if (ql === "SAP-QL-067") {
    m = /^Which non-negative integer exponent makes (.+) true\?$/su.exec(e);
    if (m) return L(language, `${m[1]} को सत्य बनाने वाला गैर-ऋणात्मक पूर्णांक घातांक ज्ञात कीजिए।`, `${m[1]} ਨੂੰ ਸਹੀ ਬਣਾਉਣ ਵਾਲਾ ਗੈਰ-ਰਣਾਤਮਕ ਪੂਰਨ ਅੰਕ ਘਾਤ ਕੱਢੋ।`);
  }
  if (ql === "SAP-QL-068") {
    m = /^If x has exact (square|cube|fourth) root (.+), find x\.$/u.exec(e);
    if (m) {
      const root = m[1] === "square" ? L(language, "वर्गमूल", "ਵਰਗ ਮੂਲ") : m[1] === "cube" ? L(language, "घनमूल", "ਘਣ ਮੂਲ") : L(language, "चौथा मूल", "ਚੌਥਾ ਮੂਲ");
      return L(language, `यदि x का सटीक ${root} ${m[2]} है, तो x ज्ञात कीजिए।`, `ਜੇ x ਦਾ ਸਟੀਕ ${root} ${m[2]} ਹੈ, ਤਾਂ x ਕੱਢੋ।`);
    }
  }
  if (ql === "SAP-QL-069") {
    m = /^Choose the correct comparison between (.+) and (.+)\.$/su.exec(e);
    if (m) return L(language, `${m[1]} और ${m[2]} की तुलना कीजिए।`, `${m[1]} ਅਤੇ ${m[2]} ਦੀ ਤੁਲਨਾ ਕਰੋ।`);
    m = /^Compare A = (.+) and B = (.+)\.$/su.exec(e);
    if (m) return L(language, `A = ${m[1]} और B = ${m[2]}। A और B की तुलना कीजिए।`, `A = ${m[1]} ਅਤੇ B = ${m[2]}। A ਅਤੇ B ਦੀ ਤੁਲਨਾ ਕਰੋ।`);
  }

  if (ql === "SAP-QL-073") {
    m = /^Simplify (.+) by extracting the common factor before dividing\.$/su.exec(e);
    if (m) return L(language, `भाग देने से पहले समान गुणनखंड निकालकर ${m[1]} को सरल कीजिए।`, `ਭਾਗ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਸਾਂਝਾ ਗੁਣਨਖੰਡ ਕੱਢ ਕੇ ${m[1]} ਨੂੰ ਸਰਲ ਕਰੋ।`);
  }
  if (ql === "SAP-QL-074") return L(language, `मान ज्ञात कीजिए: ${directExpression(e)}`, `ਮੁੱਲ ਕੱਢੋ: ${directExpression(e)}`);
  if (ql === "SAP-QL-076") {
    const x = e.replace(/^Simplify /u, "").replace(/ without expanding both factorials completely\.$/u, "");
    return L(language, `दोनों फैक्टोरियल को पूरा फैलाए बिना सरल कीजिए: ${x}`, `ਦੋਵੇਂ ਫੈਕਟੋਰੀਅਲ ਪੂਰੇ ਖੋਲ੍ਹੇ ਬਿਨਾਂ ਸਰਲ ਕਰੋ: ${x}`);
  }
  if (ql === "SAP-QL-077") {
    const x = e.replace(/^Simplify the reciprocal product /u, "").replace(/[.]$/u, "");
    return L(language, `व्युत्क्रमों के इस गुणनफल को सरल कीजिए: ${x}`, `ਉਲਟ ਭਿੰਨਾਂ ਦੇ ਇਸ ਗੁਣਨਫਲ ਨੂੰ ਸਰਲ ਕਰੋ: ${x}`);
  }
  if (ql === "SAP-QL-079") {
    const x = e.replace(/^Evaluate /u, "").replace(/ using the structural shortcut\.$/u, "");
    return L(language, `बीजगणितीय पहचान का उपयोग करके मान ज्ञात कीजिए: ${x}`, `ਪਛਾਣ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਮੁੱਲ ਕੱਢੋ: ${x}`);
  }
  if (ql === "SAP-QL-084") {
    m = /^If (.+), find □\.$/su.exec(e);
    if (m) return L(language, `यदि ${m[1]}, तो □ का मान ज्ञात कीजिए।`, `ਜੇ ${m[1]}, ਤਾਂ □ ਦਾ ਮੁੱਲ ਕੱਢੋ।`);
  }
  if (ql === "SAP-QL-085") {
    m = /^A student simplifies (.+) as (.+) by cancelling (.+) from the numerator and denominator\. What is the first error\?$/su.exec(e);
    if (m) return L(language, `एक विद्यार्थी ${m[1]} को ${m[2]} लिख देता है और अंश व हर में ${m[3]} काटता है। पहली गलती क्या है?`, `ਇੱਕ ਵਿਦਿਆਰਥੀ ${m[1]} ਨੂੰ ${m[2]} ਲਿਖ ਦਿੰਦਾ ਹੈ ਅਤੇ ਅੰਸ਼ ਤੇ ਹਰ ਵਿੱਚ ${m[3]} ਕੱਟਦਾ ਹੈ। ਪਹਿਲੀ ਗਲਤੀ ਕੀ ਹੈ?`);
  }
  if (ql === "SAP-QL-086") {
    const x = e.replace(/^Simplify /u, "").replace(/ without multiplying large numbers first\.$/u, "");
    return L(language, `बड़ी संख्याओं का पहले गुणा किए बिना सरल कीजिए: ${x}`, `ਵੱਡੀਆਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਪਹਿਲਾਂ ਗੁਣਾ ਕੀਤੇ ਬਿਨਾਂ ਸਰਲ ਕਰੋ: ${x}`);
  }
  if (ql === "SAP-QL-089") {
    const x = e.replace(/^Simplify /u, "").replace(/ by compressing the repeated block first\.$/u, "");
    return L(language, `दोहराए गए समान गुणनखंड को पहले बाहर निकालकर सरल कीजिए: ${x}`, `ਦੁਹਰਾਏ ਸਾਂਝੇ ਗੁਣਨਖੰਡ ਨੂੰ ਪਹਿਲਾਂ ਬਾਹਰ ਕੱਢ ਕੇ ਸਰਲ ਕਰੋ: ${x}`);
  }
  if (ql === "SAP-QL-090") {
    m = /^Before evaluating (.+), which first step most directly avoids unnecessary large multiplication\?$/su.exec(e);
    if (m) return L(language, `${m[1]} की गणना में अनावश्यक बड़े गुणा से बचने के लिए सबसे अच्छा पहला कदम कौन-सा है?`, `${m[1]} ਦੀ ਗਣਨਾ ਵਿੱਚ ਬੇਲੋੜੇ ਵੱਡੇ ਗੁਣੇ ਤੋਂ ਬਚਣ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਪਹਿਲਾ ਕਦਮ ਕਿਹੜਾ ਹੈ?`);
  }

  if (ql === "SAP-QL-095") {
    m = /^If (.+), find the exact value represented by □\.$/su.exec(e);
    if (m) return L(language, `यदि ${m[1]}, तो □ का सटीक मान ज्ञात कीजिए।`, `ਜੇ ${m[1]}, ਤਾਂ □ ਦਾ ਸਟੀਕ ਮੁੱਲ ਕੱਢੋ।`);
  }
  if (ql === "SAP-QL-096") {
    const x = valueAfterColon(e);
    return L(language, `□ एक दशमलव संख्या है। इसका मान ज्ञात कीजिए: ${x}`, `□ ਇੱਕ ਦਸ਼ਮਲਵ ਸੰਖਿਆ ਹੈ। ਇਸ ਦਾ ਮੁੱਲ ਕੱਢੋ: ${x}`);
  }
  if (["SAP-QL-098", "SAP-QL-099", "SAP-QL-100"].includes(ql)) {
    if (ql === "SAP-QL-098") return localizeOf(e, language).replace(/^Compare /u, L(language, "तुलना कीजिए: ", "ਤੁਲਨਾ ਕਰੋ: "));
    if (ql === "SAP-QL-099") return localizeOf(e, language).replace(/^Arrange in increasing order:/u, L(language, "बढ़ते क्रम में लगाइए:", "ਵੱਧਦੇ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ:"));
    return localizeOf(e, language).replace(/^Which fraction is exactly equivalent to /u, L(language, "कौन-सा भिन्न इसके ठीक बराबर है: ", "ਕਿਹੜੀ ਭਿੰਨ ਇਸ ਦੇ ਬਿਲਕੁਲ ਬਰਾਬਰ ਹੈ: "));
  }
  if (ql === "SAP-QL-112") {
    const s = localizeOf(e, language)
      .replace(/^For integer x from /u, L(language, "पूर्णांक x के लिए ", "ਪੂਰਨ ਅੰਕ x ਲਈ "))
      .replace(/\. Can x be determined uniquely\? Statement I:/u, L(language, "। क्या x का एकमात्र मान निश्चित किया जा सकता है? कथन I:", "। ਕੀ x ਦਾ ਇਕੋ ਮੁੱਲ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ? ਕਥਨ I:"))
      .replace(/\. Statement II:/u, L(language, "। कथन II:", "। ਕਥਨ II:"));
    return clean(s);
  }

  if (["SAP-QL-113", "SAP-QL-114"].includes(ql)) {
    m = /^Round (.+) to the nearest (.+)\.$/su.exec(e);
    if (m) return L(language, `${m[1]} को निकटतम ${roundUnit(language, m[2])} तक पूर्णांकित कीजिए।`, `${m[1]} ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ${roundUnit(language, m[2])} ਤੱਕ ਰਾਊਂਡ ਕਰੋ।`);
  }
  if (ql === "SAP-QL-115") {
    m = /^Round (.+) to (\d+) decimal places?\.$/su.exec(e);
    if (m) return L(language, `${m[1]} को ${m[2]} दशमलव स्थान तक पूर्णांकित कीजिए।`, `${m[1]} ਨੂੰ ${m[2]} ਦਸ਼ਮਲਵ ਥਾਂ ਤੱਕ ਰਾਊਂਡ ਕਰੋ।`);
  }
  if (ql === "SAP-QL-116") {
    m = /^Use this rule: if a value is exactly halfway, round away from zero\. Round (.+) to (\d+) decimal places?\.$/su.exec(e);
    if (m) return L(language, `नियम: ठीक आधे पर मान को शून्य से दूर की ओर पूर्णांकित करें। ${m[1]} को ${m[2]} दशमलव स्थान तक पूर्णांकित कीजिए।`, `ਨਿਯਮ: ਬਿਲਕੁਲ ਅੱਧੇ ਤੇ ਮੁੱਲ ਨੂੰ ਸਿਫ਼ਰ ਤੋਂ ਦੂਰ ਵੱਲ ਰਾਊਂਡ ਕਰੋ। ${m[1]} ਨੂੰ ${m[2]} ਦਸ਼ਮਲਵ ਥਾਂ ਤੱਕ ਰਾਊਂਡ ਕਰੋ।`);
  }
  if (ql === "SAP-QL-117") {
    m = /^When (.+) is rounded to the nearest (.+), which digit decides whether the number rounds up or down\?$/su.exec(e);
    if (m) return L(language, `${m[1]} को निकटतम ${roundUnit(language, m[2])} तक पूर्णांकित करते समय ऊपर या नीचे जाने का निर्णय कौन-सा अंक करता है?`, `${m[1]} ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ${roundUnit(language, m[2])} ਤੱਕ ਰਾਊਂਡ ਕਰਦੇ ਸਮੇਂ ਉੱਪਰ ਜਾਂ ਹੇਠਾਂ ਜਾਣ ਦਾ ਫ਼ੈਸਲਾ ਕਿਹੜਾ ਅੰਕ ਕਰਦਾ ਹੈ?`);
  }
  if (ql === "SAP-QL-118") {
    m = /^Which is the correct representation of (.+) rounded to (\d+) decimal places?\?$/su.exec(e);
    if (m) return L(language, `${m[1]} को ${m[2]} दशमलव स्थान तक पूर्णांकित करने पर सही रूप कौन-सा है?`, `${m[1]} ਨੂੰ ${m[2]} ਦਸ਼ਮਲਵ ਥਾਂ ਤੱਕ ਰਾਊਂਡ ਕਰਨ ਤੇ ਸਹੀ ਰੂਪ ਕਿਹੜਾ ਹੈ?`);
  }
  if (ql === "SAP-QL-119") {
    m = /^Which range of integer values rounds to (.+) when rounded to the nearest (.+)\?$/su.exec(e);
    if (m) return L(language, `कौन-से पूर्णांक निकटतम ${roundUnit(language, m[2])} तक पूर्णांकित करने पर ${m[1]} बनते हैं?`, `ਕਿਹੜੇ ਪੂਰਨ ਅੰਕ ਸਭ ਤੋਂ ਨੇੜਲੇ ${roundUnit(language, m[2])} ਤੱਕ ਰਾਊਂਡ ਕਰਨ ਤੇ ${m[1]} ਬਣਦੇ ਹਨ?`);
  }
  if (ql === "SAP-QL-120") {
    m = /^A positive number rounds to (.+) to (\d+) decimal place\. Which interval contains exactly all possible original values\?$/su.exec(e);
    if (m) return L(language, `एक धनात्मक संख्या ${m[2]} दशमलव स्थान तक पूर्णांकित करने पर ${m[1]} बनती है। मूल संख्या के सभी संभव मान किस अंतराल में हैं?`, `ਇੱਕ ਧਨਾਤਮਕ ਸੰਖਿਆ ${m[2]} ਦਸ਼ਮਲਵ ਥਾਂ ਤੱਕ ਰਾਊਂਡ ਕਰਨ ਤੇ ${m[1]} ਬਣਦੀ ਹੈ। ਮੂਲ ਸੰਖਿਆ ਦੇ ਸਾਰੇ ਸੰਭਵ ਮੁੱਲ ਕਿਹੜੇ ਅੰਤਰਾਲ ਵਿੱਚ ਹਨ?`);
  }
  if (["SAP-QL-121", "SAP-QL-122"].includes(ql)) {
    m = /^(?:What is the least|What is the greatest) integer that rounds to (.+) when rounded to the nearest (.+)\?$/su.exec(e);
    if (m) return ql === "SAP-QL-121"
      ? L(language, `निकटतम ${roundUnit(language, m[2])} तक पूर्णांकित करने पर ${m[1]} बनने वाला सबसे छोटा पूर्णांक कौन-सा है?`, `ਸਭ ਤੋਂ ਨੇੜਲੇ ${roundUnit(language, m[2])} ਤੱਕ ਰਾਊਂਡ ਕਰਨ ਤੇ ${m[1]} ਬਣਨ ਵਾਲਾ ਸਭ ਤੋਂ ਛੋਟਾ ਪੂਰਨ ਅੰਕ ਕਿਹੜਾ ਹੈ?`)
      : L(language, `निकटतम ${roundUnit(language, m[2])} तक पूर्णांकित करने पर ${m[1]} बनने वाला सबसे बड़ा पूर्णांक कौन-सा है?`, `ਸਭ ਤੋਂ ਨੇੜਲੇ ${roundUnit(language, m[2])} ਤੱਕ ਰਾਊਂਡ ਕਰਨ ਤੇ ${m[1]} ਬਣਨ ਵਾਲਾ ਸਭ ਤੋਂ ਵੱਡਾ ਪੂਰਨ ਅੰਕ ਕਿਹੜਾ ਹੈ?`);
  }
  if (ql === "SAP-QL-123") {
    m = /^The number (.+) becomes (.+) when rounded to the nearest (.+)\. Which digit can replace □\?$/su.exec(e);
    if (m) return L(language, `${m[1]} को निकटतम ${roundUnit(language, m[3])} तक पूर्णांकित करने पर ${m[2]} मिलता है। □ के स्थान पर कौन-सा अंक हो सकता है?`, `${m[1]} ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ${roundUnit(language, m[3])} ਤੱਕ ਰਾਊਂਡ ਕਰਨ ਤੇ ${m[2]} ਮਿਲਦਾ ਹੈ। □ ਦੀ ਥਾਂ ਕਿਹੜਾ ਅੰਕ ਹੋ ਸਕਦਾ ਹੈ?`);
  }
  if (ql === "SAP-QL-124") {
    m = /^(.+) is rounded to (\d+) decimal place as (.+)\. What is the absolute rounding error\?$/su.exec(e);
    if (m) return L(language, `${m[1]} को ${m[2]} दशमलव स्थान तक पूर्णांकित करने पर ${m[3]} मिलता है। निरपेक्ष पूर्णांकन त्रुटि कितनी है?`, `${m[1]} ਨੂੰ ${m[2]} ਦਸ਼ਮਲਵ ਥਾਂ ਤੱਕ ਰਾਊਂਡ ਕਰਨ ਤੇ ${m[3]} ਮਿਲਦਾ ਹੈ। ਨਿਰਪੇਖ ਰਾਊਂਡਿੰਗ ਗਲਤੀ ਕਿੰਨੀ ਹੈ?`);
  }
  if (ql === "SAP-QL-125") {
    m = /^For (.+), let A be the value rounded to (\d+) decimal place and B the value rounded to (\d+) decimal places\. Which relation is correct\?$/su.exec(e);
    if (m) return L(language, `${m[1]} को ${m[2]} दशमलव स्थान तक पूर्णांकित मान A और ${m[3]} दशमलव स्थान तक पूर्णांकित मान B है। सही संबंध चुनिए।`, `${m[1]} ਦਾ ${m[2]} ਦਸ਼ਮਲਵ ਥਾਂ ਤੱਕ ਰਾਊਂਡ ਕੀਤਾ ਮੁੱਲ A ਅਤੇ ${m[3]} ਦਸ਼ਮਲਵ ਥਾਂ ਤੱਕ ਰਾਊਂਡ ਕੀਤਾ ਮੁੱਲ B ਹੈ। ਸਹੀ ਸੰਬੰਧ ਚੁਣੋ।`);
  }
  if (ql === "SAP-QL-126") {
    m = /^A value is reported as (.+) after rounding to the nearest (.+)\. What is the maximum possible absolute rounding error under the declared half-away-from-zero rule\?$/su.exec(e);
    if (m) return L(language, `किसी मान को निकटतम ${roundUnit(language, m[2])} तक पूर्णांकित करके ${m[1]} लिखा गया है। अधिकतम संभव निरपेक्ष त्रुटि कितनी हो सकती है?`, `ਕਿਸੇ ਮੁੱਲ ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ${roundUnit(language, m[2])} ਤੱਕ ਰਾਊਂਡ ਕਰਕੇ ${m[1]} ਲਿਖਿਆ ਗਿਆ ਹੈ। ਵੱਧ ਤੋਂ ਵੱਧ ਸੰਭਵ ਨਿਰਪੇਖ ਗਲਤੀ ਕਿੰਨੀ ਹੋ ਸਕਦੀ ਹੈ?`);
  }
  if (ql === "SAP-QL-127") {
    m = /^(.+) is rounded to the nearest (.+)\. The rounded value is (.+)\. What is the relative rounding error, written as a fraction of the original value\?$/su.exec(e);
    if (m) return L(language, `${m[1]} को निकटतम ${roundUnit(language, m[2])} तक पूर्णांकित करने पर ${m[3]} मिलता है। मूल मान के भिन्न के रूप में सापेक्ष त्रुटि ज्ञात कीजिए।`, `${m[1]} ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ${roundUnit(language, m[2])} ਤੱਕ ਰਾਊਂਡ ਕਰਨ ਤੇ ${m[3]} ਮਿਲਦਾ ਹੈ। ਮੂਲ ਮੁੱਲ ਦੀ ਭਿੰਨ ਦੇ ਰੂਪ ਵਿੱਚ ਸਾਪੇਖ ਗਲਤੀ ਕੱਢੋ।`);
  }
  if (ql === "SAP-QL-128") {
    m = /^A student must add (.+) and (.+), then round the final sum to the nearest integer\. The student first rounds the two numbers to (.+) and (.+), adds them, and reports (.+)\. Which diagnosis is correct\?$/su.exec(e);
    if (m) return L(language, `एक विद्यार्थी को ${m[1]} और ${m[2]} जोड़कर अंतिम योग को निकटतम पूर्णांक तक पूर्णांकित करना था। उसने पहले संख्याएँ ${m[3]} और ${m[4]} कर दीं और ${m[5]} उत्तर दिया। सही निदान चुनिए।`, `ਇੱਕ ਵਿਦਿਆਰਥੀ ਨੇ ${m[1]} ਅਤੇ ${m[2]} ਜੋੜ ਕੇ ਅੰਤਿਮ ਜੋੜ ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕ ਤੱਕ ਰਾਊਂਡ ਕਰਨਾ ਸੀ। ਉਸ ਨੇ ਪਹਿਲਾਂ ਸੰਖਿਆਵਾਂ ${m[3]} ਅਤੇ ${m[4]} ਕਰ ਦਿੱਤੀਆਂ ਅਤੇ ${m[5]} ਉੱਤਰ ਦਿੱਤਾ। ਸਹੀ ਨਿਦਾਨ ਚੁਣੋ।`);
  }
  if (ql === "SAP-QL-185") {
    m = /^Round (.+) to (\d+) significant figures\.$/su.exec(e);
    if (m) return L(language, `${m[1]} को ${m[2]} सार्थक अंकों तक पूर्णांकित कीजिए।`, `${m[1]} ਨੂੰ ${m[2]} ਮਹੱਤਵਪੂਰਨ ਅੰਕਾਂ ਤੱਕ ਰਾਊਂਡ ਕਰੋ।`);
  }

  if (["SAP-QL-129", "SAP-QL-130", "SAP-QL-131", "SAP-QL-132", "SAP-QL-133", "SAP-QL-134", "SAP-QL-136", "SAP-QL-138"].includes(ql)) {
    const x = estimateExpression(e);
    m = /nearest (ten|hundred|integer)/u.exec(e);
    const unit = roundUnit(language, m?.[1] ?? "integer");
    return L(language, `हर दिए गए पद को निकटतम ${unit} तक पूर्णांकित करके अनुमान लगाइए: ${x}`, `ਹਰ ਦਿੱਤੇ ਪਦ ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ${unit} ਤੱਕ ਰਾਊਂਡ ਕਰਕੇ ਅੰਦਾਜ਼ਾ ਲਗਾਓ: ${x}`);
  }
  if (ql === "SAP-QL-135") {
    m = /^For a quick sum estimate, round (.+) and (.+) to the nearest ten before adding\. Which pair should replace the two numbers\?$/su.exec(e);
    if (m) return L(language, `त्वरित योग-अनुमान के लिए ${m[1]} और ${m[2]} को निकटतम दस तक पूर्णांकित करना है। कौन-सी जोड़ी लेनी चाहिए?`, `ਤੇਜ਼ ਜੋੜ-ਅੰਦਾਜ਼ੇ ਲਈ ${m[1]} ਅਤੇ ${m[2]} ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਦਸ ਤੱਕ ਰਾਊਂਡ ਕਰਨਾ ਹੈ। ਕਿਹੜੀ ਜੋੜੀ ਲੈਣੀ ਚਾਹੀਦੀ ਹੈ?`);
  }
  if (ql === "SAP-QL-137") {
    m = /^For estimation, first replace (.+) by its nearest multiple of (.+) and round (.+) to the nearest ten\. Then estimate (.+)\.$/su.exec(e);
    if (m) return L(language, `अनुमान के लिए ${m[1]} को ${m[2]} के निकटतम गुणज से और ${m[3]} को निकटतम दस से बदलिए। फिर ${m[4]} का अनुमान लगाइए।`, `ਅੰਦਾਜ਼ੇ ਲਈ ${m[1]} ਨੂੰ ${m[2]} ਦੇ ਸਭ ਤੋਂ ਨੇੜਲੇ ਗੁਣਜ ਨਾਲ ਅਤੇ ${m[3]} ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਦਸ ਨਾਲ ਬਦਲੋ। ਫਿਰ ${m[4]} ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਓ।`);
  }
  if (["SAP-QL-139", "SAP-QL-140"].includes(ql)) {
    m = /^To estimate (.+), round both terms to the nearest (.+) first\. If the estimated (sum|difference) is (.+), what is the rounded value of □\?$/su.exec(e);
    if (m) return L(language, `${m[1]} का अनुमान लगाने के लिए दोनों पदों को पहले निकटतम ${roundUnit(language, m[2])} तक पूर्णांकित करें। यदि अनुमानित ${m[3] === "sum" ? "योग" : "अंतर"} ${m[4]} है, तो □ का पूर्णांकित मान क्या है?`, `${m[1]} ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਉਣ ਲਈ ਦੋਵੇਂ ਪਦ ਪਹਿਲਾਂ ਸਭ ਤੋਂ ਨੇੜਲੇ ${roundUnit(language, m[2])} ਤੱਕ ਰਾਊਂਡ ਕਰੋ। ਜੇ ਅੰਦਾਜ਼ਿਤ ${m[3] === "sum" ? "ਜੋੜ" : "ਅੰਤਰ"} ${m[4]} ਹੈ, ਤਾਂ □ ਦਾ ਰਾਊਂਡ ਕੀਤਾ ਮੁੱਲ ਕੀ ਹੈ?`);
  }
  if (ql === "SAP-QL-141") {
    m = /^Round each term to the nearest (.+) before evaluating (.+)\. Which option is closest to the resulting estimate\?$/su.exec(e);
    if (m) return L(language, `${m[2]} के प्रत्येक पद को निकटतम ${roundUnit(language, m[1])} तक पूर्णांकित कीजिए। प्राप्त अनुमान के सबसे निकट विकल्प चुनिए।`, `${m[2]} ਦੇ ਹਰ ਪਦ ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ${roundUnit(language, m[1])} ਤੱਕ ਰਾਊਂਡ ਕਰੋ। ਮਿਲੇ ਅੰਦਾਜ਼ੇ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਵਿਕਲਪ ਚੁਣੋ।`);
  }
  if (["SAP-QL-142", "SAP-QL-143"].includes(ql)) {
    m = /^Two positive numbers, when rounded to the nearest (.+), become (.+) and (.+)\. Which interval must contain their exact (sum|value of the first number minus the second)\?$/su.exec(e);
    if (m) return L(language, `दो धनात्मक संख्याएँ निकटतम ${roundUnit(language, m[1])} तक पूर्णांकित करने पर ${m[2]} और ${m[3]} बनती हैं। उनके सटीक ${m[4] === "sum" ? "योग" : "अंतर"} को अवश्य समाहित करने वाला अंतराल चुनिए।`, `ਦੋ ਧਨਾਤਮਕ ਸੰਖਿਆਵਾਂ ਸਭ ਤੋਂ ਨੇੜਲੇ ${roundUnit(language, m[1])} ਤੱਕ ਰਾਊਂਡ ਕਰਨ ਤੇ ${m[2]} ਅਤੇ ${m[3]} ਬਣਦੀਆਂ ਹਨ। ਉਨ੍ਹਾਂ ਦੇ ਸਟੀਕ ${m[4] === "sum" ? "ਜੋੜ" : "ਅੰਤਰ"} ਨੂੰ ਲਾਜ਼ਮੀ ਸਮੇਟਣ ਵਾਲਾ ਅੰਤਰਾਲ ਚੁਣੋ।`);
  }
  if (ql === "SAP-QL-144") {
    m = /^Estimate (.+) by rounding each addend to the nearest (.+) before adding\. Compared with the exact sum, is this estimate an overestimate or an underestimate\?$/su.exec(e);
    if (m) return L(language, `${m[1]} में प्रत्येक पद को निकटतम ${roundUnit(language, m[2])} तक पूर्णांकित करके अनुमान लगाइए। सटीक योग की तुलना में यह अधिक अनुमान है या कम अनुमान?`, `${m[1]} ਵਿੱਚ ਹਰ ਪਦ ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ${roundUnit(language, m[2])} ਤੱਕ ਰਾਊਂਡ ਕਰਕੇ ਅੰਦਾਜ਼ਾ ਲਗਾਓ। ਸਟੀਕ ਜੋੜ ਨਾਲ ਤੁਲਨਾ ਵਿੱਚ ਇਹ ਵੱਧ ਅੰਦਾਜ਼ਾ ਹੈ ਜਾਂ ਘੱਟ?`);
  }
  if (ql === "SAP-QL-145") {
    m = /^Round every addend to the nearest (.+) before adding\. Let A be the estimate of (.+), and B the estimate of (.+)\. Which relation is correct\?$/su.exec(e);
    if (m) return L(language, `हर पद को निकटतम ${roundUnit(language, m[1])} तक पूर्णांकित करें। ${m[2]} का अनुमान A और ${m[3]} का अनुमान B है। सही संबंध चुनिए।`, `ਹਰ ਪਦ ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ${roundUnit(language, m[1])} ਤੱਕ ਰਾਊਂਡ ਕਰੋ। ${m[2]} ਦਾ ਅੰਦਾਜ਼ਾ A ਅਤੇ ${m[3]} ਦਾ ਅੰਦਾਜ਼ਾ B ਹੈ। ਸਹੀ ਸੰਬੰਧ ਚੁਣੋ।`);
  }
  if (ql === "SAP-QL-146") {
    m = /^A student estimates (.+) by first rounding each addend to the nearest (.+), but writes (.+)\. Which diagnosis is correct\?$/su.exec(e);
    if (m) return L(language, `एक विद्यार्थी ${m[1]} का अनुमान लगाने के लिए पदों को निकटतम ${roundUnit(language, m[2])} तक पूर्णांकित करता है, लेकिन ${m[3]} लिखता है। सही निदान चुनिए।`, `ਇੱਕ ਵਿਦਿਆਰਥੀ ${m[1]} ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਉਣ ਲਈ ਪਦਾਂ ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ${roundUnit(language, m[2])} ਤੱਕ ਰਾਊਂਡ ਕਰਦਾ ਹੈ, ਪਰ ${m[3]} ਲਿਖਦਾ ਹੈ। ਸਹੀ ਨਿਦਾਨ ਚੁਣੋ।`);
  }

  if (ql === "SAP-QL-147") {
    m = /^Estimate after rounding each factor to the nearest (.+): (.+)\.$/su.exec(e);
    if (m) return L(language, `हर गुणनखंड को निकटतम ${roundUnit(language, m[1])} तक पूर्णांकित करके अनुमान लगाइए: ${m[2]}`, `ਹਰ ਗੁਣਨਖੰਡ ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ${roundUnit(language, m[1])} ਤੱਕ ਰਾਊਂਡ ਕਰਕੇ ਅੰਦਾਜ਼ਾ ਲਗਾਓ: ${m[2]}`);
  }
  if (ql === "SAP-QL-148") return L(language, `आवश्यक संख्याओं को निकटतम पूर्णांक तक पूर्णांकित करके अनुमान लगाइए: ${estimateExpression(e)}`, `ਲੋੜੀਂਦੀਆਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕ ਤੱਕ ਰਾਊਂਡ ਕਰਕੇ ਅੰਦਾਜ਼ਾ ਲਗਾਓ: ${estimateExpression(e)}`);
  if (ql === "SAP-QL-149") {
    m = /^Round (.+) and (.+) to the nearest ten\. Using the rounded values, estimate (.+)\.$/su.exec(e);
    if (m) return L(language, `${m[1]} और ${m[2]} को निकटतम दस तक पूर्णांकित कर ${m[3]} का अनुमान लगाइए।`, `${m[1]} ਅਤੇ ${m[2]} ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਦਸ ਤੱਕ ਰਾਊਂਡ ਕਰਕੇ ${m[3]} ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਓ।`);
  }
  if (ql === "SAP-QL-150") {
    m = /^For estimation, take (.+) ≈ (.+) and (.+) ≈ (.+)\. Find (.+) approximately\.$/su.exec(e);
    if (m) return L(language, `अनुमान के लिए ${m[1]} ≈ ${m[2]} और ${m[3]} ≈ ${m[4]} लीजिए। ${localizeOf(m[5], language)} का लगभग मान ज्ञात कीजिए।`, `ਅੰਦਾਜ਼ੇ ਲਈ ${m[1]} ≈ ${m[2]} ਅਤੇ ${m[3]} ≈ ${m[4]} ਲਵੋ। ${localizeOf(m[5], language)} ਦਾ ਲਗਭਗ ਮੁੱਲ ਕੱਢੋ।`);
  }
  if (ql === "SAP-QL-151") {
    m = /^For estimation, take (.+) ≈ (.+) and (.+) ≈ (.+)\. Approximately what percent of (.+) is (.+)\?$/su.exec(e);
    if (m) return L(language, `अनुमान के लिए ${m[1]} ≈ ${m[2]} और ${m[3]} ≈ ${m[4]} लीजिए। ${m[6]}, ${m[5]} का लगभग कितने प्रतिशत है?`, `ਅੰਦਾਜ਼ੇ ਲਈ ${m[1]} ≈ ${m[2]} ਅਤੇ ${m[3]} ≈ ${m[4]} ਲਵੋ। ${m[6]}, ${m[5]} ਦਾ ਲਗਭਗ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`);
  }
  if (ql === "SAP-QL-152") {
    m = /^Round (.+) to the nearest whole number and estimate (.+) of it\.$/su.exec(e);
    if (m) return L(language, `${m[1]} को निकटतम पूर्णांक तक पूर्णांकित करके उसका ${m[2]} अनुमानित मान ज्ञात कीजिए।`, `${m[1]} ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕ ਤੱਕ ਰਾਊਂਡ ਕਰਕੇ ਇਸ ਦਾ ${m[2]} ਅੰਦਾਜ਼ਿਤ ਮੁੱਲ ਕੱਢੋ।`);
  }
  if (ql === "SAP-QL-153") return L(language, `हर संख्या को निकटतम दस तक पूर्णांकित करके अनुमान लगाइए: ${estimateExpression(e)}`, `ਹਰ ਸੰਖਿਆ ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਦਸ ਤੱਕ ਰਾਊਂਡ ਕਰਕੇ ਅੰਦਾਜ਼ਾ ਲਗਾਓ: ${estimateExpression(e)}`);
  if (ql === "SAP-QL-154") {
    m = /^Round both terms to the nearest (.+) and estimate the ratio (.+) in simplest form\.$/su.exec(e);
    if (m) return L(language, `दोनों पदों को निकटतम ${roundUnit(language, m[1])} तक पूर्णांकित कर अनुपात ${m[2]} का सरल अनुमान ज्ञात कीजिए।`, `ਦੋਵੇਂ ਪਦਾਂ ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ${roundUnit(language, m[1])} ਤੱਕ ਰਾਊਂਡ ਕਰਕੇ ਅਨੁਪਾਤ ${m[2]} ਦਾ ਸਰਲ ਅੰਦਾਜ਼ਾ ਕੱਢੋ।`);
  }
  if (ql === "SAP-QL-155") return L(language, `काट-छाँट और निकटतम-दस मानों का उपयोग करके अनुमान लगाइए: ${estimateExpression(e)}`, `ਕਟੌਤੀ ਅਤੇ ਸਭ ਤੋਂ ਨੇੜਲੇ ਦਸ ਵਾਲੇ ਮੁੱਲ ਵਰਤ ਕੇ ਅੰਦਾਜ਼ਾ ਲਗਾਓ: ${estimateExpression(e)}`);
  if (ql === "SAP-QL-156") {
    m = /^Using (.+) for (.+) and (.+) for (.+), estimate (.+)\.$/su.exec(e);
    if (m) return L(language, `${m[2]} के स्थान पर ${m[1]} और ${m[4]} के स्थान पर ${m[3]} लेकर ${m[5]} का अनुमान लगाइए।`, `${m[2]} ਦੀ ਥਾਂ ${m[1]} ਅਤੇ ${m[4]} ਦੀ ਥਾਂ ${m[3]} ਲੈ ਕੇ ${m[5]} ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਓ।`);
  }
  if (ql === "SAP-QL-157") {
    m = /^After rounding, one factor is (.+) and the product is approximately (.+)\. What rounded value should replace □ in (.+)\?$/su.exec(e);
    if (m) return L(language, `पूर्णांकन के बाद एक गुणनखंड ${m[1]} और गुणनफल लगभग ${m[2]} है। ${m[3]} में □ का पूर्णांकित मान क्या होगा?`, `ਰਾਊਂਡ ਕਰਨ ਤੋਂ ਬਾਅਦ ਇੱਕ ਗੁਣਨਖੰਡ ${m[1]} ਅਤੇ ਗੁਣਨਫਲ ਲਗਭਗ ${m[2]} ਹੈ। ${m[3]} ਵਿੱਚ □ ਦਾ ਰਾਊਂਡ ਕੀਤਾ ਮੁੱਲ ਕੀ ਹੋਵੇਗਾ?`);
  }
  if (ql === "SAP-QL-158") {
    m = /^Using rounded values, (.+)\. What rounded divisor should replace □\?$/su.exec(e);
    if (m) return L(language, `पूर्णांकित मानों से ${m[1]}। □ के स्थान पर कौन-सा पूर्णांकित भाजक आएगा?`, `ਰਾਊਂਡ ਕੀਤੇ ਮੁੱਲਾਂ ਨਾਲ ${m[1]}। □ ਦੀ ਥਾਂ ਕਿਹੜਾ ਰਾਊਂਡ ਕੀਤਾ ਭਾਜਕ ਆਵੇਗਾ?`);
  }
  if (ql === "SAP-QL-159") {
    m = /^Use (.+) for (.+) and (.+) for (.+)\. Which option is nearest to (.+)\?$/su.exec(e);
    if (m) return L(language, `${m[2]} के लिए ${m[1]} और ${m[4]} के लिए ${m[3]} लीजिए। ${m[5]} के सबसे निकट विकल्प चुनिए।`, `${m[2]} ਲਈ ${m[1]} ਅਤੇ ${m[4]} ਲਈ ${m[3]} ਲਵੋ। ${m[5]} ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਵਿਕਲਪ ਚੁਣੋ।`);
  }
  if (ql === "SAP-QL-160") {
    m = /^Round each term to the nearest hundred\. Let A = (.+) and B = (.+)\. Compare the two approximate ratios\.$/su.exec(e);
    if (m) return L(language, `हर पद को निकटतम सौ तक पूर्णांकित करें। A = ${m[1]} और B = ${m[2]}। दोनों अनुमानित अनुपातों की तुलना कीजिए।`, `ਹਰ ਪਦ ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਸੌ ਤੱਕ ਰਾਊਂਡ ਕਰੋ। A = ${m[1]} ਅਤੇ B = ${m[2]}। ਦੋਵੇਂ ਅੰਦਾਜ਼ਿਤ ਅਨੁਪਾਤਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।`);
  }
  if (ql === "SAP-QL-161") {
    m = /^Two positive numbers round to (.+) and (.+) to the nearest ten\. Which interval must contain their exact product\?$/su.exec(e);
    if (m) return L(language, `दो धनात्मक संख्याएँ निकटतम दस तक पूर्णांकित करने पर ${m[1]} और ${m[2]} बनती हैं। उनके सटीक गुणनफल को अवश्य समाहित करने वाला अंतराल चुनिए।`, `ਦੋ ਧਨਾਤਮਕ ਸੰਖਿਆਵਾਂ ਸਭ ਤੋਂ ਨੇੜਲੇ ਦਸ ਤੱਕ ਰਾਊਂਡ ਕਰਨ ਤੇ ${m[1]} ਅਤੇ ${m[2]} ਬਣਦੀਆਂ ਹਨ। ਉਨ੍ਹਾਂ ਦੇ ਸਟੀਕ ਗੁਣਨਫਲ ਨੂੰ ਲਾਜ਼ਮੀ ਸਮੇਟਣ ਵਾਲਾ ਅੰਤਰਾਲ ਚੁਣੋ।`);
  }
  if (ql === "SAP-QL-162") {
    m = /^A positive numerator rounds to (.+) and a positive denominator to (.+), both to the nearest ten\. Which interval must contain the exact quotient\?$/su.exec(e);
    if (m) return L(language, `धनात्मक अंश निकटतम दस तक पूर्णांकित होकर ${m[1]} और धनात्मक हर ${m[2]} बनता है। सटीक भागफल को अवश्य समाहित करने वाला अंतराल चुनिए।`, `ਧਨਾਤਮਕ ਅੰਸ਼ ਸਭ ਤੋਂ ਨੇੜਲੇ ਦਸ ਤੱਕ ਰਾਊਂਡ ਹੋ ਕੇ ${m[1]} ਅਤੇ ਧਨਾਤਮਕ ਹਰ ${m[2]} ਬਣਦਾ ਹੈ। ਸਟੀਕ ਭਾਗਫਲ ਨੂੰ ਲਾਜ਼ਮੀ ਸਮੇਟਣ ਵਾਲਾ ਅੰਤਰਾਲ ਚੁਣੋ।`);
  }
  if (ql === "SAP-QL-163") {
    m = /^A student rounds (.+) to (.+) and (.+) to (.+), but writes the product as (.+)\. What is the error\?$/su.exec(e);
    if (m) return L(language, `एक विद्यार्थी ${m[1]} को ${m[2]} और ${m[3]} को ${m[4]} मानता है, लेकिन गुणनफल ${m[5]} लिखता है। गलती क्या है?`, `ਇੱਕ ਵਿਦਿਆਰਥੀ ${m[1]} ਨੂੰ ${m[2]} ਅਤੇ ${m[3]} ਨੂੰ ${m[4]} ਮੰਨਦਾ ਹੈ, ਪਰ ਗੁਣਨਫਲ ${m[5]} ਲਿਖਦਾ ਹੈ। ਗਲਤੀ ਕੀ ਹੈ?`);
  }
  if (ql === "SAP-QL-164") {
    m = /^For (.+), a student uses (.+) to make the calculation easier\. Which is the safer estimate using nearest hundreds\?$/su.exec(e);
    if (m) return L(language, `${m[1]} के लिए विद्यार्थी ${m[2]} लेता है। निकटतम सैकड़ों का उपयोग करते हुए अधिक सुरक्षित अनुमान कौन-सा है?`, `${m[1]} ਲਈ ਵਿਦਿਆਰਥੀ ${m[2]} ਲੈਂਦਾ ਹੈ। ਸਭ ਤੋਂ ਨੇੜਲੇ ਸੌ ਵਰਤ ਕੇ ਵੱਧ ਸੁਰੱਖਿਅਤ ਅੰਦਾਜ਼ਾ ਕਿਹੜਾ ਹੈ?`);
  }
  if (ql === "SAP-QL-165") {
    m = /^Round (.+) and (.+) to the nearest ten\. Without doing the full multiplication, decide whether the estimated product is an overestimate or an underestimate\.$/su.exec(e);
    if (m) return L(language, `${m[1]} और ${m[2]} को निकटतम दस तक पूर्णांकित करें। पूरा गुणा किए बिना बताइए कि अनुमानित गुणनफल अधिक है या कम।`, `${m[1]} ਅਤੇ ${m[2]} ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਦਸ ਤੱਕ ਰਾਊਂਡ ਕਰੋ। ਪੂਰਾ ਗੁਣਾ ਕੀਤੇ ਬਿਨਾਂ ਦੱਸੋ ਕਿ ਅੰਦਾਜ਼ਿਤ ਗੁਣਨਫਲ ਵੱਧ ਹੈ ਜਾਂ ਘੱਟ।`);
  }

  if (["SAP-QL-166", "SAP-QL-167", "SAP-QL-168"].includes(ql)) {
    m = /^Between which two consecutive integers does (.+) lie\?$/su.exec(e);
    if (m) return L(language, `${m[1]} किन दो क्रमागत पूर्णांकों के बीच है?`, `${m[1]} ਕਿਹੜੇ ਦੋ ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਵਿਚਕਾਰ ਹੈ?`);
  }
  if (["SAP-QL-169", "SAP-QL-170"].includes(ql)) {
    m = /^(.+) is nearest to which integer\?$/su.exec(e);
    if (m) return L(language, `${m[1]} किस पूर्णांक के सबसे निकट है?`, `${m[1]} ਕਿਹੜੇ ਪੂਰਨ ਅੰਕ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਹੈ?`);
  }
  if (ql === "SAP-QL-171") {
    m = /^What is the (greatest integer less than|least integer greater than) (.+)\?$/su.exec(e);
    if (m) return m[1].startsWith("greatest")
      ? L(language, `${m[2]} से छोटा सबसे बड़ा पूर्णांक कौन-सा है?`, `${m[2]} ਤੋਂ ਛੋਟਾ ਸਭ ਤੋਂ ਵੱਡਾ ਪੂਰਨ ਅੰਕ ਕਿਹੜਾ ਹੈ?`)
      : L(language, `${m[2]} से बड़ा सबसे छोटा पूर्णांक कौन-सा है?`, `${m[2]} ਤੋਂ ਵੱਡਾ ਸਭ ਤੋਂ ਛੋਟਾ ਪੂਰਨ ਅੰਕ ਕਿਹੜਾ ਹੈ?`);
  }
  if (ql === "SAP-QL-172") {
    m = /^Round (.+) to the nearest whole number and estimate (.+)\.$/su.exec(e);
    if (m) return L(language, `${m[1]} को निकटतम पूर्णांक तक पूर्णांकित करके ${m[2]} का अनुमान लगाइए।`, `${m[1]} ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕ ਤੱਕ ਰਾਊਂਡ ਕਰਕੇ ${m[2]} ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਓ।`);
  }
  if (ql === "SAP-QL-173") {
    m = /^Round (.+)% to the nearest 10%\. What is the approximate value of (.+)\?$/su.exec(e);
    if (m) return L(language, `${m[1]}% को निकटतम 10% तक पूर्णांकित करके ${m[2]} का लगभग मान ज्ञात कीजिए।`, `${m[1]}% ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ 10% ਤੱਕ ਰਾਊਂਡ ਕਰਕੇ ${m[2]} ਦਾ ਲਗਭਗ ਮੁੱਲ ਕੱਢੋ।`);
  }
  if (ql === "SAP-QL-174") {
    m = /^Round (.+) to the nearest whole number\. Which fraction best estimates (.+)\?$/su.exec(e);
    if (m) return L(language, `${m[1]} को निकटतम पूर्णांक तक पूर्णांकित करें। ${m[2]} का सबसे अच्छा भिन्न-अनुमान कौन-सा है?`, `${m[1]} ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕ ਤੱਕ ਰਾਊਂਡ ਕਰੋ। ${m[2]} ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਭਿੰਨ-ਅੰਦਾਜ਼ਾ ਕਿਹੜਾ ਹੈ?`);
  }
  if (["SAP-QL-175", "SAP-QL-176"].includes(ql)) {
    const x = estimateExpression(e);
    return L(language, `हर वर्गमूल को निकटतम पूर्णांक लेकर अनुमान लगाइए: ${x}`, `ਹਰ ਵਰਗ ਮੂਲ ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲਾ ਪੂਰਨ ਅੰਕ ਲੈ ਕੇ ਅੰਦਾਜ਼ਾ ਲਗਾਓ: ${x}`);
  }
  if (ql === "SAP-QL-177") {
    m = /^Take (.+) to the nearest integer and (.+) to the nearest whole number\. Estimate (.+)\.$/su.exec(e);
    if (m) return L(language, `${m[1]} और ${m[2]} को निकटतम पूर्णांक लेकर ${m[3]} का अनुमान लगाइए।`, `${m[1]} ਅਤੇ ${m[2]} ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲਾ ਪੂਰਨ ਅੰਕ ਲੈ ਕੇ ${m[3]} ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਓ।`);
  }
  if (ql === "SAP-QL-178") {
    m = /^Which value below (.+) has a square root nearest to (.+)\?$/su.exec(e);
    if (m) return L(language, `${m[1]} से छोटा कौन-सा मान ऐसा है जिसका वर्गमूल ${m[2]} के सबसे निकट है?`, `${m[1]} ਤੋਂ ਛੋਟਾ ਕਿਹੜਾ ਮੁੱਲ ਹੈ ਜਿਸ ਦਾ ਵਰਗ ਮੂਲ ${m[2]} ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਹੈ?`);
  }
  if (ql === "SAP-QL-179") {
    m = /^A number is (.+) (less|greater) than an integer\. It is rounded to the nearest whole number\. After (squaring|cubing) the rounded value, the result is (.+)\. Which option could be the original number\?$/su.exec(e);
    if (m) return L(language, `एक संख्या किसी पूर्णांक से ${m[1]} ${m[2] === "less" ? "कम" : "अधिक"} है। उसे निकटतम पूर्णांक तक पूर्णांकित करने के बाद ${m[3] === "squaring" ? "वर्ग" : "घन"} करने पर ${m[4]} मिलता है। मूल संख्या कौन-सी हो सकती है?`, `ਇੱਕ ਸੰਖਿਆ ਕਿਸੇ ਪੂਰਨ ਅੰਕ ਤੋਂ ${m[1]} ${m[2] === "less" ? "ਘੱਟ" : "ਵੱਧ"} ਹੈ। ਇਸ ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕ ਤੱਕ ਰਾਊਂਡ ਕਰਨ ਤੋਂ ਬਾਅਦ ${m[3] === "squaring" ? "ਵਰਗ" : "ਘਣ"} ਕਰਨ ਤੇ ${m[4]} ਮਿਲਦਾ ਹੈ। ਮੂਲ ਸੰਖਿਆ ਕਿਹੜੀ ਹੋ ਸਕਦੀ ਹੈ?`);
  }
  if (ql === "SAP-QL-180") {
    m = /^Round (.+) to the nearest whole number\. Which option is nearest to (.+)\?$/su.exec(e);
    if (m) return L(language, `${m[1]} को निकटतम पूर्णांक तक पूर्णांकित करें। ${m[2]} के सबसे निकट विकल्प चुनिए।`, `${m[1]} ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕ ਤੱਕ ਰਾਊਂਡ ਕਰੋ। ${m[2]} ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਵਿਕਲਪ ਚੁਣੋ।`);
  }
  if (ql === "SAP-QL-181") return current;
  if (ql === "SAP-QL-182") return current;
  if (ql === "SAP-QL-186") {
    m = /^Given (.+), estimate (.+) to (\d+) decimal places\.$/su.exec(e);
    if (m) return L(language, `${m[1]} दिया है। इसका उपयोग करके ${m[2]} का ${m[3]} दशमलव स्थान तक अनुमान लगाइए।`, `${m[1]} ਦਿੱਤਾ ਹੈ। ਇਸ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${m[2]} ਦਾ ${m[3]} ਦਸ਼ਮਲਵ ਥਾਂ ਤੱਕ ਅੰਦਾਜ਼ਾ ਲਗਾਓ।`);
  }

  if (["SAP-QL-187", "SAP-QL-188", "SAP-QL-190"].includes(ql)) {
    m = /^Which option is closest to (?:the value of )?(.+)\?$/su.exec(e);
    if (m) return L(language, `${m[1]} के मान के सबसे निकट विकल्प चुनिए।`, `${m[1]} ਦੇ ਮੁੱਲ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਵਿਕਲਪ ਚੁਣੋ।`);
  }
  if (ql === "SAP-QL-189") {
    m = /^The value of (.+) is nearest to which multiple of 10\?$/su.exec(e);
    if (m) return L(language, `${m[1]} का मान 10 के किस गुणज के सबसे निकट है?`, `${m[1]} ਦਾ ਮੁੱਲ 10 ਦੇ ਕਿਹੜੇ ਗੁਣਜ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਹੈ?`);
  }
  if (ql === "SAP-QL-191") {
    m = /^The exact value of an arithmetic expression is (.+), while a quick estimate gives (.+)\. What is the absolute error\?$/su.exec(e);
    if (m) return L(language, `किसी व्यंजक का सटीक मान ${m[1]} और त्वरित अनुमान ${m[2]} है। निरपेक्ष त्रुटि ज्ञात कीजिए।`, `ਕਿਸੇ ਵਿਆੰਜਕ ਦਾ ਸਟੀਕ ਮੁੱਲ ${m[1]} ਅਤੇ ਤੇਜ਼ ਅੰਦਾਜ਼ਾ ${m[2]} ਹੈ। ਨਿਰਪੇਖ ਗਲਤੀ ਕੱਢੋ।`);
  }
  if (ql === "SAP-QL-192") {
    m = /^An expression has exact value (.+), but it was estimated as (.+)\. What is the percentage error in the estimate\?$/su.exec(e);
    if (m) return L(language, `किसी व्यंजक का सटीक मान ${m[1]} है, जबकि अनुमान ${m[2]} है। प्रतिशत त्रुटि ज्ञात कीजिए।`, `ਕਿਸੇ ਵਿਆੰਜਕ ਦਾ ਸਟੀਕ ਮੁੱਲ ${m[1]} ਹੈ, ਜਦਕਿ ਅੰਦਾਜ਼ਾ ${m[2]} ਹੈ। ਪ੍ਰਤੀਸ਼ਤ ਗਲਤੀ ਕੱਢੋ।`);
  }
  if (ql === "SAP-QL-193") {
    m = /^For (.+), replacing the two factors by (.+) and (.+) gives (.+)\. This estimate is best described as:$/su.exec(e);
    if (m) return L(language, `${m[1]} में दोनों गुणनखंडों को ${m[2]} और ${m[3]} लेने पर अनुमान ${m[4]} मिलता है। इसे सबसे सही कैसे वर्णित करेंगे?`, `${m[1]} ਵਿੱਚ ਦੋਵੇਂ ਗੁਣਨਖੰਡ ${m[2]} ਅਤੇ ${m[3]} ਲੈਣ ਤੇ ਅੰਦਾਜ਼ਾ ${m[4]} ਮਿਲਦਾ ਹੈ। ਇਸ ਨੂੰ ਸਭ ਤੋਂ ਠੀਕ ਕਿਵੇਂ ਵਰਣਨ ਕਰੋਗੇ?`);
  }
  if (ql === "SAP-QL-194") {
    m = /^The exact value of an expression is (.+)\. Two estimates are (.+) and (.+)\. Which statement is correct\?$/su.exec(e);
    if (m) return L(language, `किसी व्यंजक का सटीक मान ${m[1]} है। दो अनुमान ${m[2]} और ${m[3]} हैं। सही कथन चुनिए।`, `ਕਿਸੇ ਵਿਆੰਜਕ ਦਾ ਸਟੀਕ ਮੁੱਲ ${m[1]} ਹੈ। ਦੋ ਅੰਦਾਜ਼ੇ ${m[2]} ਅਤੇ ${m[3]} ਹਨ। ਸਹੀ ਕਥਨ ਚੁਣੋ।`);
  }
  if (ql === "SAP-QL-195") {
    m = /^A positive number x rounds to (.+) and a positive number y rounds to (.+), each to the nearest integer\. Which is the tightest interval that must contain x \+ y\?$/su.exec(e);
    if (m) return L(language, `धनात्मक x और y निकटतम पूर्णांक तक पूर्णांकित होकर क्रमशः ${m[1]} और ${m[2]} बनते हैं। x + y को अवश्य समाहित करने वाला सबसे कड़ा अंतराल चुनिए।`, `ਧਨਾਤਮਕ x ਅਤੇ y ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕ ਤੱਕ ਰਾਊਂਡ ਹੋ ਕੇ ਕ੍ਰਮਵਾਰ ${m[1]} ਅਤੇ ${m[2]} ਬਣਦੇ ਹਨ। x + y ਨੂੰ ਲਾਜ਼ਮੀ ਸਮੇਟਣ ਵਾਲਾ ਸਭ ਤੋਂ ਤੰਗ ਅੰਤਰਾਲ ਚੁਣੋ।`);
  }
  if (ql === "SAP-QL-196") {
    m = /^The exact value of an expression is (.+)\. Which option is within (.+) of the exact value\?$/su.exec(e);
    if (m) return L(language, `व्यंजक का सटीक मान ${m[1]} है। कौन-सा विकल्प ${m[2]} की सहन-सीमा में है?`, `ਵਿਆੰਜਕ ਦਾ ਸਟੀਕ ਮੁੱਲ ${m[1]} ਹੈ। ਕਿਹੜਾ ਵਿਕਲਪ ${m[2]} ਦੀ ਸਹਿਣ-ਹੱਦ ਵਿੱਚ ਹੈ?`);
  }
  if (ql === "SAP-QL-197") {
    m = /^An expression is known to lie between (.+) and (.+)\. Which option is guaranteed to be the nearest for every value in this interval\?$/su.exec(e);
    if (m) return L(language, `व्यंजक का मान ${m[1]} और ${m[2]} के बीच है। इस पूरे अंतराल में कौन-सा विकल्प निश्चित रूप से सबसे निकट रहेगा?`, `ਵਿਆੰਜਕ ਦਾ ਮੁੱਲ ${m[1]} ਅਤੇ ${m[2]} ਵਿਚਕਾਰ ਹੈ। ਇਸ ਪੂਰੇ ਅੰਤਰਾਲ ਵਿੱਚ ਕਿਹੜਾ ਵਿਕਲਪ ਯਕੀਨੀ ਤੌਰ ਤੇ ਸਭ ਤੋਂ ਨੇੜੇ ਰਹੇਗਾ?`);
  }
  if (ql === "SAP-QL-198") {
    m = /^An expression is known only to lie between (.+) and (.+)\. The two closest listed options are (.+) and (.+)\. What can be concluded\?$/su.exec(e);
    if (m) return L(language, `व्यंजक का मान केवल ${m[1]} और ${m[2]} के बीच ज्ञात है। दो निकटतम विकल्प ${m[3]} और ${m[4]} हैं। क्या निश्चित निष्कर्ष निकाला जा सकता है?`, `ਵਿਆੰਜਕ ਦਾ ਮੁੱਲ ਸਿਰਫ਼ ${m[1]} ਅਤੇ ${m[2]} ਵਿਚਕਾਰ ਪਤਾ ਹੈ। ਦੋ ਸਭ ਤੋਂ ਨੇੜਲੇ ਵਿਕਲਪ ${m[3]} ਅਤੇ ${m[4]} ਹਨ। ਕੀ ਪੱਕਾ ਨਤੀਜਾ ਕੱਢਿਆ ਜਾ ਸਕਦਾ ਹੈ?`);
  }

  if (["SAP-QL-199", "SAP-QL-200", "SAP-QL-201", "SAP-QL-202", "SAP-QL-203", "SAP-QL-204", "SAP-QL-205", "SAP-QL-206", "SAP-QL-211"].includes(ql)) {
    m = /^What approximate value should (?:come in place of|replace) \? in (.+)\?$/su.exec(e);
    const expr = localizeOf(m?.[1] ?? current.replace(/^.*?:/u, "").trim(), language);
    return L(language, `निम्न समीकरण में ? के स्थान पर लगभग कौन-सा मान आएगा: ${expr}`, `ਹੇਠਾਂ ਦਿੱਤੇ ਸਮੀਕਰਨ ਵਿੱਚ ? ਦੀ ਥਾਂ ਲਗਭਗ ਕਿਹੜਾ ਮੁੱਲ ਆਵੇਗਾ: ${expr}`);
  }
  if (ql === "SAP-QL-207") {
    m = /^For integer \?, which option makes (.+) lie within (.+) of (.+)\?$/su.exec(e);
    if (m) return L(language, `पूर्णांक ? के लिए कौन-सा विकल्प ${m[1]} को ${m[3]} की ${m[2]} सहन-सीमा में रखता है?`, `ਪੂਰਨ ਅੰਕ ? ਲਈ ਕਿਹੜਾ ਵਿਕਲਪ ${m[1]} ਨੂੰ ${m[3]} ਦੀ ${m[2]} ਸਹਿਣ-ਹੱਦ ਵਿੱਚ ਰੱਖਦਾ ਹੈ?`);
  }
  if (ql === "SAP-QL-208") {
    m = /^An approximate calculation requires integer \? to satisfy (.+)\. How many integer values of \? are admissible\?$/su.exec(e);
    if (m) return L(language, `पूर्णांक ? को ${m[1]} संतुष्ट करना है। ? के कितने पूर्णांक मान स्वीकार्य हैं?`, `ਪੂਰਨ ਅੰਕ ? ਨੂੰ ${m[1]} ਪੂਰਾ ਕਰਨਾ ਹੈ। ? ਦੇ ਕਿੰਨੇ ਪੂਰਨ ਅੰਕ ਮੁੱਲ ਮਨਜ਼ੂਰ ਹਨ?`);
  }
  if (ql === "SAP-QL-209") {
    m = /^Integer \? must lie in the approximation band (.+)\. How should the outcome be classified\?$/su.exec(e);
    if (m) return L(language, `पूर्णांक ? को ${m[1]} सीमा में होना चाहिए। परिणाम एकमात्र, अनेक या असंभव—किस प्रकार का है?`, `ਪੂਰਨ ਅੰਕ ? ਨੂੰ ${m[1]} ਹੱਦ ਵਿੱਚ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ। ਨਤੀਜਾ ਇਕੋ, ਕਈ ਜਾਂ ਅਸੰਭਵ—ਕਿਹੜੇ ਕਿਸਮ ਦਾ ਹੈ?`);
  }
  if (ql === "SAP-QL-210") {
    m = /^A positive number x is rounded to the nearest integer before evaluating (.+)\. The approximate result is (.+)\. Which is the exact interval of possible values for the original x\?$/su.exec(e);
    if (m) return L(language, `${m[1]} की गणना से पहले धनात्मक x को निकटतम पूर्णांक तक पूर्णांकित किया जाता है। अनुमानित परिणाम ${m[2]} है। मूल x के सभी संभव मानों का सटीक अंतराल चुनिए।`, `${m[1]} ਦੀ ਗਣਨਾ ਤੋਂ ਪਹਿਲਾਂ ਧਨਾਤਮਕ x ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕ ਤੱਕ ਰਾਊਂਡ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਅੰਦਾਜ਼ਿਤ ਨਤੀਜਾ ${m[2]} ਹੈ। ਮੂਲ x ਦੇ ਸਾਰੇ ਸੰਭਵ ਮੁੱਲਾਂ ਦਾ ਸਟੀਕ ਅੰਤਰਾਲ ਚੁਣੋ।`);
  }

  return localizeOf(current, language);
}

export function applySapAuthoredStemV4(base: any, current: any, language: SapTranslationLanguage) {
  const stem = clean(localizeOf(qlStem(base, String(current.stem ?? ""), language), language));
  return Object.freeze({
    ...current,
    stem,
    traceability: Object.freeze({
      ...(current.traceability ?? {}),
      localizedStemAuthorship: "SAP-QL-FAMILY-STEM-V4",
    }),
  });
}
