import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS,
  MAL_CP004_WAVE03_EQUIVALENCE_MATRIX,
} from "./foundation/cp004-equivalence-authority-wave03";
import {
  generateMalCp004Wave05EditorialQuestion,
  MAL_CP004_WAVE05_RUNTIME_ID,
  malCp004Wave05Stable,
  type MalCp004Wave05EditorialQuestion,
} from "./foundation/cp004-editorial-runtime-wave05";
import { MAL_CP004_WAVE04_RUNTIME_ID } from "./foundation/cp004-unified-runtime-wave04-types";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function learnerEditorialText(question: MalCp004Wave05EditorialQuestion): string {
  return JSON.stringify({
    stem: question.stem,
    options: question.options,
    explanation: {
      ...question.explanation,
      distractorAnalysis: question.explanation.distractorAnalysis.map(
        ({ reviewerMisconceptionId: _reviewerOnly, ...learner }) => learner,
      ),
    },
    ledger: question.ledger,
  });
}

function optionLetter(index: number): "A" | "B" | "C" | "D" {
  return (["A", "B", "C", "D"] as const)[index] ?? "D";
}

assert(
  MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS.length === 10,
  "Wave 05 must review all ten effective contracts.",
);
assert(
  MAL_CP004_WAVE03_EQUIVALENCE_MATRIX.length === 20,
  "Wave 03 equivalence authority changed before editorial review.",
);

const seedsPerContract = 240;
let generatedCount = 0;
let deterministicCount = 0;
let editoriallyValidatedCount = 0;
let distractorAnalysisCount = 0;
const answerPositionCounts = [0, 0, 0, 0];
const sourceMatchCounts = new Map<string, number>();
const contractStems = new Map<string, Set<string>>();
const contractAnswers = new Map<string, Set<string>>();
const contractShortcuts = new Map<string, Set<string>>();
const contractFingerprints = new Map<string, Set<string>>();
const variants = new Set<string>();
const sourceEvidenceIds = new Set<string>();
const misconceptionIds = new Set<string>();
const trapCalculations = new Set<string>();
const reviewRows: MalCp004Wave05EditorialQuestion[] = [];

