import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MAL_CP004_COMPLETION_LEDGER,
  MAL_CP004_FREEZE_READINESS,
} from "./foundation/cp004-completion-ledger";
import {
  generateMalCp004PermanentQuestion,
  MAL_CP004_ENGLISH_RELEASE,
  MAL_CP004_PERMANENT_ALLOCATION,
  MAL_CP004_PERMANENT_QL_IDS,
  MAL_CP004_PERMANENT_RUNTIME_ID,
  malCp004PermanentStable,
  runMalCp004EnglishReleasePipeline,
  type MalCp004PermanentQlId,
  type MalCp004ReleasedQuestion,
} from "./foundation/cp004-permanent-runtime";
import { generateMalCp004Wave04Question } from "./foundation/cp004-unified-runtime-wave04";
import { generateMalCp004Wave05EditorialQuestion } from "./foundation/cp004-editorial-runtime-wave05";
import {
  MAL_001_QUESTION_STUDIO_CP_IDS,
  runMal001QuestionStudioPipeline,
} from "./question-studio-adapter";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function expectThrow(action: () => unknown, pattern: RegExp, message: string): void {
  let thrown: unknown;
  try {
    action();
  } catch (error) {
    thrown = error;
  }
  assert(thrown instanceof Error, message);
  assert(pattern.test(thrown.message), `${message} Received: ${thrown.message}`);
}

function numericQlId(qlId: string): number {
  const match = qlId.match(/^MAL-QL-(\d{3})$/u);
  assert(match, `Malformed permanent QL ID: ${qlId}.`);
  return Number(match[1]);
}

assert(
  MAL_CP004_PERMANENT_ALLOCATION.length === 10,
  "Wave 06 must allocate exactly ten permanent QLs.",
);
assert(
  MAL_CP004_PERMANENT_QL_IDS.length === 10,
  "Permanent QL identity list must contain ten entries.",
);
assert(
  new Set(MAL_CP004_PERMANENT_QL_IDS).size === 10,
  "Permanent QL identities are not unique.",
);
assert(
  new Set(MAL_CP004_PERMANENT_ALLOCATION.map((entry) => entry.contractId)).size ===
    10,
  "One effective contract was allocated more than once.",
);
assert(
  new Set(MAL_CP004_PERMANENT_ALLOCATION.map((entry) => entry.familyId)).size ===
    10,
  "Permanent family identities are not unique.",
);

const numericRange = MAL_CP004_PERMANENT_QL_IDS.map(numericQlId);
assert(
  numericRange.every((value, index) => value === 38 + index),
  `Permanent QL range is not continuous: ${numericRange.join(", ")}.`,
);
assert(
  MAL_CP004_PERMANENT_ALLOCATION.every(
    (entry, index) => entry.qlId === MAL_CP004_PERMANENT_QL_IDS[index],
  ),
  "Allocation order does not match the permanent QL list.",
);

assert(MAL_CP004_ENGLISH_RELEASE.status === "FROZEN", "English release is not frozen.");
assert(
  MAL_CP004_ENGLISH_RELEASE.qlRange === "MAL-QL-038..MAL-QL-047",
  "English release range is incorrect.",
);
assert(MAL_CP004_ENGLISH_RELEASE.qlCount === 10, "English release QL count is incorrect.");
assert(
  MAL_CP004_ENGLISH_RELEASE.questionStudioDiscoverable &&
    MAL_CP004_ENGLISH_RELEASE.questionBankWritable &&
    MAL_CP004_ENGLISH_RELEASE.testEligible &&
    MAL_CP004_ENGLISH_RELEASE.publiclyPublishable,
  "English release surfaces are not fully enabled.",
);
assert(
  MAL_CP004_ENGLISH_RELEASE.excludedLanguages.join(",") === "hi,pa",
  "Hindi and Punjabi exclusion is not explicit.",
);
assert(
  MAL_CP004_FREEZE_READINESS.status === "FROZEN_ENGLISH" &&
    MAL_CP004_FREEZE_READINESS.englishFrozen &&
    !MAL_CP004_FREEZE_READINESS.hindiFrozen &&
    !MAL_CP004_FREEZE_READINESS.punjabiFrozen,
  "Freeze-language status is incorrect.",
);
assert(
  MAL_CP004_FREEZE_READINESS.meaningfulOwnedUncoveredContractCount === 0 &&
    MAL_CP004_FREEZE_READINESS.remainingSourcePolicyBlockerCount === 0,
  "The completion ledger still contains a meaningful owned gap.",
);
assert(
  MAL_CP004_COMPLETION_LEDGER.filter(
    (row) => row.disposition === "COVERED_BY_PERMANENT_QL",
  ).length === 10,
  "Completion ledger does not cover all ten effective contracts.",
);
assert(
  MAL_CP004_COMPLETION_LEDGER.some(
    (row) => row.disposition === "EXCLUDED_TO_CP001",
  ) &&
    MAL_CP004_COMPLETION_LEDGER.some(
      (row) => row.disposition === "EXCLUDED_TO_CP003",
    ) &&
    MAL_CP004_COMPLETION_LEDGER.some(
      (row) => row.disposition === "EXCLUDED_TO_CP006",
    ),
  "One or more chapter ownership boundaries are missing.",
);

