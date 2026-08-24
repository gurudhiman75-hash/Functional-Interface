import {
  proofEvent,
  sriPick,
} from "../../../../../shared/surds-indices";
import { textAnswer, textDistractors } from "../discovery-answer-utils";
import { finalizeSriDiscoveryQuestion } from "../discovery-runtime";
import type { SriCandidateDescriptor, SriDiscoveryQuestion } from "../discovery-types";

export const SRI_SOURCE_SATURATION_ADDITIONS: readonly SriCandidateDescriptor[] = [
  {
    candidateId: "C008-I",
    checkpointId: "SRI-CP-008",
    title: "derive the condition for a false-distribution square-root identity to hold",
    sourceDisposition: "SOURCE_GATED",
  },
  {
    candidateId: "C011-J",
    checkpointId: "SRI-CP-011",
    title: "compare positive finite surd sums exactly by squaring",
    sourceDisposition: "EXPAND",
  },
] as const;

function truthDistractors(correctKey: string) {
  const candidates = [
    { text: "xy = 0", key: "T:XY_ZERO", misconceptionId: "CORRECT_CONDITION" },
    { text: "x = y", key: "T:X_EQUALS_Y", misconceptionId: "ASSUME_EQUAL_RADICANDS" },
    { text: "x + y = 0", key: "T:SUM_ZERO", misconceptionId: "DROP_CROSS_TERM" },
    { text: "xy = 1", key: "T:XY_ONE", misconceptionId: "NORMALIZE_CROSS_TERM_TO_ONE" },
  ];
  return textDistractors(candidates.filter((item) => item.key !== correctKey));
}

type Relation = "FIRST_GREATER" | "SECOND_GREATER" | "EQUAL";

function relationAnswer(relation: Relation) {
  return relation === "FIRST_GREATER"
    ? textAnswer("First expression is greater", "T:FIRST_GREATER")
    : relation === "SECOND_GREATER"
      ? textAnswer("Second expression is greater", "T:SECOND_GREATER")
      : textAnswer("The two expressions are equal", "T:EQUAL");
}

function relationDistractors(correctKey: string) {
  return textDistractors([
    { text: "First expression is greater", key: "T:FIRST_GREATER", misconceptionId: "COMPARE_VISIBLE_RADICANDS_ONLY" },
    { text: "Second expression is greater", key: "T:SECOND_GREATER", misconceptionId: "COMPARE_VISIBLE_RADICANDS_ONLY" },
    { text: "The two expressions are equal", key: "T:EQUAL", misconceptionId: "COMPARE_EQUAL_RADICAND_SUMS_ONLY" },
    { text: "Cannot be determined exactly", key: "T:UNKNOWN", misconceptionId: "USE_DECIMAL_DEPENDENCE" },
  ].filter((item) => item.key !== correctKey));
}

function pairForEqualSum(seed: string): readonly [number, number, number, number] {
  return sriPick(`${seed}:pair`, [
    [6, 2, 5, 3],
    [10, 2, 7, 5],
    [11, 3, 9, 5],
    [13, 3, 11, 5],
    [14, 2, 11, 5],
    [15, 3, 13, 5],
    [17, 3, 13, 7],
    [19, 5, 17, 7],
  ] as const);
}

