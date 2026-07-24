import { getAvg001QuestionEntries } from "./library";
import { runAvg001Pipeline } from "./pipeline";
import type {
  Avg001Language,
  Avg001QuestionPackage,
  Avg001ValidationCheck,
  Rational,
} from "./types";

export const AVG_001_CP003_MULTILINGUAL_PILOT = Object.freeze({
  releaseId: "AVG-001-CP003-HI-PA-v1-CANDIDATE",
  packageId: "AVG-001",
  canonicalProblemId: "AVG-CP-003",
  languages: ["hi", "pa"] as const,
  qlCount: 86,
  status: "MANUAL_REVIEW",
  editorialStatus: "PENDING",
  publiclyPublishable: false,
  createdAt: "2026-07-24",
});

type PilotLanguage = (typeof AVG_001_CP003_MULTILINGUAL_PILOT.languages)[number];
type ContextKind =
  | "abstract"
  | "marks"
  | "salary"
  | "sales"
  | "price"
  | "output"
  | "parcel"
  | "weight"
  | "age"
  | "cricket";

const CP003_QL_IDS = getAvg001QuestionEntries()
  .filter((entry) => entry.cpId === "AVG-CP-003")
  .map((entry) => entry.qlId);

function qlNumber(qlId: string) {
  return Number(qlId.slice(-3));
}

function contextKind(pkg: Avg001QuestionPackage): ContextKind {
  const variant = pkg.parameters.scenarioVariant;
  if (/cricket/i.test(variant)) return "cricket";
  if (/salary/i.test(variant)) return "salary";
  if (/sales|daySales/i.test(variant)) return "sales";
  if (/price/i.test(variant)) return "price";
  if (/output|machine/i.test(variant)) return "output";
  if (/parcel/i.test(variant)) return "parcel";
  if (/weight/i.test(variant)) return "weight";
  if (/age|family|teacher|worker|student|player|child|newborn|retir/i.test(variant)) return "age";
  if (/score|test|reading/i.test(variant)) return "marks";
  return "abstract";
}

function rationalText(value: unknown) {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (value && typeof value === "object" && "numerator" in value && "denominator" in value) {
    const rational = value as Rational;
    if (rational.denominator === 1) return String(rational.numerator);
    const decimal = rational.numerator / rational.denominator;
    if (Number.isInteger(decimal * 10)) return decimal.toFixed(1);
    return `${rational.numerator}/${rational.denominator}`;
  }
  return String(value ?? "");
}

function renderValue(pkg: Avg001QuestionPackage, key: string) {
  const rendered = pkg.parameters.renderVariables[key];
  if (rendered !== undefined) return String(rendered);
  return rationalText(pkg.parameters.values[key]);
}

function roleLabel(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const variant = pkg.parameters.scenarioVariant;
  if (language === "hi") {
    if (/teacher/i.test(variant)) return "शिक्षक";
    if (/student/i.test(variant)) return "विद्यार्थी";
    if (/employee|retir/i.test(variant)) return "कर्मचारी";
    if (/worker/i.test(variant)) return "कर्मी";
    if (/player/i.test(variant)) return "खिलाड़ी";
    if (/child|newborn/i.test(variant)) return "बच्चा";
    return "सदस्य";
  }
  if (/teacher/i.test(variant)) return "ਅਧਿਆਪਕ";
  if (/student/i.test(variant)) return "ਵਿਦਿਆਰਥੀ";
  if (/employee|retir/i.test(variant)) return "ਕਰਮਚਾਰੀ";
  if (/worker/i.test(variant)) return "ਕਾਮਾ";
  if (/player/i.test(variant)) return "ਖਿਡਾਰੀ";
  if (/child|newborn/i.test(variant)) return "ਬੱਚਾ";
  return "ਮੈਂਬਰ";
}

