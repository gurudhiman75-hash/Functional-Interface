import { renderDiHistogramSvg } from "../visuals/histogram-svg";
import { generateDi009HistogramSet } from "./histogram-set";
import {
  generateDi009LocalizedReviewQuestion,
  type Di009LocalizationLocale,
} from "./localization-review-v1";
import { DI009_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi009PermanentQuestion } from "./permanent-question-generator";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown) {
  return JSON.stringify(value);
}

function learnerText(pkg: ReturnType<typeof generateDi009LocalizedReviewQuestion>) {
  const workingTable = pkg.question.explanation.workingTable;
  return [
    pkg.stimulus.title,
    pkg.stimulus.instruction,
    pkg.stimulus.xAxisLabel,
    pkg.stimulus.yAxisLabel,
    pkg.stimulus.unit,
    pkg.stimulus.description,
    pkg.question.stem,
    ...pkg.question.options,
    pkg.question.explanation.keyIdea,
    ...pkg.question.explanation.steps,
    ...(workingTable?.headers ?? []),
    ...(workingTable?.rows.flat() ?? []),
  ].join(" ");
}

function svgLearnerText(svg: string) {
  return [...svg.matchAll(/<(?:title|desc|text)[^>]*>([^<]*)<\/(?:title|desc|text)>/g)]
    .map((match) => match[1] ?? "")
    .join(" ");
}

const locales: readonly Di009LocalizationLocale[] = ["hi-IN", "pa-IN"];
const contexts = new Set<string>();

for (const profile of ["SSC_CGL_TIER_I", "SSC_CGL_TIER_II"] as const) {
  for (let index = 1; index <= 160; index += 1) {
    contexts.add(generateDi009HistogramSet({ seed: `DI009-LOCALIZATION-CONTEXT-${profile}-${index}`, examProfile: profile }).stimulus.title);
  }
}

assert(contexts.size === 6, `DI-009 source context sweep reached ${contexts.size}/6 contexts.`);

let parityChecks = 0;
let leakageChecks = 0;
let svgChecks = 0;
let lifecycleChecks = 0;
let deterministicChecks = 0;
const surfaceCoverage = new Map<string, Set<number>>();

for (const locale of locales) {
  for (const descriptor of DI009_PERMANENT_QLS) {
    const key = `${locale}:${descriptor.qlId}`;
    surfaceCoverage.set(key, new Set<number>());

    for (let sample = 1; sample <= 30; sample += 1) {
      const examProfile = sample % 2 === 0 ? "SSC_CGL_TIER_II" as const : "SSC_CGL_TIER_I" as const;
      const seed = `DI009-LOCALIZATION-${locale}-${descriptor.qlId}-${sample}`;
      const source = generateDi009PermanentQuestion({ seed, examProfile, taskKind: descriptor.taskKind });
      const localized = generateDi009LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });
      const replay = generateDi009LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });

      assert(localized.question.kind === source.question.kind, `${key} task kind drifted.`);
      assert(localized.question.difficulty === source.question.difficulty, `${key} difficulty drifted.`);
      assert(stable(localized.stimulus.bins) === stable(source.stimulus.bins), `${key} histogram bins changed during localization.`);
      assert(localized.stimulus.classWidth === source.stimulus.classWidth && localized.stimulus.shape === source.stimulus.shape, `${key} histogram state changed during localization.`);
      assert(stable(localized.question.options) === stable(source.question.options), `${key} options changed during localization.`);
      assert(localized.question.correctIndex === source.question.correctIndex, `${key} correct index changed during localization.`);
      assert(localized.question.answer === source.question.answer, `${key} canonical answer changed during localization.`);
      parityChecks += 1;

      const text = learnerText(localized);
      assert(!/[A-Za-z]/u.test(text), `${key} leaks Roman learner-facing text: ${text}`);
      assert(!/\d+\.\d+/u.test(text), `${key} exposes decimal learner-facing values: ${text}`);
      assert(!/स्तंभ|ਸਤੰਭ/u.test(text), `${key} uses literal column/pillar wording on a DI learner surface: ${text}`);
      if (locale === "hi-IN") assert(/[\u0900-\u097F]/u.test(text), `${key} lacks Devanagari learner surface.`);
      else assert(/[\u0A00-\u0A7F]/u.test(text), `${key} lacks Gurmukhi learner surface.`);
      assert(localized.question.explanation.steps.length >= 1, `${key} localized explanation is empty.`);
      if (["MEDIAN_CLASS_IDENTIFICATION", "KTH_OBSERVATION_CLASS", "APPROX_GROUPED_MEAN_FROM_HISTOGRAM", "APPROX_GROUPED_MODE_FROM_HISTOGRAM"].includes(descriptor.taskKind)) {
        assert(localized.question.explanation.workingTable, `${key} lost its required working table.`);
      }
      leakageChecks += 1;

      const svg = renderDiHistogramSvg(localized.stimulus);
      assert(svg.includes("<svg") && svg.includes('data-di-presentation-layer="shared"'), `${key} did not render through shared histogram presentation.`);
      const svgText = svgLearnerText(svg);
      assert(!/[A-Za-z]/u.test(svgText), `${key} localized histogram text leaks Roman content: ${svgText}`);
      assert(!/\d+\.\d+/u.test(svgText), `${key} localized histogram shows decimal labels: ${svgText}`);
      if (locale === "hi-IN") assert(/[\u0900-\u097F]/u.test(svgText), `${key} localized histogram lacks Devanagari text.`);
      else assert(/[\u0A00-\u0A7F]/u.test(svgText), `${key} localized histogram lacks Gurmukhi text.`);
      svgChecks += 1;

      assert(localized.localizationStatus === "HI_PA_FROZEN", `${key} localization status drifted.`);
      assert(localized.traceability.questionStudioDiscoverable === true, `${key} is not Question Studio discoverable after localization approval.`);
      assert(localized.traceability.questionBankWritable === false && localized.traceability.testEligible === false && localized.traceability.mockTestEligible === false, `${key} widened learner lifecycle authority.`);
      assert(localized.traceability.publiclyPublishable === false && localized.traceability.automaticStudentPublication === false && localized.traceability.productionReleaseAuthorized === false, `${key} widened publication authority.`);
      lifecycleChecks += 1;

      assert(stable(localized) === stable(replay), `${key} is not deterministic for a fixed seed.`);
      deterministicChecks += 1;
      surfaceCoverage.get(key)!.add(Number(localized.question.evidence.surfaceId));
    }
  }
}

for (const [key, surfaces] of surfaceCoverage) {
  assert(surfaces.size >= 3, `${key} exercised only ${surfaces.size} localized stem surfaces.`);
}

console.log(JSON.stringify({
  status: "PASS_DI_009_HI_PA_LOCALIZATION_FROZEN_V1",
  sourceContexts: contexts.size,
  permanentQlCount: DI009_PERMANENT_QLS.length,
  locales,
  parityChecks,
  leakageChecks,
  svgChecks,
  lifecycleChecks,
  deterministicChecks,
  localizedSurfaceFamilies: surfaceCoverage.size,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}));
