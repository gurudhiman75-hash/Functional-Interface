import { generateDi009HistogramSet } from "./histogram-set";
import { independentlyVerifyDi009QuestionSet } from "./independent-verifier";
import type { Di009ExamProfile, Di009TaskKind } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const profiles: readonly Di009ExamProfile[] = ["SSC_CGL_TIER_I", "SSC_CGL_TIER_II"];
const taskKinds: readonly Di009TaskKind[] = [
  "DIRECT_CLASS_FREQUENCY",
  "COMBINED_RANGE_TOTAL",
  "RANGE_RATIO",
  "CLASS_SHARE_OF_TOTAL",
  "MODAL_CLASS_IDENTIFICATION",
  "APPROX_GROUPED_MEAN_FROM_HISTOGRAM",
];

let setCount = 0;
let questionCount = 0;
const positionCoverage = new Map<string, Set<number>>();
const stateCoverage = new Map<Di009ExamProfile, Set<string>>();

for (const profile of profiles) {
  stateCoverage.set(profile, new Set());
  for (const task of taskKinds) positionCoverage.set(`${profile}:${task}`, new Set());
  for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
    const seed = `DI-009-P0-${profile}-${seedIndex}`;
    const first = generateDi009HistogramSet({ seed, examProfile: profile });
    const replay = generateDi009HistogramSet({ seed, examProfile: profile });
    assert(JSON.stringify(first) === JSON.stringify(replay), `${profile} ${seed} is not deterministic.`);
    assert(first.validation.valid, `${profile} ${seed} failed package validation.`);
    assert(independentlyVerifyDi009QuestionSet(first), `${profile} ${seed} failed independent verification.`);
    assert(first.stimulus.kind === "HISTOGRAM", `${profile} ${seed} lost histogram semantics.`);
    assert(first.stimulus.bins.length === 6, `${profile} ${seed} must contain six class intervals.`);
    assert(first.stimulus.bins.every((bin, index) => index === 0 || first.stimulus.bins[index - 1]!.upper === bin.lower), `${profile} ${seed} has non-contiguous histogram classes.`);
    assert((first.stimulus.svg.match(/data-bin-index=/g)?.length ?? 0) === 6, `${profile} ${seed} did not render six histogram rectangles.`);
    assert(first.stimulus.svg.includes('data-contiguous-bars="true"'), `${profile} ${seed} visual does not certify touching bars.`);
    assert(new Set(first.questions.map((question) => question.kind)).size === taskKinds.length, `${profile} ${seed} lost task-family coverage.`);
    for (const question of first.questions) {
      assert(question.options.length === 4 && new Set(question.options).size === 4, `${profile} ${seed} ${question.kind} has invalid options.`);
      assert(!/\bshortcut\b|\bcommon trap\b|\btrap\b/iu.test(`${question.explanation.keyIdea} ${question.explanation.steps.join(" ")}`), `${profile} ${seed} ${question.kind} leaked generic filler.`);
      positionCoverage.get(`${profile}:${question.kind}`)!.add(question.correctIndex);
      questionCount += 1;
    }
    stateCoverage.get(profile)!.add(first.stimulus.bins.map((bin) => `${bin.lower}-${bin.upper}:${bin.frequency}`).join("|"));
    setCount += 1;
  }
}

for (const profile of profiles) {
  assert(stateCoverage.get(profile)!.size >= 50, `${profile} histogram state diversity is too low.`);
  for (const task of taskKinds) {
    assert(positionCoverage.get(`${profile}:${task}`)!.size === 4, `${profile}:${task} did not cover A/B/C/D answer positions.`);
  }
}

console.log(JSON.stringify({
  status: "PASS_DI_009_HISTOGRAM_P0",
  sets: setCount,
  questions: questionCount,
  deterministicReplays: setCount,
  independentVerifications: setCount,
  optionChecks: questionCount * 4,
  profiles,
  taskKinds,
}));
