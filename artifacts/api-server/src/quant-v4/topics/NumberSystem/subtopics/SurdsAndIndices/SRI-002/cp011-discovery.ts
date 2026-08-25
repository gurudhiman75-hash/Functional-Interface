import {
  compareSquareSurds,
  proofEvent,
  rational,
  squareRootBounds,
  squareSurd,
  sriInt,
  sriPick,
  verifySquareRootEquationCandidate,
} from "../../../../../shared/surds-indices";
import { integerAnswer, rationalDistractors, textAnswer, textDistractors } from "../discovery-answer-utils";
import { finalizeSriDiscoveryQuestion, type SriDistractor } from "../discovery-runtime";
import type { SriCandidateAnswer, SriCandidateDescriptor, SriDiscoveryQuestion } from "../discovery-types";

export const SRI_CP011_CANDIDATES: readonly SriCandidateDescriptor[] = [
  { candidateId: "C011-A", checkpointId: "SRI-CP-011", title: "compare positive single square surds exactly", sourceDisposition: "KEEP" },
  { candidateId: "C011-B", checkpointId: "SRI-CP-011", title: "compare coefficient-bearing square surds by exact squares", sourceDisposition: "KEEP" },
  { candidateId: "C011-C", checkpointId: "SRI-CP-011", title: "compare radicals of different indices via common exact power", sourceDisposition: "EXPAND" },
  { candidateId: "C011-D", checkpointId: "SRI-CP-011", title: "locate square root between consecutive integers", sourceDisposition: "NEW" },
  { candidateId: "C011-E", checkpointId: "SRI-CP-011", title: "exact bound statement for a scaled irrational radical", sourceDisposition: "NEW" },
  { candidateId: "C011-F", checkpointId: "SRI-CP-011", title: "transform conjugate reciprocal surd value", sourceDisposition: "NEW" },
  { candidateId: "C011-G", checkpointId: "SRI-CP-011", title: "solve bounded one-radical equation and verify domain", sourceDisposition: "NEW" },
  { candidateId: "C011-H", checkpointId: "SRI-CP-011", title: "reject extraneous radical-equation candidate after squaring", sourceDisposition: "NEW" },
  { candidateId: "C011-I", checkpointId: "SRI-CP-011", title: "statement truth set involving surd bounds", sourceDisposition: "NEW" },
] as const;

type Relation = "FIRST_GREATER" | "SECOND_GREATER" | "EQUAL";

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
  asked: string,
): SriDiscoveryQuestion {
  return finalizeSriDiscoveryQuestion({
    packageId: "SRI-002",
    checkpointId: "SRI-CP-011",
    candidateId,
    seed,
    state,
    stem,
    answer,
    canonicalSolverKey: answer.canonicalKey,
    independentVerifierKey: verifierKey,
    distractors,
    explanation: { given: stem.replace(/\?$/, ""), asked, method, working, answer: answer.text },
    proofEvents: [proofEvent("SOLVE", method, { stem }, { answer: answer.text })],
  });
}

function relationFromNumber(value: number): Relation {
  return value > 0 ? "FIRST_GREATER" : value < 0 ? "SECOND_GREATER" : "EQUAL";
}

function relationAnswer(relation: Relation): SriCandidateAnswer {
  return relation === "FIRST_GREATER"
    ? textAnswer("First expression is greater", "T:FIRST_GREATER")
    : relation === "SECOND_GREATER"
      ? textAnswer("Second expression is greater", "T:SECOND_GREATER")
      : textAnswer("The two expressions are equal", "T:EQUAL");
}

function relationDistractors(): SriDistractor[] {
  return textDistractors([
    { text: "First expression is greater", key: "T:FIRST_GREATER", misconceptionId: "COMPARE_VISIBLE_FORM_ONLY" },
    { text: "Second expression is greater", key: "T:SECOND_GREATER", misconceptionId: "COMPARE_VISIBLE_FORM_ONLY" },
    { text: "The two expressions are equal", key: "T:EQUAL", misconceptionId: "ASSUME_EQUALITY" },
    { text: "Cannot be determined exactly", key: "T:UNKNOWN", misconceptionId: "USE_DECIMAL_DEPENDENCE" },
  ]);
}

function rootText(index: number, radicand: bigint): string {
  return index === 2 ? `\\sqrt{${radicand}}` : `\\sqrt[${index}]{${radicand}}`;
}

