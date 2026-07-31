import { getAvg001QuestionEntry } from "./library";
import {
  applyAvg001NaturalLanguageV3Review,
  AVG_001_NATURAL_LANGUAGE_V3_REVIEW,
} from "./natural-language-v3";
import type {
  Avg001Language,
  Avg001QuestionPackage,
  Avg001ValidationCheck,
  Rational,
} from "./types";

export const AVG_001_NATURAL_LANGUAGE_V3_POLISH =
  "AVG-001 natural teacher-language review candidate v3 polished";

function numberFrom(value: number | Rational | undefined) {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && value.denominator) {
    return value.numerator / value.denominator;
  }
  return undefined;
}

function shown(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) return undefined;
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toFixed(2)));
}

function localizeDisplay(value: string, language: Avg001Language) {
  if (language === "en") return value;
  const plural = language === "hi"
    ? {
        unit: "इकाई", units: "इकाइयाँ", mark: "अंक", marks: "अंक",
        year: "वर्ष", years: "वर्ष", run: "रन", runs: "रन",
        student: "विद्यार्थी", students: "विद्यार्थी", employee: "कर्मचारी", employees: "कर्मचारी",
        person: "व्यक्ति", people: "लोग", inning: "पारी", innings: "पारियाँ",
        machine: "मशीन", machines: "मशीनें", parcel: "पार्सल", parcels: "पार्सल",
        shop: "दुकान", shops: "दुकानें", value: "मान", values: "मान",
        "operating day": "कार्य-दिवस", "operating days": "कार्य-दिवस",
      }
    : {
        unit: "ਇਕਾਈ", units: "ਇਕਾਈਆਂ", mark: "ਅੰਕ", marks: "ਅੰਕ",
        year: "ਸਾਲ", years: "ਸਾਲ", run: "ਦੌੜ", runs: "ਦੌੜਾਂ",
        student: "ਵਿਦਿਆਰਥੀ", students: "ਵਿਦਿਆਰਥੀ", employee: "ਕਰਮਚਾਰੀ", employees: "ਕਰਮਚਾਰੀ",
        person: "ਵਿਅਕਤੀ", people: "ਲੋਕ", inning: "ਪਾਰੀ", innings: "ਪਾਰੀਆਂ",
        machine: "ਮਸ਼ੀਨ", machines: "ਮਸ਼ੀਨਾਂ", parcel: "ਪਾਰਸਲ", parcels: "ਪਾਰਸਲ",
        shop: "ਦੁਕਾਨ", shops: "ਦੁਕਾਨਾਂ", value: "ਮੁੱਲ", values: "ਮੁੱਲ",
        "operating day": "ਕੰਮ ਦਾ ਦਿਨ", "operating days": "ਕੰਮ ਦੇ ਦਿਨ",
      };

  let revised = value;
  for (const [english, translated] of Object.entries(plural)) {
    revised = revised.replace(new RegExp(`\\b${english.replace(" ", "\\s+")}\\b`, "gi"), translated);
  }
  return revised
    .replace(/\b1 इकाइयाँ\b/g, "1 इकाई")
    .replace(/\b1 ਮਸ਼ੀਨਾਂ\b/g, "1 ਮਸ਼ੀਨ")
    .replace(/\b1 ਇਕਾਈਆਂ\b/g, "1 ਇਕਾਈ");
}

function sourceTags(pkg: Avg001QuestionPackage) {
  const traced = pkg.traceability.editorialV2OptionTags;
  if (Array.isArray(traced) && traced.length === 4) return traced.map(String);
  const strategies = [...getAvg001QuestionEntry(pkg.questionLanguageId).distractorStrategyIds];
  const result: string[] = [];
  let wrong = 0;
  for (let index = 0; index < 4; index += 1) {
    result.push(index === pkg.correctIndex ? "CORRECT" : strategies[wrong++] ?? "ARITHMETIC_SLIP");
  }
  return result;
}

