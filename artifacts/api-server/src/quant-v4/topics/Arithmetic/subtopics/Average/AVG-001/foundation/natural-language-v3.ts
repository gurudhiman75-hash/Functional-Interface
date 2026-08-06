import type {
  Avg001Language,
  Avg001QuestionPackage,
  Avg001ValidationCheck,
} from "./types";

export const AVG_001_NATURAL_LANGUAGE_V3_REVIEW =
  "AVG-001 natural teacher-language review candidate v3";

function stripHeader(line: string) {
  return line
    .replace(/^[📌📝⚡⚠️]\s*/, "")
    .replace(/^(?:Key rule|Step-by-step solution|Exam speed shortcut|Common traps and distractors|Why the other options are wrong):\s*/i, "")
    .replace(/^(?:मुख्य बात|मुख्य नियम|हल|तेज़ तरीका|दूसरे विकल्प क्यों गलत हैं):\s*/i, "")
    .replace(/^(?:ਮੁੱਖ ਗੱਲ|ਮੁੱਖ ਨਿਯਮ|ਹੱਲ|ਤੇਜ਼ ਤਰੀਕਾ|ਬਾਕੀ ਵਿਕਲਪ ਕਿਉਂ ਗਲਤ ਹਨ):\s*/i, "")
    .trim();
}

