export const MEN_CP_012_SOURCE_CORRECTIONS_V4_AUTHORITY =
  "MEN-CP012-SOURCE-CORRECTIONS-V4-V1" as const;

const LABELS = ["A", "B", "C", "D"] as const;

function hash(text: string) {
  let value = 2166136261 >>> 0;
  for (const char of text) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619) >>> 0;
  }
  return value >>> 0;
}

function variantIndex(seed: string) {
  const trailing = /(\d+)$/.exec(seed);
  return trailing ? Math.floor(Number(trailing[1]) / 4) : hash(`${seed}:variant`);
}

function correctIndex(seed: string) {
  const trailing = /(\d+)$/.exec(seed);
  return trailing ? Number(trailing[1]) % 4 : hash(`${seed}:position`) % 4;
}

function gcd(a: number, b: number) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function ratio(a: number, b: number) {
  const divisor = gcd(a, b);
  return `${a / divisor}:${b / divisor}`;
}

function ratioDistractors(answer: string) {
  const match = /^(\d+):(\d+)$/.exec(answer);
  if (!match) throw new Error(`Expected ratio answer, got ${answer}`);
  const a = Number(match[1]);
  const b = Number(match[2]);
  const candidates = [
    ratio(b, a),
    ratio(a, 2 * b),
    ratio(2 * a, b),
    ratio(a + b, b),
    ratio(a, a + b),
  ];
  const wrong = [...new Set(candidates.filter((value) => value !== answer))].slice(0, 3);
  if (wrong.length !== 3) throw new Error(`Could not build three ratio distractors for ${answer}`);
  return wrong;
}

export interface MenCp012CorrectedConeRatioQuestionV4 {
  readonly authority: typeof MEN_CP_012_SOURCE_CORRECTIONS_V4_AUTHORITY;
  readonly sourceId: "V3-SPHERE-TO-CONE-DIAMETER-HEIGHT-RATIO";
  readonly seed: string;
  readonly sphereRadius: number;
  readonly coneHeight: number;
  readonly recoveredConeRadius: number;
  readonly stem: string;
  readonly answer: string;
  readonly correctIndex: number;
  readonly options: readonly { label: "A" | "B" | "C" | "D"; display: string; isCorrect: boolean }[];
  readonly explanation: {
    readonly steps: readonly { title: string; body: string }[];
    readonly traps: readonly string[];
  };
  readonly verification: { valid: boolean; method: string };
}

/**
 * Supersedes the Wave-03 safe presentation for this one source ID.
 * The source-backed reasoning must give sphere radius + cone height, recover
 * cone radius through a square root, then form diameter:height.
 */
export function generateMenCp012CorrectedConeRatioV4(seed: string): MenCp012CorrectedConeRatioQuestionV4 {
  const variants = [
    { qNum: 1, qDen: 2 },
    { qNum: 1, qDen: 1 },
    { qNum: 2, qDen: 1 },
    { qNum: 3, qDen: 1 },
  ] as const;
  const variant = variants[variantIndex(seed) % variants.length]!;
  const scale = 1 + (variantIndex(seed) % 3);
  const sphereRadius = 18 * scale;
  const recoveredConeRadius = (sphereRadius * variant.qNum) / variant.qDen;
  const coneHeight = (4 * sphereRadius * variant.qDen * variant.qDen) / (variant.qNum * variant.qNum);
  const answer = ratio(Math.round(2 * recoveredConeRadius * 1000), Math.round(coneHeight * 1000));
  const position = correctIndex(seed);
  const wrong = ratioDistractors(answer);
  let wrongIndex = 0;
  const options = LABELS.map((label, index) =>
    index === position
      ? { label, display: answer, isCorrect: true }
      : { label, display: wrong[wrongIndex++]!, isCorrect: false },
  );
  const recoveredSquared = (4 * sphereRadius * sphereRadius * sphereRadius) / coneHeight;
  return {
    authority: MEN_CP_012_SOURCE_CORRECTIONS_V4_AUTHORITY,
    sourceId: "V3-SPHERE-TO-CONE-DIAMETER-HEIGHT-RATIO",
    seed,
    sphereRadius,
    coneHeight,
    recoveredConeRadius,
    stem: `A solid metallic sphere of radius ${sphereRadius} cm is melted and recast into a right circular cone of height ${coneHeight} cm. Find the ratio of the cone's base diameter to its height.`,
    answer,
    correctIndex: position,
    options,
    explanation: {
      steps: [
        { title: "Conserve volume", body: `(4/3)π×${sphereRadius}³ = (1/3)πr²×${coneHeight}.` },
        { title: "Recover the cone radius", body: `r² = 4×${sphereRadius}³/${coneHeight} = ${recoveredSquared}, so r = ${recoveredConeRadius} cm.` },
        { title: "Convert radius to diameter", body: `Base diameter = 2×${recoveredConeRadius} = ${2 * recoveredConeRadius} cm.` },
        { title: "Form the requested ratio", body: `Diameter : height = ${2 * recoveredConeRadius} : ${coneHeight} = ${answer}.` },
      ],
      traps: [
        "The cone radius is not given; recover it from the volume equation before forming the ratio.",
        "Use base diameter 2r in the final ratio, not the recovered radius r.",
      ],
    },
    verification: {
      valid: Math.abs(recoveredConeRadius * recoveredConeRadius * coneHeight - 4 * sphereRadius * sphereRadius * sphereRadius) < 1e-8,
      method: "sphere-to-cone volume conservation with square-root radius recovery",
    },
  };
}
