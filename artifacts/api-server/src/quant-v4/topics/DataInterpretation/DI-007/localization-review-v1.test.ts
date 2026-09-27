import { generateDi007V2ReviewSet } from "./missing-set-v2";
import {
  DI007_LOCALIZATION_CONTEXTS,
  generateDi007LocalizedReviewQuestion,
  type Di007LocalizationLocale,
} from "./localization-review-v1";
import { DI007_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi007PermanentQuestion } from "./permanent-question-generator";

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
    hiddenIndex: stimulus.hiddenIndex,
    aggregateCondition: {
      mode: stimulus.aggregateCondition.mode,
      value: stimulus.aggregateCondition.value,
      numerator: stimulus.aggregateCondition.numerator,
      denominator: stimulus.aggregateCondition.denominator,
      direction: stimulus.aggregateCondition.direction,
    },
    points: stimulus.points.map((point: any) => ({
      seriesA: point.seriesA,
      seriesB: point.seriesB,
      displaySeriesB: point.displaySeriesB,
    })),
  };
}

function learnerText(pkg: ReturnType<typeof generateDi007LocalizedReviewQuestion>) {
  return [
    pkg.stimulus.title,
    pkg.stimulus.instruction,
    pkg.stimulus.rowLabel,
    pkg.stimulus.seriesALabel,
    pkg.stimulus.seriesBLabel,
    pkg.stimulus.seriesAMeasure,
    pkg.stimulus.seriesBMeasure,
    pkg.stimulus.unit,
    pkg.stimulus.aggregateCondition.learnerText,
    ...pkg.stimulus.points.map((point) => point.label),
    pkg.question.stem,
    ...pkg.question.options,
    pkg.question.answer,
    pkg.question.explanation.keyIdea,
    ...pkg.question.explanation.steps,
  ].join(" ");
}

const locales: readonly Di007LocalizationLocale[] = ["hi-IN", "pa-IN"];
const sourceContexts = new Set<string>();
const recoveryModes = new Set<string>();
const sourceRowLabels = new Set<string>();

for (const profile of ["BANKING_PRELIMS", "BANKING_MAINS"] as const) {
  for (let index = 1; index <= 260; index += 1) {
    const set = generateDi007V2ReviewSet({ seed: `DI007-LOCALIZATION-COVERAGE-${profile}-${index}`, examProfile: profile });
    sourceContexts.add(set.stimulus.contextId);
    recoveryModes.add(set.stimulus.aggregateCondition.mode);
    set.stimulus.points.forEach((point) => sourceRowLabels.add(point.label));
  }
}

assert(sourceContexts.size === 6, `DI-007 source context sweep reached ${sourceContexts.size}/6 contexts.`);
assert(recoveryModes.size === 5, `DI-007 source sweep reached only ${recoveryModes.size}/5 recovery modes.`);
assert(sourceRowLabels.size === 30, `DI-007 source sweep exposed ${sourceRowLabels.size}/30 row labels.`);
assert(Object.keys(DI007_LOCALIZATION_CONTEXTS).length === 6, "DI-007 localization must define exactly six contexts.");

for (const [contextId, localized] of Object.entries(DI007_LOCALIZATION_CONTEXTS)) {
  assert(localized.hi.rows.length === 5 && localized.pa.rows.length === 5, `${contextId} must define five rows per language.`);
  const hiText = [localized.hi.title, localized.hi.rowLabel, localized.hi.seriesALabel, localized.hi.seriesBLabel, localized.hi.seriesAMeasure, localized.hi.seriesBMeasure, localized.hi.unit, ...localized.hi.rows].join(" ");
  const paText = [localized.pa.title, localized.pa.rowLabel, localized.pa.seriesALabel, localized.pa.seriesBLabel, localized.pa.seriesAMeasure, localized.pa.seriesBMeasure, localized.pa.unit, ...localized.pa.rows].join(" ");
  assert(!/[A-Za-z]/u.test(hiText), `${contextId} Hindi context leaks Roman text: ${hiText}`);
  assert(!/[A-Za-z]/u.test(paText), `${contextId} Punjabi context leaks Roman text: ${paText}`);
}

let parityChecks = 0;
let leakageChecks = 0;
let conditionChecks = 0;
let lifecycleChecks = 0;
let deterministicChecks = 0;
let easyFloorChecks = 0;
let hardChecks = 0;
const surfaceCoverage = new Map<string, Set<number>>();

