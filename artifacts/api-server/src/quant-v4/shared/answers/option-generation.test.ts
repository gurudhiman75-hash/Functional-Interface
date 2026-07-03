import assert from "node:assert/strict";

import { buildQuantV4AnswerOptions } from "./option-generation";

function normalizeOption(value: string) {
  return value
    .replace(/\$\$/g, "")
    .replace(/\\\\%/g, "%")
    .replace(/\\%/g, "%")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/[.]+$/g, "")
    .trim()
    .toLowerCase();
}

function percentValue(option: string) {
  const match = normalizeOption(option).match(/^(-?[\d,]+(?:\.\d+)?)\s*%$/);
  return match ? Number(match[1]!.replace(/,/g, "")) : null;
}

function assertHealthyOptions(options: readonly string[]) {
  assert.equal(options.length, 4);
  assert.equal(new Set(options.map(normalizeOption)).size, options.length);
  assert.ok(options.every((option) => option.trim().length > 0));
  assert.ok(options.every((option) => !/(?:^|\s)[+-]\s*1$/.test(normalizeOption(option))));
  assert.ok(options.every((option) => !/\$\$[\s\S]*\$\$\s*[+-]?\s*\d+\s*$/.test(option)));
  assert.ok(options.every((option) => !/\b(undefined|null|nan)\b/i.test(option)));
}

function assertExactlyOneCorrect(options: readonly string[], correct: number) {
  assert.ok(correct >= 0 && correct < options.length);
  const correctKey = normalizeOption(options[correct]!);
  assert.equal(options.filter((option) => normalizeOption(option) === correctKey).length, 1);
}

{
  const result = buildQuantV4AnswerOptions("$$75\\%$$", {
    context: {
      taskKind: "complementShare",
      stem: "If 25% of the votes are valid, find the percentage of invalid.",
    },
  });
  assertHealthyOptions(result.options);
  assertExactlyOneCorrect(result.options, result.correct);
  assert.ok(
    result.options.every((option) => {
      const value = percentValue(option);
      return value === null || (value >= 0 && value <= 100);
    }),
  );
}

{
  const result = buildQuantV4AnswerOptions("$$41.6667\\%$$", {
    context: {
      taskKind: "newGroupShare",
      stem: "In a survey of 1000 respondents, 40% are yes responses. If the numbers of yes responses and no responses increase by 20% and 12% respectively, find the new percentage of yes responses.",
    },
  });
  assertHealthyOptions(result.options);
  assertExactlyOneCorrect(result.options, result.correct);
  assert.ok(
    result.options.every((option) => {
      const value = percentValue(option);
      return value === null || (value >= 0 && value <= 100);
    }),
  );
}

{
  const result = buildQuantV4AnswerOptions("$$33.33\\%$$", {
    context: {
      taskKind: "ratioToPercentage",
      stem: "A wildlife reserve divides its recorded animals in the ratio 1:2. Find the percentage of the first part.",
    },
  });
  assertHealthyOptions(result.options);
  assertExactlyOneCorrect(result.options, result.correct);
  assert.ok(
    result.options.every((option) => {
      const value = percentValue(option);
      return value === null || (value >= 0 && value <= 100);
    }),
  );
}

{
  const result = buildQuantV4AnswerOptions("$$300\\%$$", {
    context: {
      taskKind: "lessToMore",
      stem: "Town A is 75% less than Town B. By what percent is Town B more than Town A?",
    },
  });
  assertHealthyOptions(result.options);
  assertExactlyOneCorrect(result.options, result.correct);
  assert.ok(result.options.some((option) => (percentValue(option) ?? 0) > 100));
}

{
  const result = buildQuantV4AnswerOptions("10 percentage points and 25%", {
    context: {
      taskKind: "percentagePointComposite",
      stem: "State both the increase in percentage points and the relative percentage increase.",
    },
  });
  assertHealthyOptions(result.options);
  assertExactlyOneCorrect(result.options, result.correct);
  assert.ok(result.options.every((option) => !/[+-]\s*1\b/.test(option)));
}

{
  const result = buildQuantV4AnswerOptions("Bharat is greater by Rs. 2000.", {
    context: {
      taskKind: "actualComparison",
      stem: "Who earns more in actual amount, and by how much?",
    },
  });
  assertHealthyOptions(result.options);
  assertExactlyOneCorrect(result.options, result.correct);
  assert.ok(result.options.some((option) => /less by/i.test(option)));
  assert.ok(result.options.every((option) => !/[.]{2,}$/.test(option)));
}

{
  const result = buildQuantV4AnswerOptions("$$10\\%$$", {
    existingOptions: ["$$10\\%$$ 1", "10\\% + 1", "-10\\%", "$$10\\%$$"],
    context: {
      taskKind: "boundedShare",
      stem: "If 90% of the seats are booked, find the percentage of vacant.",
    },
  });
  assertHealthyOptions(result.options);
  assertExactlyOneCorrect(result.options, result.correct);
  assert.ok(result.options.every((option) => !/\$\$10\\%\$\$\s*1/.test(option)));
}

{
  const result = buildQuantV4AnswerOptions(800, {
    context: {
      taskKind: "countFromPercentage",
      stem: "Find the number of children in the population.",
    },
  });
  assertHealthyOptions(result.options);
  assertExactlyOneCorrect(result.options, result.correct);
  assert.ok(
    result.options.every((option) => {
      const value = Number(normalizeOption(option));
      return Number.isInteger(value) && value >= 0;
    }),
  );
}

console.info("quant-v4 option-generation smoke passed");
