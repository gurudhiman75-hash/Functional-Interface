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

const directContextBlock = `  m = value.match(/^There are (\\d+) lottery tickets in all, and (\\d+) are prize-winning\\.$/u);\n  if (m) return pick(language, \`कुल \${m[1]} लॉटरी टिकट हैं, जिनमें से \${m[2]} इनाम वाले हैं।\`, \`ਕੁੱਲ \${m[1]} ਲਾਟਰੀ ਟਿਕਟ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ \${m[2]} ਇਨਾਮ ਵਾਲੇ ਹਨ।\`);\n\n  m = value.match(/^The batch has (\\d+) bulbs, of which (\\d+) are defective\\.$/u);\n  if (m) return pick(language, \`बैच में कुल \${m[1]} बल्ब हैं, जिनमें से \${m[2]} खराब हैं।\`, \`ਬੈਚ ਵਿੱਚ ਕੁੱਲ \${m[1]} ਬਲਬ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ \${m[2]} ਖਰਾਬ ਹਨ।\`);\n\n  m = value.match(/^The shelf has (\\d+) books, of which (\\d+) are Mathematics books\\.$/u);\n  if (m) return pick(language, \`शेल्फ पर कुल \${m[1]} किताबें हैं, जिनमें से \${m[2]} गणित की किताबें हैं।\`, \`ਸ਼ੈਲਫ਼ ਉੱਤੇ ਕੁੱਲ \${m[1]} ਕਿਤਾਬਾਂ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ \${m[2]} ਗਣਿਤ ਦੀਆਂ ਕਿਤਾਬਾਂ ਹਨ।\`);\n\n  m = value.match(/^The bag has (\\d+) balls altogether\\. (\\d+) of them are (red|blue|green)\\.$/u);\n  if (m) {\n    const c = colour(language, m[3]);\n    return language === "hi"\n      ? \`बैग में कुल \${m[1]} गेंदें हैं। उनमें से \${m[2]} \${c} हैं।\`\n      : \`ਬੈਗ ਵਿੱਚ ਕੁੱਲ \${m[1]} ਗੇਂਦਾਂ ਹਨ। ਉਨ੍ਹਾਂ ਵਿੱਚੋਂ \${m[2]} \${c} ਹਨ।\`;\n  }\n\n`;
const directAnchor = `  m = value.match(/^The (bag|jar|box|pouch) (?:has|contains)`;
if (!naturalizer.includes(directContextBlock)) {
  if (!naturalizer.includes(directAnchor)) throw new Error("Could not find Probability direct-context naturalizer anchor.");
  naturalizer = naturalizer.replace(directAnchor, `${directContextBlock}${directAnchor}`);
}

const shareContextBlock = `  m = value.match(/^(Prize-winning tickets|Defective bulbs|Qualified candidates|Female employees|Male employees|Red balls|Approved applications|Successful applications|Red coloured stones) make up (.+) of all (\\d+) (tickets|bulbs|candidates|employees|balls|applications|coloured stones)\\.$/u);\n  if (m) {\n    const hiSubject = {\n      "Prize-winning tickets": "इनाम वाले टिकट",\n      "Defective bulbs": "खराब बल्ब",\n      "Qualified candidates": "योग्य अभ्यर्थी",\n      "Female employees": "महिला कर्मचारी",\n      "Male employees": "पुरुष कर्मचारी",\n      "Red balls": "लाल गेंदें",\n      "Approved applications": "स्वीकृत आवेदन",\n      "Successful applications": "सफल आवेदन",\n      "Red coloured stones": "लाल रंगीन पत्थर",\n    }[m[1]];\n    const paSubject = {\n      "Prize-winning tickets": "ਇਨਾਮ ਵਾਲੇ ਟਿਕਟ",\n      "Defective bulbs": "ਖਰਾਬ ਬਲਬ",\n      "Qualified candidates": "ਯੋਗ ਉਮੀਦਵਾਰ",\n      "Female employees": "ਮਹਿਲਾ ਕਰਮਚਾਰੀ",\n      "Male employees": "ਪੁਰਸ਼ ਕਰਮਚਾਰੀ",\n      "Red balls": "ਲਾਲ ਗੇਂਦਾਂ",\n      "Approved applications": "ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ",\n      "Successful applications": "ਸਫਲ ਅਰਜ਼ੀਆਂ",\n      "Red coloured stones": "ਲਾਲ ਰੰਗੀਨ ਪੱਥਰ",\n    }[m[1]];\n    const hiTotal = { tickets: "टिकटों", bulbs: "बल्बों", candidates: "अभ्यर्थियों", employees: "कर्मचारियों", balls: "गेंदों", applications: "आवेदनों", "coloured stones": "रंगीन पत्थरों" }[m[4]];\n    const paTotal = { tickets: "ਟਿਕਟਾਂ", bulbs: "ਬਲਬਾਂ", candidates: "ਉਮੀਦਵਾਰਾਂ", employees: "ਕਰਮਚਾਰੀਆਂ", balls: "ਗੇਂਦਾਂ", applications: "ਅਰਜ਼ੀਆਂ", "coloured stones": "ਰੰਗੀਨ ਪੱਥਰਾਂ" }[m[4]];\n    return language === "hi"\n      ? \`कुल \${m[3]} \${hiTotal} में \${hiSubject} का भाग \${m[2]} है।\`\n      : \`ਕੁੱਲ \${m[3]} \${paTotal} ਵਿੱਚ \${paSubject} ਦਾ ਹਿੱਸਾ \${m[2]} ਹੈ।\`;\n  }\n\n`;
const shareAnchor = `  m = value.match(/^(Female|Male) employees make up`;
if (!naturalizer.includes(shareContextBlock)) {
  if (!naturalizer.includes(shareAnchor)) throw new Error("Could not find Probability employee-share naturalizer anchor.");
  naturalizer = naturalizer.replace(shareAnchor, `${shareContextBlock}${shareAnchor}`);
}

