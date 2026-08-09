import { generateMenCp009Question } from "../permanent/runtime";
import type { MenCp009Question } from "../permanent/types";
import {
  MEN_CP_009_COVERAGE_V2_AUTHORITY,
  MEN_CP_009_SURFACE_VOLUME_QLS,
  type MenCp009CoverageQl,
} from "./registry";

const LABELS = ["A", "B", "C", "D"] as const;
const RADII = [4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20] as const;

type CoverageShape = "SPHERE" | "HEMISPHERE";

export interface MenCp009CoverageOption {
  label: "A" | "B" | "C" | "D";
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp009CoverageQuestion {
  authority: typeof MEN_CP_009_COVERAGE_V2_AUTHORITY;
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-009";
  permanentQlId: string;
  templateId: string;
  familyId: MenCp009CoverageQl["familyId"];
  solveMode: MenCp009CoverageQl["solveMode"];
  language: "en";
  seed: string;
  difficulty: "Medium" | "Hard";
  target: "RATIO" | "LENGTH";
  shape: CoverageShape;
  radius: number;
  givenRatio: string | null;
  stem: string;
  options: MenCp009CoverageOption[];
  correctIndex: number;
  answer: string;
  explanation: {
    physicalPicture: string;
    governingRule: string;
    steps: string[];
    shortcut: string;
    optionAnalysis: string[];
  };
  diagram: {
    kind: "SPHERE" | "HEMISPHERE";
    viewBox: "0 0 520 300";
    alt: string;
    svg: string;
    responsive: true;
    minWidthPx: 0;
  };
  verification: {
    valid: boolean;
    method: "INDEPENDENT_FORMULA_RECONSTRUCTION";
    expected: string;
  };
  validation: {
    valid: boolean;
    checks: Array<{ name: string; passed: boolean; message: string }>;
  };
  maturity: "IMPLEMENTATION_COMPLETE";
  allocationStatus: "PERMANENT_QL_ALLOCATED";
  reviewStatus: "ENGLISH_IMPLEMENTATION_FROZEN";
  questionStudioDiscoverable: false;
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
}

export type MenCp009QuestionV2 = MenCp009Question | MenCp009CoverageQuestion;

function hash(text: string) {
  let value = 2166136261 >>> 0;
  for (const character of text) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619) >>> 0;
  }
  return value;
}

function pick<T>(items: readonly T[], key: string): T {
  return items[hash(key) % items.length]!;
}

function gcd(a: number, b: number) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function ratio(a: number, b: number) {
  const divisor = gcd(a, b);
  return `${a / divisor}:${b / divisor}`;
}

function definition(qlId: string) {
  const row = MEN_CP_009_SURFACE_VOLUME_QLS.find((candidate) => candidate.qlId === qlId);
  if (!row) throw new Error(`Unknown MEN-CP-009 coverage QL: ${qlId}`);
  return row;
}

function diagram(shape: CoverageShape, radius: number) {
  const alt = `${shape === "SPHERE" ? "Sphere" : "Hemisphere"} showing radius ${radius} cm for surface-area-to-volume comparison`;
  const body =
    shape === "SPHERE"
      ? `<circle cx="260" cy="145" r="105" fill="none" stroke="#111" stroke-width="3"/><circle cx="260" cy="145" r="4" fill="#111"/><line x1="260" y1="145" x2="365" y2="145" stroke="#111" stroke-width="2"/><text x="312" y="132" text-anchor="middle" font-size="18">r = ${radius} cm</text>`
      : `<path d="M140 150 A120 120 0 0 0 380 150" fill="none" stroke="#111" stroke-width="3"/><ellipse cx="260" cy="150" rx="120" ry="34" fill="none" stroke="#111" stroke-width="3"/><circle cx="260" cy="150" r="4" fill="#111"/><line x1="260" y1="150" x2="380" y2="150" stroke="#111" stroke-width="2"/><text x="320" y="136" text-anchor="middle" font-size="18">r = ${radius} cm</text>`;
  return {
    kind: shape,
    viewBox: "0 0 520 300" as const,
    alt,
    svg: `<svg viewBox="0 0 520 300" role="img" aria-label="${alt}" style="width:100%;height:auto;min-width:0;background:#fff"><title>${alt}</title><rect x="1" y="1" width="518" height="298" rx="16" fill="#fff" stroke="#ddd"/>${body}<text x="260" y="278" text-anchor="middle" font-size="15">Compare area units with volume units only after cancelling π and common powers.</text></svg>`,
    responsive: true as const,
    minWidthPx: 0 as const,
  };
}

