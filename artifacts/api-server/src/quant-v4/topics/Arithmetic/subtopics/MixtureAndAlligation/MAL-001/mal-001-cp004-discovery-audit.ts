import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MAL_CP004_BOUNDARY_LEDGER,
  MAL_CP004_DISCOVERY_REGISTRY,
} from "./foundation/cp004-discovery-registry";
import {
  generateMalCp004DiscoveryQuestion,
  malCp004DiscoveryStable,
  verifyMalCp004DiscoveryQuestion,
} from "./foundation/cp004-discovery-runtime";
import {
  MAL_CP004_DISCOVERY_PROTOTYPE_IDS,
  type MalCp004DiscoveryQuestion,
} from "./foundation/cp004-types";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

assert(
  MAL_CP004_DISCOVERY_PROTOTYPE_IDS.length === 7,
  "Expected seven clear CP-004 discovery prototypes.",
);
assert(
  MAL_CP004_DISCOVERY_REGISTRY.length === 7,
  "CP-004 registry count changed.",
);
assert(
  MAL_CP004_BOUNDARY_LEDGER.length === 6,
  "CP-004 boundary ledger count changed.",
);
assert(
  MAL_CP004_BOUNDARY_LEDGER.some(
    (entry) => entry.currentVerdict === "MAL-CP-003_CP004_BOUNDARY",
  ),
  "CP-003/CP-004 dilution boundary is missing.",
);
assert(
  MAL_CP004_BOUNDARY_LEDGER.some(
    (entry) => entry.currentVerdict === "MAL-CP-001_CP004_BOUNDARY",
  ),
  "CP-001/CP-004 solution-blending boundary is missing.",
);
assert(
  MAL_CP004_BOUNDARY_LEDGER.some(
    (entry) => entry.currentVerdict === "MAL-CP-004_CP006_BOUNDARY",
  ),
  "CP-004/CP-006 vessel-equilibrium boundary is missing.",
);

const seedsPerPrototype = 200;
let generatedCount = 0;
let deterministicCount = 0;
let independentVerificationCount = 0;
const answerPositionCounts = [0, 0, 0, 0];
const fingerprints = new Set<string>();
const stems = new Set<string>();
const answers = new Set<string>();
const reviewRows: MalCp004DiscoveryQuestion[] = [];
const diversityByPrototype = new Map<string, Set<string>>();
const misconceptionCounts = new Map<string, number>();

for (const prototypeId of MAL_CP004_DISCOVERY_PROTOTYPE_IDS) {
  const prototypeFingerprints = new Set<string>();
  diversityByPrototype.set(prototypeId, prototypeFingerprints);

  for (let index = 0; index < seedsPerPrototype; index += 1) {
    const seed = `cp004-discovery:${prototypeId}:${index}`;
    const first = generateMalCp004DiscoveryQuestion(prototypeId, seed);
    const second = generateMalCp004DiscoveryQuestion(prototypeId, seed);

    assert(
      malCp004DiscoveryStable(first) === malCp004DiscoveryStable(second),
      `${prototypeId}/${seed}: generation is not deterministic.`,
    );
    deterministicCount += 1;

    assert(
      first.validation.ok,
      `${prototypeId}/${seed}: ${first.validation.errors.join("; ")}`,
    );
    const independent = verifyMalCp004DiscoveryQuestion(first);
    assert(
      independent.ok,
      `${prototypeId}/${seed}: ${independent.errors.join("; ")}`,
    );
    independentVerificationCount += 1;

    assert(first.archetypeId === "MAL-001", "Wrong archetype identity.");
    assert(first.canonicalProblemId === "MAL-CP-004", "Wrong CP identity.");
    assert(first.permanentQlId === null, "Permanent QL leaked into discovery.");
    assert(first.language === "en", "Non-English output escaped.");
    assert(first.maturity === "DISCOVERY_PROTOTYPE", "Discovery maturity changed.");
    assert(
      first.allocationStatus === "UNALLOCATED_OPEN_DISCOVERY",
      "Discovery allocation status changed.",
    );
    assert(
      !first.active &&
        !first.publiclyPublishable &&
        !first.questionStudioDiscoverable &&
        !first.questionBankWritable &&
        !first.testEligible,
      "A CP-004 discovery delivery flag became enabled.",
    );
    assert(
      first.sourceEvidenceStatus ===
        "LEGACY_RUNTIME_RECOVERED_PENDING_DIRECT_SOURCE_NORMALIZATION",
      "CP-004 source maturity was overstated.",
    );
    assert(first.sourceEvidenceIds.length >= 3, "Source trace is incomplete.");
    assert(first.stem.endsWith("?"), "Stem is not interrogative.");
    assert(first.options.length === 4, "Question does not have four options.");
    assert(new Set(first.options).size === 4, "Options are not unique.");
    assert(
      first.options[first.correctIndex] === first.answer,
      "Correct option does not match the answer.",
    );
    assert(
      first.optionAudit.filter((option) => option.isCorrect).length === 1,
      "Option audit does not have exactly one correct option.",
    );
    assert(
      new Set(first.optionAudit.map((option) => option.misconceptionId)).size === 4,
      "Distractor authorities are not distinct.",
    );
    assert(first.ledger.rows.length >= 1, "Conservation ledger is empty.");
    assert(
      first.explanation.calculation.length >= 2,
      "Explanation calculation is too shallow.",
    );
    assert(
      first.explanation.conclusion.includes(first.answer),
      "Conclusion omits the canonical answer.",
    );
    assert(
      !/alligation|stage strip|competitive-exam/iu.test(
        JSON.stringify({
          stem: first.stem,
          explanation: first.explanation,
          ledger: first.ledger,
        }),
      ),
      "CP-004 learner output contains unrelated or artificial language.",
    );

    for (const option of first.optionAudit) {
      misconceptionCounts.set(
        option.misconceptionId,
        (misconceptionCounts.get(option.misconceptionId) ?? 0) + 1,
      );
    }

    prototypeFingerprints.add(first.mathematicalFingerprint);
    fingerprints.add(first.mathematicalFingerprint);
    stems.add(first.stem);
    answers.add(first.answer);
    answerPositionCounts[first.correctIndex] += 1;
    generatedCount += 1;
    if (index < 5) reviewRows.push(first);
  }
}

