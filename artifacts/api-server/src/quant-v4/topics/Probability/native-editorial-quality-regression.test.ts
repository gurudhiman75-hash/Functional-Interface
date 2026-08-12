import assert from "node:assert/strict";
import { naturalizeProbabilityExplanationBody } from "./shared/native-source-explanation-naturalizer";

const cases = [
  {
    source: "Use symmetry at the first post. Every person is equally likely to receive that post, so compare the number of women with the total number of people.",
    hi: "पहले पद के लिए सममिति का उपयोग करें। हर व्यक्ति के उस पद पर चुने जाने की संभावना समान है, इसलिए महिलाओं की संख्या की तुलना कुल लोगों की संख्या से करें।",
    pa: "ਪਹਿਲੇ ਅਹੁਦੇ ਲਈ ਸਮਮਿਤੀ ਵਰਤੋ। ਹਰ ਵਿਅਕਤੀ ਦੇ ਉਸ ਅਹੁਦੇ ਲਈ ਚੁਣੇ ਜਾਣ ਦੀ ਸੰਭਾਵਨਾ ਇੱਕੋ ਹੈ, ਇਸ ਲਈ ਔਰਤਾਂ ਦੀ ਗਿਣਤੀ ਦੀ ਤੁਲਨਾ ਕੁੱਲ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਕਰੋ।",
  },
  {
    source: "The unit digit has 2 even choices. After fixing it, the remaining 3 positions can be filled in 6 ways.",
    hi: "इकाई स्थान के लिए 2 सम अंकों के विकल्प हैं। इसे तय करने के बाद बाकी 3 स्थानों को 6 तरीकों से भरा जा सकता है।",
    pa: "ਇਕਾਈ ਸਥਾਨ ਲਈ 2 ਜੋੜੇ ਅੰਕਾਂ ਦੀਆਂ ਚੋਣਾਂ ਹਨ। ਇਸ ਨੂੰ ਨਿਰਧਾਰਤ ਕਰਨ ਤੋਂ ਬਾਅਦ ਬਾਕੀ 3 ਸਥਾਨ 6 ਤਰੀਕਿਆਂ ਨਾਲ ਭਰੇ ਜਾ ਸਕਦੇ ਹਨ।",
  },
  {
    source: "Use the complement. Committees containing no woman are all-men committees: 15.",
    hi: "पूरक घटना का उपयोग करें। जिस समिति में कोई महिला नहीं है, वह केवल पुरुषों की समिति होगी: 15।",
    pa: "ਪੂਰਕ ਘਟਨਾ ਵਰਤੋ। ਜਿਸ ਕਮੇਟੀ ਵਿੱਚ ਕੋਈ ਔਰਤ ਨਹੀਂ ਹੈ, ਉਹ ਕੇਵਲ ਮਰਦਾਂ ਦੀ ਕਮੇਟੀ ਹੋਵੇਗੀ: 15।",
  },
  {
    source: "No division by the total number of committees is needed because the question asks for a count, not a probability.",
    hi: "यहाँ कुल समितियों की संख्या से भाग देने की आवश्यकता नहीं है, क्योंकि प्रश्न प्रायिकता नहीं बल्कि समितियों की संख्या पूछता है।",
    pa: "ਇੱਥੇ ਕੁੱਲ ਕਮੇਟੀਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦੇਣ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ, ਕਿਉਂਕਿ ਪ੍ਰਸ਼ਨ ਸੰਭਾਵਨਾ ਨਹੀਂ ਸਗੋਂ ਕਮੇਟੀਆਂ ਦੀ ਗਿਣਤੀ ਪੁੱਛਦਾ ਹੈ।",
  },
  {
    source: "Among them, 4, 8, 12, 16 are divisible by 4. So the probability is ¤0¤.",
    hi: "इनमें से 4, 8, 12, 16 संख्याएँ 4 से विभाज्य हैं। इसलिए प्रायिकता ¤0¤ है।",
    pa: "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ 4, 8, 12, 16 ਸੰਖਿਆਵਾਂ 4 ਨਾਲ ਭਾਗਯੋਗ ਹਨ। ਇਸ ਲਈ ਸੰਭਾਵਨਾ ¤0¤ ਹੈ।",
  },
  {
    source: "First find those satisfying at least one condition: 32 + 36 - 7 = 61.",
    hi: "पहले कम-से-कम एक शर्त पूरी करने वालों की संख्या ज्ञात करें: 32 + 36 - 7 = 61।",
    pa: "ਪਹਿਲਾਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ: 32 + 36 - 7 = 61।",
  },
  {
    source: "People satisfying neither condition = 77 - 61 = 16.",
    hi: "किसी भी शर्त को पूरा न करने वाले लोगों की संख्या = 77 - 61 = 16।",
    pa: "ਕਿਸੇ ਵੀ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਨਾ ਕਰਨ ਵਾਲੇ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ = 77 - 61 = 16।",
  },
  {
    source: "Apply ¤0¤ = ¤1¤ + ¤2¤ - ¤3¤.",
    hi: "सूत्र लगाएँ: ¤0¤ = ¤1¤ + ¤2¤ - ¤3¤।",
    pa: "ਸੂਤਰ ਲਗਾਓ: ¤0¤ = ¤1¤ + ¤2¤ - ¤3¤।",
  },
  {
    source: "In counts, the overlap is 35 + 32 - 50 = 17.",
    hi: "संख्याओं के रूप में साझा भाग = 35 + 32 - 50 = 17।",
    pa: "ਗਿਣਤੀਆਂ ਦੇ ਰੂਪ ਵਿੱਚ ਸਾਂਝਾ ਹਿੱਸਾ = 35 + 32 - 50 = 17।",
  },
] as const;

for (const item of cases) {
  assert.equal(naturalizeProbabilityExplanationBody(item.source, "hi"), item.hi, `Hindi editorial regression for: ${item.source}`);
  assert.equal(naturalizeProbabilityExplanationBody(item.source, "pa"), item.pa, `Punjabi editorial regression for: ${item.source}`);
}

const bannedHindi = ["पहला ज्ञात करें उन", "लोग पूरी करने वाले", "में संख्याएँ, साझा भाग", "में से उन्हें"];
const bannedPunjabi = ["ਪਹਿਲਾ ਕੱਢੋ ਉਨ੍ਹਾਂ", "ਲੋਕ ਪੂਰੀ ਕਰਨ ਵਾਲੇ", "ਵਿੱਚ ਗਿਣਤੀਆਂ, ਸਾਂਝਾ ਹਿੱਸਾ", "ਵਿੱਚੋਂ ਉਨ੍ਹਾਂ ਨੂੰ"];

for (const item of cases) {
  const hi = naturalizeProbabilityExplanationBody(item.source, "hi") ?? "";
  const pa = naturalizeProbabilityExplanationBody(item.source, "pa") ?? "";
  for (const bad of bannedHindi) assert(!hi.includes(bad), `Hindi literal fallback leaked: ${bad}`);
  for (const bad of bannedPunjabi) assert(!pa.includes(bad), `Punjabi literal fallback leaked: ${bad}`);
}

console.log(JSON.stringify({
  status: "PASS",
  checkpoint: "ML-06-EDITORIAL-QUALITY-WAVE01",
  sentenceFamiliesChecked: cases.length,
  languages: ["hi", "pa"],
  humanApprovalClaimed: false,
}));
