import assert from "node:assert/strict";

import { generateBlrCp002Question } from "../cp002-runtime";
import {
  BLR_CP002_HUMAN_REVIEW_BLOCKER,
  blrCp002CanonicalParityProjection,
  generateBlrCp002LocalizedQuestion,
} from "./cp002-localizer";

const scripts = {
  "hi-IN": /[\u0900-\u097F]/u,
  "pa-IN": /[\u0A00-\u0A7F]/u,
} as const;

const presentations = new Set<string>();
const forms = new Set<string>();
const answerIds = new Set<string>();
const answerPositions = [0, 0, 0, 0];
let reviewed = 0;

function withoutNames(text: string, names: readonly string[]): string {
  let result = text;
  for (const name of [...names].sort((a, b) => b.length - a.length)) {
    result = result.split(name).join("");
  }
  return result;
}

for (let seed = 0; seed < 256; seed += 1) {
  const canonical = generateBlrCp002Question("BLR-QL-008", seed);
  const names = Object.values(canonical.structuredPrompt.personNames);
  for (const locale of ["hi-IN", "pa-IN"] as const) {
    const localized = generateBlrCp002LocalizedQuestion("BLR-QL-008", seed, locale);
    const repeat = generateBlrCp002LocalizedQuestion("BLR-QL-008", seed, locale);

    assert.deepEqual(repeat, localized, `${seed}/${locale} must remain deterministic.`);
    assert.deepEqual(
      blrCp002CanonicalParityProjection(localized),
      blrCp002CanonicalParityProjection(canonical),
      `${seed}/${locale} semantic parity drifted.`,
    );
    assert.equal(localized.correctIndex, canonical.correctIndex);
    assert.equal(localized.options.length, 4);
    assert.equal(localized.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(localized.options[localized.correctIndex]?.isCorrect, true);
    assert.equal(localized.reviewOnly, true);
    assert.equal(localized.questionStudioVisible, false);
    assert.equal(localized.questionBankEligible, false);
    assert.equal(localized.mockTestEligible, false);
    assert.equal(localized.publiclyPublishable, false);
    assert.equal(localized.metadata.semanticParity, "EXECUTABLE_PROVED");
    assert.equal(localized.metadata.humanLanguageReviewRequired, true);
    assert.deepEqual(localized.metadata.activeEditorialBlockers, [BLR_CP002_HUMAN_REVIEW_BLOCKER]);
    assert.equal(localized.metadata.productDeliveryUnlocked, false);
    assert.equal(localized.metadata.productionStagingApproved, false);
    assert.ok(scripts[locale].test(localized.stem));
    assert.ok(localized.explanation.conclusion.includes(localized.options[localized.correctIndex]!.value));
    assert.ok(localized.explanation.familyTree.persons.length >= 2);

    const learner = withoutNames(localized.stem, names);
    assert.doesNotMatch(
      learner,
      /\b(?:How|Whose|Pointing|Showing|Introducing|photograph|portrait|father|mother|brother|sister|son|daughter|husband|wife|related)\b/i,
      `${seed}/${locale} contains English learner leakage.`,
    );

    presentations.add(canonical.metadata.presentation);
    forms.add(canonical.metadata.questionForm);
    answerIds.add(canonical.metadata.answerId);
    answerPositions[localized.correctIndex] += 1;
    reviewed += 1;
  }
}

assert.equal(reviewed, 512);
assert.deepEqual([...presentations].sort(), ["CONVERSATION", "INTRODUCTION", "PHOTOGRAPH", "POINTING", "STAGE"]);
assert.deepEqual([...forms].sort(), ["HOW_RELATED", "WHOSE_PHOTOGRAPH", "WHOSE_PORTRAIT"]);
assert.ok(answerIds.has("SELF"));
assert.ok(answerIds.size >= 12);

console.log(JSON.stringify({
  verdict: "BLR_CP002_HI_PA_LOCALISATION_REVIEW_CANDIDATE_PROVED",
  localizedReviewCount: reviewed,
  presentations: [...presentations].sort(),
  questionForms: [...forms].sort(),
  answerCoverage: [...answerIds].sort(),
  answerPositions,
  semanticParity: true,
  humanLanguageReviewRequired: true,
  productDeliveryUnlocked: false,
}, null, 2));
