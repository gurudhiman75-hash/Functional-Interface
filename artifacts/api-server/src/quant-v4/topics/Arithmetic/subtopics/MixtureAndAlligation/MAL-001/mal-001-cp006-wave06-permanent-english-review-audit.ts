import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MAL_CP006_ENGLISH_REVIEW_CANDIDATE,
  MAL_CP006_PERMANENT_REVIEW_RUNTIME_ID,
  MAL_CP006_REVIEW_ALLOCATION,
  generateMalCp006PermanentReviewQuestion,
  malCp006PermanentReviewStable,
  type MalCp006PermanentReviewQuestion,
} from "./foundation/cp006-permanent-review-runtime-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const expectedQls = [
  "MAL-QL-061",
  "MAL-QL-062",
  "MAL-QL-063",
  "MAL-QL-064",
  "MAL-QL-065",
  "MAL-QL-066",
  "MAL-QL-067",
];
assert(
  MAL_CP006_REVIEW_ALLOCATION.map((entry) => entry.qlId).join("|") === expectedQls.join("|"),
  "CP006 review allocation is not exactly MAL-QL-061..067.",
);
assert(MAL_CP006_ENGLISH_REVIEW_CANDIDATE.qlCount === 7, "CP006 review QL count changed.");
assert(!MAL_CP006_ENGLISH_REVIEW_CANDIDATE.active, "CP006 review candidate became active.");
assert(!MAL_CP006_ENGLISH_REVIEW_CANDIDATE.questionStudioDiscoverable, "CP006 review candidate entered Question Studio.");
assert(!MAL_CP006_ENGLISH_REVIEW_CANDIDATE.questionBankWritable, "CP006 review candidate became bank-writable.");
assert(!MAL_CP006_ENGLISH_REVIEW_CANDIDATE.testEligible, "CP006 review candidate became test eligible.");
assert(!MAL_CP006_ENGLISH_REVIEW_CANDIDATE.publiclyPublishable, "CP006 review candidate became public.");

const seedsPerQl = 100;
let generated = 0;
let deterministic = 0;
let lifecycle = 0;
let surface = 0;
let traceability = 0;
let manualEditorialGuardChecks = 0;
const answerPositions = [0, 0, 0, 0];
const reviewRows: MalCp006PermanentReviewQuestion[] = [];
const qlEvidence: Array<{
  qlId: string;
  difficulty: string;
  answerSemantic: string;
  states: number;
  stems: number;
  answers: number;
  sourceRuntimes: number;
  variants: string[];
}> = [];

