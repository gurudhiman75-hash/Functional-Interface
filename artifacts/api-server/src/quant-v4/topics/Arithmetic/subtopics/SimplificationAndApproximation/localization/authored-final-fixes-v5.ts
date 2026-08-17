import type { SapTranslationLanguage } from "./types";

function L(language: SapTranslationLanguage, hi: string, pa: string) {
  return language === "hi" ? hi : pa;
}

function tidy(value: string) {
  return value
    .replace(/\s{2,}/gu, " ")
    .replace(/\s+([,.;:?!।])/gu, "$1")
    .replace(/\?\s+/gu, "? ")
    .trim();
}

function localizeOf(value: string, language: SapTranslationLanguage) {
  return value
    .replace(/\\text\{of\}/gu, language === "hi" ? "\\text{का}" : "\\text{ਦਾ}")
    .replace(/\bof\b/gu, language === "hi" ? "का" : "ਦਾ");
}

function directExpression(english: string) {
  return english
    .replace(/^What is the exact value of\s*/u, "")
    .replace(/^Find the exact value of\s*/u, "")
    .replace(/^Find the value of\s*/u, "")
    .replace(/^Evaluate\s*:\s*/u, "")
    .replace(/^Evaluate\s+/u, "")
    .replace(/^Simplify\s*:\s*/u, "")
    .replace(/^Simplify\s+/u, "")
    .replace(/[?.]$/u, "")
    .trim();
}

function lowestTermsExpression(english: string) {
  return english
    .replace(/^What is the exact value of\s*/u, "")
    .replace(/^Find the exact value of\s*/u, "")
    .replace(/^Evaluate\s+/u, "")
    .replace(/^Simplify the following expression and give the answer in lowest terms:\s*/u, "")
    .replace(/^Find the simplified value of the following fraction expression:\s*/u, "")
    .replace(/\?\s*Give the answer in lowest terms\.?$/u, "")
    .replace(/\s+using the correct fraction operations\.?$/u, "")
    .replace(/[?.]$/u, "")
    .trim();
}

