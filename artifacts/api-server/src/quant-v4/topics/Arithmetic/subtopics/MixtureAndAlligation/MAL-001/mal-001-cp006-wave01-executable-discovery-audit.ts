import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  addRational,
  divideRational,
  equalsRational,
  multiplyRational,
  rational,
  reduceRationalRatio,
  subtractRational,
} from "./foundation/rational";
import type { Rational } from "./foundation/types";
import {
  getMalCp006Vessel,
  malCp006ComponentB,
  malCp006ConcentrationPercent,
  solveMalCp006EqualExchangeAmount,
  solveMalCp006Ledger,
  verifyMalCp006EqualExchange,
} from "./foundation/cp006-solver";
import {
  generateMalCp006Wave01Question,
  malCp006Wave01Stable,
} from "./foundation/cp006-discovery-runtime-wave01";
import {
  MAL_CP006_WAVE01_DIRECT_SOURCE_IDS,
  MAL_CP006_WAVE01_SOURCE_FIXTURES,
} from "./foundation/cp006-source-fixtures-wave01";
import {
  MAL_CP006_WAVE01_PROTOTYPE_IDS,
  MAL_CP006_WAVE01_RUNTIME_ID,
  type MalCp006Operation,
  type MalCp006VesselState,
} from "./foundation/cp006-types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function ratioKey(first: Rational, second: Rational): string {
  const [a, b] = reduceRationalRatio(first, second);
  return `${a.numerator}:${b.numerator}`;
}

function manualLedger(
  initial: readonly MalCp006VesselState[],
  operations: readonly MalCp006Operation[],
): MalCp006VesselState[] {
  const states = new Map(
    initial.map((vessel) => [
      vessel.id,
      {
        id: vessel.id,
        volume: rational(vessel.volume.numerator, vessel.volume.denominator),
        componentA: rational(
          vessel.componentA.numerator,
          vessel.componentA.denominator,
        ),
      },
    ]),
  );

  const get = (id: string) => {
    const value = states.get(id);
    if (!value) throw new Error(`manual verifier missing vessel ${id}`);
    return value;
  };

  for (const operation of operations) {
    if (operation.kind === "TRANSFER") {
      const source = get(operation.from);
      const destination = get(operation.to);
      const fraction = divideRational(source.componentA, source.volume);
      const movedA = multiplyRational(operation.amount, fraction);
      source.volume = subtractRational(source.volume, operation.amount);
      source.componentA = subtractRational(source.componentA, movedA);
      destination.volume = addRational(destination.volume, operation.amount);
      destination.componentA = addRational(destination.componentA, movedA);
    } else if (operation.kind === "REFILL") {
      const target = get(operation.vessel);
      target.volume = addRational(target.volume, operation.amount);
      target.componentA = addRational(
        target.componentA,
        multiplyRational(operation.amount, operation.componentAFraction),
      );
    } else {
      const a = get(operation.vesselA);
      const b = get(operation.vesselB);
      const aFraction = divideRational(a.componentA, a.volume);
      const bFraction = divideRational(b.componentA, b.volume);
      const fromA = multiplyRational(operation.amount, aFraction);
      const fromB = multiplyRational(operation.amount, bFraction);
      a.componentA = addRational(
        subtractRational(a.componentA, fromA),
        fromB,
      );
      b.componentA = addRational(
        subtractRational(b.componentA, fromB),
        fromA,
      );
    }
  }
  return [...states.values()].sort((a, b) => a.id.localeCompare(b.id));
}

function assertLedgerAgreement(
  initial: readonly MalCp006VesselState[],
  operations: readonly MalCp006Operation[],
): void {
  const canonical = solveMalCp006Ledger(initial, operations).finalVessels;
  const independent = manualLedger(initial, operations);
  assert(canonical.length === independent.length, "Ledger vessel count mismatch.");
  for (let index = 0; index < canonical.length; index += 1) {
    const left = canonical[index]!;
    const right = independent[index]!;
    assert(left.id === right.id, "Ledger vessel identity mismatch.");
    assert(
      equalsRational(left.volume, right.volume),
      `${left.id}: independent volume verifier disagreed.`,
    );
    assert(
      equalsRational(left.componentA, right.componentA),
      `${left.id}: independent component verifier disagreed.`,
    );
  }
}

