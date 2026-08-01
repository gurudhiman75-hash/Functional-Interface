// @ts-nocheck
import { NUMBER_SYSTEM_GENERATOR_V3_CARDS } from "./number-system-generator-v3-review";
import {
  NUMBER_SYSTEM_GENERATOR_EDITORIAL_PATCH,
  NUMBER_SYSTEM_GENERATOR_MODEL,
  assertNoStudentJargon,
} from "./number-system-generator-contract";
import {
  NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE,
  runNum001EnglishQuestionStudioRelease,
} from "./number-system-question-studio-release";
import { renderTeacherExplanationMarkdown } from "./simple-teacher-voice";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function proseLeakedIntoMath(text: string): boolean {
  for (const match of text.matchAll(/\$([^$]+)\$/gu)) {
    const content = match[1] ?? "";
    const words = content.match(/[A-Za-z]{2,}/gu) ?? [];
    if (words.length >= 4 && !/\\text\s*\{/u.test(content)) return true;
  }
  return false;
}

const checkpointCounts = new Map<string, number>();
const stemFamilyCounts = new Map<string, number>();
const qlIds = new Set<string>();
let wrongOptionRationaleCount = 0;
let explicitElevenProofCount = 0;
let parityEliminationCount = 0;
let transparentDigitQuestionCount = 0;
let primeAdjustmentQuestionCount = 0;
let questionStudioReleaseChecks = 0;

for (const card of NUMBER_SYSTEM_GENERATOR_V3_CARDS) {
  const label = `Q${card.reviewNumber}/${card.qlId}`;
  qlIds.add(card.qlId);
  checkpointCounts.set(card.checkpoint, (checkpointCounts.get(card.checkpoint) ?? 0) + 1);
  stemFamilyCounts.set(card.stemFamily, (stemFamilyCounts.get(card.stemFamily) ?? 0) + 1);

  assert(["Easy", "Medium", "Hard"].includes(card.difficulty),
    `${label}: difficulty is not Title Case`);
  assert(card.explanation.model === NUMBER_SYSTEM_GENERATOR_MODEL,
    `${label}: wrong explanation model ${card.explanation.model}`);
  assert(card.explanation.mainRule.length >= 1 && card.explanation.mainRule.length <= 2,
    `${label}: Main Rule must contain one or two short lines`);
  assert(card.explanation.stepByStepSolution.length >= 2,
    `${label}: solution is too short`);
  assert(card.explanation.examSpeedTrick.length >= 1 && card.explanation.examSpeedTrick.length <= 2,
    `${label}: Exam Speed Trick must contain one or two lines`);
  assert(card.explanation.commonTraps.length === card.options.length - 1,
    `${label}: every wrong option must have one trap explanation`);

  const explanationText = [
    ...card.explanation.mainRule,
    ...card.explanation.stepByStepSolution,
    ...card.explanation.examSpeedTrick,
    ...card.explanation.commonTraps.flatMap((trap) => [
      trap.optionValue,
      trap.message,
      trap.misconceptionTag,
    ]),
  ].join("\n");
  const learnerText = [card.stem, ...card.options, explanationText].join("\n");

  assertNoStudentJargon(card.stem, `${label} stem`);
  assertNoStudentJargon(explanationText, `${label} explanation`);
  assert(!/\b(?:Approach|Strategy|Verification|Conclusion|Final answer)\s*:/i.test(explanationText),
    `${label}: extra engine-style section leaked into the four-tier explanation`);
  assert(!/testing leaves|we get the answer|values are obtained|calculation yields/i.test(explanationText),
    `${label}: black-box wording remains`);
  assert(/\$[^$]+\$/u.test(explanationText), `${label}: explanation has no MathJax content`);
  assert(!/\$\$/u.test(learnerText), `${label}: inline display-math delimiter remains`);
  assert(!/\$[^$]+\$\s*×\s*\$[^$]+\$/u.test(learnerText),
    `${label}: split raw multiplication remains`);
  assert(!proseLeakedIntoMath(learnerText),
    `${label}: prose sentence was wrapped inside one MathJax span`);

  assert(card.options.length === 4 || card.options.length === 5,
    `${label}: invalid option count`);
  assert(new Set(card.options).size === card.options.length,
    `${label}: duplicate option`);
  assert(card.options.every((option) => !/[✓✔]/u.test(option) && !/\[x\]/iu.test(option)),
    `${label}: correct-answer marker leaked into options`);
  assert(/^[A-E]$/.test(card.correctAnswer.label), `${label}: invalid answer label`);
  assert(card.correctAnswer.value.length > 0, `${label}: missing separate correct answer`);
  assert(card.correctAnswer.value === card.options[card.correctAnswer.label.charCodeAt(0) - 65],
    `${label}: correct-answer value differs from option array`);

  for (const trap of card.explanation.commonTraps) {
    assert(/^[A-Z0-9_]+$/.test(trap.misconceptionTag),
      `${label}: invalid misconception tag ${trap.misconceptionTag}`);
    assert(trap.optionLabel !== card.correctAnswer.label,
      `${label}: correct option received a trap explanation`);
  }
  wrongOptionRationaleCount += card.explanation.commonTraps.length;

  const rendered = renderTeacherExplanationMarkdown(card.explanation).join("\n");
  for (const heading of [
    "### 📌 Main Rule",
    "### 📝 Step-by-Step Solution",
    "### ⚡ Exam Speed Trick",
    "### ⚠️ Common Traps",
  ]) {
    assert(rendered.split(heading).length === 2, `${label}: heading ${heading} must appear exactly once`);
  }

  if (card.options.some((option) => /\$11\$/.test(option))) {
    const hasElevenWork = /odd places/i.test(explanationText)
      && /even places/i.test(explanationText)
      && /\\div 11/.test(explanationText)
      && /\|\d+\s*-\s*\d+\|/.test(explanationText);
    if (hasElevenWork) explicitElevenProofCount += 1;
  }
  if (/odd number[\s\S]*even divisor/i.test(explanationText)) parityEliminationCount += 1;

  const qlNumber = Number(card.qlId.slice(-3));
  if (qlNumber >= 2 && qlNumber <= 10) {
    transparentDigitQuestionCount += 1;
    assert(card.explanation.stepByStepSolution.length >= 3,
      `${label}: missing-digit or ordered-pair solution has fewer than three visible steps`);
    assert(/digit.sum|last.two|last.three|alternating|X \+ Y|\\div|\\times/i.test(explanationText),
      `${label}: explicit divisibility calculation is missing`);
  }

  if (card.qlId === "NUM-QL-045") {
    primeAdjustmentQuestionCount += 1;
    assert(/both sides|both directions/i.test(explanationText),
      `${label}: prime adjustment does not search in both directions`);
    assert(/n - 1/.test(explanationText) && /n \+ 1/.test(explanationText),
      `${label}: symmetric prime shortcut is missing`);
    assert(/d = \d+/.test(explanationText),
      `${label}: prime distance is not shown explicitly`);
  }

  assert(card.lifecycle.status === "ACTIVE_QUESTION_STUDIO",
    `${label}: Question Studio lifecycle is not active`);
  assert(card.lifecycle.questionStudioStagingDiscoverable === true,
    `${label}: staging Question Studio discovery is disabled`);
  assert(card.lifecycle.productionQuestionStudioDiscoverable === true,
    `${label}: production Question Studio is disabled`);
  assert(card.lifecycle.productionQuestionBankWritable === false,
    `${label}: production Question Bank writes were enabled`);
  assert(card.lifecycle.productionTestEligible === false,
    `${label}: production test eligibility was enabled`);
  assert(card.lifecycle.publiclyPublishable === false,
    `${label}: public publication was enabled`);
}

const grammarTargets = [128, 129, 139, 140].map(
  (questionNumber) => NUMBER_SYSTEM_GENERATOR_V3_CARDS[questionNumber - 1],
);
assert(grammarTargets.every(Boolean), "Grammar target cards are missing");
for (const card of grammarTargets) {
  assert(!/Choose the option that co-prime statements about/i.test(card.stem),
    `Q${card.reviewNumber}: co-prime stem grammar remains broken`);
  assert(!/Choose the option that prime numbers divides/i.test(card.stem),
    `Q${card.reviewNumber}: prime-divisor stem grammar remains broken`);
}

for (const questionNumber of [142, 143, 144]) {
  const card = NUMBER_SYSTEM_GENERATOR_V3_CARDS[questionNumber - 1];
  assert(card, `Q${questionNumber}: conceptual-prime card is missing`);
  assert(card.options.every((option) => !proseLeakedIntoMath(option)),
    `Q${questionNumber}: prose option remains inside MathJax`);
}

for (const questionNumber of [145, 146, 147]) {
  const card = NUMBER_SYSTEM_GENERATOR_V3_CARDS[questionNumber - 1];
  assert(card, `Q${questionNumber}: factor-tree card is missing`);
  const text = card.explanation.stepByStepSolution.join("\n");
  assert(!/\$[^$]+\$\s*×\s*\$[^$]+\$/u.test(text),
    `Q${questionNumber}: factor-tree multiplication is not unified`);
  assert(/\\times/u.test(text),
    `Q${questionNumber}: factor-tree multiplication lacks \\times`);
}

assert(NUMBER_SYSTEM_GENERATOR_V3_CARDS.length === 153,
  `Expected 153 cards, received ${NUMBER_SYSTEM_GENERATOR_V3_CARDS.length}`);
assert(checkpointCounts.get("NUM-CP-003") === 69,
  `Expected 69 CP-003 cards, received ${checkpointCounts.get("NUM-CP-003")}`);
assert(checkpointCounts.get("NUM-CP-004") === 84,
  `Expected 84 CP-004 cards, received ${checkpointCounts.get("NUM-CP-004")}`);
assert(qlIds.size === 45, `Expected 45 permanent QLs, received ${qlIds.size}`);
for (let qlNumber = 1; qlNumber <= 45; qlNumber += 1) {
  const qlId = `NUM-QL-${String(qlNumber).padStart(3, "0")}`;
  assert(qlIds.has(qlId), `Missing ${qlId}`);
  const cpId = qlNumber <= 17 ? "NUM-CP-003" : "NUM-CP-004";
  const released = runNum001EnglishQuestionStudioRelease(cpId, {
    questionLanguageId: qlId,
    seed: `question-studio-release-proof:${qlId}`,
    language: "en",
  });
  assert(released.active === true, `${qlId}: released item is inactive`);
  assert(released.questionStudioDiscoverable === true,
    `${qlId}: released item is hidden from Question Studio`);
  assert(released.questionBankWritable === false,
    `${qlId}: Question Bank write gate opened`);
  assert(released.testEligible === false,
    `${qlId}: test gate opened`);
  assert(released.publiclyPublishable === false,
    `${qlId}: publication gate opened`);
  questionStudioReleaseChecks += 1;
}

const scenarioCount = stemFamilyCounts.get("SCENARIO") ?? 0;
const directCount = stemFamilyCounts.get("DIRECT") ?? 0;
const imperativeCount = stemFamilyCounts.get("IMPERATIVE") ?? 0;
assert(scenarioCount >= 60 && scenarioCount <= 63,
  `Scenario stem share is outside the 40% target: ${scenarioCount}`);
assert(directCount >= 44 && directCount <= 47,
  `Direct stem share is outside the 30% target: ${directCount}`);
assert(imperativeCount >= 44 && imperativeCount <= 47,
  `Imperative stem share is outside the 30% target: ${imperativeCount}`);
assert(transparentDigitQuestionCount === 39,
  `Expected 39 transparent QL-002..010 questions, received ${transparentDigitQuestionCount}`);
assert(primeAdjustmentQuestionCount === 3,
  `Expected 3 prime-adjustment questions, received ${primeAdjustmentQuestionCount}`);
assert(explicitElevenProofCount >= 1,
  "No complete divisibility-by-11 proof was generated");
assert(parityEliminationCount >= 1,
  "No odd-dividend/even-divisor shortcut was generated");
assert(wrongOptionRationaleCount === 465,
  `Expected 465 wrong-option rationales, received ${wrongOptionRationaleCount}`);
assert(questionStudioReleaseChecks === 45,
  `Expected 45 Question Studio release checks, received ${questionStudioReleaseChecks}`);

assert(NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.editorialPatch ===
  NUMBER_SYSTEM_GENERATOR_EDITORIAL_PATCH,
  "Question Studio release does not use the V3.1 editorial patch");

console.log(JSON.stringify({
  status: "PASS_NUMBER_SYSTEM_GENERATOR_V3_1_QUESTION_STUDIO_RELEASE",
  explanationModel: NUMBER_SYSTEM_GENERATOR_MODEL,
  editorialPatch: NUMBER_SYSTEM_GENERATOR_EDITORIAL_PATCH,
  questionCount: NUMBER_SYSTEM_GENERATOR_V3_CARDS.length,
  fourTierQuestionCount: NUMBER_SYSTEM_GENERATOR_V3_CARDS.length,
  permanentQlCount: qlIds.size,
  checkpointCounts: Object.fromEntries(checkpointCounts),
  stemFamilyCounts: Object.fromEntries(stemFamilyCounts),
  transparentDigitQuestionCount,
  primeAdjustmentQuestionCount,
  explicitElevenProofCount,
  parityEliminationCount,
  wrongOptionRationaleCount,
  grammarRemediationCount: grammarTargets.length,
  proseMathRemediationCount: 3,
  factorTreeRemediationCount: 3,
  questionStudioReleaseChecks,
  questionStudioActive: true,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  studentSafeOptions: true,
}, null, 2));
