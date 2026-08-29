import { STC_CP001_AUTHORITIES } from "./cp001-authorities.ts";
import { generateStcCp001Question } from "./cp001-generator.ts";
import { stcEntails } from "./truth-model-solver.ts";
import type { StcLocale } from "./types.ts";

const LOCALES: readonly StcLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const QLS = ["STC-QL-001", "STC-QL-002"] as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const scenario of STC_CP001_AUTHORITIES) {
  assert(scenario.candidates.length === 4, `${scenario.id}: expected four candidate authorities`);
  const rendered = new Set(scenario.candidates.map((candidate) => candidate.text["en-IN"]));
  assert(rendered.size === 4, `${scenario.id}: duplicate English candidate text`);
  for (const candidate of scenario.candidates) {
    const follows = stcEntails(scenario.premises, candidate.expression);
    if (!follows) assert(candidate.defectIfNotEntailed, `${scenario.id}/${candidate.id}: non-entailment needs a defect label`);
  }
}

for (const qlId of QLS) {
  const answerClasses = new Set<string>();
  const scenarios = new Set<string>();
  for (let seed = 0; seed < 600; seed += 1) {
    const canonical = generateStcCp001Question({ qlId, locale: "en-IN", seed });
    const again = generateStcCp001Question({ qlId, locale: "en-IN", seed });
    assert(JSON.stringify(canonical) === JSON.stringify(again), `${qlId}/${seed}: nondeterministic output`);
    assert(canonical.options.length === 4, `${qlId}/${seed}: option count`);
    assert(new Set(canonical.options).size === 4, `${qlId}/${seed}: duplicate options`);
    assert(canonical.correctIndex >= 0 && canonical.correctIndex < 4, `${qlId}/${seed}: invalid answer index`);
    assert(canonical.metadata.reviewOnly, `${qlId}/${seed}: review-only lock missing`);
    assert(!canonical.metadata.questionBankWritable, `${qlId}/${seed}: Question Bank unexpectedly open`);
    assert(!canonical.metadata.testEligible && !canonical.metadata.mockEligible && !canonical.metadata.publicEligible, `${qlId}/${seed}: delivery gate unexpectedly open`);
    answerClasses.add(canonical.answerClass);
    scenarios.add(canonical.scenarioId);

    for (const locale of LOCALES) {
      const localized = generateStcCp001Question({ qlId, locale, seed });
      assert(localized.scenarioId === canonical.scenarioId, `${qlId}/${seed}/${locale}: scenario parity`);
      assert(localized.answerClass === canonical.answerClass, `${qlId}/${seed}/${locale}: answer-class parity`);
      assert(localized.correctIndex === canonical.correctIndex, `${qlId}/${seed}/${locale}: answer-index parity`);
      assert(localized.conclusions.length === 2, `${qlId}/${seed}/${locale}: conclusion count`);
      const joined = `${localized.stem} ${localized.conclusions.join(" ")} ${localized.explanation}`;
      assert(!/STC-(QL|SC|CP)-/u.test(joined), `${qlId}/${seed}/${locale}: internal identifier leaked`);
      assert(!/\{\{|\}\}|\[\[|\]\]/u.test(joined), `${qlId}/${seed}/${locale}: unresolved placeholder`);
    }
  }
  assert(answerClasses.size === 4, `${qlId}: all four I/II answer classes must be reachable`);
  const expectedScenarioCount = STC_CP001_AUTHORITIES.filter((scenario) => scenario.qlId === qlId).length;
  assert(scenarios.size === expectedScenarioCount, `${qlId}: not all curated scenarios reached`);
}

console.log(`STC-CP-001 proof passed: ${STC_CP001_AUTHORITIES.length} authorities, ${QLS.length} QLs, ${LOCALES.length} locales, deterministic/parity/delivery locks green.`);
