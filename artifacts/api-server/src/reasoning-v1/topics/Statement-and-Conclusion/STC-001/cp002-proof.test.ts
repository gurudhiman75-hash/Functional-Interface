import { STC_CP002_CONDITIONAL_AUTHORITIES } from "./cp002-conditional-authorities.ts";
import { STC_CP002_MODAL_AUTHORITIES } from "./cp002-modal-authorities.ts";
import { generateStcCp002Question } from "./cp002-generator.ts";
import { modalClaim, stcModalEntails } from "./modal-strength-solver.ts";
import { atom, implies, not, stcEntails } from "./truth-model-solver.ts";
import type { StcLocale } from "./types.ts";

const LOCALES: readonly StcLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const QLS = ["STC-QL-003", "STC-QL-004"] as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

// Independent conditional rules: modus ponens is valid; converse and inverse are not.
const a = atom("a");
const b = atom("b");
assert(stcEntails([implies(a, b), a], b), "modus ponens must entail consequent");
assert(!stcEntails([implies(a, b)], implies(b, a)), "converse must not be entailed");
assert(!stcEntails([implies(a, b)], implies(not(a), not(b))), "inverse must not be entailed");

// Modal-strength lattice: certainty may weaken to possibility, possibility may not strengthen to certainty.
assert(stcModalEntails(modalClaim("x", "CERTAIN"), modalClaim("x", "CERTAIN")), "certain -> certain");
assert(stcModalEntails(modalClaim("x", "CERTAIN"), modalClaim("x", "POSSIBLE")), "certain -> possible");
assert(stcModalEntails(modalClaim("x", "POSSIBLE"), modalClaim("x", "POSSIBLE")), "possible -> possible");
assert(!stcModalEntails(modalClaim("x", "POSSIBLE"), modalClaim("x", "CERTAIN")), "possible must not imply certain");
assert(!stcModalEntails(modalClaim("x", "CERTAIN"), modalClaim("x", "CERTAIN", "NEGATIVE")), "polarity flip must fail");
assert(!stcModalEntails(modalClaim("x", "CERTAIN"), modalClaim("y", "POSSIBLE")), "unrelated modal atom must fail");

for (const scenario of STC_CP002_CONDITIONAL_AUTHORITIES) {
  assert(scenario.candidates.length === 4, `${scenario.id}: expected four candidates`);
  assert(new Set(scenario.candidates.map((candidate) => candidate.text["en-IN"])).size === 4, `${scenario.id}: duplicate English candidate`);
  for (const candidate of scenario.candidates) {
    const follows = stcEntails(scenario.premises, candidate.expression);
    if (!follows) assert(candidate.defectIfNotEntailed, `${scenario.id}/${candidate.id}: missing conditional defect label`);
  }
}

for (const scenario of STC_CP002_MODAL_AUTHORITIES) {
  assert(scenario.candidates.length === 4, `${scenario.id}: expected four candidates`);
  assert(new Set(scenario.candidates.map((candidate) => candidate.text["en-IN"])).size === 4, `${scenario.id}: duplicate English candidate`);
  for (const candidate of scenario.candidates) {
    const follows = stcModalEntails(scenario.premise, candidate.claim);
    if (!follows) assert(candidate.defectIfNotEntailed, `${scenario.id}/${candidate.id}: missing modal defect label`);
  }
}

for (const qlId of QLS) {
  const classes = new Set<string>();
  const scenarios = new Set<string>();
  for (let seed = 0; seed < 1200; seed += 1) {
    const canonical = generateStcCp002Question({ qlId, locale: "en-IN", seed });
    const again = generateStcCp002Question({ qlId, locale: "en-IN", seed });
    assert(JSON.stringify(canonical) === JSON.stringify(again), `${qlId}/${seed}: nondeterministic output`);
    assert(canonical.checkpointId === "STC-CP-002", `${qlId}/${seed}: wrong checkpoint`);
    assert(canonical.options.length === 4 && new Set(canonical.options).size === 4, `${qlId}/${seed}: option contract`);
    assert(canonical.correctIndex >= 0 && canonical.correctIndex < 4, `${qlId}/${seed}: answer index`);
    assert(canonical.metadata.reviewOnly, `${qlId}/${seed}: review-only lock missing`);
    assert(!canonical.metadata.questionBankWritable, `${qlId}/${seed}: Question Bank unexpectedly open`);
    assert(!canonical.metadata.testEligible && !canonical.metadata.mockEligible && !canonical.metadata.publicEligible, `${qlId}/${seed}: delivery gate unexpectedly open`);
    if (qlId === "STC-QL-003") assert(canonical.metadata.solver === "TRUTH_MODEL_ENTAILMENT_V1", `${qlId}/${seed}: wrong solver`);
    if (qlId === "STC-QL-004") assert(canonical.metadata.solver === "MODAL_STRENGTH_ENTAILMENT_V1", `${qlId}/${seed}: wrong solver`);
    classes.add(canonical.answerClass);
    scenarios.add(canonical.scenarioId);

    for (const locale of LOCALES) {
      const localized = generateStcCp002Question({ qlId, locale, seed });
      assert(localized.scenarioId === canonical.scenarioId, `${qlId}/${seed}/${locale}: scenario parity`);
      assert(localized.answerClass === canonical.answerClass, `${qlId}/${seed}/${locale}: answer-class parity`);
      assert(localized.correctIndex === canonical.correctIndex, `${qlId}/${seed}/${locale}: answer-index parity`);
      const joined = `${localized.stem} ${localized.conclusions.join(" ")} ${localized.explanation}`;
      assert(!/STC-(QL|SC|CP)-/u.test(joined), `${qlId}/${seed}/${locale}: internal identifier leaked`);
      assert(!/\{\{|\}\}|\[\[|\]\]/u.test(joined), `${qlId}/${seed}/${locale}: unresolved placeholder`);
    }
  }
  assert(classes.size === 4, `${qlId}: all four I/II answer classes must be reachable`);
  const expected = qlId === "STC-QL-003" ? STC_CP002_CONDITIONAL_AUTHORITIES.length : STC_CP002_MODAL_AUTHORITIES.length;
  assert(scenarios.size === expected, `${qlId}: not all curated scenarios reached`);
}

console.log(`STC-CP-002 proof passed: ${STC_CP002_CONDITIONAL_AUTHORITIES.length + STC_CP002_MODAL_AUTHORITIES.length} authorities, 2 QLs, 3 locales.`);
