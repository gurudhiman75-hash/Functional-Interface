import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-naturalizer.ts";
let value = fs.readFileSync(path, "utf8");

const block = `  if (value === "Out of the 36 ordered pairs, 18 have one odd and one even face, while the other 18 have equal parity.") {\n    return pick(\n      language,\n      "36 क्रमित युग्मों में से 18 में एक फलक विषम और दूसरा सम है, जबकि बाकी 18 में दोनों फलकों की सम-विषम प्रकृति समान है।",\n      "36 ਕ੍ਰਮਿਤ ਜੋੜਿਆਂ ਵਿੱਚੋਂ 18 ਵਿੱਚ ਇੱਕ ਪਾਸਾ ਟਾਂਕ ਅਤੇ ਦੂਜਾ ਜੋੜਾ ਹੈ, ਜਦਕਿ ਬਾਕੀ 18 ਵਿੱਚ ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਸਮ-ਵਿਸਮ ਪ੍ਰਕਿਰਤੀ ਇੱਕੋ ਹੈ।",\n    );\n  }\n\n  if (value === "Odd faces are 1, 3, 5 and even faces are 2, 4, 6. Same parity means odd-odd or even-even.") {\n    return pick(\n      language,\n      "विषम फलक 1, 3, 5 हैं और सम फलक 2, 4, 6 हैं। समान सम-विषम प्रकृति के लिए दोनों परिणाम या तो विषम-विषम होंगे या सम-सम।",\n      "ਟਾਂਕ ਪਾਸੇ 1, 3, 5 ਹਨ ਅਤੇ ਜੋੜੇ ਪਾਸੇ 2, 4, 6 ਹਨ। ਇੱਕੋ ਸਮ-ਵਿਸਮ ਪ੍ਰਕਿਰਤੀ ਲਈ ਦੋਵੇਂ ਨਤੀਜੇ ਜਾਂ ਤਾਂ ਟਾਂਕ-ਟਾਂਕ ਹੋਣਗੇ ਜਾਂ ਜੋੜਾ-ਜੋੜਾ।",\n    );\n  }\n\n  if (value === "Odd faces are 1, 3, 5 and even faces are 2, 4, 6. Different parity means odd-even or even-odd.") {\n    return pick(\n      language,\n      "विषम फलक 1, 3, 5 हैं और सम फलक 2, 4, 6 हैं। अलग सम-विषम प्रकृति के लिए एक परिणाम विषम और दूसरा सम होगा।",\n      "ਟਾਂਕ ਪਾਸੇ 1, 3, 5 ਹਨ ਅਤੇ ਜੋੜੇ ਪਾਸੇ 2, 4, 6 ਹਨ। ਵੱਖ ਸਮ-ਵਿਸਮ ਪ੍ਰਕਿਰਤੀ ਲਈ ਇੱਕ ਨਤੀਜਾ ਟਾਂਕ ਅਤੇ ਦੂਜਾ ਜੋੜਾ ਹੋਵੇਗਾ।",\n    );\n  }\n\n  m = value.match(/^Required ordered pairs = 3 × 3 \\+ 3 × 3 = 18\\. ((?:So|Hence) the probability is .+)$/u);\n  if (m) {\n    const hiTail = m[1].replace(/^(?:So|Hence) the probability is/u, "अतः प्रायिकता");\n    const paTail = m[1].replace(/^(?:So|Hence) the probability is/u, "ਇਸ ਲਈ ਸੰਭਾਵਨਾ");\n    return pick(\n      language,\n      "आवश्यक क्रमित युग्म = 3 × 3 + 3 × 3 = 18। " + hiTail,\n      "ਲੋੜੀਂਦੇ ਕ੍ਰਮਿਤ ਜੋੜੇ = 3 × 3 + 3 × 3 = 18। " + paTail,\n    );\n  }\n\n  if (value === "Parity questions become quick once the odd and even face counts are separated.") {\n    return pick(\n      language,\n      "विषम और सम फलकों की संख्या अलग कर लेने पर सम-विषम वाले प्रश्न जल्दी हल हो जाते हैं।",\n      "ਟਾਂਕ ਅਤੇ ਜੋੜੇ ਪਾਸਿਆਂ ਦੀ ਗਿਣਤੀ ਵੱਖ ਕਰ ਲੈਣ ਨਾਲ ਸਮ-ਵਿਸਮ ਵਾਲੇ ਪ੍ਰਸ਼ਨ ਤੇਜ਼ੀ ਨਾਲ ਹੱਲ ਹੋ ਜਾਂਦੇ ਹਨ।",\n    );\n  }\n\n`;

const anchor = `  let m: RegExpMatchArray | null;\n\n`;
if (!value.includes(block)) {
  if (!value.includes(anchor)) throw new Error("Could not find Probability naturalizer function-start anchor.");
  value = value.replace(anchor, `${anchor}${block}`);
}

fs.writeFileSync(path, value);
console.log("Covered two-dice parity explanation family using stable naturalizer anchor.");
