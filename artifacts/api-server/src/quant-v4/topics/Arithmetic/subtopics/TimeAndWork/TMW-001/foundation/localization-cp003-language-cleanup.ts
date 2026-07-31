import { required } from "./cp001-helpers";
import { divide, formatRational, toMixedLatex } from "./rational";
import { ratioText } from "./cp003-solver";
import type { TmwCp003Parameters, TmwCp003SolveMode } from "./cp003-types";
import type { Rational } from "./types";
import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";

function copy(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

const agentCopy: Record<string, { hi: string; pa: string }> = {
  operator: { hi: "ऑपरेटर", pa: "ਆਪਰੇਟਰ" },
  technician: { hi: "तकनीशियन", pa: "ਟੈਕਨੀਸ਼ੀਅਨ" },
  clerk: { hi: "क्लर्क", pa: "ਕਲਰਕ" },
  machine: { hi: "मशीन", pa: "ਮਸ਼ੀਨ" },
  crew: { hi: "दल", pa: "ਟੀਮ" },
  packer: { hi: "पैकिंग कर्मी", pa: "ਪੈਕਿੰਗ ਕਰਮਚਾਰੀ" },
  inspector: { hi: "निरीक्षक", pa: "ਜਾਂਚਕਰਤਾ" },
  typist: { hi: "टाइपिस्ट", pa: "ਟਾਈਪਿਸਟ" },
  painter: { hi: "पेंटर", pa: "ਪੇਂਟਰ" },
  worker: { hi: "कर्मचारी", pa: "ਕਰਮਚਾਰੀ" },
  surveyor: { hi: "सर्वेक्षक", pa: "ਸਰਵੇਖਕ" },
  assembler: { hi: "असेंबली कर्मी", pa: "ਅਸੈਂਬਲੀ ਕਰਮਚਾਰੀ" },
};

const outputCopy: Record<string, { hi: string; pa: string; hiOblique: string; paOblique: string }> = {
  records: { hi: "रिकॉर्ड", pa: "ਰਿਕਾਰਡ", hiOblique: "रिकॉर्ड", paOblique: "ਰਿਕਾਰਡ" },
  components: { hi: "पुर्ज़े", pa: "ਪੁਰਜ਼ੇ", hiOblique: "पुर्ज़ों", paOblique: "ਪੁਰਜ਼ਿਆਂ" },
  applications: { hi: "आवेदन", pa: "ਅਰਜ਼ੀਆਂ", hiOblique: "आवेदनों", paOblique: "ਅਰਜ਼ੀਆਂ" },
  booklets: { hi: "पुस्तिकाएँ", pa: "ਪੁਸਤਿਕਾਵਾਂ", hiOblique: "पुस्तिकाओं", paOblique: "ਪੁਸਤਿਕਾਵਾਂ" },
  metres: { hi: "मीटर", pa: "ਮੀਟਰ", hiOblique: "मीटर", paOblique: "ਮੀਟਰ" },
  cartons: { hi: "कार्टन", pa: "ਕਾਰਟਨ", hiOblique: "कार्टनों", paOblique: "ਕਾਰਟਨਾਂ" },
  units: { hi: "इकाइयाँ", pa: "ਇਕਾਈਆਂ", hiOblique: "इकाइयों", paOblique: "ਇਕਾਈਆਂ" },
  pages: { hi: "पृष्ठ", pa: "ਸਫ਼ੇ", hiOblique: "पृष्ठों", paOblique: "ਸਫ਼ਿਆਂ" },
  rooms: { hi: "कमरे", pa: "ਕਮਰੇ", hiOblique: "कमरों", paOblique: "ਕਮਰਿਆਂ" },
  items: { hi: "वस्तुएँ", pa: "ਵਸਤੂਆਂ", hiOblique: "वस्तुओं", paOblique: "ਵਸਤੂਆਂ" },
  forms: { hi: "फॉर्म", pa: "ਫਾਰਮ", hiOblique: "फॉर्मों", paOblique: "ਫਾਰਮਾਂ" },
  devices: { hi: "उपकरण", pa: "ਉਪਕਰਣ", hiOblique: "उपकरणों", paOblique: "ਉਪਕਰਣਾਂ" },
};

function agent(p: TmwCp003Parameters, language: TmwLocalizedLanguage, letter: "A" | "B" | "C"): string {
  return `${agentCopy[p.context.agentNoun]?.[language] ?? p.context.agentNoun} ${letter}`;
}

function output(p: TmwCp003Parameters, language: TmwLocalizedLanguage): string {
  return outputCopy[p.context.outputNoun]?.[language] ?? p.context.outputNoun;
}

function outputOblique(p: TmwCp003Parameters, language: TmwLocalizedLanguage): string {
  const value = outputCopy[p.context.outputNoun];
  if (!value) return p.context.outputNoun;
  return language === "hi" ? value.hiOblique : value.paOblique;
}

function outputQuantity(p: TmwCp003Parameters, value: Rational, language: TmwLocalizedLanguage): string {
  const number = formatRational(value);
  return copy(
    language,
    `${number} ${outputOblique(p, language)} के बराबर`,
    `${number} ${outputOblique(p, language)} ਦੇ ਬਰਾਬਰ`,
  );
}

function durationIn(value: Rational, language: TmwLocalizedLanguage): string {
  if (value.denominator !== 1) {
    return copy(
      language,
      `\\(${toMixedLatex(value)}\\;\\text{दिनों में}\\)`,
      `\\(${toMixedLatex(value)}\\;\\text{ਦਿਨਾਂ ਵਿੱਚ}\\)`,
    );
  }
  if (value.numerator === 1) return copy(language, "1 दिन में", "1 ਦਿਨ ਵਿੱਚ");
  return copy(language, `${value.numerator} दिनों में`, `${value.numerator} ਦਿਨਾਂ ਵਿੱਚ`);
}

function cleanDurationPostpositions(value: string, language: TmwLocalizedLanguage): string {
  if (language === "hi") {
    return value
      .replace(/\b(?!1\b)(\d+) दिन में/g, "$1 दिनों में")
      .replace(/\\text\{दिन\}\\\) में/g, "\\text{दिनों में}\\)");
  }
  return value
    .replace(/\b(?!1\b)(\d+) ਦਿਨ ਵਿੱਚ/g, "$1 ਦਿਨਾਂ ਵਿੱਚ")
    .replace(/\\text\{ਦਿਨ\}\\\) ਵਿੱਚ/g, "\\text{ਦਿਨਾਂ ਵਿੱਚ}\\)");
}

