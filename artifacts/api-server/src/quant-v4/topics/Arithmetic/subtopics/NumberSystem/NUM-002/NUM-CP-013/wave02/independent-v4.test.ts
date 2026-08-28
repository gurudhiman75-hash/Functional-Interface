import assert from "node:assert/strict";

import { generateNumCp013Wave02 } from "./runtime-v4.ts";

const SYMBOLS = "0123456789ABCDEF";
function digitValue(ch: string) { return SYMBOLS.indexOf(ch.toUpperCase()); }
function valueOf(text: string, base: number) {
  return [...text].reduce((value, ch) => {
    const digit = digitValue(ch);
    assert.ok(digit >= 0 && digit < base);
    return value * base + digit;
  }, 0);
}
function parse(value: string) {
  const match = /^\(([0-9A-F]+)\)_(\d+)$/u.exec(value);
  assert.ok(match, `Malformed notation ${value}`);
  return { text: match[1]!, base: Number(match[2]!) };
}
function notationValue(value: string) { const p = parse(value); return valueOf(p.text, p.base); }

let checks = 0;
for (let seed = 1; seed <= 240; seed += 1) {
  const p009 = generateNumCp013Wave02("NUM-CP013-PROT-009", seed);
  const s9 = p009.hiddenState as any;
  assert.equal(valueOf(s9.sourceText, s9.sourceBase), s9.value);
  assert.equal(notationValue(p009.canonicalAnswer), s9.value);
  checks += 1;

  const p010 = generateNumCp013Wave02("NUM-CP013-PROT-010", seed);
  const invalid10 = parse(p010.canonicalAnswer);
  assert.ok([...invalid10.text].some((ch) => digitValue(ch) >= invalid10.base));
  checks += 1;

  const p011 = generateNumCp013Wave02("NUM-CP013-PROT-011", seed);
  const s11 = p011.hiddenState as any;
  if (s11.mode === 0) {
    const rebuilt = s11.digits[s11.index] * s11.base ** (s11.digits.length - 1 - s11.index);
    assert.equal(String(rebuilt), p011.canonicalAnswer);
  } else if (s11.mode === 1) {
    let count = 1;
    let place = s11.base;
    while (place <= s11.decimal) { count += 1; place *= s11.base; }
    assert.equal(String(count), p011.canonicalAnswer);
  } else {
    const expected = s11.largestMode ? s11.base ** s11.n - 1 : s11.base ** (s11.n - 1);
    assert.equal(String(expected), p011.canonicalAnswer);
  }
  checks += 1;

  const p012 = generateNumCp013Wave02("NUM-CP013-PROT-012", seed);
  const s12 = p012.hiddenState as any;
  const valid12 = s12.candidateBases.filter((b: number) => s12.digits.every((digit: number) => digit < b));
  assert.equal(String(valid12.length), p012.canonicalAnswer);
  assert.deepEqual(valid12, s12.validBases);
  checks += 1;

  const p013 = generateNumCp013Wave02("NUM-CP013-PROT-013", seed);
  const s13 = p013.hiddenState as any;
  const independentlyValid = Array.from({ length: 17 - s13.minBase }, (_, index) => s13.minBase + index)
    .filter((b) => valueOf(s13.leftText, b) + valueOf(s13.rightText, b) === valueOf(s13.resultText, b));
  assert.deepEqual(independentlyValid, [Number(p013.canonicalAnswer)]);
  assert.equal(p013.correctIndex, (seed - 1) % 4);
  checks += 1;

  const p014 = generateNumCp013Wave02("NUM-CP013-PROT-014", seed);
  const s14 = p014.hiddenState as any;
  const product14 = valueOf(s14.multiplicandText, s14.base) * s14.multiplier;
  assert.equal(product14, notationValue(p014.canonicalAnswer));
  assert.equal(s14.unitsTotal, s14.carry * s14.base + s14.unitsDigit);
  checks += 1;
}

assert.equal(checks, 1440);
console.log(JSON.stringify({
  status: "PASS_NUM_CP013_WAVE02_V4_INDEPENDENT",
  seedsPerPrototype: 240,
  independentChecks: checks,
  groupingVerified: true,
  numeralValidityVerified: true,
  positionalProjectionVerified: true,
  boundedBaseCountVerified: true,
  arithmeticUnknownBaseVerified: true,
  multiplicationCarryVerified: true,
  permanentQlAllocated: false,
}, null, 2));
