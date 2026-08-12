import assert from "node:assert/strict";
import { runPrb001Pipeline } from "./PRB-001";
import { runPrb002Pipeline } from "./PRB-002";
import { listProbabilityMl05QlEntries, renderProbabilityNativePreview } from "./multilingual-runtime";

const JAR_QLS = new Set(["PRB-QL-501", "PRB-QL-509", "PRB-QL-517"]);
const POUCH_QLS = new Set(["PRB-QL-503", "PRB-QL-511", "PRB-QL-519"]);
let nativeSurfaceCount = 0;
let jarSurfaceCount = 0;
let pouchSurfaceCount = 0;

for (const entry of listProbabilityMl05QlEntries()) {
  const seed = `ml05-parity:${entry.qlId}`;
  const source = entry.packageId === "PRB-001"
    ? runPrb001Pipeline(entry.cpId as any, { questionLanguageId: entry.qlId, seed })
    : runPrb002Pipeline(entry.cpId as any, { questionLanguageId: entry.qlId, seed });
  assert(source.validation.valid, `${entry.qlId}: canonical English source must validate`);

  for (const language of ["hi", "pa"] as const) {
    const native = renderProbabilityNativePreview(source, language).presentation.explanation.lines.join("\n");
    nativeSurfaceCount += 1;
    assert(!native.includes("पात्र"), `${entry.qlId}/${language}: generic Hindi container leaked into native explanation`);
    assert(!native.includes("ਪਾਤਰ"), `${entry.qlId}/${language}: generic Punjabi container leaked into native explanation`);

    if (JAR_QLS.has(entry.qlId)) {
      jarSurfaceCount += 1;
      assert(
        native.includes(language === "hi" ? "उसी जार में" : "ਉਸੇ ਜਾਰ ਵਿੱਚ"),
        `${entry.qlId}/${language}: replacement explanation must preserve jar context`,
      );
    }
    if (POUCH_QLS.has(entry.qlId)) {
      pouchSurfaceCount += 1;
      assert(
        native.includes(language === "hi" ? "उसी पाउच में" : "ਉਸੇ ਪਾਊਚ ਵਿੱਚ"),
        `${entry.qlId}/${language}: replacement explanation must preserve pouch context`,
      );
    }
  }
}

assert.equal(nativeSurfaceCount, 432);
assert.equal(jarSurfaceCount, 6);
assert.equal(pouchSurfaceCount, 6);
console.log(JSON.stringify({ status: "PASS", nativeSurfaceCount, jarSurfaceCount, pouchSurfaceCount, genericContainerLeakCount: 0 }));
