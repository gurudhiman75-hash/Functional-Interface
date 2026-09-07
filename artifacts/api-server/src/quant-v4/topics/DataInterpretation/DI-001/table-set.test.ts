import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generateDi001TableSet, verifyDi001QuestionSet, type Di001ExamProfile } from "./index";

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

const profiles: readonly Di001ExamProfile[] = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"];
const observedPositions = new Map<Di001ExamProfile, Set<number>>(
  profiles.map((profile) => [profile, new Set<number>()]),
);
const datasetFingerprints = new Set<string>();
let setCount = 0;
let questionCount = 0;
let independentVerificationCount = 0;
let optionChecks = 0;
let deterministicReplayChecks = 0;
let crossProfileStimulusChecks = 0;

for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
  const seed = `DI-001-PHASE0-${seedIndex}`;
  const byProfile = new Map<Di001ExamProfile, ReturnType<typeof generateDi001TableSet>>();

  for (const profile of profiles) {
    const first = generateDi001TableSet({ seed, examProfile: profile });
    const replay = generateDi001TableSet({ seed, examProfile: profile });
    assert(stable(first) === stable(replay), `${profile} seed ${seed} is not deterministic.`);
    deterministicReplayChecks += 1;

    assert(first.validation.valid, `${profile} seed ${seed} failed set validation.`);
    assert(verifyDi001QuestionSet(first), `${profile} seed ${seed} failed independent set verification.`);
    assert(first.questions.length === 5, `${profile} seed ${seed} did not create five linked questions.`);
    assert(first.stimulus.rows.length === 5, `${profile} seed ${seed} did not create a five-row table.`);
    assert(new Set(first.questions.map((question) => question.setId)).size === 1, `${profile} seed ${seed} child questions lost the shared set identity.`);
    assert(new Set(first.questions.map((question) => question.kind)).size === 5, `${profile} seed ${seed} repeated a child task kind.`);
    assert(new Set(first.questions.map((question) => question.questionId)).size === 5, `${profile} seed ${seed} repeated a child question ID.`);
    assert(first.traceability.questionBankStatus === "NOT_STORED", `${profile} seed ${seed} leaked Question Bank eligibility.`);
    assert(first.traceability.testEligibility === "INELIGIBLE", `${profile} seed ${seed} leaked test eligibility.`);
    assert(!first.traceability.publiclyPublishable, `${profile} seed ${seed} leaked public publication.`);
    assert(!first.traceability.questionStudioDiscoverable, `${profile} seed ${seed} leaked Question Studio discovery.`);

    first.questions.forEach((question) => {
      assert(question.options.length === first.optionCount, `${question.questionId} has the wrong option count.`);
      assert(new Set(question.options).size === question.options.length, `${question.questionId} has duplicate displayed options.`);
      assert(question.optionMetadata[question.correctIndex]?.misconceptionId === "CORRECT", `${question.questionId} has incorrect answer-index binding.`);
      assert(question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1, `${question.questionId} does not have exactly one correct option.`);
      assert(question.optionMetadata.every((option) => option.derivation.length > 15), `${question.questionId} contains an unexplained distractor.`);
      assert(question.explanation.steps.length >= 1, `${question.questionId} has no worked explanation.`);
      assert(question.explanation.trap.length > 20, `${question.questionId} has no question-specific trap guidance.`);
      observedPositions.get(profile)!.add(question.correctIndex);
      questionCount += 1;
      optionChecks += question.options.length;
      independentVerificationCount += 1;
    });

    datasetFingerprints.add(stable(first.stimulus.rows));
    byProfile.set(profile, first);
    setCount += 1;
  }

  assert(
    stable(byProfile.get("SSC_CGL_TIER_I")!.stimulus) === stable(byProfile.get("BANKING_PRELIMS")!.stimulus),
    `Exam profile changed the mathematical stimulus for ${seed}.`,
  );
  assert(byProfile.get("SSC_CGL_TIER_I")!.optionCount === 4, "SSC DI must expose four options in Phase 0.");
  assert(byProfile.get("BANKING_PRELIMS")!.optionCount === 5, "Banking DI must expose five options in Phase 0.");
  crossProfileStimulusChecks += 1;
}

assert(datasetFingerprints.size >= 70, `DI-001 produced only ${datasetFingerprints.size} distinct table states across 100 seeds.`);
assert(observedPositions.get("SSC_CGL_TIER_I")!.size === 4, "SSC DI did not reach all four correct-answer positions.");
assert(observedPositions.get("BANKING_PRELIMS")!.size === 5, "Banking DI did not reach all five correct-answer positions.");

const scope = dirname(fileURLToPath(import.meta.url));
for (const file of walkFiles(scope).filter((path) => path.endsWith(".ts"))) {
  const source = readFileSync(file, "utf8");
  assert(!source.includes("Math.random("), `Non-deterministic Math.random() is prohibited in DI-001: ${file}`);
}

console.log(JSON.stringify({
  status: "PASS_DI_001_PHASE0_LINKED_TABLE_FOUNDATION",
  sets: setCount,
  questions: questionCount,
  deterministicReplayChecks,
  independentVerificationCount,
  optionChecks,
  crossProfileStimulusChecks,
  distinctDatasetStates: datasetFingerprints.size,
  sscCorrectPositions: [...observedPositions.get("SSC_CGL_TIER_I")!].sort(),
  bankingCorrectPositions: [...observedPositions.get("BANKING_PRELIMS")!].sort(),
}));
