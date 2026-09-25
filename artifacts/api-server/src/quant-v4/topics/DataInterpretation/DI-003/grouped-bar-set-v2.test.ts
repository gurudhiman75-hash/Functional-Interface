import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderDiGroupedBarSvg, DI_GROUPED_BAR_COLOR_PALETTE, DI_GROUPED_BAR_VISUAL_THEME } from "../visuals/grouped-bar-svg";
import { independentlyVerifyDi003V2QuestionSet } from "./independent-verifier-v2";
import { DI003_V2_TASK_KINDS, generateDi003GroupedBarV2Set } from "./grouped-bar-set-v2";
import type { Di003V2ExamProfile, Di003V2TaskKind } from "./grouped-bar-v2-types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown) {
  return JSON.stringify(value);
}

function learnerText(question: { stem: string; options: readonly string[]; answer: string; explanation: { keyIdea: string; steps: readonly string[]; workingTable?: { headers: readonly string[]; rows: readonly (readonly string[])[] } } }) {
  const table = question.explanation.workingTable;
  return [question.stem, ...question.options, question.answer, question.explanation.keyIdea, ...question.explanation.steps, ...(table?.headers ?? []), ...(table?.rows.flat() ?? [])].join(" ");
}

function visibleSvgText(svg: string) {
  return [...svg.matchAll(/<(?:title|desc|text)[^>]*>([^<]*)<\/(?:title|desc|text)>/gu)].map((match) => match[1] ?? "").join(" ");
}

function walkFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walkFiles(path) : [path];
  });
}

function semanticProjection(set: ReturnType<typeof generateDi003GroupedBarV2Set>) {
  return {
    stimulus: set.stimulus,
    questions: set.questions.map((question) => ({
      kind: question.kind,
      difficulty: question.difficulty,
      stemSurfaceId: question.stemSurfaceId,
      stem: question.stem,
      answer: question.answer,
      explanation: question.explanation,
      evidence: question.evidence,
    })),
  };
}

function visualFor(set: ReturnType<typeof generateDi003GroupedBarV2Set>) {
  return renderDiGroupedBarSvg({
    title: set.stimulus.title,
    yAxisLabel: set.stimulus.yAxisLabel,
    seriesALabel: set.stimulus.series[0].label,
    seriesBLabel: set.stimulus.series[1].label,
    points: set.stimulus.points,
  });
}

const profiles: readonly Di003V2ExamProfile[] = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"];
const familyCount = new Map<Di003V2TaskKind, number>(DI003_V2_TASK_KINDS.map((kind) => [kind, 0]));
const stemSurfaces = new Map<Di003V2TaskKind, Set<string>>(DI003_V2_TASK_KINDS.map((kind) => [kind, new Set()]));
const answerPositions = new Map<string, Set<number>>();
for (const profile of profiles) for (const kind of DI003_V2_TASK_KINDS) answerPositions.set(`${profile}:${kind}`, new Set());

const contexts = new Set<string>();
const stimulusFingerprints = new Set<string>();
const orderSignatures = new Set<string>();
let setCount = 0;
let questionCount = 0;
let deterministicReplays = 0;
let independentVerifications = 0;
let optionChecks = 0;
let crossProfileParityChecks = 0;
let visualChecks = 0;

