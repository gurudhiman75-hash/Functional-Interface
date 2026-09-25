import { DI010_TASK_KINDS, generateDi010FrequencyPolygonSet } from "./frequency-polygon-set";
import { verifyDi010SetIndependently } from "./independent-verifier";
import { renderDiFrequencyPolygonSvg } from "../visuals/frequency-polygon-svg";
import type { Di010DistributionShape, Di010ExamProfile, Di010TaskKind } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function learnerText(question: { stem: string; options: readonly string[]; answer: string; explanation: { keyIdea: string; steps: readonly string[]; workingTable?: { headers: readonly string[]; rows: readonly (readonly string[])[] } } }) {
  const table = question.explanation.workingTable;
  return [question.stem, ...question.options, question.answer, question.explanation.keyIdea, ...question.explanation.steps, ...(table?.headers ?? []), ...(table?.rows.flat() ?? [])].join(" ");
}

function svgText(svg: string) {
  return [...svg.matchAll(/<(?:title|desc|text)[^>]*>([^<]*)<\/(?:title|desc|text)>/g)].map((match) => match[1] ?? "").join(" ");
}

const profiles: readonly Di010ExamProfile[] = ["SSC_CGL_TIER_I", "SSC_CGL_TIER_II"];
const taskCounts = new Map<Di010TaskKind, number>(DI010_TASK_KINDS.map((kind) => [kind, 0]));
const answerPositions = new Map<Di010TaskKind, Set<number>>(DI010_TASK_KINDS.map((kind) => [kind, new Set<number>()]));
const stemSurfaces = new Map<Di010TaskKind, Set<number>>(DI010_TASK_KINDS.map((kind) => [kind, new Set<number>()]));
const shapes = new Set<Di010DistributionShape>();
const classCounts = new Set<number>();
const orderSignatures = new Set<string>();
let sets = 0;
let questions = 0;
let independentVerifications = 0;
let optionChecks = 0;

for (const profile of profiles) {
  for (let index = 0; index < 120; index += 1) {
    const seed = `DI010-P2-${profile}-${String(index + 1).padStart(3, "0")}`;
    const first = generateDi010FrequencyPolygonSet({ seed, examProfile: profile });
    const replay = generateDi010FrequencyPolygonSet({ seed, examProfile: profile });
    assert(JSON.stringify(first) === JSON.stringify(replay), `${seed}: deterministic replay failed.`);
    assert(first.validation.valid, `${seed}: internal validation failed.`);
    assert(first.questions.length === 5, `${seed}: wrong question count.`);
    assert(first.questions.filter((question) => question.difficulty === "Easy").length === 1, `${seed}: easy count drifted.`);
    assert(first.questions.filter((question) => question.difficulty === "Medium").length === 2, `${seed}: medium count drifted.`);
    assert(first.questions.filter((question) => question.difficulty === "Hard").length === 2, `${seed}: hard count drifted.`);
    assert(!("svg" in first.stimulus), `${seed}: presentation markup leaked into semantic stimulus.`);

    const independent = verifyDi010SetIndependently(first);
    assert(independent.valid, `${seed}: independent verifier failed: ${independent.failures.join(" | ")}`);
    independentVerifications += 1;

    const svg = renderDiFrequencyPolygonSvg(first.stimulus);
    assert(svg.includes('data-frequency-polygon="true"'), `${seed}: shared renderer lost frequency-polygon identity.`);
    assert(svg.includes('data-straight-segments="true"'), `${seed}: renderer no longer guarantees straight segments.`);
    assert(svg.includes('data-zero-closing-endpoints="true"'), `${seed}: renderer lost zero-endpoint contract.`);
    assert(svg.includes('data-closing-endpoint="left"') && svg.includes('data-closing-endpoint="right"'), `${seed}: closing endpoints are missing.`);
    assert((svg.match(/data-point-index=/g) ?? []).length === first.stimulus.classes.length, `${seed}: plotted data-point count does not match class count.`);
    assert((svg.match(/data-x-label=/g) ?? []).length === first.stimulus.classes.length, `${seed}: class-mark label count drifted.`);
    assert(!svg.includes("data-point-value"), `${seed}: point-value labels would leak graph-reading answers.`);
    assert(!/\d+\.\d+/u.test(svgText(svg)), `${seed}: visible polygon text contains decimal values.`);

    shapes.add(first.stimulus.shape);
    classCounts.add(first.stimulus.classes.length);
    orderSignatures.add(first.questions.map((question) => question.kind).join("|"));
    first.questions.forEach((question) => {
      questions += 1;
      taskCounts.set(question.kind, (taskCounts.get(question.kind) ?? 0) + 1);
      answerPositions.get(question.kind)!.add(question.correctIndex);
      stemSurfaces.get(question.kind)!.add(Number(question.evidence.surfaceId));
      assert(question.options.length === 4 && new Set(question.options).size === 4, `${question.questionId}: invalid options.`);
      assert(question.options[question.correctIndex] === question.answer, `${question.questionId}: answer index mismatch.`);
      assert(!/\d+\.\d+/u.test(learnerText(question)), `${question.questionId}: decimal learner-facing value leaked.`);
      assert(!/associated|shortcut|common trap|\btrap\b/i.test(question.stem), `${question.questionId}: banned machine-like wording leaked into stem.`);
      assert(!/\bbars?\b/iu.test(`${question.stem} ${question.explanation.keyIdea} ${question.explanation.steps.join(" ")}`), `${question.questionId}: unnecessary histogram-shape wording leaked into learner text.`);
      assert(!/^What class mark is used|^What is the coordinate of the point|absolute difference between the plotted frequencies/i.test(question.stem), `${question.questionId}: rejected P0-style mechanical stem leaked into P2.`);
      assert(!/\d+(?:\.\d+)?–\d+(?:\.\d+)?–\d+(?:\.\d+)?–\d+(?:\.\d+)?/.test(question.stem), `${question.questionId}: concatenated class intervals leaked into the stem.`);
      if (question.kind === "GROUPED_MEAN_FROM_POLYGON" || question.kind === "MEDIAN_CLASS_FROM_POLYGON") {
        assert(Boolean(question.explanation.workingTable), `${question.questionId}: grouped-data hard question requires a working table.`);
      }
      optionChecks += question.options.length;
    });
    sets += 1;
  }
}

assert(shapes.size === 6, `Expected all 6 controlled shapes, saw ${[...shapes].join(", ")}.`);
assert([5, 6, 7, 8].every((count) => classCounts.has(count)), `Expected class counts 5–8, saw ${[...classCounts].sort().join(", ")}.`);
assert(orderSignatures.size >= 45, `Question-order diversity is too low: ${orderSignatures.size}.`);
for (const kind of DI010_TASK_KINDS) {
  assert((taskCounts.get(kind) ?? 0) >= 20, `${kind}: insufficient coverage (${taskCounts.get(kind) ?? 0}).`);
  assert(answerPositions.get(kind)!.size === 4, `${kind}: correct answers did not reach all A/B/C/D positions.`);
  assert(stemSurfaces.get(kind)!.size >= 3, `${kind}: fewer than three stem surfaces were exercised.`);
}

console.log(JSON.stringify({
  status: "PASS_DI_010_FREQUENCY_POLYGON_P3_NO_DECIMALS",
  sets,
  questions,
  deterministicReplays: sets,
  independentVerifications,
  optionChecks,
  profiles,
  taskKinds: DI010_TASK_KINDS,
  shapes: [...shapes].sort(),
  classCounts: [...classCounts].sort(),
  orderSignatures: orderSignatures.size,
}));