function assertSnapshotConservation(
  initial: readonly MalCp006VesselState[],
  operations: readonly MalCp006Operation[],
): void {
  const ledger = solveMalCp006Ledger(initial, operations);
  assert(
    ledger.snapshots.length === operations.length + 1,
    "Ledger snapshot count is incomplete.",
  );
  for (let index = 0; index < operations.length; index += 1) {
    const before = ledger.snapshots[index]!;
    const after = ledger.snapshots[index + 1]!;
    const operation = operations[index]!;
    if (operation.kind === "REFILL") {
      assert(
        equalsRational(
          after.globalVolume,
          addRational(before.globalVolume, operation.amount),
        ),
        "Refill did not reconcile global volume.",
      );
      assert(
        equalsRational(
          after.globalComponentA,
          addRational(
            before.globalComponentA,
            multiplyRational(
              operation.amount,
              operation.componentAFraction,
            ),
          ),
        ),
        "Refill did not reconcile global component load.",
      );
    } else {
      assert(
        equalsRational(after.globalVolume, before.globalVolume),
        `${operation.kind}: cross-vessel operation changed global volume.`,
      );
      assert(
        equalsRational(after.globalComponentA, before.globalComponentA),
        `${operation.kind}: cross-vessel operation changed global component load.`,
      );
    }
  }
}

function sourceWitnesses(): Record<string, string> {
  const cat2019 = solveMalCp006Ledger(
    [
      { id: "A", volume: rational(500), componentA: rational(50) },
      { id: "B", volume: rational(500), componentA: rational(110) },
      { id: "C", volume: rational(500), componentA: rational(160) },
    ],
    [
      { kind: "TRANSFER", from: "A", to: "B", amount: rational(100) },
      { kind: "TRANSFER", from: "B", to: "C", amount: rational(100) },
      { kind: "TRANSFER", from: "C", to: "A", amount: rational(100) },
    ],
  );
  assert(
    equalsRational(
      malCp006ConcentrationPercent(getMalCp006Vessel(cat2019, "A")),
      rational(14),
    ),
    "CAT 2019 source witness must end at 14%.",
  );

  const cat2022 = solveMalCp006Ledger(
    [
      { id: "A", volume: rational(50), componentA: rational(50) },
      { id: "B", volume: rational(50), componentA: rational(0) },
    ],
    [
      { kind: "TRANSFER", from: "A", to: "B", amount: rational(25) },
      { kind: "TRANSFER", from: "B", to: "A", amount: rational(75, 2) },
      { kind: "TRANSFER", from: "A", to: "B", amount: rational(125, 4) },
    ],
  );
  const cat2022B = getMalCp006Vessel(cat2022, "B");
  assert(
    ratioKey(cat2022B.componentA, malCp006ComponentB(cat2022B)) === "5:6",
    "CAT 2022 source witness must end at 5:6.",
  );

  const ssc = solveMalCp006Ledger(
    [
      { id: "A", volume: rational(80), componentA: rational(35) },
      { id: "B", volume: rational(0), componentA: rational(0) },
    ],
    [
      { kind: "TRANSFER", from: "A", to: "B", amount: rational(20) },
      {
        kind: "REFILL",
        vessel: "A",
        amount: rational(20),
        componentAFraction: rational(0),
      },
      { kind: "TRANSFER", from: "A", to: "B", amount: rational(32) },
    ],
  );
  const sscB = getMalCp006Vessel(ssc, "B");
  assert(
    ratioKey(malCp006ComponentB(sscB), sscB.componentA) === "131:77",
    "SSC CGL source witness must end at 131:77.",
  );

  const equalExchange = solveMalCp006EqualExchangeAmount(
    rational(12),
    rational(18),
    rational(1),
    rational(0),
  );
  assert(
    equalsRational(equalExchange, rational(36, 5)),
    "12 L / 18 L equal-exchange witness must be 7.2 L.",
  );
  assert(
    verifyMalCp006EqualExchange(
      rational(12),
      rational(18),
      rational(3, 4),
      rational(1, 5),
      equalExchange,
    ),
    "Equal-exchange witness must equalise arbitrary different concentrations.",
  );

  const rum = solveMalCp006Ledger(
    [
      { id: "A", volume: rational(40), componentA: rational(25) },
      { id: "B", volume: rational(40), componentA: rational(32) },
    ],
    [
      { kind: "TRANSFER", from: "B", to: "A", amount: rational(10) },
      { kind: "TRANSFER", from: "A", to: "B", amount: rational(25, 2) },
    ],
  );
  const rumB = getMalCp006Vessel(rum, "B");
  assert(
    ratioKey(rumB.componentA, malCp006ComponentB(rumB)) === "129:41",
    "Testbook two-mixture witness must end at 129:41.",
  );

  const prepp = solveMalCp006Ledger(
    [
      { id: "A", volume: rational(55), componentA: rational(55) },
      { id: "B", volume: rational(35), componentA: rational(0) },
    ],
    [
      { kind: "TRANSFER", from: "A", to: "B", amount: rational(5) },
      { kind: "TRANSFER", from: "B", to: "A", amount: rational(10) },
    ],
  );
  const preppA = getMalCp006Vessel(prepp, "A");
  const preppB = getMalCp006Vessel(prepp, "B");
  assert(
    ratioKey(preppA.componentA, malCp006ComponentB(preppB)) === "41:21",
    "Prepp source witness must end at 41:21.",
  );

  return {
    cat2019: "14%",
    cat2022: "5:6",
    sscCgl2023: "131:77",
    equalExchange12x18: "36/5 litres",
    testbookTwoMixture: "129:41",
    preppPureCrossVessel: "41:21",
  };
}

