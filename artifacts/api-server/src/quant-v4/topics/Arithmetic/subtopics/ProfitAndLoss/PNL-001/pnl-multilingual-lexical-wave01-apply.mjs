import fs from "node:fs";
import path from "node:path";

const root = path.resolve(
  "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001",
);

function replaceOnce(file, oldValue, newValue) {
  const source = fs.readFileSync(file, "utf8");
  if (source.includes(oldValue)) {
    fs.writeFileSync(file, source.replace(oldValue, newValue));
    return;
  }
  if (!source.includes(newValue)) {
    throw new Error(`Required anchor is missing in ${file}: ${oldValue}`);
  }
}

function applyAuthority() {
  const normalizer = path.join(
    root,
    "foundation/editorial-v2-multilingual-normalizer.ts",
  );
  replaceOnce(
    normalizer,
    "`${sector} के इस प्रश्न में दिए गए व्यावसायिक क्रम को उसी क्रम में पढ़ना सबसे सुरक्षित है।`",
    "`${sector} के इस सवाल में दी गई खरीद, खर्च और बिक्री की जानकारी को उसी क्रम में पढ़ें।`",
  );
  replaceOnce(
    normalizer,
    "`${sector} ਦੇ ਇਸ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤਾ ਵਪਾਰਕ ਕ੍ਰਮ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਪੜ੍ਹਣਾ ਸਭ ਤੋਂ ਸੁਰੱਖਿਅਤ ਹੈ।`",
    "`${sector} ਦੇ ਇਸ ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੀ ਖਰੀਦ, ਖਰਚ ਅਤੇ ਵਿਕਰੀ ਦੀ ਜਾਣਕਾਰੀ ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਪੜ੍ਹੋ।`",
  );
  replaceOnce(
    normalizer,
    'hi: "अज्ञात समूह की प्रति इकाई लागत ₹{unknownUnitCostPrice} है और उसकी दिशा {unknownDirection} है।",',
    'hi: "जिस समूह का प्रतिशत ज्ञात करना है, उसकी प्रति इकाई लागत ₹{unknownUnitCostPrice} है और उसे {unknownDirection} पर बेचना है।",',
  );
  replaceOnce(
    normalizer,
    'pa: "ਅਣਜਾਣ ਸਮੂਹ ਦੀ ਪ੍ਰਤੀ ਇਕਾਈ ਲਾਗਤ ₹{unknownUnitCostPrice} ਹੈ ਅਤੇ ਉਸ ਦੀ ਦਿਸ਼ਾ {unknownDirection} ਹੈ।",',
    'pa: "ਜਿਸ ਸਮੂਹ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰਨਾ ਹੈ, ਉਸ ਦੀ ਪ੍ਰਤੀ ਇਕਾਈ ਲਾਗਤ ₹{unknownUnitCostPrice} ਹੈ ਅਤੇ ਉਸ ਨੂੰ {unknownDirection} \'ਤੇ ਵੇਚਣਾ ਹੈ।",',
  );

  replaceOnce(
    path.join(root, "CP-003/question-language.hi.json"),
    "दो माल समूहों की लागत बीजीय रूप में और उनके विक्रय प्रतिशत दिए गए हैं। अपेक्षित कुल परिणाम के लिए अज्ञात समूह प्रतिशत ज्ञात कीजिए।",
    "दो माल समूहों की लागत बीजीय रूप में और उनके विक्रय प्रतिशत दिए गए हैं। अपेक्षित कुल परिणाम के लिए जिस समूह की दर नहीं दी गई है, उसका लाभ या हानि प्रतिशत ज्ञात कीजिए।",
  );
  replaceOnce(
    path.join(root, "CP-003/question-language.pa.json"),
    "ਦੋ ਮਾਲ ਸਮੂਹਾਂ ਦੀ ਲਾਗਤ ਬੀਜਗਣਿਤੀ ਰੂਪ ਵਿੱਚ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਵਿਕਰੀ ਪ੍ਰਤੀਸ਼ਤ ਦਿੱਤੇ ਹਨ। ਲੋੜੀਂਦੇ ਕੁੱਲ ਨਤੀਜੇ ਲਈ ਅਣਜਾਣ ਸਮੂਹ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
    "ਦੋ ਮਾਲ ਸਮੂਹਾਂ ਦੀ ਲਾਗਤ ਬੀਜਗਣਿਤੀ ਰੂਪ ਵਿੱਚ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਵਿਕਰੀ ਪ੍ਰਤੀਸ਼ਤ ਦਿੱਤੇ ਹਨ। ਲੋੜੀਂਦੇ ਕੁੱਲ ਨਤੀਜੇ ਲਈ ਜਿਸ ਸਮੂਹ ਦੀ ਦਰ ਨਹੀਂ ਦਿੱਤੀ ਗਈ, ਉਸ ਦਾ ਲਾਭ ਜਾਂ ਹਾਨੀ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
  );
}

function finalizeWorkflow() {
  const file = path.resolve(
    ".github/workflows/validate-pnl-multilingual-editorial-audit.yml",
  );
  let source = fs.readFileSync(file, "utf8");
  source = source.replace(
    "      - audit/pnl-001-multilingual-editorial-freeze",
    "      - New-main",
  );

  const auditPath =
    '      - "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/pnl-001-multilingual-editorial-audit.ts"';
  const expandedPaths = `${auditPath}\n      - "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/foundation/editorial-v2-multilingual-normalizer.ts"\n      - "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-*/question-language.hi.json"\n      - "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/CP-*/question-language.pa.json"\n      - "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/pnl-001-multilingual-lexical-naturalness.test.ts"`;
  const occurrences = source.split(auditPath).length - 1;
  if (occurrences !== 2) {
    throw new Error(`Expected two audit path anchors, found ${occurrences}.`);
  }
  source = source.replaceAll(auditPath, expandedPaths);

  const anchor = "      - name: Bundle multilingual editorial corpus audit\n";
  const proof = `      - name: Prove multilingual lexical naturalness\n        run: |\n          pnpm --dir artifacts/api-server exec esbuild \\\n            src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/pnl-001-multilingual-lexical-naturalness.test.ts \\\n            --bundle --platform=node --format=esm \\\n            --outfile=src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/.pnl-001-multilingual-lexical-naturalness.test.mjs\n          node artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/.pnl-001-multilingual-lexical-naturalness.test.mjs\n\n`;
  if (!source.includes(anchor)) {
    throw new Error("Permanent workflow proof anchor is missing.");
  }
  source = source.replace(anchor, proof + anchor);
  fs.writeFileSync(file, source);
}

const mode = process.argv[2];
if (mode === "apply") applyAuthority();
else if (mode === "finalize") finalizeWorkflow();
else throw new Error(`Unknown mode: ${mode}`);

console.log(JSON.stringify({ status: "PATCHED", mode }, null, 2));
