import {
  AVG_001_CP001_MULTILINGUAL_PILOT,
  getAvg001Cp001LocalizedQlIds,
  runAvg001Cp001LocalizationPilot as runBasePilot,
} from "./cp001-localization-pilot";
import type { Avg001QuestionPackage } from "./types";

export {
  AVG_001_CP001_MULTILINGUAL_PILOT,
  getAvg001Cp001LocalizedQlIds,
};

function normalizeMath(value: string) {
  return value.includes("$$") ? value.replaceAll("+", "\\mathbin{+}") : value;
}

function polishStem(value: string, language: "hi" | "pa") {
  if (language === "hi") {
    return value
      .replaceAll("संयुक्त स्कोर", "कुल स्कोर")
      .replaceAll("संयुक्त वेतन", "कुल वेतन")
      .replaceAll("माप-पाठों", "रीडिंगों")
      .replaceAll("माप-पाठ", "रीडिंग")
      .replace(
        /कुल ([\d,.]+) यात्रियों और प्रति फेरा औसत ([\d,.]+) यात्रियों के आधार पर फेरों की संख्या ज्ञात कीजिए।/,
        "एक वाहन ने कुल $1 यात्रियों को ले जाया। प्रति फेरा औसतन $2 यात्री थे। फेरों की संख्या ज्ञात कीजिए।",
      );
  }
  return value
    .replaceAll("ਮਿਲਿਆ-ਜੁਲਿਆ ਸਕੋਰ", "ਕੁੱਲ ਸਕੋਰ")
    .replaceAll("ਮਿਲੀ-ਜੁਲੀ ਤਨਖਾਹ", "ਕੁੱਲ ਤਨਖਾਹ")
    .replaceAll("ਪ੍ਰੀਖਿਆ ਅੰਕਾਂ", "ਪ੍ਰੀਖਿਆ ਦੇ ਅੰਕਾਂ")
    .replaceAll("ਅਵਲੋਕਨਾਂ", "ਮੁੱਲਾਂ")
    .replaceAll("ਅਵਲੋਕਨ", "ਮੁੱਲ")
    .replace(
      /ਕੁੱਲ ([\d,.]+) ਯਾਤਰੀਆਂ ਅਤੇ ਪ੍ਰਤੀ ਚੱਕਰ ਔਸਤ ([\d,.]+) ਯਾਤਰੀਆਂ ਦੇ ਆਧਾਰ ਉੱਤੇ ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।/,
      "ਇੱਕ ਵਾਹਨ ਨੇ ਕੁੱਲ $1 ਯਾਤਰੀ ਲਿਜਾਏ। ਪ੍ਰਤੀ ਚੱਕਰ ਔਸਤਨ $2 ਯਾਤਰੀ ਸਨ। ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।",
    );
}

function numericId(pkg: Avg001QuestionPackage) {
  return Number(pkg.questionLanguageId.slice(-3));
}

function contextIndex(pkg: Avg001QuestionPackage) {
  const id = numericId(pkg);
  if (pkg.solveMode === "findSumFromAverageAndCount") return id <= 6 ? id - 1 : (id - 25) % 6;
  if (pkg.solveMode === "findAverageFromSumAndCount") return id <= 12 ? id - 7 : (id - 37) % 6;
  if (pkg.solveMode === "findCountFromSumAndAverage") return id <= 18 ? id - 13 : (id - 49) % 6;
  if (pkg.solveMode === "findMissingValueFromAverage") return id <= 24 ? id - 19 : (id - 61) % 6;
  return id - 374;
}

function rupees(answer: string) {
  return answer.startsWith("₹") ? answer : `₹${answer}`;
}

