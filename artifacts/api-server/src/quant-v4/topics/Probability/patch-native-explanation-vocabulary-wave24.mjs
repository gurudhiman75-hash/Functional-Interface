import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-naturalizer.ts";
let value = fs.readFileSync(path, "utf8");

const block = `  if (value === "Odd faces are 1, 3, 5 and even faces are 2, 4, 6. Same parity means odd-odd or even-even.") {\n    return pick(\n      language,\n      "विषम फलक 1, 3, 5 हैं और सम फलक 2, 4, 6 हैं। समान सम-विषम प्रकृति के लिए दोनों परिणाम या तो विषम-विषम होंगे या सम-सम।",\n      "ਟਾਂਕ ਪਾਸੇ 1, 3, 5 ਹਨ ਅਤੇ ਜੋੜੇ ਪਾਸੇ 2, 4, 6 ਹਨ। ਇੱਕੋ ਸਮ-ਵਿਸਮ ਪ੍ਰਕਿਰਤੀ ਲਈ ਦੋਵੇਂ ਨਤੀਜੇ ਜਾਂ ਤਾਂ ਟਾਂਕ-ਟਾਂਕ ਹੋਣਗੇ ਜਾਂ ਜੋੜਾ-ਜੋੜਾ।",\n    );\n  }\n\n  if (value === "Odd faces are 1, 3, 5 and even faces are 2, 4, 6. Different parity means odd-even or even-odd.") {\n    return pick(\n      language,\n      "विषम फलक 1, 3, 5 हैं और सम फलक 2, 4, 6 हैं। अलग सम-विषम प्रकृति के लिए एक परिणाम विषम और दूसरा सम होगा।",\n      "ਟਾਂਕ ਪਾਸੇ 1, 3, 5 ਹਨ ਅਤੇ ਜੋੜੇ ਪਾਸੇ 2, 4, 6 ਹਨ। ਵੱਖ ਸਮ-ਵਿਸਮ ਪ੍ਰਕਿਰਤੀ ਲਈ ਇੱਕ ਨਤੀਜਾ ਟਾਂਕ ਅਤੇ ਦੂਜਾ ਜੋੜਾ ਹੋਵੇਗਾ।",\n    );\n  }\n\n  m = value.match(/^Required ordered pairs = 3 × 3 \\+ 3 × 3 = 18\\. (So the probability is .+)$/u);\n  if (m) {\n    return pick(\n      language,\n      \`आवश्यक क्रमित युग्म = 3 × 3 + 3 × 3 = 18। \\${m[1].replace("So the probability is", "अतः प्रायिकता")}\`,\n      \`ਲੋੜੀਂਦੇ ਕ੍ਰਮਿਤ ਜੋੜੇ = 3 × 3 + 3 × 3 = 18। \\${m[1].replace("So the probability is", "ਇਸ ਲਈ ਸੰਭਾਵਨਾ")}\`,\n    );\n  }\n\n`;

const anchor = `  m = value.match(/^The spinner sectors are equal, so probability is favourable sectors`;
if (!value.includes(block)) {
  if (!value.includes(anchor)) throw new Error("Could not find Probability dice-parity naturalizer anchor.");
  value = value.replace(anchor, `${block}${anchor}`);
}

fs.writeFileSync(path, value);
console.log("Covered same/different parity two-dice explanation sentences.");
