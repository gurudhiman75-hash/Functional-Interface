import type { StructuredExplanationBlock } from "./contracts";

export const EEV2_COMPATIBILITY_PROJECTION_VERSION = "1.0.0" as const;

function serializeVisibleBlock(
  block: StructuredExplanationBlock,
): string | null {
  if (block.visibility.state !== "visible") return null;

  const text = block.renderedContent.text;
  const mathLatex = block.renderedContent.mathLatex;

  if (text && mathLatex) return `${text} | $$${mathLatex}$$`;
  if (text) return text;
  if (mathLatex) return `$$${mathLatex}$$`;
  return null;
}

export function projectCompatibilityLines(
  blocks: readonly StructuredExplanationBlock[],
): readonly string[] {
  const lines: string[] = [];
  for (const block of blocks) {
    const line = serializeVisibleBlock(block);
    if (line !== null) lines.push(line);
  }
  return lines;
}
