import assert from "node:assert/strict";
import {
  generateNumCp001Wave01Package,
  generateNumCp001Wave01Sweep,
  NUM_CP001_WAVE01_PROTOTYPE_IDS,
} from "./runtime-authority";
import { generateNumCp001Wave01Package as generateBasePackage } from "./runtime";

const packages = generateNumCp001Wave01Sweep(100);
assert.equal(packages.length, 800);

let mathematicalDrift = 0;
let learnerLabelLeaks = 0;
let parityTrapMismatches = 0;
let orderingTrapMismatches = 0;
let distanceSpeedMismatches = 0;

for (const pkg of packages) {
  const base = generateBasePackage(pkg.temporaryPrototypeId, pkg.seed);
  const replay = generateNumCp001Wave01Package(pkg.temporaryPrototypeId, pkg.seed);
  assert.equal(JSON.stringify(pkg), JSON.stringify(replay));

  if (
    pkg.canonicalAnswer !== base.canonicalAnswer
    || pkg.verifierAnswer !== base.verifierAnswer
    || pkg.correctIndex !== base.correctIndex
    || pkg.mathematicalFingerprint !== base.mathematicalFingerprint
    || JSON.stringify(pkg.hiddenState) !== JSON.stringify(base.hiddenState)
  ) mathematicalDrift += 1;

  const learnerText = [
    pkg.stem,
    ...pkg.options.map((option) => option.value),
    ...pkg.explanation.coreConcept,
    ...pkg.explanation.givenDataAndStrategy,
    ...pkg.explanation.stepByStep,
    ...pkg.explanation.examSpeedMethod,
    ...pkg.explanation.commonTraps,
    pkg.explanation.finalAnswer,
  ].join("\n");
  if (/[A-Z]{2,}_[A-Z0-9_]+/.test(learnerText)) learnerLabelLeaks += 1;

  if (pkg.temporaryPrototypeId === "NUM-CP001-PROT-006") {
    for (const option of pkg.options.filter((item) => !item.isCorrect)) {
      const id = option.misconceptionId;
      if (option.value.includes(" × ") && !id?.includes("EVEN_FACTOR")) parityTrapMismatches += 1;
      if (/[²³]$/.test(option.value) && !id?.includes("EVEN_POWER")) parityTrapMismatches += 1;
      if (option.value.includes(" + ")) {
        const [left, right] = option.value.split(" + ").map(Number);
        if (left! % 2 === 0 && right! % 2 === 0 && id !== "EVEN_PLUS_EVEN_RULE_CONFUSED") parityTrapMismatches += 1;
        if (Math.abs(left!) % 2 === 1 && Math.abs(right!) % 2 === 1 && id !== "ODD_PAIR_SUM_DIFFERENCE_RULE_CONFUSED") parityTrapMismatches += 1;
      }
      if (option.value.includes(" - ")) {
        const [left, right] = option.value.split(" - ").map(Number);
        if (Math.abs(left!) % 2 === 1 && Math.abs(right!) % 2 === 1 && id !== "ODD_PAIR_SUM_DIFFERENCE_RULE_CONFUSED") parityTrapMismatches += 1;
      }
    }
  }

  if (pkg.temporaryPrototypeId === "NUM-CP001-PROT-003" && Number(pkg.hiddenState.tier) === 0) {
    const wrongStartingPositive = pkg.options.find((option) => !option.isCorrect && Number(option.value.split("<")[0]!.trim()) >= 0);
    if (wrongStartingPositive && wrongStartingPositive.misconceptionId !== "MISPLACED_NEGATIVE_VALUE") orderingTrapMismatches += 1;
  }

  if (pkg.temporaryPrototypeId === "NUM-CP001-PROT-004") {
    const speed = pkg.explanation.examSpeedMethod.join(" ");
    const crossesZero = Boolean(pkg.hiddenState.crossesZero);
    if (crossesZero && !speed.includes("opposite sides of zero")) distanceSpeedMismatches += 1;
    if (!crossesZero && !speed.includes("same side of zero")) distanceSpeedMismatches += 1;
  }
}

assert.equal(mathematicalDrift, 0);
assert.equal(learnerLabelLeaks, 0);
assert.equal(parityTrapMismatches, 0);
assert.equal(orderingTrapMismatches, 0);
assert.equal(distanceSpeedMismatches, 0);

for (const prototypeId of NUM_CP001_WAVE01_PROTOTYPE_IDS) {
  assert.ok(packages.some((pkg) => pkg.temporaryPrototypeId === prototypeId));
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_WAVE01_LEARNER_AUTHORITY",
  generatedPackages: packages.length,
  mathematicalDrift,
  learnerLabelLeaks,
  parityTrapMismatches,
  orderingTrapMismatches,
  distanceSpeedMismatches,
  permanentQlCount: 0,
}, null, 2));