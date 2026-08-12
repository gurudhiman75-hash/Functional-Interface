import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-mirror.ts";
let value = fs.readFileSync(path, "utf8");
const marker = "const EXTRA_SOURCE_EXPLANATION_RULES: readonly Rule[] = [";
if (!value.includes(marker)) throw new Error("Base explanation vocabulary patch must run first.");

const additions = [
  ["the deck", "ताश की गड्डी", "ਤਾਸ਼ ਦੀ ਗੱਡੀ"],
  ["deck", "ताश की गड्डी", "ਤਾਸ਼ ਦੀ ਗੱਡੀ"],
  ["likely", "संभावित", "ਸੰਭਾਵਨਾ ਵਾਲੇ"],
  ["stated", "दी गई", "ਦਿੱਤੀ"],
  ["relation", "संबंध", "ਸੰਬੰਧ"],
  ["once", "एक बार", "ਇੱਕ ਵਾਰ"],
  ["made", "बने", "ਬਣੇ"],
  ["make", "बनाते हैं", "ਬਣਾਉਂਦੇ ਹਨ"],
  ["space", "समूह", "ਸਮੂਹ"],
];

for (const [source, hi, pa] of additions) {
  const line = `  [${JSON.stringify(source)}, ${JSON.stringify(hi)}, ${JSON.stringify(pa)}],`;
  if (!value.includes(line)) value = value.replace(marker, `${marker}\n${line}`);
}

fs.writeFileSync(path, value);
console.log("Applied card-deck explanation vocabulary closure.");