function localizedOpening(pkg: Avg001QuestionPackage, language: "hi" | "pa") {
  const values = pkg.parameters.renderVariables;
  const value = (key: string) => String(values[key] ?? "");
  const index = contextIndex(pkg);

  if (language === "hi") {
    if (pkg.solveMode === "findSumFromAverageAndCount") return [
      `औसत अंक ${value("average")} और विद्यार्थियों की संख्या ${value("count")} है।`,
      `औसत दैनिक उत्पादन ${value("average")} इकाइयाँ और दिनों की संख्या ${value("count")} है।`,
      `औसत दैनिक बिक्री ₹${value("average")} और दिनों की संख्या ${value("count")} है।`,
      `औसत वेतन ₹${value("average")} और कर्मचारियों की संख्या ${value("count")} है।`,
      `प्रति फेरा औसत ${value("average")} यात्री और फेरों की संख्या ${value("count")} है।`,
      `औसत दैनिक खर्च ₹${value("average")} और दिनों की संख्या ${value("count")} है।`,
    ][index]!;
    if (pkg.solveMode === "findAverageFromSumAndCount") return [
      `कुल अंक ${value("total")} और परीक्षाओं की संख्या ${value("count")} है।`,
      `कुल उत्पादन ${value("total")} इकाइयाँ और समय ${value("count")} घंटे है।`,
      `कुल बिक्री ₹${value("total")} और दिनों की संख्या ${value("count")} है।`,
      `कुल खर्च ₹${value("total")} और दिनों की संख्या ${value("count")} है।`,
      `कुल दूरी ${value("total")} किमी और दिनों की संख्या ${value("count")} है।`,
      `संख्याओं का योग ${value("total")} और उनकी संख्या ${value("count")} है।`,
    ][index]!;
    if (pkg.solveMode === "findCountFromSumAndAverage") return [
      `कुल उत्पादन ${value("total")} इकाइयाँ और औसत दैनिक उत्पादन ${value("average")} इकाइयाँ है।`,
      `कुल अंक ${value("total")} और प्रति विद्यार्थी औसत ${value("average")} अंक है।`,
      `कुल राशि ₹${value("total")} और प्रति लेन-देन औसत ₹${value("average")} है।`,
      `कुल वेतन ₹${value("total")} और औसत वेतन ₹${value("average")} है।`,
      `कुल यात्री ${value("total")} और प्रति फेरा औसत ${value("average")} यात्री है।`,
      `कुल खर्च ₹${value("total")} और औसत दैनिक खर्च ₹${value("average")} है।`,
    ][index]!;
  } else {
    if (pkg.solveMode === "findSumFromAverageAndCount") return [
      `ਔਸਤ ਅੰਕ ${value("average")} ਅਤੇ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ ${value("count")} ਹੈ।`,
      `ਔਸਤ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ ${value("average")} ਇਕਾਈਆਂ ਅਤੇ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ${value("count")} ਹੈ।`,
      `ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ ₹${value("average")} ਅਤੇ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ${value("count")} ਹੈ।`,
      `ਔਸਤ ਤਨਖਾਹ ₹${value("average")} ਅਤੇ ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ${value("count")} ਹੈ।`,
      `ਪ੍ਰਤੀ ਚੱਕਰ ਔਸਤ ${value("average")} ਯਾਤਰੀ ਅਤੇ ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ${value("count")} ਹੈ।`,
      `ਔਸਤ ਰੋਜ਼ਾਨਾ ਖਰਚ ₹${value("average")} ਅਤੇ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ${value("count")} ਹੈ।`,
    ][index]!;
    if (pkg.solveMode === "findAverageFromSumAndCount") return [
      `ਕੁੱਲ ਅੰਕ ${value("total")} ਅਤੇ ਪ੍ਰੀਖਿਆਵਾਂ ਦੀ ਗਿਣਤੀ ${value("count")} ਹੈ।`,
      `ਕੁੱਲ ਉਤਪਾਦਨ ${value("total")} ਇਕਾਈਆਂ ਅਤੇ ਸਮਾਂ ${value("count")} ਘੰਟੇ ਹੈ।`,
      `ਕੁੱਲ ਵਿਕਰੀ ₹${value("total")} ਅਤੇ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ${value("count")} ਹੈ।`,
      `ਕੁੱਲ ਖਰਚ ₹${value("total")} ਅਤੇ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ${value("count")} ਹੈ।`,
      `ਕੁੱਲ ਦੂਰੀ ${value("total")} ਕਿ.ਮੀ. ਅਤੇ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ${value("count")} ਹੈ।`,
      `ਸੰਖਿਆਵਾਂ ਦਾ ਜੋੜ ${value("total")} ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਗਿਣਤੀ ${value("count")} ਹੈ।`,
    ][index]!;
    if (pkg.solveMode === "findCountFromSumAndAverage") return [
      `ਕੁੱਲ ਉਤਪਾਦਨ ${value("total")} ਇਕਾਈਆਂ ਅਤੇ ਔਸਤ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ ${value("average")} ਇਕਾਈਆਂ ਹੈ।`,
      `ਕੁੱਲ ਅੰਕ ${value("total")} ਅਤੇ ਪ੍ਰਤੀ ਵਿਦਿਆਰਥੀ ਔਸਤ ${value("average")} ਅੰਕ ਹੈ।`,
      `ਕੁੱਲ ਰਕਮ ₹${value("total")} ਅਤੇ ਪ੍ਰਤੀ ਲੈਣ-ਦੇਣ ਔਸਤ ₹${value("average")} ਹੈ।`,
      `ਕੁੱਲ ਤਨਖਾਹ ₹${value("total")} ਅਤੇ ਔਸਤ ਤਨਖਾਹ ₹${value("average")} ਹੈ।`,
      `ਕੁੱਲ ਯਾਤਰੀ ${value("total")} ਅਤੇ ਪ੍ਰਤੀ ਚੱਕਰ ਔਸਤ ${value("average")} ਯਾਤਰੀ ਹੈ।`,
      `ਕੁੱਲ ਖਰਚ ₹${value("total")} ਅਤੇ ਔਸਤ ਰੋਜ਼ਾਨਾ ਖਰਚ ₹${value("average")} ਹੈ।`,
    ][index]!;
  }
  return pkg.explanation.lines[0]!;
}

