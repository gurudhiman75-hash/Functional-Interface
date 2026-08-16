import { validateTmwLearnerExplanationV2, type TmwLearnerExplanationV2 } from "./learner-explanation-contract";

export type Cp011ReviewLanguage = "en" | "hi" | "pa";

type AnyQuestion = Record<string, any>;

type UnitKey = "booklets" | "cartons" | "components" | "crates" | "files" | "sections";

const UNIT: Record<UnitKey, readonly [string, string, string]> = {
  booklets: ["booklets", "पुस्तिकाएँ", "ਪੁਸਤਿਕਾਵਾਂ"],
  cartons: ["cartons", "कार्टन", "ਕਾਰਟਨ"],
  components: ["components", "पुर्ज़े", "ਪੁਰਜ਼ੇ"],
  crates: ["crates", "पेटियाँ", "ਪੇਟੀਆਂ"],
  files: ["files", "फाइलें", "ਫਾਈਲਾਂ"],
  sections: ["road sections", "सड़क के हिस्से", "ਸੜਕ ਦੇ ਹਿੱਸੇ"],
};

const FEMININE = new Set<UnitKey>(["booklets", "crates", "files"]);

function pick(language: Cp011ReviewLanguage, copy: readonly [string, string, string]): string {
  return language === "hi" ? copy[1] : language === "pa" ? copy[2] : copy[0];
}

function unitKey(question: AnyQuestion): UnitKey | null {
  const value = question.parameters?.context?.unit;
  return value && value in UNIT ? value as UnitKey : null;
}

function cleanMathText(value: string): string {
  let current = value;
  for (let i = 0; i < 4; i += 1) {
    const next = current.replace(/\\\(([^()]*)\\;\\text\{([^{}]+)\}\\\)/g, (_m, expr: string, label: string) => `\\(${expr.trim()}\\) ${label.trim()}`);
    if (next === current) break;
    current = next;
  }
  return current
    .replace(/S_\{\\text\{[^{}]+\}\}/g, "S")
    .replace(/\bS\}/g, "S")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function localizeNames(value: string, language: Cp011ReviewLanguage): string {
  if (language === "en") return value;
  const names: Record<string, readonly [string, string]> = {
    Asha: ["आशा", "ਆਸ਼ਾ"], Bharat: ["भारत", "ਭਾਰਤ"], Meera: ["मीरा", "ਮੀਰਾ"], Rohan: ["रोहन", "ਰੋਹਨ"],
    Priya: ["प्रिया", "ਪ੍ਰਿਆ"], Raj: ["राज", "ਰਾਜ"], Kiran: ["किरन", "ਕਿਰਨ"], Nitin: ["नितिन", "ਨਿਤਿਨ"],
    Simran: ["सिमरन", "ਸਿਮਰਨ"], Arjun: ["अर्जुन", "ਅਰਜੁਨ"],
  };
  let out = value;
  for (const [latin, pair] of Object.entries(names)) out = out.replace(new RegExp(`\\b${latin}\\b`, "g"), language === "hi" ? pair[0] : pair[1]);
  return out;
}

function singularizeKnownUnits(value: string, language: Cp011ReviewLanguage): string {
  if (language === "hi") {
    return value
      .replace(/\b1 पुस्तिकाएँ\b/gu, "1 पुस्तिका")
      .replace(/\b1 पेटियाँ\b/gu, "1 पेटी")
      .replace(/\b1 फाइलें\b/gu, "1 फाइल")
      .replace(/\b1 पुर्ज़े\b/gu, "1 पुर्ज़ा")
      .replace(/\b1 सड़क के हिस्से\b/gu, "1 सड़क का हिस्सा");
  }
  if (language === "pa") {
    return value
      .replace(/\b1 ਪੁਸਤਿਕਾਵਾਂ\b/gu, "1 ਪੁਸਤਿਕਾ")
      .replace(/\b1 ਪੇਟੀਆਂ\b/gu, "1 ਪੇਟੀ")
      .replace(/\b1 ਫਾਈਲਾਂ\b/gu, "1 ਫਾਈਲ")
      .replace(/\b1 ਪੁਰਜ਼ੇ\b/gu, "1 ਪੁਰਜ਼ਾ")
      .replace(/\b1 ਸੜਕ ਦੇ ਹਿੱਸੇ\b/gu, "1 ਸੜਕ ਦਾ ਹਿੱਸਾ");
  }
  return value;
}

