import assert from "node:assert/strict";

import { generateNumCp013Wave02 } from "./runtime-v3.ts";

const SYMBOLS = "0123456789ABCDEF";

function digitValue(ch: string) {
  const value = SYMBOLS.indexOf(ch.toUpperCase());
  assert.ok(value >= 0, `unsupported digit ${ch}`);
  return value;
}

function fromBase(text: string, base: number) {
  let value = 0;
  for (const ch of text) {
    const digit = digitValue(ch);
    assert.ok(digit < base, `${text}: invalid digit ${ch} for base ${base}`);
    value = value * base + digit;
  }
  return value;
}

function parseNotation(value: string) {
  const match = /^\(([0-9A-F]+)\)_(\d+)$/u.exec(value);
  assert.ok(match, `malformed notation ${value}`);
  return { text: match[1]!, base: Number(match[2]!) };
}

function notationValue(value: string) {
  const parsed = parseNotation(value);
  return fromBase(parsed.text, parsed.base);
}

let checks = 0;
let zeroClass = 0;
let uniqueClass = 0;
let multipleClass = 0;
let hexStates = 0;

for (let seed = 1; seed <= 200; seed += 1) {
  const p009 = generateNumCp013Wave02("NUM-CP013-PROT-009", seed);
  const s9 = p009.hiddenState as any;
  assert.equal(fromBase(s9.sourceText, s9.sourceBase), s9.value, `P009/${seed}: source grouping value drift`);
  assert.equal(notationValue(p009.canonicalAnswer), s9.value, `P009/${seed}: target grouping value drift`);
  if (s9.sourceBase === 16 || s9.targetBase === 16) hexStates += 1;
  checks += 1;

  const p010 = generateNumCp013Wave02("NUM-CP013-PROT-010", seed);
  const s10 = p010.hiddenState as any;
  const optionValidity = p010.options.map((option) => {
    const parsed = parseNotation(option.value);
    return [...parsed.text].every((ch) => digitValue(ch) < parsed.base);
  });
  assert.equal(optionValidity.filter(Boolean).length, 3, `P010/${seed}: expected exactly three valid numerals`);
  assert.equal(optionValidity[p010.correctIndex], false, `P010/${seed}: correct option is not the unique invalid numeral`);
  assert.equal(digitValue(s10.invalidSymbol), s10.base, `P010/${seed}: invalid digit should equal base`);
  checks += 1;

  const p011 = generateNumCp013Wave02("NUM-CP013-PROT-011", seed);
  const s11 = p011.hiddenState as any;
  if (s11.mode === 0) {
    const whole = fromBase(s11.text, s11.base);
    const selectedContribution = s11.digits[s11.index] * s11.base ** s11.power;
    assert.equal(String(selectedContribution), p011.canonicalAnswer, `P011/${seed}: place contribution drift`);
    assert.ok(whole >= selectedContribution, `P011/${seed}: contribution exceeds numeral`);
  } else if (s11.mode === 1) {
    let value = s11.decimal;
    const recovered: number[] = [];
    while (value > 0) {
      recovered.push(value % s11.base);
      value = Math.floor(value / s11.base);
    }
    assert.equal(String(recovered.length), p011.canonicalAnswer, `P011/${seed}: repeated-division digit count drift`);
  } else {
    assert.equal(fromBase(s11.baseText, s11.base), Number(p011.canonicalAnswer), `P011/${seed}: n-digit boundary reconstruction drift`);
  }
  checks += 1;

  const p012 = generateNumCp013Wave02("NUM-CP013-PROT-012", seed);
  const s12 = p012.hiddenState as any;
  const enumerated = [] as number[];
  for (let base = s12.lower; base <= s12.upper; base += 1) {
    if (s12.digits.every((digit: number) => digit < base)) enumerated.push(base);
  }
  assert.deepEqual(enumerated, s12.validBases, `P012/${seed}: exhaustive bounded-base set drift`);
  assert.equal(String(enumerated.length), p012.canonicalAnswer, `P012/${seed}: bounded-base answer drift`);
  if (enumerated.length === 0) zeroClass += 1;
  else if (enumerated.length === 1) uniqueClass += 1;
  else multipleClass += 1;
  checks += 1;

  const p013 = generateNumCp013Wave02("NUM-CP013-PROT-013", seed);
  const s13 = p013.hiddenState as any;
  const minimumBase = Math.max(...[...s13.leftText, ...s13.rightText, ...s13.resultText].map(digitValue)) + 1;
  const solutions: number[] = [];
  for (let base = minimumBase; base <= 16; base += 1) {
    if (fromBase(s13.leftText, base) + fromBase(s13.rightText, base) === fromBase(s13.resultText, base)) solutions.push(base);
  }
  assert.deepEqual(solutions, [Number(p013.canonicalAnswer)], `P013/${seed}: independent arithmetic-base enumeration drift`);
  assert.equal(s13.p + s13.q - s13.s, Number(p013.canonicalAnswer), `P013/${seed}: units-column base equation drift`);
  checks += 1;

  const p014 = generateNumCp013Wave02("NUM-CP013-PROT-014", seed);
  const s14 = p014.hiddenState as any;
  const directProduct = fromBase(s14.multiplicandText, s14.base) * digitValue(s14.multiplierText);
  assert.equal(notationValue(p014.canonicalAnswer), directProduct, `P014/${seed}: independent multiplication reconstruction drift`);
  assert.equal(s14.unitsTotal, s14.carry * s14.base + s14.unitsDigit, `P014/${seed}: units carry equation drift`);
  assert.ok(s14.carry >= 1, `P014/${seed}: carry not forced`);
  if (s14.base > 10) hexStates += 1;
  checks += 1;
}

assert.equal(checks, 1200);
assert.ok(zeroClass > 0, "bounded-base zero class absent");
assert.ok(uniqueClass > 0, "bounded-base unique class absent");
assert.ok(multipleClass > 0, "bounded-base multiple class absent");
assert.ok(hexStates > 0, "hexadecimal states absent");

console.log(JSON.stringify({
  status: "PASS_NUM_CP013_WAVE02_INDEPENDENT_SATURATION",
  seedsPerPrototype: 200,
  independentChecks: checks,
  boundedBaseClasses: { zero: zeroClass, unique: uniqueClass, multiple: multipleClass },
  hexadecimalStates: hexStates,
  groupingReconstructed: true,
  numeralValidityIndependentlyChecked: true,
  positionalProjectionReconstructed: true,
  arithmeticBaseEnumerated: true,
  multiplicationReconstructed: true,
  permanentQlAllocated: false,
}, null, 2));
