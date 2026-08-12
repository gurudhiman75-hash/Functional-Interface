import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-naturalizer.ts";
let value = fs.readFileSync(path, "utf8");

value = value.replace(
  '`इन ${m[1]} संभावनाओं में केवल 1 में निर्दिष्ट अभ्यर्थी पहले स्थान पर आता है।`',
  '`इन ${m[1]} संभावनाओं में केवल एक में निर्दिष्ट अभ्यर्थी पहले स्थान पर आता है।`',
);
value = value.replace(
  '`ਇਨ੍ਹਾਂ ${m[1]} ਸੰਭਾਵਨਾਵਾਂ ਵਿੱਚ ਕੇਵਲ 1 ਵਿੱਚ ਨਿਰਧਾਰਤ ਉਮੀਦਵਾਰ ਪਹਿਲੇ ਸਥਾਨ ਤੇ ਆਉਂਦਾ ਹੈ।`',
  '`ਇਨ੍ਹਾਂ ${m[1]} ਸੰਭਾਵਨਾਵਾਂ ਵਿੱਚ ਕੇਵਲ ਇੱਕ ਵਿੱਚ ਨਿਰਧਾਰਤ ਉਮੀਦਵਾਰ ਪਹਿਲੇ ਸਥਾਨ ਤੇ ਆਉਂਦਾ ਹੈ।`',
);

fs.writeFileSync(path, value);
console.log("Preserved English one-as-word representation in queue explanation.");