function englishReason(tag: string) {
  const value = tag.toUpperCase();
  if (/ONE_FEWER|MINUS_ONE|OFF_BY_ONE_LOW/.test(value)) return "uses one fewer value than the question gives";
  if (/ONE_MORE|PLUS_ONE|OFF_BY_ONE_HIGH/.test(value)) return "uses one extra value";
  if (/OFF_BY_TWO_HIGH/.test(value)) return "uses two extra values";
  if (/DIVIDE_BY_ONE_FEWER/.test(value)) return "divides by one fewer value";
  if (/DIVIDE_BY_ONE_MORE/.test(value)) return "divides by one extra value";
  if (/UNWEIGHTED|SIMPLE_MEAN/.test(value)) return "takes a simple mean even though the groups are unequal";
  if (/OMIT_ONE_GROUP/.test(value)) return "leaves out one group";
  if (/SWAP_COUNT_AND_AVERAGE/.test(value)) return "interchanges the count and the average";
  if (/AVERAGE_CHANGE_NOT_SCALED/.test(value)) return "does not multiply the average change by the number of entries";
  if (/TOTAL_DIFFERENCE_NOT_DIVIDED/.test(value)) return "uses the total difference without dividing by the count";
  if (/IGNORE_CORRECTION|ALL_CORRECTIONS_IGNORED/.test(value)) return "ignores the correction";
  if (/SIGN_REVERSED|DIRECTION_REVERSED|CORRECTION_DIRECTION_NOT_REVERSED/.test(value)) return "uses the correction in the wrong direction";
  if (/APPLIED_TWICE|REVERSED_TWICE/.test(value)) return "applies the correction twice";
  if (/OLD_AVERAGE|FINAL_AVERAGE_REPORTED/.test(value)) return "repeats a given average instead of finding the requested value";
  if (/COUNT_DENOMINATOR/.test(value)) return "uses the wrong count in the denominator";
  if (/DOUBLE_ENDPOINT_MEAN/.test(value)) return "adds the end values but forgets to divide by two";
  if (/USE_LOWER_MIDDLE/.test(value)) return "uses only the lower middle value";
  if (/USE_UPPER_MIDDLE/.test(value)) return "uses only the upper middle value";
  if (/USE_PREVIOUS_TERM/.test(value)) return "stops one term too early";
  if (/USE_NEXT_TERM/.test(value)) return "moves one term too far";
  if (/USE_AVERAGE_AS_EXTREME/.test(value)) return "uses the average itself as the end value";
  if (/USE_OPPOSITE_EXTREME/.test(value)) return "moves to the wrong end of the sequence";
  if (/CORRECT_VALUE_REUSED/.test(value)) return "reuses the corrected entry instead of recovering the old entry";
  if (/WRONG_VALUE_REUSED/.test(value)) return "reuses the wrong entry instead of finding the corrected one";
  if (/ASSUME_MISSING_EQUALS_AVERAGE/.test(value)) return "assumes the missing value equals the average";
  if (/INVERSE_OPERATION/.test(value)) return "uses the opposite operation";
  return "contains an arithmetic slip";
}

