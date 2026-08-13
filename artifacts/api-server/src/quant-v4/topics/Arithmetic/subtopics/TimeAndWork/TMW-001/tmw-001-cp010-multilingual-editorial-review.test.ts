import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

const qls = Array.from({ length: 18 }, (_, index) => `TMW-QL-${String(index + 175).padStart(3, "0")}`);
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const seeds = ["0", "1", "2", "3", "4", "5", "6", "7"] as const;
let checked = 0;
const modes = new Set<string>();

function hasLocalizedScheduleProseInsideMath(value: string): boolean {
  for (const match of value.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
    const inside = match[1] ?? "";
    if (/चरण|अंतिम चक्र|बाकी स्तर|पाली|अंतराल|ਪੜਾਅ|ਅੰਤਿਮ ਚੱਕਰ|ਬਾਕੀ ਪੱਧਰ|ਸ਼ਿਫ਼ਟ|ਅੰਤਰਾਲ/u.test(inside)) return true;
  }
  return false;
}

for (const qlId of qls) {
  for (const language of languages) {
    for (const seedSuffix of seeds) {
      const seed = `tmw-cp010-editorial:${qlId}:${language}:${seedSuffix}`;
      const q = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      const label = `${qlId}:${language}:${seedSuffix}`;
      checked += 1;
      modes.add(q.solveMode);

      assert(q.canonicalProblemId === "TMW-CP-010", `${label}: wrong checkpoint`);
      assert(q.questionLanguageId === qlId, `${label}: QL identity mismatch`);
      assert(q.validation?.valid, `${label}: ${q.validation?.errors?.join(" | ")}`);
      assert(q.publiclyPublishable === false, `${label}: publication lock lost`);
      assert(q.options.length === 4 && new Set(q.options).size === 4, `${label}: option contract failed`);
      assert(q.correctIndex >= 0 && q.correctIndex < 4, `${label}: correctIndex invalid`);
      assert(q.options[q.correctIndex] === q.solution.answerText, `${label}: answer-option mismatch`);
      assert(q.learnerExplanationVersion === "TMW_LEARNER_V2", `${label}: wrong learner version`);
      assert(q.learnerExplanation?.solution?.length >= 2 && q.learnerExplanation.solution.length <= 5, `${label}: learner solution must contain 2-5 connected steps`);

      const learner = [q.learnerExplanation.method, ...q.learnerExplanation.solution, q.learnerExplanation.answer].join(" ");
      const presentation = [q.stem, learner].join(" ");
      assert(!/[\u0000-\u001F\u007F]/u.test(presentation), `${label}: control character remains`);
      assert(!/\{\{[^}]+\}\}|\$\{[^}]+\}|\bundefined\b|\bnull\b|\bNaN\b|\bInfinity\b/u.test(presentation), `${label}: unresolved learner token remains`);
      assert(!/\\text\{(?:Stage|Complete cycles before|level still required|completion occurs|terminal segment)/i.test(learner), `${label}: internal schedule prose remains inside learner MathJax`);
      assert(!/घंटा\\\) घंटे|ਘੰਟਾ\\\) ਘੰਟੇ/u.test(learner), `${label}: segment label is incorrectly presented as a duration`);
      assert(!/\\\(r_\d+=.+?\\quad \\Delta L=.+?\\\)\s+(?:tank\/hour|टंकी\/घंटा|ਟੈਂਕੀ\/ਘੰਟਾ)/u.test(learner), `${label}: rate unit still applies ambiguously to level change`);

      if (language === "hi") {
        assert(/[\u0900-\u097F]/u.test(learner), `${label}: Hindi learner text lacks Devanagari`);
        assert(!/चलती है[^।;?]*चलता है|चलते हैं[^।;?]*चलता है|चलती है हो जाती है|चलती है चालू करता है/u.test(q.stem), `${label}: broken Hindi staged-schedule agreement remains`);
        assert(!hasLocalizedScheduleProseInsideMath(learner), `${label}: Hindi schedule prose remains inside MathJax`);
        assert(!/Pump-on|Pump-off|Drainage|Drain interval|Inlet [A-Z]|Outlet [A-Z]/i.test(learner), `${label}: English cycle label remains in Hindi learner text`);
        assert(!/टंकी .* का अंतराल में/u.test(learner), `${label}: Hindi terminal-segment postposition grammar remains`);
      }
      if (language === "pa") {
        assert(/[\u0A00-\u0A7F]/u.test(learner), `${label}: Punjabi learner text lacks Gurmukhi`);
        assert(!/ਚੱਲਦੀ ਹੈ[^।;?]*ਚੱਲਦਾ ਹੈ|ਚੱਲਦੇ ਹਨ[^।;?]*ਚੱਲਦਾ ਹੈ|ਚੱਲਦੀ ਹੈ ਹੋ ਜਾਂਦੀ ਹੈ|ਚੱਲਦੀ ਹੈ ਚਾਲੂ ਕਰਦਾ ਹੈ/u.test(q.stem), `${label}: broken Punjabi staged-schedule agreement remains`);
        assert(!hasLocalizedScheduleProseInsideMath(learner), `${label}: Punjabi schedule prose remains inside MathJax`);
        assert(!/Pump-on|Pump-off|Drainage|Drain interval|Inlet [A-Z]|Outlet [A-Z]/i.test(learner), `${label}: English cycle label remains in Punjabi learner text`);
        assert(!/ਟੈਂਕੀ .* ਦਾ ਅੰਤਰਾਲ ਵਿੱਚ/u.test(learner), `${label}: Punjabi terminal-segment postposition grammar remains`);
      }

      if (qlId === "TMW-QL-180") assert(/final tank level|अंत में टंकी|ਅੰਤ ਵਿੱਚ ਟੈਂਕੀ/i.test(q.learnerExplanation.answer), `${label}: final level answer label is generic`);
      if (qlId === "TMW-QL-183") {
        assert(/final-inlet rate|अंतिम भराव पाइप की आवश्यक दर|ਅੰਤਿਮ ਭਰਨ ਵਾਲੀ ਪਾਈਪ ਦੀ ਲੋੜੀਂਦੀ ਦਰ/i.test(q.learnerExplanation.answer), `${label}: final-stage rate answer label is generic`);
        if (language === "hi") assert(/अज्ञात अंतिम भराव पाइप/u.test(q.stem), `${label}: Hindi unknown final-stage rate target remains ambiguous`);
        if (language === "pa") assert(/ਅਣਜਾਣ ਅੰਤਿਮ ਭਰਨ ਵਾਲੀ ਪਾਈਪ/u.test(q.stem), `${label}: Punjabi unknown final-stage rate target remains ambiguous`);
      }
      if (qlId === "TMW-QL-184") assert(/tank capacity|टंकी की क्षमता|ਟੈਂਕੀ ਦੀ ਸਮਰੱਥਾ/i.test(q.learnerExplanation.answer), `${label}: capacity answer label is generic`);
      if (["TMW-QL-185", "TMW-QL-186", "TMW-QL-188", "TMW-QL-189", "TMW-QL-190", "TMW-QL-191"].includes(qlId)) {
        assert(/cycle|चक्र|ਚੱਕਰ/i.test(q.learnerExplanation.method), `${label}: cyclic family still uses generic staged method`);
      }
      if (qlId === "TMW-QL-187" && language === "hi") assert(!/\d+वीं/u.test(q.stem), `${label}: numeric Hindi ordinal remains`);
      if (qlId === "TMW-QL-187" && language === "pa") assert(!/\d+ਵੀਂ/u.test(q.stem), `${label}: numeric Punjabi ordinal remains`);
      if (qlId === "TMW-QL-189") assert(!/संख्या\s+\d+\s+पूरे चक्र|ਗਿਣਤੀ\s+\d+\s+ਪੂਰੇ ਚੱਕਰ/u.test(q.learnerExplanation.answer), `${label}: duplicated cycle-count wording remains`);
      if (qlId === "TMW-QL-190") assert(/terminal segment|पहली बार पूरी भरती|ਪਹਿਲੀ ਵਾਰ ਪੂਰੀ ਭਰਦੀ/i.test(q.learnerExplanation.answer), `${label}: terminal-segment answer label is generic`);
      if (qlId === "TMW-QL-192") {
        assert(/required by the deadline|समय-सीमा के लिए आवश्यक|ਸਮਾਂ-ਸੀਮਾ ਲਈ ਲੋੜੀਂਦਾ/i.test(q.learnerExplanation.solution.join(" ")), `${label}: deadline-required change time is not explicit`);
        assert(/originally planned|मूल नियोजित|ਮੂਲ ਯੋਜਿਤ/i.test(q.learnerExplanation.solution.join(" ")), `${label}: original change time is not explicit`);
        assert(!/बाद में/u.test(q.learnerExplanation.answer), `${label}: awkward Hindi 'बाद में' remains`);
      }
    }
  }
}

assert(checked === 432, `Expected 432 CP010 editorial cases, got ${checked}`);
assert(modes.size === 18, `Expected 18 CP010 solve modes, got ${modes.size}`);
console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-010", qls: 18, languages: 3, seedsPerQlLanguage: 8, checked, solveModes: modes.size, publicationLocked: true, verdict: "PASS" }, null, 2));
