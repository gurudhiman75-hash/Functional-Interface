import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateNumCp009Wave03 } from "./runtime.ts";
import { NUM_CP009_WAVE03_PROTOTYPE_IDS } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const packagesPerPrototype = 120;
let packageCount = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let p015LastTwoCount = 0;
let p015LastThreeCount = 0;
let exact00Count = 0;
let exact000Count = 0;
let p016TwoClassCount = 0;
let p016ThreeClassCount = 0;
let p017CycleLength2Count = 0;
let p017CycleLength4Count = 0;
let p017ExactBlockCount = 0;
let p017LeftoverCount = 0;
const prototypeReport: Record<string, unknown> = {};

for (const prototypeId of NUM_CP009_WAVE03_PROTOTYPE_IDS) {
  const answerPositions = new Set<number>();
  const stemFamilies = new Set<string>();
  const difficulties = new Set<string>();
  const fingerprints = new Set<string>();
  const answers = new Set<string>();

  for (let seed = 0; seed < packagesPerPrototype; seed += 1) {
    const first = generateNumCp009Wave03(prototypeId, seed);
    const replay = generateNumCp009Wave03(prototypeId, seed);
    packageCount += 1;

    assert(JSON.stringify(first) === JSON.stringify(replay), `${prototypeId}/${seed}: deterministic replay mismatch`);
    replayChecks += 1;

    assert(first.packageId === "NUM-002", `${prototypeId}/${seed}: wrong package`);
    assert(first.checkpointId === "NUM-CP-009", `${prototypeId}/${seed}: wrong checkpoint`);
    assert(first.temporaryPrototypeId === prototypeId, `${prototypeId}/${seed}: wrong temporary prototype`);
    assert(first.permanentQlId === null, `${prototypeId}/${seed}: permanent QL allocated during discovery`);
    assert(first.canonicalAnswer === first.verifierAnswer,
      `${prototypeId}/${seed}: canonical/verifier mismatch ${first.canonicalAnswer} != ${first.verifierAnswer}`);
    verifierChecks += 1;

    assert(first.options.length === 4, `${prototypeId}/${seed}: expected four options`);
    assert(new Set(first.options.map((option) => option.value)).size === 4, `${prototypeId}/${seed}: duplicate option values`);
    assert(first.options.filter((option) => option.isCorrect).length === 1,
      `${prototypeId}/${seed}: option correctness cardinality mismatch`);
    assert(first.options[first.correctIndex]?.isCorrect === true, `${prototypeId}/${seed}: correct index is not correct`);
    assert(first.options[first.correctIndex]?.value === first.canonicalAnswer,
      `${prototypeId}/${seed}: canonical answer is not bound to visible option`);
    optionChecks += 1;

    const lifecycle = first.lifecycle;
    assert(lifecycle.permanentQlId === null, `${prototypeId}/${seed}: lifecycle permanent QL allocated`);
    assert(lifecycle.maturity === "EXECUTABLE_DISCOVERY_PROOF", `${prototypeId}/${seed}: wrong maturity`);
    assert(lifecycle.reviewStatus === "UNREVIEWED_DISCOVERY_CANDIDATE", `${prototypeId}/${seed}: wrong review status`);
    assert(lifecycle.questionBankStatus === "NOT_STORED", `${prototypeId}/${seed}: Question Bank status opened`);
    assert(lifecycle.testEligibility === "INELIGIBLE", `${prototypeId}/${seed}: test eligibility opened`);
    assert(lifecycle.active === false, `${prototypeId}/${seed}: active flag opened`);
    assert(lifecycle.questionStudioDiscoverable === false, `${prototypeId}/${seed}: Question Studio opened`);
    assert(lifecycle.questionBankWritable === false, `${prototypeId}/${seed}: Question Bank writes opened`);
    assert(lifecycle.testEligible === false, `${prototypeId}/${seed}: test flag opened`);
    assert(lifecycle.publiclyPublishable === false, `${prototypeId}/${seed}: publication opened`);
    lifecycleChecks += 1;

    const learnerText = [
      first.stem,
      first.explanation.coreConcept,
      first.explanation.strategy,
      ...first.explanation.steps,
      first.explanation.finalAnswer,
    ].join("\n");
    assert(first.explanation.steps.length >= 2, `${prototypeId}/${seed}: explanation too thin`);
    assert(first.explanation.coreConcept.length >= 20, `${prototypeId}/${seed}: core concept too short`);
    assert(first.explanation.strategy.length >= 20, `${prototypeId}/${seed}: strategy too short`);
    assert(!/prototype|hidden state|generator|seed|fingerprint|lifecycle/i.test(learnerText),
      `${prototypeId}/${seed}: implementation metadata leaked to learner text`);

    answerPositions.add(first.correctIndex);
    stemFamilies.add(first.stemFamily);
    difficulties.add(first.difficulty);
    fingerprints.add(first.mathematicalFingerprint);
    answers.add(first.canonicalAnswer);

    if (prototypeId === "NUM-CP009-PROT-015") {
      const width = Number(first.hiddenState.width);
      const gcdWithModulus = Number(first.hiddenState.gcdWithModulus);
      assert(gcdWithModulus > 1, `${prototypeId}/${seed}: state is unexpectedly coprime`);
      if (width === 2) {
        p015LastTwoCount += 1;
        assert(/^\d{2}$/u.test(first.canonicalAnswer), `${prototypeId}/${seed}: last-two answer lost width`);
        assert(first.options.every((option) => /^\d{2}$/u.test(option.value)), `${prototypeId}/${seed}: last-two option lost width`);
        if (first.canonicalAnswer === "00") exact00Count += 1;
      } else if (width === 3) {
        p015LastThreeCount += 1;
        assert(/^\d{3}$/u.test(first.canonicalAnswer), `${prototypeId}/${seed}: last-three answer lost width`);
        assert(first.options.every((option) => /^\d{3}$/u.test(option.value)), `${prototypeId}/${seed}: last-three option lost width`);
        if (first.canonicalAnswer === "000") exact000Count += 1;
      } else {
        throw new Error(`${prototypeId}/${seed}: invalid terminal width ${width}`);
      }
    }

    if (prototypeId === "NUM-CP009-PROT-016") {
      const classCount = Number(first.hiddenState.classCount);
      assert(classCount >= 2, `${prototypeId}/${seed}: composite condition collapsed to one class`);
      if (classCount === 2) p016TwoClassCount += 1;
      if (classCount === 3) p016ThreeClassCount += 1;
    }

    if (prototypeId === "NUM-CP009-PROT-017") {
      const cycleLength = Number(first.hiddenState.cycleLength);
      const leftover = Number(first.hiddenState.leftoverCount);
      if (cycleLength === 2) p017CycleLength2Count += 1;
      if (cycleLength === 4) p017CycleLength4Count += 1;
      if (leftover === 0) p017ExactBlockCount += 1;
      else p017LeftoverCount += 1;
      assert(Number(first.hiddenState.termCount) >= 24, `${prototypeId}/${seed}: sum is too short to require block aggregation`);
    }
  }

  assert(answerPositions.size === 4, `${prototypeId}: all answer positions were not reached`);
  assert(stemFamilies.size === 3, `${prototypeId}: expected three stem families`);
  assert(difficulties.size >= 2, `${prototypeId}: expected at least two difficulty bands`);
  assert(fingerprints.size >= 70, `${prototypeId}: mathematical pool too thin (${fingerprints.size}/120 unique)`);
  assert(answers.size >= 2, `${prototypeId}: answer surface collapsed to one value`);

  prototypeReport[prototypeId] = {
    answerPositions: [...answerPositions].sort(),
    stemFamilies: [...stemFamilies].sort(),
    difficulties: [...difficulties].sort(),
    uniqueFingerprints: fingerprints.size,
    uniqueAnswers: answers.size,
  };
}

