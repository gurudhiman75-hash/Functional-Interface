import type { SapTranslationLanguage } from "./types";

const MATH = /\\\([\s\S]*?\\\)/gu;
const LATIN_WORD = /[A-Za-z]{3,}/u;

function hiPa(language: SapTranslationLanguage, hi: string, pa: string) {
  return language === "hi" ? hi : pa;
}

function tidy(value: string) {
  return value
    .replace(/\s{2,}/gu, " ")
    .replace(/\s+([,.;:?!।])/gu, "$1")
    .replace(/([([{])\s+/gu, "$1")
    .replace(/\s+([)\]}])/gu, "$1")
    .trim();
}

function translateStepLabel(line: string, language: SapTranslationLanguage) {
  return line.replace(/^Step\s+(\d+)\s*:/u, (_match, index) =>
    hiPa(language, `चरण ${index}:`, `ਕਦਮ ${index}:`),
  );
}

function translateCommonStemLine(line: string, language: SapTranslationLanguage) {
  const trimmed = line.trim();
  if (!trimmed) return "";
  if (/^Step\s+\d+\s*:/u.test(trimmed)) {
    const labelled = translateStepLabel(trimmed, language);
    return labelled
      .replace(/Simplify the previous fraction\.?/giu, hiPa(language, "पिछली भिन्न को सरल कीजिए।", "ਪਿਛਲੀ ਭਿੰਨ ਨੂੰ ਸਰਲ ਕਰੋ."))
      .replace(/No error\.?/giu, hiPa(language, "कोई त्रुटि नहीं।", "ਕੋਈ ਗਲਤੀ ਨਹੀਂ."));
  }
  return trimmed;
}