for (const allocation of MAL_CP006_REVIEW_ALLOCATION) {
  const states = new Set<string>();
  const stems = new Set<string>();
  const answers = new Set<string>();
  const sourceRuntimes = new Set<string>();
  const variants = new Set<string>();

  for (let index = 0; index < seedsPerQl; index += 1) {
    const seed = `mal-cp006-wave06:${allocation.qlId}:${index}`;
    const first = generateMalCp006PermanentReviewQuestion(allocation.qlId, seed);
    const second = generateMalCp006PermanentReviewQuestion(allocation.qlId, seed);
    assert(
      malCp006PermanentReviewStable(first) === malCp006PermanentReviewStable(second),
      `${allocation.qlId}/${seed}: review generation is not deterministic.`,
    );
    deterministic += 1;

    assert(first.runtimeId === MAL_CP006_PERMANENT_REVIEW_RUNTIME_ID, `${seed}: wrong runtime.`);
    assert(first.permanentQlId === allocation.qlId, `${seed}: wrong permanent QL.`);
    assert(first.permanentSolveModeId === allocation.solveModeId, `${seed}: wrong solve mode.`);
    assert(first.sharedCoreId === allocation.sharedCoreId, `${seed}: wrong shared core.`);
    assert(first.difficulty === allocation.difficulty, `${seed}: difficulty drifted.`);
    assert(first.answerSemantic === allocation.answerSemantic, `${seed}: answer semantic drifted.`);
    assert(first.validation.ok && first.validation.valid && first.validation.errors.length === 0, `${seed}: review validation failed.`);
    traceability += 1;

    assert(
      first.maturity === "ENGLISH_REVIEW_CANDIDATE" &&
        first.allocationStatus === "PERMANENT_IDENTITY_REVIEW_ONLY" &&
        first.reviewStatus === "PENDING_PRODUCT_OWNER_EDITORIAL_REVIEW" &&
        first.runtimeMode === "REVIEW_ONLY" &&
        first.permanentIdentityFrozen &&
        !first.active &&
        !first.publiclyPublishable &&
        !first.questionStudioDiscoverable &&
        !first.questionBankWritable &&
        !first.testEligible,
      `${seed}: review lifecycle escaped its lock.`,
    );
    lifecycle += 1;

    assert(first.stem.endsWith("?"), `${seed}: stem is not interrogative.`);
    assert(!/^[a-z]/u.test(first.stem), `${seed}: stem starts in lowercase.`);
    assert(first.options.length === 4 && new Set(first.options).size === 4, `${seed}: options are not four unique choices.`);
    assert(first.options[first.correctIndex] === first.answer, `${seed}: answer/index mismatch.`);
    assert(first.explanation.visibleLines.length >= 1 && first.explanation.visibleLines.length <= 4, `${seed}: solution length is outside 1-4 lines.`);
    const learnerText = [
      first.stem,
      ...first.options,
      ...first.explanation.visibleLines,
      first.explanation.optionalHelp.commonMistake,
    ].join(" ");
    assert(!/component load|state key|current fraction|global component/iu.test(learnerText), `${seed}: internal terminology leaked.`);
    assert(!/\bundefined\b/iu.test(learnerText), `${seed}: undefined learner label leaked.`);
    assert(!/\b1 litres\b/iu.test(learnerText), `${seed}: singular litre grammar regressed.`);
    assert(!/\b1 parts\b|\b1 ratio parts\b/iu.test(learnerText), `${seed}: singular part grammar regressed.`);
    assert(
      !/\b(?:\d+(?:\.\d+)?(?:\s+\d+\/\d+)?|\d*x) litres(?: of [^,.;?]+)? is (?:transferred|sent|moved|poured|added|returned|removed)\b/iu.test(learnerText),
      `${seed}: plural transfer agreement regressed.`,
    );
    assert(!/\b(?:[2-9]|\d{2,})(?:\.\d+)?(?:\s+\d+\/\d+)? litre\b/iu.test(learnerText), `${seed}: plural litre unit regressed.`);
    manualEditorialGuardChecks += 1;
    surface += 1;

    states.add(first.stateKey);
    stems.add(first.stem);
    answers.add(first.answer);
    sourceRuntimes.add(first.sourceRuntimeId);
    if (first.sourceVariantId) variants.add(first.sourceVariantId);
    answerPositions[first.correctIndex] += 1;
    generated += 1;
    if (index < 8) reviewRows.push(first);
  }

  assert(states.size >= 12, `${allocation.qlId}: state diversity too low (${states.size}).`);
  assert(stems.size >= 8, `${allocation.qlId}: stem diversity too low (${stems.size}).`);
  assert(answers.size >= 2, `${allocation.qlId}: answer generation became constant.`);
  if (allocation.qlId === "MAL-QL-061") {
    assert(variants.has("THREE_LEG_ALTERNATING_FORWARD"), "MAL-QL-061 did not exercise its longer alternating generalisation.");
    assert(sourceRuntimes.size >= 2, "MAL-QL-061 did not exercise both base and generalised authorities.");
  }
  if (allocation.qlId === "MAL-QL-066") {
    assert(variants.has("ASYMMETRIC_INVERSE_RETURN"), "MAL-QL-066 did not exercise asymmetric inverse return.");
    assert(sourceRuntimes.size >= 2, "MAL-QL-066 did not exercise both equal-return and asymmetric authorities.");
  }

  qlEvidence.push({
    qlId: allocation.qlId,
    difficulty: allocation.difficulty,
    answerSemantic: allocation.answerSemantic,
    states: states.size,
    stems: stems.size,
    answers: answers.size,
    sourceRuntimes: sourceRuntimes.size,
    variants: [...variants].sort(),
  });
}

