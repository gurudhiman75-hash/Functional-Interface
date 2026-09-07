import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateDi006CaseletSet,
  independentlyVerifyDi006QuestionSet,
  type Di006ExamProfile,
  type Di006TaskKind,
} from "./index";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value);
}

function walkFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walkFiles(path) : [path];
  });
}

const profiles: readonly Di006ExamProfile[] = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"];
const taskKinds: readonly Di006TaskKind[] = [
  "DERIVE_PRIMARY_FROM_PERCENT",
  "DERIVE_CHAINED_RELATION",
  "REMAINDER_FROM_TOTAL",
  "COMBINED_INFERRED_SHARE",
  "REMAINDER_TO_DIRECT_RATIO",
];

const answerPositions = new Map<string, Set<number>>();
for (const profile of profiles) {
  for (const taskKind of taskKinds) answerPositions.set(`${profile}:${taskKind}`, new Set<number>());
}

const stimulusFingerprints = new Set<string>();
const relationFamilySignatures = new Set<string>();
const primaryLabelCoverage = new Set<string>();
const directLabelCoverage = new Set<string>();
const chainedLabelCoverage = new Set<string>();
const secondaryLabelCoverage = new Set<string>();
const remainderLabelCoverage = new Set<string>();
const factOrderCoverage = new Set<string>();
let setCount = 0;
let questionCount = 0;
let deterministicReplayChecks = 0;
let independentVerificationChecks = 0;
let optionChecks = 0;
let bankingFiveOptionChecks = 0;
let crossProfileStimulusChecks = 0;
let learnerSurfaceChecks = 0;

for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
  const seed = `DI-006-PHASE5-${seedIndex}`;
  const byProfile = new Map<Di006ExamProfile, ReturnType<typeof generateDi006CaseletSet>>();

  for (const profile of profiles) {
    const first = generateDi006CaseletSet({ seed, examProfile: profile });
    const replay = generateDi006CaseletSet({ seed, examProfile: profile });

    assert(stable(first) === stable(replay), `${profile} ${seed} is not deterministic.`);
    deterministicReplayChecks += 1;

    assert(first.validation.valid, `${profile} ${seed} failed internal caselet validation.`);
    assert(independentlyVerifyDi006QuestionSet(first), `${profile} ${seed} failed independent caselet verification.`);
    independentVerificationChecks += first.questions.length;

    assert(first.stimulus.kind === "CASELET", `${profile} ${seed} lost caselet semantics.`);
    assert(first.stimulus.categories.length === 5, `${profile} ${seed} must contain five branch roles.`);
    assert(first.stimulus.relations.length === 3, `${profile} ${seed} must contain three relational facts.`);
    assert(first.stimulus.learnerText.length > 180, `${profile} ${seed} caselet prose is unexpectedly thin.`);
    assert(!first.stimulus.learnerText.includes("|"), `${profile} ${seed} looks like serialized tabular data rather than prose.`);
    assert(!/table|row|column/iu.test(first.stimulus.learnerText), `${profile} ${seed} leaks table-language into the caselet stimulus.`);
    assert(first.questions.length === 5, `${profile} ${seed} did not create five linked questions.`);
    assert(new Set(first.questions.map((question) => question.setId)).size === 1, `${profile} ${seed} lost shared set identity.`);
    assert(new Set(first.questions.map((question) => question.questionId)).size === 5, `${profile} ${seed} repeated a child question ID.`);
    assert(new Set(first.questions.map((question) => question.kind)).size === 5, `${profile} ${seed} repeated a caselet task kind.`);
    assert(taskKinds.every((taskKind) => first.questions.some((question) => question.kind === taskKind)), `${profile} ${seed} is missing a required caselet task.`);

    assert(first.traceability.questionBankStatus === "NOT_STORED", `${profile} ${seed} leaked Question Bank eligibility.`);
    assert(first.traceability.testEligibility === "INELIGIBLE", `${profile} ${seed} leaked test eligibility.`);
    assert(!first.traceability.publiclyPublishable, `${profile} ${seed} leaked public publication.`);
    assert(!first.traceability.questionStudioDiscoverable, `${profile} ${seed} leaked Question Studio discovery.`);

    first.questions.forEach((question) => {
      assert(question.options.length === first.optionCount, `${question.questionId} has wrong option count.`);
      assert(question.optionMetadata.length === first.optionCount, `${question.questionId} option metadata count is wrong.`);
      assert(new Set(question.options).size === question.options.length, `${question.questionId} contains duplicate displayed options.`);
      assert(question.optionMetadata[question.correctIndex]?.misconceptionId === "CORRECT", `${question.questionId} correct-index metadata binding failed.`);
      assert(question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1, `${question.questionId} has multiple correct metadata entries.`);
      assert(question.options[question.correctIndex] === question.answer, `${question.questionId} answer does not match the correct option.`);
      assert(question.options.filter((option) => option === question.answer).length === 1, `${question.questionId} displays the answer more than once.`);
      assert(question.optionMetadata.every((option) => option.derivation.length >= 20), `${question.questionId} contains an under-explained option.`);
      assert(question.explanation.keyIdea.length >= 45, `${question.questionId} key idea is too thin.`);
      assert(question.explanation.steps.length >= 2, `${question.questionId} does not have enough worked steps.`);
      assert(question.explanation.shortcut.length >= 25, `${question.questionId} shortcut is too thin.`);
      assert(question.explanation.trap.length >= 30, `${question.questionId} trap guidance is too thin.`);
      assert(!/mock[- ]?test problem|textbook problem|competitive[- ]exam problem|template|generator|question library|ql[- ]?id/iu.test(question.stem), `${question.questionId} leaks internal/editorial language.`);

      answerPositions.get(`${profile}:${question.kind}`)!.add(question.correctIndex);
      if (profile === "BANKING_PRELIMS") bankingFiveOptionChecks += question.options.length === 5 ? 1 : 0;
      optionChecks += question.options.length;
      learnerSurfaceChecks += 1;
      questionCount += 1;
    });

    relationFamilySignatures.add(first.stimulus.relations.map((relation) => `${relation.numerator}/${relation.denominator}`).join("|"));
    primaryLabelCoverage.add(first.stimulus.categories[0]!);
    directLabelCoverage.add(first.stimulus.categories[1]!);
    chainedLabelCoverage.add(first.stimulus.categories[2]!);
    secondaryLabelCoverage.add(first.stimulus.categories[3]!);
    remainderLabelCoverage.add(first.stimulus.categories[4]!);
    const firstRelationName = first.stimulus.relations[0]!.learnerText;
    const thirdRelationName = first.stimulus.relations[2]!.learnerText;
    factOrderCoverage.add(first.stimulus.learnerText.indexOf(firstRelationName) < first.stimulus.learnerText.indexOf(thirdRelationName) ? "PRIMARY_FIRST" : "SECONDARY_FIRST");
    stimulusFingerprints.add(stable(first.stimulus));
    byProfile.set(profile, first);
    setCount += 1;
  }

  const ssc = byProfile.get("SSC_CGL_TIER_I")!;
  const banking = byProfile.get("BANKING_PRELIMS")!;
  assert(stable(ssc.stimulus) === stable(banking.stimulus), `Exam profile changed the caselet stimulus for ${seed}.`);
  assert(ssc.optionCount === 4, `SSC ${seed} must expose four options.`);
  assert(banking.optionCount === 5, `Banking ${seed} must expose five options.`);
  crossProfileStimulusChecks += 1;
}

