import type { SapTranslationLanguage } from "./types";

function L(language: SapTranslationLanguage, hi: string, pa: string) {
  return language === "hi" ? hi : pa;
}

function tidy(value: string) {
  return value
    .replace(/\s{2,}/gu, " ")
    .replace(/\s+([,;:।])/gu, "$1")
    .replace(/([:।])\?/gu, "$1 ?")
    .replace(/\b(पूर्णांक|ਪੂਰਨ ਅੰਕ)\?/gu, "$1 ?")
    .replace(/\b(इसलिए|अतः|इसलिए|ਇਸ ਲਈ|ਤਾਂ)\?/gu, "$1 ?")
    .replace(/\?\s*\+/gu, "? +")
    .replace(/\+\s*\?/gu, "+ ?")
    .replace(/\?\s*−/gu, "? −")
    .replace(/−\s*\?/gu, "− ?")
    .replace(/\?\s*=/gu, "? =")
    .replace(/=\s*\?/gu, "= ?")
    .trim();
}

function toSymbolicOf(value: string) {
  return value
    .replace(/(\d+(?:\.\d+)?%)\s+का\s+(\([^)]*\)|\d+(?:\.\d+)?)/gu, "$1 × $2")
    .replace(/(\d+\/\d+)\s+का\s+(\([^)]*\)|\d+(?:\.\d+)?)/gu, "$1 × $2")
    .replace(/(\d+(?:\.\d+)?%)\s+ਦਾ\s+(\([^)]*\)|\d+(?:\.\d+)?)/gu, "$1 × $2")
    .replace(/(\d+\/\d+)\s+ਦਾ\s+(\([^)]*\)|\d+(?:\.\d+)?)/gu, "$1 × $2")
    .replace(/(\d+(?:\.\d+)?\\%)\s+\\text\{\s*का\s*\}\s+/gu, "$1 \\times ")
    .replace(/(\d+(?:\.\d+)?\\%)\s+\\text\{\s*ਦਾ\s*\}\s+/gu, "$1 \\times ")
    .replace(/(\?\\%)\s+\\text\{\s*का\s*\}\s+/gu, "$1 \\times ")
    .replace(/(\?\\%)\s+\\text\{\s*ਦਾ\s*\}\s+/gu, "$1 \\times ");
}