function fixStem(question: AnyQuestion, qlId: string, language: Cp011ReviewLanguage): string {
  let stem = singularizeKnownUnits(localizeNames(cleanMathText(question.stem ?? ""), language), language);
  if (language === "en") return stem;
  const key = unitKey(question);
  if (!key) return stem;
  const u = pick(language, UNIT[key]);
  const feminine = FEMININE.has(key);

  if (language === "hi") {
    if (["TMW-QL-193", "TMW-QL-197", "TMW-QL-209"].includes(qlId)) {
      stem = stem
        .replace(/कुल कितनी [^।?]+? पूरी होंगी/gu, feminine ? `कुल कितनी ${u} पूरी होंगी` : `कुल कितने ${u} पूरे होंगे`)
        .replace(/कुल कितने [^।?]+? पूरे होंगे/gu, feminine ? `कुल कितनी ${u} पूरी होंगी` : `कुल कितने ${u} पूरे होंगे`);
    }
    if (feminine) {
      stem = stem
        .replaceAll(`${u} पूरे होते हैं`, `${u} पूरी होती हैं`)
        .replaceAll(`${u} पूरा करती है`, `${u} पूरी करती है`)
        .replaceAll(`${u} पूरा करता है`, `${u} पूरी करता है`)
        .replaceAll(`${u} पूरा होने`, `${u} पूरी होने`)
        .replaceAll(`${u} पूरा करने`, `${u} पूरी करने`)
        .replaceAll(`${u} पूरे हुए`, `${u} पूरी हुईं`);
    } else {
      stem = stem
        .replaceAll(`${u} पूरी होती हैं`, `${u} पूरे होते हैं`)
        .replaceAll(`${u} पूरा करती है`, `${u} पूरे करती है`)
        .replaceAll(`${u} पूरी करती है`, `${u} पूरे करती है`)
        .replaceAll(`${u} पूरा करता है`, `${u} पूरे करता है`)
        .replaceAll(`${u} पूरी करता है`, `${u} पूरे करता है`)
        .replaceAll(`${u} पूरा होने`, `${u} पूरे होने`)
        .replaceAll(`${u} पूरी होने`, `${u} पूरे होने`)
        .replaceAll(`${u} पूरा करने`, `${u} पूरे करने`)
        .replaceAll(`${u} पूरी करने`, `${u} पूरे करने`)
        .replaceAll(`${u} कब पूरी होंगी`, `${u} कब पूरे होंगे`);
    }
    if (qlId === "TMW-QL-206") stem = stem.replace(/(दैनिक बदलाव\s+-?\d+)\s+पुर्ज़े/gu, `$1 ${u}`);
    if (qlId === "TMW-QL-203") stem = stem.replace(/(\d+ दिनों का कुल) ([^।]+?) हुआ/gu, "$1 उत्पादन $2 रहा");
    if (qlId === "TMW-QL-211") stem = stem.replace("नई दर में दैनिक बढ़ोतरी या कमी ज्ञात कीजिए।", "नई और पुरानी दैनिक दर का अंतर (बढ़ोतरी या कमी) ज्ञात कीजिए।");
    return stem.replace(/\s{2,}/g, " ").trim();
  }

  if (["TMW-QL-193", "TMW-QL-197", "TMW-QL-209"].includes(qlId)) {
    stem = stem
      .replace(/ਕੁੱਲ ਕਿੰਨੀਆਂ [^।?]+? ਪੂਰੀਆਂ ਹੋਣਗੀਆਂ/gu, feminine ? `ਕੁੱਲ ਕਿੰਨੀਆਂ ${u} ਪੂਰੀਆਂ ਹੋਣਗੀਆਂ` : `ਕੁੱਲ ਕਿੰਨੇ ${u} ਪੂਰੇ ਹੋਣਗੇ`)
      .replace(/ਕੁੱਲ ਕਿੰਨੇ [^।?]+? ਪੂਰੇ ਹੋਣਗੇ/gu, feminine ? `ਕੁੱਲ ਕਿੰਨੀਆਂ ${u} ਪੂਰੀਆਂ ਹੋਣਗੀਆਂ` : `ਕੁੱਲ ਕਿੰਨੇ ${u} ਪੂਰੇ ਹੋਣਗੇ`);
  }
  if (feminine) {
    stem = stem
      .replaceAll(`${u} ਪੂਰੇ ਹੁੰਦੇ ਹਨ`, `${u} ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ`)
      .replaceAll(`${u} ਪੂਰੀ ਕਰਦੀ ਹੈ`, `${u} ਪੂਰੀਆਂ ਕਰਦੀ ਹੈ`)
      .replaceAll(`${u} ਪੂਰੀ ਕਰਦਾ ਹੈ`, `${u} ਪੂਰੀਆਂ ਕਰਦਾ ਹੈ`)
      .replaceAll(`${u} ਪੂਰੇ ਹੋਣ`, `${u} ਪੂਰੀਆਂ ਹੋਣ`)
      .replaceAll(`${u} ਪੂਰੇ ਹੋਏ`, `${u} ਪੂਰੀਆਂ ਹੋਈਆਂ`)
      .replaceAll(`${u} ਪੂਰੇ ਕਰਨ`, `${u} ਪੂਰੀਆਂ ਕਰਨ`);
  } else {
    stem = stem
      .replaceAll(`${u} ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ`, `${u} ਪੂਰੇ ਹੁੰਦੇ ਹਨ`)
      .replaceAll(`${u} ਪੂਰੀ ਕਰਦੀ ਹੈ`, `${u} ਪੂਰੇ ਕਰਦੀ ਹੈ`)
      .replaceAll(`${u} ਪੂਰੀਆਂ ਕਰਦੀ ਹੈ`, `${u} ਪੂਰੇ ਕਰਦੀ ਹੈ`)
      .replaceAll(`${u} ਪੂਰੀ ਕਰਦਾ ਹੈ`, `${u} ਪੂਰੇ ਕਰਦਾ ਹੈ`)
      .replaceAll(`${u} ਪੂਰੀਆਂ ਕਰਦਾ ਹੈ`, `${u} ਪੂਰੇ ਕਰਦਾ ਹੈ`)
      .replaceAll(`${u} ਪੂਰੀਆਂ ਹੋਣ`, `${u} ਪੂਰੇ ਹੋਣ`)
      .replaceAll(`${u} ਪੂਰੀਆਂ ਹੋਈਆਂ`, `${u} ਪੂਰੇ ਹੋਏ`)
      .replaceAll(`${u} ਪੂਰੀਆਂ ਕਰਨ`, `${u} ਪੂਰੇ ਕਰਨ`)
      .replaceAll(`${u} ਕਦੋਂ ਪੂਰੀਆਂ ਹੋਣਗੀਆਂ`, `${u} ਕਦੋਂ ਪੂਰੇ ਹੋਣਗੇ`);
  }
  if (qlId === "TMW-QL-203") stem = stem.replace(/(\d+ ਦਿਨਾਂ ਦਾ ਕੁੱਲ) ([^।]+?) ਹੋਇਆ/gu, "$1 ਉਤਪਾਦਨ $2 ਰਿਹਾ");
  if (qlId === "TMW-QL-211") stem = stem.replace("ਨਵੀਂ ਦਰ ਵਿੱਚ ਰੋਜ਼ਾਨਾ ਵਾਧਾ ਜਾਂ ਘਾਟ ਲੱਭੋ।", "ਨਵੀਂ ਅਤੇ ਪੁਰਾਣੀ ਰੋਜ਼ਾਨਾ ਦਰ ਦਾ ਫਰਕ (ਵਾਧਾ ਜਾਂ ਘਾਟ) ਲੱਭੋ।");
  return stem.replace(/\s{2,}/g, " ").trim();
}

