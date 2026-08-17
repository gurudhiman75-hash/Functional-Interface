import assert from "node:assert/strict";

import {
  generateSapCp004E1Existing,
} from "./SAP-001/SAP-CP-004/e1-runtime";
import {
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010E1Existing,
} from "./SAP-002/SAP-CP-010/e1-runtime";

const missingExponent = generateSapCp004E1Existing("SAP-CP004-PROT-MISSING-EXPONENT", 10);
const missingExponentText = [
  missingExponent.explanation.coreConcept,
  ...missingExponent.explanation.steps,
  missingExponent.explanation.finalAnswer,
].join(" ");
assert.ok(missingExponentText.includes("There is 1 factor of"), "QL067 singular factor wording was not polished.");
assert.ok(!missingExponentText.includes("There are 1 factors of"), "QL067 ungrammatical singular factor wording remains.");
assert.equal(missingExponent.options[missingExponent.correctIndex]?.value, missingExponent.canonicalAnswer);
assert.equal(missingExponent.validation.ok, true);

const diagnosisPrototype = SAP_CP010_PROTOTYPE_IDS.at(-1)!;
assert.equal(diagnosisPrototype, "SAP-CP010-PROT-WRONG-BENCHMARK-DIAGNOSIS");
const diagnosis = generateSapCp010E1Existing(diagnosisPrototype, 44);
const diagnosisText = [
  diagnosis.explanation.coreConcept,
  ...diagnosis.explanation.steps,
  diagnosis.explanation.finalAnswer,
].join(" ");
assert.ok(!/(?<!\.)\.\.(?!\.)/u.test(diagnosisText), "QL182 duplicated terminal punctuation remains.");
assert.equal(diagnosis.options[diagnosis.correctIndex]?.value, diagnosis.canonicalAnswer);
assert.equal(diagnosis.validation.ok, true);

console.log(JSON.stringify({
  status: "PASS_SAP_ENGLISH_POLISH_REGRESSION",
  ql067SingularGrammar: true,
  ql182TerminalPunctuation: true,
  answerBindingPreserved: true,
}));
