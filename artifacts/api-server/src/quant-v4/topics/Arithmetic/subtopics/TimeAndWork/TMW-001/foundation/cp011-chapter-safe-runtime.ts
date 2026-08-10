import { runTmwCp011Pipeline } from "./cp011-runtime";
import { runTmwCp011LocalizedPipeline } from "./cp011-localized-runtime";
import type { Tmw001ChapterLanguage } from "./chapter-localized-runtime";

function candidateSeed(seed: string, attempt: number): string {
  return attempt === 0 ? seed : `${seed}|cp011-valid-package:${attempt}`;
}

/**
 * CP-011 has a few mathematically valid sequence states where two or more
 * misconception candidates collapse onto the same displayed answer. Such a
 * state cannot form a fair four-option MCQ and is therefore rejected at the
 * chapter boundary rather than padded with an arbitrary distractor.
 *
 * English source viability is checked first for every candidate seed so all
 * three languages select from the same deterministic source-state sequence.
 */
export function runTmwCp011ChapterSafePipeline(input: {
  questionLanguageId: string;
  seed: string;
  language: Tmw001ChapterLanguage;
}): any {
  const MAX_ATTEMPTS = 24;
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const seed = candidateSeed(input.seed, attempt);
    try {
      const english = runTmwCp011Pipeline(input.questionLanguageId, seed);
      if (!english.validation.valid) {
        lastError = new Error(english.validation.errors.join(" | "));
        continue;
      }

      if (input.language === "en") {
        return { ...english, seed: input.seed };
      }

      const localized = runTmwCp011LocalizedPipeline({
        questionLanguageId: input.questionLanguageId,
        seed,
        language: input.language,
      });
      if (!localized.validation.valid) {
        lastError = new Error(localized.validation.errors.join(" | "));
        continue;
      }
      return { ...localized, seed: input.seed };
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(
    `${input.questionLanguageId}: failed to obtain a valid CP-011 four-option package after ${MAX_ATTEMPTS} attempts: ${String(lastError)}`,
  );
}
