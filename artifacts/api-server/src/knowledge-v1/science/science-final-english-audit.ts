import assert from "node:assert/strict";

import { SCI_CP001_REVIEW_BATCH_V1 } from "./measurement-units/sci-cp001-review-v1";
import { SCI_CP002_REVIEW_BATCH_V1 } from "./motion-force/sci-cp002-review-v1";
import { SCI_CP003_REVIEW_BATCH_V1 } from "./work-energy-power/sci-cp003-review-v1";
import { SCI_CP004_REVIEW_BATCH_V1 } from "./gravitation-pressure/sci-cp004-review-v1";
import { SCI_CP005_REVIEW_BATCH_V1 } from "./heat-temperature/sci-cp005-review-v1";
import { generateSciCp006ReviewBatchV1 } from "./sound/sci-cp006-review-v1";
import { generateSciCp007ReviewBatchV1 } from "./light-optics/sci-cp007-review-v1";
import { SCI_CP008_REVIEW_BATCH_V1 } from "./electricity/sci-cp008-review-v1";
import { SCI_CP009_REVIEW_BATCH_V1 } from "./magnetism-electromagnetism/sci-cp009-review-v1";
import { SCI_CP010_REVIEW_BATCH_V1 } from "./modern-physics/sci-cp010-review-v1";
import { SCI_CP011_REVIEW_V1 } from "./matter-properties/sci-cp011-review-v1";
import { SCI_CP012_REVIEW_V1 } from "./atomic-structure/sci-cp012-review-v1";
import { SCI_CP013_REVIEW_V1 } from "./elements-periodic-table/sci-cp013-review-v1";
import { SCI_CP014_REVIEW_V1 } from "./chemical-reactions/sci-cp014-review-v1";
import { SCI_CP015_REVIEW_V1 } from "./acids-bases-salts/sci-cp015-review-v1";
import { SCI_CP016_REVIEW_V1 } from "./metals-nonmetals/sci-cp016-review-v1";
import { SCI_CP017_REVIEW_V1 } from "./carbon-compounds/sci-cp017-review-v1";
import { SCI_CP018_REVIEW_V1 } from "./everyday-chemistry/sci-cp018-review-v1";
import { SCI_CP019_REVIEW_V1 } from "./cell-biology/sci-cp019-review-v1";
import { SCI_CP020_REVIEW_V1 } from "./plant-biology/sci-cp020-review-v1";
import { SCI_CP021_REVIEW_V1 } from "./human-digestive-system/sci-cp021-review-v1";
import { SCI_CP022_REVIEW_V1 } from "./respiratory-system/sci-cp022-review-v1";
import { SCI_CP023_REVIEW_V1 } from "./circulatory-system/sci-cp023-review-v1";
import { SCI_CP024_REVIEW_V1 } from "./excretory-system/sci-cp024-review-v1";
import { SCI_CP025_REVIEW_V1 } from "./nervous-system-sense-organs/sci-cp025-review-v1";
import { SCI_CP026_REVIEW_V1 } from "./endocrine-system-hormones/sci-cp026-review-v1";
import { SCI_CP027_REVIEW_V1 } from "./human-reproduction-development/sci-cp027-review-v1";
import { SCI_CP028_REVIEW_V1 } from "./nutrition-deficiency-diseases/sci-cp028-review-v1";
import { SCI_CP029_REVIEW_V1 } from "./diseases-immunity/sci-cp029-review-v1";
import { SCI_CP030_REVIEW_V1 } from "./genetics-evolution/sci-cp030-review-v1";
import { SCI_CP031_REVIEW_V1 } from "./microorganisms/sci-cp031-review-v1";
import { SCI_CP032_REVIEW_V1 } from "./classification-living-organisms/sci-cp032-review-v1";
import { SCI_CP033_REVIEW_V1 } from "./ecology-ecosystems/sci-cp033-review-v1";
import { SCI_CP034_REVIEW_V1 } from "./environment-pollution/sci-cp034-review-v1";
import { SCI_CP035_REVIEW_V1 } from "./biotechnology/sci-cp035-review-v1";
import { SCI_CP036_REVIEW_V1 } from "./everyday-science/sci-cp036-review-v1";
import { SCI_CP037_REVIEW_V1 } from "./scientists-discoveries-inventions/sci-cp037-review-v1";
import { SCI_CP038_REVIEW_V1 } from "./scientific-instruments/sci-cp038-review-v1";
import { SCI_CP039_REVIEW_V1 } from "./mixed-general-science/sci-cp039-review-v1";
import { SCI_CP040_REVIEW_V1 } from "./science-mega-review-pool/sci-cp040-review-v1";

