import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { generateNumCp012Wave01 } from "../wave01/runtime.ts";
import { generateNumCp012Wave02 } from "../wave02/runtime.ts";

let claimChecks = 0;
let terminalChecks = 0;
let candidateSetChecks = 0;

for (let seed = 1; seed <= 80; seed += 1) {
  const recognition = generateNumCp012Wave01("NUM-CP012-PROT-001", seed);
  const k = Number(recognition.hiddenState.k);
  const factors = recognition.hiddenState.factors as readonly (readonly [bigint, number])[];
  const exponentRule = factors.every(([, exponent]) => exponent % k === 0);
  assert.equal(exponentRule, true, `Recognition/${seed}: retained perfect candidate violates exponent rule`);
  assert.equal(recognition.canonicalAnswer, String(recognition.hiddenState.perfect), `Recognition/${seed}: claim projection lost target integer`);
  claimChecks += 1;

  const terminal = generateNumCp012Wave02("NUM-CP012-PROT-013", seed);
  assert.match(terminal.answerSemantic, /IMPOSSIBLE_PERFECT_POWER_TERMINAL_PATTERN/u);
  assert.match(terminal.explanation.coreConcept, /never proves/iu, `Terminal/${seed}: rejection-only warning missing`);
  assert.ok(
    terminal.representation === "SQUARE_UNIT_DIGIT_REJECTION"
      || terminal.representation === "CUBE_LAST_TWO_DIGIT_REJECTION",
    `Terminal/${seed}: CP009-like terminal computation leaked`,
  );
  terminalChecks += 1;

  const inverse = generateNumCp012Wave02("NUM-CP012-PROT-014", seed);
  const arithmeticValid = inverse.hiddenState.arithmeticValid as readonly number[];
  const expectedClass = arithmeticValid.length === 0
    ? "NO_SOLUTION"
    : arithmeticValid.length === 1
      ? "ONE_SOLUTION"
      : "MULTIPLE_SOLUTIONS";
  assert.equal(inverse.canonicalAnswer, expectedClass, `Inverse/${seed}: candidate-set collapse mismatch`);
  assert.deepEqual(
    inverse.hiddenState.verifierValid,
    arithmeticValid,
    `Inverse/${seed}: complete-set projection lacks independent agreement`,
  );
  candidateSetChecks += 1;
}

const dsPath = resolve(
  process.cwd(),
  "artifacts/api-server/src/reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-001/cp001-number-system-runtime.ts",
);
const dsRuntime = readFileSync(dsPath, "utf8");
assert.ok(dsRuntime.includes('answerSemantic: "SUFFICIENCY_CLASS"'), "DSF Number System runtime does not own sufficiency semantics");
assert.ok(dsRuntime.includes('answerContractId: "DS_STANDARD_5"'), "DSF Number System runtime does not own standard five-option DS contract");

const recordPath = resolve(
  process.cwd(),
  "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-002/NUM-CP-012/NUM-CP-012-WAVE03-REPRESENTATION-SATURATION.md",
);
const record = readFileSync(recordPath, "utf8");
for (const marker of [
  "MERGE as a representation of recognition",
  "MERGE into the recognition/claim authority",
  "MERGE as an inverse-exponent representation",
  "REASSIGN to `DSF-001`",
  "SPLIT from least multiplier by answer semantic",
  "Recognition versus exact root",
  "Directional additive completion",
  "Bound value versus nearest value",
  "No additional temporary solve prototype is required",
]) {
  assert.ok(record.includes(marker), `Wave03 representation record missing marker: ${marker}`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP012_WAVE03_REPRESENTATION_SATURATION",
  claimChecks,
  terminalChecks,
  candidateSetChecks,
  addedTemporarySolvePrototypes: 0,
  dataSufficiencyOwner: "DSF-001",
  terminalCompatibilityAuthorityInflation: false,
  permanentQlAllocations: 0,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