assert(generated === 700, `Expected 700 review questions, received ${generated}.`);
assert(deterministic === 700, "Deterministic coverage incomplete.");
assert(lifecycle === 700, "Lifecycle coverage incomplete.");
assert(surface === 700, "Learner-surface coverage incomplete.");
assert(traceability === 700, "Permanent traceability coverage incomplete.");
assert(manualEditorialGuardChecks === 700, "Manual editorial guard coverage incomplete.");
assert(answerPositions.every((count) => count > 0), `One answer position was never reached: ${answerPositions.join("/")}.`);
assert(reviewRows.length === 56, `Expected 56 review rows, received ${reviewRows.length}.`);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp006-wave06-permanent-english-review.json");
const markdownPath = resolve(outputDirectory, "MAL-CP-006-WAVE-06-PERMANENT-ENGLISH-56Q-REVIEW.md");
const summary = {
  status: "PASS_MAL_CP006_WAVE06_PERMANENT_ENGLISH_REVIEW_CANDIDATE",
  reviewCandidateId: MAL_CP006_ENGLISH_REVIEW_CANDIDATE.reviewCandidateId,
  runtimeId: MAL_CP006_PERMANENT_REVIEW_RUNTIME_ID,
  qlRange: MAL_CP006_ENGLISH_REVIEW_CANDIDATE.qlRange,
  qlCount: 7,
  generated,
  deterministic,
  lifecycle,
  surface,
  traceability,
  manualEditorialGuardChecks,
  answerPositions,
  qlEvidence,
  reviewCount: reviewRows.length,
  lifecycleState: {
    active: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
};

writeFileSync(
  jsonPath,
  `${JSON.stringify({ ...summary, review: reviewRows }, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2)}\n`,
  "utf8",
);

const markdown: string[] = [
  "# MAL-CP-006 Wave 06 — Permanent English 56Q Review Candidate",
  "",
  "> Review-only candidate. Permanent identities are frozen; Question Studio, Question Bank, tests and publication remain disabled.",
  "",
  `Runtime: \`${MAL_CP006_PERMANENT_REVIEW_RUNTIME_ID}\``,
  `QL range: \`${MAL_CP006_ENGLISH_REVIEW_CANDIDATE.qlRange}\``,
  "",
  "## Per-QL evidence",
  "",
  "| QL | Difficulty | Answer semantic | States | Stems | Answers | Source authorities | Generalised variants |",
  "|---|---|---|---:|---:|---:|---:|---|",
  ...qlEvidence.map((row) => `| ${row.qlId} | ${row.difficulty} | ${row.answerSemantic} | ${row.states} | ${row.stems} | ${row.answers} | ${row.sourceRuntimes} | ${row.variants.join(", ") || "base"} |`),
  "",
  "## 56-question review",
  "",
];

for (const [index, question] of reviewRows.entries()) {
  markdown.push(
    `### ${index + 1}. ${question.permanentQlId} — ${question.stem}`,
    "",
    ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}${optionIndex === question.correctIndex ? " **✓**" : ""}`),
    "",
    `**Answer:** ${question.answer}`,
    "",
    "**Solution**",
    ...question.explanation.visibleLines.map((line) => `- ${line}`),
    "",
    `**Common mistake:** ${question.explanation.optionalHelp.commonMistake}`,
    "",
    `**Trace:** ${question.permanentSolveModeId} | ${question.sharedCoreId} | ${question.answerSemantic}${question.sourceVariantId ? ` | ${question.sourceVariantId}` : ""}`,
    "",
    "---",
    "",
  );
}

writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
