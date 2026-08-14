import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";
import { runTmwCp014CaseletGroup } from "./foundation/final-extension-presentation-polish";

function ok(v: unknown, m: string): asserts v { if (!v) throw new Error(m); }

const expected = {
  "TMW-QL-224": { mode: "tableWorkforceSchedule", representation: "TABLE" },
  "TMW-QL-225": { mode: "tableHeterogeneousContribution", representation: "TABLE" },
  "TMW-QL-226": { mode: "tablePipeOperatingSchedule", representation: "TABLE" },
  "TMW-QL-227": { mode: "caseletStageOneOutput", representation: "CASELET" },
  "TMW-QL-228": { mode: "caseletRemainingCompletionTime", representation: "CASELET" },
} as const;

const qls = Object.keys(expected) as (keyof typeof expected)[];
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
let checked = 0;
let groupedChecked = 0;

function rationalKey(value: any): string {
  return `${value.numerator}/${value.denominator}`;
}

function snapshot(q: any): string {
  return JSON.stringify({
    solveMode: q.solveMode,
    representation: q.representation,
    fingerprint: q.mathematicalFingerprint,
    answer: rationalKey(q.solution.answer),
    answerType: q.solution.answerType,
    optionValues: q.optionAudit.map((o: any) => rationalKey(o.value)).sort(),
    blockType: q.presentationBlocks[0]?.type,
    caseletGroupId: q.caseletGroupId,
  });
}

for (const qlId of qls) {
  for (let n = 0; n < 8; n += 1) {
    const seed = `tmw-cp014-editorial:${qlId}:${n}`;
    const byLanguage = new Map<Tmw001ChapterLanguage, any>();

    for (const language of languages) {
      const q = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      byLanguage.set(language, q);
      checked += 1;
      const label = `${qlId}:${language}:${n}`;
      const e = q.explanation;
      const learnerText = [
        q.stem,
        ...q.options,
        e.opening,
        ...e.givens,
        e.formula,
        ...e.steps,
        e.shortcut.title,
        ...e.shortcut.steps,
        e.commonTrap.optionLabel,
        e.commonTrap.explanation,
        e.conclusion,
      ].join(" ");

      ok(q.canonicalProblemId === "TMW-CP-014" && q.questionLanguageId === qlId, `${label}: identity`);
      ok(q.solveMode === expected[qlId].mode && q.representation === expected[qlId].representation, `${label}: representation contract`);
      ok(q.validation?.valid && q.publiclyPublishable === false, `${label}: validation/publication`);
      ok(q.learnerExplanationVersion === "TMW_PRESENTATION_V1", `${label}: explanation contract`);
      ok(q.options.length === 4 && new Set(q.options).size === 4, `${label}: four unique options`);
      ok(q.options[q.correctIndex] === q.solution.answerText, `${label}: answer-option mismatch`);
      ok(q.optionAudit[q.correctIndex]?.misconceptionId === "CORRECT", `${label}: answer audit`);
      ok(q.presentationBlocks.length === 1 && q.presentationBlocks[0].type.toUpperCase() === q.representation, `${label}: structured block`);
      ok(e.steps.length >= 2 && e.shortcut.steps.length >= 1, `${label}: teaching depth`);
      ok(e.commonTrap.explanation.includes(e.commonTrap.optionText), `${label}: trap does not name distractor`);
      ok(!/undefined|null|NaN|Infinity|\{\{|\$\{/u.test(learnerText), `${label}: unresolved learner text`);
      ok(!/Presentation shortcut/u.test(learnerText), `${label}: generic shortcut title survived`);

      if (language === "hi") {
        ok(e.shortcut.title === "संरचित-डेटा त्वरित विधि", `${label}: Hindi shortcut title`);
        if (qlId === "TMW-QL-226") {
          ok(!/\b(?:inlet|outlet|net)\b|\d+ h\b/iu.test(learnerText), `${label}: Hindi pipe English leakage`);
        }
      }
      if (language === "pa") {
        ok(e.shortcut.title === "ਸੰਰਚਿਤ-ਡਾਟਾ ਤੇਜ਼ ਵਿਧੀ", `${label}: Punjabi shortcut title`);
        ok(!/ਪੜਾਅਾਂ/u.test(learnerText), `${label}: Punjabi spelling regression`);
        if (qlId === "TMW-QL-226") {
          ok(!/\b(?:inlet|outlet|net)\b|\d+ h\b/iu.test(learnerText), `${label}: Punjabi pipe English leakage`);
        }
      }

      if (qlId === "TMW-QL-225") {
        ok(q.solution.answerType === "base-work-units", `${label}: normalized answer unit`);
      }
      if (qlId === "TMW-QL-226") {
        ok(q.optionAudit.every((o: any) => o.value.numerator > 0 && o.value.numerator <= o.value.denominator), `${label}: non-physical tank option`);
      }
      if (qlId === "TMW-QL-227" || qlId === "TMW-QL-228") {
        ok(q.caseletGroupId === "TMW-CASELET-001" && q.groupGenerationRequired === true, `${label}: caselet grouping contract`);
        ok(q.caseletItemIndex === (qlId === "TMW-QL-227" ? 0 : 1), `${label}: caselet item index`);
      }
    }

    const en = byLanguage.get("en"), hi = byLanguage.get("hi"), pa = byLanguage.get("pa");
    ok(en && hi && pa, `${qlId}:${n}: missing language`);
    const baseline = snapshot(en);
    ok(snapshot(hi) === baseline && snapshot(pa) === baseline, `${qlId}:${n}: mathematical/structural language parity`);
  }
}

for (let n = 0; n < 8; n += 1) {
  for (const language of languages) {
    const seed = `tmw-cp014-caselet-group:${n}`;
    const group = runTmwCp014CaseletGroup({ seed, language });
    groupedChecked += 1;
    ok(group.caseletGroupId === "TMW-CASELET-001", `${language}:${n}: group identity`);
    ok(group.questions.length === 2, `${language}:${n}: group item count`);
    ok(group.questions[0].questionLanguageId === "TMW-QL-227" && group.questions[1].questionLanguageId === "TMW-QL-228", `${language}:${n}: group order`);
    ok(group.questions[0].caseletStimulus === group.questions[1].caseletStimulus, `${language}:${n}: stimulus mismatch`);
    ok(group.stimulus === group.questions[0].caseletStimulus, `${language}:${n}: exposed stimulus mismatch`);
  }
}

ok(checked === 120, `Expected 120 principal cases, got ${checked}`);
ok(groupedChecked === 24, `Expected 24 grouped caselet checks, got ${groupedChecked}`);
console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-014", checked, groupedChecked, verdict: "PASS" }, null, 2));
