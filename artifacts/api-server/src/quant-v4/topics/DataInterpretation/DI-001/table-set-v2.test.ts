import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generateDi001TableV2Set, verifyDi001TableV2Set, DI001_V2_TASK_KINDS } from "./table-set-v2";
import type { Di001ExamProfile } from "./types";
import type { Di001V2TaskKind } from "./table-v2-types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value);
}

function learnerText(question: { stem: string; options: readonly string[]; answer: string; explanation: { keyIdea: string; steps: readonly string[]; workingTable?: { headers: readonly string[]; rows: readonly (readonly string[])[] } } }) {
  const table = question.explanation.workingTable;
  return [question.stem, ...question.options, question.answer, question.explanation.keyIdea, ...question.explanation.steps, ...(table?.headers ?? []), ...(table?.rows.flat() ?? [])].join(" ");
}

function walkFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walkFiles(path) : [path];
  });
}

const profiles: readonly Di001ExamProfile[] = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"];
const expectedPositions: Record<Di001ExamProfile, number> = {
  SSC_CGL_TIER_I: 4,
  BANKING_PRELIMS: 5,
};
const positions = new Map<string, Set<number>>();
const taskCounts = new Map<string, number>();
const stemSurfaces = new Map<Di001V2TaskKind, Set<string>>(
  DI001_V2_TASK_KINDS.map((kind) => [kind, new Set<string>()]),
);
const stateFingerprints = new Set<string>();
const orderSignatures = new Set<string>();
let setCount = 0;
let questionCount = 0;
let deterministicReplays = 0;
let independentVerifications = 0;
let optionChecks = 0;
let crossProfileStimulusChecks = 0;

for (let seedIndex = 1; seedIndex <= 120; seedIndex += 1) {
  const seed = `DI-001-V2-REVIEW-${seedIndex}`;
  const byProfile = new Map<Di001ExamProfile, ReturnType<typeof generateDi001TableV2Set>>();

  for (const profile of profiles) {
    const first = generateDi001TableV2Set({ seed, examProfile: profile });
    const replay = generateDi001TableV2Set({ seed, examProfile: profile });

    assert(stable(first) === stable(replay), `${profile} ${seed} is not deterministic.`);
    deterministicReplays += 1;
    assert(first.validation.valid, `${profile} ${seed} failed V2 validation.`);
    assert(verifyDi001TableV2Set(first), `${profile} ${seed} failed independent verification.`);
    independentVerifications += 1;

    assert(first.questions.length === 5, `${profile} ${seed} did not emit exactly five questions.`);
    assert(new Set(first.questions.map((question) => question.kind)).size === 5, `${profile} ${seed} repeated a task family.`);
    assert(first.questions.filter((question) => question.difficulty === "Easy").length === 1, `${profile} ${seed} lost its one-Easy contract.`);
    assert(first.questions.filter((question) => question.difficulty === "Medium").length === 2, `${profile} ${seed} lost its two-Medium contract.`);
    assert(first.questions.filter((question) => question.difficulty === "Hard").length === 2, `${profile} ${seed} lost its two-Hard contract.`);
    assert(first.optionCount === expectedPositions[profile], `${profile} ${seed} exposes the wrong option count.`);
    assert(first.stimulus.rows.length === 5, `${profile} ${seed} does not contain five table rows.`);
    assert(first.stimulus.rows.every((row) => row.selected <= row.applicants), `${profile} ${seed} has an impossible selected/applicant state.`);

    assert(first.traceability.questionStudioDiscoverable === false, `${profile} ${seed} leaked Question Studio discovery.`);
    assert(first.traceability.questionBankStatus === "NOT_STORED" && first.traceability.questionBankWritable === false, `${profile} ${seed} leaked Question Bank authority.`);
    assert(first.traceability.testEligibility === "INELIGIBLE" && first.traceability.testEligible === false && first.traceability.mockTestEligible === false, `${profile} ${seed} leaked test/mock eligibility.`);
    assert(first.traceability.publiclyPublishable === false && first.traceability.automaticStudentPublication === false && first.traceability.productionReleaseAuthorized === false, `${profile} ${seed} leaked publication authority.`);

    for (const question of first.questions) {
      assert(DI001_V2_TASK_KINDS.includes(question.kind), `${question.questionId} has an unknown task family.`);
      assert(question.options.length === first.optionCount && new Set(question.options).size === first.optionCount, `${question.questionId} has invalid options.`);
      assert(question.options[question.correctIndex] === question.answer, `${question.questionId} has incorrect answer-index binding.`);
      assert(!/\d+\.\d+/u.test(learnerText(question)), `${question.questionId} exposes decimal learner-facing values.`);
      assert(question.optionMetadata[question.correctIndex]?.misconceptionId === "CORRECT", `${question.questionId} lost correct-option metadata.`);
      assert(question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1, `${question.questionId} does not contain exactly one correct option.`);
      assert(question.optionMetadata.filter((option) => option.misconceptionId !== "CORRECT").every((option) => option.derivation.length >= 12), `${question.questionId} contains an unexplained distractor.`);
      assert(question.explanation.keyIdea.length >= 16 && question.explanation.steps.length >= 1, `${question.questionId} has an inadequate explanation.`);
      assert(!/associated|shortcut|common trap|\btrap\b/i.test(`${question.stem} ${question.explanation.keyIdea} ${question.explanation.steps.join(" ")}`), `${question.questionId} contains blocked learner-facing wording.`);

      const key = `${profile}:${question.kind}`;
      if (!positions.has(key)) positions.set(key, new Set<number>());
      positions.get(key)!.add(question.correctIndex);
      taskCounts.set(key, (taskCounts.get(key) ?? 0) + 1);
      stemSurfaces.get(question.kind)!.add(question.stem.replace(/Centre [A-Z0-9]+/g, "Centre X").replace(/\d+(?:\.\d+)?/g, "N"));
      optionChecks += question.options.length;
      questionCount += 1;
    }

    stateFingerprints.add(stable(first.stimulus.rows.map(({ applicants, selected }) => ({ applicants, selected }))));
    orderSignatures.add(first.questions.map((question) => question.kind).join("|"));
    byProfile.set(profile, first);
    setCount += 1;
  }

  const ssc = byProfile.get("SSC_CGL_TIER_I")!;
  const banking = byProfile.get("BANKING_PRELIMS")!;
  assert(stable(ssc.stimulus) === stable(banking.stimulus), `${seed} changed the semantic table across exam profiles.`);
  assert(stable(ssc.questions.map((question) => question.kind)) === stable(banking.questions.map((question) => question.kind)), `${seed} changed the task mix across exam profiles.`);
  crossProfileStimulusChecks += 1;
}

