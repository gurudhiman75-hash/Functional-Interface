import type { SapTranslationLanguage } from "./types";

function L(language: SapTranslationLanguage, hi: string, pa: string) {
  return language === "hi" ? hi : pa;
}

function tidy(value: string) {
  return value
    .replace(/\s{2,}/gu, " ")
    .replace(/\s+([,;:।])/gu, "$1")
    .replace(/\s+\?/gu, " ?")
    .replace(/है है([।.]?)/gu, "है$1")
    .replace(/हैं है([।.]?)/gu, "हैं$1")
    .replace(/ਹੈ ਹੈ([।.]?)/gu, "ਹੈ$1")
    .replace(/ਹਨ ਹੈ([।.]?)/gu, "ਹਨ$1")
    .trim();
}

function directExpression(english: string) {
  return english
    .replace(/^What is the exact value of\s*/u, "")
    .replace(/^What is the value of\s*/u, "")
    .replace(/^Find the exact value of\s*/u, "")
    .replace(/^Find the value of\s*/u, "")
    .replace(/^Evaluate\s*:?\s*/u, "")
    .replace(/^Simplify\s*:?\s*/u, "")
    .replace(/[?.]$/u, "")
    .trim();
}

function mathSpacing(value: string) {
  return value
    .replace(/\\times\s*\?/gu, "\\times ?")
    .replace(/\\div\s*\?/gu, "\\div ?")
    .replace(/\\le\s*\?/gu, "\\le ?")
    .replace(/\\ge\s*\?/gu, "\\ge ?")
    .replace(/<\s*\?/gu, "< ?")
    .replace(/>\s*\?/gu, "> ?")
    .replace(/=\s*\?/gu, "= ?")
    .replace(/\?\s*=/gu, "? =")
    .replace(/\?\\%/gu, "? \\%");
}

