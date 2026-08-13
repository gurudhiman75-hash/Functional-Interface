import { generateBlrCp006LocalizedReviewBank } from "./cp006-localizer";
import type { BlrCp006TranslatedLocale } from "./cp006-language-pack";

const ASCII_WORD = /\b[A-Za-z]{2,}\b/g;
// U+0964/U+0965 (danda/double danda) are shared Indic punctuation and are
// valid in Punjabi prose, so cross-script detection intentionally excludes
// those two code points while retaining Devanagari letters, marks and digits.
const DEVANAGARI = /[\u0900-\u0963\u0966-\u097F]/;
const GURMUKHI = /[\u0A00-\u0A7F]/;
const PLACEHOLDER = /(?:\{[A-Za-z_][^}]*\}|\$\d+|⟦\d+⟧|__PERSON_\d+__|\b(?:TODO|TBD|TRANSLATE|PLACEHOLDER)\b)/i;

function learnerText(record: ReturnType<typeof generateBlrCp006LocalizedReviewBank>[number]): string {
  return [
    record.sharedPrompt,
    record.stem,
    record.answer,
    ...record.options.map((option) => option.text),
    ...record.decodedStatements,
    ...record.explanation.coreConcept,
    ...record.explanation.decodingAudit,
    ...record.explanation.graphAudit,
    record.explanation.conclusion,
    record.explanation.examShortcut,
    ...record.explanation.commonTraps,
    ...record.explanation.optionAnalysis.flatMap((entry) => [entry.optionText, entry.explanation]),
    record.explanation.familyTree.title,
    record.explanation.familyTree.query.answerLabel,
    record.explanation.familyTree.accessibleSummary,
    record.explanation.familyTree.asciiFallback,
  ].join("\n");
}

function stripProtectedLiterals(
  record: ReturnType<typeof generateBlrCp006LocalizedReviewBank>[number],
  text: string,
): string {
  let value = text.replace(/\[[A-Z_]+\]/g, "");
  const protectedValues = [
    ...record.codeKey.map((entry) => entry.token),
    ...record.graph.persons.flatMap((person) => [person.personId, person.label]),
  ]
    .filter((entry) => entry.length > 1)
    .sort((left, right) => right.length - left.length);
  for (const literal of protectedValues) value = value.split(literal).join("◊");
  return value;
}

function audit(locale: BlrCp006TranslatedLocale) {
  const bank = generateBlrCp006LocalizedReviewBank(locale);
  const leaks: { itemId: string; words: string[] }[] = [];
  const scriptGaps: string[] = [];
  const placeholders: string[] = [];
  const crossScript: string[] = [];
  for (const record of bank) {
    const text = stripProtectedLiterals(record, learnerText(record));
    const words = [...new Set(text.match(ASCII_WORD) ?? [])];
    if (words.length) leaks.push({ itemId: record.itemId, words });
    const targetScript = locale === "hi-IN" ? DEVANAGARI : GURMUKHI;
    const otherScript = locale === "hi-IN" ? GURMUKHI : DEVANAGARI;
    if (!targetScript.test(text)) scriptGaps.push(record.itemId);
    if (otherScript.test(text)) crossScript.push(record.itemId);
    if (PLACEHOLDER.test(text)) placeholders.push(record.itemId);
  }
  return { locale, count: bank.length, leaks, scriptGaps, placeholders, crossScript };
}

const reports = (["hi-IN", "pa-IN"] as const).map(audit);
for (const report of reports) {
  console.log(JSON.stringify({
    locale: report.locale,
    recordCount: report.count,
    leakingRecords: report.leaks.length,
    uniqueLeakingWords: [...new Set(report.leaks.flatMap((entry) => entry.words))].sort(),
    targetScriptGaps: report.scriptGaps.length,
    crossScriptRecords: report.crossScript.length,
    placeholderLeaks: report.placeholders.length,
  }, null, 2));
}

const failures = reports.flatMap((report) => [
  ...report.leaks.map((entry) => `${report.locale} ASCII leak ${entry.itemId}: ${entry.words.join(", ")}`),
  ...report.scriptGaps.map((itemId) => `${report.locale} target-script gap ${itemId}`),
  ...report.crossScript.map((itemId) => `${report.locale} cross-script leak ${itemId}`),
  ...report.placeholders.map((itemId) => `${report.locale} placeholder leak ${itemId}`),
]);
if (failures.length) {
  for (const failure of failures.slice(0, 120)) console.error(`::error::${failure}`);
  throw new Error(`BLR-CP-006 multilingual learner-language audit failed with ${failures.length} issue(s).`);
}
console.log("BLR_CP006_HI_PA_LANGUAGE_AUDIT_PROVED");