for (const effectiveContractId of MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS) {
  const localStems = new Set<string>();
  const localAnswers = new Set<string>();
  const localShortcuts = new Set<string>();
  const localFingerprints = new Set<string>();
  contractStems.set(effectiveContractId, localStems);
  contractAnswers.set(effectiveContractId, localAnswers);
  contractShortcuts.set(effectiveContractId, localShortcuts);
  contractFingerprints.set(effectiveContractId, localFingerprints);

  for (let index = 0; index < seedsPerContract; index += 1) {
    const seed = `cp004-wave05:${effectiveContractId}:${index}`;
    const first = generateMalCp004Wave05EditorialQuestion(
      effectiveContractId,
      seed,
    );
    const second = generateMalCp004Wave05EditorialQuestion(
      effectiveContractId,
      seed,
    );

    assert(
      malCp004Wave05Stable(first) === malCp004Wave05Stable(second),
      `${effectiveContractId}/${seed}: editorial generation is not deterministic.`,
    );
    deterministicCount += 1;

    assert(first.validation.ok, `${seed}: inherited Wave 04 validation failed.`);
    assert(
      first.editorialValidation.ok,
      `${seed}: ${first.editorialValidation.errors.join("; ")}`,
    );
    editoriallyValidatedCount += 1;

    assert(first.archetypeId === "MAL-001", "Wrong archetype identity.");
    assert(first.canonicalProblemId === "MAL-CP-004", "Wrong CP identity.");
    assert(first.runtimeId === MAL_CP004_WAVE05_RUNTIME_ID, "Wrong Wave 05 runtime.");
    assert(
      first.baseRuntimeId === MAL_CP004_WAVE04_RUNTIME_ID,
      "Wave 04 base runtime identity changed.",
    );
    assert(
      first.effectiveContractId === effectiveContractId,
      "Editorial wrapper changed the requested contract.",
    );
    assert(first.permanentQlId === null, "Permanent QL leaked into Wave 05.");
    assert(first.language === "en", "Non-English content entered English review.");
    assert(
      first.maturity === "ENGLISH_EDITORIAL_REVIEW_CANDIDATE",
      "Wrong Wave 05 maturity.",
    );
    assert(
      first.allocationStatus === "UNALLOCATED_EDITORIAL_REVIEW",
      "Wrong Wave 05 allocation status.",
    );
    assert(
      first.reviewStatus === "READY_FOR_HUMAN_REVIEW",
      "Wrong Wave 05 review status.",
    );
    assert(
      !first.active &&
        !first.publiclyPublishable &&
        !first.questionStudioDiscoverable &&
        !first.questionBankWritable &&
        !first.testEligible,
      "A product flag became enabled during editorial review.",
    );

    assert(first.stem.endsWith("?"), "Stem is not a complete question.");
    assert(first.stem.length <= 460, "Stem is editorially overlong.");
    assert(first.options.length === 4, "Question does not have four options.");
    assert(new Set(first.options).size === 4, "Options are not unique.");
    assert(
      first.options[first.correctIndex] === first.answer,
      "Correct option and answer disagree.",
    );
    assert(
      first.explanation.layoutId === "MAL-CP004-EN-FOUR-TIER-EDITORIAL-V1",
      "Wrong editorial explanation layout.",
    );
    assert(
      /\$.*\$/u.test(first.explanation.coreConceptAndFormula),
      "Core concept does not expose a MathJax formula.",
    );
    assert(
      first.explanation.stepByStepSolution.length >= 2,
      "Step-by-step solution is too shallow.",
    );
    assert(
      first.explanation.stepByStepSolution.every((step) => /\d/u.test(step)),
      "A solution step is not state-specific.",
    );
    assert(
      first.explanation.examSpeedShortcut.includes(first.answer),
      "Exam shortcut omits the canonical answer.",
    );
    assert(
      (first.explanation.examSpeedShortcut.match(/\d/gu) ?? []).length >= 2,
      "Exam shortcut is generic rather than numerical.",
    );
    assert(
      first.explanation.verification.length >= 25,
      "Verification is too compressed.",
    );
    assert(
      first.explanation.conclusion.includes(first.answer),
      "Conclusion omits the canonical answer.",
    );

    const wrongOptionIndexes = first.optionAudit
      .map((option, optionIndex) => ({ option, optionIndex }))
      .filter(({ option }) => !option.isCorrect)
      .map(({ optionIndex }) => optionIndex);
    assert(wrongOptionIndexes.length === 3, "Expected three wrong displayed options.");
    assert(
      first.explanation.distractorAnalysis.length === 3,
      "Every wrong displayed option must be analysed.",
    );
    const reviewedLetters = new Set<string>();
    for (const trap of first.explanation.distractorAnalysis) {
      const optionIndex = ["A", "B", "C", "D"].indexOf(trap.optionLetter);
      assert(optionIndex >= 0, "Invalid option letter in trap analysis.");
      assert(
        wrongOptionIndexes.includes(optionIndex),
        "Trap analysis includes the correct option.",
      );
      assert(
        first.options[optionIndex] === trap.displayedValue,
        "Trap analysis value does not match its displayed option.",
      );
      assert(
        trap.wrongCalculation.startsWith(
          `Option ${optionLetter(optionIndex)} (${trap.displayedValue})`,
        ),
        "Trap analysis does not begin with the actual letter and value.",
      );
      assert(/\d/u.test(trap.wrongCalculation), "Trap calculation is not numerical.");
      assert(
        trap.correction.includes(first.answer),
        "Trap correction omits the correct answer.",
      );
      assert(
        trap.reviewerMisconceptionId.length >= 4,
        "Reviewer misconception authority is missing.",
      );
      reviewedLetters.add(trap.optionLetter);
      misconceptionIds.add(trap.reviewerMisconceptionId);
      trapCalculations.add(trap.wrongCalculation);
      distractorAnalysisCount += 1;
    }
    assert(reviewedLetters.size === 3, "Trap letters are not unique.");

    const learnerText = learnerEditorialText(first);
    assert(
      !/[½¼¾⅓⅔⅛⅜⅝⅞²³]/u.test(learnerText),
      "Learner output contains raw Unicode fractions or powers.",
    );
    assert(
      !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u.test(learnerText),
      "Learner output contains hidden control characters.",
    );
    assert(
      !/competitive-exam|homogeneous sample|stage strip|unique integer exponent|MAL-CP004-EFF|misconceptionId/iu.test(
        learnerText,
      ),
      "Learner output contains internal or artificial language.",
    );
    assert(
      !/[£€¥]/u.test(learnerText),
      "Foreign currency entered Indian-exam content.",
    );
    assert(
      !/\\frac(?!\{)/u.test(first.explanation.coreConceptAndFormula),
      "Malformed MathJax fraction found.",
    );

    variants.add(first.representationVariant);
    first.sourceEvidenceIds.forEach((sourceId) => sourceEvidenceIds.add(sourceId));
    sourceMatchCounts.set(
      first.sourceMatchKind,
      (sourceMatchCounts.get(first.sourceMatchKind) ?? 0) + 1,
    );
    localStems.add(first.stem);
    localAnswers.add(first.answer);
    localShortcuts.add(first.explanation.examSpeedShortcut);
    localFingerprints.add(first.mathematicalFingerprint);
    answerPositionCounts[first.correctIndex] += 1;
    generatedCount += 1;
    if (index < 10) reviewRows.push(first);
  }
}

assert(generatedCount === 2400, `Expected 2,400 packages, received ${generatedCount}.`);
assert(deterministicCount === 2400, "Determinism count does not match.");
assert(editoriallyValidatedCount === 2400, "Editorial validation count does not match.");
assert(distractorAnalysisCount === 7200, "Expected 7,200 distractor analyses.");
assert(reviewRows.length === 100, "Expected one hundred human-review rows.");
assert(
  [...contractStems.values()].every((values) => values.size >= 40),
  `Stem diversity is too low: ${JSON.stringify(
    Object.fromEntries([...contractStems].map(([key, value]) => [key, value.size])),
  )}`,
);
assert(
  [...contractAnswers.values()].every((values) => values.size >= 5),
  `Answer diversity is too low: ${JSON.stringify(
    Object.fromEntries([...contractAnswers].map(([key, value]) => [key, value.size])),
  )}`,
);
assert(
  [...contractShortcuts.values()].every((values) => values.size >= 5),
  `State-specific shortcut diversity is too low: ${JSON.stringify(
    Object.fromEntries([...contractShortcuts].map(([key, value]) => [key, value.size])),
  )}`,
);
assert(
  [...contractFingerprints.values()].every((values) => values.size >= 8),
  "Exact-state diversity regressed during editorial review.",
);
assert(
  answerPositionCounts.every((count) => count >= 480),
  `Answer positions are imbalanced: ${answerPositionCounts.join(", ")}.`,
);
assert(variants.size === 15, `Expected all 15 representation variants, received ${variants.size}.`);
assert(sourceEvidenceIds.size >= 15, "Source-evidence diversity is too low.");
assert(misconceptionIds.size >= 30, "Misconception authority coverage is too low.");
assert(trapCalculations.size >= 120, "Numerical trap-calculation diversity is too low.");
assert(
  (sourceMatchCounts.get("DIRECT_TASK_MATCH") ?? 0) > 0 &&
    (sourceMatchCounts.get("FORMULA_EQUIVALENT_DIRECTION") ?? 0) > 0 &&
    (sourceMatchCounts.get("INTERNAL_COLLISION_AUTHORITY") ?? 0) > 0,
  "All source-match classes are not represented.",
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp004-wave05-editorial-review.json");
const markdownPath = resolve(outputDirectory, "mal-cp004-wave05-editorial-review.md");

const contractSummary = Object.fromEntries(
  MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS.map((contractId) => [
    contractId,
    {
      stemCount: contractStems.get(contractId)!.size,
      answerCount: contractAnswers.get(contractId)!.size,
      shortcutCount: contractShortcuts.get(contractId)!.size,
      exactStateCount: contractFingerprints.get(contractId)!.size,
      sourceAuthorities: MAL_CP004_WAVE03_EQUIVALENCE_MATRIX.filter(
        (entry) => entry.effectiveContractId === contractId,
      ).map((entry) => entry.authorityId),
    },
  ]),
);

const evidence = {
  status: "PASS_MAL_CP004_WAVE05_EDITORIAL_REVIEW",
  runtimeId: MAL_CP004_WAVE05_RUNTIME_ID,
  baseRuntimeId: MAL_CP004_WAVE04_RUNTIME_ID,
  effectiveContractCount: MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS.length,
  generatedCount,
  deterministicCount,
  editoriallyValidatedCount,
  distractorAnalysisCount,
  reviewRowCount: reviewRows.length,
  representationVariantCount: variants.size,
  sourceEvidenceIdCount: sourceEvidenceIds.size,
  misconceptionIdCount: misconceptionIds.size,
  distinctTrapCalculationCount: trapCalculations.size,
  answerPositionCounts,
  sourceMatchCounts: Object.fromEntries(sourceMatchCounts),
  permanentQlCount: 0,
  productFlagsEnabled: false,
  reviewStatus: "READY_FOR_HUMAN_REVIEW",
  contractSummary,
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

const markdown: string[] = [
  "# MAL-CP-004 Wave 05 — English Editorial Review Evidence",
  "",
  `Status: **${evidence.status}**`,
  `Effective contracts: **${evidence.effectiveContractCount}**`,
  `Generated editorial packages: **${generatedCount}**`,
  `Deterministic repeats: **${deterministicCount}**`,
  `Editorial validations: **${editoriallyValidatedCount}**`,
  `Displayed distractors analysed: **${distractorAnalysisCount}**`,
  `Human-review rows: **${reviewRows.length}**`,
  `Representation variants: **${variants.size}**`,
  `Distinct numerical trap calculations: **${trapCalculations.size}**`,
  `Answer positions: **${answerPositionCounts.join(" / ")}**`,
  "",
  "## Lifecycle",
  "",
  "- Permanent QLs: **0**",
  "- Question Studio: **disabled**",
  "- Question Bank: **disabled**",
  "- Test eligible: **false**",
  "- Publicly publishable: **false**",
  "- Review status: **READY_FOR_HUMAN_REVIEW**",
  "",
  "## Four-tier explanation proof",
  "",
  "Every package contains:",
  "",
  "1. a plain-language governing concept with MathJax formula;",
  "2. number-specific worked steps;",
  "3. an answer-bearing state-specific exam shortcut;",
  "4. letter-and-value analysis of all three displayed distractors.",
  "",
  "Wave 05 is editorial evidence for human review. It does not allocate `MAL-QL-038+` or enable any delivery surface.",
];
writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");

console.log(JSON.stringify({ ...evidence, reviewRows: undefined }, null, 2));
