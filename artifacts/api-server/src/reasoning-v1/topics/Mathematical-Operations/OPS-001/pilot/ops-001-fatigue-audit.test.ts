import assert from "node:assert/strict";
import { generateApprovedOpsQuestion } from "./approved-teaching-canonical";
import { OPS_APPROVED_CANDIDATE_IDS } from "./approved-teaching-runtime";

function ratio(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

function fingerprint(question: ReturnType<typeof generateApprovedOpsQuestion>): string {
  return [
    question.stem,
    question.options.map((option) => option.value).join("||"),
    question.answer,
  ].join("@@");
}

const report: Array<{
  candidateId: string;
  distinctStems: number;
  distinctFull: number;
  stemRatio: number;
  fullRatio: number;
}> = [];

for (const candidateId of OPS_APPROVED_CANDIDATE_IDS) {
  const stems = new Set<string>();
  const full = new Set<string>();
  for (let seed = 0; seed < 100; seed += 1) {
    const question = generateApprovedOpsQuestion(candidateId, seed);
    stems.add(question.stem);
    full.add(fingerprint(question));
  }
  report.push({
    candidateId,
    distinctStems: stems.size,
    distinctFull: full.size,
    stemRatio: ratio(stems.size, 100),
    fullRatio: ratio(full.size, 100),
  });
}

// Every permanent logical contract must produce materially more than option-order
// permutations. Full-output diversity is strict chapter-wide; the three audit
// hotspots below additionally require high visible-stem diversity.
for (const row of report) {
  assert.ok(row.fullRatio >= 0.75, `${row.candidateId} full-output fatigue ratio ${row.fullRatio} is below 0.75`);
}
for (const candidateId of ["OPS-CAND-028", "OPS-CAND-029", "OPS-CAND-034"] as const) {
  const row = report.find((entry) => entry.candidateId === candidateId)!;
  assert.ok(row.stemRatio >= 0.85, `${candidateId} stem fatigue ratio ${row.stemRatio} is below 0.85`);
  assert.ok(row.fullRatio >= 0.95, `${candidateId} full-output fatigue ratio ${row.fullRatio} is below 0.95`);
}

console.log("OPS-001 100-question fatigue audit passed", report);
