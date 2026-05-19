import type { SvgRenderResult } from "../contracts/svg-visualization-types";
import { svgToDataUri } from "./svg-renderer";

export interface SvgExportBundle {
  svg: string;
  html: string;
  svgDataUri: string;
  png: {
    supported: boolean;
    mimeType: "image/png";
    dataUri?: string;
    note?: string;
  };
}

export function createSvgExportBundle(result: SvgRenderResult): SvgExportBundle {
  return {
    svg: result.svg,
    html: result.html,
    svgDataUri: svgToDataUri(result.svg),
    png: {
      supported: false,
      mimeType: "image/png",
      note: "PNG rasterization is exposed as an export target; runtime rasterization can be attached by the hosting service.",
    },
  };
}

export async function renderSvgPngDataUri(
  result: SvgRenderResult,
): Promise<string> {
  const runtimeImport = new Function(
    "specifier",
    "return import(specifier)",
  ) as (specifier: string) => Promise<typeof import("@napi-rs/canvas")>;
  const { createCanvas, loadImage } = await runtimeImport("@napi-rs/canvas");
  const canvas = createCanvas(result.width, result.height);
  const context = canvas.getContext("2d");
  const image = await loadImage(Buffer.from(result.svg, "utf8"));
  context.drawImage(image, 0, 0, result.width, result.height);
  return canvas.toDataURL("image/png");
}