function naturalStem(base: any, generic: any, language: SapTranslationLanguage): string {
  const english = String(base.stem ?? "").trim();
  const genericStem = String(generic.stem ?? "").trim();
  const H = (hi: string, pa: string) => hiPa(language, hi, pa);

  let match = /^Simplify:\s*(.+)$/su.exec(english);
  if (match) return H(`सरल कीजिए: ${match[1]}`, `ਸਰਲ ਕਰੋ: ${match[1]}`);

  match = /^Evaluate:\s*(.+)$/su.exec(english);
  if (match) return H(`मान ज्ञात कीजिए: ${match[1]}`, `ਮੁੱਲ ਕੱਢੋ: ${match[1]}`);

  match = /^Find \?:\s*(.+)$/su.exec(english);
  if (match) return H(`निम्न संबंध में ? का मान ज्ञात कीजिए: ${match[1]}`, `ਹੇਠਾਂ ਦਿੱਤੇ ਸੰਬੰਧ ਵਿੱਚ ? ਦਾ ਮੁੱਲ ਕੱਢੋ: ${match[1]}`);

  match = /^Round (.+) to the nearest (ten|hundred|thousand|integer|whole number)\.?$/u.exec(english);
  if (match) {
    const place = {
      ten: H("दस", "ਦਸ"),
      hundred: H("सौ", "ਸੌ"),
      thousand: H("हजार", "ਹਜ਼ਾਰ"),
      integer: H("पूर्णांक", "ਪੂਰਨ ਅੰਕ"),
      "whole number": H("पूर्णांक", "ਪੂਰਨ ਅੰਕ"),
    }[match[2]]!;
    return H(`${match[1]} को निकटतम ${place} तक पूर्णांकित कीजिए।`, `${match[1]} ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ${place} ਤੱਕ ਰਾਊਂਡ ਕਰੋ.`);
  }

  match = /^Between which two consecutive integers does (.+) lie\?$/u.exec(english);
  if (match) return H(`${match[1]} किन दो क्रमागत पूर्णांकों के बीच स्थित है?`, `${match[1]} ਕਿਹੜੇ ਦੋ ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਦੇ ਵਿਚਕਾਰ ਪੈਂਦਾ ਹੈ?`);

  match = /^At which step does the fraction simplification first become incorrect\?\n([\s\S]+)$/u.exec(english);
  if (match) {
    const steps = match[1].split("\n").map((line) => translateCommonStemLine(line, language)).join("\n");
    return H(`भिन्न के इस हल में पहला गलत चरण कौन-सा है?\n${steps}`, `ਇਸ ਭਿੰਨ ਦੇ ਹੱਲ ਵਿੱਚ ਪਹਿਲਾ ਗਲਤ ਕਦਮ ਕਿਹੜਾ ਹੈ?\n${steps}`);
  }

  match = /^Consider the following working for (.+)\.\n([\s\S]+)\nWhich is the first incorrect step\?$/u.exec(english);
  if (match) {
    const steps = match[2].split("\n").map((line) => translateCommonStemLine(line, language)).join("\n");
    return H(`निम्न गणना पर विचार कीजिए: ${match[1]}।\n${steps}\nपहला गलत चरण कौन-सा है?`, `ਹੇਠਾਂ ਦਿੱਤੀ ਗਣਨਾ ਨੂੰ ਵੇਖੋ: ${match[1]}.\n${steps}\nਪਹਿਲਾ ਗਲਤ ਕਦਮ ਕਿਹੜਾ ਹੈ?`);
  }

  match = /^An expression is known only to lie between (.+) and (.+)\. The two nearest listed options are (.+) and (.+)\. What can be concluded\?$/u.exec(english);
  if (match) {
    return H(
      `किसी व्यंजक का मान ${match[1]} और ${match[2]} के बीच है। निकटतम दिए गए विकल्प ${match[3]} और ${match[4]} हैं। क्या निष्कर्ष निकलेगा?`,
      `ਕਿਸੇ ਵਿਆੰਜਕ ਦਾ ਮੁੱਲ ${match[1]} ਅਤੇ ${match[2]} ਦੇ ਵਿਚਕਾਰ ਹੈ. ਸਭ ਤੋਂ ਨੇੜਲੇ ਦਿੱਤੇ ਵਿਕਲਪ ${match[3]} ਅਤੇ ${match[4]} ਹਨ. ਕੀ ਨਤੀਜਾ ਕੱਢਿਆ ਜਾ ਸਕਦਾ ਹੈ?`,
    );
  }

  match = /^What approximate value should replace \? in (.+)\?$/u.exec(english);
  if (match) return H(`निम्न में ? के स्थान पर लगभग कौन-सा मान आएगा: ${match[1]}?`, `ਹੇਠਾਂ ? ਦੀ ਥਾਂ ਲਗਭਗ ਕਿਹੜਾ ਮੁੱਲ ਆਵੇਗਾ: ${match[1]}?`);

  match = /^What approximate value should come in place of \? in (.+)\?$/u.exec(english);
  if (match) return H(`निम्न में ? के स्थान पर लगभग कौन-सा मान आएगा: ${match[1]}?`, `ਹੇਠਾਂ ? ਦੀ ਥਾਂ ਲਗਭਗ ਕਿਹੜਾ ਮੁੱਲ ਆਵੇਗਾ: ${match[1]}?`);

  match = /^Which option is closest to the value of (.+)\?$/u.exec(english);
  if (match) return H(`${match[1]} के मान के सबसे निकट कौन-सा विकल्प है?`, `${match[1]} ਦੇ ਮੁੱਲ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਕਿਹੜਾ ਵਿਕਲਪ ਹੈ?`);

  match = /^Which option is nearest to (.+)\?$/u.exec(english);
  if (match) return H(`${match[1]} के सबसे निकट कौन-सा विकल्प है?`, `${match[1]} ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਕਿਹੜਾ ਵਿਕਲਪ ਹੈ?`);

  match = /^What is the absolute error(?: of the estimate)?\??$/u.exec(english);
  if (match) return H("अनुमान की निरपेक्ष त्रुटि ज्ञात कीजिए।", "ਅੰਦਾਜ਼ੇ ਦੀ ਨਿਰਪੇਖ ਗਲਤੀ ਕੱਢੋ.");

  if (/Which simplification statement is correct\?/u.test(english)) {
    return H("कौन-सा सरलीकरण कथन सही है?", "ਕਿਹੜਾ ਸਰਲੀਕਰਨ ਕਥਨ ਸਹੀ ਹੈ?");
  }

  if (/Which statement is correct\?/u.test(english)) {
    return H("कौन-सा कथन सही है?", "ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ?");
  }

  if (/Which is the first incorrect step\?/u.test(english) && english.includes("\n")) {
    const lines = english.split("\n");
    const body = lines.filter((line) => !/Which is the first incorrect step\?/u.test(line))
      .map((line) => translateCommonStemLine(line, language)).join("\n");
    return H(`${body}\nपहला गलत चरण कौन-सा है?`, `${body}\nਪਹਿਲਾ ਗਲਤ ਕਦਮ ਕਿਹੜਾ ਹੈ?`);
  }

  // Most command-style SAP stems are already clean after the generic phrase layer.
  // The authored release never returns a stem that still contains obvious English prose.
  if (!LATIN_WORD.test(genericStem.replace(MATH, ""))) return genericStem;

  const cp = String(base.canonicalProblemId ?? "");
  const title = String(base.traceability?.qlTitle ?? "");
  const formula = english.match(/(?:\\\([\s\S]*?\\\)|[0-9?√%][^\n]*)/u)?.[0] ?? "";
  const fallbackByCp: Record<string, string> = language === "hi" ? {
    "SAP-CP-001": `सही संक्रिया-क्रम का उपयोग करके प्रश्न हल कीजिए${formula ? `: ${formula}` : "।"}`,
    "SAP-CP-002": `भिन्नों के नियमों का उपयोग करके प्रश्न हल कीजिए${formula ? `: ${formula}` : "।"}`,
    "SAP-CP-003": `दशमलव, भिन्न और प्रतिशत के सही रूप का उपयोग करके प्रश्न हल कीजिए${formula ? `: ${formula}` : "।"}`,
    "SAP-CP-004": `घात, मूल या फैक्टोरियल के नियमों का उपयोग करके प्रश्न हल कीजिए${formula ? `: ${formula}` : "।"}`,
    "SAP-CP-005": `उपयुक्त काट-छाँट या संरचनात्मक सरलीकरण से प्रश्न हल कीजिए${formula ? `: ${formula}` : "।"}`,
    "SAP-CP-006": `दिए गए संबंध से आवश्यक मान ज्ञात कीजिए${formula ? `: ${formula}` : "।"}`,
    "SAP-CP-007": `दिए गए पूर्णांकन नियम के अनुसार प्रश्न हल कीजिए${formula ? `: ${formula}` : "।"}`,
    "SAP-CP-008": `दिए गए पदों को उचित रूप से पूर्णांकित करके अनुमान लगाइए${formula ? `: ${formula}` : "।"}`,
    "SAP-CP-009": `गुणनफल, भागफल या अनुपात का उपयुक्त अनुमान लगाइए${formula ? `: ${formula}` : "।"}`,
    "SAP-CP-010": `निकटवर्ती पूर्ण घातों का उपयोग करके मान का अनुमान लगाइए${formula ? `: ${formula}` : "।"}`,
    "SAP-CP-011": `दिए गए अनुमान, त्रुटि या सीमा के आधार पर सही विकल्प चुनिए${formula ? `: ${formula}` : "।"}`,
    "SAP-CP-012": `दिए गए अनुमानित संबंध से अज्ञात मान ज्ञात कीजिए${formula ? `: ${formula}` : "।"}`,
  } : {
    "SAP-CP-001": `ਸਹੀ ਕਿਰਿਆ-ਕ੍ਰਮ ਵਰਤ ਕੇ ਸਵਾਲ ਹੱਲ ਕਰੋ${formula ? `: ${formula}` : "."}`,
    "SAP-CP-002": `ਭਿੰਨਾਂ ਦੇ ਨਿਯਮ ਵਰਤ ਕੇ ਸਵਾਲ ਹੱਲ ਕਰੋ${formula ? `: ${formula}` : "."}`,
    "SAP-CP-003": `ਦਸ਼ਮਲਵ, ਭਿੰਨ ਅਤੇ ਪ੍ਰਤੀਸ਼ਤ ਦੇ ਸਹੀ ਰੂਪ ਵਰਤ ਕੇ ਸਵਾਲ ਹੱਲ ਕਰੋ${formula ? `: ${formula}` : "."}`,
    "SAP-CP-004": `ਘਾਤ, ਮੂਲ ਜਾਂ ਫੈਕਟੋਰੀਅਲ ਦੇ ਨਿਯਮ ਵਰਤ ਕੇ ਸਵਾਲ ਹੱਲ ਕਰੋ${formula ? `: ${formula}` : "."}`,
    "SAP-CP-005": `ਉਚਿਤ ਕਟੌਤੀ ਜਾਂ ਸੰਰਚਨਾਤਮਕ ਸਰਲੀਕਰਨ ਨਾਲ ਸਵਾਲ ਹੱਲ ਕਰੋ${formula ? `: ${formula}` : "."}`,
    "SAP-CP-006": `ਦਿੱਤੇ ਸੰਬੰਧ ਤੋਂ ਲੋੜੀਂਦਾ ਮੁੱਲ ਕੱਢੋ${formula ? `: ${formula}` : "."}`,
    "SAP-CP-007": `ਦਿੱਤੇ ਰਾਊਂਡਿੰਗ ਨਿਯਮ ਅਨੁਸਾਰ ਸਵਾਲ ਹੱਲ ਕਰੋ${formula ? `: ${formula}` : "."}`,
    "SAP-CP-008": `ਦਿੱਤੇ ਪਦਾਂ ਨੂੰ ਢੁੱਕਵੇਂ ਤਰੀਕੇ ਨਾਲ ਰਾਊਂਡ ਕਰਕੇ ਅੰਦਾਜ਼ਾ ਲਗਾਓ${formula ? `: ${formula}` : "."}`,
    "SAP-CP-009": `ਗੁਣਨਫਲ, ਭਾਗਫਲ ਜਾਂ ਅਨੁਪਾਤ ਦਾ ਢੁੱਕਵਾਂ ਅੰਦਾਜ਼ਾ ਲਗਾਓ${formula ? `: ${formula}` : "."}`,
    "SAP-CP-010": `ਨੇੜਲੇ ਪੂਰਨ ਘਾਤ ਵਰਤ ਕੇ ਮੁੱਲ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਓ${formula ? `: ${formula}` : "."}`,
    "SAP-CP-011": `ਦਿੱਤੇ ਅੰਦਾਜ਼ੇ, ਗਲਤੀ ਜਾਂ ਹੱਦ ਦੇ ਆਧਾਰ ਤੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ${formula ? `: ${formula}` : "."}`,
    "SAP-CP-012": `ਦਿੱਤੇ ਅੰਦਾਜ਼ੀ ਸੰਬੰਧ ਤੋਂ ਅਣਜਾਣ ਮੁੱਲ ਕੱਢੋ${formula ? `: ${formula}` : "."}`,
  };
  return fallbackByCp[cp] ?? H(`प्रश्न हल कीजिए: ${title}`, `ਸਵਾਲ ਹੱਲ ਕਰੋ: ${title}`);
}

