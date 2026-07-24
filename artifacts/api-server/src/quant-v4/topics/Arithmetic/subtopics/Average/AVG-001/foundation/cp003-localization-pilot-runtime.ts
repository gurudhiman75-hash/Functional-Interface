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

function localizedUnit(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const unit = value(pkg, "unit");
  if (language === "hi") {
    if (unit === "marks") return "अंक";
    if (unit === "runs") return "रन";
    return "इकाइयाँ";
  }
  if (unit === "marks") return "ਅੰਕ";
  if (unit === "runs") return "ਦੌੜਾਂ";
  return "ਇਕਾਈਆਂ";
}

function memberLabels(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const domain = pkg.parameters.contextDomain;
  if (language === "hi") {
    if (domain === "Education") return { singular: "विद्यार्थी", plural: "विद्यार्थी" };
    if (domain === "Sports") return { singular: "खिलाड़ी", plural: "खिलाड़ी" };
    if (domain === "Workforce") return { singular: "कर्मी", plural: "कर्मी" };
    if (domain === "Production") return { singular: "मशीन", plural: "मशीनें" };
    return { singular: "सदस्य", plural: "सदस्य" };
  }
  if (domain === "Education") return { singular: "ਵਿਦਿਆਰਥੀ", plural: "ਵਿਦਿਆਰਥੀ" };
  if (domain === "Sports") return { singular: "ਖਿਡਾਰੀ", plural: "ਖਿਡਾਰੀ" };
  if (domain === "Workforce") return { singular: "ਕਾਮਾ", plural: "ਕਾਮੇ" };
  if (domain === "Production") return { singular: "ਮਸ਼ੀਨ", plural: "ਮਸ਼ੀਨਾਂ" };
  return { singular: "ਮੈਂਬਰ", plural: "ਮੈਂਬਰ" };
}

function gapStem(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const oldAverage = value(pkg, "oldAverage");
  const memberValue = value(pkg, "memberValue");
  const averageChange = value(pkg, "averageChange");
  const newAverage = value(pkg, "newAverage");
  const unit = localizedUnit(pkg, language);
  const member = memberLabels(pkg, language);

  if (pkg.solveMode === "findOriginalCountFromJoiningMemberShift") {
    if (language === "hi") {
      return `एक समूह का औसत ${oldAverage} ${unit} है। ${memberValue} ${unit} वाला एक नया ${member.singular} जुड़ने पर औसत ${averageChange} ${unit} बढ़ जाता है। प्रारंभ में ${member.plural} की संख्या ज्ञात कीजिए।`;
    }
    return `ਇੱਕ ਸਮੂਹ ਦੀ ਔਸਤ ${oldAverage} ${unit} ਹੈ। ${memberValue} ${unit} ਵਾਲਾ ਇੱਕ ਨਵਾਂ ${member.singular} ਸ਼ਾਮਲ ਹੋਣ ਉੱਤੇ ਔਸਤ ${averageChange} ${unit} ਵਧ ਜਾਂਦੀ ਹੈ। ਸ਼ੁਰੂ ਵਿੱਚ ${member.plural} ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`;
  }

  if (language === "hi") {
    return `एक समूह का औसत ${oldAverage} ${unit} है। ${memberValue} ${unit} वाला एक ${member.singular} हटने पर औसत ${newAverage} ${unit} हो जाता है। प्रारंभ में ${member.plural} की संख्या ज्ञात कीजिए।`;
  }
  return `ਇੱਕ ਸਮੂਹ ਦੀ ਔਸਤ ${oldAverage} ${unit} ਹੈ। ${memberValue} ${unit} ਵਾਲਾ ਇੱਕ ${member.singular} ਹਟਣ ਉੱਤੇ ਔਸਤ ${newAverage} ${unit} ਹੋ ਜਾਂਦੀ ਹੈ। ਸ਼ੁਰੂ ਵਿੱਚ ${member.plural} ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`;
}

function gapExplanation(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const oldAverage = value(pkg, "oldAverage");
  const memberValue = value(pkg, "memberValue");
  const shift = value(pkg, "averageChange");
  const answer = pkg.answer;
  const final = language === "hi"
    ? `अतः प्रारंभिक सदस्यों की संख्या ${answer} है।`
    : `ਇਸ ਲਈ ਸ਼ੁਰੂਆਤੀ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ ${answer} ਹੈ।`;

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
  if (
    english.solveMode !== "findOriginalCountFromJoiningMemberShift" &&
    english.solveMode !== "findOriginalCountFromLeavingMemberShift"
  ) {
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
