import assert from "node:assert/strict";
import { runPrb002Pipeline } from "./PRB-002";
import { listProbabilityMl05QlEntries, renderProbabilityNativePreview } from "./multilingual-runtime";

const QLS = ["PRB-QL-602", "PRB-QL-608", "PRB-QL-614", "PRB-QL-620"] as const;
const catalog = listProbabilityMl05QlEntries();
let checkedSurfaceCount = 0;
for (const qlId of QLS) {
  const entry = catalog.find((candidate) => candidate.qlId === qlId);
  assert(entry && entry.packageId === "PRB-002", `${qlId}: PRB-002 catalog entry missing`);
  const source = runPrb002Pipeline(entry.cpId as any, { questionLanguageId: qlId, seed: `ml05-parity:${qlId}` });
  assert(source.validation.valid, `${qlId}: canonical English source must validate`);
  for (const language of ["hi", "pa"] as const) {
    const native = renderProbabilityNativePreview(source, language).presentation.explanation.lines.join("\n");
    checkedSurfaceCount += 1;
    assert(!native.includes("है—"), `${qlId}/${language}: literal Hindi face-card construction survived`);
    assert(!native.includes("ਹੈ—"), `${qlId}/${language}: literal Punjabi face-card construction survived`);
    assert(
      native.includes(language === "hi"
        ? "पत्ता फेस कार्ड दिया गया है, इसलिए अब कुल संभावित पत्ते केवल 12 गुलाम, बेगम और बादशाह हैं।"
        : "ਪੱਤਾ ਫੇਸ ਕਾਰਡ ਦਿੱਤਾ ਹੋਇਆ ਹੈ, ਇਸ ਲਈ ਹੁਣ ਕੁੱਲ ਸੰਭਵ ਪੱਤੇ ਕੇਵਲ 12 ਗੁਲਾਮ, ਬੇਗਮ ਅਤੇ ਬਾਦਸ਼ਾਹ ਹਨ।"),
      `${qlId}/${language}: natural conditional-card explanation is missing`,
    );
  }
}
assert.equal(checkedSurfaceCount, 8);
console.log(JSON.stringify({ status: "PASS", checkedSurfaceCount, affectedQlCount: 4 }));