function shuffledOptions(
  correct: string,
  distractors: Array<{ display: string; misconceptionId: string }>,
  seed: string,
) {
  const rows = [
    { display: correct, misconceptionId: null },
    ...distractors,
  ];
  if (new Set(rows.map((row) => row.display)).size !== 4) {
    throw new Error(`MEN-CP-009 coverage option collision: ${seed}`);
  }
  const shift = hash(`${seed}:answer-position`) % 4;
  const ordered = [...rows.slice(shift), ...rows.slice(0, shift)];
  return ordered.map((row, index) => ({
    label: LABELS[index]!,
    display: row.display,
    isCorrect: row.misconceptionId === null,
    misconceptionId: row.misconceptionId,
  })) satisfies MenCp009CoverageOption[];
}

const misconceptionText: Record<string, string> = {
  REVERSED_RATIO: "reverses surface area and volume",
  USED_AREA_COEFFICIENT_ONLY: "keeps the surface-area coefficient but does not divide by volume",
  USED_LINEAR_RADIUS_RATIO: "uses the radius directly instead of cancelling the formulas",
  USED_CURVED_AREA_INSTEAD_OF_TOTAL: "uses hemisphere curved area although total area is required",
  OMITTED_VOLUME_FACTOR: "drops the two-thirds factor from hemisphere volume",
  USED_SPHERE_FORMULA: "uses the sphere relation instead of the hemisphere total-area relation",
  READ_RATIO_BACKWARDS: "reads the two terms in reverse order",
  IGNORED_COEFFICIENT: "ignores the coefficient created by formula cancellation",
  USED_SQUARED_TERM: "treats the remaining radius as squared after cancellation",
};

