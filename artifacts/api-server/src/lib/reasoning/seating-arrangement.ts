import type {
  DifficultyLabel,
  ExamProfileId,
  Pattern,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import { seatingArrangementMotifs } from "../motifs/seating-arrangement";
import {
  createAnySeatingScenario,
  createLinearSeatingScenario,
} from "./seating-engine";
import {
  buildSeatingExplanation,
  buildSeatingOptions,
  buildSeatingStem,
} from "./seating-realizer";

function allowsLinearFallback(
  pattern?: Pattern,
) {
  if (!pattern) {
    return true;
  }

  const text = `${pattern.topic} ${pattern.subtopic}`.toLowerCase();

  return ![
    "circular",
    "square",
    "rectangular",
    "double row",
    "double-row",
    "parallel row",
    "parallel-row",
  ].some((token) =>
    text.includes(token),
  );
}

export function createSeatingScenario(
  motif: QuantMotif,
  difficulty: DifficultyLabel,
  pattern?: Pattern,
) {
  const canFallbackToLinear =
    allowsLinearFallback(pattern);

  try {
    return createAnySeatingScenario(
      motif,
      difficulty,
      pattern,
    );
  } catch {
    if (canFallbackToLinear) {
      try {
        const linearScenario =
          createLinearSeatingScenario(
            motif,
            difficulty,
            pattern,
          );

        return {
          ...linearScenario,
          validationWarnings: [
            ...linearScenario.validationWarnings,
            "Primary seating generation fallback used a linear arrangement path.",
          ],
        };
      } catch {
        // keep falling through
      }
    }

    const safeMotifs = [
      motif,
      seatingArrangementMotifs.find(
        (entry) =>
          entry.id ===
          "neighbor_clue_linear",
      ),
      seatingArrangementMotifs.find(
        (entry) =>
          entry.id ===
          "relative_position_clue",
      ),
      seatingArrangementMotifs.find(
        (entry) =>
          entry.id ===
          "direct_clue_linear",
      ),
    ].filter(
      (
        entry,
      ): entry is QuantMotif =>
        Boolean(entry),
    );

    const safeDifficulties:
      DifficultyLabel[] =
      difficulty === "Hard"
        ? ["Medium", "Easy"]
        : difficulty === "Medium"
          ? ["Easy"]
          : ["Easy"];

    for (const safeMotif of safeMotifs) {
      for (const safeDifficulty of safeDifficulties) {
        try {
          const fallbackScenario =
            canFallbackToLinear
              ? createLinearSeatingScenario(
                safeMotif,
                safeDifficulty,
                pattern,
              )
              : createAnySeatingScenario(
                safeMotif,
                safeDifficulty,
                pattern,
              );

          return {
            ...fallbackScenario,
            validationWarnings: [
              ...fallbackScenario.validationWarnings,
              `Primary seating generation fallback used motif ${safeMotif.id} at ${safeDifficulty} difficulty.`,
            ],
          };
        } catch {
          continue;
        }
      }
    }
  }

  const lastResortMotif =
    seatingArrangementMotifs.find(
      (entry) =>
        entry.id ===
        "neighbor_clue_linear",
    ) ??
    seatingArrangementMotifs[0] ??
    motif;
  const linearFallback =
    createLinearSeatingScenario(
      lastResortMotif,
      "Easy",
      pattern,
    );

  return {
    ...linearFallback,
    validationWarnings: [
      ...linearFallback.validationWarnings,
      "Requested seating profile could not be generated reliably; returned a stable linear fallback.",
    ],
  };
}

export function buildSeatingStemForQuestion(
  scenario: ReturnType<
    typeof createAnySeatingScenario
  >,
  examProfile: ExamProfileId,
  wordingStyle:
    | "concise"
    | "balanced"
    | "inference-heavy",
) {
  return buildSeatingStem(
    scenario,
    examProfile,
    wordingStyle,
  );
}

export function buildSeatingExplanationForQuestion(
  scenario: ReturnType<
    typeof createAnySeatingScenario
  >,
) {
  return buildSeatingExplanation(
    scenario,
  );
}

export function buildSeatingOptionsForQuestion(
  scenario: ReturnType<
    typeof createAnySeatingScenario
  >,
) {
  return buildSeatingOptions(
    scenario,
  );
}
