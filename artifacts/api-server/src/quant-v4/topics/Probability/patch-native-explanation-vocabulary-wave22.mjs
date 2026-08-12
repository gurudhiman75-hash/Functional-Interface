import fs from "node:fs";

for (const path of [
  "artifacts/api-server/src/quant-v4/topics/Probability/multilingual-runtime.ts",
  "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-final-explanation-renderer.ts",
]) {
  let value = fs.readFileSync(path, "utf8");
  value = value
    .replaceAll("ਪੜਾਅਾਂ", "ਪੜਾਵਾਂ")
    .replaceAll("ਪੜਾਅਵਾਂ", "ਪੜਾਵਾਂ");
  fs.writeFileSync(path, value);
}

console.log("Normalized Punjabi stage inflection in Probability visuals and explanation polishers.");
