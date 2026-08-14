import assert from "node:assert/strict";
import { MEN_CP_010_PERMANENT_ALLOCATION } from "./allocation";
import {
  generateMenCp010PermanentEnglishQuestion,
  listMenCp010PermanentEnglishSources,
} from "./runtime";

assert.equal(MEN_CP_010_PERMANENT_ALLOCATION.length, 26);

let generated = 0;
const sourceHits = new Set<string>();
const positions = [0, 0, 0, 0];

for (const allocation of MEN_CP_010_PERMANENT_ALLOCATION) {
  const qlPositions = new Set<number>();
  for (let index = 0; index < 64; index += 1) {
    const q = generateMenCp010PermanentEnglishQuestion(
      allocation.qlId,
      `proof-${String(index).padStart(2, "0")}`,
    );
    generated += 1;
    sourceHits.add(`${q.clusterId}:${q.sourceWave}:${q.sourceId}`);
    positions[q.correctIndex] += 1;
    qlPositions.add(q.correctIndex);

    assert.equal(q.permanentQlId, allocation.qlId);
    assert.equal(q.clusterId, allocation.clusterId);
    assert.equal(q.templateId, allocation.templateId);
    assert.equal(q.solveModeId, allocation.solveModeId);
    assert.equal(q.language, "en");
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((o) => o.display)).size, 4);
    assert.equal(q.options.filter((o) => o.isCorrect).length, 1);
    assert.equal(q.options[q.correctIndex]?.isCorrect, true);
    assert.equal(q.verification.valid, true);
    assert.ok(q.stem.length >= 20);
    assert.ok(q.explanation.steps.length >= 4);
    assert.ok(q.explanation.keyRule.length >= 8);
    assert.equal(q.englishImplementationFrozen, false);
    assert.equal(q.active, false);
    assert.equal(q.questionStudioDiscoverable, false);
    assert.equal(q.questionBankStatus, "NOT_STORED");
    assert.equal(q.testEligibility, "INELIGIBLE");
    assert.equal(q.publiclyPublishable, false);
  }
  assert.equal(
    qlPositions.size,
    4,
    `${allocation.qlId} must demonstrate all four correct-answer positions across the deterministic proof set`,
  );
}

const declaredSources = listMenCp010PermanentEnglishSources().flatMap((row) =>
  row.sources.map((source) => `${row.clusterId}:${source.kind}:${source.id}`),
);
for (const source of declaredSources) {
  assert.equal(sourceHits.has(source), true, `Declared permanent-runtime source was not exercised: ${source}`);
}

assert.equal(generated, 26 * 64);
assert.equal(positions.every((count) => count > 0), true);

console.log(JSON.stringify({
  permanentQlCount: MEN_CP_010_PERMANENT_ALLOCATION.length,
  deterministicQuestionCount: generated,
  declaredSourceCount: declaredSources.length,
  exercisedSourceCount: sourceHits.size,
  correctPositions: { A: positions[0], B: positions[1], C: positions[2], D: positions[3] },
  englishImplementationFrozen: false,
  productLocked: true,
}, null, 2));