assert(
  MAL_001_QUESTION_STUDIO_CP_IDS.includes("MAL-CP-004"),
  "Question Studio does not list MAL-CP-004.",
);

const seedsPerQl = 200;
let generatedCount = 0;
let deterministicCount = 0;
let sourceValidationCount = 0;
let editorialValidationCount = 0;
let distractorAnalysisCount = 0;
let questionStudioExplicitRouteCount = 0;
let questionStudioSelectionCount = 0;
const answerPositionCounts = [0, 0, 0, 0];
const contractIds = new Set<string>();
const familyIds = new Set<string>();
const representationVariants = new Set<string>();
const sourceEvidenceIds = new Set<string>();
const misconceptionIds = new Set<string>();
const qlStemSets = new Map<string, Set<string>>();
const qlAnswerSets = new Map<string, Set<string>>();
const qlFingerprintSets = new Map<string, Set<string>>();
const qlShortcutSets = new Map<string, Set<string>>();
const reviewRows: MalCp004ReleasedQuestion[] = [];

for (const allocation of MAL_CP004_PERMANENT_ALLOCATION) {
  const stems = new Set<string>();
  const answers = new Set<string>();
  const fingerprints = new Set<string>();
  const shortcuts = new Set<string>();
  qlStemSets.set(allocation.qlId, stems);
  qlAnswerSets.set(allocation.qlId, answers);
  qlFingerprintSets.set(allocation.qlId, fingerprints);
  qlShortcutSets.set(allocation.qlId, shortcuts);
  contractIds.add(allocation.contractId);
  familyIds.add(allocation.familyId);

  for (let index = 0; index < seedsPerQl; index += 1) {
    const seed = `cp004-wave06:${allocation.qlId}:${index}`;
    const first = generateMalCp004PermanentQuestion(allocation.qlId, seed);
    const second = generateMalCp004PermanentQuestion(allocation.qlId, seed);

    assert(
      malCp004PermanentStable(first) === malCp004PermanentStable(second),
      `${allocation.qlId}/${seed}: permanent generation is not deterministic.`,
    );
    deterministicCount += 1;

    assert(first.archetypeId === "MAL-001", "Wrong archetype identity.");
    assert(first.canonicalProblemId === "MAL-CP-004", "Wrong CP identity.");
    assert(
      first.runtimeId === MAL_CP004_PERMANENT_RUNTIME_ID,
      "Wrong permanent runtime identity.",
    );
    assert(first.permanentQlId === allocation.qlId, "Permanent QL identity changed.");
    assert(first.questionLanguageId === allocation.qlId, "Question-language identity changed.");
    assert(
      first.traceability.contractId === allocation.contractId,
      "Traceability contract does not match allocation.",
    );
    assert(
      first.traceability.familyId === allocation.familyId,
      "Traceability family does not match allocation.",
    );
    assert(
      first.traceability.releaseId === MAL_CP004_ENGLISH_RELEASE.releaseId,
      "Wrong release ID in traceability.",
    );
    assert(first.language === "en", "Non-English output entered English release.");
    assert(first.difficulty === allocation.difficulty, "Difficulty allocation changed.");
    assert(
      first.taskDirection === allocation.taskDirection,
      "Task-direction allocation changed.",
    );
    assert(
      first.answerSemantic === allocation.answerSemantic,
      "Answer-semantic allocation changed.",
    );
    assert(
      first.maturity === "FROZEN" &&
        first.allocationStatus === "RELEASED_ENGLISH_V1" &&
        first.releaseStatus === "APPROVED" &&
        first.runtimeMode === "RELEASED" &&
        first.reviewStatus === "APPROVED_EDITORIAL_ENGLISH" &&
        first.questionBankStatus === "WRITABLE" &&
        first.testEligibility === "ELIGIBLE" &&
        first.permanentIdentityFrozen,
      "Permanent release lifecycle metadata is incomplete.",
    );
    assert(
      first.active &&
        first.publiclyPublishable &&
        first.questionStudioDiscoverable &&
        first.questionBankWritable &&
        first.testEligible,
      "One or more permanent product flags are disabled.",
    );
    assert(
      first.validation.ok && first.validation.valid && first.validation.errors.length === 0,
      "Permanent validation is not fully successful.",
    );
    assert(
      first.validation.checks.length >= 5 &&
        first.validation.checks.every((check) => check.passed),
      "Permanent validation checks are incomplete.",
    );
    assert(first.sourceValidation.ok, "Source mathematical validation was not preserved.");
    assert(
      first.sourceEditorialValidation.ok,
      "Source editorial validation was not preserved.",
    );
    sourceValidationCount += 1;
    editorialValidationCount += 1;

    assert(first.stem.endsWith("?"), "Released stem is not a complete question.");
    assert(first.options.length === 4, "Released question does not have four options.");
    assert(new Set(first.options).size === 4, "Released options are not unique.");
    assert(
      first.options[first.correctIndex] === first.answer,
      "Released answer and correct option disagree.",
    );
    assert(
      first.explanation.layoutId ===
        "MAL-CP004-EN-CONSERVED-QUANTITY-RELEASE-V1",
      "Wrong released explanation layout.",
    );
    assert(
      first.explanation.coreConceptAndFormula.includes("$"),
      "Released concept omits its formula.",
    );
    assert(
      first.explanation.stepByStepSolution.length >= 2,
      "Released worked solution is too shallow.",
    );
    assert(
      first.explanation.examSpeedShortcut.includes(first.answer),
      "Released shortcut omits the canonical answer.",
    );
    assert(
      first.explanation.distractorAnalysis.length === 3,
      "Released explanation does not analyse all displayed distractors.",
    );
    assert(
      first.explanation.lines.includes("⚠️ Common Traps & Distractor Analysis"),
      "Released explanation lines omit the distractor section.",
    );
    for (const trap of first.explanation.distractorAnalysis) {
      assert(
        trap.wrongCalculation.includes(`Option ${trap.optionLetter}`) &&
          trap.wrongCalculation.includes(trap.displayedValue),
        "Released trap analysis omits its actual option letter or value.",
      );
      assert(
        trap.correction.includes(first.answer),
        "Released trap correction omits the canonical answer.",
      );
      misconceptionIds.add(trap.reviewerMisconceptionId);
      distractorAnalysisCount += 1;
    }
    assert(first.reasoningGraph.nodes.length >= 5, "Reasoning graph is too shallow.");
    assert(
      first.reasoningGraph.nodes.some((node) => node.kind === "GIVEN") &&
        first.reasoningGraph.nodes.some((node) => node.kind === "RELATION") &&
        first.reasoningGraph.nodes.some((node) => node.kind === "VERIFICATION") &&
        first.reasoningGraph.nodes.some((node) => node.kind === "CONCLUSION"),
      "Reasoning graph lacks a required node kind.",
    );
    assert(first.sourceEvidenceIds.length >= 1, "Source evidence is missing.");
    assert(
      first.traceability.sourceEvidenceIds.join("|") ===
        first.sourceEvidenceIds.join("|"),
      "Source evidence changed in traceability.",
    );

    representationVariants.add(first.representationVariant);
    first.sourceEvidenceIds.forEach((sourceId) => sourceEvidenceIds.add(sourceId));
    stems.add(first.stem);
    answers.add(first.answer);
    fingerprints.add(first.mathematicalFingerprint);
    shortcuts.add(first.explanation.examSpeedShortcut);
    answerPositionCounts[first.correctIndex] += 1;
    generatedCount += 1;
    if (index < 4) reviewRows.push(first);
  }

  for (let index = 0; index < 10; index += 1) {
    const routed = runMal001QuestionStudioPipeline("MAL-CP-004", {
      questionLanguageId: allocation.qlId,
      seed: `cp004-wave06-question-studio:${allocation.qlId}:${index}`,
      language: "en",
    });
    assert(
      routed.canonicalProblemId === "MAL-CP-004" &&
        routed.permanentQlId === allocation.qlId &&
        routed.runtimeId === MAL_CP004_PERMANENT_RUNTIME_ID,
      "Question Studio explicit route returned the wrong permanent question.",
    );
    questionStudioExplicitRouteCount += 1;
  }
}

