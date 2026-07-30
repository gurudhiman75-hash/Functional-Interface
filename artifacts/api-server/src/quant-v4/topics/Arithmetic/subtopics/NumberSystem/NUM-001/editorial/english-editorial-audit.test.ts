// @ts-nocheck
import { NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS } from "./combined-review-export";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const bannedStemPatterns = [
  /For which option is/i,
  /minimum signed integer adjustments/i,
  /built around/i,
  /reference prime/i,
  /narrows p to/i,
  /Which option leaves remainder 0/i,
  /inclusive interval/i,
  /complete valid-digit set/i,
  /divisible completions/i,
  /smallest admissible digit/i,
  /what is true about ordered digit pairs/i,
  /prime-number terminology/i,
  /Counting multiplicity,/i,
];

const qlIds = new Set<string>();
const checkpointCounts = new Map<string, number>();
const difficultyByCheckpoint = new Map<string, Set<string>>();
const stateKeysByQl = new Map<string, Set<string>>();
const firstWordRuns: Array<{ word: string; length: number }> = [];
let currentFirstWord = "";
let currentRunLength = 0;

function stateKey(question): string {
  if (question.mathematicalFingerprint) return String(question.mathematicalFingerprint);
  if (question.fingerprint) return String(question.fingerprint);
  return JSON.stringify(
    question.hiddenState,
    (_key, value) => typeof value === "bigint" ? value.toString() : value,
  );
}

for (const [index, row] of NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS.entries()) {
  const reviewNumber = index + 1;
  const qlId = row.allocation.qlId;
  const stem = String(row.question.stem);
  qlIds.add(qlId);
  checkpointCounts.set(row.checkpoint, (checkpointCounts.get(row.checkpoint) ?? 0) + 1);
  if (!difficultyByCheckpoint.has(row.checkpoint)) difficultyByCheckpoint.set(row.checkpoint, new Set());
  difficultyByCheckpoint.get(row.checkpoint)!.add(String(row.question.difficulty));

  assert(stem.length >= 20, `Q${reviewNumber}/${qlId}: stem is too short`);
  assert(stem.length <= 420, `Q${reviewNumber}/${qlId}: stem is too long for review rendering`);
  assert(!/\s+[?.!,]/.test(stem), `Q${reviewNumber}/${qlId}: space before punctuation`);
  assert(!/(?<![\dA-Za-z^,])\d{5,}(?![\dA-Za-z,])/.test(stem),
    `Q${reviewNumber}/${qlId}: ungrouped standalone large integer in en-IN stem: ${stem}`);
  for (const pattern of bannedStemPatterns) {
    assert(!pattern.test(stem), `Q${reviewNumber}/${qlId}: banned robotic phrase ${pattern}: ${stem}`);
  }
  assert(!/NUM-(?:CP|QL|SM|001)/.test(stem), `Q${reviewNumber}/${qlId}: internal identifier leaked into stem`);
  assert(!/candidate-set|target projection|answer semantic|temporary template/i.test(stem),
    `Q${reviewNumber}/${qlId}: engine terminology leaked into stem`);

  const options = row.checkpoint === "NUM-CP-003"
    ? row.question.options.map(String)
    : row.question.options.map((option) => String(option.value));
  assert(options.length === 4 || options.length === 5,
    `Q${reviewNumber}/${qlId}: expected four or five options, received ${options.length}`);
  assert(new Set(options).size === options.length, `Q${reviewNumber}/${qlId}: duplicate options`);
  assert(Number.isInteger(row.question.correctIndex), `Q${reviewNumber}/${qlId}: invalid correct index`);
  assert(row.question.correctIndex >= 0 && row.question.correctIndex < options.length,
    `Q${reviewNumber}/${qlId}: correct index is out of range`);

  if (row.checkpoint === "NUM-CP-003") {
    assert(row.question.active === false, `Q${reviewNumber}/${qlId}: CP-003 active flag changed`);
    assert(row.question.questionStudioDiscoverable === false,
      `Q${reviewNumber}/${qlId}: CP-003 Question Studio route changed`);
    assert(row.question.questionBankWritable === false,
      `Q${reviewNumber}/${qlId}: CP-003 Question Bank route changed`);
    assert(row.question.testEligible === false,
      `Q${reviewNumber}/${qlId}: CP-003 test route changed`);
    assert(row.question.publiclyPublishable === false,
      `Q${reviewNumber}/${qlId}: CP-003 publication route changed`);
  } else {
    assert(row.question.lifecycle.active === false, `Q${reviewNumber}/${qlId}: CP-004 active flag changed`);
    assert(row.question.lifecycle.questionStudioDiscoverable === false,
      `Q${reviewNumber}/${qlId}: CP-004 Question Studio route changed`);
    assert(row.question.lifecycle.questionBankWritable === false,
      `Q${reviewNumber}/${qlId}: CP-004 Question Bank route changed`);
    assert(row.question.lifecycle.testEligible === false,
      `Q${reviewNumber}/${qlId}: CP-004 test route changed`);
    assert(row.question.lifecycle.publiclyPublishable === false,
      `Q${reviewNumber}/${qlId}: CP-004 publication route changed`);
  }

  if (qlId === "NUM-QL-016" || qlId === "NUM-QL-044") {
    assert(stem.includes("\n\nStatement I:"), `Q${reviewNumber}/${qlId}: Statement I is not vertically separated`);
    assert(stem.includes("\nStatement II:"), `Q${reviewNumber}/${qlId}: Statement II is not vertically separated`);
    assert(stem.endsWith("Select the correct data-sufficiency option."),
      `Q${reviewNumber}/${qlId}: non-standard data-sufficiency close`);
  }
  if (qlId === "NUM-QL-044") {
    assert(!/Statement [IVX]+ narrows/i.test(stem),
      `Q${reviewNumber}/${qlId}: derived candidate-set wording remains student-facing`);
    assert(/[<>]/.test(stem), `Q${reviewNumber}/${qlId}: prime data sufficiency lacks real mathematical evidence`);
  }

  if (!stateKeysByQl.has(qlId)) stateKeysByQl.set(qlId, new Set());
  const keySet = stateKeysByQl.get(qlId)!;
  const key = stateKey(row.question);
  assert(!keySet.has(key), `Q${reviewNumber}/${qlId}: duplicate mathematical review state`);
  keySet.add(key);

  const firstWord = stem.trim().split(/\s+/)[0]!.toLowerCase();
  if (firstWord === currentFirstWord) {
    currentRunLength += 1;
  } else {
    if (currentRunLength > 0) firstWordRuns.push({ word: currentFirstWord, length: currentRunLength });
    currentFirstWord = firstWord;
    currentRunLength = 1;
  }
}
if (currentRunLength > 0) firstWordRuns.push({ word: currentFirstWord, length: currentRunLength });