function finalStem(base: any, current: string, language: SapTranslationLanguage) {
  const ql = String(base.questionLanguageId ?? "");
  const english = String(base.stem ?? "").trim();

  if (["SAP-QL-001", "SAP-QL-002", "SAP-QL-003", "SAP-QL-004", "SAP-QL-005", "SAP-QL-006"].includes(ql)) {
    return L(language, `मान ज्ञात कीजिए: ${directExpression(english)}`, `ਮੁੱਲ ਕੱਢੋ: ${directExpression(english)}`);
  }

  if (ql === "SAP-QL-013") {
    const expression = english
      .replace(/^Choose the expression that preserves the value of\s*/u, "")
      .replace(/^Which expression preserves the value of\s*/u, "")
      .replace(/^Which of the following is equivalent to\s*/u, "")
      .replace(/^Which is the correct grouping of\s*/u, "")
      .replace(/[?.]$/u, "")
      .trim();
    return L(language,
      `${expression} के बराबर सही समूहबद्ध व्यंजक चुनिए।`,
      `${expression} ਦੇ ਬਰਾਬਰ ਸਹੀ ਸਮੂਹਬੱਧ ਵਿਆੰਜਕ ਚੁਣੋ।`,
    );
  }

  if (ql === "SAP-QL-019") {
    const expression = lowestTermsExpression(english);
    return L(language,
      `सटीक मान ज्ञात कीजिए और उत्तर को सरलतम भिन्न में लिखिए: ${expression}`,
      `ਸਟੀਕ ਮੁੱਲ ਕੱਢੋ ਅਤੇ ਉੱਤਰ ਸਭ ਤੋਂ ਸਰਲ ਭਿੰਨ ਵਿੱਚ ਲਿਖੋ: ${expression}`,
    );
  }

  if (ql === "SAP-QL-021") {
    const expression = english
      .replace(/^Evaluate\s+/u, "")
      .replace(/\s+using the correct fraction operations\.?$/u, "")
      .trim();
    return L(language,
      `सही भिन्न संक्रियाओं का उपयोग करके मान ज्ञात कीजिए: ${expression}`,
      `ਸਹੀ ਭਿੰਨ ਕਿਰਿਆਵਾਂ ਵਰਤ ਕੇ ਮੁੱਲ ਕੱਢੋ: ${expression}`,
    );
  }

  if (ql === "SAP-QL-022") {
    const expression = localizeOf(
      english
        .replace(/^Evaluate\s+/u, "")
        .replace(/^Simplify the following expression and give the answer in lowest terms:\s*/u, "")
        .replace(/\s+using the correct fraction operations\.?$/u, "")
        .replace(/[?.]$/u, "")
        .trim(),
      language,
    );
    return L(language,
      `सही भिन्न संक्रियाओं का उपयोग करके मान ज्ञात कीजिए: ${expression}`,
      `ਸਹੀ ਭਿੰਨ ਕਿਰਿਆਵਾਂ ਵਰਤ ਕੇ ਮੁੱਲ ਕੱਢੋ: ${expression}`,
    );
  }

  if (["SAP-QL-025", "SAP-QL-026", "SAP-QL-027", "SAP-QL-028"].includes(ql)) {
    const expression = localizeOf(lowestTermsExpression(english), language);
    return L(language,
      `सटीक मान ज्ञात कीजिए और उत्तर को सरलतम भिन्न में लिखिए: ${expression}`,
      `ਸਟੀਕ ਮੁੱਲ ਕੱਢੋ ਅਤੇ ਉੱਤਰ ਸਭ ਤੋਂ ਸਰਲ ਭਿੰਨ ਵਿੱਚ ਲਿਖੋ: ${expression}`,
    );
  }

  if (ql === "SAP-QL-030") {
    const equation = english
      .replace(/^Which value makes the following fraction equality true\?\s*/u, "")
      .replace(/^Complete the exact fraction equality:\s*/u, "")
      .replace(/^Find the value of the blank:\s*/u, "")
      .replace(/[.]$/u, "")
      .trim();
    return L(language,
      `रिक्त स्थान का मान ज्ञात कीजिए: ${equation}`,
      `ਖਾਲੀ ਥਾਂ ਦਾ ਮੁੱਲ ਕੱਢੋ: ${equation}`,
    );
  }

  if (ql === "SAP-QL-050") {
    const match = /^A = (.+) of ([A-Za-z]) and B = (.+) of ([A-Za-z]), where ([A-Za-z]) and ([A-Za-z]) are positive numbers\. Which relation between A and B must be true\?$/su.exec(english);
    if (match) {
      return L(language,
        `A = ${match[1]} का ${match[2]} और B = ${match[3]} का ${match[4]} है, जहाँ ${match[5]} और ${match[6]} धनात्मक संख्याएँ हैं। A और B के बीच कौन-सा संबंध निश्चित है?`,
        `A = ${match[1]} ਦਾ ${match[2]} ਅਤੇ B = ${match[3]} ਦਾ ${match[4]} ਹੈ, ਜਿੱਥੇ ${match[5]} ਅਤੇ ${match[6]} ਧਨਾਤਮਕ ਸੰਖਿਆਵਾਂ ਹਨ। A ਅਤੇ B ਵਿਚਕਾਰ ਕਿਹੜਾ ਸੰਬੰਧ ਨਿਸ਼ਚਿਤ ਹੈ?`,
      );
    }
  }

  if (ql === "SAP-QL-064") {
    const match = /^Evaluate\s+(.+)!\.?$/u.exec(english);
    const expression = match ? `${match[1]}!` : directExpression(english).replace(/\s+factorial$/iu, "!");
    return L(language, `मान ज्ञात कीजिए: ${expression}`, `ਮੁੱਲ ਕੱਢੋ: ${expression}`);
  }

  if (ql === "SAP-QL-098") {
    const match = /^Compare A = (.+) and B = (.+)\.$/su.exec(english);
    if (match) {
      return L(language,
        `A = ${localizeOf(match[1], language)} और B = ${localizeOf(match[2], language)} की तुलना कीजिए।`,
        `A = ${localizeOf(match[1], language)} ਅਤੇ B = ${localizeOf(match[2], language)} ਦੀ ਤੁਲਨਾ ਕਰੋ।`,
      );
    }
  }

  if (ql === "SAP-QL-112") {
    const match = /^For integer x from (\d+) to (\d+), E = (.+)\. Can x be determined uniquely\? Statement I: (.+)\. Statement II: (.+)\.$/su.exec(english);
    if (match) {
      const expr = localizeOf(match[3], language);
      return L(language,
        `पूर्णांक x, ${match[1]} से ${match[2]} तक है और E = ${expr}। क्या x का एकमात्र मान निश्चित किया जा सकता है? कथन I: ${match[4]}। कथन II: ${match[5]}।`,
        `ਪੂਰਨ ਅੰਕ x, ${match[1]} ਤੋਂ ${match[2]} ਤੱਕ ਹੈ ਅਤੇ E = ${expr}। ਕੀ x ਦਾ ਇਕੋ ਮੁੱਲ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ? ਕਥਨ I: ${match[4]}। ਕਥਨ II: ${match[5]}।`,
      );
    }
  }

  if (ql === "SAP-QL-175" || ql === "SAP-QL-176") {
    const match = /^Estimate\s+(.+)\s+by taking each square root to the nearest integer\.?$/su.exec(english);
    if (match) {
      return L(language,
        `प्रत्येक वर्गमूल को निकटतम पूर्णांक लेकर अनुमान लगाइए: ${match[1]}`,
        `ਹਰ ਵਰਗ ਮੂਲ ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲਾ ਪੂਰਨ ਅੰਕ ਲੈ ਕੇ ਅੰਦਾਜ਼ਾ ਲਗਾਓ: ${match[1]}`,
      );
    }
  }

  return current;
}

