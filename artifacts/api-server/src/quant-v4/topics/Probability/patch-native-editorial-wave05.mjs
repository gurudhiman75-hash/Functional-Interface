import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-naturalizer.ts";
let value = fs.readFileSync(path, "utf8");

const block = `  m = value.match(/^No integer from 1 to (\\d+) satisfies the condition\\.$/u);\n  if (m) return pick(\n    language,\n    "1 से " + m[1] + " तक कोई भी पूर्णांक दी गई शर्त को पूरा नहीं करता।",\n    "1 ਤੋਂ " + m[1] + " ਤੱਕ ਕੋਈ ਵੀ ਪੂਰਨ ਅੰਕ ਦਿੱਤੀ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰਦਾ।",\n  );\n\n  m = value.match(/^No red marble means all selected marbles are blue: (.+)\\.$/u);\n  if (m) return pick(\n    language,\n    "कोई लाल कंचा न चुने जाने का अर्थ है कि चुने गए सभी कंचे नीले हों: " + m[1] + "।",\n    "ਕੋਈ ਲਾਲ ਕੰਚਾ ਨਾ ਚੁਣੇ ਜਾਣ ਦਾ ਅਰਥ ਹੈ ਕਿ ਚੁਣੇ ਗਏ ਸਾਰੇ ਕੰਚੇ ਨੀਲੇ ਹੋਣ: " + m[1] + "।",\n  );\n\n  m = value.match(/^Use the complement\\. Selections of pens with no red pen: (.+)\\.$/u);\n  if (m) return pick(\n    language,\n    "पूरक घटना का उपयोग करें। ऐसे चयन जिनमें कोई लाल पेन न हो: " + m[1] + "।",\n    "ਪੂਰਕ ਘਟਨਾ ਵਰਤੋ। ਉਹ ਚੋਣਾਂ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਕੋਈ ਲਾਲ ਪੈਨ ਨਾ ਹੋਵੇ: " + m[1] + "।",\n  );\n\n`;

const anchor = `  let m: RegExpMatchArray | null;\n\n`;
if (!value.includes(block)) {
  if (!value.includes(anchor)) throw new Error("Probability naturalizer function-start anchor not found.");
  value = value.replace(anchor, anchor + block);
}
fs.writeFileSync(path, value);
console.log("Materialized Probability native editorial wave05 complement/certainty wording.");
