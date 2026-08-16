import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function ok(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
function proseInsideMath(value: string): boolean {
  for (const hit of value.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
    if (/[\u0900-\u097F\u0A00-\u0A7F]/u.test(hit[1] ?? "")) return true;
  }
  return false;
}
function snapshot(q: any): string {
  return JSON.stringify({
    parameters: q.parameters,
    answer: q.solution?.answer,
    answerType: q.solution?.answerType,
    formula: q.solution?.formulaLatex,
    fingerprint: q.mathematicalFingerprint,
    optionValues: (q.optionAudit ?? []).map((o: any) => JSON.stringify(o.value)).sort(),
    misconceptions: (q.optionAudit ?? []).map((o: any) => o.misconceptionId).sort(),
  });
}
function visible(q: any): string {
  const e = q.explanation ?? {}, l = q.learnerExplanation ?? {};
  return [q.stem, ...(q.options ?? []), q.solution?.answerText, e.opening, e.formula, ...(e.givens ?? []), ...(e.steps ?? []), e.shortcut?.title, ...(e.shortcut?.steps ?? []), e.commonTrap?.explanation, e.conclusion, l.method, ...(l.solution ?? []), l.answer].filter(Boolean).join(" ");
}

const qls = ["TMW-QL-212", "TMW-QL-213", "TMW-QL-214", "TMW-QL-215"] as const;
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const namespaces = ["tmw-cp012-editorial", "tmw-cp012-editorial-review"] as const;
const seeds = Array.from({ length: 16 }, (_, i) => String(i));
const modes = new Set<string>();
let checked = 0;

for (const qlId of qls) {
  for (const namespace of namespaces) {
    for (const suffix of seeds) {
      const seed = `${namespace}:${qlId}:${suffix}`;
      const generated = new Map<Tmw001ChapterLanguage, any>();
      for (const language of languages) {
        const q = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
        generated.set(language, q); checked += 1; modes.add(q.solveMode);
        const label = `${qlId}:${language}:${namespace}:${suffix}`;
        const text = visible(q);
        const e = q.explanation ?? {};
        ok(q.canonicalProblemId === "TMW-CP-012", `${label}: checkpoint mismatch`);
        ok(q.questionLanguageId === qlId, `${label}: QL mismatch`);
        ok(q.validation?.valid, `${label}: validation failed: ${(q.validation?.errors ?? []).join(" | ")}`);
        ok(q.publiclyPublishable === false, `${label}: publication lock lost`);
        ok(q.learnerExplanationVersion === "TMW_COVERAGE_V1", `${label}: learner version mismatch`);
        ok(q.options?.length === 4 && new Set(q.options).size === 4, `${label}: option contract failed`);
        ok(q.correctIndex >= 0 && q.correctIndex < 4, `${label}: invalid correctIndex`);
        ok(q.options[q.correctIndex] === q.solution.answerText, `${label}: answer-option mismatch`);
        ok(q.optionAudit?.[q.correctIndex]?.misconceptionId === "CORRECT", `${label}: correct option audit mismatch`);
        ok((e.givens?.length ?? 0) >= 2 && (e.steps?.length ?? 0) >= 3, `${label}: worked explanation too brief`);
        ok((e.shortcut?.steps?.length ?? 0) >= 1, `${label}: shortcut missing`);
        ok(!/10-Second|10-सेकंड|10-ਸਕਿੰਟ/u.test(text), `${label}: gimmicky shortcut wording remains`);
        ok(!/undefined|null|NaN|Infinity|\{\{|\$\{/u.test(text), `${label}: unresolved value`);
        ok(!/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(text), `${label}: control character remains`);
        ok(!proseInsideMath(text), `${label}: localized prose remains inside MathJax`);
        if (language === "hi") ok(/[\u0900-\u097F]/u.test(text), `${label}: Hindi script missing`);
        if (language === "pa") ok(/[\u0A00-\u0A7F]/u.test(text), `${label}: Punjabi script missing`);
        if (e.commonTrap?.explanation && e.commonTrap?.optionText) ok(e.commonTrap.explanation.includes(e.commonTrap.optionText), `${label}: trap option not identified`);
        if (e.conclusion) ok(e.conclusion.includes(q.solution.answerText), `${label}: conclusion omits answer`);
        if (qlId === "TMW-QL-212" && e.conclusion) ok(/C alone|C अकेला|C ਇਕੱਲਾ/u.test(e.conclusion), `${label}: C-alone conclusion vague`);
        if (qlId === "TMW-QL-213" && e.conclusion) ok(/new combined completion time|नया संयुक्त समय|ਨਵਾਂ ਸਾਂਝਾ ਸਮਾਂ/u.test(e.conclusion), `${label}: new-time conclusion vague`);
        if (qlId === "TMW-QL-214" && e.conclusion) ok(/time saved|बचा हुआ समय|ਬਚਿਆ ਹੋਇਆ ਸਮਾਂ/u.test(e.conclusion), `${label}: saved-time conclusion vague`);
        if (qlId === "TMW-QL-215" && e.conclusion) ok(/delayed by|देरी|ਦੇਰੀ/u.test(e.conclusion), `${label}: delay conclusion vague`);
      }
      const en = generated.get("en"), hi = generated.get("hi"), pa = generated.get("pa");
      ok(en && hi && pa, `${qlId}:${namespace}:${suffix}: missing language output`);
      const baseline = snapshot(en);
      ok(snapshot(hi) === baseline, `${qlId}:${namespace}:${suffix}: Hindi mathematical parity mismatch`);
      ok(snapshot(pa) === baseline, `${qlId}:${namespace}:${suffix}: Punjabi mathematical parity mismatch`);
    }
  }
}

ok(checked === 384, `Expected 384 cases, got ${checked}`);
ok(modes.size === 4, `Expected four solve modes, got ${modes.size}`);
console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-012", checked, solveModes: modes.size, publicationLocked: true, verdict: "PASS" }, null, 2));