function subjectLabel(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const kind = contextKind(pkg);
  if (language === "hi") {
    switch (kind) {
      case "marks": return "परीक्षा-अंकों";
      case "salary": return "कर्मचारियों";
      case "sales": return "दिनों की बिक्री";
      case "price": return "मूल्यों";
      case "output": return "मशीनों के उत्पादन";
      case "parcel": return "पार्सलों";
      case "weight": return "व्यक्तियों के वजन";
      case "age": {
        const role = roleLabel(pkg, language);
        if (role === "विद्यार्थी") return "विद्यार्थियों की आयु";
        if (role === "खिलाड़ी") return "खिलाड़ियों की आयु";
        if (role === "कर्मचारी" || role === "कर्मी") return "कर्मचारियों की आयु";
        return "सदस्यों की आयु";
      }
      case "cricket": return "पारियों के स्कोर";
      default: return "मानों";
    }
  }
  switch (kind) {
    case "marks": return "ਪ੍ਰੀਖਿਆ ਅੰਕਾਂ";
    case "salary": return "ਕਰਮਚਾਰੀਆਂ";
    case "sales": return "ਦਿਨਾਂ ਦੀ ਵਿਕਰੀ";
    case "price": return "ਕੀਮਤਾਂ";
    case "output": return "ਮਸ਼ੀਨਾਂ ਦੇ ਉਤਪਾਦਨ";
    case "parcel": return "ਪਾਰਸਲਾਂ";
    case "weight": return "ਵਿਅਕਤੀਆਂ ਦੇ ਵਜ਼ਨ";
    case "age": {
      const role = roleLabel(pkg, language);
      if (role === "ਵਿਦਿਆਰਥੀ") return "ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਉਮਰ";
      if (role === "ਖਿਡਾਰੀ") return "ਖਿਡਾਰੀਆਂ ਦੀ ਉਮਰ";
      if (role === "ਕਰਮਚਾਰੀ" || role === "ਕਾਮਾ") return "ਕਰਮਚਾਰੀਆਂ ਦੀ ਉਮਰ";
      return "ਮੈਂਬਰਾਂ ਦੀ ਉਮਰ";
    }
    case "cricket": return "ਪਾਰੀਆਂ ਦੇ ਸਕੋਰ";
    default: return "ਮੁੱਲਾਂ";
  }
}

function shown(pkg: Avg001QuestionPackage, raw: string, language: PilotLanguage) {
  const kind = contextKind(pkg);
  if (kind === "salary" || kind === "sales" || kind === "price") return `₹${raw}`;
  if (language === "hi") {
    if (kind === "age") return `${raw} वर्ष`;
    if (kind === "parcel" || kind === "weight") return `${raw} किग्रा`;
    if (kind === "output") return `${raw} इकाइयाँ`;
    if (kind === "marks") return `${raw} अंक`;
    if (kind === "cricket") return `${raw} रन`;
    return raw;
  }
  if (kind === "age") return `${raw} ਸਾਲ`;
  if (kind === "parcel" || kind === "weight") return `${raw} ਕਿਲੋਗ੍ਰਾਮ`;
  if (kind === "output") return `${raw} ਇਕਾਈਆਂ`;
  if (kind === "marks") return `${raw} ਅੰਕ`;
  if (kind === "cricket") return `${raw} ਦੌੜਾਂ`;
  return raw;
}

