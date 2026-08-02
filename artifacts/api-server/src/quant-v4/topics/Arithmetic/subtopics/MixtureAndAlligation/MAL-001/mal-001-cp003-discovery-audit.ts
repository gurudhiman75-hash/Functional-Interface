import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { runMalCp001EnglishReleasePipeline } from "./foundation/cp001-release";
import { runMalCp002EnglishEditorialV2Pipeline } from "./foundation/cp002-editorial-v2";
import {
  MAL_CP003_DISCOVERY_REGISTRY,
  MAL_CP003_EXECUTABLE_PROTOTYPE_IDS,
} from "./foundation/cp003-discovery-registry";
import {
  cp003Stable,
  runMalCp003DiscoveryPipeline,
} from "./foundation/cp003-discovery-pipeline";
import { verifyMalCp003Result } from "./foundation/cp003-independent-verifier";
import { malCp003RequestFingerprint } from "./foundation/cp003-parameter-generator";
import type {
  MalCp003ExecutablePrototypeId,
  MalCp003GeneratedPrototype,
} from "./foundation/cp003-types";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

assert(
  MAL_CP003_DISCOVERY_REGISTRY.length === 9,
  "Expected nine current CP-003 discovery candidates including one boundary.",
);
assert(
  MAL_CP003_EXECUTABLE_PROTOTYPE_IDS.length === 8,
  "Expected eight executable CP-003 discovery prototypes.",
);
const boundaryEntries = MAL_CP003_DISCOVERY_REGISTRY.filter(
  (entry) =>
    entry.discoveryStatus ===
    "SOURCE_RECOVERED_BOUNDARY_PENDING_EXECUTION",
);
assert(boundaryEntries.length === 1, "Expected one CP-003/CP-004 pending boundary.");
assert(
  boundaryEntries[0]!.currentOwnerVerdict === "MAL-CP-003_CP004_BOUNDARY",
  "Successive-dilution ownership boundary was lost.",
);

const seedsPerPrototype = 200;
let generatedCount = 0;
let deterministicCount = 0;
let independentVerificationCount = 0;
const fingerprints = new Set<string>();
const stems = new Set<string>();
const answers = new Set<string>();
const answerPositionCounts = [0, 0, 0, 0];
const diversityByPrototype = new Map<MalCp003ExecutablePrototypeId, Set<string>>();
const reviewRows: MalCp003GeneratedPrototype[] = [];

for (const prototypeId of MAL_CP003_EXECUTABLE_PROTOTYPE_IDS) {
  const prototypeFingerprints = new Set<string>();
  diversityByPrototype.set(prototypeId, prototypeFingerprints);

  for (let index = 0; index < seedsPerPrototype; index += 1) {
    const seed = `cp003-discovery-${prototypeId}-${index}`;
    const first = runMalCp003DiscoveryPipeline(prototypeId, seed);
    const second = runMalCp003DiscoveryPipeline(prototypeId, seed);

    assert(
      cp003Stable(first) === cp003Stable(second),
      `${prototypeId}/${seed}: generation is not deterministic.`,
    );
    deterministicCount += 1;
    assert(
      first.validation.ok,
      `${prototypeId}/${seed}: ${first.validation.errors.join("; ")}`,
    );
    const verification = verifyMalCp003Result(first.request, first.solution);
    assert(
      verification.ok,
      `${prototypeId}/${seed}: independent verifier failed: ${verification.errors.join(
        "; ",
      )}`,
    );
    independentVerificationCount += 1;

    assert(first.canonicalProblemId === "MAL-CP-003", "Wrong CP identity.");
    assert(first.archetypeId === "MAL-001", "Wrong package identity.");
    assert(first.permanentQlId === null, "Permanent QL leaked into open discovery.");
    assert(first.maturity === "DISCOVERY_PROTOTYPE", "Prototype maturity changed.");
    assert(!first.active, "Discovery prototype became active.");
    assert(!first.publiclyPublishable, "Discovery prototype became publishable.");
    assert(
      !first.questionStudioDiscoverable,
      "Discovery prototype leaked into Question Studio.",
    );
    assert(!first.questionBankWritable, "Discovery prototype became writable.");
    assert(!first.testEligible, "Discovery prototype became test eligible.");
    assert(first.language === "en", "Non-English discovery output escaped.");
    assert(first.stem.endsWith("?"), "Stem is not interrogative.");
    assert(first.options.length === 4, "Prototype does not have four options.");
    assert(new Set(first.options).size === 4, "Prototype options are not unique.");
    assert(
      first.options[first.correctIndex] === first.answer,
      "Correct option does not match canonical answer.",
    );
    assert(first.explanation.steps.length >= 4, "Explanation is too shallow.");
    assert(
      !/alligation/iu.test(cp003Stable(first.explanation)),
      "CP-003 explanation contains alligation.",
    );
    assert(
      first.diagram.type === "REPLACEMENT_STAGE_STRIP",
      "Replacement stage-strip diagram is missing.",
    );
    assert(first.diagram.stages.length >= 2, "Stage strip is incomplete.");
    assert(
      first.reasoningGraph.nodes.at(-1)?.kind === "CONCLUSION",
      "Reasoning graph does not end with a conclusion.",
    );
    assert(
      first.explanation.conclusion.includes(first.answer),
      "Conclusion omits the canonical answer.",
    );

    const requestFingerprint = malCp003RequestFingerprint(first.request);
    prototypeFingerprints.add(requestFingerprint);
    fingerprints.add(first.mathematicalFingerprint);
    stems.add(first.stem);
    answers.add(first.answer);
    answerPositionCounts[first.correctIndex] += 1;
    generatedCount += 1;
    if (index < 4) reviewRows.push(first);
  }
}

