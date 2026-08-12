import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-naturalizer.ts";
let value = fs.readFileSync(path, "utf8");

const block = `  m = value.match(/^The first marble is replaced, so the container again has (\\d+) red and (\\d+) blue marbles before the second selection\\.$/u);\n  if (m) return pick(\n    language,\n    "पहला कंचा वापस रख दिया जाता है, इसलिए दूसरे चयन से पहले उसी जार में फिर " + m[1] + " लाल और " + m[2] + " नीले कंचे होते हैं।",\n    "ਪਹਿਲਾ ਕੰਚਾ ਵਾਪਸ ਰੱਖ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਦੂਜੀ ਚੋਣ ਤੋਂ ਪਹਿਲਾਂ ਉਸੇ ਜਾਰ ਵਿੱਚ ਫਿਰ " + m[1] + " ਲਾਲ ਅਤੇ " + m[2] + " ਨੀਲੇ ਕੰਚੇ ਹੁੰਦੇ ਹਨ।",\n  );\n\n  m = value.match(/^The first stone is replaced, so the container again has (\\d+) red and (\\d+) blue coloured stones before the second selection\\.$/u);\n  if (m) return pick(\n    language,\n    "पहला पत्थर वापस रख दिया जाता है, इसलिए दूसरे चयन से पहले उसी पाउच में फिर " + m[1] + " लाल और " + m[2] + " नीले रंगीन पत्थर होते हैं।",\n    "ਪਹਿਲਾ ਪੱਥਰ ਵਾਪਸ ਰੱਖ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਦੂਜੀ ਚੋਣ ਤੋਂ ਪਹਿਲਾਂ ਉਸੇ ਪਾਊਚ ਵਿੱਚ ਫਿਰ " + m[1] + " ਲਾਲ ਅਤੇ " + m[2] + " ਨੀਲੇ ਰੰਗੀਨ ਪੱਥਰ ਹੁੰਦੇ ਹਨ।",\n  );\n\n`;

const anchor = `  let m: RegExpMatchArray | null;\n\n`;
if (!value.includes(block)) {
  if (!value.includes(anchor)) throw new Error("Probability naturalizer function-start anchor not found.");
  value = value.replace(anchor, anchor + block);
}

fs.writeFileSync(path, value);
console.log("Materialized Probability native editorial wave02 container-context rules.");
