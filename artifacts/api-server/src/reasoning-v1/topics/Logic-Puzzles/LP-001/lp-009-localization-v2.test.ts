import assert from "node:assert/strict";
import { solveLp009 } from "./lp-009.ts";
import {
  generateLp009LocalizedBatchV2,
  LP_009_HI_PA_LOCALIZATION_REVIEW_V2,
} from "./lp-009-localization-v2.ts";
import type { Lp009LocalizedLanguage } from "./lp-009-localization-v1.ts";

const languages: readonly Lp009LocalizedLanguage[] = ["hi", "pa"];
const qls = ["LP-QL-033", "LP-QL-034", "LP-QL-035", "LP-QL-036"] as const;
const awkwardHindi = [
  /जन्म महीना कौन-सा महीना/,
  /के जन्म महीना से/,
  /इंटरव्यू का महीना कौन-सा महीना/,
  /शुरू होने का महीना कौन-सा महीना/,
  /समीक्षा बैठक का महीना कौन-सा महीना/,
  /जन्म महीना की केवल/,
  /के साथ .* जुड़ा है/,
];
const awkwardPunjabi = [
  /ਜਨਮ ਮਹੀਨਾ ਕਿਹੜਾ ਮਹੀਨਾ/,
  /ਦੇ ਜਨਮ ਮਹੀਨਾ ਤੋਂ/,
  /ਇੰਟਰਵਿਊ ਦਾ ਮਹੀਨਾ ਕਿਹੜਾ ਮਹੀਨਾ/,
  /ਸ਼ੁਰੂ ਹੋਣ ਦਾ ਮਹੀਨਾ ਕਿਹੜਾ ਮਹੀਨਾ/,
  /ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਦਾ ਮਹੀਨਾ ਕਿਹੜਾ ਮਹੀਨਾ/,
  /ਜਨਮ ਮਹੀਨਾ ਦੀ ਕੇਵਲ/,
  /ਨਾਲ .* ਜੁੜਿਆ ਹੈ/,
];

assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V2.supersedes, "LP_009_HI_PA_LOCALIZATION_REVIEW_V1");
assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V2.status, "HUMAN_REVIEW_CANDIDATE_V2");
assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V2.questionBankWritable, false);
assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V2.testEligible, false);
assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V2.mockTestEligible, false);
assert.equal(LP_009_HI_PA_LOCALIZATION_REVIEW_V2.publiclyPublishable, false);

for (const language of languages) {
  const caselets = generateLp009LocalizedBatchV2(language, "lp-009-localization-v2-audit", 100);
  const awkward = language === "hi" ? awkwardHindi : awkwardPunjabi;
  const qlCounts = Object.fromEntries(qls.map((ql) => [ql, 0])) as Record<(typeof qls)[number], number>;
  const slotCounts = Object.fromEntries(qls.map((ql) => [ql, [0, 0, 0, 0]])) as Record<(typeof qls)[number], number[]>;

  for (const caselet of caselets) {
    assert.deepEqual(solveLp009({ clues: caselet.clues }), [caselet.assignment]);
    const learnerText = [caselet.questionSetup, ...caselet.clues.map((clue) => clue.text), ...caselet.children.flatMap((child) => [child.stem, child.explanation.summary, ...child.explanation.lines])].join("\n");
    for (const pattern of awkward) assert.doesNotMatch(learnerText, pattern, `${language} ${caselet.caseletId} contains awkward V1 wording`);

    for (const child of caselet.children) {
      const english = caselet.englishCaselet.children.find((entry) => entry.questionId === child.questionId)!;
      assert.equal(child.correctIndex, english.correctIndex);
      assert.equal(child.answer, child.options[child.correctIndex]);
      assert.equal(child.explanation.lines.length, english.explanation.lines.length);
      assert.ok(child.explanation.lines.every((line) => line.includes("|---|---|")));
      assert.doesNotMatch(child.explanation.lines.join("\n"), /\bOption\s+[A-D]\b|विकल्प\s+[A-D]|ਚੋਣ\s+[A-D]/i);
      qlCounts[child.qlId] += 1;
      slotCounts[child.qlId][child.correctIndex]! += 1;
    }
  }

  for (const ql of qls) {
    assert.equal(qlCounts[ql], 100);
    assert.deepEqual(slotCounts[ql], [25, 25, 25, 25]);
  }
}

console.log("LP-009 Hindi/Punjabi localization V2 native-wording audit passed: 200 caselets / 800 localized questions.");
