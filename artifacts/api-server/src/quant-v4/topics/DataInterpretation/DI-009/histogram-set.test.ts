import { generateDi009HistogramSet } from "./histogram-set";
import { independentlyVerifyDi009QuestionSet } from "./independent-verifier";
import type { Di009DistributionShape, Di009ExamProfile, Di009TaskKind } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const profiles: readonly Di009ExamProfile[] = ["SSC_CGL_TIER_I", "SSC_CGL_TIER_II"];
const taskKinds: readonly Di009TaskKind[] = [
  "DIRECT_CLASS_FREQUENCY",
  "TOTAL_FREQUENCY",
  "COMBINED_RANGE_TOTAL",
  "ABOVE_BOUNDARY_TOTAL",
  "BELOW_BOUNDARY_TOTAL",
  "RANGE_RATIO",
  "CLASS_SHARE_OF_TOTAL",
  "FREQUENCY_DIFFERENCE_BETWEEN_CLASSES",
  "MODAL_CLASS_IDENTIFICATION",
  "MEDIAN_CLASS_IDENTIFICATION",
  "KTH_OBSERVATION_CLASS",
  "APPROX_GROUPED_MEAN_FROM_HISTOGRAM",
  "APPROX_GROUPED_MODE_FROM_HISTOGRAM",
];
const shapes: readonly Di009DistributionShape[] = [
  "UNIMODAL",
  "RIGHT_SKEWED",
  "LEFT_SKEWED",
  "ASCENDING",
  "DESCENDING",
  "CONTROLLED_IRREGULAR",
];

let setCount = 0;
let questionCount = 0;
const taskCount = new Map<string, number>();
const positionCoverage = new Map<string, Set<number>>();
const surfaceCoverage = new Map<string, Set<number>>();
const stateCoverage = new Map<Di009ExamProfile, Set<string>>();
const shapeCoverage = new Map<Di009ExamProfile, Set<Di009DistributionShape>>();
const classCountCoverage = new Map<Di009ExamProfile, Set<number>>();
const sequenceCoverage = new Map<Di009ExamProfile, Set<string>>();

