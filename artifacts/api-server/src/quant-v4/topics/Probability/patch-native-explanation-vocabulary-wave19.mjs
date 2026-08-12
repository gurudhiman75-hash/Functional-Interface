import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-naturalizer.ts";
let value = fs.readFileSync(path, "utf8");

const genericAnchor = `  m = value.match(/^The probability is (.+)\\.$/u);`;
const block = `  if (value === "The probability is valid because every admissible arrangement is treated as equally likely.") {\n    return pick(\n      language,\n      "यह प्रायिकता सही है क्योंकि प्रत्येक मान्य व्यवस्था को समान रूप से संभावित माना गया है।",\n      "ਇਹ ਸੰਭਾਵਨਾ ਸਹੀ ਹੈ ਕਿਉਂਕਿ ਹਰ ਮਨਜ਼ੂਰ ਵਿਉਂਤ ਨੂੰ ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲਾ ਮੰਨਿਆ ਗਿਆ ਹੈ।",\n    );\n  }\n\n`;

if (!value.includes(block)) {
  if (!value.includes(genericAnchor)) {
    throw new Error("Could not find Probability generic probability naturalizer anchor.");
  }
  value = value.replace(genericAnchor, `${block}${genericAnchor}`);
}

fs.writeFileSync(path, value);
console.log("Prioritized natural equally-likely arrangement key point before generic probability rule.");
