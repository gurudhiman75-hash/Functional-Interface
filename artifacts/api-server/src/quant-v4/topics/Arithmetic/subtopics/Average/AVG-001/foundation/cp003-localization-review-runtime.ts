import {
  AVG_001_CP003_MULTILINGUAL_PILOT,
  getAvg001Cp003LocalizedQlIds,
  runAvg001Cp003LocalizationPilot as runBasePilot,
} from "./cp003-localization-pilot-runtime";
import type { Avg001QuestionPackage } from "./types";

export {
  AVG_001_CP003_MULTILINGUAL_PILOT,
  getAvg001Cp003LocalizedQlIds,
};

type PilotLanguage = "hi" | "pa";

type Role = {
  nominative: string;
  oblique: string;
};

function text(pkg: Avg001QuestionPackage, key: string) {
  const rendered = pkg.parameters.renderVariables[key];
  if (rendered !== undefined) return String(rendered);
  const raw = pkg.parameters.values[key];
  if (typeof raw === "number" || typeof raw === "string") return String(raw);
  if (raw && typeof raw === "object" && "numerator" in raw && "denominator" in raw) {
    const numerator = Number(raw.numerator);
    const denominator = Number(raw.denominator);
    if (denominator === 1) return String(numerator);
    const decimal = numerator / denominator;
    return Number.isInteger(decimal * 10) ? decimal.toFixed(1) : `${numerator}/${denominator}`;
  }
  return "";
}

function isAgeQuestion(pkg: Avg001QuestionPackage) {
  if (/cricket/i.test(pkg.parameters.scenarioVariant)) return false;
  return (
    pkg.parameters.contextDomain === "Family" ||
    /age|teacher|child|newborn|afteryears|elapsedyears|retir/i.test(
      pkg.parameters.scenarioVariant,
    )
  );
}

function roleFor(pkg: Avg001QuestionPackage, language: PilotLanguage): Role {
  const variant = pkg.parameters.scenarioVariant;
  if (language === "hi") {
    if (/teacher/i.test(variant)) return { nominative: "शिक्षक", oblique: "शिक्षक" };
    if (/student/i.test(variant)) return { nominative: "विद्यार्थी", oblique: "विद्यार्थी" };
    if (/employee|retir/i.test(variant)) return { nominative: "कर्मचारी", oblique: "कर्मचारी" };
    if (/worker/i.test(variant)) return { nominative: "कर्मी", oblique: "कर्मी" };
    if (/player/i.test(variant)) return { nominative: "खिलाड़ी", oblique: "खिलाड़ी" };
    if (/child|newborn/i.test(variant)) return { nominative: "बच्चा", oblique: "बच्चे" };
    return { nominative: "सदस्य", oblique: "सदस्य" };
  }
  if (/teacher/i.test(variant)) return { nominative: "ਅਧਿਆਪਕ", oblique: "ਅਧਿਆਪਕ" };
  if (/student/i.test(variant)) return { nominative: "ਵਿਦਿਆਰਥੀ", oblique: "ਵਿਦਿਆਰਥੀ" };
  if (/employee|retir/i.test(variant)) return { nominative: "ਕਰਮਚਾਰੀ", oblique: "ਕਰਮਚਾਰੀ" };
  if (/worker/i.test(variant)) return { nominative: "ਕਾਮਾ", oblique: "ਕਾਮੇ" };
  if (/player/i.test(variant)) return { nominative: "ਖਿਡਾਰੀ", oblique: "ਖਿਡਾਰੀ" };
  if (/child|newborn/i.test(variant)) return { nominative: "ਬੱਚਾ", oblique: "ਬੱਚੇ" };
  return { nominative: "ਮੈਂਬਰ", oblique: "ਮੈਂਬਰ" };
}

