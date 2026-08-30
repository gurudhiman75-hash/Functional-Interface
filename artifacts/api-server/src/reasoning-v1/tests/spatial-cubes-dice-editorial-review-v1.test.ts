import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  CND_001_CANONICAL_SKILLS_V1,
  CND_001_MERGE_SPLIT_AUTHORITY_V1,
  CND_001_MERGE_SPLIT_SUMMARY_V1,
} from "../foundation/spatial/cubes-dice-merge-split-v1";
import {
  CND_001_EDITORIAL_RUNTIME_AUTHORITY_V2,
  generateCubesDiceEditorialQuestionV2,
} from "../foundation/spatial/cubes-dice-editorial-runtime-v2";
import {
  generateCubesDiceCandidateQuestionV1,
  type CubesDiceTaskKindV1,
} from "../foundation/spatial/cubes-dice-production-generator-v1";
import { CND_001_SOURCE_PATTERNS_V1 } from "../foundation/spatial/cubes-dice-source-saturation-v1";

assert.equal(CND_001_MERGE_SPLIT_AUTHORITY_V1.nextPermanentQlId, "SPA-QL-043");
assert.equal(CND_001_MERGE_SPLIT_AUTHORITY_V1.permanentQlAllocationAuthorized, false);
assert.equal(CND_001_MERGE_SPLIT_SUMMARY_V1.canonicalSkillCount, 5);
assert.equal(CND_001_MERGE_SPLIT_SUMMARY_V1.preAllocationApprovalCandidateCount, 3);
assert.equal(CND_001_MERGE_SPLIT_SUMMARY_V1.heldForRuntimeProofCount, 2);
assert.equal(CND_001_MERGE_SPLIT_SUMMARY_V1.proposedInitialRangeIfApproved, "SPA-QL-043..SPA-QL-045");
assert.equal(CND_001_MERGE_SPLIT_SUMMARY_V1.allocationPerformed, false);

const absorbed = CND_001_CANONICAL_SKILLS_V1.flatMap((skill) => [...skill.absorbsSourcePatterns]);
assert.equal(absorbed.length, CND_001_SOURCE_PATTERNS_V1.length, "Every saturated source pattern must belong to exactly one canonical semantic skill.");
assert.equal(new Set(absorbed).size, absorbed.length, "No source pattern may be split across multiple canonical QLs merely because its stem differs.");
for (const pattern of CND_001_SOURCE_PATTERNS_V1) assert.ok(absorbed.includes(pattern.patternId), `Missing merge/split coverage for ${pattern.patternId}.`);

const preAllocation = CND_001_CANONICAL_SKILLS_V1.filter((skill) => skill.status === "RETAIN_FOR_PRE_ALLOCATION_APPROVAL");
assert.deepEqual(preAllocation.map((skill) => skill.earliestPermanentQlId), ["SPA-QL-043", "SPA-QL-044", "SPA-QL-045"]);
assert.deepEqual(
  CND_001_CANONICAL_SKILLS_V1.filter((skill) => skill.status === "RETAIN_HELD_FOR_RUNTIME_PROOF").map((skill) => skill.earliestPermanentQlId),
  [null, null],
);

assert.equal(CND_001_EDITORIAL_RUNTIME_AUTHORITY_V2.preservesSolverAnswer, true);
assert.equal(CND_001_EDITORIAL_RUNTIME_AUTHORITY_V2.preservesStimulusSvg, true);
assert.equal(CND_001_EDITORIAL_RUNTIME_AUTHORITY_V2.permanentQlAllocationAuthorized, false);

const TASKS: readonly CubesDiceTaskKindV1[] = [
  "DICE_OPPOSITE_FROM_TWO_VIEWS",
  "CUBE_NET_OPPOSITE_FACE",
  "PAINTED_CUBE_EXACT_FACE_COUNT",
  "VOXEL_ORTHOGRAPHIC_VIEW_COUNT",
];

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

const reviewRows: Record<string, unknown>[] = [];
const htmlCards: string[] = [];
const stemVariantsByTask = new Map<CubesDiceTaskKindV1, Set<string>>();
const stemsByTask = new Map<CubesDiceTaskKindV1, Set<string>>();
let totalReviewed = 0;

