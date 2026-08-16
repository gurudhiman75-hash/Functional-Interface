import {
  INT_CP006_DECISION,
  INT_CP006_LEGACY_RECOVERY,
  INT_CP006_QL_IDS,
  INT_CP006_RUNTIME_VERSION,
  generateIntCp006Question,
  solveIntCp006,
  verifyIntCp006Answer,
  type IntCp006QlId,
} from "./cp006-si-ci-relations-runtime-v3-final";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function rationalKey(value: { numerator: bigint; denominator: bigint }): string { return `${value.numerator}/${value.denominator}`; }

const answerMinimum: Readonly<Record<IntCp006QlId, number>> = Object.freeze({
  "INT-QL-096": 15, "INT-QL-097": 15, "INT-QL-098": 10, "INT-QL-099": 5,
  "INT-QL-100": 5, "INT-QL-101": 10, "INT-QL-102": 15, "INT-QL-103": 5,
  "INT-QL-104": 10, "INT-QL-105": 5, "INT-QL-106": 10, "INT-QL-107": 4, "INT-QL-108": 10,
});

const answerPositions = new Map<IntCp006QlId, Set<number>>();
const stemFamilies = new Map<IntCp006QlId, Set<string>>();
const answerValues = new Map<IntCp006QlId, Set<string>>();
const representations = new Map<IntCp006QlId, Set<string>>();
const ql102Directions = new Set<number>();
const consecutiveYears = new Map<IntCp006QlId, Set<number>>();
const thresholdYears = new Set<number>();
const thresholdBoundaries = new Set<string>();
let deterministicChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let misconceptionChecks = 0;

