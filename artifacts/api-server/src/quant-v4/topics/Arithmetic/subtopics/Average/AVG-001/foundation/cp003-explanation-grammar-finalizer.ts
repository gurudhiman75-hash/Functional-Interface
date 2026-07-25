import type { Avg001QuestionPackage } from "./types";

type Lang = "hi" | "pa";
type Form = "added" | "removed" | "old" | "new";

function shown(pkg: Avg001QuestionPackage, key: string) {
  const value = pkg.parameters.renderVariables[key] ?? pkg.parameters.values[key];
  return value === undefined || value === null ? "" : String(value);
}

function positiveYears(pkg: Avg001QuestionPackage) {
  const raw = shown(pkg, "yearsElapsed") || shown(pkg, "elapsedYears");
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? String(value) : "";
}

function agePhrase(stem: string, lang: Lang, form: Form) {
  if (lang === "hi") {
    const table = {
      teacher: { added: "नए शिक्षक की आयु", removed: "जाने वाले शिक्षक की आयु", old: "पुराने शिक्षक की आयु", new: "नए शिक्षक की आयु" },
      player: { added: "नए खिलाड़ी की आयु", removed: "जाने वाले खिलाड़ी की आयु", old: "पुराने खिलाड़ी की आयु", new: "नए खिलाड़ी की आयु" },
      worker: { added: "नए कर्मी की आयु", removed: "जाने वाले कर्मी की आयु", old: "पुराने कर्मी की आयु", new: "नए कर्मी की आयु" },
      student: { added: "नए विद्यार्थी की आयु", removed: "जाने वाले विद्यार्थी की आयु", old: "पुराने विद्यार्थी की आयु", new: "नए विद्यार्थी की आयु" },
      baby: { added: "नवजात शिशु की आयु", removed: "शिशु की आयु", old: "पुरानी आयु", new: "नई आयु" },
      member: { added: "नए सदस्य की आयु", removed: "जाने वाले सदस्य की आयु", old: "पुराने सदस्य की आयु", new: "नए सदस्य की आयु" },
    } as const;
    const key = /शिक्षक/.test(stem) ? "teacher"
      : /खिलाड़ी/.test(stem) ? "player"
        : /कर्मचारी|कर्मी/.test(stem) ? "worker"
          : /विद्यार्थी|छात्र/.test(stem) ? "student"
            : /शिशु|बच्चा|जन्म/.test(stem) ? "baby"
              : "member";
    return table[key][form];
  }
  const table = {
    teacher: { added: "ਨਵੇਂ ਅਧਿਆਪਕ ਦੀ ਉਮਰ", removed: "ਜਾਣ ਵਾਲੇ ਅਧਿਆਪਕ ਦੀ ਉਮਰ", old: "ਪੁਰਾਣੇ ਅਧਿਆਪਕ ਦੀ ਉਮਰ", new: "ਨਵੇਂ ਅਧਿਆਪਕ ਦੀ ਉਮਰ" },
    player: { added: "ਨਵੇਂ ਖਿਡਾਰੀ ਦੀ ਉਮਰ", removed: "ਜਾਣ ਵਾਲੇ ਖਿਡਾਰੀ ਦੀ ਉਮਰ", old: "ਪੁਰਾਣੇ ਖਿਡਾਰੀ ਦੀ ਉਮਰ", new: "ਨਵੇਂ ਖਿਡਾਰੀ ਦੀ ਉਮਰ" },
    worker: { added: "ਨਵੇਂ ਕਾਮੇ ਦੀ ਉਮਰ", removed: "ਜਾਣ ਵਾਲੇ ਕਾਮੇ ਦੀ ਉਮਰ", old: "ਪੁਰਾਣੇ ਕਾਮੇ ਦੀ ਉਮਰ", new: "ਨਵੇਂ ਕਾਮੇ ਦੀ ਉਮਰ" },
    student: { added: "ਨਵੇਂ ਵਿਦਿਆਰਥੀ ਦੀ ਉਮਰ", removed: "ਜਾਣ ਵਾਲੇ ਵਿਦਿਆਰਥੀ ਦੀ ਉਮਰ", old: "ਪੁਰਾਣੇ ਵਿਦਿਆਰਥੀ ਦੀ ਉਮਰ", new: "ਨਵੇਂ ਵਿਦਿਆਰਥੀ ਦੀ ਉਮਰ" },
    baby: { added: "ਨਵਜਾਤ ਬੱਚੇ ਦੀ ਉਮਰ", removed: "ਬੱਚੇ ਦੀ ਉਮਰ", old: "ਪੁਰਾਣੀ ਉਮਰ", new: "ਨਵੀਂ ਉਮਰ" },
    member: { added: "ਨਵੇਂ ਮੈਂਬਰ ਦੀ ਉਮਰ", removed: "ਜਾਣ ਵਾਲੇ ਮੈਂਬਰ ਦੀ ਉਮਰ", old: "ਪੁਰਾਣੇ ਮੈਂਬਰ ਦੀ ਉਮਰ", new: "ਨਵੇਂ ਮੈਂਬਰ ਦੀ ਉਮਰ" },
  } as const;
  const key = /ਅਧਿਆਪਕ/.test(stem) ? "teacher"
    : /ਖਿਡਾਰੀ/.test(stem) ? "player"
      : /ਕਰਮਚਾਰੀ|ਕਾਮਾ/.test(stem) ? "worker"
        : /ਵਿਦਿਆਰਥੀ/.test(stem) ? "student"
          : /ਬੱਚਾ|ਨਵਜਾਤ|ਜਨਮ/.test(stem) ? "baby"
            : "member";
  return table[key][form];
}