for (const locale of locales) {
  for (const descriptor of DI007_PERMANENT_QLS) {
    const key = `${locale}:${descriptor.qlId}`;
    surfaceCoverage.set(key, new Set<number>());

    for (let sample = 1; sample <= 30; sample += 1) {
      const examProfile = sample % 2 === 0 ? "BANKING_MAINS" as const : "BANKING_PRELIMS" as const;
      const seed = `DI007-LOCALIZATION-${locale}-${descriptor.qlId}-${sample}`;
      const source = generateDi007PermanentQuestion({ seed, examProfile, taskKind: descriptor.taskKind });
      const localized = generateDi007LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });
      const replay = generateDi007LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });

      assert(localized.question.kind === source.question.kind, `${key} task kind drifted.`);
      assert(localized.question.difficulty === source.question.difficulty, `${key} difficulty drifted.`);
      assert(localized.question.correctIndex === source.question.correctIndex, `${key} correct index changed.`);
      assert(stable(localized.question.options) === stable(source.question.options), `${key} options changed during localization.`);
      assert(localized.question.answer === source.question.answer, `${key} answer changed during localization.`);
      assert(localized.question.options[localized.question.correctIndex] === localized.question.answer, `${key} answer-index binding failed.`);
      assert(stable(semanticStimulus(localized.stimulus)) === stable(semanticStimulus(source.stimulus)), `${key} missing-table arithmetic state changed during localization.`);
      parityChecks += 1;

      assert(localized.stimulus.aggregateCondition.mode === source.stimulus.aggregateCondition.mode, `${key} recovery mode drifted.`);
      assert(localized.stimulus.aggregateCondition.learnerText.length >= 20, `${key} localized recovery condition is too thin.`);
      assert(!/[A-Za-z]/u.test(localized.stimulus.aggregateCondition.learnerText), `${key} recovery condition leaks Roman text.`);
      conditionChecks += 1;

      const text = learnerText(localized);
      assert(!/[A-Za-z]/u.test(text), `${key} leaks Roman learner-facing text: ${text}`);
      if (locale === "hi-IN") assert(/[\u0900-\u097F]/u.test(text), `${key} lacks Devanagari learner text.`);
      else assert(/[\u0A00-\u0A7F]/u.test(text), `${key} lacks Gurmukhi learner text.`);
      assert(localized.stimulus.points.length === 5, `${key} lost five-row table shape.`);
      assert(localized.stimulus.points.filter((point) => point.displaySeriesB === "?").length === 1, `${key} lost single hidden cell.`);
      assert(localized.question.explanation.steps.length >= 1, `${key} localized explanation is empty.`);
      leakageChecks += 1;

      if (descriptor.difficulty === "Easy") {
        assert(["VISIBLE_ROW_COMBINED_TOTAL", "VISIBLE_ROW_DIFFERENCE"].includes(localized.question.kind), `${key} Easy route is not arithmetic.`);
        assert(localized.question.kind !== ("DIRECT_VISIBLE_VALUE" as any), `${key} reintroduced retired direct lookup.`);
        assert(localized.question.explanation.steps.length >= 2, `${key} Easy explanation collapsed to lookup.`);
        easyFloorChecks += 1;
      }
      if (descriptor.qlId === "DI-QL-073") {
        assert(localized.question.kind === "VISIBLE_ROW_COMBINED_TOTAL", `${key} DI-QL-073 lost P2 combined-row semantics.`);
      }
      if (descriptor.difficulty === "Hard") {
        assert(localized.question.explanation.steps.length >= 2, `${key} Hard explanation lost multi-step reasoning.`);
        hardChecks += 1;
      }

      assert(localized.localizationStatus === "HI_PA_REVIEW_CANDIDATE", `${key} localization status drifted.`);
      assert(localized.traceability.questionStudioDiscoverable === false, `${key} became Question Studio discoverable before approval.`);
      assert(localized.traceability.questionBankWritable === false && localized.traceability.testEligible === false && localized.traceability.mockTestEligible === false, `${key} widened learner lifecycle authority.`);
      assert(localized.traceability.publiclyPublishable === false && localized.traceability.automaticStudentPublication === false && localized.traceability.productionReleaseAuthorized === false, `${key} widened publication authority.`);
      lifecycleChecks += 1;

      assert(stable(localized) === stable(replay), `${key} is not deterministic for a fixed seed.`);
      deterministicChecks += 1;
      surfaceCoverage.get(key)!.add(localized.question.stemVariant);
    }
  }
}

for (const [key, surfaces] of surfaceCoverage) {
  assert(surfaces.size === 3, `${key} exercised only ${surfaces.size}/3 localized stem surfaces.`);
}

console.log(JSON.stringify({
  status: "PASS_DI_007_HI_PA_LOCALIZATION_REVIEW_CANDIDATE_V1",
  sourceContexts: sourceContexts.size,
  sourceRowLabels: sourceRowLabels.size,
  recoveryModes: [...recoveryModes].sort(),
  permanentQlCount: DI007_PERMANENT_QLS.length,
  parityChecks,
  leakageChecks,
  conditionChecks,
  lifecycleChecks,
  deterministicChecks,
  easyFloorChecks,
  hardChecks,
  localizedSurfaceFamilies: surfaceCoverage.size,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}));
