import { applyAvg001LocalizedStemQualityRefinement } from "./localized-stem-quality-refinement";
import { applyAvg001LocalizedStemVariation } from "./localized-stem-variation";
import type { Avg001QuestionPackage } from "./types";

type PilotLanguage = "hi" | "pa";

function shown(pkg: Avg001QuestionPackage, key: string) {
  const rendered = pkg.parameters.renderVariables[key];
  if (rendered !== undefined && rendered !== "") return String(rendered);
  const raw = pkg.parameters.values[key];
  if (typeof raw === "string" || typeof raw === "number") return String(raw);
  if (raw && typeof raw === "object" && "numerator" in raw && "denominator" in raw) {
    const numerator = Number(raw.numerator);
    const denominator = Number(raw.denominator);
    if (denominator === 1) return String(numerator);
    const decimal = numerator / denominator;
    return Number.isInteger(decimal * 10) ? decimal.toFixed(1) : `${numerator}/${denominator}`;
  }
  return "";
}

function cleanDecimals(stem: string) {
  return stem.replace(/\b(-?\d+)\.0\b/g, "$1");
}

function cp002Lead(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const domain = pkg.parameters.contextDomain;
  if (language === "hi") {
    if (domain === "Classroom") return "एक विद्यार्थी के परीक्षा-अंक समान अंतर पर हैं।";
    if (domain === "Commerce") return "कुछ वस्तुओं की कीमतें समान अंतर पर हैं।";
    if (domain === "Factory") return "लगातार दिनों के उत्पादन मान समान अंतर पर हैं।";
    if (domain === "Sports") return "लगातार मैचों के स्कोर समान अंतर पर हैं।";
    if (domain === "Travel") return "कुछ यात्राओं की दूरियाँ समान अंतर पर हैं।";
    return "कुछ संख्याएँ समान अंतर पर हैं।";
  }
  if (domain === "Classroom") return "ਇੱਕ ਵਿਦਿਆਰਥੀ ਦੇ ਪ੍ਰੀਖਿਆ ਅੰਕ ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ।";
  if (domain === "Commerce") return "ਕੁਝ ਵਸਤੂਆਂ ਦੀਆਂ ਕੀਮਤਾਂ ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ।";
  if (domain === "Factory") return "ਲਗਾਤਾਰ ਦਿਨਾਂ ਦੇ ਉਤਪਾਦਨ ਮੁੱਲ ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ।";
  if (domain === "Sports") return "ਲਗਾਤਾਰ ਮੈਚਾਂ ਦੇ ਸਕੋਰ ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ।";
  if (domain === "Travel") return "ਕੁਝ ਯਾਤਰਾਵਾਂ ਦੀਆਂ ਦੂਰੀਆਂ ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ।";
  return "ਕੁਝ ਸੰਖਿਆਵਾਂ ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ।";
}