for (const qlId of INT_CP006_QL_IDS) {
  answerPositions.set(qlId, new Set());
  stemFamilies.set(qlId, new Set());
  answerValues.set(qlId, new Set());
  representations.set(qlId, new Set());
  if (qlId === "INT-QL-105" || qlId === "INT-QL-106") consecutiveYears.set(qlId, new Set());

  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp006-v1-audit-${qlId}-${index}`;
    const question = generateIntCp006Question(qlId, seed);
    const replay = generateIntCp006Question(qlId, seed);
    assert(question.mathematicalFingerprint === replay.mathematicalFingerprint, `${qlId}/${seed}: non-deterministic fingerprint`);
    assert(question.presentation.markdown === replay.presentation.markdown, `${qlId}/${seed}: non-deterministic stem`);
    assert(question.correctIndex === replay.correctIndex, `${qlId}/${seed}: non-deterministic answer position`);
    deterministicChecks += 1;

    const canonical = solveIntCp006(question.mathematicalState);
    assert(verifyIntCp006Answer(question.mathematicalState, canonical), `${qlId}/${seed}: verifier rejected canonical answer`);
    verifierChecks += 1;
    assert(question.options[question.correctIndex]!.misconceptionId === "CORRECT", `${qlId}/${seed}: correct option ownership missing`);
    assert(rationalKey(question.options[question.correctIndex]!.value) === rationalKey(canonical), `${qlId}/${seed}: correct option value drift`);

    const seenValues = new Set<string>();
    for (let optionIndex = 0; optionIndex < question.options.length; optionIndex += 1) {
      const option = question.options[optionIndex]!;
      const valueKey = rationalKey(option.value);
      assert(!seenValues.has(valueKey), `${qlId}/${seed}: duplicate numeric option ${valueKey}`);
      seenValues.add(valueKey);
      if (optionIndex !== question.correctIndex) {
        assert(option.misconceptionId !== "CORRECT", `${qlId}/${seed}: distractor marked correct`);
        assert(!verifyIntCp006Answer(question.mathematicalState, option.value), `${qlId}/${seed}: distractor independently verifies`);
        misconceptionChecks += 1;
      }
      optionChecks += 1;
    }

    assert(question.enabled === false, `${qlId}/${seed}: enabled`);
    assert(question.stagingStatus === "NOT_STAGED", `${qlId}/${seed}: staged`);
    assert(question.registrationStatus === "NOT_REGISTERED", `${qlId}/${seed}: registered`);
    assert(question.questionStudioDiscoverable === false, `${qlId}/${seed}: Studio discoverable`);
    assert(question.questionBankStatus === "NOT_STORED", `${qlId}/${seed}: bank stored`);
    assert(question.testEligibility === "INELIGIBLE", `${qlId}/${seed}: test eligible`);
    assert(question.publiclyPublishable === false, `${qlId}/${seed}: publicly publishable`);
    lifecycleChecks += 7;

    assert(!/salary|production/iu.test(question.presentation.markdown), `${qlId}/${seed}: rejected CP005-style context leaked into CP006`);
    assert(!/\$[^$]+\$/u.test(question.presentation.markdown), `${qlId}/${seed}: dollar MathJax wrapper`);
    assert(question.explanation.steps.length >= 1, `${qlId}/${seed}: explanation has no worked step`);
    assert(question.explanation.finalAnswer === question.correctAnswer, `${qlId}/${seed}: explanation final answer drift`);

    answerPositions.get(qlId)!.add(question.correctIndex);
    stemFamilies.get(qlId)!.add(question.presentation.stemFamilyId);
    answerValues.get(qlId)!.add(question.correctAnswer);
    representations.get(qlId)!.add(question.presentation.representation);

    if (qlId === "INT-QL-102") ql102Directions.add(question.mathematicalState.knownYears);
    if (qlId === "INT-QL-105" || qlId === "INT-QL-106") consecutiveYears.get(qlId)!.add(question.mathematicalState.yearNumber);
    if (qlId === "INT-QL-107") {
      thresholdYears.add(Number(canonical.numerator));
      thresholdBoundaries.add(question.mathematicalState.boundary);
    }
  }
}

for (const qlId of INT_CP006_QL_IDS) {
  assert(answerPositions.get(qlId)!.size === 4, `${qlId}: all four answer positions not reached`);
  assert(stemFamilies.get(qlId)!.size === INT_CP006_DECISION.stemTemplatesPerQl, `${qlId}: expected exactly three authored stem families`);
  assert(answerValues.get(qlId)!.size >= answerMinimum[qlId], `${qlId}: answer diversity ${answerValues.get(qlId)!.size} < ${answerMinimum[qlId]}`);
}
assert(ql102Directions.size === 2 && ql102Directions.has(2) && ql102Directions.has(3), "QL102 did not cover both D2→D3 and D3→D2 directions");
for (const qlId of ["INT-QL-105", "INT-QL-106"] as const) {
  const years = consecutiveYears.get(qlId)!;
  assert(years.size === 3 && years.has(1) && years.has(2) && years.has(3), `${qlId}: consecutive-interest years 1/2/3 not all covered`);
}
assert(thresholdYears.has(2) && thresholdYears.has(3) && thresholdYears.has(4) && thresholdYears.has(5), "QL107: threshold answer years 2..5 not all covered");
assert(thresholdBoundaries.has("EXACT") && thresholdBoundaries.has("BETWEEN"), "QL107: exact/between threshold boundaries not both covered");
assert(INT_CP006_LEGACY_RECOVERY.recovered.length === 5, "legacy CP006 recovery ledger drift");
assert(INT_CP006_LEGACY_RECOVERY.amountDifferenceDisposition === "PRESENTATION_VARIANT_OF_SAME_SI_CI_DIFFERENCE", "amount-difference disposition drift");
assert(INT_CP006_LEGACY_RECOVERY.cp003CollisionExclusions.length === 4, "CP003 collision exclusion drift");

const report = {
  runtimeVersion: INT_CP006_RUNTIME_VERSION,
  qls: INT_CP006_QL_IDS.length,
  questions: INT_CP006_QL_IDS.length * 200,
  deterministicChecks,
  verifierChecks,
  optionChecks,
  misconceptionChecks,
  lifecycleChecks,
  answerPositions: Object.fromEntries(INT_CP006_QL_IDS.map((qlId) => [qlId, [...answerPositions.get(qlId)!].sort()])),
  stemFamilies: Object.fromEntries(INT_CP006_QL_IDS.map((qlId) => [qlId, stemFamilies.get(qlId)!.size])),
  answerDiversity: Object.fromEntries(INT_CP006_QL_IDS.map((qlId) => [qlId, answerValues.get(qlId)!.size])),
  representations: Object.fromEntries(INT_CP006_QL_IDS.map((qlId) => [qlId, [...representations.get(qlId)!].sort()])),
  ql102KnownDurations: [...ql102Directions].sort(),
  consecutiveYearPositions: Object.fromEntries([...consecutiveYears].map(([qlId, values]) => [qlId, [...values].sort()])),
  thresholdYears: [...thresholdYears].sort(),
  thresholdBoundaries: [...thresholdBoundaries].sort(),
  legacyRecovered: INT_CP006_LEGACY_RECOVERY.recovered,
  cp003CollisionExclusions: INT_CP006_LEGACY_RECOVERY.cp003CollisionExclusions,
};
console.log(JSON.stringify(report, null, 2));
console.log("PASS_INT_CP006_V1_ENGLISH_RELATION_AUDIT");
