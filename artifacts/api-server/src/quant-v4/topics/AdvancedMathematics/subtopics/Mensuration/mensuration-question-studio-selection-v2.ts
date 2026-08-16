import {
  MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  MENSURATION_QUESTION_STUDIO_DIFFICULTIES,
  MENSURATION_QUESTION_STUDIO_EXAM_PROFILES,
  MENSURATION_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  MENSURATION_QUESTION_STUDIO_LANGUAGES,
  MENSURATION_QUESTION_STUDIO_PACKAGE_V2,
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
  generateMensurationStudioQuestionV2 as generateMensurationStudioQuestionV2Base,
  getMensurationPatternRealismMetadataV2,
  type MensurationQuestionStudioCpId,
  type MensurationQuestionStudioDifficulty,
  type MensurationQuestionStudioExamProfile,
  type MensurationQuestionStudioPattern,
  type MensurationQuestionStudioQuestionV2,
} from "./mensuration-question-studio-runtime-v2";

const LABELS = ["A", "B", "C", "D"] as const;
const PI = 22 / 7;

function hashText(text: string) {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

function mixedHash(text: string) {
  let value = hashText(text) >>> 0;
  value ^= value >>> 16;
  value = Math.imul(value, 0x7feb352d) >>> 0;
  value ^= value >>> 15;
  value = Math.imul(value, 0x846ca68b) >>> 0;
  value ^= value >>> 16;
  return value >>> 0;
}

function unitInterval(seed: string) {
  return mixedHash(seed) / 0x100000000;
}

function trailingIndex(seed: string) {
  const trailing = /(?:^|:)(\d+)$/.exec(seed)?.[1];
  return trailing === undefined ? null : Number(trailing);
}

function variantIndex(seed: string, length: number) {
  const trailing = trailingIndex(seed);
  return trailing === null ? mixedHash(`${seed}:numerical-pool`) % length : trailing % length;
}

function repairNestedDisplayMath(text: string) {
  return text.replace(
    /\$\$([\s\S]*?)\$(\d+(?:\.\d+)?\\pi)\$\$/g,
    (_match, prefix: string, value: string) => `$$${prefix}${value}$$`,
  );
}

function preserveDisplayMath(question: MensurationQuestionStudioQuestionV2): MensurationQuestionStudioQuestionV2 {
  return {
    ...question,
    stem: repairNestedDisplayMath(question.stem),
    options: question.options.map(repairNestedDisplayMath),
    optionDetails: question.optionDetails.map((option) => ({
      ...option,
      text: repairNestedDisplayMath(option.text),
    })),
    answer: repairNestedDisplayMath(question.answer),
    explanation: {
      steps: question.explanation.steps.map(repairNestedDisplayMath),
      shortcut: repairNestedDisplayMath(question.explanation.shortcut),
      traps: question.explanation.traps.map(repairNestedDisplayMath),
    },
  };
}

function displayNumber(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function displayValue(value: number, unit: "m²" | "%" | "m") {
  return unit === "%" ? `${displayNumber(value)}%` : `${displayNumber(value)} ${unit}`;
}

interface TargetedPoolSpec {
  stem: string;
  answer: number;
  unit: "m²" | "%" | "m";
  wrongCandidates: readonly number[];
  steps: readonly string[];
  shortcut: string;
  traps: readonly string[];
  stateKey: string;
  objectVariantId: string;
}

function applyPoolSpec(
  question: MensurationQuestionStudioQuestionV2,
  spec: TargetedPoolSpec,
): MensurationQuestionStudioQuestionV2 {
  const answer = displayValue(spec.answer, spec.unit);
  const wrongs = [...new Set(spec.wrongCandidates
    .filter((value) => Number.isFinite(value) && value > 0 && Math.abs(value - spec.answer) > 1e-9)
    .map((value) => displayValue(value, spec.unit)))]
    .filter((value) => value !== answer)
    .slice(0, 3);
  if (wrongs.length !== 3) throw new Error(`${question.patternId}/${question.seed}: targeted numerical pool needs three distinct distractors.`);

  const options = [answer, ...wrongs];
  const optionDetails = options.map((text, index) => ({
    label: LABELS[index]!,
    text,
    isCorrect: index === 0,
    misconceptionId: index === 0 ? null : `${question.patternId}-REALISM-NUMERIC-M${index}`,
  }));
  return {
    ...question,
    stem: spec.stem,
    options,
    optionDetails,
    correctIndex: 0,
    answer,
    explanation: {
      steps: [...spec.steps],
      shortcut: spec.shortcut,
      traps: [...spec.traps],
    },
    validation: {
      ...question.validation,
      valid: true,
      fourDistinctOptions: true,
      exactlyOneCorrect: true,
      answerParity: true,
      teachingStepsPresent: spec.steps.length > 0,
    },
    realism: {
      ...question.realism,
      numericalStateSignature: `${question.patternId}|REALISM-NUMERIC-V2|${spec.stateKey}|${answer}`,
      objectVariantId: spec.objectVariantId,
      stemVariantId: "TARGETED_NUMERICAL_POOL_V2",
    },
  };
}

function outerCircularPathPool(question: MensurationQuestionStudioQuestionV2, seed: string) {
  const states = [[14, 7], [21, 7], [28, 7], [35, 7], [14, 14]] as const;
  const [radius, width] = states[variantIndex(seed, states.length)]!;
  const outerRadius = radius + width;
  const answer = PI * (outerRadius ** 2 - radius ** 2);
  const objects = ["circular garden", "circular park", "circular lawn", "circular flower bed", "circular courtyard"] as const;
  const object = objects[variantIndex(`${seed}:object`, objects.length)]!;
  return applyPoolSpec(question, {
    stem: `A ${object} has radius ${radius} m. A path ${width} m wide is made outside it. Find the area of the path. Use π = 22/7.`,
    answer,
    unit: "m²",
    wrongCandidates: [
      PI * 2 * radius * width,
      PI * outerRadius ** 2,
      PI * radius ** 2,
      PI * 2 * outerRadius * width,
      PI * width ** 2,
    ],
    steps: [
      `Outer radius = ${radius} + ${width} = ${outerRadius} m.`,
      `Path area = π(R² − r²) = (22/7) × (${outerRadius}² − ${radius}²).`,
      `Therefore, path area = ${displayNumber(answer)} m².`,
    ],
    shortcut: "For an outside circular path of width w around radius r, use πw(2r + w).",
    traps: [
      "Do not use circumference × width without accounting for the outer curved strip.",
      "The outer radius is r + w, not r + 2w.",
      "Subtract the original circular area from the enlarged circular area.",
    ],
    stateKey: `${radius}|${width}`,
    objectVariantId: `CIRCULAR_PATH_OBJECT:${object}`,
  });
}

function innerCircularPathPool(question: MensurationQuestionStudioQuestionV2, seed: string) {
  const states = [[21, 7], [28, 7], [35, 7], [42, 7], [28, 14]] as const;
  const [outerRadius, width] = states[variantIndex(seed, states.length)]!;
  const innerRadius = outerRadius - width;
  const answer = PI * (outerRadius ** 2 - innerRadius ** 2);
  const objects = ["circular park", "circular garden", "circular lawn", "circular playground", "circular courtyard"] as const;
  const object = objects[variantIndex(`${seed}:object`, objects.length)]!;
  return applyPoolSpec(question, {
    stem: `A ${object} has radius ${outerRadius} m. A path ${width} m wide runs uniformly inside its boundary. Find the area of the path. Use π = 22/7.`,
    answer,
    unit: "m²",
    wrongCandidates: [
      PI * 2 * outerRadius * width,
      PI * outerRadius ** 2,
      PI * innerRadius ** 2,
      PI * 2 * innerRadius * width,
      PI * width ** 2,
    ],
    steps: [
      `Inner radius = ${outerRadius} − ${width} = ${innerRadius} m.`,
      `Path area = π(R² − r²) = (22/7) × (${outerRadius}² − ${innerRadius}²).`,
      `Therefore, path area = ${displayNumber(answer)} m².`,
    ],
    shortcut: "For an inside circular path of width w within outer radius R, use πw(2R − w).",
    traps: [
      "Do not increase the radius for a path that lies inside the boundary.",
      "Using 2πRw treats the strip like a rectangle and overcounts it.",
      "The inner radius is R − w.",
    ],
    stateKey: `${outerRadius}|${width}`,
    objectVariantId: `CIRCULAR_INNER_PATH_OBJECT:${object}`,
  });
}

function uniformAreaIncreasePool(question: MensurationQuestionStudioQuestionV2, seed: string) {
  const values = [10, 20, 30, 40, 50] as const;
  const percent = values[variantIndex(seed, values.length)]!;
  const answer = 2 * percent + (percent ** 2) / 100;
  return applyPoolSpec(question, {
    stem: `Every linear dimension of a plane figure is increased by ${percent}%. By what percentage does its area increase?`,
    answer,
    unit: "%",
    wrongCandidates: [percent, 2 * percent, percent ** 2 / 100, 100 + percent],
    steps: [
      `The linear scale factor is ${(100 + percent)}/100.`,
      `Area scale factor = (${100 + percent}/100)².`,
      `Percentage increase in area = ${displayNumber(answer)}%.`,
    ],
    shortcut: "If every length increases by p%, area increases by 2p + p²/100 percent.",
    traps: [
      "Area does not increase by only the linear percentage.",
      "Do not stop at 2p; the product term p²/100 also contributes.",
      "Square the scale factor because area is two-dimensional.",
    ],
    stateKey: `${percent}`,
    objectVariantId: "PLANE_FIGURE_SCALING",
  });
}

function uniformAreaDecreasePool(question: MensurationQuestionStudioQuestionV2, seed: string) {
  const values = [10, 20, 30, 40, 50] as const;
  const percent = values[variantIndex(seed, values.length)]!;
  const answer = 2 * percent - (percent ** 2) / 100;
  return applyPoolSpec(question, {
    stem: `Every linear dimension of a plane figure is decreased by ${percent}%. Find the percentage decrease in its area.`,
    answer,
    unit: "%",
    wrongCandidates: [percent, 2 * percent, percent ** 2 / 100, 100 - percent],
    steps: [
      `The linear scale factor becomes ${(100 - percent)}/100.`,
      `Area scale factor = (${100 - percent}/100)².`,
      `Hence the percentage decrease in area is ${displayNumber(answer)}%.`,
    ],
    shortcut: "If every length decreases by p%, area decreases by 2p − p²/100 percent.",
    traps: [
      "A p% fall in length does not mean only a p% fall in area.",
      "For a decrease, the p²/100 term is subtracted from 2p.",
      "Use the square of the remaining linear factor.",
    ],
    stateKey: `${percent}`,
    objectVariantId: "PLANE_FIGURE_SCALING",
  });
}

function independentDimensionChangePool(question: MensurationQuestionStudioQuestionV2, seed: string) {
  const states = [[50, 20], [40, 20], [60, 25], [30, 10], [50, 10], [20, 10]] as const;
  const [increase, decrease] = states[variantIndex(seed, states.length)]!;
  const answer = increase - decrease - (increase * decrease) / 100;
  const objects = ["rectangular display panel", "rectangular plot", "rectangular metal sheet", "rectangular floor panel"] as const;
  const object = objects[variantIndex(`${seed}:object`, objects.length)]!;
  return applyPoolSpec(question, {
    stem: `A ${object} is resized: its length is increased by ${increase}% while its breadth is decreased by ${decrease}%. Find the percentage increase in its area.`,
    answer,
    unit: "%",
    wrongCandidates: [increase - decrease, increase + decrease, increase * decrease / 100, increase],
    steps: [
      `New area factor = (1 + ${increase}/100)(1 − ${decrease}/100).`,
      `Net percentage change = ${increase} − ${decrease} − (${increase} × ${decrease})/100.`,
      `Therefore, the area increases by ${displayNumber(answer)}%.`,
    ],
    shortcut: "For +a% in one dimension and −b% in the other, net area change = a − b − ab/100 percent.",
    traps: [
      "Do not simply subtract the two percentages; both changes act multiplicatively.",
      "Adding the percentages ignores the decrease in breadth.",
      "The product correction ab/100 must be subtracted.",
    ],
    stateKey: `${increase}|${decrease}`,
    objectVariantId: `RECTANGULAR_RESIZE_OBJECT:${object}`,
  });
}

function changedAreaPool(question: MensurationQuestionStudioQuestionV2, seed: string) {
  const states = [[200, 50, 20], [500, 40, 20], [400, 50, 10], [300, 20, 10], [800, 30, 10]] as const;
  const [area, increase, decrease] = states[variantIndex(seed, states.length)]!;
  const answer = area * (100 + increase) * (100 - decrease) / 10000;
  const objects = ["rectangular plot", "rectangular floor panel", "rectangular sheet", "rectangular display board"] as const;
  const object = objects[variantIndex(`${seed}:object`, objects.length)]!;
  return applyPoolSpec(question, {
    stem: `A ${object} has area ${area} m². Its length is increased by ${increase}% and its breadth is decreased by ${decrease}%. Find its new area.`,
    answer,
    unit: "m²",
    wrongCandidates: [
      area * (100 + increase) / 100,
      area * (100 - decrease) / 100,
      area * (100 + increase - decrease) / 100,
      area,
    ],
    steps: [
      `Length factor = ${(100 + increase)}/100 and breadth factor = ${(100 - decrease)}/100.`,
      `New area = ${area} × (${100 + increase}/100) × (${100 - decrease}/100).`,
      `Therefore, the new area is ${displayNumber(answer)} m².`,
    ],
    shortcut: "Multiply the original area by both independent dimension scale factors.",
    traps: [
      "Do not apply only the length increase.",
      "Do not apply only the breadth decrease.",
      "Adding and subtracting the percentages directly misses their product term.",
    ],
    stateKey: `${area}|${increase}|${decrease}`,
    objectVariantId: `RECTANGULAR_AREA_CHANGE_OBJECT:${object}`,
  });
}

function circleSquareAreaDifferencePool(question: MensurationQuestionStudioQuestionV2, seed: string) {
  const perimeters = [88, 176, 264, 352, 440] as const;
  const perimeter = perimeters[variantIndex(seed, perimeters.length)]!;
  const radius = 7 * perimeter / 44;
  const side = perimeter / 4;
  const circleArea = PI * radius ** 2;
  const squareArea = side ** 2;
  const answer = circleArea - squareArea;
  return applyPoolSpec(question, {
    stem: `A circle and a square each have perimeter ${perimeter} m. By how much is the circle's area greater than the square's area? Take π = 22/7.`,
    answer,
    unit: "m²",
    wrongCandidates: [circleArea, squareArea, circleArea + squareArea, perimeter],
    steps: [
      `Circle radius = ${perimeter} ÷ (2 × 22/7) = ${displayNumber(radius)} m, so circle area = ${displayNumber(circleArea)} m².`,
      `Square side = ${perimeter} ÷ 4 = ${displayNumber(side)} m, so square area = ${displayNumber(squareArea)} m².`,
      `Required difference = ${displayNumber(circleArea)} − ${displayNumber(squareArea)} = ${displayNumber(answer)} m².`,
    ],
    shortcut: "With equal perimeter P, compute each shape from P first; equal perimeter does not imply equal area.",
    traps: [
      "Do not compare the perimeter values again after converting them to dimensions.",
      "The circle radius comes from C = 2πr, while square side comes from P = 4a.",
      "The question asks for the difference, not either individual area or their sum.",
    ],
    stateKey: `${perimeter}`,
    objectVariantId: "EQUAL_PERIMETER_CIRCLE_SQUARE",
  });
}

function circularWireRectanglePool(question: MensurationQuestionStudioQuestionV2, seed: string) {
  const states = [[14, 30], [21, 40], [28, 50], [35, 60], [42, 75]] as const;
  const [radius, length] = states[variantIndex(seed, states.length)]!;
  const wireLength = 2 * PI * radius;
  const semiPerimeter = wireLength / 2;
  const breadth = semiPerimeter - length;
  return applyPoolSpec(question, {
    stem: `A metallic wire is bent into a circular frame of radius ${radius} m. It is then straightened and rebent into a rectangular frame of length ${length} m. Find the rectangle's breadth. Take π = 22/7.`,
    answer: breadth,
    unit: "m",
    wrongCandidates: [wireLength - length, semiPerimeter, radius, length],
    steps: [
      `Wire length = circle circumference = 2 × (22/7) × ${radius} = ${displayNumber(wireLength)} m.`,
      `For the rectangle, 2(l + b) = ${displayNumber(wireLength)}, so l + b = ${displayNumber(semiPerimeter)} m.`,
      `Breadth = ${displayNumber(semiPerimeter)} − ${length} = ${displayNumber(breadth)} m.`,
    ],
    shortcut: "The wire preserves perimeter: first halve the circular wire length to get l + b.",
    traps: [
      "Do not subtract the rectangle length from the full wire length; halve the perimeter first.",
      "The circle's radius is not the rectangle's breadth.",
      "Perimeter is conserved when the same wire is rebent; area is not.",
    ],
    stateKey: `${radius}|${length}`,
    objectVariantId: "WIRE_REBENDING_CONTEXT",
  });
}

function applyTargetedNumericalPool(
  question: MensurationQuestionStudioQuestionV2,
  seed: string,
): MensurationQuestionStudioQuestionV2 {
  switch (question.patternId) {
    case "MEN-001-QL-306": return outerCircularPathPool(question, seed);
    case "MEN-001-QL-307": return innerCircularPathPool(question, seed);
    case "MEN-001-QL-414": return uniformAreaIncreasePool(question, seed);
    case "MEN-001-QL-415": return uniformAreaDecreasePool(question, seed);
    case "MEN-001-QL-416": return independentDimensionChangePool(question, seed);
    case "MEN-001-QL-417": return changedAreaPool(question, seed);
    case "MEN-001-QL-433": return circleSquareAreaDifferencePool(question, seed);
    case "MEN-001-QL-434": return circularWireRectanglePool(question, seed);
    default: return question;
  }
}

function targetAnswerPosition(seed: string) {
  const trailing = trailingIndex(seed);
  return trailing === null ? mixedHash(`${seed}:answer-position`) % 4 : trailing % 4;
}

function balanceAnswerPosition(
  question: MensurationQuestionStudioQuestionV2,
  seed: string,
): MensurationQuestionStudioQuestionV2 {
  const target = targetAnswerPosition(seed);
  const current = question.correctIndex;
  if (current === target) return question;

  const options = [...question.options];
  [options[current], options[target]] = [options[target]!, options[current]!];

  const details = question.optionDetails.map((detail) => ({ ...detail }));
  [details[current], details[target]] = [details[target]!, details[current]!];
  const relabelled = details.map((detail, index) => ({
    ...detail,
    label: LABELS[index]!,
  }));

  if (options[target] !== question.answer) {
    throw new Error(`${question.patternId}/${seed}: answer-position balancing lost answer parity.`);
  }
  if (relabelled.filter((detail) => detail.isCorrect).length !== 1 || !relabelled[target]?.isCorrect) {
    throw new Error(`${question.patternId}/${seed}: answer-position balancing lost correct-option metadata.`);
  }

  return {
    ...question,
    options,
    optionDetails: relabelled,
    correctIndex: target,
    validation: {
      ...question.validation,
      fourDistinctOptions: options.length === 4 && new Set(options).size === 4,
      exactlyOneCorrect: relabelled.filter((detail) => detail.isCorrect).length === 1,
      answerParity: options[target] === question.answer,
    },
  };
}

export function generateMensurationStudioQuestionV2(input: {
  patternId: string;
  seed: string;
  examProfile?: MensurationQuestionStudioExamProfile;
}): MensurationQuestionStudioQuestionV2 {
  const repaired = preserveDisplayMath(generateMensurationStudioQuestionV2Base(input));
  const pooled = applyTargetedNumericalPool(repaired, input.seed);
  return balanceAnswerPosition(pooled, input.seed);
}

function weightedPattern(
  eligible: readonly MensurationQuestionStudioPattern[],
  examProfile: MensurationQuestionStudioExamProfile,
  seed: string,
) {
  const rows = eligible.map((pattern) => ({
    pattern,
    weight: getMensurationPatternRealismMetadataV2(pattern).profileWeights[examProfile],
  }));
  const total = rows.reduce((sum, row) => sum + row.weight, 0);
  let ticket = unitInterval(seed) * total;
  for (const row of rows) {
    ticket -= row.weight;
    if (ticket < 0) return row.pattern;
  }
  return rows[rows.length - 1]!.pattern;
}

export function generateMensurationStudioBatchV2(input: {
  cpId?: MensurationQuestionStudioCpId;
  patternId?: string;
  difficulty?: MensurationQuestionStudioDifficulty;
  examProfile?: MensurationQuestionStudioExamProfile;
  seed?: string;
  count?: number;
}) {
  const count = Math.max(1, Math.min(50, Math.floor(input.count ?? 5)));
  const seed = input.seed?.trim() || "mensuration-question-studio";
  const examProfile = input.examProfile ?? "SSC_CORE";
  let eligible = MENSURATION_QUESTION_STUDIO_PATTERNS.filter((row) => !input.cpId || row.cpId === input.cpId);
  if (input.patternId) eligible = eligible.filter((row) => row.patternId === input.patternId);
  if (!eligible.length) throw new Error("No Mensuration patterns matched the requested filters.");

  const questions: MensurationQuestionStudioQuestionV2[] = [];
  const exactStates = new Set<string>();
  const numericalStates = new Set<string>();
  const recentPatterns: string[] = [];
  let repeatedAttempts = 0;

  for (let attempt = 0; questions.length < count && attempt < count * 2048; attempt += 1) {
    const pattern = input.patternId
      ? eligible[0]!
      : weightedPattern(eligible, examProfile, `${seed}:pattern:${attempt}`);
    if (!input.patternId && eligible.length >= 8 && recentPatterns.slice(-3).includes(pattern.patternId)) continue;

    const question = generateMensurationStudioQuestionV2({
      patternId: pattern.patternId,
      seed: `${seed}:${attempt}`,
      examProfile,
    });
    if (input.difficulty && question.difficultyBand !== input.difficulty) continue;

    const exact = `${question.patternId}|${question.stem}|${question.options.join("|")}`;
    const repeated = exactStates.has(exact) || numericalStates.has(question.realism.numericalStateSignature);
    if (repeated && repeatedAttempts < Math.max(32, count * 8)) {
      repeatedAttempts += 1;
      continue;
    }

    repeatedAttempts = 0;
    exactStates.add(exact);
    numericalStates.add(question.realism.numericalStateSignature);
    recentPatterns.push(question.patternId);
    questions.push(question);
  }

  if (questions.length !== count) {
    throw new Error(`Unable to construct ${count} Mensuration questions for the requested filters and realism profile.`);
  }

  return {
    package: MENSURATION_QUESTION_STUDIO_PACKAGE_V2,
    questions,
    filters: {
      cpId: input.cpId ?? null,
      patternId: input.patternId ?? null,
      difficulty: input.difficulty ?? null,
      examProfile,
    },
    seed,
    realismAuthority: MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
  };
}

export {
  MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  MENSURATION_QUESTION_STUDIO_DIFFICULTIES,
  MENSURATION_QUESTION_STUDIO_EXAM_PROFILES,
  MENSURATION_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  MENSURATION_QUESTION_STUDIO_LANGUAGES,
  MENSURATION_QUESTION_STUDIO_PACKAGE_V2,
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
  getMensurationPatternRealismMetadataV2,
};
export type {
  MensurationQuestionStudioCpId,
  MensurationQuestionStudioDifficulty,
  MensurationQuestionStudioExamProfile,
  MensurationQuestionStudioPattern,
  MensurationQuestionStudioQuestionV2,
};
