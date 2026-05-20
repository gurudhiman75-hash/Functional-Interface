import type {
  LanguageCode,
  LocalizedRealization,
} from "../contracts/language-contracts";
import type { CanonicalPercentageProblem } from "../../canonical/percentage-types";
import type { EditorialRealization } from "../../editorial/editorial-types";
import type { RealizationProfile } from "../../editorial/realization-profiles";
import type { ReasoningGraph } from "../../reasoning/reasoning-graph-types";
import type { EditorialIntent } from "../intents/editorial-intents";
import { extractEditorialIntents } from "../intents/intent-extractor";
import { getLanguageRenderer } from "../languages";
import { renderLocalizedStem } from "./stem-renderer";
import { localizeReasoningFragments } from "../../semantic/reasoningLexicon";
import { normalizeTeacherExplanation } from "../../quality/teacher-explanation-normalizer";
import { semanticAnswerText } from "../../editorial/contextual-humanization";

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

function incompleteFinalLine(line: string | undefined) {
  const trimmed = String(line ?? "").trim();
  return (
    trimmed.length === 0 ||
    /[:=]\s*$/u.test(trimmed) ||
    /(?:[+\-*/xX]|\()\s*$/u.test(trimmed) ||
    !/\d/u.test(trimmed)
  );
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
    const localizedText = normalizeTeacherExplanation(
      localizeReasoningFragments(renderedText, input.language),
      input.language,
    );
    return {
      intentKey: intent.key,
      sourceText: intent.sourceText,
      renderedText: localizedText,
      kind: intent.kind,
      fallbackUsed:
        input.language !== "en" &&
        intent.kind !== "blank" &&
        intent.kind !== "equation" &&
        localizedText === intent.fallbackText,
    };
  });
  const displayLines = [
    ...suppressRenderedLabelCollisions(lines),
  ];
  const lastNonBlank = [...displayLines]
    .reverse()
    .find((line) => line.renderedText.trim().length > 0);

  if (incompleteFinalLine(lastNonBlank?.renderedText)) {
    const answer = semanticAnswerText(input.problem);
    const finalIntent: EditorialIntent = {
      key: /%/u.test(answer) ? "ending.required_percentage" : "ending.required_value",
      kind: "ending",
      sourceText: `Required answer = ${answer}`,
      fallbackText: `Required answer = ${answer}`,
      params: {
        value: answer,
      },
    };
    const renderedText = normalizeTeacherExplanation(
      localizeReasoningFragments(
        renderer.renderIntent(finalIntent, {
          problem: input.problem,
          graph: input.graph,
          editorial: input.editorial,
          intent: finalIntent,
        }),
        input.language,
      ),
      input.language,
    );
    displayLines.push({
      intentKey: finalIntent.key,
      sourceText: finalIntent.sourceText,
      renderedText,
      kind: finalIntent.kind,
      fallbackUsed: false,
    });
  }
  const missingIntents = [
    ...new Set(
      lines
        .filter((line) => line.fallbackUsed)
        .map((line) => line.intentKey),
    ),
  ];
  const stem = renderLocalizedStem(input);

  const explanation = displayLines.map((line) => line.renderedText).join("\n");

  return {
    language: input.language,
    stem,
    explanation,
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
