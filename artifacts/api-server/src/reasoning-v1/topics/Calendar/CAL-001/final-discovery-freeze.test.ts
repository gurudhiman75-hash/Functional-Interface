import { CALENDAR_PROTOTYPES, CALENDAR_PROTOTYPE_IDS } from "./registry.ts";
import {
  countLeapYearsInclusive,
  isValidGregorianDate,
  mod7,
  ordinalDaysInMonth,
  ordinalDifference,
  ordinalWeekday,
} from "./foundation.ts";
import {
  CALENDAR_SOURCE_GAP_PROTOTYPES,
  generateCalendarSourceGapQuestion,
  selectCalendarSourceGapReviewQuestions,
  type CalendarSourceGapAnswer,
  type CalendarSourceGapQuestion,
} from "./source-gap-runtime.ts";
import { FINAL_CALENDAR_SOURCE_AUDIT_GATE } from "./final-source-audit-gate.ts";
import {
  CALENDAR_PERMANENT_CONTRACTS,
  CALENDAR_PERMANENT_QL_IDS,
  type CalendarFrozenSourcePrototypeId,
} from "./permanent-contracts.ts";
import { CAL_001_FINAL_DISCOVERY_FREEZE, CAL_001_RELEASE_LOCK } from "./final-discovery-freeze.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function answerKey(value: CalendarSourceGapAnswer): string {
  return Array.isArray(value) ? `set:${[...value].sort((a, b) => a - b).join(",")}` : `number:${value}`;
}

function expectedGapAnswer(question: CalendarSourceGapQuestion): CalendarSourceGapAnswer {
  const facts = question.facts;
  if (question.prototypeAuthority === "CAL-GAP-PROT-001") {
    const date = facts.date as { year: number; month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12; day: number };
    const weekday = ordinalWeekday(date);
    for (let year = date.year + 1; year <= date.year + 60; year++) {
      const candidate = { year, month: date.month, day: date.day };
      if (isValidGregorianDate(candidate) && ordinalWeekday(candidate) === weekday) return year;
    }
    throw new Error("Independent recurrence verifier found no answer.");
  }
  if (question.prototypeAuthority === "CAL-GAP-PROT-002") {
    const year = Number(facts.year);
    const month = Number(facts.month) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    const namedWeekday = Number(facts.namedWeekday);
    const answer: number[] = [];
    for (let day = 1; day <= ordinalDaysInMonth(year, month); day++) {
      if (ordinalWeekday({ year, month, day }) === namedWeekday) answer.push(day);
    }
    return answer;
  }
  const range = facts.yearRange as { start: number; end: number; inclusive: true };
  return countLeapYearsInclusive(range.start, range.end);
}

function assertGapQuestion(question: CalendarSourceGapQuestion): void {
  const expected = expectedGapAnswer(question);
  assert(answerKey(expected) === answerKey(question.canonicalAnswer), `${question.prototypeAuthority} seed ${question.seed}: independent answer mismatch.`);
  assert(question.options.length === 4, `${question.prototypeAuthority} seed ${question.seed}: expected four options.`);
  assert(new Set(question.options).size === 4, `${question.prototypeAuthority} seed ${question.seed}: option text collision.`);
  assert(new Set(question.optionValues.map(answerKey)).size === 4, `${question.prototypeAuthority} seed ${question.seed}: semantic option collision.`);
  assert(answerKey(question.optionValues[question.answerIndex]!) === answerKey(question.canonicalAnswer), `${question.prototypeAuthority} seed ${question.seed}: answer index mismatch.`);
  assert(question.options[question.answerIndex] === question.explanation.conclusion, `${question.prototypeAuthority} seed ${question.seed}: conclusion does not equal displayed answer.`);
  assert(!/\bwas\b/i.test(question.stem), `${question.prototypeAuthority} seed ${question.seed}: past-tense “was” leaked into stem.`);
  assert(question.explanation.working.length >= 2, `${question.prototypeAuthority} seed ${question.seed}: explanation is incomplete.`);
  assert(question.lifecycle.englishIdentityFrozen && question.lifecycle.reviewOnly, `${question.prototypeAuthority} seed ${question.seed}: identity freeze flags missing.`);
  assert(!question.lifecycle.questionStudioDiscoverable, `${question.prototypeAuthority} seed ${question.seed}: Question Studio lock opened.`);
  assert(!question.lifecycle.questionBankWritable, `${question.prototypeAuthority} seed ${question.seed}: Question Bank write lock opened.`);
  assert(!question.lifecycle.mockTestEligible, `${question.prototypeAuthority} seed ${question.seed}: mock-test lock opened.`);
  assert(!question.lifecycle.publiclyPublishable, `${question.prototypeAuthority} seed ${question.seed}: publication lock opened.`);

  if (question.prototypeAuthority === "CAL-GAP-PROT-001") {
    const date = question.facts.date as { year: number; month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12; day: number };
    const year = Number(question.canonicalAnswer);
    assert(mod7(ordinalDifference(date, { year, month: date.month, day: date.day })) === 0, `${question.prototypeAuthority} seed ${question.seed}: recurrence remainder is non-zero.`);
  }
}