for (let index = 0; index < 100; index += 1) {
  const routed = runMal001QuestionStudioPipeline("MAL-CP-004", {
    seed: `cp004-wave06-question-studio-selection:${index}`,
    language: "en",
  });
  assert(
    routed.canonicalProblemId === "MAL-CP-004" &&
      MAL_CP004_PERMANENT_QL_IDS.includes(
        routed.permanentQlId as MalCp004PermanentQlId,
      ),
    "Question Studio automatic selection escaped the CP004 permanent range.",
  );
  questionStudioSelectionCount += 1;
}

assert(generatedCount === 2000, `Expected 2,000 released questions, received ${generatedCount}.`);
assert(deterministicCount === 2000, "Permanent determinism count does not match.");
assert(sourceValidationCount === 2000, "Source validation count does not match.");
assert(editorialValidationCount === 2000, "Editorial validation count does not match.");
assert(distractorAnalysisCount === 6000, "Expected 6,000 released distractor analyses.");
assert(reviewRows.length === 40, "Expected forty permanent human-review rows.");
assert(questionStudioExplicitRouteCount === 100, "Explicit Question Studio route count is wrong.");
assert(questionStudioSelectionCount === 100, "Automatic Question Studio route count is wrong.");
assert(contractIds.size === 10 && familyIds.size === 10, "Contract or family coverage is incomplete.");
assert(
  representationVariants.size === 15,
  `Expected all 15 representation variants, received ${representationVariants.size}.`,
);
assert(sourceEvidenceIds.size >= 15, "Source-evidence diversity is too low.");
assert(misconceptionIds.size >= 30, "Misconception authority coverage is too low.");
assert(
  [...qlStemSets.values()].every((values) => values.size >= 40),
  `A permanent QL has insufficient stem diversity: ${JSON.stringify(
    Object.fromEntries([...qlStemSets].map(([key, value]) => [key, value.size])),
  )}`,
);
assert(
  [...qlAnswerSets.values()].every((values) => values.size >= 5),
  `A permanent QL has insufficient answer diversity: ${JSON.stringify(
    Object.fromEntries([...qlAnswerSets].map(([key, value]) => [key, value.size])),
  )}`,
);
assert(
  [...qlFingerprintSets.values()].every((values) => values.size >= 8),
  "A permanent QL has insufficient exact-state diversity.",
);
assert(
  [...qlShortcutSets.values()].every((values) => values.size >= 5),
  "A permanent QL has insufficient shortcut diversity.",
);
assert(
  answerPositionCounts.every((count) => count >= 400),
  `Answer positions are imbalanced: ${answerPositionCounts.join(", ")}.`,
);

