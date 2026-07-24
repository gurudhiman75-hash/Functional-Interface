import {
  AVG_001_CP003_MULTILINGUAL_PILOT,
  getAvg001Cp003LocalizedQlIds,
  runAvg001Cp003LocalizationPilot as runBasePilot,
} from "./cp003-localization-review-runtime";
import type { Avg001QuestionPackage } from "./types";

export {
  AVG_001_CP003_MULTILINGUAL_PILOT,
  getAvg001Cp003LocalizedQlIds,
};

type PilotLanguage = "hi" | "pa";

function shown(pkg: Avg001QuestionPackage, key: string) {
  return String(pkg.parameters.renderVariables[key] ?? "");
}

function questionLead(qlId: string, language: PilotLanguage) {
  const variant = Number(qlId.slice(-3)) % 3;
  if (language === "hi") {
    return variant === 0 ? "प्रारंभ में" : variant === 1 ? "परिवर्तन से पहले" : "मूल समूह में";
  }
  return variant === 0 ? "ਸ਼ੁਰੂ ਵਿੱਚ" : variant === 1 ? "ਬਦਲਾਅ ਤੋਂ ਪਹਿਲਾਂ" : "ਮੂਲ ਸਮੂਹ ਵਿੱਚ";
}

function hindiContext(pkg: Avg001QuestionPackage) {
  const domain = pkg.parameters.contextDomain;
  if (domain === "Education") {
    return {
      lead: `एक कक्षा के विद्यार्थियों के अंकों का औसत ${shown(pkg, "oldAverage")} है।`,
      joining: `${shown(pkg, "memberValue")} अंक प्राप्त करने वाला एक नया विद्यार्थी शामिल होता है`,
      leaving: `${shown(pkg, "memberValue")} अंक प्राप्त करने वाला एक विद्यार्थी कक्षा छोड़ देता है`,
      plural: "विद्यार्थियों",
      shiftUnit: "अंक",
    };
  }
  if (domain === "Sports") {
    return {
      lead: `एक टीम के खिलाड़ियों का औसत स्कोर ${shown(pkg, "oldAverage")} रन है।`,
      joining: `${shown(pkg, "memberValue")} रन बनाने वाला एक नया खिलाड़ी शामिल होता है`,
      leaving: `${shown(pkg, "memberValue")} रन बनाने वाला एक खिलाड़ी टीम छोड़ देता है`,
      plural: "खिलाड़ियों",
      shiftUnit: "रन",
    };
  }
  if (domain === "Production") {
    return {
      lead: `एक उत्पादन इकाई की मशीनों का औसत उत्पादन ${shown(pkg, "oldAverage")} इकाइयाँ है।`,
      joining: `${shown(pkg, "memberValue")} इकाइयों का उत्पादन करने वाली एक नई मशीन जोड़ी जाती है`,
      leaving: `${shown(pkg, "memberValue")} इकाइयों का उत्पादन करने वाली एक मशीन हटा दी जाती है`,
      plural: "मशीनों",
      shiftUnit: "इकाइयाँ",
    };
  }
  return {
    lead: `एक कार्य-दल के कर्मियों का औसत उत्पादन ${shown(pkg, "oldAverage")} इकाइयाँ है।`,
    joining: `${shown(pkg, "memberValue")} इकाइयों का उत्पादन करने वाला एक नया कर्मी शामिल होता है`,
    leaving: `${shown(pkg, "memberValue")} इकाइयों का उत्पादन करने वाला एक कर्मी दल छोड़ देता है`,
    plural: "कर्मियों",
    shiftUnit: "इकाइयाँ",
  };
}