function polishStem(base: any, current: string, language: SapTranslationLanguage) {
  const ql = String(base.questionLanguageId ?? "");
  const english = String(base.stem ?? "").trim();
  let stem = current;

  if (ql === "SAP-QL-007") {
    stem = stem
      .replace(/(\{[^}]+\})\s+का\s+(\d+(?:\.\d+)?)/u, "$2 × $1")
      .replace(/(\{[^}]+\})\s+ਦਾ\s+(\d+(?:\.\d+)?)/u, "$2 × $1");
  }

  if (["SAP-QL-057","SAP-QL-058","SAP-QL-062","SAP-QL-065","SAP-QL-066","SAP-QL-184"].includes(ql)) {
    const expression = directExpression(english)
      .replace(/\s+Give the answer in lowest terms.*$/u, "")
      .trim();
    stem = L(language, `सटीक मान ज्ञात कीजिए: ${expression}`, `ਸਟੀਕ ਮੁੱਲ ਕੱਢੋ: ${expression}`);
  }

  if (ql === "SAP-QL-045") {
    let expression = current
      .replace(/^मान ज्ञात कीजिए:\s*/u, "")
      .replace(/^ਮੁੱਲ ਕੱਢੋ:\s*/u, "")
      .replace(/\. उत्तर को.*$/u, "")
      .replace(/\. ਉੱਤਰ ਨੂੰ.*$/u, "")
      .replace(/\(5 ਦੁਹਰਾਉਂਦਾ\)/u, "(ਜਿੱਥੇ 5 ਆਵਰਤੀ ਹੈ)")
      .replace(/\(5 आवर्ती\)/u, "(जहाँ 5 आवर्ती है)")
      .replace(/[.]$/u, "");
    stem = L(language,
      `मान ज्ञात कीजिए: ${expression}। उत्तर को सरलतम भिन्न में लिखिए।`,
      `ਮੁੱਲ ਕੱਢੋ: ${expression}। ਉੱਤਰ ਨੂੰ ਸਭ ਤੋਂ ਸਰਲ ਭਿੰਨ ਵਿੱਚ ਲਿਖੋ।`,
    );
  }

  if (["SAP-QL-097","SAP-QL-107","SAP-QL-109"].includes(ql)) {
    const afterColon = english.includes(":") ? english.slice(english.indexOf(":") + 1).trim().replace(/[.]$/u, "") : directExpression(english);
    stem = ql === "SAP-QL-097"
      ? L(language, `पूर्णांक □ का मान ज्ञात कीजिए: ${afterColon}`, `ਪੂਰਨ ਅੰਕ □ ਦਾ ਮੁੱਲ ਕੱਢੋ: ${afterColon}`)
      : L(language, `पूर्णांक ? का मान ज्ञात कीजिए: ${afterColon.replace(/\bof\b/gu,"×")}`, `ਪੂਰਨ ਅੰਕ ? ਦਾ ਮੁੱਲ ਕੱਢੋ: ${afterColon.replace(/\bof\b/gu,"×")}`);
  }

  if (ql === "SAP-QL-049") {
    stem = stem.replace(/□%\s+का\s+(\d+)/u,"□% × $1").replace(/□%\s+ਦਾ\s+(\d+)/u,"□% × $1");
  }

  if (ql === "SAP-QL-050") {
    stem = stem
      .replace(/1\/2\s+का\s+x/u,"(1/2) × x")
      .replace(/50%\s+का\s+y/u,"50% × y")
      .replace(/1\/2\s+ਦਾ\s+x/u,"(1/2) × x")
      .replace(/50%\s+ਦਾ\s+y/u,"50% × y");
  }

  if (ql === "SAP-QL-091") {
    const m = /^For (.+), Route A multiplies first to get (.+)\. Route B first reduces (.+) to (.+) and then multiplies\. Which statement is correct\?$/su.exec(english);
    if (m) {
      stem = L(language,
        `${m[1]} के लिए विधि A पहले गुणा करके ${m[2]} प्राप्त करती है। विधि B पहले ${m[3]} को ${m[4]} में सरल करती है और फिर गुणा करती है। सही कथन चुनिए।`,
        `${m[1]} ਲਈ ਵਿਧੀ A ਪਹਿਲਾਂ ਗੁਣਾ ਕਰਕੇ ${m[2]} ਲੈਂਦੀ ਹੈ। ਵਿਧੀ B ਪਹਿਲਾਂ ${m[3]} ਨੂੰ ${m[4]} ਵਿੱਚ ਸਰਲ ਕਰਦੀ ਹੈ ਅਤੇ ਫਿਰ ਗੁਣਾ ਕਰਦੀ ਹੈ। ਸਹੀ ਕਥਨ ਚੁਣੋ।`,
      );
    }
  }

  if (ql === "SAP-QL-178") {
    const m = /^Which value (above|below) (.+) has a square root nearest to (.+)\?$/su.exec(english);
    if (m) {
      const dir = m[1] === "above" ? L(language,"से बड़ा","ਤੋਂ ਵੱਡਾ") : L(language,"से छोटा","ਤੋਂ ਛੋਟਾ");
      stem = L(language,
        `${m[2]} ${dir} कौन-सा मान ऐसा है जिसका वर्गमूल ${m[3]} के सबसे निकट है?`,
        `${m[2]} ${dir} ਕਿਹੜਾ ਮੁੱਲ ਹੈ ਜਿਸ ਦਾ ਵਰਗ ਮੂਲ ${m[3]} ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਹੈ?`,
      );
    }
  }

  if (Number(ql.slice(-3)) >= 199 && Number(ql.slice(-3)) <= 211) {
    stem = mathSpacing(stem);
  }

  return tidy(stem);
}