assert(p015LastTwoCount > 0 && p015LastThreeCount > 0,
  "P015 did not exercise both last-two and last-three terminal semantics");
assert(exact00Count > 0, "P015 did not exercise exact terminal block 00");
assert(exact000Count > 0, "P015 did not exercise exact terminal block 000");
assert(p016TwoClassCount > 0 && p016ThreeClassCount > 0,
  "P016 did not exercise both two-class and three-class composite conditions");
assert(p017CycleLength2Count > 0 && p017CycleLength4Count > 0,
  "P017 did not exercise both cycle-length 2 and cycle-length 4 sums");
assert(p017ExactBlockCount > 0 && p017LeftoverCount > 0,
  "P017 did not exercise both exact full-cycle and leftover-term sums");

const report = {
  status: "PASS_NUM_CP009_WAVE03_FINAL_MATERIAL_GAPS",
  prototypes: NUM_CP009_WAVE03_PROTOTYPE_IDS.length,
  packages: packageCount,
  replayChecks,
  verifierChecks,
  optionChecks,
  lifecycleChecks,
  nonCoprimeTerminalBlocks: {
    lastTwo: p015LastTwoCount,
    lastThree: p015LastThreeCount,
    exact00: exact00Count,
    exact000: exact000Count,
  },
  multiClassConditions: {
    twoClasses: p016TwoClassCount,
    threeClasses: p016ThreeClassCount,
  },
  longPowerSums: {
    cycleLength2: p017CycleLength2Count,
    cycleLength4: p017CycleLength4Count,
    exactFullBlocks: p017ExactBlockCount,
    withLeftovers: p017LeftoverCount,
  },
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-185",
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  prototypeReport,
};

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/num-cp009-wave03");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(resolve(outputDirectory, "audit.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
