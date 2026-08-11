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

type Locale = "hi-IN" | "pa-IN";
type CoverageGap = {
  locale: Locale;
  count: number;
  exampleItemId: string;
  canonicalForm: string;
  exampleSentence: string;
};

const coverageGaps = new Map<string, CoverageGap>();
let totalLeakingRecords = 0;
let totalPlaceholderLeaks = 0;
let totalLeakForms = 0;

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
      const sentenceMarker = "passage sentence: ";
      const markerIndex = message.indexOf(sentenceMarker);
      const sentence = markerIndex >= 0 ? message.slice(markerIndex + sentenceMarker.length) : message;
      const canonicalForm = normalizeNames(sentence, source);
      const key = `${locale}|${canonicalForm}`;
      const existing = coverageGaps.get(key);
      coverageGaps.set(key, {
        locale,
        count: (existing?.count ?? 0) + 1,
        exampleItemId: existing?.exampleItemId ?? source.itemId,
        canonicalForm,
        exampleSentence: existing?.exampleSentence ?? sentence,
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

  totalLeakingRecords += leakingRecords.length;
  totalPlaceholderLeaks += placeholderLeakCount;
  totalLeakForms += forms.size;

  console.log(JSON.stringify({
    locale,
    leakingRecordCount: leakingRecords.length,
    placeholderLeakCount,
    uniqueLeakFormCount: forms.size,
    leakForms: orderedForms,
  }, null, 2));

  for (const [index, form] of orderedForms.slice(0, 5).entries()) {
    console.error(
      `::error title=${annotationSafe(`CP003 ${locale} residual form ${index + 1}/${Math.min(orderedForms.length, 5)}`)}::${annotationSafe(`count=${form.count} | words=${form.words.join(",")} | canonical=${form.canonical} | localized=${form.localized}`)}`,
    );
  }
  if (placeholderLeakCount > 0) {
    console.error(`::error title=${annotationSafe(`CP003 ${locale} placeholder leakage`)}::${placeholderLeakCount} localized records contain unresolved placeholder markers.`);
  }
}

const orderedCoverageGaps = [...coverageGaps.values()].sort(
  (left, right) => right.count - left.count || left.locale.localeCompare(right.locale) || left.canonicalForm.localeCompare(right.canonicalForm),
);

if (orderedCoverageGaps.length > 0) {
  console.error(JSON.stringify({
    localizationCoverageGapCount: orderedCoverageGaps.length,
    coverageGaps: orderedCoverageGaps,
  }, null, 2));
  for (const [index, gap] of orderedCoverageGaps.slice(0, 40).entries()) {
    console.error(
      `::error title=${annotationSafe(`CP003 ${gap.locale} template gap ${index + 1}/${Math.min(orderedCoverageGaps.length, 40)}`)}::${annotationSafe(`count=${gap.count} | form=${gap.canonicalForm} | example=${gap.exampleSentence} | item=${gap.exampleItemId}`)}`,
    );
  }
}

assert.equal(orderedCoverageGaps.length, 0, `${orderedCoverageGaps.length} unique CP-003 localization template gaps remain.`);
assert.equal(totalLeakingRecords, 0, `${totalLeakingRecords} CP-003 localized records contain residual English.`);
assert.equal(totalLeakForms, 0, `${totalLeakForms} unique CP-003 residual-English forms remain.`);
assert.equal(totalPlaceholderLeaks, 0, `${totalPlaceholderLeaks} CP-003 localized records contain unresolved placeholders.`);

console.log(JSON.stringify({
  verdict: "BLR_CP003_HI_PA_LANGUAGE_LEAK_AUDIT_PROVED",
  canonicalCount: canonical.length,
  localizedRecordsAudited: canonical.length * 2,
  coverageGapCount: 0,
  leakingRecordCount: 0,
  placeholderLeakCount: 0,
  uniqueLeakFormCount: 0,
}, null, 2));
