import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-naturalizer.ts";
let value = fs.readFileSync(path, "utf8");

const oldBlock = `  m = value.match(/^The first (marble|stone|ball|pen) is replaced, so the container again has (\\d+) red and (\\d+) blue (marbles|coloured stones|balls|pens) before the second selection\\.$/u);\n  if (m) {\n    const o = objectForms(language, m[4]);\n    return language === "hi"\n      ? \`पहली \${objectForms(language, m[1]).singular} वापस रख दी जाती है, इसलिए दूसरे चयन से पहले पात्र में फिर \${m[2]} लाल और \${m[3]} नीले \${o.plural} होते हैं।\`\n      : \`ਪਹਿਲੀ \${objectForms(language, m[1]).singular} ਵਾਪਸ ਰੱਖ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ, ਇਸ ਲਈ ਦੂਜੀ ਚੋਣ ਤੋਂ ਪਹਿਲਾਂ ਡੱਬੇ ਵਿੱਚ ਫਿਰ \${m[2]} ਲਾਲ ਅਤੇ \${m[3]} ਨੀਲੇ \${o.plural} ਹੁੰਦੇ ਹਨ।\`;\n  }`;

const newBlock = `  m = value.match(/^The first (marble|stone|ball|pen) is replaced, so the container again has (\\d+) red and (\\d+) blue (marbles|coloured stones|balls|pens) before the second selection\\.$/u);\n  if (m) {\n    const first = objectForms(language, m[1]);\n    const o = objectForms(language, m[4]);\n    const feminine = m[1] === "ball";\n    return language === "hi"\n      ? \`\${feminine ? "पहली" : "पहला"} \${first.singular} वापस \${feminine ? "रख दी जाती है" : "रख दिया जाता है"}, इसलिए दूसरे चयन से पहले उसी पात्र में फिर \${m[2]} लाल और \${m[3]} नीले \${o.plural} होते हैं।\`\n      : \`\${feminine ? "ਪਹਿਲੀ" : "ਪਹਿਲਾ"} \${first.singular} ਵਾਪਸ \${feminine ? "ਰੱਖ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ" : "ਰੱਖ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ"}, ਇਸ ਲਈ ਦੂਜੀ ਚੋਣ ਤੋਂ ਪਹਿਲਾਂ ਉਸੇ ਪਾਤਰ ਵਿੱਚ ਫਿਰ \${m[2]} ਲਾਲ ਅਤੇ \${m[3]} ਨੀਲੇ \${o.plural} ਹੁੰਦੇ ਹਨ।\`;\n  }`;

if (value.includes(oldBlock)) {
  value = value.replace(oldBlock, newBlock);
} else if (!value.includes(newBlock)) {
  throw new Error("Could not find Probability replacement sentence naturalizer block.");
}

value = value.replaceAll("ਦੋਵੇਂ ਪੜਾਅਾਂ ਵਿੱਚ", "ਦੋਵੇਂ ਪੜਾਵਾਂ ਵਿੱਚ");
value = value.replaceAll("ਦੋ ਪੜਾਅਵਾਂ", "ਦੋ ਪੜਾਵਾਂ");

fs.writeFileSync(path, value);
console.log("Fixed replacement-object gender, generic container fidelity and Punjabi stage inflection.");
