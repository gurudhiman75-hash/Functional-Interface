import { applyAvg001NaturalLanguageV34Review } from "./foundation/natural-language-v3-4-review";
import { runAvg001LocalizedRelease } from "./foundation/localized-release";

const qlId = "AVG-QL-021";
const language = "hi" as const;
const seed = `avg-001-natural-language-v3-4:${qlId}`;
const source = runAvg001LocalizedRelease({ questionLanguageId: qlId, seed, language });
const question = applyAvg001NaturalLanguageV34Review(source);
console.log(JSON.stringify({
  qlId,
  language,
  stem: question.stem,
  options: question.options,
  correctIndex: question.correctIndex,
  answer: question.answer,
  explanation: question.explanation.lines,
  validation: question.validation,
}, null, 2));
