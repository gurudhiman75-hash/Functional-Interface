import assert from "node:assert/strict";
import { generateSeaCp001Caselet } from "./generation/caselet-assembler.ts";
import { SEA_001_BLUEPRINTS } from "./manifest.ts";
import { generateMixedFacingCaselet, SEA_CP002_BLUEPRINTS } from "./cp002/generator.ts";
import { generateCircularCaselet, SEA_CP003_BLUEPRINTS } from "./cp003/generator.ts";
import { generateOutwardCaselet, SEA_CP004_BLUEPRINTS } from "./cp004/generator.ts";
import { generateMixedCircleCaselet, SEA_CP005_BLUEPRINTS } from "./cp005/generator.ts";
import { projectSea001EnglishReviewV1 } from "./english-review-v1.ts";

const blocked = /\b(?:solver|oracle|backtracking|canonical(?:isation|ization)?|solution class|search node|dfs)\b/i;
const bands = new Set<string>();
let questions = 0;
let fallbackWrongOptions = 0;

function seatCountFromCp1Key(key: string): number {
  return (key.split("|")[1] ?? "").split(">").filter(Boolean).length;
}
function seatCountFromOrderKey(key: string): number {
  return (key.split("|")[0] ?? "").split(">").filter(Boolean).length;
}
function auditCaselet(caselet: any, seatCount: number) {
  assert.equal(caselet.lifecycle.permanentQlCount, 9);
  for (const child of caselet.children) {
    const review = projectSea001EnglishReviewV1({
      checkpointId: caselet.checkpointId,
      caseletId: caselet.caseletId,
      setupText: caselet.setupText,
      clueTexts: caselet.clueTexts,
      checkpointSkillCoverage: caselet.checkpointSkillCoverage,
      seatCount,
      child,
    });
    questions += 1;
    bands.add(review.difficulty.band);

    assert.equal(review.diagramPolicy, "EXPLANATION_ONLY");
    assert.equal(review.reviewStatus, "MANUAL_REVIEW_REQUIRED");
    assert.equal(blocked.test(review.stem), false, review.stem);
    assert.equal(blocked.test(review.explanation), false, review.explanation);
    assert.ok(review.stem.length > 10 && review.stem.length < 220);
    assert.ok(review.explanation.length > 10 && review.explanation.length < 700);
    assert.equal(review.options.length, 4);
    assert.ok(review.correctIndex >= 0 && review.correctIndex < 4);

    const wrong = child.options.filter((option: any) => !option.isCorrect);
    assert.equal(wrong.length, 3);
    assert.equal(wrong.every((option: any) => typeof option.misconceptionId === "string" && option.misconceptionId.length > 0), true);
    const fallbackCount = wrong.filter((option: any) =>
      Object.prototype.hasOwnProperty.call(option.recomputation ?? {}, "fallbackVerifiedValue")).length;
    assert.ok(fallbackCount <= 1, `${caselet.caseletId}/${child.queryContractId} used ${fallbackCount} generic fallbacks`);
    fallbackWrongOptions += fallbackCount;
  }
}

for (const blueprint of SEA_001_BLUEPRINTS) {
  for (let seed = 0; seed < 20; seed += 1) {
    const c = generateSeaCp001Caselet({ blueprintId: blueprint, seed: `ENG-CP1-${blueprint}-${seed}` });
    auditCaselet(c, seatCountFromCp1Key(c.solverOracleAgreement.productionKeys[0]!));
  }
}
for (const blueprint of SEA_CP002_BLUEPRINTS) {
  for (let seed = 0; seed < 20; seed += 1) {
    const c = generateMixedFacingCaselet(`ENG-CP2-${blueprint}-${seed}`, blueprint);
    auditCaselet(c, seatCountFromOrderKey(c.solverOracleAgreement.productionKeys[0]!));
  }
}
for (const blueprint of SEA_CP003_BLUEPRINTS) {
  for (let seed = 0; seed < 20; seed += 1) {
    const c = generateCircularCaselet(`ENG-CP3-${blueprint}-${seed}`, blueprint);
    auditCaselet(c, c.topologySnapshot.seatCount);
  }
}
for (const blueprint of SEA_CP004_BLUEPRINTS) {
  for (let seed = 0; seed < 20; seed += 1) {
    const c = generateOutwardCaselet(`ENG-CP4-${blueprint}-${seed}`, blueprint);
    auditCaselet(c, c.topologySnapshot.seatCount);
  }
}
for (const blueprint of SEA_CP005_BLUEPRINTS) {
  for (let seed = 0; seed < 20; seed += 1) {
    const c = generateMixedCircleCaselet(`ENG-CP5-${blueprint}-${seed}`, blueprint);
    auditCaselet(c, seatCountFromOrderKey(c.solverOracleAgreement.productionKeys[0]!));
  }
}

assert.ok(bands.has("EASY"));
assert.ok(bands.has("MEDIUM"));
assert.ok(bands.has("HARD"));

console.log(JSON.stringify({
  status: "PASS_SEA_001_ENGLISH_REVIEW_V1",
  questions,
  observedDifficultyBands: [...bands].sort(),
  fallbackWrongOptions,
  internalJargonLeak: false,
  diagramPolicy: "EXPLANATION_ONLY",
}, null, 2));
