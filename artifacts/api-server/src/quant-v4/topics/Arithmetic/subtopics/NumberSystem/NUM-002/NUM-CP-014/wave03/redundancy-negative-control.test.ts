import assert from "node:assert/strict";

function gcd(a: number, b: number) {
  let x = Math.abs(a), y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
}
function unitDigitOfPower(base: number, exponent: number) {
  let value = 1;
  for (let index = 0; index < exponent; index += 1) value = (value * base) % 10;
  return value;
}

// Negative control A: HCF(n, 12) = 4 already implies n is divisible by 4.
// Adding "n is divisible by 4" therefore cannot be counted as a second essential engine.
const integers = Array.from({ length: 60 }, (_, index) => index + 1);
const exactHcf4 = integers.filter((n) => gcd(n, 12) === 4);
const divisibleBy4 = integers.filter((n) => n % 4 === 0);
const hcfAndDivisible = exactHcf4.filter((n) => divisibleBy4.includes(n));
assert.deepEqual(hcfAndDivisible, exactHcf4, "HCF=4 should imply divisibility by 4 in this negative control");
assert.equal(
  JSON.stringify(hcfAndDivisible) === JSON.stringify(exactHcf4),
  true,
  "decorative divisibility clue unexpectedly changed the candidate set",
);

// Negative control B: for powers of 2, units digit 2 occurs exactly at exponents n ≡ 1 (mod 4).
// Pairing those two statements is the same condition written twice, not synthesis.
const exponents = Array.from({ length: 32 }, (_, index) => index + 1);
const terminalTwo = exponents.filter((n) => unitDigitOfPower(2, n) === 2);
const modFourOne = exponents.filter((n) => n % 4 === 1);
assert.deepEqual(terminalTwo, modFourOne, "2^n terminal-digit cycle should match n ≡ 1 mod 4");
const both = terminalTwo.filter((n) => modFourOne.includes(n));
assert.deepEqual(both, terminalTwo);
assert.deepEqual(both, modFourOne);

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_WAVE03_REDUNDANCY_NEGATIVE_CONTROLS",
  rejectedPatterns: [
    "EXACT_HCF_IMPLIES_DIVISIBILITY",
    "TERMINAL_CYCLE_EQUIVALENT_TO_EXPONENT_CONGRUENCE",
  ],
  admissionRule: "A_SECOND_COMPONENT_MUST_CHANGE_THE_LEARNER_RELEVANT_SOLUTION_STATE",
  ql248Allocated: false,
}, null, 2));
