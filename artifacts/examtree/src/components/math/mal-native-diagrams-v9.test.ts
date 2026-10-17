import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  isAlligationDiagramData,
  AlligationDiagram,
} from "./AlligationDiagram";
import {
  isRatioAdjustmentDiagramData,
  RatioAdjustmentDiagram,
} from "./RatioAdjustmentDiagram";
import { diagramQuantity, diagramLabels } from "./diagram-labels";
import { runMal001QuestionStudioPipeline as run } from "../../../../api-server/src/quant-v4/topics/Arithmetic/subtopics/MixtureAndAlligation/MAL-001/question-studio-adapter";
import { localizeMalExplanationTextV9 as text } from "../../../../api-server/src/quant-v4/topics/Arithmetic/subtopics/MixtureAndAlligation/MAL-001/foundation/chapter-native-explanations-v9";
const marker =
  /\[\[EXAMTREE_(ALLIGATION|RATIO_ADJUSTMENT)_SVG_V1:([^\]]+)\]\]/g;
const display = new Set([
  "title",
  "label",
  "operation",
  "note",
  "quantity",
  "quantityUnit",
  "value",
  "conservedLabel",
  "accessibleText",
]);
const numberTokens = (s: string) => s.match(/\d+(?:\.\d+)?/g) ?? [];
function parity(a: any, b: any, key = "") {
  if (typeof a === "string") {
    if (display.has(key))
      assert.deepEqual(
        numberTokens(b),
        numberTokens(a),
        `diagram numeric field changed: ${key}`,
      );
    else assert.equal(b, a, `diagram structural field changed: ${key}`);
  } else if (Array.isArray(a)) {
    assert.equal(a.length, b.length);
    a.forEach((x, i) => parity(x, b[i], key));
  } else if (a && typeof a === "object") {
    assert.deepEqual(Object.keys(b), Object.keys(a));
    Object.entries(a).forEach(([k, v]) => parity(v, b[k], k));
  } else assert.equal(b, a);
}
let questions = 0,
  diagrams = 0,
  lines = 0,
  oldUnsafe = 0;
const rendered = new Set<string>();
const residualProse = new Set<string>();
function auditDiagrams(source: string, target: string, lang: "hi" | "pa") {
  const sourceMarkers = [...source.matchAll(marker)],
    targetMarkers = [...target.matchAll(marker)];
  assert.equal(targetMarkers.length, sourceMarkers.length);
  for (let d = 0; d < sourceMarkers.length; d++) {
    const a = JSON.parse(
      Buffer.from(sourceMarkers[d][2], "base64").toString("utf8"),
    );
    const encoded = targetMarkers[d][2];
    assert(
      /^[A-Za-z0-9_-]+$/.test(encoded),
      "frontend only recognizes base64url",
    );
    const b = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    parity(a, b);
    const alligation = sourceMarkers[d][1] === "ALLIGATION";
    assert(
      alligation ? isAlligationDiagramData(b) : isRatioAdjustmentDiagramData(b),
    );
    const labelCheck = (v: any, key = "") => {
      if (typeof v === "string" && display.has(key))
        assert(!/[A-Za-z]{2,}/.test(v), `untranslated label ${key}: ${v}`);
      else if (Array.isArray(v)) v.forEach((x) => labelCheck(x, key));
      else if (v && typeof v === "object")
        Object.entries(v).forEach(([k, x]) => labelCheck(x, k));
    };
    labelCheck(b);
    const tag = `${b.kind}:${lang}`;
    if (!rendered.has(tag)) {
      const html = renderToStaticMarkup(
        createElement(alligation ? AlligationDiagram : RatioAdjustmentDiagram, {
          diagram: b,
        } as any),
      );
      assert(html.includes("<svg"));
      assert(
        !/OPERATION|Target ratio|Before|After|Below target|Above target/.test(
          html,
        ),
        "renderer captions must be native",
      );
      rendered.add(tag);
    }
    diagrams++;
  }
}
function strings(v: any): string[] {
  if (typeof v === "string") return [v];
  if (Array.isArray(v)) return v.flatMap(strings);
  return v && typeof v === "object" ? Object.values(v).flatMap(strings) : [];
}
for (let i = 1; i <= 67; i++)
  for (let k = 0; k < 12; k++) {
    const cp =
      i <= 11 ? 1 : i <= 28 ? 2 : i <= 37 ? 3 : i <= 47 ? 4 : i <= 60 ? 5 : 6;
    const input = {
      questionLanguageId: `MAL-QL-${String(i).padStart(3, "0")}`,
      seed: `V9:${i}:${k}`,
    };
    const en = run(
      `MAL-CP-00${cp}` as any,
      { ...input, language: "en" } as any,
    );
    const original =
      en.explanation.visibleLines ??
      en.explanation.lines ??
      en.explanation.steps ??
      [];
    for (const lang of ["hi", "pa"] as const) {
      const native = run(
        `MAL-CP-00${cp}` as any,
        { ...input, language: lang } as any,
      );
      assert.equal(
        native.traceability.nativeExplanationRevision,
        "MAL-NATIVE-EXPLANATIONS-V9",
      );
      const localized =
        native.explanation.visibleLines ??
        native.explanation.lines ??
        native.explanation.steps ??
        [];
      assert.equal(localized.length, original.length);
      for (let index = 0; index < original.length; index++) {
        const result = text(original[index], lang);
        assert(
          result.authored,
          `${input.questionLanguageId}: unhandled visible explanation: ${original[index]}`,
        );
        assert.equal(localized[index], result.text);
        const prose = result.text
          .replace(
            /\[\[EXAMTREE_(?:ALLIGATION|RATIO_ADJUSTMENT)_SVG_V1:[^\]]+\]\]/g,
            "",
          )
          .replace(/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g, "");
        if (/[A-Za-z]{2,}/.test(prose)) residualProse.add(prose);

        lines++;
      }
      const originals = strings(en.explanation),
        natives = strings(native.explanation);
      assert.equal(natives.length, originals.length);
      originals.forEach((source, index) =>
        auditDiagrams(source, natives[index]!, lang),
      );
      questions++;
    }
  }
assert.deepEqual([...residualProse], [], "No untranslated calculation prose");
assert(diagrams > 0);
assert(rendered.has("TWO_COMPONENT:pa"));
assert(rendered.has("THREE_COMPONENT:hi"));
assert.equal(diagramQuantity("144 ਕਿਲੋਗ੍ਰਾਮ", "ਕਿਲੋਗ੍ਰਾਮ"), "144 ਕਿਲੋਗ੍ਰਾਮ");
assert.equal(diagramQuantity("144", "ਕਿਲੋਗ੍ਰਾਮ"), "144 ਕਿਲੋਗ੍ਰਾਮ");
assert.equal(diagramLabels("English title").before, "Before");
console.log(
  "MAL_NATIVE_EXPLANATIONS_V9",
  JSON.stringify({
    questions,
    lines,
    diagrams,
    renderedKinds: [...rendered],
    lifecycleUnchanged: true,
  }),
);
