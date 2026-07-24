import { getAvg001QuestionEntry, getAvg001QuestionEntries, renderTemplate } from "./library";
import { runAvg001Pipeline } from "./pipeline";
import type { Avg001Language, Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export const AVG_001_CP002_MULTILINGUAL_PILOT = Object.freeze({
  releaseId: "AVG-001-CP002-HI-PA-v1-CANDIDATE",
  packageId: "AVG-001",
  canonicalProblemId: "AVG-CP-002",
  languages: ["hi", "pa"] as const,
  qlCount: 62,
  status: "MANUAL_REVIEW",
  editorialStatus: "PENDING",
  publiclyPublishable: false,
  createdAt: "2026-07-24",
});

type PilotLanguage = (typeof AVG_001_CP002_MULTILINGUAL_PILOT.languages)[number];
type RenderValues = Record<string, string | number>;

function qlNumber(qlId: string) {
  return Number(qlId.slice(-3));
}

const CP002_QL_IDS = getAvg001QuestionEntries()
  .filter((entry) => entry.cpId === "AVG-CP-002")
  .map((entry) => entry.qlId);

const HI_CONTEXTS: Record<string, string> = {
  Abstract: "संख्या-श्रृंखला",
  Classroom: "अंक-श्रृंखला",
  Commerce: "मूल्य-श्रृंखला",
  Factory: "उत्पादन-श्रृंखला",
  Sports: "स्कोर-श्रृंखला",
  Travel: "दूरी-श्रृंखला",
};

const PA_CONTEXTS: Record<string, string> = {
  Abstract: "ਸੰਖਿਆ-ਲੜੀ",
  Classroom: "ਅੰਕਾਂ ਦੀ ਲੜੀ",
  Commerce: "ਕੀਮਤਾਂ ਦੀ ਲੜੀ",
  Factory: "ਉਤਪਾਦਨ ਲੜੀ",
  Sports: "ਸਕੋਰ ਲੜੀ",
  Travel: "ਦੂਰੀ ਲੜੀ",
};

function contextLabel(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const map = language === "hi" ? HI_CONTEXTS : PA_CONTEXTS;
  return map[pkg.parameters.contextDomain] ?? (language === "hi" ? "समान अंतर वाली श्रृंखला" : "ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੀ ਲੜੀ");
}

function isSmallestTarget(pkg: Avg001QuestionPackage) {
  const target = String(pkg.parameters.values.targetExtreme ?? pkg.parameters.renderVariables.extremeLabel ?? "largest");
  return /small|least/i.test(target);
}

function extremeLabel(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  if (language === "hi") return isSmallestTarget(pkg) ? "सबसे छोटा" : "सबसे बड़ा";
  return isSmallestTarget(pkg) ? "ਸਭ ਤੋਂ ਛੋਟਾ" : "ਸਭ ਤੋਂ ਵੱਡਾ";
}

function nativeTemplate(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const context = contextLabel(pkg, language);
  const variant = qlNumber(pkg.questionLanguageId) % 4;

  if (language === "hi") {
    switch (pkg.solveMode) {
      case "findAverageOfConsecutiveSet":
        return [
          `${context} के पद {firstTerm} से {lastTerm} तक समान अंतर से हैं। इनका औसत ज्ञात कीजिए।`,
          `${context} का पहला पद {firstTerm} और अंतिम पद {lastTerm} है। श्रृंखला का औसत निकालिए।`,
          `{count} पदों वाली ${context} {firstTerm} से शुरू होकर {lastTerm} पर समाप्त होती है। औसत ज्ञात कीजिए।`,
          `${context} में पहला पद {firstTerm}, अंतिम पद {lastTerm} और समान अंतर {commonDifference} है। औसत बताइए।`,
        ][variant]!;
      case "findMiddleTermFromAverage":
        return [
          `{count} पदों वाली ${context} का औसत {average} है। मध्य पद ज्ञात कीजिए।`,
          `${context} में पदों की संख्या {count} है और औसत {average} है। बीच का पद निकालिए।`,
          `एक समान अंतर वाली ${context} के {count} पदों का औसत {average} है। मध्य पद क्या होगा?`,
          `${context} में {count} पद हैं। यदि औसत {average} है, तो मध्य पद ज्ञात कीजिए।`,
        ][variant]!;
      case "findExtremeFromAverageAndCount":
        return [
          `{count} पदों वाली ${context} का औसत {average} और समान अंतर {commonDifference} है। ${extremeLabel(pkg, language)} पद ज्ञात कीजिए।`,
          `${context} में {count} पद हैं, औसत {average} है और प्रत्येक अगला पद {commonDifference} अधिक है। ${extremeLabel(pkg, language)} पद निकालिए।`,
          `एक समान अंतर वाली ${context} के {count} पदों का औसत {average} है। समान अंतर {commonDifference} होने पर ${extremeLabel(pkg, language)} पद क्या होगा?`,
          `${context} का औसत {average}, पदों की संख्या {count} और समान अंतर {commonDifference} है। ${extremeLabel(pkg, language)} पद ज्ञात कीजिए।`,
        ][variant]!;
      case "findAverageOfOddOrEvenSet":
        return [
          `{firstTerm} से {lastTerm} तक समान अंतर वाली संख्याओं का औसत ज्ञात कीजिए।`,
          `{count} पदों की श्रृंखला {firstTerm} से शुरू होकर {lastTerm} पर समाप्त होती है। औसत निकालिए।`,
          `${context} का पहला पद {firstTerm} और अंतिम पद {lastTerm} है। इसका औसत क्या है?`,
          `{firstTerm}, {nextTerm}, …, {lastTerm} का औसत ज्ञात कीजिए।`,
        ][variant]!;
      case "findTermCountFromAverageAndExtreme":
        return `एक समान अंतर वाली श्रृंखला का औसत {average}, ${extremeLabel(pkg, language)} पद {extremeValue} और समान अंतर {commonDifference} है। पदों की संख्या ज्ञात कीजिए।`;
      case "findCommonDifferenceFromAverageCountAndExtreme":
        return `एक समान अंतर वाली श्रृंखला में {count} पद हैं, औसत {average} और ${extremeLabel(pkg, language)} पद {extremeValue} है। समान अंतर ज्ञात कीजिए।`;
      default:
        throw new Error(`Unsupported CP-002 localization mode: ${pkg.solveMode}`);
    }
  }

  switch (pkg.solveMode) {
    case "findAverageOfConsecutiveSet":
      return [
        `${context} ਦੇ ਪਦ {firstTerm} ਤੋਂ {lastTerm} ਤੱਕ ਬਰਾਬਰ ਅੰਤਰ ਨਾਲ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।`,
        `${context} ਦਾ ਪਹਿਲਾ ਪਦ {firstTerm} ਅਤੇ ਆਖਰੀ ਪਦ {lastTerm} ਹੈ। ਲੜੀ ਦੀ ਔਸਤ ਕੱਢੋ।`,
        `{count} ਪਦਾਂ ਵਾਲੀ ${context} {firstTerm} ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ {lastTerm} ਉੱਤੇ ਖਤਮ ਹੁੰਦੀ ਹੈ। ਔਸਤ ਪਤਾ ਕਰੋ।`,
        `${context} ਵਿੱਚ ਪਹਿਲਾ ਪਦ {firstTerm}, ਆਖਰੀ ਪਦ {lastTerm} ਅਤੇ ਸਾਂਝਾ ਅੰਤਰ {commonDifference} ਹੈ। ਔਸਤ ਦੱਸੋ।`,
      ][variant]!;
    case "findMiddleTermFromAverage":
      return [
        `{count} ਪਦਾਂ ਵਾਲੀ ${context} ਦੀ ਔਸਤ {average} ਹੈ। ਵਿਚਕਾਰਲਾ ਪਦ ਪਤਾ ਕਰੋ।`,
        `${context} ਵਿੱਚ ਪਦਾਂ ਦੀ ਗਿਣਤੀ {count} ਹੈ ਅਤੇ ਔਸਤ {average} ਹੈ। ਮੱਧਲਾ ਪਦ ਕੱਢੋ।`,
        `ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੀ ${context} ਦੇ {count} ਪਦਾਂ ਦੀ ਔਸਤ {average} ਹੈ। ਵਿਚਕਾਰਲਾ ਪਦ ਕੀ ਹੋਵੇਗਾ?`,
        `${context} ਵਿੱਚ {count} ਪਦ ਹਨ। ਜੇ ਔਸਤ {average} ਹੈ, ਤਾਂ ਮੱਧਲਾ ਪਦ ਪਤਾ ਕਰੋ।`,
      ][variant]!;
    case "findExtremeFromAverageAndCount":
      return [
        `{count} ਪਦਾਂ ਵਾਲੀ ${context} ਦੀ ਔਸਤ {average} ਅਤੇ ਸਾਂਝਾ ਅੰਤਰ {commonDifference} ਹੈ। ${extremeLabel(pkg, language)} ਪਦ ਪਤਾ ਕਰੋ।`,
        `${context} ਵਿੱਚ {count} ਪਦ ਹਨ, ਔਸਤ {average} ਹੈ ਅਤੇ ਹਰ ਅਗਲਾ ਪਦ {commonDifference} ਵੱਧ ਹੈ। ${extremeLabel(pkg, language)} ਪਦ ਕੱਢੋ।`,
        `ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੀ ${context} ਦੇ {count} ਪਦਾਂ ਦੀ ਔਸਤ {average} ਹੈ। ਸਾਂਝਾ ਅੰਤਰ {commonDifference} ਹੋਣ ਉੱਤੇ ${extremeLabel(pkg, language)} ਪਦ ਕੀ ਹੋਵੇਗਾ?`,
        `${context} ਦੀ ਔਸਤ {average}, ਪਦਾਂ ਦੀ ਗਿਣਤੀ {count} ਅਤੇ ਸਾਂਝਾ ਅੰਤਰ {commonDifference} ਹੈ। ${extremeLabel(pkg, language)} ਪਦ ਪਤਾ ਕਰੋ।`,
      ][variant]!;
    case "findAverageOfOddOrEvenSet":
      return [
        `{firstTerm} ਤੋਂ {lastTerm} ਤੱਕ ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੀਆਂ ਸੰਖਿਆਵਾਂ ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।`,
        `{count} ਪਦਾਂ ਦੀ ਲੜੀ {firstTerm} ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ {lastTerm} ਉੱਤੇ ਖਤਮ ਹੁੰਦੀ ਹੈ। ਔਸਤ ਕੱਢੋ।`,
        `${context} ਦਾ ਪਹਿਲਾ ਪਦ {firstTerm} ਅਤੇ ਆਖਰੀ ਪਦ {lastTerm} ਹੈ। ਇਸ ਦੀ ਔਸਤ ਕੀ ਹੈ?`,
        `{firstTerm}, {nextTerm}, …, {lastTerm} ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।`,
      ][variant]!;
    case "findTermCountFromAverageAndExtreme":
      return `ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੀ ਲੜੀ ਦੀ ਔਸਤ {average}, ${extremeLabel(pkg, language)} ਪਦ {extremeValue} ਅਤੇ ਸਾਂਝਾ ਅੰਤਰ {commonDifference} ਹੈ। ਪਦਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`;
    case "findCommonDifferenceFromAverageCountAndExtreme":
      return `ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੀ ਲੜੀ ਵਿੱਚ {count} ਪਦ ਹਨ, ਔਸਤ {average} ਅਤੇ ${extremeLabel(pkg, language)} ਪਦ {extremeValue} ਹੈ। ਸਾਂਝਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।`;
    default:
      throw new Error(`Unsupported CP-002 localization mode: ${pkg.solveMode}`);
  }
}

function value(values: RenderValues, key: string) {
  return String(values[key] ?? "");
}

function localizedExplanation(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const v = pkg.parameters.renderVariables;
  const first = value(v, "firstTerm");
  const last = value(v, "lastTerm");
  const average = value(v, "average");
  const count = value(v, "count");
  const difference = value(v, "commonDifference");
  const extreme = value(v, "extremeValue") || (isSmallestTarget(pkg) ? first : last);
  const answer = pkg.answer;

  if (language === "hi") {
    switch (pkg.solveMode) {
      case "findAverageOfConsecutiveSet":
      case "findAverageOfOddOrEvenSet":
        return { lines: [
          "समान अंतर वाली श्रृंखला में औसत पहले और अंतिम पद के मध्य होता है।",
          `$$औसत = (${first} + ${last}) \\div 2$$`,
          `$$औसत = ${answer}$$`,
          `अतः श्रृंखला का औसत ${answer} है।`,
        ] };
      case "findMiddleTermFromAverage":
        return { lines: [
          "विषम संख्या में समान अंतर वाले पदों का मध्य पद औसत के बराबर होता है।",
          `$$मध्य पद = औसत = ${average}$$`,
          `$$मध्य पद = ${answer}$$`,
          `अतः आवश्यक मध्य पद ${answer} है।`,
        ] };
      case "findExtremeFromAverageAndCount": {
        const gaps = String((Number(count) - 1) / 2);
        return { lines: [
          "चरम पद औसत से आधी कुल दूरी पर स्थित होता है।",
          `$$एक ओर के अंतर = (${count} - 1) \\div 2 = ${gaps}$$`,
          `$$${extremeLabel(pkg, language)} पद = ${average} ${isSmallestTarget(pkg) ? "-" : "+"} ${gaps} \\times ${difference} = ${answer}$$`,
          `अतः ${extremeLabel(pkg, language)} पद ${answer} है।`,
        ] };
      }
      case "findTermCountFromAverageAndExtreme": {
        const oneSide = difference ? Math.abs(Number(extreme) - Number(average)) / Number(difference) : 0;
        return { lines: [
          "औसत से चरम पद तक के समान अंतरों की संख्या पहले ज्ञात करते हैं।",
          `$$एक ओर के अंतर = |${extreme} - ${average}| \\div ${difference} = ${oneSide}$$`,
          `$$कुल पद = 2 \\times ${oneSide} + 1 = ${answer}$$`,
          `अतः श्रृंखला में ${answer} पद हैं।`,
        ] };
      }
      case "findCommonDifferenceFromAverageCountAndExtreme": {
        const gaps = (Number(count) - 1) / 2;
        return { lines: [
          "औसत से चरम पद तक आधे अंतर होते हैं।",
          `$$एक ओर के अंतर = (${count} - 1) \\div 2 = ${gaps}$$`,
          `$$समान अंतर = |${extreme} - ${average}| \\div ${gaps} = ${answer}$$`,
          `अतः समान अंतर ${answer} है।`,
        ] };
      }
    }
  }

  switch (pkg.solveMode) {
    case "findAverageOfConsecutiveSet":
    case "findAverageOfOddOrEvenSet":
      return { lines: [
        "ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੀ ਲੜੀ ਦੀ ਔਸਤ ਪਹਿਲੇ ਅਤੇ ਆਖਰੀ ਪਦ ਦੇ ਵਿਚਕਾਰ ਹੁੰਦੀ ਹੈ।",
        `$$ਔਸਤ = (${first} + ${last}) \\div 2$$`,
        `$$ਔਸਤ = ${answer}$$`,
        `ਇਸ ਲਈ ਲੜੀ ਦੀ ਔਸਤ ${answer} ਹੈ।`,
      ] };
    case "findMiddleTermFromAverage":
      return { lines: [
        "ਵਿਸ਼ਮ ਗਿਣਤੀ ਵਾਲੇ ਬਰਾਬਰ ਅੰਤਰ ਦੇ ਪਦਾਂ ਵਿੱਚ ਮੱਧਲਾ ਪਦ ਔਸਤ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।",
        `$$ਮੱਧਲਾ ਪਦ = ਔਸਤ = ${average}$$`,
        `$$ਮੱਧਲਾ ਪਦ = ${answer}$$`,
        `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਮੱਧਲਾ ਪਦ ${answer} ਹੈ।`,
      ] };
    case "findExtremeFromAverageAndCount": {
      const gaps = String((Number(count) - 1) / 2);
      return { lines: [
        "ਅੰਤਲਾ ਪਦ ਔਸਤ ਤੋਂ ਕੁੱਲ ਫੈਲਾਅ ਦੇ ਅੱਧੇ ਉੱਤੇ ਹੁੰਦਾ ਹੈ।",
        `$$ਇੱਕ ਪਾਸੇ ਦੇ ਅੰਤਰ = (${count} - 1) \\div 2 = ${gaps}$$`,
        `$$${extremeLabel(pkg, language)} ਪਦ = ${average} ${isSmallestTarget(pkg) ? "-" : "+"} ${gaps} \\times ${difference} = ${answer}$$`,
        `ਇਸ ਲਈ ${extremeLabel(pkg, language)} ਪਦ ${answer} ਹੈ।`,
      ] };
    }
    case "findTermCountFromAverageAndExtreme": {
      const oneSide = difference ? Math.abs(Number(extreme) - Number(average)) / Number(difference) : 0;
      return { lines: [
        "ਪਹਿਲਾਂ ਔਸਤ ਤੋਂ ਅੰਤਲੇ ਪਦ ਤੱਕ ਬਰਾਬਰ ਅੰਤਰਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢਦੇ ਹਾਂ।",
        `$$ਇੱਕ ਪਾਸੇ ਦੇ ਅੰਤਰ = |${extreme} - ${average}| \\div ${difference} = ${oneSide}$$`,
        `$$ਕੁੱਲ ਪਦ = 2 \\times ${oneSide} + 1 = ${answer}$$`,
        `ਇਸ ਲਈ ਲੜੀ ਵਿੱਚ ${answer} ਪਦ ਹਨ।`,
      ] };
    }
    case "findCommonDifferenceFromAverageCountAndExtreme": {
      const gaps = (Number(count) - 1) / 2;
      return { lines: [
        "ਔਸਤ ਤੋਂ ਅੰਤਲੇ ਪਦ ਤੱਕ ਅੱਧੇ ਅੰਤਰ ਹੁੰਦੇ ਹਨ।",
        `$$ਇੱਕ ਪਾਸੇ ਦੇ ਅੰਤਰ = (${count} - 1) \\div 2 = ${gaps}$$`,
        `$$ਸਾਂਝਾ ਅੰਤਰ = |${extreme} - ${average}| \\div ${gaps} = ${answer}$$`,
        `ਇਸ ਲਈ ਸਾਂਝਾ ਅੰਤਰ ${answer} ਹੈ।`,
      ] };
    }
    default:
      throw new Error(`Unsupported CP-002 explanation mode: ${pkg.solveMode}`);
  }
}

function validationChecks(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter(
    (check) => !["language", "maturity", "release-approval", "resolved-stem", "explanation-depth", "explanation-arithmetic", "explanation-answer"].includes(check.name),
  );
  const text = `${pkg.stem}\n${pkg.explanation.lines.join("\n")}`;
  const devanagariLetters = /[\u0900-\u0963\u0970-\u097F]/;
  const gurmukhiLetters = /[\u0A01-\u0A74]/;
  const expectedScript = language === "hi" ? devanagariLetters : gurmukhiLetters;
  const wrongScript = language === "hi" ? gurmukhiLetters : devanagariLetters;
  checks.push(
    { name: "localized-language", passed: pkg.language === language, message: `Package language is ${language}` },
    { name: "localized-script", passed: expectedScript.test(text) && !wrongScript.test(text), message: "Localized prose uses the expected Indic script" },
    { name: "localized-stem", passed: !/[{}]|undefined|NaN|Infinity|null/.test(pkg.stem), message: "Localized stem is fully rendered" },
    { name: "localized-explanation", passed: pkg.explanation.lines.length === 4 && pkg.explanation.lines.some((line) => line.includes(pkg.answer)), message: "Localized explanation has four lines and answer evidence" },
    { name: "localization-candidate", passed: pkg.maturity === "MANUAL_REVIEW" && !pkg.publiclyPublishable, message: "Pilot remains non-publishable pending review" },
  );
  return checks;
}

export function getAvg001Cp002LocalizedQlIds() {
  return [...CP002_QL_IDS];
}

export function runAvg001Cp002LocalizationPilot(input: {
  questionLanguageId: string;
  seed: string;
  language: PilotLanguage;
}): Avg001QuestionPackage {
  const entry = getAvg001QuestionEntry(input.questionLanguageId);
  if (entry.cpId !== AVG_001_CP002_MULTILINGUAL_PILOT.canonicalProblemId) {
    throw new Error(`${input.questionLanguageId} is outside the AVG-001 CP-002 multilingual pilot`);
  }

  const english = runAvg001Pipeline({ questionLanguageId: input.questionLanguageId, seed: input.seed, language: "en" });
  const variables: RenderValues = { ...english.parameters.renderVariables };
  if (!("extremeValue" in variables)) {
    variables.extremeValue = String(isSmallestTarget(english) ? variables.firstTerm : variables.lastTerm);
  }
  const localized: Avg001QuestionPackage = {
    ...english,
    questionId: `${english.questionId}:${input.language}`,
    language: input.language as Avg001Language,
    stem: renderTemplate(nativeTemplate(english, input.language), variables),
    parameters: { ...english.parameters, language: input.language as Avg001Language },
    explanation: localizedExplanation(english, input.language),
    maturity: "MANUAL_REVIEW",
    publiclyPublishable: false,
    traceability: {
      ...english.traceability,
      localizationReleaseId: AVG_001_CP002_MULTILINGUAL_PILOT.releaseId,
      localizationStatus: AVG_001_CP002_MULTILINGUAL_PILOT.status,
      editorialStatus: AVG_001_CP002_MULTILINGUAL_PILOT.editorialStatus,
      localizedLanguage: input.language,
      sourceEnglishReleaseId: english.traceability.releaseId,
      publiclyPublishable: false,
    },
  };
  const checks = validationChecks(localized, input.language);
  return { ...localized, validation: { valid: checks.every((check) => check.passed), checks } };
}
