import { add, compare, divide, equals, multiply, rational, rationalKey, subtract, toLatex } from "./rational";
import { runTmwCp014PresentationPipeline } from "./cp014-presentation-runtime";
import type { TmwLanguage } from "./types";

function deepMapStrings(value: any, transform: (text: string) => string): any {
  if (typeof value === "string") return transform(value);
  if (Array.isArray(value)) return value.map((item) => deepMapStrings(item, transform));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, deepMapStrings(item, transform)]));
  }
  return value;
}

function formatTankFraction(value: { numerator: number; denominator: number }): string {
  return value.denominator === 1 ? String(value.numerator) : `\\(${toLatex(value)}\\)`;
}

function rebuildTankFractionOptions(question: any): any {
  const answer = question.solution.answer;
  const one = rational(1);
  const candidates = [
    subtract(one, answer),
    divide(answer, rational(2)),
    multiply(answer, rational(2)),
    divide(add(one, answer), rational(2)),
    rational(1, 4),
    rational(1, 3),
    rational(2, 3),
    rational(3, 4),
  ];
  const used = new Set([rationalKey(answer)]);
  const wrong: any[] = [];
  for (const value of candidates) {
    if (compare(value, rational(0)) <= 0 || compare(value, one) > 0) continue;
    const key = rationalKey(value);
    if (used.has(key)) continue;
    used.add(key);
    wrong.push(value);
    if (wrong.length === 3) break;
  }
  if (wrong.length !== 3) throw new Error("Could not build three physical tank-fraction distractors");

  const correctIndex = question.correctIndex;
  const arranged = [...wrong];
  arranged.splice(correctIndex, 0, answer);
  const optionAudit = arranged.map((value: any) => ({
    text: formatTankFraction(value),
    value,
    misconceptionId: equals(value, answer) ? "CORRECT" : "PLAUSIBLE_SCALE_ERROR",
  }));
  const options = optionAudit.map((option: any) => option.text);
  const trapIndex = (correctIndex + 1) % 4;
  const errors = [...(question.validation?.errors ?? [])].filter((error: string) => !/option/i.test(error));
  if (new Set(options).size !== 4) errors.push("Final tank-fraction options are not unique");
  if (options[correctIndex] !== formatTankFraction(answer)) errors.push("Final tank-fraction answer-option mismatch");
  if (optionAudit.some((option: any) => compare(option.value, rational(0)) <= 0 || compare(option.value, one) > 0)) errors.push("Tank-fraction option lies outside the physical 0..1 range");

  return {
    ...question,
    options,
    optionAudit,
    solution: {
      ...question.solution,
      answerText: formatTankFraction(answer),
    },
    explanation: {
      ...question.explanation,
      commonTrap: {
        ...question.explanation.commonTrap,
        optionLabel: `Option ${"ABCD"[trapIndex]}`,
        optionText: options[trapIndex],
      },
    },
    validation: { valid: errors.length === 0, errors },
  };
}

function cp012Text(language: TmwLanguage, en: string, hi: string, pa: string): string {
  return language === "en" ? en : language === "hi" ? hi : pa;
}

