import { add, multiply, rational, toLatex } from "./rational";
import { validateTmwLearnerExplanationV2, type TmwLearnerExplanationV2 } from "./learner-explanation-contract";
import type { TmwCp006Parameters, TmwCp006Solution, TmwCp006SolveMode } from "./cp006-types";

type Language = "en" | "hi" | "pa";

interface Cp006Question {
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
  solveMode?: TmwCp006SolveMode | string;
  stem?: string;
  parameters?: TmwCp006Parameters;
  solution?: TmwCp006Solution;
  learnerExplanation?: TmwLearnerExplanationV2;
  validation?: { valid: boolean; errors: string[] };
  publiclyPublishable?: boolean;
}

function t(language: Language, en: string, hi: string, pa: string): string {
  return language === "hi" ? hi : language === "pa" ? pa : en;
}

function cleanLatex(value: string): string {
  return value
    .replace(/\\;?\s*\\text\{[^}]*\}/g, "")
    .replace(/\\quad\s*/g, "")
    .trim();
}

function rhs(value: string | undefined): string | null {
  if (!value) return null;
  const cleaned = cleanLatex(value);
  const proportional = cleaned.indexOf("\\propto");
  if (proportional >= 0) return cleaned.slice(proportional + "\\propto".length).trim() || null;
  const equals = cleaned.indexOf("=");
  return (equals >= 0 ? cleaned.slice(equals + 1) : cleaned).trim() || null;
}

function math(value: string | null): string | null {
  return value ? `\\(${value}\\)` : null;
}

function joined(first: string | undefined, second: string | undefined): string | null {
  const a = rhs(first);
  const b = rhs(second);
  if (!a) return math(b);
  if (!b || a.endsWith(`=${b}`) || a === b) return math(a);
  return math(`${a}=${b}`);
}

function step(label: string, value: string | null): string | null {
  return value ? `${label}: ${value}.` : null;
}

function fixStem(stem: string, qlId: string, language: Language): string {
  let fixed = stem;

  if (qlId === "TMW-QL-121") {
    if (language === "en") {
      fixed = fixed
        .replace(/proportional to the relevant volume/gi, "proportional to the relevant area or volume")
        .replace(/proportional to volume/gi, "proportional to the relevant area or volume");
    } else if (language === "hi") {
      fixed = fixed
        .replace(/कार्य संबंधित आयतन के समानुपाती है।/g, "कार्य की मात्रा संबंधित क्षेत्रफल या आयतन के समानुपाती है।")
        .replace(/कार्य आयतन के समानुपाती है।/g, "कार्य की मात्रा संबंधित क्षेत्रफल या आयतन के समानुपाती है।");
    } else {
      fixed = fixed
        .replace(/ਕੰਮ ਸੰਬੰਧਿਤ ਆਇਤਨ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੈ।/g, "ਕੰਮ ਦੀ ਮਾਤਰਾ ਸੰਬੰਧਿਤ ਖੇਤਰਫਲ ਜਾਂ ਆਇਤਨ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੈ।")
        .replace(/ਕੰਮ ਆਇਤਨ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੈ।/g, "ਕੰਮ ਦੀ ਮਾਤਰਾ ਸੰਬੰਧਿਤ ਖੇਤਰਫਲ ਜਾਂ ਆਇਤਨ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੈ।");
    }
  }

  if (qlId === "TMW-QL-115") {
    if (language === "hi") {
      fixed = fixed
        .replace(/सड़क-मरम्मत का काम का केवल/g, "सड़क-मरम्मत के काम का केवल")
        .replace(/चारदीवारी का निर्माण का केवल/g, "चारदीवारी के निर्माण का केवल")
        .replace(/दस्तावेज़ सत्यापन का काम का केवल/g, "दस्तावेज़ सत्यापन के काम का केवल")
        .replace(/पैकिंग का काम का केवल/g, "पैकिंग के काम का केवल")
        .replace(/रंगाई का काम का केवल/g, "रंगाई के काम का केवल")
        .replace(/निरीक्षण का कार्य का केवल/g, "निरीक्षण के कार्य का केवल");
    } else if (language === "pa") {
      fixed = fixed
        .replace(/ਸੜਕ ਮੁਰੰਮਤ ਦਾ ਕੰਮ ਦਾ ਸਿਰਫ਼/g, "ਸੜਕ ਮੁਰੰਮਤ ਦੇ ਕੰਮ ਦਾ ਸਿਰਫ਼")
        .replace(/ਚਾਰਦੀਵਾਰੀ ਦਾ ਨਿਰਮਾਣ ਦਾ ਸਿਰਫ਼/g, "ਚਾਰਦੀਵਾਰੀ ਦੇ ਨਿਰਮਾਣ ਦਾ ਸਿਰਫ਼")
        .replace(/ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ ਦਾ ਕੰਮ ਦਾ ਸਿਰਫ਼/g, "ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ ਦੇ ਕੰਮ ਦਾ ਸਿਰਫ਼")
        .replace(/ਪੈਕਿੰਗ ਦਾ ਕੰਮ ਦਾ ਸਿਰਫ਼/g, "ਪੈਕਿੰਗ ਦੇ ਕੰਮ ਦਾ ਸਿਰਫ਼")
        .replace(/ਰੰਗ ਕਰਨ ਦਾ ਕੰਮ ਦਾ ਸਿਰਫ਼/g, "ਰੰਗ ਕਰਨ ਦੇ ਕੰਮ ਦਾ ਸਿਰਫ਼")
        .replace(/ਜਾਂਚ ਦਾ ਕੰਮ ਦਾ ਸਿਰਫ਼/g, "ਜਾਂਚ ਦੇ ਕੰਮ ਦਾ ਸਿਰਫ਼");
    }
  }

  if (["TMW-QL-122", "TMW-QL-123"].includes(qlId)) {
    if (language === "hi") {
      fixed = fixed.replace(/आयाम वाले खुदाई का गड्ढा को/g, "आयाम वाले खुदाई के गड्ढे को");
    } else if (language === "pa") {
      fixed = fixed.replace(/ਮਾਪ ਵਾਲੇ ਖੁਦਾਈ ਦਾ ਖੱਡਾ ਨੂੰ/g, "ਮਾਪ ਵਾਲੇ ਖੁਦਾਈ ਦੇ ਖੱਡੇ ਨੂੰ");
    }
  }

  return fixed;
}

