import assert from "node:assert/strict";
import { generateCaseletBatch } from "./index.ts";
import { generateLp002Batch } from "./lp-002.ts";
import { generateLp003Batch } from "./lp-003.ts";
import { generateLp004Batch } from "./lp-004.ts";
import { generateLp005Batch } from "./lp-005.ts";
import { generateLp006Batch } from "./lp-006.ts";
import { generateLp007Batch } from "./lp-007.ts";
import { generateLp008Batch } from "./lp-008.ts";

function clueCountByBand(caselets: readonly { difficultyBand: string; clues: readonly unknown[] }[]) {
  const grouped = new Map<string, number[]>();
  for (const caselet of caselets) grouped.set(caselet.difficultyBand, [...(grouped.get(caselet.difficultyBand) ?? []), caselet.clues.length]);
  return grouped;
}
function average(values: readonly number[]): number { return values.reduce((total, value) => total + value, 0) / values.length; }

for (const [name, caselets] of [
  ["LP-001", generateCaseletBatch("difficulty-lp-001", 60)],
  ["LP-002", generateLp002Batch("difficulty-lp-002", 60)],
  ["LP-003", generateLp003Batch("difficulty-lp-003", 60)],
  ["LP-004", generateLp004Batch("difficulty-lp-004", 60)],
] as const) {
  const grouped = clueCountByBand(caselets);
  const medium = grouped.get("Medium") ?? [];
  const hard = grouped.get("Hard") ?? [];
  assert.ok(medium.length > 0 && hard.length > 0, `${name} must generate both Medium and Hard caselets`);
  assert.ok(average(hard) > average(medium), `${name} Hard caselets do not have a higher average clue count`);
}

const lp005 = generateLp005Batch("difficulty-lp-005", 60);
for (const caselet of lp005) {
  const direct = caselet.clues.filter((clue) => clue.kind === "PERSON_DUTY" || clue.kind === "PERSON_PLACE").length;
  const exclusions = caselet.clues.filter((clue) => clue.kind === "NOT_PERSON_DUTY" || clue.kind === "NOT_PERSON_PLACE").length;
  if (caselet.difficultyBand === "Medium") assert.ok(direct >= 7 && exclusions <= 1, `${caselet.caseletId} Medium topology is not calibrated`);
  else assert.ok(direct <= 6 && exclusions >= 2, `${caselet.caseletId} Hard topology is not calibrated`);
}

const lp006 = generateLp006Batch("difficulty-lp-006", 60);
for (const caselet of lp006) {
  const kinds = new Set(caselet.clues.map((clue) => clue.kind));
  if (caselet.difficultyBand === "Easy") assert.ok([...kinds].every((kind) => kind === "PERSON_DAY" || kind === "PERSON_SUBJECT" || kind === "PERSON_CITY"), `${caselet.caseletId} Easy topology contains a relation clue`);
  if (caselet.difficultyBand === "Medium") assert.deepEqual(kinds, new Set(["PERSON_DAY", "PERSON_SUBJECT", "PERSON_CITY", "DAY_BEFORE", "NOT_SUBJECT_CITY"]), `${caselet.caseletId} Medium topology changed`);
  if (caselet.difficultyBand === "Hard") assert.deepEqual(kinds, new Set(["PERSON_DAY", "PERSON_SUBJECT", "PERSON_CITY", "DAY_BEFORE", "SUBJECT_CITY", "NOT_SUBJECT_CITY"]), `${caselet.caseletId} Hard topology changed`);
}

const lp007 = generateLp007Batch("difficulty-lp-007", 60);
for (const caselet of lp007) {
  const direct = caselet.clues.filter((clue) => clue.kind === "PERSON_VALUE").length;
  const either = caselet.clues.filter((clue) => clue.kind === "PERSON_EITHER").length;
  const exclusions = caselet.clues.filter((clue) => clue.kind === "NOT_PERSON_VALUE").length;
  if (caselet.difficultyBand === "Easy") assert.equal(direct, 4, `${caselet.caseletId} Easy variable topology changed`);
  if (caselet.difficultyBand === "Medium") assert.ok(direct >= 1 && either >= 1 && exclusions >= 1, `${caselet.caseletId} Medium variable topology is not calibrated`);
  if (caselet.difficultyBand === "Hard") assert.equal(direct, 1, `${caselet.caseletId} Hard variable topology should have one direct anchor`);
  if (caselet.difficultyBand === "Hard") assert.ok(either >= 2 && exclusions >= 1, `${caselet.caseletId} Hard variable topology lacks layered restrictions`);
}

const lp008 = generateLp008Batch("difficulty-lp-008", 60);
const lp008Grouped = clueCountByBand(lp008);
assert.ok(average(lp008Grouped.get("Hard") ?? []) > average(lp008Grouped.get("Medium") ?? []), "LP-008 Hard caselets do not have a higher average clue count");
for (const caselet of lp008) {
  const direct = caselet.clues.filter((clue) => clue.kind === "PERSON_SLOT").length;
  const relational = caselet.clues.filter((clue) => clue.kind === "SAME_MONTH" || clue.kind === "SAME_DATE" || clue.kind === "BEFORE" || clue.kind === "BETWEEN").length;
  const exclusions = caselet.clues.filter((clue) => clue.kind === "NOT_MONTH").length;
  if (caselet.difficultyBand === "Easy") assert.equal(direct, 7, `${caselet.caseletId} Easy calendar topology changed`);
  if (caselet.difficultyBand === "Medium") assert.ok(direct >= 1 && relational + exclusions >= 1, `${caselet.caseletId} Medium calendar topology is not calibrated`);
  if (caselet.difficultyBand === "Hard") assert.ok(direct >= 1 && direct <= 3, `${caselet.caseletId} Hard calendar topology should retain only a small number of direct anchors`);
  if (caselet.difficultyBand === "Hard") assert.ok(relational >= 1 && exclusions >= 1, `${caselet.caseletId} Hard calendar topology lacks layered restrictions`);
}

console.log("Logic Puzzle difficulty calibration passed: LP-001–LP-004 use larger Hard clue sets; LP-005–LP-008 use distinct structural tiers.");
