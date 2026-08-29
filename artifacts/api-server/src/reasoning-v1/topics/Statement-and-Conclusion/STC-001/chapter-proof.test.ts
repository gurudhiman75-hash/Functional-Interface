import { STC_CP001_ALL_AUTHORITIES } from "./cp001-authority-registry.ts";
import { STC_CP002_CONDITIONAL_AUTHORITIES } from "./cp002-conditional-authorities.ts";
import { STC_CP002_MODAL_AUTHORITIES } from "./cp002-modal-authorities.ts";
import { STC_CP003_ORDER_AUTHORITIES } from "./cp003-order-authorities.ts";
import { STC_CP003_TEMPORAL_AUTHORITIES } from "./cp003-temporal-authorities.ts";
import { generateStcQuestion } from "./chapter-generator.ts";
import { STC_001_MANIFEST } from "./chapter-manifest.ts";
import { STC_QL_IDS, type StcLocale } from "./types.ts";

const LOCALES: readonly StcLocale[] = ["en-IN", "hi-IN", "pa-IN"];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const authorityCount =
  STC_CP001_ALL_AUTHORITIES.length +
  STC_CP002_CONDITIONAL_AUTHORITIES.length +
  STC_CP002_MODAL_AUTHORITIES.length +
  STC_CP003_ORDER_AUTHORITIES.length +
  STC_CP003_TEMPORAL_AUTHORITIES.length;

assert(STC_QL_IDS.length === 6, "STC must expose exactly six semantic QLs");
assert(STC_001_MANIFEST.semanticQlCount === 6, "manifest semantic QL count drifted");
assert(STC_001_MANIFEST.lifecycle.semanticQlAllocationComplete, "semantic allocation must be complete");
assert(authorityCount === 24, `expected 24 curated authorities, got ${authorityCount}`);
assert(!STC_001_MANIFEST.lifecycle.chapterFrozen, "chapter must not freeze before human review");
assert(STC_001_MANIFEST.lifecycle.questionStudio === "NOT_REGISTERED", "Question Studio must remain unregistered before review approval");
assert(!STC_001_MANIFEST.lifecycle.questionBankWritable, "Question Bank must remain locked");
assert(!STC_001_MANIFEST.lifecycle.testEligible, "test delivery must remain locked");
assert(!STC_001_MANIFEST.lifecycle.mockEligible, "mock delivery must remain locked");
assert(!STC_001_MANIFEST.lifecycle.publicEligible, "public delivery must remain locked");
assert(!STC_001_MANIFEST.lifecycle.automaticPublication, "automatic publication must remain locked");

for (const qlId of STC_QL_IDS) {
  const classes = new Set<string>();
  const scenarios = new Set<string>();
  const solverIds = new Set<string>();
  for (let seed = 0; seed < 1600; seed += 1) {
    const en = generateStcQuestion({ qlId, locale: "en-IN", seed });
    const again = generateStcQuestion({ qlId, locale: "en-IN", seed });
    assert(JSON.stringify(en) === JSON.stringify(again), `${qlId}/${seed}: nondeterministic chapter output`);
    assert(en.qlId === qlId, `${qlId}/${seed}: routed QL drift`);
    assert(en.options.length === 4 && new Set(en.options).size === 4, `${qlId}/${seed}: option contract`);
    assert(en.correctIndex >= 0 && en.correctIndex < 4, `${qlId}/${seed}: answer index`);
    assert(en.conclusions.length === 2, `${qlId}/${seed}: two-conclusion contract`);
    assert(en.metadata.reviewOnly, `${qlId}/${seed}: review-only lock missing`);
    assert(!en.metadata.questionBankWritable && !en.metadata.testEligible && !en.metadata.mockEligible && !en.metadata.publicEligible, `${qlId}/${seed}: delivery lock opened`);
    classes.add(en.answerClass);
    scenarios.add(en.scenarioId);
    solverIds.add(en.metadata.solver);

    for (const locale of LOCALES) {
      const localized = generateStcQuestion({ qlId, locale, seed });
      assert(localized.scenarioId === en.scenarioId, `${qlId}/${seed}/${locale}: scenario parity`);
      assert(localized.answerClass === en.answerClass, `${qlId}/${seed}/${locale}: answer class parity`);
      assert(localized.correctIndex === en.correctIndex, `${qlId}/${seed}/${locale}: answer index parity`);
      assert(localized.metadata.solver === en.metadata.solver, `${qlId}/${seed}/${locale}: solver parity`);
      const surface = `${localized.stem} ${localized.conclusions.join(" ")} ${localized.options.join(" ")} ${localized.explanation}`;
      assert(surface.trim().length > 0, `${qlId}/${seed}/${locale}: blank surface`);
      assert(!/STC-(?:QL|SC|CP)-/u.test(surface), `${qlId}/${seed}/${locale}: internal identifier leaked`);
      assert(!/\{\{|\}\}|\[\[|\]\]|undefined|null/u.test(surface), `${qlId}/${seed}/${locale}: unresolved token leaked`);
    }
  }
  assert(classes.size === 4, `${qlId}: all four I/II answer classes must be reachable`);
  assert(scenarios.size >= 4, `${qlId}: curated scenario reach is too thin (${scenarios.size})`);
  assert(solverIds.size === 1, `${qlId}: QL unexpectedly changes solver family`);
}

console.log(`STC-001 chapter proof passed: 6 QLs, ${authorityCount} curated authorities, 3 locales, 9,600 canonical seeds plus parity surfaces.`);
