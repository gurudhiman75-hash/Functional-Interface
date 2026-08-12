import fs from "node:fs";

const paths = [
  "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-naturalizer.ts",
  "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-final-explanation-renderer.ts",
  "artifacts/api-server/src/quant-v4/topics/Probability/multilingual-runtime.ts",
  "artifacts/api-server/src/quant-v4/topics/Probability/PRB-002/native-editorial.ts",
];

for (const path of paths) {
  let value = fs.readFileSync(path, "utf8");
  value = value
    .replaceAll("ਪੜਾਅਾਂ", "ਪੜਾਵਾਂ")
    .replaceAll("ਪੜਾਅਵਾਂ", "ਪੜਾਵਾਂ");
  fs.writeFileSync(path, value);
}

console.log("Normalized Punjabi stage inflection across Probability runtime, naturalizer, visuals and PRB-002 editorial source.");
