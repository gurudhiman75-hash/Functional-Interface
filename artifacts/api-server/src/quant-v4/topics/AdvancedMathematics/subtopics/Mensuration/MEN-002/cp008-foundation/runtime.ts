import { exactKey, formatWithUnit } from "../foundation/exact";
import {
  classifyMenCp008Difficulty,
  generateMenCp008Prototype as generateLegacyMenCp008Prototype,
} from "./legacy-runtime";
import type {
  MenCp008Option,
  MenCp008Package,
  MenCp008PrototypeId,
} from "./types";

export { classifyMenCp008Difficulty };

function replaceCurrency(text: string) {
  return text
    .replace(/\\text\{£\}/g, "\\text{₹}")
    .replace(/\\text\{ £\}/g, "\\text{₹}")
    .replace(/£/g, "₹");
}

function rebuildTrapDisplays(
  traps: readonly string[],
  options: readonly MenCp008Option[],
) {
  return traps.map((trap) => {
    const match = trap.match(/^Option ([A-D]) \(.+\): (Common mistake:.*)$/);
    if (!match) return replaceCurrency(trap);
    const label = match[1] as MenCp008Option["label"];
    const option = options.find((candidate) => candidate.label === label);
    return option
      ? `Option ${label} (${option.display}): ${replaceCurrency(match[2]!)}`
      : replaceCurrency(trap);
  });
}

function validateIndianPackage(question: Omit<MenCp008Package, "validation">) {
  const explanationText = [
    question.explanation.keyRule,
    ...question.explanation.steps.flatMap((step) => [step.title, step.body, step.equation ?? ""]),
    question.explanation.shortcut,
    ...question.explanation.traps,
  ].join("\n");
  const learnerText = [
    question.stem,
    ...question.options.map((option) => option.display),
    question.answer,
    explanationText,
  ].join("\n");
  const policyConsistent = question.piPolicy === "EXACT_PI"
    ? !/3\.14|22\s*\/\s*7/.test(learnerText)
    : question.piPolicy === "PI_22_OVER_7"
      ? learnerText.includes("22") && learnerText.includes("7")
      : learnerText.includes("3.14");
  const isCost = question.target === "COST";
  const checks = [
    { name: "independent verifier", passed: question.verification.valid, message: "Independent verification must agree with the answer." },
    { name: "four exact options", passed: question.options.length === 4 && new Set(question.options.map((option) => exactKey(option.value))).size === 4, message: "Exactly four unique exact options are required." },
    { name: "four displayed options", passed: new Set(question.options.map((option) => option.display)).size === 4, message: "All four displayed options must remain unique." },
    { name: "one correct option", passed: question.options.filter((option) => option.isCorrect).length === 1 && question.options[question.correctIndex]?.isCorrect === true, message: "Exactly one option must be correct at the declared index." },
    { name: "answer display", passed: question.answer === question.options[question.correctIndex]?.display, message: "The answer must equal the displayed correct option." },
    { name: "state-derived difficulty", passed: question.difficulty === classifyMenCp008Difficulty(question.state), message: "Difficulty must derive from canonical state." },
    { name: "declared pi policy", passed: policyConsistent, message: "Learner text must match the generated pi policy." },
    { name: "four-tier teaching", passed: Boolean(question.explanation.keyRule) && question.explanation.steps.length >= 2 && Boolean(question.explanation.shortcut) && question.explanation.traps.length === 3, message: "Rule, steps, shortcut and three option-specific traps are required." },
    { name: "MathJax cleanliness", passed: !/[½¼²³]/.test(learnerText) && !/(^|[^\\])sqrt\{/.test(explanationText) && !/\$\$[^$]*\/[^$]*\$\$/.test(explanationText), message: "Use MathJax fractions, powers, roots and division." },
    { name: "control characters", passed: !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(learnerText), message: "Learner text must not contain hidden control characters." },
    { name: "Indian currency", passed: !/[£€¥]/.test(learnerText) && (!isCost || (question.unit === "₹" && learnerText.includes("₹"))), message: "Indian exam cost content must use rupees and no foreign currency." },
    { name: "lifecycle lock", passed: question.permanentQlId === null && !question.publiclyPublishable && !question.questionStudioDiscoverable, message: "Prototype packages must remain unallocated and unpublished." },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp008Prototype(
  prototypeId: MenCp008PrototypeId,
  seed: string,
): MenCp008Package {
  const legacy = generateLegacyMenCp008Prototype(prototypeId, seed);
  const isLegacyCost = legacy.unit === ("£" as never);

  if (!isLegacyCost) {
    const partial = {
      ...legacy,
      validation: undefined,
    } as Omit<MenCp008Package, "validation"> & { validation?: undefined };
    const { validation: _ignored, ...question } = partial;
    return { ...question, validation: validateIndianPackage(question) };
  }

  const options = legacy.options.map((option) => ({
    ...option,
    display: formatWithUnit(option.value, "₹"),
  }));
  const correctIndex = legacy.correctIndex;
  const state = { ...legacy.state, unit: "₹" as const };
  const explanation = {
    keyRule: replaceCurrency(legacy.explanation.keyRule),
    steps: legacy.explanation.steps.map((step) => ({
      ...step,
      title: replaceCurrency(step.title),
      body: replaceCurrency(step.body),
      ...(step.equation ? { equation: replaceCurrency(step.equation) } : {}),
    })),
    shortcut: replaceCurrency(legacy.explanation.shortcut),
    traps: rebuildTrapDisplays(legacy.explanation.traps, options),
  };
  const question = {
    ...legacy,
    stem: replaceCurrency(legacy.stem),
    options,
    correctIndex,
    answer: options[correctIndex]!.display,
    unit: "₹" as const,
    explanation,
    state,
  };
  const { validation: _legacyValidation, ...partial } = question;
  return { ...partial, validation: validateIndianPackage(partial) };
}
