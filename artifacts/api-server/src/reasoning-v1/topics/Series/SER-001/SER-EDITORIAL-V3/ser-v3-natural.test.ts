import assert from "node:assert/strict";
import {
  SER_CP001_TEMPORARY_TEMPLATE_IDS,
  generateSerCp001Question,
} from "../SER-CP-001/foundation";
import {
  SER_CP002_TEMPORARY_TEMPLATE_IDS,
  generateSerCp002Question,
} from "../SER-CP-002/foundation";
import {
  SER_CP003_TEMPORARY_TEMPLATE_IDS,
  generateSerCp003Question,
} from "../SER-CP-003/foundation";
import {
  SER_CP004_TEMPORARY_TEMPLATE_IDS,
  generateSerCp004Question,
} from "../SER-CP-004/foundation";
import {
  SER_CP005_TEMPORARY_TEMPLATE_IDS,
  generateSerCp005Question,
} from "../SER-CP-005/foundation";
import {
  SER_CP006_TEMPORARY_TEMPLATE_IDS,
  generateSerCp006Question,
} from "../SER-CP-006/foundation";
import {
  SER_V3_NATURAL_STANDARD_ID,
  type SerV3CompatibleQuestion,
  applySerV3NaturalExplanation,
  auditSerV3NaturalExplanation,
  renderSerV3NaturalReview,
} from "./ser-v3-natural-pedagogical";

const checkpoints = new Set<string>();
const tasks = new Set<string>();
let generated = 0;
let previousQuestions = 0;
let wrongQuestions = 0;
let alphabeticQuestions = 0;
let laneQuestions = 0;
let subsetQuestions = 0;

type Generator<TId extends string> = (id: TId, seed: number) => SerV3CompatibleQuestion;

function isLaneQuestion(question: SerV3CompatibleQuestion): boolean {
  const identity = `${question.sourceRuleId ?? ""}|${question.canonicalAuthorityId ?? ""}`;
  return /INTERLEAVED|ALTERNATING_ADDITIVE_STEPS|ALTERNATING_MULTIPLICATIVE_RATIOS|ALTERNATING_SHIFT_PAIR/.test(identity);
}

function isSubsetQuestion(question: SerV3CompatibleQuestion): boolean {
  return /VOWEL|CONSONANT/.test(question.sourceRuleId ?? "");
}