function ageGroup(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const variant = pkg.parameters.scenarioVariant;
  if (language === "hi") {
    if (/teacherJoinsClass|findTeacherAge/i.test(variant)) return "विद्यार्थियों";
    if (pkg.parameters.contextDomain === "Family") return "परिवार के सदस्यों";
    if (pkg.parameters.contextDomain === "Sports") return "खिलाड़ियों";
    if (pkg.parameters.contextDomain === "Workplace") {
      return /worker/i.test(variant) ? "कर्मियों" : "कर्मचारियों";
    }
    if (/student/i.test(variant)) return "विद्यार्थियों";
    return "लोगों";
  }
  if (/teacherJoinsClass|findTeacherAge/i.test(variant)) return "ਵਿਦਿਆਰਥੀਆਂ";
  if (pkg.parameters.contextDomain === "Family") return "ਪਰਿਵਾਰਕ ਮੈਂਬਰਾਂ";
  if (pkg.parameters.contextDomain === "Sports") return "ਖਿਡਾਰੀਆਂ";
  if (pkg.parameters.contextDomain === "Workplace") {
    return /worker/i.test(variant) ? "ਕਾਮਿਆਂ" : "ਕਰਮਚਾਰੀਆਂ";
  }
  if (/student/i.test(variant)) return "ਵਿਦਿਆਰਥੀਆਂ";
  return "ਲੋਕਾਂ";
}

function ageStem(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const count = text(pkg, "oldCount");
  const oldAverage = text(pkg, "oldAverage");
  const newAverage = text(pkg, "newAverage");
  const years = Number(pkg.parameters.values.yearsElapsed ?? 0);
  const after = years
    ? language === "hi"
      ? `${years} वर्ष बाद, `
      : `${years} ਸਾਲ ਬਾਅਦ, `
    : "";
  const group = ageGroup(pkg, language);
  const role = roleFor(pkg, language);
  const added = text(pkg, "addedValue");
  const removed = text(pkg, "removedValue");
  const oldValue = text(pkg, "oldValue");
  const newValue = text(pkg, "newValue");
  const target = String(pkg.parameters.values.replacementTarget ?? "new");
  const newborn = /newborn/i.test(pkg.parameters.scenarioVariant);

  if (language === "hi") {
    const lead = `${count} ${group} की औसत आयु ${oldAverage} वर्ष है।`;
    switch (pkg.solveMode) {
      case "findNewAverageAfterAddition":
        return newborn
          ? `${lead} ${after}एक नवजात शिशु जन्म लेता है। नई औसत आयु ज्ञात कीजिए।`
          : `${lead} ${after}${added} वर्ष का एक ${role.nominative} समूह में शामिल होता है। नई औसत आयु ज्ञात कीजिए।`;
      case "findNewAverageAfterRemoval":
        return `${lead} ${after}${removed} वर्ष का एक ${role.nominative} समूह से अलग हो जाता है। नई औसत आयु ज्ञात कीजिए।`;
      case "findNewAverageAfterReplacement":
        return `${lead} ${after}${oldValue} वर्ष के ${role.oblique} के स्थान पर ${newValue} वर्ष का ${role.nominative} आता है। नई औसत आयु ज्ञात कीजिए।`;
      case "findAddedMemberValueFromShift":
        return `${lead} ${after}एक ${role.nominative} के जुड़ने पर औसत आयु ${newAverage} वर्ष हो जाती है। जुड़ने वाले ${role.oblique} की आयु ज्ञात कीजिए।`;
      case "findRemovedMemberValueFromShift":
        return `${lead} ${after}एक ${role.nominative} के जाने पर औसत आयु ${newAverage} वर्ष हो जाती है। जाने वाले ${role.oblique} की आयु ज्ञात कीजिए।`;
      case "findReplacementValueFromShift":
        return target === "old"
          ? `${lead} ${after}एक ${role.nominative} के स्थान पर ${newValue} वर्ष का ${role.nominative} आने से औसत आयु ${newAverage} वर्ष हो जाती है। पुराने ${role.oblique} की आयु ज्ञात कीजिए।`
          : `${lead} ${after}${oldValue} वर्ष के ${role.oblique} को बदलने पर औसत आयु ${newAverage} वर्ष हो जाती है। नए ${role.oblique} की आयु ज्ञात कीजिए।`;
      default:
        return pkg.stem;
    }
  }

  const lead = `${count} ${group} ਦੀ ਔਸਤ ਉਮਰ ${oldAverage} ਸਾਲ ਹੈ।`;
  switch (pkg.solveMode) {
    case "findNewAverageAfterAddition":
      return newborn
        ? `${lead} ${after}ਇੱਕ ਨਵਜੰਮਿਆ ਬੱਚਾ ਜਨਮ ਲੈਂਦਾ ਹੈ। ਨਵੀਂ ਔਸਤ ਉਮਰ ਪਤਾ ਕਰੋ।`
        : `${lead} ${after}${added} ਸਾਲ ਦਾ ਇੱਕ ${role.nominative} ਸਮੂਹ ਵਿੱਚ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ। ਨਵੀਂ ਔਸਤ ਉਮਰ ਪਤਾ ਕਰੋ।`;
    case "findNewAverageAfterRemoval":
      return `${lead} ${after}${removed} ਸਾਲ ਦਾ ਇੱਕ ${role.nominative} ਸਮੂਹ ਵਿੱਚੋਂ ਚਲਾ ਜਾਂਦਾ ਹੈ। ਨਵੀਂ ਔਸਤ ਉਮਰ ਪਤਾ ਕਰੋ।`;
    case "findNewAverageAfterReplacement":
      return `${lead} ${after}${oldValue} ਸਾਲ ਦੇ ${role.oblique} ਦੀ ਥਾਂ ${newValue} ਸਾਲ ਦਾ ${role.nominative} ਆਉਂਦਾ ਹੈ। ਨਵੀਂ ਔਸਤ ਉਮਰ ਪਤਾ ਕਰੋ।`;
    case "findAddedMemberValueFromShift":
      return `${lead} ${after}ਇੱਕ ${role.nominative} ਦੇ ਸ਼ਾਮਲ ਹੋਣ ਉੱਤੇ ਔਸਤ ਉਮਰ ${newAverage} ਸਾਲ ਹੋ ਜਾਂਦੀ ਹੈ। ਸ਼ਾਮਲ ਹੋਏ ${role.oblique} ਦੀ ਉਮਰ ਪਤਾ ਕਰੋ।`;
    case "findRemovedMemberValueFromShift":
      return `${lead} ${after}ਇੱਕ ${role.nominative} ਦੇ ਜਾਣ ਉੱਤੇ ਔਸਤ ਉਮਰ ${newAverage} ਸਾਲ ਹੋ ਜਾਂਦੀ ਹੈ। ਜਾਣ ਵਾਲੇ ${role.oblique} ਦੀ ਉਮਰ ਪਤਾ ਕਰੋ।`;
    case "findReplacementValueFromShift":
      return target === "old"
        ? `${lead} ${after}ਇੱਕ ${role.nominative} ਦੀ ਥਾਂ ${newValue} ਸਾਲ ਦਾ ${role.nominative} ਆਉਣ ਨਾਲ ਔਸਤ ਉਮਰ ${newAverage} ਸਾਲ ਹੋ ਜਾਂਦੀ ਹੈ। ਪੁਰਾਣੇ ${role.oblique} ਦੀ ਉਮਰ ਪਤਾ ਕਰੋ।`
        : `${lead} ${after}${oldValue} ਸਾਲ ਦੇ ${role.oblique} ਨੂੰ ਬਦਲਣ ਉੱਤੇ ਔਸਤ ਉਮਰ ${newAverage} ਸਾਲ ਹੋ ਜਾਂਦੀ ਹੈ। ਨਵੇਂ ${role.oblique} ਦੀ ਉਮਰ ਪਤਾ ਕਰੋ।`;
    default:
      return pkg.stem;
  }
}

