import assert from "node:assert/strict";
import { generateClsCp001EnglishQuestion } from "./CLS-CP-001/cp001-runtime";
import { generateClsCp002EnglishQuestion } from "./CLS-CP-002/cp002-permanent-runtime";
import { generateClsCp003EnglishQuestion } from "./CLS-CP-003/cp003-english-runtime";
import { generateClsCp004EnglishQuestion } from "./CLS-CP-004/cp004-english-runtime";

const FORBIDDEN_FORMAL_WORDING = /common classification|differently classified|remaining option|falls outside the class|internal relationship|conventional number property|standard arithmetic or digit property|structural property|lone mismatch|true member|candidate rule/i;
const ACTION_OPENING = /^(Name|Check|Say|Find|Read|Count|Mark|Look|Underline|Solve|Use|Try|Compare|Write|Add|Multiply|Reverse)\b/;

const STEM_PATTERNS: Readonly<Record<string, RegExp>> = {
  "CLS-QL-001": /different|odd one out|does not belong|does not fit/i,
  "CLS-QL-002": /same group|placed with|belongs with/i,
  "CLS-QL-003": /three words|set of three words/i,
  "CLS-QL-004": /pair/i,
  "CLS-QL-005": /word/i,
  "CLS-QL-006": /unscramble|rearrange|jumble|jumbled/i,
  "CLS-QL-007": /number/i,
};

type EditorialQuestion = {
  readonly qlId: string;
  readonly stem: string;
  readonly explanation: {
    readonly examSpeedShortcut: readonly string[];
  };
};

const stemCountsByQl = new Map<string, Map<string, number>>();

function recordStem(qlId: string, stem: string): void {
  const counts = stemCountsByQl.get(qlId) ?? new Map<string, number>();
  counts.set(stem, (counts.get(stem) ?? 0) + 1);
  stemCountsByQl.set(qlId, counts);
}

function checkQuestion(question: EditorialQuestion, seed: number): void {
  assert.ok(question.stem.length <= 170, `${question.qlId}/${seed} stem is too long: ${question.stem}`);
  assert.match(question.stem, /[?.]$/, `${question.qlId}/${seed} stem needs natural ending punctuation`);
  assert.ok(!/\?\?|\.\.|!!/.test(question.stem), `${question.qlId}/${seed} stem has broken punctuation`);

  assert.equal(question.explanation.examSpeedShortcut.length, 1);
  const shortcut = question.explanation.examSpeedShortcut[0]!;
  assert.ok(shortcut.length <= 190, `${question.qlId}/${seed} shortcut is too long: ${shortcut}`);
  assert.ok(ACTION_OPENING.test(shortcut), `${question.qlId}/${seed} shortcut does not start with a clear action: ${shortcut}`);
  assert.ok(!FORBIDDEN_FORMAL_WORDING.test(`${question.stem}\n${shortcut}`), `${question.qlId}/${seed} uses formal or vague wording:\n${question.stem}\n${shortcut}`);
  assert.ok(!/classification|classified|conventional|internal relationship/i.test(question.stem), `${question.qlId}/${seed} stem is too formal: ${question.stem}`);

  const expectedPattern = STEM_PATTERNS[question.qlId];
  assert.ok(expectedPattern, `Unexpected QL: ${question.qlId}`);
  assert.match(question.stem, expectedPattern, `${question.qlId}/${seed} stem is not natural for its task: ${question.stem}`);
  recordStem(question.qlId, question.stem);
}

let checked = 0;
for (const qlId of ["CLS-QL-001", "CLS-QL-002", "CLS-QL-003"] as const) {
  for (let seed = 0; seed < 80; seed += 1) {
    checkQuestion(generateClsCp001EnglishQuestion(qlId, seed), seed);
    checked += 1;
  }
}
for (let seed = 0; seed < 120; seed += 1) {
  checkQuestion(generateClsCp002EnglishQuestion("CLS-QL-004", seed), seed);
  checked += 1;
}
for (const qlId of ["CLS-QL-005", "CLS-QL-006"] as const) {
  for (let seed = 0; seed < 100; seed += 1) {
    checkQuestion(generateClsCp003EnglishQuestion(qlId, seed), seed);
    checked += 1;
  }
}
for (let seed = 0; seed < 160; seed += 1) {
  checkQuestion(generateClsCp004EnglishQuestion("CLS-QL-007", seed), seed);
  checked += 1;
}

assert.equal(checked, 720);
assert.deepEqual([...stemCountsByQl.keys()].sort(), [
  "CLS-QL-001",
  "CLS-QL-002",
  "CLS-QL-003",
  "CLS-QL-004",
  "CLS-QL-005",
  "CLS-QL-006",
  "CLS-QL-007",
]);

const stemVariety = Object.fromEntries(
  [...stemCountsByQl.entries()].map(([qlId, counts]) => {
    const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
    const largestCount = Math.max(...counts.values());
    assert.ok(counts.size >= 4, `${qlId} has too little stem variety: ${counts.size}`);
    assert.ok(largestCount / total <= 0.45, `${qlId} repeats one stem too often: ${largestCount}/${total}`);
    return [qlId, { uniqueStems: counts.size, largestCount, total }];
  }),
);

console.log("CLS-001 English editorial V3 variety audit passed.", {
  checked,
  permanentQls: 7,
  stemVariety,
});
