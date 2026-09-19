import fs from "node:fs";
import path from "node:path";

import {
  compareExactRootSets,
  exactRootsFromQuadraticState,
  solveQuadraticEquation,
} from "../../../../../shared/algebra";
import {
  ALG_CP011_ENGLISH_REVIEW_V4_AUTHORITY,
  ALG_CP011_ENGLISH_REVIEW_V4_VARIANT_COUNT,
  generateAlgCp011EnglishReviewV4,
} from "../permanent/english-review-v4-cp011";
import { ALG_ENGLISH_V3_FREEZE_ID } from "../permanent/english-freeze-v3";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) =>
    typeof entry === "bigint" ? `${entry}n` : entry,
  );
}

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x;
}

function assertPrimitiveEquation(
  equation: ReturnType<typeof generateAlgCp011EnglishReviewV4>["equationX"],
  prefix: string,
) {
  assert(
    equation.a.denominator === 1n
      && equation.b.denominator === 1n
      && equation.c.denominator === 1n,
    `${prefix}: review equation must keep integral coefficients`,
  );
  const common = gcd(gcd(equation.a.numerator, equation.b.numerator), equation.c.numerator);
  assert(common === 1n, `${prefix}: equation contains superficial common-factor scaling`);
}

const samplesPerVariant = 64;
const reviewRows: ReturnType<typeof generateAlgCp011EnglishReviewV4>[] = [];

for (let variantIndex = 0; variantIndex < ALG_CP011_ENGLISH_REVIEW_V4_VARIANT_COUNT; variantIndex += 1) {
  const stateFingerprints = new Set<string>();
  const questions = new Set<string>();
  const explanationFingerprints = new Set<string>();
  const firstLines = new Set<string>();

  for (let seed = 1; seed <= samplesPerVariant; seed += 1) {
    const first = generateAlgCp011EnglishReviewV4(seed, variantIndex);
    const replay = generateAlgCp011EnglishReviewV4(seed, variantIndex);
    const prefix = `variant-${variantIndex}/seed-${seed}`;

    assert(stable(first) === stable(replay), `${prefix}: generation is not deterministic`);
    assert(first.authority === ALG_CP011_ENGLISH_REVIEW_V4_AUTHORITY, `${prefix}: wrong authority`);
    assert(first.sourceFreezeId === ALG_ENGLISH_V3_FREEZE_ID, `${prefix}: source freeze reference missing`);
    assert(first.qlId === "ALG-QL-032" && first.cpId === "ALG-CP-011", `${prefix}: identity changed`);
    assert(first.packageId === "ALG-002", `${prefix}: package changed`);
    assert(first.permanentIdentityFrozen && first.semanticContractFrozen && first.solverAuthorityFrozen, `${prefix}: frozen semantic boundary lost`);
    assert(!first.learnerContentFrozen && first.reviewStatus === "REVIEW_CANDIDATE_ONLY", `${prefix}: review-only content state missing`);
    assert(!first.active && !first.questionStudioDiscoverable, `${prefix}: activation leaked`);
    assert(!first.questionBankWritable && !first.testEligible && !first.publiclyPublishable, `${prefix}: production eligibility leaked`);

    assertPrimitiveEquation(first.equationX, `${prefix}/equation-x`);
    assertPrimitiveEquation(first.equationY, `${prefix}/equation-y`);

    const xRoots = exactRootsFromQuadraticState(solveQuadraticEquation(first.equationX));
    const yRoots = exactRootsFromQuadraticState(solveQuadraticEquation(first.equationY));
    const independentlyResolved = compareExactRootSets(xRoots, yRoots);
    assert(independentlyResolved === first.canonicalAnswer, `${prefix}: canonical relation mismatch`);

    assert(first.question.includes("Equation I:") || first.question.includes("I."), `${prefix}: missing first equation label`);
    assert(first.question.includes("Equation II:") || first.question.includes("II."), `${prefix}: missing second equation label`);
    assert(!/Equation I:.*Equation II:.*Compare x and y\./s.test(first.question), `${prefix}: legacy machine-like one-line framing returned`);
    assert(first.explanation.includes("Equation I gives"), `${prefix}: explanation does not teach first root set`);
    assert(first.explanation.includes("Equation II gives"), `${prefix}: explanation does not teach second root set`);
    assert(first.explanation.length >= 120, `${prefix}: explanation is too thin`);
    assert(!/\/1\b/.test(first.explanation), `${prefix}: learner-facing root notation contains a redundant /1 denominator`);

    stateFingerprints.add(stable([first.equationX, first.equationY]));
    questions.add(first.question);
    explanationFingerprints.add(first.explanation);
    firstLines.add(first.question.split("\n")[0]!);

    if (seed === 11 || seed === 29) reviewRows.push(first);
  }

  assert(stateFingerprints.size >= 32, `variant-${variantIndex}: state pool remains thin (${stateFingerprints.size}/64 unique)`);
  assert(questions.size >= 32, `variant-${variantIndex}: question variety remains thin (${questions.size}/64 unique)`);
  assert(explanationFingerprints.size >= 32, `variant-${variantIndex}: explanation variety remains thin (${explanationFingerprints.size}/64 unique)`);
  assert(firstLines.size >= 3, `variant-${variantIndex}: fewer than three natural stem frames were exercised`);
}

