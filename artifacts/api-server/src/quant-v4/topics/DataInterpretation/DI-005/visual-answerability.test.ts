import { generateDi005V2Set } from "./pie-set-v2";
import { renderDiPieSvg } from "../visuals/pie-svg";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const profiles = ["SSC_CGL_TIER_I", "BANKING_PRELIMS"] as const;
let sets = 0;
let visibleLabels = 0;
let hiddenLabels = 0;

for (const examProfile of profiles) {
  for (let index = 0; index < 120; index += 1) {
    const set = generateDi005V2Set({ seed: `DI005-VISUAL-ANSWERABILITY-${examProfile}-${index}`, examProfile });
    const svg = renderDiPieSvg(set.stimulus);

    const hidden = set.stimulus.slices.filter((slice) => slice.displayPercent === "?");
    assert(hidden.length === 1, "DI-005 must expose exactly one intentionally hidden sector percentage.");
    assert(set.stimulus.slices.reduce((sum, slice) => sum + slice.percent, 0) === 100, "DI-005 sector shares must total 100.");
    assert(svg.includes(`>${set.stimulus.totalLabel}: ${set.stimulus.totalValue} ${set.stimulus.unit}</text>`), "DI-005 total value must be visibly displayed.");

    set.stimulus.slices.forEach((slice, sliceIndex) => {
      if (slice.displayPercent === "?") {
        const hiddenLabel = new RegExp(`data-slice-label="${sliceIndex}"[^>]*>\?<\\/text>`, "u");
        assert(hiddenLabel.test(svg), `DI-005 hidden sector ${sliceIndex} must visibly show ?.`);
        hiddenLabels += 1;
      } else {
        const visible = new RegExp(`data-slice-label="${sliceIndex}"[^>]*>${slice.percent}%<\\/text>`, "u");
        assert(visible.test(svg), `DI-005 visible sector ${sliceIndex} lost its exact percentage label.`);
        visibleLabels += 1;
      }
    });
    sets += 1;
  }
}

console.log(JSON.stringify({
  status: "PASS_DI_005_VISUAL_ANSWERABILITY_V1",
  sets,
  visibleLabels,
  hiddenLabels,
  oneRecoverableHiddenSector: true,
  totalValueVisible: true,
}));
