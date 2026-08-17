import assert from "node:assert/strict";
import { generateSapCp004E1R2 } from "./SAP-001/SAP-CP-004/e1-r2-exam-runtime-release-v4";
import { generateSapCp010E1R2 } from "./SAP-002/SAP-CP-010/e1-r2-exam-runtime-release-v4";

for (let seed = 1; seed <= 100; seed += 1) {
  const ssc = generateSapCp004E1R2("CP004-R2-WEIGHTED-ROOT-QUOTIENT", seed);
  assert.equal(ssc.validation.ok, true, `CP004 weighted quotient/${seed}: ${ssc.validation.errors.join("; ")}`);
  assert.equal(ssc.difficulty, "MEDIUM");
  assert.equal(ssc.lifecycle.active, false);
  assert.equal(ssc.lifecycle.questionStudioDiscoverable, false);
  assert.equal(ssc.lifecycle.questionBankWritable, false);
  assert.equal(ssc.lifecycle.testEligible, false);
  assert.equal(ssc.lifecycle.publiclyPublishable, false);

  const bank = generateSapCp010E1R2("CP010-R2-SUPPLIED-ROOT-QUOTIENT", seed);
  assert.equal(bank.validation.ok, true, `CP010 supplied quotient/${seed}: ${bank.validation.errors.join("; ")}`);
  assert.equal(bank.difficulty, "MEDIUM");
  assert.equal(bank.lifecycle.active, false);
  assert.equal(bank.lifecycle.questionStudioDiscoverable, false);
  assert.equal(bank.lifecycle.questionBankWritable, false);
  assert.equal(bank.lifecycle.testEligible, false);
  assert.equal(bank.lifecycle.publiclyPublishable, false);

  const difference = generateSapCp010E1R2("CP010-R2-SUPPLIED-ROOT-DIFFERENCE", seed);
  assert.equal(difference.validation.ok, true);
  assert.equal(difference.difficulty, "HARD");
}

console.log(JSON.stringify({
  authority: "SAP-E1-R2-RELEASE-CALIBRATION-V4",
  states: 300,
  weightedRootQuotient: "MEDIUM",
  suppliedRootQuotient: "MEDIUM",
  suppliedRootDifference: "HARD",
  lifecycle: "INACTIVE",
}));
