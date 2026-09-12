import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";

import {
  CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V2,
  generateCubesDiceQuestionStudioSeededV2,
  type CubesDiceQuestionStudioLanguageV2,
  type CubesDiceQuestionStudioQlIdV2,
  type CubesDiceQuestionStudioQuestionV2,
} from "../foundation/spatial/cubes-dice-question-studio-seeded-runtime-v2";
import {
  CND_001_STUDENT_SOLUTION_V4_AUTHORITY_V1,
  type CubesDiceStudentSolutionV1,
} from "../foundation/spatial/cubes-dice-student-solution-v1";
import {
  CND_001_VOXEL_STACK_TEMPLATES_V2,
  CND_001_VOXEL_PROJECTION_RUNTIME_AUTHORITY_V2,
  type CubesDiceVoxelRuntimeTaskKindV2,
} from "../foundation/spatial/cubes-dice-voxel-projection-runtime-v2";
import {
  generateCubesDiceVoxelPermanentEnglishQuestionV1,
} from "../foundation/spatial/cubes-dice-voxel-projection-permanent-english-runtime-v1";
import {
  SPATIAL_CUBES_DICE_PERMANENT_QL_ALLOCATIONS_V8,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v8";

const LANGUAGES: readonly CubesDiceQuestionStudioLanguageV2[] = Object.freeze(["en", "hi", "pa"]);
const QLS: readonly CubesDiceQuestionStudioQlIdV2[] = Object.freeze(["SPA-QL-043", "SPA-QL-044", "SPA-QL-045", "SPA-QL-046", "SPA-QL-047"]);
const VOXEL_TASKS: readonly CubesDiceVoxelRuntimeTaskKindV2[] = Object.freeze([
  "STACK_TOTAL_CUBES",
  "STACK_EXPOSED_FACES",
  "STACK_MISSING_TO_COMPLETE_CUBOID",
  "ORTHOGRAPHIC_TOP_CELL_COUNT",
  "ORTHOGRAPHIC_FRONT_CELL_COUNT",
  "ORTHOGRAPHIC_RIGHT_CELL_COUNT",
]);

function escapeHtml(value: string | number): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function assertSolution(question: CubesDiceQuestionStudioQuestionV2): void {
  const solution = question.solution;
  const prefix = `${question.qlId}/${question.language}/${question.seed}`;
  assert.equal(solution.version, "CND-001-STUDENT-SOLUTION-V1", `${prefix}: solution version mismatch.`);
  assert.equal(solution.language, question.language, `${prefix}: solution language mismatch.`);
  assert.equal(solution.presentationModel, "LOGIC_RULE_THEN_EXACT_WORKING_THEN_ANSWER", `${prefix}: wrong presentation model.`);
  assert.ok(solution.logicRule.trim().length >= 20, `${prefix}: logic/rule is too thin.`);
  assert.ok(solution.steps.length >= 1, `${prefix}: exact working steps are required.`);
  assert.ok(solution.steps.every((step) => step.trim().length >= 5), `${prefix}: empty/placeholder working step.`);
  assert.ok(solution.answerLine.trim().length >= 8, `${prefix}: explicit answer line required.`);
  assert.equal(solution.quality.questionSpecific, true);
  assert.equal(solution.quality.exactCalculationOrDeductionShown, true);
  assert.equal(solution.quality.engineTerminologyHidden, true);
  assert.equal(solution.quality.stemNotRepeated, true);
  assert.equal(solution.quality.finalAnswerExplicit, true);

  const studentSurface = [
    solution.logicRule,
    ...solution.steps,
    solution.note ?? "",
    solution.answerLine,
    ...solution.tables.flatMap((table) => [table.title, ...table.headers, ...table.rows.flat()]),
  ].join(" ").toLowerCase();
  for (const forbidden of CND_001_STUDENT_SOLUTION_V4_AUTHORITY_V1.forbiddenStudentFacingTerms) {
    assert.ok(!studentSurface.includes(forbidden), `${prefix}: leaked forbidden engine term ${forbidden}.`);
  }
  assert.ok(!studentSurface.includes("the stable stack has column heights"), `${prefix}: rejected V3-style matrix prose returned.`);
  assert.ok(!studentSurface.includes("checking all six neighbours of every occupied cube"), `${prefix}: rejected solver-note prose returned.`);
  assert.ok(!studentSurface.includes("merge occupied cubes"), `${prefix}: rejected projection solver-note prose returned.`);

  if (question.qlId === "SPA-QL-043") {
    assert.ok(solution.tables.some((table) => table.rows.length === 2 && table.headers.length === 4), `${prefix}: dice solution must show the two views.`);
    assert.ok(solution.steps.length >= 3, `${prefix}: dice solution must show the deduction, not just the answer.`);
  }
  if (question.qlId === "SPA-QL-044") {
    assert.ok(solution.tables.some((table) => table.rows.length === 3), `${prefix}: net solution must show all three opposite pairs.`);
  }
  if (question.qlId === "SPA-QL-045") {
    assert.ok(solution.tables.some((table) => table.rows.length === 4), `${prefix}: painted-cube solution must show the four standard categories.`);
    assert.ok(solution.steps.some((step) => /[=×³²]/.test(step)), `${prefix}: painted-cube substitution must be visible.`);
  }
  if (question.qlId === "SPA-QL-046" || question.qlId === "SPA-QL-047") {
    assert.ok(solution.tables.length >= 1, `${prefix}: stack/projection solution needs question-specific working data.`);
    assert.ok(solution.steps.some((step) => /[=+−×]/.test(step)), `${prefix}: stack/projection calculation must be visible.`);
  }
}

function assertQuestion(question: CubesDiceQuestionStudioQuestionV2): void {
  const prefix = `${question.qlId}/${question.language}/${question.seed}`;
  assert.equal(question.version, "CND-001-QUESTION-STUDIO-QUESTION-V2");
  assert.equal(question.options.length, 4, `${prefix}: four options required.`);
  assert.equal(new Set(question.options.map(String)).size, 4, `${prefix}: options must be unique.`);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer, `${prefix}: correct option mismatch.`);
  assert.equal(question.answer, question.optionLabels[question.correctIndex], `${prefix}: answer label mismatch.`);
  assert.equal(question.legacyExplanationSuppressed, true, `${prefix}: old explanation surface must be suppressed.`);
  assert.equal(question.validation.studentSolutionV4, true);
  assert.equal(question.lifecycle.reviewOnly, true);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.persistenceAllowed, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(question.lifecycle.automaticStudentPublication, false);
  assert.equal(question.stimulusSvgs.length, 1);
  assert.match(question.stimulusSvgs[0], /^<svg\b/i, `${prefix}: SVG stimulus required.`);
  assertSolution(question);
}

assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8.permanentQlCount, 47);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8.permanentQlRange, "SPA-QL-001..SPA-QL-047");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8.allocatedRange, "SPA-QL-046..SPA-QL-047");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8.nextAvailablePermanentQlId, "SPA-QL-048");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8.chapterCounts["CND-001"], 5);
assert.deepEqual(SPATIAL_CUBES_DICE_PERMANENT_QL_ALLOCATIONS_V8.map((row) => row.permanentQlId), ["SPA-QL-046", "SPA-QL-047"]);
assert.equal(CND_001_VOXEL_PROJECTION_RUNTIME_AUTHORITY_V2.permanentQlAllocationAuthorized, true);
assert.equal(CND_001_VOXEL_PROJECTION_RUNTIME_AUTHORITY_V2.questionStudioRegistrationAuthorized, false);
assert.equal(CND_001_STUDENT_SOLUTION_V4_AUTHORITY_V1.languageReviewStatus.en, "PRODUCT_OWNER_APPROVED");
assert.equal(CND_001_STUDENT_SOLUTION_V4_AUTHORITY_V1.languageReviewStatus.hi, "GENERATED_REVIEW_REQUIRED");
assert.equal(CND_001_STUDENT_SOLUTION_V4_AUTHORITY_V1.languageReviewStatus.pa, "GENERATED_REVIEW_REQUIRED");
assert.equal(CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V2.questionStudioDiscoverable, false);
assert.equal(CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V2.registrationAuthorized, false);
assert.deepEqual(CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V2.permanentQlIds, QLS);