function localizeOption(english: string, generic: string, language: SapTranslationLanguage): string {
  const H = (hi: string, pa: string) => hiPa(language, hi, pa);
  const exact: Record<string, string> = language === "hi" ? {
    "Cannot be determined": "निर्धारित नहीं किया जा सकता",
    "Cannot be compared": "तुलना नहीं की जा सकती",
    "No error": "कोई त्रुटि नहीं",
    "Overestimate": "अधिक अनुमान",
    "Underestimate": "कम अनुमान",
    "Exact after rounding": "पूर्णांकन के बाद सटीक",
    "Neither I nor II": "न I, न II",
    "Both I and II": "I और II दोनों",
    "Only I": "केवल I",
    "Only II": "केवल II",
    "I alone is sufficient": "केवल कथन I पर्याप्त है",
    "II alone is sufficient": "केवल कथन II पर्याप्त है",
    "Both together are sufficient": "दोनों कथन मिलकर पर्याप्त हैं",
    "Even together are insufficient": "दोनों कथन मिलकर भी अपर्याप्त हैं",
    "No unique nearest option can be guaranteed": "किसी एक निकटतम विकल्प की गारंटी नहीं दी जा सकती",
  } : {
    "Cannot be determined": "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ",
    "Cannot be compared": "ਤੁਲਨਾ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ",
    "No error": "ਕੋਈ ਗਲਤੀ ਨਹੀਂ",
    "Overestimate": "ਵੱਧ ਅੰਦਾਜ਼ਾ",
    "Underestimate": "ਘੱਟ ਅੰਦਾਜ਼ਾ",
    "Exact after rounding": "ਰਾਊਂਡਿੰਗ ਤੋਂ ਬਾਅਦ ਸਟੀਕ",
    "Neither I nor II": "ਨਾ I, ਨਾ II",
    "Both I and II": "I ਅਤੇ II ਦੋਵੇਂ",
    "Only I": "ਕੇਵਲ I",
    "Only II": "ਕੇਵਲ II",
    "I alone is sufficient": "ਕੇਵਲ ਕਥਨ I ਕਾਫ਼ੀ ਹੈ",
    "II alone is sufficient": "ਕੇਵਲ ਕਥਨ II ਕਾਫ਼ੀ ਹੈ",
    "Both together are sufficient": "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਕਾਫ਼ੀ ਹਨ",
    "Even together are insufficient": "ਦੋਵੇਂ ਕਥਨ ਮਿਲ ਕੇ ਵੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹਨ",
    "No unique nearest option can be guaranteed": "ਕਿਸੇ ਇਕੋ ਸਭ ਤੋਂ ਨੇੜਲੇ ਵਿਕਲਪ ਦੀ ਗਾਰੰਟੀ ਨਹੀਂ ਦਿੱਤੀ ਜਾ ਸਕਦੀ",
  };
  if (exact[english]) return exact[english]!;
  if (/^Step \d+$/u.test(english)) {
    const n = english.match(/\d+/u)![0];
    return H(`चरण ${n}`, `ਕਦਮ ${n}`);
  }
  if (/^[A-E]\s*[<>=]\s*[A-E]$/u.test(english) || /^[A-E](?:\s*[<>=]\s*[A-E])+$/u.test(english)) return english;
  if (!LATIN_WORD.test(english.replace(MATH, ""))) return english;
  if (!LATIN_WORD.test(generic.replace(MATH, ""))) return generic;

  let match = /^Only Route ([AB]) is valid$/u.exec(english);
  if (match) return H(`केवल विधि ${match[1]} सही है`, `ਕੇਵਲ ਤਰੀਕਾ ${match[1]} ਸਹੀ ਹੈ`);
  match = /^Both routes are valid, but Route ([AB]) is more efficient$/u.exec(english);
  if (match) return H(`दोनों विधियाँ सही हैं, लेकिन विधि ${match[1]} अधिक कुशल है`, `ਦੋਵੇਂ ਤਰੀਕੇ ਸਹੀ ਹਨ, ਪਰ ਤਰੀਕਾ ${match[1]} ਵੱਧ ਕੁਸ਼ਲ ਹੈ`);
  if (english === "The two routes give different exact values") return H("दोनों विधियाँ अलग सटीक मान देती हैं", "ਦੋਵੇਂ ਤਰੀਕੇ ਵੱਖਰੇ ਸਟੀਕ ਮੁੱਲ ਦਿੰਦੇ ਹਨ");
  if (english === "Cancellation across addition is invalid") return H("जोड़ के आर-पार काटना गलत है", "ਜੋੜ ਦੇ ਆਰ-ਪਾਰ ਕਟੌਤੀ ਕਰਨਾ ਗਲਤ ਹੈ");
  if (english === "The shown cancellation is valid") return H("दिखाई गई काट-छाँट सही है", "ਦਿਖਾਈ ਗਈ ਕਟੌਤੀ ਸਹੀ ਹੈ");
  if (english === "Invert the second fraction before multiplying") return H("गुणा करने से पहले दूसरी भिन्न का व्युत्क्रम लें", "ਗੁਣਾ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਦੂਜੀ ਭਿੰਨ ਦਾ ਉਲਟ ਲਵੋ");
  if (english === "Multiply the two numerators first") return H("पहले दोनों अंशों का गुणा करें", "ਪਹਿਲਾਂ ਦੋਵੇਂ ਅੰਸ਼ਾਂ ਦਾ ਗੁਣਾ ਕਰੋ");
  if (english === "Multiply the two denominators first") return H("पहले दोनों हरों का गुणा करें", "ਪਹਿਲਾਂ ਦੋਵੇਂ ਹਰਾਂ ਦਾ ਗੁਣਾ ਕਰੋ");

  // Unknown prose options are not released as transliteration. Use the already-localized option only if it is clean.
  return generic;
}

