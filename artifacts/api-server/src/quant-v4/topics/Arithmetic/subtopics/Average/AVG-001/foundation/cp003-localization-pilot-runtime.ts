import { getAvg001QuestionEntries } from "./library";
import {
  AVG_001_CP003_MULTILINGUAL_PILOT as BASE_PILOT,
  runAvg001Cp003LocalizationPilot as runBasePilot,
} from "./cp003-localization-pilot";
import { runAvg001Pipeline } from "./pipeline";
import type { Avg001Language, Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export const AVG_001_CP003_MULTILINGUAL_PILOT = Object.freeze({
  ...BASE_PILOT,
  qlCount: 98,
});

type PilotLanguage = (typeof AVG_001_CP003_MULTILINGUAL_PILOT.languages)[number];

const CP003_QL_IDS = getAvg001QuestionEntries()
  .filter((entry) => entry.cpId === "AVG-CP-003")
  .map((entry) => entry.qlId);

function value(pkg: Avg001QuestionPackage, key: string) {
  return String(pkg.parameters.renderVariables[key] ?? "");
}

function gapContext(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const domain = pkg.parameters.contextDomain;
  const oldAverage = value(pkg, "oldAverage");
  const memberValue = value(pkg, "memberValue");

  if (language === "hi") {
    if (domain === "Education") {
      return {
        lead: `एक कक्षा के विद्यार्थियों के अंकों का औसत ${oldAverage} है।`,
        joining: `${memberValue} अंक प्राप्त करने वाला एक नया विद्यार्थी शामिल होता है`,
        leaving: `${memberValue} अंक प्राप्त करने वाला एक विद्यार्थी कक्षा छोड़ देता है`,
        plural: "विद्यार्थियों",
        unit: "अंक",
      };
    }
    if (domain === "Sports") {
      return {
        lead: `एक टीम के खिलाड़ियों का औसत स्कोर ${oldAverage} रन है।`,
        joining: `${memberValue} रन बनाने वाला एक नया खिलाड़ी शामिल होता है`,
        leaving: `${memberValue} रन बनाने वाला एक खिलाड़ी टीम छोड़ देता है`,
        plural: "खिलाड़ियों",
        unit: "रन",
      };
    }
    if (domain === "Production") {
      return {
        lead: `एक उत्पादन इकाई की मशीनों का औसत उत्पादन ${oldAverage} इकाइयाँ है।`,
        joining: `${memberValue} इकाइयों का उत्पादन करने वाली एक नई मशीन जोड़ी जाती है`,
        leaving: `${memberValue} इकाइयों का उत्पादन करने वाली एक मशीन हटा दी जाती है`,
        plural: "मशीनों",
        unit: "इकाइयाँ",
      };
    }
    return {
      lead: `एक कार्य-दल के कर्मियों का औसत उत्पादन ${oldAverage} इकाइयाँ है।`,
      joining: `${memberValue} इकाइयों का उत्पादन करने वाला एक नया कर्मी शामिल होता है`,
      leaving: `${memberValue} इकाइयों का उत्पादन करने वाला एक कर्मी दल छोड़ देता है`,
      plural: "कर्मियों",
      unit: "इकाइयाँ",
    };
  }

  if (domain === "Education") {
    return {
      lead: `ਇੱਕ ਜਮਾਤ ਦੇ ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਅੰਕਾਂ ਦੀ ਔਸਤ ${oldAverage} ਹੈ।`,
      joining: `${memberValue} ਅੰਕ ਲੈਣ ਵਾਲਾ ਇੱਕ ਨਵਾਂ ਵਿਦਿਆਰਥੀ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ`,
      leaving: `${memberValue} ਅੰਕ ਲੈਣ ਵਾਲਾ ਇੱਕ ਵਿਦਿਆਰਥੀ ਜਮਾਤ ਛੱਡ ਦਿੰਦਾ ਹੈ`,
      plural: "ਵਿਦਿਆਰਥੀਆਂ",
      unit: "ਅੰਕ",
    };
  }
  if (domain === "Sports") {
    return {
      lead: `ਇੱਕ ਟੀਮ ਦੇ ਖਿਡਾਰੀਆਂ ਦਾ ਔਸਤ ਸਕੋਰ ${oldAverage} ਦੌੜਾਂ ਹੈ।`,
      joining: `${memberValue} ਦੌੜਾਂ ਬਣਾਉਣ ਵਾਲਾ ਇੱਕ ਨਵਾਂ ਖਿਡਾਰੀ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ`,
      leaving: `${memberValue} ਦੌੜਾਂ ਬਣਾਉਣ ਵਾਲਾ ਇੱਕ ਖਿਡਾਰੀ ਟੀਮ ਛੱਡ ਦਿੰਦਾ ਹੈ`,
      plural: "ਖਿਡਾਰੀਆਂ",
      unit: "ਦੌੜਾਂ",
    };
  }
  if (domain === "Production") {
    return {
      lead: `ਇੱਕ ਉਤਪਾਦਨ ਇਕਾਈ ਦੀਆਂ ਮਸ਼ੀਨਾਂ ਦਾ ਔਸਤ ਉਤਪਾਦਨ ${oldAverage} ਇਕਾਈਆਂ ਹੈ।`,
      joining: `${memberValue} ਇਕਾਈਆਂ ਦਾ ਉਤਪਾਦਨ ਕਰਨ ਵਾਲੀ ਇੱਕ ਨਵੀਂ ਮਸ਼ੀਨ ਜੋੜੀ ਜਾਂਦੀ ਹੈ`,
      leaving: `${memberValue} ਇਕਾਈਆਂ ਦਾ ਉਤਪਾਦਨ ਕਰਨ ਵਾਲੀ ਇੱਕ ਮਸ਼ੀਨ ਹਟਾਈ ਜਾਂਦੀ ਹੈ`,
      plural: "ਮਸ਼ੀਨਾਂ",
      unit: "ਇਕਾਈਆਂ",
    };
  }
  return {
    lead: `ਇੱਕ ਕਾਰਜ-ਦਲ ਦੇ ਕਾਮਿਆਂ ਦਾ ਔਸਤ ਉਤਪਾਦਨ ${oldAverage} ਇਕਾਈਆਂ ਹੈ।`,
    joining: `${memberValue} ਇਕਾਈਆਂ ਦਾ ਉਤਪਾਦਨ ਕਰਨ ਵਾਲਾ ਇੱਕ ਨਵਾਂ ਕਾਮਾ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ`,
    leaving: `${memberValue} ਇਕਾਈਆਂ ਦਾ ਉਤਪਾਦਨ ਕਰਨ ਵਾਲਾ ਇੱਕ ਕਾਮਾ ਦਲ ਛੱਡ ਦਿੰਦਾ ਹੈ`,
    plural: "ਕਾਮਿਆਂ",
    unit: "ਇਕਾਈਆਂ",
  };
}

function gapStem(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const context = gapContext(pkg, language);
  if (pkg.solveMode === "findOriginalCountFromJoiningMemberShift") {
    return language === "hi"
      ? `${context.lead} ${context.joining}, जिससे औसत ${value(pkg, "averageChange")} ${context.unit} बढ़ जाता है। प्रारंभ में ${context.plural} की संख्या ज्ञात कीजिए।`
      : `${context.lead} ${context.joining}, ਜਿਸ ਨਾਲ ਔਸਤ ${value(pkg, "averageChange")} ${context.unit} ਵਧ ਜਾਂਦੀ ਹੈ। ਸ਼ੁਰੂ ਵਿੱਚ ${context.plural} ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`;
  }
  return language === "hi"
    ? `${context.lead} ${context.leaving}, जिसके बाद औसत ${value(pkg, "newAverage")} ${context.unit} हो जाता है। प्रारंभ में ${context.plural} की संख्या ज्ञात कीजिए।`
    : `${context.lead} ${context.leaving}, ਜਿਸ ਤੋਂ ਬਾਅਦ ਔਸਤ ${value(pkg, "newAverage")} ${context.unit} ਹੋ ਜਾਂਦੀ ਹੈ। ਸ਼ੁਰੂ ਵਿੱਚ ${context.plural} ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`;
}

function gapExplanation(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const oldAverage = value(pkg, "oldAverage");
  const memberValue = value(pkg, "memberValue");
  const shift = value(pkg, "averageChange");
  const answer = pkg.answer;
  const context = gapContext(pkg, language);
  const final = language === "hi"
    ? `अतः प्रारंभिक ${context.plural} की संख्या ${answer} है।`
    : `ਇਸ ਲਈ ਸ਼ੁਰੂਆਤੀ ${context.plural} ਦੀ ਗਿਣਤੀ ${answer} ਹੈ।`;

  if (pkg.solveMode === "findOriginalCountFromJoiningMemberShift") {
    return {
      lines: language === "hi"
        ? [
            "नए सदस्य का अतिरिक्त मान बढ़े हुए समूह के सभी सदस्यों में बँटता है।",
            `$$अतिरिक्त मान = ${memberValue} - ${oldAverage}$$`,
            `$$प्रारंभिक संख्या = (${memberValue} - ${oldAverage}) ÷ ${shift} - 1 = ${answer}$$`,
            final,
          ]
        : [
            "ਨਵੇਂ ਮੈਂਬਰ ਦਾ ਵਾਧੂ ਮੁੱਲ ਵਧੇ ਹੋਏ ਸਮੂਹ ਦੇ ਸਾਰੇ ਮੈਂਬਰਾਂ ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ।",
            `$$ਵਾਧੂ ਮੁੱਲ = ${memberValue} - ${oldAverage}$$`,
            `$$ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ = (${memberValue} - ${oldAverage}) ÷ ${shift} - 1 = ${answer}$$`,
            final,
          ],
    };
  }

  return {
    lines: language === "hi"
      ? [
          "सदस्य के हटने से बने मान-अंतर को औसत परिवर्तन से जोड़कर मूल संख्या मिलती है।",
          `$$मान-अंतर = |${memberValue} - ${oldAverage}|$$`,
          `$$प्रारंभिक संख्या = |${memberValue} - ${oldAverage}| ÷ ${shift} + 1 = ${answer}$$`,
          final,
        ]
      : [
          "ਮੈਂਬਰ ਦੇ ਹਟਣ ਨਾਲ ਬਣੇ ਮੁੱਲ-ਅੰਤਰ ਨੂੰ ਔਸਤ ਬਦਲਾਅ ਨਾਲ ਜੋੜ ਕੇ ਮੂਲ ਗਿਣਤੀ ਮਿਲਦੀ ਹੈ।",
          `$$ਮੁੱਲ-ਅੰਤਰ = |${memberValue} - ${oldAverage}|$$`,
          `$$ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ = |${memberValue} - ${oldAverage}| ÷ ${shift} + 1 = ${answer}$$`,
          final,
        ],
  };
}

function correctedChecks(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const excluded = new Set([
    "language",
    "maturity",
    "release-approval",
    "resolved-stem",
    "explanation-depth",
    "explanation-arithmetic",
    "explanation-answer",
  ]);
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter((check) => !excluded.has(check.name));
  const allText = `${pkg.stem}\n${pkg.explanation.lines.join("\n")}`;
  const devanagariLetters = /[\u0900-\u0963\u0970-\u097F]/;
  const gurmukhiLetters = /[\u0A01-\u0A74]/;
  const expectedScript = language === "hi" ? devanagariLetters : gurmukhiLetters;
  const wrongScript = language === "hi" ? gurmukhiLetters : devanagariLetters;
  checks.push(
    { name: "localized-language", passed: pkg.language === language, message: `Package language is ${language}` },
    { name: "localized-script", passed: expectedScript.test(allText) && !wrongScript.test(allText), message: "Localized prose uses the expected Indic script" },
    { name: "localized-stem", passed: !/[{}]|undefined|NaN|Infinity|null/.test(pkg.stem), message: "Localized stem is fully rendered" },
    { name: "localized-explanation", passed: pkg.explanation.lines.length === 4 && pkg.explanation.lines.some((line) => line.includes(pkg.answer)), message: "Localized explanation has four lines and answer evidence" },
    { name: "localization-candidate", passed: pkg.maturity === "MANUAL_REVIEW" && !pkg.publiclyPublishable, message: "Pilot remains non-publishable pending review" },
  );
  return checks;
}

export function getAvg001Cp003LocalizedQlIds() {
  return [...CP003_QL_IDS];
}

export function runAvg001Cp003LocalizationPilot(input: {
  questionLanguageId: string;
  seed: string;
  language: PilotLanguage;
}): Avg001QuestionPackage {
  const english = runAvg001Pipeline({ questionLanguageId: input.questionLanguageId, seed: input.seed, language: "en" });
  if (english.canonicalProblemId !== "AVG-CP-003") {
    throw new Error(`${input.questionLanguageId} is outside the AVG-001 CP-003 multilingual pilot`);
  }
  if (english.solveMode !== "findOriginalCountFromJoiningMemberShift" && english.solveMode !== "findOriginalCountFromLeavingMemberShift") {
    return runBasePilot(input);
  }

  const localized: Avg001QuestionPackage = {
    ...english,
    questionId: `${english.questionId}:${input.language}`,
    language: input.language as Avg001Language,
    stem: gapStem(english, input.language),
    parameters: { ...english.parameters, language: input.language as Avg001Language },
    explanation: gapExplanation(english, input.language),
    maturity: "MANUAL_REVIEW",
    publiclyPublishable: false,
    traceability: {
      ...english.traceability,
      localizationReleaseId: AVG_001_CP003_MULTILINGUAL_PILOT.releaseId,
      localizationStatus: AVG_001_CP003_MULTILINGUAL_PILOT.status,
      editorialStatus: AVG_001_CP003_MULTILINGUAL_PILOT.editorialStatus,
      localizedLanguage: input.language,
      sourceEnglishReleaseId: english.traceability.releaseId,
      publiclyPublishable: false,
    },
  };
  const checks = correctedChecks(localized, input.language);
  return { ...localized, validation: { valid: checks.every((check) => check.passed), checks } };
}