function cp002Stem(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const variant = Number(pkg.questionLanguageId.slice(-3)) % 6;
  const lead = cp002Lead(pkg, language);
  const first = shown(pkg, "firstTerm");
  const last = shown(pkg, "lastTerm");
  const count = shown(pkg, "count");
  const average = shown(pkg, "average");
  const difference = shown(pkg, "commonDifference");
  const targetRaw = String(pkg.parameters.values.targetExtreme ?? pkg.parameters.renderVariables.extremeLabel ?? "largest");
  const smallest = /small|least|min/i.test(targetRaw);
  const extreme = shown(pkg, "extremeValue") || (smallest ? first : last);

  if (language === "hi") {
    const target = smallest ? "सबसे छोटा मान" : "सबसे बड़ा मान";
    if (pkg.solveMode === "findAverageOfConsecutiveSet" || pkg.solveMode === "findAverageOfOddOrEvenSet") {
      const frames = [
        `${lead} पहला मान ${first} और अंतिम मान ${last} है। औसत ज्ञात कीजिए।`,
        `${lead} क्रम ${first} से शुरू होकर ${last} पर समाप्त होता है। औसत निकालिए।`,
        `${lead} कुल ${count} मान हैं; पहला ${first} और अंतिम ${last} है। औसत क्या है?`,
        `${lead} ${first} से ${last} तक के इन मानों का औसत बताइए।`,
        `${lead} दोनों छोर के मान ${first} और ${last} हैं। समूह का औसत ज्ञात कीजिए।`,
        `${lead} सूची का आरंभ ${first} और अंत ${last} है। सभी मानों का औसत निकालिए।`,
      ];
      return frames[variant]!;
    }
    if (pkg.solveMode === "findMiddleTermFromAverage") {
      const frames = [
        `${lead} कुल ${count} मानों का औसत ${average} है। मध्य मान ज्ञात कीजिए।`,
        `${lead} समूह में ${count} मान हैं और औसत ${average} है। बीच का मान क्या होगा?`,
        `${lead} ${count} मानों के इस क्रम का औसत ${average} है। केंद्रीय मान निकालिए।`,
        `${lead} यदि ${count} मानों का औसत ${average} है, तो मध्य में कौन-सा मान आएगा?`,
        `${lead} क्रम की लंबाई ${count} और औसत ${average} है। मध्यस्थ मान ज्ञात कीजिए।`,
        `${lead} ${count} मान औसत ${average} के दोनों ओर सममित हैं। बीच का मान बताइए।`,
      ];
      return frames[variant]!;
    }
    if (pkg.solveMode === "findExtremeFromAverageAndCount") {
      const frames = [
        `${lead} संख्या ${count}, औसत ${average} और क्रमिक अंतर ${difference} है। ${target} ज्ञात कीजिए।`,
        `${lead} कुल ${count} मानों का औसत ${average} है और हर अगला मान ${difference} अधिक है। ${target} निकालिए।`,
        `${lead} ${count} मानों के क्रम का औसत ${average} तथा अंतर ${difference} है। ${target} क्या होगा?`,
        `${lead} यदि औसत ${average}, संख्या ${count} और अंतर ${difference} है, तो ${target} ज्ञात कीजिए।`,
        `${lead} ये ${count} मान औसत ${average} के दोनों ओर फैले हैं और अंतर ${difference} है। ${target} निकालिए।`,
        `${lead} क्रम में ${count} मान हैं, औसत ${average} और अंतर ${difference} है। ${target} बताइए।`,
      ];
      return frames[variant]!;
    }
    if (pkg.solveMode === "findTermCountFromAverageAndExtreme") {
      const endings = ["कुल मानों की संख्या ज्ञात कीजिए।", "क्रम में कितने मान हैं?", "पदों की कुल संख्या निकालिए।"];
      return `${lead} औसत ${average}, ${target} ${extreme} और क्रमिक अंतर ${difference} है। ${endings[variant % 3]}`;
    }
    if (pkg.solveMode === "findCommonDifferenceFromAverageCountAndExtreme") {
      const endings = ["दो क्रमिक मानों का अंतर ज्ञात कीजिए।", "समान अंतर निकालिए।", "क्रमिक अंतर कितना है?"];
      return `${lead} कुल ${count} मानों का औसत ${average} है और ${target} ${extreme} है। ${endings[variant % 3]}`;
    }
    return pkg.stem;
  }

  const target = smallest ? "ਸਭ ਤੋਂ ਛੋਟਾ ਮੁੱਲ" : "ਸਭ ਤੋਂ ਵੱਡਾ ਮੁੱਲ";
  if (pkg.solveMode === "findAverageOfConsecutiveSet" || pkg.solveMode === "findAverageOfOddOrEvenSet") {
    const frames = [
      `${lead} ਪਹਿਲਾ ਮੁੱਲ ${first} ਅਤੇ ਆਖਰੀ ਮੁੱਲ ${last} ਹੈ। ਔਸਤ ਪਤਾ ਕਰੋ।`,
      `${lead} ਕ੍ਰਮ ${first} ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ ${last} ਉੱਤੇ ਖਤਮ ਹੁੰਦਾ ਹੈ। ਔਸਤ ਕੱਢੋ।`,
      `${lead} ਕੁੱਲ ${count} ਮੁੱਲ ਹਨ; ਪਹਿਲਾ ${first} ਅਤੇ ਆਖਰੀ ${last} ਹੈ। ਔਸਤ ਕੀ ਹੈ?`,
      `${lead} ${first} ਤੋਂ ${last} ਤੱਕ ਦੇ ਇਨ੍ਹਾਂ ਮੁੱਲਾਂ ਦੀ ਔਸਤ ਦੱਸੋ।`,
      `${lead} ਦੋਵੇਂ ਅੰਤਲੇ ਮੁੱਲ ${first} ਅਤੇ ${last} ਹਨ। ਸਮੂਹ ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।`,
      `${lead} ਸੂਚੀ ਦੀ ਸ਼ੁਰੂਆਤ ${first} ਅਤੇ ਅੰਤ ${last} ਹੈ। ਸਾਰੇ ਮੁੱਲਾਂ ਦੀ ਔਸਤ ਕੱਢੋ।`,
    ];
    return frames[variant]!;
  }
  if (pkg.solveMode === "findMiddleTermFromAverage") {
    const frames = [
      `${lead} ਕੁੱਲ ${count} ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${average} ਹੈ। ਮੱਧਲਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
      `${lead} ਸਮੂਹ ਵਿੱਚ ${count} ਮੁੱਲ ਹਨ ਅਤੇ ਔਸਤ ${average} ਹੈ। ਵਿਚਕਾਰਲਾ ਮੁੱਲ ਕੀ ਹੋਵੇਗਾ?`,
      `${lead} ${count} ਮੁੱਲਾਂ ਦੇ ਇਸ ਕ੍ਰਮ ਦੀ ਔਸਤ ${average} ਹੈ। ਕੇਂਦਰੀ ਮੁੱਲ ਕੱਢੋ।`,
      `${lead} ਜੇ ${count} ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${average} ਹੈ, ਤਾਂ ਮੱਧ ਵਿੱਚ ਕਿਹੜਾ ਮੁੱਲ ਆਵੇਗਾ?`,
      `${lead} ਕ੍ਰਮ ਦੀ ਲੰਬਾਈ ${count} ਅਤੇ ਔਸਤ ${average} ਹੈ। ਮੱਧਵਰਤੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
      `${lead} ${count} ਮੁੱਲ ਔਸਤ ${average} ਦੇ ਦੋਵੇਂ ਪਾਸੇ ਸਮਮਿਤ ਹਨ। ਵਿਚਕਾਰਲਾ ਮੁੱਲ ਦੱਸੋ।`,
    ];
    return frames[variant]!;
  }
  if (pkg.solveMode === "findExtremeFromAverageAndCount") {
    const frames = [
      `${lead} ਗਿਣਤੀ ${count}, ਔਸਤ ${average} ਅਤੇ ਲਗਾਤਾਰ ਅੰਤਰ ${difference} ਹੈ। ${target} ਪਤਾ ਕਰੋ।`,
      `${lead} ਕੁੱਲ ${count} ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${average} ਹੈ ਅਤੇ ਹਰ ਅਗਲਾ ਮੁੱਲ ${difference} ਵੱਧ ਹੈ। ${target} ਕੱਢੋ।`,
      `${lead} ${count} ਮੁੱਲਾਂ ਦੇ ਕ੍ਰਮ ਦੀ ਔਸਤ ${average} ਅਤੇ ਅੰਤਰ ${difference} ਹੈ। ${target} ਕੀ ਹੋਵੇਗਾ?`,
      `${lead} ਜੇ ਔਸਤ ${average}, ਗਿਣਤੀ ${count} ਅਤੇ ਅੰਤਰ ${difference} ਹੈ, ਤਾਂ ${target} ਪਤਾ ਕਰੋ।`,
      `${lead} ਇਹ ${count} ਮੁੱਲ ਔਸਤ ${average} ਦੇ ਦੋਵੇਂ ਪਾਸੇ ਫੈਲੇ ਹਨ ਅਤੇ ਅੰਤਰ ${difference} ਹੈ। ${target} ਕੱਢੋ।`,
      `${lead} ਕ੍ਰਮ ਵਿੱਚ ${count} ਮੁੱਲ ਹਨ, ਔਸਤ ${average} ਅਤੇ ਅੰਤਰ ${difference} ਹੈ। ${target} ਦੱਸੋ।`,
    ];
    return frames[variant]!;
  }
  if (pkg.solveMode === "findTermCountFromAverageAndExtreme") {
    const endings = ["ਕੁੱਲ ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।", "ਕ੍ਰਮ ਵਿੱਚ ਕਿੰਨੇ ਮੁੱਲ ਹਨ?", "ਪਦਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਕੱਢੋ।"];
    return `${lead} ਔਸਤ ${average}, ${target} ${extreme} ਅਤੇ ਲਗਾਤਾਰ ਅੰਤਰ ${difference} ਹੈ। ${endings[variant % 3]}`;
  }
  if (pkg.solveMode === "findCommonDifferenceFromAverageCountAndExtreme") {
    const endings = ["ਦੋ ਲਗਾਤਾਰ ਮੁੱਲਾਂ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।", "ਬਰਾਬਰ ਅੰਤਰ ਕੱਢੋ।", "ਲਗਾਤਾਰ ਅੰਤਰ ਕਿੰਨਾ ਹੈ?"];
    return `${lead} ਕੁੱਲ ${count} ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${average} ਹੈ ਅਤੇ ${target} ${extreme} ਹੈ। ${endings[variant % 3]}`;
  }
  return pkg.stem;
}

