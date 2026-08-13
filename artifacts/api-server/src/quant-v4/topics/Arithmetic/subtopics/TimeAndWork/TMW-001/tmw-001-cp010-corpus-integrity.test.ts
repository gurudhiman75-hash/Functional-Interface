import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function joined(question: any): string {
  const learner = question.learnerExplanation;
  const legacy = question.explanation;
  return [learner?.method, ...(learner?.solution ?? []), learner?.answer, legacy?.opening, legacy?.formula, ...(legacy?.steps ?? []), legacy?.conclusion].filter(Boolean).join(" ");
}
function proseInsideMath(value: string): boolean {
  for (const hit of value.matchAll(/\\\(([\s\S]*?)\\\)/g)) if (/[\u0900-\u097F\u0A00-\u0A7F]/u.test(hit[1] ?? "")) return true;
  return false;
}
function solverTrace(value: string): boolean {
  if (/\\text\{|\\Delta/.test(value)) return true;
  for (const hit of value.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
    if (/(?:^|[^A-Za-z\\])(?:r|L|V|T|t|x)(?:_|=|\b)/.test(hit[1] ?? "")) return true;
  }
  return false;
}

const qls = Array.from({ length: 18 }, (_, index) => `TMW-QL-${String(index + 175).padStart(3, "0")}`);
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const namespaces = ["tmw-cp010-editorial", "tmw-cp010-editorial-review"] as const;
const seeds = ["0", "1", "2", "3", "4", "5", "6", "7"] as const;
let checked = 0;

for (const qlId of qls) for (const language of languages) for (const namespace of namespaces) for (const suffix of seeds) {
  const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed: `${namespace}:${qlId}:${language}:${suffix}` });
  const label = `${qlId}:${language}:${namespace}:${suffix}`;
  const presentation = joined(question);
  checked += 1;
  assert(question.validation?.valid, `${label}: ${question.validation?.errors?.join(" | ")}`);
  assert(question.publiclyPublishable === false, `${label}: publication lock lost`);
  assert(question.options.length === 4 && new Set(question.options).size === 4, `${label}: option contract failed`);
  assert(question.options[question.correctIndex] === question.solution.answerText, `${label}: answer-option mismatch`);
  assert(question.learnerExplanation?.solution?.length >= 2 && question.learnerExplanation.solution.length <= 5, `${label}: learner solution must contain 2-5 connected steps`);
  assert(!solverTrace(presentation), `${label}: solver trace or prose-in-MathJax remains`);
  assert(!proseInsideMath(presentation), `${label}: localized prose remains inside MathJax`);
  assert(!/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u.test(presentation), `${label}: control character remains`);

  if (qlId === "TMW-QL-180") assert(/final tank level|अंत में टंकी|ਅੰਤ ਵਿੱਚ ਟੈਂਕੀ/i.test(question.learnerExplanation.answer), `${label}: final-level answer label missing`);
  if (qlId === "TMW-QL-183") assert(/final.*rate|अंतिम भराव.*दर|ਅੰਤਿਮ ਭਰਨ.*ਦਰ/i.test(question.learnerExplanation.answer), `${label}: final-rate answer label missing`);
  if (qlId === "TMW-QL-184") assert(/capacity|क्षमता|ਸਮਰੱਥਾ/i.test(question.learnerExplanation.answer), `${label}: capacity label missing`);
  if (qlId === "TMW-QL-189") assert(/complete cycle|पूरे चक्र|ਪੂਰੇ ਚੱਕਰ/i.test(question.learnerExplanation.answer), `${label}: cycle-count label missing`);
  if (qlId === "TMW-QL-190") assert(/terminal segment|first becomes full|पहली बार पूरी भरती|ਪਹਿਲੀ ਵਾਰ ਪੂਰੀ ਭਰਦੀ|अंतराल|खंड|ਹਿੱਸ|ਅੰਤਰਾਲ/i.test(question.learnerExplanation.answer), `${label}: terminal-segment answer semantics missing`);
  if (qlId === "TMW-QL-192") assert(/schedule change|बदलाव|ਬਦਲਾਅ/i.test(question.learnerExplanation.answer), `${label}: schedule-adjustment label missing`);
}

assert(checked === 864, `Expected 864 CP010 corpus-integrity cases, got ${checked}`);
console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-010", checked, publicationLocked: true, verdict: "PASS" }, null, 2));