for (let seedIndex = 1; seedIndex <= 120; seedIndex += 1) {
  const seed = `DI-003-V2-PROOF-${seedIndex}`;
  const byProfile = new Map<Di003V2ExamProfile, ReturnType<typeof generateDi003GroupedBarV2Set>>();

  for (const profile of profiles) {
    const first = generateDi003GroupedBarV2Set({ seed, examProfile: profile });
    const replay = generateDi003GroupedBarV2Set({ seed, examProfile: profile });
    assert(stable(first) === stable(replay), `${profile} ${seed} is not deterministic.`);
    deterministicReplays += 1;
    assert(first.validation.valid, `${profile} ${seed} failed internal V2 validation.`);
    assert(independentlyVerifyDi003V2QuestionSet(first), `${profile} ${seed} failed independent verification.`);
    independentVerifications += 1;

    assert(first.questions.length === 5, `${profile} ${seed} must contain five questions.`);
    assert(new Set(first.questions.map((question) => question.kind)).size === 5, `${profile} ${seed} repeats a task family.`);
    assert(first.questions.filter((question) => question.difficulty === "Easy").length === 1, `${profile} ${seed} must contain exactly one Easy question.`);
    assert(first.questions.filter((question) => question.difficulty === "Medium").length === 2, `${profile} ${seed} must contain exactly two Medium questions.`);
    assert(first.questions.filter((question) => question.difficulty === "Hard").length === 2, `${profile} ${seed} must contain exactly two Hard questions.`);
    assert(first.optionCount === (profile === "SSC_CGL_TIER_I" ? 4 : 5), `${profile} ${seed} has the wrong option profile.`);
    assert(first.traceability.questionStudioDiscoverable === false, `${profile} ${seed} leaked Question Studio discovery.`);
    assert(first.traceability.questionBankStatus === "NOT_STORED" && first.traceability.questionBankWritable === false, `${profile} ${seed} leaked Question Bank authority.`);
    assert(first.traceability.testEligibility === "INELIGIBLE" && first.traceability.testEligible === false && first.traceability.mockTestEligible === false, `${profile} ${seed} leaked test/mock eligibility.`);
    assert(first.traceability.publiclyPublishable === false && first.traceability.automaticStudentPublication === false && first.traceability.productionReleaseAuthorized === false, `${profile} ${seed} leaked publication authority.`);

    for (const question of first.questions) {
      assert(question.options.length === first.optionCount, `${question.questionId} has the wrong option count.`);
      assert(question.optionMetadata.length === first.optionCount, `${question.questionId} option metadata count drifted.`);
      assert(new Set(question.options).size === first.optionCount, `${question.questionId} has duplicate options.`);
      assert(question.options[question.correctIndex] === question.answer, `${question.questionId} correct index does not point to the answer.`);
      assert(!/\d+\.\d+/u.test(learnerText(question)), `${question.questionId} exposes decimal learner-facing values.`);
      assert(question.optionMetadata[question.correctIndex]?.misconceptionId === "CORRECT", `${question.questionId} lost correct-option metadata.`);
      assert(question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1, `${question.questionId} has multiple correct metadata entries.`);
      assert(question.explanation.keyIdea.length >= 20 && question.explanation.steps.length >= 2, `${question.questionId} explanation is too thin.`);
      assert(!/associated|shortcut|common trap|\btrap\b/iu.test(`${question.stem} ${question.explanation.keyIdea} ${question.explanation.steps.join(" ")}`), `${question.questionId} contains blocked learner wording.`);
      assert(!/generator|question library|ql[- ]?id|review[- ]?only/iu.test(question.stem), `${question.questionId} leaks internal wording.`);
      familyCount.set(question.kind, familyCount.get(question.kind)! + 1);
      stemSurfaces.get(question.kind)!.add(question.stemSurfaceId);
      answerPositions.get(`${profile}:${question.kind}`)!.add(question.correctIndex);
      optionChecks += question.options.length;
      questionCount += 1;
    }

    const svg = visualFor(first);
    assert(svg.includes(`data-di-chart-theme="${DI_GROUPED_BAR_VISUAL_THEME}"`), `${profile} ${seed} lost the grouped-bar theme marker.`);
    assert(svg.includes(`data-color-palette="${DI_GROUPED_BAR_COLOR_PALETTE}"`), `${profile} ${seed} lost the grouped-bar palette marker.`);
    assert(svg.includes('data-di-presentation-layer="shared"') && svg.includes('data-grouped-bar="true"'), `${profile} ${seed} bypassed the shared grouped-bar presentation layer.`);
    assert(svg.includes('data-clean-axis="true"') && svg.includes('data-vertical-axis-spine="none"') && svg.includes('data-boundary-ticks="none"'), `${profile} ${seed} lost clean-axis metadata.`);
    assert(!svg.includes('<line data-axis="y"') && !svg.includes("<line data-y-tick") && !svg.includes("<line data-boundary-tick"), `${profile} ${seed} contains a prohibited vertical axis/tick line.`);
    assert(svg.includes('data-bar-value-labels="none"'), `${profile} ${seed} must not print bar values above the bars.`);
    assert((svg.match(/data-bar="true"/gu) ?? []).length === 10, `${profile} ${seed} must render exactly ten bars.`);
    assert((svg.match(/data-series-id="SERIES_A"/gu) ?? []).length === 5 && (svg.match(/data-series-id="SERIES_B"/gu) ?? []).length === 5, `${profile} ${seed} must render five bars per series.`);
    assert((svg.match(/data-category-label=/gu) ?? []).length === 5, `${profile} ${seed} must render five category labels.`);
    assert((svg.match(/data-legend="true"/gu) ?? []).length === 1, `${profile} ${seed} must render one legend.`);
    assert(!/\d+\.\d+/u.test(visibleSvgText(svg)), `${profile} ${seed} visible grouped-bar text contains decimals.`);
    const gridlineCount = (svg.match(/data-gridline=/gu) ?? []).length;
    const lineCount = (svg.match(/<line /gu) ?? []).length;
    assert(gridlineCount >= 4 && lineCount === gridlineCount + 1, `${profile} ${seed} must contain only horizontal guides plus one baseline.`);
    const yLabels = new Set([...svg.matchAll(/data-y-label="\d+"[^>]*>([^<]+)<\/text>/gu)].map((match) => Number(match[1])));
    for (const point of first.stimulus.points) {
      assert(yLabels.has(point.seriesA) && yLabels.has(point.seriesB), `${profile} ${seed} chart scale does not explicitly label every generated bar value.`);
    }
    visualChecks += 1;

    contexts.add(first.stimulus.contextId);
    stimulusFingerprints.add(stable(first.stimulus));
    orderSignatures.add(first.questions.map((question) => question.kind).join("|"));
    byProfile.set(profile, first);
    setCount += 1;
  }

  const ssc = byProfile.get("SSC_CGL_TIER_I")!;
  const banking = byProfile.get("BANKING_PRELIMS")!;
  assert(stable(semanticProjection(ssc)) === stable(semanticProjection(banking)), `${seed} changed semantic content across exam profiles.`);
  crossProfileParityChecks += 1;
}

