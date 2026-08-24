import { proofEvent, sriPick } from "../../../../../shared/surds-indices";
import { textAnswer, textDistractors } from "../discovery-answer-utils";
import { finalizeSriDiscoveryQuestion } from "../discovery-runtime";
import type { SriCandidateDescriptor, SriDiscoveryQuestion } from "../discovery-types";

export const SRI_SOURCE_SATURATION_ADDITIONS: readonly SriCandidateDescriptor[] = [
  { candidateId: "C008-I", checkpointId: "SRI-CP-008", title: "derive the condition for a false-distribution square-root identity to hold", sourceDisposition: "SOURCE_GATED" },
  { candidateId: "C011-J", checkpointId: "SRI-CP-011", title: "compare positive finite surd sums exactly by squaring", sourceDisposition: "EXPAND" },
] as const;

function conditionDistractors(first: string, second: string, correctKey: string) {
  return textDistractors([
    { text: `${first}${second} = 0`, key: "T:XY_ZERO", misconceptionId: "CORRECT_CONDITION" },
    { text: `${first} = ${second}`, key: "T:X_EQUALS_Y", misconceptionId: "ASSUME_EQUAL_RADICANDS" },
    { text: `${first} + ${second} = 0`, key: "T:SUM_ZERO", misconceptionId: "DROP_CROSS_TERM" },
    { text: `${first}${second} = 1`, key: "T:XY_ONE", misconceptionId: "NORMALIZE_CROSS_TERM_TO_ONE" },
  ].filter((item) => item.key !== correctKey));
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
    [6, 2, 5, 3], [10, 2, 7, 5], [11, 3, 9, 5], [13, 3, 11, 5],
    [14, 2, 11, 5], [15, 3, 13, 5], [17, 3, 13, 7], [19, 5, 17, 7],
  ] as const);
}

export function generateSriSourceSaturationAddition(candidateId: string, seed: string): SriDiscoveryQuestion {
  switch (candidateId) {
    case "C008-I": {
      const [first, second] = sriPick(`${seed}:symbols`, [["x", "y"], ["a", "b"], ["p", "q"], ["m", "n"]] as const);
      const answer = textAnswer(`${first}${second} = 0`, "T:XY_ZERO");
      const stem = sriPick(`${seed}:surface`, [
        `For non-negative ${first},${second}, if \\sqrt{${first}}+\\sqrt{${second}}=\\sqrt{${first}+${second}}, which condition must hold?`,
        `Given ${first},${second}≥0 and \\sqrt{${first}}+\\sqrt{${second}}=\\sqrt{${first}+${second}}, determine the necessary condition.`,
        `Under what condition on non-negative ${first},${second} can \\sqrt{${first}}+\\sqrt{${second}} equal \\sqrt{${first}+${second}}?`,
        `If \\sqrt{${first}}+\\sqrt{${second}}=\\sqrt{${first}+${second}} for ${first},${second}≥0, what follows?`,
      ]);
      return finalizeSriDiscoveryQuestion({
        packageId: "SRI-002", checkpointId: "SRI-CP-008", candidateId, seed,
        state: { firstVariable: first, secondVariable: second, nonNegativeDomain: true },
        stem, answer,
        canonicalSolverKey: "T:XY_ZERO",
        independentVerifierKey: "T:XY_ZERO",
        distractors: conditionDistractors(first, second, answer.canonicalKey),
        explanation: {
          given: "Two non-negative quantities satisfy the displayed square-root equality.",
          asked: "Find the condition forced by the equality.",
          method: "Square both non-negative sides and isolate the cross term; a square root does not ordinarily distribute over addition.",
          working: [
            `${first}+${second}+2\\sqrt{${first}${second}}=${first}+${second}`,
            `2\\sqrt{${first}${second}}=0`,
            `Therefore ${first}${second}=0.`,
          ],
          answer: answer.text,
        },
        proofEvents: [
          proofEvent("DOMAIN_CHECK", "principal square roots require non-negative variables", { first, second }, { valid: "true" }),
          proofEvent("SOLVE", "square both sides and isolate the cross term", { equation: "sqrt(u)+sqrt(v)=sqrt(u+v)" }, { condition: "uv=0" }),
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
        `Compare the positive surd sums \\sqrt{${a}}+\\sqrt{${b}} and \\sqrt{${c}}+\\sqrt{${d}} by exact arithmetic.`,
      ]);
      const equalRationalParts = a + b === c + d;
      if (!equalRationalParts) throw new Error("C011-J construction requires equal squared rational parts");
      const verifierRelation: Relation = firstProduct > secondProduct ? "FIRST_GREATER" : firstProduct < secondProduct ? "SECOND_GREATER" : "EQUAL";
      return finalizeSriDiscoveryQuestion({
        packageId: "SRI-002", checkpointId: "SRI-CP-011", candidateId, seed,
        state: { a, b, c, d, commonRadicandSum: a + b, firstProduct, secondProduct },
        stem, answer,
        canonicalSolverKey: answer.canonicalKey,
        independentVerifierKey: relationAnswer(verifierRelation).canonicalKey,
        distractors: relationDistractors(answer.canonicalKey),
        explanation: {
          given: "Both expressions are positive sums of two square roots with equal radicand sums.",
          asked: "Compare the two expressions exactly.",
          method: "Square both positive expressions. Their rational parts match, so compare the exact cross-term products.",
          working: [
            `Both squared expressions have rational part ${a + b}.`,
            `First cross-term radicand: ${a}×${b}=${firstProduct}.`,
            `Second cross-term radicand: ${c}×${d}=${secondProduct}.`,
            `Hence ${answer.text.toLowerCase()}.`,
          ],
          answer: answer.text,
        },
        proofEvents: [proofEvent("SOLVE", "square positive finite surd sums and compare cross terms", { firstProduct: String(firstProduct), secondProduct: String(secondProduct) }, { relation })],
      });
    }
    default:
      throw new Error(`Unknown SRI source-saturation addition: ${candidateId}`);
  }
}
