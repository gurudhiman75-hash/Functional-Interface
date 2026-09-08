import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateSta001Question,
  independentlyVerifySta001Question,
  STA001_CONTRACTS,
  type Sta001ContractId,
  type Sta001ExamProfile,
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

function skeleton(text: string): string {
  return text
    .toLowerCase()
    .replace(/\d+(?:\.\d+)?/g, "#")
    .replace(/\s+/g, " ")
    .trim();
}

const profiles: readonly Sta001ExamProfile[] = ["SSC_CGL_TIER_II", "SSC_CGL_JSO"];
const answerPositions = new Map<string, Set<number>>();
const stemSkeletons = new Map<string, Set<string>>();
const misconceptionCoverage = new Map<string, Set<string>>();
const questionIds = new Set<string>();
const medianParity = new Map<Sta001ExamProfile, Set<"ODD" | "EVEN">>([
  ["SSC_CGL_TIER_II", new Set()],
  ["SSC_CGL_JSO", new Set()],
]);
const missingCountCoverage = new Map<Sta001ExamProfile, Set<number>>([
  ["SSC_CGL_TIER_II", new Set()],
  ["SSC_CGL_JSO", new Set()],
]);
const correctedCountCoverage = new Map<Sta001ExamProfile, Set<number>>([
  ["SSC_CGL_TIER_II", new Set()],
  ["SSC_CGL_JSO", new Set()],
]);
const combinedPairCoverage = new Map<Sta001ExamProfile, Set<string>>([
  ["SSC_CGL_TIER_II", new Set()],
  ["SSC_CGL_JSO", new Set()],
]);

for (const profile of profiles) {
  for (const contractId of STA001_CONTRACTS) {
    answerPositions.set(`${profile}:${contractId}`, new Set());
    stemSkeletons.set(`${profile}:${contractId}`, new Set());
    misconceptionCoverage.set(`${profile}:${contractId}`, new Set());
  }
}

let questionCount = 0;
let deterministicReplayChecks = 0;
let independentVerificationChecks = 0;
let optionChecks = 0;
let learnerSurfaceChecks = 0;
let lifecycleChecks = 0;

for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
  const seed = `STAT-001-P0-${seedIndex}`;

  for (const profile of profiles) {
    for (const contractId of STA001_CONTRACTS) {
      const first = generateSta001Question({ seed, examProfile: profile, contractId });
      const replay = generateSta001Question({ seed, examProfile: profile, contractId });
      const key = `${profile}:${contractId}`;

      assert(stable(first) === stable(replay), `${key} ${seed} is not deterministic.`);
      deterministicReplayChecks += 1;

      assert(first.validation.valid, `${key} ${seed} failed internal validation.`);
      assert(independentlyVerifySta001Question(first), `${key} ${seed} failed independent verification.`);
      independentVerificationChecks += 1;

      assert(first.packageId === "STAT-001", `${key} ${seed} lost package identity.`);
      assert(first.examProfile === profile, `${key} ${seed} changed exam profile.`);
      assert(first.contractId === contractId, `${key} ${seed} changed contract identity.`);
      assert(first.options.length === 4, `${key} ${seed} did not expose four options.`);
      assert(first.optionMetadata.length === 4, `${key} ${seed} option metadata count is wrong.`);
      assert(new Set(first.options).size === 4, `${key} ${seed} contains duplicate displayed options.`);
      assert(first.options[first.correctIndex] === first.answer, `${key} ${seed} answer binding failed.`);
      assert(first.optionMetadata[first.correctIndex]?.misconceptionId === "CORRECT", `${key} ${seed} correct metadata binding failed.`);
      assert(first.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1, `${key} ${seed} has multiple correct metadata entries.`);
      assert(first.options.filter((option) => option === first.answer).length === 1, `${key} ${seed} displays the answer more than once.`);
      assert(first.optionMetadata.every((option) => option.derivation.length >= 24), `${key} ${seed} contains an under-explained option.`);
      assert(first.explanation.keyIdea.length >= 50, `${key} ${seed} key idea is too thin.`);
      assert(first.explanation.steps.length >= 2, `${key} ${seed} lacks worked steps.`);
      assert(first.explanation.shortcut.length >= 35, `${key} ${seed} shortcut is too thin.`);
      assert(first.explanation.trap.length >= 35, `${key} ${seed} trap guidance is too thin.`);
      assert(first.explanation.steps.join(" ").includes(first.answer), `${key} ${seed} explanation does not explicitly reach its answer.`);
      assert(!/mock[- ]?test problem|textbook problem|competitive[- ]exam problem|template|generator|question library|ql[- ]?id/iu.test(first.stem), `${key} ${seed} leaks internal/editorial language.`);

      assert(!first.traceability.questionStudioDiscoverable, `${key} ${seed} leaked Question Studio discovery.`);
      assert(first.traceability.questionBankStatus === "NOT_STORED", `${key} ${seed} leaked Question Bank storage.`);
      assert(first.traceability.testEligibility === "INELIGIBLE", `${key} ${seed} leaked test eligibility.`);
      assert(!first.traceability.publiclyPublishable, `${key} ${seed} leaked public publication.`);
      lifecycleChecks += 1;

      assert(!questionIds.has(first.questionId), `Repeated question ID ${first.questionId}.`);
      questionIds.add(first.questionId);

      answerPositions.get(key)!.add(first.correctIndex);
      stemSkeletons.get(key)!.add(skeleton(first.stem));
      first.optionMetadata.filter((option) => option.misconceptionId !== "CORRECT").forEach((option) => misconceptionCoverage.get(key)!.add(option.misconceptionId));

      if (first.state.kind === "MEDIAN_RAW") {
        medianParity.get(profile)!.add(first.state.values.length % 2 === 0 ? "EVEN" : "ODD");
      }
      if (first.state.kind === "MISSING_OBSERVATION") {
        missingCountCoverage.get(profile)!.add(first.state.observationCount);
      }
      if (first.state.kind === "CORRECTED_MEAN") {
        correctedCountCoverage.get(profile)!.add(first.state.observationCount);
      }
      if (first.state.kind === "COMBINED_MEAN") {
        combinedPairCoverage.get(profile)!.add(`${first.state.group1Count}:${first.state.group2Count}`);
      }

      optionChecks += 4;
      learnerSurfaceChecks += 1;
      questionCount += 1;
    }
  }
}

