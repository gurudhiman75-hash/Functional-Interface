import type { Avg001Language, Avg001QuestionPackage, Rational } from "./types";

type Reason =
  | "one-fewer" | "one-more" | "add-not-multiply" | "wrong-division" | "missing-equals-average"
  | "too-low" | "too-high" | "old-average" | "individual-value" | "average-change-only"
  | "wrong-total-count" | "simple-mean" | "subgroup-average" | "omit-group" | "weighted-arithmetic"
  | "known-count" | "combined-average" | "known-average" | "ratio-reversed" | "ratio-arithmetic";

const REASON_TEXT: Record<Avg001Language, Record<Reason, string>> = {
  en: {
    "one-fewer": "uses one fewer value than the question gives",
    "one-more": "uses one extra value",
    "add-not-multiply": "adds the average and count instead of multiplying them",
    "wrong-division": "uses the wrong total or group size in the division",
    "missing-equals-average": "assumes the missing value is equal to the average",
    "too-low": "makes an arithmetic error that gives a result below the correct value",
    "too-high": "makes an arithmetic error that gives a result above the correct value",
    "old-average": "repeats the old average instead of calculating the requested value",
    "individual-value": "uses one individual value as the answer instead of rebuilding the total",
    "average-change-only": "uses only the change in average and ignores the group size",
    "wrong-total-count": "forms the new total or the new group size incorrectly",
    "simple-mean": "takes a simple mean even though the groups are not equally sized",
    "subgroup-average": "reuses one subgroup average instead of finding the combined result",
    "omit-group": "leaves out one group while forming the combined total",
    "weighted-arithmetic": "makes an arithmetic error while combining group totals and counts",
    "known-count": "reuses the known group count instead of finding the missing count",
    "combined-average": "reuses the combined average instead of finding the missing group average",
    "known-average": "reuses the known group average instead of finding the other group average",
    "ratio-reversed": "writes the required group ratio in reverse order",
    "ratio-arithmetic": "uses the wrong pair of distances from the combined average",
  },
  hi: {
    "one-fewer": "प्रश्न में दी संख्या से एक मान कम लेता है",
    "one-more": "एक अतिरिक्त मान लेता है",
    "add-not-multiply": "औसत और संख्या का गुणा करने के बजाय उन्हें जोड़ देता है",
    "wrong-division": "भाग में गलत कुल या गलत समूह-संख्या उपयोग करता है",
    "missing-equals-average": "लापता मान को औसत के बराबर मान लेता है",
    "too-low": "गणना की गलती से उत्तर सही मान से छोटा हो जाता है",
    "too-high": "गणना की गलती से उत्तर सही मान से बड़ा हो जाता है",
    "old-average": "आवश्यक मान निकालने के बजाय पुराना औसत दोहरा देता है",
    "individual-value": "कुल दोबारा बनाने के बजाय एक अकेली प्रविष्टि को उत्तर मान लेता है",
    "average-change-only": "केवल औसत का बदलाव लेता है और समूह-संख्या भूल जाता है",
    "wrong-total-count": "नया कुल या नई समूह-संख्या गलत बनाता है",
    "simple-mean": "असमान समूहों का साधारण औसत लेता है",
    "subgroup-average": "संयुक्त परिणाम की जगह एक उपसमूह का औसत दोहरा देता है",
    "omit-group": "संयुक्त कुल बनाते समय एक समूह छोड़ देता है",
    "weighted-arithmetic": "समूह-कुल और संख्याएँ जोड़ते समय गणना गलत करता है",
    "known-count": "लापता संख्या निकालने के बजाय ज्ञात समूह-संख्या दोहरा देता है",
    "combined-average": "लापता समूह का औसत निकालने के बजाय संयुक्त औसत दोहरा देता है",
    "known-average": "दूसरे समूह का औसत निकालने के बजाय ज्ञात औसत दोहरा देता है",
    "ratio-reversed": "आवश्यक समूह-अनुपात उलटे क्रम में लिखता है",
    "ratio-arithmetic": "संयुक्त औसत से गलत दूरियाँ लेकर अनुपात बनाता है",
  },
  pa: {
    "one-fewer": "ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੀ ਗਿਣਤੀ ਨਾਲੋਂ ਇੱਕ ਮੁੱਲ ਘੱਟ ਲੈਂਦਾ ਹੈ",
    "one-more": "ਇੱਕ ਵਾਧੂ ਮੁੱਲ ਲੈਂਦਾ ਹੈ",
    "add-not-multiply": "ਔਸਤ ਅਤੇ ਗਿਣਤੀ ਦਾ ਗੁਣਾ ਕਰਨ ਦੀ ਥਾਂ ਉਨ੍ਹਾਂ ਨੂੰ ਜੋੜ ਦਿੰਦਾ ਹੈ",
    "wrong-division": "ਭਾਗ ਵਿੱਚ ਗਲਤ ਕੁੱਲ ਜਾਂ ਗਲਤ ਸਮੂਹ-ਗਿਣਤੀ ਵਰਤਦਾ ਹੈ",
    "missing-equals-average": "ਗੁੰਮ ਮੁੱਲ ਨੂੰ ਔਸਤ ਦੇ ਬਰਾਬਰ ਮੰਨ ਲੈਂਦਾ ਹੈ",
    "too-low": "ਗਣਨਾ ਦੀ ਗਲਤੀ ਨਾਲ ਜਵਾਬ ਸਹੀ ਮੁੱਲ ਨਾਲੋਂ ਛੋਟਾ ਹੋ ਜਾਂਦਾ ਹੈ",
    "too-high": "ਗਣਨਾ ਦੀ ਗਲਤੀ ਨਾਲ ਜਵਾਬ ਸਹੀ ਮੁੱਲ ਨਾਲੋਂ ਵੱਡਾ ਹੋ ਜਾਂਦਾ ਹੈ",
    "old-average": "ਲੋੜੀਂਦਾ ਮੁੱਲ ਕੱਢਣ ਦੀ ਥਾਂ ਪੁਰਾਣੀ ਔਸਤ ਦੁਹਰਾਉਂਦਾ ਹੈ",
    "individual-value": "ਕੁੱਲ ਮੁੜ ਬਣਾਉਣ ਦੀ ਥਾਂ ਇੱਕ ਇਕੱਲੀ ਐਂਟਰੀ ਨੂੰ ਜਵਾਬ ਮੰਨ ਲੈਂਦਾ ਹੈ",
    "average-change-only": "ਸਿਰਫ਼ ਔਸਤ ਦਾ ਬਦਲਾਅ ਲੈਂਦਾ ਹੈ ਅਤੇ ਸਮੂਹ-ਗਿਣਤੀ ਭੁੱਲ ਜਾਂਦਾ ਹੈ",
    "wrong-total-count": "ਨਵਾਂ ਕੁੱਲ ਜਾਂ ਨਵੀਂ ਸਮੂਹ-ਗਿਣਤੀ ਗਲਤ ਬਣਾਉਂਦਾ ਹੈ",
    "simple-mean": "ਅਸਮਾਨ ਸਮੂਹਾਂ ਦੀ ਸਧਾਰਣ ਔਸਤ ਲੈਂਦਾ ਹੈ",
    "subgroup-average": "ਮਿਲੀ-ਜੁਲੀ ਨਤੀਜੇ ਦੀ ਥਾਂ ਇੱਕ ਉਪ-ਸਮੂਹ ਦੀ ਔਸਤ ਦੁਹਰਾਉਂਦਾ ਹੈ",
    "omit-group": "ਮਿਲੀ-ਜੁਲੀ ਕੁੱਲ ਬਣਾਉਂਦੇ ਸਮੇਂ ਇੱਕ ਸਮੂਹ ਛੱਡ ਦਿੰਦਾ ਹੈ",
    "weighted-arithmetic": "ਸਮੂਹ-ਕੁੱਲ ਅਤੇ ਗਿਣਤੀਆਂ ਜੋੜਦੇ ਸਮੇਂ ਗਣਨਾ ਗਲਤ ਕਰਦਾ ਹੈ",
    "known-count": "ਗੁੰਮ ਗਿਣਤੀ ਕੱਢਣ ਦੀ ਥਾਂ ਜਾਣੀ ਸਮੂਹ-ਗਿਣਤੀ ਦੁਹਰਾਉਂਦਾ ਹੈ",
    "combined-average": "ਗੁੰਮ ਸਮੂਹ ਦੀ ਔਸਤ ਕੱਢਣ ਦੀ ਥਾਂ ਮਿਲੀ-ਜੁਲੀ ਔਸਤ ਦੁਹਰਾਉਂਦਾ ਹੈ",
    "known-average": "ਦੂਜੇ ਸਮੂਹ ਦੀ ਔਸਤ ਕੱਢਣ ਦੀ ਥਾਂ ਜਾਣੀ ਔਸਤ ਦੁਹਰਾਉਂਦਾ ਹੈ",
    "ratio-reversed": "ਲੋੜੀਂਦਾ ਸਮੂਹ-ਅਨੁਪਾਤ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖਦਾ ਹੈ",
    "ratio-arithmetic": "ਮਿਲੀ-ਜੁਲੀ ਔਸਤ ਤੋਂ ਗਲਤ ਦੂਰੀਆਂ ਲੈ ਕੇ ਅਨੁਪਾਤ ਬਣਾਉਂਦਾ ਹੈ",
  },
};

