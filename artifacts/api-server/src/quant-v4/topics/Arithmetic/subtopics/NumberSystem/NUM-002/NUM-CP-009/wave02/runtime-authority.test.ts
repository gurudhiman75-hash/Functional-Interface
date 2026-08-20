import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateNumCp009Wave02 } from "./runtime.ts";
import { NUM_CP009_WAVE02_PROTOTYPE_IDS } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const packagesPerPrototype = 120;
let packageCount = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let leadingZeroLastThreeCount = 0;
let emptyExponentSetCount = 0;
let singletonExponentSetCount = 0;
let multipleExponentSetCount = 0;
let possibleFeasibilityCount = 0;
let impossibleFeasibilityCount = 0;
let triangularStructuredCount = 0;
let squareSumStructuredCount = 0;
const allDifficulties = new Set<string>();
const prototypeReport: Record<string, unknown> = {};

for (const prototypeId of NUM_CP009_WAVE02_PROTOTYPE_IDS) {
  const answerPositions = new Set<number>();
  const stemFamilies = new Set<string>();
  const difficulties = new Set<string>();
  const fingerprints = new Set<string>();
  const answers = new Set<string>();

  for (let seed = 0; seed < packagesPerPrototype; seed += 1) {
    const first = generateNumCp009Wave02(prototypeId, seed);
    const replay = generateNumCp009Wave02(prototypeId, seed);
    packageCount += 1;

    assert(JSON.stringify(first) === JSON.stringify(replay), `${prototypeId}/${seed}: replay mismatch`);
    replayChecks += 1;

    assert(first.packageId === "NUM-002", `${prototypeId}/${seed}: wrong package`);
    assert(first.checkpointId === "NUM-CP-009", `${prototypeId}/${seed}: wrong checkpoint`);
    assert(first.temporaryPrototypeId === prototypeId, `${prototypeId}/${seed}: wrong prototype`);
    assert(first.permanentQlId === null, `${prototypeId}/${seed}: permanent QL allocated during discovery`);
    assert(first.canonicalAnswer === first.verifierAnswer, `${prototypeId}/${seed}: canonical/verifier mismatch ${first.canonicalAnswer} != ${first.verifierAnswer}`);
    verifierChecks += 1;

    assert(first.options.length === 4, `${prototypeId}/${seed}: expected four options`);
    assert(new Set(first.options.map((option) => option.value)).size === 4, `${prototypeId}/${seed}: duplicate option values`);
    assert(first.options.filter((option) => option.isCorrect).length === 1, `${prototypeId}/${seed}: correctness cardinality mismatch`);
    assert(first.options[first.correctIndex]?.isCorrect === true, `${prototypeId}/${seed}: correct index not bound`);
    assert(first.options[first.correctIndex]?.value === first.canonicalAnswer, `${prototypeId}/${seed}: visible answer mismatch`);
    optionChecks += 1;

    const lifecycle = first.lifecycle;
    assert(lifecycle.permanentQlId === null, `${prototypeId}/${seed}: lifecycle permanent QL allocated`);
    assert(lifecycle.maturity === "EXECUTABLE_DISCOVERY_PROOF", `${prototypeId}/${seed}: wrong maturity`);
    assert(lifecycle.reviewStatus === "UNREVIEWED_DISCOVERY_CANDIDATE", `${prototypeId}/${seed}: wrong review state`);
    assert(lifecycle.questionBankStatus === "NOT_STORED", `${prototypeId}/${seed}: Question Bank state opened`);
    assert(lifecycle.testEligibility === "INELIGIBLE", `${prototypeId}/${seed}: test eligibility opened`);
    assert(lifecycle.active === false, `${prototypeId}/${seed}: active flag opened`);
    assert(lifecycle.questionStudioDiscoverable === false, `${prototypeId}/${seed}: Question Studio opened`);
    assert(lifecycle.questionBankWritable === false, `${prototypeId}/${seed}: Question Bank writes opened`);
    assert(lifecycle.testEligible === false, `${prototypeId}/${seed}: test flag opened`);
    assert(lifecycle.publiclyPublishable === false, `${prototypeId}/${seed}: public gate opened`);
    lifecycleChecks += 1;

    assert(first.explanation.steps.length >= 2, `${prototypeId}/${seed}: explanation too thin`);
    assert(first.explanation.coreConcept.length >= 20, `${prototypeId}/${seed}: core concept too short`);
    assert(first.explanation.strategy.length >= 20, `${prototypeId}/${seed}: strategy too short`);
    assert(!/prototype|hidden state|generator|seed|fingerprint|lifecycle/i.test([
      first.stem,
      first.explanation.coreConcept,
      first.explanation.strategy,
      ...first.explanation.steps,
      first.explanation.finalAnswer,
    ].join("\n")), `${prototypeId}/${seed}: implementation metadata leaked to learner text`);

    answerPositions.add(first.correctIndex);
    stemFamilies.add(first.stemFamily);
    difficulties.add(first.difficulty);
    allDifficulties.add(first.difficulty);
    fingerprints.add(first.mathematicalFingerprint);
    answers.add(first.canonicalAnswer);

    if (prototypeId === "NUM-CP009-PROT-009") {
      assert(/^\d{2}$/u.test(first.canonicalAnswer), `${prototypeId}/${seed}: last-two answer lost fixed width`);
      assert(first.options.every((option) => /^\d{2}$/u.test(option.value)), `${prototypeId}/${seed}: last-two option lost fixed width`);
    }
    if (prototypeId === "NUM-CP009-PROT-010" || prototypeId === "NUM-CP009-PROT-011") {
      assert(/^\d{3}$/u.test(first.canonicalAnswer), `${prototypeId}/${seed}: last-three answer lost fixed width`);
      assert(first.options.every((option) => /^\d{3}$/u.test(option.value)), `${prototypeId}/${seed}: last-three option lost fixed width`);
      if (first.canonicalAnswer.startsWith("0")) leadingZeroLastThreeCount += 1;
    }
    if (prototypeId === "NUM-CP009-PROT-012") {
      const count = (first.hiddenState.answerValues as readonly number[]).length;
      if (count === 0) emptyExponentSetCount += 1;
      else if (count === 1) singletonExponentSetCount += 1;
      else multipleExponentSetCount += 1;
    }
    if (prototypeId === "NUM-CP009-PROT-013") {
      if (first.hiddenState.asksImpossible === true) impossibleFeasibilityCount += 1;
      else possibleFeasibilityCount += 1;
    }
    if (prototypeId === "NUM-CP009-PROT-014") {
      if (first.hiddenState.exponentKind === "TRIANGULAR_SUM") triangularStructuredCount += 1;
      if (first.hiddenState.exponentKind === "SUM_OF_SQUARES") squareSumStructuredCount += 1;
    }
  }

  assert(answerPositions.size === 4, `${prototypeId}: all answer positions not reached`);
  assert(stemFamilies.size === 3, `${prototypeId}: expected three stem families`);
  assert(difficulties.size >= 2, `${prototypeId}: expected at least two difficulty bands`);
  assert(fingerprints.size >= 70, `${prototypeId}: mathematical pool too thin (${fingerprints.size}/120 unique)`);
  assert(answers.size >= 2, `${prototypeId}: answer surface collapsed`);

  prototypeReport[prototypeId] = {
    answerPositions: [...answerPositions].sort(),
    stemFamilies: [...stemFamilies].sort(),
    difficulties: [...difficulties].sort(),
    uniqueFingerprints: fingerprints.size,
    uniqueAnswers: answers.size,
  };
}

