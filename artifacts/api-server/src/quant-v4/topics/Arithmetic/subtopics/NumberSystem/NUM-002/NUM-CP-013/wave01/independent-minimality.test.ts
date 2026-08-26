import assert from "node:assert/strict";

import { generateNumCp013Wave01 } from "./runtime.ts";

function positionalValue(digits: readonly number[], base: number) {
  return digits.reduce((value, digit) => value * base + digit, 0);
}

function parseNotation(value: string) {
  const match = /^\((\d+)\)_(\d+)$/u.exec(value);
  assert.ok(match, `Malformed base numeral ${value}`);
  return { digits: [...match[1]!].map(Number), base: Number(match[2]!) };
}

function valueOfNotation(value: string) {
  const parsed = parseNotation(value);
  assert.ok(parsed.digits.every((digit) => digit < parsed.base));
  return positionalValue(parsed.digits, parsed.base);
}

let checks = 0;

for (let seed = 1; seed <= 160; seed += 1) {
  const p001 = generateNumCp013Wave01("NUM-CP013-PROT-001", seed);
  const s1 = p001.hiddenState as any;
  let direct = 0;
  for (let index = 0; index < s1.digits.length; index += 1) {
    direct += s1.digits[index] * s1.base ** (s1.digits.length - 1 - index);
  }
  assert.equal(String(direct), p001.canonicalAnswer, `P001/${seed}: direct place-value verifier drift`);
  checks += 1;

  const p002 = generateNumCp013Wave01("NUM-CP013-PROT-002", seed);
  const s2 = p002.hiddenState as any;
  assert.equal(valueOfNotation(p002.canonicalAnswer), s2.decimal, `P002/${seed}: numeral does not reconstruct decimal`);
  const remainders = s2.divisionTrace.map((step: any) => step.remainder).reverse().join("");
  assert.equal(parseNotation(p002.canonicalAnswer).digits.join(""), remainders, `P002/${seed}: remainder reading order drift`);
  checks += 1;

  const p003 = generateNumCp013Wave01("NUM-CP013-PROT-003", seed);
  const s3 = p003.hiddenState as any;
  assert.equal(positionalValue(s3.sourceDigits, s3.sourceBase), valueOfNotation(p003.canonicalAnswer), `P003/${seed}: cross-base value mismatch`);
  checks += 1;

  const p004 = generateNumCp013Wave01("NUM-CP013-PROT-004", seed);
  const s4 = p004.hiddenState as any;
  const answerBase = Number(p004.canonicalAnswer);
  assert.equal(answerBase, s4.maxDigit + 1, `P004/${seed}: least valid base mismatch`);
  for (let base = 2; base < answerBase; base += 1) {
    assert.ok(s4.digits.some((digit: number) => digit >= base), `P004/${seed}: lower base ${base} unexpectedly valid`);
  }
  assert.ok(s4.digits.every((digit: number) => digit < answerBase), `P004/${seed}: answer base invalid`);
  checks += 1;

  const p005 = generateNumCp013Wave01("NUM-CP013-PROT-005", seed);
  const s5 = p005.hiddenState as any;
  const digitSolutions = Array.from({ length: s5.base }, (_, digit) => digit)
    .filter((digit) => s5.a * s5.base ** 2 + digit * s5.base + s5.c === s5.decimal);
  assert.deepEqual(digitSolutions, [Number(p005.canonicalAnswer)], `P005/${seed}: bounded digit uniqueness failure`);
  checks += 1;

  const p006 = generateNumCp013Wave01("NUM-CP013-PROT-006", seed);
  const s6 = p006.hiddenState as any;
  const minBase = Math.max(...s6.digits) + 1;
  const baseSolutions = Array.from({ length: 13 - minBase }, (_, index) => minBase + index)
    .filter((base) => positionalValue(s6.digits, base) === s6.decimal);
  assert.deepEqual(baseSolutions, [Number(p006.canonicalAnswer)], `P006/${seed}: bounded base uniqueness failure`);
  checks += 1;

  const p007 = generateNumCp013Wave01("NUM-CP013-PROT-007", seed);
  const s7 = p007.hiddenState as any;
  assert.equal(valueOfNotation(p007.canonicalAnswer), positionalValue(s7.left, s7.base) + positionalValue(s7.right, s7.base), `P007/${seed}: independent sum mismatch`);
  assert.ok(s7.trace.some((step: any) => step.total >= s7.base && step.carryOut > 0), `P007/${seed}: carry proof missing`);
  for (const step of s7.trace) {
    assert.equal(step.total, step.carryOut * s7.base + step.writtenDigit, `P007/${seed}: carry decomposition invalid`);
  }
  checks += 1;

  const p008 = generateNumCp013Wave01("NUM-CP013-PROT-008", seed);
  const s8 = p008.hiddenState as any;
  assert.equal(valueOfNotation(p008.canonicalAnswer), positionalValue(s8.top, s8.base) - positionalValue(s8.bottom, s8.base), `P008/${seed}: independent difference mismatch`);
  assert.ok(s8.trace.some((step: any) => step.borrowOut > 0), `P008/${seed}: borrow proof missing`);
  for (const step of s8.trace) {
    assert.equal(step.adjustedTopDigit - step.bottomDigit, step.writtenDigit, `P008/${seed}: subtraction column invalid`);
    if (step.borrowOut > 0) assert.ok(step.adjustedTopDigit >= s8.base, `P008/${seed}: borrow did not add one base group`);
  }
  checks += 1;
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP013_WAVE01_INDEPENDENT_MINIMALITY",
  seedsPerPrototype: 160,
  independentChecks: checks,
  minimumBaseProved: true,
  digitUniquenessEnumerated: true,
  baseUniquenessEnumerated: true,
  carryDecompositionChecked: true,
  borrowDecompositionChecked: true,
  permanentQlAllocated: false,
}, null, 2));