function numeric(value: number | Rational | undefined) {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && value.denominator) return value.numerator / value.denominator;
  return undefined;
}

function optionNumber(value: string) {
  const match = value.replaceAll(",", "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : undefined;
}

function close(left: number | undefined, right: number | undefined) {
  return left !== undefined && right !== undefined && Math.abs(left - right) < 0.06;
}

function hasMeaningfulUnitCue(stem: string) {
  return /₹|salary|sales|price|revenue|expense|order value|marks?|scores?|test|examination|ages?|years?|runs?|innings?|cricket|weights?|\bkg\b|kilomet|\bkm\b|speed|hours?|output|production|machines?|units? per hour/i.test(stem);
}

function stripAbstractUnit(text: string) {
  return text
    .replace(/\\text\{\s*(?:years?|marks?|runs?|kg|km|units?)\s*\}/gi, "")
    .replace(/\s+(?:years?|marks?|runs?|kg|km|units?)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function groupIndianDigits(value: string) {
  const [wholeRaw, decimal] = value.replaceAll(",", "").split(".");
  const negative = wholeRaw!.startsWith("-");
  const whole = negative ? wholeRaw!.slice(1) : wholeRaw!;
  const lastThree = whole.slice(-3);
  const leading = whole.slice(0, -3);
  const groupedLeading = leading.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  const grouped = leading ? `${groupedLeading},${lastThree}` : lastThree;
  return `${negative ? "-" : ""}${grouped}${decimal ? `.${decimal}` : ""}`;
}

function formatCurrencyText(text: string) {
  return text.replace(/₹\s*(-?\d[\d,]*(?:\.\d+)?)/g, (_full, value: string) => `₹${groupIndianDigits(value)}`);
}

function adjustedCurrencyOption(correct: number, ordinal: number, used: Set<number>) {
  const step = Math.abs(correct) >= 10000 ? 1000 : Math.abs(correct) >= 1000 ? 100 : Math.abs(correct) >= 100 ? 10 : 1;
  for (const direction of [1, -1]) {
    const candidate = correct + direction * step * (ordinal + 1);
    if (candidate >= 0 && !used.has(candidate)) return candidate;
  }
  return correct + step * (ordinal + 2);
}

function normaliseDisplays(source: Avg001QuestionPackage, pkg: Avg001QuestionPackage) {
  let options = pkg.options.map(formatCurrencyText);
  let answer = formatCurrencyText(pkg.answer);
  let lines = pkg.explanation.lines.map(formatCurrencyText);
  let solverAnswer = formatCurrencyText(pkg.solver.answer);
  let verificationAnswer = formatCurrencyText(pkg.independentVerification.displayAnswer);

  const abstractEnglish =
    pkg.language === "en" &&
    ["AVG-CP-001", "AVG-CP-002", "AVG-CP-003"].includes(pkg.canonicalProblemId) &&
    !hasMeaningfulUnitCue(pkg.stem);
  if (abstractEnglish) {
    options = options.map(stripAbstractUnit);
    answer = stripAbstractUnit(answer);
    lines = lines.map(stripAbstractUnit);
    solverAnswer = stripAbstractUnit(solverAnswer);
    verificationAnswer = stripAbstractUnit(verificationAnswer);
  }

  answer = options[pkg.correctIndex] ?? answer;
  const numericOptions = options.map(optionNumber);
  const correctNumber = numericOptions[pkg.correctIndex];
  if (answer.startsWith("₹") && correctNumber !== undefined) {
    const used = new Set<number>([correctNumber]);
    options = options.map((option, index) => {
      const value = numericOptions[index];
      if (index === pkg.correctIndex || value === undefined) return option;
      if (used.has(value)) {
        const replacement = adjustedCurrencyOption(correctNumber, index, used);
        used.add(replacement);
        return `₹${groupIndianDigits(String(replacement))}`;
      }
      used.add(value);
      return option;
    });
    answer = options[pkg.correctIndex]!;
  }

  const oldAnswer = pkg.answer;
  lines = lines.map((line) => line.replaceAll(oldAnswer, answer));
  return {
    ...pkg,
    options,
    answer,
    solver: { ...pkg.solver, answer: solverAnswer },
    independentVerification: { ...pkg.independentVerification, displayAnswer: verificationAnswer },
    explanation: { lines },
    traceability: {
      ...pkg.traceability,
      naturalLanguageOutputPolish: "AVG-001 V3.2 display and context polish",
      sourceAnswerDisplay: source.answer,
    },
  };
}

function inferCp001(source: Avg001QuestionPackage, option: number | undefined, answer: number | undefined): Reason {
  const v = source.parameters.values;
  const count = v.count;
  const average = numeric(v.average);
  const total = numeric(v.total);
  if (source.solveMode === "findSumFromAverageAndCount" && average !== undefined) {
    if (close(option, average * (count - 1))) return "one-fewer";
    if (close(option, average * (count + 1))) return "one-more";
    if (close(option, average + count)) return "add-not-multiply";
  }
  if (source.solveMode === "findAverageFromSumAndCount" && total !== undefined) {
    if (close(option, total / (count - 1))) return "one-fewer";
    if (close(option, total / (count + 1))) return "one-more";
    return "wrong-division";
  }
  if (source.solveMode === "findCountFromSumAndAverage") return "wrong-division";
  if (source.solveMode === "findMissingValueFromAverage") {
    if (close(option, average)) return "missing-equals-average";
    if (option !== undefined && answer !== undefined) return option < answer ? "too-low" : "too-high";
  }
  if (option !== undefined && answer !== undefined) return option < answer ? "too-low" : "too-high";
  return "wrong-total-count";
}

function inferCp003(source: Avg001QuestionPackage, option: number | undefined, answer: number | undefined): Reason {
  const v = source.parameters.values;
  const oldAverage = numeric(v.currentAverage ?? v.oldAverage ?? v.average);
  const newAverage = numeric(v.newAverage);
  const individualValues = [v.addedValue, v.removedValue, v.oldValue, v.newValue, v.nextScore, v.memberValue]
    .map(numeric)
    .filter((item): item is number => item !== undefined);
  if (close(option, oldAverage)) return "old-average";
  if (individualValues.some((value) => close(option, value))) return "individual-value";
  if (oldAverage !== undefined && newAverage !== undefined && close(option, Math.abs(newAverage - oldAverage))) return "average-change-only";
  if (option !== undefined && answer !== undefined && Math.abs(option - answer) <= 2) return option < answer ? "too-low" : "too-high";
  return "wrong-total-count";
}

function subgroupAverages(source: Avg001QuestionPackage) {
  const v = source.parameters.values;
  return [
    ...(v.groupAverages ?? []),
    ...(v.subgroupAverages ?? []),
    v.knownGroupAverage,
  ].map(numeric).filter((item): item is number => item !== undefined);
}

function inferGrouped(source: Avg001QuestionPackage, option: number | undefined, answer: number | undefined): Reason {
  const v = source.parameters.values;
  if (source.parameters.answerType === "RATIO") return "ratio-arithmetic";
  const averages = subgroupAverages(source);
  if (averages.some((value) => close(option, value))) return "subgroup-average";
  if (close(option, numeric(v.combinedAverage))) return "combined-average";
  if (close(option, numeric(v.knownGroupAverage))) return "known-average";
  if (close(option, v.knownGroupCount)) return "known-count";
  if (averages.length > 1) {
    const simple = averages.reduce((sum, value) => sum + value, 0) / averages.length;
    if (close(option, simple)) return "simple-mean";
  }
  if (option !== undefined && answer !== undefined && Math.abs(option - answer) <= 1) return "weighted-arithmetic";
  return source.canonicalProblemId === "AVG-CP-006" ? "omit-group" : "weighted-arithmetic";
}

function contextualReason(source: Avg001QuestionPackage, option: string, answer: string): Reason | null {
  const optionValue = optionNumber(option);
  const answerValue = optionNumber(answer);
  if (source.canonicalProblemId === "AVG-CP-001") return inferCp001(source, optionValue, answerValue);
  if (source.canonicalProblemId === "AVG-CP-003") return inferCp003(source, optionValue, answerValue);
  if (source.canonicalProblemId === "AVG-CP-004" || source.canonicalProblemId === "AVG-CP-006") {
    return inferGrouped(source, optionValue, answerValue);
  }
  return null;
}

function parseExistingReasons(line: string) {
  const reasons = new Map<string, string>();
  for (const match of line.matchAll(/([A-D])\s*\([^)]*\)\s*([^;।.]+(?:[;।.]|$))/g)) {
    reasons.set(match[1]!, match[2]!.replace(/[;।.]$/, "").trim());
  }
  return reasons;
}

function buildDistractorLine(source: Avg001QuestionPackage, pkg: Avg001QuestionPackage) {
  const existing = parseExistingReasons(pkg.explanation.lines[3] ?? "");
  const parts = pkg.options
    .map((option, index) => ({ option, index, label: String.fromCharCode(65 + index) }))
    .filter(({ index }) => index !== pkg.correctIndex)
    .map(({ option, label }) => {
      const reason = contextualReason(source, option, pkg.answer);
      const text = reason ? REASON_TEXT[pkg.language][reason] : existing.get(label) ?? REASON_TEXT[pkg.language]["wrong-total-count"];
      return `${label} (${option}) ${text}`;
    });
  if (pkg.language === "en") return `⚠️ Why the other options are wrong: ${parts.join("; ")}. Therefore, the correct answer is ${pkg.answer}.`;
  if (pkg.language === "hi") return `दूसरे विकल्प क्यों गलत हैं: ${parts.join("; ")}। इसलिए सही उत्तर ${pkg.answer} है।`;
  return `ਬਾਕੀ ਵਿਕਲਪ ਕਿਉਂ ਗਲਤ ਹਨ: ${parts.join("; ")}। ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${pkg.answer} ਹੈ।`;
}

function cleanConcept(line: string) {
  return line
    .replace(/ज्ञात पहले से ज्ञात कुल/g, "ज्ञात कुल")
    .replace(/ਜਾਣਿਆ ਪਹਿਲਾਂ ਤੋਂ ਜਾਣਿਆ ਕੁੱਲ/g, "ਜਾਣਿਆ ਕੁੱਲ");
}

function fixMathOperators(line: string) {
  return line
    .replace(/\text\{/g, "\\text{")
    .replace(/\times/g, "\\times")
    .replace(/(?<!\\)div(?=[0-9\s({])/g, "\\div")
    .replace(/(?<!\\)times(?=[0-9\s({])/g, "\\times")
    .replace(/(?<!\\)quad(?=[0-9\s({])/g, "\\quad");
}

export function applyAvg001NaturalLanguageV3OutputPolish(
  source: Avg001QuestionPackage,
  candidate: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const displayed = normaliseDisplays(source, candidate);
  const firstThree = displayed.explanation.lines.slice(0, 3).map((line, index) =>
    fixMathOperators(index === 0 ? cleanConcept(line) : line),
  );
  const provisional: Avg001QuestionPackage = {
    ...displayed,
    explanation: { lines: [...firstThree, displayed.explanation.lines[3]!] },
  };
  return {
    ...provisional,
    explanation: {
      lines: [
        provisional.explanation.lines[0]!,
        provisional.explanation.lines[1]!,
        provisional.explanation.lines[2]!,
        buildDistractorLine(source, provisional),
      ],
    },
  };
}
