import { STC_CP003_ORDER_AUTHORITIES } from "./cp003-order-authorities.ts";
import { STC_CP003_TEMPORAL_AUTHORITIES } from "./cp003-temporal-authorities.ts";
import { STC_EXAM_REALNESS_ORDER_AUTHORITIES, STC_EXAM_REALNESS_TEMPORAL_AUTHORITIES } from "./exam-realness-expansion-cp003-v1.ts";
import { generateStcCp003Question } from "./cp003-generator.ts";
import { orderClaim, stcOrderEntails } from "./strict-order-solver.ts";
import { beforeClaim, stcTemporalEntails, trendClaim } from "./temporal-trend-solver.ts";
import type { StcLocale } from "./types.ts";

const LOCALES: readonly StcLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const QLS = ["STC-QL-005", "STC-QL-006"] as const;
const ORDER_AUTHORITIES = [...STC_CP003_ORDER_AUTHORITIES, ...STC_EXAM_REALNESS_ORDER_AUTHORITIES] as const;
const TEMPORAL_AUTHORITIES = [...STC_CP003_TEMPORAL_AUTHORITIES, ...STC_EXAM_REALNESS_TEMPORAL_AUTHORITIES] as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(stcOrderEntails([orderClaim("rank", "a", "b"), orderClaim("rank", "b", "c")], orderClaim("rank", "a", "c")), "strict-order transitivity must hold");
assert(!stcOrderEntails([orderClaim("rank", "a", "b"), orderClaim("rank", "b", "c")], orderClaim("rank", "c", "a")), "reversed strict order must fail");
assert(!stcOrderEntails([orderClaim("rank", "a", "b")], orderClaim("age", "a", "b")), "unrelated relation must fail");
assert(stcTemporalEntails([beforeClaim("a", "b"), beforeClaim("b", "c")], beforeClaim("a", "c")), "temporal transitivity must hold");
assert(!stcTemporalEntails([beforeClaim("a", "b"), beforeClaim("b", "c")], beforeClaim("c", "a")), "reversed time must fail");
assert(stcTemporalEntails([trendClaim("m", "jan", "feb", "INCREASED"), trendClaim("m", "feb", "mar", "INCREASED")], trendClaim("m", "jan", "mar", "INCREASED")), "increase trend must compose transitively");
assert(stcTemporalEntails([trendClaim("m", "jan", "feb", "DECREASED"), trendClaim("m", "feb", "mar", "DECREASED")], trendClaim("m", "jan", "mar", "DECREASED")), "decrease trend must compose transitively");
assert(!stcTemporalEntails([trendClaim("m", "jan", "feb", "INCREASED"), trendClaim("m", "feb", "mar", "INCREASED")], trendClaim("m", "jan", "mar", "DECREASED")), "reversed trend must fail");

for (const scenario of ORDER_AUTHORITIES) {
  assert(scenario.candidates.length === 4, `${scenario.id}: expected four candidates`);
  assert(new Set(scenario.candidates.map((candidate) => candidate.text["en-IN"])).size === 4, `${scenario.id}: duplicate English candidate`);
  for (const candidate of scenario.candidates) {
    const follows = stcOrderEntails(scenario.premises, candidate.claim);
    if (!follows) assert(candidate.defectIfNotEntailed, `${scenario.id}/${candidate.id}: missing order defect label`);
  }
}

for (const scenario of TEMPORAL_AUTHORITIES) {
  assert(scenario.candidates.length === 4, `${scenario.id}: expected four candidates`);
  assert(new Set(scenario.candidates.map((candidate) => candidate.text["en-IN"])).size === 4, `${scenario.id}: duplicate English candidate`);
  for (const candidate of scenario.candidates) {
    const follows = stcTemporalEntails(scenario.premises, candidate.claim);
    if (!follows) assert(candidate.defectIfNotEntailed, `${scenario.id}/${candidate.id}: missing temporal defect label`);
  }
}

for (const qlId of QLS) {
  const classes = new Set<string>();
  const scenarios = new Set<string>();
  for (let seed = 0; seed < 4096; seed += 1) {
    const canonical = generateStcCp003Question({ qlId, locale: "en-IN", seed });
    const again = generateStcCp003Question({ qlId, locale: "en-IN", seed });
    assert(JSON.stringify(canonical) === JSON.stringify(again), `${qlId}/${seed}: nondeterministic output`);
    assert(canonical.checkpointId === "STC-CP-003", `${qlId}/${seed}: wrong checkpoint`);
    assert(canonical.options.length === 4 && new Set(canonical.options).size === 4, `${qlId}/${seed}: option contract`);
    assert(canonical.correctIndex >= 0 && canonical.correctIndex < 4, `${qlId}/${seed}: answer index`);
    assert(canonical.metadata.reviewOnly, `${qlId}/${seed}: review-only lock missing`);
    assert(!canonical.metadata.questionBankWritable, `${qlId}/${seed}: Question Bank unexpectedly open`);
    assert(!canonical.metadata.testEligible && !canonical.metadata.mockEligible && !canonical.metadata.publicEligible, `${qlId}/${seed}: delivery gate unexpectedly open`);
    if (qlId === "STC-QL-005") assert(canonical.metadata.solver === "STRICT_ORDER_CLOSURE_V1", `${qlId}/${seed}: wrong solver`);
    if (qlId === "STC-QL-006") assert(canonical.metadata.solver === "TEMPORAL_TREND_CLOSURE_V1", `${qlId}/${seed}: wrong solver`);
    classes.add(canonical.answerClass);
    scenarios.add(canonical.scenarioId);

    for (const locale of LOCALES) {
      const localized = generateStcCp003Question({ qlId, locale, seed });
      assert(localized.scenarioId === canonical.scenarioId, `${qlId}/${seed}/${locale}: scenario parity`);
      assert(localized.answerClass === canonical.answerClass, `${qlId}/${seed}/${locale}: answer parity`);
      assert(localized.correctIndex === canonical.correctIndex, `${qlId}/${seed}/${locale}: index parity`);
      const joined = `${localized.stem} ${localized.conclusions.join(" ")} ${localized.explanation}`;
      assert(!/STC-(QL|SC|CP)-/u.test(joined), `${qlId}/${seed}/${locale}: internal identifier leaked`);
      assert(!/\{\{|\}\}|\[\[|\]\]/u.test(joined), `${qlId}/${seed}/${locale}: unresolved placeholder`);
    }
  }
  assert(classes.size === 4, `${qlId}: all four answer classes must be reachable`);
  const expectedIds = new Set((qlId === "STC-QL-005" ? ORDER_AUTHORITIES : TEMPORAL_AUTHORITIES).map((scenario) => scenario.id));
  assert(scenarios.size === expectedIds.size, `${qlId}: expected ${expectedIds.size} scenarios, reached ${scenarios.size}`);
  for (const scenarioId of expectedIds) assert(scenarios.has(scenarioId), `${qlId}: scenario ${scenarioId} is unreachable`);
}

console.log(`STC-CP-003 proof passed: ${ORDER_AUTHORITIES.length + TEMPORAL_AUTHORITIES.length} authorities (${STC_CP003_ORDER_AUTHORITIES.length + STC_CP003_TEMPORAL_AUTHORITIES.length} historical + ${STC_EXAM_REALNESS_ORDER_AUTHORITIES.length + STC_EXAM_REALNESS_TEMPORAL_AUTHORITIES.length} expansion), 2 QLs, 3 locales.`);