// Structural proof: every approved stack shape under every new task kind.
const structuralQuestions = [];
for (const taskKind of VOXEL_TASKS) {
  for (const template of CND_001_VOXEL_STACK_TEMPLATES_V2) {
    const question = generateCubesDiceVoxelPermanentEnglishQuestionV1({
      seed: `CND-V2-STRUCTURAL:${taskKind}:${template.id}`,
      taskKind,
      templateId: template.id,
    });
    const expectedQl = taskKind.startsWith("STACK_") ? "SPA-QL-046" : "SPA-QL-047";
    assert.equal(question.permanentQlId, expectedQl);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(question.lifecycle.permanentQlAllocated, true);
    assert.equal(question.lifecycle.questionStudioRegistered, false);
    assert.match(question.stimulusSvg, /shape-rendering="geometricPrecision"/);
    assert.match(question.stimulusSvg, /fill="white"/);
    assert.ok(!/<line\b/i.test(question.stimulusSvg), `${taskKind}/${template.id}: hidden helper line returned.`);
    assert.ok(!/rotate\s*\(|skew[XY]?\s*\(|matrix\s*\(/i.test(question.stimulusSvg), `${taskKind}/${template.id}: random/free transform returned.`);
    const widths = [...question.stimulusSvg.matchAll(/stroke-width="([^"]+)"/g)].map((match) => match[1]);
    assert.ok(widths.length > 0 && widths.every((width) => width === "1.35"), `${taskKind}/${template.id}: stroke width drift.`);
    structuralQuestions.push(question);
  }
}
assert.equal(structuralQuestions.length, 72);
assert.deepEqual([...new Set(structuralQuestions.map((question) => question.difficultyBand))].sort(), ["Easy", "Hard", "Medium"]);
for (const taskKind of VOXEL_TASKS) {
  const rows = structuralQuestions.filter((question) => question.taskKind === taskKind);
  assert.equal(rows.length, 12, `${taskKind}: all 12 curated shapes required.`);
  assert.equal(new Set(rows.map((question) => question.templateId)).size, 12, `${taskKind}: template coverage collapsed.`);
}

// Question Studio surfaces: old QLs plus every new solve mode in all three languages.
const specs: readonly Readonly<{ qlId: CubesDiceQuestionStudioQlIdV2; seed: string; voxelTaskKind?: CubesDiceVoxelRuntimeTaskKindV2 }>[] = Object.freeze([
  { qlId: "SPA-QL-043", seed: "CND-V2-REVIEW:DICE:1" },
  { qlId: "SPA-QL-043", seed: "CND-V2-REVIEW:DICE:2" },
  { qlId: "SPA-QL-044", seed: "CND-V2-REVIEW:NET:1" },
  { qlId: "SPA-QL-044", seed: "CND-V2-REVIEW:NET:2" },
  { qlId: "SPA-QL-045", seed: "CND-V2-REVIEW:PAINT:1" },
  { qlId: "SPA-QL-045", seed: "CND-V2-REVIEW:PAINT:2" },
  { qlId: "SPA-QL-046", seed: "CND-V2-REVIEW:STACK:TOTAL", voxelTaskKind: "STACK_TOTAL_CUBES" },
  { qlId: "SPA-QL-046", seed: "CND-V2-REVIEW:STACK:EXPOSED", voxelTaskKind: "STACK_EXPOSED_FACES" },
  { qlId: "SPA-QL-046", seed: "CND-V2-REVIEW:STACK:MISSING", voxelTaskKind: "STACK_MISSING_TO_COMPLETE_CUBOID" },
  { qlId: "SPA-QL-047", seed: "CND-V2-REVIEW:VIEW:TOP", voxelTaskKind: "ORTHOGRAPHIC_TOP_CELL_COUNT" },
  { qlId: "SPA-QL-047", seed: "CND-V2-REVIEW:VIEW:FRONT", voxelTaskKind: "ORTHOGRAPHIC_FRONT_CELL_COUNT" },
  { qlId: "SPA-QL-047", seed: "CND-V2-REVIEW:VIEW:RIGHT", voxelTaskKind: "ORTHOGRAPHIC_RIGHT_CELL_COUNT" },
]);

const allSurfaces: CubesDiceQuestionStudioQuestionV2[] = [];
for (const spec of specs) {
  const byLanguage = LANGUAGES.map((language) => generateCubesDiceQuestionStudioSeededV2({ ...spec, language }));
  for (const question of byLanguage) {
    assertQuestion(question);
    allSurfaces.push(question);
  }
  const [en, hi, pa] = byLanguage;
  assert.equal(en!.contentFingerprint, hi!.contentFingerprint, `${spec.seed}: Hindi semantic fingerprint drift.`);
  assert.equal(en!.contentFingerprint, pa!.contentFingerprint, `${spec.seed}: Punjabi semantic fingerprint drift.`);
  assert.deepEqual(en!.options, hi!.options, `${spec.seed}: Hindi options drift.`);
  assert.deepEqual(en!.options, pa!.options, `${spec.seed}: Punjabi options drift.`);
  assert.equal(en!.correctIndex, hi!.correctIndex);
  assert.equal(en!.correctIndex, pa!.correctIndex);
  assert.equal(en!.canonicalAnswer, hi!.canonicalAnswer);
  assert.equal(en!.canonicalAnswer, pa!.canonicalAnswer);
  assert.equal(en!.solution.tables.length, hi!.solution.tables.length, `${spec.seed}: Hindi solution structure drift.`);
  assert.equal(en!.solution.tables.length, pa!.solution.tables.length, `${spec.seed}: Punjabi solution structure drift.`);
}
assert.equal(allSurfaces.length, specs.length * LANGUAGES.length);
assert.deepEqual([...new Set(allSurfaces.map((question) => question.qlId))].sort(), [...QLS].sort());

// Deterministic replay for each permanent QL.
for (const qlId of QLS) {
  const first = generateCubesDiceQuestionStudioSeededV2({ seed: `CND-V2-REPLAY:${qlId}`, qlId, language: "en" });
  const second = generateCubesDiceQuestionStudioSeededV2({ seed: `CND-V2-REPLAY:${qlId}`, qlId, language: "en" });
  assert.deepEqual(second, first, `${qlId}: deterministic replay failed.`);
}

function renderSolution(solution: CubesDiceStudentSolutionV1): string {
  const tables = solution.tables.map((row) => {
    const head = row.headers.map((value) => `<th>${escapeHtml(value)}</th>`).join("");
    const body = row.rows.map((cells, index) => `<tr${row.emphasizedRowIndexes.includes(index) ? ' class="em"' : ""}>${cells.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`).join("");
    return `<div class="table-title">${escapeHtml(row.title)}</div><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
  }).join("");
  const steps = solution.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  const note = solution.note ? `<div class="note"><strong>Note:</strong> ${escapeHtml(solution.note)}</div>` : "";
  return `<section class="solution"><h3>Solution</h3><div class="rule"><strong>Logic / Rule:</strong> ${escapeHtml(solution.logicRule)}</div>${tables}<ol>${steps}</ol>${note}<div class="answer">${escapeHtml(solution.answerLine)}</div></section>`;
}

function renderCard(question: CubesDiceQuestionStudioQuestionV2, index: number): string {
  const options = question.options.map((option, optionIndex) => `<div class="option"><span>${question.optionLabels[optionIndex]}.</span><strong>${escapeHtml(option)}</strong></div>`).join("");
  return `<article class="card"><div class="meta">Review ${index + 1} · ${question.qlId} · ${escapeHtml(question.taskKind)} · ${question.difficultyBand}</div><div class="stem">${escapeHtml(question.stem)}</div><div class="diagram">${question.stimulusSvgs[0]}</div><div class="options">${options}</div>${renderSolution(question.solution)}</article>`;
}

const englishReview = specs.map((spec) => generateCubesDiceQuestionStudioSeededV2({ ...spec, language: "en" }));
const localizedReview = [
  generateCubesDiceQuestionStudioSeededV2({ seed: "CND-V2-LOCALIZED:DICE:HI", qlId: "SPA-QL-043", language: "hi" }),
  generateCubesDiceQuestionStudioSeededV2({ seed: "CND-V2-LOCALIZED:DICE:PA", qlId: "SPA-QL-043", language: "pa" }),
  generateCubesDiceQuestionStudioSeededV2({ seed: "CND-V2-LOCALIZED:STACK:HI", qlId: "SPA-QL-046", language: "hi", voxelTaskKind: "STACK_EXPOSED_FACES" }),
  generateCubesDiceQuestionStudioSeededV2({ seed: "CND-V2-LOCALIZED:STACK:PA", qlId: "SPA-QL-046", language: "pa", voxelTaskKind: "STACK_EXPOSED_FACES" }),
  generateCubesDiceQuestionStudioSeededV2({ seed: "CND-V2-LOCALIZED:VIEW:HI", qlId: "SPA-QL-047", language: "hi", voxelTaskKind: "ORTHOGRAPHIC_FRONT_CELL_COUNT" }),
  generateCubesDiceQuestionStudioSeededV2({ seed: "CND-V2-LOCALIZED:VIEW:PA", qlId: "SPA-QL-047", language: "pa", voxelTaskKind: "ORTHOGRAPHIC_FRONT_CELL_COUNT" }),
];
localizedReview.forEach(assertQuestion);

const englishCards = englishReview.map(renderCard).join("\n");
const localizedCards = localizedReview.map((question, index) => renderCard(question, englishReview.length + index)).join("\n");
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>CND-001 Question Studio V2 Explanation Review</title><style>
*{box-sizing:border-box}body{margin:0;background:#f5f6f8;color:#17191d;font-family:Arial,Helvetica,sans-serif}.wrap{max-width:940px;margin:0 auto;padding:20px 12px 60px}.intro,.card{background:#fff;border:1px solid #dde1e6;border-radius:8px}.intro{padding:18px;margin-bottom:14px}.intro h1{margin:0 0 8px;font-size:23px}.intro p,.intro li{line-height:1.5;color:#454b54}.card{padding:18px;margin-bottom:14px}.meta{font-size:11px;color:#6a717b;margin-bottom:9px}.stem{font-size:17px;font-weight:700;line-height:1.55}.diagram{display:flex;justify-content:center;align-items:center;min-height:230px;padding:12px;border:1px solid #edf0f2;background:#fff;margin-top:11px}.diagram svg{display:block;width:min(310px,82vw);height:auto;max-height:290px;background:#fff}.options{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0 18px}.option{display:flex;gap:10px;padding:10px 12px;border:1px solid #dfe3e8;border-radius:5px}.solution{border-top:1px solid #dfe3e8;padding-top:14px}.solution h3{font-size:17px;margin:0 0 10px}.rule{font-size:14px;line-height:1.55;margin-bottom:10px;padding:10px 12px;background:#f7f8fa;border-left:3px solid #606874}.solution ol{padding-left:22px}.solution li{font-size:14px;line-height:1.55;margin:5px 0}.table-title{font-size:13px;font-weight:700;margin:12px 0 5px}table{border-collapse:collapse;width:100%;font-size:13px;margin-bottom:10px}th,td{border:1px solid #d9dde2;padding:8px 9px;text-align:center}th{background:#f6f7f9}.em td{font-weight:700;background:#f1f3f5}.note{font-size:13px;line-height:1.5;margin:9px 0}.answer{font-size:15px;font-weight:800;margin-top:10px;padding-top:10px;border-top:1px solid #e2e5e9}@media(max-width:600px){.card{padding:14px}.options{grid-template-columns:1fr}.diagram{min-height:210px}.diagram svg{width:min(275px,84vw)}table{font-size:12px}}
</style></head><body><main class="wrap"><section class="intro"><h1>CND-001 — Question Studio V2 & Student Solutions</h1><p>English uses the product-owner-approved V4 solution standard. SPA-QL-046 and SPA-QL-047 are permanently allocated on this branch. Hindi and Punjabi solution surfaces are generated for review but are not frozen.</p><ul><li>All five CND QLs use Logic/Rule → exact working/table → explicit answer.</li><li>No legacy three-paragraph solver-note explanation is exposed by the V2 surface.</li><li>Question Studio registration, persistence, Question Bank writes, test eligibility and publication remain disabled.</li></ul><h2>English review</h2></section>${englishCards}<section class="intro"><h2>Hindi/Punjabi spot review — not frozen</h2><p>These localized solutions preserve the same solver facts, options and answers as English, but still require editorial approval.</p></section>${localizedCards}</main></body></html>`;

const evidence = {
  status: "PASS_CND_001_QUESTION_STUDIO_V2_EXPLANATION_QUALITY_CANDIDATE_V1",
  allocationAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8.authorityId,
  allocatedRange: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8.allocatedRange,
  nextAvailablePermanentQlId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8.nextAvailablePermanentQlId,
  permanentQlCount: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8.permanentQlCount,
  cndPermanentQlCount: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8.chapterCounts["CND-001"],
  questionStudioAuthorityId: CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V2.authorityId,
  studentSolutionAuthorityId: CND_001_STUDENT_SOLUTION_V4_AUTHORITY_V1.authorityId,
  studentSolutionEnglishReview: CND_001_STUDENT_SOLUTION_V4_AUTHORITY_V1.languageReviewStatus.en,
  localizedSolutionReview: { hi: CND_001_STUDENT_SOLUTION_V4_AUTHORITY_V1.languageReviewStatus.hi, pa: CND_001_STUDENT_SOLUTION_V4_AUTHORITY_V1.languageReviewStatus.pa },
  structuralVoxelQuestions: structuralQuestions.length,
  multilingualStudioSurfaces: allSurfaces.length,
  directEnglishReviewQuestions: englishReview.length,
  localizedSpotReviewQuestions: localizedReview.length,
  governance: {
    questionStudioDiscoverable: false,
    registrationAuthorized: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticPublication: false,
  },
  nextGate: "DIRECT_HI_PA_SOLUTION_REVIEW_THEN_CND_001_QUESTION_STUDIO_V2_OPERATOR_REGISTRATION_DECISION",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-cnd-001-question-studio-v2-explanation-review.html", html);
writeFileSync("dist/reasoning-v1/spatial/spa-cnd-001-question-studio-v2-explanation-review-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify(evidence, null, 2));
