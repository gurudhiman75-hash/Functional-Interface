import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-mirror.ts";
let value = fs.readFileSync(path, "utf8");

const importLine = 'import { naturalizeProbabilityExplanationBody } from "./native-source-explanation-naturalizer";';
if (!value.includes(importLine)) {
  const anchor = 'import type { ProbabilityQuestion } from "./types";';
  if (!value.includes(anchor)) throw new Error("Could not find Probability source mirror import anchor.");
  value = value.replace(anchor, `${anchor}\n${importLine}`);
}

const bodyAnchor = "function translateBody(value: string, language: ProbabilityNativeLanguage): string {";
const bodyWithNaturalizer = `${bodyAnchor}\n  const natural = naturalizeProbabilityExplanationBody(value, language);\n  if (natural !== null) return natural;`;
if (!value.includes(bodyWithNaturalizer)) {
  if (!value.includes(bodyAnchor)) throw new Error("Could not find Probability translateBody anchor.");
  value = value.replace(bodyAnchor, bodyWithNaturalizer);
}

fs.writeFileSync(path, value);
console.log("Enabled sentence-level Probability explanation naturalizer before lexical fallback.");
