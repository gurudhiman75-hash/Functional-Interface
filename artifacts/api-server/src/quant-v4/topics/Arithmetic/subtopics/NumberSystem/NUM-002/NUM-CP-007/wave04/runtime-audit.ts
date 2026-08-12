import assert from "node:assert/strict";
import {
  generateNumCp007Wave04Package,
  NUM_CP007_WAVE04_PROTOTYPE_IDS,
  verifyNumCp007Wave04Package,
} from "./runtime.ts";

const stems = new Set<string>();
const representations = new Set<string>();
const semantics = new Set<string>();
const sourceFamilies = new Set<string>();
let generatedAuditPackages = 0;
let optionViolations = 0;
let verifierViolations = 0;
let lifecycleViolations = 0;
let internalIdentityLeaks = 0;
let zeroRemainderExtremumLeaks = 0;
let cp006GreatestSameRemainderLeaks = 0;

for (const prototypeId of NUM_CP007_WAVE04_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= 75; seed++) {
    const pkg = generateNumCp007Wave04Package(prototypeId, seed);
    generatedAuditPackages++;
    stems.add(pkg.stem);
    representations.add(pkg.representation);
    semantics.add(pkg.answerSemantic);
    pkg.sourceAncestry.forEach((value) => sourceFamilies.add(value));

    if (pkg.options.length !== 4 || new Set(pkg.options.map((option) => option.value)).size !== 4) optionViolations++;
    if (verifyNumCp007Wave04Package(pkg) !== pkg.canonicalAnswer) verifierViolations++;
    if (
      pkg.permanentQlId !== null ||
      pkg.lifecycle.active ||
      pkg.lifecycle.questionStudioDiscoverable ||
      pkg.lifecycle.questionBankWritable ||
      pkg.lifecycle.testEligible ||
      pkg.lifecycle.publiclyPublishable
    ) lifecycleViolations++;
    if (/NUM-CP007-PROT|temporaryPrototypeId|hiddenState/.test(pkg.stem)) internalIdentityLeaks++;
    if (prototypeId === "NUM-CP007-PROT-031" && pkg.hiddenState.remainder === 0) zeroRemainderExtremumLeaks++;
    if (prototypeId === "NUM-CP007-PROT-032" && /greatest divisor/i.test(pkg.stem)) cp006GreatestSameRemainderLeaks++;
  }
}

assert.ok(stems.size >= 500, `Insufficient exact stem breadth: ${stems.size}`);
assert.ok(representations.size >= NUM_CP007_WAVE04_PROTOTYPE_IDS.length, "Wave 04 representation breadth collapsed.");
assert.equal(optionViolations, 0);
assert.equal(verifierViolations, 0);
assert.equal(lifecycleViolations, 0);
assert.equal(internalIdentityLeaks, 0);
assert.equal(zeroRemainderExtremumLeaks, 0, "Zero-remainder extrema must stay routed away from CP-007 Wave 04.");
assert.equal(cp006GreatestSameRemainderLeaks, 0, "Greatest same-remainder divisor must remain CP-006-owned.");

console.log(JSON.stringify({
  status: "PASS_NUM_CP007_WAVE04_STRUCTURAL_AUDIT",
  temporaryPrototypeCount: NUM_CP007_WAVE04_PROTOTYPE_IDS.length,
  seedsPerPrototype: 75,
  generatedAuditPackages,
  exactAuditStems: stems.size,
  representations: [...representations].sort(),
  answerSemantics: [...semantics].sort(),
  sourceFamilyCount: sourceFamilies.size,
  optionViolations,
  verifierViolations,
  lifecycleViolations,
  internalIdentityLeaks,
  zeroRemainderExtremumLeaks,
  cp006GreatestSameRemainderLeaks,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-098",
}, null, 2));
