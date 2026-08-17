import type { SapTranslationLanguage } from "./types";

function L(language: SapTranslationLanguage, hi: string, pa: string) {
  return language === "hi" ? hi : pa;
}

function stripTerminal(value: string) {
  return value.trim().replace(/[?.]$/u, "").trim();
}

function ql013Stem(english: string, language: SapTranslationLanguage) {
  const expression = english
    .replace(/^Which option shows the correct grouping of\s*/u, "")
    .replace(/^Choose the expression that preserves the value of\s*/u, "")
    .replace(/^Which expression preserves the value of\s*/u, "")
    .replace(/^Which of the following is equivalent to\s*/u, "")
    .replace(/^Which is the correct grouping of\s*/u, "");
  const clean = stripTerminal(expression);
  return L(language,
    `${clean} के बराबर सही समूहबद्ध व्यंजक चुनिए।`,
    `${clean} ਦੇ ਬਰਾਬਰ ਸਹੀ ਸਮੂਹਬੱਧ ਵਿਆੰਜਕ ਚੁਣੋ।`,
  );
}

function ql014Stem(english: string, language: SapTranslationLanguage) {
  const expression = english
    .replace(/^What should be done first to simplify\s*/u, "")
    .replace(/^Which of the following is a valid first step in simplifying\s*/u, "")
    .replace(/^Which option correctly begins the solution of\s*/u, "")
    .replace(/^Which option gives the correct first step for\s*/u, "");
  const clean = stripTerminal(expression);
  return L(language,
    `${clean} को हल करने का सही पहला कदम कौन-सा है?`,
    `${clean} ਨੂੰ ਹੱਲ ਕਰਨ ਦਾ ਸਹੀ ਪਹਿਲਾ ਕਦਮ ਕਿਹੜਾ ਹੈ?`,
  );
}

function operationName(value: string, language: SapTranslationLanguage) {
  if (value === "square") return L(language, "वर्ग", "ਵਰਗ");
  if (value === "power") return L(language, "घात", "ਘਾਤ");
  if (value === "factorial") return L(language, "फैक्टोरियल", "ਫੈਕਟੋਰੀਅਲ");
  if (value === "division") return L(language, "भाग", "ਭਾਗ");
  if (value === "multiplication") return L(language, "गुणा", "ਗੁਣਾ");
  if (value === "addition") return L(language, "जोड़", "ਜੋੜ");
  if (value === "subtraction") return L(language, "घटाव", "ਘਟਾਓ");
  return value;
}

