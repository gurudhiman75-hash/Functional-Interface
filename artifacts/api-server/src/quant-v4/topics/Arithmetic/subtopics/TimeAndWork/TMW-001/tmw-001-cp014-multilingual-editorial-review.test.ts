import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";
import { runTmwCp014CaseletGroup } from "./foundation/final-extension-presentation-polish";

function ok(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const expected = {
  "TMW-QL-224": { mode: "tableWorkforceSchedule", representation: "TABLE" },
  "TMW-QL-225": { mode: "tableHeterogeneousContribution", representation: "TABLE" },
  "TMW-QL-226": { mode: "tablePipeOperatingSchedule", representation: "TABLE" },
  "TMW-QL-227": { mode: "caseletStageOneOutput", representation: "CASELET" },
  "TMW-QL-228": { mode: "caseletRemainingCompletionTime", representation: "CASELET" },
} as const;

const qlIds = Object.keys(expected) as (keyof typeof expected)[];
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const namespaces = ["editorial", "resilience"] as const;
const correctPositions = new Map<string, Set<number>>();
let checked = 0;
let groupedChecked = 0;

function rationalKey(value: any): string {
  return `${value.numerator}/${value.denominator}`;
}

function mathematicalSnapshot(q: any): string {
  return JSON.stringify({
    solveMode: q.solveMode,
    representation: q.representation,
    fingerprint: q.mathematicalFingerprint,
    answer: rationalKey(q.solution.answer),
    answerType: q.solution.answerType,
    optionValues: q.optionAudit.map((option: any) => rationalKey(option.value)).sort(),
    blockType: q.presentationBlocks[0]?.type,
    caseletGroupId: q.caseletGroupId,
  });
}

function learnerText(q: any): string {
  const e = q.explanation;
  const le = q.learnerExplanation;
  return [
    q.stem,
    ...q.options,
    JSON.stringify(q.presentationBlocks),
    q.caseletStimulus ?? "",
    e.opening,
    ...e.givens,
    e.formula,
    ...e.steps,
    e.shortcut.title,
    ...e.shortcut.steps,
    e.commonTrap.optionLabel,
    e.commonTrap.optionText,
    e.commonTrap.explanation,
    e.conclusion,
    le?.method ?? "",
    ...(le?.solution ?? []),
    le?.answer ?? "",
  ].join(" ");
}

function noIndicInsideMathJax(text: string): boolean {
  for (const match of text.matchAll(/\\\((.*?)\\\)/gsu)) {
    if (/\p{Script=Devanagari}|\p{Script=Gurmukhi}/u.test(match[1])) return false;
  }
  return true;
}

function expectedMethodMarker(qlId: string, language: Tmw001ChapterLanguage): string {
  const markers: Record<string, Record<Tmw001ChapterLanguage, string>> = {
    "TMW-QL-224": { en: "worker-days", hi: "कामगार-दिन", pa: "ਮਜ਼ਦੂਰ-ਦਿਨ" },
    "TMW-QL-225": { en: "relative efficiency", hi: "सापेक्ष दक्षता", pa: "ਸਾਪੇਖ ਕੁਸ਼ਲਤਾ" },
    "TMW-QL-226": { en: "emptying", hi: "खाली करने वाली पाइप", pa: "ਖਾਲੀ ਕਰਨ ਵਾਲੀ ਪਾਈਪ" },
    "TMW-QL-227": { en: "only Team A", hi: "केवल टीम A", pa: "ਸਿਰਫ਼ ਟੀਮ A" },
    "TMW-QL-228": { en: "remaining work", hi: "शेष काम", pa: "ਬਾਕੀ ਕੰਮ" },
  };
  return markers[qlId][language];
}

for (const qlId of qlIds) {
  for (const namespace of namespaces) {
    for (let n = 0; n < 16; n += 1) {
      const seed = `tmw-cp014-${namespace}:${qlId}:${n}`;
      const byLanguage = new Map<Tmw001ChapterLanguage, any>();

      for (const language of languages) {
        const q = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
        byLanguage.set(language, q);
        checked += 1;
        const label = `${qlId}:${namespace}:${language}:${n}`;
        const e = q.explanation;
        const le = q.learnerExplanation;
        const text = learnerText(q);

        ok(q.canonicalProblemId === "TMW-CP-014" && q.questionLanguageId === qlId, `${label}: identity`);
        ok(q.solveMode === expected[qlId].mode && q.representation === expected[qlId].representation, `${label}: solve-mode/representation`);
        ok(q.validation?.valid === true, `${label}: validation`);
        ok(q.publiclyPublishable === false, `${label}: publication lock`);
        ok(q.learnerExplanationVersion === "TMW_PRESENTATION_V1", `${label}: learner version`);
        ok(q.editorialStatus === "ASSISTANT_EDITORIAL_REVIEW", `${label}: editorial marker`);
        ok(Array.isArray(q.options) && q.options.length === 4 && new Set(q.options).size === 4, `${label}: options`);
        ok(q.options[q.correctIndex] === q.solution.answerText, `${label}: answer-option mismatch`);
        ok(q.optionAudit[q.correctIndex]?.misconceptionId === "CORRECT", `${label}: correct option audit`);
        ok(Array.isArray(q.presentationBlocks) && q.presentationBlocks.length === 1, `${label}: structured block count`);
        ok(String(q.presentationBlocks[0].type).toUpperCase() === q.representation, `${label}: structured block type`);

        if (q.representation === "TABLE") {
          ok(q.presentationBlocks[0].rows.length >= 2 && q.presentationBlocks[0].columns.length >= 3, `${label}: table depth`);
        } else {
          ok(q.presentationBlocks[0].paragraphs.length >= 2, `${label}: caselet depth`);
        }

        ok(le && typeof le.method === "string" && le.method.length >= 30, `${label}: learner method`);
        ok(Array.isArray(le.solution) && le.solution.length >= 3, `${label}: learner solution depth`);
        ok(le.answer === e.conclusion, `${label}: learner answer/conclusion parity`);
        ok(e.opening === le.method, `${label}: explanation opening not aligned to method`);
        ok(Array.isArray(e.givens) && e.givens.length >= 2, `${label}: structured givens missing`);
        ok(typeof e.formula === "string" && e.formula.length >= 20, `${label}: governing formula missing`);
        ok(Array.isArray(e.steps) && e.steps.length >= 2, `${label}: working steps`);
        ok(Array.isArray(e.shortcut.steps) && e.shortcut.steps.length === 2, `${label}: shortcut must have exactly two steps`);
        ok(!/Presentation shortcut|10-Second/iu.test(text), `${label}: generic/gimmicky shortcut survived`);
        ok(typeof e.commonTrap.optionText === "string" && e.commonTrap.optionText.length > 0, `${label}: trap option missing`);
        ok(e.commonTrap.explanation.includes(e.commonTrap.optionText), `${label}: trap does not identify tempting option`);
        ok(typeof e.conclusion === "string" && e.conclusion.includes(q.solution.answerText), `${label}: conclusion does not name answer`);
        ok(le.method.includes(expectedMethodMarker(qlId, language)), `${label}: mode-specific method missing`);
        ok(!/undefined|null|NaN|Infinity|\{\{|\$\{/u.test(text), `${label}: unresolved learner text`);
        ok(!/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u.test(text), `${label}: control character`);
        ok(noIndicInsideMathJax(text), `${label}: localized prose inside MathJax`);

        if (language === "pa") ok(!/ਪੜਾਅਾਂ/u.test(text), `${label}: Punjabi spelling regression`);

        if (qlId === "TMW-QL-225") {
          ok(q.solution.answerType === "base-work-units", `${label}: normalized contribution unit`);
        }
        if (qlId === "TMW-QL-226") {
          ok(q.optionAudit.every((option: any) => option.value.numerator > 0 && option.value.numerator <= option.value.denominator), `${label}: non-physical tank option`);
          if (language !== "en") {
            ok(!/(^|[^A-Za-z])(?:inlet|outlet|net)(?=$|[^A-Za-z])|\d+ h(?=$|[^A-Za-z])/iu.test(text), `${label}: English pipe leakage`);
          }
        }
        if (qlId === "TMW-QL-227" || qlId === "TMW-QL-228") {
          ok(q.caseletGroupId === "TMW-CASELET-001" && q.groupGenerationRequired === true, `${label}: caselet group contract`);
          ok(q.caseletItemIndex === (qlId === "TMW-QL-227" ? 0 : 1), `${label}: caselet order`);
        }

        const positionKey = `${qlId}:${language}`;
        if (!correctPositions.has(positionKey)) correctPositions.set(positionKey, new Set());
        correctPositions.get(positionKey)!.add(q.correctIndex);
      }

      const en = byLanguage.get("en");
      const hi = byLanguage.get("hi");
      const pa = byLanguage.get("pa");
      ok(en && hi && pa, `${qlId}:${namespace}:${n}: missing language`);
      const baseline = mathematicalSnapshot(en);
      ok(mathematicalSnapshot(hi) === baseline, `${qlId}:${namespace}:${n}: Hindi mathematical parity`);
      ok(mathematicalSnapshot(pa) === baseline, `${qlId}:${namespace}:${n}: Punjabi mathematical parity`);
    }
  }
}

for (const [key, positions] of correctPositions) {
  ok(positions.size >= 3, `${key}: correct option position diversity too low (${[...positions].join(",")})`);
}

for (let n = 0; n < 16; n += 1) {
  const seed = `tmw-cp014-group:${n}`;
  for (const language of languages) {
    const group = runTmwCp014CaseletGroup({ seed, language });
    groupedChecked += 1;
    const label = `group:${language}:${n}`;
    ok(group.caseletGroupId === "TMW-CASELET-001", `${label}: group identity`);
    ok(group.questions.length === 2, `${label}: group size`);
    const [first, second] = group.questions;
    ok(first.questionLanguageId === "TMW-QL-227" && second.questionLanguageId === "TMW-QL-228", `${label}: item order`);
    ok(first.caseletItemIndex === 0 && second.caseletItemIndex === 1, `${label}: item indices`);
    ok(first.caseletStimulus === second.caseletStimulus && group.stimulus === first.caseletStimulus, `${label}: shared stimulus mismatch`);
    ok(first.presentationBlocks[0].paragraphs.join("\n") === second.presentationBlocks[0].paragraphs.join("\n"), `${label}: caselet block mismatch`);
    ok(first.learnerExplanation?.method && second.learnerExplanation?.method, `${label}: learner explanations`);
    ok(first.explanation.givens.length >= 2 && second.explanation.givens.length >= 2, `${label}: caselet givens`);
    ok(first.explanation.formula && second.explanation.formula, `${label}: caselet formulas`);
  }
}

ok(checked === 480, `Expected 480 principal cases, got ${checked}`);
ok(groupedChecked === 48, `Expected 48 grouped caselet checks, got ${groupedChecked}`);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-014",
  checked,
  groupedChecked,
  positionDiversity: Object.fromEntries([...correctPositions].map(([key, value]) => [key, [...value].sort()])),
  verdict: "PASS",
}, null, 2));
