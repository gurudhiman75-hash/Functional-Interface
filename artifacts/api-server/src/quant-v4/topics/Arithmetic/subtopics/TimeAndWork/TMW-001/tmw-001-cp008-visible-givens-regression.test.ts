import { equals, toLatex } from "./foundation/rational";
import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";
function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const namespaces = ["tmw-cp008-editorial", "tmw-cp008-editorial-review"] as const;
const seeds = ["0","1","2","3","4","5","6","7"] as const;
let checked = 0;
let equalEfficiencyCases = 0;
for (const language of languages) for (const namespace of namespaces) for (const suffix of seeds) {
  const qlId = "TMW-QL-148";
  const q = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed: `${namespace}:${qlId}:${language}:${suffix}` });
  const label = `${language}:${namespace}:${suffix}`;
  checked += 1;
  assert(q.validation?.valid, `${label}: ${q.validation?.errors?.join(" | ")}`);
  assert(q.publiclyPublishable === false, `${label}: publication lock lost`);
  const [a, b] = q.parameters.context.roles;
  const first = q.learnerExplanation.solution[0] ?? "";
  if (equals(a.efficiency, b.efficiency)) {
    equalEfficiencyCases += 1;
    const visibleRatio = `${toLatex(a.days)}:${toLatex(b.days)}`;
    assert(first.includes(visibleRatio), `${label}: equal-efficiency case does not use visible days ratio ${visibleRatio}`);
    assert(/work rates and daily hours are equal|काम-दर और प्रतिदिन घंटे समान|ਕੰਮ-ਦਰ ਅਤੇ ਹਰ ਰੋਜ਼ ਘੰਟੇ ਇੱਕੋ/i.test(first), `${label}: common efficiency and hours are not explicitly cancelled`);
  } else {
    assert(/work rates|काम-दरें|ਕੰਮ-ਦਰਾਂ/i.test(q.stem), `${label}: unequal rates are not stated in the stem`);
  }
}
assert(checked === 48, `Expected 48 QL148 visible-givens cases, got ${checked}`);
assert(equalEfficiencyCases > 0, "Expected at least one equal-efficiency QL148 case");
console.log(JSON.stringify({ chapter:"TMW-001", checkpoint:"TMW-CP-008", ql:"TMW-QL-148", checked, equalEfficiencyCases, publicationLocked:true, verdict:"PASS" }, null, 2));