function cleanTemplateLanguage(text: string, language: Avg001Language) {
  let value = stripHeader(text)
    .replace(/^(?:Begin with this fact|Use this relation|The key idea is simple|Start from this relationship|The calculation rests on this|First note this|The decisive relation is|Work from this fact|Use this as the starting point)[:.]?\s*/i, "")
    .replace(/\bFor the total,\s*the total\b/gi, "The total")
    .replace(/\bThe total:\s*the total\b/gi, "The total")
    .replace(/\bTo get the average,\s*the average\b/gi, "The average")
    .replace(/\bUse this for the count:\s*the number\b/gi, "The number")
    .replace(/\bFor the missing value,\s*start here:\s*/gi, "");

  if (language === "hi") {
    value = value
      .replace(/^(?:इस तथ्य से शुरू करें|यह संबंध उपयोग करें|मुख्य विचार सरल है|इस संबंध से शुरुआत करें|गणना इस तथ्य पर टिकी है|आँकड़ों को इस नियम से जोड़ें|सीधा हल इस विचार से मिलता है|पहले यह ध्यान दें|यही नियम गणना चलाता है|इस तथ्य को ध्यान में रखें|दिए मानों पर यह सिद्धांत लगाएँ|संख्याएँ इस संबंध से जुड़ी हैं|साफ हल यहाँ से शुरू होता है|निर्णायक संबंध यह है|इस तथ्य के आधार पर चलें|गणना इस नियम का पालन करती है|गणना को इस तरह लिखें|इसे शुरुआती बिंदु बनाएँ|विधि इस तथ्य पर निर्भर है|उपयोगी निरीक्षण यह है|आँकड़ों को इस विचार के अनुसार रखें|सबसे सीधा सही तरीका है|गणना को नियंत्रित करने वाला तथ्य है|मुख्य गणितीय तथ्य है|पहला गणितीय संबंध है|प्रारंभ में ध्यान दें|गणना शुरू करते हुए)[:：]?\s*/i, "")
      .replace(/उप-कुल/g, "पहले से ज्ञात कुल")
      .replace(/भार दिया जाता है/g, "उतना ही असर पड़ता है")
      .replace(/भार दें/g, "उतना ही महत्त्व दें")
      .replace(/सममित/g, "बराबर दूरी पर")
      .replace(/फलतः/g, "इसलिए")
      .replace(/अतः हमें मिलता है कि/g, "इसलिए");
  }

  if (language === "pa") {
    value = value
      .replace(/^(?:ਇਸ ਤੱਥ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ|ਇਹ ਸੰਬੰਧ ਵਰਤੋ|ਮੁੱਖ ਵਿਚਾਰ ਸੌਖਾ ਹੈ|ਇਸ ਸੰਬੰਧ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ|ਗਣਨਾ ਇਸ ਤੱਥ ਉੱਤੇ ਟਿਕੀ ਹੈ|ਅੰਕੜਿਆਂ ਨੂੰ ਇਸ ਨਿਯਮ ਨਾਲ ਜੋੜੋ|ਸਿੱਧਾ ਹੱਲ ਇਸ ਵਿਚਾਰ ਨਾਲ ਮਿਲਦਾ ਹੈ|ਪਹਿਲਾਂ ਇਹ ਧਿਆਨ ਦਿਓ|ਇਹੀ ਨਿਯਮ ਗਣਨਾ ਚਲਾਉਂਦਾ ਹੈ|ਇਸ ਤੱਥ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖੋ|ਦਿੱਤੇ ਮੁੱਲਾਂ ਉੱਤੇ ਇਹ ਸਿਧਾਂਤ ਲਗਾਓ|ਸੰਖਿਆਵਾਂ ਇਸ ਸੰਬੰਧ ਨਾਲ ਜੁੜੀਆਂ ਹਨ|ਸਾਫ਼ ਹੱਲ ਇੱਥੋਂ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ|ਫੈਸਲਾਕੁਨ ਸੰਬੰਧ ਇਹ ਹੈ|ਇਸ ਤੱਥ ਦੇ ਆਧਾਰ ਉੱਤੇ ਚਲੋ|ਗਣਨਾ ਇਸ ਨਿਯਮ ਦੀ ਪਾਲਣਾ ਕਰਦੀ ਹੈ|ਗਣਨਾ ਨੂੰ ਇਸ ਤਰ੍ਹਾਂ ਲਿਖੋ|ਇਸ ਨੂੰ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਬਣਾਓ|ਵਿਧੀ ਇਸ ਤੱਥ ਉੱਤੇ ਨਿਰਭਰ ਹੈ|ਲਾਭਦਾਇਕ ਨਿਰੀਖਣ ਇਹ ਹੈ|ਅੰਕੜਿਆਂ ਨੂੰ ਇਸ ਵਿਚਾਰ ਅਨੁਸਾਰ ਰੱਖੋ|ਸਭ ਤੋਂ ਸਿੱਧਾ ਸਹੀ ਤਰੀਕਾ ਹੈ|ਗਣਨਾ ਨੂੰ ਚਲਾਉਣ ਵਾਲਾ ਤੱਥ ਹੈ|ਮੁੱਖ ਗਣਿਤਕ ਤੱਥ ਹੈ|ਪਹਿਲਾ ਗਣਿਤਕ ਸੰਬੰਧ ਹੈ|ਸ਼ੁਰੂ ਵਿੱਚ ਧਿਆਨ ਦਿਓ|ਗਣਨਾ ਸ਼ੁਰੂ ਕਰਦੇ ਹੋਏ)[:：]?\s*/i, "")
      .replace(/ਉਪ-ਕੁੱਲ/g, "ਪਹਿਲਾਂ ਤੋਂ ਜਾਣਿਆ ਕੁੱਲ")
      .replace(/ਭਾਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ/g, "ਉੱਨਾ ਹੀ ਅਸਰ ਪੈਂਦਾ ਹੈ")
      .replace(/ਭਾਰ ਦਿਓ/g, "ਉੱਨਾ ਹੀ ਮਹੱਤਵ ਦਿਓ")
      .replace(/ਸਮਮਿਤ/g, "ਬਰਾਬਰ ਦੂਰੀ ਉੱਤੇ")
      .replace(/ਫਲਸਰੂਪ/g, "ਇਸ ਲਈ")
      .replace(/ਇਸ ਲਈ ਸਾਨੂੰ ਮਿਲਦਾ ਹੈ ਕਿ/g, "ਇਸ ਲਈ");
  }

  return value.trim();
}

function conceptEnglish(pkg: Avg001QuestionPackage) {
  const mode = pkg.solveMode;
  if (mode === "findSumFromAverageAndCount") return "To find the total, multiply the average by the number of values.";
  if (mode === "findAverageFromSumAndCount") return "To find the average, divide the total by the number of values.";
  if (mode === "findCountFromSumAndAverage") return "To find the count, divide the total by the average.";
  if (mode === "findMissingValueFromAverage") return "Find the total required by the average, then subtract the known total.";
  if (mode === "findAverageAfterUniformTransformation") return "The same change made to every value changes the average by that amount.";
  if (pkg.canonicalProblemId === "AVG-CP-002") return "Equally spaced values lie at equal distances on both sides of their average.";
  if (mode === "findInningsValueOrNewCricketAverage") return "Use total runs and the updated innings count, not the two averages alone.";
  if (pkg.canonicalProblemId === "AVG-CP-003") return "Convert the old average into a total before adding, removing or replacing a value.";
  if (/Speed/i.test(mode)) return "Average speed is total distance divided by total time.";
  if (pkg.canonicalProblemId === "AVG-CP-004") return "Convert every group average into a group total before combining the groups.";
  if (pkg.canonicalProblemId === "AVG-CP-005") return "Correct the recorded total first, then calculate the required average or entry.";
  return "Build the total for each lower-level group before finding the overall result.";
}

