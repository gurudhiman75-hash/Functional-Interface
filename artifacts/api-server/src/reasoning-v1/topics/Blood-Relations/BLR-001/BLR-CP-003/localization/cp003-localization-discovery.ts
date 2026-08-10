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
const sharedSentencePatterns = patterns(bank.flatMap((record) =>
  record.sharedPrompt
    .split(/(?<=\.)\s+/)
    .filter(Boolean)
    .map((text) => ({ text, record })),
));
const stemPatterns = patterns(bank.map((record) => ({ text: record.stem, record })));
const optionPatterns = patterns(bank.flatMap((record) => record.options.map((option) => ({ text: option.text, record }))));

const prototypeSamples = [...new Set(bank.map((record) => record.sourcePrototypeId))]
  .sort()
  .map((sourcePrototypeId) => {
    const records = bank.filter((record) => record.sourcePrototypeId === sourcePrototypeId);
    const first = records[0]!;
    return {
      sourcePrototypeId,
      qlId: first.qlId,
      finalAuthority: first.finalAuthority,
      originalAuthority: first.originalAuthority,
      recordCount: records.length,
      answerType: first.answerType,
      answerSemanticKeys: [...new Set(records.map((record) => record.answerSemanticKey))].slice(0, 8),
      stemPatterns: patterns(records.map((record) => ({ text: record.stem, record }))),
    };
  });

const editorialKeys = [...new Set(bank.flatMap((record) => Object.keys(record.editorial as object)))].sort();

console.log(JSON.stringify({
  recordCount: bank.length,
  qlCounts: Object.fromEntries([...new Set(bank.map((record) => record.qlId))].map((qlId) => [
    qlId,
    bank.filter((record) => record.qlId === qlId).length,
  ])),
  sharedPromptPatternCount: sharedPromptPatterns.length,
  sharedSentencePatternCount: sharedSentencePatterns.length,
  sharedSentencePatterns,
  stemPatternCount: stemPatterns.length,
  optionPatternCount: optionPatterns.length,
  optionPatterns,
  prototypeCount: prototypeSamples.length,
  prototypeSamples,
  editorialKeys,
}, null, 2));
