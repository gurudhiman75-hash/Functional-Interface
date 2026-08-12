import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-naturalizer.ts";
let value = fs.readFileSync(path, "utf8");

const block = `  if (value === "Knowing that the card is a face card reduces the sample space to the 12 jacks, queens and kings.") {\n    return pick(\n      language,\n      "पत्ता फेस कार्ड दिया गया है, इसलिए अब कुल संभावित पत्ते केवल 12 गुलाम, बेगम और बादशाह हैं।",\n      "ਪੱਤਾ ਫੇਸ ਕਾਰਡ ਦਿੱਤਾ ਹੋਇਆ ਹੈ, ਇਸ ਲਈ ਹੁਣ ਕੁੱਲ ਸੰਭਵ ਪੱਤੇ ਕੇਵਲ 12 ਗੁਲਾਮ, ਬੇਗਮ ਅਤੇ ਬਾਦਸ਼ਾਹ ਹਨ।",\n    );\n  }\n\n`;
const anchor = `  let m: RegExpMatchArray | null;\n\n`;
if (!value.includes(block)) {
  if (!value.includes(anchor)) throw new Error("Probability naturalizer function-start anchor not found.");
  value = value.replace(anchor, anchor + block);
}
fs.writeFileSync(path, value);
console.log("Materialized Probability native editorial wave03 conditional-card wording.");
