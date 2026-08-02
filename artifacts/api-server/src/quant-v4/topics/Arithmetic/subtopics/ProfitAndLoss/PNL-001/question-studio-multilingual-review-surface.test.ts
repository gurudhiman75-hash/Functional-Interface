import { PNL_001_CANONICAL_REVIEW_LIBRARY } from "./question-studio-review.library";
import {
  buildPnl001LocalizedReviewSurface,
  type Pnl001ReviewLanguage,
} from "./question-studio-multilingual-review-surface";

type CanonicalEntry = Readonly<{
  qlId: string;
  cpId: string;
  stem: string;
  explanation: string;
  options: readonly [string, string, string, string];
  answer: string;
  correctIndex: number;
}>;
type CanonicalLibrary = Readonly<{
  entries: Readonly<Record<string, CanonicalEntry>>;
}>;

const canonical = PNL_001_CANONICAL_REVIEW_LIBRARY as CanonicalLibrary;
const languages = ["en", "hi", "pa"] as const satisfies readonly Pnl001ReviewLanguage[];
const cpCounts: Record<string, Record<string, number>> = {};
let surfaces = 0;
let englishIdentitySurfaces = 0;
let nativeSurfaces = 0;
let nativeMathJaxSurfaces = 0;
const failures: Array<{
  qlId: string;
  language: Pnl001ReviewLanguage;
  message: string;
}> = [];

for (const qlId of Object.keys(canonical.entries).sort()) {
  const source = canonical.entries[qlId]!;
  for (const language of languages) {
    try {
      const surface = buildPnl001LocalizedReviewSurface(qlId, language);
      surfaces += 1;
      cpCounts[language] ??= {};
      cpCounts[language]![source.cpId] =
        (cpCounts[language]![source.cpId] ?? 0) + 1;

      if (surface.cpId !== source.cpId) {
        throw new Error("CP ownership changed during localization");
      }
      if (
        surface.options.length !== 4 ||
        new Set(surface.options).size !== 4 ||
        surface.options[surface.correctIndex] !== surface.answer
      ) {
        throw new Error("localized option and answer key contract failed");
      }
      if (!surface.validation.valid) {
        throw new Error("surface validation did not pass");
      }

      if (language === "en") {
        if (
          surface.stem !== source.stem ||
          surface.explanation !== source.explanation ||
          JSON.stringify(surface.options) !== JSON.stringify(source.options) ||
          surface.answer !== source.answer ||
          surface.correctIndex !== source.correctIndex
        ) {
          throw new Error("English canonical surface changed");
        }
        englishIdentitySurfaces += 1;
      } else {
        const script =
          language === "hi" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
        if (!script.test(surface.stem) || !script.test(surface.explanation)) {
          throw new Error("native stem or explanation lacks requested script");
        }
        if (!surface.options.some((option) => script.test(option)) && /[A-Za-z]/u.test(source.options.join(" "))) {
          throw new Error("textual options were not localized into native script");
        }
        if (/\\\[|\\\(/u.test(surface.explanation)) nativeMathJaxSurfaces += 1;
        nativeSurfaces += 1;
      }
    } catch (error) {
      failures.push({
        qlId,
        language,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

const expectedCpCounts = {
  "PNL-CP-001": 36,
  "PNL-CP-002": 34,
  "PNL-CP-003": 24,
  "PNL-CP-004": 26,
  "PNL-CP-005": 29,
  "PNL-CP-006": 37,
};
const cpCoverageOk = languages.every(
  (language) =>
    JSON.stringify(cpCounts[language]) === JSON.stringify(expectedCpCounts),
);
const summary = {
  ok:
    failures.length === 0 &&
    surfaces === 558 &&
    englishIdentitySurfaces === 186 &&
    nativeSurfaces === 372 &&
    cpCoverageOk,
  surfaces,
  englishIdentitySurfaces,
  nativeSurfaces,
  nativeMathJaxSurfaces,
  cpCounts,
  failureCount: failures.length,
  failures,
};

console.log(JSON.stringify(summary, null, 2));
if (!summary.ok) process.exitCode = 1;