function replaceConcept(line: string, concept: string) {
  const index = line.indexOf(":");
  return index >= 0 ? `${line.slice(0, index + 1)} ${concept}` : concept;
}

function ageMethod(pkg: Avg001QuestionPackage, lang: Lang, years: string) {
  const added = agePhrase(pkg.stem, lang, "added");
  const removed = agePhrase(pkg.stem, lang, "removed");
  const oldAge = agePhrase(pkg.stem, lang, "old");
  const newAge = agePhrase(pkg.stem, lang, "new");
  if (lang === "hi") {
    const lead = `पुरानी कुल आयु निकालें और प्रत्येक मूल सदस्य के लिए ${years} वर्ष जोड़ें।`;
    if (pkg.solveMode === "findNewAverageAfterAddition") return `${lead} फिर ${added} जोड़कर नई संख्या से भाग दें।`;
    if (pkg.solveMode === "findNewAverageAfterRemoval") return `${lead} फिर ${removed} घटाकर शेष संख्या से भाग दें।`;
    if (pkg.solveMode === "findNewAverageAfterReplacement") return `${lead} फिर ${oldAge} घटाकर ${newAge} जोड़ें; संख्या वही रहती है।`;
    if (pkg.solveMode === "findAddedMemberValueFromShift") return `${lead} नई कुल आयु में से यह राशि घटाने पर ${added} मिलती है।`;
    if (pkg.solveMode === "findRemovedMemberValueFromShift") return `${lead} इसमें से शेष समूह की कुल आयु घटाने पर ${removed} मिलती है।`;
    return `${lead} फिर ${oldAge} और ${newAge} के अंतर से आवश्यक आयु निकालें।`;
  }
  const lead = `ਪੁਰਾਣੀ ਕੁੱਲ ਉਮਰ ਕੱਢੋ ਅਤੇ ਹਰ ਮੂਲ ਮੈਂਬਰ ਲਈ ${years} ਸਾਲ ਜੋੜੋ।`;
  if (pkg.solveMode === "findNewAverageAfterAddition") return `${lead} ਫਿਰ ${added} ਜੋੜ ਕੇ ਨਵੀਂ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।`;
  if (pkg.solveMode === "findNewAverageAfterRemoval") return `${lead} ਫਿਰ ${removed} ਘਟਾ ਕੇ ਬਾਕੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।`;
  if (pkg.solveMode === "findNewAverageAfterReplacement") return `${lead} ਫਿਰ ${oldAge} ਘਟਾ ਕੇ ${newAge} ਜੋੜੋ; ਗਿਣਤੀ ਉਹੀ ਰਹਿੰਦੀ ਹੈ।`;
  if (pkg.solveMode === "findAddedMemberValueFromShift") return `${lead} ਨਵੀਂ ਕੁੱਲ ਉਮਰ ਵਿੱਚੋਂ ਇਹ ਰਕਮ ਘਟਾਉਣ ਉੱਤੇ ${added} ਮਿਲਦੀ ਹੈ।`;
  if (pkg.solveMode === "findRemovedMemberValueFromShift") return `${lead} ਇਸ ਵਿੱਚੋਂ ਬਾਕੀ ਸਮੂਹ ਦੀ ਕੁੱਲ ਉਮਰ ਘਟਾਉਣ ਉੱਤੇ ${removed} ਮਿਲਦੀ ਹੈ।`;
  return `${lead} ਫਿਰ ${oldAge} ਅਤੇ ${newAge} ਦੇ ਫਰਕ ਤੋਂ ਲੋੜੀਂਦੀ ਉਮਰ ਕੱਢੋ।`;
}

