import assert from "node:assert/strict";

function factorial(n: number): bigint {
  assert.ok(Number.isInteger(n) && n >= 0, "factorial domain must be a non-negative integer");
  let value = 1n;
  for (let k = 2; k <= n; k += 1) value *= BigInt(k);
  return value;
}

function valuationBigInt(value: bigint, prime: bigint) {
  assert.ok(value > 0n, "valuation is defined here only for positive integers");
  let remaining = value;
  let exponent = 0;
  while (remaining % prime === 0n) {
    exponent += 1;
    remaining /= prime;
  }
  return exponent;
}

function valuationFactorial(n: number, prime: number) {
  let exponent = 0;
  let power = prime;
  while (power <= n) {
    exponent += Math.floor(n / power);
    if (power > Math.floor(n / prime)) break;
    power *= prime;
  }
  return exponent;
}

function highestPowerExponent(base: number, n: number) {
  const factors: Array<readonly [number, number]> = [];
  let remaining = base;
  for (let prime = 2; prime * prime <= remaining; prime += 1) {
    if (remaining % prime !== 0) continue;
    let exponent = 0;
    while (remaining % prime === 0) {
      exponent += 1;
      remaining /= prime;
    }
    factors.push([prime, exponent] as const);
  }
  if (remaining > 1) factors.push([remaining, 1] as const);
  return Math.min(...factors.map(([prime, required]) =>
    Math.floor(valuationFactorial(n, prime) / required)));
}

assert.equal(factorial(0), 1n, "0! convention drift");
assert.equal(factorial(1), 1n, "1! convention drift");
assert.equal(valuationBigInt(factorial(0), 2n), 0, "v_2(0!) must equal v_2(1) = 0");
assert.equal(valuationBigInt(factorial(1), 5n), 0, "v_5(1!) must equal v_5(1) = 0");
assert.equal(valuationFactorial(0, 7), 0, "Legendre route must return zero valuation for 0!");
assert.equal(valuationFactorial(1, 3), 0, "Legendre route must return zero valuation for 1!");

const exponent = highestPowerExponent(12, 10);
assert.equal(exponent, 4, "highest-power exponent fixture drift");
assert.equal(12 ** exponent, 20736, "highest-power value fixture drift");
assert.notEqual(String(exponent), String(12 ** exponent), "exponent and power-value semantics collapsed");

const conventions = Object.freeze({
  factorialZero: "0! = 1",
  factorialOne: "1! = 1",
  valuationOfOne: "v_p(1) = 0 for every prime p",
  exponentQuestion: "largest integer k such that a^k divides N → answer k",
  valueQuestion: "highest power of a dividing N → answer a^k only when the wording explicitly asks for the power value",
  trailingZeroConvention: "integer trailing zeroes are representation-terminal zeroes; leading zeroes are irrelevant unless fixed width is explicitly declared",
  ratioConvention: "factorial ratios used as integer Number System objects must be rendered only in integral form",
});

assert.match(conventions.exponentQuestion, /answer k/u);
assert.match(conventions.valueQuestion, /answer a\^k/u);
assert.match(conventions.trailingZeroConvention, /leading zeroes are irrelevant/u);
assert.match(conventions.ratioConvention, /integral/u);

console.log(JSON.stringify({
  status: "PASS_NUM_CP011_WAVE03_EDGE_CONVENTIONS",
  conventions,
  fixtures: {
    factorialZero: factorial(0).toString(),
    factorialOne: factorial(1).toString(),
    v2FactorialZero: valuationBigInt(factorial(0), 2n),
    v5FactorialOne: valuationBigInt(factorial(1), 5n),
    base: 12,
    n: 10,
    highestPowerExponent: exponent,
    highestPowerValue: 12 ** exponent,
  },
}, null, 2));