assert(
  MAL_CP006_WAVE01_PROTOTYPE_IDS.length === 6,
  "Wave 01 prototype count changed.",
);
assert(
  MAL_CP006_WAVE01_DIRECT_SOURCE_IDS.length === 6,
  "Expected six direct source fixtures.",
);
assert(
  MAL_CP006_WAVE01_SOURCE_FIXTURES.some(
    (fixture) => fixture.disposition === "LEGACY_NOT_DIRECT_EVIDENCE",
  ),
  "Legacy V2 non-evidence finding is missing.",
);
for (const disposition of [
  "CP001_BOUNDARY",
  "CP003_BOUNDARY",
  "CP004_BOUNDARY",
] as const) {
  assert(
    MAL_CP006_WAVE01_SOURCE_FIXTURES.some(
      (fixture) => fixture.disposition === disposition,
    ),
    `Missing ${disposition} negative control.`,
  );
}

const sourceById = new Map(
  MAL_CP006_WAVE01_SOURCE_FIXTURES.map((fixture) => [
    fixture.sourceId,
    fixture,
  ]),
);
for (const prototypeId of MAL_CP006_WAVE01_PROTOTYPE_IDS) {
  assert(
    MAL_CP006_WAVE01_SOURCE_FIXTURES.some(
      (fixture) =>
        fixture.disposition === "CP006_DIRECT" &&
        fixture.supportedPrototypeIds.includes(prototypeId),
    ),
    `${prototypeId}: no direct source fixture.`,
  );
}

const seedsPerPrototype = 100;
let generatedCount = 0;
let deterministicCount = 0;
let independentLedgerCount = 0;
let conservationCount = 0;
let lifecycleLockCount = 0;
let optionIntegrityCount = 0;
let sourceCoverageCount = 0;
const answerPositions = [0, 0, 0, 0];
const reviewQuestions: ReturnType<typeof generateMalCp006Wave01Question>[] = [];
const prototypeEvidence: Array<{
  prototypeId: string;
  distinctStates: number;
  distinctSiblingStates: number;
  distinctStems: number;
  distinctAnswers: number;
  difficulty: string;
}> = [];