function isCp003Age(pkg: Avg001QuestionPackage) {
  return (
    pkg.parameters.contextDomain === "Family" ||
    /age|teacher|child|newborn|afteryears|elapsedyears|retir/i.test(pkg.parameters.scenarioVariant)
  ) && !/cricket/i.test(pkg.parameters.scenarioVariant);
}

function cp003Kind(pkg: Avg001QuestionPackage) {
  const variant = pkg.parameters.scenarioVariant;
  if (/salary|employee/i.test(variant)) return "salary";
  if (/sales|day/i.test(variant)) return "sales";
  if (/price/i.test(variant)) return "price";
  if (/output|machine/i.test(variant)) return "output";
  if (/parcel/i.test(variant)) return "parcel";
  if (/weight|person/i.test(variant)) return "weight";
  if (/score|test|reading/i.test(variant)) return "marks";
  return "abstract";
}

function money(value: string) {
  return value.startsWith("₹") ? value : `₹${value}`;
}

function cp003ReplacementStem(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  if (isCp003Age(pkg)) return pkg.stem;
  if (pkg.solveMode !== "findNewAverageAfterReplacement" && pkg.solveMode !== "findReplacementValueFromShift") return pkg.stem;

  const kind = cp003Kind(pkg);
  const count = shown(pkg, "oldCount");
  const average = shown(pkg, "oldAverage");
  const newAverage = shown(pkg, "newAverage");
  const oldValue = shown(pkg, "oldValue");
  const newValue = shown(pkg, "newValue");
  const oldTarget = String(pkg.parameters.values.replacementTarget ?? "new") === "old";

  if (language === "hi") {
    if (pkg.solveMode === "findNewAverageAfterReplacement") {
      if (kind === "marks") return `${count} परीक्षा-अंकों का औसत ${average} है। ${oldValue} अंक के स्थान पर ${newValue} अंक दर्ज किए जाते हैं। नया औसत ज्ञात कीजिए।`;
      if (kind === "salary") return `${count} कर्मचारियों का औसत वेतन ${money(average)} है। ${money(oldValue)} वेतन वाले कर्मचारी के स्थान पर ${money(newValue)} वेतन वाला कर्मचारी आता है। नया औसत वेतन ज्ञात कीजिए।`;
      if (kind === "output") return `${count} मशीनों का औसत उत्पादन ${average} इकाइयाँ है। ${oldValue} इकाइयाँ बनाने वाली मशीन के स्थान पर ${newValue} इकाइयाँ बनाने वाली मशीन लगाई जाती है। नया औसत उत्पादन ज्ञात कीजिए।`;
      if (kind === "parcel" || kind === "weight") return `${count} वजनों का औसत ${average} किग्रा है। ${oldValue} किग्रा के वजन के स्थान पर ${newValue} किग्रा का वजन रखा जाता है। नया औसत वजन ज्ञात कीजिए।`;
      if (kind === "price") return `${count} वस्तुओं की कीमतों का औसत ${money(average)} है। ${money(oldValue)} की कीमत के स्थान पर ${money(newValue)} की कीमत रखी जाती है। नया औसत मूल्य ज्ञात कीजिए।`;
      if (kind === "sales") return `${count} दिनों की औसत बिक्री ${money(average)} है। ${money(oldValue)} की बिक्री को ${money(newValue)} से बदल दिया जाता है। नई औसत बिक्री ज्ञात कीजिए।`;
      return `${count} मानों का औसत ${average} है। ${oldValue} के स्थान पर ${newValue} रखने पर नया औसत ज्ञात कीजिए।`;
    }

    if (kind === "marks") return oldTarget
      ? `${count} परीक्षा-अंकों का औसत ${average} था। एक अज्ञात अंक के स्थान पर ${newValue} अंक दर्ज करने से औसत ${newAverage} हो गया। पुराना अंक ज्ञात कीजिए।`
      : `${count} परीक्षा-अंकों का औसत ${average} था। ${oldValue} अंक के स्थान पर नया अंक दर्ज करने से औसत ${newAverage} हो गया। नया अंक ज्ञात कीजिए।`;
    if (kind === "salary") return oldTarget
      ? `${count} कर्मचारियों का औसत वेतन ${money(average)} था। एक कर्मचारी के स्थान पर ${money(newValue)} वेतन वाला कर्मचारी आने से औसत ${money(newAverage)} हो गया। पुराने कर्मचारी का वेतन ज्ञात कीजिए।`
      : `${count} कर्मचारियों का औसत वेतन ${money(average)} था। ${money(oldValue)} वेतन वाले कर्मचारी के स्थान पर नया कर्मचारी आने से औसत ${money(newAverage)} हो गया। नए कर्मचारी का वेतन ज्ञात कीजिए।`;
    if (kind === "output") return oldTarget
      ? `${count} मशीनों का औसत उत्पादन ${average} इकाइयाँ था। एक मशीन के स्थान पर ${newValue} इकाइयाँ बनाने वाली मशीन लगाने से औसत ${newAverage} हो गया। पुरानी मशीन का उत्पादन ज्ञात कीजिए।`
      : `${count} मशीनों का औसत उत्पादन ${average} इकाइयाँ था। ${oldValue} इकाइयाँ बनाने वाली मशीन को बदलने से औसत ${newAverage} हो गया। नई मशीन का उत्पादन ज्ञात कीजिए।`;
    if (kind === "price" || kind === "sales") return oldTarget
      ? `${count} दर्ज राशियों का औसत ${money(average)} था। अज्ञात राशि के स्थान पर ${money(newValue)} रखने से औसत ${money(newAverage)} हो गया। पुरानी राशि ज्ञात कीजिए।`
      : `${count} दर्ज राशियों का औसत ${money(average)} था। ${money(oldValue)} के स्थान पर नई राशि रखने से औसत ${money(newAverage)} हो गया। नई राशि ज्ञात कीजिए।`;
    return oldTarget
      ? `${count} मानों का औसत ${average} था। अज्ञात मान के स्थान पर ${newValue} रखने से औसत ${newAverage} हो गया। पुराना मान ज्ञात कीजिए।`
      : `${count} मानों का औसत ${average} था। ${oldValue} के स्थान पर नया मान रखने से औसत ${newAverage} हो गया। नया मान ज्ञात कीजिए।`;
  }

  if (pkg.solveMode === "findNewAverageAfterReplacement") {
    if (kind === "marks") return `${count} ਪ੍ਰੀਖਿਆ ਅੰਕਾਂ ਦੀ ਔਸਤ ${average} ਹੈ। ${oldValue} ਅੰਕਾਂ ਦੀ ਥਾਂ ${newValue} ਅੰਕ ਦਰਜ ਕੀਤੇ ਜਾਂਦੇ ਹਨ। ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।`;
    if (kind === "salary") return `${count} ਕਰਮਚਾਰੀਆਂ ਦੀ ਔਸਤ ਤਨਖਾਹ ${money(average)} ਹੈ। ${money(oldValue)} ਤਨਖਾਹ ਵਾਲੇ ਕਰਮਚਾਰੀ ਦੀ ਥਾਂ ${money(newValue)} ਤਨਖਾਹ ਵਾਲਾ ਕਰਮਚਾਰੀ ਆਉਂਦਾ ਹੈ। ਨਵੀਂ ਔਸਤ ਤਨਖਾਹ ਪਤਾ ਕਰੋ।`;
    if (kind === "output") return `${count} ਮਸ਼ੀਨਾਂ ਦਾ ਔਸਤ ਉਤਪਾਦਨ ${average} ਇਕਾਈਆਂ ਹੈ। ${oldValue} ਇਕਾਈਆਂ ਬਣਾਉਣ ਵਾਲੀ ਮਸ਼ੀਨ ਦੀ ਥਾਂ ${newValue} ਇਕਾਈਆਂ ਬਣਾਉਣ ਵਾਲੀ ਮਸ਼ੀਨ ਲਗਾਈ ਜਾਂਦੀ ਹੈ। ਨਵਾਂ ਔਸਤ ਉਤਪਾਦਨ ਪਤਾ ਕਰੋ।`;
    if (kind === "parcel" || kind === "weight") return `${count} ਵਜ਼ਨਾਂ ਦੀ ਔਸਤ ${average} ਕਿਲੋਗ੍ਰਾਮ ਹੈ। ${oldValue} ਕਿਲੋਗ੍ਰਾਮ ਦੇ ਵਜ਼ਨ ਦੀ ਥਾਂ ${newValue} ਕਿਲੋਗ੍ਰਾਮ ਦਾ ਵਜ਼ਨ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ। ਨਵਾਂ ਔਸਤ ਵਜ਼ਨ ਪਤਾ ਕਰੋ।`;
    if (kind === "price") return `${count} ਵਸਤੂਆਂ ਦੀਆਂ ਕੀਮਤਾਂ ਦੀ ਔਸਤ ${money(average)} ਹੈ। ${money(oldValue)} ਦੀ ਕੀਮਤ ਦੀ ਥਾਂ ${money(newValue)} ਦੀ ਕੀਮਤ ਰੱਖੀ ਜਾਂਦੀ ਹੈ। ਨਵੀਂ ਔਸਤ ਕੀਮਤ ਪਤਾ ਕਰੋ।`;
    if (kind === "sales") return `${count} ਦਿਨਾਂ ਦੀ ਔਸਤ ਵਿਕਰੀ ${money(average)} ਹੈ। ${money(oldValue)} ਦੀ ਵਿਕਰੀ ਨੂੰ ${money(newValue)} ਨਾਲ ਬਦਲਿਆ ਜਾਂਦਾ ਹੈ। ਨਵੀਂ ਔਸਤ ਵਿਕਰੀ ਪਤਾ ਕਰੋ।`;
    return `${count} ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${average} ਹੈ। ${oldValue} ਦੀ ਥਾਂ ${newValue} ਰੱਖਣ ਉੱਤੇ ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।`;
  }

  if (kind === "marks") return oldTarget
    ? `${count} ਪ੍ਰੀਖਿਆ ਅੰਕਾਂ ਦੀ ਔਸਤ ${average} ਸੀ। ਇੱਕ ਅਣਜਾਣ ਅੰਕ ਦੀ ਥਾਂ ${newValue} ਅੰਕ ਦਰਜ ਕਰਨ ਨਾਲ ਔਸਤ ${newAverage} ਹੋ ਗਈ। ਪੁਰਾਣਾ ਅੰਕ ਪਤਾ ਕਰੋ।`
    : `${count} ਪ੍ਰੀਖਿਆ ਅੰਕਾਂ ਦੀ ਔਸਤ ${average} ਸੀ। ${oldValue} ਅੰਕਾਂ ਦੀ ਥਾਂ ਨਵਾਂ ਅੰਕ ਦਰਜ ਕਰਨ ਨਾਲ ਔਸਤ ${newAverage} ਹੋ ਗਈ। ਨਵਾਂ ਅੰਕ ਪਤਾ ਕਰੋ।`;
  if (kind === "salary") return oldTarget
    ? `${count} ਕਰਮਚਾਰੀਆਂ ਦੀ ਔਸਤ ਤਨਖਾਹ ${money(average)} ਸੀ। ਇੱਕ ਕਰਮਚਾਰੀ ਦੀ ਥਾਂ ${money(newValue)} ਤਨਖਾਹ ਵਾਲਾ ਕਰਮਚਾਰੀ ਆਉਣ ਨਾਲ ਔਸਤ ${money(newAverage)} ਹੋ ਗਈ। ਪੁਰਾਣੇ ਕਰਮਚਾਰੀ ਦੀ ਤਨਖਾਹ ਪਤਾ ਕਰੋ।`
    : `${count} ਕਰਮਚਾਰੀਆਂ ਦੀ ਔਸਤ ਤਨਖਾਹ ${money(average)} ਸੀ। ${money(oldValue)} ਤਨਖਾਹ ਵਾਲੇ ਕਰਮਚਾਰੀ ਦੀ ਥਾਂ ਨਵਾਂ ਕਰਮਚਾਰੀ ਆਉਣ ਨਾਲ ਔਸਤ ${money(newAverage)} ਹੋ ਗਈ। ਨਵੇਂ ਕਰਮਚਾਰੀ ਦੀ ਤਨਖਾਹ ਪਤਾ ਕਰੋ।`;
  if (kind === "output") return oldTarget
    ? `${count} ਮਸ਼ੀਨਾਂ ਦਾ ਔਸਤ ਉਤਪਾਦਨ ${average} ਇਕਾਈਆਂ ਸੀ। ਇੱਕ ਮਸ਼ੀਨ ਦੀ ਥਾਂ ${newValue} ਇਕਾਈਆਂ ਬਣਾਉਣ ਵਾਲੀ ਮਸ਼ੀਨ ਲਗਾਉਣ ਨਾਲ ਔਸਤ ${newAverage} ਹੋ ਗਈ। ਪੁਰਾਣੀ ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ ਪਤਾ ਕਰੋ।`
    : `${count} ਮਸ਼ੀਨਾਂ ਦਾ ਔਸਤ ਉਤਪਾਦਨ ${average} ਇਕਾਈਆਂ ਸੀ। ${oldValue} ਇਕਾਈਆਂ ਬਣਾਉਣ ਵਾਲੀ ਮਸ਼ੀਨ ਨੂੰ ਬਦਲਣ ਨਾਲ ਔਸਤ ${newAverage} ਹੋ ਗਈ। ਨਵੀਂ ਮਸ਼ੀਨ ਦਾ ਉਤਪਾਦਨ ਪਤਾ ਕਰੋ।`;
  if (kind === "price" || kind === "sales") return oldTarget
    ? `${count} ਦਰਜ ਰਕਮਾਂ ਦੀ ਔਸਤ ${money(average)} ਸੀ। ਅਣਜਾਣ ਰਕਮ ਦੀ ਥਾਂ ${money(newValue)} ਰੱਖਣ ਨਾਲ ਔਸਤ ${money(newAverage)} ਹੋ ਗਈ। ਪੁਰਾਣੀ ਰਕਮ ਪਤਾ ਕਰੋ।`
    : `${count} ਦਰਜ ਰਕਮਾਂ ਦੀ ਔਸਤ ${money(average)} ਸੀ। ${money(oldValue)} ਦੀ ਥਾਂ ਨਵੀਂ ਰਕਮ ਰੱਖਣ ਨਾਲ ਔਸਤ ${money(newAverage)} ਹੋ ਗਈ। ਨਵੀਂ ਰਕਮ ਪਤਾ ਕਰੋ।`;
  return oldTarget
    ? `${count} ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${average} ਸੀ। ਅਣਜਾਣ ਮੁੱਲ ਦੀ ਥਾਂ ${newValue} ਰੱਖਣ ਨਾਲ ਔਸਤ ${newAverage} ਹੋ ਗਈ। ਪੁਰਾਣਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`
    : `${count} ਮੁੱਲਾਂ ਦੀ ਔਸਤ ${average} ਸੀ। ${oldValue} ਦੀ ਥਾਂ ਨਵਾਂ ਮੁੱਲ ਰੱਖਣ ਨਾਲ ਔਸਤ ${newAverage} ਹੋ ਗਈ। ਨਵਾਂ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
}

export function applyAvg001LocalizedStemFinal(
  pkg: Avg001QuestionPackage,
  language: PilotLanguage,
): Avg001QuestionPackage {
  const refined = applyAvg001LocalizedStemQualityRefinement(pkg, language);
  const varied = applyAvg001LocalizedStemVariation(refined, language);
  let stem = varied.stem;
  if (pkg.canonicalProblemId === "AVG-CP-002") stem = cp002Stem(pkg, language);
  if (pkg.canonicalProblemId === "AVG-CP-003") stem = cp003ReplacementStem({ ...pkg, stem }, language);
  stem = cleanDecimals(stem);
  return stem === pkg.stem ? pkg : { ...pkg, stem };
}
