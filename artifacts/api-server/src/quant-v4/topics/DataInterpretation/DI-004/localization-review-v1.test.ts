import {
  DI004_V2_CONTEXT_COUNT,
  DI004_V2_ENTITY_LABEL_COUNT,
  DI004_V2_SERIES_PAIR_COUNT,
  generateDi004V2Set,
} from "./line-set-v2";
import {
  DI004_LOCALIZATION_CONTEXTS,
  generateDi004LocalizedReviewQuestion,
  localizeDi004Period,
  type Di004LocalizationLocale,
} from "./localization-review-v1";
import { DI004_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi004PermanentQuestion } from "./permanent-question-generator";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown) {
  return JSON.stringify(value);
}

function semanticStimulus(stimulus: any) {
  return {
    kind: stimulus.kind,
    contextId: stimulus.contextId,
    points: stimulus.points.map((point: any) => ({
      seriesA: point.seriesA,
      seriesB: point.seriesB,
    })),
  };
}

function learnerText(pkg: ReturnType<typeof generateDi004LocalizedReviewQuestion>) {
  const q = pkg.question;
  const s = pkg.stimulus;
  return [
    s.title,
    s.instruction,
    ...s.categories,
    ...s.series.map((item) => item.label),
    ...s.points.map((point) => point.period),
    s.yAxisLabel,
    s.unitLabel,
    q.stem,
    ...q.options,
    q.answer,
    q.explanation.keyIdea,
    ...q.explanation.steps,
    ...(q.explanation.workingTable?.headers ?? []),
    ...(q.explanation.workingTable?.rows.flat() ?? []),
  ].join(" ");
}

const locales: readonly Di004LocalizationLocale[] = ["hi-IN", "pa-IN"];
const contexts = new Set<string>();
const pairs = new Set<string>();

for (let index = 0; index < 480; index += 1) {
  const set = generateDi004V2Set({ seed: `DI004-LOCALIZATION-COVERAGE-${index}`, examProfile: "SSC_CGL_TIER_I" });
  contexts.add(set.stimulus.contextId);
  pairs.add(`${set.stimulus.series[0].label}|${set.stimulus.series[1].label}`);
}

assert(contexts.size === DI004_V2_CONTEXT_COUNT && contexts.size === 6, `DI-004 localization context sweep reached ${contexts.size}/6 contexts.`);
assert(DI004_V2_SERIES_PAIR_COUNT === 72, `DI-004 configured pair breadth drifted to ${DI004_V2_SERIES_PAIR_COUNT}.`);
assert(DI004_V2_ENTITY_LABEL_COUNT === 144, `DI-004 configured entity-label breadth drifted to ${DI004_V2_ENTITY_LABEL_COUNT}.`);
assert(pairs.size >= 50, `DI-004 localization source sweep exercised only ${pairs.size}/72 series pairs.`);
assert(Object.keys(DI004_LOCALIZATION_CONTEXTS).length === 6, "DI-004 localization must define all six contexts.");

let parityChecks = 0;
let leakageChecks = 0;
let lifecycleChecks = 0;
let deterministicChecks = 0;
let easyFloorChecks = 0;
let hardChecks = 0;
let categoricalChecks = 0;
const surfaces = new Map<string, Set<string>>();

