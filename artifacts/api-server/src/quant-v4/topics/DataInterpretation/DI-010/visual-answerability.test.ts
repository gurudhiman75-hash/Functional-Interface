import { generateDi010FrequencyPolygonSet } from "./frequency-polygon-set";
import { renderDiFrequencyPolygonSvg } from "../visuals/frequency-polygon-svg";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function fmt(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

const profiles = ["SSC_CGL_TIER_I", "SSC_CGL_TIER_II"] as const;
let sets = 0;
let points = 0;

for (const examProfile of profiles) {
  for (let index = 0; index < 120; index += 1) {
    const set = generateDi010FrequencyPolygonSet({ seed: `DI010-VISUAL-ANSWERABILITY-${examProfile}-${index}`, examProfile });
    const svg = renderDiFrequencyPolygonSvg(set.stimulus);
    assert(svg.includes('data-value-labels="true"'), "DI-010 renderer must declare visible point-value labels.");

    set.stimulus.classes.forEach((item, pointIndex) => {
      const frequency = new RegExp(`data-frequency-value="${pointIndex}"[^>]*>${fmt(item.frequency)}<\\/text>`, "u");
      const classMark = new RegExp(`data-x-label="${pointIndex}"[^>]*>${fmt(item.classMark)}<\\/text>`, "u");
      assert(frequency.test(svg), `DI-010 frequency ${item.frequency} is not visibly labelled at point ${pointIndex}.`);
      assert(classMark.test(svg), `DI-010 class mark ${item.classMark} is not visibly labelled at point ${pointIndex}.`);
      points += 1;
    });
    sets += 1;
  }
}

console.log(JSON.stringify({
  status: "PASS_DI_010_VISUAL_ANSWERABILITY_V1",
  sets,
  points,
  exactFrequencyLabels: true,
  classMarksVisible: true,
}));
