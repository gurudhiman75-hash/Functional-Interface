import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-naturalizer.ts";
let value = fs.readFileSync(path, "utf8");

value = value.replace(
  '`एक निष्पक्ष पासे के 6 फलक समान-संभावित होते हैं। शर्त पूरी करने वाले फलक गिनें और उनकी संख्या को ${m[1]} से भाग दें।`',
  '`एक निष्पक्ष पासे के छह फलक समान-संभावित होते हैं। शर्त पूरी करने वाले फलक गिनें और उनकी संख्या को ${m[1]} से भाग दें।`',
);
value = value.replace(
  '`ਇੱਕ ਨਿਰਪੱਖ ਪਾਸੇ ਦੇ 6 ਪਾਸੇ ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ ਹੁੰਦੇ ਹਨ। ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੇ ਪਾਸੇ ਗਿਣੋ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ${m[1]} ਨਾਲ ਭਾਗ ਦਿਓ।`',
  '`ਇੱਕ ਨਿਰਪੱਖ ਪਾਸੇ ਦੇ ਛੇ ਪਾਸੇ ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ ਹੁੰਦੇ ਹਨ। ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੇ ਪਾਸੇ ਗਿਣੋ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ${m[1]} ਨਾਲ ਭਾਗ ਦਿਓ।`',
);

fs.writeFileSync(path, value);
console.log("Preserved English word-vs-digit parity in natural die explanation.");
