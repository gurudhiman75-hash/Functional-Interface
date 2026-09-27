import { generateDi003GroupedBarV2Set } from "./grouped-bar-set-v2";
import { renderDiGroupedBarSvg } from "../visuals/grouped-bar-svg";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const profiles = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"] as const;
let sets = 0;
let plottedValues = 0;

for (const examProfile of profiles) {
  for (let index = 0; index < 120; index += 1) {
    const set = generateDi003GroupedBarV2Set({ seed: `DI003-VISUAL-ANSWERABILITY-${examProfile}-${index}`, examProfile });
    const svg = renderDiGroupedBarSvg({
      title: set.stimulus.title,
      yAxisLabel: set.stimulus.yAxisLabel,
      seriesALabel: set.stimulus.series[0].label,
      seriesBLabel: set.stimulus.series[1].label,
      points: set.stimulus.points,
    });
    assert(svg.includes('data-bar-value-labels="true"'), "DI-003 renderer must declare visible bar-value labels.");

    set.stimulus.points.forEach((point, pointIndex) => {
      const a = new RegExp(`data-series-a-value="${pointIndex}"[^>]*>${point.seriesA}<\\/text>`, "u");
      const b = new RegExp(`data-series-b-value="${pointIndex}"[^>]*>${point.seriesB}<\\/text>`, "u");
      assert(a.test(svg), `DI-003 Series A value ${point.seriesA} is not visibly labelled at category ${pointIndex}.`);
      assert(b.test(svg), `DI-003 Series B value ${point.seriesB} is not visibly labelled at category ${pointIndex}.`);
      plottedValues += 2;
    });
    sets += 1;
  }
}

console.log(JSON.stringify({
  status: "PASS_DI_003_VISUAL_ANSWERABILITY_V1",
  sets,
  plottedValues,
  exactValueLabels: true,
}));
