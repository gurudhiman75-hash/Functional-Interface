export * from "./foundation";

import {
  generateSerCp007WaveBQuestion as generateBaseQuestion,
  type SerCp007WaveBQuestion,
  type SerCp007WaveBTemporaryTemplateId,
} from "./foundation";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function prefixFor(seed: number, templateId: string): string {
  const templateNumber = Number(templateId.slice(-3));
  const length = 1 + ((seed + templateNumber) % 2);
  const start = (seed * 7 + templateNumber * 11) % 26;
  const step = 1 + ((seed + templateNumber) % 5);
  return Array.from(
    { length },
    (_, index) => ALPHABET[(start + index * step) % 26]!,
  ).join("");
}

function stemFor(
  taskKind: SerCp007WaveBQuestion["taskKind"],
  sequence: readonly (string | null)[],
): string {
  const rendered = sequence.map((term) => term ?? "?").join(", ");
  switch (taskKind) {
    case "NEXT_TERM":
      return `Which letter group should come next?\n${rendered}, ?`;
    case "MISSING_TERM":
      return `Which letter group should replace the question mark?\n${rendered}`;
    case "PREVIOUS_TERM":
      return `Which letter group should come immediately before the given series?\n?, ${rendered}`;
    case "WRONG_TERM":
      return `Which letter group should replace the incorrectly placed group?\n${rendered}`;
    case "FILL_GAP_GROUPS":
      return sequence.join(" ");
  }
}

function expandPrefixQuestion(
  question: SerCp007WaveBQuestion,
): SerCp007WaveBQuestion {
  if (question.sourceRuleId !== "CUMULATIVE_PREFIX_GROWTH") return question;

  const fixedPrefix = prefixFor(question.seed, question.temporaryTemplateId);
  const addPrefix = (value: string): string => fixedPrefix + value;
  const canonicalTerms = question.hiddenState.canonicalTerms.map(addPrefix);
  const sequence = question.sequence.map((term) =>
    term === null ? null : addPrefix(term),
  );
  const correctAnswer = addPrefix(question.correctAnswer);
  const options = question.options.map(addPrefix);
  const displayedWrongTerm = question.hiddenState.displayedWrongTerm
    ? addPrefix(question.hiddenState.displayedWrongTerm)
    : null;

  const normalSteps = canonicalTerms.slice(0, -1).map(
    (term, index) =>
      `${term} + ${canonicalTerms[index + 1]!.at(-1)} = ${canonicalTerms[index + 1]}`,
  );
  const steps =
    question.taskKind === "WRONG_TERM"
      ? [
          `First write the correct series: ${canonicalTerms.slice(0, 7).join(", ")}.`,
          ...normalSteps.slice(0, 4),
        ]
      : question.taskKind === "PREVIOUS_TERM"
        ? [
            `First check the shown groups: ${canonicalTerms.slice(1, 5).join(", ")}.`,
            `Now move one step backward using the same rule.`,
            ...normalSteps.slice(0, 3),
          ]
        : normalSteps;

  const conclusion =
    question.taskKind === "WRONG_TERM"
      ? `${displayedWrongTerm} is wrong at that place. It should be ${correctAnswer}.`
      : `Therefore, the answer is ${correctAnswer}.`;

  return {
    ...question,
    stem: stemFor(question.taskKind, sequence),
    sequence,
    options,
    correctAnswer,
    mathematicalFingerprint: `${question.mathematicalFingerprint}|fixed-prefix:${fixedPrefix}`,
    explanation: {
      ...question.explanation,
      rule: `Keep the fixed beginning ${fixedPrefix}. After it, keep the existing group and add the next letter of the same sequence at the end.`,
      steps,
      quickMethod: `Ignore the fixed beginning ${fixedPrefix} and compare how the remaining part grows by one letter.`,
      commonMistake: `Do not change the fixed beginning ${fixedPrefix}; only one new letter is added at the end.`,
      conclusion,
    },
    hiddenState: {
      ...question.hiddenState,
      parameterKey: `${question.hiddenState.parameterKey}|fixed-prefix:${fixedPrefix}`,
      canonicalTerms,
      displayedWrongTerm,
    },
  };
}

export function generateSerCp007WaveBQuestion(
  temporaryTemplateId: SerCp007WaveBTemporaryTemplateId,
  seed: number,
): SerCp007WaveBQuestion {
  return expandPrefixQuestion(
    generateBaseQuestion(temporaryTemplateId, seed),
  );
}