for (const prototypeId of MAL_CP006_WAVE01_PROTOTYPE_IDS) {
  const states = new Set<string>();
  const siblingStates = new Set<string>();
  const stems = new Set<string>();
  const answers = new Set<string>();

  for (let index = 0; index < seedsPerPrototype; index += 1) {
    const seed = `mal-cp006-wave01:${prototypeId}:${index}`;
    const first = generateMalCp006Wave01Question(prototypeId, seed);
    const second = generateMalCp006Wave01Question(prototypeId, seed);

    assert(
      malCp006Wave01Stable(first) === malCp006Wave01Stable(second),
      `${seed}: generation is not deterministic.`,
    );
    deterministicCount += 1;

    assert(first.runtimeId === MAL_CP006_WAVE01_RUNTIME_ID, `${seed}: runtime ID changed.`);
    assert(first.prototypeId === prototypeId, `${seed}: prototype route changed.`);
    assert(first.permanentQlId === null, `${seed}: permanent QL was allocated during discovery.`);
    assert(first.permanentSolveModeId === null, `${seed}: permanent solve mode was allocated during discovery.`);
    assert(first.maturity === "DISCOVERY_PROTOTYPE", `${seed}: maturity changed.`);
    assert(first.allocationStatus === "UNALLOCATED_OPEN_DISCOVERY", `${seed}: allocation status changed.`);
    assert(first.runtimeMode === "REVIEW_ONLY", `${seed}: runtime mode changed.`);
    assert(
      !first.active &&
        !first.publiclyPublishable &&
        !first.questionStudioDiscoverable &&
        !first.questionBankWritable &&
        !first.testEligible,
      `${seed}: a delivery surface became active.`,
    );
    lifecycleLockCount += 1;

    assert(first.validation.ok, `${seed}: ${first.validation.errors.join(" | ")}`);
    assert(first.options.length === 4, `${seed}: option count changed.`);
    assert(new Set(first.options).size === 4, `${seed}: duplicate options.`);
    assert(first.options[first.correctIndex] === first.answer, `${seed}: answer/index mismatch.`);
    assert(
      first.optionAudit.filter((entry) => entry.isCorrect).length === 1,
      `${seed}: option audit does not own exactly one correct answer.`,
    );
    assert(first.stem.endsWith("?"), `${seed}: stem is not interrogative.`);
    optionIntegrityCount += 1;

    assert(
      first.exactState.operations.some(
        (operation) =>
          operation.kind === "SIMULTANEOUS_EQUAL_EXCHANGE" ||
          (operation.kind === "TRANSFER" && operation.from !== operation.to),
      ),
      `${seed}: CP-006 question lacks cross-vessel movement.`,
    );
    assertLedgerAgreement(
      first.exactState.initialVessels,
      first.exactState.operations,
    );
    independentLedgerCount += 1;
    assertSnapshotConservation(
      first.exactState.initialVessels,
      first.exactState.operations,
    );
    conservationCount += 1;

    assert(first.sourceEvidenceIds.length > 0, `${seed}: source evidence missing.`);
    for (const sourceId of first.sourceEvidenceIds) {
      const fixture = sourceById.get(sourceId);
      assert(fixture, `${seed}: unknown source fixture ${sourceId}.`);
      assert(fixture.disposition === "CP006_DIRECT", `${seed}: non-direct fixture used as positive authority.`);
    }
    sourceCoverageCount += 1;

    states.add(first.stateKey);
    siblingStates.add(first.siblingStateKey);
    stems.add(first.stem);
    answers.add(first.answer);
    answerPositions[first.correctIndex] += 1;
    generatedCount += 1;

    if (index < 5) reviewQuestions.push(first);
  }

  assert(states.size >= 40, `${prototypeId}: exact-state diversity too low (${states.size}).`);
  assert(siblingStates.size >= 6, `${prototypeId}: sibling-state diversity too low (${siblingStates.size}).`);
  assert(stems.size >= 20, `${prototypeId}: stem diversity too low (${stems.size}).`);
  assert(answers.size >= 3, `${prototypeId}: answer diversity too low (${answers.size}).`);
  const sample = generateMalCp006Wave01Question(
    prototypeId,
    `mal-cp006-wave01:${prototypeId}:difficulty`,
  );
  prototypeEvidence.push({
    prototypeId,
    distinctStates: states.size,
    distinctSiblingStates: siblingStates.size,
    distinctStems: stems.size,
    distinctAnswers: answers.size,
    difficulty: sample.difficulty,
  });
}