function conceptFor(base: any, language: SapTranslationLanguage): string {
  const cp = String(base.canonicalProblemId ?? "");
  const title = String(base.traceability?.qlTitle ?? "").toLowerCase();
  const H = (hi: string, pa: string) => hiPa(language, hi, pa);

  if (title.includes("first incorrect") || title.includes("diagnose") || title.includes("wrong")) {
    return H("हर चरण का सटीक मान जाँचिए और जहाँ पहली बार मान बदलता है, वही पहला गलत चरण है।", "ਹਰ ਕਦਮ ਦਾ ਸਟੀਕ ਮੁੱਲ ਜਾਂਚੋ; ਜਿੱਥੇ ਪਹਿਲੀ ਵਾਰ ਮੁੱਲ ਬਦਲਦਾ ਹੈ, ਉਹੀ ਪਹਿਲਾ ਗਲਤ ਕਦਮ ਹੈ.");
  }
  if (title.includes("missing") || title.includes("recover") || title.includes("reverse") || title.includes("satisfying")) {
    return H("ज्ञात पदों को सही संक्रिया से हटाकर अज्ञात मान को अकेला कीजिए, फिर आवश्यकता अनुसार उलटी संक्रिया लगाइए।", "ਜਾਣੇ ਪਦਾਂ ਨੂੰ ਸਹੀ ਕਿਰਿਆ ਨਾਲ ਹਟਾ ਕੇ ਅਣਜਾਣ ਮੁੱਲ ਨੂੰ ਇਕੱਲਾ ਕਰੋ, ਫਿਰ ਲੋੜ ਅਨੁਸਾਰ ਉਲਟੀ ਕਿਰਿਆ ਲਗਾਓ.");
  }
  if (title.includes("percentage error")) return H("प्रतिशत त्रुटि = निरपेक्ष त्रुटि ÷ सटीक मान × 100।", "ਪ੍ਰਤੀਸ਼ਤ ਗਲਤੀ = ਨਿਰਪੇਖ ਗਲਤੀ ÷ ਸਟੀਕ ਮੁੱਲ × 100.");
  if (title.includes("absolute error")) return H("निरपेक्ष त्रुटि सटीक मान और अनुमानित मान के अंतर का परिमाण है।", "ਨਿਰਪੇਖ ਗਲਤੀ ਸਟੀਕ ਮੁੱਲ ਅਤੇ ਅੰਦਾਜ਼ਿਤ ਮੁੱਲ ਦੇ ਅੰਤਰ ਦਾ ਪਰਿਮਾਣ ਹੈ.");
  if (title.includes("nearest") || title.includes("closest")) return H("अनुमानित मान निकालकर प्रत्येक विकल्प से उसकी दूरी तुलना कीजिए; सबसे कम दूरी वाला विकल्प चुनिए।", "ਅੰਦਾਜ਼ਿਤ ਮੁੱਲ ਕੱਢ ਕੇ ਹਰ ਵਿਕਲਪ ਨਾਲ ਉਸ ਦੀ ਦੂਰੀ ਦੀ ਤੁਲਨਾ ਕਰੋ; ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ.");
  if (title.includes("interval") || title.includes("bound") || title.includes("tolerance")) return H("दिए गए अंतराल या सहन-सीमा को ठीक-ठीक लिखकर उसके भीतर संभव मानों की जाँच कीजिए।", "ਦਿੱਤੇ ਅੰਤਰਾਲ ਜਾਂ ਸਹਿਣ-ਹੱਦ ਨੂੰ ਸਟੀਕ ਤੌਰ ਤੇ ਲਿਖ ਕੇ ਉਸ ਦੇ ਅੰਦਰ ਸੰਭਵ ਮੁੱਲ ਜਾਂਚੋ.");
  if (title.includes("round") || cp === "SAP-CP-007") return H("दिए गए स्थान तक पूर्णांकन करते समय उसके ठीक दाएँ वाले अंक से ऊपर या नीचे जाने का निर्णय होता है।", "ਦਿੱਤੇ ਸਥਾਨ ਤੱਕ ਰਾਊਂਡ ਕਰਦੇ ਸਮੇਂ ਉਸ ਦੇ ਠੀਕ ਸੱਜੇ ਅੰਕ ਤੋਂ ਉੱਪਰ ਜਾਂ ਹੇਠਾਂ ਜਾਣ ਦਾ ਫ਼ੈਸਲਾ ਹੁੰਦਾ ਹੈ.");
  if (title.includes("telescop")) return H("पदों को ऐसे रूप में लिखिए कि बीच के समान पद कट जाएँ और केवल सिरों के पद बचें।", "ਪਦਾਂ ਨੂੰ ਅਜਿਹੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ ਕਿ ਵਿਚਕਾਰਲੇ ਇੱਕੋ ਪਦ ਕੱਟ ਜਾਣ ਅਤੇ ਸਿਰਫ਼ ਅੰਤਲੇ ਪਦ ਬਚਣ.");
  if (title.includes("factorial")) return H("फैक्टोरियल को केवल आवश्यक पदों तक फैलाकर साझा गुणनखंड काटिए।", "ਫੈਕਟੋਰੀਅਲ ਨੂੰ ਸਿਰਫ਼ ਲੋੜੀਂਦੇ ਪਦਾਂ ਤੱਕ ਖੋਲ੍ਹ ਕੇ ਸਾਂਝੇ ਗੁਣਨਖੰਡ ਕੱਟੋ.");
  if (cp === "SAP-CP-001") return H("कोष्ठक और घात के बाद गुणा/भाग कीजिए; फिर जोड़/घटाव को बाएँ से दाएँ पूरा कीजिए।", "ਬਰੈਕਟ ਅਤੇ ਘਾਤ ਤੋਂ ਬਾਅਦ ਗੁਣਾ/ਭਾਗ ਕਰੋ; ਫਿਰ ਜੋੜ/ਘਟਾਓ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਕਰੋ.");
  if (cp === "SAP-CP-002") return H("भिन्नों में आवश्यक हो तो समान हर बनाइए; भाग को व्युत्क्रम से गुणा में बदलिए और अंत में भिन्न सरल कीजिए।", "ਭਿੰਨਾਂ ਵਿੱਚ ਲੋੜ ਹੋਵੇ ਤਾਂ ਇੱਕੋ ਹਰ ਬਣਾਓ; ਭਾਗ ਨੂੰ ਉਲਟ ਭਿੰਨ ਨਾਲ ਗੁਣਾ ਵਿੱਚ ਬਦਲੋ ਅਤੇ ਅੰਤ ਵਿੱਚ ਭਿੰਨ ਸਰਲ ਕਰੋ.");
  if (cp === "SAP-CP-003") return H("दशमलव, भिन्न और प्रतिशत को सुविधाजनक सटीक रूप में बदलकर गणना कीजिए।", "ਦਸ਼ਮਲਵ, ਭਿੰਨ ਅਤੇ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਸੁਵਿਧਾਜਨਕ ਸਟੀਕ ਰੂਪ ਵਿੱਚ ਬਦਲ ਕੇ ਗਣਨਾ ਕਰੋ.");
  if (cp === "SAP-CP-004") return H("घात, मूल या फैक्टोरियल का मान पहले निकालिए; फिर शेष अंकगणित पूरा कीजिए।", "ਘਾਤ, ਮੂਲ ਜਾਂ ਫੈਕਟੋਰੀਅਲ ਦਾ ਮੁੱਲ ਪਹਿਲਾਂ ਕੱਢੋ; ਫਿਰ ਬਾਕੀ ਅੰਕਗਣਿਤ ਕਰੋ.");
  if (cp === "SAP-CP-005") return H("बड़ी गणना से पहले साझा गुणनखंड, परस्पर व्युत्क्रम या टेलिस्कोपिंग संरचना खोजकर वैध काट-छाँट कीजिए।", "ਵੱਡੀ ਗਣਨਾ ਤੋਂ ਪਹਿਲਾਂ ਸਾਂਝਾ ਗੁਣਨਖੰਡ, ਉਲਟ ਭਿੰਨ ਜਾਂ ਟੈਲੀਸਕੋਪਿੰਗ ਬਣਤਰ ਲੱਭ ਕੇ ਵੈਧ ਕਟੌਤੀ ਕਰੋ.");
  if (cp === "SAP-CP-006") return H("समानता के दोनों पक्षों पर एक ही नियम लागू रखते हुए अज्ञात मान को अलग कीजिए।", "ਸਮਾਨਤਾ ਦੇ ਦੋਵੇਂ ਪਾਸਿਆਂ ਉੱਤੇ ਇੱਕੋ ਨਿਯਮ ਲਾਗੂ ਰੱਖਦੇ ਹੋਏ ਅਣਜਾਣ ਮੁੱਲ ਨੂੰ ਅਲੱਗ ਕਰੋ.");
  if (cp === "SAP-CP-008") return H("दिए गए स्थान तक पदों को पूर्णांकित करके वही संक्रिया कीजिए और प्राप्त अनुमान चुनिए।", "ਦਿੱਤੇ ਸਥਾਨ ਤੱਕ ਪਦਾਂ ਨੂੰ ਰਾਊਂਡ ਕਰਕੇ ਉਹੀ ਕਿਰਿਆ ਕਰੋ ਅਤੇ ਮਿਲਿਆ ਅੰਦਾਜ਼ਾ ਚੁਣੋ.");
  if (cp === "SAP-CP-009") return H("गुणनफल या भागफल में सुविधाजनक निकट मान चुनिए और अनुपात/प्रतिशत का अनुमान लगाइए।", "ਗੁਣਨਫਲ ਜਾਂ ਭਾਗਫਲ ਲਈ ਸੁਵਿਧਾਜਨਕ ਨੇੜਲੇ ਮੁੱਲ ਚੁਣੋ ਅਤੇ ਅਨੁਪਾਤ/ਪ੍ਰਤੀਸ਼ਤ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਓ.");
  if (cp === "SAP-CP-010") return H("मूल या घात को पास के पूर्ण वर्ग/घन/घात से बाँधकर उचित अनुमान निकालिए।", "ਮੂਲ ਜਾਂ ਘਾਤ ਨੂੰ ਨੇੜਲੇ ਪੂਰਨ ਵਰਗ/ਘਣ/ਘਾਤ ਨਾਲ ਬੰਨ੍ਹ ਕੇ ਢੁੱਕਵਾਂ ਅੰਦਾਜ਼ਾ ਕੱਢੋ.");
  if (cp === "SAP-CP-011") return H("अनुमान, त्रुटि और विकल्पों की दूरी/सीमा की तुलना करके निश्चित निष्कर्ष चुनिए।", "ਅੰਦਾਜ਼ੇ, ਗਲਤੀ ਅਤੇ ਵਿਕਲਪਾਂ ਦੀ ਦੂਰੀ/ਹੱਦ ਦੀ ਤੁਲਨਾ ਕਰਕੇ ਪੱਕਾ ਨਤੀਜਾ ਚੁਣੋ.");
  return H("दिए गए निकट मानों से गणना सरल कीजिए और अज्ञात मान को अकेला कीजिए।", "ਦਿੱਤੇ ਨੇੜਲੇ ਮੁੱਲਾਂ ਨਾਲ ਗਣਨਾ ਸਰਲ ਕਰੋ ਅਤੇ ਅਣਜਾਣ ਮੁੱਲ ਨੂੰ ਇਕੱਲਾ ਕਰੋ.");
}

