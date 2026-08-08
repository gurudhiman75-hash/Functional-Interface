import assert from "node:assert/strict";
import { SAP_CP003_EXAM_READINESS_POLICY } from "./exam-readiness-policy";
import { parseNumericLiteral, sameDisplayedValue, subtract, type Rat } from "./exact";
import { generateSapCp003Sweep } from "./editorial-runtime";

function numeric(value: Rat): number {
  return Number(value.n) / Number(value.d);
}

function isCrediblyClose(correct: Rat, option: Rat): boolean {
  const correctNumber = numeric(correct);
  const difference = Math.abs(numeric(subtract(option, correct)));
  const allowance = Math.max(Math.abs(correctNumber) * 0.5, Math.abs(correctNumber) < 1 ? 0.1 : 0.5);
  return difference <= allowance;
}

const sweep = generateSapCp003Sweep(100);
let eligibleNumericPackages = 0;
let zeroCloseDistractorPackages = 0;
let oneCloseDistractorPackages = 0;
let twoOrMoreCloseDistractorPackages = 0;
let equivalentOptionPairs = 0;
let missingMisconceptionBindings = 0;
const replacementsByQl = new Map<string, number>();

for (const pkg of sweep) {
  for (let left = 0; left < pkg.options.length; left += 1) {
    for (let right = left + 1; right < pkg.options.length; right += 1) {
      if (sameDisplayedValue(pkg.options[left]!.value, pkg.options[right]!.value)) equivalentOptionPairs += 1;
    }
  }
  for (const option of pkg.options.filter((option) => !option.isCorrect)) {
    if (!option.misconceptionId || option.analysis.length < 25) missingMisconceptionBindings += 1;
    if (option.misconceptionId?.startsWith("NEARBY_")) {
      replacementsByQl.set(pkg.lifecycle.permanentQlId ?? pkg.prototypeId, (replacementsByQl.get(pkg.lifecycle.permanentQlId ?? pkg.prototypeId) ?? 0) + 1);
    }
  }

  const policy = SAP_CP003_EXAM_READINESS_POLICY[pkg.prototypeId];
  if (policy.mockUse === "FOUNDATION_ONLY") continue;
  if (pkg.taskDirection === "COMPARISON" || pkg.taskDirection === "DIAGNOSIS") continue;
  const correct = parseNumericLiteral(pkg.canonicalAnswer);
  if (!correct) continue;
  eligibleNumericPackages += 1;
  const closeCount = pkg.options
    .filter((option) => !option.isCorrect)
    .map((option) => parseNumericLiteral(option.value))
    .filter((value): value is Rat => Boolean(value))
    .filter((value) => isCrediblyClose(correct, value)).length;
  if (closeCount === 0) zeroCloseDistractorPackages += 1;
  else if (closeCount === 1) oneCloseDistractorPackages += 1;
  else twoOrMoreCloseDistractorPackages += 1;
}

assert.equal(sweep.length, 1_900);
assert.ok(eligibleNumericPackages >= 1_400, `Only ${eligibleNumericPackages} non-foundation numeric packages were checked.`);
assert.equal(zeroCloseDistractorPackages, 0);
assert.equal(equivalentOptionPairs, 0);
assert.equal(missingMisconceptionBindings, 0);

console.log(JSON.stringify({
  status: "PASS_SAP_CP003_DISTRACTOR_PLAUSIBILITY_V3_AUTHORITY",
  packagesTested: sweep.length,
  eligibleNumericPackages,
  zeroCloseDistractorPackages,
  oneCloseDistractorPackages,
  twoOrMoreCloseDistractorPackages,
  equivalentOptionPairs,
  missingMisconceptionBindings,
  nearbyReplacementsByQl: Object.fromEntries([...replacementsByQl.entries()].sort()),
  foundationOnlyExcluded: true,
  comparisonAndDiagnosisExcluded: true,
  lifecycle: "INACTIVE_HUMAN_REVIEW_PENDING",
}, null, 2));
