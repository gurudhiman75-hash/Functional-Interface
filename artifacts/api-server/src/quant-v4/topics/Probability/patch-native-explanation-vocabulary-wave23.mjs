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

const naturalizerPath = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-naturalizer.ts";
let naturalizer = fs.readFileSync(naturalizerPath, "utf8");
const employeeBlock = `  m = value.match(/^(Female|Male) employees make up (.+) of all (\\d+) employees\\.$/u);\n  if (m) {\n    const hiSubject = m[1] === "Female" ? "महिला कर्मचारियों" : "पुरुष कर्मचारियों";\n    const paSubject = m[1] === "Female" ? "ਮਹਿਲਾ ਕਰਮਚਾਰੀਆਂ" : "ਪੁਰਸ਼ ਕਰਮਚਾਰੀਆਂ";\n    return language === "hi"\n      ? \`कुल \${m[3]} कर्मचारियों में \${hiSubject} का भाग \${m[2]} है।\`\n      : \`ਕੁੱਲ \${m[3]} ਕਰਮਚਾਰੀਆਂ ਵਿੱਚ \${paSubject} ਦਾ ਹਿੱਸਾ \${m[2]} ਹੈ।\`;\n  }\n\n`;
const employeeAnchor = `  m = value.match(/^(Defective bulbs|Qualified candidates|Red coloured stones) make up`;
if (!naturalizer.includes(employeeBlock)) {
  if (!naturalizer.includes(employeeAnchor)) {
    throw new Error("Could not find Probability share-sentence naturalizer anchor.");
  }
  naturalizer = naturalizer.replace(employeeAnchor, `${employeeBlock}${employeeAnchor}`);
}
fs.writeFileSync(naturalizerPath, naturalizer);

console.log("Normalized Punjabi stage inflection and covered employee-share Probability explanations.");