function localizedConclusion(pkg: Avg001QuestionPackage, language: "hi" | "pa") {
  const answer = pkg.answer;
  const index = contextIndex(pkg);
  if (language === "hi") {
    if (pkg.solveMode === "findSumFromAverageAndCount") return [
      `अतः कुल अंक ${answer} हैं।`,
      `अतः कुल उत्पादन ${answer} इकाइयाँ है।`,
      `अतः कुल बिक्री ${rupees(answer)} है।`,
      `अतः कुल वेतन ${rupees(answer)} है।`,
      `अतः कुल यात्रियों की संख्या ${answer} है।`,
      `अतः कुल खर्च ${rupees(answer)} है।`,
    ][index]!;
    if (pkg.solveMode === "findAverageFromSumAndCount") return [
      `अतः प्रति परीक्षा औसत ${answer} अंक है।`,
      `अतः प्रति घंटा औसत उत्पादन ${answer} इकाइयाँ है।`,
      `अतः औसत दैनिक बिक्री ${rupees(answer)} है।`,
      `अतः औसत दैनिक खर्च ${rupees(answer)} है।`,
      `अतः औसत दैनिक दूरी ${answer} किमी है।`,
      `अतः अंकगणितीय औसत ${answer} है।`,
    ][index]!;
    if (pkg.solveMode === "findCountFromSumAndAverage") return [
      `अतः कार्य-दिवसों की संख्या ${answer} है।`,
      `अतः विद्यार्थियों की संख्या ${answer} है।`,
      `अतः लेन-देन की संख्या ${answer} है।`,
      `अतः कर्मचारियों की संख्या ${answer} है।`,
      `अतः फेरों की संख्या ${answer} है।`,
      `अतः दिनों की संख्या ${answer} है।`,
    ][index]!;
    if (pkg.solveMode === "findMissingValueFromAverage") return [
      `अतः शेष परीक्षा का अंक ${answer} है।`,
      `अतः शेष पाली का उत्पादन ${answer} इकाइयाँ है।`,
      `अतः शेष दिन की बिक्री ${rupees(answer)} है।`,
      `अतः शेष दिन का खर्च ${rupees(answer)} है।`,
      `अतः शेष दिन की दूरी ${answer} किमी है।`,
      `अतः शेष संख्या ${answer} है।`,
    ][index]!;
    return index === 0 || index === 5 ? `अतः नया औसत ${answer} अंक है।` : `अतः नया औसत ${answer} है।`;
  }

  if (pkg.solveMode === "findSumFromAverageAndCount") return [
    `ਇਸ ਲਈ ਕੁੱਲ ਅੰਕ ${answer} ਹਨ।`,
    `ਇਸ ਲਈ ਕੁੱਲ ਉਤਪਾਦਨ ${answer} ਇਕਾਈਆਂ ਹੈ।`,
    `ਇਸ ਲਈ ਕੁੱਲ ਵਿਕਰੀ ${rupees(answer)} ਹੈ।`,
    `ਇਸ ਲਈ ਕੁੱਲ ਤਨਖਾਹ ${rupees(answer)} ਹੈ।`,
    `ਇਸ ਲਈ ਕੁੱਲ ਯਾਤਰੀਆਂ ਦੀ ਗਿਣਤੀ ${answer} ਹੈ।`,
    `ਇਸ ਲਈ ਕੁੱਲ ਖਰਚ ${rupees(answer)} ਹੈ।`,
  ][index]!;
  if (pkg.solveMode === "findAverageFromSumAndCount") return [
    `ਇਸ ਲਈ ਪ੍ਰਤੀ ਪ੍ਰੀਖਿਆ ਔਸਤ ${answer} ਅੰਕ ਹੈ।`,
    `ਇਸ ਲਈ ਪ੍ਰਤੀ ਘੰਟਾ ਔਸਤ ਉਤਪਾਦਨ ${answer} ਇਕਾਈਆਂ ਹੈ।`,
    `ਇਸ ਲਈ ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ ${rupees(answer)} ਹੈ।`,
    `ਇਸ ਲਈ ਔਸਤ ਰੋਜ਼ਾਨਾ ਖਰਚ ${rupees(answer)} ਹੈ।`,
    `ਇਸ ਲਈ ਔਸਤ ਰੋਜ਼ਾਨਾ ਦੂਰੀ ${answer} ਕਿ.ਮੀ. ਹੈ।`,
    `ਇਸ ਲਈ ਅੰਕਗਣਿਤ ਔਸਤ ${answer} ਹੈ।`,
  ][index]!;
  if (pkg.solveMode === "findCountFromSumAndAverage") return [
    `ਇਸ ਲਈ ਕੰਮ ਦੇ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ${answer} ਹੈ।`,
    `ਇਸ ਲਈ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ ${answer} ਹੈ।`,
    `ਇਸ ਲਈ ਲੈਣ-ਦੇਣ ਦੀ ਗਿਣਤੀ ${answer} ਹੈ।`,
    `ਇਸ ਲਈ ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ${answer} ਹੈ।`,
    `ਇਸ ਲਈ ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ${answer} ਹੈ।`,
    `ਇਸ ਲਈ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ${answer} ਹੈ।`,
  ][index]!;
  if (pkg.solveMode === "findMissingValueFromAverage") return [
    `ਇਸ ਲਈ ਬਾਕੀ ਪ੍ਰੀਖਿਆ ਦਾ ਅੰਕ ${answer} ਹੈ।`,
    `ਇਸ ਲਈ ਬਾਕੀ ਸ਼ਿਫਟ ਦਾ ਉਤਪਾਦਨ ${answer} ਇਕਾਈਆਂ ਹੈ।`,
    `ਇਸ ਲਈ ਬਾਕੀ ਦਿਨ ਦੀ ਵਿਕਰੀ ${rupees(answer)} ਹੈ।`,
    `ਇਸ ਲਈ ਬਾਕੀ ਦਿਨ ਦਾ ਖਰਚ ${rupees(answer)} ਹੈ।`,
    `ਇਸ ਲਈ ਬਾਕੀ ਦਿਨ ਦੀ ਦੂਰੀ ${answer} ਕਿ.ਮੀ. ਹੈ।`,
    `ਇਸ ਲਈ ਬਾਕੀ ਸੰਖਿਆ ${answer} ਹੈ।`,
  ][index]!;
  return index === 0 || index === 5 ? `ਇਸ ਲਈ ਨਵੀਂ ਔਸਤ ${answer} ਅੰਕ ਹੈ।` : `ਇਸ ਲਈ ਨਵੀਂ ਔਸਤ ${answer} ਹੈ।`;
}

