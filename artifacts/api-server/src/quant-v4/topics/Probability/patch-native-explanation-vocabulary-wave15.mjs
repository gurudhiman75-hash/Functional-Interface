import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-naturalizer.ts";
let value = fs.readFileSync(path, "utf8");

value = value.replace(
  '      "एक यादृच्छिक चयन में प्रायिकता = अनुकूल स्थितियों की संख्या ÷ कुल समान-संभावित स्थितियों की संख्या होती है।",\n      "ਇੱਕ ਬੇਤਰਤੀਬ ਚੋਣ ਵਿੱਚ ਸੰਭਾਵਨਾ = ਅਨੁਕੂਲ ਮਾਮਲਿਆਂ ਦੀ ਗਿਣਤੀ ÷ ਕੁੱਲ ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ ਮਾਮਲਿਆਂ ਦੀ ਗਿਣਤੀ ਹੁੰਦੀ ਹੈ।",',
  '      "एक यादृच्छिक चयन में ¤0¤ = अनुकूल स्थितियों की संख्या ¤1¤ कुल समान-संभावित स्थितियों की संख्या।",\n      "ਇੱਕ ਬੇਤਰਤੀਬ ਚੋਣ ਵਿੱਚ ¤0¤ = ਅਨੁਕੂਲ ਮਾਮਲਿਆਂ ਦੀ ਗਿਣਤੀ ¤1¤ ਕੁੱਲ ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ ਮਾਮਲਿਆਂ ਦੀ ਗਿਣਤੀ।",',
);

fs.writeFileSync(path, value);
console.log("Preserved English-authority math placeholders in natural Probability explanation templates.");