const outputDir = path.resolve(
  process.cwd().endsWith(`${path.sep}artifacts${path.sep}api-server`)
    ? process.cwd()
    : path.resolve(process.cwd(), "artifacts/api-server"),
  "dist/quant-v4/algebra",
);
fs.mkdirSync(outputDir, { recursive: true });

const relationLabels: Record<string, string> = {
  X_GREATER_THAN_Y: "x > y",
  X_LESS_THAN_Y: "x < y",
  X_GREATER_THAN_OR_EQUAL_TO_Y: "x ≥ y",
  X_LESS_THAN_OR_EQUAL_TO_Y: "x ≤ y",
  X_EQUAL_TO_Y: "x = y",
  RELATION_CANNOT_BE_ESTABLISHED: "Relation cannot be established",
};

const md = [
  "# Algebra CP-011 Controlled Source Reopen — V4 Review",
  "",
  `Authority: \`${ALG_CP011_ENGLISH_REVIEW_V4_AUTHORITY}\``,
  "",
  "Status: **REVIEW CANDIDATE ONLY — NOT FROZEN / NOT TEST ELIGIBLE**",
  "",
  "This pack changes learner-facing CP-011 states, stems and explanations only. ALG-QL-032 identity, the Banking quadratic-comparison semantic contract, shared solver authority and answer relations remain frozen.",
  "",
  "## Proof scope",
  "",
  `- variants: **${ALG_CP011_ENGLISH_REVIEW_V4_VARIANT_COUNT}**`,
  `- deterministic proof samples: **${ALG_CP011_ENGLISH_REVIEW_V4_VARIANT_COUNT * samplesPerVariant}**`,
  "- minimum required unique mathematical states per variant: **32/64**",
  "- natural stem frames exercised per variant: **at least 3**",
  "- lifecycle: **review-only; no Question Bank/test/public promotion**",
  "",
  "## Human-review sample",
  "",
  ...reviewRows.flatMap((row, index) => [
    `### ${index + 1}. ${row.prototypeId} — seed ${row.seed}`,
    "",
    row.question,
    "",
    `**Answer:** ${relationLabels[row.canonicalAnswer] ?? row.canonicalAnswer}`,
    "",
    `**Explanation:** ${row.explanation}`,
    "",
  ]),
].join("\n");

const mdPath = path.join(outputDir, "algebra-cp011-source-reopen-v4-review.md");
fs.writeFileSync(mdPath, `${md}\n`);

console.log(
  `ALG-CP011 V4 controlled reopen passed: ${ALG_CP011_ENGLISH_REVIEW_V4_VARIANT_COUNT * samplesPerVariant} semantic/variety samples; review pack ${mdPath}`,
);