assert(stimulusFingerprints.size >= 95, `DI-006 produced only ${stimulusFingerprints.size} distinct caselet stimuli across 100 seeds.`);
assert(relationFamilySignatures.size === 5, `DI-006 exercised only ${relationFamilySignatures.size}/5 relational arithmetic families.`);
assert(primaryLabelCoverage.size === 5, `DI-006 primary derived role did not rotate across all branch labels.`);
assert(directLabelCoverage.size === 5, `DI-006 direct role did not rotate across all branch labels.`);
assert(chainedLabelCoverage.size === 5, `DI-006 chained role did not rotate across all branch labels.`);
assert(secondaryLabelCoverage.size === 5, `DI-006 secondary relation role did not rotate across all branch labels.`);
assert(remainderLabelCoverage.size === 5, `DI-006 remainder role did not rotate across all branch labels.`);
assert(factOrderCoverage.size === 2, `DI-006 did not exercise both allowed prose fact orders.`);
assert(bankingFiveOptionChecks === 500, `DI-006 completed only ${bankingFiveOptionChecks}/500 Banking five-option child checks.`);

for (const profile of profiles) {
  const expectedPositionCount = profile === "SSC_CGL_TIER_I" ? 4 : 5;
  for (const taskKind of taskKinds) {
    const positions = answerPositions.get(`${profile}:${taskKind}`)!;
    assert(
      positions.size === expectedPositionCount,
      `${profile}:${taskKind} reached only answer positions ${[...positions].sort()} instead of all ${expectedPositionCount}.`,
    );
  }
}

const scope = dirname(fileURLToPath(import.meta.url));
const forbiddenRandomToken = "Math" + ".random(";
for (const file of walkFiles(scope).filter((path) => path.endsWith(".ts"))) {
  const source = readFileSync(file, "utf8");
  assert(!source.includes(forbiddenRandomToken), `Non-deterministic random source is prohibited in DI-006: ${file}`);
}

console.log(JSON.stringify({
  status: "PASS_DI_006_CASELET_PHASE5",
  sets: setCount,
  questions: questionCount,
  deterministicReplayChecks,
  independentVerificationChecks,
  optionChecks,
  bankingFiveOptionChecks,
  crossProfileStimulusChecks,
  learnerSurfaceChecks,
  distinctStimuli: stimulusFingerprints.size,
  relationFamilies: relationFamilySignatures.size,
  roleLabelCoverage: {
    primary: [...primaryLabelCoverage].sort(),
    direct: [...directLabelCoverage].sort(),
    chained: [...chainedLabelCoverage].sort(),
    secondary: [...secondaryLabelCoverage].sort(),
    remainder: [...remainderLabelCoverage].sort(),
  },
  factOrderCoverage: [...factOrderCoverage].sort(),
  answerPositionCoverage: Object.fromEntries([...answerPositions].map(([key, positions]) => [key, [...positions].sort()])),
}));