function auditSuite<TId extends string>(
  checkpointId: string,
  ids: readonly TId[],
  generate: Generator<TId>,
): void {
  for (const id of ids) {
    for (let seed = 1; seed <= 2; seed += 1) {
      const question = generate(id, seed);
      const replay = generate(id, seed);
      const originalJson = JSON.stringify(question);
      assert.equal(JSON.stringify(replay), originalJson, `${checkpointId}/${id}/${seed}: nondeterministic source question`);

      const enhanced = applySerV3NaturalExplanation(question);
      assert.equal(JSON.stringify(question), originalJson, `${checkpointId}/${id}/${seed}: source question was mutated`);
      assert.equal(enhanced.explanationV3.standardId, SER_V3_NATURAL_STANDARD_ID);
      assert.equal(enhanced.correctAnswer, question.correctAnswer);
      assert.equal(enhanced.correctIndex, question.correctIndex);
      assert.deepEqual(enhanced.options, question.options);
      assert.deepEqual(enhanced.sequence, question.sequence);
      assert.deepEqual(enhanced.hiddenState.canonicalSequence, question.hiddenState.canonicalSequence);

      const checks = auditSerV3NaturalExplanation(question);
      const failures = checks.filter((check) => !check.passed);
      assert.deepEqual(
        failures,
        [],
        `${checkpointId}/${id}/${seed}: ${failures.map((failure) => `${failure.name}: ${failure.message}`).join("; ")}`,
      );

      const review = renderSerV3NaturalReview(question);
      for (const heading of [
        "📌 **Core Pattern**",
        "📝 **Step-by-Step Derivation**",
        "⚡ **Exam Speed Shortcut**",
        "⚠️ **Common Student Trap**",
      ]) {
        assert.ok(review.includes(heading), `${checkpointId}/${id}/${seed}: missing ${heading}`);
      }
      assert.ok(review.includes(`[${enhanced.explanationV3.commonTrap.code}]`));
      assert.equal((review.match(/📌 \*\*Core Pattern\*\*/g) ?? []).length, 1);
      assert.equal((review.match(/📝 \*\*Step-by-Step Derivation\*\*/g) ?? []).length, 1);
      assert.equal((review.match(/⚡ \*\*Exam Speed Shortcut\*\*/g) ?? []).length, 1);
      assert.equal((review.match(/⚠️ \*\*Common Student Trap\*\*/g) ?? []).length, 1);

      if (question.taskKind === "PREVIOUS_TERM") {
        previousQuestions += 1;
        assert.ok(enhanced.explanationV3.answerRevealStep >= 3);
        assert.match(enhanced.explanationV3.derivation[1]!, /inverse|reverse/i);
        assert.equal(enhanced.explanationV3.examSpeedShortcut.includes("Q=17"), false);
      }
      if (question.taskKind === "WRONG_TERM") {
        wrongQuestions += 1;
        assert.match(enhanced.explanationV3.derivation[0]!, /^First (build|separate|construct)/);
        assert.ok(enhanced.explanationV3.derivation.join(" ").includes(String(question.hiddenState.correctReplacement)));
      }
      if (question.checkpointId === "SER-CP-006") {
        alphabeticQuestions += 1;
        assert.match(enhanced.explanationV3.corePattern + enhanced.explanationV3.derivation.join(" "), /A=1|[A-Z]\(\d{1,2}\)/);
      }
      if (isLaneQuestion(question)) {
        laneQuestions += 1;
        const derivation = enhanced.explanationV3.derivation.join(" ");
        assert.ok(derivation.includes("Lane 1"));
        assert.ok(derivation.includes("Lane 2"));
        assert.match(derivation, /same lane|same-lane|target lane/i);
      }
      if (isSubsetQuestion(question)) {
        subsetQuestions += 1;
        const derivation = enhanced.explanationV3.derivation.join(" ");
        assert.match(derivation, /vowel steps|consonant steps/);
        assert.match(derivation, /\\text\{vowel |\\text\{consonant /);
      }

      checkpoints.add(question.checkpointId);
      tasks.add(question.taskKind);
      generated += 1;
    }
  }
}

auditSuite("SER-CP-001", SER_CP001_TEMPORARY_TEMPLATE_IDS, generateSerCp001Question);
auditSuite("SER-CP-002", SER_CP002_TEMPORARY_TEMPLATE_IDS, generateSerCp002Question);
auditSuite("SER-CP-003", SER_CP003_TEMPORARY_TEMPLATE_IDS, generateSerCp003Question);
auditSuite("SER-CP-004", SER_CP004_TEMPORARY_TEMPLATE_IDS, generateSerCp004Question);
auditSuite("SER-CP-005", SER_CP005_TEMPORARY_TEMPLATE_IDS, generateSerCp005Question);
auditSuite("SER-CP-006", SER_CP006_TEMPORARY_TEMPLATE_IDS, generateSerCp006Question);

assert.deepEqual([...checkpoints].sort(), [
  "SER-CP-001",
  "SER-CP-002",
  "SER-CP-003",
  "SER-CP-004",
  "SER-CP-005",
  "SER-CP-006",
]);
assert.deepEqual([...tasks].sort(), ["MISSING_TERM", "NEXT_TERM", "PREVIOUS_TERM", "WRONG_TERM"]);
assert.ok(previousQuestions > 0);
assert.ok(wrongQuestions > 0);
assert.ok(alphabeticQuestions > 0);
assert.ok(laneQuestions > 0);
assert.ok(subsetQuestions > 0);

console.log(JSON.stringify({
  status: "PASS_SER_V3_NATURAL_ALL_CHECKPOINTS",
  standardId: SER_V3_NATURAL_STANDARD_ID,
  generated,
  checkpoints: [...checkpoints].sort(),
  tasks: [...tasks].sort(),
  previousQuestions,
  wrongQuestions,
  alphabeticQuestions,
  laneQuestions,
  subsetQuestions,
  sourceQuestionMutations: 0,
  nextCheckpointStatus: "BLOCKED_UNTIL_CP006_USER_APPROVAL",
}, null, 2));
