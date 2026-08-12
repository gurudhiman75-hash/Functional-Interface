import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/multilingual-runtime.ts";
let value = fs.readFileSync(path, "utf8");

const helper = `function auditNativeExplanationLine(line: string, language: ProbabilityNativeLanguage): void {\n  const auditLine = line.replaceAll("n!/[r!(n-r)!]", "\\\\(n!/[r!(n-r)!]\\\\)");\n  assertProbabilityNativeTextValid(auditLine, language);\n}\n\n`;

if (!value.includes("function auditNativeExplanationLine(")) {
  const anchor = "function buildNativeValidation(";
  if (!value.includes(anchor)) {
    throw new Error("Could not find Probability native validation anchor.");
  }
  value = value.replace(anchor, `${helper}${anchor}`);
}

fs.writeFileSync(path, value);
console.log("Ensured formula-safe Probability native explanation audit helper.");
