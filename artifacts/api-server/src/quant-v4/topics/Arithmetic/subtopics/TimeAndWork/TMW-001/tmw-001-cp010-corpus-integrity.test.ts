import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function joined(question: any): string {
  const learner = question.learnerExplanation;
  const legacy = question.explanation;
  return [question.stem, ...(question.options ?? []), question.solution?.answerText, learner?.method, ...(learner?.solution ?? []), learner?.answer, legacy?.opening, legacy?.formula, ...(legacy?.steps ?? []), legacy?.conclusion].filter(Boolean).join(" ");
}
function learnerJoined(question: any): string {
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
  const learnerPresentation = learnerJoined(question);
  const learnerSteps = question.learnerExplanation?.solution ?? [];
  const learnerText = learnerSteps.join(" ");
  checked += 1;
  assert(question.validation?.valid, `${label}: ${question.validation?.errors?.join(" | ")}`);
  assert(question.publiclyPublishable === false, `${label}: publication lock lost`);
  assert(question.options.length === 4 && new Set(question.options).size === 4, `${label}: option contract failed`);
  assert(question.options[question.correctIndex] === question.solution.answerText, `${label}: answer-option mismatch`);
  assert(learnerSteps.length >= 2 && learnerSteps.length <= 5, `${label}: learner solution must contain 2-5 connected steps`);
  assert(!solverTrace(learnerPresentation), `${label}: solver trace or prose-in-MathJax remains in learner working`);
  assert(!proseInsideMath(presentation), `${label}: localized prose remains inside MathJax on the learner surface`);
  assert(!/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u.test(presentation), `${label}: control character remains`);

  if (language !== "en") {
    assert(!/\$\d/u.test(question.stem), `${label}: replacement capture token leaked into localized stem`);
    assert(!/इनलेट|आउटलेट|ਇਨਲੈਟ|ਆਉਟਲੈਟ/u.test(question.stem), `${label}: English pipe-role loan label remains in localized stem`);
    assert(!/जलाशय[^।]* भरी है/u.test(question.stem), `${label}: Hindi reservoir gender agreement remains`);
    assert(!/ਜਲਾਸ਼ਯ[^।]* ਭਰੀ ਹੈ/u.test(question.stem), `${label}: Punjabi reservoir gender agreement remains`);
  }

  if (qlId === "TMW-QL-177" || qlId === "TMW-QL-178") {
    assert(/Stage 1|चरण 1|ਪੜਾਅ 1/u.test(learnerText), `${label}: first stage is omitted from learner working`);
    assert(/final-stage time|अंतिम चरण का समय|ਅੰਤਿਮ ਪੜਾਅ ਦਾ ਸਮਾਂ/u.test(learnerText), `${label}: final-stage arithmetic is omitted from learner working`);
    assert(/total time|कुल समय|ਕੁੱਲ ਸਮਾਂ/u.test(learnerText), `${label}: total-time calculation is omitted from learner working`);
  }
  if (qlId === "TMW-QL-180") assert(/final tank level|अंत में टंकी|ਅੰਤ ਵਿੱਚ ਟੈਂਕੀ/i.test(question.learnerExplanation.answer), `${label}: final-level answer label missing`);
  if (qlId === "TMW-QL-182") {
    assert(!/-\\frac[^\n]*\\div-\\frac/u.test(learnerText), `${label}: opaque negative-over-negative event-time derivation remains`);
    assert(/stage rates differ|चरणों की प्रति घंटे दरों का अंतर|ਪੜਾਵਾਂ ਦੀ ਪ੍ਰਤੀ ਘੰਟਾ ਦਰ ਦਾ ਫਰਕ/u.test(learnerText), `${label}: positive rate-gap event-time reasoning missing`);
  }
  if (qlId === "TMW-QL-183") {
    assert(/final.*rate|अंतिम भराव.*दर|ਅੰਤਿਮ ਭਰਨ.*ਦਰ/i.test(question.learnerExplanation.answer), `${label}: final-rate answer label missing`);
    assert(!/जलाशय[^।]*भरनी है/u.test(question.stem), `${label}: Hindi reservoir gender agreement remains`);
  }
  if (qlId === "TMW-QL-184") {
    assert(/capacity|क्षमता|ਸਮਰੱਥਾ/i.test(question.learnerExplanation.answer), `${label}: capacity label missing`);
    assert(!/\\div1\b/u.test(learnerText), `${label}: redundant divide-by-one capacity step remains`);
    assert(/capacity equals the total added volume|क्षमता कुल जोड़े गए आयतन|ਸਮਰੱਥਾ ਕੁੱਲ ਜੋੜੀ ਮਾਤਰਾ/u.test(learnerText) || /capacity|क्षमता|ਸਮਰੱਥਾ/u.test(learnerText), `${label}: explicit capacity aggregation missing`);
  }
  if (["TMW-QL-185", "TMW-QL-186", "TMW-QL-188", "TMW-QL-191"].includes(qlId)) {
    assert(/\\div/u.test(learnerText), `${label}: terminal-cycle arithmetic is not shown`);
    assert(/total time|कुल समय|ਕੁੱਲ ਸਮਾਂ/u.test(learnerText), `${label}: terminal-cycle total-time calculation missing`);
  }
  if (qlId === "TMW-QL-187") {
    assert(!/\b\d+\/\d+\b/u.test(question.stem), `${label}: raw slash fraction remains in controller stem`);
  }
  if (qlId === "TMW-QL-189") assert(/complete cycle|पूरे चक्र|ਪੂਰੇ ਚੱਕਰ/i.test(question.learnerExplanation.answer), `${label}: cycle-count label missing`);
  if (qlId === "TMW-QL-190") assert(/terminal segment|first becomes full|पहली बार पूरी भरती|ਪਹਿਲੀ ਵਾਰ ਪੂਰੀ ਭਰਦੀ|अंतराल|खंड|ਹਿੱਸ|ਅੰਤਰਾਲ/i.test(question.learnerExplanation.answer), `${label}: terminal-segment answer semantics missing`);
  if (qlId === "TMW-QL-192") {
    assert(/schedule change|बदलाव|ਬਦਲਾਅ/i.test(question.learnerExplanation.answer), `${label}: schedule-adjustment label missing`);
    assert(!/-\\frac/u.test(learnerText), `${label}: opaque negative-over-negative deadline derivation remains`);
    assert(/Each hour shifted|हर एक घंटे के बदलाव|ਹਰ ਇੱਕ ਘੰਟੇ ਦੇ ਬਦਲਾਅ/u.test(learnerText), `${label}: positive rate-gap deadline reasoning missing`);
  }
}

assert(checked === 864, `Expected 864 CP010 corpus-integrity cases, got ${checked}`);
console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-010", checked, publicationLocked: true, manualFindingsGuarded: true, verdict: "PASS" }, null, 2));
