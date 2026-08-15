import type { MenCp012CanonicalClusterId } from "../../cp012-foundation/merge-split-v4";
import type { MenCp012PermanentEnglishQuestion, MenCp012PermanentSourceKind } from "./runtime-v1";

export const MEN_CP_012_PERMANENT_EDITORIAL_V2_AUTHORITY =
  "MEN-CP012-PERMANENT-EDITORIAL-V2" as const;

const LABELS = ["A", "B", "C", "D"] as const;
const GENERIC_SOURCE_TRAPS = new Set([
  "Recasting conserves volume, not surface area.",
  "Do not reverse source and target volume factors.",
]);

const INTERPRETATION: Readonly<Record<MenCp012CanonicalClusterId, string>> = {
  RECAST_COUNT_DIRECT: "The result is a discrete count of complete target units; the source/target volume quotient must therefore be interpreted as a whole count.",
  RECAST_LINEAR_DIMENSION_DIRECT: "The unknown target dimension occurs to the first power, so the isolated value is used directly without an additional root.",
  RECAST_SQUARE_ROOT_DIMENSION_INVERSE: "The conservation equation first determines a squared dimension; take the positive square root before reporting radius, diameter or a derived ratio.",
  RECAST_CUBE_ROOT_DIMENSION_INVERSE: "The conservation equation determines a cubed linear dimension; take the positive cube root before reporting the side or radius.",
  DRAWING_ROLLING_LENGTH_DIRECT: "The smaller final cross-section is balanced by a longer piece of the same material; convert the final length unit only after conservation is solved.",
  DRAWING_ROLLING_CROSS_SECTION_INVERSE: "Use the final length to recover the required cross-sectional dimension; circular radius recovery needs a square root, while rectangular thickness is linear.",
  COMBINED_SOURCE_RECAST: "All source volumes contribute to one target, so the target solve begins only after the source volumes have been added.",
  LOSS_AWARE_RECAST_GIVEN: "Only the retained fraction of the original material reaches the target; use that usable material in the final count or dimension equation.",
  LOSS_YIELD_PERCENT_UNKNOWN: "Compare actual target material with the no-loss source amount; yield and loss are complementary percentages of the original source material.",
  HOLLOW_SOURCE_MATERIAL_RECAST: "Only shell material is available for recasting: subtract the hollow core first, then solve the target normally.",
  HOLLOW_TARGET_LENGTH_DIRECT: "The annular cross-section is fixed by R²−r², so the shell length follows directly from material volume divided by that area.",
  HOLLOW_TARGET_THICKNESS_INVERSE: "Material conservation gives the inner radius first; wall thickness is the final subtraction outer radius minus inner radius.",
  RECAST_THEN_SECONDARY_MEASURE: "Volume conservation only identifies the new solid; the requested surface-area percentage is a separate second-stage calculation.",
};

function hash(text: string) {
  let value = 2166136261 >>> 0;
  for (const char of text) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619) >>> 0;
  }
  return value >>> 0;
}

function trailingPosition(seed: string) {
  const match = /(\d+)$/.exec(seed);
  return match ? Number(match[1]) % 4 : hash(`${seed}:position`) % 4;
}

function normalizePercent(text: string) {
  return text.replace(/(-?\d+(?:\.\d+)?)\s+%/g, "$1%");
}

function countAnswerParts(answer: string, clusterId: MenCp012CanonicalClusterId) {
  const withUnit = /^(\d+)\s+(spheres|cubes|cylinders|coins)$/.exec(answer);
  if (withUnit) return { value: Number(withUnit[1]), unit: withUnit[2] };
  if (clusterId === "RECAST_COUNT_DIRECT" && /^\d+$/.test(answer)) return { value: Number(answer), unit: "" };
  return null;
}

function ratioCountDistractors(value: number) {
  const candidates = [
    value % 2 === 0 ? value / 2 : null,
    value % 3 === 0 ? value / 3 : null,
    value % 4 === 0 ? value / 4 : null,
    value * 2,
    value * 3,
    value * 4,
  ].filter((candidate): candidate is number => candidate !== null && candidate > 0 && Number.isInteger(candidate));
  const unique = [...new Set(candidates.filter((candidate) => candidate !== value))].slice(0, 3);
  if (unique.length !== 3) throw new Error(`Could not build ratio-based count distractors for ${value}.`);
  return unique;
}

function rebuildCountOptions(question: MenCp012PermanentEnglishQuestion) {
  const parts = countAnswerParts(question.answer, question.clusterId);
  if (!parts) return question.options;
  const wrong = ratioCountDistractors(parts.value);
  let wrongIndex = 0;
  return LABELS.map((label, index) => {
    if (index === question.correctIndex) {
      return { label, display: `${parts.value}${parts.unit ? ` ${parts.unit}` : ""}`, isCorrect: true, misconceptionId: null };
    }
    const value = wrong[wrongIndex++]!;
    return {
      label,
      display: `${value}${parts.unit ? ` ${parts.unit}` : ""}`,
      isCorrect: false,
      misconceptionId: `${question.sourceId}-VOLUME-RATIO-DISTRACTOR-${wrongIndex}`,
    };
  });
}

function bestWorkStep(question: MenCp012PermanentEnglishQuestion) {
  const ranked = [...question.explanation.steps].sort((a, b) => {
    const score = (body: string) =>
      (body.match(/[=×√³²%π]/g)?.length ?? 0) * 4 +
      (body.match(/\d/g)?.length ?? 0) +
      (body.length > 40 ? 2 : 0);
    return score(b.body) - score(a.body);
  });
  return ranked[0]?.body ?? `Use the conservation equation to obtain ${question.answer}.`;
}

