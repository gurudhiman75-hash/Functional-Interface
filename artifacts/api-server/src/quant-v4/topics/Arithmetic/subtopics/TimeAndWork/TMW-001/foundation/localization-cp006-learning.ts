import { required } from "./cp001-helpers";
import { toLatex } from "./rational";
import type {
  TmwCp006GeneratedQuestion,
  TmwCp006MisconceptionId,
  TmwCp006RuleId,
  TmwCp006SolveMode,
} from "./cp006-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import {
  cp006Copy,
  cp006Days,
  cp006Dimensions,
  cp006Hours,
  cp006LocalizedAnswerText,
  cp006Number,
  cp006Resource,
} from "./localization-cp006-language";

function pair(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function inline(latex: string): string {
  return `\\(${latex}\\)`;
}

export function tmwCp006LocalizedOpening(
  ruleId: TmwCp006RuleId,
  language: TmwLocalizedLanguage,
): string {
  const values: Record<TmwCp006RuleId, [string, string]> = {
    TMW_EQUIVALENT_STATES: [
      "दोनों व्यवस्थाओं की कुल उत्पादक क्षमता बराबर रखें। संसाधन, दिन, प्रतिदिन घंटे, दक्षता और काम की मात्रा—हर बदले हुए गुणक को सही दिशा में शामिल करें।",
      "ਦੋਵਾਂ ਵਿਵਸਥਾਵਾਂ ਦੀ ਕੁੱਲ ਉਤਪਾਦਕ ਸਮਰੱਥਾ ਬਰਾਬਰ ਰੱਖੋ। ਸਰੋਤ, ਦਿਨ, ਹਰ ਦਿਨ ਦੇ ਘੰਟੇ, ਦੱਖਤਾ ਅਤੇ ਕੰਮ ਦੀ ਮਾਤਰਾ—ਹਰ ਬਦਲੇ ਗੁਣਕ ਨੂੰ ਸਹੀ ਦਿਸ਼ਾ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ।",
    ],
    TMW_CHANGE_COUNT: [
      "पहले बदली समय-सीमा के लिए कुल आवश्यक संख्या निकालें। फिर प्रश्न के अनुसार वर्तमान संख्या घटाकर अतिरिक्त या हटाई गई संख्या प्राप्त करें।",
      "ਪਹਿਲਾਂ ਬਦਲੀ ਸਮਾਂ-ਸੀਮਾ ਲਈ ਕੁੱਲ ਲੋੜੀਂਦੀ ਗਿਣਤੀ ਕੱਢੋ। ਫਿਰ ਪ੍ਰਸ਼ਨ ਅਨੁਸਾਰ ਮੌਜੂਦਾ ਗਿਣਤੀ ਘਟਾ ਕੇ ਵਾਧੂ ਜਾਂ ਹਟਾਈ ਗਿਣਤੀ ਪ੍ਰਾਪਤ ਕਰੋ।",
    ],
    TMW_PROGRESS_RECOVERY: [
      "अब तक हुई वास्तविक प्रगति से वास्तविक गति निकालें। शेष काम और शेष समय पर उसी गति को लागू करें।",
      "ਹੁਣ ਤੱਕ ਹੋਈ ਅਸਲ ਤਰੱਕੀ ਤੋਂ ਅਸਲ ਗਤੀ ਕੱਢੋ। ਬਾਕੀ ਕੰਮ ਅਤੇ ਬਾਕੀ ਸਮੇਂ ਉੱਤੇ ਉਸੇ ਗਤੀ ਨੂੰ ਲਾਗੂ ਕਰੋ।",
    ],
    TMW_SCHEDULE_VARIANCE: [
      "योजना और बदली व्यवस्था की दैनिक क्षमता अलग-अलग लिखें। अनुपस्थित कर्मचारी, घटे कर्मचारी या अतिरिक्त घंटे केवल बदली व्यवस्था में लगाएँ।",
      "ਯੋਜਨਾ ਅਤੇ ਬਦਲੀ ਵਿਵਸਥਾ ਦੀ ਰੋਜ਼ਾਨਾ ਸਮਰੱਥਾ ਵੱਖ-ਵੱਖ ਲਿਖੋ। ਗੈਰਹਾਜ਼ਰ ਕਰਮਚਾਰੀ, ਘਟੇ ਕਰਮਚਾਰੀ ਜਾਂ ਵਾਧੂ ਘੰਟੇ ਸਿਰਫ਼ ਬਦਲੀ ਵਿਵਸਥਾ ਵਿੱਚ ਲਗਾਓ।",
    ],
    TMW_PRODUCTION_SCALING: [
      "प्रति संसाधन प्रति पाली उत्पादन समान है। कुल उत्पादन को संसाधनों की संख्या और पालियों की संख्या के साथ सीधे बढ़ाएँ या घटाएँ।",
      "ਪ੍ਰਤੀ ਸਰੋਤ ਪ੍ਰਤੀ ਸ਼ਿਫ਼ਟ ਉਤਪਾਦਨ ਇੱਕੋ ਹੈ। ਕੁੱਲ ਉਤਪਾਦਨ ਨੂੰ ਸਰੋਤਾਂ ਦੀ ਗਿਣਤੀ ਅਤੇ ਸ਼ਿਫ਼ਟਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਸਿੱਧਾ ਵਧਾਓ ਜਾਂ ਘਟਾਓ।",
    ],
    TMW_DIMENSIONAL_WORK: [
      "पहले संबंधित लंबाई, चौड़ाई, ऊँचाई, मोटाई या गहराई का गुणन करके काम का अनुपात निकालें। फिर संसाधन और समय का समायोजन करें।",
      "ਪਹਿਲਾਂ ਸੰਬੰਧਿਤ ਲੰਬਾਈ, ਚੌੜਾਈ, ਉਚਾਈ, ਮੋਟਾਈ ਜਾਂ ਡੂੰਘਾਈ ਦਾ ਗੁਣਾ ਕਰਕੇ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ। ਫਿਰ ਸਰੋਤ ਅਤੇ ਸਮੇਂ ਦਾ ਸਮਾਯੋਜਨ ਕਰੋ।",
    ],
    TMW_RESOURCE_STOCK: [
      "पहले बीते दिनों में खर्च हुआ भंडार घटाएँ। बचे हुए व्यक्ति-दिन को बदली जनसंख्या से भाग दें।",
      "ਪਹਿਲਾਂ ਬੀਤੇ ਦਿਨਾਂ ਵਿੱਚ ਵਰਤਿਆ ਭੰਡਾਰ ਘਟਾਓ। ਬਚੇ ਵਿਅਕਤੀ-ਦਿਨ ਨੂੰ ਬਦਲੀ ਆਬਾਦੀ ਨਾਲ ਭਾਗ ਦਿਓ।",
    ],
    TMW_BATCH_SERIES: [
      "हर दिन काम करने वालों की संख्या बदलती है। दिनवार संख्याओं का अंकगणितीय श्रेणी के रूप में योग लेकर आवश्यक श्रमिक-दिन से मिलाएँ।",
      "ਹਰ ਦਿਨ ਕੰਮ ਕਰਨ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਬਦਲਦੀ ਹੈ। ਦਿਨਵਾਰ ਗਿਣਤੀਆਂ ਦਾ ਅੰਕਗਣਿਤੀ ਲੜੀ ਵਜੋਂ ਜੋੜ ਲੈ ਕੇ ਲੋੜੀਂਦੇ ਮਜ਼ਦੂਰ-ਦਿਨ ਨਾਲ ਮਿਲਾਓ।",
    ],
    TMW_RESOURCE_TIME: [
      "संसाधनों की संख्या को उनकी कार्य-अवधि से गुणा करें। अवधि की इकाई वही रखें जो प्रश्न में संसाधन-समय के लिए माँगी गई है।",
      "ਸਰੋਤਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਉਨ੍ਹਾਂ ਦੀ ਕੰਮ ਮਿਆਦ ਨਾਲ ਗੁਣਾ ਕਰੋ। ਮਿਆਦ ਦੀ ਇਕਾਈ ਉਹੀ ਰੱਖੋ ਜੋ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਸਰੋਤ-ਸਮੇਂ ਲਈ ਮੰਗੀ ਗਈ ਹੈ।",
    ],
  };
  return values[ruleId][language === "hi" ? 0 : 1];
}

function stateLine(
  labelHi: string,
  labelPa: string,
  source: TmwCp006GeneratedQuestion,
  state: TmwCp006GeneratedQuestion["parameters"]["stateA"],
  language: TmwLocalizedLanguage,
): string {
  const label = pair(language, labelHi, labelPa);
  return `${label}: ${inline(`N=${toLatex(state.resources)},\\;D=${toLatex(state.days)},\\;H=${toLatex(state.hoursPerDay)},\\;E=${toLatex(state.efficiency)},\\;W=${toLatex(state.work)}`)}`;
}

export function tmwCp006LocalizedGivens(
  source: TmwCp006GeneratedQuestion,
  language: TmwLocalizedLanguage,
): string[] {
  const p = source.parameters;
  const lines = [
    stateLine("मूल व्यवस्था", "ਮੂਲ ਵਿਵਸਥਾ", source, p.stateA, language),
    stateLine("बदली व्यवस्था", "ਬਦਲੀ ਵਿਵਸਥਾ", source, p.stateB, language),
  ];
  switch (source.solveMode) {
    case "findRemainingDaysFromActualProgress":
    case "findExtraWorkersFromPlannedVsActualProgress":
      lines.push(pair(
        language,
        `वास्तविक प्रगति: ${cp006Days(required(p.elapsedDays, "elapsedDays"), language)} में ${cp006Number(required(p.completedFraction, "completedFraction"))} भाग काम।`,
        `ਅਸਲ ਤਰੱਕੀ: ${cp006Days(required(p.elapsedDays, "elapsedDays"), language)} ਵਿੱਚ ${cp006Number(required(p.completedFraction, "completedFraction"))} ਹਿੱਸਾ ਕੰਮ।`,
      ));
      break;
    case "findResourceDurationAfterPopulationChange":
      lines.push(pair(
        language,
        `जनसंख्या: पहले ${cp006Number(required(p.initialPopulation, "initialPopulation"))}, बाद में ${cp006Number(required(p.changedPopulation, "changedPopulation"))}; परिवर्तन ${cp006Days(required(p.elapsedBeforePopulationChange, "elapsedBeforePopulationChange"), language)} बाद।`,
        `ਆਬਾਦੀ: ਪਹਿਲਾਂ ${cp006Number(required(p.initialPopulation, "initialPopulation"))}, ਬਾਅਦ ਵਿੱਚ ${cp006Number(required(p.changedPopulation, "changedPopulation"))}; ਬਦਲਾਅ ${cp006Days(required(p.elapsedBeforePopulationChange, "elapsedBeforePopulationChange"), language)} ਬਾਅਦ।`,
      ));
      break;
    case "findCompletionTimeAfterAbsenteeism":
      lines.push(pair(language, `अनुपस्थित: ${cp006Number(required(p.absentPercent, "absentPercent"))}%`, `ਗੈਰਹਾਜ਼ਰ: ${cp006Number(required(p.absentPercent, "absentPercent"))}%`));
      break;
    case "findCompletionWithBatchWorkerAdditions":
      lines.push(pair(
        language,
        `पहले दिन ${cp006Number(required(p.initialBatchResources, "initialBatchResources"))} ${cp006Copy(p.context.resourcePlural, language)}; हर अगले दिन ${cp006Number(required(p.batchAddition, "batchAddition"))} और जुड़ते हैं।`,
        `ਪਹਿਲੇ ਦਿਨ ${cp006Number(required(p.initialBatchResources, "initialBatchResources"))} ${cp006Copy(p.context.resourcePlural, language)}; ਹਰ ਅਗਲੇ ਦਿਨ ${cp006Number(required(p.batchAddition, "batchAddition"))} ਹੋਰ ਜੁੜਦੇ ਹਨ।`,
      ));
      break;
    case "findDimensionalWorkRatio":
    case "findWorkersForChangedDimensions":
    case "findDaysForChangedDimensions": {
      const labels = required(p.dimensionLabels, "dimensionLabels");
      lines.push(pair(
        language,
        `मूल आयाम: ${cp006Dimensions(required(p.dimensionsA, "dimensionsA"), labels, language)}; बदले आयाम: ${cp006Dimensions(required(p.dimensionsB, "dimensionsB"), labels, language)}।`,
        `ਮੂਲ ਮਾਪ: ${cp006Dimensions(required(p.dimensionsA, "dimensionsA"), labels, language)}; ਬਦਲੇ ਮਾਪ: ${cp006Dimensions(required(p.dimensionsB, "dimensionsB"), labels, language)}।`,
      ));
      break;
    }
  }
  return lines;
}

const shortcutTitles: Record<TmwCp006SolveMode, [string, string]> = {
  findRequiredResourceCount: ["10-सेकंड समान क्षमता", "10-ਸਕਿੰਟ ਬਰਾਬਰ ਸਮਰੱਥਾ"],
  findRequiredDays: ["10-सेकंड दिन अनुपात", "10-ਸਕਿੰਟ ਦਿਨ ਅਨੁਪਾਤ"],
  findRequiredDailyHours: ["10-सेकंड घंटे अनुपात", "10-ਸਕਿੰਟ ਘੰਟੇ ਅਨੁਪਾਤ"],
  findRelativeEfficiency: ["10-सेकंड दक्षता गुणक", "10-ਸਕਿੰਟ ਦੱਖਤਾ ਗੁਣਕ"],
  findWorkQuantity: ["10-सेकंड उत्पादन माप", "10-ਸਕਿੰਟ ਉਤਪਾਦਨ ਮਾਪ"],
  findWorkQuantityRatio: ["10-सेकंड क्षमता अनुपात", "10-ਸਕਿੰਟ ਸਮਰੱਥਾ ਅਨੁਪਾਤ"],
  findAdditionalWorkersForDeadline: ["10-सेकंड कुल फिर अतिरिक्त", "10-ਸਕਿੰਟ ਕੁੱਲ ਫਿਰ ਵਾਧੂ"],
  findWorkersRemovedForDelay: ["10-सेकंड आवश्यक फिर हटाए", "10-ਸਕਿੰਟ ਲੋੜੀਂਦੇ ਫਿਰ ਹਟਾਏ"],
  findOriginalWorkforceFromChangedSchedule: ["10-सेकंड उलटी श्रमिक-दिन गणना", "10-ਸਕਿੰਟ ਉਲਟੀ ਮਜ਼ਦੂਰ-ਦਿਨ ਗਿਣਤੀ"],
  findRemainingDaysFromActualProgress: ["10-सेकंड पूरा बनाम शेष", "10-ਸਕਿੰਟ ਪੂਰਾ ਬਨਾਮ ਬਾਕੀ"],
  findExtraWorkersFromPlannedVsActualProgress: ["10-सेकंड वास्तविक गति से नई संख्या", "10-ਸਕਿੰਟ ਅਸਲ ਗਤੀ ਨਾਲ ਨਵੀਂ ਗਿਣਤੀ"],
  findPercentWorkCompletedFromResourceHours: ["10-सेकंड संसाधन-घंटे प्रतिशत", "10-ਸਕਿੰਟ ਸਰੋਤ-ਘੰਟੇ ਪ੍ਰਤੀਸ਼ਤ"],
  findPercentScheduleDelay: ["10-सेकंड नई अवधि से देरी", "10-ਸਕਿੰਟ ਨਵੀਂ ਮਿਆਦ ਤੋਂ ਦੇਰੀ"],
  findOvertimeHoursForDeadline: ["10-सेकंड कुल घंटे फिर अतिरिक्त", "10-ਸਕਿੰਟ ਕੁੱਲ ਘੰਟੇ ਫਿਰ ਵਾਧੂ"],
  findShiftCountForProductionTarget: ["10-सेकंड प्रति पाली उत्पादन", "10-ਸਕਿੰਟ ਪ੍ਰਤੀ ਸ਼ਿਫ਼ਟ ਉਤਪਾਦਨ"],
  findDimensionalWorkRatio: ["10-सेकंड आयामों का गुणन", "10-ਸਕਿੰਟ ਮਾਪਾਂ ਦਾ ਗੁਣਾ"],
  findWorkersForChangedDimensions: ["10-सेकंड काम अनुपात से संख्या", "10-ਸਕਿੰਟ ਕੰਮ ਅਨੁਪਾਤ ਤੋਂ ਗਿਣਤੀ"],
  findDaysForChangedDimensions: ["10-सेकंड काम अनुपात से दिन", "10-ਸਕਿੰਟ ਕੰਮ ਅਨੁਪਾਤ ਤੋਂ ਦਿਨ"],
  findResourceDurationAfterPopulationChange: ["10-सेकंड व्यक्ति-दिन भंडार", "10-ਸਕਿੰਟ ਵਿਅਕਤੀ-ਦਿਨ ਭੰਡਾਰ"],
  findCompletionTimeAfterAbsenteeism: ["10-सेकंड सक्रिय कर्मचारी", "10-ਸਕਿੰਟ ਸਰਗਰਮ ਕਰਮਚਾਰੀ"],
  findCompletionWithBatchWorkerAdditions: ["10-सेकंड दिनवार श्रेणी", "10-ਸਕਿੰਟ ਦਿਨਵਾਰ ਲੜੀ"],
  findEquivalentResourceTime: ["10-सेकंड संसाधन × समय", "10-ਸਕਿੰਟ ਸਰੋਤ × ਸਮਾਂ"],
};

export function tmwCp006LocalizedShortcut(
  source: TmwCp006GeneratedQuestion,
  answerText: string,
  language: TmwLocalizedLanguage,
): { title: string; steps: string[] } {
  const title = shortcutTitles[source.solveMode][language === "hi" ? 0 : 1];
  const modeStep: Record<TmwCp006SolveMode, [string, string]> = {
    findRequiredResourceCount: ["नई कुल संख्या निकालते समय दिन, घंटे और दक्षता के अनुपात उलटे तथा काम का अनुपात सीधा लगाएँ।", "ਨਵੀਂ ਕੁੱਲ ਗਿਣਤੀ ਕੱਢਦੇ ਸਮੇਂ ਦਿਨ, ਘੰਟੇ ਅਤੇ ਦੱਖਤਾ ਦੇ ਅਨੁਪਾਤ ਉਲਟੇ ਅਤੇ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ਸਿੱਧਾ ਲਗਾਓ।"],
    findRequiredDays: ["दिन संसाधन, प्रतिदिन घंटे और दक्षता के व्युत्क्रमानुपाती हैं।", "ਦਿਨ ਸਰੋਤ, ਹਰ ਦਿਨ ਦੇ ਘੰਟਿਆਂ ਅਤੇ ਦੱਖਤਾ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਹਨ।"],
    findRequiredDailyHours: ["आवश्यक प्रतिदिन घंटे संसाधन, दिन और दक्षता के व्युत्क्रमानुपाती हैं।", "ਲੋੜੀਂਦੇ ਹਰ ਦਿਨ ਦੇ ਘੰਟੇ ਸਰੋਤ, ਦਿਨ ਅਤੇ ਦੱਖਤਾ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਹਨ।"],
    findRelativeEfficiency: ["संसाधन, दिन और घंटे लगाने के बाद बचा गुणक दक्षता है।", "ਸਰੋਤ, ਦਿਨ ਅਤੇ ਘੰਟੇ ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ਬਚਿਆ ਗੁਣਕ ਦੱਖਤਾ ਹੈ।"],
    findWorkQuantity: ["उत्पादन को संसाधन संख्या और पालियों के संयुक्त अनुपात से मापें।", "ਉਤਪਾਦਨ ਨੂੰ ਸਰੋਤ ਗਿਣਤੀ ਅਤੇ ਸ਼ਿਫ਼ਟਾਂ ਦੇ ਸਾਂਝੇ ਅਨੁਪਾਤ ਨਾਲ ਮਾਪੋ।"],
    findWorkQuantityRatio: ["दोनों योजनाओं के संसाधन × दिन × घंटे × दक्षता का अनुपात लें।", "ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਦੇ ਸਰੋਤ × ਦਿਨ × ਘੰਟੇ × ਦੱਖਤਾ ਦਾ ਅਨੁਪਾਤ ਲਵੋ।"],
    findAdditionalWorkersForDeadline: ["पहले कुल आवश्यक कर्मचारी निकालें, फिर वर्तमान कर्मचारी घटाएँ।", "ਪਹਿਲਾਂ ਕੁੱਲ ਲੋੜੀਂਦੇ ਕਰਮਚਾਰੀ ਕੱਢੋ, ਫਿਰ ਮੌਜੂਦਾ ਕਰਮਚਾਰੀ ਘਟਾਓ।"],
    findWorkersRemovedForDelay: ["पहले लंबी अवधि के लिए आवश्यक बचे कर्मचारी निकालें, फिर मूल संख्या से घटाएँ।", "ਪਹਿਲਾਂ ਲੰਮੀ ਮਿਆਦ ਲਈ ਲੋੜੀਂਦੇ ਬਚੇ ਕਰਮਚਾਰੀ ਕੱਢੋ, ਫਿਰ ਮੂਲ ਗਿਣਤੀ ਵਿੱਚੋਂ ਘਟਾਓ।"],
    findOriginalWorkforceFromChangedSchedule: ["बदली संख्या × वास्तविक दिन को नियोजित दिनों से भाग दें।", "ਬਦਲੀ ਗਿਣਤੀ × ਅਸਲ ਦਿਨ ਨੂੰ ਯੋਜਿਤ ਦਿਨਾਂ ਨਾਲ ਭਾਗ ਦਿਓ।"],
    findRemainingDaysFromActualProgress: ["उसी गति पर समय का अनुपात शेष काम और पूरे काम के अनुपात जैसा होगा।", "ਉਸੇ ਗਤੀ ਉੱਤੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਬਾਕੀ ਕੰਮ ਅਤੇ ਪੂਰੇ ਕੰਮ ਦੇ ਅਨੁਪਾਤ ਵਰਗਾ ਹੋਵੇਗਾ।"],
    findExtraWorkersFromPlannedVsActualProgress: ["पहले वास्तविक प्रति-कर्मचारी दैनिक गति, फिर बचे समय के लिए कुल संख्या निकालें।", "ਪਹਿਲਾਂ ਅਸਲ ਪ੍ਰਤੀ-ਕਰਮਚਾਰੀ ਰੋਜ਼ਾਨਾ ਗਤੀ, ਫਿਰ ਬਚੇ ਸਮੇਂ ਲਈ ਕੁੱਲ ਗਿਣਤੀ ਕੱਢੋ।"],
    findPercentWorkCompletedFromResourceHours: ["समान दक्षता काटकर उपयोग किए संसाधन-घंटों को पूरे काम के संसाधन-घंटों से तुलना करें।", "ਇੱਕੋ ਦੱਖਤਾ ਕੱਟ ਕੇ ਵਰਤੇ ਸਰੋਤ-ਘੰਟਿਆਂ ਦੀ ਪੂਰੇ ਕੰਮ ਦੇ ਸਰੋਤ-ਘੰਟਿਆਂ ਨਾਲ ਤੁਲਨਾ ਕਰੋ।"],
    findPercentScheduleDelay: ["पहले कम कर्मचारियों के साथ नई अवधि निकालें, फिर अतिरिक्त समय को नियोजित समय से प्रतिशत में तुलना करें।", "ਪਹਿਲਾਂ ਘੱਟ ਕਰਮਚਾਰੀਆਂ ਨਾਲ ਨਵੀਂ ਮਿਆਦ ਕੱਢੋ, ਫਿਰ ਵਾਧੂ ਸਮੇਂ ਦੀ ਯੋਜਿਤ ਸਮੇਂ ਨਾਲ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਤੁਲਨਾ ਕਰੋ।"],
    findOvertimeHoursForDeadline: ["कम कर्मचारियों के लिए कुल आवश्यक दैनिक घंटे निकालें और नियमित घंटे घटाएँ।", "ਘੱਟ ਕਰਮਚਾਰੀਆਂ ਲਈ ਕੁੱਲ ਲੋੜੀਂਦੇ ਰੋਜ਼ਾਨਾ ਘੰਟੇ ਕੱਢੋ ਅਤੇ ਨਿਯਮਤ ਘੰਟੇ ਘਟਾਓ।"],
    findShiftCountForProductionTarget: ["एक पाली का संयुक्त उत्पादन निकालकर लक्ष्य उत्पादन को उससे भाग दें।", "ਇੱਕ ਸ਼ਿਫ਼ਟ ਦਾ ਸਾਂਝਾ ਉਤਪਾਦਨ ਕੱਢ ਕੇ ਟੀਚਾ ਉਤਪਾਦਨ ਨੂੰ ਉਸ ਨਾਲ ਭਾਗ ਦਿਓ।"],
    findDimensionalWorkRatio: ["हर कार्य के सभी संबंधित आयामों का गुणन करें और दूसरे को पहले से तुलना करें।", "ਹਰ ਕੰਮ ਦੇ ਸਾਰੇ ਸੰਬੰਧਿਤ ਮਾਪਾਂ ਦਾ ਗੁਣਾ ਕਰੋ ਅਤੇ ਦੂਜੇ ਦੀ ਪਹਿਲੇ ਨਾਲ ਤੁਲਨਾ ਕਰੋ।"],
    findWorkersForChangedDimensions: ["आयामों से काम का अनुपात निकालकर उपलब्ध दिनों के अनुसार कर्मचारी संख्या बदलें।", "ਮਾਪਾਂ ਤੋਂ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ਕੱਢ ਕੇ ਉਪਲਬਧ ਦਿਨਾਂ ਅਨੁਸਾਰ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਬਦਲੋ।"],
    findDaysForChangedDimensions: ["आयामों से काम का अनुपात निकालकर बदली कर्मचारी संख्या के अनुसार दिन बदलें।", "ਮਾਪਾਂ ਤੋਂ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ਕੱਢ ਕੇ ਬਦਲੀ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਅਨੁਸਾਰ ਦਿਨ ਬਦਲੋ।"],
    findResourceDurationAfterPopulationChange: ["कुल व्यक्ति-दिन में से बीते व्यक्ति-दिन घटाकर नई जनसंख्या से भाग दें।", "ਕੁੱਲ ਵਿਅਕਤੀ-ਦਿਨ ਵਿੱਚੋਂ ਬੀਤੇ ਵਿਅਕਤੀ-ਦਿਨ ਘਟਾ ਕੇ ਨਵੀਂ ਆਬਾਦੀ ਨਾਲ ਭਾਗ ਦਿਓ।"],
    findCompletionTimeAfterAbsenteeism: ["पहले उपस्थित प्रतिशत से सक्रिय संख्या निकालें; काम समान होने पर दिन उलटे अनुपात में बढ़ेंगे।", "ਪਹਿਲਾਂ ਹਾਜ਼ਰ ਪ੍ਰਤੀਸ਼ਤ ਤੋਂ ਸਰਗਰਮ ਗਿਣਤੀ ਕੱਢੋ; ਕੰਮ ਇੱਕੋ ਹੋਣ ਉੱਤੇ ਦਿਨ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਵਧਣਗੇ।"],
    findCompletionWithBatchWorkerAdditions: ["दिनवार कर्मचारी संख्या को अंकगणितीय श्रेणी में जोड़ें और कुल आवश्यक श्रमिक-दिन से मिलाएँ।", "ਦਿਨਵਾਰ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਨੂੰ ਅੰਕਗਣਿਤੀ ਲੜੀ ਵਿੱਚ ਜੋੜੋ ਅਤੇ ਕੁੱਲ ਲੋੜੀਂਦੇ ਮਜ਼ਦੂਰ-ਦਿਨ ਨਾਲ ਮਿਲਾਓ।"],
    findEquivalentResourceTime: ["संसाधनों की संख्या और समान इकाई में दी अवधि का सीधा गुणन करें।", "ਸਰੋਤਾਂ ਦੀ ਗਿਣਤੀ ਅਤੇ ਇੱਕੋ ਇਕਾਈ ਵਿੱਚ ਦਿੱਤੀ ਮਿਆਦ ਦਾ ਸਿੱਧਾ ਗੁਣਾ ਕਰੋ।"],
  };
  return { title, steps: [modeStep[source.solveMode][language === "hi" ? 0 : 1], pair(language, `अतः उत्तर ${answerText} है।`, `ਇਸ ਲਈ ਉੱਤਰ ${answerText} ਹੈ।`)] };
}

export function tmwCp006LocalizedTrapReason(
  misconceptionId: Exclude<TmwCp006MisconceptionId, "CORRECT">,
  language: TmwLocalizedLanguage,
): string {
  const reasons: Record<Exclude<TmwCp006MisconceptionId, "CORRECT">, [string, string]> = {
    BASELINE_STATE_REUSED: ["यह विकल्प बदली संख्या, घंटे, समय-सीमा, जनसंख्या या काम की मात्रा के बाद भी मूल मान दोहराता है।", "ਇਹ ਚੋਣ ਬਦਲੀ ਗਿਣਤੀ, ਘੰਟੇ, ਸਮਾਂ-ਸੀਮਾ, ਆਬਾਦੀ ਜਾਂ ਕੰਮ ਦੀ ਮਾਤਰਾ ਤੋਂ ਬਾਅਦ ਵੀ ਮੂਲ ਮੁੱਲ ਦੁਹਰਾਉਂਦੀ ਹੈ।"],
    DIRECT_INVERSE_PROPORTION_CONFUSED: ["यह विकल्प सीधे और उलटे अनुपात की दिशा बदल देता है। समान काम में कम दिन या कम कर्मचारी की भरपाई अधिक क्षमता से होती है।", "ਇਹ ਚੋਣ ਸਿੱਧੇ ਅਤੇ ਉਲਟ ਅਨੁਪਾਤ ਦੀ ਦਿਸ਼ਾ ਬਦਲ ਦਿੰਦੀ ਹੈ। ਇੱਕੋ ਕੰਮ ਵਿੱਚ ਘੱਟ ਦਿਨ ਜਾਂ ਘੱਟ ਕਰਮਚਾਰੀ ਦੀ ਭਰਪਾਈ ਵੱਧ ਸਮਰੱਥਾ ਨਾਲ ਹੁੰਦੀ ਹੈ।"],
    WORK_RATIO_OMITTED: ["यह विकल्प बदली काम-मात्रा, उत्पादन, पाली या संसाधन-समय का गुणक छोड़ देता है।", "ਇਹ ਚੋਣ ਬਦਲੀ ਕੰਮ-ਮਾਤਰਾ, ਉਤਪਾਦਨ, ਸ਼ਿਫ਼ਟ ਜਾਂ ਸਰੋਤ-ਸਮੇਂ ਦਾ ਗੁਣਕ ਛੱਡ ਦਿੰਦੀ ਹੈ।"],
    HOURS_FACTOR_OMITTED: ["यह विकल्प प्रतिदिन काम के घंटों में हुए बदलाव को शामिल नहीं करता।", "ਇਹ ਚੋਣ ਹਰ ਦਿਨ ਦੇ ਕੰਮ ਘੰਟਿਆਂ ਵਿੱਚ ਹੋਏ ਬਦਲਾਅ ਨੂੰ ਸ਼ਾਮਲ ਨਹੀਂ ਕਰਦੀ।"],
    EFFICIENCY_FACTOR_OMITTED: ["यह विकल्प प्रति संसाधन दक्षता के बदलाव को छोड़ देता है।", "ਇਹ ਚੋਣ ਪ੍ਰਤੀ ਸਰੋਤ ਦੱਖਤਾ ਦੇ ਬਦਲਾਅ ਨੂੰ ਛੱਡ ਦਿੰਦੀ ਹੈ।"],
    TOTAL_REPORTED_AS_CHANGE: ["यह विकल्प कुल आवश्यक संख्या देता है, जबकि प्रश्न केवल अतिरिक्त या हटाई गई संख्या पूछता है।", "ਇਹ ਚੋਣ ਕੁੱਲ ਲੋੜੀਂਦੀ ਗਿਣਤੀ ਦਿੰਦੀ ਹੈ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਸਿਰਫ਼ ਵਾਧੂ ਜਾਂ ਹਟਾਈ ਗਿਣਤੀ ਪੁੱਛਦਾ ਹੈ।"],
    CHANGE_REPORTED_AS_TOTAL: ["यह विकल्प बदलाव की संख्या को ही अंतिम कुल संख्या मान लेता है।", "ਇਹ ਚੋਣ ਬਦਲਾਅ ਦੀ ਗਿਣਤੀ ਨੂੰ ਹੀ ਅੰਤਿਮ ਕੁੱਲ ਗਿਣਤੀ ਮੰਨ ਲੈਂਦੀ ਹੈ।"],
    ELAPSED_PERIOD_IGNORED: ["यह विकल्प बीते समय में हो चुका काम या खर्च हो चुका भंडार नहीं घटाता।", "ਇਹ ਚੋਣ ਬੀਤੇ ਸਮੇਂ ਵਿੱਚ ਹੋਇਆ ਕੰਮ ਜਾਂ ਵਰਤਿਆ ਭੰਡਾਰ ਨਹੀਂ ਘਟਾਉਂਦੀ।"],
    COMPLETED_USED_AS_REMAINING: ["यह विकल्प पूरे काम में से पूरा हुआ भाग घटाने के बजाय उसी पूरे हुए भाग को शेष मानता है।", "ਇਹ ਚੋਣ ਪੂਰੇ ਕੰਮ ਵਿੱਚੋਂ ਪੂਰਾ ਹੋਇਆ ਹਿੱਸਾ ਘਟਾਉਣ ਦੀ ਥਾਂ ਉਸੇ ਹਿੱਸੇ ਨੂੰ ਬਾਕੀ ਮੰਨਦੀ ਹੈ।"],
    PERCENT_NOT_CONVERTED: ["यह विकल्प काम के भिन्न को 100 से गुणा किए बिना प्रतिशत मान लेता है।", "ਇਹ ਚੋਣ ਕੰਮ ਦੇ ਭਿੰਨ ਨੂੰ 100 ਨਾਲ ਗੁਣਾ ਕੀਤੇ ਬਿਨਾਂ ਪ੍ਰਤੀਸ਼ਤ ਮੰਨ ਲੈਂਦੀ ਹੈ।"],
    DIMENSION_FACTOR_OMITTED: ["यह विकल्प लंबाई, चौड़ाई, ऊँचाई, मोटाई या गहराई में से एक आवश्यक आयाम छोड़ देता है।", "ਇਹ ਚੋਣ ਲੰਬਾਈ, ਚੌੜਾਈ, ਉਚਾਈ, ਮੋਟਾਈ ਜਾਂ ਡੂੰਘਾਈ ਵਿੱਚੋਂ ਇੱਕ ਲੋੜੀਂਦਾ ਮਾਪ ਛੱਡ ਦਿੰਦੀ ਹੈ।"],
    ABSENTEES_TREATED_AS_PRESENT: ["यह विकल्प अनुपस्थित कर्मचारियों को भी सक्रिय दैनिक क्षमता में गिनता है।", "ਇਹ ਚੋਣ ਗੈਰਹਾਜ਼ਰ ਕਰਮਚਾਰੀਆਂ ਨੂੰ ਵੀ ਸਰਗਰਮ ਰੋਜ਼ਾਨਾ ਸਮਰੱਥਾ ਵਿੱਚ ਗਿਣਦੀ ਹੈ।"],
    ARITHMETIC_SERIES_IGNORED: ["यह विकल्प हर दिन बढ़ती कर्मचारी संख्या को स्थिर मानकर अंकगणितीय श्रेणी को छोड़ देता है।", "ਇਹ ਚੋਣ ਹਰ ਦਿਨ ਵਧਦੀ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਨੂੰ ਸਥਿਰ ਮੰਨ ਕੇ ਅੰਕਗਣਿਤੀ ਲੜੀ ਨੂੰ ਛੱਡ ਦਿੰਦੀ ਹੈ।"],
    PLAUSIBLE_SCALE_ERROR: ["यह विकल्प सही विधि के पास दिखता है, पर किसी अनुपात या अंतिम गुणा-भाग में पैमाना गलत लगाता है।", "ਇਹ ਚੋਣ ਸਹੀ ਵਿਧੀ ਦੇ ਨੇੜੇ ਲੱਗਦੀ ਹੈ, ਪਰ ਕਿਸੇ ਅਨੁਪਾਤ ਜਾਂ ਅੰਤਿਮ ਗੁਣਾ-ਭਾਗ ਵਿੱਚ ਪੈਮਾਨਾ ਗਲਤ ਲਗਾਉਂਦੀ ਹੈ।"],
  };
  return reasons[misconceptionId][language === "hi" ? 0 : 1];
}

export function tmwCp006LocalizedConclusion(
  source: TmwCp006GeneratedQuestion,
  answerText: string,
  language: TmwLocalizedLanguage,
): string {
  const resource = cp006Copy(source.parameters.context.resourceSingular, language);
  switch (source.solveMode) {
    case "findAdditionalWorkersForDeadline":
    case "findExtraWorkersFromPlannedVsActualProgress":
      return pair(language, `अतः ${answerText} अतिरिक्त जोड़ने होंगे।`, `ਇਸ ਲਈ ${answerText} ਵਾਧੂ ਜੋੜਣੇ ਪੈਣਗੇ।`);
    case "findWorkersRemovedForDelay":
      return pair(language, `अतः ${answerText} हटाए जा सकते हैं।`, `ਇਸ ਲਈ ${answerText} ਹਟਾਏ ਜਾ ਸਕਦੇ ਹਨ।`);
    case "findRequiredDailyHours":
      return pair(language, `अतः प्रत्येक ${resource} को ${answerText} काम करना होगा।`, `ਇਸ ਲਈ ਹਰ ${resource} ਨੂੰ ${answerText} ਕੰਮ ਕਰਨਾ ਪਵੇਗਾ।`);
    case "findOvertimeHoursForDeadline":
      return pair(language, `अतः प्रत्येक शेष ${resource} को ${answerText} काम करना होगा।`, `ਇਸ ਲਈ ਹਰ ਬਾਕੀ ${resource} ਨੂੰ ${answerText} ਕੰਮ ਕਰਨਾ ਪਵੇਗਾ।`);
    case "findWorkQuantity":
      return pair(language, `अतः नई उत्पादन व्यवस्था का उत्पादन ${answerText} है।`, `ਇਸ ਲਈ ਨਵੀਂ ਉਤਪਾਦਨ ਵਿਵਸਥਾ ਦਾ ਉਤਪਾਦਨ ${answerText} ਹੈ।`);
    case "findWorkQuantityRatio":
    case "findDimensionalWorkRatio":
      return pair(language, `अतः आवश्यक कार्य-अनुपात ${answerText} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਕੰਮ-ਅਨੁਪਾਤ ${answerText} ਹੈ।`);
    case "findPercentScheduleDelay":
      return pair(language, `अतः समय-सारणी में ${answerText} की देरी होती है।`, `ਇਸ ਲਈ ਸਮਾਂ-ਸਾਰਣੀ ਵਿੱਚ ${answerText} ਦੀ ਦੇਰੀ ਹੁੰਦੀ ਹੈ।`);
    case "findPercentWorkCompletedFromResourceHours":
      return pair(language, `अतः दिए संसाधन-घंटे कुल काम का ${answerText} पूरा करते हैं।`, `ਇਸ ਲਈ ਦਿੱਤੇ ਸਰੋਤ-ਘੰਟੇ ਕੁੱਲ ਕੰਮ ਦਾ ${answerText} ਪੂਰਾ ਕਰਦੇ ਹਨ।`);
    case "findEquivalentResourceTime":
      return pair(language, `अतः समतुल्य संसाधन-समय ${answerText} है।`, `ਇਸ ਲਈ ਬਰਾਬਰ ਸਰੋਤ-ਸਮਾਂ ${answerText} ਹੈ।`);
    default:
      return pair(language, `अतः सही उत्तर ${answerText} है।`, `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answerText} ਹੈ।`);
  }
}