for (const taskKind of TASKS) {
  const variants = new Set<string>();
  const stems = new Set<string>();
  stemVariantsByTask.set(taskKind, variants);
  stemsByTask.set(taskKind, stems);

  for (let index = 0; index < 24; index += 1) {
    const seed = `CND-CP003-${taskKind}-${index}`;
    const base = generateCubesDiceCandidateQuestionV1({ seed, taskKind });
    const question = generateCubesDiceEditorialQuestionV2({ seed, taskKind });
    const replay = generateCubesDiceEditorialQuestionV2({ seed, taskKind });

    assert.equal(question.answer, base.answer, `${seed}: editorial layer must not change solver answer.`);
    assert.equal(question.correctIndex, base.correctIndex, `${seed}: editorial layer must not move the answer.`);
    assert.equal(question.stimulusSvgs[0], base.stimulusSvgs[0], `${seed}: editorial layer must not redraw or mutate approved geometry.`);
    assert.equal(question.answer, replay.answer);
    assert.equal(question.stem, replay.stem);
    assert.equal(question.stimulusSvgs[0], replay.stimulusSvgs[0]);
    assert.equal(question.version, "CND-001-EDITORIAL-QUESTION-V2");
    assert.ok(question.stem.length >= 45, `${seed}: stem is too terse to read naturally.`);
    assert.ok(question.explanation.whatIsGiven.length >= 45, `${seed}: explanation must say what is given.`);
    assert.ok(question.explanation.howToReason.length >= 70, `${seed}: explanation must describe the reasoning, not just state an answer.`);
    assert.ok(question.explanation.conclusion.includes(String(question.answer)), `${seed}: conclusion must state the computed answer.`);
    assert.doesNotMatch(question.explanation.whatIsGiven, /solver|validator|fingerprint|runtime|seed/i);
    assert.doesNotMatch(question.explanation.howToReason, /solver|validator|fingerprint|runtime|seed/i);
    assert.doesNotMatch(question.explanation.conclusion, /solver|validator|fingerprint|runtime|seed/i);
    assert.match(question.stimulusSvgs[0], /fill="white"/);
    assert.match(question.stimulusSvgs[0], /stroke-width="1\.35"/);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.nextPermanentQlId, "SPA-QL-043");
    assert.equal(question.lifecycle.questionStudioRegistered, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.automaticStudentPublication, false);

    variants.add(question.stemVariantId);
    stems.add(question.stem);
    totalReviewed += 1;

    reviewRows.push({
      seed,
      taskKind,
      candidateId: question.candidateId,
      difficulty: question.difficulty,
      stemVariantId: question.stemVariantId,
      stem: question.stem,
      answer: question.answer,
      explanation: question.explanation,
      svgLength: question.stimulusSvgs[0].length,
    });

    if (index < 6) {
      const options = question.options.map((option, optionIndex) => `<li>${String.fromCharCode(65 + optionIndex)}. ${escapeHtml(String(option))}</li>`).join("");
      htmlCards.push(`<article class="card"><div class="meta">${escapeHtml(taskKind)} · ${escapeHtml(question.stemVariantId)} · ${escapeHtml(question.difficulty)} · ${escapeHtml(seed)}</div><h2>${escapeHtml(question.stem)}</h2><div class="diagram">${question.stimulusSvgs[0]}</div><ol>${options}</ol><div class="answer">Answer: ${escapeHtml(String(question.answer))}</div><p><strong>Given:</strong> ${escapeHtml(question.explanation.whatIsGiven)}</p><p><strong>Reasoning:</strong> ${escapeHtml(question.explanation.howToReason)}</p><p><strong>Conclusion:</strong> ${escapeHtml(question.explanation.conclusion)}</p></article>`);
    }
  }

  assert.ok(variants.size >= 5, `${taskKind}: expected at least five distinct stem variants across the review corpus, got ${variants.size}.`);
  assert.ok(stems.size >= 18, `${taskKind}: seeded surface should not collapse into a thin repeated-stem corpus.`);
}

assert.equal(totalReviewed, 96);

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
const evidence = {
  authority: "CND-001-CP003-EDITORIAL-REVIEW-V1",
  mergeSplitAuthority: CND_001_MERGE_SPLIT_AUTHORITY_V1.authorityId,
  editorialAuthority: CND_001_EDITORIAL_RUNTIME_AUTHORITY_V2.authorityId,
  result: "PASS",
  totalReviewed,
  reviewedPerTask: 24,
  htmlReviewCards: htmlCards.length,
  stemVariantCounts: Object.fromEntries([...stemVariantsByTask.entries()].map(([task, values]) => [task, values.size])),
  uniqueStemCounts: Object.fromEntries([...stemsByTask.entries()].map(([task, values]) => [task, values.size])),
  canonicalSkills: CND_001_CANONICAL_SKILLS_V1,
  proposedInitialRangeIfApproved: "SPA-QL-043..SPA-QL-045",
  allocationPerformed: false,
  reviewRows,
  invariants: [
    "SEMANTIC_SKILL_NOT_STEM_TYPE",
    "ALL_15_SOURCE_PATTERNS_ASSIGNED_EXACTLY_ONCE",
    "FIVE_CANONICAL_SKILLS_THREE_PRE_ALLOCATION_TWO_HELD",
    "MULTIPLE_NATURAL_STEM_VARIANTS_PER_EXECUTABLE_FAMILY",
    "QUESTION_SPECIFIC_GIVEN_REASONING_CONCLUSION",
    "EDITORIAL_LAYER_PRESERVES_SOLVER_ANSWER",
    "EDITORIAL_LAYER_PRESERVES_APPROVED_SVG",
    "NO_INTERNAL_SOLVER_LANGUAGE_ON_LEARNER_SURFACE",
    "WHITE_BACKGROUND_AND_EXAM_STROKE_PRESERVED",
    "PERMANENT_QL_ALLOCATION_REMAINS_LOCKED",
  ],
};
writeFileSync(
  "dist/reasoning-v1/spatial/spa-cnd-001-editorial-review-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
);

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CND-001 CP003 Review</title><style>body{font-family:Arial,sans-serif;margin:0;background:#f5f6f8;color:#111827}.wrap{max-width:920px;margin:0 auto;padding:24px}.card{background:white;border:1px solid #d1d5db;border-radius:10px;padding:20px;margin:0 0 20px}.meta{font-size:12px;color:#4b5563;margin-bottom:10px}.diagram{display:flex;justify-content:center;overflow:auto;margin:16px 0}.diagram svg{max-width:100%;height:auto}h1{font-size:24px}h2{font-size:18px;line-height:1.45}li{margin:6px 0}.answer{font-weight:700;margin:14px 0}p{line-height:1.5}</style></head><body><main class="wrap"><h1>CND-001 CP003 Learner / Exam-Realness Review</h1><p>24 representative rendered questions: six per executable family. Permanent QL allocation and Question Studio remain locked.</p>${htmlCards.join("")}</main></body></html>`;
writeFileSync("dist/reasoning-v1/spatial/spa-cnd-001-editorial-review-v1.html", html);
console.log(JSON.stringify({ result: "PASS", totalReviewed, htmlReviewCards: htmlCards.length, stemVariantCounts: evidence.stemVariantCounts, uniqueStemCounts: evidence.uniqueStemCounts }, null, 2));