function translatedReason(tag: string, language: Avg001Language) {
  const reason = englishReason(tag);
  if (language === "en") return reason;
  const hi: Record<string, string> = {
    "uses one fewer value than the question gives": "प्रश्न में दी संख्या से एक कम मान लेता है",
    "uses one extra value": "एक अतिरिक्त मान लेता है",
    "uses two extra values": "दो अतिरिक्त मान लेता है",
    "divides by one fewer value": "एक कम संख्या से भाग देता है",
    "divides by one extra value": "एक अधिक संख्या से भाग देता है",
    "takes a simple mean even though the groups are unequal": "असमान समूहों का साधारण औसत लेता है",
    "leaves out one group": "एक समूह छोड़ देता है",
    "interchanges the count and the average": "संख्या और औसत को आपस में बदल देता है",
    "does not multiply the average change by the number of entries": "औसत के बदलाव को कुल प्रविष्टियों से गुणा नहीं करता",
    "uses the total difference without dividing by the count": "कुल अंतर को संख्या से भाग दिए बिना उपयोग करता है",
    "ignores the correction": "सुधार को नज़रअंदाज़ करता है",
    "uses the correction in the wrong direction": "सुधार की दिशा उलटी लेता है",
    "applies the correction twice": "सुधार दो बार लगाता है",
    "repeats a given average instead of finding the requested value": "दिए औसत को ही उत्तर मान लेता है",
    "uses the wrong count in the denominator": "भाग में गलत संख्या उपयोग करता है",
    "adds the end values but forgets to divide by two": "दोनों सिरों को जोड़कर 2 से भाग देना भूल जाता है",
    "uses only the lower middle value": "केवल निचला मध्य मान लेता है",
    "uses only the upper middle value": "केवल ऊपरी मध्य मान लेता है",
    "stops one term too early": "एक पद पहले रुक जाता है",
    "moves one term too far": "एक पद आगे चला जाता है",
    "uses the average itself as the end value": "औसत को ही अंतिम मान मान लेता है",
    "moves to the wrong end of the sequence": "क्रम के गलत सिरे की ओर जाता है",
    "reuses the corrected entry instead of recovering the old entry": "पुरानी प्रविष्टि निकालने के बजाय सही प्रविष्टि दोहरा देता है",
    "reuses the wrong entry instead of finding the corrected one": "सही मान निकालने के बजाय गलत प्रविष्टि दोहरा देता है",
    "assumes the missing value equals the average": "लापता मान को औसत के बराबर मान लेता है",
    "uses the opposite operation": "उलटी गणितीय क्रिया करता है",
    "contains an arithmetic slip": "गणना में छोटी गलती करता है",
  };
  const pa: Record<string, string> = {
    "uses one fewer value than the question gives": "ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੀ ਗਿਣਤੀ ਨਾਲੋਂ ਇੱਕ ਮੁੱਲ ਘੱਟ ਲੈਂਦਾ ਹੈ",
    "uses one extra value": "ਇੱਕ ਵਾਧੂ ਮੁੱਲ ਲੈਂਦਾ ਹੈ",
    "uses two extra values": "ਦੋ ਵਾਧੂ ਮੁੱਲ ਲੈਂਦਾ ਹੈ",
    "divides by one fewer value": "ਇੱਕ ਘੱਟ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੰਦਾ ਹੈ",
    "divides by one extra value": "ਇੱਕ ਵੱਧ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੰਦਾ ਹੈ",
    "takes a simple mean even though the groups are unequal": "ਅਸਮਾਨ ਸਮੂਹਾਂ ਦੀ ਸਧਾਰਣ ਔਸਤ ਲੈਂਦਾ ਹੈ",
    "leaves out one group": "ਇੱਕ ਸਮੂਹ ਛੱਡ ਦਿੰਦਾ ਹੈ",
    "interchanges the count and the average": "ਗਿਣਤੀ ਅਤੇ ਔਸਤ ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲ ਦਿੰਦਾ ਹੈ",
    "does not multiply the average change by the number of entries": "ਔਸਤ ਦੇ ਬਦਲਾਅ ਨੂੰ ਕੁੱਲ ਐਂਟਰੀਆਂ ਨਾਲ ਗੁਣਾ ਨਹੀਂ ਕਰਦਾ",
    "uses the total difference without dividing by the count": "ਕੁੱਲ ਫਰਕ ਨੂੰ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੱਤੇ ਬਿਨਾਂ ਵਰਤਦਾ ਹੈ",
    "ignores the correction": "ਸੁਧਾਰ ਨੂੰ ਨਜ਼ਰਅੰਦਾਜ਼ ਕਰਦਾ ਹੈ",
    "uses the correction in the wrong direction": "ਸੁਧਾਰ ਦੀ ਦਿਸ਼ਾ ਉਲਟੀ ਲੈਂਦਾ ਹੈ",
    "applies the correction twice": "ਸੁਧਾਰ ਦੋ ਵਾਰ ਲਗਾਉਂਦਾ ਹੈ",
    "repeats a given average instead of finding the requested value": "ਦਿੱਤੀ ਔਸਤ ਨੂੰ ਹੀ ਜਵਾਬ ਮੰਨ ਲੈਂਦਾ ਹੈ",
    "uses the wrong count in the denominator": "ਭਾਗ ਵਿੱਚ ਗਲਤ ਗਿਣਤੀ ਵਰਤਦਾ ਹੈ",
    "adds the end values but forgets to divide by two": "ਦੋਵੇਂ ਸਿਰਿਆਂ ਨੂੰ ਜੋੜ ਕੇ 2 ਨਾਲ ਭਾਗ ਦੇਣਾ ਭੁੱਲ ਜਾਂਦਾ ਹੈ",
    "uses only the lower middle value": "ਸਿਰਫ਼ ਹੇਠਲਾ ਮੱਧਲਾ ਮੁੱਲ ਲੈਂਦਾ ਹੈ",
    "uses only the upper middle value": "ਸਿਰਫ਼ ਉੱਪਰਲਾ ਮੱਧਲਾ ਮੁੱਲ ਲੈਂਦਾ ਹੈ",
    "stops one term too early": "ਇੱਕ ਪਦ ਪਹਿਲਾਂ ਰੁਕ ਜਾਂਦਾ ਹੈ",
    "moves one term too far": "ਇੱਕ ਪਦ ਅੱਗੇ ਚਲਾ ਜਾਂਦਾ ਹੈ",
    "uses the average itself as the end value": "ਔਸਤ ਨੂੰ ਹੀ ਅੰਤਲਾ ਮੁੱਲ ਮੰਨ ਲੈਂਦਾ ਹੈ",
    "moves to the wrong end of the sequence": "ਕ੍ਰਮ ਦੇ ਗਲਤ ਸਿਰੇ ਵੱਲ ਜਾਂਦਾ ਹੈ",
    "reuses the corrected entry instead of recovering the old entry": "ਪੁਰਾਣੀ ਐਂਟਰੀ ਕੱਢਣ ਦੀ ਥਾਂ ਸਹੀ ਐਂਟਰੀ ਦੁਹਰਾਉਂਦਾ ਹੈ",
    "reuses the wrong entry instead of finding the corrected one": "ਸਹੀ ਮੁੱਲ ਕੱਢਣ ਦੀ ਥਾਂ ਗਲਤ ਐਂਟਰੀ ਦੁਹਰਾਉਂਦਾ ਹੈ",
    "assumes the missing value equals the average": "ਗੁੰਮ ਮੁੱਲ ਨੂੰ ਔਸਤ ਦੇ ਬਰਾਬਰ ਮੰਨ ਲੈਂਦਾ ਹੈ",
    "uses the opposite operation": "ਉਲਟੀ ਗਣਿਤੀ ਕਿਰਿਆ ਕਰਦਾ ਹੈ",
    "contains an arithmetic slip": "ਗਣਨਾ ਵਿੱਚ ਛੋਟੀ ਗਲਤੀ ਕਰਦਾ ਹੈ",
  };
  return language === "hi" ? (hi[reason] ?? hi["contains an arithmetic slip"]!) : (pa[reason] ?? pa["contains an arithmetic slip"]!);
}

