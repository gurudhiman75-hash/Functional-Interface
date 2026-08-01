import assert from "node:assert/strict";
import { SER_CP001_TEMPORARY_TEMPLATE_IDS, generateSerCp001Question } from "../SER-CP-001/foundation";
import { SER_CP002_TEMPORARY_TEMPLATE_IDS, generateSerCp002Question } from "../SER-CP-002/foundation";
import { SER_CP003_TEMPORARY_TEMPLATE_IDS, generateSerCp003Question } from "../SER-CP-003/foundation";
import { SER_CP004_TEMPORARY_TEMPLATE_IDS, generateSerCp004Question } from "../SER-CP-004/foundation";
import { SER_CP005_TEMPORARY_TEMPLATE_IDS, generateSerCp005Question } from "../SER-CP-005/foundation";
import { SER_CP006_TEMPORARY_TEMPLATE_IDS, generateSerCp006Question } from "../SER-CP-006/foundation";
import {
  SER_V3_NATURAL_STANDARD_ID,
  type SerV3CompatibleQuestion,
  applySerV3NaturalExplanation,
  auditSerV3NaturalExplanation,
  renderSerV3NaturalReview,
} from "./ser-v3-natural-pedagogical";

type Generator<T extends string> = (id: T, seed: number) => SerV3CompatibleQuestion;

const checkpointIds = new Set<string>();
const taskKinds = new Set<string>();
let generated = 0;
let previous = 0;
let wrong = 0;
let lane = 0;
let subset = 0;

function identity(question: SerV3CompatibleQuestion): string {
  return `${question.sourceRuleId ?? ""}|${question.canonicalAuthorityId ?? ""}`;
}

function isLane(question: SerV3CompatibleQuestion): boolean {
  return /INTERLEAVED|ALTERNATING_ADDITIVE_STEPS|ALTERNATING_MULTIPLICATIVE_RATIOS|ALTERNATING_SHIFT_PAIR/.test(identity(question));
}

function isSubset(question: SerV3CompatibleQuestion): boolean {
  return /VOWEL|CONSONANT/.test(question.sourceRuleId ?? "");
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
      assert.deepEqual(failures, [], `${id}/${seed}: ${failures.map((failure) => `${failure.name}: ${failure.message}`).join("; ")}`);

      const review = renderSerV3NaturalReview(question);
      for (const heading of [
        "📌 **Core Pattern**",
        "📝 **Step-by-Step Derivation**",
        "⚡ **Exam Speed Shortcut**",
        "⚠️ **Common Student Trap**",
      ]) {
        assert.equal((review.split(heading).length - 1), 1, `${id}/${seed}: heading drift for ${heading}`);
      }

      const derivation = enhanced.explanationV3.derivation.join(" ");
      if (question.taskKind === "PREVIOUS_TERM") {
        previous += 1;
        assert.ok(enhanced.explanationV3.answerRevealStep >= 3, `${id}/${seed}: previous answer revealed too early`);
        assert.match(
          enhanced.explanationV3.derivation[1]!,
          /inverse|reverse|earlier term requires/i,
          `${id}/${seed}: previous task does not explicitly reverse the forward rule`,
        );
        assert.equal(enhanced.explanationV3.examSpeedShortcut.includes("Q=17"), false, `${id}/${seed}: canned shortcut example`);
      }
      if (question.taskKind === "WRONG_TERM") {
        wrong += 1;
        assert.match(enhanced.explanationV3.derivation[0]!, /^First (build|separate|construct)/);
        assert.ok(derivation.includes(String(question.hiddenState.correctReplacement)));
      }
      if (isLane(question)) {
        lane += 1;
        assert.ok(derivation.includes("Lane 1") && derivation.includes("Lane 2"));
        assert.match(derivation, /same lane|same-lane|target lane/i);
        assert.doesNotMatch(derivation, /neighbouring transitions/i);
      }
      if (isSubset(question)) {
        subset += 1;
        assert.match(derivation, /vowel steps|consonant steps/);
        assert.match(derivation, /\\text\{vowel |\\text\{consonant /);
        assert.doesNotMatch(derivation, /forward shift is \$\+[0-9]+\$, so finding the earlier term/i);
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
assert.ok(previous > 0 && wrong > 0 && lane > 0 && subset > 0);

console.log(JSON.stringify({
  status: "PASS_SER_V3_NATURAL_ALL_CHECKPOINTS",
  standardId: SER_V3_NATURAL_STANDARD_ID,
  generated,
  checkpoints: [...checkpointIds].sort(),
  tasks: [...taskKinds].sort(),
  previousQuestions: previous,
  wrongQuestions: wrong,
  laneQuestions: lane,
  subsetQuestions: subset,
  sourceQuestionMutations: 0,
  nextCheckpointStatus: "BLOCKED_UNTIL_CP006_USER_APPROVAL",
}, null, 2));
