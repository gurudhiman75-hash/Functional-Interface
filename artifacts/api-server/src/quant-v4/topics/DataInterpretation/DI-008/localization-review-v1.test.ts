import { generateDi008V2ReviewSet } from "./arithmetic-set-v2";
import {
  DI008_LOCALIZATION_LABELS,
  generateDi008LocalizedReviewQuestion,
  type Di008LocalizationLocale,
} from "./localization-review-v1";
import { DI008_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi008PermanentQuestion } from "./permanent-question-generator";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown) {
  return JSON.stringify(value);
}

function numericRows(rows: readonly any[]) {
  return rows.map((row) => ({
    unitsPrevious: row.unitsPrevious,
    unitsCurrent: row.unitsCurrent,
    costPerUnit: row.costPerUnit,
    sellingPricePerUnit: row.sellingPricePerUnit,
  }));
}

function learnerText(pkg: ReturnType<typeof generateDi008LocalizedReviewQuestion>) {
  return [
    pkg.stimulus.title,
    pkg.stimulus.instruction,
    pkg.stimulus.rowLabel,
    ...Object.values(pkg.stimulus.columnLabels),
    ...pkg.stimulus.rows.map((row) => row.label),
    pkg.question.stem,
    pkg.question.explanation.keyIdea,
    ...pkg.question.explanation.steps,
  ].join(" ");
}

const locales: readonly Di008LocalizationLocale[] = ["hi-IN", "pa-IN"];
const sourceLabels = new Set<string>();

for (let seedIndex = 1; seedIndex <= 160; seedIndex += 1) {
  for (const examProfile of ["BANKING_PRELIMS", "BANKING_MAINS"] as const) {
    const set = generateDi008V2ReviewSet({
      seed: "DI008-LOCALIZATION-LABEL-COVERAGE-" + seedIndex,
      examProfile,
    });
    for (const row of set.stimulus.rows) sourceLabels.add(row.label);
  }
}

assert(sourceLabels.size === 144, `Source sweep exposed ${sourceLabels.size}/144 DI-008 labels.`);
assert(Object.keys(DI008_LOCALIZATION_LABELS).length === 144, "Localization dictionary must contain exactly 144 object labels.");

for (const sourceLabel of sourceLabels) {
  const pair = DI008_LOCALIZATION_LABELS[sourceLabel];
  assert(pair, `Missing localization for '${sourceLabel}'.`);
  assert(!/[A-Za-z]/u.test(pair.hi), `Hindi label leaks Roman text: ${sourceLabel} -> ${pair.hi}`);
  assert(!/[A-Za-z]/u.test(pair.pa), `Punjabi label leaks Roman text: ${sourceLabel} -> ${pair.pa}`);
  assert(/[\u0900-\u097F]/u.test(pair.hi), `Hindi label lacks Devanagari script: ${sourceLabel}`);
  assert(/[\u0A00-\u0A7F]/u.test(pair.pa), `Punjabi label lacks Gurmukhi script: ${sourceLabel}`);
}

let parityChecks = 0;
let leakageChecks = 0;
let lifecycleChecks = 0;
let deterministicChecks = 0;
const stemVariants = new Map<string, Set<number>>();

for (const locale of locales) {
  for (const descriptor of DI008_PERMANENT_QLS) {
    const key = locale + ":" + descriptor.taskKind;
    stemVariants.set(key, new Set<number>());

    for (let sample = 1; sample <= 12; sample += 1) {
      const seed = `DI008-LOCALIZATION-${locale}-${descriptor.qlId}-${sample}`;
      const source = generateDi008PermanentQuestion({
        seed,
        examProfile: sample % 2 === 0 ? "BANKING_MAINS" : "BANKING_PRELIMS",
        taskKind: descriptor.taskKind,
      });
      const localized = generateDi008LocalizedReviewQuestion({
        seed,
        examProfile: sample % 2 === 0 ? "BANKING_MAINS" : "BANKING_PRELIMS",
        taskKind: descriptor.taskKind,
        locale,
      });
      const replay = generateDi008LocalizedReviewQuestion({
        seed,
        examProfile: sample % 2 === 0 ? "BANKING_MAINS" : "BANKING_PRELIMS",
        taskKind: descriptor.taskKind,
        locale,
      });

      assert(localized.question.kind === source.question.kind, `${key} task kind drifted.`);
      assert(localized.question.difficulty === source.question.difficulty, `${key} difficulty drifted.`);
      assert(stable(localized.question.options) === stable(source.question.options), `${key} options changed during localization.`);
      assert(localized.question.correctIndex === source.question.correctIndex, `${key} correct index changed during localization.`);
      assert(localized.question.answer === source.question.answer, `${key} canonical answer changed during localization.`);
      assert(stable(numericRows(localized.stimulus.rows)) === stable(numericRows(source.stimulus.rows)), `${key} arithmetic table values changed during localization.`);
      parityChecks += 1;

      const text = learnerText(localized);
      assert(!/[A-Za-z]/u.test(text), `${key} leaks Roman learner-facing text: ${text}`);
      if (locale === "hi-IN") assert(/[\u0900-\u097F]/u.test(text), `${key} lacks Devanagari learner surface.`);
      else assert(/[\u0A00-\u0A7F]/u.test(text), `${key} lacks Gurmukhi learner surface.`);
      assert(localized.question.explanation.steps.length >= 2, `${key} localized explanation is too thin.`);
      assert(localized.stimulus.rows.length === 5, `${key} localized table lost five rows.`);
      leakageChecks += 1;

      assert(localized.localizationStatus === "HI_PA_REVIEW_CANDIDATE", `${key} localization status drifted.`);
      assert(localized.traceability.questionStudioDiscoverable === false, `${key} became discoverable before localization approval.`);
      assert(localized.traceability.questionBankWritable === false && localized.traceability.testEligible === false && localized.traceability.mockTestEligible === false, `${key} widened learner lifecycle authority.`);
      assert(localized.traceability.publiclyPublishable === false && localized.traceability.automaticStudentPublication === false && localized.traceability.productionReleaseAuthorized === false, `${key} widened publication authority.`);
      lifecycleChecks += 1;

      assert(stable(localized) === stable(replay), `${key} is not deterministic for a fixed seed.`);
      deterministicChecks += 1;
      stemVariants.get(key)!.add(localized.question.stemVariant);
    }
  }
}

for (const [key, variants] of stemVariants) {
  assert(variants.size === 3, `${key} exercised only stem variants ${[...variants].sort().join(",")}.`);
}

console.log(JSON.stringify({
  status: "PASS_DI_008_HI_PA_LOCALIZATION_REVIEW_V1",
  sourceObjectLabels: sourceLabels.size,
  localizedObjectSurfaces: Object.keys(DI008_LOCALIZATION_LABELS).length * 2,
  permanentQlCount: DI008_PERMANENT_QLS.length,
  locales,
  parityChecks,
  leakageChecks,
  lifecycleChecks,
  deterministicChecks,
  stemSurfaceChecks: stemVariants.size,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}));
