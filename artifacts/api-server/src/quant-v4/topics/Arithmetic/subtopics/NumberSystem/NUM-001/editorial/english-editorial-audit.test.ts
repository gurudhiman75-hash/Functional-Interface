// @ts-nocheck
import {
  NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS,
  NUM_CP003_CP004_STAGING_LIFECYCLE,
  stripAnswerMarkers,
} from "./combined-review-export";
import {
  SIMPLE_NUMBER_SYSTEM_QL_TITLES,
  buildNumberSystemTeacherExplanation,
  renderTeacherExplanationMarkdown,
} from "./simple-teacher-voice";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const BANNED_STEM_PATTERNS = [
  /For which option is/i,
  /minimum signed integer adjustments/i,
  /divisor polarity selection/i,
  /target projection/i,
  /answer semantic/i,
  /candidate-set/i,
  /temporary template/i,
  /prime-number terminology/i,
  /complete valid-digit set/i,
  /admissible digit/i,
];

const BANNED_TEACHER_PATTERNS = [
  /\bApproach:/i,
  /\bVerification:/i,
  /\bConclusion:/i,
  /\bFinal answer:/i,
  /Compute or infer/i,
  /Exact testing leaves/i,
  /admissible domain/i,
  /\badmissible\b/i,
  /candidate set/i,
  /\bcardinality\b/i,
  /target projection/i,
  /answer semantic/i,
  /governing condition/i,
  /resulting class/i,
  /minimum signed integer adjustment/i,
  /divisor polarity selection/i,
  /\benumerate\b/i,
  /\benumeration\b/i,
  /this option does not match/i,
  /fails at least one/i,
  /breaks a basic prime-number rule explained above/i,
  /quick HCF check/i,
  /misses or includes a wrong value/i,
  /reads the remaining sets incorrectly/i,
  /mixes up the two tests/i,
  /not that first prime/i,
];

const EXPECTED_HEADERS = [
  "### 📌 Main Rule",
  "### 📝 Step-by-Step Solution",
  "### ⚡ Exam Speed Trick",
  "### ⚠️ Common Traps",
];

function optionValues(row): string[] {
  return row.checkpoint === "NUM-CP-003"
    ? row.question.options.map(String)
    : row.question.options.map((option) => String(option.value));
}

function stableStateKey(question): string {
  if (question.mathematicalFingerprint) return String(question.mathematicalFingerprint);
  if (question.fingerprint) return String(question.fingerprint);
  return JSON.stringify(
    question.hiddenState,
    (_key, value) => typeof value === "bigint" ? value.toString() : value,
  );
}

function occurrences(text: string, token: string): number {
  return text.split(token).length - 1;
}

assert(NUM_CP003_CP004_STAGING_LIFECYCLE.environment === "STAGING",
  "Review corpus is not in the staging environment");
assert(NUM_CP003_CP004_STAGING_LIFECYCLE.status === "ACTIVE_STAGING",
  "Review corpus is not Active Staging");
assert(NUM_CP003_CP004_STAGING_LIFECYCLE.explanationModel === "FOUR_TIER_SIMPLE_TEACHER_VOICE_V2",
  "Simple teacher-voice model is not registered");
assert(NUM_CP003_CP004_STAGING_LIFECYCLE.production.questionStudioDiscoverable === false,
  "Production Question Studio route was enabled");
assert(NUM_CP003_CP004_STAGING_LIFECYCLE.production.questionBankWritable === false,
  "Production Question Bank writes were enabled");
assert(NUM_CP003_CP004_STAGING_LIFECYCLE.production.testEligible === false,
  "Production test eligibility was enabled");
assert(NUM_CP003_CP004_STAGING_LIFECYCLE.production.publiclyPublishable === false,
  "Public production delivery was enabled");
assert(stripAnswerMarkers("11 **✓**") === "11", "Markdown checkmark stripping failed");
assert(stripAnswerMarkers("11 ✔") === "11", "Unicode checkmark stripping failed");