function clean(value: string, language: TmwLocalizedLanguage): string {
  const terminology = language === "hi"
    ? value.replaceAll("आउटपुट", "उत्पादन").replaceAll("रेफरेंस उत्पादन", "संदर्भ उत्पादन")
    : value;
  return cleanDurationPostpositions(terminology, language);
}

function outputStem(
  question: TmwLocalizedQuestion,
  language: TmwLocalizedLanguage,
  mode: TmwCp003SolveMode,
  p: TmwCp003Parameters,
): string {
  const A = agent(p, language, "A");
  const B = agent(p, language, "B");
  const ratio = ratioText(divide(p.efficiencyA, p.efficiencyB));

  if (mode === "findOutputFromEfficiencyRatioAndReferenceOutput") {
    const reference = outputQuantity(p, required(p.outputB, "outputB"), language);
    return copy(
      language,
      `${A} और ${B} समान समय तक काम करते हैं तथा उनकी कार्यक्षमता का अनुपात ${ratio} है। ${B} का उत्पादन ${reference} है। ${A} का उत्पादन कितना होगा?`,
      `${A} ਅਤੇ ${B} ਇਕੋ ਸਮੇਂ ਤੱਕ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ${B} ਦਾ ਉਤਪਾਦਨ ${reference} ਹੈ। ${A} ਦਾ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
    );
  }
  if (mode === "findReferenceOutputFromEfficiencyRatioAndOtherOutput") {
    const reference = outputQuantity(p, required(p.outputA, "outputA"), language);
    return copy(
      language,
      `${A} और ${B} समान समय तक काम करते हैं तथा उनकी कार्यक्षमता का अनुपात ${ratio} है। ${A} का उत्पादन ${reference} है। ${B} का उत्पादन कितना होगा?`,
      `${A} ਅਤੇ ${B} ਇਕੋ ਸਮੇਂ ਤੱਕ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ${A} ਦਾ ਉਤਪਾਦਨ ${reference} ਹੈ। ${B} ਦਾ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
    );
  }
  if (mode === "findEfficiencyRatioFromOutputAndTimeComparison") {
    const first = outputQuantity(p, required(p.outputA, "outputA"), language);
    const second = outputQuantity(p, required(p.outputB, "outputB"), language);
    return copy(
      language,
      `${durationIn(required(p.durationA, "durationA"), language)} ${A} का उत्पादन ${first} है, जबकि ${durationIn(required(p.durationB, "durationB"), language)} ${B} का उत्पादन ${second} है। कार्यक्षमता का अनुपात ${A}:${B} ज्ञात कीजिए।`,
      `${durationIn(required(p.durationA, "durationA"), language)} ${A} ਦਾ ਉਤਪਾਦਨ ${first} ਹੈ, ਜਦਕਿ ${durationIn(required(p.durationB, "durationB"), language)} ${B} ਦਾ ਉਤਪਾਦਨ ${second} ਹੈ। ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${A}:${B} ਕੱਢੋ।`,
    );
  }
  if (mode === "findComparativeOutputFromDifferentEfficienciesAndDurations") {
    const reference = outputQuantity(p, required(p.outputB, "outputB"), language);
    return copy(
      language,
      `${A}:${B} की कार्यक्षमता का अनुपात ${ratio} है। ${durationIn(required(p.durationB, "durationB"), language)} ${B} का उत्पादन ${reference} है। ${durationIn(required(p.durationA, "durationA"), language)} ${A} का उत्पादन कितना होगा?`,
      `${A}:${B} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ। ${durationIn(required(p.durationB, "durationB"), language)} ${B} ਦਾ ਉਤਪਾਦਨ ${reference} ਹੈ। ${durationIn(required(p.durationA, "durationA"), language)} ${A} ਦਾ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
    );
  }
  return clean(question.stem, language);
}

export function cleanTmwCp003LocalizedLanguage(
  question: TmwLocalizedQuestion,
  language: TmwLocalizedLanguage,
): TmwLocalizedQuestion {
  const p = question.parameters as TmwCp003Parameters;
  const mode = question.solveMode as TmwCp003SolveMode;
  const outputModes: readonly TmwCp003SolveMode[] = [
    "findOutputFromEfficiencyRatioAndReferenceOutput",
    "findReferenceOutputFromEfficiencyRatioAndOtherOutput",
    "findEfficiencyRatioFromOutputAndTimeComparison",
    "findComparativeOutputFromDifferentEfficienciesAndDurations",
  ];

  let opening = clean(question.explanation.opening, language);
  let shortcutTitle = clean(question.explanation.shortcut.title, language);
  let shortcutSteps = question.explanation.shortcut.steps.map((line) => clean(line, language));
  let conclusion = clean(question.explanation.conclusion, language);

  if (mode === "findSuccessiveEfficiencyRatioAcrossThreeAgents") {
    opening = copy(
      language,
      "बीच वाले सदस्य का पद दोनों अनुपातों में बराबर करें और फिर दोनों अनुपात मिलाएँ; इससे पहले और तीसरे सदस्य का अनुपात मिलता है।",
      "ਵਿਚਕਾਰਲੇ ਮੈਂਬਰ ਦਾ ਪਦ ਦੋਵੇਂ ਅਨੁਪਾਤਾਂ ਵਿੱਚ ਬਰਾਬਰ ਕਰੋ ਅਤੇ ਫਿਰ ਦੋਵੇਂ ਅਨੁਪਾਤ ਮਿਲਾਓ; ਇਸ ਨਾਲ ਪਹਿਲੇ ਅਤੇ ਤੀਜੇ ਮੈਂਬਰ ਦਾ ਅਨੁਪਾਤ ਮਿਲਦਾ ਹੈ।",
    );
    shortcutSteps = [copy(
      language,
      `बीच वाले सदस्य का पद बराबर करके दोनों अनुपात मिलाने पर ${question.solution.answerText} मिलता है।`,
      `ਵਿਚਕਾਰਲੇ ਮੈਂਬਰ ਦਾ ਪਦ ਬਰਾਬਰ ਕਰਕੇ ਦੋਵੇਂ ਅਨੁਪਾਤ ਮਿਲਾਉਣ ਉੱਤੇ ${question.solution.answerText} ਮਿਲਦਾ ਹੈ।`,
    )];
  }

  if ([
    "findOutputFromEfficiencyRatioAndReferenceOutput",
    "findReferenceOutputFromEfficiencyRatioAndOtherOutput",
    "findComparativeOutputFromDifferentEfficienciesAndDurations",
  ].includes(mode)) {
    const quantity = outputQuantity(p, question.solution.answer, language);
    shortcutSteps = [copy(
      language,
      `अनुपात और समय के गुणक लगाने पर उत्पादन ${quantity} मिलता है।`,
      `ਅਨੁਪਾਤ ਅਤੇ ਸਮੇਂ ਦੇ ਗੁਣਕ ਲਗਾਉਣ ਉੱਤੇ ਉਤਪਾਦਨ ${quantity} ਮਿਲਦਾ ਹੈ।`,
    )];
    conclusion = copy(
      language,
      `अतः आवश्यक उत्पादन ${quantity} है।`,
      `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਉਤਪਾਦਨ ${quantity} ਹੈ।`,
    );
  }

  return {
    ...question,
    stem: outputModes.includes(mode) ? outputStem(question, language, mode, p) : clean(question.stem, language),
    explanation: {
      ...question.explanation,
      opening,
      shortcut: {
        title: shortcutTitle,
        steps: shortcutSteps,
      },
      commonTrap: {
        ...question.explanation.commonTrap,
        explanation: clean(question.explanation.commonTrap.explanation, language),
      },
      conclusion,
    },
  };
}