function distractorLine(pkg: Avg001QuestionPackage) {
  const tags = sourceTags(pkg);
  const parts = pkg.options
    .map((option, index) => ({ option, index, tag: tags[index] ?? "ARITHMETIC_SLIP" }))
    .filter(({ index }) => index !== pkg.correctIndex)
    .map(({ option, index, tag }) => `${String.fromCharCode(65 + index)} (${option}) ${translatedReason(tag, pkg.language)}`);
  if (pkg.language === "en") return `⚠️ Why the other options are wrong: ${parts.join("; ")}. Therefore, the correct answer is ${pkg.answer}.`;
  if (pkg.language === "hi") return `दूसरे विकल्प क्यों गलत हैं: ${parts.join("; ")}। इसलिए सही उत्तर ${pkg.answer} है।`;
  return `ਬਾਕੀ ਵਿਕਲਪ ਕਿਉਂ ਗਲਤ ਹਨ: ${parts.join("; ")}। ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${pkg.answer} ਹੈ।`;
}

function conceptOverride(pkg: Avg001QuestionPackage) {
  if (pkg.language === "en") return pkg.explanation.lines[0]!;
  const isHindi = pkg.language === "hi";
  if (/Speed/i.test(pkg.solveMode)) {
    if (pkg.solveMode === "findAverageSpeedEqualTime") {
      return isHindi
        ? "मुख्य बात: दोनों गतियाँ समान समय तक चलती हैं, इसलिए उनका साधारण औसत लिया जा सकता है।"
        : "ਮੁੱਖ ਗੱਲ: ਦੋਵੇਂ ਗਤੀਆਂ ਬਰਾਬਰ ਸਮੇਂ ਲਈ ਰਹਿੰਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦੀ ਸਧਾਰਣ ਔਸਤ ਲਈ ਜਾ ਸਕਦੀ ਹੈ।";
    }
    return isHindi
      ? "मुख्य बात: हर हिस्से की दूरी और समय निकालकर कुल दूरी को कुल समय से भाग दें।"
      : "ਮੁੱਖ ਗੱਲ: ਹਰ ਹਿੱਸੇ ਦੀ ਦੂਰੀ ਅਤੇ ਸਮਾਂ ਕੱਢ ਕੇ ਕੁੱਲ ਦੂਰੀ ਨੂੰ ਕੁੱਲ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦਿਓ।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-004" || pkg.canonicalProblemId === "AVG-CP-006") {
    return isHindi
      ? "मुख्य बात: बड़े समूह का संयुक्त औसत पर अधिक असर पड़ता है, इसलिए पहले हर समूह का कुल निकालें।"
      : "ਮੁੱਖ ਗੱਲ: ਵੱਡੇ ਸਮੂਹ ਦਾ ਮਿਲੀ-ਜੁਲੀ ਔਸਤ ਉੱਤੇ ਵੱਧ ਅਸਰ ਪੈਂਦਾ ਹੈ, ਇਸ ਲਈ ਪਹਿਲਾਂ ਹਰ ਸਮੂਹ ਦਾ ਕੁੱਲ ਕੱਢੋ।";
  }
  return pkg.explanation.lines[0]!
    .replace(/पहली गणना का नियम है:\s*/g, "")
    .replace(/ਪਹਿਲੀ ਗਣਨਾ ਦਾ ਨਿਯਮ ਹੈ:\s*/g, "");
}