function nonAgeQuantity(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const variant = pkg.parameters.scenarioVariant;
  if (language === "hi") {
    if (/salary/i.test(variant)) return { subject: "कर्मचारियों का औसत वेतन", unit: "₹" };
    if (/sales/i.test(variant)) return { subject: "दिनों की औसत बिक्री", unit: "₹" };
    if (/price/i.test(variant)) return { subject: "मूल्यों का औसत", unit: "₹" };
    if (/output|machine/i.test(variant)) return { subject: "मशीनों का औसत उत्पादन", unit: " इकाइयाँ" };
    if (/parcel|weight/i.test(variant)) return { subject: "वजनों का औसत", unit: " किग्रा" };
    if (/score|test|reading/i.test(variant)) return { subject: "अंकों का औसत", unit: " अंक" };
    return { subject: "मानों का औसत", unit: "" };
  }
  if (/salary/i.test(variant)) return { subject: "ਕਰਮਚਾਰੀਆਂ ਦੀ ਔਸਤ ਤਨਖਾਹ", unit: "₹" };
  if (/sales/i.test(variant)) return { subject: "ਦਿਨਾਂ ਦੀ ਔਸਤ ਵਿਕਰੀ", unit: "₹" };
  if (/price/i.test(variant)) return { subject: "ਕੀਮਤਾਂ ਦੀ ਔਸਤ", unit: "₹" };
  if (/output|machine/i.test(variant)) return { subject: "ਮਸ਼ੀਨਾਂ ਦਾ ਔਸਤ ਉਤਪਾਦਨ", unit: " ਇਕਾਈਆਂ" };
  if (/parcel|weight/i.test(variant)) return { subject: "ਵਜ਼ਨਾਂ ਦੀ ਔਸਤ", unit: " ਕਿਲੋਗ੍ਰਾਮ" };
  if (/score|test|reading/i.test(variant)) return { subject: "ਅੰਕਾਂ ਦੀ ਔਸਤ", unit: " ਅੰਕ" };
  return { subject: "ਮੁੱਲਾਂ ਦੀ ਔਸਤ", unit: "" };
}

