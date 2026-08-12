import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-mirror.ts";
const value = fs.readFileSync(path, "utf8");
const devanagari = /[\u0900-\u097F]/u;
const gurmukhi = /[\u0A00-\u0A7F]/u;
const row = /\["([^"]+)",\s*"([^"]*)",\s*"([^"]*)"\]/gu;
const bad = [];
for (const match of value.matchAll(row)) {
  const [, source, hi, pa] = match;
  if (gurmukhi.test(hi) || devanagari.test(pa)) bad.push({ source, hi, pa });
}
if (bad.length) {
  throw new Error(`Probability explanation vocabulary contains wrong-script mappings: ${JSON.stringify(bad)}`);
}
console.log("Probability explanation vocabulary script-purity audit passed.");