function cleanLine(value: string, language: Cp011ReviewLanguage): string {
  return singularizeKnownUnits(cleanMathText(value), language);
}

function learnerWorking(question: AnyQuestion, language: Cp011ReviewLanguage): string[] {
  const legacy = Array.isArray(question.explanation?.steps) ? question.explanation.steps : [];
  return legacy.slice(0, 4).map((line: string) => {
    let value = cleanLine(line, language);
    if (language === "hi") value = value.replace(/^चरण 2:/u, "गणना 1:").replace(/^चरण 3:/u, "गणना 2:").replace(/^चरण 4:/u, "गणना 3:");
    else if (language === "pa") value = value.replace(/^ਪੜਾਅ 2:/u, "ਗਣਨਾ 1:").replace(/^ਪੜਾਅ 3:/u, "ਗਣਨਾ 2:").replace(/^ਪੜਾਅ 4:/u, "ਗਣਨਾ 3:");
    else value = value.replace(/^Step 2:/i, "Calculation 1:").replace(/^Step 3:/i, "Calculation 2:").replace(/^Step 4:/i, "Calculation 3:");
    return value;
  });
}

function cleanExplanation(explanation: AnyQuestion | undefined, language: Cp011ReviewLanguage): AnyQuestion | undefined {
  if (!explanation) return explanation;
  const map = (value: string) => cleanLine(value, language);
  return {
    ...explanation,
    opening: explanation.opening ? map(explanation.opening) : explanation.opening,
    formula: explanation.formula ? map(explanation.formula) : explanation.formula,
    givens: Array.isArray(explanation.givens) ? explanation.givens.map(map) : explanation.givens,
    steps: Array.isArray(explanation.steps) ? explanation.steps.map(map) : explanation.steps,
    shortcut: explanation.shortcut ? { ...explanation.shortcut, title: map(explanation.shortcut.title), steps: explanation.shortcut.steps.map(map) } : explanation.shortcut,
    commonTrap: explanation.commonTrap ? { ...explanation.commonTrap, optionText: map(explanation.commonTrap.optionText), explanation: map(explanation.commonTrap.explanation) } : explanation.commonTrap,
    conclusion: explanation.conclusion ? map(explanation.conclusion) : explanation.conclusion,
  };
}

