import { NUM_CP001_PERMANENT_QL_IDS } from "./permanent/allocation";
import { runNumCp001QuestionStudioReview } from "./question-studio-review-release";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const languages = ["en", "hi", "pa"] as const;
const rawPatterns = [
  { name: "assignment", re: /\b(?:[A-D]|x|n|b|p|q|r|m)\s*=/u },
  { name: "inequality", re: /(?:-?\d+(?:\.\d+)?|\b[xnbpqrma]\b)\s*(?:<|>|≤|≥)\s*(?:-?\d+(?:\.\d+)?|\b[xnbpqrma]\b)/u },
  { name: "interval", re: /[[(]\s*(?:-?\d+(?:\.\d+)?|[a-z])\s*,\s*(?:-?\d+(?:\.\d+)?|[a-z])\s*[\])]/u },
  { name: "arithmetic-working", re: /-?\d+(?:\.\d+)?\s*[+\-−×÷]\s*\(?-?\d+(?:\.\d+)?\)?\s*=\s*-?\d+(?:\.\d+)?/u },
  { name: "integer-list", re: /(?<![\w\\])-?\d+(?:\s*,\s*-?\d+){2,}(?![\w])/u },
  { name: "distance-symbol", re: /\bAB\b/u },
  { name: "bare-variable", re: /\b(?:x|n|b|p|q|r|m)\b/u },
  { name: "unicode-math", re: /[√²³]/u },
];

function withoutLatex(value: string): string {
  return value.replace(/\\\(.*?\\\)/gu, "");
}

let questions = 0;
const violations: string[] = [];

for (const language of languages) {
  for (const qlId of NUM_CP001_PERMANENT_QL_IDS) {
    for (let variant = 1; variant <= 4; variant += 1) {
      const question = runNumCp001QuestionStudioReview({
        questionLanguageId: qlId,
        language,
        seed: `cp001-latex-audit:${language}:${qlId}:${variant}`,
      }) as any;
      questions += 1;
      const learnerParts = [question.stem, ...question.options, ...(question.explanation?.lines ?? [])].map(String);
      for (const [index, part] of learnerParts.entries()) {
        assert(!/\\\([^\n]*\\\(/u.test(part), `${language}/${qlId}/${variant}/${index}: nested LaTeX delimiter`);
        const raw = withoutLatex(part);
        for (const pattern of rawPatterns) {
          if (pattern.re.test(raw)) violations.push(`${language}/${qlId}/${variant}/${index}:${pattern.name}:${raw}`);
        }
      }
    }
  }
}

assert(questions === 252, `LaTeX audit question count: ${questions}`);
assert(violations.length === 0, `Raw learner math remains:\n${violations.slice(0, 20).join("\n")}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_EDITORIAL_V2_LATEX_AUDIT",
  questions,
  languages,
  permanentQlCount: NUM_CP001_PERMANENT_QL_IDS.length,
  rawMathViolations: violations.length,
}, null, 2));