function preferredEquation(pkg: Avg001QuestionPackage) {
  const values = pkg.parameters.values;
  if (pkg.solveMode === "findExtremeFromAverageAndCount") {
    const count = values.count;
    const average = numberFrom(values.average);
    const difference = numberFrom(values.commonDifference);
    if (average !== undefined && difference !== undefined) {
      const steps = (count - 1) / 2;
      const sign = values.targetExtreme === "smallest" ? "-" : "+";
      return `$$\text{Steps on one side}=(${count}-1)\div2=${shown(steps)},\quad \text{Required term}=${shown(average)}${sign}${shown(steps)}\times${shown(difference)}=${pkg.answer}$$`;
    }
  }
  if (pkg.solveMode === "findInningsValueOrNewCricketAverage") {
    const count = values.inningsCount ?? values.oldCount ?? values.count;
    const oldAverage = numberFrom(values.currentAverage ?? values.oldAverage ?? values.average);
    const newAverage = numberFrom(values.newAverage);
    const nextScore = numberFrom(values.nextScore);
    if (pkg.parameters.answerType === "AVERAGE" && oldAverage !== undefined && nextScore !== undefined) {
      return `$$\text{Old total}=${shown(oldAverage)}\times${count},\quad \text{New average}=(${shown(oldAverage)}\times${count}+${shown(nextScore)})\div${count + 1}=${pkg.answer}$$`;
    }
    if (oldAverage !== undefined && newAverage !== undefined) {
      return `$$\text{Required score}=${shown(newAverage)}\times${count + 1}-${shown(oldAverage)}\times${count}=${pkg.answer}$$`;
    }
  }
  return undefined;
}

function replaceWorkedLine(pkg: Avg001QuestionPackage) {
  const preferred = preferredEquation(pkg);
  let line = pkg.explanation.lines[1]!;
  if (preferred) {
    const lead = pkg.language === "en"
      ? "Write the totals explicitly before simplifying."
      : pkg.language === "hi"
        ? "पहले आवश्यक कुल साफ लिखें, फिर मान रखें।"
        : "ਪਹਿਲਾਂ ਲੋੜੀਂਦਾ ਕੁੱਲ ਸਾਫ਼ ਲਿਖੋ, ਫਿਰ ਮੁੱਲ ਰੱਖੋ।";
    line = pkg.language === "en"
      ? `📝 Step-by-step solution: ${lead} ${preferred} Therefore, the required answer is ${pkg.answer}.`
      : pkg.language === "hi"
        ? `हल: ${lead} ${preferred} इसलिए सही उत्तर ${pkg.answer} है।`
        : `ਹੱਲ: ${lead} ${preferred} ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${pkg.answer} ਹੈ।`;
  } else if (pkg.language === "en" && /Speed/i.test(pkg.solveMode)) {
    const equations = [...line.matchAll(/\$\$([\s\S]*?)\$\$/g)].map((match) => `$$${match[1]!.trim()}$$`).join(" ");
    line = `📝 Step-by-step solution: Find the distance and time for each part, then divide total distance by total time. ${equations} Therefore, the required answer is ${pkg.answer}.`;
  }
  return line;
}