function localizedProseInMath(value: string): boolean {
  for (const hit of value.matchAll(/\\\(([\s\S]*?)\\\)/g)) if (/[\u0900-\u097F\u0A00-\u0A7F]/u.test(hit[1] ?? "")) return true;
  return false;
}

export function finalizeTmwCp011CorpusReview<T extends AnyQuestion>(question: T, qlId: string, language: Cp011ReviewLanguage): T {
  if ((question.canonicalProblemId ?? question.cpId) !== "TMW-CP-011") return question;
  const stem = fixStem(question, qlId, language);
  const options = Array.isArray(question.options) ? question.options.map((x: string) => cleanLine(x, language)) : question.options;
  const solution = question.solution ? { ...question.solution, answerText: cleanLine(question.solution.answerText ?? "", language) } : question.solution;
  const explanation = cleanExplanation(question.explanation, language);
  const existingLearner = question.learnerExplanation;
  const answer = cleanLine(existingLearner?.answer ?? solution?.answerText ?? "", language);
  const method = cleanLine(explanation?.opening ?? existingLearner?.method ?? "", language);
  const working = learnerWorking({ ...question, explanation }, language);
  const learner: TmwLearnerExplanationV2 = { method, solution: [...working, answer].slice(0, 5), answer };

  const errors = [...(question.validation?.errors ?? []).filter((x: string) => !x.startsWith("CP011 corpus review:"))];
  for (const error of validateTmwLearnerExplanationV2(learner)) errors.push(`CP011 corpus review: ${error}`);
  const surface = [stem, ...(options ?? []), solution?.answerText, learner.method, ...learner.solution, learner.answer,
    explanation?.opening, explanation?.formula, ...(explanation?.givens ?? []), ...(explanation?.steps ?? []), explanation?.conclusion].filter(Boolean).join(" ");
  if (localizedProseInMath(surface)) errors.push("CP011 corpus review: localized prose remains inside MathJax");
  if (/\bS\}/.test(surface)) errors.push("CP011 corpus review: malformed S brace remains");
  if (/(?:^|\s)S=tr_1\+\(n-t\)r_2(?:\s|$)/.test(surface)) errors.push("CP011 corpus review: raw threshold solver notation remains");

  return {
    ...question,
    stem,
    options,
    solution,
    learnerExplanationVersion: "TMW_LEARNER_V2",
    learnerExplanation: learner,
    explanation,
    validation: question.validation ? { ...question.validation, valid: errors.length === 0, errors } : question.validation,
    publiclyPublishable: false,
  } as T;
}
