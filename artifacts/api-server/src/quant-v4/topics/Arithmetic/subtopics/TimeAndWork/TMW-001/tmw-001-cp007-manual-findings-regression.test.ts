import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const qls = [
  "TMW-QL-133",
  "TMW-QL-134",
  "TMW-QL-138",
  "TMW-QL-139",
  "TMW-QL-140",
  "TMW-QL-141",
  "TMW-QL-142",
] as const;
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const namespaces = ["tmw-cp007-editorial", "tmw-cp007-editorial-review"] as const;
const seeds = ["0", "1", "2", "3", "4", "5", "6", "7"] as const;
let checked = 0;

for (const qlId of qls) {
  for (const language of languages) {
    for (const namespace of namespaces) {
      for (const seedSuffix of seeds) {
        const seed = `${namespace}:${qlId}:${language}:${seedSuffix}`;
        const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
        const label = `${qlId}:${language}:${namespace}:${seedSuffix}`;
        checked += 1;

        assert(question.validation?.valid, `${label}: ${question.validation?.errors?.join(" | ")}`);
        assert(question.publiclyPublishable === false, `${label}: publication lock lost`);
        assert(question.options.length === 4 && new Set(question.options).size === 4, `${label}: option contract failed`);
        assert(question.options[question.correctIndex] === question.solution.answerText, `${label}: answer-option mismatch`);

        const learner = [question.learnerExplanation.method, ...question.learnerExplanation.solution, question.learnerExplanation.answer].join(" ");
        assert(!/\\text\{|R_\d|e_[A-Za-z]|r_[A-Za-z]|n_[A-Za-z]|T_[A-Za-z]|(?:^|[^A-Za-z])(?:xe|ye)(?:[^A-Za-z]|$)/.test(learner), `${label}: internal solver notation remains`);
        if (language !== "en") {
          assert(!/source capacity|target contribution|total contribution|least feasible|components per|copies per|bottles per|weighted contribution/i.test(learner), `${label}: untranslated English trace remains`);
        }

        if (qlId === "TMW-QL-133") {
          assert(question.learnerExplanation.solution.length === 5, `${label}: QL133 must show four worked steps plus the answer`);
          const working = question.learnerExplanation.solution.slice(0, -1).join(" ");
          for (const value of question.solution.answerValues) {
            assert(working.includes(`=${value.numerator}`) || working.includes(`=${value.numerator}\\`), `${label}: QL133 does not explicitly derive solved count ${value.numerator}`);
          }
        }

        if (qlId === "TMW-QL-134" && language === "pa") {
          assert(!question.options.some((option: string) => /1 (?:ਫਾਈਲਾਂ|ਪੁਰਜ਼ੇ|ਬੋਤਲਾਂ|ਕਾਪੀਆਂ|ਕੰਮ-ਇਕਾਈਆਂ)/u.test(option)), `${label}: singular Punjabi option uses plural output noun`);
          assert(!/1 (?:ਫਾਈਲਾਂ|ਪੁਰਜ਼ੇ|ਬੋਤਲਾਂ|ਕਾਪੀਆਂ|ਕੰਮ-ਇਕਾਈਆਂ)/u.test(question.solution.answerText), `${label}: singular Punjabi answer uses plural output noun`);
        }

        if (qlId === "TMW-QL-138" && language === "pa") {
          assert(/ਸਮਤੁੱਲ/u.test(question.solution.answerText), `${label}: Punjabi equivalent-resource wording missing`);
          assert(!/ਬਰਾਬਰ/u.test(question.solution.answerText), `${label}: literal equal wording remains`);
        }

        if (qlId === "TMW-QL-139") {
          assert(!/positive-integer composition|धनात्मक पूर्णांक संरचना|ਧਨਾਤਮਕ ਪੂਰਨ-ਅੰਕ ਬਣਤਰ/i.test(question.stem), `${label}: mechanical integer-composition stem remains`);
        }

        if (qlId === "TMW-QL-140" && language === "hi") {
          assert(!/मशीनें मिलकर [^।]+ पूरा करते हैं/u.test(question.stem), `${label}: Hindi machine plural agreement remains`);
          assert(!/मशीन अकेले वही काम [^।]+ करता है/u.test(question.stem), `${label}: Hindi machine singular agreement remains`);
          assert(!/मशीन अकेले कितना समय लेगा/u.test(question.stem), `${label}: Hindi machine future agreement remains`);
        }

        if (qlId === "TMW-QL-141") {
          if (language === "hi") assert(!/ का ऑर्डर पर/u.test(question.stem), `${label}: Hindi order postposition remains`);
          if (language === "pa") assert(!/ ਦਾ ਆਰਡਰ ਉੱਤੇ/u.test(question.stem), `${label}: Punjabi order postposition remains`);
          const fractionStep = question.learnerExplanation.solution.at(-2) ?? "";
          assert(!/(\\frac\{\d+\}\{\d+\})\s*=\s*\1/.test(fractionStep), `${label}: redundant fraction identity remains`);
        }

        if (qlId === "TMW-QL-142") {
          const ratioStep = question.learnerExplanation.solution.at(-2) ?? "";
          assert(!/(\d+)\s*:\s*(\d+)\s*=\s*\1\s*:\s*\2/.test(ratioStep), `${label}: redundant ratio identity remains`);
        }
      }
    }
  }
}

assert(checked === 336, `Expected 336 targeted CP007 manual-review cases, got ${checked}`);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-007",
  targetedQls: qls.length,
  languages: languages.length,
  seedNamespaces: namespaces.length,
  seedsPerNamespace: seeds.length,
  checked,
  publicationLocked: true,
  verdict: "PASS",
}, null, 2));
