import { renderMen001ReviewIllustration as renderCore } from "./human-review-svg-core";
import type { Men001ExplanationIllustration } from "./types";

function descriptorFor(illustration: Men001ExplanationIllustration, solveMode: string) {
  const labels = illustration.labels as Record<string, string>;
  return `${solveMode} ${illustration.accessibleText} ${Object.values(labels).join(" ")}`;
}

function renderNonOverlappingRectangles(illustration: Men001ExplanationIllustration) {
  const labels = illustration.labels as Record<string, string>;
  return `<svg class="mensuration-diagram" viewBox="0 0 440 260" role="img" aria-label="${illustration.accessibleText}" xmlns="http://www.w3.org/2000/svg">
    <title>${illustration.accessibleText}</title>
    <style>.piece-a{fill:#dceaf7}.piece-b{fill:#f2dfc5}</style>
    <rect x="60" y="70" width="210" height="150" class="shape piece-a"/>
    <rect x="270" y="125" width="115" height="95" class="shape piece-b"/>
    <line x1="270" y1="125" x2="270" y2="220" class="guide omitted"/>
    <text x="160" y="145" text-anchor="middle" class="diagram-label">${labels.primaryShape}</text>
    <text x="327" y="177" text-anchor="middle" class="diagram-label">${labels.secondaryShape}</text>
    <text x="220" y="42" text-anchor="middle" class="diagram-label">${labels.operation}</text>
  </svg>`;
}

export function renderMen001ReviewIllustration(
  illustration: Men001ExplanationIllustration,
  solveMode = "",
  answer = "",
) {
  const labels = illustration.labels as Record<string, string>;
  const descriptor = descriptorFor(illustration, solveMode);
  if (
    illustration.kind === "COMPOSITE_AREA_PARTS" &&
    /second rectangle/i.test(descriptor) &&
    !/overlap:|overlap in a common|subtract the common overlap/i.test(descriptor)
  ) {
    return renderNonOverlappingRectangles(illustration);
  }

  let rendered = renderCore(illustration, solveMode, answer);

  if (
    illustration.kind === "CIRCLE_CENTRAL_ANGLE" &&
    !/sector/i.test(labels.measuredPart ?? "")
  ) {
    rendered = rendered.replace(/\s*<path d="[^"]+" class="sector-fill"\/>/, "");
  }

  if (
    illustration.kind === "COMPOSITE_AREA_PARTS" &&
    /corner rectangular cut-out|l-shaped/i.test(descriptor)
  ) {
    rendered = rendered.replace(
      "M70 45 H365 V215 H235 V135 H70 Z",
      "M70 45 H235 V135 H365 V215 H70 Z",
    );
  }

  return rendered;
}
