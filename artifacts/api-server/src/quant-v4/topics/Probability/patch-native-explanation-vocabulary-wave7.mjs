import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-mirror.ts";
let value = fs.readFileSync(path, "utf8");
const marker = "const EXTRA_SOURCE_EXPLANATION_RULES: readonly Rule[] = [";
if (!value.includes(marker)) throw new Error("Base explanation vocabulary patch must run first.");

const additions = [
  ["Two fair dice produce", "दो निष्पक्ष पासों से", "ਦੋ ਨਿਰਪੱਖ ਪਾਸਿਆਂ ਤੋਂ"],
  ["two fair dice produce", "दो निष्पक्ष पासों से", "ਦੋ ਨਿਰਪੱਖ ਪਾਸਿਆਂ ਤੋਂ"],
  ["equally likely pairs", "समान रूप से संभावित युग्म", "ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ ਜੋੜੇ"],
  ["ordered pairs", "क्रमित युग्म", "ਕ੍ਰਮਿਤ ਜੋੜੇ"],
  ["pairs", "युग्म", "ਜੋੜੇ"],
  ["pair", "युग्म", "ਜੋੜਾ"],
];

for (const [source, hi, pa] of additions) {
  const line = `  [${JSON.stringify(source)}, ${JSON.stringify(hi)}, ${JSON.stringify(pa)}],`;
  if (!value.includes(line)) value = value.replace(marker, `${marker}\n${line}`);
}

fs.writeFileSync(path, value);
console.log("Applied natural ordered-pair explanation vocabulary.");
