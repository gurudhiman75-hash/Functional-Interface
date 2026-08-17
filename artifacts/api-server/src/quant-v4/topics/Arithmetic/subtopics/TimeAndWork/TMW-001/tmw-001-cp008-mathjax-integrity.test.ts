import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";
function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const qls = Array.from({ length: 13 }, (_, i) => `TMW-QL-${String(i + 144).padStart(3,"0")}`);
const languages: readonly Tmw001ChapterLanguage[] = ["en","hi","pa"];
const namespaces = ["tmw-cp008-editorial","tmw-cp008-editorial-review"] as const;
const seeds = ["0","1","2","3","4","5","6","7"] as const;
let checked = 0;
for (const qlId of qls) for (const language of languages) for (const namespace of namespaces) for (const suffix of seeds) {
  const q = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed: `${namespace}:${qlId}:${language}:${suffix}` });
  const label = `${qlId}:${language}:${namespace}:${suffix}`;
  checked += 1;
  const text = [q.stem, q.learnerExplanation.method, ...q.learnerExplanation.solution, q.learnerExplanation.answer, ...(q.explanation?.steps ?? [])].join(" ");
  assert(!/[\u0000-\u001F\u007F]/u.test(text), `${label}: control character remains`);
  assert((text.match(/\\\(/g) ?? []).length === (text.match(/\\\)/g) ?? []).length, `${label}: unbalanced inline MathJax`);
  assert(!/\t|\f/.test(text), `${label}: escaped control sequence remains`);
  assert(!/(?:^|[^\d])(\d+(?:\/\d+)?)=\1(?:[^\d]|$)/.test(text), `${label}: exact duplicate numeric identity remains`);
  assert(q.validation?.valid, `${label}: ${q.validation?.errors?.join(" | ")}`);
  assert(q.publiclyPublishable === false, `${label}: publication lock lost`);
}
assert(checked === 624, `Expected 624 CP008 MathJax cases, got ${checked}`);
console.log(JSON.stringify({ chapter:"TMW-001", checkpoint:"TMW-CP-008", qls:13, languages:3, seedNamespaces:2, seedsPerNamespace:8, checked, publicationLocked:true, verdict:"PASS" }, null, 2));