type ScienceQuestion = {
  questionId: string;
  cpId: string;
  qlId: string;
  difficulty: string;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
  reviewOnly: boolean;
  runtimeRegistered: boolean;
};

const cp = (n: number) => `SCI-CP-${String(n).padStart(3, "0")}`;
const asQuestions = (rows: readonly unknown[]) => rows as readonly ScienceQuestion[];

const cps: readonly { cpId: string; questions: readonly ScienceQuestion[] }[] = [
  { cpId: cp(1), questions: asQuestions(SCI_CP001_REVIEW_BATCH_V1) },
  { cpId: cp(2), questions: asQuestions(SCI_CP002_REVIEW_BATCH_V1) },
  { cpId: cp(3), questions: asQuestions(SCI_CP003_REVIEW_BATCH_V1) },
  { cpId: cp(4), questions: asQuestions(SCI_CP004_REVIEW_BATCH_V1) },
  { cpId: cp(5), questions: asQuestions(SCI_CP005_REVIEW_BATCH_V1) },
  { cpId: cp(6), questions: asQuestions(generateSciCp006ReviewBatchV1()) },
  { cpId: cp(7), questions: asQuestions(generateSciCp007ReviewBatchV1()) },
  { cpId: cp(8), questions: asQuestions(SCI_CP008_REVIEW_BATCH_V1) },
  { cpId: cp(9), questions: asQuestions(SCI_CP009_REVIEW_BATCH_V1) },
  { cpId: cp(10), questions: asQuestions(SCI_CP010_REVIEW_BATCH_V1) },
  { cpId: cp(11), questions: asQuestions(SCI_CP011_REVIEW_V1) },
  { cpId: cp(12), questions: asQuestions(SCI_CP012_REVIEW_V1) },
  { cpId: cp(13), questions: asQuestions(SCI_CP013_REVIEW_V1) },
  { cpId: cp(14), questions: asQuestions(SCI_CP014_REVIEW_V1) },
  { cpId: cp(15), questions: asQuestions(SCI_CP015_REVIEW_V1) },
  { cpId: cp(16), questions: asQuestions(SCI_CP016_REVIEW_V1) },
  { cpId: cp(17), questions: asQuestions(SCI_CP017_REVIEW_V1) },
  { cpId: cp(18), questions: asQuestions(SCI_CP018_REVIEW_V1) },
  { cpId: cp(19), questions: asQuestions(SCI_CP019_REVIEW_V1) },
  { cpId: cp(20), questions: asQuestions(SCI_CP020_REVIEW_V1) },
  { cpId: cp(21), questions: asQuestions(SCI_CP021_REVIEW_V1) },
  { cpId: cp(22), questions: asQuestions(SCI_CP022_REVIEW_V1) },
  { cpId: cp(23), questions: asQuestions(SCI_CP023_REVIEW_V1) },
  { cpId: cp(24), questions: asQuestions(SCI_CP024_REVIEW_V1) },
  { cpId: cp(25), questions: asQuestions(SCI_CP025_REVIEW_V1) },
  { cpId: cp(26), questions: asQuestions(SCI_CP026_REVIEW_V1) },
  { cpId: cp(27), questions: asQuestions(SCI_CP027_REVIEW_V1) },
  { cpId: cp(28), questions: asQuestions(SCI_CP028_REVIEW_V1) },
  { cpId: cp(29), questions: asQuestions(SCI_CP029_REVIEW_V1) },
  { cpId: cp(30), questions: asQuestions(SCI_CP030_REVIEW_V1) },
  { cpId: cp(31), questions: asQuestions(SCI_CP031_REVIEW_V1) },
  { cpId: cp(32), questions: asQuestions(SCI_CP032_REVIEW_V1) },
  { cpId: cp(33), questions: asQuestions(SCI_CP033_REVIEW_V1) },
  { cpId: cp(34), questions: asQuestions(SCI_CP034_REVIEW_V1) },
  { cpId: cp(35), questions: asQuestions(SCI_CP035_REVIEW_V1) },
  { cpId: cp(36), questions: asQuestions(SCI_CP036_REVIEW_V1) },
  { cpId: cp(37), questions: asQuestions(SCI_CP037_REVIEW_V1) },
  { cpId: cp(38), questions: asQuestions(SCI_CP038_REVIEW_V1) },
  { cpId: cp(39), questions: asQuestions(SCI_CP039_REVIEW_V1) },
  { cpId: cp(40), questions: asQuestions(SCI_CP040_REVIEW_V1) },
];

