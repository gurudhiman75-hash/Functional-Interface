import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-naturalizer.ts";
let value = fs.readFileSync(path, "utf8");

const block = `  m = value.match(/^Among them, (.+) are divisible by (\\d+)\\. So the probability is (.+)\\.$/u);\n  if (m) return pick(\n    language,\n    "इनमें से " + m[1] + " संख्याएँ " + m[2] + " से विभाज्य हैं। इसलिए प्रायिकता " + m[3] + " है।",\n    "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ " + m[1] + " ਸੰਖਿਆਵਾਂ " + m[2] + " ਨਾਲ ਭਾਗਯੋਗ ਹਨ। ਇਸ ਲਈ ਸੰਭਾਵਨਾ " + m[3] + " ਹੈ।",\n  );\n\n  m = value.match(/^First find those satisfying at least one condition: (.+)\\.$/u);\n  if (m) return pick(\n    language,\n    "पहले कम-से-कम एक शर्त पूरी करने वालों की संख्या ज्ञात करें: " + m[1] + "।",\n    "ਪਹਿਲਾਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ: " + m[1] + "।",\n  );\n\n  m = value.match(/^People satisfying neither condition = (.+)\\.$/u);\n  if (m) return pick(\n    language,\n    "किसी भी शर्त को पूरा न करने वाले लोगों की संख्या = " + m[1] + "।",\n    "ਕਿਸੇ ਵੀ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਨਾ ਕਰਨ ਵਾਲੇ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ = " + m[1] + "।",\n  );\n\n  m = value.match(/^Apply (.+)\\.$/u);\n  if (m) return pick(\n    language,\n    "सूत्र लगाएँ: " + m[1] + "।",\n    "ਸੂਤਰ ਲਗਾਓ: " + m[1] + "।",\n  );\n\n  m = value.match(/^In counts, the overlap is (.+)\\.$/u);\n  if (m) return pick(\n    language,\n    "संख्याओं के रूप में साझा भाग = " + m[1] + "।",\n    "ਗਿਣਤੀਆਂ ਦੇ ਰੂਪ ਵਿੱਚ ਸਾਂਝਾ ਹਿੱਸਾ = " + m[1] + "।",\n  );\n\n`;

const anchor = `  let m: RegExpMatchArray | null;\n\n`;
if (!value.includes(block)) {
  if (!value.includes(anchor)) throw new Error("Could not find Probability naturalizer function-start anchor for conditional/event-algebra editorial block.");
  value = value.replace(anchor, `${anchor}${block}`);
}

fs.writeFileSync(path, value);
console.log("Covered conditional-number, neither-event and missing-intersection editorial explanation families.");