function translateEvidenceLine(line: string, language: SapTranslationLanguage): string | undefined {
  const H = (hi: string, pa: string) => hiPa(language, hi, pa);
  const source = String(line ?? "").trim();
  if (!source || /^Therefore,/u.test(source) || /^Hence,/u.test(source)) return undefined;

  let match = /^Step (\d+): Multiply (.+) by (.+) to get (.+)\.$/u.exec(source);
  if (match) return H(`चरण ${match[1]}: ${match[2]} को ${match[3]} से गुणा करने पर ${match[4]} मिलता है।`, `ਕਦਮ ${match[1]}: ${match[2]} ਨੂੰ ${match[3]} ਨਾਲ ਗੁਣਾ ਕਰਨ ਤੇ ${match[4]} ਮਿਲਦਾ ਹੈ.`);
  match = /^Step (\d+): Divide (.+) by (.+) to get (.+)\.$/u.exec(source);
  if (match) return H(`चरण ${match[1]}: ${match[2]} को ${match[3]} से भाग देने पर ${match[4]} मिलता है।`, `ਕਦਮ ${match[1]}: ${match[2]} ਨੂੰ ${match[3]} ਨਾਲ ਭਾਗ ਕਰਨ ਤੇ ${match[4]} ਮਿਲਦਾ ਹੈ.`);
  match = /^Step (\d+): Add (.+) and (.+) to get (.+)\.$/u.exec(source);
  if (match) return H(`चरण ${match[1]}: ${match[2]} और ${match[3]} जोड़ने पर ${match[4]} मिलता है।`, `ਕਦਮ ${match[1]}: ${match[2]} ਅਤੇ ${match[3]} ਜੋੜਨ ਤੇ ${match[4]} ਮਿਲਦਾ ਹੈ.`);
  match = /^Step (\d+): Subtract (.+) from (.+) to get (.+)\.$/u.exec(source);
  if (match) return H(`चरण ${match[1]}: ${match[3]} में से ${match[2]} घटाने पर ${match[4]} मिलता है।`, `ਕਦਮ ${match[1]}: ${match[3]} ਵਿਚੋਂ ${match[2]} ਘਟਾਉਣ ਤੇ ${match[4]} ਮਿਲਦਾ ਹੈ.`);

  match = /^The target place is (.+); the deciding (.+) digit is (.+)\.$/u.exec(source);
  if (match) return H(`लक्षित स्थान ${match[1]} है और निर्णय करने वाला ${match[2]} अंक ${match[3]} है।`, `ਲਕਸ਼ਿਤ ਸਥਾਨ ${match[1]} ਹੈ ਅਤੇ ਫ਼ੈਸਲਾ ਕਰਨ ਵਾਲਾ ${match[2]} ਅੰਕ ${match[3]} ਹੈ.`);
  match = /^The midpoint of (.+) and (.+) is (.+)\.$/u.exec(source);
  if (match) return H(`${match[1]} और ${match[2]} का मध्यबिंदु ${match[3]} है।`, `${match[1]} ਅਤੇ ${match[2]} ਦਾ ਮੱਧ-ਬਿੰਦੂ ${match[3]} ਹੈ.`);
  match = /^Compare (.+) with consecutive perfect squares around it\.$/u.exec(source);
  if (match) return H(`${match[1]} की तुलना उसके आसपास के क्रमागत पूर्ण वर्गों से कीजिए।`, `${match[1]} ਦੀ ਤੁਲਨਾ ਉਸ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਦੇ ਲਗਾਤਾਰ ਪੂਰਨ ਵਰਗਾਂ ਨਾਲ ਕਰੋ.`);
  match = /^Compare (.+) with consecutive perfect cubes around it\.$/u.exec(source);
  if (match) return H(`${match[1]} की तुलना उसके आसपास के क्रमागत पूर्ण घनों से कीजिए।`, `${match[1]} ਦੀ ਤੁਲਨਾ ਉਸ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਦੇ ਲਗਾਤਾਰ ਪੂਰਨ ਘਣਾਂ ਨਾਲ ਕਰੋ.`);

  if (/^Check:/u.test(source)) {
    const check = source.replace(/^Check:\s*/u, "");
    if (!LATIN_WORD.test(check.replace(MATH, "")) || /[=<>≈×÷√%]/u.test(check)) {
      return H(`जाँच: ${check}`, `ਜਾਂਚ: ${check}`);
    }
    return undefined;
  }

  // Keep equation-rich evidence. Translate only tiny connectors; never transliterate unknown prose.
  if (/[=<>≈×÷√%]/u.test(source)) {
    let value = source
      .replace(/\band\b/giu, H("और", "ਅਤੇ"))
      .replace(/\bso\b/giu, H("इसलिए", "ਇਸ ਲਈ"))
      .replace(/\bhence\b/giu, H("अतः", "ਇਸ ਲਈ"))
      .replace(/\babout\b/giu, H("लगभग", "ਲਗਭਗ"))
      .replace(/\bapproximately\b/giu, H("लगभग", "ਲਗਭਗ"));
    const prose = value.replace(MATH, "");
    const remainingWords = prose.match(/[A-Za-z]{3,}/gu) ?? [];
    if (remainingWords.length <= 2) return tidy(value);
  }
  return undefined;
}

