import { strict as assert } from "node:assert";
import { COM002_EDITORIAL_TARGET_FACTS, getCom002EditorialDecision } from "./com002-editorial-review";
import { generateCom002ReviewQuestionV2 } from "./com002-review-synthesis-v2";

const qlIds = Array.from({ length: 13 }, (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`);
const targetIds = new Set(COM002_EDITORIAL_TARGET_FACTS.map((fact) => fact.factId));
let questionCount = 0;

for (const qlId of qlIds) {
  const stems = new Set<string>();
  const targets = new Set<string>();
  const surfaces = new Set<string>();
  const answerPositions = new Set<number>();
  const answers = new Set<string>();

  for (let index = 0; index < 40; index += 1) {
    const seed = `com002-review-audit:${qlId}:${index}`;
    const first = generateCom002ReviewQuestionV2({ qlId, seed });
    const replay = generateCom002ReviewQuestionV2({ qlId, seed });
    questionCount += 1;

    assert.deepEqual(replay, first, `${qlId} seed ${index} is not deterministic`);
    assert.equal(first.qlId, qlId);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4, `${first.questionId} has duplicate options`);
    assert.equal(first.correctIndex >= 0 && first.correctIndex < 4, true);
    assert.equal(first.options[first.correctIndex], first.canonicalAnswer);
    assert.equal(first.stem.trim().length > 10, true);
    assert.equal(first.explanation.trim().length > 10, true);
    assert.equal(first.reviewOnly, true);
    assert.equal(first.runtimeRegistered, false);
    assert.equal(first.sourceIds.length > 0, true);
    assert.equal(first.sourceFactIds.length > 0, true);
    assert.equal(/canonical fact|distractor pool|review metadata|solver authority|this ql/i.test(`${first.stem} ${first.explanation}`), false, `${first.questionId} leaks internal language`);
    assert.equal(/is used to (?:helps|provides|shows|manages|accepts)|component core component|kernel core component/i.test(`${first.stem} ${first.explanation}`), false, `${first.questionId} contains known grammar regression`);
    assert.equal(/classified here as/i.test(`${first.stem} ${first.explanation}`), false, `${first.questionId} contains internal-sounding classification language`);

    if (qlId === "COM-002-QL-013") {
      assert.equal(first.targetFactId, null);
      assert.equal(first.solverAuthority, "KNOWLEDGE_COMPOSITION_VERIFIER");
      assert.match(first.stem, /I\./);
      assert.match(first.stem, /IV\./);
    } else {
      assert.equal(typeof first.targetFactId, "string");
      assert.equal(targetIds.has(first.targetFactId!), true, `${first.questionId} targets a non-target editorial fact`);
      assert.equal(getCom002EditorialDecision(first.targetFactId!)?.usage, "TARGET_AND_DISTRACTOR");
      targets.add(first.targetFactId!);
    }

    if (qlId === "COM-002-QL-002" && first.surfaceMode === "ATTRIBUTE_TO_OS") {
      const stemOpen = /open-source/i.test(first.stem);
      const stemProp = /proprietary/i.test(first.stem);
      assert.equal(/classified as/i.test(first.stem), false, `${first.questionId} keeps avoidable classification wording in the learner stem`);
      if (stemOpen) assert.equal(first.options.some((option) => option !== first.canonicalAnswer && /^(Ubuntu|Linux|Android)/i.test(option)), false, `${first.questionId} uses another open-source OS as a wrong option`);
      if (stemProp) assert.equal(first.options.some((option) => option !== first.canonicalAnswer && /^(macOS|iOS)/i.test(option)), false, `${first.questionId} uses another proprietary OS as a wrong option`);
    }
    if (qlId === "COM-002-QL-007" && first.surfaceMode === "COMPONENT_TO_FUNCTION") {
      assert.equal(first.options.some((option) => /^(?:provides|shows|helps|manages|accepts|uses|allows|displays|opens)\b/i.test(option)), false, `${first.questionId} mixes finite-verb and base-verb function options`);
    }
    if (qlId === "COM-002-QL-009" && first.surfaceMode === "TYPE_TO_EXTENSION") {
      assert.equal(/JPEG image file/i.test(first.stem), false, `${first.questionId} creates ambiguous JPEG reverse mapping`);
      assert.equal(first.options.includes(".jpg") && first.options.includes(".jpeg"), false, `${first.questionId} puts JPEG aliases in competition`);
    }
    if (qlId === "COM-002-QL-011") {
      assert.equal(first.sourceFactIds.includes("com002-nonlocal-delete-caveat"), false, `${first.questionId} exposes validator-only deletion caveat as target provenance`);
    }

    stems.add(first.stem);
    surfaces.add(first.surfaceMode);
    answerPositions.add(first.correctIndex);
    answers.add(first.canonicalAnswer);
  }

  assert.equal(stems.size >= 3, true, `${qlId} has thin stem diversity: ${stems.size}`);
  assert.equal(answerPositions.size >= 3, true, `${qlId} has thin answer-position spread: ${[...answerPositions]}`);
  assert.equal(answers.size >= 2, true, `${qlId} has thin answer/object diversity: ${answers.size}`);
  if (qlId !== "COM-002-QL-013") assert.equal(targets.size >= 2, true, `${qlId} targets too few facts: ${targets.size}`);
  if (!["COM-002-QL-011", "COM-002-QL-013"].includes(qlId)) {
    assert.equal(surfaces.size >= 2, true, `${qlId} has thin solve-mode coverage: ${[...surfaces]}`);
  }
}

const q03 = generateCom002ReviewQuestionV2({ qlId: "COM-002-QL-002", seed: "human-review-wave1:COM-002-QL-002:A" });
assert.equal(q03.explanation, "Ubuntu Desktop is an open-source operating system.");

const q04 = generateCom002ReviewQuestionV2({ qlId: "COM-002-QL-002", seed: "human-review-wave1:COM-002-QL-002:B" });
assert.equal(q04.stem, "Which of the following is a proprietary mobile operating system?");

const q13 = generateCom002ReviewQuestionV2({ qlId: "COM-002-QL-007", seed: "human-review-wave1:COM-002-QL-007:A" });
assert.equal(q13.stem, "Which part of the Windows taskbar displays system-status icons and notification-related features?");

const q14 = generateCom002ReviewQuestionV2({ qlId: "COM-002-QL-007", seed: "human-review-wave1:COM-002-QL-007:B" });
assert.equal(q14.canonicalAnswer, "provide access to apps, settings, files and search");
assert.equal(q14.options.some((option) => /^(?:provides|shows|helps)\b/i.test(option)), false);

assert.equal(questionCount, 520);
console.log(`[com002-review-synthesis-v2] PASS questions=${questionCount}`);
