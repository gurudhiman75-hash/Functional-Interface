import assert from "node:assert/strict";
import { generateClsCp001EnglishQuestion } from "./CLS-CP-001/cp001-runtime";
import { generateClsCp002EnglishQuestion } from "./CLS-CP-002/cp002-permanent-runtime";
import { generateClsCp003EnglishQuestion } from "./CLS-CP-003/cp003-english-runtime";
import { generateClsCp004EnglishQuestion } from "./CLS-CP-004/cp004-english-runtime";

const FORBIDDEN_FORMAL_WORDING = /common classification|differently classified|remaining option|falls outside the class|internal relationship|conventional number property|standard arithmetic or digit property|structural property|lone mismatch|true member|candidate rule/i;
const ACTION_OPENING = /^(Name|Check|Say|Find|Read|Count|Mark|Look|Underline|Solve|Use|Try|Compare|Write|Add|Multiply|Reverse)\b/;

type EditorialQuestion = {
  readonly qlId: string;
  readonly stem: string;
  readonly explanation: {
    readonly examSpeedShortcut: readonly string[];
  };
};

function checkQuestion(question: EditorialQuestion, seed: number): void {
  assert.ok(question.stem.length <= 150, `${question.qlId}/${seed} stem is too long: ${question.stem}`);
  assert.equal(question.explanation.examSpeedShortcut.length, 1);
  const shortcut = question.explanation.examSpeedShortcut[0]!;
  assert.ok(shortcut.length <= 190, `${question.qlId}/${seed} shortcut is too long: ${shortcut}`);
  assert.ok(ACTION_OPENING.test(shortcut), `${question.qlId}/${seed} shortcut does not start with a clear action: ${shortcut}`);
  assert.ok(!FORBIDDEN_FORMAL_WORDING.test(`${question.stem}\n${shortcut}`), `${question.qlId}/${seed} uses formal or vague wording:\n${question.stem}\n${shortcut}`);
  assert.ok(!/classification|classified|conventional|internal relationship/i.test(question.stem), `${question.qlId}/${seed} stem is too formal: ${question.stem}`);

  switch (question.qlId) {
    case "CLS-QL-001":
      assert.equal(question.stem, "Which item is different from the others?");
      break;
    case "CLS-QL-002":
      assert.match(question.stem, /belong to one group\. Which option belongs to the same group\?$/);
      break;
    case "CLS-QL-003":
      assert.equal(question.stem, "Which option has three words from the same group?");
      break;
    case "CLS-QL-004":
      assert.equal(question.stem, "Which pair has a different link?");
      break;
    case "CLS-QL-005":
      assert.match(question.stem, /^Which word (has|behaves)/);
      break;
    case "CLS-QL-006":
      assert.equal(question.stem, "Unscramble each option. Which word belongs to a different group?");
      break;
    case "CLS-QL-007":
      assert.equal(question.stem, "Which number is different from the others?");
      break;
    default:
      assert.fail(`Unexpected QL: ${question.qlId}`);
  }
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
console.log("CLS-001 English editorial v2 audit passed.", { checked, permanentQls: 7 });
