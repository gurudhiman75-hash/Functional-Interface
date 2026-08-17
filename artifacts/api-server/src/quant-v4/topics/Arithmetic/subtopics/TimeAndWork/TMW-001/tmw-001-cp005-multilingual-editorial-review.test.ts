import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function answerScalar(answer: string): string | null {
  const math = /\\\(([\s\S]*?)\\\)/.exec(answer)?.[1]?.trim();
  if (math) return math;
  const fraction = /(-?\d+)\s*\/\s*(\d+)/.exec(answer);
  if (fraction) return `\\frac{${fraction[1]}}{${fraction[2]}}`;
  return /(-?\d+(?:\.\d+)?)/.exec(answer)?.[1] ?? null;
}

const qls = Array.from({ length: 24 }, (_, index) => `TMW-QL-${String(index + 82).padStart(3, "0")}`);
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const seeds = ["0", "1", "2", "3", "4"] as const;
const INVERSE_MODES = new Set([
  "findUnknownRateFromAlternatingCompletion",
  "findUnknownTimeFromAlternatingCompletion",
  "findRequiredCycleRateForDeadline",
]);
const RATE_ANSWER_MODES = new Set([
  "findUnknownRateFromAlternatingCompletion",
  "findRequiredCycleRateForDeadline",
]);
const NON_TERMINAL_GENERIC_MODES = new Set([
  "findStartingAgentFromCompletionCondition",
  "findUnknownRateFromAlternatingCompletion",
  "findUnknownTimeFromAlternatingCompletion",
  "findCycleCountToReachSpecifiedFraction",
  "findOutputUnderPeriodicMachineSchedule",
  "findRequiredCycleRateForDeadline",
]);

let checked = 0;
const modes = new Set<string>();

