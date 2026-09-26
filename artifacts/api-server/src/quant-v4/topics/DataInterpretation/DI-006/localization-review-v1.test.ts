import { generateDi006V2Set, resolveDi006V2Counts } from "./caselet-set-v2";
import {
  DI006_LOCALIZATION_CONTEXTS,
  generateDi006LocalizedReviewQuestion,
  type Di006LocalizationLocale,
} from "./localization-review-v1";
import { DI006_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi006PermanentQuestion } from "./permanent-question-generator";

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
    topologyId: stimulus.topologyId,
    totalValue: stimulus.totalValue,
    directIndex: stimulus.directIndex,
    directValue: stimulus.directValue,
    remainderIndex: stimulus.remainderIndex,
    relationShape: stimulus.relations.map((relation: any) => ({
      targetIndex: relation.targetIndex,
      sourceIndex: relation.sourceIndex,
      numerator: relation.numerator,
      denominator: relation.denominator,
      depth: relation.depth,
    })),
  };
}

function learnerText(pkg: ReturnType<typeof generateDi006LocalizedReviewQuestion>) {
  return [
    pkg.stimulus.title,
    pkg.stimulus.instruction,
    pkg.stimulus.learnerText,
    pkg.stimulus.totalLabel,
    pkg.stimulus.unit,
    ...pkg.stimulus.categories,
    pkg.question.stem,
    ...pkg.question.options,
    pkg.question.answer,
    pkg.question.explanation.keyIdea,
    ...pkg.question.explanation.steps,
  ].join(" ");
}

function relationOrder(stimulus: any) {
  return stimulus.relations
    .map((relation: any, index: number) => ({
      index,
      position: stimulus.learnerText.indexOf(relation.learnerText),
    }))
    .sort((a: any, b: any) => a.position - b.position)
    .map((item: any) => item.index);
}

const locales: readonly Di006LocalizationLocale[] = ["hi-IN", "pa-IN"];
const sourceContexts = new Set<string>();
const sourceCategories = new Set<string>();
const topologies = new Set<string>();

for (const profile of ["SSC_CGL_TIER_I", "BANKING_PRELIMS"] as const) {
  for (let index = 1; index <= 220; index += 1) {
    const set = generateDi006V2Set({
      seed: `DI006-LOCALIZATION-COVERAGE-${profile}-${index}`,
      examProfile: profile,
    });
    sourceContexts.add(set.stimulus.contextId);
    topologies.add(set.stimulus.topologyId);
    set.stimulus.categories.forEach((category) => sourceCategories.add(category));
  }
}

assert(sourceContexts.size === 6, `DI-006 source context sweep reached ${sourceContexts.size}/6 contexts.`);
assert(sourceCategories.size === 30, `DI-006 source sweep exposed ${sourceCategories.size}/30 categories.`);
assert(topologies.size === 4, `DI-006 source topology sweep reached ${topologies.size}/4 topologies.`);
assert(Object.keys(DI006_LOCALIZATION_CONTEXTS).length === 6, "DI-006 localization must define exactly six context families.");

let parityChecks = 0;
let leakageChecks = 0;
let proseChecks = 0;
let lifecycleChecks = 0;
let deterministicChecks = 0;
let relationOrderChecks = 0;
let hardChecks = 0;
const surfaceCoverage = new Map<string, Set<string>>();