function localizeActionTail(value: string, language: SapTranslationLanguage) {
  let result = value;
  result = result.replace(/^division by\s+(.+)$/u, (_m, x) => L(language, `${x} से भाग`, `${x} ਨਾਲ ਭਾਗ`));
  result = result.replace(/^multiplication by\s+(.+)$/u, (_m, x) => L(language, `${x} से गुणा`, `${x} ਨਾਲ ਗੁਣਾ`));
  result = result.replace(/^addition of\s+(.+)$/u, (_m, x) => L(language, `${x} का जोड़`, `${x} ਦਾ ਜੋੜ`));
  result = result.replace(/^subtraction of\s+(.+)$/u, (_m, x) => L(language, `${x} का घटाव`, `${x} ਦਾ ਘਟਾਓ`));
  return result;
}

function ql014Option(english: string, current: string, language: SapTranslationLanguage) {
  let match = /^Divide (.+) by (.+) before applying the (square|power|factorial)$/u.exec(english);
  if (match) {
    const op = match[3] === "factorial" ? L(language, "फैक्टोरियल", "ਫੈਕਟੋਰੀਅਲ") : match[3] === "square" ? L(language, "वर्ग", "ਵਰਗ") : L(language, "घात", "ਘਾਤ");
    return L(language, `${op} लगाने से पहले ${match[1]} को ${match[2]} से भाग दें`, `${op} ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ${match[1]} ਨੂੰ ${match[2]} ਨਾਲ ਭਾਗ ਕਰੋ`);
  }
  match = /^Add (.+) before applying the (square|power|factorial)$/u.exec(english);
  if (match) {
    const op = match[2] === "factorial" ? L(language, "फैक्टोरियल", "ਫੈਕਟੋਰੀਅਲ") : match[2] === "square" ? L(language, "वर्ग", "ਵਰਗ") : L(language, "घात", "ਘਾਤ");
    return L(language, `${op} लगाने से पहले ${match[1]} जोड़ें`, `${op} ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ${match[1]} ਜੋੜੋ`);
  }
  match = /^Evaluate the (square|power|factorial) and omit (.+)$/u.exec(english);
  if (match) {
    const op = match[1] === "factorial" ? L(language, "फैक्टोरियल", "ਫੈਕਟੋਰੀਅਲ") : match[1] === "square" ? L(language, "वर्ग", "ਵਰਗ") : L(language, "घात", "ਘਾਤ");
    const tail = localizeActionTail(match[2], language);
    return L(language, `${op} निकालें, लेकिन ${tail} न करें`, `${op} ਕੱਢੋ, ਪਰ ${tail} ਨਾ ਕਰੋ`);
  }
  match = /^Calculate (.+) before (division|multiplication|addition|subtraction)$/u.exec(english);
  if (match) {
    const op = match[2] === "division" ? L(language, "भाग", "ਭਾਗ") : match[2] === "multiplication" ? L(language, "गुणा", "ਗੁਣਾ") : match[2] === "addition" ? L(language, "जोड़", "ਜੋੜ") : L(language, "घटाव", "ਘਟਾਓ");
    return L(language, `${op} से पहले ${match[1]} की गणना करें`, `${op} ਤੋਂ ਪਹਿਲਾਂ ${match[1]} ਦੀ ਗਣਨਾ ਕਰੋ`);
  }
  match = /^Increase the factorial input to (.+) before applying factorial$/u.exec(english);
  if (match) return L(language, `फैक्टोरियल लगाने से पहले संख्या को ${match[1]} कर दें`, `ਫੈਕਟੋਰੀਅਲ ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਸੰਖਿਆ ਨੂੰ ${match[1]} ਕਰ ਦਿਓ`);
  match = /^Treat (.+) as (.+) and remove the divisor$/u.exec(english);
  if (match) return L(language, `${match[1]} को ${match[2]} मानकर भाजक हटा दें`, `${match[1]} ਨੂੰ ${match[2]} ਮੰਨ ਕੇ ਭਾਜਕ ਹਟਾ ਦਿਓ`);
  return current;
}

