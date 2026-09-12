import { strict as assert } from "node:assert";
import { validateComputerAwarenessEditorialText } from "./computer-awareness-editorial-policy";

assert.deepEqual(
  validateComputerAwarenessEditorialText({
    stem: "Which network covers a building?",
    explanation: "A LAN (Local Area Network) covers a limited area.",
  }),
  { valid: true, issues: [] },
);
assert.deepEqual(
  validateComputerAwarenessEditorialText({
    stem: "Which network covers a building?",
    explanation: "A LAN covers a limited area.",
  }).issues,
  ["UNEXPANDED_ABBREVIATION:LAN"],
);
for (const stem of [
  "In the following question, which network is used?",
  "In the following data, which value is correct?",
  "Consider the following network.",
  "Read the question carefully and name the device.",
  "Please select the correct answer.",
  "Select the correct answer.",
  "Choose the correct answer.",
  "You are given the following network.",
]) {
  assert.deepEqual(
    validateComputerAwarenessEditorialText({
      stem,
      explanation: "A Local Area Network covers a building.",
    }).issues,
    ["UNNECESSARY_STEM_OPENING"],
    stem,
  );
}
assert.deepEqual(
  validateComputerAwarenessEditorialText({
    stem: "Which person is associated with ENIAC?",
    explanation: "The person helped build the computer.",
  }).issues,
  ["ASSOCIATION_WORD_OVERUSED"],
);
assert.deepEqual(
  validateComputerAwarenessEditorialText({
    stem: "Which network is used?",
    explanation: "This answer is correct. It is important to remember this. Always compare every possible network carefully.",
  }).issues,
  ["EXPLANATION_NOT_SIMPLE"],
);
console.log("[COMPUTER-AWARENESS-EDITORIAL-POLICY] PASS");
