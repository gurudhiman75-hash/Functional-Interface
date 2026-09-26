import { renderDiPieSvg } from "../visuals/pie-svg";
import { generateDi005V2ReviewSet } from "./pie-set-v2-quality";
import {
  DI005_LOCALIZATION_CONTEXTS,
  generateDi005LocalizedReviewQuestion,
  type Di005LocalizationLocale,
} from "./localization-review-v1";
import { DI005_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi005PermanentQuestion } from "./permanent-question-generator";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown) {
  return JSON.stringify(value);
}

function numericStimulus(stimulus: any) {
  return {
    totalValue: stimulus.totalValue,
    hiddenPercentIndex: stimulus.hiddenPercentIndex,
    slices: stimulus.slices.map((slice: any) => ({
      percent: slice.percent,
      displayPercent: slice.displayPercent,
      angleDegrees: slice.angleDegrees,
    })),
  };
}

function normalizeLocalizedValue(localizedValue: string, localized: any, source: any) {
  const index = localized.stimulus.slices.findIndex((slice: any) => slice.category === localizedValue);
  return index >= 0 ? source.stimulus.slices[index]!.category : localizedValue;
}

function learnerText(pkg: ReturnType<typeof generateDi005LocalizedReviewQuestion>) {
  return [
    pkg.stimulus.title,
    pkg.stimulus.instruction,
    pkg.stimulus.totalLabel,
    pkg.stimulus.unit,
    pkg.stimulus.description ?? "",
    ...pkg.stimulus.slices.map((slice) => slice.category),
    pkg.question.stem,
    ...pkg.question.options,
    pkg.question.answer,
    pkg.question.explanation.keyIdea,
    ...pkg.question.explanation.steps,
  ].join(" ");
}

function svgLearnerText(svg: string) {
  const matches = [...svg.matchAll(/<(?:title|desc|text)\b[^>]*>([^<]*)<\/(?:title|desc|text)>/gu)];
  return matches.map((match) => match[1] ?? "").join(" ");
}

const locales: readonly Di005LocalizationLocale[] = ["hi-IN", "pa-IN"];
const sourceContexts = new Set<string>();
const sourceLabels = new Set<string>();

for (const profile of ["SSC_CGL_TIER_I", "BANKING_PRELIMS"] as const) {
  for (let index = 1; index <= 180; index += 1) {
    const set = generateDi005V2ReviewSet({
      seed: `DI005-LOCALIZATION-COVERAGE-${profile}-${index}`,
      examProfile: profile,
    });
    sourceContexts.add(set.stimulus.contextId);
    set.stimulus.slices.forEach((slice) => sourceLabels.add(slice.category));
  }
}

assert(sourceContexts.size === 6, `DI-005 source context sweep reached ${sourceContexts.size}/6 contexts.`);
assert(sourceLabels.size === 30, `DI-005 source sweep exposed ${sourceLabels.size}/30 category labels.`);
assert(Object.keys(DI005_LOCALIZATION_CONTEXTS).length === 6, "DI-005 localization must define exactly six context families.");

for (const [contextId, localizedContext] of Object.entries(DI005_LOCALIZATION_CONTEXTS)) {
  assert(localizedContext.hi.categories.length === 5 && localizedContext.pa.categories.length === 5, `${contextId} must define five localized categories per language.`);
  const hiText = [localizedContext.hi.title, localizedContext.hi.totalLabel, localizedContext.hi.unit, localizedContext.hi.description, ...localizedContext.hi.categories].join(" ");
  const paText = [localizedContext.pa.title, localizedContext.pa.totalLabel, localizedContext.pa.unit, localizedContext.pa.description, ...localizedContext.pa.categories].join(" ");
  assert(!/[A-Za-z]/u.test(hiText), `${contextId} Hindi context leaks Roman text: ${hiText}`);
  assert(!/[A-Za-z]/u.test(paText), `${contextId} Punjabi context leaks Roman text: ${paText}`);
  assert(/[\u0900-\u097F]/u.test(hiText), `${contextId} Hindi context lacks Devanagari.`);
  assert(/[\u0A00-\u0A7F]/u.test(paText), `${contextId} Punjabi context lacks Gurmukhi.`);
}

let parityChecks = 0;
let leakageChecks = 0;
let visualChecks = 0;
let lifecycleChecks = 0;
let deterministicChecks = 0;
let hardRecoveryChecks = 0;
const surfaceCoverage = new Map<string, Set<string>>();

