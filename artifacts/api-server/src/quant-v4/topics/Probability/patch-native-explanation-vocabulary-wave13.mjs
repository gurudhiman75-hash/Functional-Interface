import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-mirror.ts";
let value = fs.readFileSync(path, "utf8");
const marker = "const EXTRA_SOURCE_EXPLANATION_RULES: readonly Rule[] = [";
if (!value.includes(marker)) throw new Error("Base explanation vocabulary patch must run first.");

const additions = [
  ["4-digit numbers", "4-अंकीय संख्याएँ", "4-ਅੰਕੀ ਸੰਖਿਆਵਾਂ"],
  ["3-digit numbers", "3-अंकीय संख्याएँ", "3-ਅੰਕੀ ਸੰਖਿਆਵਾਂ"],
  ["5-digit numbers", "5-अंकीय संख्याएँ", "5-ਅੰਕੀ ਸੰਖਿਆਵਾਂ"],
  ["numbers", "संख्याएँ", "ਸੰਖਿਆਵਾਂ"],
  ["number", "संख्या", "ਸੰਖਿਆ"],
  ["repetition is not allowed", "अंकों की पुनरावृत्ति अनुमत नहीं है", "ਅੰਕਾਂ ਦੀ ਦੁਹਰਾਈ ਮਨਜ਼ੂਰ ਨਹੀਂ ਹੈ"],
  ["repetition is allowed", "अंकों की पुनरावृत्ति अनुमत है", "ਅੰਕਾਂ ਦੀ ਦੁਹਰਾਈ ਮਨਜ਼ੂਰ ਹੈ"],
  ["without repetition", "बिना पुनरावृत्ति", "ਬਿਨਾ ਦੁਹਰਾਈ"],
  ["with repetition", "पुनरावृत्ति के साथ", "ਦੁਹਰਾਈ ਨਾਲ"],
  ["repetition", "पुनरावृत्ति", "ਦੁਹਰਾਈ"],
  ["leading zero", "आरंभिक शून्य", "ਸ਼ੁਰੂਆਤੀ ਸਿਫ਼ਰ"],
  ["formed", "बनाई गई", "ਬਣਾਈ ਗਈ"],
  ["forming", "बनाने में", "ਬਣਾਉਣ ਵਿੱਚ"],
  ["allowed digits", "अनुमत अंक", "ਮਨਜ਼ੂਰ ਅੰਕ"],
  ["available digits", "उपलब्ध अंक", "ਮੌਜੂਦ ਅੰਕ"],
];

for (const [source, hi, pa] of additions) {
  const line = `  [${JSON.stringify(source)}, ${JSON.stringify(hi)}, ${JSON.stringify(pa)}],`;
  if (!value.includes(line)) value = value.replace(marker, `${marker}\n${line}`);
}

fs.writeFileSync(path, value);
console.log("Applied number-formation explanation vocabulary closure.");