function ql014Option(raw: string, current: string, language: SapTranslationLanguage) {
  const english = stripTerminal(raw);
  let m: RegExpExecArray | null;

  m = /^Divide (.+) by (.+) first, then apply factorial$/u.exec(english);
  if (m) return L(language,
    `पहले ${m[1]} को ${m[2]} से भाग दें, फिर फैक्टोरियल लगाएँ`,
    `ਪਹਿਲਾਂ ${m[1]} ਨੂੰ ${m[2]} ਨਾਲ ਭਾਗ ਕਰੋ, ਫਿਰ ਫੈਕਟੋਰੀਅਲ ਲਗਾਓ`,
  );

  m = /^Divide (.+) by (.+) before applying the (square|power|factorial)$/u.exec(english);
  if (m) {
    const op = operationName(m[3], language);
    return L(language,
      `${op} लगाने से पहले ${m[1]} को ${m[2]} से भाग दें`,
      `${op} ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ${m[1]} ਨੂੰ ${m[2]} ਨਾਲ ਭਾਗ ਕਰੋ`,
    );
  }

  m = /^Increase (?:the )?factorial input to (.+) before applying factorial$/u.exec(english);
  if (m) return L(language,
    `फैक्टोरियल लगाने से पहले उसकी संख्या को ${m[1]} कर दें`,
    `ਫੈਕਟੋਰੀਅਲ ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਇਸ ਦੀ ਸੰਖਿਆ ਨੂੰ ${m[1]} ਕਰ ਦਿਓ`,
  );

  m = /^Treat (.+) as (.+) and remove the divisor$/u.exec(english);
  if (m) return L(language,
    `${m[1]} को ${m[2]} मानकर भाजक हटा दें`,
    `${m[1]} ਨੂੰ ${m[2]} ਮੰਨ ਕੇ ਭਾਜਕ ਹਟਾ ਦਿਓ`,
  );

  m = /^Add (.+) first, then multiply by (.+)$/u.exec(english);
  if (m) return L(language,
    `पहले ${m[1]} जोड़ें, फिर ${m[2]} से गुणा करें`,
    `ਪਹਿਲਾਂ ${m[1]} ਜੋੜੋ, ਫਿਰ ${m[2]} ਨਾਲ ਗੁਣਾ ਕਰੋ`,
  );

  m = /^Subtract (.+) first inside the product$/u.exec(english);
  if (m) return L(language,
    `गुणनखंड के भीतर पहले ${m[1]} घटाएँ`,
    `ਗੁਣਨਖੰਡ ਦੇ ਅੰਦਰ ਪਹਿਲਾਂ ${m[1]} ਘਟਾਓ`,
  );

  m = /^Calculate (.+) before (division|multiplication|addition|subtraction)$/u.exec(english);
  if (m) {
    const op = operationName(m[2], language);
    return L(language,
      `${op} से पहले ${m[1]} की गणना करें`,
      `${op} ਤੋਂ ਪਹਿਲਾਂ ${m[1]} ਦੀ ਗਣਨਾ ਕਰੋ`,
    );
  }

  m = /^Calculate (.+): (.+)$/u.exec(english);
  if (m) return L(language,
    `${m[1]} की गणना करें: ${m[2]}`,
    `${m[1]} ਦੀ ਗਣਨਾ ਕਰੋ: ${m[2]}`,
  );

  m = /^Drop the final (.+) term after multiplying$/u.exec(english);
  if (m) return L(language,
    `गुणा करने के बाद अंतिम ${m[1]} पद हटा दें`,
    `ਗੁਣਾ ਕਰਨ ਤੋਂ ਬਾਅਦ ਅੰਤਿਮ ${m[1]} ਪਦ ਹਟਾ ਦਿਓ`,
  );

  m = /^Evaluate the (square|power|factorial) and omit (.+)$/u.exec(english);
  if (m) {
    const op = operationName(m[1], language);
    const tail = m[2]
      .replace(/^division by (.+)$/u, (_x, n) => L(language, `${n} से भाग`, `${n} ਨਾਲ ਭਾਗ`))
      .replace(/^multiplication by (.+)$/u, (_x, n) => L(language, `${n} से गुणा`, `${n} ਨਾਲ ਗੁਣਾ`));
    return L(language,
      `${op} निकालें, लेकिन ${tail} न करें`,
      `${op} ਕੱਢੋ, ਪਰ ${tail} ਨਾ ਕਰੋ`,
    );
  }

  return current;
}

function ql014Explanation(current: any, answer: string, language: SapTranslationLanguage) {
  const lines = [...(current.explanation?.lines ?? [])].map(String);
  if (lines.length) {
    lines[lines.length - 1] = L(language,
      `अतः सही पहला कदम है: ${answer}।`,
      `ਇਸ ਲਈ ਸਹੀ ਪਹਿਲਾ ਕਦਮ ਹੈ: ${answer}।`,
    );
  }
  return Object.freeze({ lines: Object.freeze(lines) });
}

export function applySapAuthoredLastVariantsV7(base: any, current: any, language: SapTranslationLanguage) {
  const ql = String(base.questionLanguageId ?? "");
  if (ql === "SAP-QL-013") {
    return Object.freeze({
      ...current,
      stem: ql013Stem(String(base.stem ?? ""), language),
      traceability: Object.freeze({
        ...(current.traceability ?? {}),
        localizedLastVariantFix: "SAP-QL013-AUTHORED-V7",
      }),
    });
  }
  if (ql !== "SAP-QL-014") return current;

  const options = Object.freeze(base.options.map((option: unknown, index: number) =>
    ql014Option(String(option ?? ""), String(current.options?.[index] ?? option ?? ""), language),
  ));
  const correctIndex = Number(base.correctIndex);
  const answer = options[correctIndex] ?? String(current.answer ?? "");
  return Object.freeze({
    ...current,
    stem: ql014Stem(String(base.stem ?? ""), language),
    options,
    correctIndex,
    answer,
    explanation: ql014Explanation(current, answer, language),
    traceability: Object.freeze({
      ...(current.traceability ?? {}),
      localizedLastVariantFix: "SAP-QL014-AUTHORED-V7",
    }),
  });
}