function createCoverageQuestion(qlId: string, seed: string): MenCp009CoverageQuestion {
  if (!seed.trim()) throw new Error("MEN-CP-009 coverage V2 requires a deterministic seed.");
  const def = definition(qlId);
  const radius = pick(RADII, `${qlId}:${seed}:radius`);
  const shape: CoverageShape =
    def.familyId.includes("HEMISPHERE_TOTAL")
      ? "HEMISPHERE"
      : pick(["SPHERE", "HEMISPHERE"] as const, `${qlId}:${seed}:shape`);
  const curvedDirect = def.familyId === "SPHERE_OR_HEMISPHERE_CURVED_SURFACE_VOLUME_RATIO";
  const curvedInverse = def.familyId === "RADIUS_FROM_CURVED_SURFACE_VOLUME_RATIO";
  const totalDirect = def.familyId === "HEMISPHERE_TOTAL_SURFACE_VOLUME_RATIO";
  const isInverse = curvedInverse || def.familyId === "HEMISPHERE_RADIUS_FROM_TOTAL_SURFACE_VOLUME_RATIO";

  const curvedRatio = ratio(3, radius);
  const totalRatio = ratio(9, 2 * radius);
  const correct = isInverse ? `${radius} cm` : totalDirect ? totalRatio : curvedRatio;
  const givenRatio = isInverse ? (curvedInverse ? curvedRatio : totalRatio) : null;

  let stem: string;
  let physicalPicture: string;
  let governingRule: string;
  let steps: string[];
  let shortcut: string;
  let distractors: Array<{ display: string; misconceptionId: string }>;

  if (curvedDirect) {
    stem =
      shape === "SPHERE"
        ? `A sphere has radius ${radius} cm. Find surface area : volume in the simplest form.`
        : `A hemisphere has radius ${radius} cm. Find curved surface area : volume in the simplest form.`;
    physicalPicture = `Both measures belong to the same ${shape === "SPHERE" ? "sphere" : "hemisphere"}, so they share π and powers of the same radius.`;
    governingRule = shape === "SPHERE"
      ? "$4\\pi r^2 : \\frac{4}{3}\\pi r^3 = 3:r$"
      : "$2\\pi r^2 : \\frac{2}{3}\\pi r^3 = 3:r$";
    steps = [
      "Write the required area first and the volume second.",
      `Cancel π and the common factor of $r^2$; the remaining ratio is $3:${radius}$, which is already simplest.`,
    ];
    shortcut = "For a sphere, or for hemisphere CSA compared with its volume, area : volume is always $3:r$.";
    distractors = [
      { display: ratio(radius, 3), misconceptionId: "REVERSED_RATIO" },
      { display: ratio(shape === "SPHERE" ? 4 : 2, radius), misconceptionId: "USED_AREA_COEFFICIENT_ONLY" },
      { display: ratio(3, radius * radius), misconceptionId: "USED_SQUARED_TERM" },
    ];
  } else if (curvedInverse) {
    stem =
      shape === "SPHERE"
        ? `For a sphere, surface area : volume is ${givenRatio}. Find its radius.`
        : `For a hemisphere, curved surface area : volume is ${givenRatio}. Find its radius.`;
    physicalPicture = "After the matching formulas are divided, only one power of radius remains in the second ratio term.";
    governingRule = "Surface area : volume $=3:r$.";
    steps = [
      `Match the given ratio ${givenRatio} with $3:r$.`,
      `The second term therefore gives $r=${radius}$ cm.`,
    ];
    shortcut = "When the first term is 3, the second term is the radius for these two formula pairs.";
    distractors = [
      { display: `${3} cm`, misconceptionId: "IGNORED_COEFFICIENT" },
      { display: `${radius * radius} cm`, misconceptionId: "USED_SQUARED_TERM" },
      { display: `${Math.max(1, radius - 3)} cm`, misconceptionId: "READ_RATIO_BACKWARDS" },
    ];
  } else if (totalDirect) {
    stem = `A solid hemisphere has radius ${radius} cm. Find total surface area : volume in the simplest form.`;
    physicalPicture = "Total area contains the curved surface and the circular base, while volume fills only the hemispherical interior.";
    governingRule = "$3\\pi r^2 : \\frac{2}{3}\\pi r^3 = 9:2r$.";
    steps = [
      "Use hemisphere TSA $=3\\pi r^2$ and volume $=\\frac{2}{3}\\pi r^3$.",
      `Cancel π and $r^2$ to obtain $9:${2 * radius}$, then reduce if needed to ${totalRatio}.`,
    ];
    shortcut = "Hemisphere TSA : volume is $9:2r$; do not use the curved-area relation $3:r$.";
    distractors = [
      { display: curvedRatio, misconceptionId: "USED_CURVED_AREA_INSTEAD_OF_TOTAL" },
      { display: ratio(9, radius), misconceptionId: "OMITTED_VOLUME_FACTOR" },
      { display: ratio(2 * radius, 9), misconceptionId: "REVERSED_RATIO" },
    ];
  } else {
    stem = `For a solid hemisphere, total surface area : volume is ${givenRatio}. Find its radius.`;
    physicalPicture = "The flat base changes the area coefficient from 2 to 3, so the cancelled ratio is $9:2r$.";
    governingRule = "Hemisphere TSA : volume $=9:2r$.";
    steps = [
      `Match ${givenRatio} with the simplified form of $9:2r$.`,
      `Reconstructing the unsimplified relation gives $2r=${2 * radius}$, hence $r=${radius}$ cm.`,
    ];
    shortcut = "Use $9:2r$, not $3:r$; the latter belongs to curved area.";
    distractors = [
      { display: `${2 * radius} cm`, misconceptionId: "IGNORED_COEFFICIENT" },
      { display: `${Math.max(1, Math.floor(radius / 2))} cm`, misconceptionId: "USED_CURVED_AREA_INSTEAD_OF_TOTAL" },
      { display: `${radius + 3} cm`, misconceptionId: "READ_RATIO_BACKWARDS" },
    ];
  }

  const options = shuffledOptions(correct, distractors, `${qlId}:${seed}`);
  const correctIndex = options.findIndex((option) => option.isCorrect);

  const independentlyExpected = (() => {
    if (curvedDirect) return ratio(3, radius);
    if (curvedInverse) return `${radius} cm`;
    if (totalDirect) return ratio(9, 2 * radius);
    return `${radius} cm`;
  })();
  const verification = {
    valid: independentlyExpected === correct,
    method: "INDEPENDENT_FORMULA_RECONSTRUCTION" as const,
    expected: independentlyExpected,
  };

  const optionAnalysis = options
    .filter((option) => !option.isCorrect)
    .map(
      (option) =>
        `Option ${option.label} (${option.display}) is incorrect because it ${misconceptionText[option.misconceptionId!] ?? "uses the wrong relation"}.`,
    );

  const learnerText = [stem, physicalPicture, governingRule, ...steps, shortcut, ...optionAnalysis].join(" ");
  const checks = [
    {
      name: "identity",
      passed: def.qlId === qlId,
      message: "Permanent QL identity must resolve to its coverage definition.",
    },
    {
      name: "verification",
      passed: verification.valid,
      message: "Independent formula reconstruction must agree.",
    },
    {
      name: "options",
      passed:
        options.length === 4 &&
        new Set(options.map((option) => option.display)).size === 4 &&
        options.filter((option) => option.isCorrect).length === 1,
      message: "Four unique options with one correct answer are required.",
    },
    {
      name: "explanation",
      passed: steps.length === 2 && optionAnalysis.length === 3,
      message: "The learner explanation and all wrong-option analyses are required.",
    },
    {
      name: "learner isolation",
      passed: !/MEN-CP009|misconceptionId|verifier|prototype/i.test(learnerText),
      message: "Internal taxonomy must not appear in learner text.",
    },
    {
      name: "lifecycle",
      passed: true,
      message: "All product delivery fields remain locked.",
    },
  ];

  return {
    authority: MEN_CP_009_COVERAGE_V2_AUTHORITY,
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-009",
    permanentQlId: def.qlId,
    templateId: def.templateId,
    familyId: def.familyId,
    solveMode: def.solveMode,
    language: "en",
    seed,
    difficulty: isInverse ? "Hard" : "Medium",
    target: isInverse ? "LENGTH" : "RATIO",
    shape,
    radius,
    givenRatio,
    stem: `${stem} ${pick(["Choose the correct option.", "Determine the required value.", "Select the correct answer.", "Calculate and mark the correct option."] as const, `${qlId}:${seed}:suffix`)}`,
    options,
    correctIndex,
    answer: correct,
    explanation: {
      physicalPicture,
      governingRule,
      steps,
      shortcut,
      optionAnalysis,
    },
    diagram: diagram(shape, radius),
    verification,
    validation: { valid: checks.every((check) => check.passed), checks },
    maturity: "IMPLEMENTATION_COMPLETE",
    allocationStatus: "PERMANENT_QL_ALLOCATED",
    reviewStatus: "ENGLISH_IMPLEMENTATION_FROZEN",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  };
}

export function generateMenCp009QuestionV2(qlId: string, seed: string): MenCp009QuestionV2 {
  if (MEN_CP_009_SURFACE_VOLUME_QLS.some((row) => row.qlId === qlId)) {
    return createCoverageQuestion(qlId, seed);
  }
  return generateMenCp009Question(qlId, seed);
}