assert(FINAL_CALENDAR_SOURCE_AUDIT_GATE.passed, `Final source audit failed: ${FINAL_CALENDAR_SOURCE_AUDIT_GATE.reasons.join(" ")}`);
assert(FINAL_CALENDAR_SOURCE_AUDIT_GATE.coveredSourceClasses.length === 6, "Final source audit does not cover all six source classes.");
assert(FINAL_CALENDAR_SOURCE_AUDIT_GATE.gapPrototypes.length === 3, "Final source audit did not close all source gaps.");

assert(CALENDAR_PERMANENT_QL_IDS.length === 36, "CAL-001 must freeze exactly 36 permanent QLs.");
assert(CALENDAR_PERMANENT_CONTRACTS.length === 36, "Permanent contract count mismatch.");
for (let index = 0; index < CALENDAR_PERMANENT_QL_IDS.length; index++) {
  const expected = `CAL-QL-${String(index + 1).padStart(3, "0")}`;
  assert(CALENDAR_PERMANENT_QL_IDS[index] === expected, `Permanent QL sequence breaks at ${expected}.`);
}

const prototypeOwnerCount = new Map<CalendarFrozenSourcePrototypeId, number>();
for (const entry of CALENDAR_PERMANENT_CONTRACTS) {
  assert(entry.reviewOnly, `${entry.qlId}: review-only lock missing.`);
  assert(!entry.questionStudioVisible && !entry.questionBankWritable && !entry.mockTestEligible && !entry.publiclyPublishable, `${entry.qlId}: release lock opened.`);
  for (const sourceId of entry.sourcePrototypeIds) prototypeOwnerCount.set(sourceId, (prototypeOwnerCount.get(sourceId) ?? 0) + 1);
}
for (const id of CALENDAR_PROTOTYPE_IDS) assert(prototypeOwnerCount.get(id) === 1, `${id}: expected exactly one permanent owner.`);
for (const id of CALENDAR_SOURCE_GAP_PROTOTYPES) assert(prototypeOwnerCount.get(id) === 1, `${id}: expected exactly one permanent owner.`);
assert(prototypeOwnerCount.size === 47, `Expected 47 frozen source prototypes; received ${prototypeOwnerCount.size}.`);

const registryOutput = new Map(CALENDAR_PROTOTYPES.map((definition) => [definition.id, definition.outputType]));
for (const entry of CALENDAR_PERMANENT_CONTRACTS) {
  for (const sourceId of entry.sourcePrototypeIds) {
    if (!sourceId.startsWith("CAL-PQL-")) continue;
    assert(registryOutput.get(sourceId as typeof CALENDAR_PROTOTYPE_IDS[number]) === entry.answerType, `${entry.qlId}: ${sourceId} answer type does not match permanent contract.`);
  }
}

