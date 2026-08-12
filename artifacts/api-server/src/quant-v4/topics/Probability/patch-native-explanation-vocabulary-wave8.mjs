import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-mirror.ts";
let value = fs.readFileSync(path, "utf8");
const marker = "const EXTRA_SOURCE_EXPLANATION_RULES: readonly Rule[] = [";
if (!value.includes(marker)) throw new Error("Base explanation vocabulary patch must run first.");

const additions = [
  ["marked part", "चिह्नित भाग", "ਨਿਸ਼ਾਨਿਤ ਹਿੱਸਾ"],
  ["part", "भाग", "ਹਿੱਸਾ"],
];

for (const [source, hi, pa] of additions) {
  const line = `  [${JSON.stringify(source)}, ${JSON.stringify(hi)}, ${JSON.stringify(pa)}],`;
  if (!value.includes(line)) value = value.replace(marker, `${marker}\n${line}`);
}

fs.writeFileSync(path, value);
console.log("Applied marked-spinner explanation vocabulary.");