assert(generatedCount === 1600, "Expected 1,600 CP-003 discovery packages.");
assert(reviewRows.length === 32, "Expected 32 discovery review rows.");
assert(
  [...diversityByPrototype.values()].every((set) => set.size >= 12),
  `A prototype has insufficient request diversity: ${JSON.stringify(
    Object.fromEntries(
      [...diversityByPrototype].map(([key, set]) => [key, set.size]),
    ),
  )}`,
);
assert(
  fingerprints.size >= 650,
  `Chapter-wide mathematical diversity is too low: ${fingerprints.size}.`,
);
assert(stems.size >= 650, `Stem diversity is too low: ${stems.size}.`);
assert(answers.size >= 120, `Answer diversity is too low: ${answers.size}.`);
assert(
  answerPositionCounts.every((count) => count >= 300),
  `Answer positions are imbalanced: ${answerPositionCounts.join(", ")}.`,
);

const cp001Regression = runMalCp001EnglishReleasePipeline({
  questionLanguageId: "MAL-QL-001",
  seed: "cp003-discovery-cp001-regression",
  language: "en",
});
assert(cp001Regression.validation.ok, "CP-001 release regression failed.");

const cp002Regression = runMalCp002EnglishEditorialV2Pipeline({
  questionLanguageId: "MAL-QL-012",
  seed: "cp003-discovery-cp002-regression",
  language: "en",
});
assert(cp002Regression.validation.ok, "CP-002 editorial V2 regression failed.");
assert(
  String((cp002Regression.parameters as Record<string, unknown>).editorialVersion) ===
    "MAL-CP002-EN-EDITORIAL-V2",
  "CP-002 editorial authority regressed.",
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(
  outputDirectory,
  "mal-cp003-open-discovery-review.json",
);
const markdownPath = resolve(
  outputDirectory,
  "mal-cp003-open-discovery-review.md",
);
writeFileSync(
  jsonPath,
  `${JSON.stringify(
    {
      status: "MAL_CP003_OPEN_DISCOVERY_REVIEW",
      permanentQlCount: 0,
      frozenSolveModeCount: 0,
      questionStudioDiscoverable: false,
      reviewRows,
    },
    (_key, value) => (typeof value === "bigint" ? value.toString() : value),
    2,
  )}\n`,
  "utf8",
);

const markdown: string[] = [
  "# MAL-CP-003 Open Discovery Review",
  "",
  "> These are executable discovery prototypes, not approved QLs. Counts remain open until the complete source, inverse, ownership, merge/split and gap audits pass.",
  "",
  `Executable prototypes: **${MAL_CP003_EXECUTABLE_PROTOTYPE_IDS.length}**`,
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
    `**Core concept:** ${question.explanation.coreConcept}`,
    "",
    `**Formula:** ${question.explanation.formula}`,
    "",
    ...question.explanation.steps,
    "",
    `**Verification:** ${question.explanation.verification}`,
    "",
    `**Shortcut:** ${question.explanation.examShortcut}`,
    "",
    `**Common trap:** ${question.explanation.commonTrap}`,
    "",
    "---",
    "",
  );
}
writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP003_OPEN_EXECUTABLE_DISCOVERY",
      canonicalProblemId: "MAL-CP-003",
      currentDiscoveryCandidateCount: MAL_CP003_DISCOVERY_REGISTRY.length,
      executablePrototypeCount: MAL_CP003_EXECUTABLE_PROTOTYPE_IDS.length,
      pendingBoundaryCount: boundaryEntries.length,
      permanentQlCount: 0,
      frozenSolveModeCount: 0,
      generatedCount,
      deterministicCount,
      independentVerificationCount,
      distinctMathematicalFingerprintCount: fingerprints.size,
      distinctStemCount: stems.size,
      distinctAnswerCount: answers.size,
      answerPositionCounts,
      diversityByPrototype: Object.fromEntries(
        [...diversityByPrototype].map(([key, set]) => [key, set.size]),
      ),
      reviewQuestionCount: reviewRows.length,
      cp001Regression: true,
      cp002EditorialV2Regression: true,
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      reviewJson: jsonPath,
      reviewMarkdown: markdownPath,
    },
    null,
    2,
  ),
);
