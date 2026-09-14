import assert from "node:assert/strict";

import {
  SER_CP009_AUDITED_QL_AUTHORITIES,
  SER_CP009_AUDITED_QL_IDS,
  SER_CP009_REJECTED_SOURCE_GAP,
  assertSerCp009AuditedQlId,
  generateSerCp009AuditedNumberSeries,
  solveVisibleAuditedNumberSeries,
  type SerCp009AuditedQlId,
} from "./number-series-audited";
import type { SerCp009Locale } from "./number-series";

assert.equal(SER_CP009_AUDITED_QL_IDS.length, 13);
assert.equal(SER_CP009_AUDITED_QL_AUTHORITIES.length, 13);
assert.equal(SER_CP009_REJECTED_SOURCE_GAP.qlId, "SER-QL-042");
assert.equal(SER_CP009_REJECTED_SOURCE_GAP.auditDecision, "REJECT_WRONG_CHAPTER_OWNERSHIP");
assert.equal(SER_CP009_REJECTED_SOURCE_GAP.permanentQlReserved, false);
assert.equal((SER_CP009_AUDITED_QL_IDS as readonly string[]).includes("SER-QL-042"), false);
assert.throws(() => assertSerCp009AuditedQlId("SER-QL-042"), /not a Series progression/i);

// Recent SSC anchors remain covered by the final candidate.
assert.equal(
  solveVisibleAuditedNumberSeries("SER-QL-030", "Question\n382, 322, 272, 232, 202, ?"),
  "182",
);
assert.equal(
  solveVisibleAuditedNumberSeries("SER-QL-030", "Question\n232, 221, 199, ?, 122, 67"),
  "166",
);
assert.equal(
  solveVisibleAuditedNumberSeries("SER-QL-035", "Question\n1, 3, 10, 41, ?, 1237"),
  "206",
);

const locales: readonly SerCp009Locale[] = ["en-IN", "hi-IN", "pa-IN"];
const seedsPerQl = 120;
const report: Record<string, unknown>[] = [];
let independentVisibleProofs = 0;
let localizationProofs = 0;
let lifecycleProofs = 0;
let misconceptionOptionProofs = 0;
let leadingZeroRejectionProofs = 0;

function seriesTokens(stem: string): string[] {
  return (stem.split("\n").at(-1) ?? "").split(",").map((token) => token.trim()).filter(Boolean);
}

for (const qlId of SER_CP009_AUDITED_QL_IDS) {
  const answerPositions = [0, 0, 0, 0];
  const visible = new Set<string>();
  const full = new Set<string>();
  const difficulties = new Set<string>();
  const tasks = new Set<string>();

  for (let seed = 0; seed < seedsPerQl; seed += 1) {
    const english = generateSerCp009AuditedNumberSeries(qlId, seed, "en-IN");
    const replay = generateSerCp009AuditedNumberSeries(qlId, seed, "en-IN");
    assert.deepEqual(replay, english, `${qlId}:${seed}: deterministic replay failed`);

    assert.equal(english.seed, seed);
    assert.equal(english.qlId, qlId);
    assert.equal(english.packageId, "SER-001");
    assert.equal(english.checkpointId, "SER-CP-009");
    assert.equal(english.examProfile, "SSC_REASONING");
    assert.equal(english.optionCount, 4);
    assert.equal(english.options.length, 4);
    assert.equal(new Set(english.options.map((option) => option.value)).size, 4, `${qlId}:${seed}: duplicate options`);
    assert.equal(english.options.filter((option) => option.errorLabel === null).length, 1);
    assert.equal(english.options[english.correctIndex]?.value, english.correctAnswer);
    assert.ok(english.options.filter((option) => option.errorLabel !== null).every((option) => Boolean(option.errorLabel)));
    misconceptionOptionProofs += 1;

    const solved = solveVisibleAuditedNumberSeries(qlId, english.stem, english.options.map((option) => option.value));
    assert.equal(solved, english.correctAnswer, `${qlId}:${seed}: visible solver disagrees`);
    assert.equal(english.options.filter((option) => option.value === solved).length, 1);
    independentVisibleProofs += 1;

    const requestedIndex = (seed + Number(qlId.slice(-3))) % 4;
    assert.equal(english.correctIndex, requestedIndex, `${qlId}:${seed}: answer position drifted`);
    answerPositions[english.correctIndex] += 1;

    assert.equal(english.maturity, "SOURCE_GAP_PROTOTYPE");
    assert.equal(english.reviewOnly, true);
    assert.equal(english.permanentQlId, null);
    assert.equal(english.questionStudioDiscoverable, false);
    assert.equal(english.questionBankWritable, false);
    assert.equal(english.mockTestEligible, false);
    assert.equal(english.publiclyPublishable, false);
    lifecycleProofs += 1;

    assert.ok(english.explanation.length >= 3);
    assert.ok(english.explanation.join(" ").includes(english.correctAnswer.split(",")[0]!.trim()));
    assert.equal("magnitude" in english.structuralFeatures, false);
    assert.equal("termLength" in english.structuralFeatures, false);

    if (qlId === "SER-QL-039") {
      const tokens = seriesTokens(english.stem).filter((token) => token !== "?");
      assert.ok(tokens.every((token) => /^\d{4}$/.test(token)), `${qlId}:${seed}: digit rotation must render four-digit numbers`);
      assert.ok(tokens.every((token) => !token.startsWith("0")), `${qlId}:${seed}: leading-zero numeric term leaked`);
      assert.equal(english.structuralFeatures.leadingZeroForbidden, true);
      leadingZeroRejectionProofs += 1;
    }

    visible.add(english.stem.split("\n").at(-1)!);
    full.add(JSON.stringify({ stem: english.stem, options: english.options, answer: english.correctAnswer, difficulty: english.difficulty }));
    difficulties.add(english.difficulty);
    tasks.add(english.taskKind);

    for (const locale of locales.slice(1)) {
      const localized = generateSerCp009AuditedNumberSeries(qlId, seed, locale);
      assert.equal(localized.correctAnswer, english.correctAnswer, `${qlId}:${seed}:${locale}: answer parity`);
      assert.equal(localized.correctIndex, english.correctIndex, `${qlId}:${seed}:${locale}: position parity`);
      assert.equal(localized.difficulty, english.difficulty, `${qlId}:${seed}:${locale}: difficulty parity`);
      assert.deepEqual(localized.structuralFeatures, english.structuralFeatures, `${qlId}:${seed}:${locale}: structure parity`);
      assert.deepEqual(localized.options, english.options, `${qlId}:${seed}:${locale}: option parity`);
      const localizedSolved = solveVisibleAuditedNumberSeries(qlId, localized.stem, localized.options.map((option) => option.value));
      assert.equal(localizedSolved, english.correctAnswer);
      const learnerText = `${localized.stem}\n${localized.explanation.join("\n")}`;
      if (locale === "hi-IN") assert.match(learnerText, /[\u0900-\u097F]/u);
      if (locale === "pa-IN") assert.match(learnerText, /[\u0A00-\u0A7F]/u);
      localizationProofs += 1;
    }
  }

  assert.deepEqual(answerPositions, [30, 30, 30, 30], `${qlId}: answer positions biased`);
  assert.ok(visible.size / seedsPerQl >= 0.70, `${qlId}: visible diversity ${visible.size}/${seedsPerQl}`);
  assert.ok(full.size / seedsPerQl >= 0.85, `${qlId}: full diversity ${full.size}/${seedsPerQl}`);
  report.push({ qlId, answerPositions, difficulties: [...difficulties], taskKinds: [...tasks], visibleUnique: visible.size, fullUnique: full.size });
}

