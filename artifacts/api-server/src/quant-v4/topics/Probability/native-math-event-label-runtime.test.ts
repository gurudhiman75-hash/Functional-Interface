import assert from "node:assert/strict";
import { runPrb001Pipeline } from "./PRB-001";
import { runPrb002Pipeline } from "./PRB-002";
import { listProbabilityMl05QlEntries, renderProbabilityNativePreview } from "./multilingual-runtime";
import { listProbabilityNativeMathEventLabels } from "./shared/native-math-event-labels";

const labels = listProbabilityNativeMathEventLabels();
let nativeSurfaceCount = 0;
let sourceLabelOccurrenceCount = 0;
let localizedSurfaceCount = 0;

for (const entry of listProbabilityMl05QlEntries()) {
  const seed = `native-math-label-runtime:${entry.qlId}`;
  const source = entry.packageId === "PRB-001"
    ? runPrb001Pipeline(entry.cpId as any, { questionLanguageId: entry.qlId, seed })
    : runPrb002Pipeline(entry.cpId as any, { questionLanguageId: entry.qlId, seed });
  const english = source.explanation.lines.join("\n");
  const sourceLabels = labels.filter((label) => english.includes(`P\\!\\left(${label}\\right)`));
  sourceLabelOccurrenceCount += sourceLabels.length;

  for (const language of ["hi", "pa"] as const) {
    const native = renderProbabilityNativePreview(source, language).presentation.explanation.lines.join("\n");
    nativeSurfaceCount += 1;
    let localizedOnSurface = false;
    for (const label of labels) {
      assert(
        !native.includes(`P\\!\\left(${label}\\right)`),
        `${entry.qlId}/${language}: English event label survived inside native probability notation: ${label}`,
      );
      if (english.includes(`P\\!\\left(${label}\\right)`)) localizedOnSurface = true;
    }
    if (localizedOnSurface) localizedSurfaceCount += 1;
  }
}

assert.equal(nativeSurfaceCount, 432);
assert(sourceLabelOccurrenceCount > 0, "Runtime sweep did not exercise any source event labels.");
assert(localizedSurfaceCount > 0, "Runtime sweep did not exercise localized event-label surfaces.");

console.log(JSON.stringify({
  status: "PASS",
  nativeSurfaceCount,
  sourceLabelOccurrenceCount,
  localizedSurfaceCount,
  englishEventLabelLeakCount: 0,
}));