const norm = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();
const words = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;
const forbiddenInternal = /\b(review[- ]only|runtimeRegistered|sourceFactIds|candidate v\d+|question line|ql id)\b/i;
const optionAnalysis = /\b(option\s+[ABCD]|choice\s+[ABCD])\b/i;

const ids = new Map<string, string>();
const stems = new Map<string, string>();
const factIds = new Map<string, string>();
const duplicateStems: { stem: string; first: string; second: string }[] = [];
const duplicateFactIds: { factId: string; first: string; second: string }[] = [];
const shortExplanations: { questionId: string; cpId: string; words: number }[] = [];
const shortStems: { questionId: string; cpId: string; chars: number }[] = [];
const internalLeakageHits: { questionId: string; cpId: string; surface: string }[] = [];
const optionAnalysisHits: { questionId: string; cpId: string }[] = [];
const wordingHits: { questionId: string; cpId: string; term: string }[] = [];
const perCp: Record<string, unknown> = {};
const chapterDifficulty: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0 };
const chapterAnswerPositions = [0, 0, 0, 0];
const chapterQlIds = new Map<string, number>();

for (const entry of cps) {
  const rows = entry.questions;
  assert.equal(rows.length, 60, `${entry.cpId}: expected 60 questions`);

  const qlCounts = new Map<string, number>();
  const difficulty: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const explanationWordCounts: number[] = [];

  for (const q of rows) {
    assert.equal(q.cpId, entry.cpId, `${entry.cpId}: foreign cpId on ${q.questionId}`);
    assert.equal(q.reviewOnly, true, `${q.questionId}: reviewOnly must stay true`);
    assert.equal(q.runtimeRegistered, false, `${q.questionId}: runtime must stay closed`);
    assert.equal(q.options.length, 4, `${q.questionId}: expected four options`);
    assert.equal(new Set(q.options).size, 4, `${q.questionId}: duplicate visible options`);
    assert.ok(q.correctIndex >= 0 && q.correctIndex < 4, `${q.questionId}: invalid correct index`);
    assert.equal(q.options[q.correctIndex], q.canonicalAnswer, `${q.questionId}: answer-key mismatch`);
    assert.ok(q.sourceIds.length > 0, `${q.questionId}: missing sourceIds`);
    assert.ok(q.sourceFactIds.length > 0, `${q.questionId}: missing sourceFactIds`);
    assert.ok(q.stem.trim().length > 0, `${q.questionId}: stem missing`);
    assert.ok(q.explanation.trim().length > 0, `${q.questionId}: explanation missing`);
    if (q.stem.trim().length < 12) shortStems.push({ questionId: q.questionId, cpId: entry.cpId, chars: q.stem.trim().length });
    if (forbiddenInternal.test(q.stem)) internalLeakageHits.push({ questionId: q.questionId, cpId: entry.cpId, surface: "stem" });
    if (forbiddenInternal.test(q.explanation)) internalLeakageHits.push({ questionId: q.questionId, cpId: entry.cpId, surface: "explanation" });
    if (optionAnalysis.test(q.explanation)) optionAnalysisHits.push({ questionId: q.questionId, cpId: entry.cpId });

    const stemKey = norm(q.stem);
    if (stems.has(stemKey)) duplicateStems.push({ stem: q.stem, first: stems.get(stemKey)!, second: q.questionId });
    else stems.set(stemKey, q.questionId);

    assert.ok(!ids.has(q.questionId), `duplicate question id: ${q.questionId}`);
    ids.set(q.questionId, entry.cpId);

    for (const factId of q.sourceFactIds) {
      if (factIds.has(factId)) duplicateFactIds.push({ factId, first: factIds.get(factId)!, second: q.questionId });
      else factIds.set(factId, q.questionId);
    }

    const wc = words(q.explanation);
    explanationWordCounts.push(wc);
    if (wc < 20) shortExplanations.push({ questionId: q.questionId, cpId: entry.cpId, words: wc });
    for (const term of ["mainly", "associated"]) {
      if (new RegExp(`\\b${term}\\b`, "i").test(q.stem) || new RegExp(`\\b${term}\\b`, "i").test(q.explanation)) {
        wordingHits.push({ questionId: q.questionId, cpId: entry.cpId, term });
      }
    }

    qlCounts.set(q.qlId, (qlCounts.get(q.qlId) ?? 0) + 1);
    chapterQlIds.set(q.qlId, (chapterQlIds.get(q.qlId) ?? 0) + 1);
    difficulty[q.difficulty] = (difficulty[q.difficulty] ?? 0) + 1;
    chapterDifficulty[q.difficulty] = (chapterDifficulty[q.difficulty] ?? 0) + 1;
    answerPositions[q.correctIndex] += 1;
    chapterAnswerPositions[q.correctIndex] += 1;
  }

  assert.equal(qlCounts.size, 10, `${entry.cpId}: expected 10 QLs`);
  assert.ok([...qlCounts.values()].every((n) => n === 6), `${entry.cpId}: every QL must contribute six questions`);
  assert.deepEqual(difficulty, { Easy: 18, Medium: 30, Hard: 12 }, `${entry.cpId}: difficulty drift`);
  assert.deepEqual(answerPositions, [15, 15, 15, 15], `${entry.cpId}: answer-position drift`);

  perCp[entry.cpId] = {
    questions: rows.length,
    qls: qlCounts.size,
    difficulty,
    answerPositions,
    explanationWords: {
      min: Math.min(...explanationWordCounts),
      max: Math.max(...explanationWordCounts),
      avg: Number((explanationWordCounts.reduce((a, b) => a + b, 0) / explanationWordCounts.length).toFixed(1)),
      under20: explanationWordCounts.filter((n) => n < 20).length,
    },
  };
}