for (const locale of locales) {
  for (const descriptor of DI006_PERMANENT_QLS) {
    const coverageKey = `${locale}:${descriptor.qlId}`;
    surfaceCoverage.set(coverageKey, new Set<string>());

    for (let sample = 1; sample <= 30; sample += 1) {
      const examProfile = sample % 2 === 0 ? "BANKING_PRELIMS" as const : "SSC_CGL_TIER_I" as const;
      const seed = `DI006-LOCALIZATION-${locale}-${descriptor.qlId}-${sample}`;
      const source = generateDi006PermanentQuestion({ seed, examProfile, taskKind: descriptor.taskKind });
      const localized = generateDi006LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });
      const replay = generateDi006LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });

      assert(localized.question.kind === source.question.kind, `${coverageKey} task kind drifted.`);
      assert(localized.question.difficulty === source.question.difficulty, `${coverageKey} difficulty drifted.`);
      assert(localized.question.correctIndex === source.question.correctIndex, `${coverageKey} correct index changed.`);
      assert(stable(localized.question.options) === stable(source.question.options), `${coverageKey} numeric/ratio options changed during localization.`);
      assert(localized.question.answer === source.question.answer, `${coverageKey} answer changed during localization.`);
      assert(localized.question.options[localized.question.correctIndex] === localized.question.answer, `${coverageKey} answer-index binding failed.`);
      assert(stable(semanticStimulus(localized.stimulus)) === stable(semanticStimulus(source.stimulus)), `${coverageKey} semantic caselet structure changed during localization.`);
      assert(stable(resolveDi006V2Counts(localized.stimulus as any)) === stable(resolveDi006V2Counts(source.stimulus)), `${coverageKey} resolved category values changed during localization.`);
      parityChecks += 1;

      const sourceOrder = relationOrder(source.stimulus);
      const localizedOrder = relationOrder(localized.stimulus);
      assert(stable(localizedOrder) === stable(sourceOrder), `${coverageKey} shuffled relation-fact order changed during localization.`);
      assert(localized.stimulus.relations.every((relation) => localized.stimulus.learnerText.includes(relation.learnerText)), `${coverageKey} localized caselet dropped a relation fact.`);
      relationOrderChecks += 1;

      const text = learnerText(localized);
      assert(!/[A-Za-z]/u.test(text), `${coverageKey} leaks Roman learner-facing text: ${text}`);
      if (locale === "hi-IN") assert(/[\u0900-\u097F]/u.test(text), `${coverageKey} lacks Devanagari learner text.`);
      else assert(/[\u0A00-\u0A7F]/u.test(text), `${coverageKey} lacks Gurmukhi learner text.`);
      leakageChecks += 1;

      assert(localized.stimulus.kind === "CASELET", `${coverageKey} lost CASELET semantics.`);
      assert(localized.stimulus.categories.length === 5, `${coverageKey} lost five-category shape.`);
      assert(localized.stimulus.relations.length === 3, `${coverageKey} lost three relation facts.`);
      assert(localized.stimulus.learnerText.length > 120, `${coverageKey} localized prose is unexpectedly thin.`);
      assert(!/[|]/u.test(localized.stimulus.learnerText), `${coverageKey} localized prose leaked table serialization.`);
      assert(localized.question.explanation.steps.length >= 1, `${coverageKey} localized explanation is empty.`);
      proseChecks += 1;

      assert(localized.localizationStatus === "HI_PA_FROZEN", `${coverageKey} localization status drifted.`);
      assert(localized.traceability.questionStudioDiscoverable === true, `${coverageKey} must be Question Studio discoverable after freeze.`);
      assert(localized.traceability.questionBankWritable === false && localized.traceability.testEligible === false && localized.traceability.mockTestEligible === false, `${coverageKey} widened learner lifecycle authority.`);
      assert(localized.traceability.publiclyPublishable === false && localized.traceability.automaticStudentPublication === false && localized.traceability.productionReleaseAuthorized === false, `${coverageKey} widened publication authority.`);
      lifecycleChecks += 1;

      if (descriptor.difficulty === "Hard") {
        assert(localized.question.explanation.steps.length >= 2, `${coverageKey} Hard explanation lost multi-step reasoning.`);
        hardChecks += 1;
      }

      assert(stable(localized) === stable(replay), `${coverageKey} is not deterministic for a fixed seed.`);
      deterministicChecks += 1;
      surfaceCoverage.get(coverageKey)!.add(localized.question.stemSurfaceId);
    }
  }
}

for (const [key, surfaces] of surfaceCoverage) {
  assert(surfaces.size === 3, `${key} exercised only ${surfaces.size}/3 localized stem surfaces.`);
}

console.log(JSON.stringify({
  status: "PASS_DI_006_HI_PA_FROZEN_V1",
  sourceContexts: sourceContexts.size,
  sourceCategories: sourceCategories.size,
  topologies: topologies.size,
  permanentQlCount: DI006_PERMANENT_QLS.length,
  locales,
  parityChecks,
  leakageChecks,
  proseChecks,
  relationOrderChecks,
  lifecycleChecks,
  deterministicChecks,
  hardChecks,
  localizedSurfaceFamilies: surfaceCoverage.size,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}));
