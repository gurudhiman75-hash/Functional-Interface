import assert from "node:assert/strict";
import { runPrb001Pipeline } from "./PRB-001";
import { listProbabilityMl05QlEntries, renderProbabilityNativePreview } from "./multilingual-runtime";

const TARGET_QLS = new Set([
  "PRB-QL-005", "PRB-QL-011", "PRB-QL-017",
  "PRB-QL-303", "PRB-QL-306", "PRB-QL-311", "PRB-QL-314", "PRB-QL-319", "PRB-QL-322",
]);
const catalog = listProbabilityMl05QlEntries();
let checkedSurfaceCount = 0;

for (const entry of catalog) {
  if (!TARGET_QLS.has(entry.qlId)) continue;
  assert.equal(entry.packageId, "PRB-001");
  const source = runPrb001Pipeline(entry.cpId as any, { questionLanguageId: entry.qlId, seed: `ml05-parity:${entry.qlId}` });
  assert(source.validation.valid, `${entry.qlId}: canonical English source must validate`);

  for (const language of ["hi", "pa"] as const) {
    const native = renderProbabilityNativePreview(source, language).presentation.explanation.lines.join("\n");
    checkedSurfaceCount += 1;
    for (const bad of language === "hi"
      ? ["बॉक्स में हैं", "पाउच में हैं", "ताश की गड्डी में हैं", "पत्ते कि हैं नहीं", "पेन हैं नीला", "पत्थर हैं लाल"]
      : ["ਬਾਕਸ ਵਿੱਚ ਹਨ", "ਪਾਊਚ ਵਿੱਚ ਹਨ", "ਤਾਸ਼ ਦੀ ਗੱਡੀ ਵਿੱਚ ਹਨ", "ਪੱਤੇ ਕਿ ਹਨ ਨਹੀਂ", "ਪੈਨ ਹਨ ਨੀਲਾ", "ਪੱਥਰ ਹਨ ਲਾਲ"]) {
      assert(
        !native.includes(bad),
        `${entry.qlId}/${language}: machine-like direct-selection phrase survived: ${bad}\n${native}`,
      );
    }

    if (["PRB-QL-005", "PRB-QL-017"].includes(entry.qlId)) {
      assert(native.includes(language === "hi" ? "बॉक्स में कुल" : "ਬਾਕਸ ਵਿੱਚ ਕੁੱਲ"));
      assert(native.includes(language === "hi" ? "पेन में से" : "ਪੈਨਾਂ ਵਿੱਚੋਂ"));
    }
    if (entry.qlId === "PRB-QL-011") {
      assert(native.includes(language === "hi" ? "पाउच में कुल" : "ਪਾਊਚ ਵਿੱਚ ਕੁੱਲ"));
      assert(native.includes(language === "hi" ? "रंगीन पत्थरों में से" : "ਰੰਗੀਨ ਪੱਥਰਾਂ ਵਿੱਚੋਂ"));
    }
    if (["PRB-QL-303", "PRB-QL-311", "PRB-QL-319"].includes(entry.qlId)) {
      assert(native.includes(language === "hi" ? "ताश की गड्डी में" : "ਤਾਸ਼ ਦੀ ਗੱਡੀ ਵਿੱਚ"));
    }
    if (["PRB-QL-306", "PRB-QL-314", "PRB-QL-322"].includes(entry.qlId)) {
      assert(native.includes(language === "hi" ? "न होने वाले पत्तों की संख्या" : "ਨਾ ਹੋਣ ਵਾਲੇ ਪੱਤਿਆਂ ਦੀ ਗਿਣਤੀ"));
    }
  }
}

assert.equal(checkedSurfaceCount, 18);
console.log(JSON.stringify({ status: "PASS", affectedQlCount: 9, checkedSurfaceCount }));