function withUnit(raw: string, unit: string) {
  return unit === "₹" ? `₹${raw}` : `${raw}${unit}`;
}

function nonAgeReplacementStem(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const quantity = nonAgeQuantity(pkg, language);
  const count = text(pkg, "oldCount");
  const oldAverage = withUnit(text(pkg, "oldAverage"), quantity.unit);
  const newAverage = withUnit(text(pkg, "newAverage"), quantity.unit);
  const oldValue = withUnit(text(pkg, "oldValue"), quantity.unit);
  const newValue = withUnit(text(pkg, "newValue"), quantity.unit);
  const target = String(pkg.parameters.values.replacementTarget ?? "new");

  if (language === "hi") {
    if (pkg.solveMode === "findNewAverageAfterReplacement") {
      return `${count} ${quantity.subject} ${oldAverage} है। ${oldValue} के स्थान पर ${newValue} रखने पर नया औसत ज्ञात कीजिए।`;
    }
    return target === "old"
      ? `${count} ${quantity.subject} ${oldAverage} था। एक अज्ञात मान के स्थान पर ${newValue} रखने से औसत ${newAverage} हो गया। पुराना मान ज्ञात कीजिए।`
      : `${count} ${quantity.subject} ${oldAverage} था। ${oldValue} के स्थान पर अज्ञात मान रखने से औसत ${newAverage} हो गया। नया मान ज्ञात कीजिए।`;
  }

  if (pkg.solveMode === "findNewAverageAfterReplacement") {
    return `${count} ${quantity.subject} ${oldAverage} ਹੈ। ${oldValue} ਦੀ ਥਾਂ ${newValue} ਰੱਖਣ ਉੱਤੇ ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।`;
  }
  return target === "old"
    ? `${count} ${quantity.subject} ${oldAverage} ਸੀ। ਇੱਕ ਅਣਜਾਣ ਮੁੱਲ ਦੀ ਥਾਂ ${newValue} ਰੱਖਣ ਨਾਲ ਔਸਤ ${newAverage} ਹੋ ਗਈ। ਪੁਰਾਣਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`
    : `${count} ${quantity.subject} ${oldAverage} ਸੀ। ${oldValue} ਦੀ ਥਾਂ ਅਣਜਾਣ ਮੁੱਲ ਰੱਖਣ ਨਾਲ ਔਸਤ ${newAverage} ਹੋ ਗਈ। ਨਵਾਂ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
}

function polishCountStem(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const variant = Number(pkg.questionLanguageId.slice(-3)) % 3;
  let stem = pkg.stem;
  if (language === "hi") {
    stem = stem
      .replaceAll("विद्यार्थी की संख्या", "विद्यार्थियों की संख्या")
      .replaceAll("खिलाड़ी की संख्या", "खिलाड़ियों की संख्या")
      .replaceAll("कर्मी की संख्या", "कर्मियों की संख्या")
      .replaceAll("मशीनें की संख्या", "मशीनों की संख्या")
      .replaceAll("एक नया मशीन", "एक नई मशीन");
    if (variant === 1) stem = stem.replace("प्रारंभ में", "परिवर्तन से पहले");
    if (variant === 2) stem = stem.replace("प्रारंभ में", "मूल समूह में");
    return stem;
  }
  stem = stem
    .replaceAll("ਵਿਦਿਆਰਥੀ ਦੀ ਗਿਣਤੀ", "ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ")
    .replaceAll("ਖਿਡਾਰੀ ਦੀ ਗਿਣਤੀ", "ਖਿਡਾਰੀਆਂ ਦੀ ਗਿਣਤੀ")
    .replaceAll("ਕਾਮੇ ਦੀ ਗਿਣਤੀ", "ਕਾਮਿਆਂ ਦੀ ਗਿਣਤੀ")
    .replaceAll("ਇੱਕ ਨਵਾਂ ਮਸ਼ੀਨ", "ਇੱਕ ਨਵੀਂ ਮਸ਼ੀਨ");
  if (variant === 1) stem = stem.replace("ਸ਼ੁਰੂ ਵਿੱਚ", "ਬਦਲਾਅ ਤੋਂ ਪਹਿਲਾਂ");
  if (variant === 2) stem = stem.replace("ਸ਼ੁਰੂ ਵਿੱਚ", "ਮੂਲ ਸਮੂਹ ਵਿੱਚ");
  return stem;
}

function polishExplanation(
  pkg: Avg001QuestionPackage,
  language: PilotLanguage,
  ageQuestion: boolean,
) {
  const lines = pkg.explanation.lines.map((line) =>
    line.replaceAll(";quad", "; ").replaceAll("\\quad", " "),
  );
  if (!ageQuestion) return { lines };

  const role = roleFor(pkg, language);
  const answer = pkg.answer;
  if (language === "hi") {
    if (pkg.solveMode === "findAddedMemberValueFromShift") {
      lines[lines.length - 1] = `अतः जुड़ने वाले ${role.oblique} की आयु ${answer} वर्ष है।`;
    } else if (pkg.solveMode === "findRemovedMemberValueFromShift") {
      lines[lines.length - 1] = `अतः जाने वाले ${role.oblique} की आयु ${answer} वर्ष है।`;
    } else if (pkg.solveMode === "findReplacementValueFromShift") {
      const target = String(pkg.parameters.values.replacementTarget ?? "new");
      lines[lines.length - 1] = `अतः ${target === "old" ? "पुराने" : "नए"} ${role.oblique} की आयु ${answer} वर्ष है।`;
    }
  } else if (pkg.solveMode === "findAddedMemberValueFromShift") {
    lines[lines.length - 1] = `ਇਸ ਲਈ ਸ਼ਾਮਲ ਹੋਏ ${role.oblique} ਦੀ ਉਮਰ ${answer} ਸਾਲ ਹੈ।`;
  } else if (pkg.solveMode === "findRemovedMemberValueFromShift") {
    lines[lines.length - 1] = `ਇਸ ਲਈ ਜਾਣ ਵਾਲੇ ${role.oblique} ਦੀ ਉਮਰ ${answer} ਸਾਲ ਹੈ।`;
  } else if (pkg.solveMode === "findReplacementValueFromShift") {
    const target = String(pkg.parameters.values.replacementTarget ?? "new");
    lines[lines.length - 1] = `ਇਸ ਲਈ ${target === "old" ? "ਪੁਰਾਣੇ" : "ਨਵੇਂ"} ${role.oblique} ਦੀ ਉਮਰ ${answer} ਸਾਲ ਹੈ।`;
  }
  return { lines };
}

export function runAvg001Cp003LocalizationPilot(input: {
  questionLanguageId: string;
  seed: string;
  language: PilotLanguage;
}): Avg001QuestionPackage {
  const pkg = runBasePilot(input);
  const ageQuestion = isAgeQuestion(pkg);

  let stem = pkg.stem;
  if (ageQuestion) {
    stem = ageStem(pkg, input.language);
  } else if (
    pkg.solveMode === "findNewAverageAfterReplacement" ||
    pkg.solveMode === "findReplacementValueFromShift"
  ) {
    stem = nonAgeReplacementStem(pkg, input.language);
  } else if (
    pkg.solveMode === "findOriginalCountFromJoiningMemberShift" ||
    pkg.solveMode === "findOriginalCountFromLeavingMemberShift"
  ) {
    stem = polishCountStem(pkg, input.language);
  }

  return {
    ...pkg,
    stem,
    explanation: polishExplanation(pkg, input.language, ageQuestion),
  };
}
