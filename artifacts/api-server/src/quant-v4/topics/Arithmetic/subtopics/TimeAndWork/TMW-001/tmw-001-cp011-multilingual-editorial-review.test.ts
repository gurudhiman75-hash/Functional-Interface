import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const qls = Array.from({ length: 19 }, (_, index) =>
  `TMW-QL-${String(index + 193).padStart(3, "0")}`,
);
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const seeds = ["0", "1", "2", "3", "4", "5", "6", "7"] as const;
let checked = 0;
const modes = new Set<string>();

function numericTokens(value: string): string[] {
  return (value.match(/-?\d+(?:\.\d+)?(?:\/\d+)?/g) ?? []).sort();
}

function comparableNumbers(question: ReturnType<typeof runTmw001ChapterPipeline>): string[] {
  return numericTokens([question.stem, ...question.options].join(" "));
}

function learnerText(question: ReturnType<typeof runTmw001ChapterPipeline>): string {
  return [
    question.learnerExplanation.method,
    ...question.learnerExplanation.solution,
    question.learnerExplanation.answer,
  ].join(" ");
}

for (const qlId of qls) {
  for (const seedSuffix of seeds) {
    const seed = `tmw-cp011-editorial:${qlId}:${seedSuffix}`;
    const generated = new Map<Tmw001ChapterLanguage, ReturnType<typeof runTmw001ChapterPipeline>>();

    for (const language of languages) {
      const q = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      generated.set(language, q);
      const label = `${qlId}:${language}:${seedSuffix}`;
      const learner = learnerText(q);
      const presentation = [q.stem, ...q.options, learner].join(" ");
      checked += 1;
      modes.add(q.solveMode);

      assert(q.canonicalProblemId === "TMW-CP-011", `${label}: wrong checkpoint`);
      assert(q.questionLanguageId === qlId, `${label}: QL identity mismatch`);
      assert(q.validation?.valid, `${label}: ${q.validation?.errors?.join(" | ")}`);
      assert(q.publiclyPublishable === false, `${label}: publication lock lost`);
      assert(q.options.length === 4 && new Set(q.options).size === 4, `${label}: option contract failed`);
      assert(q.correctIndex >= 0 && q.correctIndex < 4, `${label}: correctIndex invalid`);
      assert(q.options[q.correctIndex] === q.solution.answerText, `${label}: answer-option mismatch`);
      assert(q.learnerExplanationVersion === "TMW_LEARNER_V2", `${label}: wrong learner version`);
      assert(
        q.learnerExplanation?.solution?.length >= 2 && q.learnerExplanation.solution.length <= 5,
        `${label}: learner solution must contain 2-5 connected steps`,
      );

      assert(!/[\u0000-\u001F\u007F]/u.test(presentation), `${label}: control character remains`);
      assert(
        !/\{\{[^}]+\}\}|\$\{[^}]+\}|\bundefined\b|\bnull\b|\bNaN\b|\bInfinity\b/u.test(presentation),
        `${label}: unresolved learner token remains`,
      );
      assert(!/\[TMW:|=>|\beval\b/u.test(presentation), `${label}: internal implementation marker remains`);

      if (language === "en") {
        assert(/[A-Za-z]/u.test(learner), `${label}: English learner text lacks Latin prose`);
      }
      if (language === "hi") {
        assert(/[\u0900-\u097F]/u.test(learner), `${label}: Hindi learner text lacks Devanagari`);
        assert(
          !/10-सेकंड तरीका|दिनक्रम|शुद्ध काम|चिह्न सहित|सही नियम लिखें/u.test(learner),
          `${label}: terse/internal Hindi editorial wording remains`,
        );
      }
      if (language === "pa") {
        assert(/[\u0A00-\u0A7F]/u.test(learner), `${label}: Punjabi learner text lacks Gurmukhi`);
        assert(
          !/10-ਸਕਿੰਟ ਤਰੀਕਾ|ਦਿਨਕ੍ਰਮ|ਸ਼ੁੱਧ ਕੰਮ|ਚਿੰਨ੍ਹ ਸਮੇਤ|ਠੀਕ ਨਿਯਮ ਲਿਖੋ/u.test(learner),
          `${label}: terse/internal Punjabi editorial wording remains`,
        );
      }

      if (qlId === "TMW-QL-193" && language === "hi") {
        assert(/समान अंतर|पहली.*अंतिम दर/u.test(learner), `${label}: arithmetic-rate teaching cue is missing`);
        assert(!/AP के कुल/u.test(learner), `${label}: unexplained AP shorthand remains`);
      }
      if (qlId === "TMW-QL-193" && language === "pa") {
        assert(/ਇੱਕੋ ਫਰਕ|ਪਹਿਲੀ.*ਆਖਰੀ ਦਰ/u.test(learner), `${label}: arithmetic-rate teaching cue is missing`);
        assert(!/AP ਦੇ ਕੁੱਲ/u.test(learner), `${label}: unexplained AP shorthand remains`);
      }
      if (qlId === "TMW-QL-195" && language === "hi") {
        assert(!/n दिनों में दर केवल n−1 बार बदलती है/u.test(learner), `${label}: symbolic trap prose remains`);
        assert(/दिनों की संख्या से एक कम बार/u.test(learner), `${label}: naturalized change-count explanation missing`);
      }
      if (qlId === "TMW-QL-195" && language === "pa") {
        assert(!/n ਦਿਨਾਂ ਵਿੱਚ ਦਰ ਕੇਵਲ n−1 ਵਾਰ ਬਦਲਦੀ ਹੈ/u.test(learner), `${label}: symbolic trap prose remains`);
        assert(/ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਤੋਂ ਇੱਕ ਘੱਟ ਵਾਰ/u.test(learner), `${label}: naturalized change-count explanation missing`);
      }
      if (qlId === "TMW-QL-197" && language === "hi") {
        assert(/गुणोत्तर दर-श्रृंखला/u.test(learner), `${label}: geometric-rate concept is not named pedagogically`);
        assert(/गुणा/u.test(learner), `${label}: multiplicative-rate teaching cue missing`);
      }
      if (qlId === "TMW-QL-197" && language === "pa") {
        assert(/ਗੁਣੋੱਤਰ ਦਰ-ਲੜੀ/u.test(learner), `${label}: geometric-rate concept is not named pedagogically`);
        assert(/ਗੁਣਾ/u.test(learner), `${label}: multiplicative-rate teaching cue missing`);
      }
      if (qlId === "TMW-QL-200" && language === "hi") {
        assert(!/गुणक r को प्रतिदिन जोड़ने वाली/u.test(learner), `${label}: raw multiplier-r trap wording remains`);
        assert(/हर नई दर पिछली दर/u.test(learner), `${label}: multiplier teaching explanation missing`);
      }
      if (qlId === "TMW-QL-200" && language === "pa") {
        assert(!/ਗੁਣਕ r ਨੂੰ ਹਰ ਦਿਨ ਜੋੜੀ ਜਾਣ ਵਾਲੀ/u.test(learner), `${label}: raw multiplier-r trap wording remains`);
        assert(/ਹਰ ਨਵੀਂ ਦਰ ਪਿਛਲੀ ਦਰ/u.test(learner), `${label}: multiplier teaching explanation missing`);
      }
      if (qlId === "TMW-QL-202" && language === "hi") {
        assert(/बदलाव से पहले/u.test(learner), `${label}: pre-change unknown is not explicit`);
        assert(/पुरानी दर वाले दिनों/u.test(learner), `${label}: old-rate day interpretation missing`);
      }
      if (qlId === "TMW-QL-202" && language === "pa") {
        assert(/ਬਦਲਾਅ ਤੋਂ ਪਹਿਲਾਂ/u.test(learner), `${label}: pre-change unknown is not explicit`);
        assert(/ਪੁਰਾਣੀ ਦਰ ਵਾਲੇ ਦਿਨਾਂ/u.test(learner), `${label}: old-rate day interpretation missing`);
      }
    }

    const english = generated.get("en");
    const hindi = generated.get("hi");
    const punjabi = generated.get("pa");
    assert(english && hindi && punjabi, `${qlId}:${seedSuffix}: missing language generation`);
    const englishNumbers = comparableNumbers(english);
    assert(
      JSON.stringify(comparableNumbers(hindi)) === JSON.stringify(englishNumbers),
      `${qlId}:${seedSuffix}: Hindi numeric parity mismatch`,
    );
    assert(
      JSON.stringify(comparableNumbers(punjabi)) === JSON.stringify(englishNumbers),
      `${qlId}:${seedSuffix}: Punjabi numeric parity mismatch`,
    );
  }
}

assert(checked === 456, `Expected 456 CP011 editorial cases, got ${checked}`);
assert(modes.size === 19, `Expected 19 CP011 solve modes, got ${modes.size}`);
console.log(
  JSON.stringify(
    {
      chapter: "TMW-001",
      checkpoint: "TMW-CP-011",
      qls: 19,
      languages: 3,
      seedsPerQlLanguage: 8,
      checked,
      solveModes: modes.size,
      numericParity: true,
      publicationLocked: true,
      verdict: "PASS",
    },
    null,
    2,
  ),
);
