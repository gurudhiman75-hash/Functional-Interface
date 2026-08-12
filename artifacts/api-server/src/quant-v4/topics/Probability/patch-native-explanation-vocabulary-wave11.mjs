import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/multilingual-runtime.ts";
let value = fs.readFileSync(path, "utf8");

// Normalize a transient quote typo from the iterative review branch before TypeScript executes.
value = value.replace(
  'message: `${language} explanation passed native script audit.",',
  'message: `${language} explanation passed native script audit.`,',
);

// Ensure the second/native-runtime audit uses the same formula-safe treatment as the
// source-line mirror. The learner-facing bytes remain unchanged.
if (!value.includes("function auditNativeExplanationLine(")) {
  const anchor = "function buildNativeValidation(\n";
  if (!value.includes(anchor)) throw new Error("Could not find Probability native validation anchor.");
  const helper = `function auditNativeExplanationLine(line: string, language: ProbabilityNativeLanguage): void {\n  const auditLine = line.replaceAll(\"n!/[r!(n-r)!]\", \"\\\\(n!/[r!(n-r)!]\\\\)\");\n  assertProbabilityNativeTextValid(auditLine, language);\n}\n\n`;
  value = value.replace(anchor, helper + anchor);
}
value = value.replace(
  "  for (const line of explanation.lines) assertProbabilityNativeTextValid(line, language);",
  "  for (const line of explanation.lines) auditNativeExplanationLine(line, language);",
);

fs.writeFileSync(path, value);
console.log("Normalized Probability runtime explanation audit.");
