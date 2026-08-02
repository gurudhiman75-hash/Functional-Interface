import { PNL_001_CANONICAL_REVIEW_LIBRARY } from "./question-studio-review.library";
import { localizePnl001CanonicalChoiceV3 } from "./question-studio-native-choice-localizer-v3";

type Entry = Readonly<{
  qlId: string;
  options: readonly string[];
  answer: string;
}>;
type Library = Readonly<{
  entries: Readonly<Record<string, Entry>>;
}>;

const library = PNL_001_CANONICAL_REVIEW_LIBRARY as Library;
const textualValues = new Map<string, Set<string>>();
for (const entry of Object.values(library.entries)) {
  for (const value of [...entry.options, entry.answer]) {
    if (!/[A-Za-z]/u.test(value)) continue;
    const owners = textualValues.get(value) ?? new Set<string>();
    owners.add(entry.qlId);
    textualValues.set(value, owners);
  }
}

const failures: Array<{
  value: string;
  qlIds: readonly string[];
  language: "hi" | "pa";
  message: string;
}> = [];
let localizedValues = 0;
for (const [value, owners] of [...textualValues.entries()].sort(
  ([left], [right]) => left.localeCompare(right),
)) {
  for (const language of ["hi", "pa"] as const) {
    try {
      const localized = localizePnl001CanonicalChoiceV3(value, language);
      const script =
        language === "hi" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
      if (!script.test(localized)) {
        throw new Error(
          "localized choice does not contain the requested native script",
        );
      }
      localizedValues += 1;
    } catch (error) {
      failures.push({
        value,
        qlIds: [...owners].sort(),
        language,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

const summary = {
  ok: failures.length === 0,
  textualChoiceCount: textualValues.size,
  expectedLocalizedValues: textualValues.size * 2,
  localizedValues,
  failureCount: failures.length,
  failures,
};
console.log(JSON.stringify(summary, null, 2));
if (!summary.ok) process.exitCode = 1;
