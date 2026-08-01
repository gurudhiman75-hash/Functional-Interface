import { required } from "./cp001-helpers";
import { tmwCp008ContributionVector } from "./cp008-engine";
import type { TmwCp008GeneratedQuestion } from "./cp008-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import {
  cp008Copy,
  cp008Money,
  cp008Name,
  cp008Number,
} from "./localization-cp008-language";

function pair(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function settingLocative(
  source: TmwCp008GeneratedQuestion,
  language: TmwLocalizedLanguage,
): string {
  const setting = source.parameters.context.setting;
  if (language === "pa") return `${cp008Copy(setting, language)} ਵਿੱਚ`;
  switch (setting) {
    case "an auto-component factory":
      return "ऑटो-पुर्जा कारखाने में";
    case "a commercial-complex painting site":
      return "वाणिज्यिक परिसर की रंगाई साइट पर";
    default:
      return `${cp008Copy(setting, language)} में`;
  }
}

function inflectTimePostpositions(text: string, language: TmwLocalizedLanguage): string {
  if (language === "hi") {
    return text
      .replace(/((?:[2-9]|\d{2,})) दिन में/g, "$1 दिनों में")
      .replace(/((?:[2-9]|\d{2,})) घंटे में/g, "$1 घंटों में");
  }
  return text
    .replace(/((?:[2-9]|\d{2,})) ਦਿਨ ਵਿੱਚ/g, "$1 ਦਿਨਾਂ ਵਿੱਚ")
    .replace(/((?:[2-9]|\d{2,})) ਘੰਟੇ ਵਿੱਚ/g, "$1 ਘੰਟਿਆਂ ਵਿੱਚ");
}

export function polishTmwCp008Text(
  text: string,
  language: TmwLocalizedLanguage,
): string {
  let output = inflectTimePostpositions(text, language);
  if (language === "hi") {
    output = output
      .replace(/ऑटो-पुर्जा कारखाना में/g, "ऑटो-पुर्जा कारखाने में")
      .replace(/वाणिज्यिक परिसर की रंगाई साइट में/g, "वाणिज्यिक परिसर की रंगाई साइट पर")
      .replace(/फाइलें को/g, "फाइलों को")
      .replace(/फाइलें का/g, "फाइलों का")
      .replace(/पुर्ज़े को/g, "पुर्ज़ों को")
      .replace(/पुर्ज़े का/g, "पुर्ज़ों का")
      .replace(/चुना प्राप्तकर्ता:/g, "भुगतान पाने वाला:")
      .replace(/लक्ष्य हिस्सा:/g, "जिसका भुगतान निकालना है:")
      .replace(/कुल भुगतान: ([^।]+); लक्ष्य:/g, "कुल भुगतान: $1; भुगतान पाने वाला:");
  } else {
    output = output
      .replace(/ਚੁਣਿਆ ਪ੍ਰਾਪਤਕਰਤਾ:/g, "ਭੁਗਤਾਨ ਲੈਣ ਵਾਲਾ:")
      .replace(/ਟੀਚਾ ਹਿੱਸਾ:/g, "ਜਿਸ ਦਾ ਭੁਗਤਾਨ ਕੱਢਣਾ ਹੈ:")
      .replace(/ਕੁੱਲ ਭੁਗਤਾਨ: ([^।]+); ਟੀਚਾ:/g, "ਕੁੱਲ ਭੁਗਤਾਨ: $1; ਭੁਗਤਾਨ ਲੈਣ ਵਾਲਾ:");
  }
  return output;
}

export function finalizeTmwCp008Stem(
  source: TmwCp008GeneratedQuestion,
  stem: string,
  language: TmwLocalizedLanguage,
): string {
  const p = source.parameters;
  const c = p.context.roles;
  const target = p.targetIndex ?? 0;
  const task = cp008Copy(p.context.task, language);
  const output = cp008Copy(p.context.outputUnit, language);

  if (source.solveMode === "findPieceRatePaymentFromOutput") {
    const pieceRate = required(p.pieceRate, "pieceRate");
    const name = cp008Name(c[target].name, language);
    if (language === "hi") {
      return `${settingLocative(source, language)} ${name} ने ${task} पूरा किया। स्वीकृत कार्य-मात्रा: ${cp008Number(c[target].output)} ${output}। तय पीस-रेट ${cp008Money(pieceRate)} प्रति इकाई है। देय भुगतान कितना है?`;
    }
    return `${settingLocative(source, language)} ${name} ਨੇ ${task} ਪੂਰਾ ਕੀਤਾ। ਮਨਜ਼ੂਰ ਕੰਮ-ਮਾਤਰਾ: ${cp008Number(c[target].output)} ${output}। ਤੈਅ ਪੀਸ-ਰੇਟ ${cp008Money(pieceRate)} ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ। ਦੇਣਯੋਗ ਭੁਗਤਾਨ ਕਿੰਨਾ ਹੈ?`;
  }

  if (source.solveMode === "findBonusShareFromExtraContribution") {
    const bonus = required(p.bonusPool, "bonusPool");
    const records = c.map((role) => pair(
      language,
      `${cp008Name(role.name, language)}—वास्तविक ${cp008Number(role.output)}, लक्ष्य ${cp008Number(role.baselineOutput)}`,
      `${cp008Name(role.name, language)}—ਅਸਲ ${cp008Number(role.output)}, ਟੀਚਾ ${cp008Number(role.baselineOutput)}`,
    )).join("; ");
    if (language === "hi") {
      return `${settingLocative(source, language)} ${cp008Money(bonus)} का बोनस केवल लक्ष्य से अधिक उत्पादन के अनुपात में बाँटा जाता है। उत्पादन अभिलेख (${output}): ${records}। ${cp008Name(c[target].name, language)} को कितना बोनस मिलेगा?`;
    }
    return `${settingLocative(source, language)} ${cp008Money(bonus)} ਦਾ ਬੋਨਸ ਸਿਰਫ਼ ਟੀਚੇ ਤੋਂ ਵੱਧ ਉਤਪਾਦਨ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ। ਉਤਪਾਦਨ ਰਿਕਾਰਡ (${output}): ${records}। ${cp008Name(c[target].name, language)} ਨੂੰ ਕਿੰਨਾ ਬੋਨਸ ਮਿਲੇਗਾ?`;
  }

  if (source.solveMode === "findPaymentAfterSignedContribution") {
    const records = c.map((role) => pair(
      language,
      `${cp008Name(role.name, language)}—दर्ज ${cp008Number(role.output)}, अस्वीकृत/पुनःकार्य ${cp008Number(role.defectiveOutput)}`,
      `${cp008Name(role.name, language)}—ਦਰਜ ${cp008Number(role.output)}, ਰੱਦ/ਮੁੜ-ਕੰਮ ${cp008Number(role.defectiveOutput)}`,
    )).join("; ");
    if (language === "hi") {
      return `${settingLocative(source, language)} ${cp008Money(p.totalPayment)} को स्वीकृत शुद्ध उत्पादन के अनुसार बाँटना है। उत्पादन अभिलेख (${output}): ${records}। ${cp008Name(c[target].name, language)} का भुगतान कितना है?`;
    }
    return `${settingLocative(source, language)} ${cp008Money(p.totalPayment)} ਨੂੰ ਮਨਜ਼ੂਰਸ਼ੁਦਾ ਸ਼ੁੱਧ ਉਤਪਾਦਨ ਅਨੁਸਾਰ ਵੰਡਣਾ ਹੈ। ਉਤਪਾਦਨ ਰਿਕਾਰਡ (${output}): ${records}। ${cp008Name(c[target].name, language)} ਦਾ ਭੁਗਤਾਨ ਕਿੰਨਾ ਹੈ?`;
  }

  return polishTmwCp008Text(stem, language);
}

export function finalizeTmwCp008Givens(
  source: TmwCp008GeneratedQuestion,
  givens: string[],
  language: TmwLocalizedLanguage,
): string[] {
  if (source.solveMode === "findContributionFactorRatioFromPayments") {
    const payments = required(source.parameters.reportedPayments, "reportedPayments");
    const factor = source.parameters.factorTarget === "EFFICIENCY_RATIO"
      ? pair(language, "ज्ञात गुणक: कार्य-दिन; अज्ञात: दक्षता अनुपात।", "ਪਤਾ ਗੁਣਕ: ਕੰਮ-ਦਿਨ; ਅਣਜਾਣ: ਦੱਖਤਾ ਅਨੁਪਾਤ।")
      : pair(language, "ज्ञात गुणक: दक्षता; अज्ञात: कार्य-दिन अनुपात।", "ਪਤਾ ਗੁਣਕ: ਦੱਖਤਾ; ਅਣਜਾਣ: ਕੰਮ-ਦਿਨ ਅਨੁਪਾਤ।");
    return [
      pair(
        language,
        `भुगतान अनुपात: ${cp008Number(payments[0])}:${cp008Number(payments[1])}।`,
        `ਭੁਗਤਾਨ ਅਨੁਪਾਤ: ${cp008Number(payments[0])}:${cp008Number(payments[1])}।`,
      ),
      factor,
    ];
  }
  return givens.map((given) => polishTmwCp008Text(given, language));
}

export function finalizeTmwCp008Shortcut(
  source: TmwCp008GeneratedQuestion,
  shortcut: { title: string; steps: string[] },
  answerText: string,
  language: TmwLocalizedLanguage,
): { title: string; steps: string[] } {
  if (source.solveMode === "findBonusShareFromExtraContribution") {
    const target = source.parameters.targetIndex ?? 0;
    const weight = tmwCp008ContributionVector(source.parameters)[target];
    return {
      title: polishTmwCp008Text(shortcut.title, language),
      steps: [
        pair(language, "हर व्यक्ति के वास्तविक उत्पादन में से उसका लक्ष्य घटाएँ।", "ਹਰ ਵਿਅਕਤੀ ਦੇ ਅਸਲ ਉਤਪਾਦਨ ਵਿੱਚੋਂ ਉਸ ਦਾ ਟੀਚਾ ਘਟਾਓ।"),
        pair(
          language,
          `लक्षित व्यक्ति का अतिरिक्त योगदान-भार ${cp008Number(weight)} है। बोनस अनुपात से उत्तर ${answerText}।`,
          `ਟੀਚਾ ਵਿਅਕਤੀ ਦਾ ਵਾਧੂ ਯੋਗਦਾਨ-ਭਾਰ ${cp008Number(weight)} ਹੈ। ਬੋਨਸ ਅਨੁਪਾਤ ਤੋਂ ਉੱਤਰ ${answerText}।`,
        ),
      ],
    };
  }
  return {
    title: polishTmwCp008Text(shortcut.title, language),
    steps: shortcut.steps.map((step) => polishTmwCp008Text(step, language)),
  };
}

export function finalizeTmwCp008Trap(
  source: TmwCp008GeneratedQuestion,
  explanation: string,
  language: TmwLocalizedLanguage,
): string {
  if (
    source.solveMode === "findTotalPaymentPoolFromKnownShare" &&
    source.explanation.commonTrap.misconceptionId === "TOTAL_REPORTED_AS_SHARE"
  ) {
    return pair(
      language,
      "कुल भुगतान पूछा गया है, लेकिन यह विकल्प ज्ञात व्यक्ति का हिस्सा ही दोहराता है।",
      "ਕੁੱਲ ਭੁਗਤਾਨ ਪੁੱਛਿਆ ਗਿਆ ਹੈ, ਪਰ ਇਹ ਚੋਣ ਪਤਾ ਵਿਅਕਤੀ ਦਾ ਹਿੱਸਾ ਹੀ ਦੁਹਰਾਉਂਦੀ ਹੈ।",
    );
  }
  return polishTmwCp008Text(explanation, language);
}

export function finalizeTmwCp008Conclusion(
  source: TmwCp008GeneratedQuestion,
  answerText: string,
  conclusion: string,
  language: TmwLocalizedLanguage,
): string {
  switch (source.solveMode) {
    case "findTotalPaymentPoolFromKnownShare":
      return pair(language, `अतः कुल भुगतान राशि: ${answerText}।`, `ਇਸ ਲਈ ਕੁੱਲ ਭੁਗਤਾਨ ਰਕਮ: ${answerText}।`);
    case "findResidualPayment":
      return pair(language, `अतः शेष भुगतान: ${answerText}।`, `ਇਸ ਲਈ ਬਾਕੀ ਭੁਗਤਾਨ: ${answerText}।`);
    case "findMixedCategoryPaymentDistribution":
      return pair(language, `अतः बताए गए क्रम में भुगतान: ${answerText}।`, `ਇਸ ਲਈ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਭੁਗਤਾਨ: ${answerText}।`);
    case "findPieceRatePaymentFromOutput":
      return pair(language, `अतः देय पीस-रेट भुगतान: ${answerText}।`, `ਇਸ ਲਈ ਦੇਣਯੋਗ ਪੀਸ-ਰੇਟ ਭੁਗਤਾਨ: ${answerText}।`);
    case "findBonusShareFromExtraContribution":
      return pair(language, `अतः बोनस राशि: ${answerText}।`, `ਇਸ ਲਈ ਬੋਨਸ ਰਕਮ: ${answerText}।`);
    case "findPaymentAfterSignedContribution":
      return pair(language, `अतः शुद्ध योगदान के आधार पर भुगतान: ${answerText}।`, `ਇਸ ਲਈ ਸ਼ੁੱਧ ਯੋਗਦਾਨ ਦੇ ਆਧਾਰ ਉੱਤੇ ਭੁਗਤਾਨ: ${answerText}।`);
    default:
      if (source.solution.answerType === "EFFICIENCY") {
        return pair(language, `अतः आवश्यक दर: ${answerText}।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਦਰ: ${answerText}।`);
      }
      return polishTmwCp008Text(conclusion, language);
  }
}