function polishCp012(question: any, language: TmwLanguage): any {
  let polished = language === "en"
    ? deepMapStrings(question, (value) => value.replaceAll("required saved", "required time saved"))
    : question;

  const excludedMode = polished.solveMode === "findExcludedIndividualTimeFromAllTogetherAndSubgroup";
  const shortcutTitle = excludedMode
    ? cp012Text(language, "Quick Rate-Subtraction Method", "त्वरित दर-घटाव विधि", "ਤੇਜ਼ ਦਰ-ਘਟਾਓ ਵਿਧੀ")
    : cp012Text(language, "Quick Efficiency-Unit Method", "त्वरित दक्षता-इकाई विधि", "ਤੇਜ਼ ਕੁਸ਼ਲਤਾ-ਇਕਾਈ ਵਿਧੀ");

  const secondShortcutStep = excludedMode
    ? cp012Text(
        language,
        "The remaining rate belongs to C; take its reciprocal to get C's time.",
        "बची हुई दर C की है; उसका व्युत्क्रम लेने पर C का समय मिल जाता है।",
        "ਬਚੀ ਹੋਈ ਦਰ C ਦੀ ਹੈ; ਉਸਦਾ ਉਲਟ ਲੈਣ ਨਾਲ C ਦਾ ਸਮਾਂ ਮਿਲ ਜਾਂਦਾ ਹੈ।",
      )
    : cp012Text(
        language,
        "Change only A's efficiency by the stated percentage, add B's unchanged efficiency, and then compare the new time with the original if the question asks for a saving or delay.",
        "केवल A की दक्षता को दिए गए प्रतिशत से बदलें, B की अपरिवर्तित दक्षता जोड़ें और यदि समय-बचत या देरी पूछी गई हो तो नए समय की तुलना मूल समय से करें।",
        "ਸਿਰਫ਼ A ਦੀ ਕੁਸ਼ਲਤਾ ਨੂੰ ਦਿੱਤੇ ਪ੍ਰਤੀਸ਼ਤ ਅਨੁਸਾਰ ਬਦਲੋ, B ਦੀ ਨਾ-ਬਦਲੀ ਕੁਸ਼ਲਤਾ ਜੋੜੋ ਅਤੇ ਜੇ ਸਮਾਂ-ਬਚਤ ਜਾਂ ਦੇਰੀ ਪੁੱਛੀ ਹੋਵੇ ਤਾਂ ਨਵੇਂ ਸਮੇਂ ਦੀ ਮੂਲ ਸਮੇਂ ਨਾਲ ਤੁਲਨਾ ਕਰੋ।",
      );

  const trapText = polished.explanation.commonTrap.optionText;
  const trapExplanation = excludedMode
    ? cp012Text(
        language,
        `Choosing ${trapText} comes from operating directly on completion times instead of subtracting work rates.`,
        `${trapText} चुनना पूरा करने के समयों पर सीधे क्रिया करने की गलती से मिलता है; सही तरीका कार्य-दरों को घटाना है।`,
        `${trapText} ਚੁਣਨਾ ਪੂਰਾ ਕਰਨ ਦੇ ਸਮਿਆਂ ਉੱਤੇ ਸਿੱਧੀ ਕ੍ਰਿਆ ਕਰਨ ਦੀ ਗਲਤੀ ਤੋਂ ਮਿਲਦਾ ਹੈ; ਸਹੀ ਤਰੀਕਾ ਕੰਮ-ਦਰਾਂ ਨੂੰ ਘਟਾਉਣਾ ਹੈ।`,
      )
    : cp012Text(
        language,
        `Choosing ${trapText} treats A's percentage change as if it changed the whole team's rate or the completion time directly.`,
        `${trapText} चुनना A की दक्षता में बदलाव को पूरी टीम की दर या सीधे पूरा करने के समय पर लागू मानने की गलती है।`,
        `${trapText} ਚੁਣਨਾ A ਦੀ ਕੁਸ਼ਲਤਾ ਵਿੱਚ ਬਦਲਾਅ ਨੂੰ ਪੂਰੀ ਟੀਮ ਦੀ ਦਰ ਜਾਂ ਸਿੱਧੇ ਪੂਰਾ ਕਰਨ ਦੇ ਸਮੇਂ ਉੱਤੇ ਲਾਗੂ ਮੰਨਣ ਦੀ ਗਲਤੀ ਹੈ।`,
      );

  const answer = polished.solution.answerText;
  const conclusion = excludedMode
    ? cp012Text(language, `Therefore, C alone completes the work in ${answer}.`, `अतः C अकेला काम ${answer} में पूरा करता है।`, `ਇਸ ਲਈ C ਇਕੱਲਾ ਕੰਮ ${answer} ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ।`)
    : polished.solveMode === "findNewCombinedTimeAfterMemberEfficiencyIncrease"
      ? cp012Text(language, `Therefore, their new combined completion time is ${answer}.`, `अतः दोनों का नया संयुक्त समय ${answer} है।`, `ਇਸ ਲਈ ਦੋਵਾਂ ਦਾ ਨਵਾਂ ਸਾਂਝਾ ਸਮਾਂ ${answer} ਹੈ।`)
      : polished.solveMode === "findTimeSavedAfterMemberEfficiencyIncrease"
        ? cp012Text(language, `Therefore, the time saved is ${answer}.`, `अतः बचा हुआ समय ${answer} है।`, `ਇਸ ਲਈ ਬਚਿਆ ਹੋਇਆ ਸਮਾਂ ${answer} ਹੈ।`)
        : cp012Text(language, `Therefore, the completion is delayed by ${answer}.`, `अतः काम पूरा होने में ${answer} की देरी होती है।`, `ਇਸ ਲਈ ਕੰਮ ਪੂਰਾ ਹੋਣ ਵਿੱਚ ${answer} ਦੀ ਦੇਰੀ ਹੁੰਦੀ ਹੈ।`);

  polished = {
    ...polished,
    explanation: {
      ...polished.explanation,
      shortcut: {
        ...polished.explanation.shortcut,
        title: shortcutTitle,
        steps: [polished.explanation.shortcut.steps[0], secondShortcutStep],
      },
      commonTrap: {
        ...polished.explanation.commonTrap,
        explanation: trapExplanation,
      },
      conclusion,
    },
  };

  return polished;
}

