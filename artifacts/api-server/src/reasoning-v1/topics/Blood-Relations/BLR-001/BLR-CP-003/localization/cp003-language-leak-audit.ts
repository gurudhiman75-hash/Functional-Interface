import assert from "node:assert/strict";
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

function annotationSafe(value: string): string {
  return value.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}

const coverageGaps = new Map<string, { locale: "hi-IN" | "pa-IN"; count: number; exampleItemId: string; message: string }>();

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const leakingRecords: string[] = [];
  const forms = new Map<string, { count: number; localized: string; words: readonly string[] }>();
  let placeholderLeakCount = 0;

  for (const source of canonical) {
    let localized: ReturnType<typeof localizeBlrCp003QuestionComplete>;
    try {
      localized = localizeBlrCp003QuestionComplete(source, locale);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const key = `${locale}|${message}`;
      const existing = coverageGaps.get(key);
      coverageGaps.set(key, {
        locale,
        count: (existing?.count ?? 0) + 1,
        exampleItemId: existing?.exampleItemId ?? source.itemId,
        message,
      });
      continue;
    }

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

  const orderedForms = [...forms.entries()]
    .map(([canonical, value]) => ({ canonical, count: value.count, localized: value.localized, words: value.words }))
    .sort((left, right) => right.count - left.count || left.canonical.localeCompare(right.canonical));

  console.log(JSON.stringify({
    locale,
    leakingRecordCount: leakingRecords.length,
    placeholderLeakCount,
    uniqueLeakFormCount: forms.size,
    leakForms: orderedForms,
  }, null, 2));

  for (const [index, form] of orderedForms.slice(0, 5).entries()) {
    console.error(
      `::warning title=${annotationSafe(`CP003 ${locale} residual form ${index + 1}/${Math.min(orderedForms.length, 5)}`)}::${annotationSafe(`count=${form.count} | words=${form.words.join(",")} | canonical=${form.canonical} | localized=${form.localized}`)}`,
    );
  }
}

const orderedCoverageGaps = [...coverageGaps.values()].sort(
  (left, right) => right.count - left.count || left.locale.localeCompare(right.locale) || left.message.localeCompare(right.message),
);

if (orderedCoverageGaps.length > 0) {
  console.error(JSON.stringify({
    localizationCoverageGapCount: orderedCoverageGaps.length,
    coverageGaps: orderedCoverageGaps,
  }, null, 2));
  for (const [index, gap] of orderedCoverageGaps.slice(0, 40).entries()) {
    console.error(
      `::error title=${annotationSafe(`CP003 ${gap.locale} coverage gap ${index + 1}/${Math.min(orderedCoverageGaps.length, 40)}`)}::${annotationSafe(`count=${gap.count} | example=${gap.exampleItemId} | ${gap.message}`)}`,
    );
  }
  assert.fail(`${orderedCoverageGaps.length} unique CP-003 localization coverage gaps remain.`);
}