const qlIds = new Set<string>();
const stateKeysByQl = new Map<string, Set<string>>();
const checkpointCounts = new Map<string, number>();
const difficultyByCheckpoint = new Map<string, Set<string>>();
let fourTierQuestionCount = 0;
let wrongOptionRationaleCount = 0;
let transparentDigitQuestionCount = 0;
let primeAdjustmentQuestionCount = 0;

for (const [index, row] of NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS.entries()) {
  const reviewNumber = index + 1;
  const qlId = row.allocation.qlId;
  const qlNumber = Number(qlId.slice(-3));
  const stem = String(row.question.stem);
  const options = optionValues(row);
  const correctIndex = Number(row.question.correctIndex);
  const title = SIMPLE_NUMBER_SYSTEM_QL_TITLES[qlId];
  const teacher = buildNumberSystemTeacherExplanation(row);
  const rendered = renderTeacherExplanationMarkdown(teacher).join("\n");
  const teacherText = [
    ...teacher.mainRule,
    ...teacher.stepByStepSolution,
    ...teacher.examSpeedTrick,
    ...teacher.commonTraps.flatMap((trap) => [trap.optionValue, trap.message, trap.misconceptionTag]),
  ].join("\n");

  qlIds.add(qlId);
  checkpointCounts.set(row.checkpoint, (checkpointCounts.get(row.checkpoint) ?? 0) + 1);
  if (!difficultyByCheckpoint.has(row.checkpoint)) difficultyByCheckpoint.set(row.checkpoint, new Set());
  difficultyByCheckpoint.get(row.checkpoint)!.add(String(row.question.difficulty));

  assert(typeof title === "string" && title.length >= 8,
    `Q${reviewNumber}/${qlId}: simple title is missing`);
  assert(!/polarity|projection|semantic|admissible|cardinality|synthesis authority/i.test(title),
    `Q${reviewNumber}/${qlId}: developer language remains in title: ${title}`);
  assert(stem.length >= 20 && stem.length <= 420,
    `Q${reviewNumber}/${qlId}: stem length is outside the review limit`);
  assert(!/\s+[?.!,]/u.test(stem), `Q${reviewNumber}/${qlId}: space before punctuation`);
  assert(!/(?<![\dA-Za-z^,])\d{5,}(?![\dA-Za-z,])/u.test(stem),
    `Q${reviewNumber}/${qlId}: large number lacks Indian comma grouping: ${stem}`);
  for (const pattern of BANNED_STEM_PATTERNS) {
    assert(!pattern.test(stem), `Q${reviewNumber}/${qlId}: robotic stem phrase ${pattern}: ${stem}`);
  }
  assert(!/NUM-(?:CP|QL|SM|001)/u.test(stem),
    `Q${reviewNumber}/${qlId}: internal identifier leaked into stem`);

  assert(options.length === 4 || options.length === 5,
    `Q${reviewNumber}/${qlId}: expected four or five options`);
  assert(new Set(options).size === options.length,
    `Q${reviewNumber}/${qlId}: duplicate options`);
  assert(options.every((option) => !/[✓✔]/u.test(option)),
    `Q${reviewNumber}/${qlId}: answer mark leaked into an option`);
  assert(Number.isInteger(correctIndex) && correctIndex >= 0 && correctIndex < options.length,
    `Q${reviewNumber}/${qlId}: invalid correct option index`);

  assert(teacher.model === "FOUR_TIER_SIMPLE_TEACHER_VOICE_V2",
    `Q${reviewNumber}/${qlId}: wrong explanation model`);
  assert(Array.isArray(teacher.mainRule) && teacher.mainRule.length >= 1 && teacher.mainRule.length <= 2,
    `Q${reviewNumber}/${qlId}: Main Rule must contain one or two short teaching lines`);
  assert(teacher.mainRule.every((line) => line.trim().length >= 18),
    `Q${reviewNumber}/${qlId}: Main Rule is too short`);
  assert(Array.isArray(teacher.stepByStepSolution) && teacher.stepByStepSolution.length >= 3,
    `Q${reviewNumber}/${qlId}: solution has fewer than three visible steps`);
  assert(teacher.stepByStepSolution.every((line) => line.trim().length >= 12),
    `Q${reviewNumber}/${qlId}: a solution step is too short`);
  assert(Array.isArray(teacher.examSpeedTrick) && teacher.examSpeedTrick.length >= 1 && teacher.examSpeedTrick.length <= 2,
    `Q${reviewNumber}/${qlId}: Exam Speed Trick is missing or too long`);
  assert(teacher.examSpeedTrick.every((line) => line.trim().length >= 18),
    `Q${reviewNumber}/${qlId}: Exam Speed Trick is too short`);

  for (const header of EXPECTED_HEADERS) {
    assert(occurrences(rendered, header) === 1,
      `Q${reviewNumber}/${qlId}: section ${header} is missing or repeated`);
  }
  assert((rendered.match(/^### /gmu) ?? []).length === 4,
    `Q${reviewNumber}/${qlId}: explanation must contain exactly four visible sections`);

  assert(teacher.commonTraps.length === options.length - 1,
    `Q${reviewNumber}/${qlId}: every wrong option needs its own trap explanation`);
  const expectedWrongLabels = options
    .map((_option, optionIndex) => String.fromCharCode(65 + optionIndex))
    .filter((_label, optionIndex) => optionIndex !== correctIndex);
  const actualWrongLabels = teacher.commonTraps.map((trap) => trap.optionLabel).sort();
  assert(JSON.stringify(actualWrongLabels) === JSON.stringify(expectedWrongLabels.sort()),
    `Q${reviewNumber}/${qlId}: trap labels do not cover every wrong option`);
  assert(new Set(actualWrongLabels).size === actualWrongLabels.length,
    `Q${reviewNumber}/${qlId}: duplicate trap label`);
  for (const trap of teacher.commonTraps) {
    assert(trap.optionValue.trim().length > 0,
      `Q${reviewNumber}/${qlId}/Option ${trap.optionLabel}: option value missing in trap`);
    assert(trap.message.trim().length >= 30,
      `Q${reviewNumber}/${qlId}/Option ${trap.optionLabel}: explanation is too vague`);
    assert(/^[A-Z][A-Z0-9_]*$/u.test(trap.misconceptionTag),
      `Q${reviewNumber}/${qlId}/Option ${trap.optionLabel}: invalid misconception tag`);
    assert(rendered.includes(`[${trap.misconceptionTag}]`),
      `Q${reviewNumber}/${qlId}/Option ${trap.optionLabel}: misconception tag is not rendered`);
  }
  wrongOptionRationaleCount += teacher.commonTraps.length;

  for (const pattern of BANNED_TEACHER_PATTERNS) {
    assert(!pattern.test(teacherText),
      `Q${reviewNumber}/${qlId}: robotic or vague teacher phrase ${pattern}: ${teacherText}`);
  }
  assert(!/(?<![\dA-Za-z^,])\d{5,}(?![\dA-Za-z,])/u.test(teacherText),
    `Q${reviewNumber}/${qlId}: ungrouped large integer in explanation: ${teacherText}`);
  assert(/\$[^$]+\$/u.test(teacherText),
    `Q${reviewNumber}/${qlId}: MathJax formatting is missing`);

  if (qlNumber >= 2 && qlNumber <= 10) {
    transparentDigitQuestionCount += 1;
    assert(/digit sum|last digit|last two digits|last three digits|alternating|X \+ Y|\\div|\\times/iu.test(teacherText),
      `Q${reviewNumber}/${qlId}: explicit divisibility calculation is missing`);
    assert(/\$\$[^$]*(?:=|\\div|\\times|\+)[^$]*\$\$/u.test(teacherText),
      `Q${reviewNumber}/${qlId}: display calculation is missing`);
  }
  if (qlId === "NUM-QL-045") {
    primeAdjustmentQuestionCount += 1;
    assert(/n - 1|n \+ 1|distance|below and above/iu.test(teacherText),
      `Q${reviewNumber}/${qlId}: two-direction prime search is missing`);
    assert(/prime|composite/iu.test(teacherText),
      `Q${reviewNumber}/${qlId}: prime checks are missing`);
  }

  if (row.checkpoint === "NUM-CP-003") {
    assert(row.question.active === false, `Q${reviewNumber}/${qlId}: CP-003 production active flag changed`);
    assert(row.question.questionStudioDiscoverable === false,
      `Q${reviewNumber}/${qlId}: CP-003 production Question Studio route changed`);
    assert(row.question.questionBankWritable === false,
      `Q${reviewNumber}/${qlId}: CP-003 production Question Bank route changed`);
    assert(row.question.testEligible === false,
      `Q${reviewNumber}/${qlId}: CP-003 production test route changed`);
    assert(row.question.publiclyPublishable === false,
      `Q${reviewNumber}/${qlId}: CP-003 production publication route changed`);
  } else {
    assert(row.question.lifecycle.active === false, `Q${reviewNumber}/${qlId}: CP-004 production active flag changed`);
    assert(row.question.lifecycle.questionStudioDiscoverable === false,
      `Q${reviewNumber}/${qlId}: CP-004 production Question Studio route changed`);
    assert(row.question.lifecycle.questionBankWritable === false,
      `Q${reviewNumber}/${qlId}: CP-004 production Question Bank route changed`);
    assert(row.question.lifecycle.testEligible === false,
      `Q${reviewNumber}/${qlId}: CP-004 production test route changed`);
    assert(row.question.lifecycle.publiclyPublishable === false,
      `Q${reviewNumber}/${qlId}: CP-004 production publication route changed`);
  }

  if (!stateKeysByQl.has(qlId)) stateKeysByQl.set(qlId, new Set());
  const keySet = stateKeysByQl.get(qlId)!;
  const key = stableStateKey(row.question);
  assert(!keySet.has(key), `Q${reviewNumber}/${qlId}: duplicate mathematical review state`);
  keySet.add(key);
  fourTierQuestionCount += 1;
}

assert(NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS.length === 153,
  `Expected 153 review questions, received ${NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS.length}`);
assert(fourTierQuestionCount === 153,
  `Expected 153 four-tier explanations, received ${fourTierQuestionCount}`);
assert(checkpointCounts.get("NUM-CP-003") === 69,
  `Expected 69 CP-003 questions, received ${checkpointCounts.get("NUM-CP-003")}`);
assert(checkpointCounts.get("NUM-CP-004") === 84,
  `Expected 84 CP-004 questions, received ${checkpointCounts.get("NUM-CP-004")}`);
assert(qlIds.size === 45, `Expected 45 permanent QLs, received ${qlIds.size}`);
assert(transparentDigitQuestionCount === 39,
  `Expected 39 QL-002..QL-010 questions, received ${transparentDigitQuestionCount}`);
assert(primeAdjustmentQuestionCount === 3,
  `Expected three NUM-QL-045 questions, received ${primeAdjustmentQuestionCount}`);
assert(wrongOptionRationaleCount >= 459,
  `Wrong-option rationale coverage is unexpectedly low: ${wrongOptionRationaleCount}`);
for (let qlNumber = 1; qlNumber <= 45; qlNumber += 1) {
  const qlId = `NUM-QL-${String(qlNumber).padStart(3, "0")}`;
  assert(qlIds.has(qlId), `Missing ${qlId} from the review corpus`);
}
for (const checkpoint of ["NUM-CP-003", "NUM-CP-004"]) {
  const difficulties = difficultyByCheckpoint.get(checkpoint) ?? new Set();
  assert(difficulties.has("EASY") || difficulties.has("Easy"), `${checkpoint}: Easy coverage missing`);
  assert(difficulties.has("MEDIUM") || difficulties.has("Medium"), `${checkpoint}: Medium coverage missing`);
  assert(difficulties.has("HARD") || difficulties.has("Hard"), `${checkpoint}: Hard coverage missing`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP003_CP004_SIMPLE_TEACHER_VOICE_EDITORIAL_AUDIT",
  questionCount: NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS.length,
  fourTierQuestionCount,
  wrongOptionRationaleCount,
  permanentQlCount: qlIds.size,
  checkpointCounts: Object.fromEntries(checkpointCounts),
  transparentDigitQuestionCount,
  primeAdjustmentQuestionCount,
  explanationModel: "FOUR_TIER_SIMPLE_TEACHER_VOICE_V2",
  stagingActive: true,
  productionActivated: false,
  studentSafeOptions: true,
}, null, 2));