function polishExplanation(base: any, current: any, answer: string, language: SapTranslationLanguage) {
  const ql = String(base.questionLanguageId ?? "");
  let lines = [...(current.explanation?.lines ?? [])].map((line: unknown) => tidy(mathSpacing(String(line ?? ""))));

  if (ql === "SAP-QL-126") {
    const n = Number(answer);
    if (Number.isFinite(n)) {
      const unit = String(n * 2);
      lines = [
        lines[0] ?? L(language,"पूर्णांकन इकाई का आधा अधिकतम संभव त्रुटि देता है।","ਰਾਊਂਡਿੰਗ ਇਕਾਈ ਦਾ ਅੱਧਾ ਵੱਧ ਤੋਂ ਵੱਧ ਸੰਭਵ ਗਲਤੀ ਦਿੰਦਾ ਹੈ।"),
        L(language,`एक पूर्णांकन इकाई ${unit} है, इसलिए अधिकतम निरपेक्ष त्रुटि ${answer} है।`,`ਇੱਕ ਰਾਊਂਡਿੰਗ ਇਕਾਈ ${unit} ਹੈ, ਇਸ ਲਈ ਵੱਧ ਤੋਂ ਵੱਧ ਨਿਰਪੇਖ ਗਲਤੀ ${answer} ਹੈ।`),
        L(language,`अतः सही उत्तर ${answer} है।`,`ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`),
      ];
    }
  }

  if (ql === "SAP-QL-091") {
    lines = [
      L(language,"बड़ी गणना से पहले वैध समान गुणनखंड पहचानकर भिन्न को सरल करना गणना को छोटा करता है।","ਵੱਡੀ ਗਣਨਾ ਤੋਂ ਪਹਿਲਾਂ ਵੈਧ ਸਾਂਝਾ ਗੁਣਨਖੰਡ ਪਛਾਣ ਕੇ ਭਿੰਨ ਨੂੰ ਸਰਲ ਕਰਨਾ ਗਣਨਾ ਛੋਟੀ ਕਰਦਾ ਹੈ।"),
      L(language,"दोनों विधियाँ समान सटीक मान देती हैं; विधि B पहले भिन्न सरल करती है, इसलिए गणना अधिक कुशल है।","ਦੋਵੇਂ ਵਿਧੀਆਂ ਇੱਕੋ ਸਟੀਕ ਮੁੱਲ ਦਿੰਦੀਆਂ ਹਨ; ਵਿਧੀ B ਪਹਿਲਾਂ ਭਿੰਨ ਸਰਲ ਕਰਦੀ ਹੈ, ਇਸ ਲਈ ਗਣਨਾ ਵੱਧ ਕੁਸ਼ਲ ਹੈ।"),
      L(language,`अतः सही उत्तर: ${answer}।`,`ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ: ${answer}।`),
    ];
  }

  if (ql === "SAP-QL-199") {
    lines = lines.map((line) => line
      .replace(/^समीकरण है लगभग\s*/u,"निकट मान लेने पर समीकरण: ")
      .replace(/^ਸਮੀਕਰਨ ਹੈ ਲਗਭਗ\s*/u,"ਨੇੜਲੇ ਮੁੱਲ ਲੈਣ ਤੇ ਸਮੀਕਰਨ: "));
  }

  if (["SAP-QL-207","SAP-QL-208","SAP-QL-209"].includes(ql)) {
    const first = ql === "SAP-QL-207"
      ? L(language,"दिए गए सहन-अंतराल में कौन-सा पूर्णांक फिट बैठता है, यह जाँचिए।","ਦਿੱਤੀ ਸਹਿਣ-ਹੱਦ ਵਿੱਚ ਕਿਹੜਾ ਪੂਰਨ ਅੰਕ ਫਿੱਟ ਬੈਠਦਾ ਹੈ, ਇਹ ਜਾਂਚੋ।")
      : L(language,"दिए गए अंतराल में आने वाले पूर्णांकों को ठीक-ठीक गिनिए।","ਦਿੱਤੀ ਹੱਦ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਪੂਰਨ ਅੰਕਾਂ ਨੂੰ ਠੀਕ-ਠੀਕ ਗਿਣੋ।");
    lines[0] = first;
  }

  lines = lines.map(tidy);
  return Object.freeze({ lines: Object.freeze(lines) });
}

export function applySapHumanReviewFinalV9(base: any, current: any, language: SapTranslationLanguage) {
  const stem = polishStem(base, String(current.stem ?? ""), language);
  const options = Object.freeze([...(current.options ?? [])].map((option: unknown) => tidy(String(option ?? ""))));
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
    traceability: Object.freeze({
      ...(current.traceability ?? {}),
      localizedHumanReviewFinal: "SAP-HUMAN-REVIEW-FINAL-V9",
    }),
  });
}