function conceptLine(pkg: Avg001QuestionPackage) {
  if (pkg.language === "en") return `📌 Key rule: ${conceptEnglish(pkg)}`;
  const cleaned = cleanTemplateLanguage(pkg.explanation.lines[0] ?? "", pkg.language);
  const fallback = pkg.language === "hi"
    ? "औसत, कुल और संख्या के संबंध को प्रश्न के अनुसार उपयोग करें।"
    : "ਔਸਤ, ਕੁੱਲ ਅਤੇ ਗਿਣਤੀ ਦੇ ਸੰਬੰਧ ਨੂੰ ਸਵਾਲ ਅਨੁਸਾਰ ਵਰਤੋ।";
  return pkg.language === "hi"
    ? `मुख्य बात: ${cleaned || fallback}`
    : `ਮੁੱਖ ਗੱਲ: ${cleaned || fallback}`;
}

function equations(pkg: Avg001QuestionPackage) {
  const source = pkg.language === "en"
    ? [pkg.explanation.lines[1] ?? ""]
    : pkg.explanation.lines;
  const found = source.flatMap((line) =>
    [...line.matchAll(/\$\$([\s\S]*?)\$\$/g)].map((match) => `$$${match[1]!.trim()}$$`),
  );
  if (!found.length && pkg.solver.equation.trim()) {
    found.push(pkg.solver.equation.includes("$$")
      ? pkg.solver.equation.trim()
      : `$$${pkg.solver.equation.trim()}$$`);
  }
  return [...new Set(found)].join(" ");
}

function workLead(pkg: Avg001QuestionPackage) {
  if (pkg.language === "hi") {
    if (/Speed/i.test(pkg.solveMode)) return "पहले हर हिस्से की दूरी और समय निकालें, फिर पूरी यात्रा के कुल मानों का उपयोग करें।";
    if (pkg.canonicalProblemId === "AVG-CP-004" || pkg.canonicalProblemId === "AVG-CP-006") return "पहले हर समूह का कुल निकालें, फिर सभी कुल और संख्याएँ जोड़ें।";
    if (pkg.canonicalProblemId === "AVG-CP-005") return "औसत में हुए बदलाव को कुल बदलाव में बदलें और दर्ज मान को सही करें।";
    if (pkg.canonicalProblemId === "AVG-CP-003") return "पुराने औसत से पुराना कुल निकालें, फिर जोड़ने, घटाने या बदलने का असर लगाएँ।";
    return "दिए गए मान रखें और गणना को साफ चरणों में पूरा करें।";
  }
  if (pkg.language === "pa") {
    if (/Speed/i.test(pkg.solveMode)) return "ਪਹਿਲਾਂ ਹਰ ਹਿੱਸੇ ਦੀ ਦੂਰੀ ਅਤੇ ਸਮਾਂ ਕੱਢੋ, ਫਿਰ ਪੂਰੀ ਯਾਤਰਾ ਦੇ ਕੁੱਲ ਮੁੱਲ ਵਰਤੋ।";
    if (pkg.canonicalProblemId === "AVG-CP-004" || pkg.canonicalProblemId === "AVG-CP-006") return "ਪਹਿਲਾਂ ਹਰ ਸਮੂਹ ਦਾ ਕੁੱਲ ਕੱਢੋ, ਫਿਰ ਸਾਰੇ ਕੁੱਲ ਅਤੇ ਗਿਣਤੀਆਂ ਜੋੜੋ।";
    if (pkg.canonicalProblemId === "AVG-CP-005") return "ਔਸਤ ਵਿੱਚ ਆਏ ਬਦਲਾਅ ਨੂੰ ਕੁੱਲ ਬਦਲਾਅ ਵਿੱਚ ਬਦਲੋ ਅਤੇ ਦਰਜ ਮੁੱਲ ਠੀਕ ਕਰੋ।";
    if (pkg.canonicalProblemId === "AVG-CP-003") return "ਪੁਰਾਣੀ ਔਸਤ ਤੋਂ ਪੁਰਾਣਾ ਕੁੱਲ ਕੱਢੋ, ਫਿਰ ਜੋੜਨ, ਘਟਾਉਣ ਜਾਂ ਬਦਲਣ ਦਾ ਅਸਰ ਲਗਾਓ।";
    return "ਦਿੱਤੇ ਮੁੱਲ ਰੱਖੋ ਅਤੇ ਗਣਨਾ ਸਾਫ਼ ਕਦਮਾਂ ਵਿੱਚ ਪੂਰੀ ਕਰੋ।";
  }
  if (pkg.canonicalProblemId === "AVG-CP-004" || pkg.canonicalProblemId === "AVG-CP-006") return "Calculate the separate totals first, then combine them with the correct counts.";
  if (pkg.canonicalProblemId === "AVG-CP-005") return "Convert the average change into a total change and apply it in the correct direction.";
  if (pkg.canonicalProblemId === "AVG-CP-003") return "Write the old total first, then show how the incoming, outgoing or replacement value changes it.";
  return "Substitute the given values and simplify the calculation one step at a time.";
}