// Difficulty calibration must reflect inference structure, not numeric magnitude.
for (const qlId of ["SER-QL-031", "SER-QL-033", "SER-QL-037"] as const) {
  for (let seed = 0; seed < 20; seed += 1) {
    assert.equal(generateSerCp009AuditedNumberSeries(qlId, seed).difficulty, "MEDIUM", `${qlId}:${seed}: under-rated structural burden`);
  }
}
for (const qlId of ["SER-QL-029", "SER-QL-032", "SER-QL-038"] as const) {
  assert.equal(generateSerCp009AuditedNumberSeries(qlId, 7).difficulty, "EASY", `${qlId}: simple instance should remain Easy`);
}
for (const qlId of ["SER-QL-035", "SER-QL-041"] as const) {
  assert.equal(generateSerCp009AuditedNumberSeries(qlId, 7).difficulty, "HARD", `${qlId}: multi-layer instance should remain Hard`);
}

const numericMax = (stem: string): number => Math.max(...(stem.match(/\d+/g) ?? ["0"]).map(Number));
const easyCandidates = Array.from({ length: 64 }, (_, seed) => ({ seed, item: generateSerCp009AuditedNumberSeries("SER-QL-032", seed) }));
const hardCandidates = Array.from({ length: 64 }, (_, seed) => ({ seed, item: generateSerCp009AuditedNumberSeries("SER-QL-035", seed) }));
const largestEasy = easyCandidates.map(({ seed, item }) => ({ seed, max: numericMax(item.stem) })).reduce((best, candidate) => candidate.max > best.max ? candidate : best);
const smallestHard = hardCandidates.map(({ seed, item }) => ({ seed, max: numericMax(item.stem) })).reduce((best, candidate) => candidate.max < best.max ? candidate : best);
assert.ok(largestEasy.max > smallestHard.max, `anti-magnitude witness missing: ${largestEasy.max} <= ${smallestHard.max}`);

console.log(JSON.stringify({
  status: "SER_CP009_AUDITED_13_QL_PASS",
  qlCount: SER_CP009_AUDITED_QL_IDS.length,
  rejectedWrongOwner: SER_CP009_REJECTED_SOURCE_GAP,
  seedsPerQl,
  independentVisibleProofs,
  localizationProofs,
  lifecycleProofs,
  misconceptionOptionProofs,
  leadingZeroRejectionProofs,
  antiMagnitudeWitness: { largestEasy, smallestHard },
  report,
}, null, 2));
