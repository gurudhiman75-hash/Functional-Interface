import {
  AVG_001_CP003_MULTILINGUAL_PILOT,
  getAvg001Cp003LocalizedQlIds,
  runAvg001Cp003LocalizationPilot as runBasePilot,
} from "./cp003-localization-pilot-runtime";
import type { Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export {
  AVG_001_CP003_MULTILINGUAL_PILOT,
  getAvg001Cp003LocalizedQlIds,
};

type PilotLanguage = "hi" | "pa";

type Kind =
  | "abstract"
  | "marks"
  | "salary"
  | "sales"
  | "price"
  | "output"
  | "parcel"
  | "weight"
  | "age"
  | "cricket"
  | "gap-class"
  | "gap-team"
  | "gap-workers"
  | "gap-machines";

function clean(value: unknown) {
  const text = String(value ?? "");
  return text.replace(/^(\d[\d,]*)\.0$/, "$1");
}

function rationalText(value: unknown) {
  if (value && typeof value === "object" && "numerator" in value && "denominator" in value) {
    const numerator = Number(value.numerator);
    const denominator = Number(value.denominator);
    if (denominator === 1) return String(numerator);
    const decimal = numerator / denominator;
    return Number.isInteger(decimal * 10) ? decimal.toFixed(1) : `${numerator}/${denominator}`;
  }
  return clean(value);
}

function v(pkg: Avg001QuestionPackage, key: string) {
  const rendered = pkg.parameters.renderVariables[key];
  if (rendered !== undefined) return clean(rendered);
  return rationalText(pkg.parameters.values[key]);
}

function qlNumber(pkg: Avg001QuestionPackage) {
  return Number(pkg.questionLanguageId.slice(-3));
}

function variant(pkg: Avg001QuestionPackage) {
  return qlNumber(pkg) % 3;
}

function isGapMode(pkg: Avg001QuestionPackage) {
  return pkg.solveMode === "findOriginalCountFromJoiningMemberShift" || pkg.solveMode === "findOriginalCountFromLeavingMemberShift";
}

function isAge(pkg: Avg001QuestionPackage) {
  if (pkg.solveMode === "findInningsValueOrNewCricketAverage") return false;
  const scenario = pkg.parameters.scenarioVariant;
  return pkg.parameters.contextDomain === "Family" || /age|teacher|child|newborn|afteryears|elapsedyears|retir|playerage/i.test(scenario);
}

function kind(pkg: Avg001QuestionPackage): Kind {
  if (pkg.solveMode === "findInningsValueOrNewCricketAverage") return "cricket";
  if (isGapMode(pkg)) {
    if (pkg.parameters.contextDomain === "Education") return "gap-class";
    if (pkg.parameters.contextDomain === "Sports") return "gap-team";
    if (pkg.parameters.contextDomain === "Production") return "gap-machines";
    return "gap-workers";
  }
  if (isAge(pkg)) return "age";
  const scenario = pkg.parameters.scenarioVariant;
  if (/salary/i.test(scenario)) return "salary";
  if (/sales|day/i.test(scenario)) return "sales";
  if (/price/i.test(scenario)) return "price";
  if (/machine|output/i.test(scenario)) return "output";
  if (/parcel/i.test(scenario)) return "parcel";
  if (/weight|person/i.test(scenario)) return "weight";
  if (/score|test|reading|marks/i.test(scenario)) return "marks";
  return "abstract";
}

function hiRole(pkg: Avg001QuestionPackage) {
  const scenario = pkg.parameters.scenarioVariant;
  if (/teacher/i.test(scenario)) return { direct: "शिक्षक", oblique: "शिक्षक" };
  if (/student/i.test(scenario)) return { direct: "विद्यार्थी", oblique: "विद्यार्थी" };
  if (/employee|retir/i.test(scenario)) return { direct: "कर्मचारी", oblique: "कर्मचारी" };
  if (/worker/i.test(scenario)) return { direct: "कर्मी", oblique: "कर्मी" };
  if (/player/i.test(scenario)) return { direct: "खिलाड़ी", oblique: "खिलाड़ी" };
  if (/child|newborn/i.test(scenario)) return { direct: "बच्चा", oblique: "बच्चे" };
  return { direct: "सदस्य", oblique: "सदस्य" };
}

function paRole(pkg: Avg001QuestionPackage) {
  const scenario = pkg.parameters.scenarioVariant;
  if (/teacher/i.test(scenario)) return { direct: "ਅਧਿਆਪਕ", oblique: "ਅਧਿਆਪਕ" };
  if (/student/i.test(scenario)) return { direct: "ਵਿਦਿਆਰਥੀ", oblique: "ਵਿਦਿਆਰਥੀ" };
  if (/employee|retir/i.test(scenario)) return { direct: "ਕਰਮਚਾਰੀ", oblique: "ਕਰਮਚਾਰੀ" };
  if (/worker/i.test(scenario)) return { direct: "ਕਾਮਾ", oblique: "ਕਾਮੇ" };
  if (/player/i.test(scenario)) return { direct: "ਖਿਡਾਰੀ", oblique: "ਖਿਡਾਰੀ" };
  if (/child|newborn/i.test(scenario)) return { direct: "ਬੱਚਾ", oblique: "ਬੱਚੇ" };
  return { direct: "ਮੈਂਬਰ", oblique: "ਮੈਂਬਰ" };
}

function hiAgeGroup(pkg: Avg001QuestionPackage) {
  const scenario = pkg.parameters.scenarioVariant;
  if (/teacherJoinsClass|findTeacherAge/i.test(scenario)) return "विद्यार्थियों";
  if (/student/i.test(scenario) || pkg.parameters.contextDomain === "Classroom") return "विद्यार्थियों";
  if (pkg.parameters.contextDomain === "Family") return "परिवार के सदस्यों";
  if (pkg.parameters.contextDomain === "Sports") return "खिलाड़ियों";
  if (pkg.parameters.contextDomain === "Workplace") return /worker/i.test(scenario) ? "कर्मियों" : "कर्मचारियों";
  return "लोगों";
}

function paAgeGroup(pkg: Avg001QuestionPackage) {
  const scenario = pkg.parameters.scenarioVariant;
  if (/teacherJoinsClass|findTeacherAge/i.test(scenario)) return "ਵਿਦਿਆਰਥੀਆਂ";
  if (/student/i.test(scenario) || pkg.parameters.contextDomain === "Classroom") return "ਵਿਦਿਆਰਥੀਆਂ";
  if (pkg.parameters.contextDomain === "Family") return "ਪਰਿਵਾਰ ਦੇ ਮੈਂਬਰਾਂ";
  if (pkg.parameters.contextDomain === "Sports") return "ਖਿਡਾਰੀਆਂ";
  if (pkg.parameters.contextDomain === "Workplace") return /worker/i.test(scenario) ? "ਕਾਮਿਆਂ" : "ਕਰਮਚਾਰੀਆਂ";
  return "ਲੋਕਾਂ";
}

function hindiAgeStem(pkg: Avg001QuestionPackage) {
  const count = v(pkg, "oldCount");
  const oldAverage = v(pkg, "oldAverage");
  const newAverage = v(pkg, "newAverage");
  const years = Number(pkg.parameters.values.yearsElapsed ?? 0);
  const after = years > 0 ? `${years} वर्ष बाद, ` : "";
  const group = hiAgeGroup(pkg);
  const role = hiRole(pkg);
  const added = v(pkg, "addedValue");
  const removed = v(pkg, "removedValue");
  const oldValue = v(pkg, "oldValue");
  const newValue = v(pkg, "newValue");
  const target = String(pkg.parameters.values.replacementTarget ?? "new");
  const newborn = /newborn/i.test(pkg.parameters.scenarioVariant);
  const lead = `${group === "परिवार के सदस्यों" ? `परिवार के ${count} सदस्यों` : `${count} ${group}`} की औसत आयु ${oldAverage} वर्ष है।`;

  switch (pkg.solveMode) {
    case "findNewAverageAfterAddition":
      if (newborn) return `${lead} ${after}परिवार में एक बच्चे का जन्म होता है। नई औसत आयु ज्ञात कीजिए।`;
      return `${lead} ${after}${added} वर्ष का एक ${role.direct} शामिल होता है। नई औसत आयु ज्ञात कीजिए।`;
    case "findNewAverageAfterRemoval":
      return `${lead} ${after}${removed} वर्ष का एक ${role.direct} समूह छोड़ देता है। शेष लोगों की औसत आयु ज्ञात कीजिए।`;
    case "findNewAverageAfterReplacement":
      return `${lead} ${after}${oldValue} वर्ष के ${role.oblique} के स्थान पर ${newValue} वर्ष का ${role.direct} आता है। नई औसत आयु ज्ञात कीजिए।`;
    case "findAddedMemberValueFromShift":
      return `${lead} ${after}एक ${role.oblique} के शामिल होने पर औसत आयु ${newAverage} वर्ष हो जाती है। उस ${role.oblique} की आयु ज्ञात कीजिए।`;
    case "findRemovedMemberValueFromShift":
      return `${lead} ${after}एक ${role.direct} के जाने पर औसत आयु ${newAverage} वर्ष हो जाती है। जाने वाले ${role.oblique} की आयु ज्ञात कीजिए।`;
    case "findReplacementValueFromShift":
      return target === "old"
        ? `${lead} ${after}एक ${role.direct} के स्थान पर ${newValue} वर्ष का ${role.direct} आने से औसत आयु ${newAverage} वर्ष हो जाती है। पुराने ${role.oblique} की आयु ज्ञात कीजिए।`
        : `${lead} ${after}${oldValue} वर्ष के ${role.oblique} को बदलने पर औसत आयु ${newAverage} वर्ष हो जाती है। नए ${role.oblique} की आयु ज्ञात कीजिए।`;
    default:
      return pkg.stem;
  }
}

function punjabiAgeStem(pkg: Avg001QuestionPackage) {
  const count = v(pkg, "oldCount");
  const oldAverage = v(pkg, "oldAverage");
  const newAverage = v(pkg, "newAverage");
  const years = Number(pkg.parameters.values.yearsElapsed ?? 0);
  const after = years > 0 ? `${years} ਸਾਲ ਬਾਅਦ, ` : "";
  const group = paAgeGroup(pkg);
  const role = paRole(pkg);
  const added = v(pkg, "addedValue");
  const removed = v(pkg, "removedValue");
  const oldValue = v(pkg, "oldValue");
  const newValue = v(pkg, "newValue");
  const target = String(pkg.parameters.values.replacementTarget ?? "new");
  const newborn = /newborn/i.test(pkg.parameters.scenarioVariant);
  const lead = group === "ਪਰਿਵਾਰ ਦੇ ਮੈਂਬਰਾਂ"
    ? `ਪਰਿਵਾਰ ਦੇ ${count} ਮੈਂਬਰਾਂ ਦੀ ਔਸਤ ਉਮਰ ${oldAverage} ਸਾਲ ਹੈ।`
    : `${count} ${group} ਦੀ ਔਸਤ ਉਮਰ ${oldAverage} ਸਾਲ ਹੈ।`;

  switch (pkg.solveMode) {
    case "findNewAverageAfterAddition":
      if (newborn) return `${lead} ${after}ਪਰਿਵਾਰ ਵਿੱਚ ਇੱਕ ਬੱਚਾ ਜਨਮ ਲੈਂਦਾ ਹੈ। ਨਵੀਂ ਔਸਤ ਉਮਰ ਪਤਾ ਕਰੋ।`;
      return `${lead} ${after}${added} ਸਾਲ ਦਾ ਇੱਕ ${role.direct} ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ। ਨਵੀਂ ਔਸਤ ਉਮਰ ਪਤਾ ਕਰੋ।`;
    case "findNewAverageAfterRemoval":
      return `${lead} ${after}${removed} ਸਾਲ ਦਾ ਇੱਕ ${role.direct} ਸਮੂਹ ਛੱਡ ਦਿੰਦਾ ਹੈ। ਬਾਕੀ ਲੋਕਾਂ ਦੀ ਔਸਤ ਉਮਰ ਪਤਾ ਕਰੋ।`;
    case "findNewAverageAfterReplacement":
      return `${lead} ${after}${oldValue} ਸਾਲ ਦੇ ${role.oblique} ਦੀ ਥਾਂ ${newValue} ਸਾਲ ਦਾ ${role.direct} ਆਉਂਦਾ ਹੈ। ਨਵੀਂ ਔਸਤ ਉਮਰ ਪਤਾ ਕਰੋ।`;
    case "findAddedMemberValueFromShift":
      return `${lead} ${after}ਇੱਕ ${role.oblique} ਦੇ ਸ਼ਾਮਲ ਹੋਣ ਉੱਤੇ ਔਸਤ ਉਮਰ ${newAverage} ਸਾਲ ਹੋ ਜਾਂਦੀ ਹੈ। ਉਸ ${role.oblique} ਦੀ ਉਮਰ ਪਤਾ ਕਰੋ।`;
    case "findRemovedMemberValueFromShift":
      return `${lead} ${after}ਇੱਕ ${role.direct} ਦੇ ਜਾਣ ਉੱਤੇ ਔਸਤ ਉਮਰ ${newAverage} ਸਾਲ ਹੋ ਜਾਂਦੀ ਹੈ। ਜਾਣ ਵਾਲੇ ${role.oblique} ਦੀ ਉਮਰ ਪਤਾ ਕਰੋ।`;
    case "findReplacementValueFromShift":
      return target === "old"
        ? `${lead} ${after}ਇੱਕ ${role.direct} ਦੀ ਥਾਂ ${newValue} ਸਾਲ ਦਾ ${role.direct} ਆਉਣ ਨਾਲ ਔਸਤ ਉਮਰ ${newAverage} ਸਾਲ ਹੋ ਜਾਂਦੀ ਹੈ। ਪੁਰਾਣੇ ${role.oblique} ਦੀ ਉਮਰ ਪਤਾ ਕਰੋ।`
        : `${lead} ${after}${oldValue} ਸਾਲ ਦੇ ${role.oblique} ਨੂੰ ਬਦਲਣ ਉੱਤੇ ਔਸਤ ਉਮਰ ${newAverage} ਸਾਲ ਹੋ ਜਾਂਦੀ ਹੈ। ਨਵੇਂ ${role.oblique} ਦੀ ਉਮਰ ਪਤਾ ਕਰੋ।`;
    default:
      return pkg.stem;
  }
}

function hindiGapStem(pkg: Avg001QuestionPackage, k: Kind) {
  const oldAverage = v(pkg, "oldAverage");
  const member = v(pkg, "memberValue");
  const shift = v(pkg, "averageChange");
  const newAverage = v(pkg, "newAverage");
  const joining = pkg.solveMode === "findOriginalCountFromJoiningMemberShift";
  const position = ["प्रारंभ में", "परिवर्तन से पहले", "मूल समूह में"][variant(pkg)]!;
  const contexts = {
    "gap-class": {
      lead: `एक कक्षा के विद्यार्थियों के अंकों का औसत ${oldAverage} है।`,
      join: `${member} अंक पाने वाला एक नया विद्यार्थी कक्षा में आता है`,
      leave: `${member} अंक पाने वाला एक विद्यार्थी कक्षा छोड़ देता है`,
      plural: "विद्यार्थियों",
      unit: "अंक",
    },
    "gap-team": {
      lead: `एक टीम के खिलाड़ियों का औसत स्कोर ${oldAverage} रन है।`,
      join: `${member} रन बनाने वाला एक नया खिलाड़ी टीम में शामिल होता है`,
      leave: `${member} रन बनाने वाला एक खिलाड़ी टीम छोड़ देता है`,
      plural: "खिलाड़ियों",
      unit: "रन",
    },
    "gap-workers": {
      lead: `एक कार्य-दल के कर्मियों का औसत उत्पादन ${oldAverage} इकाइयाँ है।`,
      join: `${member} इकाइयाँ बनाने वाला एक नया कर्मी दल में शामिल होता है`,
      leave: `${member} इकाइयाँ बनाने वाला एक कर्मी दल छोड़ देता है`,
      plural: "कर्मियों",
      unit: "इकाइयाँ",
    },
    "gap-machines": {
      lead: `एक उत्पादन इकाई की मशीनों का औसत उत्पादन ${oldAverage} इकाइयाँ है।`,
      join: `${member} इकाइयाँ बनाने वाली एक नई मशीन जोड़ दी जाती है`,
      leave: `${member} इकाइयाँ बनाने वाली एक मशीन हटा दी जाती है`,
      plural: "मशीनों",
      unit: "इकाइयाँ",
    },
  } as const;
  const c = contexts[k as keyof typeof contexts];
  return joining
    ? `${c.lead} ${c.join}, जिससे औसत ${shift} ${c.unit} बढ़ जाता है। ${position} ${c.plural} की संख्या ज्ञात कीजिए।`
    : `${c.lead} ${c.leave}, जिसके बाद औसत ${newAverage} ${c.unit} हो जाता है। ${position} ${c.plural} की संख्या ज्ञात कीजिए।`;
}

function punjabiGapStem(pkg: Avg001QuestionPackage, k: Kind) {
  const oldAverage = v(pkg, "oldAverage");
  const member = v(pkg, "memberValue");
  const shift = v(pkg, "averageChange");
  const newAverage = v(pkg, "newAverage");
  const joining = pkg.solveMode === "findOriginalCountFromJoiningMemberShift";
  const position = ["ਸ਼ੁਰੂ ਵਿੱਚ", "ਬਦਲਾਅ ਤੋਂ ਪਹਿਲਾਂ", "ਮੂਲ ਸਮੂਹ ਵਿੱਚ"][variant(pkg)]!;
  const contexts = {
    "gap-class": {
      lead: `ਇੱਕ ਜਮਾਤ ਦੇ ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਅੰਕਾਂ ਦੀ ਔਸਤ ${oldAverage} ਹੈ।`,
      join: `${member} ਅੰਕ ਲੈਣ ਵਾਲਾ ਇੱਕ ਨਵਾਂ ਵਿਦਿਆਰਥੀ ਜਮਾਤ ਵਿੱਚ ਆਉਂਦਾ ਹੈ`,
      leave: `${member} ਅੰਕ ਲੈਣ ਵਾਲਾ ਇੱਕ ਵਿਦਿਆਰਥੀ ਜਮਾਤ ਛੱਡ ਦਿੰਦਾ ਹੈ`,
      plural: "ਵਿਦਿਆਰਥੀਆਂ",
      unit: "ਅੰਕ",
    },
    "gap-team": {
      lead: `ਇੱਕ ਟੀਮ ਦੇ ਖਿਡਾਰੀਆਂ ਦਾ ਔਸਤ ਸਕੋਰ ${oldAverage} ਦੌੜਾਂ ਹੈ।`,
      join: `${member} ਦੌੜਾਂ ਬਣਾਉਣ ਵਾਲਾ ਇੱਕ ਨਵਾਂ ਖਿਡਾਰੀ ਟੀਮ ਵਿੱਚ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ`,
      leave: `${member} ਦੌੜਾਂ ਬਣਾਉਣ ਵਾਲਾ ਇੱਕ ਖਿਡਾਰੀ ਟੀਮ ਛੱਡ ਦਿੰਦਾ ਹੈ`,
      plural: "ਖਿਡਾਰੀਆਂ",
      unit: "ਦੌੜਾਂ",
    },
    "gap-workers": {
      lead: `ਇੱਕ ਕਾਰਜ-ਦਲ ਦੇ ਕਾਮਿਆਂ ਦਾ ਔਸਤ ਉਤਪਾਦਨ ${oldAverage} ਇਕਾਈਆਂ ਹੈ।`,
      join: `${member} ਇਕਾਈਆਂ ਬਣਾਉਣ ਵਾਲਾ ਇੱਕ ਨਵਾਂ ਕਾਮਾ ਦਲ ਵਿੱਚ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ`,
      leave: `${member} ਇਕਾਈਆਂ ਬਣਾਉਣ ਵਾਲਾ ਇੱਕ ਕਾਮਾ ਦਲ ਛੱਡ ਦਿੰਦਾ ਹੈ`,
      plural: "ਕਾਮਿਆਂ",
      unit: "ਇਕਾਈਆਂ",
    },
    "gap-machines": {
      lead: `ਇੱਕ ਉਤਪਾਦਨ ਇਕਾਈ ਦੀਆਂ ਮਸ਼ੀਨਾਂ ਦਾ ਔਸਤ ਉਤਪਾਦਨ ${oldAverage} ਇਕਾਈਆਂ ਹੈ।`,
      join: `${member} ਇਕਾਈਆਂ ਬਣਾਉਣ ਵਾਲੀ ਇੱਕ ਨਵੀਂ ਮਸ਼ੀਨ ਜੋੜੀ ਜਾਂਦੀ ਹੈ`,
      leave: `${member} ਇਕਾਈਆਂ ਬਣਾਉਣ ਵਾਲੀ ਇੱਕ ਮਸ਼ੀਨ ਹਟਾਈ ਜਾਂਦੀ ਹੈ`,
      plural: "ਮਸ਼ੀਨਾਂ",
      unit: "ਇਕਾਈਆਂ",
    },
  } as const;
  const c = contexts[k as keyof typeof contexts];
  return joining
    ? `${c.lead} ${c.join}, ਜਿਸ ਨਾਲ ਔਸਤ ${shift} ${c.unit} ਵਧ ਜਾਂਦੀ ਹੈ। ${position} ${c.plural} ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`
    : `${c.lead} ${c.leave}, ਜਿਸ ਤੋਂ ਬਾਅਦ ਔਸਤ ${newAverage} ${c.unit} ਹੋ ਜਾਂਦੀ ਹੈ। ${position} ${c.plural} ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`;
}

function hindiCricketStem(pkg: Avg001QuestionPackage) {
  const innings = v(pkg, "inningsCount") || v(pkg, "oldCount");
  const oldAverage = v(pkg, "oldAverage");
  const newAverage = v(pkg, "newAverage");
  const nextScore = v(pkg, "nextScore") || v(pkg, "addedValue");
  const formsRequired = [
    `एक बल्लेबाज का ${innings} पारियों के बाद औसत ${oldAverage} रन है। औसत ${newAverage} करने के लिए अगली पारी में कितने रन चाहिए?`,
    `${innings} पारियों में बल्लेबाजी औसत ${oldAverage} रन है। इसे ${newAverage} तक पहुँचाने के लिए अगली पारी का आवश्यक स्कोर ज्ञात कीजिए।`,
    `एक खिलाड़ी ने ${innings} पारियों में औसतन ${oldAverage} रन बनाए हैं। अगली पारी में कितने रन बनाने पर औसत ${newAverage} हो जाएगा?`,
  ];
  const formsNewAverage = [
    `एक बल्लेबाज का ${innings} पारियों के बाद औसत ${oldAverage} रन है। अगली पारी में ${nextScore} रन बनाने पर नया औसत ज्ञात कीजिए।`,
    `${innings} पारियों में बल्लेबाजी औसत ${oldAverage} रन है। अगली पारी का स्कोर ${nextScore} रन है। नया औसत कितना होगा?`,
    `एक खिलाड़ी ने ${innings} पारियाँ ${oldAverage} रन के औसत से खेली हैं। अगली पारी में ${nextScore} रन बनाने के बाद उसका औसत ज्ञात कीजिए।`,
  ];
  return pkg.parameters.answerType === "AVERAGE" ? formsNewAverage[variant(pkg)]! : formsRequired[variant(pkg)]!;
}

function punjabiCricketStem(pkg: Avg001QuestionPackage) {
  const innings = v(pkg, "inningsCount") || v(pkg, "oldCount");
  const oldAverage = v(pkg, "oldAverage");
  const newAverage = v(pkg, "newAverage");
  const nextScore = v(pkg, "nextScore") || v(pkg, "addedValue");
  const formsRequired = [
    `ਇੱਕ ਬੱਲੇਬਾਜ਼ ਦੀ ${innings} ਪਾਰੀਆਂ ਤੋਂ ਬਾਅਦ ਔਸਤ ${oldAverage} ਦੌੜਾਂ ਹੈ। ਔਸਤ ${newAverage} ਕਰਨ ਲਈ ਅਗਲੀ ਪਾਰੀ ਵਿੱਚ ਕਿੰਨੀਆਂ ਦੌੜਾਂ ਚਾਹੀਦੀਆਂ ਹਨ?`,
    `${innings} ਪਾਰੀਆਂ ਵਿੱਚ ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ ${oldAverage} ਦੌੜਾਂ ਹੈ। ਇਸ ਨੂੰ ${newAverage} ਤੱਕ ਪਹੁੰਚਾਉਣ ਲਈ ਅਗਲੀ ਪਾਰੀ ਦਾ ਲੋੜੀਂਦਾ ਸਕੋਰ ਪਤਾ ਕਰੋ।`,
    `ਇੱਕ ਖਿਡਾਰੀ ਨੇ ${innings} ਪਾਰੀਆਂ ਵਿੱਚ ਔਸਤਨ ${oldAverage} ਦੌੜਾਂ ਬਣਾਈਆਂ ਹਨ। ਅਗਲੀ ਪਾਰੀ ਵਿੱਚ ਕਿੰਨੀਆਂ ਦੌੜਾਂ ਬਣਾਉਣ ਉੱਤੇ ਔਸਤ ${newAverage} ਹੋ ਜਾਵੇਗੀ?`,
  ];
  const formsNewAverage = [
    `ਇੱਕ ਬੱਲੇਬਾਜ਼ ਦੀ ${innings} ਪਾਰੀਆਂ ਤੋਂ ਬਾਅਦ ਔਸਤ ${oldAverage} ਦੌੜਾਂ ਹੈ। ਅਗਲੀ ਪਾਰੀ ਵਿੱਚ ${nextScore} ਦੌੜਾਂ ਬਣਾਉਣ ਉੱਤੇ ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।`,
    `${innings} ਪਾਰੀਆਂ ਵਿੱਚ ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ ${oldAverage} ਦੌੜਾਂ ਹੈ। ਅਗਲੀ ਪਾਰੀ ਦਾ ਸਕੋਰ ${nextScore} ਦੌੜਾਂ ਹੈ। ਨਵੀਂ ਔਸਤ ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
    `ਇੱਕ ਖਿਡਾਰੀ ਨੇ ${innings} ਪਾਰੀਆਂ ${oldAverage} ਦੌੜਾਂ ਦੀ ਔਸਤ ਨਾਲ ਖੇਡੀਆਂ ਹਨ। ਅਗਲੀ ਪਾਰੀ ਵਿੱਚ ${nextScore} ਦੌੜਾਂ ਬਣਾਉਣ ਤੋਂ ਬਾਅਦ ਉਸ ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।`,
  ];
  return pkg.parameters.answerType === "AVERAGE" ? formsNewAverage[variant(pkg)]! : formsRequired[variant(pkg)]!;
}

function hindiNonAgeStem(pkg: Avg001QuestionPackage, k: Kind) {
  const count = v(pkg, "oldCount");
  const oldAverage = v(pkg, "oldAverage");
  const newAverage = v(pkg, "newAverage");
  const added = v(pkg, "addedValue");
  const removed = v(pkg, "removedValue");
  const oldValue = v(pkg, "oldValue");
  const newValue = v(pkg, "newValue");
  const target = String(pkg.parameters.values.replacementTarget ?? "new");

  const direct = {
    abstract: {
      lead: `${count} संख्याओं का औसत ${oldAverage} है।`, add: `${added} जोड़ दिया जाता है`, remove: `${removed} हटा दिया जाता है`, replace: `${oldValue} के स्थान पर ${newValue} रखा जाता है`, noun: "संख्या", answer: "मान",
    },
    marks: {
      lead: `एक विद्यार्थी के ${count} परीक्षा-अंकों का औसत ${oldAverage} अंक है।`, add: `अगली परीक्षा में उसे ${added} अंक मिलते हैं`, remove: `${removed} अंक वाली एक परीक्षा को गणना से हटा दिया जाता है`, replace: `${oldValue} अंक के स्थान पर ${newValue} अंक दर्ज किए जाते हैं`, noun: "परीक्षा का स्कोर", answer: "अंक",
    },
    salary: {
      lead: `${count} कर्मचारियों का औसत वेतन ₹${oldAverage} है।`, add: `₹${added} वेतन वाला एक नया कर्मचारी नियुक्त होता है`, remove: `₹${removed} वेतन वाला एक कर्मचारी नौकरी छोड़ देता है`, replace: `₹${oldValue} वेतन वाले कर्मचारी के स्थान पर ₹${newValue} वेतन वाला कर्मचारी आता है`, noun: "कर्मचारी का वेतन", answer: "वेतन",
    },
    sales: {
      lead: `${count} दिनों की औसत दैनिक बिक्री ₹${oldAverage} है।`, add: `अगले दिन बिक्री ₹${added} होती है`, remove: `₹${removed} बिक्री वाले एक दिन को गणना से हटा दिया जाता है`, replace: `₹${oldValue} की बिक्री को ₹${newValue} से संशोधित किया जाता है`, noun: "दिन की बिक्री", answer: "बिक्री",
    },
    price: {
      lead: `${count} वस्तुओं की औसत कीमत ₹${oldAverage} है।`, add: `₹${added} की एक और कीमत सूची में जोड़ी जाती है`, remove: `₹${removed} की एक कीमत सूची से हटा दी जाती है`, replace: `₹${oldValue} की कीमत के स्थान पर ₹${newValue} दर्ज किया जाता है`, noun: "कीमत", answer: "कीमत",
    },
    output: {
      lead: `${count} मशीनों का औसत उत्पादन ${oldAverage} इकाइयाँ है।`, add: `${added} इकाइयाँ बनाने वाली एक और मशीन जोड़ दी जाती है`, remove: `${removed} इकाइयाँ बनाने वाली एक मशीन हटा दी जाती है`, replace: `${oldValue} इकाइयाँ बनाने वाली मशीन के स्थान पर ${newValue} इकाइयाँ बनाने वाली मशीन लगाई जाती है`, noun: "मशीन का उत्पादन", answer: "उत्पादन",
    },
    parcel: {
      lead: `${count} पार्सलों का औसत वजन ${oldAverage} किग्रा है।`, add: `${added} किग्रा का एक और पार्सल शामिल किया जाता है`, remove: `${removed} किग्रा का एक पार्सल हटा दिया जाता है`, replace: `${oldValue} किग्रा के पार्सल के स्थान पर ${newValue} किग्रा का पार्सल रखा जाता है`, noun: "पार्सल का वजन", answer: "वजन",
    },
    weight: {
      lead: `${count} लोगों का औसत वजन ${oldAverage} किग्रा है।`, add: `${added} किग्रा वजन वाला एक और व्यक्ति शामिल होता है`, remove: `${removed} किग्रा वजन वाला एक व्यक्ति समूह छोड़ देता है`, replace: `${oldValue} किग्रा वजन वाले व्यक्ति के स्थान पर ${newValue} किग्रा वजन वाला व्यक्ति आता है`, noun: "व्यक्ति का वजन", answer: "वजन",
    },
  } as const;
  const c = direct[k as keyof typeof direct];

  const displayed = (raw: string) => k === "salary" || k === "sales" || k === "price" ? `₹${raw}` : `${raw}${k === "output" ? " इकाइयाँ" : k === "parcel" || k === "weight" ? " किग्रा" : k === "marks" ? " अंक" : ""}`;

  switch (pkg.solveMode) {
    case "findNewAverageAfterAddition":
      return `${c.lead} ${c.add}। नया औसत ज्ञात कीजिए।`;
    case "findNewAverageAfterRemoval":
      return `${c.lead} ${c.remove}। शेष मानों का औसत ज्ञात कीजिए।`;
    case "findNewAverageAfterReplacement":
      return `${c.lead} ${c.replace}। नया औसत ज्ञात कीजिए।`;
    case "findAddedMemberValueFromShift":
      if (k === "output") return `${c.lead} एक और मशीन जोड़ने पर औसत उत्पादन ${displayed(newAverage)} हो जाता है। नई मशीन का उत्पादन ज्ञात कीजिए।`;
      return `${c.lead} एक और ${c.noun} शामिल होने पर औसत ${displayed(newAverage)} हो जाता है। शामिल ${c.answer} ज्ञात कीजिए।`;
    case "findRemovedMemberValueFromShift":
      if (k === "output") return `${c.lead} एक मशीन हटाने पर औसत उत्पादन ${displayed(newAverage)} हो जाता है। हटाई गई मशीन का उत्पादन ज्ञात कीजिए।`;
      return `${c.lead} एक ${c.noun} हटाने पर औसत ${displayed(newAverage)} हो जाता है। हटाया गया ${c.answer} ज्ञात कीजिए।`;
    case "findReplacementValueFromShift":
      if (target === "old") return `${c.lead} एक अज्ञात ${c.answer} के स्थान पर ${displayed(newValue)} रखने से औसत ${displayed(newAverage)} हो जाता है। पुराना ${c.answer} ज्ञात कीजिए।`;
      return `${c.lead} ${displayed(oldValue)} के स्थान पर अज्ञात ${c.answer} रखने से औसत ${displayed(newAverage)} हो जाता है। नया ${c.answer} ज्ञात कीजिए।`;
    default:
      return pkg.stem;
  }
}

function punjabiNonAgeStem(pkg: Avg001QuestionPackage, k: Kind) {
  const count = v(pkg, "oldCount");
  const oldAverage = v(pkg, "oldAverage");
  const newAverage = v(pkg, "newAverage");
  const added = v(pkg, "addedValue");
  const removed = v(pkg, "removedValue");
  const oldValue = v(pkg, "oldValue");
  const newValue = v(pkg, "newValue");
  const target = String(pkg.parameters.values.replacementTarget ?? "new");

  const direct = {
    abstract: {
      lead: `${count} ਸੰਖਿਆਵਾਂ ਦੀ ਔਸਤ ${oldAverage} ਹੈ।`, add: `${added} ਜੋੜ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ`, remove: `${removed} ਹਟਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ`, replace: `${oldValue} ਦੀ ਥਾਂ ${newValue} ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ`, noun: "ਸੰਖਿਆ", answer: "ਮੁੱਲ",
    },
    marks: {
      lead: `ਇੱਕ ਵਿਦਿਆਰਥੀ ਦੇ ${count} ਪ੍ਰੀਖਿਆ ਅੰਕਾਂ ਦੀ ਔਸਤ ${oldAverage} ਅੰਕ ਹੈ।`, add: `ਅਗਲੀ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਉਸ ਨੂੰ ${added} ਅੰਕ ਮਿਲਦੇ ਹਨ`, remove: `${removed} ਅੰਕ ਵਾਲੀ ਇੱਕ ਪ੍ਰੀਖਿਆ ਨੂੰ ਗਿਣਤੀ ਵਿੱਚੋਂ ਹਟਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ`, replace: `${oldValue} ਅੰਕ ਦੀ ਥਾਂ ${newValue} ਅੰਕ ਦਰਜ ਕੀਤੇ ਜਾਂਦੇ ਹਨ`, noun: "ਪ੍ਰੀਖਿਆ ਦਾ ਸਕੋਰ", answer: "ਅੰਕ",
    },
    salary: {
      lead: `${count} ਕਰਮਚਾਰੀਆਂ ਦੀ ਔਸਤ ਤਨਖਾਹ ₹${oldAverage} ਹੈ।`, add: `₹${added} ਤਨਖਾਹ ਵਾਲਾ ਇੱਕ ਨਵਾਂ ਕਰਮਚਾਰੀ ਨਿਯੁਕਤ ਹੁੰਦਾ ਹੈ`, remove: `₹${removed} ਤਨਖਾਹ ਵਾਲਾ ਇੱਕ ਕਰਮਚਾਰੀ ਨੌਕਰੀ ਛੱਡ ਦਿੰਦਾ ਹੈ`, replace: `₹${oldValue} ਤਨਖਾਹ ਵਾਲੇ ਕਰਮਚਾਰੀ ਦੀ ਥਾਂ ₹${newValue} ਤਨਖਾਹ ਵਾਲਾ ਕਰਮਚਾਰੀ ਆਉਂਦਾ ਹੈ`, noun: "ਕਰਮਚਾਰੀ ਦੀ ਤਨਖਾਹ", answer: "ਤਨਖਾਹ",
    },
    sales: {
      lead: `${count} ਦਿਨਾਂ ਦੀ ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ ₹${oldAverage} ਹੈ।`, add: `ਅਗਲੇ ਦਿਨ ਵਿਕਰੀ ₹${added} ਹੁੰਦੀ ਹੈ`, remove: `₹${removed} ਵਿਕਰੀ ਵਾਲੇ ਇੱਕ ਦਿਨ ਨੂੰ ਗਿਣਤੀ ਵਿੱਚੋਂ ਹਟਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ`, replace: `₹${oldValue} ਦੀ ਵਿਕਰੀ ਨੂੰ ₹${newValue} ਨਾਲ ਠੀਕ ਕੀਤਾ ਜਾਂਦਾ ਹੈ`, noun: "ਦਿਨ ਦੀ ਵਿਕਰੀ", answer: "ਵਿਕਰੀ",
    },
    price: {
      lead: `${count} ਵਸਤਾਂ ਦੀ ਔਸਤ ਕੀਮਤ ₹${oldAverage} ਹੈ।`, add: `₹${added} ਦੀ ਇੱਕ ਹੋਰ ਕੀਮਤ ਸੂਚੀ ਵਿੱਚ ਜੋੜੀ ਜਾਂਦੀ ਹੈ`, remove: `₹${removed} ਦੀ ਇੱਕ ਕੀਮਤ ਸੂਚੀ ਵਿੱਚੋਂ ਹਟਾਈ ਜਾਂਦੀ ਹੈ`, replace: `₹${oldValue} ਦੀ ਕੀਮਤ ਦੀ ਥਾਂ ₹${newValue} ਦਰਜ ਕੀਤਾ ਜਾਂਦਾ ਹੈ`, noun: "ਕੀਮਤ", answer: "ਕੀਮਤ",
    },
    output: {
      lead: `${count} ਮਸ਼ੀਨਾਂ ਦਾ ਔਸਤ ਉਤਪਾਦਨ ${oldAverage} ਇਕਾਈਆਂ ਹੈ।`, add: `${added} ਇਕਾਈਆਂ ਬਣਾਉਣ ਵਾਲੀ ਇੱਕ ਹੋਰ ਮਸ਼ੀਨ ਜੋੜੀ ਜਾਂਦੀ ਹੈ`, remove: `${removed} ਇਕਾਈਆਂ ਬਣਾਉਣ ਵਾਲੀ ਇੱਕ ਮਸ਼ੀਨ ਹਟਾਈ ਜਾਂਦੀ ਹੈ`, replace: `${oldValue} ਇਕਾਈਆਂ ਬਣਾਉਣ ਵਾਲੀ ਮਸ਼ੀਨ ਦੀ ਥਾਂ ${newValue} ਇਕਾਈਆਂ ਬਣਾਉਣ ਵਾਲੀ ਮਸ਼ੀਨ ਲਗਾਈ ਜਾਂਦੀ ਹੈ`, noun: "ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ", answer: "ਉਤਪਾਦਨ",
    },
    parcel: {
      lead: `${count} ਪਾਰਸਲਾਂ ਦਾ ਔਸਤ ਵਜ਼ਨ ${oldAverage} ਕਿਲੋਗ੍ਰਾਮ ਹੈ।`, add: `${added} ਕਿਲੋਗ੍ਰਾਮ ਦਾ ਇੱਕ ਹੋਰ ਪਾਰਸਲ ਸ਼ਾਮਲ ਕੀਤਾ ਜਾਂਦਾ ਹੈ`, remove: `${removed} ਕਿਲੋਗ੍ਰਾਮ ਦਾ ਇੱਕ ਪਾਰਸਲ ਹਟਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ`, replace: `${oldValue} ਕਿਲੋਗ੍ਰਾਮ ਦੇ ਪਾਰਸਲ ਦੀ ਥਾਂ ${newValue} ਕਿਲੋਗ੍ਰਾਮ ਦਾ ਪਾਰਸਲ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ`, noun: "ਪਾਰਸਲ ਦਾ ਵਜ਼ਨ", answer: "ਵਜ਼ਨ",
    },
    weight: {
      lead: `${count} ਲੋਕਾਂ ਦਾ ਔਸਤ ਵਜ਼ਨ ${oldAverage} ਕਿਲੋਗ੍ਰਾਮ ਹੈ।`, add: `${added} ਕਿਲੋਗ੍ਰਾਮ ਵਜ਼ਨ ਵਾਲਾ ਇੱਕ ਹੋਰ ਵਿਅਕਤੀ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ`, remove: `${removed} ਕਿਲੋਗ੍ਰਾਮ ਵਜ਼ਨ ਵਾਲਾ ਇੱਕ ਵਿਅਕਤੀ ਸਮੂਹ ਛੱਡ ਦਿੰਦਾ ਹੈ`, replace: `${oldValue} ਕਿਲੋਗ੍ਰਾਮ ਵਜ਼ਨ ਵਾਲੇ ਵਿਅਕਤੀ ਦੀ ਥਾਂ ${newValue} ਕਿਲੋਗ੍ਰਾਮ ਵਜ਼ਨ ਵਾਲਾ ਵਿਅਕਤੀ ਆਉਂਦਾ ਹੈ`, noun: "ਵਿਅਕਤੀ ਦਾ ਵਜ਼ਨ", answer: "ਵਜ਼ਨ",
    },
  } as const;
  const c = direct[k as keyof typeof direct];
  const displayed = (raw: string) => k === "salary" || k === "sales" || k === "price" ? `₹${raw}` : `${raw}${k === "output" ? " ਇਕਾਈਆਂ" : k === "parcel" || k === "weight" ? " ਕਿਲੋਗ੍ਰਾਮ" : k === "marks" ? " ਅੰਕ" : ""}`;

  switch (pkg.solveMode) {
    case "findNewAverageAfterAddition":
      return `${c.lead} ${c.add}। ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।`;
    case "findNewAverageAfterRemoval":
      return `${c.lead} ${c.remove}। ਬਾਕੀ ਮੁੱਲਾਂ ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।`;
    case "findNewAverageAfterReplacement":
      return `${c.lead} ${c.replace}। ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।`;
    case "findAddedMemberValueFromShift":
      if (k === "output") return `${c.lead} ਇੱਕ ਹੋਰ ਮਸ਼ੀਨ ਜੋੜਨ ਉੱਤੇ ਔਸਤ ਉਤਪਾਦਨ ${displayed(newAverage)} ਹੋ ਜਾਂਦਾ ਹੈ। ਨਵੀਂ ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ ਪਤਾ ਕਰੋ।`;
      return `${c.lead} ਇੱਕ ਹੋਰ ${c.noun} ਸ਼ਾਮਲ ਹੋਣ ਉੱਤੇ ਔਸਤ ${displayed(newAverage)} ਹੋ ਜਾਂਦੀ ਹੈ। ਸ਼ਾਮਲ ${c.answer} ਪਤਾ ਕਰੋ।`;
    case "findRemovedMemberValueFromShift":
      if (k === "output") return `${c.lead} ਇੱਕ ਮਸ਼ੀਨ ਹਟਾਉਣ ਉੱਤੇ ਔਸਤ ਉਤਪਾਦਨ ${displayed(newAverage)} ਹੋ ਜਾਂਦਾ ਹੈ। ਹਟਾਈ ਗਈ ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ ਪਤਾ ਕਰੋ।`;
      return `${c.lead} ਇੱਕ ${c.noun} ਹਟਾਉਣ ਉੱਤੇ ਔਸਤ ${displayed(newAverage)} ਹੋ ਜਾਂਦੀ ਹੈ। ਹਟਾਇਆ ਗਿਆ ${c.answer} ਪਤਾ ਕਰੋ।`;
    case "findReplacementValueFromShift":
      if (target === "old") return `${c.lead} ਇੱਕ ਅਣਜਾਣ ${c.answer} ਦੀ ਥਾਂ ${displayed(newValue)} ਰੱਖਣ ਨਾਲ ਔਸਤ ${displayed(newAverage)} ਹੋ ਜਾਂਦੀ ਹੈ। ਪੁਰਾਣਾ ${c.answer} ਪਤਾ ਕਰੋ।`;
      return `${c.lead} ${displayed(oldValue)} ਦੀ ਥਾਂ ਅਣਜਾਣ ${c.answer} ਰੱਖਣ ਨਾਲ ਔਸਤ ${displayed(newAverage)} ਹੋ ਜਾਂਦੀ ਹੈ। ਨਵਾਂ ${c.answer} ਪਤਾ ਕਰੋ।`;
    default:
      return pkg.stem;
  }
}

function stemFor(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const k = kind(pkg);
  if (k === "age") return language === "hi" ? hindiAgeStem(pkg) : punjabiAgeStem(pkg);
  if (k === "cricket") return language === "hi" ? hindiCricketStem(pkg) : punjabiCricketStem(pkg);
  if (k.startsWith("gap-")) return language === "hi" ? hindiGapStem(pkg, k) : punjabiGapStem(pkg, k);
  return language === "hi" ? hindiNonAgeStem(pkg, k) : punjabiNonAgeStem(pkg, k);
}

function refreshedValidation(pkg: Avg001QuestionPackage, stem: string, language: PilotLanguage) {
  const excluded = new Set(["localized-stem", "resolved-stem", "localized-script"]);
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter((check) => !excluded.has(check.name));
  const expected = language === "hi" ? /[\u0900-\u0963\u0970-\u097F]/ : /[\u0A01-\u0A74]/;
  const wrong = language === "hi" ? /[\u0A01-\u0A74]/ : /[\u0900-\u0963\u0970-\u097F]/;
  const banned = language === "hi"
    ? /स्कोर समूह में|दिन समूह में|मशीन समूह में|पार्सल समूह में|एक नया सदस्य|नए सदस्य का मूल्य|मशीन समूह से|एक बच्चा के|उत्पादन वाली एक मशीन समूह/
    : /ਸਕੋਰ ਸਮੂਹ ਵਿੱਚ|ਦਿਨ ਸਮੂਹ ਵਿੱਚ|ਮਸ਼ੀਨ ਸਮੂਹ ਵਿੱਚ|ਪਾਰਸਲ ਸਮੂਹ ਵਿੱਚ|ਇੱਕ ਨਵਾਂ ਮੈਂਬਰ|ਨਵੇਂ ਮੈਂਬਰ ਦਾ ਮੁੱਲ|ਮਸ਼ੀਨ ਸਮੂਹ ਵਿੱਚੋਂ|ਇੱਕ ਬੱਚਾ ਦੇ|ਉਤਪਾਦਨ ਵਾਲੀ ਇੱਕ ਮਸ਼ੀਨ ਸਮੂਹ/;
  checks.push(
    { name: "localized-stem", passed: expected.test(stem) && !wrong.test(stem), message: "Stem uses the requested script" },
    { name: "resolved-stem", passed: !/[{}]|undefined|NaN|Infinity|null/.test(stem), message: "Stem is fully rendered" },
    { name: "context-first-stem", passed: !banned.test(stem), message: "Stem uses the actual question context rather than generic member/value wording" },
  );
  return { valid: checks.every((check) => check.passed), checks };
}

export function runAvg001Cp003LocalizationPilot(input: {
  questionLanguageId: string;
  seed: string;
  language: PilotLanguage;
}): Avg001QuestionPackage {
  const base = runBasePilot(input);
  const stem = stemFor(base, input.language);
  return { ...base, stem, validation: refreshedValidation(base, stem, input.language) };
}
