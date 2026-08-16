import type { ExactTrigNumber } from "../foundation/types";
import {
  addExact,
  assertDefined,
  exactInteger,
  exactKey,
  exactRational,
  exactToNumber,
  formatExactPlain,
  multiplyExact,
  powerExact,
  subtractExact,
} from "../foundation/exact";
import { degree, toDegrees } from "../foundation/angle";
import { requireTrigExact } from "../foundation/standard-values";
import {
  TRG_001_MVP_REGISTRY,
  generateTrg001MvpQuestion,
  type Trg001MvpQuestion,
} from "./mvp-runtime";

const TRIPLES = [
  { o: 3, a: 4, h: 5 },
  { o: 5, a: 12, h: 13 },
  { o: 8, a: 15, h: 17 },
  { o: 7, a: 24, h: 25 },
  { o: 20, a: 21, h: 29 },
] as const;

type ReviewedStep = { title: string; body: string; equation?: string };

type NumberAnswer = { kind: "NUMBER"; value: ExactTrigNumber; unit: "NONE" | "UNITS" | "SQUARE_UNITS" };

function hash(text: string) {
  let value = 2166136261;
  for (const character of text) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function pickTriple(seed: string, qlId: string) {
  return TRIPLES[hash(`${seed}|${qlId}|reviewed-triple`) % TRIPLES.length];
}

function shuffle<T>(seed: string, values: T[]) {
  let state = hash(seed) || 1;
  for (let index = values.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const target = state % (index + 1);
    [values[index], values[target]] = [values[target], values[index]];
  }
  return values;
}

function sq(value: ExactTrigNumber) {
  return assertDefined(powerExact(value, 2));
}

function numberAnswer(value: ExactTrigNumber, unit: NumberAnswer["unit"] = "NONE"): NumberAnswer {
  return { kind: "NUMBER", value, unit };
}

function showNumber(answer: NumberAnswer) {
  const value = formatExactPlain(answer.value);
  if (answer.unit === "UNITS") return `${value} units`;
  if (answer.unit === "SQUARE_UNITS") return `${value} square units`;
  return value;
}

function answerKey(answer: any) {
  if (answer.kind === "NUMBER") return `NUMBER:${answer.unit}:${exactKey(answer.value)}`;
  const degrees = toDegrees(answer.value);
  return `ANGLE:${degrees.numerator}/${degrees.denominator}`;
}

function numericVerification(expected: ExactTrigNumber, reconstructed: number, method: string) {
  const actual = exactToNumber(expected);
  const delta = Math.abs(actual - reconstructed);
  return {
    valid: Number.isFinite(reconstructed) && delta <= 1e-10,
    method,
    expected: exactKey(expected),
    reconstructed: `NUM:${reconstructed}`,
    numericDelta: delta,
  };
}

function buildOptions(seed: string, qlId: string, correct: NumberAnswer, wrong: Array<{ value: NumberAnswer; misconceptionId: string }>) {
  const raw = [
    { value: correct, isCorrect: true, misconceptionId: null as string | null },
    ...wrong.map((entry) => ({ ...entry, isCorrect: false })),
  ];
  if (raw.length !== 4) throw new Error(`${qlId}: reviewed replacement requires four options.`);
  if (new Set(raw.map((entry) => answerKey(entry.value))).size !== 4) {
    throw new Error(`${qlId}: reviewed replacement has an equivalent option collision.`);
  }
  const options = shuffle(`${seed}|${qlId}|reviewed-options`, raw).map((entry, index) => ({
    label: (["A", "B", "C", "D"] as const)[index],
    value: entry.value,
    display: showNumber(entry.value),
    isCorrect: entry.isCorrect,
    misconceptionId: entry.misconceptionId,
  }));
  return { options, correctIndex: options.findIndex((option) => option.isCorrect) };
}

function replaceDuplicateFamily(question: any) {
  const { qlId, seed } = question;

  if (qlId === "TRG-001-QL-034") {
    const angle = Number(question.canonicalState.angle);
    const complement = 90 - angle;
    const sinSquared = sq(requireTrigExact("SIN", degree(angle)));
    const cosSquared = sq(requireTrigExact("COS", degree(complement)));
    const correct = numberAnswer(addExact(sinSquared, cosSquared));
    const built = buildOptions(seed, qlId, correct, [
      { value: numberAnswer(exactInteger(1)), misconceptionId: "ASSUMED_SAME_ANGLE_IDENTITY" },
      { value: numberAnswer(sinSquared), misconceptionId: "USED_ONE_TERM" },
      { value: numberAnswer(exactInteger(2)), misconceptionId: "ADDED_MAXIMUM_VALUES" },
    ]);
    return {
      ...question,
      stem: `Evaluate exactly: sin²${angle}° + cos²${complement}°.` ,
      ...built,
      answer: showNumber(correct),
      exactAnswer: correct,
      canonicalState: { angle, complement },
      verification: numericVerification(
        correct.value,
        Math.sin(angle * Math.PI / 180) ** 2 + Math.cos(complement * Math.PI / 180) ** 2,
        "REVIEWED_DISTINCT_STANDARD_POWER_CHECK",
      ),
      explanation: {
        keyRule: "Evaluate the two standard-angle squares separately.",
        steps: [
          { title: "First term", body: `Find sin²${angle}° from the standard value of sin ${angle}°.` },
          { title: "Second term", body: `Find cos²${complement}° from the standard value of cos ${complement}°.` },
          { title: "Add", body: `Adding the two exact squares gives ${showNumber(correct)}.` },
        ],
        shortcut: "These are different angles, so do not apply sin²θ+cos²θ=1 automatically.",
        traps: ["The Pythagorean identity requires the same angle in both terms."],
      },
    };
  }

  if (qlId === "TRG-001-QL-073") {
    const o = Number(question.canonicalState.sinN);
    const h = Number(question.canonicalState.sinD);
    const a = Number(question.canonicalState.a);
    const correct = numberAnswer(exactRational(a * a, h * h));
    const built = buildOptions(seed, qlId, correct, [
      { value: numberAnswer(exactRational(a, h)), misconceptionId: "RETURNED_COS_NOT_COS_SQUARED" },
      { value: numberAnswer(exactRational(o * o, h * h)), misconceptionId: "RETURNED_SIN_SQUARED" },
      { value: numberAnswer(exactRational(h * h, a * a)), misconceptionId: "USED_SEC_SQUARED" },
    ]);
    return {
      ...question,
      stem: `If sin θ = ${o}/${h}, find cos²θ.` ,
      ...built,
      answer: showNumber(correct),
      exactAnswer: correct,
      canonicalState: { sinN: o, sinD: h, adjacent: a },
      verification: numericVerification(correct.value, 1 - (o / h) ** 2, "REVIEWED_PYTHAGOREAN_IDENTITY_CHECK"),
      explanation: {
        keyRule: "Use sin²θ + cos²θ = 1.",
        steps: [
          { title: "Square the given ratio", body: `sin²θ = (${o}/${h})².` },
          { title: "Isolate cos²θ", body: `cos²θ = 1 − (${o}/${h})².` },
          { title: "Simplify", body: `The exact value is ${showNumber(correct)}.` },
        ],
        shortcut: "Because the target is cos²θ, no square-root sign decision is needed.",
        traps: ["Do not return cosθ when the question asks for cos²θ."],
      },
    };
  }

  if (qlId === "TRG-001-QL-080") {
    const o = Number(question.canonicalState.o);
    const a = Number(question.canonicalState.a);
    const h = Number(question.canonicalState.h);
    const correct = numberAnswer(exactRational(o * o, a * a));
    const built = buildOptions(seed, qlId, correct, [
      { value: numberAnswer(exactRational(h * h, a * a)), misconceptionId: "RETURNED_SEC_SQUARED" },
      { value: numberAnswer(exactRational(o, a)), misconceptionId: "FORGOT_TO_SQUARE_TAN" },
      { value: numberAnswer(exactRational(a * a, o * o)), misconceptionId: "USED_COT_SQUARED" },
    ]);
    return {
      ...question,
      stem: `If sec θ = ${h}/${a}, find tan²θ.` ,
      ...built,
      answer: showNumber(correct),
      exactAnswer: correct,
      canonicalState: { secN: h, secD: a, opposite: o },
      verification: numericVerification(correct.value, (h / a) ** 2 - 1, "REVIEWED_REVERSE_SECANT_IDENTITY_CHECK"),
      explanation: {
        keyRule: "Use sec²θ − tan²θ = 1.",
        steps: [
          { title: "Square secant", body: `sec²θ = (${h}/${a})².` },
          { title: "Rearrange", body: `tan²θ = sec²θ − 1.` },
          { title: "Simplify", body: `Therefore tan²θ = ${showNumber(correct)}.` },
        ],
        shortcut: "This is the reverse direction of 1+tan²θ=sec²θ.",
        traps: ["The target is tan²θ, not tanθ."],
      },
    };
  }

  if (qlId === "TRG-001-QL-102") {
    const o = Number(question.canonicalState.o);
    const a = Number(question.canonicalState.a);
    const h = Math.round(Math.sqrt(o * o + a * a));
    const correct = numberAnswer(exactRational(o + a, h));
    const built = buildOptions(seed, qlId, correct, [
      { value: numberAnswer(exactRational(o - a, h)), misconceptionId: "SUBTRACTED_COMPONENTS" },
      { value: numberAnswer(exactRational(h, o + a)), misconceptionId: "RECIPROCAL_SUM" },
      { value: numberAnswer(exactRational(o, h)), misconceptionId: "RETURNED_SIN" },
    ]);
    return {
      ...question,
      stem: `If tan θ = ${o}/${a} and θ is acute, find sin θ + cos θ.` ,
      ...built,
      answer: showNumber(correct),
      exactAnswer: correct,
      canonicalState: { opposite: o, adjacent: a, hypotenuse: h },
      verification: numericVerification(correct.value, o / h + a / h, "REVIEWED_DERIVED_SUM_CHECK"),
      explanation: {
        keyRule: "Convert the tangent ratio into a right triangle.",
        steps: [
          { title: "Build the triangle", body: `Take opposite:adjacent = ${o}:${a}; the hypotenuse is ${h}.` },
          { title: "Write sine and cosine", body: `sinθ=${o}/${h} and cosθ=${a}/${h}.` },
          { title: "Add", body: `sinθ+cosθ=(${o}+${a})/${h}=${showNumber(correct)}.` },
        ],
        shortcut: "Both ratios have the same hypotenuse denominator once the triangle is reconstructed.",
        traps: ["Do not use the tangent denominator as the denominator of sine and cosine."],
      },
    };
  }

  if (qlId === "TRG-001-QL-129") {
    const triple = pickTriple(seed, qlId);
    const correct = numberAnswer(exactRational(2 * triple.o * triple.a, triple.h * triple.h));
    const built = buildOptions(seed, qlId, correct, [
      { value: numberAnswer(exactRational(triple.o * triple.a, triple.h * triple.h)), misconceptionId: "DROPPED_FACTOR_TWO" },
      { value: numberAnswer(exactRational(2 * triple.o * triple.o, triple.h * triple.h)), misconceptionId: "USED_TWO_SIN_SQUARED" },
      { value: numberAnswer(exactRational(triple.a * triple.a - triple.o * triple.o, triple.h * triple.h)), misconceptionId: "USED_COS_DOUBLE_ANGLE" },
    ]);
    return {
      ...question,
      stem: `If sin θ = ${triple.o}/${triple.h} and cos θ = ${triple.a}/${triple.h}, find sin 2θ.` ,
      ...built,
      answer: showNumber(correct),
      exactAnswer: correct,
      canonicalState: { o: triple.o, a: triple.a, h: triple.h },
      verification: numericVerification(correct.value, 2 * triple.o * triple.a / (triple.h * triple.h), "REVIEWED_DOUBLE_ANGLE_RATIO_CHECK"),
      explanation: {
        keyRule: "Use sin 2θ = 2 sinθ cosθ.",
        steps: [
          { title: "Substitute", body: `sin2θ = 2×(${triple.o}/${triple.h})×(${triple.a}/${triple.h}).` },
          { title: "Multiply", body: `The numerator is 2×${triple.o}×${triple.a} and the denominator is ${triple.h}².` },
          { title: "Simplify", body: `Hence sin2θ = ${showNumber(correct)}.` },
        ],
        shortcut: "When both sinθ and cosθ are given, the sine double-angle identity is direct.",
        traps: ["Do not omit the factor 2."],
      },
    };
  }

  return question;
}

function removeInformationLeak(question: any) {
  const angle = Number(question.canonicalState.angle);
  if (!["TRG-001-QL-103", "TRG-001-QL-104", "TRG-001-QL-107", "TRG-001-QL-108"].includes(question.qlId)) {
    return question;
  }

  if (question.qlId === "TRG-001-QL-103") {
    const given = subtractExact(requireTrigExact("SEC", degree(angle)), requireTrigExact("TAN", degree(angle)));
    return { ...question, stem: `If sec θ − tan θ = ${formatExactPlain(given)}, find sec θ + tan θ.` };
  }
  if (question.qlId === "TRG-001-QL-104") {
    const given = subtractExact(requireTrigExact("COSEC", degree(angle)), requireTrigExact("COT", degree(angle)));
    return { ...question, stem: `If cosec θ − cot θ = ${formatExactPlain(given)}, find cosec θ + cot θ.` };
  }
  if (question.qlId === "TRG-001-QL-107") {
    const given = addExact(requireTrigExact("SEC", degree(angle)), requireTrigExact("TAN", degree(angle)));
    return { ...question, stem: `If sec θ + tan θ = ${formatExactPlain(given)}, find sec θ − tan θ.` };
  }
  const given = addExact(requireTrigExact("COSEC", degree(angle)), requireTrigExact("COT", degree(angle)));
  return { ...question, stem: `If cosec θ + cot θ = ${formatExactPlain(given)}, find cosec θ − cot θ.` };
}

function polishStem(question: any) {
  const state = question.canonicalState;
  switch (question.qlId) {
    case "TRG-001-QL-006":
      return { ...question, stem: `In a right triangle, the side opposite θ is ${state.o} units and the adjacent side is ${state.a} units. Find tan θ.` };
    case "TRG-001-QL-007":
      return { ...question, stem: `In a right triangle, the side adjacent to θ is ${state.a} units and the opposite side is ${state.o} units. Find cot θ.` };
    case "TRG-001-QL-008":
      return { ...question, stem: `In a right triangle, the side adjacent to θ is ${state.a} units and the hypotenuse is ${state.h} units. Find sec θ.` };
    case "TRG-001-QL-009":
      return { ...question, stem: `In a right triangle, the side opposite θ is ${state.o} units and the hypotenuse is ${state.h} units. Find cosec θ.` };
    case "TRG-001-QL-130":
      return { ...question, stem: `Evaluate exactly: cos²${state.theta}° − sin²${state.theta}°.` };
    default:
      return question;
  }
}

function hardSteps(question: any): ReviewedStep[] | null {
  const answer = question.answer;
  const state = question.canonicalState;
  switch (question.qlId) {
    case "TRG-001-QL-097":
      return [
        { title: "Use the tangent ratio", body: `tanθ=${state.a}/${state.b}, so take opposite:adjacent = ${state.a}:${state.b}.` },
        { title: "Write sine and cosine", body: `Both sinθ and cosθ have the same hypotenuse denominator.` },
        { title: "Cancel the common denominator", body: `The required ratio becomes (${state.a}+${state.b})/(${state.a}−${state.b}).` },
        { title: "Answer", body: `After simplification, the value is ${answer}.` },
      ];
    case "TRG-001-QL-100":
      return [
        { title: "Square the given sum", body: `(sinθ+cosθ)² = sin²θ+cos²θ+2sinθcosθ.` },
        { title: "Use the identity", body: `Replace sin²θ+cos²θ by 1.` },
        { title: "Isolate the target", body: `2sinθcosθ = (given value)²−1.` },
        { title: "Answer", body: `This gives ${answer}.` },
      ];
    case "TRG-001-QL-103":
    case "TRG-001-QL-107":
      return [
        { title: "Use the conjugate identity", body: `(secθ+tanθ)(secθ−tanθ)=sec²θ−tan²θ=1.` },
        { title: "Use the given conjugate", body: `Therefore the required conjugate is the reciprocal of the given value.` },
        { title: "Answer", body: `The exact value is ${answer}.` },
      ];
    case "TRG-001-QL-104":
    case "TRG-001-QL-108":
      return [
        { title: "Use the conjugate identity", body: `(cosecθ+cotθ)(cosecθ−cotθ)=cosec²θ−cot²θ=1.` },
        { title: "Use the given conjugate", body: `The required conjugate is its reciprocal.` },
        { title: "Answer", body: `The exact value is ${answer}.` },
      ];
    case "TRG-001-QL-105":
      return [
        { title: "Square the given expression", body: `(sinθ+cosθ)²=sin²θ+cos²θ+2sinθcosθ.` },
        { title: "Use sin²θ+cos²θ=1", body: `So 2sinθcosθ=(given sum)²−1.` },
        { title: "Divide by 2", body: `The question asks for sinθcosθ, not 2sinθcosθ.` },
        { title: "Answer", body: `The product is ${answer}.` },
      ];
    case "TRG-001-QL-121":
      return [
        { title: "Evaluate each standard value", body: question.explanation.steps[0]?.body ?? question.explanation.keyRule },
        { title: "Respect powers and products", body: `Square only the term carrying the square, and simplify reciprocal products before combining terms.` },
        { title: "Combine", body: `After exact simplification, the value is ${answer}.` },
      ];
    case "TRG-001-QL-122":
      return [
        { title: "Recognize the identity", body: `sinA cosB+cosA sinB = sin(A+B).` },
        { title: "Add the angles", body: `Here A+B=${Number(state.a) + Number(state.b)}°.` },
        { title: "Use the standard value", body: `Evaluate the resulting sine exactly.` },
        { title: "Answer", body: `The value is ${answer}.` },
      ];
    case "TRG-001-QL-125":
      return [
        { title: "Evaluate the reciprocal pair", body: `tanθ and cotθ are reciprocals at the same angle.` },
        { title: "Form the sum", body: `Add the exact values before applying the outer square.` },
        { title: "Square the whole sum", body: `Do not drop the cross term in (tanθ+cotθ)².` },
        { title: "Answer", body: `The exact result is ${answer}.` },
      ];
    case "TRG-001-QL-126":
      return [
        { title: "Split 75°", body: `75°=45°+30°.` },
        { title: "Apply the sine-sum identity", body: `sin75°=sin45°cos30°+cos45°sin30°.` },
        { title: "Substitute exact values", body: `Use sin45°=cos45°=√2/2, cos30°=√3/2 and sin30°=1/2.` },
        { title: "Simplify", body: `Combining the surds gives ${answer}.` },
      ];
    case "TRG-001-QL-127":
      return [
        { title: "Split 15°", body: `15°=45°−30°.` },
        { title: "Apply the cosine-difference identity", body: `cos15°=cos45°cos30°+sin45°sin30°.` },
        { title: "Substitute exact values", body: `Use the standard 45° and 30° values.` },
        { title: "Simplify", body: `The exact result is ${answer}.` },
      ];
    case "TRG-001-QL-128":
      return [
        { title: "Split 75°", body: `75°=45°+30°.` },
        { title: "Apply tan(A+B)", body: `tan75°=(tan45°+tan30°)/(1−tan45°tan30°).` },
        { title: "Substitute", body: `Use tan45°=1 and tan30°=√3/3.` },
        { title: "Rationalize", body: `Simplifying the exact fraction gives ${answer}.` },
      ];
    case "TRG-001-QL-131":
      return [
        { title: "Combine sine and cosine", body: `sinθ+cosθ=√2·sin(θ+45°).` },
        { title: "Use the sine bound", body: `The maximum value of sin(θ+45°) is 1.` },
        { title: "Apply the coefficient", body: `Multiply √2 by ${state.coefficient}.` },
        { title: "Answer", body: `The maximum value is ${answer}.` },
      ];
    case "TRG-001-QL-132":
      return [
        { title: "Use the area formula", body: `Area = 1/2 × a × b × sinC.` },
        { title: "Substitute the known values", body: `${state.area} = 1/2 × ${state.a} × b × sin30°.` },
        { title: "Use sin30°=1/2", body: `This leaves a simple linear equation in the unknown side b.` },
        { title: "Solve", body: `The other side is ${answer}.` },
      ];
    default:
      return null;
  }
}

function strengthenExplanation(question: any) {
  const specific = hardSteps(question);
  if (specific) return { ...question, explanation: { ...question.explanation, steps: specific } };
  if (question.difficulty === "Easy") return question;

  const existing = question.explanation.steps ?? [];
  const steps: ReviewedStep[] = [
    { title: "Choose the relation", body: question.explanation.keyRule },
    ...existing.map((step: ReviewedStep) => ({ ...step, title: step.title === "Working" ? "Work it out" : step.title })),
  ];
  if (question.difficulty === "Hard" || steps.length < 2) {
    steps.push({ title: "Answer", body: `Therefore, the required value is ${question.answer}.` });
  }
  return { ...question, explanation: { ...question.explanation, steps } };
}

function reviewChecks(question: any) {
  const options = question.options;
  const uniqueAnswers = new Set(options.map((option: any) => answerKey(option.value))).size === 4;
  const minSteps = question.difficulty === "Hard" ? 3 : question.difficulty === "Medium" ? 2 : 1;
  return [
    { name: "FOUR_OPTIONS", passed: options.length === 4, message: "Exactly four options." },
    { name: "ONE_CORRECT", passed: options.filter((option: any) => option.isCorrect).length === 1, message: "Exactly one correct option." },
    { name: "UNIQUE_OPTIONS", passed: uniqueAnswers, message: "No mathematically equivalent option duplicates." },
    { name: "CORRECT_INDEX", passed: question.correctIndex >= 0 && options[question.correctIndex]?.isCorrect === true, message: "correctIndex points to the correct option." },
    { name: "VERIFIED", passed: question.verification.valid, message: "Independent verification passed." },
    { name: "EXPLANATION_DEPTH", passed: question.explanation.steps.length >= minSteps, message: `Explanation meets ${question.difficulty} depth floor.` },
    { name: "NO_INTERNAL_ASSIGNMENT_PROSE", passed: !/\b(opposite|adjacent)\s*=/.test(question.stem), message: "Stem does not expose internal variable-assignment prose." },
    { name: "NO_METHOD_LEAK", passed: !/\busing\s+(2\s*sin|cos²)/i.test(question.stem), message: "Stem does not prescribe the intended method." },
    { name: "NO_CONJUGATE_ANGLE_LEAK", passed: !(["TRG-001-QL-103", "TRG-001-QL-104", "TRG-001-QL-107", "TRG-001-QL-108"].includes(question.qlId) && /θ\s*=\s*-?\d+(?:\.\d+)?\s*(?:°|deg(?:ree)?s?\b)/i.test(question.stem)), message: "Conjugate questions do not reveal a bypass angle." },
    { name: "ACTIVATION_LOCK", passed: !question.publiclyPublishable && !question.questionStudioDiscoverable && question.testEligibility === "INELIGIBLE" && question.questionBankStatus === "NOT_STORED", message: "All production locks remain closed." },
  ];
}

export function generateReviewedTrg001MvpQuestion(qlId: string, seed: string) {
  let question: any = generateTrg001MvpQuestion(qlId, seed) as Trg001MvpQuestion;
  question = replaceDuplicateFamily(question);
  question = removeInformationLeak(question);
  question = polishStem(question);
  question = strengthenExplanation(question);

  const checks = reviewChecks(question);
  if (!checks.every((check) => check.passed)) {
    const failed = checks.filter((check) => !check.passed).map((check) => check.name).join(", ");
    throw new Error(`${qlId}: reviewed MVP validation failed: ${failed}`);
  }

  return {
    ...question,
    reviewStatus: "APPROVED" as const,
    editorialReview: {
      version: "TRG-001-MVP-EDITORIAL-V1" as const,
      status: "APPROVED" as const,
      checks,
    },
    validation: { valid: true, checks: [...question.validation.checks, ...checks] },
  };
}

export function generateAllReviewedTrg001MvpQuestions(seed: string) {
  return TRG_001_MVP_REGISTRY.map((entry) => generateReviewedTrg001MvpQuestion(entry.qlId, seed));
}

export function reviewedMvpFingerprint(question: ReturnType<typeof generateReviewedTrg001MvpQuestion>) {
  return [
    question.qlId,
    question.seed,
    question.stem,
    question.options.map((option: any) => `${option.label}:${answerKey(option.value)}:${option.isCorrect}`).join("|"),
    question.correctIndex,
    answerKey(question.exactAnswer),
    question.explanation.steps.map((step: ReviewedStep) => `${step.title}:${step.body}`).join("|"),
    question.reviewStatus,
  ].join("::");
}