for (const allocation of MAL_CP004_PERMANENT_ALLOCATION) {
  const direct = runMalCp004EnglishReleasePipeline({
    questionLanguageId: allocation.qlId,
    seed: `cp004-wave06-direct-pipeline:${allocation.qlId}`,
    language: "en",
  });
  assert(
    direct.permanentQlId === allocation.qlId &&
      direct.runtimeId === MAL_CP004_PERMANENT_RUNTIME_ID,
    "Direct release pipeline returned the wrong QL.",
  );
}

expectThrow(
  () =>
    runMal001QuestionStudioPipeline("MAL-CP-004", {
      questionLanguageId: "MAL-QL-037",
      seed: "cp004-wave06-wrong-cp-ql",
      language: "en",
    }),
  /not active for MAL-CP-004/iu,
  "Question Studio accepted a CP003 QL for CP004.",
);
expectThrow(
  () =>
    (runMal001QuestionStudioPipeline as unknown as (
      cpId: string,
      input: Record<string, unknown>,
    ) => unknown)("MAL-CP-004", {
      questionLanguageId: "MAL-QL-038",
      seed: "cp004-wave06-hindi-rejection",
      language: "hi",
    }),
  /supports English generation only/iu,
  "Question Studio accepted unreleased Hindi output.",
);
expectThrow(
  () =>
    (runMalCp004EnglishReleasePipeline as unknown as (
      input: Record<string, unknown>,
    ) => unknown)({
      questionLanguageId: "MAL-QL-038",
      seed: "cp004-wave06-punjabi-rejection",
      language: "pa",
    }),
  /does not support language/iu,
  "Direct release pipeline accepted unreleased Punjabi output.",
);

