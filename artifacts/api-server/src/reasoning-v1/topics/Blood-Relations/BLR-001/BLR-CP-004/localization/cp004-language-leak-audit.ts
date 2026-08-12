import { generateBlrCp004LocalizedReviewBank } from "./cp004-localizer";
import type { BlrCp004TranslatedLocale } from "./cp004-language-pack";

const ASCII_WORD = /\b[A-Za-z]{2,}\b/g;
const DEVANAGARI = /[\u0900-\u097F]/;
const GURMUKHI = /[\u0A00-\u0A7F]/;
const PLACEHOLDER = /(?:\{[^}]+\}|\$\d+|⟦\d+⟧|__PERSON_\d+__)/;

function learnerText(record: ReturnType<typeof generateBlrCp004LocalizedReviewBank>[number]): string {
  return [
    record.sharedPrompt,
    record.stem,
    ...record.options.map((option) => option.text),
    ...record.explanation.coreConcept,
    ...record.explanation.working,
    record.explanation.conclusion,
    record.explanation.examShortcut,
    ...record.explanation.optionAnalysis.flatMap((entry) => [entry.optionText, entry.explanation]),
  ].join("\n");
}

function stripPersonNames(
  record: ReturnType<typeof generateBlrCp004LocalizedReviewBank>[number],
  text: string,
): string {
  let value = text;
  const names = record.explanation.familyTree.nodes
    .map((node) => node.label)
    .sort((left, right) => right.length - left.length);
  for (const name of names) value = value.split(name).join("◊");
  return value;
}

function auditLocale(locale: BlrCp004TranslatedLocale) {
  const bank = generateBlrCp004LocalizedReviewBank(locale);
  const leaks: { itemId: string; words: string[] }[] = [];
  const scriptGaps: string[] = [];
  const placeholders: string[] = [];
  for (const record of bank) {
    const text = stripPersonNames(record, learnerText(record));
    const words = [...new Set(text.match(ASCII_WORD) ?? [])];
    if (words.length) leaks.push({ itemId: record.itemId, words });
    const targetScript = locale === "hi-IN" ? DEVANAGARI : GURMUKHI;
    if (!targetScript.test(text)) scriptGaps.push(record.itemId);
    if (PLACEHOLDER.test(text)) placeholders.push(record.itemId);
  }
  return { locale, count: bank.length, leaks, scriptGaps, placeholders };
}

const reports = (["hi-IN", "pa-IN"] as const).map(auditLocale);
for (const report of reports) {
  console.log(JSON.stringify({
    locale: report.locale,
    recordCount: report.count,
    leakingRecords: report.leaks.length,
    uniqueLeakingWords: [...new Set(report.leaks.flatMap((entry) => entry.words))].sort(),
    scriptGaps: report.scriptGaps.length,
    placeholderLeaks: report.placeholders.length,
  }, null, 2));
}

const failures = reports.flatMap((report) => [
  ...report.leaks.map((entry) => `${report.locale} ASCII leak ${entry.itemId}: ${entry.words.join(", ")}`),
  ...report.scriptGaps.map((itemId) => `${report.locale} target-script gap ${itemId}`),
  ...report.placeholders.map((itemId) => `${report.locale} placeholder leak ${itemId}`),
]);

if (failures.length) {
  for (const failure of failures.slice(0, 100)) console.error(`::error::${failure}`);
  throw new Error(`BLR-CP-004 multilingual learner-language audit failed with ${failures.length} issue(s).`);
}

console.log("BLR_CP004_HI_PA_LANGUAGE_AUDIT_PROVED");
