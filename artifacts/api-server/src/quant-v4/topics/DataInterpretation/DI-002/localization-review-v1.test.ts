import {
  DI002_V2_CONTEXT_COUNT,
  DI002_V2_OBJECT_LABEL_COUNT,
  generateDi002V2Set,
} from "./advanced-table-set-v2";
import {
  DI002_LOCALIZATION_CONTEXTS,
  generateDi002LocalizedReviewQuestion,
  type Di002LocalizationLocale,
} from "./localization-review-v1";
import { DI002_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi002PermanentQuestion } from "./permanent-question-generator";

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
    hiddenApplicantIndex: stimulus.hiddenApplicantIndex,
    rows: stimulus.rows.map((row: any) => ({
      applicants: row.applicants,
      selected: row.selected,
      selectionPercent: row.selectionPercent,
    })),
  };
}

function learnerText(pkg: ReturnType<typeof generateDi002LocalizedReviewQuestion>) {
  const q = pkg.question;
  const s = pkg.stimulus;
  return [
    s.title,
    s.instruction,
    s.rowHeader,
    ...s.columns,
    ...s.rows.map((row) => row.label),
    q.stem,
    ...q.options,
    q.answer,
    q.explanation.keyIdea,
    ...q.explanation.steps,
    ...(q.explanation.workingTable?.headers ?? []),
    ...(q.explanation.workingTable?.rows.flat() ?? []),
  ].join(" ");
}

const locales: readonly Di002LocalizationLocale[] = ["hi-IN", "pa-IN"];
const contexts = new Set<string>();

for (let i = 0; i < 360; i += 1) {
  contexts.add(generateDi002V2Set({ seed: `DI002-LOCALIZATION-CONTEXT-${i}`, examProfile: "SSC_CGL_TIER_I" }).stimulus.contextId);
}

assert(contexts.size === DI002_V2_CONTEXT_COUNT && contexts.size === 6, `DI-002 localization context sweep reached ${contexts.size}/6.`);
assert(DI002_V2_OBJECT_LABEL_COUNT === 144, `DI-002 configured source label breadth drifted to ${DI002_V2_OBJECT_LABEL_COUNT}; expected 144.`);
assert(Object.keys(DI002_LOCALIZATION_CONTEXTS).length === 6, "DI-002 localization must define all six contexts.");

let parityChecks = 0;
let leakageChecks = 0;
let lifecycleChecks = 0;
let deterministicChecks = 0;
let easyFloorChecks = 0;
let hardChecks = 0;
let missingCellChecks = 0;
const surfaces = new Map<string, Set<string>>();

for (const locale of locales) {
  for (const descriptor of DI002_PERMANENT_QLS) {
    const key = `${locale}:${descriptor.qlId}`;
    surfaces.set(key, new Set<string>());

    for (let sample = 1; sample <= 30; sample += 1) {
      const examProfile = sample % 2 === 0 ? "BANKING_PRELIMS" as const : "SSC_CGL_TIER_I" as const;
      const seed = `DI002-LOCALIZATION-${locale}-${descriptor.qlId}-${sample}`;
      const source = generateDi002PermanentQuestion({ seed, examProfile, taskKind: descriptor.taskKind });
      const localized = generateDi002LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });
      const replay = generateDi002LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });

      assert(localized.question.kind === source.question.kind, `${key} task kind drifted.`);
      assert(localized.question.difficulty === source.question.difficulty, `${key} difficulty drifted.`);
      assert(localized.question.correctIndex === source.question.correctIndex, `${key} correct index changed.`);
      assert(stable(localized.question.options) === stable(source.question.options), `${key} options changed during localization.`);
      assert(localized.question.answer === source.question.answer, `${key} answer changed during localization.`);
      assert(localized.question.options[localized.question.correctIndex] === localized.question.answer, `${key} answer-index binding failed.`);
      assert(stable(semanticStimulus(localized.stimulus)) === stable(semanticStimulus(source.stimulus)), `${key} table arithmetic state changed during localization.`);
      parityChecks += 1;

      assert(localized.stimulus.rows.length === 5, `${key} lost five-row table shape.`);
      assert(localized.stimulus.rows.filter((row) => row.applicants === "?").length === 1, `${key} lost exactly one missing Applicants value.`);
      assert(localized.stimulus.hiddenApplicantIndex === source.stimulus.hiddenApplicantIndex, `${key} hidden row changed during localization.`);
      missingCellChecks += 1;

      const text = learnerText(localized);
      assert(!/[A-Za-z]/u.test(text), `${key} leaks Roman learner-facing text: ${text}`);
      if (locale === "hi-IN") {
        assert(/[\u0900-\u097F]/u.test(text), `${key} lacks Devanagari learner text.`);
        assert(!/स्तंभ/u.test(text), `${key} leaked banned Hindi DI terminology 'स्तंभ'.`);
      } else {
        assert(/[\u0A00-\u0A7F]/u.test(text), `${key} lacks Gurmukhi learner text.`);
      }
      assert(!/associated/iu.test(text), `${key} leaked mechanical 'associated' wording.`);
      leakageChecks += 1;

      if (descriptor.difficulty === "Easy") {
        assert(["SELECTED_DIFFERENCE", "COMBINED_SELECTED"].includes(localized.question.kind), `${key} Easy route stopped requiring arithmetic.`);
        assert(localized.question.explanation.steps.length >= 2, `${key} Easy explanation collapsed to lookup.`);
        easyFloorChecks += 1;
      }
      if (descriptor.difficulty === "Medium") {
        assert(localized.question.explanation.steps.length >= 2, `${key} Medium explanation lost derived/aggregate working.`);
      }
      if (descriptor.difficulty === "Hard") {
        assert(localized.question.explanation.steps.length >= 3, `${key} Hard explanation lost multi-step reasoning.`);
        hardChecks += 1;
      }

      assert(!["DIRECT_SELECTED_VALUE", "DIRECT_SELECTION_RATE", "SELECTION_RATE_POINT_GAP"].includes(localized.question.kind as any), `${key} reintroduced a retired trivial family.`);

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
  status: "PASS_DI_002_HI_PA_LOCALIZATION_REVIEW_CANDIDATE_V1",
  sourceContexts: contexts.size,
  configuredObjectLabels: DI002_V2_OBJECT_LABEL_COUNT,
  permanentQlCount: DI002_PERMANENT_QLS.length,
  locales,
  parityChecks,
  leakageChecks,
  missingCellChecks,
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
