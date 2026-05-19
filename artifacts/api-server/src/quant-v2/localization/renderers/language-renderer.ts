import type {
  LanguageCode,
  LocalizedRealization,
} from "../contracts/language-contracts";
import type { CanonicalPercentageProblem } from "../../canonical/percentage-types";
import type { EditorialRealization } from "../../editorial/editorial-types";
import type { RealizationProfile } from "../../editorial/realization-profiles";
import type { ReasoningGraph } from "../../reasoning/reasoning-graph-types";
import { extractEditorialIntents } from "../intents/intent-extractor";
import { getLanguageRenderer } from "../languages";
import { renderLocalizedStem } from "./stem-renderer";

function normalizedRenderedLabel(text: string) {
  return text
    .replace(/[:=]\s*$/u, "")
    .replace(/\s+(?:is|are)$/iu, "")
    .trim()
    .toLowerCase();
}

function suppressRenderedLabelCollisions<T extends { renderedText: string }>(
  lines: readonly T[],
) {
  return lines.filter((line, index) => {
    const previous = lines[index - 1];
    if (!previous) {
      return true;
    }

    if (!previous.renderedText.trim().endsWith(":")) {
      return true;
    }
    if (!line.renderedText.trim().endsWith("=")) {
      return true;
    }

    return (
      normalizedRenderedLabel(previous.renderedText) !==
      normalizedRenderedLabel(line.renderedText)
    );
  });
}

export function renderLocalizedRealization(input: {
  language: LanguageCode;
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  editorial: EditorialRealization;
  realizationProfile?: RealizationProfile;
}): LocalizedRealization {
  const renderer = getLanguageRenderer(input.language);
  const intents = extractEditorialIntents(input.editorial);
  const lines = intents.map((intent) => {
    const renderedText = renderer.renderIntent(intent, {
      problem: input.problem,
      graph: input.graph,
      editorial: input.editorial,
      intent,
    });
    return {
      intentKey: intent.key,
      sourceText: intent.sourceText,
      renderedText,
      kind: intent.kind,
      fallbackUsed:
        input.language !== "en" &&
        intent.kind !== "blank" &&
        intent.kind !== "equation" &&
        renderedText === intent.fallbackText,
    };
  });
  const displayLines = suppressRenderedLabelCollisions(lines);
  const missingIntents = [
    ...new Set(
      lines
        .filter((line) => line.fallbackUsed)
        .map((line) => line.intentKey),
    ),
  ];
  const stem = renderLocalizedStem(input);

  return {
    language: input.language,
    stem,
    explanation: displayLines.map((line) => line.renderedText).join("\n"),
    lines: displayLines,
    coverage: {
      totalIntentLines: lines.filter(
        (line) => line.kind !== "blank" && line.kind !== "equation",
      ).length,
      localizedIntentLines: lines.filter(
        (line) =>
          line.kind !== "blank" &&
          line.kind !== "equation" &&
          !line.fallbackUsed,
      ).length,
      fallbackCount: lines.filter((line) => line.fallbackUsed).length,
      missingIntents,
    },
  };
}
