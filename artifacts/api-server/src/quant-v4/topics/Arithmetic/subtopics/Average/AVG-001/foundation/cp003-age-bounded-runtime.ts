import { runAvg001Cp003Pipeline as runBaseCp003Pipeline } from "./cp003-distractor-runtime";
import { toNumber } from "./math";
import type {
  Avg001Language,
  Avg001QuestionPackage,
} from "./types";

const MIN_JOINING_AGE = 1;
const MAX_JOINING_AGE = 12;

function hash(value: string) {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function isJoiningAgeScenario(pkg: Avg001QuestionPackage) {
  return [
    "familyAgeElapsedTime",
    "newbornAfterElapsedYears",
    "findChildAgeAfterYears",
  ].includes(pkg.parameters.scenarioVariant);
}

function requiresBoundedJoiningAge(pkg: Avg001QuestionPackage) {
  return isJoiningAgeScenario(pkg) && pkg.parameters.answerType === "MEMBER_VALUE";
}

function normalizeElapsedYearAliases(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const values = pkg.parameters.values as Record<string, unknown>;
  const renderVariables = pkg.parameters.renderVariables as Record<
    string,
    string | number
  >;
  const elapsedYears = values.elapsedYears ?? values.yearsElapsed ?? 0;
  const renderedElapsedYears =
    renderVariables.elapsedYears ?? renderVariables.yearsElapsed ?? Number(elapsedYears);

  return {
    ...pkg,
    parameters: {
      ...pkg.parameters,
      values: {
        ...pkg.parameters.values,
        elapsedYears,
        yearsElapsed: elapsedYears,
      },
      renderVariables: {
        ...pkg.parameters.renderVariables,
        elapsedYears: renderedElapsedYears,
        yearsElapsed: renderedElapsedYears,
      },
    },
  };
}

function normalizeExternalIdentity(
  pkg: Avg001QuestionPackage,
  requestedSeed: string,
): Avg001QuestionPackage {
  if (pkg.seed === requestedSeed && pkg.parameters.seed === requestedSeed) {
    return pkg;
  }
  return {
    ...pkg,
    seed: requestedSeed,
    questionId: `AVG-001:${pkg.questionLanguageId}:${requestedSeed}`,
    parameters: {
      ...pkg.parameters,
      seed: requestedSeed,
    },
  };
}

function rebuildJoiningAgeOptions(
  pkg: Avg001QuestionPackage,
  requestedSeed: string,
): Avg001QuestionPackage {
  if (!requiresBoundedJoiningAge(pkg)) {
    return pkg;
  }

  const answer = Number(pkg.answer);
  const elapsedYears = Number(pkg.parameters.values.elapsedYears ?? 0);
  const candidates = [
    answer,
    answer - elapsedYears,
    answer + elapsedYears,
    answer - elapsedYears - 1,
    answer + elapsedYears + 1,
    answer - 1,
    answer + 1,
    answer - 2,
    answer + 2,
  ];
  const unique = candidates
    .filter(
      (value, index, values) =>
        Number.isInteger(value) &&
        value >= MIN_JOINING_AGE &&
        value <= MAX_JOINING_AGE &&
        values.indexOf(value) === index,
    )
    .map(String);

  if (unique.length < 4 || !unique.includes(pkg.answer)) {
    throw new Error(
      `Unable to build four realistic joining-age options for ${pkg.questionLanguageId}`,
    );
  }

  const options = unique.slice(0, 4);
  const shift = hash(`${requestedSeed}:joining-age-options`) % options.length;
  for (let index = 0; index < shift; index += 1) {
    options.push(options.shift()!);
  }
  const correctIndex = options.indexOf(pkg.answer);

  const retainedChecks = pkg.validation.checks.filter(
    (check) =>
      check.name !== "options" &&
      check.name !== "correct" &&
      check.name !== "misconception-options" &&
      check.name !== "context-realistic-options",
  );
  const replacementChecks = [
    {
      name: "options",
      passed: options.length === 4 && new Set(options).size === 4,
      message: "Four unique joining-age options",
    },
    {
      name: "correct",
      passed: options[correctIndex] === pkg.answer,
      message: "Correct index resolves joining age",
    },
    {
      name: "misconception-options",
      passed: options.filter((option) => option !== pkg.answer).length === 3,
      message: "Three elapsed-year/count misconception distractors",
    },
    {
      name: "context-realistic-options",
      passed: options.every((option) => {
        const value = Number(option);
        return value >= MIN_JOINING_AGE && value <= MAX_JOINING_AGE;
      }),
      message: "Every joining-age option is between 1 and 12 years",
    },
  ];
  const checks = [...retainedChecks, ...replacementChecks];
  const validation = {
    valid: checks.every((check) => check.passed),
    checks,
  };
  if (!validation.valid) {
    throw new Error(
      validation.checks
        .filter((check) => !check.passed)
        .map((check) => `${check.name}: ${check.message}`)
        .join("\n"),
    );
  }

  return {
    ...pkg,
    options,
    correctIndex,
    validation,
  };
}

export function runAvg001Cp003Pipeline(input: {
  questionLanguageId: string;
  seed: string;
  language: Avg001Language;
}): Avg001QuestionPackage {
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const generatedSeed =
      attempt === 0 ? input.seed : `${input.seed}:joining-age:${attempt}`;
    const candidate = normalizeElapsedYearAliases(
      runBaseCp003Pipeline({
        ...input,
        seed: generatedSeed,
      }),
    );

    if (requiresBoundedJoiningAge(candidate)) {
      const joiningAge = candidate.parameters.values.addedValue;
      if (joiningAge === undefined || joiningAge === null) {
        throw new Error(`Missing joining age for ${candidate.questionLanguageId}`);
      }
      const age = toNumber(joiningAge);
      if (age < MIN_JOINING_AGE || age > MAX_JOINING_AGE) {
        continue;
      }
    }

    const normalized = normalizeExternalIdentity(candidate, input.seed);
    return rebuildJoiningAgeOptions(normalized, input.seed);
  }

  throw new Error(
    `Unable to construct a 1–12 joining age for ${input.questionLanguageId}`,
  );
}