function entityPhrase(pkg: Avg001QuestionPackage, value: string, language: PilotLanguage) {
  const kind = contextKind(pkg);
  if (language === "hi") {
    switch (kind) {
      case "salary": return `${shown(pkg, value, language)} वेतन वाला एक कर्मचारी`;
      case "sales": return `${shown(pkg, value, language)} की बिक्री वाला एक दिन`;
      case "price": return `${shown(pkg, value, language)} का एक मूल्य`;
      case "output": return `${shown(pkg, value, language)} उत्पादन वाली एक मशीन`;
      case "parcel": return `${shown(pkg, value, language)} वजन वाला एक पार्सल`;
      case "weight": return `${shown(pkg, value, language)} वजन वाला एक व्यक्ति`;
      case "age": return `${shown(pkg, value, language)} आयु का एक ${roleLabel(pkg, language)}`;
      case "marks": return `${shown(pkg, value, language)} का एक स्कोर`;
      default: return `${shown(pkg, value, language)} का एक मान`;
    }
  }
  switch (kind) {
    case "salary": return `${shown(pkg, value, language)} ਤਨਖਾਹ ਵਾਲਾ ਇੱਕ ਕਰਮਚਾਰੀ`;
    case "sales": return `${shown(pkg, value, language)} ਦੀ ਵਿਕਰੀ ਵਾਲਾ ਇੱਕ ਦਿਨ`;
    case "price": return `${shown(pkg, value, language)} ਦੀ ਇੱਕ ਕੀਮਤ`;
    case "output": return `${shown(pkg, value, language)} ਉਤਪਾਦਨ ਵਾਲੀ ਇੱਕ ਮਸ਼ੀਨ`;
    case "parcel": return `${shown(pkg, value, language)} ਵਜ਼ਨ ਵਾਲਾ ਇੱਕ ਪਾਰਸਲ`;
    case "weight": return `${shown(pkg, value, language)} ਵਜ਼ਨ ਵਾਲਾ ਇੱਕ ਵਿਅਕਤੀ`;
    case "age": return `${shown(pkg, value, language)} ਉਮਰ ਵਾਲਾ ਇੱਕ ${roleLabel(pkg, language)}`;
    case "marks": return `${shown(pkg, value, language)} ਦਾ ਇੱਕ ਸਕੋਰ`;
    default: return `${shown(pkg, value, language)} ਦਾ ਇੱਕ ਮੁੱਲ`;
  }
}

function elapsedLead(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const years = Number(pkg.parameters.values.yearsElapsed ?? 0);
  if (!years) return "";
  return language === "hi" ? `${years} वर्ष बाद, ` : `${years} ਸਾਲ ਬਾਅਦ, `;
}

function answerLabel(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  if (pkg.solveMode === "findInningsValueOrNewCricketAverage") {
    if (pkg.parameters.answerType === "AVERAGE") {
      return language === "hi" ? "नया बल्लेबाजी औसत" : "ਨਵੀਂ ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ";
    }
    return language === "hi" ? "अगली पारी का आवश्यक स्कोर" : "ਅਗਲੀ ਪਾਰੀ ਲਈ ਲੋੜੀਂਦਾ ਸਕੋਰ";
  }
  if (pkg.solveMode.startsWith("findNewAverage")) {
    return language === "hi" ? "नया औसत" : "ਨਵੀਂ ਔਸਤ";
  }
  if (pkg.solveMode === "findAddedMemberValueFromShift") {
    return language === "hi" ? "जोड़े गए सदस्य का मान" : "ਜੋੜੇ ਗਏ ਮੈਂਬਰ ਦਾ ਮੁੱਲ";
  }
  if (pkg.solveMode === "findRemovedMemberValueFromShift") {
    return language === "hi" ? "हटाए गए सदस्य का मान" : "ਹਟਾਏ ਗਏ ਮੈਂਬਰ ਦਾ ਮੁੱਲ";
  }
  const target = String(pkg.parameters.values.replacementTarget ?? "new");
  if (target === "old") return language === "hi" ? "पुराना मान" : "ਪੁਰਾਣਾ ਮੁੱਲ";
  return language === "hi" ? "नया प्रतिस्थापन मान" : "ਨਵਾਂ ਬਦਲੀ ਮੁੱਲ";
}

