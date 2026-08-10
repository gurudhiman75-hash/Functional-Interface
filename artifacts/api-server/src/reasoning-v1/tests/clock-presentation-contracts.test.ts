import assert from "node:assert/strict";
import {
  CLOCK_TASK_CATALOG,
  generateClockQuestion,
} from "../topics/Clocks/CLK-001/runtime";

const unpaddedFractionalSecond = /:\d \d+\/\d+/;
const singularPluralMismatch = /\b1 (?:seconds|minutes|hours)\b/;
const internalZeroDayLabel = /\(day \+0\)/;
const awkwardAllTimesPhrase = /\b(?:At|at|What|what) what? all times\b|\b(?:At|at|What|what) all times\b/;
const duplicateAmPmPunctuation = /\b[ap]\.m\.\.+/i;

function expectedOrdinalSuffix(value: number): "st" | "nd" | "rd" | "th" {
  const lastTwo = Math.abs(value) % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return "th";
  switch (Math.abs(value) % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

function assertOrdinalsAreWellFormed(visibleText: string): void {
  for (const match of visibleText.matchAll(/\b(\d+)(st|nd|rd|th)\b/g)) {
    const value = Number(match[1]);
    assert.equal(
      match[2],
      expectedOrdinalSuffix(value),
      `Malformed ordinal ${match[0]}.`,
    );
  }
}

let generated = 0;
for (let taskIndex = 0; taskIndex < CLOCK_TASK_CATALOG.length; taskIndex += 1) {
  const [taskId] = CLOCK_TASK_CATALOG[taskIndex]!;
  for (let seedIndex = 0; seedIndex < 50; seedIndex += 1) {
    const question = generateClockQuestion({
      taskId,
      seed: `CLK-PRESENTATION-${taskIndex}-${seedIndex}`,
      locale: "en-IN",
      correctOptionIndex: (seedIndex % 4) as 0 | 1 | 2 | 3,
    });
    const visibleText = [
      question.stem,
      question.answer.display,
      ...question.options.map((option) => option.display),
      question.explanation.given,
      question.explanation.rule,
      ...question.explanation.working,
      question.explanation.validityCheck,
      question.explanation.closestTrap,
      question.explanation.answer,
    ].join("\n");

    assertOrdinalsAreWellFormed(visibleText);
    assert.doesNotMatch(visibleText, unpaddedFractionalSecond);
    assert.doesNotMatch(visibleText, singularPluralMismatch);
    assert.doesNotMatch(visibleText, internalZeroDayLabel);
    assert.doesNotMatch(visibleText, awkwardAllTimesPhrase);
    assert.doesNotMatch(visibleText, duplicateAmPmPunctuation);
    assert.doesNotMatch(question.stem, /<svg|<script|foreignObject|javascript:/i);
    generated += 1;
  }
}

assert.equal(generated, CLOCK_TASK_CATALOG.length * 50);
console.log(JSON.stringify({
  status: "PASS_CLK_001_PRESENTATION_CONTRACTS",
  generated,
  malformedOrdinals: 0,
  unpaddedFractionalSeconds: 0,
  singularPluralMismatches: 0,
  internalZeroDayLabels: 0,
  awkwardAllTimesPhrases: 0,
  duplicateAmPmPunctuation: 0,
}, null, 2));