assert(NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS.length === 153,
  `Expected 153 review questions, received ${NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS.length}`);
assert(checkpointCounts.get("NUM-CP-003") === 69,
  `Expected 69 CP-003 questions, received ${checkpointCounts.get("NUM-CP-003")}`);
assert(checkpointCounts.get("NUM-CP-004") === 84,
  `Expected 84 CP-004 questions, received ${checkpointCounts.get("NUM-CP-004")}`);
assert(qlIds.size === 45, `Expected 45 permanent QLs, received ${qlIds.size}`);
for (let qlNumber = 1; qlNumber <= 45; qlNumber += 1) {
  const qlId = `NUM-QL-${String(qlNumber).padStart(3, "0")}`;
  assert(qlIds.has(qlId), `Missing ${qlId} from editorial review corpus`);
}
for (const checkpoint of ["NUM-CP-003", "NUM-CP-004"]) {
  const difficulties = difficultyByCheckpoint.get(checkpoint) ?? new Set();
  assert(difficulties.has("EASY") || difficulties.has("Easy"), `${checkpoint}: Easy review coverage missing`);
  assert(difficulties.has("MEDIUM") || difficulties.has("Medium"), `${checkpoint}: Medium review coverage missing`);
  assert(difficulties.has("HARD") || difficulties.has("Hard"), `${checkpoint}: Hard review coverage missing`);
}
const longestFirstWordRun = firstWordRuns.reduce(
  (best, current) => current.length > best.length ? current : best,
  { word: "", length: 0 },
);
assert(longestFirstWordRun.length <= 9,
  `Lead-in clustering exceeds editorial limit: ${longestFirstWordRun.word} × ${longestFirstWordRun.length}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP003_CP004_ENGLISH_EDITORIAL_AUDIT",
  questionCount: NUM_CP003_CP004_EDITORIAL_REVIEW_ROWS.length,
  permanentQlCount: qlIds.size,
  checkpointCounts: Object.fromEntries(checkpointCounts),
  difficultyByCheckpoint: Object.fromEntries(
    [...difficultyByCheckpoint].map(([checkpoint, values]) => [checkpoint, [...values].sort()]),
  ),
  longestFirstWordRun,
  lifecycleActivated: false,
}, null, 2));
