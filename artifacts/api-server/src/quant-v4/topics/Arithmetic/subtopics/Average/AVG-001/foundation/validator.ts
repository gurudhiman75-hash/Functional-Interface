import { equals, isInteger } from "./math";
import { getAvg001QuestionEntry } from "./library";
import type {
  Avg001QuestionPackage,
  Avg001ValidationCheck,
} from "./types";

export function validateAvg001QuestionPackage(
  pkg: Omit<Avg001QuestionPackage, "validation">,
) {
  const checks: Avg001ValidationCheck[] = [];
  const add = (name: string, passed: boolean, message: string) => {
    checks.push({ name, passed, message });
  };

  const entry = getAvg001QuestionEntry(pkg.questionLanguageId);
  add("language", pkg.language === "en", "Runtime proof is English only");
  add(
    "ql-contract",
    entry.solveMode === pkg.solveMode &&
      entry.cpId === pkg.canonicalProblemId,
    "QL metadata matches runtime package",
  );
  add(
    "resolved-stem",
    !/[{}]|undefined|NaN|Infinity|null/.test(pkg.stem),
    "Stem has no unresolved/internal values",
  );
  add(
    "independent-verifier",
    pkg.independentVerification.supported &&
      equals(
        pkg.solver.exactAnswer,
        pkg.independentVerification.exactAnswer,
      ) &&
      pkg.answer === pkg.independentVerification.displayAnswer,
    "Independent verifier agrees exactly",
  );
  add(
    "four-options",
    pkg.options.length === 4,
    "Exactly four options are required",
  );
  add(
    "unique-options",
    new Set(pkg.options.map((value) => value.trim())).size === 4,
    "Options are unique after normalization",
  );
  add(
    "correct-index",
    pkg.correctIndex >= 0 &&
      pkg.correctIndex < 4 &&
      pkg.options[pkg.correctIndex] === pkg.answer,
    "Correct index points to canonical answer",
  );
  add(
    "answer-once",
    pkg.options.filter((value) => value === pkg.answer).length === 1,
    "Canonical answer appears exactly once",
  );
  add(
    "count-semantics",
    pkg.parameters.answerType !== "COUNT" ||
      (isInteger(pkg.solver.exactAnswer) &&
        pkg.solver.exactAnswer.numerator > 0),
    "Count answers are positive integers",
  );

  const minimumExplanationLines =
    pkg.canonicalProblemId === "AVG-CP-005"
      ? 4
      : pkg.difficultyBand === "Easy"
        ? 4
        : 5;
  add(
    "explanation-depth",
    pkg.explanation.lines.length >= minimumExplanationLines &&
      pkg.explanation.lines.length <= 8,
    `Explanation contains ${minimumExplanationLines}–8 meaningful moves`,
  );
  add(
    "explanation-arithmetic",
    pkg.explanation.lines.some(
      (line) =>
        line.includes("\\times") ||
        line.includes("\\div") ||
        /[+\-]=?/.test(line),
    ),
    "Explanation contains substituted arithmetic",
  );
  add(
    "explanation-answer",
    pkg.explanation.lines.some((line) => line.includes(pkg.answer)),
    "Explanation contains the final answer",
  );
  add(
    "maturity",
    pkg.maturity === "RUNTIME_PROOF" && !pkg.publiclyPublishable,
    "Runtime proof is not marked publicly publishable",
  );

  return {
    valid: checks.every((item) => item.passed),
    checks,
  };
}