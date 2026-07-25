import { getAvg001QuestionEntry } from "./library";
import type { Rational, Avg001QuestionPackage } from "./types";

export type Avg001Cp006PilotLanguage = "hi" | "pa";
type UnitKind = "marks" | "currency" | "years" | "units" | "runs" | "none";

type ContextWords = {
  lowerPlural: string;
  lowerSingular: string;
  upper: string;
  members: string;
  memberCounts: string;
  averageMeasure: string;
  totalMeasure: string;
  combinedAverage: string;
  combinedTotal: string;
  missingAverage: string;
  missingCount: string;
};

const HI: Record<string, ContextWords> = {
  schoolSections: { lowerPlural: "अनुभाग", lowerSingular: "अनुभाग", upper: "विद्यालय", members: "विद्यार्थी", memberCounts: "विद्यार्थियों की संख्याएँ", averageMeasure: "औसत अंक", totalMeasure: "कुल अंक", combinedAverage: "विद्यालय के औसत अंक", combinedTotal: "विद्यालय के कुल अंक", missingAverage: "तीसरे अनुभाग के औसत अंक", missingCount: "अज्ञात अनुभाग के विद्यार्थियों की संख्या" },
  companyDepartments: { lowerPlural: "विभाग", lowerSingular: "विभाग", upper: "कंपनी", members: "कर्मचारी", memberCounts: "कर्मचारियों की संख्याएँ", averageMeasure: "औसत मासिक वेतन", totalMeasure: "कुल मासिक वेतन", combinedAverage: "कंपनी का औसत मासिक वेतन", combinedTotal: "कंपनी का कुल मासिक वेतन", missingAverage: "तीसरे विभाग का औसत मासिक वेतन", missingCount: "अज्ञात विभाग के कर्मचारियों की संख्या" },
  regionalBranches: { lowerPlural: "शाखाएँ", lowerSingular: "शाखा", upper: "क्षेत्र", members: "कर्मचारी", memberCounts: "कर्मचारियों की संख्याएँ", averageMeasure: "औसत दैनिक बिक्री", totalMeasure: "कुल दैनिक बिक्री", combinedAverage: "क्षेत्र की औसत दैनिक बिक्री", combinedTotal: "क्षेत्र की कुल दैनिक बिक्री", missingAverage: "तीसरी शाखा की औसत दैनिक बिक्री", missingCount: "अज्ञात शाखा के कर्मचारियों की संख्या" },
  factoryUnits: { lowerPlural: "उत्पादन इकाइयाँ", lowerSingular: "उत्पादन इकाई", upper: "कारखाना", members: "मशीनें", memberCounts: "मशीनों की संख्याएँ", averageMeasure: "औसत दैनिक उत्पादन", totalMeasure: "कुल दैनिक उत्पादन", combinedAverage: "कारखाने का औसत दैनिक उत्पादन", combinedTotal: "कारखाने का कुल दैनिक उत्पादन", missingAverage: "तीसरी इकाई का औसत दैनिक उत्पादन", missingCount: "अज्ञात इकाई की मशीनों की संख्या" },
  tournamentTeams: { lowerPlural: "टीमें", lowerSingular: "टीम", upper: "टूर्नामेंट", members: "खिलाड़ी", memberCounts: "खिलाड़ियों की संख्याएँ", averageMeasure: "औसत रन", totalMeasure: "कुल रन", combinedAverage: "टूर्नामेंट का बल्लेबाजी औसत", combinedTotal: "टूर्नामेंट के कुल रन", missingAverage: "तीसरी टीम का औसत रन-मान", missingCount: "अज्ञात टीम के खिलाड़ियों की संख्या" },
  villageGroups: { lowerPlural: "समूह", lowerSingular: "समूह", upper: "गाँव", members: "निवासी", memberCounts: "निवासियों की संख्याएँ", averageMeasure: "औसत आयु", totalMeasure: "कुल आयु-योग", combinedAverage: "गाँव की औसत आयु", combinedTotal: "गाँव का कुल आयु-योग", missingAverage: "तीसरे समूह की औसत आयु", missingCount: "अज्ञात समूह के निवासियों की संख्या" },
};