assert(generatedCount === 1400, `Expected 1,400 packages, received ${generatedCount}.`);
assert(deterministicCount === 1400, "Determinism count does not match.");
assert(
  independentVerificationCount === 1400,
  "Independent verification count does not match.",
);
assert(reviewRows.length === 35, "Expected 35 review rows.");
assert(
  [...diversityByPrototype.values()].every((set) => set.size >= 7),
  `A prototype has insufficient exact-state diversity: ${JSON.stringify(
    Object.fromEntries(
      [...diversityByPrototype].map(([key, set]) => [key, set.size]),
    ),
  )}`,
);
assert(
  fingerprints.size >= 50,
  `Chapter-wide exact-state diversity is too low: ${fingerprints.size}.`,
);
assert(stems.size >= 50, `Stem diversity is too low: ${stems.size}.`);
assert(answers.size >= 20, `Answer diversity is too low: ${answers.size}.`);
assert(
  answerPositionCounts.every((count) => count >= 250),
  `Answer positions are imbalanced: ${answerPositionCounts.join(", ")}.`,
);
assert(
  !misconceptionCounts.has("ARITHMETIC_SLIP") &&
    !misconceptionCounts.has("PLAUSIBLE"),
  "Generic distractor authority entered CP-004.",
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp004-wave01-review.json");
const markdownPath = resolve(outputDirectory, "mal-cp004-wave01-review.md");

writeFileSync(
  jsonPath,
  `${JSON.stringify(
    {
      status: "PASS_MAL_CP004_WAVE01_OPEN_EXECUTABLE_DISCOVERY",
      permanentQlCount: 0,
      frozenSolveModeCount: 0,
      questionStudioDiscoverable: false,
      generatedCount,
      deterministicCount,
      independentVerificationCount,
      distinctMathematicalFingerprintCount: fingerprints.size,
      distinctStemCount: stems.size,
      distinctAnswerCount: answers.size,
      answerPositionCounts,
      boundaryLedger: MAL_CP004_BOUNDARY_LEDGER,
      reviewRows,
    },
    (_key, value) => (typeof value === "bigint" ? value.toString() : value),
    2,
  )}\n`,
  "utf8",
);

const markdown: string[] = [
  "# MAL-CP-004 Wave 01 — Open Executable Discovery Review",
  "",
  "> These are source-recovered executable prototypes. They are not permanent QLs and are not available in Question Studio, the Question Bank or tests.",
  "",
  `Generated packages: **${generatedCount}**`,
  `Review rows: **${reviewRows.length}**`,
  "Permanent QLs: **0**",
  "",
];

for (const question of reviewRows) {
  markdown.push(
    `## ${question.prototypeId} — ${question.seed}`,
    "",
    question.stem,
    "",
    ...question.options.map(
      (option, index) =>
        `${String.fromCharCode(65 + index)}. ${option}${
          index === question.correctIndex ? " **✓**" : ""
        }`,
    ),
    "",
    `**Answer:** ${question.answer}`,
    "",
    `**Concept:** ${question.explanation.concept}`,
    "",
    ...question.explanation.calculation.map((step) => `- ${step}`),
    "",
    `**Check:** ${question.explanation.verification}`,
    "",
    `**Common mistake:** ${question.explanation.commonMistake}`,
    "",
    "---",
    "",
  );
}

writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP004_WAVE01_OPEN_EXECUTABLE_DISCOVERY",
      canonicalProblemId: "MAL-CP-004",
      executablePrototypeCount: MAL_CP004_DISCOVERY_PROTOTYPE_IDS.length,
      boundaryCount: MAL_CP004_BOUNDARY_LEDGER.length,
      permanentQlCount: 0,
      generatedCount,
      deterministicCount,
      independentVerificationCount,
      distinctMathematicalFingerprintCount: fingerprints.size,
      distinctStemCount: stems.size,
      distinctAnswerCount: answers.size,
      answerPositionCounts,
      reviewRowCount: reviewRows.length,
    },
    null,
    2,
  ),
);
