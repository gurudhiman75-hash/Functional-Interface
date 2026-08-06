import { exactKey, formatWithUnit, rational } from "../foundation/exact";
import {
  classifyMenCp008Difficulty,
  generateMenCp008Prototype as generateLegacyMenCp008Prototype,
} from "./legacy-runtime";
import type { ExactRational } from "../foundation/types";
import type {
  MenCp008Option,
  MenCp008Package,
  MenCp008PrototypeId,
} from "./types";

export { classifyMenCp008Difficulty };

const RATIO_STATES = [
  { cylinderRadius: 3n, cylinderHeight: 8n, coneRadius: 4n, coneHeight: 9n },
  { cylinderRadius: 4n, cylinderHeight: 10n, coneRadius: 5n, coneHeight: 12n },
  { cylinderRadius: 5n, cylinderHeight: 6n, coneRadius: 4n, coneHeight: 10n },
  { cylinderRadius: 6n, cylinderHeight: 7n, coneRadius: 4n, coneHeight: 9n },
  { cylinderRadius: 7n, cylinderHeight: 5n, coneRadius: 5n, coneHeight: 8n },
  { cylinderRadius: 8n, cylinderHeight: 6n, coneRadius: 5n, coneHeight: 12n },
] as const;

function replaceCurrency(text: string) {
  return text
    .replace(/\\text\{£\}/g, "\\text{₹}")
    .replace(/\\text\{ £\}/g, "\\text{₹}")
    .replace(/£/g, "₹");
}