const PA: Record<string, ContextWords> = {
  schoolSections: { lowerPlural: "ਭਾਗ", lowerSingular: "ਭਾਗ", upper: "ਸਕੂਲ", members: "ਵਿਦਿਆਰਥੀ", memberCounts: "ਵਿਦਿਆਰਥੀਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ", averageMeasure: "ਔਸਤ ਅੰਕ", totalMeasure: "ਕੁੱਲ ਅੰਕ", combinedAverage: "ਸਕੂਲ ਦੇ ਔਸਤ ਅੰਕ", combinedTotal: "ਸਕੂਲ ਦੇ ਕੁੱਲ ਅੰਕ", missingAverage: "ਤੀਜੇ ਭਾਗ ਦੇ ਔਸਤ ਅੰਕ", missingCount: "ਅਣਜਾਣ ਭਾਗ ਦੇ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ" },
  companyDepartments: { lowerPlural: "ਵਿਭਾਗ", lowerSingular: "ਵਿਭਾਗ", upper: "ਕੰਪਨੀ", members: "ਕਰਮਚਾਰੀ", memberCounts: "ਕਰਮਚਾਰੀਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ", averageMeasure: "ਔਸਤ ਮਹੀਨਾਵਾਰ ਤਨਖਾਹ", totalMeasure: "ਕੁੱਲ ਮਹੀਨਾਵਾਰ ਤਨਖਾਹ", combinedAverage: "ਕੰਪਨੀ ਦੀ ਔਸਤ ਮਹੀਨਾਵਾਰ ਤਨਖਾਹ", combinedTotal: "ਕੰਪਨੀ ਦੀ ਕੁੱਲ ਮਹੀਨਾਵਾਰ ਤਨਖਾਹ", missingAverage: "ਤੀਜੇ ਵਿਭਾਗ ਦੀ ਔਸਤ ਮਹੀਨਾਵਾਰ ਤਨਖਾਹ", missingCount: "ਅਣਜਾਣ ਵਿਭਾਗ ਦੇ ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ" },
  regionalBranches: { lowerPlural: "ਸ਼ਾਖਾਵਾਂ", lowerSingular: "ਸ਼ਾਖਾ", upper: "ਖੇਤਰ", members: "ਕਰਮਚਾਰੀ", memberCounts: "ਕਰਮਚਾਰੀਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ", averageMeasure: "ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ", totalMeasure: "ਕੁੱਲ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ", combinedAverage: "ਖੇਤਰ ਦੀ ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ", combinedTotal: "ਖੇਤਰ ਦੀ ਕੁੱਲ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ", missingAverage: "ਤੀਜੀ ਸ਼ਾਖਾ ਦੀ ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ", missingCount: "ਅਣਜਾਣ ਸ਼ਾਖਾ ਦੇ ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ" },
  factoryUnits: { lowerPlural: "ਉਤਪਾਦਨ ਇਕਾਈਆਂ", lowerSingular: "ਉਤਪਾਦਨ ਇਕਾਈ", upper: "ਕਾਰਖਾਨਾ", members: "ਮਸ਼ੀਨਾਂ", memberCounts: "ਮਸ਼ੀਨਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ", averageMeasure: "ਔਸਤ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ", totalMeasure: "ਕੁੱਲ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ", combinedAverage: "ਕਾਰਖਾਨੇ ਦਾ ਔਸਤ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ", combinedTotal: "ਕਾਰਖਾਨੇ ਦਾ ਕੁੱਲ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ", missingAverage: "ਤੀਜੀ ਇਕਾਈ ਦਾ ਔਸਤ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ", missingCount: "ਅਣਜਾਣ ਇਕਾਈ ਦੀਆਂ ਮਸ਼ੀਨਾਂ ਦੀ ਗਿਣਤੀ" },
  tournamentTeams: { lowerPlural: "ਟੀਮਾਂ", lowerSingular: "ਟੀਮ", upper: "ਟੂਰਨਾਮੈਂਟ", members: "ਖਿਡਾਰੀ", memberCounts: "ਖਿਡਾਰੀਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ", averageMeasure: "ਔਸਤ ਦੌੜਾਂ", totalMeasure: "ਕੁੱਲ ਦੌੜਾਂ", combinedAverage: "ਟੂਰਨਾਮੈਂਟ ਦੀ ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ", combinedTotal: "ਟੂਰਨਾਮੈਂਟ ਦੀਆਂ ਕੁੱਲ ਦੌੜਾਂ", missingAverage: "ਤੀਜੀ ਟੀਮ ਦੀਆਂ ਔਸਤ ਦੌੜਾਂ", missingCount: "ਅਣਜਾਣ ਟੀਮ ਦੇ ਖਿਡਾਰੀਆਂ ਦੀ ਗਿਣਤੀ" },
  villageGroups: { lowerPlural: "ਸਮੂਹ", lowerSingular: "ਸਮੂਹ", upper: "ਪਿੰਡ", members: "ਨਿਵਾਸੀ", memberCounts: "ਨਿਵਾਸੀਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ", averageMeasure: "ਔਸਤ ਉਮਰ", totalMeasure: "ਕੁੱਲ ਉਮਰ-ਜੋੜ", combinedAverage: "ਪਿੰਡ ਦੀ ਔਸਤ ਉਮਰ", combinedTotal: "ਪਿੰਡ ਦਾ ਕੁੱਲ ਉਮਰ-ਜੋੜ", missingAverage: "ਤੀਜੇ ਸਮੂਹ ਦੀ ਔਸਤ ਉਮਰ", missingCount: "ਅਣਜਾਣ ਸਮੂਹ ਦੇ ਨਿਵਾਸੀਆਂ ਦੀ ਗਿਣਤੀ" },
};

function contextKey(pkg: Avg001QuestionPackage) {
  return pkg.parameters.scenarioVariant.split("_")[0]!;
}

function words(pkg: Avg001QuestionPackage, language: Avg001Cp006PilotLanguage) {
  const value = (language === "hi" ? HI : PA)[contextKey(pkg)];
  if (!value) throw new Error(`Missing CP-006 localization context ${pkg.parameters.scenarioVariant}`);
  return value;
}

function localVariant(pkg: Avg001QuestionPackage) {
  const value = Number(pkg.parameters.scenarioVariant.split("_").at(-1));
  return Number.isInteger(value) ? value : 1;
}

function unitKind(pkg: Avg001QuestionPackage): UnitKind {
  return ((getAvg001QuestionEntry(pkg.questionLanguageId) as { unitKind?: UnitKind }).unitKind ?? "none");
}

function raw(pkg: Avg001QuestionPackage, key: string) {
  const value = pkg.parameters.renderVariables[key];
  if (value === undefined) throw new Error(`${pkg.questionLanguageId}: missing ${key}`);
  return String(value);
}

function rationalRaw(value: Rational | undefined) {
  if (!value) return "0";
  return value.denominator === 1 ? String(value.numerator) : `${value.numerator}/${value.denominator}`;
}

function numberFromAnswer(pkg: Avg001QuestionPackage) {
  return pkg.answer.replaceAll(",", "").match(/-?\d+(?:\.\d+)?/)?.[0] ?? pkg.answer;
}

