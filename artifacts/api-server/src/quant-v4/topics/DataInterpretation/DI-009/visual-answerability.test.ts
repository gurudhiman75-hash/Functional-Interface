import { generateDi009HistogramSet } from "./histogram-set";
import { renderDiHistogramSvg } from "../visuals/histogram-svg";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const profiles = ["SSC_CGL_TIER_I", "SSC_CGL_TIER_II"] as const;
let sets = 0;
let bars = 0;

for (const examProfile of profiles) {
  for (let index = 0; index < 120; index += 1) {
    const set = generateDi009HistogramSet({ seed: `DI009-VISUAL-ANSWERABILITY-${examProfile}-${index}`, examProfile });
    const svg = renderDiHistogramSvg(set.stimulus);
    set.stimulus.bins.forEach((bin, binIndex) => {
      const frequency = new RegExp(`data-frequency-value="${binIndex}"[^>]*>${bin.frequency}<\\/text>`, "u");
      assert(frequency.test(svg), `DI-009 frequency ${bin.frequency} is not visibly labelled for bin ${binIndex}.`);
      assert(svg.includes(`data-class-interval-label="${binIndex}"`), `DI-009 class interval label missing for bin ${binIndex}.`);
      bars += 1;
    });
    sets += 1;
  }
}

console.log(JSON.stringify({
  status: "PASS_DI_009_VISUAL_ANSWERABILITY_V1",
  sets,
  bars,
  exactFrequencyLabels: true,
  classIntervalsVisible: true,
}));
