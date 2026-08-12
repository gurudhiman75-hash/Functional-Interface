import { generateCp003AuthoritativeNativeCandidate } from "./native-authoritative";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const hardModes = Object.freeze([
  "usualSpeedFromEarlyLatePair",
  "speedChangePointDistance",
  "fractionOfRouteAtChangedSpeed",
  "walkingRidingAllocation",
] as const);

let hardRows = 0;
let derivationChecks = 0;

for (const language of ["hi", "pa"] as const) {
  const rows = generateCp003AuthoritativeNativeCandidate(language);
  for (const mode of hardModes) {
    const modeRows = rows.filter((row) => row.presentation.solveMode === mode);
    assert(modeRows.length === 3, `${language}/${mode}: expected three authoritative review rows`);

    for (const row of modeRows) {
      const explanation = row.presentation.explanation;
      assert(explanation.steps.length >= 4, `${row.presentation.questionLanguageId}: Hard-mode explanation must derive the result in at least four connected steps`);
      assert(explanation.steps.at(-1)?.includes(row.presentation.answerText), `${row.presentation.questionLanguageId}: final derivation step does not reach the exact answer`);

      if (mode === "usualSpeedFromEarlyLatePair") {
        assert(explanation.steps.some((step) => /1\/\d+.*−.*1\/\d+/u.test(step)), `${row.presentation.questionLanguageId}: reciprocal-speed distance derivation missing`);
        assert(explanation.steps.some((step) => language === "hi" ? step.includes("निर्धारित यात्रा-समय") : step.includes("ਨਿਰਧਾਰਤ ਸਫ਼ਰ-ਸਮਾਂ")), `${row.presentation.questionLanguageId}: scheduled travel-time derivation missing`);
        derivationChecks += 2;
      }

      if (mode === "speedChangePointDistance") {
        assert(explanation.steps.some((step) => language === "hi" ? step.includes("पूरा मार्ग दूसरी गति") : step.includes("ਪੂਰਾ ਰਸਤਾ ਦੂਜੀ ਰਫ਼ਤਾਰ")), `${row.presentation.questionLanguageId}: all-at-second-speed baseline missing`);
        assert(explanation.steps.some((step) => language === "hi" ? step.includes("हर 1 km") : step.includes("ਹਰ 1 km")), `${row.presentation.questionLanguageId}: per-km time-effect derivation missing`);
        derivationChecks += 2;
      }

      if (mode === "fractionOfRouteAtChangedSpeed") {
        assert(explanation.steps.some((step) => language === "hi" ? step.includes("पूरा मार्ग पुरानी गति") : step.includes("ਪੂਰਾ ਰਸਤਾ ਪੁਰਾਣੀ ਰਫ਼ਤਾਰ")), `${row.presentation.questionLanguageId}: all-at-original-speed baseline missing`);
        assert(explanation.steps.some((step) => language === "hi" ? step.includes("बदली गति वाला मार्ग") : step.includes("ਬਦਲੀ ਰਫ਼ਤਾਰ ਵਾਲਾ ਰਸਤਾ")), `${row.presentation.questionLanguageId}: changed-segment distance derivation missing`);
        derivationChecks += 2;
      }

      if (mode === "walkingRidingAllocation") {
        assert(explanation.method.includes("x"), `${row.presentation.questionLanguageId}: walking/riding unknown is not explicitly introduced`);
        assert(explanation.steps[0]?.includes("x"), `${row.presentation.questionLanguageId}: walking/riding equation is not shown`);
        assert(explanation.steps.some((step) => language === "hi" ? step.includes("पैदल दूरी") : step.includes("ਪੈਦਲ ਦੂਰੀ")), `${row.presentation.questionLanguageId}: component distances are not derived`);
        derivationChecks += 3;
      }

      hardRows += 1;
    }
  }
}

assert(hardRows === 24, `Expected 24 Hindi/Punjabi Hard-mode rows, received ${hardRows}`);
assert(derivationChecks === 54, `Expected 54 explicit pedagogy checks, received ${derivationChecks}`);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_HI_PA_HARD_MODE_PEDAGOGY",
  hardModes: hardModes.length,
  hardRows,
  derivationChecks,
  minimumConnectedStepsPerHardRow: 4,
  answerFirstIntermediateJumpAllowed: false,
}, null, 2));