function shortcutOverride(pkg: Avg001QuestionPackage) {
  const line = pkg.explanation.lines[2]!;
  if (!/\$\$/.test(line)) return line;
  if (pkg.language === "en") return "⚡ Exam speed shortcut: Use the shortest total-average-count relation that matches the question.";
  if (pkg.canonicalProblemId === "AVG-CP-002") {
    return pkg.language === "hi"
      ? "तेज़ तरीका: औसत से एक ओर के पदों की संख्या निकालें और समान अंतर से आगे बढ़ें।"
      : "ਤੇਜ਼ ਤਰੀਕਾ: ਔਸਤ ਤੋਂ ਇੱਕ ਪਾਸੇ ਦੇ ਪਦਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ ਅਤੇ ਬਰਾਬਰ ਅੰਤਰ ਨਾਲ ਅੱਗੇ ਵਧੋ।";
  }
  return pkg.language === "hi"
    ? "तेज़ तरीका: प्रश्न के अनुसार कुल, औसत और संख्या का सबसे सीधा संबंध उपयोग करें।"
    : "ਤੇਜ਼ ਤਰੀਕਾ: ਸਵਾਲ ਅਨੁਸਾਰ ਕੁੱਲ, ਔਸਤ ਅਤੇ ਗਿਣਤੀ ਦਾ ਸਭ ਤੋਂ ਸਿੱਧਾ ਸੰਬੰਧ ਵਰਤੋ।";
}

function validation(pkg: Avg001QuestionPackage) {
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter((check) => check.name !== "avg001-natural-language-v3-polish");
  const text = [pkg.stem, ...pkg.options, ...pkg.explanation.lines].join("\n");
  checks.push({
    name: "avg001-natural-language-v3-polish",
    passed:
      pkg.explanation.lines.length === 4 &&
      pkg.explanation.lines[1]?.includes("$$") === true &&
      pkg.explanation.lines[3]?.includes(pkg.answer) === true &&
      !/\[[A-Z][A-Z0-9_]+\]/.test(text) &&
      (pkg.language === "en" || !/\b(?:units?|marks?|years?|runs?|operating days?)\b/i.test(text)),
    message: "Polished Average review removes internal tags, English-unit leakage and equation-only localized shortcuts",
  });
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001NaturalLanguageV3Polish(source: Avg001QuestionPackage): Avg001QuestionPackage {
  const base = applyAvg001NaturalLanguageV3Review(source);
  const localized = {
    ...base,
    stem: localizeDisplay(base.stem, base.language),
    options: base.options.map((option) => localizeDisplay(option, base.language)),
    answer: localizeDisplay(base.answer, base.language),
    solver: { ...base.solver, answer: localizeDisplay(base.solver.answer, base.language) },
    independentVerification: {
      ...base.independentVerification,
      displayAnswer: localizeDisplay(base.independentVerification.displayAnswer, base.language),
    },
  };
  const revised: Avg001QuestionPackage = {
    ...localized,
    explanation: {
      lines: [
        conceptOverride(localized),
        replaceWorkedLine(localized),
        shortcutOverride(localized),
        distractorLine(localized),
      ].map((line) => localizeDisplay(line, localized.language)),
    },
    traceability: {
      ...localized.traceability,
      naturalLanguageReviewCandidate: AVG_001_NATURAL_LANGUAGE_V3_REVIEW,
      naturalLanguageReviewPolish: AVG_001_NATURAL_LANGUAGE_V3_POLISH,
    },
  };
  return { ...revised, validation: validation(revised) };
}