assert(questionCount === 1200, `STAT-001 generated ${questionCount}/1200 expected questions.`);
assert(deterministicReplayChecks === 1200, `STAT-001 completed ${deterministicReplayChecks}/1200 replay checks.`);
assert(independentVerificationChecks === 1200, `STAT-001 completed ${independentVerificationChecks}/1200 independent checks.`);
assert(optionChecks === 4800, `STAT-001 completed ${optionChecks}/4800 option checks.`);
assert(lifecycleChecks === 1200, `STAT-001 completed ${lifecycleChecks}/1200 lifecycle checks.`);

for (const profile of profiles) {
  for (const contractId of STA001_CONTRACTS) {
    const key = `${profile}:${contractId}`;
    const positions = answerPositions.get(key)!;
    const skeletons = stemSkeletons.get(key)!;
    const misconceptions = misconceptionCoverage.get(key)!;
    assert(positions.size === 4, `${key} reached only answer positions ${[...positions].sort()} instead of A-D.`);
    assert(skeletons.size >= 3, `${key} exposed only ${skeletons.size} normalized stem structures.`);
    assert(misconceptions.size >= 3, `${key} exercised only ${misconceptions.size} distinct wrong-answer misconceptions.`);
  }
}

assert(medianParity.get("SSC_CGL_TIER_II")!.size === 2, "SSC CGL Tier II median coverage did not exercise both odd and even sample sizes.");
assert(medianParity.get("SSC_CGL_JSO")!.size === 2, "SSC CGL JSO median coverage did not exercise both odd and even sample sizes.");
assert(missingCountCoverage.get("SSC_CGL_TIER_II")!.size >= 2, "Tier II missing-observation coverage used fewer than two observation counts.");
assert(missingCountCoverage.get("SSC_CGL_JSO")!.size >= 2, "JSO missing-observation coverage used fewer than two observation counts.");
assert(correctedCountCoverage.get("SSC_CGL_TIER_II")!.size === 3, `Tier II corrected-mean coverage reached counts ${[...correctedCountCoverage.get("SSC_CGL_TIER_II")!].sort()}.`);
assert(correctedCountCoverage.get("SSC_CGL_JSO")!.size === 3, `JSO corrected-mean coverage reached counts ${[...correctedCountCoverage.get("SSC_CGL_JSO")!].sort()}.`);
assert(combinedPairCoverage.get("SSC_CGL_TIER_II")!.size === 5, `Tier II combined-mean coverage reached only ${combinedPairCoverage.get("SSC_CGL_TIER_II")!.size}/5 count pairs.`);
assert(combinedPairCoverage.get("SSC_CGL_JSO")!.size === 5, `JSO combined-mean coverage reached only ${combinedPairCoverage.get("SSC_CGL_JSO")!.size}/5 count pairs.`);

const scope = dirname(fileURLToPath(import.meta.url));
const sharedScope = join(scope, "..", "shared");
const forbiddenRandomToken = "Math" + ".random(";
for (const directory of [scope, sharedScope]) {
  for (const file of walkFiles(directory).filter((path) => path.endsWith(".ts"))) {
    const source = readFileSync(file, "utf8");
    assert(!source.includes(forbiddenRandomToken), `Non-deterministic random source is prohibited in STAT-001: ${file}`);
  }
}

console.log(JSON.stringify({
  status: "PASS_STAT_001_CENTRAL_TENDENCY_PHASE0",
  questions: questionCount,
  deterministicReplayChecks,
  independentVerificationChecks,
  optionChecks,
  learnerSurfaceChecks,
  lifecycleChecks,
  contractCount: STA001_CONTRACTS.length,
  questionIds: questionIds.size,
  medianParity: Object.fromEntries([...medianParity].map(([profile, values]) => [profile, [...values].sort()])),
  missingCountCoverage: Object.fromEntries([...missingCountCoverage].map(([profile, values]) => [profile, [...values].sort((a, b) => a - b)])),
  correctedCountCoverage: Object.fromEntries([...correctedCountCoverage].map(([profile, values]) => [profile, [...values].sort((a, b) => a - b)])),
  combinedPairCoverage: Object.fromEntries([...combinedPairCoverage].map(([profile, values]) => [profile, [...values].sort()])),
  answerPositionCoverage: Object.fromEntries([...answerPositions].map(([key, values]) => [key, [...values].sort()])),
  stemSkeletonCoverage: Object.fromEntries([...stemSkeletons].map(([key, values]) => [key, values.size])),
  misconceptionCoverage: Object.fromEntries([...misconceptionCoverage].map(([key, values]) => [key, values.size])),
}));
