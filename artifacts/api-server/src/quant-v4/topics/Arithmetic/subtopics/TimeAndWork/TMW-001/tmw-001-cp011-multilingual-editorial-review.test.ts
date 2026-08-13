import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const qls = Array.from({ length: 19 }, (_, i) => `TMW-QL-${String(i + 193).padStart(3, "0")}`);
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const seeds = ["0", "1", "2", "3", "4", "5", "6", "7"] as const;
const modes = new Set<string>();
let checked = 0;

function optionNumbers(options: string[]): string[] {
  return (options.join(" ").match(/-?\d+(?:\.\d+)?(?:\/\d+)?/g) ?? []).sort();
}

function visibleText(q: ReturnType<typeof runTmw001ChapterPipeline>): string {
  const e = q.explanation ?? {};
  return [
    q.stem,
    ...q.options,
    e.opening ?? "",
    ...(Array.isArray(e.steps) ? e.steps : []),
    ...(Array.isArray(e.shortcut?.steps) ? e.shortcut.steps : []),
    e.commonTrap?.explanation ?? "",
    e.conclusion ?? "",
    q.learnerExplanation.method,
    ...q.learnerExplanation.solution,
    q.learnerExplanation.answer,
  ].join(" ");
}

for (const qlId of qls) {
  for (const seedSuffix of seeds) {
    const seed = `tmw-cp011-editorial:${qlId}:${seedSuffix}`;
    const generated = new Map<Tmw001ChapterLanguage, ReturnType<typeof runTmw001ChapterPipeline>>();

    for (const language of languages) {
      const q = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      generated.set(language, q);
      checked += 1;
      modes.add(q.solveMode);
      const label = `${qlId}:${language}:${seedSuffix}`;
      const text = visibleText(q);

      assert(q.canonicalProblemId === "TMW-CP-011", `${label}: checkpoint mismatch`);
      assert(q.questionLanguageId === qlId, `${label}: QL mismatch`);
      assert(q.validation?.valid, `${label}: validation failed`);
      assert(q.publiclyPublishable === false, `${label}: publication lock lost`);
      assert(q.options.length === 4 && new Set(q.options).size === 4, `${label}: option contract failed`);
      assert(q.correctIndex >= 0 && q.correctIndex < 4, `${label}: invalid correctIndex`);
      assert(q.options[q.correctIndex] === q.solution.answerText, `${label}: answer-option mismatch`);
      assert(q.learnerExplanationVersion === "TMW_LEARNER_V2", `${label}: learner version mismatch`);
      assert(q.learnerExplanation.solution.length >= 2 && q.learnerExplanation.solution.length <= 5, `${label}: learner explanation depth mismatch`);
      assert(!/undefined|null|NaN|Infinity|\{\{|\$\{/.test(text), `${label}: unresolved learner content`);
      assert(!/[\u0000-\u001F\u007F]/u.test(text), `${label}: control character remains`);
      if (language === "hi") assert(/[\u0900-\u097F]/u.test(text), `${label}: Hindi script missing`);
      if (language === "pa") assert(/[\u0A00-\u0A7F]/u.test(text), `${label}: Punjabi script missing`);
    }

    const en = generated.get("en");
    const hi = generated.get("hi");
    const pa = generated.get("pa");
    assert(en && hi && pa, `${qlId}:${seedSuffix}: missing language output`);

    assert(en.mathematicalFingerprint === hi.mathematicalFingerprint, `${qlId}:${seedSuffix}: Hindi mathematical fingerprint mismatch`);
    assert(en.mathematicalFingerprint === pa.mathematicalFingerprint, `${qlId}:${seedSuffix}: Punjabi mathematical fingerprint mismatch`);
    assert(JSON.stringify(optionNumbers(en.options)) === JSON.stringify(optionNumbers(hi.options)), `${qlId}:${seedSuffix}: Hindi option-value mismatch`);
    assert(JSON.stringify(optionNumbers(en.options)) === JSON.stringify(optionNumbers(pa.options)), `${qlId}:${seedSuffix}: Punjabi option-value mismatch`);
  }
}

assert(checked === 456, `Expected 456 cases, got ${checked}`);
assert(modes.size === 19, `Expected 19 solve modes, got ${modes.size}`);
console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-011", checked, solveModes: modes.size, verdict: "PASS" }, null, 2));