function obliqueHindi(value: string) {
  return value.replace(/^पुराना /, "पुराने ").replace(/^नया /, "नए ");
}

function obliquePunjabi(value: string) {
  return value.replace(/^ਪੁਰਾਣਾ /, "ਪੁਰਾਣੇ ").replace(/^ਨਵਾਂ /, "ਨਵੇਂ ");
}

function polishHindi(line: string) {
  return line
    .replaceAll("अगली परीक्षा के अंक", "अगली परीक्षा का स्कोर")
    .replaceAll("हटाई गई परीक्षा के अंक", "हटाई गई परीक्षा का स्कोर")
    .replace(/कुल में हुए परिवर्तन को ज्ञात (.+?) के साथ समायोजित करके (.+?) निकालें।/, (_match, known, target) => `कुल में हुए परिवर्तन और ज्ञात ${obliqueHindi(known)} से ${target} निकालें।`)
    .replace(/कुल में हुए परिवर्तन को (.+?) के साथ समायोजित करके (.+?) निकालें।/, (_match, oldValue, target) => `कुल में हुए परिवर्तन को ${obliqueHindi(oldValue)} में समायोजित करके ${target} निकालें।`)
    .replace(/(.+?) और पुराने औसत का अंतर बढ़े हुए समूह में औसत-वृद्धि पैदा करता है।/, "$1 और पुराने औसत के बीच का अंतर नए समूह की औसत-वृद्धि का कारण है।")
    .replace(/(.+?) और पुराने औसत का अंतर हटने के बाद शेष समूह का औसत बढ़ाता है।/, "$1 और पुराने औसत के बीच का अंतर हटने पर शेष समूह का औसत बढ़ाता है।")
    .replace(/(.+? का अंतर) औसत-वृद्धि से भाग दें;/, "$1 को औसत-वृद्धि से भाग दें;");
}

