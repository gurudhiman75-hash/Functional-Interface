import {
  AVG_001_CP002_MULTILINGUAL_PILOT,
  getAvg001Cp002LocalizedQlIds,
  runAvg001Cp002LocalizationPilot as runBasePilot,
} from "./cp002-localization-pilot";
import type { Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export {
  AVG_001_CP002_MULTILINGUAL_PILOT,
  getAvg001Cp002LocalizedQlIds,
};

type PilotLanguage = "hi" | "pa";

function clean(value: unknown) {
  return String(value ?? "").replace(/^(\d[\d,]*)\.0$/, "$1");
}

function v(pkg: Avg001QuestionPackage, key: string) {
  return clean(pkg.parameters.renderVariables[key]);
}

function qlNumber(pkg: Avg001QuestionPackage) {
  return Number(pkg.questionLanguageId.slice(-3));
}

function smallest(pkg: Avg001QuestionPackage) {
  const target = String(pkg.parameters.values.targetExtreme ?? pkg.parameters.renderVariables.extremeLabel ?? "largest");
  return /small|least/i.test(target);
}

function hiContext(pkg: Avg001QuestionPackage) {
  switch (pkg.parameters.contextDomain) {
    case "Classroom": return { plural: "परीक्षा-अंक", singular: "अंक", lead: "किसी विद्यार्थी के परीक्षा-अंक" };
    case "Commerce": return { plural: "क्रमिक कीमतें", singular: "कीमत", lead: "किसी वस्तु की क्रमिक कीमतें" };
    case "Factory": return { plural: "पालियों के उत्पादन", singular: "उत्पादन", lead: "लगातार पालियों का उत्पादन" };
    case "Sports": return { plural: "मैचों के स्कोर", singular: "स्कोर", lead: "लगातार मैचों में बनाए गए स्कोर" };
    case "Travel": return { plural: "दिनों की दूरियाँ", singular: "दूरी", lead: "लगातार दिनों में तय की गई दूरियाँ" };
    default: return { plural: "संख्याएँ", singular: "संख्या", lead: "समान अंतर वाली संख्याएँ" };
  }
}

function paContext(pkg: Avg001QuestionPackage) {
  switch (pkg.parameters.contextDomain) {
    case "Classroom": return { plural: "ਪ੍ਰੀਖਿਆ ਅੰਕ", singular: "ਅੰਕ", lead: "ਕਿਸੇ ਵਿਦਿਆਰਥੀ ਦੇ ਪ੍ਰੀਖਿਆ ਅੰਕ" };
    case "Commerce": return { plural: "ਲਗਾਤਾਰ ਕੀਮਤਾਂ", singular: "ਕੀਮਤ", lead: "ਕਿਸੇ ਵਸਤੂ ਦੀਆਂ ਲਗਾਤਾਰ ਕੀਮਤਾਂ" };
    case "Factory": return { plural: "ਸ਼ਿਫਟਾਂ ਦੇ ਉਤਪਾਦਨ", singular: "ਉਤਪਾਦਨ", lead: "ਲਗਾਤਾਰ ਸ਼ਿਫਟਾਂ ਦਾ ਉਤਪਾਦਨ" };
    case "Sports": return { plural: "ਮੈਚਾਂ ਦੇ ਸਕੋਰ", singular: "ਸਕੋਰ", lead: "ਲਗਾਤਾਰ ਮੈਚਾਂ ਵਿੱਚ ਬਣੇ ਸਕੋਰ" };
    case "Travel": return { plural: "ਦਿਨਾਂ ਦੀਆਂ ਦੂਰੀਆਂ", singular: "ਦੂਰੀ", lead: "ਲਗਾਤਾਰ ਦਿਨਾਂ ਵਿੱਚ ਤੈਅ ਕੀਤੀਆਂ ਦੂਰੀਆਂ" };
    default: return { plural: "ਸੰਖਿਆਵਾਂ", singular: "ਸੰਖਿਆ", lead: "ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੀਆਂ ਸੰਖਿਆਵਾਂ" };
  }
}

function hindiStem(pkg: Avg001QuestionPackage) {
  const count = v(pkg, "count");
  const average = v(pkg, "average");
  const first = v(pkg, "firstTerm");
  const last = v(pkg, "lastTerm");
  const next = v(pkg, "nextTerm");
  const difference = v(pkg, "commonDifference");
  const extreme = v(pkg, "extremeValue");
  const context = hiContext(pkg);
  const target = smallest(pkg) ? `सबसे छोटा ${context.singular}` : `सबसे बड़ा ${context.singular}`;
  const variant = qlNumber(pkg) % 4;

  switch (pkg.solveMode) {
    case "findAverageOfConsecutiveSet": {
      const forms = [
        `${context.lead} ${first} से शुरू होकर ${last} तक समान अंतर से बढ़ते हैं। उनका औसत ज्ञात कीजिए।`,
        `${context.plural} का पहला मान ${first} और अंतिम मान ${last} है। सभी मान समान अंतर पर हैं। औसत निकालिए।`,
        `समान अंतर वाले ${count} ${context.plural} ${first} से ${last} तक हैं। उनका औसत कितना है?`,
        `${context.lead} हैं जिनका पहला मान ${first}, अंतिम मान ${last} और समान अंतर ${difference} है। औसत ज्ञात कीजिए।`,
      ];
      return forms[variant]!;
    }
    case "findMiddleTermFromAverage": {
      const forms = [
        `${context.lead} समान अंतर से बढ़ते हैं। कुल ${count} मान हैं और उनका औसत ${average} है। बीच का ${context.singular} ज्ञात कीजिए।`,
        `समान अंतर वाले ${count} ${context.plural} का औसत ${average} है। मध्य मान कितना होगा?`,
        `${context.lead} हैं और उनकी संख्या ${count} है। यदि औसत ${average} है, तो बीच का मान ज्ञात कीजिए।`,
        `${count} समान अंतर वाले ${context.plural} का औसत ${average} है। केंद्रीय ${context.singular} निकालिए।`,
      ];
      return forms[variant]!;
    }
    case "findExtremeFromAverageAndCount": {
      const forms = [
        `${count} समान अंतर वाले ${context.plural} का औसत ${average} है और अंतर ${difference} है। ${target} ज्ञात कीजिए।`,
        `${context.lead} हैं। उनकी संख्या ${count}, औसत ${average} और प्रत्येक दो क्रमिक मानों का अंतर ${difference} है। ${target} निकालिए।`,
        `समान अंतर वाले ${count} ${context.plural} का औसत ${average} है। अंतर ${difference} होने पर ${target} कितना होगा?`,
        `${context.plural} की संख्या ${count}, औसत ${average} और समान अंतर ${difference} है। ${target} ज्ञात कीजिए।`,
      ];
      return forms[variant]!;
    }
    case "findAverageOfOddOrEvenSet": {
      const forms = [
        `${first} से ${last} तक समान अंतर वाली संख्याओं का औसत ज्ञात कीजिए।`,
        `${count} समान अंतर वाले मान ${first} से शुरू होकर ${last} पर समाप्त होते हैं। उनका औसत निकालिए।`,
        `${context.lead} ${first} से ${last} तक हैं। उनका औसत क्या है?`,
        `${first}, ${next}, …, ${last} का औसत ज्ञात कीजिए।`,
      ];
      return forms[variant]!;
    }
    case "findTermCountFromAverageAndExtreme":
      return smallest(pkg)
        ? `एक समान्तर श्रेणी का औसत ${average}, सबसे छोटा पद ${extreme} और समान अंतर ${difference} है। श्रेणी में कुल कितने पद हैं?`
        : `एक समान्तर श्रेणी का औसत ${average}, सबसे बड़ा पद ${extreme} और समान अंतर ${difference} है। पदों की संख्या ज्ञात कीजिए।`;
    case "findCommonDifferenceFromAverageCountAndExtreme":
      return smallest(pkg)
        ? `एक समान्तर श्रेणी में ${count} पद हैं। उसका औसत ${average} और सबसे छोटा पद ${extreme} है। समान अंतर ज्ञात कीजिए।`
        : `एक समान्तर श्रेणी में ${count} पद हैं। उसका औसत ${average} और सबसे बड़ा पद ${extreme} है। समान अंतर ज्ञात कीजिए।`;
    default:
      return pkg.stem;
  }
}

function punjabiStem(pkg: Avg001QuestionPackage) {
  const count = v(pkg, "count");
  const average = v(pkg, "average");
  const first = v(pkg, "firstTerm");
  const last = v(pkg, "lastTerm");
  const next = v(pkg, "nextTerm");
  const difference = v(pkg, "commonDifference");
  const extreme = v(pkg, "extremeValue");
  const context = paContext(pkg);
  const target = smallest(pkg) ? `ਸਭ ਤੋਂ ਛੋਟਾ ${context.singular}` : `ਸਭ ਤੋਂ ਵੱਡਾ ${context.singular}`;
  const variant = qlNumber(pkg) % 4;

  switch (pkg.solveMode) {
    case "findAverageOfConsecutiveSet": {
      const forms = [
        `${context.lead} ${first} ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ ${last} ਤੱਕ ਬਰਾਬਰ ਅੰਤਰ ਨਾਲ ਵਧਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।`,
        `${context.plural} ਦਾ ਪਹਿਲਾ ਮੁੱਲ ${first} ਅਤੇ ਆਖਰੀ ਮੁੱਲ ${last} ਹੈ। ਸਾਰੇ ਮੁੱਲ ਬਰਾਬਰ ਅੰਤਰ ਉੱਤੇ ਹਨ। ਔਸਤ ਕੱਢੋ।`,
        `ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ${count} ${context.plural} ${first} ਤੋਂ ${last} ਤੱਕ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ਕਿੰਨੀ ਹੈ?`,
        `${context.lead} ਹਨ, ਜਿਨ੍ਹਾਂ ਦਾ ਪਹਿਲਾ ਮੁੱਲ ${first}, ਆਖਰੀ ਮੁੱਲ ${last} ਅਤੇ ਸਾਂਝਾ ਅੰਤਰ ${difference} ਹੈ। ਔਸਤ ਪਤਾ ਕਰੋ।`,
      ];
      return forms[variant]!;
    }
    case "findMiddleTermFromAverage": {
      const forms = [
        `${context.lead} ਬਰਾਬਰ ਅੰਤਰ ਨਾਲ ਵਧਦੇ ਹਨ। ਕੁੱਲ ${count} ਮੁੱਲ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ${average} ਹੈ। ਵਿਚਕਾਰਲਾ ${context.singular} ਪਤਾ ਕਰੋ।`,
        `ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ${count} ${context.plural} ਦੀ ਔਸਤ ${average} ਹੈ। ਵਿਚਕਾਰਲਾ ਮੁੱਲ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
        `${context.lead} ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਗਿਣਤੀ ${count} ਹੈ। ਜੇ ਔਸਤ ${average} ਹੈ, ਤਾਂ ਵਿਚਕਾਰਲਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
        `${count} ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ${context.plural} ਦੀ ਔਸਤ ${average} ਹੈ। ਕੇਂਦਰੀ ${context.singular} ਕੱਢੋ।`,
      ];
      return forms[variant]!;
    }
    case "findExtremeFromAverageAndCount": {
      const forms = [
        `${count} ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ${context.plural} ਦੀ ਔਸਤ ${average} ਹੈ ਅਤੇ ਅੰਤਰ ${difference} ਹੈ। ${target} ਪਤਾ ਕਰੋ।`,
        `${context.lead} ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਗਿਣਤੀ ${count}, ਔਸਤ ${average} ਅਤੇ ਹਰ ਦੋ ਲਗਾਤਾਰ ਮੁੱਲਾਂ ਦਾ ਅੰਤਰ ${difference} ਹੈ। ${target} ਕੱਢੋ।`,
        `ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ${count} ${context.plural} ਦੀ ਔਸਤ ${average} ਹੈ। ਅੰਤਰ ${difference} ਹੋਣ ਉੱਤੇ ${target} ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
        `${context.plural} ਦੀ ਗਿਣਤੀ ${count}, ਔਸਤ ${average} ਅਤੇ ਸਾਂਝਾ ਅੰਤਰ ${difference} ਹੈ। ${target} ਪਤਾ ਕਰੋ।`,
      ];
      return forms[variant]!;
    }
    case "findAverageOfOddOrEvenSet": {
      const forms = [
        `${first} ਤੋਂ ${last} ਤੱਕ ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੀਆਂ ਸੰਖਿਆਵਾਂ ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।`,
        `${count} ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ਮੁੱਲ ${first} ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ ${last} ਉੱਤੇ ਖਤਮ ਹੁੰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ਕੱਢੋ।`,
        `${context.lead} ${first} ਤੋਂ ${last} ਤੱਕ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ਕੀ ਹੈ?`,
        `${first}, ${next}, …, ${last} ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।`,
      ];
      return forms[variant]!;
    }
    case "findTermCountFromAverageAndExtreme":
      return smallest(pkg)
        ? `ਇੱਕ ਸਮਾਂਤਰ ਲੜੀ ਦੀ ਔਸਤ ${average}, ਸਭ ਤੋਂ ਛੋਟਾ ਪਦ ${extreme} ਅਤੇ ਸਾਂਝਾ ਅੰਤਰ ${difference} ਹੈ। ਲੜੀ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ਪਦ ਹਨ?`
        : `ਇੱਕ ਸਮਾਂਤਰ ਲੜੀ ਦੀ ਔਸਤ ${average}, ਸਭ ਤੋਂ ਵੱਡਾ ਪਦ ${extreme} ਅਤੇ ਸਾਂਝਾ ਅੰਤਰ ${difference} ਹੈ। ਪਦਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`;
    case "findCommonDifferenceFromAverageCountAndExtreme":
      return smallest(pkg)
        ? `ਇੱਕ ਸਮਾਂਤਰ ਲੜੀ ਵਿੱਚ ${count} ਪਦ ਹਨ। ਇਸ ਦੀ ਔਸਤ ${average} ਅਤੇ ਸਭ ਤੋਂ ਛੋਟਾ ਪਦ ${extreme} ਹੈ। ਸਾਂਝਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।`
        : `ਇੱਕ ਸਮਾਂਤਰ ਲੜੀ ਵਿੱਚ ${count} ਪਦ ਹਨ। ਇਸ ਦੀ ਔਸਤ ${average} ਅਤੇ ਸਭ ਤੋਂ ਵੱਡਾ ਪਦ ${extreme} ਹੈ। ਸਾਂਝਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।`;
    default:
      return pkg.stem;
  }
}

function middleTermExplanation(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const first = v(pkg, "firstTerm");
  const last = v(pkg, "lastTerm");
  const average = v(pkg, "average") || pkg.answer;
  return language === "hi"
    ? { lines: [
        "विषम संख्या में समान अंतर वाले मानों का मध्य मान उनके औसत के बराबर होता है।",
        `$$मध्य मान = (${first} + ${last}) \\div 2 = ${pkg.answer}$$`,
        `$$मध्य मान = औसत = ${average}$$`,
        `अतः मध्य मान ${pkg.answer} है।`,
      ] }
    : { lines: [
        "ਵਿਸ਼ਮ ਗਿਣਤੀ ਵਾਲੇ ਬਰਾਬਰ ਅੰਤਰ ਦੇ ਮੁੱਲਾਂ ਵਿੱਚ ਵਿਚਕਾਰਲਾ ਮੁੱਲ ਔਸਤ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।",
        `$$ਵਿਚਕਾਰਲਾ ਮੁੱਲ = (${first} + ${last}) \\div 2 = ${pkg.answer}$$`,
        `$$ਵਿਚਕਾਰਲਾ ਮੁੱਲ = ਔਸਤ = ${average}$$`,
        `ਇਸ ਲਈ ਵਿਚਕਾਰਲਾ ਮੁੱਲ ${pkg.answer} ਹੈ।`,
      ] };
}

function refreshedValidation(pkg: Avg001QuestionPackage, stem: string, language: PilotLanguage) {
  const excluded = new Set(["localized-stem", "resolved-stem", "localized-script"]);
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter((check) => !excluded.has(check.name));
  const expected = language === "hi" ? /[\u0900-\u097F]/ : /[\u0A00-\u0A7F]/;
  const wrong = language === "hi" ? /[\u0A00-\u0A7F]/ : /[\u0900-\u097F]/;
  checks.push(
    { name: "localized-stem", passed: expected.test(stem) && !wrong.test(stem), message: "Stem uses the requested script" },
    { name: "resolved-stem", passed: !/[{}]|undefined|NaN|Infinity|null/.test(stem), message: "Stem is fully rendered" },
    { name: "context-first-stem", passed: !/अंक-श्रृंखला|मूल्य-श्रृंखला|उत्पादन-श्रृंखला|ਅੰਕਾਂ ਦੀ ਲੜੀ|ਕੀਮਤਾਂ ਦੀ ਲੜੀ|ਉਤਪਾਦਨ ਲੜੀ/.test(stem), message: "Stem avoids translated series labels" },
  );
  return { valid: checks.every((check) => check.passed), checks };
}

export function runAvg001Cp002LocalizationPilot(input: {
  questionLanguageId: string;
  seed: string;
  language: PilotLanguage;
}): Avg001QuestionPackage {
  const base = runBasePilot(input);
  const stem = input.language === "hi" ? hindiStem(base) : punjabiStem(base);
  const explanation = base.solveMode === "findMiddleTermFromAverage" ? middleTermExplanation(base, input.language) : base.explanation;
  return { ...base, stem, explanation, validation: refreshedValidation(base, stem, input.language) };
}
