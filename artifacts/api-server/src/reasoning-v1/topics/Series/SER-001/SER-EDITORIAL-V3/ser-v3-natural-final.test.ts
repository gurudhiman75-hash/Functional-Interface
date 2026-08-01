import assert from "node:assert/strict";
import { SER_CP001_TEMPORARY_TEMPLATE_IDS, generateSerCp001Question } from "../SER-CP-001/foundation";
import { SER_CP002_TEMPORARY_TEMPLATE_IDS, generateSerCp002Question } from "../SER-CP-002/foundation";
import { SER_CP003_TEMPORARY_TEMPLATE_IDS, generateSerCp003Question } from "../SER-CP-003/foundation";
import { SER_CP004_TEMPORARY_TEMPLATE_IDS, generateSerCp004Question } from "../SER-CP-004/foundation";
import { SER_CP005_TEMPORARY_TEMPLATE_IDS, generateSerCp005Question } from "../SER-CP-005/foundation";
import { SER_CP006_TEMPORARY_TEMPLATE_IDS, generateSerCp006Question } from "../SER-CP-006/foundation";
import {
  SER_V3_NATURAL_STANDARD_ID,
  SER_V3_OPTION_LABELS,
  SER_V3_SIMPLE_HEADINGS,
  type SerV3CompatibleQuestion,
  applySerV3NaturalExplanation,
  auditSerV3NaturalExplanation,
  renderSerV3NaturalReview,
} from "./ser-v3-natural-authority";

type Generator<T extends string> = (id: T, seed: number) => SerV3CompatibleQuestion;

const checkpointIds = new Set<string>();
const taskKinds = new Set<string>();
const BANNED_LEARNER_JARGON =
  /\b(?:anomaly|authority|canonical|cyclic|derivation|governing|inverse|lane|normalisation|normalization|phase|recurrence|subset)\b/i;
let generated = 0;
let previous = 0;
let wrong = 0;
let rowQuestions = 0;
let shorterListQuestions = 0;
let wrapped = 0;
let numericOptionReviews = 0;

function identity(question: SerV3CompatibleQuestion): string {
  return `${question.sourceRuleId ?? ""}|${question.canonicalAuthorityId ?? ""}`;
}

function isRowQuestion(question: SerV3CompatibleQuestion): boolean {
  return /INTERLEAVED|ALTERNATING_ADDITIVE_STEPS|ALTERNATING_MULTIPLICATIVE_RATIOS|ALTERNATING_SHIFT_PAIR/.test(identity(question));
}

function isShorterListQuestion(question: SerV3CompatibleQuestion): boolean {
  return /VOWEL|CONSONANT/.test(question.sourceRuleId ?? "");
}

function learnerText(question: ReturnType<typeof applySerV3NaturalExplanation>): string {
  return [
    question.explanationV3.corePattern,
    ...question.explanationV3.derivation,
    question.explanationV3.examSpeedShortcut,
    question.explanationV3.commonTrap.warning,
    ...question.explanationV3.commonTrap.optionWarnings,
  ].join(" ");
}

