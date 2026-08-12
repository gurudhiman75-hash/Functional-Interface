import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-mirror.ts";
let value = fs.readFileSync(path, "utf8");
const from = "  body = localizeHtSequences(body);";
const to = "  body = localizeHtSequences(body, language);";
if (!value.includes(to)) {
  if (!value.includes(from)) throw new Error("Could not find Probability H/T explanation localization call.");
  value = value.replace(from, to);
}
fs.writeFileSync(path, value);
console.log("Fixed Probability H/T explanation localization language routing.");
