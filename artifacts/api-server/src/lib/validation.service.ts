export type ValidationInput = {
  questionText: string;
  options: string[];
  correctAnswer: string;
};

export type ValidationResult = {
  valid: boolean;
  score: number;
  issues: string[];
};

const MIN_QUESTION_LEN = 10;
const MAX_QUESTION_LEN = 600;

export function validateQuestion(input: ValidationInput): ValidationResult {
  const issues: string[] = [];
  let score = 100;

  const len = input.questionText.trim().length;
  if (len < MIN_QUESTION_LEN) {
    issues.push(`Question too short (${len} chars)`);
    score -= 30;
  }
  if (len > MAX_QUESTION_LEN) {
    issues.push(`Question too long (${len} chars)`);
    score -= 10;
  }

  if (/\{\{[^}]+\}\}/.test(input.questionText)) {
    issues.push("Question contains unsubstituted placeholders");
    score -= 40;
  }

  if (input.options.length !== 4) {
    issues.push(`Expected 4 options, got ${input.options.length}`);
    score -= 30;
  }
  const uniqueOptions = new Set(input.options.map((option) => option.trim()));
  if (uniqueOptions.size !== input.options.length) {
    issues.push("Duplicate options");
    score -= 25;
  }
  if (input.options.some((option) => !option || !option.trim())) {
    issues.push("Empty option found");
    score -= 20;
  }

  if (!input.options.includes(input.correctAnswer)) {
    issues.push("Correct answer not present in options");
    score -= 50;
  }

  if (!/[?.:]$/.test(input.questionText.trim())) {
    issues.push("Question should end with punctuation");
    score -= 5;
  }

  score = Math.max(0, score);
  return {
    valid: issues.length === 0 && score >= 70,
    score,
    issues,
  };
}