for (const locale of locales) {
  for (const descriptor of DI004_PERMANENT_QLS) {
    const key = `${locale}:${descriptor.qlId}`;
    surfaces.set(key, new Set<string>());

    for (let sample = 1; sample <= 30; sample += 1) {
      const examProfile = sample % 2 === 0 ? "BANKING_PRELIMS" as const : "SSC_CGL_TIER_I" as const;
      const seed = `DI004-LOCALIZATION-${locale}-${descriptor.qlId}-${sample}`;
      const source = generateDi004PermanentQuestion({ seed, examProfile, taskKind: descriptor.taskKind });
      const localized = generateDi004LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });
      const replay = generateDi004LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });

      assert(localized.question.kind === source.question.kind, `${key} task kind drifted.`);
      assert(localized.question.difficulty === source.question.difficulty, `${key} difficulty drifted.`);
      assert(localized.question.correctIndex === source.question.correctIndex, `${key} correct index changed.`);
      assert(localized.question.options.length === source.question.options.length, `${key} option count changed.`);
      assert(localized.question.options[localized.question.correctIndex] === localized.question.answer, `${key} answer-index binding failed.`);
      assert(stable(semanticStimulus(localized.stimulus)) === stable(semanticStimulus(source.stimulus)), `${key} numeric line state changed during localization.`);

      const expectedOptions = source.question.options.map((option) => localizeDi004Period(option, locale));
      const expectedAnswer = localizeDi004Period(source.question.answer, locale);
      assert(stable(localized.question.options) === stable(expectedOptions), `${key} categorical/numeric option parity drifted.`);
      assert(localized.question.answer === expectedAnswer, `${key} answer localization drifted.`);
      parityChecks += 1;

      if (["FIRST_OVERTAKE_PERIOD", "CLOSEST_LINES_PERIOD"].includes(descriptor.taskKind)) {
        assert(localized.question.options.every((option) => !/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/u.test(option)), `${key} leaked an English month option.`);
        categoricalChecks += 1;
      }

      assert(localized.stimulus.points.length === 6 && localized.stimulus.series.length === 2, `${key} line shape drifted.`);
      assert(localized.stimulus.points.every((point) => Number.isSafeInteger(point.seriesA) && Number.isSafeInteger(point.seriesB)), `${key} numeric line values changed.`);

      const text = learnerText(localized);
      assert(!/[A-Za-z]/u.test(text), `${key} leaks Roman learner-facing text: ${text}`);
      if (locale === "hi-IN") {
        assert(/[\u0904-\u0939\u093C-\u094D\u0950-\u0961\u0971-\u097F]/u.test(text), `${key} lacks Devanagari learner text.`);
        assert(!/[\u0A05-\u0A39\u0A3C-\u0A4D\u0A59-\u0A5E]/u.test(text), `${key} leaks Gurmukhi letters into Hindi learner text: ${text}`);
        assert(!/स्तंभ/u.test(text), `${key} leaked banned Hindi DI terminology 'स्तंभ'.`);
      } else {
        assert(/[\u0A05-\u0A39\u0A3C-\u0A4D\u0A59-\u0A5E]/u.test(text), `${key} lacks Gurmukhi learner text.`);
        assert(!/[\u0904-\u0939\u093C-\u094D\u0950-\u0961\u0971-\u097F]/u.test(text), `${key} leaks Devanagari letters into Punjabi learner text: ${text}`);
      }
      assert(!/associated/iu.test(text), `${key} leaked mechanical 'associated' wording.`);
      assert(!/nearest whole|round to the nearest|give the nearest whole|निकटतम पूर्ण|पूर्णांकित|ਸਭ ਤੋਂ ਨੇੜਲਾ ਪੂਰਾ|ਗੋਲ ਕਰੋ/iu.test(text), `${key} leaked explicit rounding instructions: ${text}`);
      leakageChecks += 1;

      if (descriptor.difficulty === "Easy") {
        assert(["CROSS_SERIES_DIFFERENCE", "COMBINED_PERIOD_TOTAL"].includes(localized.question.kind), `${key} Easy route stopped requiring arithmetic.`);
        assert(localized.question.explanation.steps.length >= 2, `${key} Easy explanation collapsed to lookup.`);
        easyFloorChecks += 1;
      }
      if (descriptor.difficulty === "Medium") {
        assert(localized.question.explanation.steps.length >= 2, `${key} Medium explanation lost derived/comparison working.`);
      }
      if (descriptor.difficulty === "Hard") {
        assert(localized.question.explanation.steps.length >= 3, `${key} Hard explanation lost multi-step reasoning.`);
        hardChecks += 1;
      }

      assert(localized.localizationStatus === "HI_PA_REVIEW_CANDIDATE", `${key} localization status drifted.`);
      assert(localized.traceability.questionStudioDiscoverable === false, `${key} became Question Studio discoverable before approval.`);
      assert(localized.traceability.questionBankWritable === false && localized.traceability.testEligible === false && localized.traceability.mockTestEligible === false, `${key} widened learner lifecycle authority.`);
      assert(localized.traceability.publiclyPublishable === false && localized.traceability.automaticStudentPublication === false && localized.traceability.productionReleaseAuthorized === false, `${key} widened publication authority.`);
      lifecycleChecks += 1;

      assert(stable(localized) === stable(replay), `${key} is not deterministic for a fixed seed.`);
      deterministicChecks += 1;
      surfaces.get(key)!.add(localized.question.stemSurfaceId);
    }
  }
}

for (const [key, seen] of surfaces) {
  assert(seen.size === 3, `${key} exercised only ${seen.size}/3 localized stem surfaces.`);
}

console.log(JSON.stringify({
  status: "PASS_DI_004_HI_PA_LOCALIZATION_REVIEW_CANDIDATE_V1",
  sourceContexts: contexts.size,
  exercisedSeriesPairs: pairs.size,
  configuredSeriesPairs: DI004_V2_SERIES_PAIR_COUNT,
  configuredEntityLabels: DI004_V2_ENTITY_LABEL_COUNT,
  permanentQlCount: DI004_PERMANENT_QLS.length,
  locales,
  parityChecks,
  leakageChecks,
  categoricalChecks,
  lifecycleChecks,
  deterministicChecks,
  easyFloorChecks,
  hardChecks,
  localizedSurfaceFamilies: surfaces.size,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}));
