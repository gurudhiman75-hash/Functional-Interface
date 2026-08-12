import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-mirror.ts";
let value = fs.readFileSync(path, "utf8");

// Sentence-level handling is required here because English "x of the y ..." order is unnatural
// if translated token by token into Hindi/Punjabi. Preserve both numbers and the exact fact.
const anchor = "function translateBody(value: string, language: ProbabilityNativeLanguage): string {\n  let body = value;";
const replacement = `function translateBody(value: string, language: ProbabilityNativeLanguage): string {\n  const equallyPossible = value.match(/^Thus, (\\d+) of the (\\d+) equally possible (marbles|balls|pens|coloured stones) are favourable\\.$/iu);\n  if (equallyPossible) {\n    const favourable = equallyPossible[1]!;\n    const total = equallyPossible[2]!;\n    const object = equallyPossible[3]!.toLowerCase();\n    const hiObject: Record<string, string> = { marbles: \"कंचों\", balls: \"गेंदों\", pens: \"पेनों\", \"coloured stones\": \"रंगीन पत्थरों\" };\n    const paObject: Record<string, string> = { marbles: \"ਕੰਚਿਆਂ\", balls: \"ਗੇਂਦਾਂ\", pens: \"ਪੈਨਾਂ\", \"coloured stones\": \"ਰੰਗੀਨ ਪੱਥਰਾਂ\" };\n    return language === \"hi\"\n      ? \`इस प्रकार, \\${total} समान रूप से संभावित \\${hiObject[object]} में से \\${favourable} अनुकूल हैं।\`\n      : \`ਇਸ ਤਰ੍ਹਾਂ, \\${total} ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ \\${paObject[object]} ਵਿੱਚੋਂ \\${favourable} ਅਨੁਕੂਲ ਹਨ।\`;\n  }\n\n  let body = value;`;

if (!value.includes(replacement)) {
  if (!value.includes(anchor)) throw new Error("Could not find Probability translateBody anchor.");
  value = value.replace(anchor, replacement);
}

const marker = "const EXTRA_SOURCE_EXPLANATION_RULES: readonly Rule[] = [";
if (!value.includes(marker)) throw new Error("Base explanation vocabulary patch must run first.");
for (const [source, hi, pa] of [
  ["equally possible", "समान रूप से संभावित", "ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ"],
  ["equal sectors", "समान खंड", "ਬਰਾਬਰ ਖੰਡ"],
  ["of the", "में से", "ਵਿੱਚੋਂ"],
]) {
  const line = `  [${JSON.stringify(source)}, ${JSON.stringify(hi)}, ${JSON.stringify(pa)}],`;
  if (!value.includes(line)) value = value.replace(marker, `${marker}\n${line}`);
}

fs.writeFileSync(path, value);
console.log("Applied natural equally-possible count explanation patterns.");
