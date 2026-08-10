import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";
import { validateTmwLearnerExplanationV2 } from "./foundation/learner-explanation-contract";
import { normalizeTmwLearnerDisplayTextR2 } from "./foundation/learner-explanation-r2-cp001-cp006";
import { tmwR3SolvedAnswerText } from "./foundation/learner-explanation-r3-cp007-cp011";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const LANGUAGES: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const SEEDS = ["0", "1", "2"] as const;
const QL_IDS = Array.from({ length: 84 }, (_, index) => `TMW-QL-${String(index + 128).padStart(3, "0")}`);

function hasUnsafeNotation(value: string): boolean {
  return /_\{[^}]*[A-Za-z\u0900-\u097F\u0A00-\u0A7F][^}]*\}/u.test(value)
    || /_[A-Za-z\u0900-\u097F\u0A00-\u0A7F]+/u.test(value)
    || /\\text\{/u.test(value);
}

function assertIssueSpecificSemantics(question: any, qlId: string, language: Tmw001ChapterLanguage): void {
  const learner = question.learnerExplanation;
  const visible = [question.stem, ...(question.options ?? []), learner.method, ...learner.solution, learner.answer].join(" ");
  const answer = learner.answer;

  if (qlId === "TMW-QL-150") {
    assert(/days worked|दिनों.*अनुपात|ਦਿਨਾਂ.*ਅਨੁਪਾਤ/i.test(answer), `${qlId}:${language}: days-ratio target is not named`);
    assert(!/contribution-factor/i.test(answer), `${qlId}:${language}: contribution-factor wording survived`);
  }
  if (qlId === "TMW-QL-174") {
    assert(!/will not go empty|खाली नहीं जाएगी|ਖਾਲੀ ਨਹੀਂ ਜਾਵੇਗੀ/i.test(visible), `${qlId}:${language}: unnatural empty-outcome wording survived`);
  }
  if (qlId === "TMW-QL-189") {
    assert(/complete cycles|पूरे चक्रों|ਪੂਰੇ ਚੱਕਰਾਂ/i.test(answer), `${qlId}:${language}: complete-cycle count is not named`);
  }
  if (qlId === "TMW-QL-192") {
    assert(/switch|स्विच|ਸਵਿੱਚ/i.test(answer), `${qlId}:${language}: switch-time target is not named`);
    assert(!/total required time|कुल आवश्यक समय|ਕੁੱਲ ਲੋੜੀਂਦਾ ਸਮਾਂ/i.test(answer), `${qlId}:${language}: switch time is mislabeled as total time`);
  }
  if (qlId === "TMW-QL-195" || qlId === "TMW-QL-199") {
    assert(/first-day|पहले दिन|ਪਹਿਲੇ ਦਿਨ/i.test(answer), `${qlId}:${language}: first-day output target is not named`);
    assert(!/total output|कुल उत्पादन|ਕੁੱਲ ਉਤਪਾਦਨ/i.test(answer), `${qlId}:${language}: first-day rate is mislabeled as total output`);
  }
  if (qlId === "TMW-QL-208") {
    assert(/additional daily rate|अतिरिक्त दैनिक दर|ਵਾਧੂ ਰੋਜ਼ਾਨਾ ਦਰ/i.test(answer), `${qlId}:${language}: additional daily rate is not named`);
  }
}

function assertLearnerV2(question: any, qlId: string, language: Tmw001ChapterLanguage, seed: string): void {
  const label = `${qlId}:${language}:${seed}`;
  const learnerSnapshot = JSON.stringify(question.learnerExplanation ?? null);
  assert(question.validation?.valid, `${label}: source or learner validation failed: ${(question.validation?.errors ?? []).join(" | ")} | learner=${learnerSnapshot}`);
  assert(question.publiclyPublishable === false, `${label}: publication lock changed`);
  assert(question.options?.length === 4, `${label}: expected four options`);
  assert(new Set(question.options).size === 4, `${label}: options are not unique`);

  const solvedAnswer = tmwR3SolvedAnswerText(question);
  assert(question.options[question.correctIndex] === solvedAnswer, `${label}: correct option does not equal solved answer: option=${question.options[question.correctIndex]} answer=${solvedAnswer}`);

  assert(question.learnerExplanationVersion === "TMW_LEARNER_V2", `${label}: learner explanation version missing`);
  const learner = question.learnerExplanation;
  assert(learner, `${label}: learner explanation missing`);

  const contractErrors = validateTmwLearnerExplanationV2(learner);
  assert(contractErrors.length === 0, `${label}: learner V2 contract failed: ${contractErrors.join(" | ")}`);
  assert(learner.solution.length >= 2 && learner.solution.length <= 5, `${label}: learner solution must contain 2-5 steps`);
  assert(!("formula" in learner), `${label}: learner V2 exposes a formula block`);
  assert(!("givens" in learner), `${label}: learner V2 exposes a givens block`);
  assert(!("shortcut" in learner), `${label}: learner V2 should not force a shortcut`);
  assert(!("commonMistake" in learner), `${label}: learner V2 should not force a common-mistake block`);

  const visible = [learner.method, ...learner.solution, learner.answer].join(" ");
  const normalizedAnswer = normalizeTmwLearnerDisplayTextR2(solvedAnswer);
  assert(visible.includes(normalizedAnswer), `${label}: learner V2 omits normalized solved answer ${normalizedAnswer}`);
  assert(!/10[- ]Second|10[- ]सेकंड|10[- ]ਸੈਕਿੰਡ/i.test(visible), `${label}: generic 10-second claim leaked into learner V2`);
  assert(!hasUnsafeNotation(visible), `${label}: unsafe notation leaked into learner V2: ${visible}`);
  assert(!/\bFormula\b|\bGivens\b|\bShortcut\b/i.test(visible), `${label}: legacy section label leaked into learner V2`);
  assert(learner.method.length <= 280, `${label}: method is too long`);
  for (const step of learner.solution) assert(step.length <= 320, `${label}: learner solution step is too long`);

  const workingSteps = learner.solution.slice(0, -1);
  assert(
    workingSteps.some((step: string) => /\\\([\s\S]*\d[\s\S]*\\\)/.test(step)),
    `${label}: learner solution has no concrete calculation before the final answer | learner=${learnerSnapshot}`,
  );

  if (language === "hi") assert(/[\u0900-\u097F]/.test(visible), `${label}: Hindi learner explanation has no Devanagari text`);
  if (language === "pa") assert(/[\u0A00-\u0A7F]/.test(visible), `${label}: Punjabi learner explanation has no Gurmukhi text`);

  assertIssueSpecificSemantics(question, qlId, language);
}

let cases = 0;
for (const qlId of QL_IDS) {
  for (const language of LANGUAGES) {
    for (const seedSuffix of SEEDS) {
      const seed = `tmw-r3-learner:${qlId}:${language}:${seedSuffix}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, seed, language });
      assertLearnerV2(question, qlId, language, seed);
      cases += 1;
    }
  }
}

console.log(JSON.stringify({
  chapter: "TMW-001",
  remediation: "R3-learner-explanation-cp007-cp011",
  qls: QL_IDS.length,
  languages: LANGUAGES.length,
  seedsPerQlLanguage: SEEDS.length,
  cases,
  expectedCases: 84 * 3 * 3,
  verdict: "PASS",
}, null, 2));
