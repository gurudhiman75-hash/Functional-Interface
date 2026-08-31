import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";

import {
  countVisibleVoxelSurfaceFacesV2,
  CND_001_VOXEL_EXAM_RENDERER_AUTHORITY_V2,
} from "../foundation/spatial/cubes-dice-voxel-exam-renderer-v2";
import {
  CND_001_VOXEL_PROJECTION_RUNTIME_PROOF_AUTHORITY_V1,
  CND_001_VOXEL_STACK_TEMPLATES_V1,
  generateCubesDiceVoxelRuntimeQuestionV1,
  type CubesDiceVoxelRuntimeQuestionV1,
  type CubesDiceVoxelRuntimeTaskKindV1,
} from "../foundation/spatial/cubes-dice-voxel-projection-runtime-proof-v1";

const TASKS: readonly CubesDiceVoxelRuntimeTaskKindV1[] = Object.freeze([
  "STACK_TOTAL_CUBES",
  "STACK_EXPOSED_FACES",
  "STACK_MISSING_TO_COMPLETE_CUBOID",
  "ORTHOGRAPHIC_TOP_CELL_COUNT",
  "ORTHOGRAPHIC_FRONT_CELL_COUNT",
  "ORTHOGRAPHIC_RIGHT_CELL_COUNT",
]);

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function assertSvgSurface(question: CubesDiceVoxelRuntimeQuestionV1): void {
  const svg = question.stimulusSvg;
  const prefix = `${question.taskKind}/${question.templateId}/${question.seed}`;
  assert.match(svg, /^<svg\b/i, `${prefix}: SVG root required.`);
  assert.match(svg, /shape-rendering="geometricPrecision"/, `${prefix}: geometricPrecision required.`);
  assert.match(svg, /<rect width="\d+" height="\d+" fill="white"\/>/, `${prefix}: explicit white background required.`);
  assert.ok(!/<line\b/i.test(svg), `${prefix}: hidden/interior helper lines must not be rendered.`);
  assert.ok(!/rotate\s*\(|skew[XY]?\s*\(|matrix\s*\(/i.test(svg), `${prefix}: free/random figure transforms are forbidden.`);
  const strokeWidths = [...svg.matchAll(/stroke-width="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(strokeWidths.length > 0, `${prefix}: rendered visible faces require stroked geometry.`);
  assert.ok(strokeWidths.every((width) => width === "1.35"), `${prefix}: all geometry strokes must be exactly 1.35px.`);
  const visible = countVisibleVoxelSurfaceFacesV2(question.voxels);
  const expectedPolygons = visible.TOP + visible.LEFT_Y + visible.RIGHT_X;
  assert.equal((svg.match(/<polygon\b/g) ?? []).length, expectedPolygons, `${prefix}: SVG must contain exactly one polygon per visible canonical surface face.`);

  const viewBox = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  assert.ok(viewBox, `${prefix}: zero-origin integer viewBox required.`);
  const width = Number(viewBox[1]);
  const height = Number(viewBox[2]);
  assert.ok(width > 40 && height > 40, `${prefix}: viewBox must have meaningful dimensions.`);
  for (const match of svg.matchAll(/points="([^"]+)"/g)) {
    for (const pair of match[1]!.trim().split(/\s+/)) {
      const [x, y] = pair.split(",").map(Number);
      assert.ok(Number.isFinite(x) && Number.isFinite(y), `${prefix}: polygon coordinate is not finite.`);
      assert.ok(x >= 0 && x <= width && y >= 0 && y <= height, `${prefix}: dynamic bounds clipped a visible face.`);
    }
  }
}

assert.equal(CND_001_VOXEL_EXAM_RENDERER_AUTHORITY_V2.strokeWidth, 1.35);
assert.equal(CND_001_VOXEL_EXAM_RENDERER_AUTHORITY_V2.background, "WHITE");
assert.equal(CND_001_VOXEL_EXAM_RENDERER_AUTHORITY_V2.randomWholeFigureTiltAllowed, false);
assert.equal(CND_001_VOXEL_EXAM_RENDERER_AUTHORITY_V2.hiddenInteriorEdgesRendered, false);
assert.equal(CND_001_VOXEL_EXAM_RENDERER_AUTHORITY_V2.clippingPolicy, "DYNAMIC_CONTENT_BOUNDS_WITH_MARGIN");
assert.equal(CND_001_VOXEL_PROJECTION_RUNTIME_PROOF_AUTHORITY_V1.status, "RUNTIME_PROOF_IMPLEMENTED_REVIEW_REQUIRED");
assert.equal(CND_001_VOXEL_PROJECTION_RUNTIME_PROOF_AUTHORITY_V1.permanentQlAllocationAuthorized, false);
assert.equal(CND_001_VOXEL_PROJECTION_RUNTIME_PROOF_AUTHORITY_V1.questionStudioRegistrationAuthorized, false);
assert.equal(CND_001_VOXEL_STACK_TEMPLATES_V1.length, 12);

const exhaustiveQuestions: CubesDiceVoxelRuntimeQuestionV1[] = [];
for (const taskKind of TASKS) {
  for (const template of CND_001_VOXEL_STACK_TEMPLATES_V1) {
    const question = generateCubesDiceVoxelRuntimeQuestionV1({
      seed: `CND-VOXEL-RUNTIME-PROOF-V1:${taskKind}:${template.id}`,
      taskKind,
      templateId: template.id,
    });
    assertSvgSurface(question);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(question.distractorEvidence.length, 3);
    assert.equal(question.lifecycle.reviewOnly, true);
    assert.equal(question.lifecycle.permanentQlAllocated, false);
    assert.equal(question.lifecycle.questionStudioRegistered, false);
    assert.equal(question.lifecycle.persistenceAllowed, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
    exhaustiveQuestions.push(question);
  }
}

assert.equal(exhaustiveQuestions.length, 72, "Six task kinds across twelve curated stack templates must be proven.");
for (const taskKind of TASKS) {
  const rows = exhaustiveQuestions.filter((question) => question.taskKind === taskKind);
  assert.equal(rows.length, 12, `${taskKind}: all twelve stack templates must be solver-proven.`);
  assert.equal(new Set(rows.map((question) => question.templateId)).size, 12, `${taskKind}: template coverage collapsed.`);
  assert.equal(new Set(rows.map((question) => question.correctIndex)).size, 4, `${taskKind}: all four answer positions must be reachable.`);
}
assert.ok(exhaustiveQuestions.some((question) => question.difficultyBand === "Easy"), "Runtime proof requires Easy coverage.");
assert.ok(exhaustiveQuestions.some((question) => question.difficultyBand === "Medium"), "Runtime proof requires Medium coverage.");
assert.ok(exhaustiveQuestions.some((question) => question.difficultyBand === "Hard"), "Runtime proof requires Hard coverage.");
assert.equal(new Set(exhaustiveQuestions.map((question) => `${question.taskKind}:${question.templateId}:${question.answer}`)).size, exhaustiveQuestions.length, "Task/template proof identities must remain unique.");

const visualQuestions = CND_001_VOXEL_STACK_TEMPLATES_V1.map((template, index) => generateCubesDiceVoxelRuntimeQuestionV1({
  seed: `CND-VOXEL-VISUAL-REVIEW-V1:${index}`,
  taskKind: TASKS[index % TASKS.length]!,
  templateId: template.id,
}));
assert.equal(visualQuestions.length, 12);
assert.equal(new Set(visualQuestions.map((question) => question.templateId)).size, 12);
assert.equal(new Set(visualQuestions.map((question) => question.taskKind)).size, 6);
for (const question of visualQuestions) assertSvgSurface(question);

const cards = visualQuestions.map((question, index) => {
  const options = question.options.map((option, optionIndex) => `<div class="option"><span>${String.fromCharCode(65 + optionIndex)}.</span><strong>${option}</strong></div>`).join("");
  const explanation = [question.explanation.whatIsGiven, question.explanation.howToReason, question.explanation.conclusion]
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
  return `<article class="card">
    <div class="qnum">Visual review ${index + 1} / ${visualQuestions.length}</div>
    <div class="meta">${escapeHtml(question.candidateSkillId)} · proposed ${question.proposedPermanentQlId} · ${escapeHtml(question.taskKind)} · ${escapeHtml(question.templateId)} · ${escapeHtml(question.difficultyBand)}</div>
    <div class="stem">${escapeHtml(question.stem)}</div>
    <div class="diagram">${question.stimulusSvg}</div>
    <div class="options">${options}</div>
    <details><summary>Answer and explanation</summary><p><strong>Answer:</strong> ${String.fromCharCode(65 + question.correctIndex)} (${question.answer})</p>${explanation}<p><strong>Height matrix:</strong> ${escapeHtml(JSON.stringify(question.heights))}</p></details>
  </article>`;
}).join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>CND-001 Voxel + Orthographic Runtime Review V1</title><style>
*{box-sizing:border-box}body{margin:0;background:#f5f6f8;color:#16181d;font-family:Arial,Helvetica,sans-serif}.wrap{max-width:960px;margin:0 auto;padding:22px 14px 60px}.intro,.card{background:#fff;border:1px solid #d9dde3;border-radius:8px}.intro{padding:18px;margin-bottom:16px}.intro h1{font-size:23px;margin:0 0 10px}.intro p,.intro li{line-height:1.5;color:#444b55}.card{padding:18px;margin-bottom:14px}.qnum{font-size:11px;font-weight:700;text-transform:uppercase;color:#666}.meta{font-size:11px;color:#686f79;margin:5px 0 12px;line-height:1.45}.stem{font-size:16px;line-height:1.55;font-weight:600}.diagram{display:flex;align-items:center;justify-content:center;min-height:260px;margin-top:12px;padding:14px;border:1px solid #eceff2;background:#fff;overflow:hidden}.diagram svg{display:block;width:min(320px,82vw);height:auto;max-height:300px;background:#fff}.options{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.option{display:flex;gap:10px;padding:10px 12px;border:1px solid #e1e5ea;border-radius:5px}.option span{color:#666}details{border-top:1px solid #eceff2;padding-top:10px}details p{font-size:13px;line-height:1.5;color:#414852}summary{font-weight:600;cursor:pointer}@media(max-width:600px){.wrap{padding:12px 9px 40px}.card{padding:14px}.options{grid-template-columns:1fr}.diagram{min-height:220px}.diagram svg{width:min(280px,84vw)}}
</style></head><body><main class="wrap"><section class="intro"><h1>CND-001 — Voxel Stack & Orthographic Runtime Review V1</h1><p>This pack proves the two CND canonical skills that were previously held for runtime proof. It is review-only and does not allocate SPA-QL-046/047 or register them in Question Studio.</p><ul><li>12 curated stack shapes are shown under one fixed canonical isometric camera.</li><li>Only visible top/left/right cube faces are rendered; hidden/internal helper edges are removed.</li><li>Dynamic content bounds prevent clipped or broken outer edges.</li><li>White background and exact 1.35px exam-standard strokes are enforced.</li><li>All six solve modes are solver-backed across all 12 templates (72 structural proof cases).</li></ul></section>${cards}</main></body></html>`;

const evidence = {
  status: "PASS_CND_001_VOXEL_PROJECTION_RUNTIME_PROOF_CANDIDATE_V1",
  authorityId: CND_001_VOXEL_PROJECTION_RUNTIME_PROOF_AUTHORITY_V1.authorityId,
  rendererAuthorityId: CND_001_VOXEL_EXAM_RENDERER_AUTHORITY_V2.authorityId,
  canonicalSkills: CND_001_VOXEL_PROJECTION_RUNTIME_PROOF_AUTHORITY_V1.canonicalSkillIds,
  proposedPermanentQlRange: CND_001_VOXEL_PROJECTION_RUNTIME_PROOF_AUTHORITY_V1.proposedPermanentQlRange,
  structuralProofQuestions: exhaustiveQuestions.length,
  visualReviewQuestions: visualQuestions.length,
  stackTemplates: CND_001_VOXEL_STACK_TEMPLATES_V1.map((template) => template.id),
  taskKinds: TASKS,
  difficultyBands: [...new Set(exhaustiveQuestions.map((question) => question.difficultyBand))].sort(),
  visualContracts: {
    whiteBackground: true,
    exactStrokeWidth: 1.35,
    canonicalCamera: true,
    randomWholeFigureTiltAllowed: false,
    hiddenInteriorEdgesRendered: false,
    onlyVisibleSurfacePolygons: true,
    dynamicBoundsNoClipping: true,
  },
  governance: {
    runtimeProofImplemented: true,
    runtimeReviewRequired: true,
    permanentQlAllocationAuthorized: false,
    questionStudioRegistrationAuthorized: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  },
  nextGate: CND_001_VOXEL_PROJECTION_RUNTIME_PROOF_AUTHORITY_V1.nextGate,
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-cnd-001-voxel-projection-runtime-review-v1.html", html);
writeFileSync("dist/reasoning-v1/spatial/spa-cnd-001-voxel-projection-runtime-review-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify(evidence, null, 2));
