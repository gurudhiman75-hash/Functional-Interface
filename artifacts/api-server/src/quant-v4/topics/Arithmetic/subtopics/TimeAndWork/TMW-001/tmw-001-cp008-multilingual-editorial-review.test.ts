import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

const qls = Array.from({ length: 13 }, (_, index) => `TMW-QL-${String(index + 144).padStart(3, "0")}`);
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const seeds = ["0", "1", "2", "3", "4", "5", "6", "7"] as const;
let checked = 0;
const modes = new Set<string>();

for (const qlId of qls) {
  for (const language of languages) {
    for (const seedSuffix of seeds) {
      const seed = `tmw-cp008-editorial:${qlId}:${language}:${seedSuffix}`;
      const q = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      const label = `${qlId}:${language}:${seedSuffix}`;
      checked += 1;
      modes.add(q.solveMode);
      assert(q.canonicalProblemId === "TMW-CP-008", `${label}: wrong checkpoint`);
      assert(q.questionLanguageId === qlId, `${label}: QL identity mismatch`);
      assert(q.validation?.valid, `${label}: ${q.validation?.errors?.join(" | ")}`);
      assert(q.publiclyPublishable === false, `${label}: publication lock lost`);
      assert(q.options.length === 4 && new Set(q.options).size === 4, `${label}: option contract failed`);
      assert(q.options[q.correctIndex] === q.solution.answerText, `${label}: answer-option mismatch`);
      assert(q.learnerExplanationVersion === "TMW_LEARNER_V2", `${label}: wrong learner version`);
      assert(q.learnerExplanation?.solution?.length >= 2 && q.learnerExplanation.solution.length <= 5, `${label}: learner solution must contain 2-5 connected steps`);
      const learner = [q.learnerExplanation.method, ...q.learnerExplanation.solution, q.learnerExplanation.answer].join(" ");
      const presentation = [q.stem, learner, ...(q.explanation?.steps ?? []), q.explanation?.commonTrap?.explanation ?? ""].join(" ");
      assert(!/[\u0000-\u001F\u007F]/u.test(presentation), `${label}: control character remains`);
      if (language !== "en") assert(!/Target fraction|accepted components|accepted square metres|per accepted unit|square metres per|components per/i.test(presentation), `${label}: untranslated English learner fragment remains`);
      if (language === "hi") assert(/[\u0900-\u097F]/u.test(learner), `${label}: Hindi learner text lacks Devanagari`);
      if (language === "pa") assert(/[\u0A00-\u0A7F]/u.test(learner), `${label}: Punjabi learner text lacks Gurmukhi`);
      assert(!/रंगाई का ठेका के लिए|ਰੰਗਾਈ ਦਾ ਠੇਕਾ ਲਈ/u.test(q.stem), `${label}: contract postposition grammar remains`);
      assert(!/हर व्यक्ति का वास्तविक योगदान निकालकर उसी अनुपात में भुगतान बाँटें|ਹਰ ਵਿਅਕਤੀ ਦਾ ਅਸਲ ਯੋਗਦਾਨ ਕੱਢ ਕੇ ਉਸੇ ਅਨੁਪਾਤ ਵਿੱਚ ਭੁਗਤਾਨ ਵੰਡੋ/i.test(learner), `${label}: old generic learner method remains`);
      if (q.solveMode !== "findTotalPaymentPoolFromKnownShare" && q.explanation?.commonTrap?.misconceptionId === "TOTAL_REPORTED_AS_SHARE") {
        assert(!/प्रश्न कुल भुगतान राशि पूछता है|ਪ੍ਰਸ਼ਨ ਕੁੱਲ ਭੁਗਤਾਨ ਰਕਮ ਪੁੱਛਦਾ ਹੈ/u.test(q.explanation.commonTrap.explanation), `${label}: trap misstates question target`);
      }
      if (qlId === "TMW-QL-145") assert(!/(\d+)=\1(?:[^\d]|$)/.test(learner), `${label}: redundant selected-contribution identity remains`);
      if (qlId === "TMW-QL-146") assert(!/1\\times3\\times4\\times5|1\\times2\\times4\\times5|1\\times1\\times4\\times5/.test(learner), `${label}: explanation uses hidden contribution factors instead of stated ratio`);
      if (qlId === "TMW-QL-148") assert(/equal daily hours cancel|प्रतिदिन समान घंटे कट|ਹਰ ਰੋਜ਼ ਇੱਕੋ ਘੰਟੇ ਕੱਟ/i.test(learner), `${label}: equal unspecified hours are not explicitly cancelled`);
      if (qlId === "TMW-QL-149") assert(!/Target fraction/i.test(learner), `${label}: English target-fraction label remains`);
      if (qlId === "TMW-QL-153") assert(/equal time cancels|समान समय कट|ਇੱਕੋ ਸਮਾਂ ਕੱਟ/i.test(learner), `${label}: hidden equal-time factor is not explicitly cancelled`);
      if (qlId === "TMW-QL-154") assert(!/accepted|per accepted/i.test(language === "en" ? "" : learner), `${label}: English piece-rate unit remains in localized learner steps`);
    }
  }
}
assert(checked === 312, `Expected 312 CP008 editorial cases, got ${checked}`);
assert(modes.size === 13, `Expected 13 CP008 solve modes, got ${modes.size}`);
console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-008", qls: 13, languages: 3, seedsPerQlLanguage: 8, checked, solveModes: modes.size, publicationLocked: true, verdict: "PASS" }, null, 2));