function correctedValidation(pkg: Avg001QuestionPackage, language: "hi" | "pa") {
  const allText = `${pkg.stem}\n${pkg.explanation.lines.join("\n")}`;
  const devanagariLetters = /[\u0900-\u0963\u0970-\u097F]/;
  const gurmukhiLetters = /[\u0A01-\u0A74]/;
  const expectedScript = language === "hi" ? devanagariLetters : gurmukhiLetters;
  const wrongScript = language === "hi" ? gurmukhiLetters : devanagariLetters;
  const checks = pkg.validation.checks.map((check) => {
    if (check.name === "localized-script") {
      return {
        ...check,
        passed: expectedScript.test(allText) && !wrongScript.test(allText),
        message: "Localized prose uses the expected Indic script; shared punctuation is ignored",
      };
    }
    if (check.name === "localized-explanation") {
      return {
        ...check,
        passed:
          pkg.explanation.lines.length === 4 &&
          pkg.explanation.lines.some((line) => line.includes(pkg.answer)),
      };
    }
    return check;
  });
  return { valid: checks.every((check) => check.passed), checks };
}

export function runAvg001Cp001LocalizationPilot(input: {
  questionLanguageId: string;
  seed: string;
  language: "hi" | "pa";
}): Avg001QuestionPackage {
  const base = runBasePilot(input);
  const lines = base.explanation.lines.map(normalizeMath);
  lines[0] = localizedOpening(base, input.language);
  lines[lines.length - 1] = localizedConclusion(base, input.language);
  const normalized: Avg001QuestionPackage = {
    ...base,
    stem: polishStem(base.stem, input.language),
    explanation: { lines },
  };
  return {
    ...normalized,
    validation: correctedValidation(normalized, input.language),
  };
}
