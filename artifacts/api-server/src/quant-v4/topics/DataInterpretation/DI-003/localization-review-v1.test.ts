import { renderDiGroupedBarSvg } from "../visuals/grouped-bar-svg";
import { generateDi003GroupedBarV2Set } from "./grouped-bar-set-v2";
import { generateDi003LocalizedReviewQuestion, type Di003LocalizationLocale } from "./localization-review-v1";
import { DI003_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi003PermanentQuestion } from "./permanent-question-generator";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown) {
  return JSON.stringify(value);
}

function learnerText(pkg: ReturnType<typeof generateDi003LocalizedReviewQuestion>) {
  const table = pkg.question.explanation.workingTable;
  return [
    pkg.stimulus.title,
    pkg.stimulus.instruction,
    ...pkg.stimulus.categories,
    ...pkg.stimulus.series.map((series) => series.label),
    pkg.stimulus.yAxisLabel,
    pkg.stimulus.unit,
    pkg.stimulus.description,
    pkg.question.stem,
    ...pkg.question.options,
    pkg.question.answer,
    pkg.question.explanation.keyIdea,
    ...pkg.question.explanation.steps,
    ...(table?.headers ?? []),
    ...(table?.rows.flat() ?? []),
  ].join(" ");
}

function svgLearnerText(svg: string) {
  return [...svg.matchAll(/<(?:title|desc|text)[^>]*>([^<]*)<\/(?:title|desc|text)>/gu)]
    .map((match) => match[1] ?? "")
    .join(" ");
}

function normalizeLocalizedOption(
  value: string,
  localized: ReturnType<typeof generateDi003LocalizedReviewQuestion>,
  source: ReturnType<typeof generateDi003PermanentQuestion>,
) {
  const index = localized.stimulus.categories.indexOf(value);
  return index >= 0 ? source.stimulus.categories[index]! : value;
}

const locales: readonly Di003LocalizationLocale[] = ["hi-IN", "pa-IN"];
const contexts = new Set<string>();
for (const profile of ["SSC_CGL_TIER_I", "BANKING_PRELIMS"] as const) {
  for (let index = 1; index <= 180; index += 1) {
    contexts.add(generateDi003GroupedBarV2Set({ seed: `DI003-LOCALIZATION-CONTEXT-${profile}-${index}`, examProfile: profile }).stimulus.contextId);
  }
}
assert(contexts.size === 6, `DI-003 source context sweep reached ${contexts.size}/6 contexts.`);

let parityChecks = 0;
let leakageChecks = 0;
let visualChecks = 0;
let lifecycleChecks = 0;
let deterministicChecks = 0;
const surfaceCoverage = new Map<string, Set<string>>();

