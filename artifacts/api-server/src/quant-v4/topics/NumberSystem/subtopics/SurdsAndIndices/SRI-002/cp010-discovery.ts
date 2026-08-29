import {
  denestNestedSquareRoot,
  isDenestableNestedSquareRoot,
  proofEvent,
  rational,
  sriInt,
  sriPick,
  surdSum,
  surdSumKey,
} from "../../../../../shared/surds-indices";
import { integerAnswer, rationalDistractors, textAnswer, textDistractors } from "../discovery-answer-utils";
import { finalizeSriDiscoveryQuestion, type SriDistractor } from "../discovery-runtime";
import type { SriCandidateAnswer, SriCandidateDescriptor, SriDiscoveryQuestion } from "../discovery-types";
import { pairAnswer, surdSumAnswer, surdSumDistractors } from "./surd-discovery-utils";

export const SRI_CP010_CANDIDATES: readonly SriCandidateDescriptor[] = [
  { candidateId: "C010-A", checkpointId: "SRI-CP-010", title: "denest square root with positive inner surd", sourceDisposition: "NEW" },
  { candidateId: "C010-B", checkpointId: "SRI-CP-010", title: "denest square root with negative inner surd", sourceDisposition: "NEW" },
  { candidateId: "C010-C", checkpointId: "SRI-CP-010", title: "decide whether a supported nested surd is denestable", sourceDisposition: "NEW" },
  { candidateId: "C010-D", checkpointId: "SRI-CP-010", title: "reverse construct nested parameters from denested surds", sourceDisposition: "NEW" },
  { candidateId: "C010-E", checkpointId: "SRI-CP-010", title: "recover hidden component from a denested form", sourceDisposition: "NEW" },
  { candidateId: "C010-F", checkpointId: "SRI-CP-010", title: "nested infinite radical fixed point", sourceDisposition: "SOURCE_GATED" },
] as const;

function finish(
  candidateId: string,
  seed: string,
  state: Readonly<Record<string, string | number | boolean>>,
  stem: string,
  answer: SriCandidateAnswer,
  verifierKey: string,
  distractors: readonly SriDistractor[],
  method: string,
  working: readonly string[],
  asked = "Simplify the nested surd exactly.",
): SriDiscoveryQuestion {
  return finalizeSriDiscoveryQuestion({
    packageId: "SRI-002",
    checkpointId: "SRI-CP-010",
    candidateId,
    seed,
    state,
    stem,
    answer,
    canonicalSolverKey: answer.canonicalKey,
    independentVerifierKey: verifierKey,
    distractors,
    explanation: { given: stem.replace(/\?$/, ""), asked, method, working, answer: answer.text },
    proofEvents: [proofEvent("TRANSFORM", method, { stem }, { answer: answer.text })],
  });
}

function reverseState(seed: string): { m: bigint; n: bigint; A: bigint; B: bigint } {
  const m = BigInt(sriPick(`${seed}:m`, [5, 6, 7, 10, 11, 13, 17, 19]));
  const n = BigInt(sriPick(`${seed}:n`, [2, 3, 5, 6, 7].filter((value) => BigInt(value) < m && BigInt(value) !== m)));
  return { m, n, A: m + n, B: m * n };
}

function pairDistractors(A: bigint, B: bigint): SriDistractor[] {
  return textDistractors([
    { text: `(${A + 1n}, ${B})`, key: `PAIR:${A + 1n}/1:${B}/1`, misconceptionId: "SUM_OFF_BY_ONE" },
    { text: `(${A}, ${B + 1n})`, key: `PAIR:${A}/1:${B + 1n}/1`, misconceptionId: "PRODUCT_OFF_BY_ONE" },
    { text: `(${B}, ${A})`, key: `PAIR:${B}/1:${A}/1`, misconceptionId: "SWAP_SUM_AND_PRODUCT" },
  ]);
}

const NON_DENESTABLE_C010_C_PAIRS = [
  [5, 2],
  [7, 5],
  [9, 11],
  [10, 13],
  [11, 17],
] as const;