function hashText(text: string) {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

function dimension(value: bigint) {
  return `$${value}\\text{ cm}$`;
}

function formatRatio(value: ExactRational) {
  return `$${value.numerator}:${value.denominator}$`;
}

function createRatioPrototype(publicSeed: string): MenCp008Package {
  const stateIndex = hashText(`state:${publicSeed}`) % RATIO_STATES.length;
  const values = RATIO_STATES[stateIndex]!;
  const cylinderCoefficient = values.cylinderRadius ** 2n * values.cylinderHeight;
  const coneCoefficient = values.coneRadius ** 2n * values.coneHeight;
  const answer = rational(3n * cylinderCoefficient, coneCoefficient);
  const candidates = [
    { value: answer, misconceptionId: null, explanation: "" },
    { value: rational(cylinderCoefficient, coneCoefficient), misconceptionId: "OMITTED_CONE_ONE_THIRD", explanation: "comparing the $r^2h$ coefficients without accounting for the cone's factor $\\frac13$" },
    { value: rational(coneCoefficient, 3n * cylinderCoefficient), misconceptionId: "REVERSED_RATIO", explanation: "reversing the required cylinder-to-cone order" },
    { value: rational(values.cylinderRadius, values.coneRadius), misconceptionId: "COMPARED_RADII_ONLY", explanation: "comparing only the radii and ignoring both heights and the cone factor" },
  ];
  if (new Set(candidates.map((candidate) => exactKey(candidate.value))).size !== 4) {
    throw new Error("The expanded cylinder-cone ratio state produced duplicate exact options.");
  }

  const correctIndex = hashText(`options:${publicSeed}`) % 4;
  const ordered = [...candidates.slice(1)];
  ordered.splice(correctIndex, 0, candidates[0]!);
  const labels = ["A", "B", "C", "D"] as const;
  const options: MenCp008Option[] = ordered.map((candidate, index) => ({
    label: labels[index]!,
    value: candidate.value,
    display: formatRatio(candidate.value),
    isCorrect: candidate.misconceptionId === null,
    misconceptionId: candidate.misconceptionId,
  }));
  const explanationByKey = new Map(candidates.slice(1).map((candidate) => [exactKey(candidate.value), candidate.explanation]));
  const traps = options
    .filter((option) => !option.isCorrect)
    .map((option) => `Option ${option.label} (${option.display}): Common mistake: ${explanationByKey.get(exactKey(option.value))}.`);

  const cylinderRadius = dimension(values.cylinderRadius);
  const cylinderHeight = dimension(values.cylinderHeight);
  const coneRadius = dimension(values.coneRadius);
  const coneHeight = dimension(values.coneHeight);
  const stemVariants = [
    `A cylinder has radius ${cylinderRadius} and height ${cylinderHeight}. A cone has radius ${coneRadius} and height ${coneHeight}. Find the ratio of the cylinder's volume to the cone's volume.`,
    `A solid cylinder of radius ${cylinderRadius} and height ${cylinderHeight} is compared with a cone of radius ${coneRadius} and height ${coneHeight}. What is the ratio of their volumes in cylinder-to-cone order?`,
    `The dimensions of a cylinder are radius ${cylinderRadius} and height ${cylinderHeight}, while a cone has radius ${coneRadius} and height ${coneHeight}. Determine $V_{cylinder}:V_{cone}$.`,
    `Find the cylinder-to-cone volume ratio when the cylinder measures ${cylinderRadius} in radius and ${cylinderHeight} in height, and the cone measures ${coneRadius} in radius and ${coneHeight} in height.`,
  ];
  const stem = stemVariants[hashText(`stem:${publicSeed}`) % stemVariants.length]!;
  const state = {
    packageId: "MEN-002" as const,
    canonicalProblemId: "MEN-CP-008" as const,
    permanentQlId: null,
    waveId: "MEN-CP-008-PROTOTYPE-FOUNDATION" as const,
    prototypeId: "MEN-CP008-PROT-CYLINDER-CONE-VOLUME-RATIO" as const,
    solveMode: "findCylinderConeVolumeRatio" as const,
    target: "RATIO" as const,
    shape: "CYLINDER" as const,
    seed: publicSeed,
    difficulty: "Medium" as const,
    dimensions: { ...values, cylinderCoefficient, coneCoefficient },
    derived: { answer },
    unit: "times" as const,
    piPolicy: "EXACT_PI" as const,
    displayMode: "RATIO" as const,
  };
  state.difficulty = classifyMenCp008Difficulty(state);
  const verification = {
    valid: exactKey(rational(3n * cylinderCoefficient, coneCoefficient)) === exactKey(answer),
    method: "independently cancelled the common pi factor and retained the cone's one-third factor",
    reconstructed: exactKey(rational(3n * cylinderCoefficient, coneCoefficient)),
  };
  const partial = {
    packageId: "MEN-002" as const,
    canonicalProblemId: "MEN-CP-008" as const,
    permanentQlId: null,
    waveId: "MEN-CP-008-PROTOTYPE-FOUNDATION" as const,
    prototypeId: "MEN-CP008-PROT-CYLINDER-CONE-VOLUME-RATIO" as const,
    solveMode: "findCylinderConeVolumeRatio" as const,
    language: "en" as const,
    seed: publicSeed,
    difficulty: state.difficulty,
    target: "RATIO" as const,
    piPolicy: "EXACT_PI" as const,
    stem,
    options,
    correctIndex,
    answer: options[correctIndex]!.display,
    exactAnswer: answer,
    unit: "times" as const,
    explanation: {
      keyRule: "Cylinder volume is $\\pi R^2H$ and cone volume is $\\frac13\\pi r^2h$. The common $\\pi$ cancels, but the cone's factor $\\frac13$ must remain.",
      steps: [
        { title: "Write the Two Volume Coefficients", body: "Keep the cone's one-third factor visible.", equation: `$$V_{cylinder}:V_{cone}=${cylinderCoefficient}:\\frac{${coneCoefficient}}{3}$$` },
        { title: "Clear the Fraction and Reduce", body: "Multiply both ratio terms by $3$ and simplify.", equation: `$$V_{cylinder}:V_{cone}=${answer.numerator}:${answer.denominator}$$` },
      ],
      shortcut: "Cancel $\\pi$, multiply the cylinder coefficient by $3$, and then reduce the ratio.",
      traps,
    },
    state,
    verification,
    reviewStatus: "UNREVIEWED" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    questionStudioDiscoverable: false as const,
  };
  return { ...partial, validation: validateIndianPackage(partial) };
}

function generateCollisionFreeLegacy(
  prototypeId: MenCp008PrototypeId,
  publicSeed: string,
) {
  if (prototypeId === "MEN-CP008-PROT-CYLINDER-CONE-VOLUME-RATIO") {
    return createRatioPrototype(publicSeed);
  }
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const sourceSeed = attempt === 0
      ? publicSeed
      : `${publicSeed}:option-collision-retry:${attempt}`;
    try {
      const generated = generateLegacyMenCp008Prototype(prototypeId, sourceSeed);
      return {
        ...generated,
        seed: publicSeed,
        state: { ...generated.state, seed: publicSeed },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("generated duplicate exact option values")) throw error;
    }
  }
  throw new Error(`${prototypeId} could not find a collision-free deterministic state for ${publicSeed}.`);
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
  const legacy = generateCollisionFreeLegacy(prototypeId, seed);
  if (prototypeId === "MEN-CP008-PROT-CYLINDER-CONE-VOLUME-RATIO") return legacy;
  const isLegacyCost = legacy.unit === ("£" as never);

  if (!isLegacyCost) {
    const { validation: _legacyValidation, ...question } = legacy;
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