let generated = 0;
for (const id of CALENDAR_SOURCE_GAP_PROTOTYPES) {
  const positions = new Set<number>();
  for (let seed = 0; seed < 500; seed++) {
    const question = generateCalendarSourceGapQuestion(id, seed);
    assertGapQuestion(question);
    const contract = CALENDAR_PERMANENT_CONTRACTS.find((entry) => entry.qlId === question.proposedPermanentQlId);
    assert(contract?.sourcePrototypeIds.includes(id), `${id} seed ${seed}: proposed QL does not own the gap prototype.`);
    positions.add(question.answerIndex);
    generated++;
  }
  assert(positions.size === 4, `${id}: 500-seed proof does not cover all answer positions.`);

  const curated = selectCalendarSourceGapReviewQuestions(id);
  assert(curated.length === 5, `${id}: curated review must contain five questions.`);
  curated.forEach(assertGapQuestion);
  assert(new Set(curated.map((question) => question.mathematicalFingerprint)).size === 5, `${id}: curated mathematical states are duplicated.`);
  assert(new Set(curated.map((question) => question.answerIndex)).size >= 3, `${id}: curated answer positions are not balanced.`);
}

assert(CAL_001_FINAL_DISCOVERY_FREEZE.frozenSourcePrototypeIds.length === 47, "Frozen source-prototype total mismatch.");
assert(CAL_001_RELEASE_LOCK.permanentQlCount === 36, "Release lock permanent count mismatch.");
assert(CAL_001_RELEASE_LOCK.permanentQlRange === "CAL-QL-001..036", "Release lock range mismatch.");
assert(CAL_001_RELEASE_LOCK.nextAvailableChapterQlId === "CAL-QL-037", "Next available QL mismatch.");
assert(CAL_001_RELEASE_LOCK.englishEditorialReviewApproved, "English editorial approval not recorded.");
assert(CAL_001_RELEASE_LOCK.englishIdentityFrozen, "English identity freeze not recorded.");
assert(CAL_001_RELEASE_LOCK.finalSourceAuditPassed, "Final source audit not recorded as passed.");
assert(CAL_001_RELEASE_LOCK.hindiHumanFreeze, "Hindi human freeze not recorded.");
assert(CAL_001_RELEASE_LOCK.punjabiHumanFreeze, "Punjabi human freeze not recorded.");
assert(CAL_001_RELEASE_LOCK.multilingualParityFreeze, "Multilingual parity freeze not recorded.");
assert(!CAL_001_RELEASE_LOCK.questionStudioAllowed && !CAL_001_RELEASE_LOCK.questionBankWriteAllowed && !CAL_001_RELEASE_LOCK.mockTestAllowed && !CAL_001_RELEASE_LOCK.publicPublicationAllowed, "Release surface opened during multilingual freeze.");

console.log(JSON.stringify({
  status: "PASS_CAL_001_FINAL_DISCOVERY_FREEZE",
  approvedDiscoveryPrototypes: CALENDAR_PROTOTYPE_IDS.length,
  sourceGapPrototypes: CALENDAR_SOURCE_GAP_PROTOTYPES.length,
  frozenSourcePrototypes: prototypeOwnerCount.size,
  permanentQlCount: CALENDAR_PERMANENT_QL_IDS.length,
  sourceGapPackagesChecked: generated,
  curatedSourceGapQuestionsChecked: CALENDAR_SOURCE_GAP_PROTOTYPES.length * 5,
  finalSourceAuditPassed: FINAL_CALENDAR_SOURCE_AUDIT_GATE.passed,
  hindiHumanFreeze: CAL_001_RELEASE_LOCK.hindiHumanFreeze,
  punjabiHumanFreeze: CAL_001_RELEASE_LOCK.punjabiHumanFreeze,
  multilingualParityFreeze: CAL_001_RELEASE_LOCK.multilingualParityFreeze,
  questionStudioAllowed: false,
  questionBankWriteAllowed: false,
  mockTestAllowed: false,
  publicPublicationAllowed: false,
}, null, 2));
