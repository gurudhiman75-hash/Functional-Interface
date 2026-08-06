export type DetectedSeriesRenderingContract =
  | {
      kind: "CASE_MARKER";
      intro: string;
      seriesLine: string;
      markerDescriptions: string[];
    }
  | {
      kind: "PERIODIC_GAP_LINE";
      intro: string;
      seriesLine: string;
      markerDescriptions: [];
    };

function splitLastContentLine(content: string): { intro: string; line: string } {
  const lines = content.split("\n");
  let index = lines.length - 1;
  while (index >= 0 && !lines[index]?.trim()) index -= 1;
  if (index < 0) return { intro: "", line: "" };
  return {
    intro: lines.slice(0, index).join("\n").trim(),
    line: lines[index]!.trim(),
  };
}

function caseMarkerDescriptions(line: string): string[] {
  const descriptions: string[] = [];
  for (const [groupIndex, group] of line.split(",").map((value) => value.trim()).entries()) {
    for (const [characterIndex, character] of [...group].entries()) {
      if (/[a-z]/.test(character)) {
        descriptions.push(
          `lowercase ${character} at position ${characterIndex + 1} of group ${groupIndex + 1}`,
        );
      }
    }
  }
  return descriptions;
}

export function detectSeriesRenderingContract(
  content: string | number | null | undefined,
): DetectedSeriesRenderingContract | null {
  const text = typeof content === "string" ? content : content == null ? "" : String(content);
  const { intro, line } = splitLastContentLine(text);
  if (!line) return null;

  const markerDescriptions = caseMarkerDescriptions(line);
  const markerShape =
    line.includes(",") &&
    /^[A-Za-z]+(?:\s*,\s*[A-Za-z?]+){2,}$/.test(line) &&
    markerDescriptions.length > 0;
  if (markerShape) {
    return {
      kind: "CASE_MARKER",
      intro,
      seriesLine: line,
      markerDescriptions,
    };
  }

  const gapTokens = line.split(/\s+/).filter(Boolean);
  const periodicGapShape =
    !line.includes(",") &&
    gapTokens.length >= 10 &&
    gapTokens.every((token) => token === "_" || /^[A-Za-z]$/.test(token)) &&
    gapTokens.includes("_");
  if (periodicGapShape) {
    return {
      kind: "PERIODIC_GAP_LINE",
      intro,
      seriesLine: line,
      markerDescriptions: [],
    };
  }

  return null;
}