for (const qlId of qls) {
  for (const language of languages) {
    for (const seedSuffix of seeds) {
      const seed = `tmw-cp005-editorial:${qlId}:${language}:${seedSuffix}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      const label = `${qlId}:${language}:${seedSuffix}`;
      checked += 1;
      modes.add(question.solveMode);

      assert(question.canonicalProblemId === "TMW-CP-005", `${label}: wrong checkpoint`);
      assert(question.questionLanguageId === qlId, `${label}: QL identity mismatch`);
      assert(question.validation?.valid, `${label}: ${question.validation?.errors?.join(" | ")}`);
      assert(question.publiclyPublishable === false, `${label}: publication lock lost`);
      assert(question.options.length === 4 && new Set(question.options).size === 4, `${label}: option contract failed`);
      assert(question.options[question.correctIndex] === question.solution.answerText, `${label}: answer-option mismatch`);
      assert(question.learnerExplanationVersion === "TMW_LEARNER_V2", `${label}: wrong learner version`);
      assert(question.learnerExplanation?.solution?.length >= 2 && question.learnerExplanation.solution.length <= 5, `${label}: solution must contain 2-5 connected steps`);

      const learner = [
        question.learnerExplanation.method,
        ...question.learnerExplanation.solution,
        question.learnerExplanation.answer,
      ].join(" ");

      assert(!/W_\{|W_cycle|W_remaining|W_known|t_x|r_x|T_x|Q_1|Q_2|Verified(?: exact| cycle| isolated| repeated| schedule)/i.test(learner), `${label}: internal solver notation leaked`);
      assert(!/Continue the calculation|After simplification|Substitute the work, rate and time/i.test(learner), `${label}: mechanical learner wording returned`);

      if (language === "hi") assert(/[\u0900-\u097F]/u.test(learner), `${label}: Hindi learner text lacks Devanagari`);
      if (language === "pa") assert(/[\u0A00-\u0A7F]/u.test(learner), `${label}: Punjabi learner text lacks Gurmukhi`);

      if (NON_TERMINAL_GENERIC_MODES.has(question.solveMode)) {
        assert(!/सीमा पार किए बिना पूरे चक्र लगाएँ|अंतिम बचे काम को अंतिम बारी में पूरा करें|ਹੱਦ ਪਾਰ ਕੀਤੇ ਬਿਨਾਂ ਪੂਰੇ ਚੱਕਰ ਲਗਾਓ|ਅੰਤਿਮ ਬਚਿਆ ਕੰਮ ਆਖਰੀ ਵਾਰੀ ਵਿੱਚ ਪੂਰਾ ਕਰੋ|Use complete cycles without crossing the finish|Finish the remainder in the terminal turn/i.test(learner), `${label}: generic completion labels used for a non-completion target`);
      }

      if (INVERSE_MODES.has(question.solveMode)) {
        assert(/A/.test(learner) && /B/.test(learner), `${label}: inverse explanation does not identify A and B explicitly`);
        assert(!/unknown worker|known worker|अज्ञात कर्मी|ज्ञात कर्मी|ਅਣਜਾਣ ਕਰਮਚਾਰੀ|ਜਾਣੇ ਕਰਮਚਾਰੀ/i.test(learner), `${label}: generic worker labels returned in inverse explanation`);
        const scalar = answerScalar(question.solution.answerText);
        assert(scalar, `${label}: inverse solved answer has no extractable scalar`);
        const working = question.learnerExplanation.solution.slice(0, -1).join(" ");
        assert(working.includes(`\\(${scalar}\\)`), `${label}: decisive inverse working does not contain the solved answer value ${scalar}`);
      }

      if (RATE_ANSWER_MODES.has(question.solveMode)) {
        const scalar = answerScalar(question.solution.answerText);
        const decisive = question.learnerExplanation.solution.at(-2) ?? "";
        assert(scalar && decisive.includes(`\\(${scalar}\\)`), `${label}: required-rate step is not aligned to the final rate answer`);
      }

      if (question.solveMode === "findStartingAgentFromCompletionCondition") {
        assert(/A/.test(learner) && /B/.test(learner), `${label}: both possible starting orders are not compared`);
      }

      if (question.solveMode === "findRemainingWorkAfterFullCycles") {
        const scalar = answerScalar(question.solution.answerText);
        const working = question.learnerExplanation.solution.slice(0, -1).join(" ");
        assert(scalar && working.includes(scalar), `${label}: remaining-work subtraction does not reach the solved answer ${scalar}`);
        const required = language === "hi" ? /बचा काम = पूरा काम/u : language === "pa" ? /ਬਚਿਆ ਕੰਮ = ਸਾਰਾ ਕੰਮ/u : /Remaining work = whole work/i;
        assert(required.test(working), `${label}: explicit remaining-work subtraction is missing`);
      }

      if (question.solveMode === "findCycleCountToReachSpecifiedFraction") {
        const required = language === "hi" ? /लक्षित काम/u : language === "pa" ? /ਟੀਚੇ ਵਾਲਾ ਕੰਮ/u : /Target work/i;
        assert(required.test(learner), `${label}: target-work cycle logic is not explicit`);
      }

      if (question.solveMode === "findOutputUnderPeriodicMachineSchedule") {
        const required = language === "hi" ? /मशीन A.*उत्पादन|एक पूरे चक्र का उत्पादन/u : language === "pa" ? /ਮਸ਼ੀਨ A.*ਉਤਪਾਦਨ|ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਦਾ ਉਤਪਾਦਨ/u : /Output of machine A|Output in one complete cycle/i;
        assert(required.test(learner), `${label}: machine-output explanation is not output-specific`);
      }
    }
  }
}

assert(checked === 360, `Expected 360 CP005 editorial cases, got ${checked}`);
assert(modes.size === 24, `Expected 24 CP005 solve modes, got ${modes.size}`);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-005",
  qls: qls.length,
  languages: languages.length,
  seedsPerQlLanguage: seeds.length,
  checked,
  solveModes: modes.size,
  inverseAnswerAlignment: true,
  remainingWorkAnswerAlignment: true,
  publicationLocked: true,
  verdict: "PASS",
}, null, 2));