function polishCp014(question: any, qlId: string, language: TmwLanguage): any {
  let polished = question;

  if (qlId === "TMW-QL-225") {
    const replacement = language === "en"
      ? ["base-worker-days", "base work units"]
      : language === "hi"
        ? ["आधार-कामगार-दिन", "आधार कार्य इकाइयाँ"]
        : ["ਆਧਾਰ-ਮਜ਼ਦੂਰ-ਦਿਨ", "ਆਧਾਰ ਕੰਮ ਇਕਾਈਆਂ"];
    polished = deepMapStrings(polished, (value) => value.replaceAll(replacement[0], replacement[1]));
    polished = {
      ...polished,
      solution: {
        ...polished.solution,
        answerType: "base-work-units",
      },
    };
  }

  if (language === "pa") {
    polished = deepMapStrings(polished, (value) => value.replaceAll("ਪੜਾਅਾਂ", "ਪੜਾਵਾਂ"));
  }

  if (qlId === "TMW-QL-226") {
    polished = rebuildTankFractionOptions(polished);
    if (language === "hi") {
      polished = deepMapStrings(polished, (value) => value
        .replace(/\binlet\b/giu, "प्रवेश पाइप")
        .replace(/\boutlet\b/giu, "निकास पाइप")
        .replace(/\bnet\b/giu, "शुद्ध")
        .replace(/(\d+) h\b/gu, "$1 घंटे"));
    }
    if (language === "pa") {
      polished = deepMapStrings(polished, (value) => value
        .replace(/\binlet\b/giu, "ਭਰਨ ਵਾਲੀ ਪਾਈਪ")
        .replace(/\boutlet\b/giu, "ਖਾਲੀ ਕਰਨ ਵਾਲੀ ਪਾਈਪ")
        .replace(/\bnet\b/giu, "ਸ਼ੁੱਧ")
        .replace(/(\d+) h\b/gu, "$1 ਘੰਟੇ"));
    }
  }

  if (qlId === "TMW-QL-227" || qlId === "TMW-QL-228") {
    polished = {
      ...polished,
      groupGenerationRequired: true,
      caseletItemIndex: qlId === "TMW-QL-227" ? 0 : 1,
    };
  }

  const shortcutTitle = cp012Text(language, "Structured-data shortcut", "संरचित-डेटा त्वरित विधि", "ਸੰਰਚਿਤ-ਡਾਟਾ ਤੇਜ਼ ਵਿਧੀ");
  const trapText = polished.explanation.commonTrap.optionText;
  const trapExplanation = cp012Text(
    language,
    `Choosing ${trapText} can result from skipping a row or stage, or from combining raw numbers before accounting for time, efficiency, or direction.`,
    `${trapText} चुनना किसी पंक्ति या चरण को छोड़ने, अथवा समय, दक्षता या दिशा को ध्यान में रखने से पहले संख्याएँ जोड़ देने की गलती से हो सकता है।`,
    `${trapText} ਚੁਣਨਾ ਕਿਸੇ ਕਤਾਰ ਜਾਂ ਪੜਾਅ ਨੂੰ ਛੱਡਣ, ਜਾਂ ਸਮਾਂ, ਕੁਸ਼ਲਤਾ ਜਾਂ ਦਿਸ਼ਾ ਦਾ ਧਿਆਨ ਰੱਖਣ ਤੋਂ ਪਹਿਲਾਂ ਗਿਣਤੀਆਂ ਜੋੜ ਦੇਣ ਦੀ ਗਲਤੀ ਨਾਲ ਹੋ ਸਕਦਾ ਹੈ।`,
  );

  polished = {
    ...polished,
    explanation: {
      ...polished.explanation,
      shortcut: {
        ...polished.explanation.shortcut,
        title: shortcutTitle,
      },
      commonTrap: {
        ...polished.explanation.commonTrap,
        optionLabel: cp012Text(language, "Common trap", "सामान्य गलती", "ਆਮ ਗਲਤੀ"),
        explanation: trapExplanation,
      },
    },
  };

  return polished;
}

export function polishTmw001ExtensionQuestion(question: any, qlId: string, language: TmwLanguage): any {
  const ordinal = Number(qlId.slice(-3));
  if (ordinal >= 212 && ordinal <= 215) return polishCp012(question, language);
  if (ordinal >= 224 && ordinal <= 228) return polishCp014(question, qlId, language);
  return question;
}

export function runTmwCp014CaseletGroup(input: { seed: string; language: TmwLanguage }) {
  const qlIds = ["TMW-QL-227", "TMW-QL-228"] as const;
  const questions = qlIds.map((questionLanguageId) => polishTmw001ExtensionQuestion(
    runTmwCp014PresentationPipeline({ questionLanguageId, seed: input.seed, language: input.language }),
    questionLanguageId,
    input.language,
  ));
  if (questions[0].caseletStimulus !== questions[1].caseletStimulus) {
    throw new Error("TMW-CASELET-001 grouped generation produced inconsistent stimuli");
  }
  return {
    caseletGroupId: "TMW-CASELET-001" as const,
    language: input.language,
    seed: input.seed,
    stimulus: questions[0].caseletStimulus,
    questions,
  };
}