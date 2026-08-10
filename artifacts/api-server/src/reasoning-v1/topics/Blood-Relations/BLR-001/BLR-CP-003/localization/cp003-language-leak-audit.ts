import { generateBlrCp003FinalApprovedBank } from "../cp003-final-approved-bank";
import { localizeBlrCp003QuestionComplete } from "./cp003-localized-review-runtime";

const canonical = generateBlrCp003FinalApprovedBank();
const forbiddenEnglish = /\b(?:study|following|married|unmarried|mother|father|son|daughter|children|child|siblings?|spouse|wife|husband|parents?|brother|sister|cousins?|which|select|option)\b/i;

function stripNames(text: string, source: (typeof canonical)[number]): string {
  let value = text;
  for (const node of source.proceduralLogic.nodes) value = value.split(node.label).join("");
  return value;
}

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const leaks = canonical.flatMap((source) => {
    const localized = localizeBlrCp003QuestionComplete(source, locale);
    const learnerText = stripNames(`${localized.sharedPrompt} ${localized.stem}`, source);
    const match = learnerText.match(forbiddenEnglish);
    return match
      ? [{ itemId: source.itemId, sourcePrototypeId: source.sourcePrototypeId, token: match[0], learnerText }]
      : [];
  });
  console.log(JSON.stringify({ locale, leakCount: leaks.length, leaks }, null, 2));
}
