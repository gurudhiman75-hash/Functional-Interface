import { generateBlrCp003FinalApprovedBank } from "../cp003-final-approved-bank";

const bank = generateBlrCp003FinalApprovedBank();

function replaceAllLiteral(text: string, needle: string, replacement: string): string {
  return needle ? text.split(needle).join(replacement) : text;
}

function normalizeText(text: string, record: (typeof bank)[number]): string {
  let normalized = text;
  const labels = record.proceduralLogic.nodes
    .map((node) => node.label)
    .filter(Boolean)
    .sort((left, right) => right.length - left.length);
  for (const label of labels) normalized = replaceAllLiteral(normalized, label, "{PERSON}");
  normalized = normalized.replace(/\b\d+\b/g, "{N}");
  normalized = normalized.replace(/\s+/g, " ").trim();
  return normalized;
}

function patterns(values: readonly { text: string; record: (typeof bank)[number] }[]): readonly string[] {
  return [...new Set(values.map(({ text, record }) => normalizeText(text, record)))].sort();
}

const sharedPromptPatterns = patterns(bank.map((record) => ({ text: record.sharedPrompt, record })));
const stemPatterns = patterns(bank.map((record) => ({ text: record.stem, record })));
const optionPatterns = patterns(bank.flatMap((record) => record.options.map((option) => ({ text: option.text, record }))));

const editorialKeys = [...new Set(bank.flatMap((record) => Object.keys(record.editorial as object)))].sort();
const editorialSamples = bank.slice(0, 4).map((record) => ({
  itemId: record.itemId,
  qlId: record.qlId,
  editorial: record.editorial,
}));

console.log(JSON.stringify({
  recordCount: bank.length,
  qlCounts: Object.fromEntries([...new Set(bank.map((record) => record.qlId))].map((qlId) => [
    qlId,
    bank.filter((record) => record.qlId === qlId).length,
  ])),
  sharedPromptPatternCount: sharedPromptPatterns.length,
  sharedPromptPatterns,
  stemPatternCount: stemPatterns.length,
  stemPatterns,
  optionPatternCount: optionPatterns.length,
  optionPatterns,
  editorialKeys,
  editorialSamples,
}, null, 2));