const allQuestions = cps.flatMap((entry) => [...entry.questions]);
assert.equal(cps.length, 40, "SCI-001 must expose 40 CPs");
assert.equal(allQuestions.length, 2400, "SCI-001 must expose exactly 2,400 English review questions");
assert.equal(ids.size, 2400, "question IDs must be unique chapter-wide");
assert.equal(chapterQlIds.size, 400, "SCI-001 must expose exactly 400 CP-owned QLs");
assert.ok([...chapterQlIds.values()].every((n) => n === 6), "every SCI-001 QL must contribute exactly six questions");
assert.deepEqual(chapterDifficulty, { Easy: 720, Medium: 1200, Hard: 480 }, "chapter-wide difficulty totals drifted");
assert.deepEqual(chapterAnswerPositions, [600, 600, 600, 600], "chapter-wide answer positions drifted");
assert.equal(duplicateStems.length, 0, "chapter-wide duplicate stems must be zero");
assert.equal(shortStems.length, 0, "all stems must meet the minimum editorial length");
assert.equal(shortExplanations.length, 0, "all explanations must contain at least 20 words");
assert.equal(internalLeakageHits.length, 0, "internal metadata must not leak into learner-facing text");
assert.equal(optionAnalysisHits.length, 0, "option-by-option analysis must not appear in explanations");
assert.equal(wordingHits.length, 0, "mechanical wording hits (mainly/associated) must be zero");

const crossCpSourceFactReuses = duplicateFactIds.filter(
  (item) => ids.get(item.first) !== ids.get(item.second),
);

const report = {
  status: "EDITORIAL_AND_STRUCTURAL_PASS",
  scope: "SCI-CP-001 through SCI-CP-040 English review pools",
  cps: cps.length,
  qls: chapterQlIds.size,
  questions: allQuestions.length,
  difficulty: chapterDifficulty,
  answerPositions: { A: chapterAnswerPositions[0], B: chapterAnswerPositions[1], C: chapterAnswerPositions[2], D: chapterAnswerPositions[3] },
  uniqueQuestionIds: ids.size,
  uniqueNormalizedStems: stems.size,
  duplicateStemCount: duplicateStems.length,
  duplicateStems: duplicateStems.slice(0, 100),
  reusedSourceFactReferenceCount: duplicateFactIds.length,
  reusedSourceFactReferences: duplicateFactIds.slice(0, 100),
  crossCpSourceFactReuseCount: crossCpSourceFactReuses.length,
  crossCpSourceFactReuses: crossCpSourceFactReuses.slice(0, 100),
  sourceFactReuseNote: "A source fact may intentionally support more than one question; reuse is diagnostic, not a failure.",
  shortStemCountUnder12Chars: shortStems.length,
  shortStems: shortStems.slice(0, 150),
  shortExplanationCountUnder20Words: shortExplanations.length,
  shortExplanations: shortExplanations.slice(0, 150),
  internalLeakageCount: internalLeakageHits.length,
  internalLeakageHits: internalLeakageHits.slice(0, 150),
  optionAnalysisCount: optionAnalysisHits.length,
  optionAnalysisHits: optionAnalysisHits.slice(0, 150),
  wordingHitCount: wordingHits.length,
  wordingHits: wordingHits.slice(0, 150),
  lifecycle: "review-only / runtime closed",
  perCp,
};

console.log(JSON.stringify(report, null, 2));
