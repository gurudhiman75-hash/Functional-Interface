// @ts-nocheck
import { NUMBER_SYSTEM_GENERATOR_V3_CARDS } from "./number-system-generator-v3-review";
import {
  NUMBER_SYSTEM_GENERATOR_MODEL,
  assertNoStudentJargon,
} from "./number-system-generator-contract";
import { renderTeacherExplanationMarkdown } from "./simple-teacher-voice";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function isWholeProseSentenceInMath(value: unknown): boolean {
  const text = String(value ?? "").trim();
  if (!/^\$[^$]+\$$/u.test(text)) return false;
  const bodyWithoutCommands = text.slice(1, -1).replace(/\\[A-Za-z]+/gu, "");
  return /[A-Za-z]{2,}/u.test(bodyWithoutCommands) && /\s/u.test(bodyWithoutCommands);
}

const checkpointCounts = new Map<string, number>();
const stemFamilyCounts = new Map<string, number>();
const qlIds = new Set<string>();
let wrongOptionRationaleCount = 0;
let explicitElevenProofCount = 0;
let parityEliminationCount = 0;
let transparentDigitQuestionCount = 0;
let primeAdjustmentQuestionCount = 0;
let inlineMathCleanCount = 0;

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

  assert(!/Choose the option that co-prime statements about/iu.test(card.stem),
    `${label}: malformed co-prime stem grammar remains`);
  assert(!/Choose the option that prime numbers? divides/iu.test(card.stem),
    `${label}: malformed prime-divisor stem grammar remains`);

  const explanationText = [
    ...card.explanation.mainRule,
    ...card.explanation.stepByStepSolution,
    ...card.explanation.examSpeedTrick,
    ...card.explanation.commonTraps.flatMap((trap) => [trap.message, trap.misconceptionTag]),
  ].join("\n");
  assertNoStudentJargon(card.stem, `${label} stem`);
  assertNoStudentJargon(explanationText, `${label} explanation`);
  assert(!/\b(?:Approach|Strategy|Verification|Conclusion|Final answer)\s*:/i.test(explanationText),
    `${label}: extra engine-style section leaked into the four-tier explanation`);
  assert(!/testing leaves|we get the answer|values are obtained|calculation yields/i.test(explanationText),
    `${label}: black-box wording remains`);
  assert(/\$[^$]+\$/u.test(explanationText), `${label}: explanation has no MathJax content`);
  assert(!/\$\$[^$]+\$\$/u.test(explanationText),
    `${label}: display-math delimiters remain inside list text`);
  assert(!/\$\d[\d,]*\$\s*[×÷]\s*\$\d[\d,]*\$/u.test(explanationText),
    `${label}: split ASCII multiplication or division remains`);
  inlineMathCleanCount += 1;

  assert(card.options.length === 4 || card.options.length === 5,
    `${label}: invalid option count`);
  assert(new Set(card.options).size === card.options.length,
    `${label}: duplicate option`);
  assert(card.options.every((option) => !/[✓✔]/u.test(option) && !/\[x\]/iu.test(option)),
    `${label}: correct-answer marker leaked into options`);
  assert(card.options.every((option) => !isWholeProseSentenceInMath(option)),
    `${label}: prose sentence is wrapped entirely in math mode`);
  assert(!isWholeProseSentenceInMath(card.correctAnswer.value),
    `${label}: correct-answer prose is wrapped entirely in math mode`);
  assert(/^[A-E]$/.test(card.correctAnswer.label), `${label}: invalid answer label`);
  assert(card.correctAnswer.value.length > 0, `${label}: missing separate correct answer`);

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

  assert(card.lifecycle.status === "ACTIVE_STAGING", `${label}: staging is not active`);
  assert(card.lifecycle.questionStudioStagingDiscoverable === true,
    `${label}: staging Question Studio discovery is disabled`);
  assert(card.lifecycle.productionQuestionStudioDiscoverable === false,
    `${label}: production Question Studio was enabled`);
  assert(card.lifecycle.productionQuestionBankWritable === false,
    `${label}: production Question Bank writes were enabled`);
  assert(card.lifecycle.productionTestEligible === false,
    `${label}: production test eligibility was enabled`);
  assert(card.lifecycle.publiclyPublishable === false,
    `${label}: public publication was enabled`);
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
assert(inlineMathCleanCount === 153,
  `Expected 153 inline-math-clean cards, received ${inlineMathCleanCount}`);

console.log(JSON.stringify({
  status: "PASS_NUMBER_SYSTEM_GENERATOR_SYSTEM_PROMPT_V3_EDITORIAL_PATCH",
  explanationModel: NUMBER_SYSTEM_GENERATOR_MODEL,
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
  inlineMathCleanCount,
  stagingActive: true,
  productionActivated: false,
  studentSafeOptions: true,
}, null, 2));