function polishDerivedExplanation(question: MenCp012PermanentEnglishQuestion) {
  if (question.sourceKind === "WAVE01" || question.sourceKind === "V4_CORRECTION") return question.explanation;
  const work = normalizePercent(bestWorkStep(question));
  const traps = question.explanation.traps.filter((trap) => !GENERIC_SOURCE_TRAPS.has(trap));
  return {
    ...question.explanation,
    steps: [
      { title: "Set up the conservation relation", body: question.explanation.keyRule },
      { title: "Substitute and solve", body: work },
      { title: "Interpret the result", body: INTERPRETATION[question.clusterId] },
      { title: "Check the requested quantity", body: `The required answer is ${normalizePercent(question.answer)}; the underlying source state independently satisfies the material-volume identity.` },
    ],
    traps: traps.length >= 2 ? traps : question.explanation.traps,
  };
}

export function polishMenCp012PermanentEnglishV2(
  question: MenCp012PermanentEnglishQuestion,
): MenCp012PermanentEnglishQuestion & { readonly editorialAuthority: typeof MEN_CP_012_PERMANENT_EDITORIAL_V2_AUTHORITY } {
  const answer = normalizePercent(question.answer);
  const options = rebuildCountOptions(question).map((option) => ({
    ...option,
    display: normalizePercent(option.display),
  }));
  const explanationBase = polishDerivedExplanation(question);
  const explanation = {
    ...explanationBase,
    steps: explanationBase.steps.map((step) => ({ ...step, body: normalizePercent(step.body) })),
    traps: explanationBase.traps.map(normalizePercent),
  };
  const polished = {
    ...question,
    answer,
    options,
    explanation,
    editorialAuthority: MEN_CP_012_PERMANENT_EDITORIAL_V2_AUTHORITY,
  } as const;
  if (new Set(polished.options.map((option) => option.display)).size !== 4) {
    throw new Error(`${question.permanentQlId}/${question.seed}: editorial V2 option collision.`);
  }
  if (polished.options[polished.correctIndex]?.display !== polished.answer) {
    throw new Error(`${question.permanentQlId}/${question.seed}: editorial V2 displayed-answer parity failed.`);
  }
  return polished;
}

const SECONDARY_TRIPLES = [
  [3, 4, 5, 6],
  [1, 6, 8, 9],
  [3, 10, 18, 19],
  [7, 14, 17, 20],
] as const;

export function generateMenCp012SecondaryMeasureDiversityV2(seed: string) {
  const variant = Math.floor(hash(`${seed}:secondary-variant`) % 12);
  const base = SECONDARY_TRIPLES[variant % SECONDARY_TRIPLES.length]!;
  const scale = 1 + Math.floor(variant / SECONDARY_TRIPLES.length);
  const [a0, b0, c0, r0] = base;
  const a = a0 * scale;
  const b = b0 * scale;
  const c = c0 * scale;
  const radius = r0 * scale;
  const oldFactor = a * a + b * b + c * c;
  const newFactor = radius * radius;
  const decrease = ((oldFactor - newFactor) / oldFactor) * 100;
  const answer = `${decrease.toFixed(2)}%`;
  const position = trailingPosition(seed);
  const wrongValues = [
    100 - decrease,
    decrease / 2,
    Math.min(99.99, decrease + 8),
  ].map((value) => `${value.toFixed(2)}%`);
  const uniqueWrong = [...new Set(wrongValues.filter((value) => value !== answer))];
  if (uniqueWrong.length < 3) throw new Error(`${seed}: secondary-measure distractor collapse.`);
  let wrongIndex = 0;
  const options = LABELS.map((label, index) =>
    index === position
      ? { label, display: answer, isCorrect: true }
      : { label, display: uniqueWrong[wrongIndex++]!, isCorrect: false },
  );
  return {
    sourceAuthority: MEN_CP_012_PERMANENT_EDITORIAL_V2_AUTHORITY,
    stem: `Three solid metal spheres of radii ${a} cm, ${b} cm and ${c} cm are melted together and recast into one solid sphere. Find the percentage decrease in their total surface area, correct to two decimal places.`,
    options,
    correctIndex: position,
    answer,
    steps: [
      { title: "Conserve volume first", body: `The common (4/3)π factor cancels, so the new radius satisfies R³ = ${a}³ + ${b}³ + ${c}³ = ${radius ** 3}; hence R = ${radius} cm.` },
      { title: "Compare surface-area factors", body: `Old total surface area = 4π(${a}²+${b}²+${c}²) = 4π×${oldFactor}; new surface area = 4π×${newFactor}.` },
      { title: "Calculate the decrease", body: `Percentage decrease = (${oldFactor}-${newFactor})/${oldFactor} × 100 = ${answer}.` },
      { title: "Check the logic", body: "Volume was conserved during recasting; surface area was calculated separately only after the new sphere radius was known." },
    ],
    sourceTraps: [
      "Do not conserve surface area during melting and recasting.",
      "Add the three source volumes, not the three source radii, to recover the new radius.",
    ],
    verification: {
      valid: radius ** 3 === a ** 3 + b ** 3 + c ** 3,
      method: "exact unequal-sphere volume identity followed by independent surface-area comparison",
    },
  } as const;
}