const reverseContextBlock = `  m = value.match(/^(\\d+) (prize-winning|defective|qualified|female|red|approved|successful) (tickets|bulbs|candidates|employees|applications|balls|people) represent (.+) of the full group\\.$/u);\n  if (m) {\n    const hiDescription = { "prize-winning": "इनाम वाले", defective: "खराब", qualified: "योग्य", female: "महिला", red: "लाल", approved: "स्वीकृत", successful: "सफल" }[m[2]];\n    const paDescription = { "prize-winning": "ਇਨਾਮ ਵਾਲੇ", defective: "ਖਰਾਬ", qualified: "ਯੋਗ", female: "ਮਹਿਲਾ", red: "ਲਾਲ", approved: "ਮਨਜ਼ੂਰ", successful: "ਸਫਲ" }[m[2]];\n    const hiNoun = { tickets: "टिकट", bulbs: "बल्ब", candidates: "अभ्यर्थी", employees: "कर्मचारी", applications: "आवेदन", balls: "गेंदें", people: "लोग" }[m[3]];\n    const paNoun = { tickets: "ਟਿਕਟ", bulbs: "ਬਲਬ", candidates: "ਉਮੀਦਵਾਰ", employees: "ਕਰਮਚਾਰੀ", applications: "ਅਰਜ਼ੀਆਂ", balls: "ਗੇਂਦਾਂ", people: "ਲੋਕ" }[m[3]];\n    return language === "hi"\n      ? \`\${m[1]} \${hiDescription} \${hiNoun} पूरे समूह का \${m[4]} भाग हैं।\`\n      : \`\${m[1]} \${paDescription} \${paNoun} ਪੂਰੇ ਸਮੂਹ ਦਾ \${m[4]} ਹਿੱਸਾ ਹਨ।\`;\n  }\n\n  m = value.match(/^Total (tickets|bulbs|candidates|employees|applications|balls|people) = (.+)\\.$/u);\n  if (m) {\n    const hiNoun = { tickets: "टिकट", bulbs: "बल्ब", candidates: "अभ्यर्थी", employees: "कर्मचारी", applications: "आवेदन", balls: "गेंदें", people: "लोग" }[m[1]];\n    const paNoun = { tickets: "ਟਿਕਟ", bulbs: "ਬਲਬ", candidates: "ਉਮੀਦਵਾਰ", employees: "ਕਰਮਚਾਰੀ", applications: "ਅਰਜ਼ੀਆਂ", balls: "ਗੇਂਦਾਂ", people: "ਲੋਕ" }[m[1]];\n    return language === "hi" ? \`कुल \${hiNoun} = \${m[2]}।\` : \`ਕੁੱਲ \${paNoun} = \${m[2]}।\`;\n  }\n\n`;
const reverseAnchor = `  if (value === "Use the complement: at least one red ball fails only when both selected balls are blue.")`;
if (!naturalizer.includes(reverseContextBlock)) {
  if (!naturalizer.includes(reverseAnchor)) throw new Error("Could not find Probability reverse-context naturalizer anchor.");
  naturalizer = naturalizer.replace(reverseAnchor, `${reverseContextBlock}${reverseAnchor}`);
}

const employeeBlock = `  m = value.match(/^(Female|Male) employees make up (.+) of all (\\d+) employees\\.$/u);\n  if (m) {\n    const hiSubject = m[1] === "Female" ? "महिला कर्मचारियों" : "पुरुष कर्मचारियों";\n    const paSubject = m[1] === "Female" ? "ਮਹਿਲਾ ਕਰਮਚਾਰੀਆਂ" : "ਪੁਰਸ਼ ਕਰਮਚਾਰੀਆਂ";\n    return language === "hi"\n      ? \`कुल \${m[3]} कर्मचारियों में \${hiSubject} का भाग \${m[2]} है।\`\n      : \`ਕੁੱਲ \${m[3]} ਕਰਮਚਾਰੀਆਂ ਵਿੱਚ \${paSubject} ਦਾ ਹਿੱਸਾ \${m[2]} ਹੈ।\`;\n  }\n\n`;
const employeeAnchor = `  m = value.match(/^(Defective bulbs|Qualified candidates|Red coloured stones) make up`;
if (!naturalizer.includes(employeeBlock)) {
  if (!naturalizer.includes(employeeAnchor)) throw new Error("Could not find Probability share-sentence naturalizer anchor.");
  naturalizer = naturalizer.replace(employeeAnchor, `${employeeBlock}${employeeAnchor}`);
}

fs.writeFileSync(naturalizerPath, naturalizer);
console.log("Covered Probability direct/reverse context explanations and normalized Punjabi stage inflection.");
