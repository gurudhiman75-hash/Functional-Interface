import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function hasLocalizedProseInsideMath(value: string): boolean {
  for (const match of value.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
    if (/[\u0900-\u097F\u0A00-\u0A7F]/u.test(match[1] ?? "")) return true;
  }
  return false;
}

const qls = Array.from({ length: 18 }, (_, index) => `TMW-QL-${String(index + 157).padStart(3, "0")}`);
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const seeds = ["0", "1", "2", "3", "4", "5", "6", "7"] as const;
let checked = 0;
const modes = new Set<string>();

for (const qlId of qls) {
  for (const language of languages) {
    for (const seedSuffix of seeds) {
      const seed = `tmw-cp009-editorial:${qlId}:${language}:${seedSuffix}`;
      const q = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      const label = `${qlId}:${language}:${seedSuffix}`;
      checked += 1;
      modes.add(q.solveMode);
      assert(q.canonicalProblemId === "TMW-CP-009", `${label}: wrong checkpoint`);
      assert(q.questionLanguageId === qlId, `${label}: QL identity mismatch`);
      assert(q.validation?.valid, `${label}: ${q.validation?.errors?.join(" | ")}`);
      assert(q.publiclyPublishable === false, `${label}: publication lock lost`);
      assert(q.options.length === 4 && new Set(q.options).size === 4, `${label}: option contract failed`);
      assert(q.options[q.correctIndex] === q.solution.answerText, `${label}: answer-option mismatch`);
      assert(q.learnerExplanationVersion === "TMW_LEARNER_V2", `${label}: wrong learner version`);
      assert(q.learnerExplanation?.solution?.length >= 2 && q.learnerExplanation.solution.length <= 5, `${label}: learner solution must contain 2-5 connected steps`);
      const learner = [q.learnerExplanation.method, ...q.learnerExplanation.solution, q.learnerExplanation.answer].join(" ");
      assert(!/[\u0000-\u001F\u007F]/u.test(learner), `${label}: control character remains`);
      assert(!/\{\{[^}]+\}\}|\$\{[^}]+\}|\bundefined\b|\bnull\b|\bNaN\b|\bInfinity\b/u.test(learner), `${label}: unresolved learner token remains`);
      if (language === "hi") assert(/[\u0900-\u097F]/u.test(learner), `${label}: Hindi learner text lacks Devanagari`);
      if (language === "pa") assert(/[\u0A00-\u0A7F]/u.test(learner), `${label}: Punjabi learner text lacks Gurmukhi`);
      if (language !== "en") {
        assert(!/boundary is reached within the window/i.test(learner), `${label}: English boundary-window wording remains`);
        assert(!hasLocalizedProseInsideMath(learner), `${label}: localized prose remains inside MathJax`);
      }
      assert(!/\\\(V:V=|\\frac\{E\}\{E\}|\bE:E\b/u.test(learner), `${label}: ambiguous stripped ratio symbols remain`);
      assert(!/\\\(1=60\\\)\s+(?:मिनट घंटा|ਮਿੰਟ ਘੰਟਾ)/u.test(learner), `${label}: malformed hour-minute conversion remains`);

      if (qlId === "TMW-QL-163") assert(/one pipe|एक पाइप|ਇੱਕ ਪਾਈਪ/i.test(q.learnerExplanation.method), `${label}: identical-pipe method is not QL-specific`);
      if (qlId === "TMW-QL-164") assert(/capacity|क्षमता|ਸਮਰੱਥਾ/i.test(q.learnerExplanation.answer) && !/आवश्यक समय|ਲੋੜੀਂਦਾ ਸਮਾਂ/u.test(q.learnerExplanation.answer), `${label}: capacity answer is mislabeled as time`);
      if (qlId === "TMW-QL-167") assert(/1 hour = 60 minutes|1 घंटा = 60 मिनट|1 ਘੰਟਾ = 60 ਮਿੰਟ/u.test(learner), `${label}: readable unit relation missing`);
      if (qlId === "TMW-QL-168") assert(/initial level|प्रारंभिक स्तर|ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ/i.test(q.learnerExplanation.method), `${label}: initial-level method is not explicit`);
      if (qlId === "TMW-QL-169") assert(/final tank level|अंतिम स्तर|ਅੰਤਿਮ ਪੱਧਰ/i.test(q.learnerExplanation.answer) && !/आवश्यक समय|ਲੋੜੀਂਦਾ ਸਮਾਂ/u.test(q.learnerExplanation.answer), `${label}: final level is mislabeled as time`);
      if (qlId === "TMW-QL-170") assert(/capacity ratio \(A:B\)|क्षमता अनुपात \(A:B\)|ਸਮਰੱਥਾ ਅਨੁਪਾਤ \(A:B\)/i.test(learner), `${label}: tank capacity ratio labels are unclear`);
      if (qlId === "TMW-QL-171") {
        assert(/efficiency ratio|दक्षता का अनुपात|ਦੱਖਤਾ ਦਾ ਅਨੁਪਾਤ/i.test(q.learnerExplanation.answer) && !/आवश्यक समय|ਲੋੜੀਂਦਾ ਸਮਾਂ/u.test(q.learnerExplanation.answer), `${label}: efficiency ratio is mislabeled as time`);
        assert(/hours|घंटे|ਘੰਟੇ/u.test(learner), `${label}: old/new filling times omit units`);
      }
      if (qlId === "TMW-QL-172") assert(/percentage reduction|प्रतिशत कमी|ਪ੍ਰਤੀਸ਼ਤ ਘਾਟ/i.test(q.learnerExplanation.answer) && !/आवश्यक समय|ਲੋੜੀਂਦਾ ਸਮਾਂ/u.test(q.learnerExplanation.answer), `${label}: blockage percent is mislabeled as time`);
      if (qlId === "TMW-QL-173") assert(/net direction|पानी के स्तर की दिशा|ਪਾਣੀ ਦੇ ਪੱਧਰ ਦੀ ਦਿਸ਼ਾ/i.test(q.learnerExplanation.answer) && !/आवश्यक दर|ਲੋੜੀਂਦੀ ਦਰ/u.test(q.learnerExplanation.answer), `${label}: direction answer is mislabeled as rate`);
      if (qlId === "TMW-QL-174") {
        assert(/correct conclusion|सही निष्कर्ष|ਸਹੀ ਨਤੀਜਾ/i.test(q.learnerExplanation.answer), `${label}: boundary conclusion label missing`);
        assert(!/है है।|ਹੈ ਹੈ।/u.test(q.learnerExplanation.answer), `${label}: duplicated copula remains`);
      }
    }
  }
}

assert(checked === 432, `Expected 432 CP009 editorial cases, got ${checked}`);
assert(modes.size === 18, `Expected 18 CP009 solve modes, got ${modes.size}`);
console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-009", qls: 18, languages: 3, seedsPerQlLanguage: 8, checked, solveModes: modes.size, publicationLocked: true, verdict: "PASS" }, null, 2));