function display(value: string, kind: UnitKind, language: Avg001Cp006PilotLanguage) {
  if (kind === "currency") return `₹${value}`;
  if (kind === "marks") return `${value} ${language === "hi" ? "अंक" : "ਅੰਕ"}`;
  if (kind === "years") return `${value} ${language === "hi" ? "वर्ष" : "ਸਾਲ"}`;
  if (kind === "units") return `${value} ${language === "hi" ? "इकाइयाँ" : "ਇਕਾਈਆਂ"}`;
  if (kind === "runs") return `${value} ${language === "hi" ? "रन" : "ਦੌੜਾਂ"}`;
  return value;
}

function shown(pkg: Avg001QuestionPackage, key: string, language: Avg001Cp006PilotLanguage) {
  return display(raw(pkg, key), unitKind(pkg), language);
}

function localizedAnswer(pkg: Avg001QuestionPackage, language: Avg001Cp006PilotLanguage) {
  if (pkg.parameters.answerType === "COUNT") return numberFromAnswer(pkg);
  return display(numberFromAnswer(pkg), unitKind(pkg), language);
}

function stem(pkg: Avg001QuestionPackage, language: Avg001Cp006PilotLanguage) {
  const w = words(pkg, language);
  const v = localVariant(pkg) % 4;
  const c1 = raw(pkg, "subgroupCount1");
  const c2 = raw(pkg, "subgroupCount2");
  const c3 = raw(pkg, "subgroupCount3");
  const a1 = shown(pkg, "subgroupAverage1", language);
  const a2 = shown(pkg, "subgroupAverage2", language);
  const a3 = shown(pkg, "subgroupAverage3", language);
  const overall = shown(pkg, "overallAverage", language);
  const parentCount = raw(pkg, "parentCount");
  const parent = shown(pkg, "parentAverage", language);
  if (language === "hi") {
    switch (pkg.solveMode) {
      case "findClassAverageFromSectionAverages":
        if (v === 0) return `${w.upper} के तीन ${w.lowerPlural} में क्रमशः ${c1}, ${c2}, ${c3} ${w.members} हैं और उनके ${w.averageMeasure} ${a1}, ${a2}, ${a3} हैं। संयुक्त औसत ज्ञात कीजिए।`;
        if (v === 1) return `तीन ${w.lowerPlural} की ${w.memberCounts} ${c1}, ${c2}, ${c3} तथा ${w.averageMeasure} ${a1}, ${a2}, ${a3} हैं। ${w.combinedAverage} ज्ञात कीजिए।`;
        if (v === 2) return `${w.lowerPlural} के आकार ${c1}, ${c2}, ${c3} हैं और उनके ${w.averageMeasure} क्रमशः ${a1}, ${a2}, ${a3} हैं। पूरे ${w.upper} का औसत निकालिए।`;
        return `एक ${w.upper} में तीन ${w.lowerPlural} हैं: ${c1} पर ${a1}, ${c2} पर ${a2} और ${c3} पर ${a3}। भारित संयुक्त औसत ज्ञात कीजिए।`;
      case "findSuperGroupAverageFromSubgroups":
        if (v === 0) return `तीन ${w.lowerPlural} मिलकर एक ${w.upper} बनाते हैं। उनकी संख्याएँ ${c1}, ${c2}, ${c3} और ${w.averageMeasure} ${a1}, ${a2}, ${a3} हैं। ${w.combinedAverage} ज्ञात कीजिए।`;
        if (v === 1) return `${w.upper} के तीन ${w.lowerPlural} में ${c1}, ${c2}, ${c3} ${w.members} हैं, जिनके ${w.averageMeasure} ${a1}, ${a2}, ${a3} हैं। समग्र औसत निकालिए।`;
        if (v === 2) return `तीन अधीन ${w.lowerPlural} के आकार ${c1}, ${c2}, ${c3} और औसत ${a1}, ${a2}, ${a3} हैं। ऊपरी ${w.upper} का औसत ज्ञात कीजिए।`;
        return `${c1} ${w.members} का औसत ${a1}, ${c2} का ${a2} और ${c3} का ${a3} है। इन ${w.lowerPlural} से बने ${w.upper} का औसत निकालिए।`;
      case "findMissingSectionAverage":
        return `तीन ${w.lowerPlural} में ${c1}, ${c2}, ${c3} ${w.members} हैं। पहले दो के ${w.averageMeasure} ${a1}, ${a2} और संयुक्त औसत ${overall} है। ${w.missingAverage} ज्ञात कीजिए।`;
      case "findSectionCountFromOverallAverage":
        return `पहले ${w.lowerSingular} में ${c1} ${w.members} हैं और ${w.averageMeasure} ${a1} है। दूसरे का औसत ${a3} तथा संयुक्त औसत ${overall} है। दूसरे ${w.lowerSingular} की संख्या ज्ञात कीजिए।`;
      case "findMissingSubgroupCount":
        return `तीन ${w.lowerPlural} के ${w.averageMeasure} ${a1}, ${a2}, ${a3} हैं। पहले दो में ${c1}, ${c2} ${w.members} हैं और संयुक्त औसत ${overall} है। ${w.missingCount} ज्ञात कीजिए।`;
      case "findSubgroupTotalFromAverageAndCount":
        return `एक ${w.lowerSingular} में ${c1} ${w.members} हैं और उसका ${w.averageMeasure} ${a1} है। उस समूह का ${w.totalMeasure} ज्ञात कीजिए।`;
      case "findOverallTotalFromHierarchy":
        return `तीन ${w.lowerPlural} में ${c1}, ${c2}, ${c3} ${w.members} हैं और उनके ${w.averageMeasure} ${a1}, ${a2}, ${a3} हैं। ${w.combinedTotal} ज्ञात कीजिए।`;
      case "findMissingLowerLevelAverage":
        return `कुल ${parentCount} ${w.members} का ${w.averageMeasure} ${parent} है। इनमें ${c1} का औसत ${a1} और ${c2} का ${a2} है। शेष ${c3} के लिए ${w.missingAverage} ज्ञात कीजिए।`;
      default: throw new Error(`Unsupported CP-006 solve mode ${pkg.solveMode}`);
    }
  }
  switch (pkg.solveMode) {
    case "findClassAverageFromSectionAverages":
      if (v === 0) return `${w.upper} ਦੇ ਤਿੰਨ ${w.lowerPlural} ਵਿੱਚ ਕ੍ਰਮਵਾਰ ${c1}, ${c2}, ${c3} ${w.members} ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ${w.averageMeasure} ${a1}, ${a2}, ${a3} ਹਨ। ਸੰਯੁਕਤ ਔਸਤ ਪਤਾ ਕਰੋ।`;
      if (v === 1) return `ਤਿੰਨ ${w.lowerPlural} ਦੀਆਂ ${w.memberCounts} ${c1}, ${c2}, ${c3} ਅਤੇ ${w.averageMeasure} ${a1}, ${a2}, ${a3} ਹਨ। ${w.combinedAverage} ਪਤਾ ਕਰੋ।`;
      if (v === 2) return `${w.lowerPlural} ਦੇ ਆਕਾਰ ${c1}, ${c2}, ${c3} ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ${w.averageMeasure} ਕ੍ਰਮਵਾਰ ${a1}, ${a2}, ${a3} ਹਨ। ਪੂਰੇ ${w.upper} ਦੀ ਔਸਤ ਕੱਢੋ।`;
      return `ਇੱਕ ${w.upper} ਵਿੱਚ ਤਿੰਨ ${w.lowerPlural} ਹਨ: ${c1} ਉੱਤੇ ${a1}, ${c2} ਉੱਤੇ ${a2} ਅਤੇ ${c3} ਉੱਤੇ ${a3}। ਭਾਰਿਤ ਸੰਯੁਕਤ ਔਸਤ ਪਤਾ ਕਰੋ।`;
    case "findSuperGroupAverageFromSubgroups":
      if (v === 0) return `ਤਿੰਨ ${w.lowerPlural} ਮਿਲ ਕੇ ਇੱਕ ${w.upper} ਬਣਾਉਂਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ${c1}, ${c2}, ${c3} ਅਤੇ ${w.averageMeasure} ${a1}, ${a2}, ${a3} ਹਨ। ${w.combinedAverage} ਪਤਾ ਕਰੋ।`;
      if (v === 1) return `${w.upper} ਦੇ ਤਿੰਨ ${w.lowerPlural} ਵਿੱਚ ${c1}, ${c2}, ${c3} ${w.members} ਹਨ, ਜਿਨ੍ਹਾਂ ਦੇ ${w.averageMeasure} ${a1}, ${a2}, ${a3} ਹਨ। ਸਮੁੱਚੀ ਔਸਤ ਕੱਢੋ।`;
      if (v === 2) return `ਤਿੰਨ ਹੇਠਲੇ ${w.lowerPlural} ਦੇ ਆਕਾਰ ${c1}, ${c2}, ${c3} ਅਤੇ ਔਸਤ ${a1}, ${a2}, ${a3} ਹਨ। ਉੱਪਰਲੇ ${w.upper} ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।`;
      return `${c1} ${w.members} ਦੀ ਔਸਤ ${a1}, ${c2} ਦੀ ${a2} ਅਤੇ ${c3} ਦੀ ${a3} ਹੈ। ਇਨ੍ਹਾਂ ${w.lowerPlural} ਤੋਂ ਬਣੇ ${w.upper} ਦੀ ਔਸਤ ਕੱਢੋ।`;
    case "findMissingSectionAverage":
      return `ਤਿੰਨ ${w.lowerPlural} ਵਿੱਚ ${c1}, ${c2}, ${c3} ${w.members} ਹਨ। ਪਹਿਲੇ ਦੋ ਦੇ ${w.averageMeasure} ${a1}, ${a2} ਅਤੇ ਸੰਯੁਕਤ ਔਸਤ ${overall} ਹੈ। ${w.missingAverage} ਪਤਾ ਕਰੋ।`;
    case "findSectionCountFromOverallAverage":
      return `ਪਹਿਲੇ ${w.lowerSingular} ਵਿੱਚ ${c1} ${w.members} ਹਨ ਅਤੇ ${w.averageMeasure} ${a1} ਹੈ। ਦੂਜੇ ਦੀ ਔਸਤ ${a3} ਅਤੇ ਸੰਯੁਕਤ ਔਸਤ ${overall} ਹੈ। ਦੂਜੇ ${w.lowerSingular} ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`;
    case "findMissingSubgroupCount":
      return `ਤਿੰਨ ${w.lowerPlural} ਦੇ ${w.averageMeasure} ${a1}, ${a2}, ${a3} ਹਨ। ਪਹਿਲੇ ਦੋ ਵਿੱਚ ${c1}, ${c2} ${w.members} ਹਨ ਅਤੇ ਸੰਯੁਕਤ ਔਸਤ ${overall} ਹੈ। ${w.missingCount} ਪਤਾ ਕਰੋ।`;
    case "findSubgroupTotalFromAverageAndCount":
      return `ਇੱਕ ${w.lowerSingular} ਵਿੱਚ ${c1} ${w.members} ਹਨ ਅਤੇ ਉਸ ਦਾ ${w.averageMeasure} ${a1} ਹੈ। ਉਸ ਸਮੂਹ ਦਾ ${w.totalMeasure} ਪਤਾ ਕਰੋ।`;
    case "findOverallTotalFromHierarchy":
      return `ਤਿੰਨ ${w.lowerPlural} ਵਿੱਚ ${c1}, ${c2}, ${c3} ${w.members} ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ${w.averageMeasure} ${a1}, ${a2}, ${a3} ਹਨ। ${w.combinedTotal} ਪਤਾ ਕਰੋ।`;
    case "findMissingLowerLevelAverage":
      return `ਕੁੱਲ ${parentCount} ${w.members} ਦਾ ${w.averageMeasure} ${parent} ਹੈ। ਇਨ੍ਹਾਂ ਵਿੱਚ ${c1} ਦੀ ਔਸਤ ${a1} ਅਤੇ ${c2} ਦੀ ${a2} ਹੈ। ਬਾਕੀ ${c3} ਲਈ ${w.missingAverage} ਪਤਾ ਕਰੋ।`;
    default: throw new Error(`Unsupported CP-006 solve mode ${pkg.solveMode}`);
  }
}