function workedLine(pkg: Avg001QuestionPackage) {
  const line = `${workLead(pkg)} ${equations(pkg)}`.trim();
  if (pkg.language === "en") return `📝 Step-by-step solution: ${line} Therefore, the required answer is ${pkg.answer}.`;
  if (pkg.language === "hi") return `हल: ${line} इसलिए सही उत्तर ${pkg.answer} है।`;
  return `ਹੱਲ: ${line} ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${pkg.answer} ਹੈ।`;
}

function shortcutSource(pkg: Avg001QuestionPackage) {
  if (pkg.language === "en") return pkg.explanation.lines[2] ?? pkg.explanation.lines[1] ?? "";
  const finalLine = pkg.explanation.lines[3] ?? "";
  const match = pkg.language === "hi"
    ? finalLine.match(/परीक्षा शॉर्टकट:\s*([^।]+(?:।|$))/)
    : finalLine.match(/ਇਮਤਿਹਾਨੀ ਛੋਟਾ ਤਰੀਕਾ:\s*([^।]+(?:।|$))/);
  return match?.[1] ?? pkg.explanation.lines[1] ?? "";
}

function shortcutLine(pkg: Avg001QuestionPackage) {
  const cleaned = cleanTemplateLanguage(shortcutSource(pkg), pkg.language);
  const fallback = pkg.language === "en"
    ? "Use the shortest total-average-count relation that matches the question."
    : pkg.language === "hi"
      ? "प्रश्न के अनुसार कुल, औसत और संख्या का सबसे सीधा संबंध उपयोग करें।"
      : "ਸਵਾਲ ਅਨੁਸਾਰ ਕੁੱਲ, ਔਸਤ ਅਤੇ ਗਿਣਤੀ ਦਾ ਸਭ ਤੋਂ ਸਿੱਧਾ ਸੰਬੰਧ ਵਰਤੋ।";
  if (pkg.language === "en") return `⚡ Exam speed shortcut: ${cleaned || fallback}`;
  if (pkg.language === "hi") return `तेज़ तरीका: ${cleaned || fallback}`;
  return `ਤੇਜ਼ ਤਰੀਕਾ: ${cleaned || fallback}`;
}

