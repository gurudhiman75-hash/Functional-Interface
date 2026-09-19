import { strict as assert } from "node:assert";
import { generatePolCp007ReviewBatchV6 } from "../../knowledge-v1/indian-polity/president/pol-cp007-review-generator-v6";
import { generatePolCp008ReviewBatchV6 } from "../../knowledge-v1/indian-polity/vice-president/pol-cp008-review-generator-v6";
import { generatePolCp010ReviewBatchV1 } from "../../knowledge-v1/indian-polity/parliament-structure-officers/pol-cp010-review-generator-v1";
import { generatePolCp012ReviewBatchV2 } from "../../knowledge-v1/indian-polity/supreme-court/pol-cp012-review-generator-v2";
import { generatePolCp013ReviewBatchV1 } from "../../knowledge-v1/indian-polity/high-courts-subordinate-judiciary-writs/pol-cp013-review-generator-v1";
import { generatePolCp014ReviewBatchV1 } from "../../knowledge-v1/indian-polity/governor/pol-cp014-review-generator-v1";
import { generatePolCp016ReviewBatchV1 } from "../../knowledge-v1/indian-polity/state-legislature/pol-cp016-review-generator-v1";
import { generatePolCp022ReviewBatchV2 } from "../../knowledge-v1/indian-polity/constitutional-bodies/pol-cp022-review-candidate-v2";

function assertFullSet(explanation: string, terms: RegExp[], label: string) {
  assert.match(explanation, /Qualifications:/i, `${label}: missing Qualifications list`);
  for (const term of terms) assert.match(explanation, term, `${label}: missing ${term}`);
}

const president = new Map(generatePolCp007ReviewBatchV6().map((q) => [q.questionId, q]));
for (const id of ["003", "025", "026", "027", "028"]) {
  assertFullSet(president.get(`POL-CP007-V6-${id}`)!.explanation, [
    /citizen of India/i, /35 years/i, /Lok Sabha/i, /office of profit/i,
  ], `President ${id}`);
}

const vicePresident = new Map(generatePolCp008ReviewBatchV6().map((q) => [q.questionId, q]));
for (const id of ["003", "033", "034", "035", "036", "039"]) {
  assertFullSet(vicePresident.get(`POL-CP008-V6-${id}`)!.explanation, [
    /citizen of India/i, /35 years/i, /Rajya Sabha/i, /office of profit/i,
  ], `Vice-President ${id}`);
}

const parliament = generatePolCp010ReviewBatchV1().filter((q) => q.qlId === "POL-010-QL-009");
assert.equal(parliament.length, 4);
for (const q of parliament) {
  assertFullSet(q.explanation, [
    /citizen of India/i, /oath\/affirmation/i,
    /25.*Lok Sabha|Lok Sabha.*25/i, /30.*Rajya Sabha|Rajya Sabha.*30/i,
    /prescribed by Parliament/i,
  ], q.questionId);
}

const supreme = generatePolCp012ReviewBatchV2().filter(
  (q) => q.qlId === "POL-012-QL-004" || /separate minimum age.*Supreme Court/i.test(q.stem),
);
assert.ok(supreme.length >= 5);
for (const q of supreme) {
  assertFullSet(q.explanation, [
    /citizen of India/i, /5 years.*High Court judge/i,
    /10 years.*High Court advocate/i, /distinguished jurist/i,
  ], q.questionId);
}

const highCourt = generatePolCp013ReviewBatchV1().filter((q) => q.qlId === "POL-013-QL-005");
assert.equal(highCourt.length, 4);
for (const q of highCourt) {
  assertFullSet(q.explanation, [
    /citizen of India/i, /10 years.*judicial office/i, /10 years.*High Court advocate/i,
  ], q.questionId);
}

const governor = generatePolCp014ReviewBatchV1().filter(
  (q) => /qualifications for appointment as Governor|minimum age for appointment as Governor|citizenship condition applies to appointment as Governor/i.test(q.stem),
);
assert.equal(governor.length, 3);
for (const q of governor) {
  assertFullSet(q.explanation, [/citizen of India/i, /35 years/i], q.questionId);
  assert.match(q.explanation, /Article 158.*separate/i);
}

const stateLegislature = generatePolCp016ReviewBatchV1().filter(
  (q) => /minimum age for membership of a State Legislative/i.test(q.stem),
);
assert.equal(stateLegislature.length, 2);
for (const q of stateLegislature) {
  assertFullSet(q.explanation, [
    /citizen of India/i, /oath\/affirmation/i,
    /25.*Assembly|Assembly.*25/i, /30.*Council|Council.*30/i,
    /prescribed by Parliament/i,
  ], q.questionId);
}

const bodies = generatePolCp022ReviewBatchV2();
const agi = bodies.find((q) => /Attorney-General/i.test(q.stem) && /qualif|eligible/i.test(q.stem));
const adv = bodies.find((q) => /Advocate-General/i.test(q.stem) && /qualif|eligible/i.test(q.stem));
assert.ok(agi);
assert.ok(adv);
assertFullSet(agi.explanation, [/citizen of India/i, /5 years/i, /10 years/i, /distinguished jurist/i], agi.questionId);
assertFullSet(adv.explanation, [/citizen of India/i, /10 years.*judicial office/i, /10 years.*High Court advocate/i], adv.questionId);