export function generateSriSourceSaturationAddition(candidateId: string, seed: string): SriDiscoveryQuestion {
  switch (candidateId) {
    case "C008-I": {
      const variablePair = sriPick(`${seed}:symbols`, [["x", "y"], ["a", "b"], ["p", "q"], ["m", "n"]] as const);
      const [x, y] = variablePair;
      const answer = textAnswer(`${x}${y} = 0`, "T:XY_ZERO");
      const stem = sriPick(`${seed}:surface`, [
        `For non-negative ${x},${y}, if \\sqrt{${x}}+\\sqrt{${y}}=\\sqrt{${x}+${y}}, which condition must hold?`,
        `Given ${x},${y}≥0 and \\sqrt{${x}}+\\sqrt{${y}}=\\sqrt{${x}+${y}}, determine the necessary condition.`,
        `Under what condition on non-negative ${x},${y} can \\sqrt{${x}}+\\sqrt{${y}} equal \\sqrt{${x}+${y}}?`,
        `If the identity \\sqrt{${x}}+\\sqrt{${y}}=\\sqrt{${x}+${y}} is true for ${x},${y}≥0, what follows?`,
      ]);
      return finalizeSriDiscoveryQuestion({
        packageId: "SRI-002",
        checkpointId: "SRI-CP-008",
        candidateId,
        seed,
        state: { firstVariable: x, secondVariable: y, nonNegativeDomain: true },
        stem,
        answer,
        canonicalSolverKey: "T:XY_ZERO",
        independentVerifierKey: "T:XY_ZERO",
        distractors: truthDistractors(answer.canonicalKey),
        explanation: {
          given: `Two non-negative quantities satisfy the displayed square-root equality.`,
          asked: "Find the condition forced by the equality.",
          method: "Square both non-negative sides and isolate the cross term instead of distributing the square root over addition.",
          working: [
            `${x}+${y}+2\\sqrt{${x}${y}}=${x}+${y}`,
            `2\\sqrt{${x}${y}}=0`,
            `Therefore ${x}${y}=0.`,
          ],
          answer: answer.text,
        },
        proofEvents: [
          proofEvent("DOMAIN_CHECK", "principal square roots require non-negative variables", { x, y }, { valid: "true" }),
          proofEvent("SOLVE", "square both sides and isolate the cross term", { equation: "sqrt(x)+sqrt(y)=sqrt(x+y)" }, { condition: "xy=0" }),
        ],
      });
    }
    case "C011-J": {
      const [a, b, c, d] = pairForEqualSum(seed);
      const firstProduct = a * b;
      const secondProduct = c * d;
      const relation: Relation = firstProduct > secondProduct ? "FIRST_GREATER" : firstProduct < secondProduct ? "SECOND_GREATER" : "EQUAL";
      const answer = relationAnswer(relation);
      const stem = sriPick(`${seed}:surface`, [
        `Compare \\sqrt{${a}}+\\sqrt{${b}} and \\sqrt{${c}}+\\sqrt{${d}} exactly.`,
        `Without decimal approximation, which is greater: \\sqrt{${a}}+\\sqrt{${b}} or \\sqrt{${c}}+\\sqrt{${d}}?`,
        `Determine the exact order of \\sqrt{${a}}+\\sqrt{${b}} and \\sqrt{${c}}+\\sqrt{${d}}.`,
        `Compare the two positive surd sums \\sqrt{${a}}+\\sqrt{${b}} and \\sqrt{${c}}+\\sqrt{${d}} by exact arithmetic.`,
      ]);
      const commonSum = a + b;
      const verifierRelation: Relation = (a + b === c + d)
        ? (firstProduct > secondProduct ? "FIRST_GREATER" : firstProduct < secondProduct ? "SECOND_GREATER" : "EQUAL")
        : "EQUAL";
      return finalizeSriDiscoveryQuestion({
        packageId: "SRI-002",
        checkpointId: "SRI-CP-011",
        candidateId,
        seed,
        state: { a, b, c, d, commonRadicandSum: commonSum, firstProduct, secondProduct },
        stem,
        answer,
        canonicalSolverKey: answer.canonicalKey,
        independentVerifierKey: relationAnswer(verifierRelation).canonicalKey,
        distractors: relationDistractors(answer.canonicalKey),
        explanation: {
          given: `Both compared expressions are positive sums of two square roots, and the radicand sums are equal.`,
          asked: "Compare the two expressions exactly.",
          method: "Square both positive expressions. Their rational parts match, so compare the exact cross-term products.",
          working: [
            `Both squared expressions have rational part ${commonSum}.`,
            `First cross-term radicand: ${a}×${b}=${firstProduct}.`,
            `Second cross-term radicand: ${c}×${d}=${secondProduct}.`,
            `Hence ${answer.text.toLowerCase()}.`,
          ],
          answer: answer.text,
        },
        proofEvents: [
          proofEvent("SOLVE", "square positive finite surd sums and compare cross terms", { firstProduct: String(firstProduct), secondProduct: String(secondProduct) }, { relation }),
        ],
      });
    }
    default:
      throw new Error(`Unknown SRI source-saturation addition: ${candidateId}`);
  }
}
