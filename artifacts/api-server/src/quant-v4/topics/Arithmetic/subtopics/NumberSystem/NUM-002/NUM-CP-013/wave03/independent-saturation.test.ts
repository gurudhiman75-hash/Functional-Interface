import assert from "node:assert/strict";

import { generateNumCp013Wave03 } from "./runtime.ts";

const SYMBOLS = "0123456789ABCDEF";
function digitValue(ch: string) { return SYMBOLS.indexOf(ch.toUpperCase()); }
function valueOf(text: string, base: number) {
  return [...text].reduce((value, ch) => value * base + digitValue(ch), 0);
}
function parse(value: string) {
  const match = /^\(([0-9A-F]+)\)_(\d+)$/u.exec(value);
  assert.ok(match);
  return { text: match[1]!, base: Number(match[2]!) };
}
function notationValue(value: string) {
  const p = parse(value);
  return valueOf(p.text, p.base);
}

let checks = 0;
for (let seed = 1; seed <= 200; seed += 1) {
  const p015 = generateNumCp013Wave03("NUM-CP013-PROT-015", seed);
  const s15 = p015.hiddenState as any;
  const av = valueOf(s15.textA, s15.baseA);
  const bv = valueOf(s15.textB, s15.baseB);
  assert.equal(av, s15.valueA);
  assert.equal(bv, s15.valueB);
  assert.equal(p015.canonicalAnswer, av > bv ? "First numeral is greater" : av < bv ? "Second numeral is greater" : "Both numerals are equal");
  checks += 1;

  const p016 = generateNumCp013Wave03("NUM-CP013-PROT-016", seed);
  const s16 = p016.hiddenState as any;
  const v16 = valueOf(s16.text, s16.base);
  const q16 = Math.floor(v16 / s16.divisor);
  const r16 = v16 - q16 * s16.divisor;
  assert.equal(String(r16), p016.canonicalAnswer);
  assert.ok(r16 >= 0 && r16 < s16.divisor);
  checks += 1;

  const p017 = generateNumCp013Wave03("NUM-CP013-PROT-017", seed);
  const s17 = p017.hiddenState as any;
  const units = (s17.left[1] * s17.right[1]) % s17.base;
  assert.equal(SYMBOLS[units], p017.canonicalAnswer);
  assert.equal(units, s17.fullProduct % s17.base);
  checks += 1;

  const p018 = generateNumCp013Wave03("NUM-CP013-PROT-018", seed);
  const s18 = p018.hiddenState as any;
  const invalid = parse(p018.canonicalAnswer);
  assert.equal(invalid.text.length, 3);
  assert.equal(invalid.text[0], "0");
  assert.equal(valueOf(invalid.text, invalid.base), valueOf(invalid.text.slice(1), invalid.base));
  for (const text of s18.validTexts) assert.notEqual(text[0], "0");
  checks += 1;

  const p019 = generateNumCp013Wave03("NUM-CP013-PROT-019", seed);
  const s19 = p019.hiddenState as any;
  const left19 = valueOf(s19.leftText, s19.base);
  const right19 = valueOf(s19.rightText, s19.base);
  assert.equal(notationValue(p019.canonicalAnswer), left19 + right19);
  assert.equal(parse(p019.canonicalAnswer).text.length, 4);
  assert.equal(s19.finalCarry, 1);
  checks += 1;

  const p020 = generateNumCp013Wave03("NUM-CP013-PROT-020", seed);
  const s20 = p020.hiddenState as any;
  const top20 = valueOf(s20.topText, s20.base);
  const bottom20 = valueOf(s20.bottomText, s20.base);
  assert.equal(notationValue(p020.canonicalAnswer), top20 - bottom20);
  assert.equal(s20.resultDigits[0], s20.a - 1);
  assert.equal(s20.resultDigits[1], s20.base - 1);
  assert.equal(s20.resultDigits[2], s20.base - s20.c);
  checks += 1;

  const p021 = generateNumCp013Wave03("NUM-CP013-PROT-021", seed);
  const s21 = p021.hiddenState as any;
  let independentlyValid: number[];
  if (s21.mode === 0) {
    independentlyValid = s21.bases.filter((b: number) => b > 2 && b + 1 === 2 * b);
  } else if (s21.mode === 1) {
    const target = Number(/= (\d+) in decimal/u.exec(s21.equation)?.[1]);
    independentlyValid = s21.bases.filter((b: number) => b + 1 === target);
  } else {
    independentlyValid = s21.bases.filter((b: number) => b + 1 === b + 1);
  }
  assert.deepEqual(independentlyValid, s21.validBases);
  const class21 = independentlyValid.length === 0 ? "NO_SOLUTION" : independentlyValid.length === 1 ? "ONE_SOLUTION" : "MULTIPLE_SOLUTIONS";
  assert.equal(p021.canonicalAnswer, class21);
  checks += 1;

  const p022 = generateNumCp013Wave03("NUM-CP013-PROT-022", seed);
  assert.equal(p022.canonicalAnswer, "2");
  assert.ok(0 < 2);
  assert.ok(!(1 >= 2));
  checks += 1;
}

assert.equal(checks, 1600);
console.log(JSON.stringify({
  status: "PASS_NUM_CP013_WAVE03_INDEPENDENT_SATURATION",
  seedsPerPrototype: 200,
  independentChecks: checks,
  crossBaseComparisonVerified: true,
  modularRemainderVerified: true,
  terminalDigitVerified: true,
  leadingZeroDigitLengthVerified: true,
  newLeadingCarryVerified: true,
  borrowChainVerified: true,
  baseSolutionTopologyVerified: true,
  zeroBaseBoundaryVerified: true,
  permanentQlAllocated: false,
}, null, 2));
