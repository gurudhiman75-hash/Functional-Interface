import { generateBlrCp005LocalizedReviewBank } from "./cp005-localizer";
import type { BlrCp005TranslatedLocale } from "./cp005-language-pack";

const ASCII_WORD = /\b[A-Za-z]{2,}\b/g;
const DEVANAGARI = /[\u0900-\u097F]/;
const GURMUKHI = /[\u0A00-\u0A7F]/;
const PLACEHOLDER = /(?:\{[A-Za-z_][^}]*\}|\$\d+|⟦\d+⟧|__PERSON_\d+__)/;

function learnerText(record: ReturnType<typeof generateBlrCp005LocalizedReviewBank>[number]): string {
  return [
    record.sharedPrompt,
    record.stem,
    ...record.options.map((option) => option.text),
    ...record.explanation.coreConcept,
    ...record.explanation.modelAudit,
    record.explanation.conclusion,
    record.explanation.examShortcut,
    ...record.explanation.optionAnalysis.flatMap((entry) => [entry.optionText, entry.explanation]),
    ...record.explanation.familyTrees.flatMap((tree) => [
      tree.title,
      tree.modelLabel,
      tree.query.answerLabel,
      tree.accessibleSummary,
      tree.asciiFallback,
    ]),
  ].join("\n");
}

function stripPersonNames(record: ReturnType<typeof generateBlrCp005LocalizedReviewBank>[number], text: string): string {
  const names = [...new Set(record.explanation.familyTrees.flatMap((tree) => tree.nodes.map((node) => node.label)))]
    .sort((left, right) => right.length - left.length);
  let value = text;
  for (const name of names) value = value.split(name).join("◊");
  return value;
}

function audit(locale: BlrCp005TranslatedLocale) {
  const bank = generateBlrCp005LocalizedReviewBank(locale);
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

const reports = (["hi-IN", "pa-IN"] as const).map(audit);
for (const report of reports) {
  console.log(JSON.stringify({
    locale: report.locale,
    recordCount: report.count,
    leakingRecords: report.leaks.length,
    uniqueLeakingWords: [...new Set(report.leaks.flatMap((entry) => entry.words))].sort(),
    targetScriptGaps: report.scriptGaps.length,
    placeholderLeaks: report.placeholders.length,
  }, null, 2));
}

const failures = reports.flatMap((report) => [
  ...report.leaks.map((entry) => `${report.locale} ASCII leak ${entry.itemId}: ${entry.words.join(", ")}`),
  ...report.scriptGaps.map((itemId) => `${report.locale} target-script gap ${itemId}`),
  ...report.placeholders.map((itemId) => `${report.locale} placeholder leak ${itemId}`),
]);
if (failures.length) {
  for (const failure of failures.slice(0, 120)) console.error(`::error::${failure}`);
  throw new Error(`BLR-CP-005 multilingual learner-language audit failed with ${failures.length} issue(s).`);
}
console.log("BLR_CP005_HI_PA_LANGUAGE_AUDIT_PROVED");