function stemFor(base: any, current: any, language: SapTranslationLanguage) {
  const ql = String(base.questionLanguageId ?? "");
  const stem = String(current.stem ?? "");
  const english = String(base.stem ?? "").trim();

  if (ql === "SAP-QL-007") {
    const expr = toSymbolicOf(stem.replace(/^सरल कीजिए:\s*/u, "").replace(/^ਸਰਲ ਕਰੋ:\s*/u, ""));
    return L(language, `सरल कीजिए: ${expr}`, `ਸਰਲ ਕਰੋ: ${expr}`);
  }

  if (["SAP-QL-017", "SAP-QL-020", "SAP-QL-024"].includes(ql)) {
    const expr = stem
      .replace(/^मान ज्ञात कीजिए\s*/u, "")
      .replace(/^ਮੁੱਲ ਕੱਢੋ\s*/u, "")
      .replace(/\s*सही भिन्न संक्रियाओं का उपयोग करके[.]?$/u, "")
      .replace(/\s*ਸਹੀ ਭਿੰਨ ਕਿਰਿਆਵਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ[.]?$/u, "");
    return L(language,
      `सही भिन्न संक्रियाओं का उपयोग करके मान ज्ञात कीजिए: ${expr}`,
      `ਸਹੀ ਭਿੰਨ ਕਿਰਿਆਵਾਂ ਵਰਤ ਕੇ ਮੁੱਲ ਕੱਢੋ: ${expr}`,
    );
  }

  if (ql === "SAP-QL-032") {
    const match = /(?:मान ज्ञात कीजिए|ਮੁੱਲ ਕੱਢੋ)\s+(.+?)\s+(?:और|ਅਤੇ)/u.exec(stem);
    const expr = match?.[1] ?? english.match(/value of (.+?) and choose/u)?.[1] ?? stem;
    return L(language,
      `${expr} का मान ज्ञात कीजिए और सरलतम समतुल्य भिन्न चुनिए।`,
      `${expr} ਦਾ ਮੁੱਲ ਕੱਢੋ ਅਤੇ ਸਭ ਤੋਂ ਸਰਲ ਸਮਤੁੱਲ ਭਿੰਨ ਚੁਣੋ।`,
    );
  }

  if (["SAP-QL-034","SAP-QL-035","SAP-QL-036","SAP-QL-037","SAP-QL-038","SAP-QL-039","SAP-QL-040","SAP-QL-041","SAP-QL-042","SAP-QL-043","SAP-QL-044","SAP-QL-045","SAP-QL-046","SAP-QL-047"].includes(ql)) {
    let expr = stem
      .replace(/^मान ज्ञात कीजिए\s*/u, "")
      .replace(/^ਮੁੱਲ ਕੱਢੋ\s*/u, "")
      .replace(/\. उत्तर को सरल भिन्न के रूप में लिखिए[.]?$/u, "")
      .replace(/\. ਉੱਤਰ ਨੂੰ ਸਭ ਤੋਂ ਸਰਲ ਭਿੰਨ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ[.]?$/u, "")
      .replace(/\. उत्तर दशमलव में लिखिए[.]?$/u, "")
      .replace(/\. ਉੱਤਰ ਦਸ਼ਮਲਵ ਵਿੱਚ ਲਿਖੋ[.]?$/u, "")
      .replace(/[.]$/u, "");
    expr = toSymbolicOf(expr);
    if (ql === "SAP-QL-045") {
      expr = expr.replace(/\(5 आवर्ती\)/u, "(जहाँ 5 आवर्ती है)").replace(/\(5 ਆਵਰਤੀ\)/u, "(ਜਿੱਥੇ 5 ਆਵਰਤੀ ਹੈ)");
    }
    const suffix = ["SAP-QL-041","SAP-QL-042","SAP-QL-045"].includes(ql)
      ? L(language, " उत्तर को सरल भिन्न में लिखिए।", " ਉੱਤਰ ਨੂੰ ਸਭ ਤੋਂ ਸਰਲ ਭਿੰਨ ਵਿੱਚ ਲਿਖੋ।")
      : ql === "SAP-QL-043"
        ? L(language, " उत्तर दशमलव में लिखिए।", " ਉੱਤਰ ਦਸ਼ਮਲਵ ਵਿੱਚ ਲਿਖੋ।")
        : "";
    return L(language, `मान ज्ञात कीजिए: ${expr}.${suffix}`, `ਮੁੱਲ ਕੱਢੋ: ${expr}.${suffix}`);
  }

  if (ql === "SAP-QL-051") {
    const m = /(\d+)\s*×\s*(\d+)\s*=\s*(\d+).*?(\d+\.\d+)\s*×\s*(\d+\.\d+)/u.exec(english);
    if (m) return L(language,
      `${m[1]} × ${m[2]} = ${m[3]} दिया है। ${m[4]} × ${m[5]} में दशमलव बिंदु सही लगाने वाला विकल्प चुनिए।`,
      `${m[1]} × ${m[2]} = ${m[3]} ਦਿੱਤਾ ਹੈ। ${m[4]} × ${m[5]} ਵਿੱਚ ਦਸ਼ਮਲਵ ਬਿੰਦੂ ਸਹੀ ਲਗਾਉਣ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।`,
    );
  }

  if (["SAP-QL-055","SAP-QL-056","SAP-QL-057","SAP-QL-058","SAP-QL-060","SAP-QL-061","SAP-QL-062","SAP-QL-065","SAP-QL-066"].includes(ql)) {
    let expr = stem
      .replace(/^मान ज्ञात कीजिए\s*/u, "")
      .replace(/^ਮੁੱਲ ਕੱਢੋ\s*/u, "")
      .replace(/^ज्ञात कीजिए सटीक मान का\s*/u, "")
      .replace(/^ਸਟੀਕ ਮੁੱਲ ਕੱਢੋ ਦਾ\s*/u, "")
      .replace(/^क्या है मान का\s*/u, "")
      .replace(/^ਕੀ ਹੈ ਮੁੱਲ ਦਾ\s*/u, "")
      .replace(/^क्या है\s*/u, "")
      .replace(/^ਕੀ ਹੈ\s*/u, "")
      .replace(/^सरल कीजिए\s*/u, "")
      .replace(/^ਸਰਲ ਕਰੋ\s*/u, "")
      .replace(/\. उत्तर को सरल भिन्न के रूप में लिखिए[.]?$/u, "")
      .replace(/\. ਉੱਤਰ ਨੂੰ ਸਭ ਤੋਂ ਸਰਲ ਭਿੰਨ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ[.]?$/u, "")
      .replace(/[.]$/u, "");
    const suffix = ["SAP-QL-056","SAP-QL-060"].includes(ql)
      ? L(language, " उत्तर को सरलतम भिन्न में लिखिए।", " ਉੱਤਰ ਨੂੰ ਸਭ ਤੋਂ ਸਰਲ ਭਿੰਨ ਵਿੱਚ ਲਿਖੋ।")
      : "";
    return L(language, `सटीक मान ज्ञात कीजिए: ${expr}.${suffix}`, `ਸਟੀਕ ਮੁੱਲ ਕੱਢੋ: ${expr}.${suffix}`);
  }

  if (ql === "SAP-QL-059") {
    const m = /(?:fourth root of|power 4 equals)\s*([\d.]+)/iu.exec(english);
    const n = m?.[1] ?? stem.match(/\d+/g)?.at(-1) ?? "";
    return L(language, `${n} का मुख्य चौथा मूल ज्ञात कीजिए।`, `${n} ਦਾ ਮੁੱਖ ਚੌਥਾ ਮੂਲ ਕੱਢੋ।`);
  }

  if (ql === "SAP-QL-067") {
    const eq = english.match(/makes\s+(.+?)\s+true/u)?.[1] ?? english.match(/equality\s+(.+?),/u)?.[1] ?? stem.match(/\d+\^x\s*=\s*\d+/u)?.[0] ?? "";
    return L(language,
      `${eq} को सत्य बनाने वाला गैर-ऋणात्मक पूर्णांक घातांक x ज्ञात कीजिए।`,
      `${eq} ਨੂੰ ਸਹੀ ਬਣਾਉਣ ਵਾਲਾ ਗੈਰ-ਰਣਾਤਮਕ ਪੂਰਨ ਅੰਕ ਘਾਤ x ਕੱਢੋ।`,
    );
  }

  if (ql === "SAP-QL-068") {
    const n = stem.match(/=\s*(\d+)/u)?.[1] ?? english.match(/root\s+(.+?),?\s*find/u)?.[1] ?? "";
    return L(language, `यदि √□ = ${n}, तो □ का मान ज्ञात कीजिए।`, `ਜੇ √□ = ${n}, ਤਾਂ □ ਦਾ ਮੁੱਲ ਕੱਢੋ।`);
  }

  if (ql === "SAP-QL-069") {
    const m = /(?:if|Compare)\s+A\s*=\s*(.+?)\s+and\s+B\s*=\s*(.+?)[.?]$/su.exec(english);
    if (m) return L(language,
      `A = ${m[1]} और B = ${m[2]}। A और B के बीच सही संबंध चुनिए।`,
      `A = ${m[1]} ਅਤੇ B = ${m[2]}। A ਅਤੇ B ਵਿਚਕਾਰ ਸਹੀ ਸੰਬੰਧ ਚੁਣੋ।`,
    );
    const m2 = /between\s+(.+?)\s+and\s+(.+?)[.?]$/su.exec(english);
    if (m2) return L(language, `${m2[1]} और ${m2[2]} की तुलना कीजिए।`, `${m2[1]} ਅਤੇ ${m2[2]} ਦੀ ਤੁਲਨਾ ਕਰੋ।`);
  }

  if (["SAP-QL-075","SAP-QL-078","SAP-QL-080","SAP-QL-081","SAP-QL-082","SAP-QL-083","SAP-QL-087","SAP-QL-088"].includes(ql)) {
    const expr = stem
      .replace(/^सरल कीजिए\s*/u, "")
      .replace(/^ਸਰਲ ਕਰੋ\s*/u, "")
      .replace(/^मान ज्ञात कीजिए\s*/u, "")
      .replace(/^ਮੁੱਲ ਕੱਢੋ\s*/u, "")
      .replace(/[.]$/u, "");
    return L(language, `सरल कीजिए: ${expr}`, `ਸਰਲ ਕਰੋ: ${expr}`);
  }

  if (["SAP-QL-092","SAP-QL-093","SAP-QL-094"].includes(ql)) {
    const eq = stem.replace(/^(?:ज्ञात कीजिए|ਕੱਢੋ)\s+□:\s*/u, "").replace(/[.]$/u, "");
    return L(language, `□ का मान ज्ञात कीजिए: ${eq}`, `□ ਦਾ ਮੁੱਲ ਕੱਢੋ: ${eq}`);
  }

  if (ql === "SAP-QL-097") {
    const eq = stem.replace(/^(?:ज्ञात कीजिए पूर्णांक|ਪੂਰਨ ਅੰਕ ਕੱਢੋ)\s*□:\s*/u, "").replace(/[.]$/u, "");
    return L(language, `पूर्णांक □ का मान ज्ञात कीजिए: ${eq}`, `ਪੂਰਨ ਅੰਕ □ ਦਾ ਮੁੱਲ ਕੱਢੋ: ${eq}`);
  }

  if (ql === "SAP-QL-102") {
    const eq = english.match(/candidate value of x makes (.+?) exactly true/u)?.[1] ?? stem.match(/\((?:x|.)+[=].+/u)?.[0] ?? "";
    return L(language, `x का कौन-सा मान ${toSymbolicOf(eq)} को ठीक-ठीक सत्य बनाता है?`, `x ਦਾ ਕਿਹੜਾ ਮੁੱਲ ${toSymbolicOf(eq)} ਨੂੰ ਬਿਲਕੁਲ ਸਹੀ ਬਣਾਉਂਦਾ ਹੈ?`);
  }

  if (ql === "SAP-QL-103") {
    const m = /^For E = (.+), consider: I\. (.+)\. II\. (.+)\. Which option is correct\?$/su.exec(english);
    if (m) return L(language,
      `E = ${toSymbolicOf(m[1])} के लिए कथन I: ${m[2]} और कथन II: ${m[3]} पर विचार कीजिए। सही विकल्प चुनिए।`,
      `E = ${toSymbolicOf(m[1])} ਲਈ ਕਥਨ I: ${m[2]} ਅਤੇ ਕਥਨ II: ${m[3]} ਨੂੰ ਵੇਖੋ। ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।`,
    );
  }

  if (["SAP-QL-104","SAP-QL-105","SAP-QL-106","SAP-QL-107","SAP-QL-108","SAP-QL-109","SAP-QL-110","SAP-QL-111"].includes(ql)) {
    let eq = stem
      .replace(/^निम्न संबंध में\s*\?\s*का मान ज्ञात कीजिए:\s*/u, "")
      .replace(/^ਹੇਠਾਂ ਦਿੱਤੇ ਸੰਬੰਧ ਵਿੱਚ\s*\?\s*ਦਾ ਮੁੱਲ ਕੱਢੋ:\s*/u, "")
      .replace(/^ज्ञात कीजिए पूर्णांक\s*\?:\s*/u, "")
      .replace(/^ਪੂਰਨ ਅੰਕ\s*\?\s*ਕੱਢੋ:\s*/u, "")
      .replace(/[.]$/u, "");
    eq = toSymbolicOf(eq);
    return ["SAP-QL-107","SAP-QL-109"].includes(ql)
      ? L(language, `पूर्णांक ? का मान ज्ञात कीजिए: ${eq}`, `ਪੂਰਨ ਅੰਕ ? ਦਾ ਮੁੱਲ ਕੱਢੋ: ${eq}`)
      : L(language, `? का मान ज्ञात कीजिए: ${eq}`, `? ਦਾ ਮੁੱਲ ਕੱਢੋ: ${eq}`);
  }

  if (ql === "SAP-QL-112") {
    const m = /^For integer x from (\d+) to (\d+), E = (.+)\. Can x be determined uniquely\? Statement I: (.+)\. Statement II: (.+)\.$/su.exec(english);
    if (m) {
      const expr = toSymbolicOf(m[3].replace(/(\d+\/\d+) of (\d+)/gu, "$1 × $2").replace(/(\d+%) of (\d+)/gu, "$1 × $2"));
      return L(language,
        `पूर्णांक x, ${m[1]} से ${m[2]} तक है और E = ${expr}। क्या x का एकमात्र मान निश्चित किया जा सकता है? कथन I: ${m[4]}। कथन II: ${m[5]}।`,
        `ਪੂਰਨ ਅੰਕ x, ${m[1]} ਤੋਂ ${m[2]} ਤੱਕ ਹੈ ਅਤੇ E = ${expr}। ਕੀ x ਦਾ ਇਕੋ ਮੁੱਲ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ? ਕਥਨ I: ${m[4]}। ਕਥਨ II: ${m[5]}।`,
      );
    }
  }

  if (ql === "SAP-QL-116") {
    const m = /round away from zero.*?Round (.+) to the nearest (.+)\.$/su.exec(english);
    if (m) return L(language,
      `नियम: मान ठीक आधे पर हो तो शून्य से दूर की ओर पूर्णांकित करें। ${m[1]} को निकटतम ${m[2] === "integer" ? "पूर्णांक" : m[2]} तक पूर्णांकित कीजिए।`,
      `ਨਿਯਮ: ਮੁੱਲ ਬਿਲਕੁਲ ਅੱਧੇ ਤੇ ਹੋਵੇ ਤਾਂ ਸਿਫ਼ਰ ਤੋਂ ਦੂਰ ਵੱਲ ਰਾਊਂਡ ਕਰੋ। ${m[1]} ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ${m[2] === "integer" ? "ਪੂਰਨ ਅੰਕ" : m[2]} ਤੱਕ ਰਾਊਂਡ ਕਰੋ।`,
    );
  }

  if (ql === "SAP-QL-126") {
    const m = /^A value is reported as (.+) after rounding to (?:the )?(nearest ten|nearest hundred|\d+ decimal places?)\. What is the maximum possible absolute rounding error under the declared half-away-from-zero rule\?$/su.exec(english);
    if (m) {
      const unit = m[2].startsWith("nearest ten") ? L(language,"निकटतम दस","ਸਭ ਤੋਂ ਨੇੜਲੇ ਦਸ") : m[2].startsWith("nearest hundred") ? L(language,"निकटतम सौ","ਸਭ ਤੋਂ ਨੇੜਲੇ ਸੌ") : L(language,`${m[2].match(/\d+/)?.[0] ?? ""} दशमलव स्थान`,`${m[2].match(/\d+/)?.[0] ?? ""} ਦਸ਼ਮਲਵ ਥਾਂ`);
      return L(language,
        `किसी मान को ${unit} तक पूर्णांकित करने पर ${m[1]} मिलता है। आधा-शून्य-से-दूर नियम के अनुसार अधिकतम संभव निरपेक्ष त्रुटि कितनी है?`,
        `ਕਿਸੇ ਮੁੱਲ ਨੂੰ ${unit} ਤੱਕ ਰਾਊਂਡ ਕਰਨ ਤੇ ${m[1]} ਮਿਲਦਾ ਹੈ। ਅੱਧਾ-ਸਿਫ਼ਰ-ਤੋਂ-ਦੂਰ ਨਿਯਮ ਅਨੁਸਾਰ ਵੱਧ ਤੋਂ ਵੱਧ ਸੰਭਵ ਨਿਰਪੇਖ ਗਲਤੀ ਕਿੰਨੀ ਹੈ?`,
      );
    }
  }

  if (ql === "SAP-QL-135") {
    const m = /^For a quick sum estimate, round (.+) and (.+) to the nearest (ten|hundred) before adding\. Which pair should replace the two numbers\?$/su.exec(english);
    if (m) {
      const unit = m[3] === "ten" ? L(language,"दस","ਦਸ") : L(language,"सौ","ਸੌ");
      return L(language,
        `त्वरित योग-अनुमान के लिए ${m[1]} और ${m[2]} को जोड़ने से पहले निकटतम ${unit} तक पूर्णांकित कीजिए। कौन-सी जोड़ी लेनी चाहिए?`,
        `ਤੇਜ਼ ਜੋੜ-ਅੰਦਾਜ਼ੇ ਲਈ ${m[1]} ਅਤੇ ${m[2]} ਨੂੰ ਜੋੜਨ ਤੋਂ ਪਹਿਲਾਂ ਸਭ ਤੋਂ ਨੇੜਲੇ ${unit} ਤੱਕ ਰਾਊਂਡ ਕਰੋ। ਕਿਹੜੀ ਜੋੜੀ ਲੈਣੀ ਚਾਹੀਦੀ ਹੈ?`,
      );
    }
  }

  if (ql === "SAP-QL-143") {
    const m = /^Two positive numbers, when rounded to the nearest (ten|hundred), become (.+) and (.+)\. Which interval must contain the exact value of the first number minus the second\?$/su.exec(english);
    if (m) {
      const unit = m[1] === "ten" ? L(language,"दस","ਦਸ") : L(language,"सौ","ਸੌ");
      return L(language,
        `दो धनात्मक संख्याएँ निकटतम ${unit} तक पूर्णांकित करने पर ${m[2]} और ${m[3]} बनती हैं। पहली संख्या में से दूसरी घटाने का सटीक मान किस अंतराल में अवश्य होगा?`,
        `ਦੋ ਧਨਾਤਮਕ ਸੰਖਿਆਵਾਂ ਸਭ ਤੋਂ ਨੇੜਲੇ ${unit} ਤੱਕ ਰਾਊਂਡ ਕਰਨ ਤੇ ${m[2]} ਅਤੇ ${m[3]} ਬਣਦੀਆਂ ਹਨ। ਪਹਿਲੀ ਸੰਖਿਆ ਵਿਚੋਂ ਦੂਜੀ ਘਟਾਉਣ ਦਾ ਸਟੀਕ ਮੁੱਲ ਕਿਹੜੇ ਅੰਤਰਾਲ ਵਿੱਚ ਲਾਜ਼ਮੀ ਹੋਵੇਗਾ?`,
      );
    }
  }

  if (ql === "SAP-QL-147") {
    const expr = english.match(/(?:nearest ten:|estimate)\s+(.+?)[.]?$/u)?.[1] ?? stem.match(/\d+[\s×]+\d+/u)?.[0] ?? "";
    return L(language,
      `दोनों गुणनखंडों को निकटतम दस तक पूर्णांकित करके अनुमान लगाइए: ${expr.replace(/[.]$/u,"")}`,
      `ਦੋਵੇਂ ਗੁਣਨਖੰਡਾਂ ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਦਸ ਤੱਕ ਰਾਊਂਡ ਕਰਕੇ ਅੰਦਾਜ਼ਾ ਲਗਾਓ: ${expr.replace(/[.]$/u,"")}`,
    );
  }

  if (ql === "SAP-QL-150") {
    const m = /^For estimation, take (.+) ≈ (.+) and (.+) ≈ (.+)\. Find (.+) approximately\.$/su.exec(english);
    if (m) {
      const target = m[5].replace(/(\d+(?:\.\d+)?%) of (\d+(?:\.\d+)?)/u,"$1 × $2");
      return L(language,
        `अनुमान के लिए ${m[1]} ≈ ${m[2]} और ${m[3]} ≈ ${m[4]} लीजिए। ${target} का लगभग मान ज्ञात कीजिए।`,
        `ਅੰਦਾਜ਼ੇ ਲਈ ${m[1]} ≈ ${m[2]} ਅਤੇ ${m[3]} ≈ ${m[4]} ਲਵੋ। ${target} ਦਾ ਲਗਭਗ ਮੁੱਲ ਕੱਢੋ।`,
      );
    }
  }

  if (ql === "SAP-QL-159") {
    const m = /^Round (.+) and (.+) to the nearest (ten|hundred)\. Which option is nearest to (.+)\?$/su.exec(english);
    if (m) {
      const unit = m[3] === "ten" ? L(language,"दस","ਦਸ") : L(language,"सौ","ਸੌ");
      return L(language,
        `${m[1]} और ${m[2]} को निकटतम ${unit} तक पूर्णांकित कीजिए। ${m[4]} के सबसे निकट विकल्प चुनिए।`,
        `${m[1]} ਅਤੇ ${m[2]} ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ${unit} ਤੱਕ ਰਾਊਂਡ ਕਰੋ। ${m[4]} ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਵਿਕਲਪ ਚੁਣੋ।`,
      );
    }
  }

  if (ql === "SAP-QL-178") {
    const m = /^Which value below (.+) has a square root nearest to (.+)\?$/su.exec(english);
    if (m) return L(language,
      `${m[1]} से छोटा कौन-सा मान ऐसा है जिसका वर्गमूल ${m[2]} के सबसे निकट है?`,
      `${m[1]} ਤੋਂ ਛੋਟਾ ਕਿਹੜਾ ਮੁੱਲ ਹੈ ਜਿਸ ਦਾ ਵਰਗ ਮੂਲ ${m[2]} ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਹੈ?`,
    );
  }

  if (["SAP-QL-183","SAP-QL-184"].includes(ql)) {
    const expr = stem
      .replace(/^मान ज्ञात कीजिए\s*/u, "")
      .replace(/^ਮੁੱਲ ਕੱਢੋ\s*/u, "")
      .replace(/^ज्ञात कीजिए सटीक मान का\s*/u, "")
      .replace(/^ਸਟੀਕ ਮੁੱਲ ਕੱਢੋ ਦਾ\s*/u, "")
      .replace(/[.]$/u, "");
    return L(language, `सटीक मान ज्ञात कीजिए: ${expr}`, `ਸਟੀਕ ਮੁੱਲ ਕੱਢੋ: ${expr}`);
  }

  if (["SAP-QL-199","SAP-QL-200","SAP-QL-201","SAP-QL-202","SAP-QL-203","SAP-QL-204","SAP-QL-205","SAP-QL-206","SAP-QL-211"].includes(ql)) {
    const raw = toSymbolicOf(stem).replace(/में\?/u,"में ?").replace(/ਵਿੱਚ\?/u,"ਵਿੱਚ ?");
    return raw;
  }
  if (ql === "SAP-QL-207") return stem.replace(/पूर्णांक\?/u,"पूर्णांक ?").replace(/ਪੂਰਨ ਅੰਕ\?/u,"ਪੂਰਨ ਅੰਕ ?");
  if (ql === "SAP-QL-208") {
    const band = stem.match(/\\\([\s\S]*?\\\)/u)?.[0] ?? "";
    return L(language,
      `पूर्णांक ? को ${band} की शर्त पूरी करनी है। ? के कितने पूर्णांक मान स्वीकार्य हैं?`,
      `ਪੂਰਨ ਅੰਕ ? ਨੂੰ ${band} ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨੀ ਹੈ। ? ਦੇ ਕਿੰਨੇ ਪੂਰਨ ਅੰਕ ਮੁੱਲ ਮਨਜ਼ੂਰ ਹਨ?`,
    );
  }
  if (ql === "SAP-QL-209") {
    const band = stem.match(/\\\([\s\S]*?\\\)/u)?.[0] ?? "";
    return L(language,
      `पूर्णांक ? को ${band} की सीमा में होना चाहिए। परिणाम एकमात्र, अनेक या असंभव—किस प्रकार का है?`,
      `ਪੂਰਨ ਅੰਕ ? ਨੂੰ ${band} ਦੀ ਹੱਦ ਵਿੱਚ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ। ਨਤੀਜਾ ਇਕੋ, ਕਈ ਜਾਂ ਅਸੰਭਵ—ਕਿਸ ਕਿਸਮ ਦਾ ਹੈ?`,
    );
  }

  return tidy(toSymbolicOf(stem));
}

function optionFor(ql: string, english: string, current: string, language: SapTranslationLanguage) {
  if (ql === "SAP-QL-085") {
    if (/Cancel the common-looking term immediately/i.test(english)) return L(language,"दिखने में समान पद को तुरंत काट दें","ਦਿੱਖ ਵਿੱਚ ਸਾਂਝੇ ਪਦ ਨੂੰ ਤੁਰੰਤ ਕੱਟ ਦਿਓ");
    if (/Multiply numerator and denominator by the same term first/i.test(english)) return L(language,"पहले अंश और हर को एक ही पद से गुणा करें","ਪਹਿਲਾਂ ਅੰਸ਼ ਅਤੇ ਹਰ ਨੂੰ ਇੱਕੋ ਪਦ ਨਾਲ ਗੁਣਾ ਕਰੋ");
    if (/shown cancellation is valid/i.test(english)) return L(language,"दिखाई गई काट-छाँट वैध है","ਦਿਖਾਈ ਗਈ ਕਟੌਤੀ ਵੈਧ ਹੈ");
    if (/Cancellation across addition is invalid/i.test(english)) return L(language,"जोड़ के आर-पार काट-छाँट करना अवैध है","ਜੋੜ ਦੇ ਆਰ-ਪਾਰ ਕਟੌਤੀ ਕਰਨਾ ਅਵੈਧ ਹੈ");
  }
  if (ql === "SAP-QL-090") {
    if (/Invert the second fraction/i.test(english)) return L(language,"गुणा से पहले दूसरी भिन्न का व्युत्क्रम लें","ਗੁਣਾ ਤੋਂ ਪਹਿਲਾਂ ਦੂਜੀ ਭਿੰਨ ਦਾ ਉਲਟ ਲਵੋ");
    const reduce = /Reduce (.+) by the common factor (.+) first/i.exec(english);
    if (reduce) return L(language,`पहले ${reduce[1]} को साझा गुणनखंड ${reduce[2]} से सरल करें`,`ਪਹਿਲਾਂ ${reduce[1]} ਨੂੰ ਸਾਂਝੇ ਗੁਣਨਖੰਡ ${reduce[2]} ਨਾਲ ਸਰਲ ਕਰੋ`);
    if (/Multiply the two numerators first/i.test(english)) return L(language,"पहले दोनों अंशों का गुणा करें","ਪਹਿਲਾਂ ਦੋਵੇਂ ਅੰਸ਼ਾਂ ਦਾ ਗੁਣਾ ਕਰੋ");
    if (/Multiply the two denominators first/i.test(english)) return L(language,"पहले दोनों हरों का गुणा करें","ਪਹਿਲਾਂ ਦੋਵੇਂ ਹਰਾਂ ਦਾ ਗੁਣਾ ਕਰੋ");
  }
  if (ql === "SAP-QL-091") {
    if (/Only Route B is valid/i.test(english)) return L(language,"केवल विधि B वैध है","ਸਿਰਫ਼ ਵਿਧੀ B ਵੈਧ ਹੈ");
    if (/Only Route A is valid/i.test(english)) return L(language,"केवल विधि A वैध है","ਸਿਰਫ਼ ਵਿਧੀ A ਵੈਧ ਹੈ");
    if (/different exact values/i.test(english)) return L(language,"दोनों विधियाँ अलग-अलग सटीक मान देती हैं","ਦੋਵੇਂ ਵਿਧੀਆਂ ਵੱਖ-ਵੱਖ ਸਟੀਕ ਮੁੱਲ ਦਿੰਦੀਆਂ ਹਨ");
    if (/Both routes are valid, but Route B is more efficient/i.test(english)) return L(language,"दोनों विधियाँ वैध हैं, लेकिन विधि B अधिक कुशल है","ਦੋਵੇਂ ਵਿਧੀਆਂ ਵੈਧ ਹਨ, ਪਰ ਵਿਧੀ B ਵੱਧ ਕੁਸ਼ਲ ਹੈ");
  }
  if (ql === "SAP-QL-128") {
    const a = /Premature rounding changed the result; the correct final answer is (.+)/i.exec(english);
    if (a) return L(language,`समय से पहले पूर्णांकन से परिणाम बदल गया; सही अंतिम उत्तर ${a[1]} है`,`ਸਮੇਂ ਤੋਂ ਪਹਿਲਾਂ ਰਾਊਂਡ ਕਰਨ ਨਾਲ ਨਤੀਜਾ ਬਦਲ ਗਿਆ; ਸਹੀ ਅੰਤਿਮ ਉੱਤਰ ${a[1]} ਹੈ`);
    const b = /student's method is valid; (.+) is the correct final answer/i.exec(english);
    if (b) return L(language,`विद्यार्थी की विधि वैध है; ${b[1]} सही अंतिम उत्तर है`,`ਵਿਦਿਆਰਥੀ ਦੀ ਵਿਧੀ ਵੈਧ ਹੈ; ${b[1]} ਸਹੀ ਅੰਤਿਮ ਉੱਤਰ ਹੈ`);
    const c = /only error is arithmetic; the correct final answer is (.+)/i.exec(english);
    if (c) return L(language,`केवल अंकगणितीय गलती है; सही अंतिम उत्तर ${c[1]} है`,`ਸਿਰਫ਼ ਅੰਕਗਣਿਤੀ ਗਲਤੀ ਹੈ; ਸਹੀ ਅੰਤਿਮ ਉੱਤਰ ${c[1]} ਹੈ`);
    if (/Both methods are equivalent/i.test(english)) return L(language,"दोनों विधियाँ समतुल्य हैं क्योंकि दोनों संख्याएँ सही पूर्णांकित की गई थीं","ਦੋਵੇਂ ਵਿਧੀਆਂ ਸਮਤੁੱਲ ਹਨ ਕਿਉਂਕਿ ਦੋਵੇਂ ਸੰਖਿਆਵਾਂ ਸਹੀ ਰਾਊਂਡ ਕੀਤੀਆਂ ਗਈਆਂ ਸਨ");
  }
  if (ql === "SAP-QL-146") {
    const a = /first term was rounded in the wrong direction; the approved estimate is (.+)/i.exec(english);
    if (a) return L(language,`पहले पद को गलत दिशा में पूर्णांकित किया गया; सही अनुमान ${a[1]} है`,`ਪਹਿਲੇ ਪਦ ਨੂੰ ਗਲਤ ਦਿਸ਼ਾ ਵਿੱਚ ਰਾਊਂਡ ਕੀਤਾ ਗਿਆ; ਸਹੀ ਅੰਦਾਜ਼ਾ ${a[1]} ਹੈ`);
    const b = /method is valid; (.+) is the approved estimate/i.exec(english);
    if (b) return L(language,`विधि वैध है; ${b[1]} सही अनुमान है`,`ਵਿਧੀ ਵੈਧ ਹੈ; ${b[1]} ਸਹੀ ਅੰਦਾਜ਼ਾ ਹੈ`);
    const c = /Only the addition is wrong; the correct estimate is (.+)/i.exec(english);
    if (c) return L(language,`केवल जोड़ गलत है; सही अनुमान ${c[1]} है`,`ਸਿਰਫ਼ ਜੋੜ ਗਲਤ ਹੈ; ਸਹੀ ਅੰਦਾਜ਼ਾ ${c[1]} ਹੈ`);
    if (/Both terms should instead be rounded upward/i.test(english)) return L(language,"दोनों पदों को ऊपर की ओर पूर्णांकित करना चाहिए","ਦੋਵੇਂ ਪਦਾਂ ਨੂੰ ਉੱਪਰ ਵੱਲ ਰਾਊਂਡ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ");
  }
  if (ql === "SAP-QL-163") {
    if (/Both rounded values are wrong/i.test(english)) return L(language,"दोनों पूर्णांकित मान गलत हैं","ਦੋਵੇਂ ਰਾਊਂਡ ਕੀਤੇ ਮੁੱਲ ਗਲਤ ਹਨ");
    const a = /Decimal place shifted; estimate should be (.+)/i.exec(english);
    if (a) return L(language,`दशमलव स्थान खिसक गया; अनुमान ${a[1]} होना चाहिए`,`ਦਸ਼ਮਲਵ ਥਾਂ ਖਿਸਕ ਗਈ; ਅੰਦਾਜ਼ਾ ${a[1]} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ`);
    const b = /product should be (.+)/i.exec(english);
    if (b) return L(language,`गुणनफल ${b[1]} होना चाहिए`,`ਗੁਣਨਫਲ ${b[1]} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ`);
    const c = /No error; (.+) is correct/i.exec(english);
    if (c) return L(language,`कोई त्रुटि नहीं; ${c[1]} सही है`,`ਕੋਈ ਗਲਤੀ ਨਹੀਂ; ${c[1]} ਸਹੀ ਹੈ`);
  }
  if (ql === "SAP-QL-164") {
    const keep = /Keep (.+)/i.exec(english);
    if (keep) return L(language,`${keep[1]} ही रखें`,`${keep[1]} ਹੀ ਰੱਖੋ`);
    const safe = /Use the nearest-hundred values: (.+)/i.exec(english);
    if (safe) return L(language,`निकटतम-सौ मान लें: ${safe[1]}`,`ਸਭ ਤੋਂ ਨੇੜਲੇ-ਸੌ ਮੁੱਲ ਲਵੋ: ${safe[1]}`);
    const use = /Use (.+)/i.exec(english);
    if (use) return L(language,`${use[1]} लें`,`${use[1]} ਲਵੋ`);
  }
  if (ql === "SAP-QL-194") {
    const e1 = /Estimate 1 \((.+)\)/i.exec(english);
    if (e1) return L(language,`अनुमान 1 (${e1[1]})`,`ਅੰਦਾਜ਼ਾ 1 (${e1[1]})`);
    const e2 = /Estimate 2 \((.+)\)/i.exec(english);
    if (e2) return L(language,`अनुमान 2 (${e2[1]})`,`ਅੰਦਾਜ਼ਾ 2 (${e2[1]})`);
    if (/equally accurate/i.test(english)) return L(language,"दोनों समान रूप से सटीक हैं","ਦੋਵੇਂ ਇੱਕੋ ਜਿਹੇ ਸਟੀਕ ਹਨ");
    if (/Neither can be compared/i.test(english)) return L(language,"दोनों की तुलना नहीं की जा सकती","ਦੋਵਾਂ ਦੀ ਤੁਲਨਾ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ");
  }
  if (ql === "SAP-QL-198") {
    if (/No unique nearest option can be guaranteed/i.test(english)) return L(language,"किसी एक निकटतम विकल्प की गारंटी नहीं दी जा सकती","ਕਿਸੇ ਇੱਕ ਸਭ ਤੋਂ ਨੇੜਲੇ ਵਿਕਲਪ ਦੀ ਗਾਰੰਟੀ ਨਹੀਂ ਦਿੱਤੀ ਜਾ ਸਕਦੀ");
    const d1 = /(.+) is definitely nearest/i.exec(english);
    if (d1) return L(language,`${d1[1]} निश्चित रूप से सबसे निकट है`,`${d1[1]} ਯਕੀਨੀ ਤੌਰ ਤੇ ਸਭ ਤੋਂ ਨੇੜੇ ਹੈ`);
    if (/Both options are always equally near/i.test(english)) return L(language,"दोनों विकल्प हमेशा समान दूरी पर हैं","ਦੋਵੇਂ ਵਿਕਲਪ ਹਮੇਸ਼ਾ ਇੱਕੋ ਦੂਰੀ ਤੇ ਹਨ");
  }
  if (ql === "SAP-QL-119") {
    const m = /^(\d+)\s+(?:to|तक|ਤੋਂ)\s+(\d+)\s*\((?:inclusive|समेत|ਸ਼ਾਮਲ)\)$/iu.exec(english) ?? /^(\d+)\s+to\s+(\d+)\s+\(inclusive\)$/iu.exec(english);
    if (m) return L(language,`${m[1]} से ${m[2]} तक (दोनों सहित)`,`${m[1]} ਤੋਂ ${m[2]} ਤੱਕ (ਦੋਵੇਂ ਸਮੇਤ)`);
  }
  return current;
}

function conceptFor(cp: string, ql: string, language: SapTranslationLanguage) {
  const hi: Record<string,string> = {
    "SAP-CP-001":"पहले कोष्ठक और घात हल कीजिए; फिर गुणा/भाग और अंत में जोड़/घटाव बाएँ से दाएँ कीजिए।",
    "SAP-CP-002":"भिन्नों में पहले आवश्यक समान हर या व्युत्क्रम का उपयोग कीजिए और उत्तर को सरलतम रूप में लिखिए।",
    "SAP-CP-003":"दशमलव, भिन्न और प्रतिशत को सुविधाजनक सटीक रूप में बदलकर गणना कीजिए।",
    "SAP-CP-004":"घात, मूल और फैक्टोरियल का मान सही नियम से निकालकर शेष गणना कीजिए।",
    "SAP-CP-005":"बड़ी गणना से पहले वैध समान गुणनखंड, काट-छाँट या टेलिस्कोपिंग संरचना पहचानिए।",
    "SAP-CP-006":"अज्ञात मान को अकेला कीजिए और प्राप्त उत्तर को मूल समानता या शर्त में जाँचिए।",
    "SAP-CP-007":"निर्धारित स्थान तक पूर्णांकन करते समय उसके ठीक दाएँ वाले अंक से ऊपर या नीचे जाने का निर्णय कीजिए।",
    "SAP-CP-008":"दिए गए नियम के अनुसार पदों को पूर्णांकित करके योग या अंतर का अनुमान लगाइए।",
    "SAP-CP-009":"उपयुक्त निकट मान लेकर गुणनफल, भागफल, अनुपात या प्रतिशत का व्यावहारिक अनुमान लगाइए।",
    "SAP-CP-010":"मूल या घात को निकट के सुविधाजनक पूर्ण वर्ग, घन या पूर्णांक से बाँधकर अनुमान लगाइए।",
    "SAP-CP-011":"सटीक मान, अनुमान, त्रुटि, दूरी या सीमा की तुलना करके सही निष्कर्ष चुनिए।",
    "SAP-CP-012":"निकट मान लेकर समीकरण सरल कीजिए और अज्ञात मान या उसकी संभव सीमा ज्ञात कीजिए।",
  };
  const pa: Record<string,string> = {
    "SAP-CP-001":"ਪਹਿਲਾਂ ਬਰੈਕਟ ਅਤੇ ਘਾਤ ਹੱਲ ਕਰੋ; ਫਿਰ ਗੁਣਾ/ਭਾਗ ਅਤੇ ਅੰਤ ਵਿੱਚ ਜੋੜ/ਘਟਾਓ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਕਰੋ।",
    "SAP-CP-002":"ਭਿੰਨਾਂ ਵਿੱਚ ਪਹਿਲਾਂ ਲੋੜੀਂਦਾ ਇੱਕੋ ਹਰ ਜਾਂ ਉਲਟ ਭਿੰਨ ਵਰਤੋ ਅਤੇ ਉੱਤਰ ਸਭ ਤੋਂ ਸਰਲ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।",
    "SAP-CP-003":"ਦਸ਼ਮਲਵ, ਭਿੰਨ ਅਤੇ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਸੁਵਿਧਾਜਨਕ ਸਟੀਕ ਰੂਪ ਵਿੱਚ ਬਦਲ ਕੇ ਗਣਨਾ ਕਰੋ।",
    "SAP-CP-004":"ਘਾਤ, ਮੂਲ ਅਤੇ ਫੈਕਟੋਰੀਅਲ ਦਾ ਮੁੱਲ ਸਹੀ ਨਿਯਮ ਨਾਲ ਕੱਢ ਕੇ ਬਾਕੀ ਗਣਨਾ ਕਰੋ।",
    "SAP-CP-005":"ਵੱਡੀ ਗਣਨਾ ਤੋਂ ਪਹਿਲਾਂ ਵੈਧ ਸਾਂਝਾ ਗੁਣਨਖੰਡ, ਕਟੌਤੀ ਜਾਂ ਟੈਲੀਸਕੋਪਿੰਗ ਬਣਤਰ ਪਛਾਣੋ।",
    "SAP-CP-006":"ਅਣਜਾਣ ਮੁੱਲ ਨੂੰ ਇਕੱਲਾ ਕਰੋ ਅਤੇ ਮਿਲੇ ਉੱਤਰ ਨੂੰ ਮੂਲ ਸਮਾਨਤਾ ਜਾਂ ਸ਼ਰਤ ਵਿੱਚ ਜਾਂਚੋ।",
    "SAP-CP-007":"ਨਿਰਧਾਰਤ ਥਾਂ ਤੱਕ ਰਾਊਂਡ ਕਰਦੇ ਸਮੇਂ ਉਸ ਦੇ ਠੀਕ ਸੱਜੇ ਅੰਕ ਤੋਂ ਉੱਪਰ ਜਾਂ ਹੇਠਾਂ ਜਾਣ ਦਾ ਫ਼ੈਸਲਾ ਕਰੋ।",
    "SAP-CP-008":"ਦਿੱਤੇ ਨਿਯਮ ਅਨੁਸਾਰ ਪਦਾਂ ਨੂੰ ਰਾਊਂਡ ਕਰਕੇ ਜੋੜ ਜਾਂ ਅੰਤਰ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਓ।",
    "SAP-CP-009":"ਢੁੱਕਵੇਂ ਨੇੜਲੇ ਮੁੱਲ ਲੈ ਕੇ ਗੁਣਨਫਲ, ਭਾਗਫਲ, ਅਨੁਪਾਤ ਜਾਂ ਪ੍ਰਤੀਸ਼ਤ ਦਾ ਵਰਤੋਂਯੋਗ ਅੰਦਾਜ਼ਾ ਲਗਾਓ।",
    "SAP-CP-010":"ਮੂਲ ਜਾਂ ਘਾਤ ਨੂੰ ਨੇੜਲੇ ਸੁਵਿਧਾਜਨਕ ਪੂਰਨ ਵਰਗ, ਘਣ ਜਾਂ ਪੂਰਨ ਅੰਕ ਨਾਲ ਬੰਨ੍ਹ ਕੇ ਅੰਦਾਜ਼ਾ ਲਗਾਓ।",
    "SAP-CP-011":"ਸਟੀਕ ਮੁੱਲ, ਅੰਦਾਜ਼ਾ, ਗਲਤੀ, ਦੂਰੀ ਜਾਂ ਹੱਦ ਦੀ ਤੁਲਨਾ ਕਰਕੇ ਸਹੀ ਨਤੀਜਾ ਚੁਣੋ।",
    "SAP-CP-012":"ਨੇੜਲੇ ਮੁੱਲ ਲੈ ਕੇ ਸਮੀਕਰਨ ਸਰਲ ਕਰੋ ਅਤੇ ਅਣਜਾਣ ਮੁੱਲ ਜਾਂ ਉਸ ਦੀ ਸੰਭਵ ਹੱਦ ਕੱਢੋ।",
  };
  if (ql === "SAP-QL-059") return L(language,"चौथे मूल के लिए वह धनात्मक संख्या खोजिए जिसकी चौथी घात दी गई संख्या के बराबर हो।","ਚੌਥੇ ਮੂਲ ਲਈ ਉਹ ਧਨਾਤਮਕ ਸੰਖਿਆ ਲੱਭੋ ਜਿਸ ਦੀ ਚੌਥੀ ਘਾਤ ਦਿੱਤੀ ਸੰਖਿਆ ਦੇ ਬਰਾਬਰ ਹੋਵੇ।");
  if (ql === "SAP-QL-067") return L(language,"समान आधार की घातों की तुलना करके घातांक x ज्ञात कीजिए।","ਇੱਕੋ ਆਧਾਰ ਵਾਲੀਆਂ ਘਾਤਾਂ ਦੀ ਤੁਲਨਾ ਕਰਕੇ ਘਾਤ x ਕੱਢੋ।");
  return (language === "hi" ? hi : pa)[cp] ?? L(language,"दिए गए नियम से प्रश्न हल कीजिए।","ਦਿੱਤੇ ਨਿਯਮ ਨਾਲ ਸਵਾਲ ਹੱਲ ਕਰੋ।");
}

function specialMiddle(ql: string, lines: string[], answer: string, language: SapTranslationLanguage) {
  if (ql === "SAP-QL-050") return [L(language,"x और y के बीच कोई निश्चित संबंध नहीं दिया गया है, इसलिए A और B की तुलना निश्चित नहीं की जा सकती।","x ਅਤੇ y ਵਿਚਕਾਰ ਕੋਈ ਨਿਸ਼ਚਿਤ ਸੰਬੰਧ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ, ਇਸ ਲਈ A ਅਤੇ B ਦੀ ਤੁਲਨਾ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ।")];
  if (ql === "SAP-QL-071") return [L(language,"चरण 1 गलत है: 8!/7! = 8, 7 नहीं।","ਕਦਮ 1 ਗਲਤ ਹੈ: 8!/7! = 8, 7 ਨਹੀਂ।")];
  if (ql === "SAP-QL-085") return [L(language,"अंश में जोड़ है, इसलिए 8 को पूरे अंश और हर में सीधे नहीं काट सकते। जोड़ के आर-पार काट-छाँट अवैध है।","ਅੰਸ਼ ਵਿੱਚ ਜੋੜ ਹੈ, ਇਸ ਲਈ 8 ਨੂੰ ਪੂਰੇ ਅੰਸ਼ ਅਤੇ ਹਰ ਵਿੱਚ ਸਿੱਧਾ ਨਹੀਂ ਕੱਟ ਸਕਦੇ। ਜੋੜ ਦੇ ਆਰ-ਪਾਰ ਕਟੌਤੀ ਅਵੈਧ ਹੈ।")];
  if (ql === "SAP-QL-090") return [L(language,`${answer}। इससे बड़े गुणा से पहले भिन्न सरल हो जाती है।`,`${answer}। ਇਸ ਨਾਲ ਵੱਡੇ ਗੁਣੇ ਤੋਂ ਪਹਿਲਾਂ ਭਿੰਨ ਸਰਲ ਹੋ ਜਾਂਦੀ ਹੈ।`)];
  if (ql === "SAP-QL-091") return [L(language,"दोनों विधियाँ समान सटीक मान देती हैं; पहले सरल करने वाली विधि B में गणना छोटी रहती है।","ਦੋਵੇਂ ਵਿਧੀਆਂ ਇੱਕੋ ਸਟੀਕ ਮੁੱਲ ਦਿੰਦੀਆਂ ਹਨ; ਪਹਿਲਾਂ ਸਰਲ ਕਰਨ ਵਾਲੀ ਵਿਧੀ B ਵਿੱਚ ਗਣਨਾ ਛੋਟੀ ਰਹਿੰਦੀ ਹੈ।")];
  if (ql === "SAP-QL-128") return [L(language,`${answer}। पहले अलग-अलग संख्याएँ पूर्णांकित करने से अंतिम योग बदल सकता है।`,`${answer}। ਪਹਿਲਾਂ ਵੱਖ-ਵੱਖ ਸੰਖਿਆਵਾਂ ਰਾਊਂਡ ਕਰਨ ਨਾਲ ਅੰਤਿਮ ਜੋੜ ਬਦਲ ਸਕਦਾ ਹੈ।`)];
  if (ql === "SAP-QL-146") return [L(language,`${answer}। पहले प्रत्येक पद का सही पूर्णांकन जाँचिए, फिर जोड़ कीजिए।`,`${answer}। ਪਹਿਲਾਂ ਹਰ ਪਦ ਦੀ ਸਹੀ ਰਾਊਂਡਿੰਗ ਜਾਂਚੋ, ਫਿਰ ਜੋੜ ਕਰੋ।`)];
  if (ql === "SAP-QL-164") return [L(language,`${answer}। दोनों पदों को एक ही घोषित निकटतम-सौ नियम से लेना चाहिए।`,`${answer}। ਦੋਵੇਂ ਪਦਾਂ ਨੂੰ ਇੱਕੋ ਘੋਸ਼ਿਤ ਸਭ ਤੋਂ ਨੇੜਲੇ-ਸੌ ਨਿਯਮ ਨਾਲ ਲੈਣਾ ਚਾਹੀਦਾ ਹੈ।`)];
  if (ql === "SAP-QL-194") return [L(language,"दोनों अनुमानों की सटीक मान से निरपेक्ष दूरी निकालिए; कम दूरी वाला अनुमान अधिक सटीक है।","ਦੋਵੇਂ ਅੰਦਾਜ਼ਿਆਂ ਦੀ ਸਟੀਕ ਮੁੱਲ ਤੋਂ ਨਿਰਪੇਖ ਦੂਰੀ ਕੱਢੋ; ਘੱਟ ਦੂਰੀ ਵਾਲਾ ਅੰਦਾਜ਼ਾ ਵੱਧ ਸਟੀਕ ਹੈ।")];
  if (ql === "SAP-QL-209") return [L(language,`दी गई सीमा में आने वाले पूर्णांक गिनने पर परिणाम ${answer} है।`,`ਦਿੱਤੀ ਹੱਦ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਪੂਰਨ ਅੰਕ ਗਿਣਣ ਤੇ ਨਤੀਜਾ ${answer} ਹੈ।`)];
  return lines;
}

function polishExplanation(base: any, current: any, answer: string, language: SapTranslationLanguage) {
  const ql = String(base.questionLanguageId ?? "");
  const cp = String(base.canonicalProblemId ?? "");
  const original = [...(current.explanation?.lines ?? [])].map((line: unknown) => tidy(toSymbolicOf(String(line ?? ""))));
  let middle = original.slice(1, -1)
    .map((line) => line
      .replace(/मान रखिए:\s*\?/gu, L(language,"मान रखिए: ?","ਮੁੱਲ ਰੱਖੋ: ?"))
      .replace(/इसलिए\s*\?/gu,"इसलिए ?")
      .replace(/अतः\s*\?/gu,"अतः ?")
      .replace(/ਇਸ ਲਈ\s*\?/gu,"ਇਸ ਲਈ ?")
      .replace(/ਤਾਂ\s*\?/gu,"ਤਾਂ ?")
      .replace(/दिए गए मानों पर यह नियम लागू करने पर ([^।.]+) प्राप्त होता है[।.]?/u, (_m,x) => L(language,`गणना से ${x} मिलता है।`,`ਗਣਨਾ ਨਾਲ ${x} ਮਿਲਦਾ ਹੈ।`))
      .replace(/ਦਿੱਤੇ ਮੁੱਲਾਂ ਉੱਤੇ ਇਹ ਨਿਯਮ ਲਾਗੂ ਕਰਨ ਤੇ ([^।.]+) ਮਿਲਦਾ ਹੈ[।.]?/u, (_m,x) => `ਗਣਨਾ ਨਾਲ ${x} ਮਿਲਦਾ ਹੈ।`)
    );
  middle = specialMiddle(ql, middle, answer, language);
  if (!middle.length) middle = [L(language,`गणना करने पर ${answer} मिलता है।`,`ਗਣਨਾ ਕਰਨ ਤੇ ${answer} ਮਿਲਦਾ ਹੈ।`)];
  const conclusion = L(language,`अतः सही उत्तर ${answer} है।`,`ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`);
  return Object.freeze({lines:Object.freeze([conceptFor(cp, ql, language), ...middle.slice(0,5), conclusion])});
}

export function applySapHumanReviewPolishV8(base: any, current: any, language: SapTranslationLanguage) {
  const ql = String(base.questionLanguageId ?? "");
  const stem = tidy(toSymbolicOf(stemFor(base, current, language)));
  const options = Object.freeze(base.options.map((option: unknown, index: number) => optionFor(
    ql,
    String(option ?? ""),
    String(current.options?.[index] ?? option ?? ""),
    language,
  )));
  const correctIndex = Number(base.correctIndex);
  const answer = options[correctIndex] ?? String(current.answer ?? "");
  const explanation = polishExplanation(base, current, answer, language);
  return Object.freeze({
    ...current,
    stem,
    options,
    correctIndex,
    answer,
    explanation,
    traceability:Object.freeze({
      ...(current.traceability ?? {}),
      localizedHumanReviewPolish:"SAP-HUMAN-REVIEW-POLISH-V8",
    }),
  });
}