function finalOptions(base: any, current: any, language: SapTranslationLanguage) {
  const ql = String(base.questionLanguageId ?? "");
  if (ql !== "SAP-QL-014") return Object.freeze([...(current.options ?? [])].map(String));
  return Object.freeze(base.options.map((option: unknown, index: number) =>
    ql014Option(String(option ?? ""), String(current.options?.[index] ?? option ?? ""), language),
  ));
}

function polishLine(line: string, language: SapTranslationLanguage) {
  let value = line;
  value = value.replace(/(\d+(?:\.\d+)?%)\s+as\s+([^.,;।]+)/giu, (_m, a, b) => L(language, `${a} को ${b} के रूप में लिखिए`, `${a} ਨੂੰ ${b} ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ`));
  value = value.replace(/,\s*so\s+/giu, L(language, ", इसलिए ", ", ਇਸ ਲਈ "));
  value = value.replace(/\bso\s+/giu, L(language, "इसलिए ", "ਇਸ ਲਈ "));
  value = value.replace(/\bto\b/giu, L(language, "से", "ਤੋਂ"));
  value = value.replace(/\band\b/giu, L(language, "और", "ਅਤੇ"));
  value = value.replace(/\bof\b/giu, L(language, "का", "ਦਾ"));
  value = value.replace(/\s+है है([।.])/gu, " है$1");
  value = value.replace(/\s+हैं है([।.])/gu, " हैं$1");
  value = value.replace(/\s+ਹੈ ਹੈ([।.])/gu, " ਹੈ$1");
  value = value.replace(/\s+ਹਨ ਹੈ([।.])/gu, " ਹਨ$1");
  return tidy(value);
}

function finalExplanation(base: any, current: any, answer: string, language: SapTranslationLanguage) {
  const ql = String(base.questionLanguageId ?? "");
  const lines = [...(current.explanation?.lines ?? [])].map((line: unknown) => polishLine(String(line ?? ""), language));
  if (ql === "SAP-QL-014" && lines.length) {
    lines[lines.length - 1] = L(language, `अतः सही पहला कदम है: ${answer}।`, `ਇਸ ਲਈ ਸਹੀ ਪਹਿਲਾ ਕਦਮ ਹੈ: ${answer}।`);
  }
  if (ql === "SAP-QL-112" && lines.length) {
    lines[lines.length - 1] = L(language, `अतः सही विकल्प है: ${answer}।`, `ਇਸ ਲਈ ਸਹੀ ਵਿਕਲਪ ਹੈ: ${answer}।`);
  }
  return Object.freeze({ lines: Object.freeze(lines) });
}

export function applySapAuthoredFinalFixesV5(base: any, current: any, language: SapTranslationLanguage) {
  const stem = tidy(finalStem(base, String(current.stem ?? ""), language));
  const options = finalOptions(base, current, language);
  const correctIndex = Number(base.correctIndex);
  const answer = options[correctIndex] ?? String(current.answer ?? "");
  const explanation = finalExplanation(base, current, answer, language);
  return Object.freeze({
    ...current,
    stem,
    options,
    correctIndex,
    answer,
    explanation,
    traceability: Object.freeze({
      ...(current.traceability ?? {}),
      localizedFinalEditorialFixes: "SAP-AUTHORED-FINAL-FIXES-V5",
    }),
  });
}
