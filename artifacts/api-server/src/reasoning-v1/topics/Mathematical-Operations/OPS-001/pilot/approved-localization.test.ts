import assert from "node:assert/strict";
import {
  OPS_APPROVED_CANDIDATE_IDS,
  generateApprovedOpsQuestion,
} from "./approved-teaching-entry";
import {
  localizeApprovedOpsQuestion,
  type ApprovedOpsLocale,
} from "./approved-localization";

const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly ApprovedOpsLocale[];
const SEEDS_PER_CONTRACT = 50;
const FORBIDDEN_ENGLISH = /\b(?:after|all|and|answer|apply|because|before|both|calculate|change|check|choice|complete|correct|determine|digit|division|do|each|equation|evaluate|every|exactly|expression|false|first|from|gives|global|identify|infer|insert|interchange|into|is|left|make|mapping|matching|means|must|not|number|occurrence|only|operation|operator|option|original|pair|printed|read|rebuild|relation|replace|replacement|result|right|same|select|side|statement|subtraction|target|test|the|then|this|throughout|token|transform|true|unique|use|value|which|with|works)\b/iu;

let localizedCount = 0;
let maxStemLength = 0;
let maxStepLength = 0;

function completeText(question: ReturnType<typeof localizeApprovedOpsQuestion>): string {
  return [
    question.stem,
    question.explanation.ruleStatement,
    ...question.explanation.steps.flatMap((step) => [step.label, step.expression, step.result]),
    question.explanation.conclusion,
  ].join("\n");
}

for (const candidateId of OPS_APPROVED_CANDIDATE_IDS) {
  for (let seed = 0; seed < SEEDS_PER_CONTRACT; seed += 1) {
    const english = generateApprovedOpsQuestion(candidateId, seed);
    for (const locale of LOCALES) {
      const localized = localizeApprovedOpsQuestion(english, locale);
      assert.equal(localized.locale, locale);
      assert.equal(localized.candidateId, english.candidateId);
      assert.equal(localized.seed, english.seed);
      assert.equal(localized.answer, english.answer);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.deepEqual(localized.options, english.options);
      assert.deepEqual(localized.proof, english.proof);
      assert.equal(localized.metadata.localizationVersion, "OPS_APPROVED_V3_ALL_31");
      assert.equal(localized.metadata.localizationSourceLocale, "en-IN");
      assert.ok(localized.explanation.steps.length >= 3);
      assert.equal(localized.options[localized.correctIndex]?.value, localized.answer);

      const text = completeText(localized);
      const forbidden = text.match(FORBIDDEN_ENGLISH);
      assert.equal(forbidden, null, `${candidateId} ${seed} ${locale} contains residual English instruction word: ${forbidden?.[0]}\n${text}`);
      assert.ok(!/(?:^|\s)\p{M}/u.test(text), `${candidateId} ${seed} ${locale} contains an isolated combining mark.`);
      if (locale === "hi-IN") {
        assert.match(localized.stem + localized.explanation.ruleStatement, /\p{Script=Devanagari}/u);
      } else {
        assert.match(localized.stem + localized.explanation.ruleStatement, /\p{Script=Gurmukhi}/u);
      }

      if (candidateId === "OPS-CAND-005") {
        assert.doesNotMatch(text, /\b(?:scale|combine)\b/iu);
        if (locale === "hi-IN") {
          assert.match(text, /गुणा/u);
          assert.match(text, /जोड़/u);
        } else {
          assert.match(text, /ਗੁਣਾ/u);
          assert.match(text, /ਜੋੜ/u);
        }
      }

      maxStemLength = Math.max(maxStemLength, localized.stem.length);
      for (const step of localized.explanation.steps) {
        maxStepLength = Math.max(maxStepLength, step.label.length + step.expression.length + step.result.length);
      }
      assert.ok(localized.stem.length <= 280, `${candidateId} ${locale} stem exceeds mobile review budget.`);
      localizedCount += 1;
    }
  }
}

assert.equal(localizedCount, OPS_APPROVED_CANDIDATE_IDS.length * SEEDS_PER_CONTRACT * LOCALES.length);

console.log("OPS-001 approved all-contract localization passed.", {
  contracts: OPS_APPROVED_CANDIDATE_IDS.length,
  locales: LOCALES,
  seedsPerContract: SEEDS_PER_CONTRACT,
  localizedCount,
  maxStemLength,
  maxStepLength,
});