function methodFor(mode: string, language: Language): string {
  switch (mode) {
    case "findRequiredResourceCount": return t(language,
      "Equate the two work capacities and solve for the total resources required in the revised plan",
      "दोनों व्यवस्थाओं की कार्य-क्षमता बराबर रखकर नई योजना के लिए कुल आवश्यक कर्मचारियों की संख्या निकालें",
      "ਦੋਵੇਂ ਵਿਵਸਥਾਵਾਂ ਦੀ ਕੰਮ-ਸਮਰੱਥਾ ਬਰਾਬਰ ਰੱਖ ਕੇ ਨਵੀਂ ਯੋਜਨਾ ਲਈ ਕੁੱਲ ਲੋੜੀਂਦੇ ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ");
    case "findRequiredDays": return t(language,
      "Keep the workload unchanged and balance resources, daily hours and efficiency to find the new duration",
      "काम समान रखते हुए कर्मचारी संख्या, दैनिक घंटे और दक्षता का संतुलन बनाकर नया समय निकालें",
      "ਕੰਮ ਇੱਕੋ ਰੱਖਦੇ ਹੋਏ ਕਰਮਚਾਰੀ ਗਿਣਤੀ, ਰੋਜ਼ਾਨਾ ਘੰਟੇ ਅਤੇ ਦੱਖਤਾ ਦਾ ਸੰਤੁਲਨ ਬਣਾ ਕੇ ਨਵਾਂ ਸਮਾਂ ਕੱਢੋ");
    case "findRequiredDailyHours": return t(language,
      "Keep the workload unchanged and solve the capacity balance for the required hours per day",
      "काम समान रखते हुए क्षमता-संतुलन से प्रतिदिन आवश्यक घंटे निकालें",
      "ਕੰਮ ਇੱਕੋ ਰੱਖਦੇ ਹੋਏ ਸਮਰੱਥਾ-ਸੰਤੁਲਨ ਤੋਂ ਹਰ ਦਿਨ ਦੇ ਲੋੜੀਂਦੇ ਘੰਟੇ ਕੱਢੋ");
    case "findRelativeEfficiency": return t(language,
      "For the same work, compare resources, days and daily hours to recover the revised per-person efficiency",
      "समान काम के लिए कर्मचारी संख्या, दिन और दैनिक घंटों की तुलना करके नई प्रति-कर्मचारी दक्षता निकालें",
      "ਇੱਕੋ ਕੰਮ ਲਈ ਕਰਮਚਾਰੀ ਗਿਣਤੀ, ਦਿਨ ਅਤੇ ਰੋਜ਼ਾਨਾ ਘੰਟਿਆਂ ਦੀ ਤੁਲਨਾ ਕਰਕੇ ਨਵੀਂ ਪ੍ਰਤੀ-ਕਰਮਚਾਰੀ ਦੱਖਤਾ ਕੱਢੋ");
    case "findWorkQuantity": return t(language,
      "Scale the original output by the ratio of total resource-shifts in the two plans",
      "दोनों योजनाओं के कुल संसाधन-पाली अनुपात से मूल उत्पादन को बढ़ाएँ या घटाएँ",
      "ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਦੇ ਕੁੱਲ ਸਰੋਤ-ਸ਼ਿਫ਼ਟ ਅਨੁਪਾਤ ਨਾਲ ਮੂਲ ਉਤਪਾਦਨ ਨੂੰ ਵਧਾਓ ਜਾਂ ਘਟਾਓ");
    case "findWorkQuantityRatio": return t(language,
      "Compare the two plans through resources × days × daily hours × efficiency",
      "दोनों योजनाओं के काम की तुलना कर्मचारी संख्या × दिन × दैनिक घंटे × दक्षता से करें",
      "ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਦੇ ਕੰਮ ਦੀ ਤੁਲਨਾ ਕਰਮਚਾਰੀ ਗਿਣਤੀ × ਦਿਨ × ਰੋਜ਼ਾਨਾ ਘੰਟੇ × ਦੱਖਤਾ ਨਾਲ ਕਰੋ");
    case "findAdditionalWorkersForDeadline": return t(language,
      "First find the total workforce needed for the shorter deadline, then subtract the workforce already available",
      "पहले छोटी समय-सीमा के लिए कुल आवश्यक कर्मचारी निकालें, फिर पहले से उपलब्ध कर्मचारियों को घटाएँ",
      "ਪਹਿਲਾਂ ਛੋਟੀ ਸਮਾਂ-ਸੀਮਾ ਲਈ ਕੁੱਲ ਲੋੜੀਂਦੇ ਕਰਮਚਾਰੀ ਕੱਢੋ, ਫਿਰ ਪਹਿਲਾਂ ਤੋਂ ਮੌਜੂਦ ਕਰਮਚਾਰੀ ਘਟਾਓ");
    case "findWorkersRemovedForDelay": return t(language,
      "First find the workforce that must remain for the relaxed deadline, then subtract it from the original workforce",
      "पहले बढ़ी समय-सीमा के लिए आवश्यक बची कर्मचारी संख्या निकालें, फिर उसे मूल संख्या से घटाएँ",
      "ਪਹਿਲਾਂ ਵਧੀ ਸਮਾਂ-ਸੀਮਾ ਲਈ ਲੋੜੀਂਦੀ ਬਚੀ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਕੱਢੋ, ਫਿਰ ਇਸ ਨੂੰ ਮੂਲ ਗਿਣਤੀ ਤੋਂ ਘਟਾਓ");
    case "findOriginalWorkforceFromChangedSchedule": return t(language,
      "Use the changed workforce and actual duration to reconstruct the original workforce for the planned duration",
      "बदली कर्मचारी संख्या और वास्तविक समय से नियोजित समय के लिए मूल कर्मचारी संख्या निकालें",
      "ਬਦਲੀ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਅਤੇ ਅਸਲ ਸਮੇਂ ਤੋਂ ਯੋਜਿਤ ਸਮੇਂ ਲਈ ਮੂਲ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਕੱਢੋ");
    case "findRemainingDaysFromActualProgress": return t(language,
      "Use the observed completed fraction to find the actual daily progress, then time the unfinished fraction at that pace",
      "हुए काम के भाग से वास्तविक दैनिक प्रगति निकालें और उसी गति से बचे काम का समय निकालें",
      "ਹੋਏ ਕੰਮ ਦੇ ਹਿੱਸੇ ਤੋਂ ਅਸਲ ਰੋਜ਼ਾਨਾ ਤਰੱਕੀ ਕੱਢੋ ਅਤੇ ਉਸੇ ਗਤੀ ਨਾਲ ਬਾਕੀ ਕੰਮ ਦਾ ਸਮਾਂ ਕੱਢੋ");
    case "findExtraWorkersFromPlannedVsActualProgress": return t(language,
      "Find the actual per-person daily rate from progress so far, calculate the total workforce needed for the days left, then subtract the current workforce",
      "अब तक की प्रगति से प्रति-कर्मचारी वास्तविक दैनिक दर निकालें, बचे दिनों के लिए कुल आवश्यक कर्मचारी निकालें और वर्तमान संख्या घटाएँ",
      "ਹੁਣ ਤੱਕ ਦੀ ਤਰੱਕੀ ਤੋਂ ਪ੍ਰਤੀ-ਕਰਮਚਾਰੀ ਅਸਲ ਰੋਜ਼ਾਨਾ ਦਰ ਕੱਢੋ, ਬਚੇ ਦਿਨਾਂ ਲਈ ਕੁੱਲ ਲੋੜੀਂਦੇ ਕਰਮਚਾਰੀ ਕੱਢੋ ਅਤੇ ਮੌਜੂਦਾ ਗਿਣਤੀ ਘਟਾਓ");
    case "findPercentWorkCompletedFromResourceHours": return t(language,
      "Compare used resource-hours with the resource-hours required for the whole job, then convert the fraction to a percentage",
      "किए गए संसाधन-घंटों की तुलना पूरे काम के संसाधन-घंटों से करें और प्राप्त भाग को प्रतिशत में बदलें",
      "ਵਰਤੇ ਸਰੋਤ-ਘੰਟਿਆਂ ਦੀ ਤੁਲਨਾ ਪੂਰੇ ਕੰਮ ਲਈ ਲੋੜੀਂਦੇ ਸਰੋਤ-ਘੰਟਿਆਂ ਨਾਲ ਕਰੋ ਅਤੇ ਮਿਲੇ ਹਿੱਸੇ ਨੂੰ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲੋ");
    case "findPercentScheduleDelay": return t(language,
      "Find the new completion time with the reduced workforce, then measure the increase against the planned time",
      "घटी कर्मचारी संख्या से नया पूरा होने का समय निकालें, फिर बढ़े समय की तुलना मूल समय से करके प्रतिशत निकालें",
      "ਘਟੀ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਨਾਲ ਨਵਾਂ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ ਕੱਢੋ, ਫਿਰ ਵਧੇ ਸਮੇਂ ਦੀ ਤੁਲਨਾ ਮੂਲ ਸਮੇਂ ਨਾਲ ਕਰਕੇ ਪ੍ਰਤੀਸ਼ਤ ਕੱਢੋ");
    case "findOvertimeHoursForDeadline": return t(language,
      "Find the total daily hours each remaining person must work to keep the deadline, then subtract the regular daily hours",
      "समय-सीमा बनाए रखने के लिए प्रत्येक बचे कर्मचारी के कुल दैनिक घंटे निकालें, फिर नियमित घंटे घटाएँ",
      "ਸਮਾਂ-ਸੀਮਾ ਕਾਇਮ ਰੱਖਣ ਲਈ ਹਰ ਬਚੇ ਕਰਮਚਾਰੀ ਦੇ ਕੁੱਲ ਰੋਜ਼ਾਨਾ ਘੰਟੇ ਕੱਢੋ, ਫਿਰ ਨਿਯਮਿਤ ਘੰਟੇ ਘਟਾਓ");
    case "findShiftCountForProductionTarget": return t(language,
      "Find the output of all resources in one shift, then divide the target output by that amount",
      "एक पाली में सभी संसाधनों का कुल उत्पादन निकालें, फिर लक्ष्य उत्पादन को उससे भाग दें",
      "ਇੱਕ ਸ਼ਿਫ਼ਟ ਵਿੱਚ ਸਾਰੇ ਸਰੋਤਾਂ ਦਾ ਕੁੱਲ ਉਤਪਾਦਨ ਕੱਢੋ, ਫਿਰ ਟੀਚੇ ਦੇ ਉਤਪਾਦਨ ਨੂੰ ਉਸ ਨਾਲ ਭਾਗ ਦਿਓ");
    case "findDimensionalWorkRatio": return t(language,
      "Find each job's relevant area or volume from its dimensions, then compare the two quantities",
      "दोनों कामों का संबंधित क्षेत्रफल या आयतन आयामों से निकालें और फिर उनका अनुपात लें",
      "ਦੋਵੇਂ ਕੰਮਾਂ ਦਾ ਸੰਬੰਧਿਤ ਖੇਤਰਫਲ ਜਾਂ ਆਇਤਨ ਮਾਪਾਂ ਤੋਂ ਕੱਢੋ ਅਤੇ ਫਿਰ ਉਨ੍ਹਾਂ ਦਾ ਅਨੁਪਾਤ ਲਓ");
    case "findWorkersForChangedDimensions": return t(language,
      "First find the dimensional work ratio, then include the changed schedule to solve the required workforce",
      "पहले आयामों से काम का अनुपात निकालें, फिर बदले समय को शामिल करके आवश्यक कर्मचारी संख्या निकालें",
      "ਪਹਿਲਾਂ ਮਾਪਾਂ ਤੋਂ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ, ਫਿਰ ਬਦਲੇ ਸਮੇਂ ਨੂੰ ਸ਼ਾਮਲ ਕਰਕੇ ਲੋੜੀਂਦੀ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਕੱਢੋ");
    case "findDaysForChangedDimensions": return t(language,
      "First find the dimensional work ratio, then balance it with the changed workforce to obtain the new duration",
      "पहले आयामों से काम का अनुपात निकालें, फिर बदली कर्मचारी संख्या के साथ संतुलन बनाकर नया समय निकालें",
      "ਪਹਿਲਾਂ ਮਾਪਾਂ ਤੋਂ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ, ਫਿਰ ਬਦਲੀ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਨਾਲ ਸੰਤੁਲਨ ਬਣਾ ਕੇ ਨਵਾਂ ਸਮਾਂ ਕੱਢੋ");
    case "findResourceDurationAfterPopulationChange": return t(language,
      "Convert the food remaining after the elapsed period into person-days, then divide by the new population",
      "बीते दिनों के बाद बचे भोजन को व्यक्ति-दिन में लिखें और नई जनसंख्या से भाग दें",
      "ਬੀਤੇ ਦਿਨਾਂ ਤੋਂ ਬਾਅਦ ਬਚੇ ਖਾਣੇ ਨੂੰ ਵਿਅਕਤੀ-ਦਿਨਾਂ ਵਿੱਚ ਲਿਖੋ ਅਤੇ ਨਵੀਂ ਆਬਾਦੀ ਨਾਲ ਭਾਗ ਦਿਓ");
    case "findCompletionTimeAfterAbsenteeism": return t(language,
      "Reduce the planned workforce by the absentee percentage, then balance the same total work with the active workforce",
      "अनुपस्थित प्रतिशत घटाकर सक्रिय कर्मचारी संख्या निकालें, फिर समान कुल काम के लिए नया समय निकालें",
      "ਗੈਰਹਾਜ਼ਰ ਪ੍ਰਤੀਸ਼ਤ ਘਟਾ ਕੇ ਸਰਗਰਮ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਕੱਢੋ, ਫਿਰ ਇੱਕੋ ਕੁੱਲ ਕੰਮ ਲਈ ਨਵਾਂ ਸਮਾਂ ਕੱਢੋ");
    case "findCompletionWithBatchWorkerAdditions": return t(language,
      "Add the workforce used on each day until the cumulative employee-days equal the job's required employee-days",
      "हर दिन काम करने वाले कर्मचारियों की संख्या जोड़ें और संचयी कर्मचारी-दिन को आवश्यक कर्मचारी-दिन से मिलाएँ",
      "ਹਰ ਦਿਨ ਕੰਮ ਕਰਨ ਵਾਲੇ ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਜੋੜੋ ਅਤੇ ਸੰਚਿਤ ਕਰਮਚਾਰੀ-ਦਿਨਾਂ ਨੂੰ ਲੋੜੀਂਦੇ ਕਰਮਚਾਰੀ-ਦਿਨਾਂ ਨਾਲ ਮਿਲਾਓ");
    case "findEquivalentResourceTime": return t(language,
      "Multiply the number of resources by the stated duration to obtain the equivalent resource-time",
      "संसाधनों की संख्या को दी अवधि से गुणा करके समतुल्य संसाधन-समय निकालें",
      "ਸਰੋਤਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਦਿੱਤੀ ਮਿਆਦ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਸਮਤੁੱਲ ਸਰੋਤ-ਸਮਾਂ ਕੱਢੋ");
    default: return t(language, "Use the quantities stated in the question in their correct work-capacity relation", "प्रश्न में दी राशियों को सही कार्य-क्षमता संबंध में रखें", "ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀਆਂ ਮਾਤਰਾਵਾਂ ਨੂੰ ਸਹੀ ਕੰਮ-ਸਮਰੱਥਾ ਸੰਬੰਧ ਵਿੱਚ ਰੱਖੋ");
  }
}