function finalLabel(pkg: Avg001QuestionPackage, language: Avg001Cp006PilotLanguage) {
  const w = words(pkg, language);
  if (pkg.solveMode === "findClassAverageFromSectionAverages" || pkg.solveMode === "findSuperGroupAverageFromSubgroups") return w.combinedAverage;
  if (pkg.solveMode === "findMissingSectionAverage" || pkg.solveMode === "findMissingLowerLevelAverage") return w.missingAverage;
  if (pkg.solveMode === "findSectionCountFromOverallAverage" || pkg.solveMode === "findMissingSubgroupCount") return w.missingCount;
  if (pkg.solveMode === "findSubgroupTotalFromAverageAndCount") return w.totalMeasure;
  return w.combinedTotal;
}

function intro(pkg: Avg001QuestionPackage, language: Avg001Cp006PilotLanguage) {
  const w = words(pkg, language);
  const v = localVariant(pkg) % 4;
  const hi: Record<string, string[]> = {
    findClassAverageFromSectionAverages: [`समूहों के आकार अलग हैं, इसलिए प्रत्येक ${w.lowerSingular} का कुल पहले निकालना होगा।`, `संयुक्त औसत साधारण औसत नहीं है; ${w.memberCounts} भार का काम करती हैं।`, `${w.combinedAverage} के लिए सभी समूह-कुल जोड़कर कुल संख्या से भाग देते हैं।`, `हर ${w.lowerSingular} के ${w.averageMeasure} को उसकी संख्या से गुणा करना सही भारित विधि है।`],
    findSuperGroupAverageFromSubgroups: [`ऊपरी ${w.upper} का औसत अधीन समूहों के कुलों से बनता है।`, `दो-स्तरीय औसत में पहले हर ${w.lowerSingular} का कुल और फिर संयुक्त औसत निकाला जाता है।`, `${w.lowerPlural} के आकार अलग होने से उनके औसतों को सीधे नहीं जोड़ा जा सकता।`, `${w.combinedAverage} पाने के लिए तीनों अधीन समूहों का भारित कुल लें।`],
    findMissingSectionAverage: [`पूर्ण कुल में से दो ज्ञात समूह-कुल घटाने पर तीसरे समूह का कुल मिलता है।`, `${w.missingAverage} के लिए संयुक्त कुल और ज्ञात कुलों का संतुलन बनाते हैं।`, `पहले ${w.upper} का पूरा कुल निकालें, फिर ज्ञात ${w.lowerPlural} के कुल हटाएँ।`, `अज्ञात औसत शेष कुल को तीसरे समूह की संख्या से भाग देने पर मिलता है।`],
    findSectionCountFromOverallAverage: [`दो समूहों की संख्याएँ संयुक्त औसत से उनकी दूरियों के उल्टे अनुपात में होती हैं।`, `ज्ञात समूह का भारित अंतर अज्ञात समूह के भारित अंतर के बराबर होगा।`, `संयुक्त औसत के दोनों ओर के औसत-अंतर संख्या का समीकरण बनाते हैं।`, `पहले समूह का कुल विचलन दूसरे समूह के कुल विचलन को संतुलित करता है।`],
    findMissingSubgroupCount: [`ज्ञात समूह-कुल और समग्र औसत से तीसरे समूह की संख्या का समीकरण बनता है।`, `अज्ञात संख्या को तीसरे औसत के साथ भार देकर संयुक्त कुल के बराबर रखते हैं।`, `पहले दो समूहों का कुल निकालकर समग्र कुल-समीकरण में रखें।`, `${w.missingCount} ज्ञात कुल और लक्ष्य औसत के अंतर से मिलती है।`],
    findSubgroupTotalFromAverageAndCount: [`समूह का कुल उसके औसत और सदस्य-संख्या का गुणनफल है।`, `${w.totalMeasure} सीधे ${w.averageMeasure} को संख्या से गुणा करके मिलता है।`, `औसत प्रति सदस्य मान है; कुल के लिए उसे सभी सदस्यों तक फैलाएँ।`, `एक समूह के औसत को उसकी संख्या से गुणा करना पर्याप्त है।`],
    findOverallTotalFromHierarchy: [`हर समूह का कुल निकालकर तीनों कुल जोड़ते हैं।`, `${w.combinedTotal} अधीन समूहों के भारित कुलों का योग है।`, `ऊपरी स्तर का कुल पाने के लिए प्रत्येक औसत को उसके समूह-आकार से गुणा करें।`, `तीनों ${w.lowerPlural} के अलग-अलग कुल मिलकर ${w.upper} का कुल बनाते हैं।`],
    findMissingLowerLevelAverage: [`मूल समूह के कुल में से दो ज्ञात निचले समूहों के कुल घटाएँ।`, `शेष सदस्यों का कुल निकालकर उनकी संख्या से भाग देने पर अज्ञात औसत मिलता है।`, `ऊपरी औसत को कुल में बदलना और ज्ञात कुल हटाना आवश्यक है।`, `${w.missingAverage} मूल कुल और ज्ञात निचले कुलों के अंतर से मिलता है।`],
  };
  const pa: Record<string, string[]> = {
    findClassAverageFromSectionAverages: [`ਸਮੂਹਾਂ ਦੇ ਆਕਾਰ ਵੱਖਰੇ ਹਨ, ਇਸ ਲਈ ਹਰ ${w.lowerSingular} ਦਾ ਕੁੱਲ ਪਹਿਲਾਂ ਕੱਢਣਾ ਹੋਵੇਗਾ।`, `ਸੰਯੁਕਤ ਔਸਤ ਸਧਾਰਨ ਔਸਤ ਨਹੀਂ; ${w.memberCounts} ਭਾਰ ਦਾ ਕੰਮ ਕਰਦੀਆਂ ਹਨ।`, `${w.combinedAverage} ਲਈ ਸਾਰੇ ਸਮੂਹ-ਕੁੱਲ ਜੋੜ ਕੇ ਕੁੱਲ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।`, `ਹਰ ${w.lowerSingular} ਦੇ ${w.averageMeasure} ਨੂੰ ਉਸ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਨਾ ਸਹੀ ਭਾਰਿਤ ਵਿਧੀ ਹੈ।`],
    findSuperGroupAverageFromSubgroups: [`ਉੱਪਰਲੇ ${w.upper} ਦੀ ਔਸਤ ਹੇਠਲੇ ਸਮੂਹਾਂ ਦੇ ਕੁੱਲਾਂ ਤੋਂ ਬਣਦੀ ਹੈ।`, `ਦੋ-ਪੱਧਰੀ ਔਸਤ ਵਿੱਚ ਪਹਿਲਾਂ ਹਰ ${w.lowerSingular} ਦਾ ਕੁੱਲ ਅਤੇ ਫਿਰ ਸੰਯੁਕਤ ਔਸਤ ਕੱਢੀ ਜਾਂਦੀ ਹੈ।`, `${w.lowerPlural} ਦੇ ਆਕਾਰ ਵੱਖਰੇ ਹੋਣ ਕਰਕੇ ਉਨ੍ਹਾਂ ਦੀਆਂ ਔਸਤਾਂ ਸਿੱਧੀਆਂ ਨਹੀਂ ਜੋੜੀਆਂ ਜਾ ਸਕਦੀਆਂ।`, `${w.combinedAverage} ਲਈ ਤਿੰਨਾਂ ਹੇਠਲੇ ਸਮੂਹਾਂ ਦਾ ਭਾਰਿਤ ਕੁੱਲ ਲਓ।`],
    findMissingSectionAverage: [`ਪੂਰੇ ਕੁੱਲ ਵਿੱਚੋਂ ਦੋ ਜਾਣੇ ਸਮੂਹ-ਕੁੱਲ ਘਟਾਉਣ ਉੱਤੇ ਤੀਜੇ ਸਮੂਹ ਦਾ ਕੁੱਲ ਮਿਲਦਾ ਹੈ।`, `${w.missingAverage} ਲਈ ਸੰਯੁਕਤ ਕੁੱਲ ਅਤੇ ਜਾਣੇ ਕੁੱਲਾਂ ਦਾ ਸੰਤੁਲਨ ਬਣਾਓ।`, `ਪਹਿਲਾਂ ${w.upper} ਦਾ ਪੂਰਾ ਕੁੱਲ ਕੱਢੋ, ਫਿਰ ਜਾਣੇ ${w.lowerPlural} ਦੇ ਕੁੱਲ ਹਟਾਓ।`, `ਅਣਜਾਣ ਔਸਤ ਬਚੇ ਕੁੱਲ ਨੂੰ ਤੀਜੇ ਸਮੂਹ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਮਿਲਦੀ ਹੈ।`],
    findSectionCountFromOverallAverage: [`ਦੋ ਸਮੂਹਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਸੰਯੁਕਤ ਔਸਤ ਤੋਂ ਉਨ੍ਹਾਂ ਦੀਆਂ ਦੂਰੀਆਂ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਹੁੰਦੀਆਂ ਹਨ।`, `ਜਾਣੇ ਸਮੂਹ ਦਾ ਭਾਰਿਤ ਅੰਤਰ ਅਣਜਾਣ ਸਮੂਹ ਦੇ ਭਾਰਿਤ ਅੰਤਰ ਦੇ ਬਰਾਬਰ ਹੋਵੇਗਾ।`, `ਸੰਯੁਕਤ ਔਸਤ ਦੇ ਦੋਵਾਂ ਪਾਸਿਆਂ ਦੇ ਔਸਤ-ਅੰਤਰ ਗਿਣਤੀ ਦਾ ਸਮੀਕਰਨ ਬਣਾਉਂਦੇ ਹਨ।`, `ਪਹਿਲੇ ਸਮੂਹ ਦਾ ਕੁੱਲ ਵਿਛੱਲਣ ਦੂਜੇ ਸਮੂਹ ਦੇ ਕੁੱਲ ਵਿਛੱਲਣ ਨੂੰ ਸੰਤੁਲਿਤ ਕਰਦਾ ਹੈ।`],
    findMissingSubgroupCount: [`ਜਾਣੇ ਸਮੂਹ-ਕੁੱਲ ਅਤੇ ਸਮੁੱਚੀ ਔਸਤ ਤੋਂ ਤੀਜੇ ਸਮੂਹ ਦੀ ਗਿਣਤੀ ਦਾ ਸਮੀਕਰਨ ਬਣਦਾ ਹੈ।`, `ਅਣਜਾਣ ਗਿਣਤੀ ਨੂੰ ਤੀਜੀ ਔਸਤ ਨਾਲ ਭਾਰ ਦੇ ਕੇ ਸੰਯੁਕਤ ਕੁੱਲ ਦੇ ਬਰਾਬਰ ਰੱਖੋ।`, `ਪਹਿਲੇ ਦੋ ਸਮੂਹਾਂ ਦਾ ਕੁੱਲ ਕੱਢ ਕੇ ਸਮੁੱਚੇ ਕੁੱਲ-ਸਮੀਕਰਨ ਵਿੱਚ ਰੱਖੋ।`, `${w.missingCount} ਜਾਣੇ ਕੁੱਲ ਅਤੇ ਲਕਸ਼ ਔਸਤ ਦੇ ਅੰਤਰ ਤੋਂ ਮਿਲਦੀ ਹੈ।`],
    findSubgroupTotalFromAverageAndCount: [`ਸਮੂਹ ਦਾ ਕੁੱਲ ਉਸ ਦੀ ਔਸਤ ਅਤੇ ਮੈਂਬਰ-ਗਿਣਤੀ ਦਾ ਗੁਣਨਫਲ ਹੈ।`, `${w.totalMeasure} ਸਿੱਧਾ ${w.averageMeasure} ਨੂੰ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਮਿਲਦਾ ਹੈ।`, `ਔਸਤ ਪ੍ਰਤੀ ਮੈਂਬਰ ਮੁੱਲ ਹੈ; ਕੁੱਲ ਲਈ ਇਸ ਨੂੰ ਸਾਰੇ ਮੈਂਬਰਾਂ ਤੱਕ ਫੈਲਾਓ।`, `ਇੱਕ ਸਮੂਹ ਦੀ ਔਸਤ ਨੂੰ ਉਸ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਨਾ ਕਾਫ਼ੀ ਹੈ।`],
    findOverallTotalFromHierarchy: [`ਹਰ ਸਮੂਹ ਦਾ ਕੁੱਲ ਕੱਢ ਕੇ ਤਿੰਨਾਂ ਕੁੱਲਾਂ ਨੂੰ ਜੋੜਦੇ ਹਾਂ।`, `${w.combinedTotal} ਹੇਠਲੇ ਸਮੂਹਾਂ ਦੇ ਭਾਰਿਤ ਕੁੱਲਾਂ ਦਾ ਜੋੜ ਹੈ।`, `ਉੱਪਰਲੇ ਪੱਧਰ ਦਾ ਕੁੱਲ ਲਈ ਹਰ ਔਸਤ ਨੂੰ ਉਸ ਦੇ ਸਮੂਹ-ਆਕਾਰ ਨਾਲ ਗੁਣਾ ਕਰੋ।`, `ਤਿੰਨਾਂ ${w.lowerPlural} ਦੇ ਵੱਖਰੇ ਕੁੱਲ ਮਿਲ ਕੇ ${w.upper} ਦਾ ਕੁੱਲ ਬਣਾਉਂਦੇ ਹਨ।`],
    findMissingLowerLevelAverage: [`ਮੂਲ ਸਮੂਹ ਦੇ ਕੁੱਲ ਵਿੱਚੋਂ ਦੋ ਜਾਣੇ ਹੇਠਲੇ ਸਮੂਹਾਂ ਦੇ ਕੁੱਲ ਘਟਾਓ।`, `ਬਾਕੀ ਮੈਂਬਰਾਂ ਦਾ ਕੁੱਲ ਕੱਢ ਕੇ ਉਨ੍ਹਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦੇਣ ਉੱਤੇ ਅਣਜਾਣ ਔਸਤ ਮਿਲਦੀ ਹੈ।`, `ਉੱਪਰਲੀ ਔਸਤ ਨੂੰ ਕੁੱਲ ਵਿੱਚ ਬਦਲਣਾ ਅਤੇ ਜਾਣੇ ਕੁੱਲ ਹਟਾਉਣਾ ਲਾਜ਼ਮੀ ਹੈ।`, `${w.missingAverage} ਮੂਲ ਕੁੱਲ ਅਤੇ ਜਾਣੇ ਹੇਠਲੇ ਕੁੱਲਾਂ ਦੇ ਅੰਤਰ ਤੋਂ ਮਿਲਦੀ ਹੈ।`],
  };
  return (language === "hi" ? hi : pa)[pkg.solveMode]![v]!;
}

