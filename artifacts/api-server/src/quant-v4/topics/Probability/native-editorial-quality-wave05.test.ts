import assert from "node:assert/strict";
import { runPrb001Pipeline } from "./PRB-001";
import { listProbabilityMl05QlEntries, renderProbabilityNativePreview } from "./multilingual-runtime";

const CERTAINTY_QLS = new Set(["PRB-QL-004", "PRB-QL-010"]);
const MARBLE_COMPLEMENT_QLS = new Set(["PRB-QL-405", "PRB-QL-413", "PRB-QL-421"]);
const PEN_COMPLEMENT_QLS = new Set(["PRB-QL-406", "PRB-QL-414", "PRB-QL-422"]);
const TARGET_QLS = new Set([...CERTAINTY_QLS, ...MARBLE_COMPLEMENT_QLS, ...PEN_COMPLEMENT_QLS]);
let checkedSurfaceCount = 0;

for (const entry of listProbabilityMl05QlEntries()) {
  if (!TARGET_QLS.has(entry.qlId)) continue;
  assert.equal(entry.packageId, "PRB-001");
  const source = runPrb001Pipeline(entry.cpId as any, { questionLanguageId: entry.qlId, seed: `ml05-parity:${entry.qlId}` });
  assert(source.validation.valid, `${entry.qlId}: canonical English source must validate`);

  for (const language of ["hi", "pa"] as const) {
    const native = renderProbabilityNativePreview(source, language).presentation.explanation.lines.join("\n");
    checkedSurfaceCount += 1;
    for (const bad of language === "hi"
      ? ["कोई नहीं पूर्णांक", "कोई नहीं लाल कंचा", "चयन का पेन के साथ कोई नहीं लाल पेन", "चुने गए कंचे हैं नीला"]
      : ["ਕੋਈ ਨਹੀਂ ਪੂਰਨ ਅੰਕ", "ਕੋਈ ਨਹੀਂ ਲਾਲ ਕੰਚਾ", "ਚੋਣਾਂ ਦਾ ਪੈਨ ਨਾਲ ਕੋਈ ਨਹੀਂ ਲਾਲ ਪੈਨ", "ਚੁਣੇ ਕੰਚੇ ਹਨ ਨੀਲਾ"]) {
      assert(!native.includes(bad), `${entry.qlId}/${language}: machine-like complement/certainty phrase survived: ${bad}\n${native}`);
    }

    if (CERTAINTY_QLS.has(entry.qlId)) {
      assert(native.includes(language === "hi" ? "कोई भी पूर्णांक दी गई शर्त को पूरा नहीं करता" : "ਕੋਈ ਵੀ ਪੂਰਨ ਅੰਕ ਦਿੱਤੀ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰਦਾ"));
    }
    if (MARBLE_COMPLEMENT_QLS.has(entry.qlId)) {
      assert(native.includes(language === "hi" ? "कोई लाल कंचा न चुने जाने का अर्थ है" : "ਕੋਈ ਲਾਲ ਕੰਚਾ ਨਾ ਚੁਣੇ ਜਾਣ ਦਾ ਅਰਥ ਹੈ"));
      assert(native.includes(language === "hi" ? "सभी कंचे नीले हों" : "ਸਾਰੇ ਕੰਚੇ ਨੀਲੇ ਹੋਣ"));
    }
    if (PEN_COMPLEMENT_QLS.has(entry.qlId)) {
      assert(native.includes(language === "hi" ? "ऐसे चयन जिनमें कोई लाल पेन न हो" : "ਉਹ ਚੋਣਾਂ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਕੋਈ ਲਾਲ ਪੈਨ ਨਾ ਹੋਵੇ"));
    }
  }
}

assert.equal(checkedSurfaceCount, 16);
console.log(JSON.stringify({ status: "PASS", affectedQlCount: 8, checkedSurfaceCount }));
