import assert from "node:assert/strict";

import { generateSpatialProductionStudioQuestionV6 } from "../foundation/spatial/spatial-question-studio-production-v6";

const qlIds = ["SPA-QL-052", "SPA-QL-053"] as const;
const seeds = Array.from({ length: 24 }, (_, index) => `ffm-target-shape-${index + 1}`);

function hasDiagonalLine(svg: string): boolean {
  const line = /<line\s+[^>]*x1="([\d.-]+)"[^>]*y1="([\d.-]+)"[^>]*x2="([\d.-]+)"[^>]*y2="([\d.-]+)"/g;
  for (const match of svg.matchAll(line)) {
    const [, x1, y1, x2, y2] = match;
    if (Math.abs(Number(x1) - Number(x2)) > 0.01 && Math.abs(Number(y1) - Number(y2)) > 0.01) return true;
  }
  return false;
}

let checked = 0;
let diagonalSurfaceChecks = 0;
const targetKinds = new Map<string, Set<string>>(qlIds.map((qlId) => [qlId, new Set<string>()]));

for (const qlId of qlIds) {
  for (const seed of seeds) {
    const question = generateSpatialProductionStudioQuestionV6({ qlId, seed, language: "en" }) as any;
    const owner = `${qlId}:${seed}`;
    assert.equal(question.version, "SPA-FFM-001-QUESTION-STUDIO-V3-TARGET-SHAPE", `${owner}: polygon target runtime not selected.`);
    assert.ok(question.solveFacts.targetKind === "SQUARE" || question.solveFacts.targetKind === "TRIANGLE", `${owner}: target kind missing.`);
    targetKinds.get(qlId)!.add(question.solveFacts.targetKind);
    assert.ok([16, 32].includes(question.solveFacts.atomicTriangleCount), `${owner}: unexpected atomic triangle count.`);
    assert.equal(question.validation.exactCoverSolverBacked, true, `${owner}: exact-cover solver proof missing.`);
    assert.equal(question.validation.uniqueAnswer, true, `${owner}: answer uniqueness proof missing.`);
    assert.equal(question.validation.rotationAllowed, true, `${owner}: rotation policy drift.`);
    assert.equal(question.validation.reflectionDisallowed, true, `${owner}: reflection policy drift.`);
    assert.equal(question.solveFacts.reflectionUsed, false, `${owner}: reflected solution leaked.`);
    assert.equal(question.solveFacts.overlapCount, 0, `${owner}: overlap leaked.`);
    assert.equal(question.solveFacts.uncoveredTargetCells, 0, `${owner}: target not fully covered.`);
    assert.equal(new Set(question.optionSvgs).size, 4, `${owner}: duplicate visual option.`);
    assert.match(question.explanation.application, /\d+°/, `${owner}: item-specific rotation working missing.`);
    assert.ok(question.stimulusSvgs.some(hasDiagonalLine) || question.optionSvgs.some(hasDiagonalLine), `${owner}: target-construction surface contains no diagonal polygon edge.`);
    diagonalSurfaceChecks += 1;
    if (qlId === "SPA-QL-052") {
      assert.ok(question.stimulusSvgs[0].includes("numbered pieces"), `${owner}: numbered-piece stimulus missing.`);
      assert.ok(question.optionSvgs.every((svg: string) => !/<circle\b/i.test(svg)), `${owner}: toy circle pair option returned.`);
      assert.ok(question.optionSvgs.every((svg: string) => /\band\b/.test(svg)), `${owner}: pair option must use plain exam-style number text.`);
    }
    checked += 1;
  }
  assert.deepEqual([...targetKinds.get(qlId)!].sort(), ["SQUARE", "TRIANGLE"], `${qlId}: proof seeds must cover both square and triangle construction.`);
}

assert.equal(checked, qlIds.length * seeds.length);
assert.equal(diagonalSurfaceChecks, checked);
console.log("PASS_FFM_001_TARGET_SHAPE_V3", {
  checked,
  diagonalSurfaceChecks,
  targetKinds: Object.fromEntries([...targetKinds.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
});