export function generateSriCp010Candidate(candidateId: string, seed: string): SriDiscoveryQuestion {
  switch (candidateId) {
    case "C010-A": {
      const { m, n, A, B } = reverseState(seed);
      const solver = denestNestedSquareRoot(A, B, 1);
      if (!solver) throw new Error("Reverse-constructed positive nested surd failed denesting");
      const expected = surdSum([{ coefficient: rational(1), radicand: m }, { coefficient: rational(1), radicand: n }]);
      const answer = surdSumAnswer(solver.value);
      const stem = sriPick(`${seed}:surface`, [
        `Simplify \\sqrt{${A}+2\\sqrt{${B}}}.`,
        `Denest \\sqrt{${A}+2\\sqrt{${B}}}.`,
        `Write \\sqrt{${A}+2\\sqrt{${B}}} as a sum of two simple square roots.`,
        `Find the exact denested form of \\sqrt{${A}+2\\sqrt{${B}}}.`,
      ]);
      return finish(candidateId, seed, { A: A.toString(), B: B.toString(), sign: 1, m: m.toString(), n: n.toString() }, stem,
        answer, `SS:${surdSumKey(expected)}`, surdSumDistractors(solver.value),
        "Match A=m+n and B=mn, then use √(A+2√B)=√m+√n.",
        [`${m}+${n}=${A}`, `${m}×${n}=${B}`, `Therefore ${answer.text}.`]);
    }
    case "C010-B": {
      const { m, n, A, B } = reverseState(seed);
      const solver = denestNestedSquareRoot(A, B, -1);
      if (!solver) throw new Error("Reverse-constructed negative nested surd failed denesting");
      const expected = surdSum([{ coefficient: rational(1), radicand: m }, { coefficient: rational(-1), radicand: n }]);
      const answer = surdSumAnswer(solver.value);
      const stem = sriPick(`${seed}:surface`, [
        `Simplify \\sqrt{${A}-2\\sqrt{${B}}}.`,
        `Denest \\sqrt{${A}-2\\sqrt{${B}}}.`,
        `Write \\sqrt{${A}-2\\sqrt{${B}}} as a difference of two simple square roots.`,
        `Find the exact denested form of \\sqrt{${A}-2\\sqrt{${B}}}.`,
      ]);
      return finish(candidateId, seed, { A: A.toString(), B: B.toString(), sign: -1, m: m.toString(), n: n.toString() }, stem,
        answer, `SS:${surdSumKey(expected)}`, surdSumDistractors(solver.value),
        "Match A=m+n and B=mn, with m≥n, then use √(A−2√B)=√m−√n.",
        [`${m}+${n}=${A}`, `${m}×${n}=${B}`, `Therefore ${answer.text}.`]);
    }
    case "C010-C": {
      const denestable = sriPick(`${seed}:mode`, [true, false]);
      let A: bigint;
      let B: bigint;
      if (denestable) {
        const state = reverseState(`${seed}:yes`);
        A = state.A;
        B = state.B;
      } else {
        const pair = sriPick(`${seed}:no`, NON_DENESTABLE_C010_C_PAIRS);
        A = BigInt(pair[0]);
        B = BigInt(pair[1]);
      }
      const solver = isDenestableNestedSquareRoot(A, B, 1);
      if (solver !== denestable) {
        throw new Error(`C010-C construction invariant failed for A=${A}, B=${B}`);
      }
      const answer = textAnswer(solver ? "Denestable" : "Not denestable", `T:${solver ? "DENESTABLE" : "NOT_DENESTABLE"}`);
      const stem = sriPick(`${seed}:surface`, [
        `Can \\sqrt{${A}+2\\sqrt{${B}}} be written as \\sqrt{m}+\\sqrt{n} for non-negative integers m,n?`,
        `Decide whether \\sqrt{${A}+2\\sqrt{${B}}} is denestable into two integer-radicand square roots.`,
        `Is \\sqrt{${A}+2\\sqrt{${B}}} denestable in the form \\sqrt{m}+\\sqrt{n}?`,
        `Classify \\sqrt{${A}+2\\sqrt{${B}}} as denestable or not denestable over integer radicands.`,
      ]);
      const distractors = textDistractors([
        { text: solver ? "Not denestable" : "Denestable", key: `T:${solver ? "NOT_DENESTABLE" : "DENESTABLE"}`, misconceptionId: "MISREAD_DISCRIMINANT_TEST" },
        { text: "Always denestable", key: "T:ALWAYS", misconceptionId: "ASSUME_ALL_NESTED_SURDS_DENEST" },
        { text: "Cannot be determined", key: "T:UNKNOWN", misconceptionId: "SKIP_EXACT_TEST" },
      ]);
      const discriminant = A * A - 4n * B;
      return finish(candidateId, seed, { A: A.toString(), B: B.toString(), discriminant: discriminant.toString() }, stem,
        answer, `T:${denestable ? "DENESTABLE" : "NOT_DENESTABLE"}`, distractors,
        "For integer-radicand denesting, A²−4B must be a non-negative perfect square and yield integer m,n.",
        [`A²−4B=${discriminant}.`, solver ? "The exact denesting test succeeds." : "The exact denesting test fails."],
        "Decide whether the nested surd has the supported denested form.");
    }
    case "C010-D": {
      const { m, n, A, B } = reverseState(seed);
      const sign = sriPick(`${seed}:sign`, [1, -1] as const);
      const answer = pairAnswer(rational(A), rational(B));
      const op = sign > 0 ? "+" : "-";
      const stem = sriPick(`${seed}:surface`, [
        `If (\\sqrt{${m}}${op}\\sqrt{${n}})^2=A${op}2\\sqrt{B}, find (A,B).`,
        `Squaring \\sqrt{${m}}${op}\\sqrt{${n}} gives A${op}2\\sqrt{B}. Determine A and B.`,
        `For \\sqrt{${m}}${op}\\sqrt{${n}}, recover the nested-surd parameters (A,B) after squaring.`,
        `Find (A,B) such that \\sqrt{${m}}${op}\\sqrt{${n}}=\\sqrt{A${op}2\\sqrt{B}}.`,
      ]);
      return finish(candidateId, seed, { m: m.toString(), n: n.toString(), sign }, stem, answer,
        pairAnswer(rational(m + n), rational(m * n)).canonicalKey, pairDistractors(A, B),
        "Square the two-term surd: the rational part is m+n and the cross-term contains √(mn).",
        [`A=${m}+${n}=${A}`, `B=${m}×${n}=${B}`],
        "Recover the two nested-surd parameters.");
    }
    case "C010-E": {
      const { m, n, A, B } = reverseState(seed);
      const hideSecond = sriPick(`${seed}:hide`, [true, false]);
      const hidden = hideSecond ? n : m;
      const known = hideSecond ? m : n;
      const answer = integerAnswer(hidden);
      const stem = sriPick(`${seed}:surface`, [
        `If \\sqrt{${A}+2\\sqrt{${B}}}=\\sqrt{${known}}+\\sqrt{x}, find x.`,
        `The denested form of \\sqrt{${A}+2\\sqrt{${B}}} is \\sqrt{${known}}+\\sqrt{x}. Determine x.`,
        `Find the missing radicand x in \\sqrt{${A}+2\\sqrt{${B}}}=\\sqrt{${known}}+\\sqrt{x}.`,
        `Recover x when \\sqrt{${known}}+\\sqrt{x} denests \\sqrt{${A}+2\\sqrt{${B}}}.`,
      ]);
      return finish(candidateId, seed, { A: A.toString(), B: B.toString(), known: known.toString(), hidden: hidden.toString() }, stem,
        answer, integerAnswer(A - known).canonicalKey, rationalDistractors(rational(hidden)),
        "In the denested pair, the two radicands add to A and multiply to B.",
        [`Known radicand = ${known}.`, `x=${A}-${known}=${hidden}`, `Check: ${known}×${hidden}=${B}.`],
        "Recover the missing denested radicand.");
    }
    case "C010-F": {
      const x = sriInt(`${seed}:fixed-point`, 2, 9);
      const k = x * x - x;
      const answer = integerAnswer(x);
      const stem = sriPick(`${seed}:surface`, [
        `If x=\\sqrt{${k}+\\sqrt{${k}+\\sqrt{${k}+\\cdots}}} and x>0, find x.`,
        `Evaluate the positive infinite radical \\sqrt{${k}+\\sqrt{${k}+\\sqrt{${k}+\\cdots}}}.`,
        `Let x denote \\sqrt{${k}+\\sqrt{${k}+\\sqrt{${k}+\\cdots}}}. Find the positive fixed point x.`,
        `Find the positive value of the repeating radical x=\\sqrt{${k}+x}.`,
      ]);
      const verifier = x > 0 && x * x === x + k ? x : -1;
      return finish(candidateId, seed, { k, positiveRoot: x }, stem, answer,
        integerAnswer(verifier).canonicalKey, rationalDistractors(rational(x)),
        "The repeating tail is again x, so square x=√(k+x) and keep the positive fixed point.",
        [`x^2=x+${k}`, `x^2-x-${k}=0`, `The positive root is x=${x}.`],
        "Evaluate the positive repeating radical fixed point.");
    }
    default:
      throw new Error(`Unknown SRI-CP-010 candidate: ${candidateId}`);
  }
}
