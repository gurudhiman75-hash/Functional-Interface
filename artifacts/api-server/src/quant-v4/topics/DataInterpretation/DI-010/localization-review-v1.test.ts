import { renderDiFrequencyPolygonSvg } from "../visuals/frequency-polygon-svg";
import { generateDi010FrequencyPolygonSet } from "./frequency-polygon-set";
import {
  generateDi010LocalizedReviewQuestion,
  type Di010LocalizationLocale,
} from "./localization-review-v1";
import { DI010_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi010PermanentQuestion } from "./permanent-question-generator";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown) {
  return JSON.stringify(value);
}

function learnerText(pkg: ReturnType<typeof generateDi010LocalizedReviewQuestion>) {
  const table = pkg.question.explanation.workingTable;
  return [
    pkg.stimulus.title,
    pkg.stimulus.instruction,
    pkg.stimulus.xAxisLabel,
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
  return [...svg.matchAll(/<(?:title|desc|text)[^>]*>([^<]*)<\/(?:title|desc|text)>/g)]
    .map((match) => match[1] ?? "")
    .join(" ");
}

const locales: readonly Di010LocalizationLocale[] = ["hi-IN", "pa-IN"];
const contexts = new Set<string>();

for (const profile of ["SSC_CGL_TIER_I", "SSC_CGL_TIER_II"] as const) {
  for (let index = 1; index <= 160; index += 1) {
    contexts.add(generateDi010FrequencyPolygonSet({
      seed: `DI010-LOCALIZATION-CONTEXT-${profile}-${index}`,
      examProfile: profile,
    }).stimulus.title);
  }
}

assert(contexts.size === 6, `DI-010 source context sweep reached ${contexts.size}/6 contexts.`);

let parityChecks = 0;
let leakageChecks = 0;
let svgChecks = 0;
let lifecycleChecks = 0;
let deterministicChecks = 0;
const surfaceCoverage = new Map<string, Set<number>>();

for (const locale of locales) {
  for (const descriptor of DI010_PERMANENT_QLS) {
    const key = `${locale}:${descriptor.qlId}`;
    surfaceCoverage.set(key, new Set<number>());

    for (let sample = 1; sample <= 30; sample += 1) {
      const examProfile = sample % 2 === 0 ? "SSC_CGL_TIER_II" as const : "SSC_CGL_TIER_I" as const;
      const seed = `DI010-LOCALIZATION-${locale}-${descriptor.qlId}-${sample}`;
      const source = generateDi010PermanentQuestion({ seed, examProfile, taskKind: descriptor.taskKind });
      const localized = generateDi010LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });
      const replay = generateDi010LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });

      assert(localized.question.kind === source.question.kind, `${key} task kind drifted.`);
      assert(localized.question.difficulty === source.question.difficulty, `${key} difficulty drifted.`);
      assert(stable(localized.stimulus.classes) === stable(source.stimulus.classes), `${key} polygon classes changed during localization.`);
      assert(localized.stimulus.classWidth === source.stimulus.classWidth && localized.stimulus.shape === source.stimulus.shape, `${key} polygon state changed during localization.`);
      assert(localized.question.correctIndex === source.question.correctIndex, `${key} correct index changed during localization.`);

      if (descriptor.taskKind === "CONSTRUCTION_PROPERTY") {
        assert(localized.question.answer === localized.question.options[localized.question.correctIndex], `${key} localized construction answer does not match correct option.`);
        assert(stable(localized.question.options) !== stable(source.question.options), `${key} construction options were not localized.`);
      } else if (descriptor.taskKind === "ZERO_CLOSING_ENDPOINTS") {
        assert(localized.question.answer === localized.question.options[localized.question.correctIndex], `${key} localized closing-endpoint answer does not match correct option.`);
        const normalized = localized.question.options.map((option) => option.replace(" और ", " and ").replace(" ਅਤੇ ", " and "));
        assert(stable(normalized) === stable(source.question.options), `${key} closing-endpoint coordinates changed during localization.`);
      } else {
        assert(stable(localized.question.options) === stable(source.question.options), `${key} numeric/symbolic options changed during localization.`);
        assert(localized.question.answer === source.question.answer, `${key} canonical numeric/symbolic answer changed during localization.`);
      }
      parityChecks += 1;

      const text = learnerText(localized);
      assert(!/[A-Za-z]/u.test(text), `${key} leaks Roman learner-facing text: ${text}`);
      assert(!/\d+\.\d+/u.test(text), `${key} exposes decimal learner-facing values: ${text}`);
      if (locale === "hi-IN") assert(/[\u0900-\u097F]/u.test(text), `${key} lacks Devanagari learner surface.`);
      else assert(/[\u0A00-\u0A7F]/u.test(text), `${key} lacks Gurmukhi learner surface.`);
      assert(localized.question.explanation.steps.length >= 1, `${key} localized explanation is empty.`);
      if (["GROUPED_MEAN_FROM_POLYGON", "MEDIAN_CLASS_FROM_POLYGON"].includes(descriptor.taskKind)) {
        assert(localized.question.explanation.workingTable, `${key} lost its required working table.`);
      }
      leakageChecks += 1;

      const svg = renderDiFrequencyPolygonSvg(localized.stimulus);
      assert(svg.includes("<svg") && svg.includes('data-frequency-polygon="true"') && svg.includes('data-di-presentation-layer="shared"'), `${key} did not render through shared polygon presentation.`);
      const svgText = svgLearnerText(svg);
      assert(!/[A-Za-z]/u.test(svgText), `${key} localized polygon text leaks Roman content: ${svgText}`);
      assert(!/\d+\.\d+/u.test(svgText), `${key} localized polygon shows decimal labels: ${svgText}`);
      if (locale === "hi-IN") assert(/[\u0900-\u097F]/u.test(svgText), `${key} localized polygon lacks Devanagari text.`);
      else assert(/[\u0A00-\u0A7F]/u.test(svgText), `${key} localized polygon lacks Gurmukhi text.`);
      svgChecks += 1;

      assert(localized.localizationStatus === "HI_PA_REVIEW_CANDIDATE", `${key} localization status drifted.`);
      assert(localized.traceability.questionStudioDiscoverable === false, `${key} became Question Studio discoverable before approval.`);
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
  status: "PASS_DI_010_HI_PA_LOCALIZATION_REVIEW_V1",
  sourceContexts: contexts.size,
  permanentQlCount: DI010_PERMANENT_QLS.length,
  locales,
  parityChecks,
  leakageChecks,
  svgChecks,
  lifecycleChecks,
  deterministicChecks,
  localizedSurfaceFamilies: surfaceCoverage.size,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}));
