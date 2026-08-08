import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  compareRationals,
  exactRational,
  rationalToFractionString,
  rationalsEqual,
} from "../foundation/temporal";
import {
  buildClockCp001ReviewExport,
  CLOCK_CP001_ANGLE_MODES,
  CLOCK_CP001_TIME_FRAMES,
  generateClockCp001Question,
  recomputeClockCp001Distractor,
  renderClockCp001ReviewHtml,
  type ClockAngleMode,
  type ClockCp001Difficulty,
  type ClockCp001Question,
  type ClockTimeFrame,
  type SerializedRational,
} from "../topics/Clocks/CLK-001/CP-001/runtime";

function deserializeRational(value: SerializedRational) {
  return exactRational(BigInt(value.numerator), BigInt(value.denominator));
}

function difficultyForProof(
  mode: ClockAngleMode,
  frame: ClockTimeFrame,
  sample: number,
): ClockCp001Difficulty {
  if (mode === "SMALLER_ANGLE" && frame === "DIRECT" && sample % 3 === 0) {
    return "EASY";
  }
  if (
    (mode === "SMALLER_ANGLE" || mode === "REFLEX_ANGLE") &&
    frame !== "BEFORE_SHIFT"
  ) {
    return "MEDIUM";
  }
  return "HARD";
}

function assertLifecycleLocked(question: ClockCp001Question): void {
  assert.equal(question.permanentQlId, null);
  assert.equal(question.lifecycle.contentStatus, "OPEN_DISCOVERY");
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(question.lifecycle.localizationStatus, "NOT_STARTED");
}

function assertQuestion(question: ClockCp001Question): void {
  assert.equal(question.schemaVersion, "1.0");
  assert.equal(question.chapterCode, "CLK-001");
  assert.equal(question.checkpointCode, "CLK-CP-001");
  assert.equal(question.provisionalAuthority, "ANGLE_AT_STATED_TIME");
  assert.equal(question.options.length, 4);
  assert(question.correctOptionIndex >= 0 && question.correctOptionIndex < 4);
  assert.equal(question.solverEvidence.agreement, true);
  assert.equal(
    question.solverEvidence.canonicalAnswer,
    question.solverEvidence.independentAnswer,
  );
  assert.equal(
    question.options.filter((option) => option.isCorrect).length,
    1,
  );
  assert.equal(question.options[question.correctOptionIndex]!.isCorrect, true);
  assert.equal(
    question.options[question.correctOptionIndex]!.semanticKey,
    question.answer.semanticKey,
  );
  assert.equal(
    new Set(question.options.map((option) => option.semanticKey)).size,
    4,
  );
  assert.equal(question.explanation.steps.length >= 3, true);
  assert.equal(question.explanation.steps.length <= 4, true);
  assert.match(question.explanation.strategy, /hour hand/i);
  assert.match(question.explanation.conclusion, /required angle/i);
  assert.doesNotMatch(question.stem, /prototype|solver|metadata|generator/i);
  assert.doesNotMatch(
    `${question.explanation.strategy} ${question.explanation.steps.join(" ")}`,
    /by formula,? answer|option is correct because/i,
  );
  assertLifecycleLocked(question);

  const correctValue = deserializeRational(question.answer.value);
  assert.equal(
    rationalToFractionString(correctValue),
    question.answer.semanticKey,
  );

  for (const option of question.options) {
    const optionValue = deserializeRational(option.value);
    assert.equal(rationalToFractionString(optionValue), option.semanticKey);
    assert(compareRationals(optionValue, 0) >= 0);
    assert(compareRationals(optionValue, 360) < 0);

    if (question.scenario.angleMode === "SMALLER_ANGLE") {
      assert(compareRationals(optionValue, 180) <= 0);
    }
    if (question.scenario.angleMode === "REFLEX_ANGLE") {
      assert(compareRationals(optionValue, 180) >= 0);
    }

    if (!option.isCorrect) {
      assert.notEqual(option.label, "CORRECT");
      assert(option.likelyMistake && option.likelyMistake.length >= 45);
      const recomputed = recomputeClockCp001Distractor(
        option.label as Exclude<typeof option.label, "CORRECT">,
        question.scenario,
      );
      assert.equal(
        rationalsEqual(recomputed, optionValue),
        true,
        `${option.label} was not reproducible for ${question.seed}.`,
      );
      assert.equal(rationalsEqual(recomputed, correctValue), false);
    }
  }
}

