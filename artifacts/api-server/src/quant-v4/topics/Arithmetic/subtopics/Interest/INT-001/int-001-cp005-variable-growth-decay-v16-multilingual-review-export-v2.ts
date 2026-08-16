import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { INT_CP005_V16_QL_IDS, generateIntCp005QuestionV16EditorialFinal } from "./cp005-variable-growth-decay-runtime-v16-editorial-final";
import {
  INT_CP005_V16_LOCALIZED_EDITORIAL_VERSION,
  generateIntCp005QuestionV16LocalizedV2,
  type IntCp005LocalizedLocale,
} from "./cp005-variable-growth-decay-runtime-v16-localized-v2";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
interface Selection { readonly qlId: typeof INT_CP005_V16_QL_IDS[number]; readonly seed: string; readonly correctIndex: number; }
const selected: Selection[] = [];
for (const qlId of INT_CP005_V16_QL_IDS) {
  const positions = new Map<number, Selection>();
  const stems = new Set<string>();
  for (let index = 0; index < 1800 && positions.size < 4; index += 1) {
    const seed = `int-cp005-v16-final-review-${qlId}-${index}`;
    const q = generateIntCp005QuestionV16EditorialFinal(qlId, seed, "en-IN");
    if (!positions.has(q.correctIndex) && !stems.has(q.presentation.markdown)) {
      positions.set(q.correctIndex, { qlId, seed, correctIndex: q.correctIndex });
      stems.add(q.presentation.markdown);
    }
  }
  assert(positions.size === 4, `${qlId}: approved review positions unavailable`);
  selected.push(...[0,1,2,3].map((position) => positions.get(position)!));
}
assert(selected.length === 36, `expected 36 matched states, got ${selected.length}`);

const locales: readonly IntCp005LocalizedLocale[] = ["hi-IN", "pa-IN"];
const names: Record<IntCp005LocalizedLocale, string> = { "hi-IN": "Hindi", "pa-IN": "Punjabi" };
const counts: Record<IntCp005LocalizedLocale, number[]> = { "hi-IN": [0,0,0,0], "pa-IN": [0,0,0,0] };
const stems: Record<IntCp005LocalizedLocale, Set<string>> = { "hi-IN": new Set(), "pa-IN": new Set() };
const lines: string[] = [
  "# INT-CP-005 V16 Hindi + Punjabi Review — Native Editorial V2",
  "",
  `Localized editorial authority: \`${INT_CP005_V16_LOCALIZED_EDITORIAL_VERSION}\``,
  "",
  "**Authority:** Same 36 QL/seed states as the product-owner-approved English V16 review. Mathematical state, option values/order, misconception ownership and correct index are unchanged.",
  "",
  "**Status:** Localization review candidate only. Not frozen, not merged, not registered, not stored, not test-eligible and not public.",
  "",
  "**Scope:** QLs `086,087,088,089,090,091,092,093,095`. QL-094 remains excluded.",
  "",
];

selected.forEach((selection, index) => {
  lines.push(`## ${index + 1}. ${selection.qlId}`, "", `Seed: \`${selection.seed}\``, "");
  for (const locale of locales) {
    const q = generateIntCp005QuestionV16LocalizedV2(selection.qlId, selection.seed, locale);
    assert(q.correctIndex === selection.correctIndex, `${selection.qlId}/${selection.seed}/${locale}: answer position drift`);
    counts[locale][q.correctIndex] += 1;
    stems[locale].add(q.presentation.markdown);
    lines.push(`### ${names[locale]}`, "", q.presentation.markdown, "");
    q.options.forEach((option, optionIndex) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option.text}`));
    lines.push("", `**Correct answer:** ${String.fromCharCode(65 + q.correctIndex)}. ${q.correctAnswer}`, "", `**Key idea:** ${q.explanation.keyIdea}`, "", "**Explanation**");
    q.explanation.steps.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. ${step}`));
    lines.push("", `**Common mistake:** ${q.explanation.commonMistake}`, "");
  }
  lines.push("---", "");
});
for (const locale of locales) {
  assert(counts[locale].every((count) => count === 9), `${locale}: answer positions not balanced`);
  assert(stems[locale].size === 36, `${locale}: duplicate review stems`);
}
lines.push("## Review summary", "", "- Matched approved English states: 36", "- Hindi questions: 36", "- Punjabi questions: 36", `- Hindi A/B/C/D: ${counts["hi-IN"].join("/")}`, `- Punjabi A/B/C/D: ${counts["pa-IN"].join("/")}`, "- Punjabi CI term: `ਮਿਸ਼ਰਤ ਵਿਆਜ`", "- Rejected Punjabi CI term: `ਚੱਕਰਵੱਧੀ ਵਿਆਜ`", "- QL-094: excluded", "- Lifecycle: review-only and closed");
const output = resolve(process.env.INT_CP005_V16_HI_PA_REVIEW_OUT ?? "dist/quant-v4/INT-CP-005-V16-HI-PA-REVIEW.md");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, lines.join("\n"), "utf8");
console.log(JSON.stringify({ output, editorialVersion: INT_CP005_V16_LOCALIZED_EDITORIAL_VERSION, matchedStates: selected.length, counts }, null, 2));
console.log("PASS_INT_CP005_V16_HI_PA_NATIVE_REVIEW_V2");
