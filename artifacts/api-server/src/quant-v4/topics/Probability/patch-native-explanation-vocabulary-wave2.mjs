import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-mirror.ts";
let value = fs.readFileSync(path, "utf8");
const marker = "const EXTRA_SOURCE_EXPLANATION_RULES: readonly Rule[] = [";
if (!value.includes(marker)) throw new Error("Base explanation vocabulary patch must run first.");
const additions = [
  '  ["prize-winning", "इनाम वाले", "ਇਨਾਮ ਵਾਲੇ"],',
  '  ["in all", "कुल", "ਕੁੱਲ"],',
];
for (const line of additions) {
  if (!value.includes(line)) value = value.replace(marker, `${marker}\n${line}`);
}
fs.writeFileSync(path, value);
console.log("Applied Probability native explanation vocabulary wave 2.");
