import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { INT_CP005_V16_QL_IDS, generateIntCp005QuestionV16EditorialFinal } from "./cp005-variable-growth-decay-runtime-v16-editorial-final";
import {
  INT_CP005_V16_LOCALIZED_RUNTIME_VERSION,
  generateIntCp005QuestionV16LocalizedFinal,
  type IntCp005LocalizedLocale,
} from "./cp005-variable-growth-decay-runtime-v16-localized-final";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

interface Selection { readonly qlId: typeof INT_CP005_V16_QL_IDS[number]; readonly seed: string; readonly correctIndex: number; }
const selected: Selection[] = [];
for (const qlId of INT_CP005_V16_QL_IDS) {
  const positions = new Map<number, Selection>();
  const stems = new Set<string>();
  for (let index = 0; index < 1800 && positions.size < 4; index += 1) {
    const seed = `int-cp005-v16-final-review-${qlId}-${index}`;
    const question = generateIntCp005QuestionV16EditorialFinal(qlId, seed, "en-IN");
    if (!positions.has(question.correctIndex) && !stems.has(question.presentation.markdown)) {
      positions.set(question.correctIndex, { qlId, seed, correctIndex: question.correctIndex });
      stems.add(question.presentation.markdown);
    }
  }
  assert(positions.size === 4, `${qlId}: could not recover the four approved English review positions`);
  selected.push(...[0, 1, 2, 3].map((position) => positions.get(position)!));
}
assert(selected.length === 36, `expected 36 matched review states, got ${selected.length}`);

const locales: readonly IntCp005LocalizedLocale[] = ["hi-IN", "pa-IN"];
const localeName: Record<IntCp005LocalizedLocale, string> = { "hi-IN": "Hindi", "pa-IN": "Punjabi" };
const answerCounts: Record<IntCp005LocalizedLocale, number[]> = { "hi-IN": [0, 0, 0, 0], "pa-IN": [0, 0, 0, 0] };
const uniqueStems: Record<IntCp005LocalizedLocale, Set<string>> = { "hi-IN": new Set(), "pa-IN": new Set() };
const lines: string[] = [];

lines.push("# INT-CP-005 V16 Hindi + Punjabi Review");
lines.push("");
lines.push(`Localized runtime: \`${INT_CP005_V16_LOCALIZED_RUNTIME_VERSION}\``);
lines.push("");
lines.push("**Authority:** Each item uses the same QL, seed, mathematical state, option values/order, misconception IDs and correct index as the product-owner-approved English V16 review set.");
lines.push("");
lines.push("**Status:** Localization review candidate only. Not frozen, not merged, not registered in Question Studio, not stored in Question Bank, not test-eligible and not public.");
lines.push("");
lines.push("**Scope:** 9 learner QLs (`086,087,088,089,090,091,092,093,095`). `INT-QL-094` remains excluded.");
lines.push("");

selected.forEach((selection, index) => {
  lines.push(`## ${index + 1}. ${selection.qlId}`);
  lines.push("");
  lines.push(`Seed: \`${selection.seed}\``);
  lines.push("");

  for (const locale of locales) {
    const question = generateIntCp005QuestionV16LocalizedFinal(selection.qlId, selection.seed, locale);
    assert(question.correctIndex === selection.correctIndex, `${selection.qlId}/${selection.seed}/${locale}: answer position drifted from approved English review`);
    answerCounts[locale][question.correctIndex] += 1;
    uniqueStems[locale].add(question.presentation.markdown);

    lines.push(`### ${localeName[locale]}`);
    lines.push("");
    lines.push(question.presentation.markdown);
    lines.push("");
    question.options.forEach((option, optionIndex) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option.text}`));
    lines.push("");
    lines.push(`**Correct answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.correctAnswer}`);
    lines.push("");
    lines.push(`**Key idea:** ${question.explanation.keyIdea}`);
    lines.push("");
    lines.push("**Explanation**");
    question.explanation.steps.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. ${step}`));
    lines.push("");
    lines.push(`**Common mistake:** ${question.explanation.commonMistake}`);
    lines.push("");
  }
  lines.push("---");
  lines.push("");
});

for (const locale of locales) {
  assert(answerCounts[locale].every((count) => count === 9), `${locale}: review answers are not A/B/C/D balanced`);
  assert(uniqueStems[locale].size === 36, `${locale}: duplicate review stems`);
}

lines.push("## Review summary");
lines.push("");
lines.push("- Matched approved English states: 36");
lines.push("- Hindi questions: 36");
lines.push("- Punjabi questions: 36");
lines.push(`- Hindi correct positions A/B/C/D: ${answerCounts["hi-IN"].join("/")}`);
lines.push(`- Punjabi correct positions A/B/C/D: ${answerCounts["pa-IN"].join("/")}`);
lines.push("- Punjabi compound-interest terminology: `ਮਿਸ਼ਰਤ ਵਿਆਜ`");
lines.push("- Rejected Punjabi term: `ਚੱਕਰਵੱਧੀ ਵਿਆਜ`");
lines.push("- QL-094: excluded");
lines.push("- Lifecycle: review-only and closed");

const output = resolve(process.env.INT_CP005_V16_HI_PA_REVIEW_OUT ?? "dist/quant-v4/INT-CP-005-V16-HI-PA-REVIEW.md");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, lines.join("\n"), "utf8");
console.log(JSON.stringify({ output, matchedStates: selected.length, answerCounts }, null, 2));
console.log("PASS_INT_CP005_V16_HI_PA_REVIEW_EXPORT");