function conclusion(answer: string, language: SapTranslationLanguage): string {
  if (/^Step \d+$/u.test(answer)) {
    return hiPa(language, `अतः पहला गलत चरण ${answer.replace("Step", "चरण")} है।`, `ਇਸ ਲਈ ਪਹਿਲਾ ਗਲਤ ਕਦਮ ${answer.replace("Step", "ਕਦਮ")} ਹੈ.`);
  }
  return hiPa(language, `अतः सही उत्तर ${answer} है।`, `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ.`);
}

function authoredExplanation(base: any, localizedOptions: readonly string[], language: SapTranslationLanguage) {
  const evidence = (base.explanation?.lines ?? [])
    .map((line: unknown) => translateEvidenceLine(String(line ?? ""), language))
    .filter((line: string | undefined): line is string => Boolean(line));
  const answer = localizedOptions[Number(base.correctIndex)] ?? String(base.answer ?? "");
  const lines = [conceptFor(base, language), ...evidence.slice(0, 4), conclusion(answer, language)];
  return Object.freeze({ lines: Object.freeze(lines) });
}

function hasBadReleaseProse(text: string, language: SapTranslationLanguage) {
  const prose = text.replace(MATH, "");
  if (LATIN_WORD.test(prose)) return true;
  if (language === "hi" && /[\u0A00-\u0A7F]/u.test(prose)) return true;
  if (language === "pa" && /[\u0900-\u097F]/u.test(prose.replace(/[।॥]/gu, ""))) return true;
  return false;
}