function gcd(a: number, b: number): number {
  let x = a;
  let y = b;
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

function truthSet(first: boolean, second: boolean): string {
  if (first && second) return "BOTH";
  if (first) return "ONLY_I";
  if (second) return "ONLY_II";
  return "NEITHER";
}

function truthAnswer(key: string): SriCandidateAnswer {
  const text = key === "BOTH" ? "Both I and II" : key === "ONLY_I" ? "Only I" : key === "ONLY_II" ? "Only II" : "Neither I nor II";
  return textAnswer(text, `T:${key}`);
}

function truthDistractors(): SriDistractor[] {
  return textDistractors([
    { text: "Only I", key: "T:ONLY_I", misconceptionId: "MISCLASSIFY_STATEMENT_II" },
    { text: "Only II", key: "T:ONLY_II", misconceptionId: "MISCLASSIFY_STATEMENT_I" },
    { text: "Both I and II", key: "T:BOTH", misconceptionId: "ACCEPT_BOTH_STATEMENTS" },
    { text: "Neither I nor II", key: "T:NEITHER", misconceptionId: "REJECT_BOTH_STATEMENTS" },
  ]);
}

export function generateSriCp011Candidate(candidateId: string, seed: string): SriDiscoveryQuestion {
  switch (candidateId) {
    case "C011-A": {
      const r = BigInt(sriPick(`${seed}:r`, [2, 3, 5, 6, 7, 10, 11, 13, 17]));
      const s = BigInt(sriPick(`${seed}:s`, [2, 3, 5, 6, 7, 10, 11, 13, 17].filter((value) => BigInt(value) !== r)));
      const first = squareSurd(rational(1), r);
      const second = squareSurd(rational(1), s);
      const solver = relationFromNumber(compareSquareSurds(first, second));
      const verifier = relationFromNumber(r > s ? 1 : r < s ? -1 : 0);
      const answer = relationAnswer(solver);
      const stem = sriPick(`${seed}:surface`, [
        `Compare \\sqrt{${r}} and \\sqrt{${s}} exactly.`,
        `Which is greater: \\sqrt{${r}} or \\sqrt{${s}}?`,
        `Without decimal approximation, compare \\sqrt{${r}} with \\sqrt{${s}}.`,
        `Determine the exact order of \\sqrt{${r}} and \\sqrt{${s}}.`,
      ]);
      return finish(candidateId, seed, { r: r.toString(), s: s.toString() }, stem, answer, relationAnswer(verifier).canonicalKey,
        relationDistractors(), "Both radicals are positive, so compare their squares exactly.",
        [`(\\sqrt{${r}})^2=${r}`, `(\\sqrt{${s}})^2=${s}`], "Compare the two positive square roots exactly.");
    }
    case "C011-B": {
      const a = sriInt(`${seed}:a`, 2, 8);
      const b = sriInt(`${seed}:b`, 2, 8);
      const r = BigInt(sriPick(`${seed}:r`, [2, 3, 5, 6, 7, 10, 11]));
      const s = BigInt(sriPick(`${seed}:s`, [2, 3, 5, 6, 7, 10, 11].filter((value) => BigInt(value) !== r)));
      const first = squareSurd(rational(a), r);
      const second = squareSurd(rational(b), s);
      const solver = relationFromNumber(compareSquareSurds(first, second));
      const firstSquare = BigInt(a * a) * r;
      const secondSquare = BigInt(b * b) * s;
      const verifier = relationFromNumber(firstSquare > secondSquare ? 1 : firstSquare < secondSquare ? -1 : 0);
      const answer = relationAnswer(solver);
      const stem = sriPick(`${seed}:surface`, [
        `Compare ${a}\\sqrt{${r}} and ${b}\\sqrt{${s}} exactly.`,
        `Which is greater: ${a}\\sqrt{${r}} or ${b}\\sqrt{${s}}?`,
        `Compare the positive surds ${a}\\sqrt{${r}} and ${b}\\sqrt{${s}} by exact arithmetic.`,
        `Without decimals, determine the order of ${a}\\sqrt{${r}} and ${b}\\sqrt{${s}}.`,
      ]);
      return finish(candidateId, seed, { a, b, r: r.toString(), s: s.toString() }, stem, answer, relationAnswer(verifier).canonicalKey,
        relationDistractors(), "Because both quantities are positive, square them and compare the resulting integers.",
        [`(${a}\\sqrt{${r}})^2=${firstSquare}`, `(${b}\\sqrt{${s}})^2=${secondSquare}`], "Compare the two coefficient-bearing surds exactly.");
    }
    case "C011-C": {
      const pair = sriPick(`${seed}:indices`, [[2, 3], [2, 5], [3, 4], [3, 5]] as const);
      const i = pair[0];
      const j = pair[1];
      const r = BigInt(sriPick(`${seed}:r`, [2, 3, 5, 7, 11]));
      const s = BigInt(sriPick(`${seed}:s`, [2, 3, 5, 7, 11].filter((value) => BigInt(value) !== r)));
      const common = lcm(i, j);
      const leftPower = r ** BigInt(common / i);
      const rightPower = s ** BigInt(common / j);
      const solver = relationFromNumber(leftPower > rightPower ? 1 : leftPower < rightPower ? -1 : 0);
      const verifier = relationFromNumber((r ** BigInt(j)) > (s ** BigInt(i)) ? 1 : (r ** BigInt(j)) < (s ** BigInt(i)) ? -1 : 0);
      const answer = relationAnswer(solver);
      const leftText = rootText(i, r);
      const rightText = rootText(j, s);
      const stem = sriPick(`${seed}:surface`, [
        `Compare ${leftText} and ${rightText} exactly.`,
        `Which is greater: ${leftText} or ${rightText}?`,
        `Use a common exact power to compare ${leftText} with ${rightText}.`,
        `Determine the exact order of the different-index radicals ${leftText} and ${rightText}.`,
      ]);
      return finish(candidateId, seed, { firstIndex: i, secondIndex: j, r: r.toString(), s: s.toString(), commonPower: common }, stem,
        answer, relationAnswer(verifier).canonicalKey, relationDistractors(),
        `Raise both positive radicals to the common power ${common}; this preserves their order.`,
        [`${leftText}^${common}=${leftPower}`, `${rightText}^${common}=${rightPower}`], "Compare the different-index radicals exactly.");
    }
    case "C011-D": {
      const lower = sriInt(`${seed}:lower`, 2, 15);
      const offset = sriInt(`${seed}:offset`, 1, 2 * lower);
      const n = BigInt(lower * lower + offset);
      const bounds = squareRootBounds(n);
      const interval = `${bounds.lower} < \\sqrt{${n}} < ${bounds.upper}`;
      const answer = textAnswer(interval, `T:INTERVAL:${bounds.lower}:${bounds.upper}`);
      const stem = sriPick(`${seed}:surface`, [
        `Between which consecutive integers does \\sqrt{${n}} lie?`,
        `Locate \\sqrt{${n}} between two consecutive integers.`,
        `Choose the exact consecutive-integer interval containing \\sqrt{${n}}.`,
        `Without decimals, bound \\sqrt{${n}} by consecutive integers.`,
      ]);
      const distractors = textDistractors([
        { text: `${lower - 1} < \\sqrt{${n}} < ${lower}`, key: `T:INTERVAL:${lower - 1}:${lower}`, misconceptionId: "LOWER_INTERVAL" },
        { text: `${lower + 1} < \\sqrt{${n}} < ${lower + 2}`, key: `T:INTERVAL:${lower + 1}:${lower + 2}`, misconceptionId: "UPPER_INTERVAL" },
        { text: `${lower} = \\sqrt{${n}}`, key: `T:EXACT:${lower}`, misconceptionId: "ASSUME_PERFECT_SQUARE" },
      ]);
      return finish(candidateId, seed, { n: n.toString(), lower }, stem, answer,
        `T:INTERVAL:${BigInt(lower)}:${BigInt(lower + 1)}`, distractors,
        "Compare n with the consecutive perfect squares around it.",
        [`${lower}^2=${lower * lower}<${n}`, `${n}<${(lower + 1) * (lower + 1)}=${lower + 1}^2`], "Locate the square root between consecutive integers.");
    }
    case "C011-E": {
      const scale = sriInt(`${seed}:scale`, 2, 6);
      const baseLower = sriInt(`${seed}:lower`, 2, 10);
      const offset = sriInt(`${seed}:offset`, 1, 2 * baseLower);
      const n = BigInt(baseLower * baseLower + offset);
      const scaledRadicand = BigInt(scale * scale) * n;
      const bounds = squareRootBounds(scaledRadicand);
      const answer = textAnswer(`${bounds.lower} < ${scale}\\sqrt{${n}} < ${bounds.upper}`, `T:SCALED:${bounds.lower}:${bounds.upper}`);
      const stem = sriPick(`${seed}:surface`, [
        `Which exact integer bound contains ${scale}\\sqrt{${n}}?`,
        `Locate ${scale}\\sqrt{${n}} between consecutive integers without decimals.`,
        `Choose the true range statement for ${scale}\\sqrt{${n}}.`,
        `Bound the irrational quantity ${scale}\\sqrt{${n}} exactly by consecutive integers.`,
      ]);
      const distractors = textDistractors([
        { text: `${bounds.lower - 1n} < ${scale}\\sqrt{${n}} < ${bounds.lower}`, key: `T:SCALED:${bounds.lower - 1n}:${bounds.lower}`, misconceptionId: "SCALE_BOUND_TOO_LOW" },
        { text: `${bounds.upper} < ${scale}\\sqrt{${n}} < ${bounds.upper + 1n}`, key: `T:SCALED:${bounds.upper}:${bounds.upper + 1n}`, misconceptionId: "SCALE_BOUND_TOO_HIGH" },
        { text: `${scale}\\sqrt{${n}}=${bounds.lower}`, key: `T:SCALED_EXACT:${bounds.lower}`, misconceptionId: "ASSUME_SCALED_RADICAL_INTEGER" },
      ]);
      return finish(candidateId, seed, { scale, n: n.toString(), scaledRadicand: scaledRadicand.toString() }, stem, answer,
        `T:SCALED:${bounds.lower}:${bounds.upper}`, distractors,
        "Treat c√n as √(c²n), then bound that exact square root by consecutive squares.",
        [`${scale}\\sqrt{${n}}=\\sqrt{${scaledRadicand}}`, `${bounds.lower}^2<${scaledRadicand}<${bounds.upper}^2`], "Choose the exact range statement.");
    }
    case "C011-F": {
      const a = sriInt(`${seed}:a`, 2, 9);
      const b = BigInt(a * a - 1);
      const target = 4 * a * a - 2;
      const answer = integerAnswer(target);
      const stem = sriPick(`${seed}:surface`, [
        `If x=${a}+\\sqrt{${b}}, find x^2+\\frac{1}{x^2}.`,
        `For x=${a}+\\sqrt{${b}}, evaluate x^2+x^{-2} exactly.`,
        `Use the conjugate of x=${a}+\\sqrt{${b}} to find x^2+1/x^2.`,
        `Without decimal approximation, determine x^2+x^{-2} when x=${a}+\\sqrt{${b}}.`,
      ]);
      const reciprocalSum = 2 * a;
      const verifier = reciprocalSum * reciprocalSum - 2;
      return finish(candidateId, seed, { a, b: b.toString(), unitNorm: true }, stem, answer,
        integerAnswer(verifier).canonicalKey, rationalDistractors(rational(target)),
        "Since (a+√b)(a−√b)=1, the conjugate is 1/x. First find x+1/x, then square it.",
        [`x+1/x=2×${a}=${reciprocalSum}`, `x^2+1/x^2=(x+1/x)^2-2=${target}`], "Evaluate the transformed reciprocal-conjugate target.");
    }
    case "C011-G": {
      const d = sriInt(`${seed}:d`, 2, 9);
      const c = sriInt(`${seed}:c`, 1, 12);
      const x = d * d - c;
      const lower = x - sriInt(`${seed}:left-gap`, 1, 4);
      const upper = x + sriInt(`${seed}:right-gap`, 1, 4);
      const check = verifySquareRootEquationCandidate(rational(x + c), rational(d));
      if (!check.valid) throw new Error(`Reverse-constructed radical solution failed original equation: ${check.reason}`);
      const answer = integerAnswer(x);
      const stem = sriPick(`${seed}:surface`, [
        `Solve \\sqrt{x+${c}}=${d} for ${lower}≤x≤${upper}.`,
        `Within ${lower}≤x≤${upper}, find x if \\sqrt{x+${c}}=${d}.`,
        `Find the bounded real solution of \\sqrt{x+${c}}=${d}, where ${lower}≤x≤${upper}.`,
        `Determine x in [${lower},${upper}] satisfying \\sqrt{x+${c}}=${d}.`,
      ]);
      return finish(candidateId, seed, { c, d, lower, upper, x }, stem, answer,
        integerAnswer(d * d - c).canonicalKey, rationalDistractors(rational(x)),
        "Square the non-negative equation, solve the linear result, then substitute the candidate into the original radical equation.",
        [`x+${c}=${d * d}`, `x=${x}`, `Original-equation check: ${check.reason}.`], "Solve the bounded radical equation and verify the original domain.");
    }
    case "C011-H": {
      const d = sriInt(`${seed}:d`, 3, 5);
      const extraneous = d - 2;
      const valid = d + 3;
      const c = 6 - d;
      const validCheck = verifySquareRootEquationCandidate(rational(valid + c), rational(valid - d));
      const extraCheck = verifySquareRootEquationCandidate(rational(extraneous + c), rational(extraneous - d));
      if (!validCheck.valid || extraCheck.valid) throw new Error("Extraneous-root reverse construction failed verification contract");
      const answer = integerAnswer(extraneous);
      const stem = sriPick(`${seed}:surface`, [
        `Squaring \\sqrt{x+${c}}=x-${d} gives candidates x=${extraneous} and x=${valid}. Which candidate is extraneous?`,
        `For \\sqrt{x+${c}}=x-${d}, the squared equation yields ${extraneous} and ${valid}. Which value must be rejected?`,
        `After squaring \\sqrt{x+${c}}=x-${d}, candidates ${extraneous}, ${valid} appear. Identify the extraneous root.`,
        `Which candidate fails the original equation \\sqrt{x+${c}}=x-${d}: ${extraneous} or ${valid}?`,
      ]);
      const distractors = textDistractors([
        { text: String(valid), key: `R:${valid}/1`, misconceptionId: "REJECT_VALID_ROOT" },
        { text: String(d), key: `R:${d}/1`, misconceptionId: "USE_SHIFT_AS_ROOT" },
        { text: "Neither", key: "T:NEITHER", misconceptionId: "SKIP_ORIGINAL_CHECK" },
      ]);
      return finish(candidateId, seed, { c, d, extraneous, valid }, stem, answer,
        integerAnswer(extraCheck.valid ? valid : extraneous).canonicalKey, distractors,
        "A squared equation can admit a candidate with negative original right-hand side. Substitute both candidates into the unsquared equation.",
        [`For x=${extraneous}: ${extraCheck.reason}.`, `For x=${valid}: ${validCheck.reason}.`, `Reject x=${extraneous}.`], "Identify the candidate introduced by squaring that fails the original equation.");
    }
    case "C011-I": {
      const lower = sriInt(`${seed}:lower`, 2, 12);
      const offset = sriInt(`${seed}:offset`, 1, 2 * lower);
      const n = BigInt(lower * lower + offset);
      const firstTrue = sriPick(`${seed}:first`, [true, false]);
      const secondTrue = sriPick(`${seed}:second`, [true, false]);
      const statementI = firstTrue
        ? `I. ${lower}<\\sqrt{${n}}<${lower + 1}.`
        : `I. \\sqrt{${n}}<${lower}.`;
      const statementII = secondTrue
        ? `II. \\sqrt{${n}}<${lower + 1}.`
        : `II. \\sqrt{${n}}>${lower + 1}.`;
      const key = truthSet(firstTrue, secondTrue);
      const answer = truthAnswer(key);
      const bounds = squareRootBounds(n);
      const verifierFirst = firstTrue ? bounds.lower === BigInt(lower) && bounds.upper === BigInt(lower + 1) : false;
      const verifierSecond = secondTrue ? n < BigInt((lower + 1) * (lower + 1)) : false;
      const verifierKey = truthSet(verifierFirst, verifierSecond);
      const stem = sriPick(`${seed}:surface`, [
        `For \\sqrt{${n}}, consider the statements: ${statementI} ${statementII} Which are true?`,
        `Which statement set is correct for \\sqrt{${n}}? ${statementI} ${statementII}`,
        `Evaluate the two exact bound statements about \\sqrt{${n}}: ${statementI} ${statementII}`,
        `Without decimals, decide the truth of: ${statementI} ${statementII}`,
      ]);
      return finish(candidateId, seed, { n: n.toString(), lower, firstTrue, secondTrue }, stem, answer,
        truthAnswer(verifierKey).canonicalKey, truthDistractors(),
        "Compare n with the surrounding perfect squares; use those exact inequalities to test each statement.",
        [`${lower * lower}<${n}<${(lower + 1) * (lower + 1)}`, `Hence ${lower}<\\sqrt{${n}}<${lower + 1}.`, `Truth set: ${answer.text}.`], "Determine which bound statements are true.");
    }
    default:
      throw new Error(`Unknown SRI-CP-011 candidate: ${candidateId}`);
  }
}