for (const locale of locales) {
  for (const descriptor of DI003_PERMANENT_QLS) {
    const key = `${locale}:${descriptor.qlId}`;
    surfaceCoverage.set(key, new Set<string>());

    for (let sample = 1; sample <= 30; sample += 1) {
      const examProfile = sample % 2 === 0 ? "BANKING_PRELIMS" as const : "SSC_CGL_TIER_I" as const;
      const seed = `DI003-LOCALIZATION-${locale}-${descriptor.qlId}-${sample}`;
      const source = generateDi003PermanentQuestion({ seed, examProfile, taskKind: descriptor.taskKind });
      const localized = generateDi003LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });
      const replay = generateDi003LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });

      assert(localized.question.kind === source.question.kind, `${key} task kind drifted.`);
      assert(localized.question.difficulty === source.question.difficulty, `${key} difficulty drifted.`);
      assert(localized.question.correctIndex === source.question.correctIndex, `${key} correct index changed.`);
      assert(localized.question.options.length === source.question.options.length, `${key} option count changed.`);
      assert(localized.question.options.length === (examProfile === "SSC_CGL_TIER_I" ? 4 : 5), `${key} exam-profile option shape drifted.`);
      assert(localized.stimulus.contextId === source.stimulus.contextId, `${key} context changed.`);
      assert(localized.stimulus.points.length === source.stimulus.points.length, `${key} point count changed.`);
      for (let index = 0; index < source.stimulus.points.length; index += 1) {
        const a = source.stimulus.points[index]!, b = localized.stimulus.points[index]!;
        assert(a.seriesA === b.seriesA && a.seriesB === b.seriesB, `${key} numeric chart state changed at category ${index}.`);
      }

      const normalizedOptions = localized.question.options.map((option) => normalizeLocalizedOption(option, localized, source));
      assert(stable(normalizedOptions) === stable(source.question.options), `${key} option semantics changed during localization.`);
      assert(normalizeLocalizedOption(localized.question.answer, localized, source) === source.question.answer, `${key} answer semantics changed.`);
      assert(localized.question.options[localized.question.correctIndex] === localized.question.answer, `${key} localized answer-index binding failed.`);
      parityChecks += 1;

      const text = learnerText(localized);
      assert(!/[A-Za-z]/u.test(text), `${key} leaks Roman learner-facing text: ${text}`);
      assert(!/\d+\.\d+/u.test(text), `${key} exposes decimal learner-facing values: ${text}`);
      assert(!/स्तंभ|ਸਤੰਭ/u.test(text), `${key} uses literal column/pillar wording on a DI learner surface: ${text}`);
      if (locale === "hi-IN") assert(/[\u0900-\u097F]/u.test(text), `${key} lacks Devanagari learner text.`);
      else assert(/[\u0A00-\u0A7F]/u.test(text), `${key} lacks Gurmukhi learner text.`);
      assert(localized.question.explanation.steps.length >= 2, `${key} localized explanation is too thin.`);
      if (["SERIES_AVERAGE","COMBINED_CATEGORY_RATIO","PERCENT_CHANGE_WITHIN_SERIES","CATEGORY_SHARE_OF_SERIES_TOTAL","TOTAL_SERIES_PERCENT_EXCESS"].includes(descriptor.taskKind)) {
        assert(localized.question.explanation.workingTable, `${key} lost its useful working table.`);
      }
      leakageChecks += 1;

      const svg = renderDiGroupedBarSvg({
        title: localized.stimulus.title,
        yAxisLabel: localized.stimulus.yAxisLabel,
        seriesALabel: localized.stimulus.series[0].label,
        seriesBLabel: localized.stimulus.series[1].label,
        points: localized.stimulus.points,
        description: localized.stimulus.description,
      });
      assert(svg.includes('data-di-presentation-layer="shared"') && svg.includes('data-grouped-bar="true"'), `${key} bypassed the shared grouped-bar renderer.`);
      const svgText = svgLearnerText(svg);
      assert(!/[A-Za-z]/u.test(svgText), `${key} localized grouped-bar text leaks Roman content: ${svgText}`);
      assert(!/\d+\.\d+/u.test(svgText), `${key} localized grouped-bar shows decimal labels: ${svgText}`);
      if (locale === "hi-IN") assert(/[\u0900-\u097F]/u.test(svgText), `${key} grouped-bar lacks Devanagari text.`);
      else assert(/[\u0A00-\u0A7F]/u.test(svgText), `${key} grouped-bar lacks Gurmukhi text.`);
      visualChecks += 1;

      assert(localized.localizationStatus === "HI_PA_REVIEW_CANDIDATE", `${key} localization status drifted.`);
      assert(localized.traceability.questionStudioDiscoverable === false, `${key} became Question Studio discoverable before approval.`);
      assert(localized.traceability.questionBankWritable === false && localized.traceability.testEligible === false && localized.traceability.mockTestEligible === false, `${key} widened learner lifecycle authority.`);
      assert(localized.traceability.publiclyPublishable === false && localized.traceability.automaticStudentPublication === false && localized.traceability.productionReleaseAuthorized === false, `${key} widened publication authority.`);
      lifecycleChecks += 1;

      assert(stable(localized) === stable(replay), `${key} is not deterministic for a fixed seed.`);
      deterministicChecks += 1;
      surfaceCoverage.get(key)!.add(localized.question.stemSurfaceId);
    }
  }
}

for (const [key, surfaces] of surfaceCoverage) {
  assert(surfaces.size === 3, `${key} exercised only ${surfaces.size}/3 localized stem surfaces.`);
}

console.log(JSON.stringify({
  status: "PASS_DI_003_HI_PA_LOCALIZATION_REVIEW_V1",
  sourceContexts: contexts.size,
  permanentQlCount: DI003_PERMANENT_QLS.length,
  locales,
  parityChecks,
  leakageChecks,
  visualChecks,
  lifecycleChecks,
  deterministicChecks,
  localizedSurfaceFamilies: surfaceCoverage.size,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}));
