import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateNumCp009Wave01 } from "./runtime.ts";
import { NUM_CP009_WAVE01_PROTOTYPE_IDS } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const packagesPerPrototype = 120;
let packageCount = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let leadingZeroLastTwoCount = 0;
let zeroExponentCount = 0;
let boundedZeroCount = 0;
let boundedPositiveCount = 0;
const prototypeReport: Record<string, unknown> = {};
const allDifficulties = new Set<string>();

for (const prototypeId of NUM_CP009_WAVE01_PROTOTYPE_IDS) {
  const answerPositions = new Set<number>();
  const stemFamilies = new Set<string>();
  const difficulties = new Set<string>();
  const fingerprints = new Set<string>();
  const answers = new Set<string>();

  for (let seed = 0; seed < packagesPerPrototype; seed += 1) {
    const first = generateNumCp009Wave01(prototypeId, seed);
    const replay = generateNumCp009Wave01(prototypeId, seed);
    packageCount += 1;

    assert(JSON.stringify(first) === JSON.stringify(replay), `${prototypeId}/${seed}: deterministic replay mismatch`);
    replayChecks += 1;

    assert(first.packageId === "NUM-002", `${prototypeId}/${seed}: wrong package`);
    assert(first.checkpointId === "NUM-CP-009", `${prototypeId}/${seed}: wrong checkpoint`);
    assert(first.temporaryPrototypeId === prototypeId, `${prototypeId}/${seed}: wrong prototype identity`);
    assert(first.permanentQlId === null, `${prototypeId}/${seed}: permanent identity allocated during discovery`);
    assert(first.canonicalAnswer === first.verifierAnswer, `${prototypeId}/${seed}: canonical/verifier mismatch ${first.canonicalAnswer} != ${first.verifierAnswer}`);
    verifierChecks += 1;

    assert(first.options.length === 4, `${prototypeId}/${seed}: expected four options`);
    assert(new Set(first.options.map((option) => option.value)).size === 4, `${prototypeId}/${seed}: duplicate option values`);
    assert(first.options.filter((option) => option.isCorrect).length === 1, `${prototypeId}/${seed}: option correctness cardinality mismatch`);
    assert(first.correctIndex >= 0 && first.correctIndex < 4, `${prototypeId}/${seed}: invalid correct index`);
    assert(first.options[first.correctIndex]?.isCorrect === true, `${prototypeId}/${seed}: correct index is not bound to correct option`);
    assert(first.options[first.correctIndex]?.value === first.canonicalAnswer, `${prototypeId}/${seed}: answer not bound to visible option`);
    optionChecks += 1;

    const lifecycle = first.lifecycle;
    assert(lifecycle.permanentQlId === null, `${prototypeId}/${seed}: lifecycle permanent ID allocated`);
    assert(lifecycle.maturity === "EXECUTABLE_DISCOVERY_PROOF", `${prototypeId}/${seed}: wrong maturity`);
    assert(lifecycle.reviewStatus === "UNREVIEWED_DISCOVERY_CANDIDATE", `${prototypeId}/${seed}: wrong review status`);
    assert(lifecycle.questionBankStatus === "NOT_STORED", `${prototypeId}/${seed}: Question Bank status opened`);
    assert(lifecycle.testEligibility === "INELIGIBLE", `${prototypeId}/${seed}: test eligibility opened`);
    assert(lifecycle.active === false, `${prototypeId}/${seed}: active flag opened`);
    assert(lifecycle.questionStudioDiscoverable === false, `${prototypeId}/${seed}: Question Studio opened`);
    assert(lifecycle.questionBankWritable === false, `${prototypeId}/${seed}: Question Bank writes opened`);
    assert(lifecycle.testEligible === false, `${prototypeId}/${seed}: test flag opened`);
    assert(lifecycle.publiclyPublishable === false, `${prototypeId}/${seed}: public publication opened`);
    lifecycleChecks += 1;

    assert(first.explanation.steps.length >= 2, `${prototypeId}/${seed}: explanation is too thin`);
    assert(first.explanation.coreConcept.length >= 20, `${prototypeId}/${seed}: concept explanation too short`);
    assert(first.explanation.strategy.length >= 20, `${prototypeId}/${seed}: strategy explanation too short`);
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

    if (prototypeId === "NUM-CP009-PROT-001" && first.hiddenState.exponent === 0) zeroExponentCount += 1;
    if (prototypeId === "NUM-CP009-PROT-007") {
      if (Number(first.canonicalAnswer) === 0) boundedZeroCount += 1;
      else boundedPositiveCount += 1;
    }
    if (prototypeId === "NUM-CP009-PROT-008") {
      assert(/^\d{2}$/u.test(first.canonicalAnswer), `${prototypeId}/${seed}: last-two answer is not fixed width`);
      assert(first.options.every((option) => /^\d{2}$/u.test(option.value)), `${prototypeId}/${seed}: last-two option lost fixed width`);
      if (first.canonicalAnswer.startsWith("0")) leadingZeroLastTwoCount += 1;
    }
  }

  assert(answerPositions.size === 4, `${prototypeId}: all four answer positions were not reached`);
  assert(stemFamilies.size === 3, `${prototypeId}: expected three stem families`);
  assert(difficulties.size >= 2, `${prototypeId}: expected at least two difficulty bands, received ${[...difficulties].join(", ")}`);
  assert(fingerprints.size >= 70, `${prototypeId}: mathematical state pool is too thin (${fingerprints.size}/120 unique)`);
  assert(answers.size >= 2, `${prototypeId}: answer surface collapsed to one value`);

  prototypeReport[prototypeId] = {
    answerPositions: [...answerPositions].sort(),
    stemFamilies: [...stemFamilies].sort(),
    difficulties: [...difficulties].sort(),
    uniqueFingerprints: fingerprints.size,
    uniqueAnswers: answers.size,
  };
}

assert(allDifficulties.has("EASY") && allDifficulties.has("MEDIUM") && allDifficulties.has("HARD"), "Wave 01 did not reach all three difficulty bands");
assert(zeroExponentCount > 0, "Exponent-zero edge state was not exercised");
assert(boundedZeroCount > 0 && boundedPositiveCount > 0, "Bounded exponent count did not exercise zero and positive counts");
assert(leadingZeroLastTwoCount > 0, "Last-two-digit generation did not exercise a leading-zero answer");

const report = {
  status: "PASS_NUM_CP009_WAVE01_TERMINAL_CYCLICITY_FOUNDATION",
  prototypes: NUM_CP009_WAVE01_PROTOTYPE_IDS.length,
  packages: packageCount,
  replayChecks,
  verifierChecks,
  optionChecks,
  lifecycleChecks,
  zeroExponentCount,
  boundedZeroCount,
  boundedPositiveCount,
  leadingZeroLastTwoCount,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-185",
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  prototypeReport,
};

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/num-cp009-wave01");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(resolve(outputDirectory, "audit.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