function finalLine(pkg: Avg001QuestionPackage, language: Avg001Cp006PilotLanguage) {
  const prefixes = language === "hi" ? ["अतः", "इसलिए", "गणना से", "फलतः"] : ["ਇਸ ਲਈ", "ਅਤੇ ਇਸ ਕਰਕੇ", "ਗਿਣਤੀ ਤੋਂ", "ਫਲਸਰੂਪ"];
  return `${prefixes[localVariant(pkg) % 4]} ${finalLabel(pkg, language)} ${localizedAnswer(pkg, language)} ${language === "hi" ? "है।" : "ਹੈ।"}`;
}

export function localizedCp006Stem(pkg: Avg001QuestionPackage, language: Avg001Cp006PilotLanguage) {
  return stem(pkg, language);
}

export function localizedCp006Explanation(pkg: Avg001QuestionPackage, language: Avg001Cp006PilotLanguage) {
  const c1 = Number(raw(pkg, "subgroupCount1"));
  const c2 = Number(raw(pkg, "subgroupCount2"));
  const c3 = Number(raw(pkg, "subgroupCount3"));
  const a1 = raw(pkg, "subgroupAverage1");
  const a2 = raw(pkg, "subgroupAverage2");
  const a3 = raw(pkg, "subgroupAverage3");
  const overall = raw(pkg, "overallAverage");
  const parentCount = raw(pkg, "parentCount");
  const totals = pkg.parameters.values.subgroupTotals ?? [];
  const t1 = rationalRaw(totals[0]);
  const t2 = rationalRaw(totals[1]);
  const t3 = rationalRaw(totals[2]);
  const overallTotal = rationalRaw(pkg.parameters.values.overallTotal);
  const knownTotal = String(Number(t1) + Number(t2));
  const answer = numberFromAnswer(pkg);
  const hi = language === "hi";
  let second: string;
  let third: string;
  switch (pkg.solveMode) {
    case "findClassAverageFromSectionAverages":
    case "findSuperGroupAverageFromSubgroups":
      second = hi ? `$$समूह-कुल = ${c1}×${a1}+${c2}×${a2}+${c3}×${a3} = ${t1}+${t2}+${t3} = ${overallTotal}$$` : `$$ਸਮੂਹ-ਕੁੱਲ = ${c1}×${a1}+${c2}×${a2}+${c3}×${a3} = ${t1}+${t2}+${t3} = ${overallTotal}$$`;
      third = hi ? `$$संयुक्त औसत = ${overallTotal}÷${c1 + c2 + c3} = ${answer}$$` : `$$ਸੰਯੁਕਤ ਔਸਤ = ${overallTotal}÷${c1 + c2 + c3} = ${answer}$$`;
      break;
    case "findMissingSectionAverage":
    case "findMissingLowerLevelAverage":
      second = hi ? `$$पूर्ण कुल = ${parentCount}×${overall} = ${overallTotal}; ज्ञात कुल = ${t1}+${t2} = ${knownTotal}$$` : `$$ਪੂਰਾ ਕੁੱਲ = ${parentCount}×${overall} = ${overallTotal}; ਜਾਣਿਆ ਕੁੱਲ = ${t1}+${t2} = ${knownTotal}$$`;
      third = hi ? `$$अज्ञात औसत = (${overallTotal}-${knownTotal})÷${c3} = ${answer}$$` : `$$ਅਣਜਾਣ ਔਸਤ = (${overallTotal}-${knownTotal})÷${c3} = ${answer}$$`;
      break;
    case "findSectionCountFromOverallAverage":
      second = hi ? `$$निचला अंतर = ${overall}-${a1}; ऊपरी अंतर = ${a3}-${overall}$$` : `$$ਹੇਠਲਾ ਅੰਤਰ = ${overall}-${a1}; ਉੱਪਰਲਾ ਅੰਤਰ = ${a3}-${overall}$$`;
      third = hi ? `$$दूसरी संख्या = ${c1}×(${overall}-${a1})÷(${a3}-${overall}) = ${answer}$$` : `$$ਦੂਜੀ ਗਿਣਤੀ = ${c1}×(${overall}-${a1})÷(${a3}-${overall}) = ${answer}$$`;
      break;
    case "findMissingSubgroupCount":
      second = hi ? `$$ज्ञात कुल = ${c1}×${a1}+${c2}×${a2} = ${knownTotal}$$` : `$$ਜਾਣਿਆ ਕੁੱਲ = ${c1}×${a1}+${c2}×${a2} = ${knownTotal}$$`;
      third = hi ? `$$अज्ञात संख्या = [${c1 + c2}×${overall}-${knownTotal}]÷(${a3}-${overall}) = ${answer}$$` : `$$ਅਣਜਾਣ ਗਿਣਤੀ = [${c1 + c2}×${overall}-${knownTotal}]÷(${a3}-${overall}) = ${answer}$$`;
      break;
    case "findSubgroupTotalFromAverageAndCount":
      second = hi ? `$$समूह-कुल = औसत×संख्या$$` : `$$ਸਮੂਹ-ਕੁੱਲ = ਔਸਤ×ਗਿਣਤੀ$$`;
      third = hi ? `$$समूह-कुल = ${a1}×${c1} = ${answer}$$` : `$$ਸਮੂਹ-ਕੁੱਲ = ${a1}×${c1} = ${answer}$$`;
      break;
    case "findOverallTotalFromHierarchy":
      second = hi ? `$$समूह-कुल = ${c1}×${a1}, ${c2}×${a2}, ${c3}×${a3} = ${t1}, ${t2}, ${t3}$$` : `$$ਸਮੂਹ-ਕੁੱਲ = ${c1}×${a1}, ${c2}×${a2}, ${c3}×${a3} = ${t1}, ${t2}, ${t3}$$`;
      third = hi ? `$$संयुक्त कुल = ${t1}+${t2}+${t3} = ${answer}$$` : `$$ਸੰਯੁਕਤ ਕੁੱਲ = ${t1}+${t2}+${t3} = ${answer}$$`;
      break;
    default: throw new Error(`Unsupported CP-006 solve mode ${pkg.solveMode}`);
  }
  return { lines: [intro(pkg, language), second, third, finalLine(pkg, language)] };
}