assert(generatedCount === 600, `Expected 600 questions, received ${generatedCount}.`);
assert(deterministicCount === generatedCount, "Determinism coverage incomplete.");
assert(independentLedgerCount === generatedCount, "Independent ledger coverage incomplete.");
assert(conservationCount === generatedCount, "Conservation coverage incomplete.");
assert(lifecycleLockCount === generatedCount, "Lifecycle-lock coverage incomplete.");
assert(optionIntegrityCount === generatedCount, "Option-integrity coverage incomplete.");
assert(sourceCoverageCount === generatedCount, "Source coverage incomplete.");
assert(answerPositions.every((count) => count >= 90), `Answer positions too imbalanced: ${answerPositions.join("/")}.`);
assert(reviewQuestions.length === 30, "Expected 30 review questions.");

const witnesses = sourceWitnesses();

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(
  outputDirectory,
  "mal-cp006-wave01-executable-discovery.json",
);
const markdownPath = resolve(
  outputDirectory,
  "MAL-CP-006-WAVE-01-EXECUTABLE-DISCOVERY-30Q-REVIEW.md",
);

const result = {
  status: "PASS_MAL_CP006_WAVE01_EXECUTABLE_DISCOVERY",
  runtimeId: MAL_CP006_WAVE01_RUNTIME_ID,
  permanentQlCount: 0,
  permanentSolveModeCount: 0,
  prototypeCount: MAL_CP006_WAVE01_PROTOTYPE_IDS.length,
  directSourceFixtureCount: MAL_CP006_WAVE01_DIRECT_SOURCE_IDS.length,
  boundaryFixtureCount: MAL_CP006_WAVE01_SOURCE_FIXTURES.filter(
    (fixture) =>
      fixture.disposition === "CP001_BOUNDARY" ||
      fixture.disposition === "CP003_BOUNDARY" ||
      fixture.disposition === "CP004_BOUNDARY",
  ).length,
  legacyDirectEvidenceAccepted: false,
  generatedCount,
  deterministicCount,
  independentLedgerCount,
  conservationCount,
  lifecycleLockCount,
  optionIntegrityCount,
  sourceCoverageCount,
  answerPositions,
  reviewQuestionCount: reviewQuestions.length,
  prototypeEvidence,
  sourceWitnesses: witnesses,
  lifecycle: {
    active: false,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
  },
};

writeFileSync(jsonPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");

const letters = ["A", "B", "C", "D"];
const reviewMarkdown = [
  "# MAL-CP-006 Wave 01 — Executable Discovery 30Q Review",
  "",
  "> Discovery-only English review. No permanent QLs, Question Studio route, Question Bank write, test eligibility or public publication is authorized.",
  "",
  `Runtime: \`${MAL_CP006_WAVE01_RUNTIME_ID}\``,
  "",
  ...reviewQuestions.flatMap((question, index) => [
    `## ${index + 1}. ${question.prototypeId} — ${question.difficulty}`,
    "",
    question.stem,
    "",
    ...question.options.map(
      (option, optionIndex) => `${letters[optionIndex]}. ${option}`,
    ),
    "",
    "<details>",
    "<summary>Answer and solution</summary>",
    "",
    `**Answer:** ${letters[question.correctIndex]}. ${question.answer}`,
    "",
    ...question.explanation.visibleLines.map(
      (line, lineIndex) => `${lineIndex + 1}. ${line}`,
    ),
    "",
    `**Common mistake:** ${question.explanation.optionalHelp.commonMistake}`,
    "",
    ...question.explanation.optionalHelp.verification.map(
      (line) => `**Verification:** ${line}`,
    ),
    "",
    `State key: \`${question.stateKey}\``,
    "",
    "</details>",
    "",
  ]),
].join("\n");

writeFileSync(markdownPath, `${reviewMarkdown}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