export function applySapAuthoredPresentationV1(base: any, generic: any, language: SapTranslationLanguage) {
  const options = Object.freeze(base.options.map((option: unknown, index: number) =>
    localizeOption(String(option ?? ""), String(generic.options?.[index] ?? option ?? ""), language),
  ));
  const correctIndex = Number(base.correctIndex);
  const answer = options[correctIndex];
  const stem = naturalStem(base, generic, language);
  const explanation = authoredExplanation(base, options, language);
  const learnerText = [stem, ...options, ...explanation.lines].join("\n");
  const errors: string[] = [];
  if (hasBadReleaseProse(learnerText, language)) errors.push("Authored presentation still contains non-release prose/script leakage.");
  if (options.length !== base.options.length) errors.push("Authored localization changed option count.");
  if (options[correctIndex] !== answer) errors.push("Authored localization lost answer binding.");

  return Object.freeze({
    ...generic,
    stem,
    options,
    correctIndex,
    answer,
    explanation,
    reviewStatus: "LOCALIZATION_REVIEW_CANDIDATE" as const,
    traceability: Object.freeze({
      ...(generic.traceability ?? {}),
      localizationAuthorship: "SAP-CP-AUTHORED-PRESENTATION-V1",
      localizationFamily: String(base.canonicalProblemId ?? ""),
      canonicalEnglishStem: base.stem,
      canonicalEnglishOptions: Object.freeze([...base.options]),
      canonicalEnglishAnswer: base.answer,
    }),
    localizationValidation: Object.freeze({
      ...(generic.localizationValidation ?? {}),
      ok: errors.length === 0,
      errors: Object.freeze(errors),
      authoredPresentation: true,
      naturalnessOk: errors.length === 0,
    }),
    validation: Object.freeze({
      ok: Boolean(base.validation?.ok) && errors.length === 0,
      errors: Object.freeze([...(base.validation?.errors ?? []), ...errors]),
    }),
  });
}
