import { generateDi001LocalizedReviewQuestion, type Di001LocalizationLocale } from "./localization-review-v1";
import { DI001_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi001PermanentQuestion } from "./permanent-question-generator";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown) {
  return JSON.stringify(value);
}

function learnerText(pkg: ReturnType<typeof generateDi001LocalizedReviewQuestion>) {
  const table = pkg.question.explanation.workingTable;
  return [
    pkg.stimulus.title,
    pkg.stimulus.instruction,
    ...pkg.stimulus.columns,
    pkg.stimulus.unit,
    ...pkg.stimulus.rows.flatMap((row) => [row.centre, String(row.applicants), String(row.selected)]),
    pkg.question.stem,
    ...pkg.question.options,
    pkg.question.answer,
    pkg.question.explanation.keyIdea,
    ...pkg.question.explanation.steps,
    ...(table?.headers ?? []),
    ...(table?.rows.flat() ?? []),
  ].join(" ");
}

function normalizeLocalizedOption(value: string, locale: Di001LocalizationLocale, source: ReturnType<typeof generateDi001PermanentQuestion>) {
  if (/^(?:केंद्र|ਕੇਂਦਰ) \d+$/u.test(value)) {
    const index = Number(value.match(/\d+/u)?.[0] ?? "0") - 1;
    return source.stimulus.rows[index]?.centre ?? value;
  }
  if (locale === "hi-IN") return value.replace(" प्रतिशत अंक", " percentage points");
  return value.replace(" ਪ੍ਰਤੀਸ਼ਤ ਅੰਕ", " percentage points");
}

const locales: readonly Di001LocalizationLocale[] = ["hi-IN", "pa-IN"];
let parityChecks = 0;
let leakageChecks = 0;
let lifecycleChecks = 0;
let deterministicChecks = 0;
const surfaceCoverage = new Map<string, Set<string>>();

for (const locale of locales) {
  for (const descriptor of DI001_PERMANENT_QLS) {
    const key = `${locale}:${descriptor.qlId}`;
    surfaceCoverage.set(key, new Set<string>());

    for (let sample = 1; sample <= 30; sample += 1) {
      const examProfile = sample % 2 === 0 ? "BANKING_PRELIMS" as const : "SSC_CGL_TIER_I" as const;
      const seed = `DI001-LOCALIZATION-${locale}-${descriptor.qlId}-${sample}`;
      const source = generateDi001PermanentQuestion({ seed, examProfile, taskKind: descriptor.taskKind });
      const localized = generateDi001LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });
      const replay = generateDi001LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });

      assert(localized.question.kind === source.question.kind, `${key} task kind drifted.`);
      assert(localized.question.difficulty === source.question.difficulty, `${key} difficulty drifted.`);
      assert(localized.question.correctIndex === source.question.correctIndex, `${key} correct index changed.`);
      assert(localized.question.options.length === source.question.options.length, `${key} option count changed.`);
      assert(localized.stimulus.rows.length === source.stimulus.rows.length, `${key} row count changed.`);
      for (let rowIndex = 0; rowIndex < source.stimulus.rows.length; rowIndex += 1) {
        const a = source.stimulus.rows[rowIndex]!;
        const b = localized.stimulus.rows[rowIndex]!;
        assert(a.applicants === b.applicants && a.selected === b.selected, `${key} numeric table state changed at row ${rowIndex}.`);
      }

      const normalizedOptions = localized.question.options.map((option) => normalizeLocalizedOption(option, locale, source));
      assert(stable(normalizedOptions) === stable(source.question.options), `${key} option semantics changed during localization.`);
      const normalizedAnswer = normalizeLocalizedOption(localized.question.answer, locale, source);
      assert(normalizedAnswer === source.question.answer, `${key} answer semantics changed during localization.`);
      assert(localized.question.options[localized.question.correctIndex] === localized.question.answer, `${key} localized answer-index binding failed.`);
      parityChecks += 1;

      const text = learnerText(localized);
      assert(!/[A-Za-z]/u.test(text), `${key} leaks Roman learner-facing text: ${text}`);
      assert(!/\d+\.\d+/u.test(text), `${key} exposes decimal learner-facing values: ${text}`);
      if (locale === "hi-IN") assert(/[\u0900-\u097F]/u.test(text), `${key} lacks Devanagari learner text.`);
      else assert(/[\u0A00-\u0A7F]/u.test(text), `${key} lacks Gurmukhi learner text.`);
      assert(localized.question.explanation.steps.length >= 1, `${key} localized explanation is empty.`);
      if (["OVERALL_SELECTION_PERCENTAGE", "SELECTED_TO_NOT_SELECTED_RATIO", "SELECTION_RATE_DIFFERENCE"].includes(descriptor.taskKind)) {
        assert(localized.question.explanation.workingTable, `${key} lost its useful working table.`);
      }
      leakageChecks += 1;

      assert(localized.localizationStatus === "HI_PA_FROZEN", `${key} localization status drifted.`);
      assert(localized.traceability.questionStudioDiscoverable === true, `${key} is not Question Studio discoverable after approval.`);
      assert(localized.traceability.questionBankWritable === false && localized.traceability.testEligible === false && localized.traceability.mockTestEligible === false, `${key} widened learner lifecycle authority.`);
      assert(localized.traceability.publiclyPublishable === false && localized.traceability.automaticStudentPublication === false && localized.traceability.productionReleaseAuthorized === false, `${key} widened publication authority.`);
      lifecycleChecks += 1;

      assert(stable(localized) === stable(replay), `${key} is not deterministic.`);
      deterministicChecks += 1;

      const normalizedStem = localized.question.stem.replace(/\d+/gu, "N");
      surfaceCoverage.get(key)!.add(normalizedStem);
    }
  }
}

for (const [key, surfaces] of surfaceCoverage) {
  assert(surfaces.size >= 3, `${key} exercised only ${surfaces.size} localized stem surfaces.`);
}

console.log(JSON.stringify({
  status: "PASS_DI_001_HI_PA_LOCALIZATION_FROZEN_V1",
  permanentQlCount: DI001_PERMANENT_QLS.length,
  locales,
  parityChecks,
  leakageChecks,
  lifecycleChecks,
  deterministicChecks,
  localizedSurfaceFamilies: surfaceCoverage.size,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}));