assert(setCount === 240 && questionCount === 1200, `Unexpected proof size: ${setCount} sets / ${questionCount} questions.`);
assert(contexts.size === 6, `DI-003 V2 reached only ${contexts.size}/6 contexts.`);
assert(stimulusFingerprints.size >= 110, `DI-003 V2 produced only ${stimulusFingerprints.size} distinct stimuli.`);
assert(orderSignatures.size >= 70, `DI-003 V2 produced only ${orderSignatures.size} five-question order signatures.`);
for (const kind of DI003_V2_TASK_KINDS) {
  assert(familyCount.get(kind)! >= 20, `${kind} appeared only ${familyCount.get(kind)} times.`);
  assert(stemSurfaces.get(kind)!.size === 3, `${kind} did not reach all three stem surfaces.`);
  for (const profile of profiles) {
    const positions = answerPositions.get(`${profile}:${kind}`)!;
    const expected = profile === "SSC_CGL_TIER_I" ? 4 : 5;
    assert(positions.size === expected, `${profile}:${kind} reached only ${positions.size}/${expected} answer positions.`);
  }
}

const scope = dirname(fileURLToPath(import.meta.url));
const forbiddenRandomToken = "Math" + ".random(";
for (const file of walkFiles(scope).filter((path) => path.endsWith(".ts"))) {
  assert(!readFileSync(file, "utf8").includes(forbiddenRandomToken), `Non-deterministic random source is prohibited in DI-003: ${file}`);
}

console.log(JSON.stringify({
  status: "PASS_DI_003_GROUPED_BAR_V3_NO_DECIMALS",
  sets: setCount,
  questions: questionCount,
  deterministicReplays,
  independentVerifications,
  optionChecks,
  crossProfileParityChecks,
  visualChecks,
  contexts: [...contexts].sort(),
  distinctStimuli: stimulusFingerprints.size,
  orderSignatures: orderSignatures.size,
  familyCount: Object.fromEntries(familyCount),
  stemSurfaceCoverage: Object.fromEntries([...stemSurfaces].map(([kind, surfaces]) => [kind, [...surfaces].sort()])),
  answerPositionCoverage: Object.fromEntries([...answerPositions].map(([key, positions]) => [key, [...positions].sort()])),
}));
