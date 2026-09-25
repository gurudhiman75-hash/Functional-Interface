import fs from "node:fs";
import path from "node:path";

import {
  equalsRational,
  quadraticDiscriminant,
  rational,
  solveQuadraticEquation,
} from "../../../../../shared/algebra";
import {
  ALG_CP009_ENGLISH_REVIEW_V4_AUTHORITY,
  generateAlgCp009EnglishReviewV4,
} from "../permanent/english-review-v4-cp009";
import { ALG_ENGLISH_V3_FREEZE_ID } from "../permanent/english-freeze-v3";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) =>
    typeof entry === "bigint" ? `${entry}n` : entry,
  );
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x;
}

const samples = 64;
const states = new Set<string>();
const questions = new Set<string>();
const explanations = new Set<string>();
const frames = new Set<string>();
const reviewRows: ReturnType<typeof generateAlgCp009EnglishReviewV4>[] = [];

for (let seed = 1; seed <= samples; seed += 1) {
  const first = generateAlgCp009EnglishReviewV4(seed);
  const replay = generateAlgCp009EnglishReviewV4(seed);
  const prefix = `ALG-CP009-CAND-005/seed-${seed}`;

  assert(stable(first) === stable(replay), `${prefix}: generation is not deterministic`);
  assert(first.authority === ALG_CP009_ENGLISH_REVIEW_V4_AUTHORITY, `${prefix}: wrong authority`);
  assert(first.sourceFreezeId === ALG_ENGLISH_V3_FREEZE_ID, `${prefix}: source freeze reference missing`);
  assert(first.cpId === "ALG-CP-009" && first.packageId === "ALG-002", `${prefix}: CP/package identity changed`);
  assert(first.qlId === "ALG-QL-026" && first.prototypeId === "ALG-CP009-CAND-005", `${prefix}: permanent identity changed`);
  assert(first.permanentIdentityFrozen && first.semanticContractFrozen && first.solverAuthorityFrozen, `${prefix}: frozen semantic boundary lost`);
  assert(!first.learnerContentFrozen && first.reviewStatus === "REVIEW_CANDIDATE_ONLY", `${prefix}: review-only state missing`);
  assert(!first.active && !first.questionStudioDiscoverable, `${prefix}: activation leaked`);
  assert(!first.questionBankWritable && !first.testEligible && !first.publiclyPublishable, `${prefix}: production eligibility leaked`);

  const { a, repeatedRoot, kCoefficient } = first.state;
  const b = -2 * a * repeatedRoot;
  assert(gcd(gcd(a, Math.abs(b)), kCoefficient) === 1, `${prefix}: parameter family has removable common content`);
  assert(a >= 1 && a <= 6, `${prefix}: leading coefficient left exam-safe range`);
  assert(Math.abs(b) <= 60, `${prefix}: middle coefficient left exam-safe range`);
  assert(kCoefficient >= 1 && kCoefficient <= 6, `${prefix}: k coefficient left exam-safe range`);
  assert(first.parameterValue >= 1 && first.parameterValue <= 30, `${prefix}: k answer left exam-safe range`);

  const expectedK = (a * repeatedRoot * repeatedRoot) / kCoefficient;
  assert(Number.isInteger(expectedK), `${prefix}: expected integral k`);
  assert(first.parameterValue === expectedK, `${prefix}: parameter value does not match the constructed state`);

  const discriminant = quadraticDiscriminant(first.equation);
  const solved = solveQuadraticEquation(first.equation);
  assert(discriminant.numerator === 0n, `${prefix}: discriminant is not zero`);
  assert(solved.kind === "REPEATED_ROOT", `${prefix}: exact solver did not confirm equal roots`);
  if (solved.kind === "REPEATED_ROOT") {
    assert(
      equalsRational(solved.root, rational(BigInt(repeatedRoot))),
      `${prefix}: repeated root does not match the constructed state`,
    );
  }

  assert(first.explanation.length >= 220, `${prefix}: explanation is too thin`);
  assert(first.explanation.includes("D = b² - 4ac = 0"), `${prefix}: discriminant method is not explicit`);
  assert(!/associated|mainly|therefore therefore/i.test(first.question + " " + first.explanation), `${prefix}: mechanical wording leaked`);
  assert(!/\+ -/.test(first.question + " " + first.explanation), `${prefix}: awkward signed arithmetic leaked`);

  states.add(stable(first.state));
  questions.add(first.question);
  explanations.add(first.explanation);
  frames.add(first.question.replace(/-?\d+/g, "<n>"));

  if ([7, 30, 52].includes(seed)) reviewRows.push(first);
}

assert(states.size === 64, `ALG-CP009-CAND-005: expected 64 distinct primitive states, got ${states.size}`);
assert(questions.size === 64, `ALG-CP009-CAND-005: expected 64 visible questions, got ${questions.size}`);
assert(explanations.size === 64, `ALG-CP009-CAND-005: expected 64 question-specific explanations, got ${explanations.size}`);
assert(frames.size >= 4, "ALG-CP009-CAND-005: fewer than four natural stem frames were exercised");

const outputDir = path.resolve(
  process.cwd().endsWith(`${path.sep}artifacts${path.sep}api-server`)
    ? process.cwd()
    : path.resolve(process.cwd(), "artifacts/api-server"),
  "dist/quant-v4/algebra",
);
fs.mkdirSync(outputDir, { recursive: true });

const md = [
  "# Algebra CP-009 Controlled Source Reopen — V4 Review",
  "",
  `Authority: \`${ALG_CP009_ENGLISH_REVIEW_V4_AUTHORITY}\``,
  "",
  "Status: **REVIEW CANDIDATE ONLY — NOT FROZEN / NOT TEST ELIGIBLE**",
  "",
  "This pass remediates only ALG-CP009-CAND-005 / ALG-QL-026, the equal-roots parameter family.",
  "",
  "## Proof scope",
  "",
  "- targeted patterns: **1**",
  `- deterministic semantic samples: **${samples}**`,
  "- distinct primitive mathematical states: **64/64**",
  "- exam-safe coefficients: **a ≤ 6, |b| ≤ 60, coefficient of k ≤ 6, answer k ≤ 30**",
  "- exact condition: **D = 0 independently verified**",
  "- exact solver: **repeated root independently verified**",
  "- natural stem frames: **4**",
  "- lifecycle: **review-only; no Question Bank/test/public promotion**",
  "",
  "## Human-review sample",
  "",
  ...reviewRows.flatMap((row, index) => [
    `### ${index + 1}. ${row.prototypeId} / ${row.qlId} — seed ${row.seed}`,
    "",
    row.question,
    "",
    `**Answer:** ${row.answerText}`,
    "",
    `**Explanation:** ${row.explanation}`,
    "",
  ]),
].join("\n");

const mdPath = path.join(outputDir, "algebra-cp009-source-reopen-v4-review.md");
fs.writeFileSync(mdPath, `${md}\n`);

console.log(`ALG-CP009 V4 controlled reopen passed: ${samples} semantic/variety samples; review pack ${mdPath}`);