assert(allDifficulties.has("MEDIUM") && allDifficulties.has("HARD"), "Wave 02 did not reach Medium and Hard bands");
assert(leadingZeroLastThreeCount > 0, "No leading-zero last-three terminal block was exercised");
assert(emptyExponentSetCount > 0 && singletonExponentSetCount > 0 && multipleExponentSetCount > 0,
  "Bounded exponent-set topology did not cover empty/singleton/multiple states");
assert(possibleFeasibilityCount > 0 && impossibleFeasibilityCount > 0,
  "Terminal feasibility did not cover both possible and impossible directions");
assert(triangularStructuredCount > 0 && squareSumStructuredCount > 0,
  "Structured exponent prototype did not cover both exponent families");

const report = {
  status: "PASS_NUM_CP009_WAVE02_TERMINAL_BLOCKS_AND_INVERSE",
  prototypes: NUM_CP009_WAVE02_PROTOTYPE_IDS.length,
  packages: packageCount,
  replayChecks,
  verifierChecks,
  optionChecks,
  lifecycleChecks,
  leadingZeroLastThreeCount,
  exponentSetTopology: {
    empty: emptyExponentSetCount,
    singleton: singletonExponentSetCount,
    multiple: multipleExponentSetCount,
  },
  feasibilityDirections: {
    possible: possibleFeasibilityCount,
    impossible: impossibleFeasibilityCount,
  },
  structuredExponentFamilies: {
    triangular: triangularStructuredCount,
    squareSum: squareSumStructuredCount,
  },
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-185",
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  prototypeReport,
};

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/num-cp009-wave02");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(resolve(outputDirectory, "audit.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