function polishPunjabi(line: string) {
  return line
    .replaceAll("ਅਗਲੀ ਪ੍ਰੀਖਿਆ ਦੇ ਅੰਕ", "ਅਗਲੀ ਪ੍ਰੀਖਿਆ ਦਾ ਸਕੋਰ")
    .replaceAll("ਹਟਾਈ ਪ੍ਰੀਖਿਆ ਦੇ ਅੰਕ", "ਹਟਾਈ ਪ੍ਰੀਖਿਆ ਦਾ ਸਕੋਰ")
    .replace(/ਕੁੱਲ ਵਿੱਚ ਆਏ ਬਦਲਾਅ ਨੂੰ ਜਾਣੀ (.+?) ਨਾਲ ਮਿਲਾ ਕੇ (.+?) ਕੱਢੋ।/, (_match, known, target) => `ਕੁੱਲ ਦੇ ਬਦਲਾਅ ਅਤੇ ਜਾਣੀ ਹੋਈ ${obliquePunjabi(known)} ਤੋਂ ${target} ਕੱਢੋ।`)
    .replace(/ਕੁੱਲ ਵਿੱਚ ਆਏ ਬਦਲਾਅ ਨੂੰ (.+?) ਨਾਲ ਮਿਲਾ ਕੇ (.+?) ਕੱਢੋ।/, (_match, oldValue, target) => `ਕੁੱਲ ਵਿੱਚ ਆਏ ਬਦਲਾਅ ਨੂੰ ${obliquePunjabi(oldValue)} ਨਾਲ ਮਿਲਾ ਕੇ ${target} ਕੱਢੋ।`)
    .replace(/(.+?) ਅਤੇ ਪੁਰਾਣੀ ਔਸਤ ਦਾ ਫਰਕ ਵਧੇ ਸਮੂਹ ਵਿੱਚ ਔਸਤ-ਵਾਧਾ ਪੈਦਾ ਕਰਦਾ ਹੈ।/, "$1 ਅਤੇ ਪੁਰਾਣੀ ਔਸਤ ਦੇ ਵਿਚਕਾਰਲਾ ਫਰਕ ਨਵੇਂ ਸਮੂਹ ਦੀ ਔਸਤ-ਵਾਧੇ ਦਾ ਕਾਰਨ ਹੈ।")
    .replace(/(.+?) ਅਤੇ ਪੁਰਾਣੀ ਔਸਤ ਦਾ ਫਰਕ ਹਟਣ ਤੋਂ ਬਾਅਦ ਬਾਕੀ ਸਮੂਹ ਦੀ ਔਸਤ ਵਧਾਉਂਦਾ ਹੈ।/, "$1 ਅਤੇ ਪੁਰਾਣੀ ਔਸਤ ਦੇ ਵਿਚਕਾਰਲਾ ਫਰਕ ਹਟਣ ਉੱਤੇ ਬਾਕੀ ਸਮੂਹ ਦੀ ਔਸਤ ਵਧਾਉਂਦਾ ਹੈ।")
    .replace(/(.+? ਦਾ ਫਰਕ) ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦਿਓ;/, "$1 ਨੂੰ ਔਸਤ-ਵਾਧੇ ਨਾਲ ਭਾਗ ਦਿਓ;");
}

export function finalizeAvg001Cp003ExplanationGrammar(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-003" || (pkg.language !== "hi" && pkg.language !== "pa")) return pkg;
  const lang = pkg.language as Lang;
  const lines = pkg.explanation.lines.map((line) => lang === "hi" ? polishHindi(line) : polishPunjabi(line));
  const years = positiveYears(pkg);
  const ageContext = lang === "hi" ? /आयु|वर्ष/.test(pkg.stem) : /ਉਮਰ|ਸਾਲ/.test(pkg.stem);
  if (ageContext && years) {
    lines[1] = ageMethod(pkg, lang, years);
  } else if (ageContext) {
    if (lang === "hi") {
      lines[0] = lines[0]!.replace(/0 वर्ष बीतने पर पहले प्रत्येक मूल आयु को उतना ही बढ़ाना आवश्यक है।/, `${agePhrase(pkg.stem, lang, "added")} जोड़ने से पहले पुरानी औसत आयु से कुल आयु निकालना आवश्यक है।`);
      lines[1] = lines[1]!.replace(/^पहले 0 वर्ष बाद की कुल आयु निकालें।\s*/, "");
    } else {
      lines[0] = lines[0]!.replace(/0 ਸਾਲ ਬੀਤਣ ਉੱਤੇ ਪਹਿਲਾਂ ਹਰ ਮੂਲ ਉਮਰ ਨੂੰ ਉਤਨਾ ਹੀ ਵਧਾਉਣਾ ਲਾਜ਼ਮੀ ਹੈ।/, `${agePhrase(pkg.stem, lang, "added")} ਜੋੜਨ ਤੋਂ ਪਹਿਲਾਂ ਪੁਰਾਣੀ ਔਸਤ ਉਮਰ ਤੋਂ ਕੁੱਲ ਉਮਰ ਕੱਢਣਾ ਲਾਜ਼ਮੀ ਹੈ।`);
      lines[1] = lines[1]!.replace(/^ਪਹਿਲਾਂ 0 ਸਾਲ ਬਾਅਦ ਦੀ ਕੁੱਲ ਉਮਰ ਕੱਢੋ।\s*/, "");
    }
  }
  return {
    ...pkg,
    explanation: { lines },
    traceability: {
      ...pkg.traceability,
      cp003ExplanationGrammarFinalizer: "AVG-CP-003 localized explanation grammar finalizer v1",
    },
  };
}
