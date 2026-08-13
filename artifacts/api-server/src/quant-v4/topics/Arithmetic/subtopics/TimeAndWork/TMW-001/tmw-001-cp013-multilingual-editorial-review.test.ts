import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function ok(v: unknown, m: string): asserts v { if (!v) throw new Error(m); }

const expected: Record<string, string> = {
  "TMW-QL-216": "I_ONLY", "TMW-QL-217": "II_ONLY",
  "TMW-QL-218": "TOGETHER_ONLY", "TMW-QL-219": "EVEN_TOGETHER_INSUFFICIENT",
  "TMW-QL-220": "I_ONLY", "TMW-QL-221": "II_ONLY",
  "TMW-QL-222": "TOGETHER_ONLY", "TMW-QL-223": "EVEN_TOGETHER_INSUFFICIENT",
};
const qls = Object.keys(expected);
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const counts = new Map<string, number>();
let checked = 0;

function snapshot(q: any): string {
  return JSON.stringify({
    cls: q.canonicalClass,
    fingerprint: q.hiddenState.fingerprint,
    sizes: [q.hiddenState.iCandidates.length, q.hiddenState.iiCandidates.length, q.hiddenState.combinedCandidates.length],
    optionClasses: q.optionAudit.map((o: any) => o.value).sort(),
  });
}

for (const qlId of qls) {
  for (let n = 0; n < 8; n += 1) {
    const seed = `tmw-cp013-editorial:${qlId}:${n}`;
    const byLanguage = new Map<Tmw001ChapterLanguage, any>();
    for (const language of languages) {
      const q = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      byLanguage.set(language, q);
      checked += 1;
      counts.set(q.canonicalClass, (counts.get(q.canonicalClass) ?? 0) + 1);
      const label = `${qlId}:${language}:${n}`;
      const e = q.explanation;
      const text = [q.stem, ...q.options, e.opening, ...e.givens, ...e.steps, e.shortcut.title, ...e.shortcut.steps, e.commonTrap.explanation, e.conclusion].join(" ");

      ok(q.canonicalProblemId === "TMW-CP-013" && q.questionLanguageId === qlId, `${label}: identity`);
      ok(q.validation?.valid && q.publiclyPublishable === false, `${label}: validation/publication`);
      ok(q.representation === "DATA_SUFFICIENCY" && q.learnerExplanationVersion === "TMW_DS_V1", `${label}: DS contract`);
      ok(q.canonicalClass === expected[qlId] && q.canonicalAnswer === q.verifierAnswer, `${label}: class/verifier`);
      ok(q.options.length === 4 && new Set(q.options).size === 4, `${label}: options`);
      ok(q.options[q.correctIndex] === q.canonicalAnswer, `${label}: answer-option`);
      ok(e.givens.length === 2 && e.steps.length >= 4 && e.shortcut.steps.length === 2, `${label}: teaching depth`);
      ok(e.commonTrap.explanation.includes(e.commonTrap.optionText), `${label}: trap option not named`);
      ok(e.conclusion === q.canonicalAnswer, `${label}: conclusion`);
      ok(!/undefined|null|NaN|Infinity/u.test(text), `${label}: unresolved text`);
      if (language === "en") ok(!/candidate set/i.test(text), `${label}: generator wording`);
      if (language === "hi") ok(e.shortcut.title === "डेटा-पर्याप्तता निर्णय नियम", `${label}: Hindi title`);
      if (language === "pa") ok(e.shortcut.title === "ਡਾਟਾ-ਪੂਰਤਾ ਫੈਸਲਾ ਨਿਯਮ", `${label}: Punjabi title`);
      if (qlId === "TMW-QL-222" && language !== "en") ok(!/\b(?:inlet|leak|net)\b/i.test(text), `${label}: pipe English leakage`);
    }
    const en = byLanguage.get("en"), hi = byLanguage.get("hi"), pa = byLanguage.get("pa");
    ok(en && hi && pa, `${qlId}:${n}: missing language`);
    const baseline = snapshot(en);
    ok(snapshot(hi) === baseline && snapshot(pa) === baseline, `${qlId}:${n}: semantic parity`);
  }
}

ok(checked === 192, `Expected 192 cases, got ${checked}`);
for (const cls of ["I_ONLY", "II_ONLY", "TOGETHER_ONLY", "EVEN_TOGETHER_INSUFFICIENT"]) ok(counts.get(cls) === 48, `${cls} count`);
console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-013", checked, verdict: "PASS" }, null, 2));