function tags(pkg: Avg001QuestionPackage) {
  const traced = pkg.traceability.editorialV2OptionTags;
  if (Array.isArray(traced) && traced.length === 4) return traced.map(String);
  const found = [...pkg.explanation.lines.join("\n").matchAll(/\[([A-Z][A-Z0-9_]+)\]/g)]
    .map((match) => match[1]!);
  const result: string[] = [];
  let wrong = 0;
  for (let index = 0; index < 4; index += 1) {
    result.push(index === pkg.correctIndex ? "CORRECT" : found[wrong++] ?? "ARITHMETIC_SLIP");
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
  if (/DOUBLE_COUNT/.test(value)) return "counts the group twice";
  if (/HALF_COUNT/.test(value)) return "uses only half of the required count";
  if (/ONE_THIRD_COUNT/.test(value)) return "uses only one-third of the required count";
  if (/UNWEIGHTED|SIMPLE_MEAN/.test(value)) return "takes a simple mean even though the groups are not equally sized";
  if (/OMIT_ONE_GROUP/.test(value)) return "leaves out one group";
  if (/SWAP_COUNT_AND_AVERAGE/.test(value)) return "interchanges the count and the average";
  if (/AVERAGE_CHANGE_NOT_SCALED/.test(value)) return "does not multiply the average change by the number of entries";
  if (/TOTAL_DIFFERENCE_NOT_DIVIDED/.test(value)) return "uses the total difference without dividing by the count";
  if (/IGNORE_CORRECTION|ALL_CORRECTIONS_IGNORED/.test(value)) return "ignores the correction";
  if (/SIGN_REVERSED|DIRECTION_REVERSED|CORRECTION_DIRECTION_NOT_REVERSED/.test(value)) return "uses the correction in the wrong direction";
  if (/APPLIED_TWICE|REVERSED_TWICE/.test(value)) return "applies the correction twice";
  if (/OLD_AVERAGE|FINAL_AVERAGE_REPORTED/.test(value)) return "repeats a given average instead of finding the requested value";
  if (/COUNT_DENOMINATOR/.test(value)) return "uses the wrong count in the denominator";
  if (/USE_LOWER_MIDDLE/.test(value)) return "uses only the lower middle value";
  if (/USE_UPPER_MIDDLE/.test(value)) return "uses only the upper middle value";
  if (/DOUBLE_ENDPOINT_MEAN/.test(value)) return "adds the end values but forgets to divide by two";
  if (/USE_PREVIOUS_TERM/.test(value)) return "stops one term too early";
  if (/USE_NEXT_TERM/.test(value)) return "moves one term too far";
  if (/USE_ENDPOINT/.test(value)) return "uses an end value instead of the average";
  if (/USE_AVERAGE_AS_EXTREME/.test(value)) return "uses the average itself as the end value";
  if (/USE_OPPOSITE_EXTREME/.test(value)) return "moves to the wrong end of the sequence";
  if (/CORRECT_VALUE_REUSED/.test(value)) return "reuses the corrected entry instead of recovering the old entry";
  if (/WRONG_VALUE_REUSED/.test(value)) return "reuses the wrong entry instead of finding the corrected one";
  if (/ASSUME_MISSING_EQUALS_AVERAGE/.test(value)) return "assumes the missing value is equal to the average";
  if (/INVERSE_OPERATION/.test(value)) return "uses the opposite operation";
  return "comes from a small arithmetic slip";
}

function reason(tag: string, language: Avg001Language) {
  const english = englishReason(tag);
  if (language === "en") return english;
  const hindi: Record<string, string> = {
    "uses one fewer value than the question gives": "प्रश्न में दी संख्या से एक कम मान लेता है",
    "uses one extra value": "एक अतिरिक्त मान लेता है",
    "uses two extra values": "दो अतिरिक्त मान लेता है",
    "divides by one fewer value": "एक कम संख्या से भाग देता है",
    "divides by one extra value": "एक अधिक संख्या से भाग देता है",
    "counts the group twice": "समूह को दो बार गिनता है",
    "uses only half of the required count": "आवश्यक संख्या का केवल आधा लेता है",
    "uses only one-third of the required count": "आवश्यक संख्या का केवल एक-तिहाई लेता है",
    "takes a simple mean even though the groups are not equally sized": "असमान समूहों का साधारण औसत लेता है",
    "leaves out one group": "एक समूह छोड़ देता है",
    "interchanges the count and the average": "संख्या और औसत को आपस में बदल देता है",
    "does not multiply the average change by the number of entries": "औसत के बदलाव को कुल प्रविष्टियों से गुणा नहीं करता",
    "uses the total difference without dividing by the count": "कुल अंतर को संख्या से भाग दिए बिना उपयोग करता है",
    "ignores the correction": "सुधार को नज़रअंदाज़ करता है",
    "uses the correction in the wrong direction": "सुधार की दिशा उलटी लेता है",
    "applies the correction twice": "सुधार दो बार लगाता है",
    "repeats a given average instead of finding the requested value": "दिए औसत को ही उत्तर मान लेता है",
    "uses the wrong count in the denominator": "भाग में गलत संख्या उपयोग करता है",
    "uses only the lower middle value": "केवल निचला मध्य मान लेता है",
    "uses only the upper middle value": "केवल ऊपरी मध्य मान लेता है",
    "adds the end values but forgets to divide by two": "दोनों सिरों को जोड़कर 2 से भाग देना भूल जाता है",
    "stops one term too early": "एक पद पहले रुक जाता है",
    "moves one term too far": "एक पद आगे चला जाता है",
    "uses an end value instead of the average": "औसत की जगह एक सिरा लेता है",
    "uses the average itself as the end value": "औसत को ही अंतिम मान मान लेता है",
    "moves to the wrong end of the sequence": "क्रम के गलत सिरे की ओर जाता है",
    "reuses the corrected entry instead of recovering the old entry": "पुरानी प्रविष्टि निकालने के बजाय सही प्रविष्टि दोहरा देता है",
    "reuses the wrong entry instead of finding the corrected one": "सही मान निकालने के बजाय गलत प्रविष्टि दोहरा देता है",
    "assumes the missing value is equal to the average": "लापता मान को औसत के बराबर मान लेता है",
    "uses the opposite operation": "उलटी गणितीय क्रिया करता है",
    "comes from a small arithmetic slip": "छोटी गणना-गलती से मिलता है",
  };
  const punjabi: Record<string, string> = {
    "uses one fewer value than the question gives": "ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੀ ਗਿਣਤੀ ਨਾਲੋਂ ਇੱਕ ਮੁੱਲ ਘੱਟ ਲੈਂਦਾ ਹੈ",
    "uses one extra value": "ਇੱਕ ਵਾਧੂ ਮੁੱਲ ਲੈਂਦਾ ਹੈ",
    "uses two extra values": "ਦੋ ਵਾਧੂ ਮੁੱਲ ਲੈਂਦਾ ਹੈ",
    "divides by one fewer value": "ਇੱਕ ਘੱਟ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੰਦਾ ਹੈ",
    "divides by one extra value": "ਇੱਕ ਵੱਧ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੰਦਾ ਹੈ",
    "counts the group twice": "ਸਮੂਹ ਨੂੰ ਦੋ ਵਾਰ ਗਿਣਦਾ ਹੈ",
    "uses only half of the required count": "ਲੋੜੀਂਦੀ ਗਿਣਤੀ ਦਾ ਸਿਰਫ਼ ਅੱਧਾ ਲੈਂਦਾ ਹੈ",
    "uses only one-third of the required count": "ਲੋੜੀਂਦੀ ਗਿਣਤੀ ਦਾ ਸਿਰਫ਼ ਇੱਕ-ਤਿਹਾਈ ਲੈਂਦਾ ਹੈ",
    "takes a simple mean even though the groups are not equally sized": "ਅਸਮਾਨ ਸਮੂਹਾਂ ਦੀ ਸਧਾਰਣ ਔਸਤ ਲੈਂਦਾ ਹੈ",
    "leaves out one group": "ਇੱਕ ਸਮੂਹ ਛੱਡ ਦਿੰਦਾ ਹੈ",
    "interchanges the count and the average": "ਗਿਣਤੀ ਅਤੇ ਔਸਤ ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲ ਦਿੰਦਾ ਹੈ",
    "does not multiply the average change by the number of entries": "ਔਸਤ ਦੇ ਬਦਲਾਅ ਨੂੰ ਕੁੱਲ ਐਂਟਰੀਆਂ ਨਾਲ ਗੁਣਾ ਨਹੀਂ ਕਰਦਾ",
    "uses the total difference without dividing by the count": "ਕੁੱਲ ਫਰਕ ਨੂੰ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੱਤੇ ਬਿਨਾਂ ਵਰਤਦਾ ਹੈ",
    "ignores the correction": "ਸੁਧਾਰ ਨੂੰ ਨਜ਼ਰਅੰਦਾਜ਼ ਕਰਦਾ ਹੈ",
    "uses the correction in the wrong direction": "ਸੁਧਾਰ ਦੀ ਦਿਸ਼ਾ ਉਲਟੀ ਲੈਂਦਾ ਹੈ",
    "applies the correction twice": "ਸੁਧਾਰ ਦੋ ਵਾਰ ਲਗਾਉਂਦਾ ਹੈ",
    "repeats a given average instead of finding the requested value": "ਦਿੱਤੀ ਔਸਤ ਨੂੰ ਹੀ ਜਵਾਬ ਮੰਨ ਲੈਂਦਾ ਹੈ",
    "uses the wrong count in the denominator": "ਭਾਗ ਵਿੱਚ ਗਲਤ ਗਿਣਤੀ ਵਰਤਦਾ ਹੈ",
    "uses only the lower middle value": "ਸਿਰਫ਼ ਹੇਠਲਾ ਮੱਧਲਾ ਮੁੱਲ ਲੈਂਦਾ ਹੈ",
    "uses only the upper middle value": "ਸਿਰਫ਼ ਉੱਪਰਲਾ ਮੱਧਲਾ ਮੁੱਲ ਲੈਂਦਾ ਹੈ",
    "adds the end values but forgets to divide by two": "ਦੋਵੇਂ ਸਿਰਿਆਂ ਨੂੰ ਜੋੜ ਕੇ 2 ਨਾਲ ਭਾਗ ਦੇਣਾ ਭੁੱਲ ਜਾਂਦਾ ਹੈ",
    "stops one term too early": "ਇੱਕ ਪਦ ਪਹਿਲਾਂ ਰੁਕ ਜਾਂਦਾ ਹੈ",
    "moves one term too far": "ਇੱਕ ਪਦ ਅੱਗੇ ਚਲਾ ਜਾਂਦਾ ਹੈ",
    "uses an end value instead of the average": "ਔਸਤ ਦੀ ਥਾਂ ਇੱਕ ਸਿਰਾ ਲੈਂਦਾ ਹੈ",
    "uses the average itself as the end value": "ਔਸਤ ਨੂੰ ਹੀ ਅੰਤਲਾ ਮੁੱਲ ਮੰਨ ਲੈਂਦਾ ਹੈ",
    "moves to the wrong end of the sequence": "ਕ੍ਰਮ ਦੇ ਗਲਤ ਸਿਰੇ ਵੱਲ ਜਾਂਦਾ ਹੈ",
    "reuses the corrected entry instead of recovering the old entry": "ਪੁਰਾਣੀ ਐਂਟਰੀ ਕੱਢਣ ਦੀ ਥਾਂ ਸਹੀ ਐਂਟਰੀ ਦੁਹਰਾਉਂਦਾ ਹੈ",
    "reuses the wrong entry instead of finding the corrected one": "ਸਹੀ ਮੁੱਲ ਕੱਢਣ ਦੀ ਥਾਂ ਗਲਤ ਐਂਟਰੀ ਦੁਹਰਾਉਂਦਾ ਹੈ",
    "assumes the missing value is equal to the average": "ਗੁੰਮ ਮੁੱਲ ਨੂੰ ਔਸਤ ਦੇ ਬਰਾਬਰ ਮੰਨ ਲੈਂਦਾ ਹੈ",
    "uses the opposite operation": "ਉਲਟੀ ਗਣਿਤੀ ਕਿਰਿਆ ਕਰਦਾ ਹੈ",
    "comes from a small arithmetic slip": "ਛੋਟੀ ਗਣਨਾ-ਗਲਤੀ ਨਾਲ ਮਿਲਦਾ ਹੈ",
  };
  return language === "hi" ? (hindi[english] ?? hindi["comes from a small arithmetic slip"]!) : (punjabi[english] ?? punjabi["comes from a small arithmetic slip"]!);
}

function distractorLine(pkg: Avg001QuestionPackage) {
  const optionTags = tags(pkg);
  const parts = pkg.options
    .map((option, index) => ({ option, index, tag: optionTags[index] ?? "ARITHMETIC_SLIP" }))
    .filter(({ index }) => index !== pkg.correctIndex)
    .map(({ option, index, tag }) => `${String.fromCharCode(65 + index)} (${option}) ${reason(tag, pkg.language)}`);
  if (pkg.language === "en") return `⚠️ Why the other options are wrong: ${parts.join("; ")}. Therefore, the correct answer is ${pkg.answer}.`;
  if (pkg.language === "hi") return `दूसरे विकल्प क्यों गलत हैं: ${parts.join("; ")}। इसलिए सही उत्तर ${pkg.answer} है।`;
  return `ਬਾਕੀ ਵਿਕਲਪ ਕਿਉਂ ਗਲਤ ਹਨ: ${parts.join("; ")}। ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${pkg.answer} ਹੈ।`;
}

function repairDisplay(source: Avg001QuestionPackage) {
  let stem = source.stem.replace(/\bA inspection\b/g, "An inspection").replace(/\bA average\b/g, "An average");
  let options = [...source.options];
  let answer = source.answer;
  let solverAnswer = source.solver.answer;
  let verificationAnswer = source.independentVerification.displayAnswer;

  if (source.language === "en" && source.solveMode === "findInningsValueOrNewCricketAverage") {
    const runs = (value: string) => value.replace(/\bmark\b/g, "run").replace(/\bmarks\b/g, "runs");
    stem = runs(stem);
    options = options.map(runs);
    answer = runs(answer);
    solverAnswer = runs(solverAnswer);
    verificationAnswer = runs(verificationAnswer);
  }

  if (source.language === "hi") {
    const singular = (value: string) => value.replace(/\b1 इकाइयाँ\b/g, "1 इकाई").replace(/\b1 वस्तुएँ\b/g, "1 वस्तु");
    stem = singular(stem);
    options = options.map(singular);
    answer = singular(answer);
    solverAnswer = singular(solverAnswer);
    verificationAnswer = singular(verificationAnswer);
  }

  if (source.language === "pa") {
    const singular = (value: string) => value.replace(/\b1 ਇਕਾਈਆਂ\b/g, "1 ਇਕਾਈ").replace(/\b1 ਵਸਤਾਂ\b/g, "1 ਵਸਤੂ");
    stem = singular(stem);
    options = options.map(singular);
    answer = singular(answer);
    solverAnswer = singular(solverAnswer);
    verificationAnswer = singular(verificationAnswer);
  }

  return {
    ...source,
    stem,
    options,
    answer,
    solver: { ...source.solver, answer: solverAnswer },
    independentVerification: { ...source.independentVerification, displayAnswer: verificationAnswer },
  };
}

function validateNaturalLanguage(pkg: Avg001QuestionPackage) {
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter((check) => check.name !== "avg001-natural-language-v3-review");
  const learnerText = [pkg.stem, ...pkg.options, ...pkg.explanation.lines].join("\n");
  checks.push({
    name: "avg001-natural-language-v3-review",
    passed:
      pkg.explanation.lines.length === 4 &&
      pkg.explanation.lines[1]?.includes("$$") === true &&
      pkg.explanation.lines[3]?.includes(pkg.answer) === true &&
      !/\[[A-Z][A-Z0-9_]+\]/.test(learnerText) &&
      !/\b(?:Begin with this fact|Start from this relationship|The decisive relation is|For the total, the total|To get the average, the average|A inspection)\b/i.test(learnerText) &&
      !/(?:मुख्य गणितीय तथ्य है|पहला गणितीय संबंध है|प्रारंभ में ध्यान दें|गणना शुरू करते हुए|ਮੁੱਖ ਗਣਿਤਕ ਤੱਥ ਹੈ|ਪਹਿਲਾ ਗਣਿਤਕ ਸੰਬੰਧ ਹੈ|ਸ਼ੁਰੂ ਵਿੱਚ ਧਿਆਨ ਦਿਓ|ਗਣਨਾ ਸ਼ੁਰੂ ਕਰਦੇ ਹੋਏ)/.test(learnerText),
    message: "Average review candidate uses natural learner language, demonstrated calculations and plain-language distractor explanations",
  });
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001NaturalLanguageV3Review(source: Avg001QuestionPackage): Avg001QuestionPackage {
  const pkg = repairDisplay(source);
  const revised: Avg001QuestionPackage = {
    ...pkg,
    explanation: {
      lines: [conceptLine(pkg), workedLine(pkg), shortcutLine(pkg), distractorLine(pkg)],
    },
    maturity: "MANUAL_REVIEW",
    publiclyPublishable: false,
    traceability: {
      ...pkg.traceability,
      naturalLanguageReviewCandidate: AVG_001_NATURAL_LANGUAGE_V3_REVIEW,
      sourceReleaseId: pkg.traceability.releaseId,
      editorialStatus: "PENDING_PRODUCT_REVIEW",
      publiclyPublishable: false,
    },
  };
  return { ...revised, validation: validateNaturalLanguage(revised) };
}
