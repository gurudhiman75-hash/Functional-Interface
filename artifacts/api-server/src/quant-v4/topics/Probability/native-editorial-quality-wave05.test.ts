import assert from "node:assert/strict";
import { runPrb001Pipeline } from "./PRB-001";
import { listProbabilityMl05QlEntries, renderProbabilityNativePreview } from "./multilingual-runtime";

const DIRECT_CONTEXTS = new Set(["DEFECTIVE_BULBS", "RED_BALLS", "MATHEMATICS_BOOKS"]);
const REVERSE_FAVOURABLE_CONTEXTS = new Set(["defective bulbs", "qualified candidates", "female employees"]);
const REVERSE_TOTAL_CONTEXTS = new Set(["red balls", "approved loan applications", "successful candidates"]);

function expectedMarker(source: ReturnType<typeof runPrb001Pipeline>, language: "hi" | "pa"): string | null {
  const scenario = String(source.parameters.scenario ?? "");
  const context = String(source.parameters.context ?? "").toLowerCase();

  if (source.solveMode === "findDirectProbability" && DIRECT_CONTEXTS.has(scenario)) {
    if (scenario === "DEFECTIVE_BULBS") return language === "hi" ? "बैच में" : "ਬੈਚ ਵਿੱਚ";
    if (scenario === "RED_BALLS") return language === "hi" ? "बैग में" : "ਬੈਗ ਵਿੱਚ";
    return language === "hi" ? "शेल्फ पर" : "ਸ਼ੈਲਫ਼ ਉੱਤੇ";
  }
  if (["findFavourableOutcomeCount", "findMissingEventCountFromProbability"].includes(source.solveMode) && REVERSE_FAVOURABLE_CONTEXTS.has(context)) {
    if (context === "defective bulbs") return language === "hi" ? "बल्ब" : "ਬਲਬ";
    if (context === "qualified candidates") return language === "hi" ? "अभ्यर्थियों" : "ਉਮੀਦਵਾਰਾਂ";
    return language === "hi" ? "कंपनी में" : "ਕੰਪਨੀ ਵਿੱਚ";
  }
  if (source.solveMode === "findTotalOutcomeCount" && REVERSE_TOTAL_CONTEXTS.has(context)) {
    if (context === "red balls") return language === "hi" ? "लाल गेंदें" : "ਲਾਲ ਗੇਂਦਾਂ";
    if (context === "approved loan applications") return language === "hi" ? "ऋण आवेदन" : "ਕਰਜ਼ਾ ਅਰਜ਼ੀਆਂ";
    return language === "hi" ? "परीक्षा में" : "ਪ੍ਰੀਖਿਆ ਵਿੱਚ";
  }
  return null;
}

let checkedSurfaceCount = 0;
const checkedQlIds = new Set<string>();

for (const entry of listProbabilityMl05QlEntries()) {
  if (entry.packageId !== "PRB-001") continue;
  const source = runPrb001Pipeline(entry.cpId as any, {
    questionLanguageId: entry.qlId,
    seed: `ml05-parity:${entry.qlId}`,
  });
  assert(source.validation.valid, `${entry.qlId}: English authority must validate`);

  for (const language of ["hi", "pa"] as const) {
    const marker = expectedMarker(source, language);
    if (!marker) continue;

    const preview = renderProbabilityNativePreview(source, language);
    const stem = preview.presentation.stem;
    checkedSurfaceCount += 1;
    checkedQlIds.add(entry.qlId);

    assert(stem.includes(marker), `${entry.qlId}/${language}: concrete source context was not preserved: ${stem}`);
    assert.equal(preview.presentation.questionStudioEnabled, false);
    assert.equal(preview.presentation.publiclyPublishable, false);
    assert.equal(preview.presentation.options[preview.presentation.correctIndex], source.options[source.correctIndex]);
    assert.equal(preview.presentation.answer, source.answer);

    for (const bad of language === "hi"
      ? ["समान रूप से संभावित परिणाम", "अनुकूल परिणामों की संख्या कितनी"]
      : ["ਇੱਕੋ-ਜਿਹੀ ਸੰਭਾਵਨਾ ਵਾਲੇ ਨਤੀਜੇ", "ਅਨੁਕੂਲ ਨਤੀਜਿਆਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ"]) {
      assert(!stem.includes(bad), `${entry.qlId}/${language}: abstract fallback survived: ${bad}\n${stem}`);
    }
  }
}

assert(checkedQlIds.size > 0, "Wave05 must exercise at least one canonical classical QL.");
assert.equal(checkedSurfaceCount, checkedQlIds.size * 2, "Every exercised QL must pass in both Hindi and Punjabi.");
console.log(JSON.stringify({ status: "PASS", affectedQlCount: checkedQlIds.size, checkedSurfaceCount }));