function workingFor(question: Cp006Question, language: Language): Array<string | null> {
  const mode = question.solveMode ?? "";
  const w = question.solution?.workedLatex ?? [];
  const calc = (index: number): string | null => math(rhs(w[index]));
  const merged = (first: number, second: number): string | null => joined(w[first], w[second]);

  switch (mode) {
    case "findRequiredResourceCount": return [step(t(language, "Equal-work capacity balance", "समान काम का क्षमता-संतुलन", "ਇੱਕੋ ਕੰਮ ਦਾ ਸਮਰੱਥਾ-ਸੰਤੁਲਨ"), merged(0, 1))];
    case "findRequiredDays": return [step(t(language, "New duration from the equal-work balance", "समान काम के संतुलन से नया समय", "ਇੱਕੋ ਕੰਮ ਦੇ ਸੰਤੁਲਨ ਤੋਂ ਨਵਾਂ ਸਮਾਂ"), merged(0, 1))];
    case "findRequiredDailyHours": return [step(t(language, "Required daily hours from the capacity balance", "क्षमता-संतुलन से आवश्यक दैनिक घंटे", "ਸਮਰੱਥਾ-ਸੰਤੁਲਨ ਤੋਂ ਲੋੜੀਂਦੇ ਰੋਜ਼ਾਨਾ ਘੰਟੇ"), merged(0, 1))];
    case "findRelativeEfficiency": return [step(t(language, "Revised efficiency factor", "नई दक्षता का गुणक", "ਨਵੀਂ ਦੱਖਤਾ ਦਾ ਗੁਣਕ"), merged(0, 1))];
    case "findWorkQuantity": return [
      step(t(language, "Ratio of total resource-shifts", "कुल संसाधन-पाली का अनुपात", "ਕੁੱਲ ਸਰੋਤ-ਸ਼ਿਫ਼ਟਾਂ ਦਾ ਅਨੁਪਾਤ"), calc(0)),
      step(t(language, "Scale the original output by this ratio", "इस अनुपात से मूल उत्पादन को गुणा करें", "ਇਸ ਅਨੁਪਾਤ ਨਾਲ ਮੂਲ ਉਤਪਾਦਨ ਨੂੰ ਗੁਣਾ ਕਰੋ"), calc(1)),
    ];
    case "findWorkQuantityRatio": return [step(t(language, "Work ratio from the two total capacities", "दोनों कुल क्षमताओं से काम का अनुपात", "ਦੋਵੇਂ ਕੁੱਲ ਸਮਰੱਥਾਵਾਂ ਤੋਂ ਕੰਮ ਦਾ ਅਨੁਪਾਤ"), merged(0, 1))];
    case "findAdditionalWorkersForDeadline": return [
      step(t(language, "Total workforce required for the new deadline", "नई समय-सीमा के लिए कुल आवश्यक कर्मचारी", "ਨਵੀਂ ਸਮਾਂ-ਸੀਮਾ ਲਈ ਕੁੱਲ ਲੋੜੀਂਦੇ ਕਰਮਚਾਰੀ"), calc(0)),
      step(t(language, "Additional workforce = required total − current workforce", "अतिरिक्त कर्मचारी = कुल आवश्यक − वर्तमान कर्मचारी", "ਵਾਧੂ ਕਰਮਚਾਰੀ = ਕੁੱਲ ਲੋੜੀਂਦੇ − ਮੌਜੂਦਾ ਕਰਮਚਾਰੀ"), calc(1)),
    ];
    case "findWorkersRemovedForDelay": return [
      step(t(language, "Workforce that must remain for the new deadline", "नई समय-सीमा के लिए आवश्यक बची कर्मचारी संख्या", "ਨਵੀਂ ਸਮਾਂ-ਸੀਮਾ ਲਈ ਲੋੜੀਂਦੀ ਬਚੀ ਕਰਮਚਾਰੀ ਗਿਣਤੀ"), calc(0)),
      step(t(language, "Removed workforce = original − retained", "हटाए कर्मचारी = मूल − आवश्यक बचे कर्मचारी", "ਹਟਾਏ ਕਰਮਚਾਰੀ = ਮੂਲ − ਲੋੜੀਂਦੇ ਬਚੇ ਕਰਮਚਾਰੀ"), calc(1)),
    ];
    case "findOriginalWorkforceFromChangedSchedule": return [step(t(language, "Reconstruct the original workforce from the changed schedule", "बदली योजना से मूल कर्मचारी संख्या", "ਬਦਲੀ ਯੋਜਨਾ ਤੋਂ ਮੂਲ ਕਰਮਚਾਰੀ ਗਿਣਤੀ"), merged(0, 1))];
    case "findRemainingDaysFromActualProgress": return [
      step(t(language, "Actual work completed per day", "वास्तविक प्रतिदिन हुआ काम", "ਅਸਲ ਵਿੱਚ ਹਰ ਦਿਨ ਹੋਇਆ ਕੰਮ"), calc(0)),
      step(t(language, "Work still remaining", "बचा हुआ काम", "ਬਾਕੀ ਕੰਮ"), calc(1)),
      step(t(language, "Remaining time = remaining work ÷ actual daily progress", "शेष समय = बचा काम ÷ वास्तविक दैनिक प्रगति", "ਬਾਕੀ ਸਮਾਂ = ਬਾਕੀ ਕੰਮ ÷ ਅਸਲ ਰੋਜ਼ਾਨਾ ਤਰੱਕੀ"), calc(2)),
    ];
    case "findExtraWorkersFromPlannedVsActualProgress": return [
      step(t(language, "Actual work rate per person per day", "प्रति-कर्मचारी वास्तविक दैनिक कार्य-दर", "ਪ੍ਰਤੀ-ਕਰਮਚਾਰੀ ਅਸਲ ਰੋਜ਼ਾਨਾ ਕੰਮ-ਦਰ"), calc(0)),
      step(t(language, "Days remaining before the original deadline", "मूल समय-सीमा तक बचे दिन", "ਮੂਲ ਸਮਾਂ-ਸੀਮਾ ਤੱਕ ਬਚੇ ਦਿਨ"), calc(1)),
      step(t(language, "Total workforce required for the unfinished work", "बचे काम के लिए कुल आवश्यक कर्मचारी", "ਬਾਕੀ ਕੰਮ ਲਈ ਕੁੱਲ ਲੋੜੀਂਦੇ ਕਰਮਚਾਰੀ"), calc(2)),
      step(t(language, "Additional workforce = required total − current workforce", "अतिरिक्त कर्मचारी = कुल आवश्यक − वर्तमान कर्मचारी", "ਵਾਧੂ ਕਰਮਚਾਰੀ = ਕੁੱਲ ਲੋੜੀਂਦੇ − ਮੌਜੂਦਾ ਕਰਮਚਾਰੀ"), calc(3)),
    ];
    case "findPercentWorkCompletedFromResourceHours": return [
      step(t(language, "Fraction of the total resource-hours used", "कुल संसाधन-घंटों में से उपयोग हुआ भाग", "ਕੁੱਲ ਸਰੋਤ-ਘੰਟਿਆਂ ਵਿੱਚੋਂ ਵਰਤਿਆ ਹਿੱਸਾ"), calc(0)),
      step(t(language, "Convert that fraction to a percentage", "इस भाग को प्रतिशत में बदलें", "ਇਸ ਹਿੱਸੇ ਨੂੰ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲੋ"), calc(1)),
    ];
    case "findPercentScheduleDelay": return [
      step(t(language, "Completion time with the reduced workforce", "घटी कर्मचारी संख्या के साथ पूरा होने का समय", "ਘਟੀ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਨਾਲ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ"), calc(0)),
      step(t(language, "Percentage increase over the planned time", "मूल समय की तुलना में प्रतिशत वृद्धि", "ਮੂਲ ਸਮੇਂ ਦੇ ਮੁਕਾਬਲੇ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ"), calc(1)),
    ];
    case "findOvertimeHoursForDeadline": return [
      step(t(language, "Total daily hours required from each remaining person", "प्रत्येक बचे कर्मचारी से आवश्यक कुल दैनिक घंटे", "ਹਰ ਬਚੇ ਕਰਮਚਾਰੀ ਤੋਂ ਲੋੜੀਂਦੇ ਕੁੱਲ ਰੋਜ਼ਾਨਾ ਘੰਟੇ"), calc(0)),
      step(t(language, "Overtime = required daily hours − regular daily hours", "ओवरटाइम = आवश्यक दैनिक घंटे − नियमित दैनिक घंटे", "ਓਵਰਟਾਈਮ = ਲੋੜੀਂਦੇ ਰੋਜ਼ਾਨਾ ਘੰਟੇ − ਨਿਯਮਿਤ ਰੋਜ਼ਾਨਾ ਘੰਟੇ"), calc(1)),
    ];
    case "findShiftCountForProductionTarget": return [
      step(t(language, "Output of all resources in one shift", "एक पाली में सभी संसाधनों का उत्पादन", "ਇੱਕ ਸ਼ਿਫ਼ਟ ਵਿੱਚ ਸਾਰੇ ਸਰੋਤਾਂ ਦਾ ਉਤਪਾਦਨ"), calc(0)),
      step(t(language, "Required shifts = target output ÷ output per shift", "आवश्यक पालियाँ = लक्ष्य उत्पादन ÷ प्रति-पाली उत्पादन", "ਲੋੜੀਂਦੀਆਂ ਸ਼ਿਫ਼ਟਾਂ = ਟੀਚਾ ਉਤਪਾਦਨ ÷ ਪ੍ਰਤੀ-ਸ਼ਿਫ਼ਟ ਉਤਪਾਦਨ"), calc(1)),
    ];
    case "findDimensionalWorkRatio": return [
      step(t(language, "Relevant measure of the first job", "पहले काम का संबंधित क्षेत्रफल/आयतन", "ਪਹਿਲੇ ਕੰਮ ਦਾ ਸੰਬੰਧਿਤ ਖੇਤਰਫਲ/ਆਇਤਨ"), calc(0)),
      step(t(language, "Relevant measure of the second job", "दूसरे काम का संबंधित क्षेत्रफल/आयतन", "ਦੂਜੇ ਕੰਮ ਦਾ ਸੰਬੰਧਿਤ ਖੇਤਰਫਲ/ਆਇਤਨ"), calc(1)),
      step(t(language, "Second-job work ÷ first-job work", "दूसरे काम ÷ पहले काम का अनुपात", "ਦੂਜੇ ਕੰਮ ÷ ਪਹਿਲੇ ਕੰਮ ਦਾ ਅਨੁਪਾਤ"), calc(2)),
    ];
    case "findWorkersForChangedDimensions": return [
      step(t(language, "Work ratio from the changed dimensions", "बदले आयामों से काम का अनुपात", "ਬਦਲੇ ਮਾਪਾਂ ਤੋਂ ਕੰਮ ਦਾ ਅਨੁਪਾਤ"), calc(0)),
      step(t(language, "Required workforce after including the schedule change", "समय-परिवर्तन सहित आवश्यक कर्मचारी संख्या", "ਸਮਾਂ-ਬਦਲਾਅ ਸਮੇਤ ਲੋੜੀਂਦੀ ਕਰਮਚਾਰੀ ਗਿਣਤੀ"), calc(1)),
    ];
    case "findDaysForChangedDimensions": return [
      step(t(language, "Work ratio from the changed dimensions", "बदले आयामों से काम का अनुपात", "ਬਦਲੇ ਮਾਪਾਂ ਤੋਂ ਕੰਮ ਦਾ ਅਨੁਪਾਤ"), calc(0)),
      step(t(language, "Required duration after including the workforce change", "कर्मचारी-परिवर्तन सहित आवश्यक समय", "ਕਰਮਚਾਰੀ-ਬਦਲਾਅ ਸਮੇਤ ਲੋੜੀਂਦਾ ਸਮਾਂ"), calc(1)),
    ];
    case "findResourceDurationAfterPopulationChange": return [
      step(t(language, "Food remaining after the elapsed period, in person-days", "बीते समय के बाद बचा भोजन, व्यक्ति-दिन में", "ਬੀਤੇ ਸਮੇਂ ਤੋਂ ਬਾਅਦ ਬਚਿਆ ਖਾਣਾ, ਵਿਅਕਤੀ-ਦਿਨਾਂ ਵਿੱਚ"), calc(0)),
      step(t(language, "Remaining duration at the new population", "नई जनसंख्या पर बचा समय", "ਨਵੀਂ ਆਬਾਦੀ ਉੱਤੇ ਬਚਿਆ ਸਮਾਂ"), calc(1)),
    ];
    case "findCompletionTimeAfterAbsenteeism": return [
      step(t(language, "Active workforce after absenteeism", "अनुपस्थिति के बाद सक्रिय कर्मचारी", "ਗੈਰਹਾਜ਼ਰੀ ਤੋਂ ਬਾਅਦ ਸਰਗਰਮ ਕਰਮਚਾਰੀ"), calc(0)),
      step(t(language, "Completion time with the active workforce", "सक्रिय कर्मचारियों के साथ पूरा होने का समय", "ਸਰਗਰਮ ਕਰਮਚਾਰੀਆਂ ਨਾਲ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ"), calc(1)),
    ];
    case "findCompletionWithBatchWorkerAdditions": {
      const p = question.parameters;
      const solution = question.solution;
      if (!p?.initialBatchResources || !p.batchAddition || !solution || solution.answer.denominator !== 1) return [];
      const target = multiply(p.stateA.resources, p.stateA.days);
      const days = solution.answer.numerator;
      const sequence = Array.from({ length: days }, (_, index) => add(p.initialBatchResources!, multiply(p.batchAddition!, rational(index))));
      const sequenceMath = math(`${sequence.map(toLatex).join("+")}=${toLatex(target)}`);
      return [
        step(t(language, "Employee-days required by the original plan", "मूल योजना से आवश्यक कुल कर्मचारी-दिन", "ਮੂਲ ਯੋਜਨਾ ਤੋਂ ਲੋੜੀਂਦੇ ਕੁੱਲ ਕਰਮਚਾਰੀ-ਦਿਨ"), math(`${toLatex(p.stateA.resources)}\\times${toLatex(p.stateA.days)}=${toLatex(target)}`)),
        step(t(language, "Cumulative employee-days of the growing daily workforce", "हर दिन बढ़ते कार्य-दल के संचयी कर्मचारी-दिन", "ਹਰ ਦਿਨ ਵਧਦੀ ਟੀਮ ਦੇ ਸੰਚਿਤ ਕਰਮਚਾਰੀ-ਦਿਨ"), sequenceMath),
      ];
    }
    case "findEquivalentResourceTime": return [step(t(language, "Equivalent resource-time", "समतुल्य संसाधन-समय", "ਸਮਤੁੱਲ ਸਰੋਤ-ਸਮਾਂ"), calc(1))];
    default: return [];
  }
}

export function applyTmwCp006MultilingualEditorialReview<T extends Cp006Question>(
  question: T,
  qlId: string,
  language: Language,
): T {
  if ((question.canonicalProblemId ?? question.cpId) !== "TMW-CP-006" || !question.learnerExplanation) return question;

  const current = question.learnerExplanation;
  const working = workingFor(question, language).filter((value): value is string => Boolean(value));
  const learnerExplanation: TmwLearnerExplanationV2 = {
    ...current,
    method: methodFor(question.solveMode ?? "", language),
    solution: [...working, current.answer].slice(0, 5),
  };
  const learnerErrors = validateTmwLearnerExplanationV2(learnerExplanation);
  const missingWorking = working.length < 1;
  const stem = fixStem(question.stem ?? "", qlId, language);

  return {
    ...question,
    stem,
    learnerExplanation,
    validation: {
      valid: Boolean(question.validation?.valid) && learnerErrors.length === 0 && !missingWorking,
      errors: [
        ...(question.validation?.errors ?? []),
        ...learnerErrors.map((error) => `CP006 multilingual editorial review: ${error}`),
        ...(missingWorking ? ["CP006 multilingual editorial review: no worked explanation was rendered"] : []),
      ],
    },
    publiclyPublishable: false,
  };
}
