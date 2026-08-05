import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const outputDirectory = resolve(process.argv[2] ?? "cp007-v2-output");
const reviewPath = resolve(outputDirectory, "blr-cp007-v2-review.html");
let html = readFileSync(reviewPath, "utf8");

if (html.includes('class="analysis-panel"') || html.includes('class="diagram-panel"')) {
  throw new Error("CP-007 V2 review HTML was already polished.");
}

html = html
  .replace(
    "</style>",
    '.analysis-panel,.diagram-panel{margin:14px 0;border:1px solid #dce2ea;border-radius:9px;background:#fafbfd}.analysis-panel>summary,.diagram-panel>summary{cursor:pointer;font-weight:700;padding:11px 13px}.analysis-panel .analyses{padding:0 11px 11px}.diagram-panel .diagram{margin:0 11px 11px}</style>',
  )
  .replaceAll(
    '<div class="analyses">',
    '<details class="analysis-panel"><summary>Why each option works or fails</summary><div class="analyses">',
  )
  .replaceAll(
    '</div><figure class="diagram">',
    '</div></details><details class="diagram-panel"><summary>Family diagram (optional)</summary><figure class="diagram">',
  )
  .replaceAll(
    '</figure></div><details class="proof">',
    '</figure></details></div><details class="proof">',
  );

const analysisPanels = (html.match(/class="analysis-panel"/gu) ?? []).length;
const diagramPanels = (html.match(/class="diagram-panel"/gu) ?? []).length;
if (analysisPanels !== 168 || diagramPanels !== 168) {
  throw new Error(
    `Expected 168 progressive-disclosure panels, got analyses=${analysisPanels}, diagrams=${diagramPanels}.`,
  );
}

writeFileSync(reviewPath, html);
console.log(
  JSON.stringify(
    {
      status: "CP007_V2_REVIEW_HTML_POLISHED",
      analysisPanels,
      optionalDiagramPanels: diagramPanels,
    },
    null,
    2,
  ),
);
