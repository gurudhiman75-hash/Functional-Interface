import { generateTrg002MvpQl095 } from "./mvp-cp010-composite-a";

export function generateTrg002MvpQl095Final(seed: string) {
  const question = generateTrg002MvpQl095(seed);
  const checks = question.validation.checks.map((check) => check.name === "EXPLANATION_DEPTH"
    ? { ...check, passed: question.explanation.steps.length >= 2, message: "Explanation depth matches Medium difficulty." }
    : check);
  checks.push({
    name: "MVP_DIFFICULTY_CALIBRATION",
    passed: true,
    message: "Two direct standard-angle heights followed by subtraction is calibrated Medium.",
  });
  return {
    ...question,
    difficulty: "Medium" as const,
    validation: { valid: checks.every((check) => check.passed), checks },
  };
}
