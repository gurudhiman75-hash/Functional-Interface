import { generateBlrCp003FinalApprovedBank } from "../cp003-final-approved-bank";
import { localizeBlrCp003QuestionComplete } from "./cp003-localized-review-runtime";

const canonical = generateBlrCp003FinalApprovedBank();
const forbiddenEnglish = /\b(?:study|following|married|unmarried|mother|father|son|daughter|children|child|siblings?|spouse|wife|husband|parents?|brother|sister|cousins?|which|select|option)\b/i;
const asciiWord = /\b[A-Za-z]{2,}\b/g;

function stripCanonicalNames(text: string, source: (typeof canonical)[number]): string {
  let value = text;
  for (const node of source.proceduralLogic.nodes) {
    if (node.label) value = value.split(node.label).join("");
  }
  return value;
}

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const leaks = canonical.flatMap((source) => {
    const localized = localizeBlrCp003QuestionComplete(source, locale);
    const fullText = `${localized.sharedPrompt} ${localized.stem}`;
    const learnerText = stripCanonicalNames(fullText, source);
    const vocabularyMatch = learnerText.match(forbiddenEnglish)?.[0] ?? null;
    const placeholderLeak = /[⟦⟧]/u.test(fullText);
    const asciiWords = [...new Set(learnerText.match(asciiWord) ?? [])].sort();
    return vocabularyMatch || placeholderLeak || asciiWords.length > 0
      ? [{
          itemId: source.itemId,
          sourcePrototypeId: source.sourcePrototypeId,
          vocabularyMatch,
          placeholderLeak,
          asciiWords,
          canonicalSharedPrompt: source.sharedPrompt,
          localizedSharedPrompt: localized.sharedPrompt,
          localizedStem: localized.stem,
          nodeLabels: source.proceduralLogic.nodes.map((node) => ({ id: node.id, label: node.label })),
        }]
      : [];
  });
  console.log(JSON.stringify({ locale, leakCount: leaks.length, firstLeaks: leaks.slice(0, 5) }, null, 2));
}