const discoverySample = generateMalCp004Wave04Question(
  MAL_CP004_PERMANENT_ALLOCATION[0]!.contractId,
  "cp004-wave06-discovery-lock",
);
assert(
  discoverySample.permanentQlId === null &&
    !discoverySample.active &&
    !discoverySample.questionStudioDiscoverable &&
    !discoverySample.questionBankWritable &&
    !discoverySample.testEligible &&
    !discoverySample.publiclyPublishable,
  "Wave 04 discovery runtime became a product runtime.",
);
const editorialSample = generateMalCp004Wave05EditorialQuestion(
  MAL_CP004_PERMANENT_ALLOCATION[0]!.contractId,
  "cp004-wave06-editorial-lock",
);
assert(
  editorialSample.permanentQlId === null &&
    !editorialSample.active &&
    !editorialSample.questionStudioDiscoverable &&
    !editorialSample.questionBankWritable &&
    !editorialSample.testEligible &&
    !editorialSample.publiclyPublishable,
  "Wave 05 editorial runtime became a product runtime.",
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp004-wave06-permanent-english.json");
const markdownPath = resolve(outputDirectory, "mal-cp004-wave06-permanent-english.md");

const qlSummary = Object.fromEntries(
  MAL_CP004_PERMANENT_ALLOCATION.map((allocation) => [
    allocation.qlId,
    {
      contractId: allocation.contractId,
      familyId: allocation.familyId,
      label: allocation.label,
      difficulty: allocation.difficulty,
      taskDirection: allocation.taskDirection,
      answerSemantic: allocation.answerSemantic,
      stemCount: qlStemSets.get(allocation.qlId)!.size,
      answerCount: qlAnswerSets.get(allocation.qlId)!.size,
      fingerprintCount: qlFingerprintSets.get(allocation.qlId)!.size,
      shortcutCount: qlShortcutSets.get(allocation.qlId)!.size,
    },
  ]),
);

const evidence = {
  status: "PASS_MAL_CP004_WAVE06_PERMANENT_ENGLISH_RELEASE",
  releaseId: MAL_CP004_ENGLISH_RELEASE.releaseId,
  runtimeId: MAL_CP004_PERMANENT_RUNTIME_ID,
  qlRange: MAL_CP004_ENGLISH_RELEASE.qlRange,
  qlCount: MAL_CP004_PERMANENT_QL_IDS.length,
  generatedCount,
  deterministicCount,
  sourceValidationCount,
  editorialValidationCount,
  distractorAnalysisCount,
  reviewRowCount: reviewRows.length,
  representationVariantCount: representationVariants.size,
  sourceEvidenceIdCount: sourceEvidenceIds.size,
  misconceptionIdCount: misconceptionIds.size,
  answerPositionCounts,
  questionStudioExplicitRouteCount,
  questionStudioSelectionCount,
  englishFrozen: true,
  hindiReleased: false,
  punjabiReleased: false,
  questionStudioDiscoverable: true,
  questionBankWritable: true,
  testEligible: true,
  publiclyPublishable: true,
  completionLedgerRows: MAL_CP004_COMPLETION_LEDGER.length,
  qlSummary,
  reviewRows,
};

writeFileSync(
  jsonPath,
  `${JSON.stringify(
    evidence,
    (_key, value) => (typeof value === "bigint" ? value.toString() : value),
    2,
  )}\n`,
  "utf8",
);

const markdown = [
  "# MAL-CP-004 Wave 06 — Permanent English Release Evidence",
  "",
  `Status: **${evidence.status}**`,
  `Release: **${evidence.releaseId}**`,
  `QL range: **${evidence.qlRange}**`,
  `Permanent QLs: **${evidence.qlCount}**`,
  `Released questions audited: **${generatedCount}**`,
  `Deterministic repeats: **${deterministicCount}**`,
  `Source validations: **${sourceValidationCount}**`,
  `Editorial validations: **${editorialValidationCount}**`,
  `Displayed distractors analysed: **${distractorAnalysisCount}**`,
  `Question Studio explicit routes: **${questionStudioExplicitRouteCount}**`,
  `Question Studio automatic selections: **${questionStudioSelectionCount}**`,
  `Answer positions: **${answerPositionCounts.join(" / ")}**`,
  "",
  "## Delivery status",
  "",
  "- English: **FROZEN**",
  "- Question Studio: **enabled**",
  "- Question Bank: **writable**",
  "- Test eligibility: **enabled**",
  "- Public publication: **enabled**",
  "- Hindi: **unreleased**",
  "- Punjabi: **unreleased**",
  "",
  "The Wave 04 discovery and Wave 05 editorial runtimes remain locked and non-public. Only the Wave 06 permanent runtime carries product delivery flags.",
];
writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");

console.log(JSON.stringify({ ...evidence, reviewRows: undefined }, null, 2));
