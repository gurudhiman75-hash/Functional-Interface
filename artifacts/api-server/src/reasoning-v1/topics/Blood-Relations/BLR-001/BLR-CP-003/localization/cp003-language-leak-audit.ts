import { generateBlrCp003FinalApprovedBank } from "../cp003-final-approved-bank";
import { localizeBlrCp003QuestionComplete } from "./cp003-localized-review-runtime";

const canonical = generateBlrCp003FinalApprovedBank();
const asciiWord = /\b[A-Za-z]{2,}\b/g;

function normalizeNames(text: string, source: (typeof canonical)[number]): string {
  let value = text;
  const labels = source.proceduralLogic.nodes
    .map((node) => node.label)
    .filter(Boolean)
    .sort((left, right) => right.length - left.length);
  for (const label of labels) value = value.split(label).join("◊");
  return value.replace(/\s+/g, " ").trim();
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.।])\s+/u)
    .map((value) => value.trim())
    .filter(Boolean);
}

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const leakingRecords: string[] = [];
  const forms = new Map<string, { count: number; localized: string; words: readonly string[] }>();
  let placeholderLeakCount = 0;

  for (const source of canonical) {
    const localized = localizeBlrCp003QuestionComplete(source, locale);
    const fullText = `${localized.sharedPrompt} ${localized.stem}`;
    if (/[⟦⟧]/u.test(fullText)) placeholderLeakCount += 1;

    let recordLeaks = false;
    const canonicalSentences = splitSentences(source.sharedPrompt);
    const localizedSentences = splitSentences(localized.sharedPrompt);
    for (let index = 0; index < localizedSentences.length; index += 1) {
      const localizedSentence = localizedSentences[index]!;
      const normalizedLocalized = normalizeNames(localizedSentence, source);
      const words = normalizedLocalized.match(asciiWord) ?? [];
      if (words.length === 0) continue;
      recordLeaks = true;
      const canonicalSentence = canonicalSentences[index] ?? source.sharedPrompt;
      const canonicalForm = normalizeNames(canonicalSentence, source);
      const existing = forms.get(canonicalForm);
      forms.set(canonicalForm, {
        count: (existing?.count ?? 0) + 1,
        localized: normalizedLocalized,
        words: [...new Set(words.map((word) => word.toLowerCase()))].sort(),
      });
    }

    const normalizedStem = normalizeNames(localized.stem, source);
    const stemWords = normalizedStem.match(asciiWord) ?? [];
    if (stemWords.length > 0) {
      recordLeaks = true;
      const canonicalForm = `STEM: ${normalizeNames(source.stem, source)}`;
      const existing = forms.get(canonicalForm);
      forms.set(canonicalForm, {
        count: (existing?.count ?? 0) + 1,
        localized: normalizedStem,
        words: [...new Set(stemWords.map((word) => word.toLowerCase()))].sort(),
      });
    }

    if (recordLeaks) leakingRecords.push(source.itemId);
  }

  console.log(JSON.stringify({
    locale,
    leakingRecordCount: leakingRecords.length,
    placeholderLeakCount,
    uniqueLeakFormCount: forms.size,
    leakForms: [...forms.entries()]
      .map(([canonical, value]) => ({ canonical, count: value.count, localized: value.localized, words: value.words }))
      .sort((left, right) => right.count - left.count || left.canonical.localeCompare(right.canonical)),
  }, null, 2));
}
