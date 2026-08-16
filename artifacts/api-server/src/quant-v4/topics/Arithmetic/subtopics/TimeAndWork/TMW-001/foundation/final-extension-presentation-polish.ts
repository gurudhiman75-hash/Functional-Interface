import { add, compare, divide, equals, multiply, rational, rationalKey, subtract, toLatex } from "./rational";
import { runTmwCp014PresentationPipeline } from "./cp014-presentation-runtime";
import { finalizeTmwCp012MultilingualEditorialReview } from "./cp012-multilingual-editorial-finalizer";
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

function polishCp012(question: any, qlId: string, language: TmwLanguage): any {
  return finalizeTmwCp012MultilingualEditorialReview(question, qlId, language);
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
  }

  if (qlId === "TMW-QL-227" || qlId === "TMW-QL-228") {
    polished = {
      ...polished,
      groupGenerationRequired: true,
      caseletItemIndex: qlId === "TMW-QL-227" ? 0 : 1,
    };
  }

  return polished;
}

export function polishTmw001ExtensionQuestion(question: any, qlId: string, language: TmwLanguage): any {
  const ordinal = Number(qlId.slice(-3));
  if (ordinal >= 212 && ordinal <= 215) return polishCp012(question, qlId, language);
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