function runSuite<T extends string>(ids: readonly T[], generate: Generator<T>): void {
  for (const id of ids) {
    for (let seed = 1; seed <= 2; seed += 1) {
      const question = generate(id, seed);
      const original = JSON.stringify(question);
      assert.equal(JSON.stringify(generate(id, seed)), original, `${id}/${seed}: source replay drift`);

      const enhanced = applySerV3NaturalExplanation(question);
      assert.equal(JSON.stringify(question), original, `${id}/${seed}: source mutation`);
      assert.equal(enhanced.explanationV3.standardId, SER_V3_NATURAL_STANDARD_ID);
      assert.equal(enhanced.correctAnswer, question.correctAnswer);
      assert.equal(enhanced.correctIndex, question.correctIndex);
      assert.deepEqual(enhanced.options, question.options);
      assert.deepEqual(enhanced.sequence, question.sequence);

      const failures = auditSerV3NaturalExplanation(question).filter((check) => !check.passed);
      assert.deepEqual(
        failures,
        [],
        `${id}/${seed}: ${failures.map((failure) => `${failure.name}: ${failure.message}`).join("; ")}`,
      );

      const review = renderSerV3NaturalReview(question);
      for (const heading of Object.values(SER_V3_SIMPLE_HEADINGS)) {
        assert.equal(review.split(heading).length - 1, 1, `${id}/${seed}: heading drift for ${heading}`);
      }
      assert.doesNotMatch(review, /📌 \*\*Core Pattern\*\*|Step-by-Step Derivation|Common Student Trap/);

      assert.equal(enhanced.options.length, 4);
      enhanced.options.forEach((option, index) => {
        const mark = index === enhanced.correctIndex ? "✓" : " ";
        assert.ok(
          review.includes(`${mark} ${SER_V3_OPTION_LABELS[index]}. ${option}`),
          `${id}/${seed}: missing numeric option label ${index + 1}`,
        );
      });
      assert.ok(
        review.includes(`**Answer:** ${SER_V3_OPTION_LABELS[enhanced.correctIndex]}. ${enhanced.correctAnswer}`),
        `${id}/${seed}: answer must use a numeric option label`,
      );
      assert.doesNotMatch(review, /^[✓ ] [A-D]\. /m, `${id}/${seed}: letter option label creates ambiguity`);
      assert.doesNotMatch(review, /\bOption [A-D]\b/, `${id}/${seed}: distractor note still uses a letter label`);
      numericOptionReviews += 1;

      const text = learnerText(enhanced);
      assert.doesNotMatch(text, BANNED_LEARNER_JARGON, `${id}/${seed}: technical learner wording remains`);

      const solution = enhanced.explanationV3.derivation.join(" ");
      if (question.taskKind === "PREVIOUS_TERM") {
        previous += 1;
        assert.ok(enhanced.explanationV3.answerRevealStep >= 3, `${id}/${seed}: previous answer revealed too early`);
        assert.match(
          enhanced.explanationV3.derivation[1]!,
          /reverse|move backward|earlier term requires|earlier term needs/i,
          `${id}/${seed}: previous task does not explain moving backward`,
        );
        assert.equal(enhanced.explanationV3.examSpeedShortcut.includes("Q=17"), false, `${id}/${seed}: canned shortcut example`);
      }
      if (question.taskKind === "WRONG_TERM") {
        wrong += 1;
        assert.match(enhanced.explanationV3.derivation[0]!, /^First (build|separate|construct|put|write)/);
        assert.ok(solution.includes(String(question.hiddenState.correctReplacement)));
        assert.match(solution, /wrong term/i);
      }
      if (isRowQuestion(question)) {
        rowQuestions += 1;
        assert.ok(solution.includes("Odd-position row") && solution.includes("Even-position row"));
        assert.match(solution, /same row|same-row|needed row/i);
        assert.doesNotMatch(solution, /neighbouring transitions/i);
      }
      if (isShorterListQuestion(question)) {
        shorterListQuestions += 1;
        assert.match(solution, /vowel steps|consonant steps/);
        assert.match(solution, /vowel list|consonant list|letter list/i);
      }
      if (/Wrap (?:after Z|before A):/.test(solution)) {
        wrapped += 1;
        assert.match(
          solution,
          /Wrap (?:after Z|before A): \$[A-Z]\(\d{1,2}\) \\xrightarrow\{[+-]\d+\} [A-Z]\(\d{1,2}\)\$\. \$-?\d+[+-]\d+=-?\d+\$; (?:subtract|add) \$\d+\$ to get \$\d+\$\./,
        );
      }

      checkpointIds.add(question.checkpointId);
      taskKinds.add(question.taskKind);
      generated += 1;
    }
  }
}

runSuite(SER_CP001_TEMPORARY_TEMPLATE_IDS, generateSerCp001Question);
runSuite(SER_CP002_TEMPORARY_TEMPLATE_IDS, generateSerCp002Question);
runSuite(SER_CP003_TEMPORARY_TEMPLATE_IDS, generateSerCp003Question);
runSuite(SER_CP004_TEMPORARY_TEMPLATE_IDS, generateSerCp004Question);
runSuite(SER_CP005_TEMPORARY_TEMPLATE_IDS, generateSerCp005Question);
runSuite(SER_CP006_TEMPORARY_TEMPLATE_IDS, generateSerCp006Question);

assert.deepEqual([...checkpointIds].sort(), ["SER-CP-001", "SER-CP-002", "SER-CP-003", "SER-CP-004", "SER-CP-005", "SER-CP-006"]);
assert.deepEqual([...taskKinds].sort(), ["MISSING_TERM", "NEXT_TERM", "PREVIOUS_TERM", "WRONG_TERM"]);
assert.ok(previous > 0 && wrong > 0 && rowQuestions > 0 && shorterListQuestions > 0 && wrapped > 0);
assert.equal(numericOptionReviews, generated);

console.log(JSON.stringify({
  status: "PASS_SER_V3_NATURAL_ALL_CHECKPOINTS",
  standardId: SER_V3_NATURAL_STANDARD_ID,
  optionLabels: SER_V3_OPTION_LABELS,
  headings: SER_V3_SIMPLE_HEADINGS,
  generated,
  checkpoints: [...checkpointIds].sort(),
  tasks: [...taskKinds].sort(),
  previousQuestions: previous,
  wrongQuestions: wrong,
  rowQuestions,
  shorterListQuestions,
  wrappedQuestions: wrapped,
  numericOptionReviews,
  technicalLearnerTerms: 0,
  letterLabelReferences: 0,
  sourceQuestionMutations: 0,
  nextCheckpointStatus: "BLOCKED_UNTIL_CP006_USER_APPROVAL",
}, null, 2));