for (const locale of locales) {
  for (const descriptor of DI005_PERMANENT_QLS) {
    const key = `${locale}:${descriptor.qlId}`;
    surfaceCoverage.set(key, new Set<string>());

    for (let sample = 1; sample <= 30; sample += 1) {
      const examProfile = sample % 2 === 0 ? "BANKING_PRELIMS" as const : "SSC_CGL_TIER_I" as const;
      const seed = `DI005-LOCALIZATION-${locale}-${descriptor.qlId}-${sample}`;
      const source = generateDi005PermanentQuestion({ seed, examProfile, taskKind: descriptor.taskKind });
      const localized = generateDi005LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });
      const replay = generateDi005LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });

      assert(localized.question.kind === source.question.kind, `${key} task kind drifted.`);
      assert(localized.question.difficulty === source.question.difficulty, `${key} difficulty drifted.`);
      assert(localized.question.correctIndex === source.question.correctIndex, `${key} correct index changed.`);
      assert(localized.question.options.length === source.question.options.length, `${key} option count changed.`);
      assert(localized.question.options.length === (examProfile === "SSC_CGL_TIER_I" ? 4 : 5), `${key} exam-profile option shape drifted.`);
      assert(localized.stimulus.contextId === source.stimulus.contextId, `${key} context changed.`);
      assert(stable(numericStimulus(localized.stimulus)) === stable(numericStimulus(source.stimulus)), `${key} numeric pie state changed during localization.`);

      const normalizedOptions = localized.question.options.map((option) => normalizeLocalizedValue(option, localized, source));
      assert(stable(normalizedOptions) === stable(source.question.options), `${key} option semantics changed during localization.`);
      assert(normalizeLocalizedValue(localized.question.answer, localized, source) === source.question.answer, `${key} answer semantics changed during localization.`);
      assert(localized.question.options[localized.question.correctIndex] === localized.question.answer, `${key} localized answer-index binding failed.`);
      parityChecks += 1;

      const text = learnerText(localized);
      assert(!/[A-Za-z]/u.test(text), `${key} leaks Roman learner-facing text: ${text}`);
      if (locale === "hi-IN") assert(/[\u0900-\u097F]/u.test(text), `${key} lacks Devanagari learner text.`);
      else assert(/[\u0A00-\u0A7F]/u.test(text), `${key} lacks Gurmukhi learner text.`);
      assert(localized.question.explanation.steps.length >= 2, `${key} localized explanation is too thin.`);
      assert(localized.stimulus.slices.length === 5, `${key} localized pie lost five sectors.`);
      assert(localized.stimulus.slices.filter((slice) => slice.displayPercent === "?").length === 1, `${key} localized pie lost the single hidden percentage.`);
      leakageChecks += 1;

      const svg = renderDiPieSvg(localized.stimulus);
      assert(svg.includes('data-di-presentation-layer="shared"') && svg.includes('data-pie-chart="true"'), `${key} bypassed the shared pie renderer.`);
      const svgText = svgLearnerText(svg);
      assert(!/[A-Za-z]/u.test(svgText), `${key} localized pie visual leaks Roman learner text: ${svgText}`);
      if (locale === "hi-IN") assert(/[\u0900-\u097F]/u.test(svgText), `${key} localized pie visual lacks Devanagari text.`);
      else assert(/[\u0A00-\u0A7F]/u.test(svgText), `${key} localized pie visual lacks Gurmukhi text.`);
      visualChecks += 1;

      assert(localized.localizationStatus === "HI_PA_FROZEN", `${key} localization status drifted.`);
      assert(localized.traceability.questionStudioDiscoverable === true, `${key} localized frozen authority must be Question Studio discoverable.`);
      assert(localized.traceability.questionBankWritable === false && localized.traceability.testEligible === false && localized.traceability.mockTestEligible === false, `${key} widened learner lifecycle authority.`);
      assert(localized.traceability.publiclyPublishable === false && localized.traceability.automaticStudentPublication === false && localized.traceability.productionReleaseAuthorized === false, `${key} widened publication authority.`);
      lifecycleChecks += 1;

      if (descriptor.difficulty === "Hard") {
        const hidden = source.stimulus.hiddenPercentIndex;
        if (descriptor.taskKind === "RELATIVE_SECTOR_PERCENT_EXCESS") {
          assert(Number(source.question.evidence.largerIndex) === hidden || Number(source.question.evidence.smallerIndex) === hidden, `${key} source Hard route lost hidden-sector calibration.`);
        } else {
          assert(Number(source.question.evidence.firstIndex) === hidden || Number(source.question.evidence.secondIndex) === hidden, `${key} source Hard route lost hidden-sector calibration.`);
        }
        assert(localized.question.explanation.steps[0]?.includes("100%"), `${key} localized Hard explanation does not recover the hidden sector first.`);
        hardRecoveryChecks += 1;
      }

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
  status: "PASS_DI_005_HI_PA_FROZEN_V1",
  sourceContexts: sourceContexts.size,
  sourceCategoryLabels: sourceLabels.size,
  permanentQlCount: DI005_PERMANENT_QLS.length,
  locales,
  parityChecks,
  leakageChecks,
  visualChecks,
  lifecycleChecks,
  deterministicChecks,
  hardRecoveryChecks,
  localizedSurfaceFamilies: surfaceCoverage.size,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}));