function punjabiContext(pkg: Avg001QuestionPackage) {
  const domain = pkg.parameters.contextDomain;
  if (domain === "Education") {
    return {
      lead: `ਇੱਕ ਜਮਾਤ ਦੇ ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਅੰਕਾਂ ਦੀ ਔਸਤ ${shown(pkg, "oldAverage")} ਹੈ।`,
      joining: `${shown(pkg, "memberValue")} ਅੰਕ ਲੈਣ ਵਾਲਾ ਇੱਕ ਨਵਾਂ ਵਿਦਿਆਰਥੀ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ`,
      leaving: `${shown(pkg, "memberValue")} ਅੰਕ ਲੈਣ ਵਾਲਾ ਇੱਕ ਵਿਦਿਆਰਥੀ ਜਮਾਤ ਛੱਡ ਦਿੰਦਾ ਹੈ`,
      plural: "ਵਿਦਿਆਰਥੀਆਂ",
      shiftUnit: "ਅੰਕ",
    };
  }
  if (domain === "Sports") {
    return {
      lead: `ਇੱਕ ਟੀਮ ਦੇ ਖਿਡਾਰੀਆਂ ਦਾ ਔਸਤ ਸਕੋਰ ${shown(pkg, "oldAverage")} ਦੌੜਾਂ ਹੈ।`,
      joining: `${shown(pkg, "memberValue")} ਦੌੜਾਂ ਬਣਾਉਣ ਵਾਲਾ ਇੱਕ ਨਵਾਂ ਖਿਡਾਰੀ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ`,
      leaving: `${shown(pkg, "memberValue")} ਦੌੜਾਂ ਬਣਾਉਣ ਵਾਲਾ ਇੱਕ ਖਿਡਾਰੀ ਟੀਮ ਛੱਡ ਦਿੰਦਾ ਹੈ`,
      plural: "ਖਿਡਾਰੀਆਂ",
      shiftUnit: "ਦੌੜਾਂ",
    };
  }
  if (domain === "Production") {
    return {
      lead: `ਇੱਕ ਉਤਪਾਦਨ ਇਕਾਈ ਦੀਆਂ ਮਸ਼ੀਨਾਂ ਦਾ ਔਸਤ ਉਤਪਾਦਨ ${shown(pkg, "oldAverage")} ਇਕਾਈਆਂ ਹੈ।`,
      joining: `${shown(pkg, "memberValue")} ਇਕਾਈਆਂ ਦਾ ਉਤਪਾਦਨ ਕਰਨ ਵਾਲੀ ਇੱਕ ਨਵੀਂ ਮਸ਼ੀਨ ਜੋੜੀ ਜਾਂਦੀ ਹੈ`,
      leaving: `${shown(pkg, "memberValue")} ਇਕਾਈਆਂ ਦਾ ਉਤਪਾਦਨ ਕਰਨ ਵਾਲੀ ਇੱਕ ਮਸ਼ੀਨ ਹਟਾਈ ਜਾਂਦੀ ਹੈ`,
      plural: "ਮਸ਼ੀਨਾਂ",
      shiftUnit: "ਇਕਾਈਆਂ",
    };
  }
  return {
    lead: `ਇੱਕ ਕਾਰਜ-ਦਲ ਦੇ ਕਾਮਿਆਂ ਦਾ ਔਸਤ ਉਤਪਾਦਨ ${shown(pkg, "oldAverage")} ਇਕਾਈਆਂ ਹੈ।`,
    joining: `${shown(pkg, "memberValue")} ਇਕਾਈਆਂ ਦਾ ਉਤਪਾਦਨ ਕਰਨ ਵਾਲਾ ਇੱਕ ਨਵਾਂ ਕਾਮਾ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ`,
    leaving: `${shown(pkg, "memberValue")} ਇਕਾਈਆਂ ਦਾ ਉਤਪਾਦਨ ਕਰਨ ਵਾਲਾ ਇੱਕ ਕਾਮਾ ਦਲ ਛੱਡ ਦਿੰਦਾ ਹੈ`,
    plural: "ਕਾਮਿਆਂ",
    shiftUnit: "ਇਕਾਈਆਂ",
  };
}

function polishCountQuestion(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const joining = pkg.solveMode === "findOriginalCountFromJoiningMemberShift";
  const context = language === "hi" ? hindiContext(pkg) : punjabiContext(pkg);
  const position = questionLead(pkg.questionLanguageId, language);
  const stem = joining
    ? language === "hi"
      ? `${context.lead} ${context.joining}, जिससे औसत ${shown(pkg, "averageChange")} ${context.shiftUnit} बढ़ जाता है। ${position} ${context.plural} की संख्या ज्ञात कीजिए।`
      : `${context.lead} ${context.joining}, ਜਿਸ ਨਾਲ ਔਸਤ ${shown(pkg, "averageChange")} ${context.shiftUnit} ਵਧ ਜਾਂਦੀ ਹੈ। ${position} ${context.plural} ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`
    : language === "hi"
      ? `${context.lead} ${context.leaving}, जिसके बाद औसत ${shown(pkg, "newAverage")} ${context.shiftUnit} हो जाता है। ${position} ${context.plural} की संख्या ज्ञात कीजिए।`
      : `${context.lead} ${context.leaving}, ਜਿਸ ਤੋਂ ਬਾਅਦ ਔਸਤ ${shown(pkg, "newAverage")} ${context.shiftUnit} ਹੋ ਜਾਂਦੀ ਹੈ। ${position} ${context.plural} ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`;

  const lines = [...pkg.explanation.lines];
  lines[lines.length - 1] = language === "hi"
    ? `अतः प्रारंभिक ${context.plural} की संख्या ${pkg.answer} है।`
    : `ਇਸ ਲਈ ਸ਼ੁਰੂਆਤੀ ${context.plural} ਦੀ ਗਿਣਤੀ ${pkg.answer} ਹੈ।`;
  return { ...pkg, stem, explanation: { lines } };
}

export function runAvg001Cp003LocalizationPilot(input: {
  questionLanguageId: string;
  seed: string;
  language: PilotLanguage;
}): Avg001QuestionPackage {
  const pkg = runBasePilot(input);
  if (
    pkg.solveMode === "findOriginalCountFromJoiningMemberShift" ||
    pkg.solveMode === "findOriginalCountFromLeavingMemberShift"
  ) {
    return polishCountQuestion(pkg, input.language);
  }
  return pkg;
}