assert(stateFingerprints.size >= 80, `DI-001 V2 produced only ${stateFingerprints.size} distinct mathematical table states.`);
assert(orderSignatures.size >= 40, `DI-001 V2 produced only ${orderSignatures.size} five-question order signatures.`);

for (const profile of profiles) {
  for (const kind of DI001_V2_TASK_KINDS) {
    const key = `${profile}:${kind}`;
    assert((taskCounts.get(key) ?? 0) >= 30, `${key} appeared only ${taskCounts.get(key) ?? 0} times.`);
    assert((positions.get(key)?.size ?? 0) === expectedPositions[profile], `${key} did not cover all ${expectedPositions[profile]} correct-answer positions.`);
  }
}
for (const kind of DI001_V2_TASK_KINDS) {
  assert((stemSurfaces.get(kind)?.size ?? 0) >= 3, `${kind} did not expose at least three stem surfaces.`);
}

const scope = dirname(fileURLToPath(import.meta.url));
const forbiddenRandomToken = "Math" + ".random(";
for (const file of walkFiles(scope).filter((path) => /table-(?:set-)?v2|review-utils-v2|export-review-v2/i.test(path) && path.endsWith(".ts"))) {
  const source = readFileSync(file, "utf8");
  assert(!source.includes(forbiddenRandomToken), `Non-deterministic randomness is prohibited in DI-001 V2: ${file}`);
}

console.log(JSON.stringify({
  status: "PASS_DI_001_TABLE_V3_NO_DECIMALS",
  sets: setCount,
  questions: questionCount,
  deterministicReplays,
  independentVerifications,
  optionChecks,
  crossProfileStimulusChecks,
  distinctMathematicalStates: stateFingerprints.size,
  distinctOrderSignatures: orderSignatures.size,
  taskKinds: DI001_V2_TASK_KINDS,
}));
