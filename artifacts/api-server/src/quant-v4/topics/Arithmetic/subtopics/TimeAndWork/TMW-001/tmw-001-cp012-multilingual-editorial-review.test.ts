import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function ok(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const qls = ["TMW-QL-212", "TMW-QL-213", "TMW-QL-214", "TMW-QL-215"] as const;
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const seeds = Array.from({ length: 12 }, (_, i) => String(i));
let checked = 0;
const modes = new Set<string>();

function snapshot(q: any): string {
  return JSON.stringify({
    parameters: q.parameters,
    answer: q.solution.answer,
    answerType: q.solution.answerType,
    formula: q.solution.formulaLatex,
    fingerprint: q.mathematicalFingerprint,
    optionValues: q.optionAudit.map((o: any) => JSON.stringify(o.value)).sort(),
    misconceptions: q.optionAudit.map((o: any) => o.misconceptionId).sort(),
  });
}

for (const qlId of qls) {
  for (const suffix of seeds) {
    const seed = `tmw-cp012-editorial:${qlId}:${suffix}`;
    const generated = new Map<Tmw001ChapterLanguage, any>();

    for (const language of languages) {
      const q = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      generated.set(language, q);
      checked += 1;
      modes.add(q.solveMode);
      const label = `${qlId}:${language}:${suffix}`;
      const e = q.explanation;
      const text = [q.stem, ...q.options, e.opening, ...e.givens, ...e.steps, e.shortcut.title, ...e.shortcut.steps, e.commonTrap.explanation, e.conclusion].join(" ");

      ok(q.canonicalProblemId === "TMW-CP-012", `${label}: checkpoint mismatch`);
      ok(q.questionLanguageId === qlId, `${label}: QL mismatch`);
      ok(q.validation?.valid, `${label}: validation failed`);
      ok(q.publiclyPublishable === false, `${label}: publication lock lost`);
      ok(q.learnerExplanationVersion === "TMW_COVERAGE_V1", `${label}: learner version mismatch`);
      ok(q.options.length === 4 && new Set(q.options).size === 4, `${label}: option contract failed`);
      ok(q.options[q.correctIndex] === q.solution.answerText, `${label}: answer-option mismatch`);
      ok(q.optionAudit[q.correctIndex]?.misconceptionId === "CORRECT", `${label}: correct option audit mismatch`);
      ok(e.givens.length >= 2 && e.steps.length >= 3, `${label}: worked explanation too brief`);
      ok(e.shortcut.steps.length === 2, `${label}: shortcut must have two teaching steps`);
      ok(!/10-Second|10-सेकंड|10-ਸਕਿੰਟ/u.test(text), `${label}: gimmicky shortcut wording remains`);
      ok(e.commonTrap.explanation.includes(e.commonTrap.optionText), `${label}: trap option not identified`);
      ok(e.conclusion.includes(q.solution.answerText), `${label}: conclusion omits answer`);
      ok(!/undefined|null|NaN|Infinity/u.test(text), `${label}: unresolved value`);
      if (language === "hi") ok(/[\u0900-\u097F]/u.test(text), `${label}: Hindi script missing`);
      if (language === "pa") ok(/[\u0A00-\u0A7F]/u.test(text), `${label}: Punjabi script missing`);

      if (qlId === "TMW-QL-212") ok(/C alone|C अकेला|C ਇਕੱਲਾ/u.test(e.conclusion), `${label}: C-alone conclusion vague`);
      if (qlId === "TMW-QL-213") ok(/new combined completion time|नया संयुक्त समय|ਨਵਾਂ ਸਾਂਝਾ ਸਮਾਂ/u.test(e.conclusion), `${label}: new-time conclusion vague`);
      if (qlId === "TMW-QL-214") ok(/time saved|बचा हुआ समय|ਬਚਿਆ ਹੋਇਆ ਸਮਾਂ/u.test(e.conclusion), `${label}: saved-time conclusion vague`);
      if (qlId === "TMW-QL-215") ok(/delayed by|देरी|ਦੇਰੀ/u.test(e.conclusion), `${label}: delay conclusion vague`);
    }

    const en = generated.get("en");
    const hi = generated.get("hi");
    const pa = generated.get("pa");
    ok(en && hi && pa, `${qlId}:${suffix}: missing language output`);
    const baseline = snapshot(en);
    ok(snapshot(hi) === baseline, `${qlId}:${suffix}: Hindi mathematical parity mismatch`);
    ok(snapshot(pa) === baseline, `${qlId}:${suffix}: Punjabi mathematical parity mismatch`);
  }
}

ok(checked === 144, `Expected 144 cases, got ${checked}`);
ok(modes.size === 4, `Expected four solve modes, got ${modes.size}`);
console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-012", checked, solveModes: modes.size, verdict: "PASS" }, null, 2));
