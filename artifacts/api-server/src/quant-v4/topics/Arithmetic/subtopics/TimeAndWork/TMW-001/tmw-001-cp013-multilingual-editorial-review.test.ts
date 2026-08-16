import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function ok(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function proseInsideMath(value: string): boolean {
  for (const hit of value.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
    if (/[\u0900-\u097F\u0A00-\u0A7F]/u.test(hit[1] ?? "")) return true;
  }
  return false;
}

function visible(q: any): string {
  const e = q.explanation ?? {};
  const l = q.learnerExplanation ?? {};
  return [
    q.stem,
    ...(q.options ?? []),
    e.opening,
    ...(e.givens ?? []),
    ...(e.steps ?? []),
    e.shortcut?.title,
    ...(e.shortcut?.steps ?? []),
    e.commonTrap?.optionText,
    e.commonTrap?.explanation,
    e.conclusion,
    l.method,
    ...(l.solution ?? []),
    l.answer,
  ].filter(Boolean).join(" ");
}

function semanticSnapshot(q: any): string {
  return JSON.stringify({
    solveMode: q.solveMode,
    canonicalClass: q.canonicalClass,
    correctIndex: q.correctIndex,
    optionClasses: (q.optionAudit ?? []).map((option: any) => option.value),
    fingerprint: q.mathematicalFingerprint,
    iUnique: q.hiddenState?.iUnique,
    iiUnique: q.hiddenState?.iiUnique,
    combinedUnique: q.hiddenState?.combinedUnique,
  });
}

const EXPECTED: Record<string, string> = {
  "TMW-QL-216": "I_ONLY",
  "TMW-QL-217": "II_ONLY",
  "TMW-QL-218": "TOGETHER_ONLY",
  "TMW-QL-219": "EVEN_TOGETHER_INSUFFICIENT",
  "TMW-QL-220": "EITHER_ALONE",
  "TMW-QL-221": "II_ONLY",
  "TMW-QL-222": "TOGETHER_ONLY",
  "TMW-QL-223": "EVEN_TOGETHER_INSUFFICIENT",
};
const QLS = Object.keys(EXPECTED);
const LANGUAGES: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const NAMESPACES = ["tmw-cp013-editorial", "tmw-cp013-editorial-review"] as const;
const SEEDS = Array.from({ length: 16 }, (_, index) => String(index));
const optionPositions = new Map<number, number>();
const classes = new Set<string>();
const modes = new Set<string>();
let checked = 0;

for (const qlId of QLS) {
  for (const namespace of NAMESPACES) {
    for (const suffix of SEEDS) {
      const seed = `${namespace}:${qlId}:${suffix}`;
      const generated = new Map<Tmw001ChapterLanguage, any>();
      for (const language of LANGUAGES) {
        const q = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
        generated.set(language, q);
        checked += 1;
        modes.add(q.solveMode);
        classes.add(q.canonicalClass);
        optionPositions.set(q.correctIndex, (optionPositions.get(q.correctIndex) ?? 0) + 1);

        const label = `${qlId}:${language}:${namespace}:${suffix}`;
        const text = visible(q);
        ok(q.canonicalProblemId === "TMW-CP-013", `${label}: checkpoint mismatch`);
        ok(q.representation === "DATA_SUFFICIENCY", `${label}: representation mismatch`);
        ok(q.answerSemantic === "DATA_SUFFICIENCY_CLASS", `${label}: answer semantic mismatch`);
        ok(q.learnerExplanationVersion === "TMW_DS_V2", `${label}: learner version mismatch`);
        ok(q.canonicalClass === EXPECTED[qlId], `${label}: expected ${EXPECTED[qlId]}, got ${q.canonicalClass}`);
        ok(q.validation?.valid, `${label}: validation failed: ${(q.validation?.errors ?? []).join(" | ")}`);
        ok(q.publiclyPublishable === false, `${label}: publication lock lost`);
        ok(q.options?.length === 5 && new Set(q.options).size === 5, `${label}: five-option banking DS contract failed`);
        ok(q.optionAudit?.length === 5, `${label}: option audit length mismatch`);
        ok(q.correctIndex >= 0 && q.correctIndex < 5, `${label}: invalid correct index`);
        ok(q.options[q.correctIndex] === q.canonicalAnswer, `${label}: answer-option mismatch`);
        ok(q.canonicalAnswer === q.verifierAnswer, `${label}: verifier disagreement`);
        ok(q.optionAudit[q.correctIndex]?.misconceptionId === "CORRECT", `${label}: correct option ownership mismatch`);
        ok(new Set(q.optionAudit.map((option: any) => option.value)).size === 5, `${label}: all five DS classes not present in options`);
        ok(q.learnerExplanation?.method?.length > 30, `${label}: learner method missing`);
        ok(q.learnerExplanation?.solution?.length >= 4, `${label}: learner working too thin`);
        ok(q.learnerExplanation?.answer === q.canonicalAnswer, `${label}: learner answer mismatch`);
        ok(q.explanation?.givens?.length === 2, `${label}: independent statement checks missing`);
        ok(q.explanation?.shortcut?.steps?.length === 3, `${label}: three-stage decision rule missing`);
        ok(q.explanation?.commonTrap?.optionText && q.explanation?.commonTrap?.explanation, `${label}: DS trap guidance missing`);
        ok(!/undefined|null|NaN|Infinity|\{\{|\$\{/u.test(text), `${label}: unresolved learner content`);
        ok(!/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(text), `${label}: control character remains`);
        ok(!proseInsideMath(text), `${label}: localized prose inside MathJax`);
        ok(!/10-Second|10-सेकंड|10-ਸਕਿੰਟ/u.test(text), `${label}: gimmicky timing language remains`);
        ok(!/(\d+:\d+)\s*=\s*\1/u.test(text), `${label}: redundant ratio equality remains`);
        if (language === "hi") {
          ok(/[\u0900-\u097F]/u.test(text), `${label}: Hindi script missing`);
          ok(!/\binlet\b|\bleak\b|\bnet\b/iu.test(text), `${label}: English pipe loan term remains in Hindi`);
          ok(!/टीम-संख्य/u.test(text), `${label}: mechanical workforce-count wording remains in Hindi`);
        }
        if (language === "pa") {
          ok(/[\u0A00-\u0A7F]/u.test(text), `${label}: Punjabi script missing`);
          ok(!/\binlet\b|\bleak\b|\bnet\b/iu.test(text), `${label}: English pipe loan term remains in Punjabi`);
          ok(!/ਉਤਨਾ|ਉਤਨੇ|ਅਕਾਫ਼ੀ|ਟੀਮ-ਗਿਣਤ/u.test(text), `${label}: non-native Punjabi learner wording remains`);
        }
        if (qlId === "TMW-QL-219") {
          ok(/assigned|लगाए गए|ਲਗਾਏ/u.test(q.stem), `${label}: workforce target remains ambiguous`);
          ok(!/minimum|minimal|न्यूनतम|ਘੱਟੋ-ਘੱਟ/iu.test(q.stem), `${label}: minimum-workforce interpretation leaked in`);
        }
        if (qlId === "TMW-QL-220") {
          ok(q.canonicalClass === "EITHER_ALONE", `${label}: either-alone class missing`);
          ok(q.hiddenState?.iUnique === true && q.hiddenState?.iiUnique === true, `${label}: both statements are not independently sufficient`);
        }

        const independentlyVerified = q.hiddenState?.iUnique && q.hiddenState?.iiUnique
          ? "EITHER_ALONE"
          : q.hiddenState?.iUnique
            ? "I_ONLY"
            : q.hiddenState?.iiUnique
              ? "II_ONLY"
              : q.hiddenState?.combinedUnique
                ? "TOGETHER_ONLY"
                : "EVEN_TOGETHER_INSUFFICIENT";
        ok(independentlyVerified === q.canonicalClass, `${label}: independent DS classification mismatch`);
      }

      const en = generated.get("en");
      const hi = generated.get("hi");
      const pa = generated.get("pa");
      ok(en && hi && pa, `${qlId}:${namespace}:${suffix}: missing language output`);
      const baseline = semanticSnapshot(en);
      ok(semanticSnapshot(hi) === baseline, `${qlId}:${namespace}:${suffix}: Hindi semantic parity mismatch`);
      ok(semanticSnapshot(pa) === baseline, `${qlId}:${namespace}:${suffix}: Punjabi semantic parity mismatch`);
    }
  }
}

ok(checked === 768, `Expected 768 cases, got ${checked}`);
ok(modes.size === 8, `Expected eight solve modes, got ${modes.size}`);
ok(classes.size === 5, `Expected all five DS classes, got ${classes.size}`);
for (let index = 0; index < 5; index += 1) {
  ok((optionPositions.get(index) ?? 0) > 0, `Correct option position ${index} was never exercised`);
}

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-013",
  checked,
  solveModes: modes.size,
  dsClasses: [...classes].sort(),
  correctOptionPositions: Object.fromEntries([...optionPositions.entries()].sort(([a], [b]) => a - b)),
  publicationLocked: true,
  verdict: "PASS",
}, null, 2));