function localizedStem(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const oldCount = renderValue(pkg, "oldCount");
  const oldAverage = shown(pkg, renderValue(pkg, "oldAverage"), language);
  const newAverage = shown(pkg, renderValue(pkg, "newAverage"), language);
  const subject = subjectLabel(pkg, language);
  const elapsed = elapsedLead(pkg, language);
  const variant = qlNumber(pkg.questionLanguageId) % 3;

  if (pkg.solveMode === "findInningsValueOrNewCricketAverage") {
    const innings = renderValue(pkg, "inningsCount");
    if (pkg.parameters.answerType === "AVERAGE") {
      const score = shown(pkg, renderValue(pkg, "nextScore"), language);
      if (language === "hi") {
        return [
          `एक बल्लेबाज का ${innings} पारियों के बाद औसत ${oldAverage} है। अगली पारी में ${score} बनाने पर नया औसत ज्ञात कीजिए।`,
          `${innings} पारियों में बल्लेबाजी औसत ${oldAverage} है। अगली पारी का स्कोर ${score} है। नया औसत निकालिए।`,
          `एक खिलाड़ी ने ${innings} पारियाँ ${oldAverage} के औसत से खेली हैं। अगली पारी में ${score} बनाने के बाद औसत क्या होगा?`,
        ][variant]!;
      }
      return [
        `ਇੱਕ ਬੱਲੇਬਾਜ਼ ਦੀ ${innings} ਪਾਰੀਆਂ ਤੋਂ ਬਾਅਦ ਔਸਤ ${oldAverage} ਹੈ। ਅਗਲੀ ਪਾਰੀ ਵਿੱਚ ${score} ਬਣਾਉਣ ਉੱਤੇ ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।`,
        `${innings} ਪਾਰੀਆਂ ਵਿੱਚ ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ ${oldAverage} ਹੈ। ਅਗਲੀ ਪਾਰੀ ਦਾ ਸਕੋਰ ${score} ਹੈ। ਨਵੀਂ ਔਸਤ ਕੱਢੋ।`,
        `ਇੱਕ ਖਿਡਾਰੀ ਨੇ ${innings} ਪਾਰੀਆਂ ${oldAverage} ਦੀ ਔਸਤ ਨਾਲ ਖੇਡੀਆਂ ਹਨ। ਅਗਲੀ ਪਾਰੀ ਵਿੱਚ ${score} ਬਣਾਉਣ ਤੋਂ ਬਾਅਦ ਔਸਤ ਕੀ ਹੋਵੇਗੀ?`,
      ][variant]!;
    }
    if (language === "hi") {
      return [
        `एक बल्लेबाज का ${innings} पारियों के बाद औसत ${oldAverage} है। औसत ${newAverage} करने के लिए अगली पारी में कितने रन चाहिए?`,
        `${innings} पारियों में औसत ${oldAverage} है। इसे ${newAverage} तक पहुँचाने के लिए अगला स्कोर ज्ञात कीजिए।`,
        `एक खिलाड़ी ${innings} पारियों में ${oldAverage} का औसत रखता है। अगली पारी में कितना स्कोर करने पर औसत ${newAverage} होगा?`,
      ][variant]!;
    }
    return [
      `ਇੱਕ ਬੱਲੇਬਾਜ਼ ਦੀ ${innings} ਪਾਰੀਆਂ ਤੋਂ ਬਾਅਦ ਔਸਤ ${oldAverage} ਹੈ। ਔਸਤ ${newAverage} ਕਰਨ ਲਈ ਅਗਲੀ ਪਾਰੀ ਵਿੱਚ ਕਿੰਨੀਆਂ ਦੌੜਾਂ ਚਾਹੀਦੀਆਂ ਹਨ?`,
      `${innings} ਪਾਰੀਆਂ ਵਿੱਚ ਔਸਤ ${oldAverage} ਹੈ। ਇਸ ਨੂੰ ${newAverage} ਤੱਕ ਲਿਜਾਣ ਲਈ ਅਗਲਾ ਸਕੋਰ ਪਤਾ ਕਰੋ।`,
      `ਇੱਕ ਖਿਡਾਰੀ ${innings} ਪਾਰੀਆਂ ਵਿੱਚ ${oldAverage} ਦੀ ਔਸਤ ਰੱਖਦਾ ਹੈ। ਅਗਲੀ ਪਾਰੀ ਵਿੱਚ ਕਿੰਨਾ ਸਕੋਰ ਕਰਨ ਉੱਤੇ ਔਸਤ ${newAverage} ਹੋਵੇਗੀ?`,
    ][variant]!;
  }

  if (pkg.solveMode === "findNewAverageAfterAddition") {
    const entity = entityPhrase(pkg, renderValue(pkg, "addedValue"), language);
    if (language === "hi") {
      return `${oldCount} ${subject} का औसत ${oldAverage} है। ${elapsed}${entity} समूह में शामिल होता है। नया औसत ज्ञात कीजिए।`;
    }
    return `${oldCount} ${subject} ਦੀ ਔਸਤ ${oldAverage} ਹੈ। ${elapsed}${entity} ਸਮੂਹ ਵਿੱਚ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ। ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।`;
  }

  if (pkg.solveMode === "findNewAverageAfterRemoval") {
    const entity = entityPhrase(pkg, renderValue(pkg, "removedValue"), language);
    if (language === "hi") {
      return `${oldCount} ${subject} का औसत ${oldAverage} है। ${elapsed}${entity} समूह से हट जाता है। नया औसत ज्ञात कीजिए।`;
    }
    return `${oldCount} ${subject} ਦੀ ਔਸਤ ${oldAverage} ਹੈ। ${elapsed}${entity} ਸਮੂਹ ਵਿੱਚੋਂ ਹਟ ਜਾਂਦਾ ਹੈ। ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।`;
  }

  if (pkg.solveMode === "findNewAverageAfterReplacement") {
    const oldEntity = entityPhrase(pkg, renderValue(pkg, "oldValue"), language);
    const newEntity = entityPhrase(pkg, renderValue(pkg, "newValue"), language);
    if (language === "hi") {
      return `${oldCount} ${subject} का औसत ${oldAverage} है। ${elapsed}${oldEntity} के स्थान पर ${newEntity} रखा जाता है। नया औसत ज्ञात कीजिए।`;
    }
    return `${oldCount} ${subject} ਦੀ ਔਸਤ ${oldAverage} ਹੈ। ${elapsed}${oldEntity} ਦੀ ਥਾਂ ${newEntity} ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ। ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।`;
  }

  if (pkg.solveMode === "findAddedMemberValueFromShift") {
    if (language === "hi") {
      return `${oldCount} ${subject} का औसत ${oldAverage} है। ${elapsed}एक नया ${roleLabel(pkg, language)} शामिल होने पर औसत ${newAverage} हो जाता है। नए सदस्य का मान ज्ञात कीजिए।`;
    }
    return `${oldCount} ${subject} ਦੀ ਔਸਤ ${oldAverage} ਹੈ। ${elapsed}ਇੱਕ ਨਵਾਂ ${roleLabel(pkg, language)} ਸ਼ਾਮਲ ਹੋਣ ਉੱਤੇ ਔਸਤ ${newAverage} ਹੋ ਜਾਂਦੀ ਹੈ। ਨਵੇਂ ਮੈਂਬਰ ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  }

  if (pkg.solveMode === "findRemovedMemberValueFromShift") {
    if (language === "hi") {
      return `${oldCount} ${subject} का औसत ${oldAverage} है। ${elapsed}एक ${roleLabel(pkg, language)} हटने पर औसत ${newAverage} हो जाता है। हटाए गए सदस्य का मान ज्ञात कीजिए।`;
    }
    return `${oldCount} ${subject} ਦੀ ਔਸਤ ${oldAverage} ਹੈ। ${elapsed}ਇੱਕ ${roleLabel(pkg, language)} ਹਟਣ ਉੱਤੇ ਔਸਤ ${newAverage} ਹੋ ਜਾਂਦੀ ਹੈ। ਹਟਾਏ ਗਏ ਮੈਂਬਰ ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  }

  const target = String(pkg.parameters.values.replacementTarget ?? "new");
  if (target === "old") {
    const knownNew = entityPhrase(pkg, renderValue(pkg, "newValue"), language);
    if (language === "hi") {
      return `${oldCount} ${subject} का औसत ${oldAverage} था। ${elapsed}एक अज्ञात मान के स्थान पर ${knownNew} रखने से औसत ${newAverage} हो गया। पुराना मान ज्ञात कीजिए।`;
    }
    return `${oldCount} ${subject} ਦੀ ਔਸਤ ${oldAverage} ਸੀ। ${elapsed}ਇੱਕ ਅਣਜਾਣ ਮੁੱਲ ਦੀ ਥਾਂ ${knownNew} ਰੱਖਣ ਨਾਲ ਔਸਤ ${newAverage} ਹੋ ਗਈ। ਪੁਰਾਣਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  }
  const knownOld = entityPhrase(pkg, renderValue(pkg, "oldValue"), language);
  if (language === "hi") {
    return `${oldCount} ${subject} का औसत ${oldAverage} था। ${elapsed}${knownOld} को बदलने पर औसत ${newAverage} हो गया। नया प्रतिस्थापन मान ज्ञात कीजिए।`;
  }
  return `${oldCount} ${subject} ਦੀ ਔਸਤ ${oldAverage} ਸੀ। ${elapsed}${knownOld} ਨੂੰ ਬਦਲਣ ਉੱਤੇ ਔਸਤ ${newAverage} ਹੋ ਗਈ। ਨਵਾਂ ਬਦਲੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
}

function localizedExplanation(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const values = pkg.parameters.values;
  const oldCount = Number(values.oldCount ?? values.count);
  const newCount = Number(values.newCount ?? oldCount);
  const oldAverage = rationalText(values.oldAverage ?? values.average);
  const currentAverage = rationalText(values.currentAverage ?? values.average);
  const newAverage = rationalText(values.newAverage ?? values.average);
  const currentTotal = rationalText(values.currentTotal ?? values.oldTotal ?? values.total);
  const newTotal = rationalText(values.newTotal ?? values.total);
  const years = Number(values.yearsElapsed ?? 0);
  const answer = shown(pkg, pkg.answer, language);
  const oldTotalLine = years > 0
    ? language === "hi"
      ? `$$वर्तमान औसत = ${oldAverage} + ${years} = ${currentAverage};\quad वर्तमान कुल = ${currentAverage} × ${oldCount} = ${currentTotal}$$`
      : `$$ਮੌਜੂਦਾ ਔਸਤ = ${oldAverage} + ${years} = ${currentAverage};\quad ਮੌਜੂਦਾ ਕੁੱਲ = ${currentAverage} × ${oldCount} = ${currentTotal}$$`
    : language === "hi"
      ? `$$पुराना कुल = ${oldAverage} × ${oldCount} = ${currentTotal}$$`
      : `$$ਪੁਰਾਣਾ ਕੁੱਲ = ${oldAverage} × ${oldCount} = ${currentTotal}$$`;
  const firstLine = years > 0
    ? language === "hi"
      ? "समय बीतने पर पुराने समूह की प्रत्येक आयु उतने ही वर्षों से बढ़ती है।"
      : "ਸਮਾਂ ਬੀਤਣ ਨਾਲ ਪੁਰਾਣੇ ਸਮੂਹ ਦੇ ਹਰ ਮੈਂਬਰ ਦੀ ਉਮਰ ਉਨ੍ਹਾਂ ਹੀ ਸਾਲਾਂ ਨਾਲ ਵਧਦੀ ਹੈ।"
    : language === "hi"
      ? "कुल मान निकालने के लिए औसत को सदस्यों की संख्या से गुणा करते हैं।"
      : "ਕੁੱਲ ਮੁੱਲ ਲਈ ਔਸਤ ਨੂੰ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਦੇ ਹਾਂ।";
  const finalLine = language === "hi"
    ? `अतः ${answerLabel(pkg, language)} ${answer} है।`
    : `ਇਸ ਲਈ ${answerLabel(pkg, language)} ${answer} ਹੈ।`;

  switch (pkg.solveMode) {
    case "findNewAverageAfterAddition": {
      const added = rationalText(values.addedValue);
      const calculation = language === "hi"
        ? `$$नया कुल = ${currentTotal} + ${added} = ${newTotal};\quad नया औसत = ${newTotal} ÷ ${newCount} = ${pkg.answer}$$`
        : `$$ਨਵਾਂ ਕੁੱਲ = ${currentTotal} + ${added} = ${newTotal};\quad ਨਵੀਂ ਔਸਤ = ${newTotal} ÷ ${newCount} = ${pkg.answer}$$`;
      return { lines: [firstLine, oldTotalLine, calculation, finalLine] };
    }
    case "findNewAverageAfterRemoval": {
      const removed = rationalText(values.removedValue);
      const calculation = language === "hi"
        ? `$$नया कुल = ${currentTotal} - ${removed} = ${newTotal};\quad नया औसत = ${newTotal} ÷ ${newCount} = ${pkg.answer}$$`
        : `$$ਨਵਾਂ ਕੁੱਲ = ${currentTotal} - ${removed} = ${newTotal};\quad ਨਵੀਂ ਔਸਤ = ${newTotal} ÷ ${newCount} = ${pkg.answer}$$`;
      return { lines: [firstLine, oldTotalLine, calculation, finalLine] };
    }
    case "findNewAverageAfterReplacement": {
      const oldValue = rationalText(values.oldValue);
      const newValue = rationalText(values.newValue);
      const calculation = language === "hi"
        ? `$$नया कुल = ${currentTotal} - ${oldValue} + ${newValue} = ${newTotal};\quad नया औसत = ${newTotal} ÷ ${newCount} = ${pkg.answer}$$`
        : `$$ਨਵਾਂ ਕੁੱਲ = ${currentTotal} - ${oldValue} + ${newValue} = ${newTotal};\quad ਨਵੀਂ ਔਸਤ = ${newTotal} ÷ ${newCount} = ${pkg.answer}$$`;
      return { lines: [firstLine, oldTotalLine, calculation, finalLine] };
    }
    case "findAddedMemberValueFromShift": {
      const calculation = language === "hi"
        ? `$$नया कुल = ${newAverage} × ${newCount} = ${newTotal};\quad जोड़ा गया मान = ${newTotal} - ${currentTotal} = ${pkg.answer}$$`
        : `$$ਨਵਾਂ ਕੁੱਲ = ${newAverage} × ${newCount} = ${newTotal};\quad ਜੋੜਿਆ ਮੁੱਲ = ${newTotal} - ${currentTotal} = ${pkg.answer}$$`;
      return { lines: [firstLine, oldTotalLine, calculation, finalLine] };
    }
    case "findRemovedMemberValueFromShift": {
      const calculation = language === "hi"
        ? `$$बचा हुआ कुल = ${newAverage} × ${newCount} = ${newTotal};\quad हटाया गया मान = ${currentTotal} - ${newTotal} = ${pkg.answer}$$`
        : `$$ਬਚਿਆ ਕੁੱਲ = ${newAverage} × ${newCount} = ${newTotal};\quad ਹਟਾਇਆ ਮੁੱਲ = ${currentTotal} - ${newTotal} = ${pkg.answer}$$`;
      return { lines: [firstLine, oldTotalLine, calculation, finalLine] };
    }
    case "findReplacementValueFromShift": {
      const totalChange = rationalText((values.newTotal && values.currentTotal)
        ? {
            numerator: (values.newTotal as Rational).numerator * (values.currentTotal as Rational).denominator - (values.currentTotal as Rational).numerator * (values.newTotal as Rational).denominator,
            denominator: (values.newTotal as Rational).denominator * (values.currentTotal as Rational).denominator,
          }
        : 0);
      const target = String(values.replacementTarget ?? "new");
      const known = target === "old" ? rationalText(values.newValue) : rationalText(values.oldValue);
      const calculation = target === "old"
        ? language === "hi"
          ? `$$कुल परिवर्तन = ${newTotal} - ${currentTotal} = ${totalChange};\quad पुराना मान = ${known} - (${totalChange}) = ${pkg.answer}$$`
          : `$$ਕੁੱਲ ਬਦਲਾਅ = ${newTotal} - ${currentTotal} = ${totalChange};\quad ਪੁਰਾਣਾ ਮੁੱਲ = ${known} - (${totalChange}) = ${pkg.answer}$$`
        : language === "hi"
          ? `$$कुल परिवर्तन = ${newTotal} - ${currentTotal} = ${totalChange};\quad नया मान = ${known} + (${totalChange}) = ${pkg.answer}$$`
          : `$$ਕੁੱਲ ਬਦਲਾਅ = ${newTotal} - ${currentTotal} = ${totalChange};\quad ਨਵਾਂ ਮੁੱਲ = ${known} + (${totalChange}) = ${pkg.answer}$$`;
      return { lines: [firstLine, oldTotalLine, calculation, finalLine] };
    }
    case "findInningsValueOrNewCricketAverage": {
      const innings = Number(values.inningsCount ?? oldCount);
      const oldRuns = rationalText(values.oldTotal ?? values.total);
      const cricketIntro = language === "hi"
        ? "बल्लेबाजी औसत के लिए कुल रन को खेली गई पारियों की संख्या से भाग देते हैं।"
        : "ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ ਲਈ ਕੁੱਲ ਦੌੜਾਂ ਨੂੰ ਖੇਡੀਆਂ ਪਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੰਦੇ ਹਾਂ।";
      const oldRunsLine = language === "hi"
        ? `$$पुराने कुल रन = ${oldAverage} × ${innings} = ${oldRuns}$$`
        : `$$ਪੁਰਾਣੀਆਂ ਕੁੱਲ ਦੌੜਾਂ = ${oldAverage} × ${innings} = ${oldRuns}$$`;
      if (pkg.parameters.answerType === "AVERAGE") {
        const score = rationalText(values.nextScore);
        const calculation = language === "hi"
          ? `$$नए कुल रन = ${oldRuns} + ${score} = ${newTotal};\quad नया औसत = ${newTotal} ÷ ${newCount} = ${pkg.answer}$$`
          : `$$ਨਵੀਆਂ ਕੁੱਲ ਦੌੜਾਂ = ${oldRuns} + ${score} = ${newTotal};\quad ਨਵੀਂ ਔਸਤ = ${newTotal} ÷ ${newCount} = ${pkg.answer}$$`;
        return { lines: [cricketIntro, oldRunsLine, calculation, finalLine] };
      }
      const calculation = language === "hi"
        ? `$$लक्षित कुल रन = ${newAverage} × ${newCount} = ${newTotal};\quad आवश्यक स्कोर = ${newTotal} - ${oldRuns} = ${pkg.answer}$$`
        : `$$ਲਕਸ਼ਿਤ ਕੁੱਲ ਦੌੜਾਂ = ${newAverage} × ${newCount} = ${newTotal};\quad ਲੋੜੀਂਦਾ ਸਕੋਰ = ${newTotal} - ${oldRuns} = ${pkg.answer}$$`;
      return { lines: [cricketIntro, oldRunsLine, calculation, finalLine] };
    }
    default:
      throw new Error(`Unsupported CP-003 localization mode: ${pkg.solveMode}`);
  }
}

function localizedChecks(pkg: Avg001QuestionPackage, language: PilotLanguage) {
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
  const english = runAvg001Pipeline({
    questionLanguageId: input.questionLanguageId,
    seed: input.seed,
    language: "en",
  });
  if (english.canonicalProblemId !== AVG_001_CP003_MULTILINGUAL_PILOT.canonicalProblemId) {
    throw new Error(`${input.questionLanguageId} is outside the AVG-001 CP-003 multilingual pilot`);
  }
  const localized: Avg001QuestionPackage = {
    ...english,
    questionId: `${english.questionId}:${input.language}`,
    language: input.language as Avg001Language,
    stem: localizedStem(english, input.language),
    parameters: { ...english.parameters, language: input.language as Avg001Language },
    explanation: localizedExplanation(english, input.language),
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
  const checks = localizedChecks(localized, input.language);
  return { ...localized, validation: { valid: checks.every((check) => check.passed), checks } };
}