let generatedCount = 0;
const answerPositions = [0, 0, 0, 0];
const fingerprints = new Set<string>();
const stems = new Set<string>();
const answers = new Set<string>();
const distractorLabels = new Set<string>();
const modeCounts = new Map<string, number>();
const frameCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();

for (const mode of CLOCK_CP001_ANGLE_MODES) {
  for (const frame of CLOCK_CP001_TIME_FRAMES) {
    for (let sample = 0; sample < 100; sample += 1) {
      const correctOptionIndex = (generatedCount % 4) as 0 | 1 | 2 | 3;
      const input = {
        seed: `CLK-CP001-PROOF-${mode}-${frame}-${sample}`,
        difficulty: difficultyForProof(mode, frame, sample),
        angleMode: mode,
        frame,
        correctOptionIndex,
      } as const;
      const question = generateClockCp001Question(input);
      const repeated = generateClockCp001Question(input);
      assert.deepEqual(repeated, question);
      assertQuestion(question);

      answerPositions[question.correctOptionIndex] += 1;
      fingerprints.add(question.fingerprint);
      stems.add(question.stem);
      answers.add(question.answer.semanticKey);
      for (const option of question.options) {
        if (!option.isCorrect) {
          distractorLabels.add(option.label);
        }
      }
      modeCounts.set(mode, (modeCounts.get(mode) ?? 0) + 1);
      frameCounts.set(frame, (frameCounts.get(frame) ?? 0) + 1);
      difficultyCounts.set(
        question.difficulty,
        (difficultyCounts.get(question.difficulty) ?? 0) + 1,
      );
      generatedCount += 1;
    }
  }
}

assert.equal(generatedCount, 1_200);
assert.deepEqual(answerPositions, [300, 300, 300, 300]);
assert.equal(fingerprints.size >= 1_050, true, `Only ${fingerprints.size} fingerprints.`);
assert.equal(stems.size >= 900, true, `Only ${stems.size} distinct stems.`);
assert.equal(answers.size >= 150, true, `Only ${answers.size} distinct answers.`);
assert.equal(distractorLabels.size >= 9, true);
assert.deepEqual([...modeCounts.values()], [300, 300, 300, 300]);
assert.deepEqual([...frameCounts.values()], [400, 400, 400]);
assert((difficultyCounts.get("EASY") ?? 0) > 0);
assert((difficultyCounts.get("MEDIUM") ?? 0) > 0);
assert((difficultyCounts.get("HARD") ?? 0) > 0);

const review = buildClockCp001ReviewExport();
assert.equal(review.schemaVersion, "1.0");
assert.equal(review.questionCount, 24);
assert.equal(review.rows.length, 24);
assert.equal(
  new Set(review.rows.map((row) => row.question.fingerprint)).size,
  24,
);
assert.deepEqual(
  review.rows.reduce(
    (counts, row) => {
      counts[row.question.correctOptionIndex] += 1;
      return counts;
    },
    [0, 0, 0, 0],
  ),
  [6, 6, 6, 6],
);
assert(
  review.rows.every(
    (row) =>
      row.targetClockSvg.startsWith("<svg ") &&
      row.targetClockSvg.includes('role="img"') &&
      !/<script|foreignObject|javascript:/i.test(row.targetClockSvg),
  ),
);

const reviewHtml = renderClockCp001ReviewHtml(review);
assert.match(reviewHtml, /CLK-CP-001 — Angle at a Stated Time/);
assert.equal((reviewHtml.match(/class="question"/g) ?? []).length, 24);
assert.doesNotMatch(reviewHtml, /<script|javascript:/i);

mkdirSync("dist/reasoning-v1/clock", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/clock/clk-cp001-editorial-review.json",
  `${JSON.stringify(review, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/clock/clk-cp001-editorial-review.html",
  reviewHtml,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      status: "PASS_CLK_CP001_ANGLE_AT_STATED_TIME_OPEN_DISCOVERY",
      generatedCount,
      prototypes: CLOCK_CP001_ANGLE_MODES.length * CLOCK_CP001_TIME_FRAMES.length,
      modeCounts: Object.fromEntries(modeCounts),
      frameCounts: Object.fromEntries(frameCounts),
      difficultyCounts: Object.fromEntries(difficultyCounts),
      answerPositions,
      distinctFingerprints: fingerprints.size,
      distinctStems: stems.size,
      distinctAnswers: answers.size,
      distractorLabels: [...distractorLabels].sort(),
      editorialReviewQuestions: review.questionCount,
      lifecycle: {
        permanentQlCount: 0,
        questionStudioDiscoverable: false,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
      },
    },
    null,
    2,
  ),
);