for (const profile of profiles) {
  stateCoverage.set(profile, new Set());
  shapeCoverage.set(profile, new Set());
  classCountCoverage.set(profile, new Set());
  sequenceCoverage.set(profile, new Set());
  for (const task of taskKinds) {
    taskCount.set(`${profile}:${task}`, 0);
    positionCoverage.set(`${profile}:${task}`, new Set());
    surfaceCoverage.set(`${profile}:${task}`, new Set());
  }

  let previousSequence = "";
  for (let seedIndex = 1; seedIndex <= 120; seedIndex += 1) {
    const seed = `DI-009-V2-${profile}-${seedIndex}`;
    const first = generateDi009HistogramSet({ seed, examProfile: profile });
    const replay = generateDi009HistogramSet({ seed, examProfile: profile });
    assert(JSON.stringify(first) === JSON.stringify(replay), `${profile} ${seed} is not deterministic.`);
    assert(first.validation.valid, `${profile} ${seed} failed package validation.`);
    assert(independentlyVerifyDi009QuestionSet(first), `${profile} ${seed} failed independent verification.`);
    assert(first.stimulus.kind === "HISTOGRAM", `${profile} ${seed} lost histogram semantics.`);
    assert(first.stimulus.bins.length >= 5 && first.stimulus.bins.length <= 9, `${profile} ${seed} has invalid class count.`);
    assert(first.stimulus.bins.every((bin, index) => index === 0 || first.stimulus.bins[index - 1]!.upper === bin.lower), `${profile} ${seed} has non-contiguous classes.`);

    const svg = first.stimulus.svg;
    assert((svg.match(/data-bin-index=/g)?.length ?? 0) === first.stimulus.bins.length, `${profile} ${seed} rendered wrong histogram rectangle count.`);
    assert(svg.includes('data-contiguous-bars="true"'), `${profile} ${seed} visual does not certify touching bars.`);
    assert(svg.includes('data-di-chart-theme="EXAMTREE_DI_WORLD_CLASS_V3"'), `${profile} ${seed} lost the approved ExamTree DI V3 chart theme.`);
    assert(svg.includes('data-renderer-version="V3"'), `${profile} ${seed} lost the V3 renderer marker.`);
    assert(svg.includes('data-plot-area="true"'), `${profile} ${seed} lost the chart plot-area contract.`);
    assert((svg.match(/data-gridline=/g)?.length ?? 0) >= 4, `${profile} ${seed} has too few y-axis reading guides.`);
    assert((svg.match(/data-class-interval-label=/g)?.length ?? 0) === first.stimulus.bins.length, `${profile} ${seed} must show one centered interval label per bar.`);
    assert((svg.match(/data-boundary-tick=/g)?.length ?? 0) === first.stimulus.bins.length + 1, `${profile} ${seed} must retain all histogram class-boundary tick marks.`);
    assert(svg.includes('preserveAspectRatio="xMidYMid meet"'), `${profile} ${seed} lost responsive SVG scaling metadata.`);
    assert(svg.includes("<title>") && svg.includes("<desc>"), `${profile} ${seed} lost accessible SVG title/description metadata.`);
    assert(!svg.includes("data-bar-value-label="), `${profile} ${seed} must not expose answer-helping bar value labels.`);

    assert(first.questions.length === 5 && new Set(first.questions.map((question) => question.kind)).size === 5, `${profile} ${seed} must contain five distinct task families.`);
    assert(first.questions.filter((question) => question.difficulty === "Easy").length === 1, `${profile} ${seed} lost Easy quota.`);
    assert(first.questions.filter((question) => question.difficulty === "Medium").length === 2, `${profile} ${seed} lost Medium quota.`);
    assert(first.questions.filter((question) => question.difficulty === "Hard").length === 2, `${profile} ${seed} lost Hard quota.`);

    const sequence = first.questions.map((question) => question.kind).join(">");
    assert(sequence !== previousSequence, `${profile} repeated the exact five-question order on consecutive seeds at ${seed}.`);
    previousSequence = sequence;
    sequenceCoverage.get(profile)!.add(sequence);

    for (const question of first.questions) {
      assert(question.options.length === 4 && new Set(question.options).size === 4, `${profile} ${seed} ${question.kind} has invalid options.`);
      assert(!/\bassociated\b|\bshortcut\b|\bcommon trap\b|\btrap\b/iu.test(`${question.stem} ${question.explanation.keyIdea} ${question.explanation.steps.join(" ")}`), `${profile} ${seed} ${question.kind} leaked machine-like filler.`);
      const tableRequired = new Set<Di009TaskKind>(["MEDIAN_CLASS_IDENTIFICATION", "KTH_OBSERVATION_CLASS", "APPROX_GROUPED_MEAN_FROM_HISTOGRAM", "APPROX_GROUPED_MODE_FROM_HISTOGRAM"]);
      if (tableRequired.has(question.kind)) assert(question.explanation.workingTable, `${profile} ${seed} ${question.kind} is missing its working table.`);
      const key = `${profile}:${question.kind}`;
      taskCount.set(key, taskCount.get(key)! + 1);
      positionCoverage.get(key)!.add(question.correctIndex);
      surfaceCoverage.get(key)!.add(Number(question.evidence.surfaceId));
      questionCount += 1;
    }

    const state = `${first.stimulus.shape}|${first.stimulus.bins.map((bin) => `${bin.lower}-${bin.upper}:${bin.frequency}`).join("|")}`;
    stateCoverage.get(profile)!.add(state);
    shapeCoverage.get(profile)!.add(first.stimulus.shape);
    classCountCoverage.get(profile)!.add(first.stimulus.bins.length);
    setCount += 1;
  }
}

for (const profile of profiles) {
  assert(stateCoverage.get(profile)!.size >= 105, `${profile} histogram state diversity is too low.`);
  assert(shapeCoverage.get(profile)!.size === shapes.length, `${profile} did not exercise all six distribution shapes.`);
  assert(classCountCoverage.get(profile)!.size === 5, `${profile} did not exercise all class counts from 5 to 9.`);
  assert(sequenceCoverage.get(profile)!.size >= 70, `${profile} question-order diversity is too low.`);
  for (const task of taskKinds) {
    const key = `${profile}:${task}`;
    assert(taskCount.get(key)! >= 8, `${key} appeared too rarely for a production-grade library.`);
    assert(positionCoverage.get(key)!.size === 4, `${key} did not cover A/B/C/D answer positions.`);
    assert(surfaceCoverage.get(key)!.size >= 3, `${key} did not exercise at least three stem surfaces.`);
  }
}

console.log(JSON.stringify({
  status: "PASS_DI_009_HISTOGRAM_V3_VISUAL",
  diagramTheme: "EXAMTREE_DI_WORLD_CLASS_V3",
  sets: setCount,
  questions: questionCount,
  deterministicReplays: setCount,
  independentVerifications: setCount,
  optionChecks: questionCount * 4,
  profiles,
  taskKinds,
  shapes,
  classCounts: [5, 6, 7, 8, 9],
}));
