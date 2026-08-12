import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const qls = Array.from({ length: 16 }, (_, index) => `TMW-QL-${String(index + 128).padStart(3, "0")}`);
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const seeds = ["0", "1", "2", "3", "4", "5", "6", "7"] as const;

let checked = 0;
const modes = new Set<string>();

for (const qlId of qls) {
  for (const language of languages) {
    for (const seedSuffix of seeds) {
      const seed = `tmw-cp007-editorial:${qlId}:${language}:${seedSuffix}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      const label = `${qlId}:${language}:${seedSuffix}`;
      checked += 1;
      modes.add(question.solveMode);

      assert(question.canonicalProblemId === "TMW-CP-007", `${label}: wrong checkpoint`);
      assert(question.questionLanguageId === qlId, `${label}: QL identity mismatch`);
      assert(question.validation?.valid, `${label}: ${question.validation?.errors?.join(" | ")}`);
      assert(question.publiclyPublishable === false, `${label}: publication lock lost`);
      assert(question.options.length === 4 && new Set(question.options).size === 4, `${label}: option contract failed`);
      assert(question.options[question.correctIndex] === question.solution.answerText, `${label}: answer-option mismatch`);
      assert(question.learnerExplanationVersion === "TMW_LEARNER_V2", `${label}: wrong learner version`);
      assert(question.learnerExplanation?.solution?.length >= 2 && question.learnerExplanation.solution.length <= 5, `${label}: learner solution must contain 2-5 connected steps`);

      const learner = [
        question.learnerExplanation.method,
        ...question.learnerExplanation.solution,
        question.learnerExplanation.answer,
      ].join(" ");

      assert(!/\\text\{|R_\d|e_[A-Za-z]|r_[A-Za-z]|n_[A-Za-z]|T_[A-Za-z]|(?:^|[^A-Za-z])(?:xe|ye)(?:[^A-Za-z]|$)/.test(learner), `${label}: internal solver notation remains`);
      if (language !== "en") {
        assert(!/\bsource capacity\b|\btarget contribution\b|\btotal contribution\b|\bleast feasible\b|\bcomponents per\b|\bcopies per\b|\bbottles per\b|\bweighted contribution\b/i.test(learner), `${label}: untranslated English solver trace remains`);
      }
      assert(!/हर श्रेणी की संख्या × प्रति-सदस्य दर से क्षमता बनाकर आवश्यक अज्ञात निकालें|ਹਰ ਸ਼੍ਰੇਣੀ ਲਈ ਗਿਣਤੀ × ਪ੍ਰਤੀ-ਸਦੱਸ ਦਰ ਨਾਲ ਸਮਰੱਥਾ ਬਣਾਕੇ ਲੋੜੀਂਦਾ ਅਣਜਾਣ ਕੱਢੋ|Convert each category to count × unit-rate capacity/i.test(learner), `${label}: old generic CP007 method remains`);

      if (language === "hi") assert(/[\u0900-\u097F]/u.test(learner), `${label}: Hindi learner text lacks Devanagari`);
      if (language === "pa") assert(/[\u0A00-\u0A7F]/u.test(learner), `${label}: Punjabi learner text lacks Gurmukhi`);

      if (qlId === "TMW-QL-128") {
        const working = question.learnerExplanation.solution[0] ?? "";
        assert(!/(\d+)\s*:\s*(\d+)\s*=\s*\1\s*:\s*\2/.test(working), `${label}: redundant ratio identity remains`);
      }

      if (qlId === "TMW-QL-129") {
        assert(!/तीनों श्रेणियों की एक सदस्य की काम-दर/u.test(question.stem), `${label}: awkward Hindi three-category wording remains`);
        assert(!/ਤਿੰਨਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਇੱਕ ਮੈਂਬਰ ਦੀ ਕੰਮ-ਦਰ/u.test(question.stem), `${label}: awkward Punjabi three-category wording remains`);
      }

      if (qlId === "TMW-QL-132" && language === "hi") {
        assert(!/कितने अतिरिक्त [^?]*(?:मशीनें|लाइनें) चाहिए/u.test(question.stem), `${label}: Hindi feminine count interrogative is wrong`);
      }

      if (qlId === "TMW-QL-133") {
        assert(!/(?:^|[^A-Za-z])(?:R_\d|e_[A-Za-z]|xe|ye|x\+y)(?:[^A-Za-z]|$)/.test(learner), `${label}: algebraic solver trace remains in learner explanation`);
        assert(question.learnerExplanation.solution.length === 5, `${label}: two-count derivation must show four worked steps plus answer`);
        const working = question.learnerExplanation.solution.slice(0, -1).join(" ");
        const first = question.solution.answerValues[0]?.numerator;
        const second = question.solution.answerValues[1]?.numerator;
        assert(first !== undefined && second !== undefined && working.includes(`=${first}`) && working.includes(`=${second}`), `${label}: both solved category counts are not explicitly derived`);
      }

      if (qlId === "TMW-QL-134") {
        assert(!/तीन उत्पादन स्थिति हैं/u.test(question.stem), `${label}: Hindi plural production-situation grammar remains`);
        assert(!/ਤਿੰਨ ਉਤਪਾਦਨ ਸਥਿਤੀ ਹਨ/u.test(question.stem), `${label}: Punjabi plural production-situation grammar remains`);
        if (language === "pa") {
          assert(!question.options.some((option: string) => /1 (?:ਫਾਈਲਾਂ|ਪੁਰਜ਼ੇ|ਬੋਤਲਾਂ|ਕਾਪੀਆਂ|ਕੰਮ-ਇਕਾਈਆਂ)/u.test(option)), `${label}: Punjabi singular option uses plural output noun`);
          assert(!/1 (?:ਫਾਈਲਾਂ|ਪੁਰਜ਼ੇ|ਬੋਤਲਾਂ|ਕਾਪੀਆਂ|ਕੰਮ-ਇਕਾਈਆਂ)/u.test(question.solution.answerText), `${label}: Punjabi singular answer uses plural output noun`);
        }
      }

      if (qlId === "TMW-QL-135" || qlId === "TMW-QL-137") {
        if (language !== "en") assert(!/components|copies per|bottles per/i.test(learner), `${label}: untranslated output-unit fragment remains`);
      }

      if (qlId === "TMW-QL-136" && language === "hi") {
        assert(!/उसकी पूर्णता अवधि/u.test(question.stem), `${label}: mechanical Hindi completion-duration wording remains`);
      }

      if (qlId === "TMW-QL-138") {
        assert(!/प्रति-संसाधन दक्षताओं/u.test(question.stem), `${label}: Hindi mechanical per-resource efficiency wording remains`);
        assert(!/ਪ੍ਰਤੀ-ਸਰੋਤ ਦੱਖਤਾ/u.test(question.stem), `${label}: Punjabi mechanical per-resource efficiency wording remains`);
        assert(!/अतः आवश्यक समय|ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਸਮਾਂ/i.test(question.learnerExplanation.answer), `${label}: equivalent resource-time is mislabeled as ordinary time`);
        if (language === "pa") {
          assert(!/ਬਰਾਬਰ/u.test(question.solution.answerText), `${label}: Punjabi resource-time answer still uses literal 'equal' wording`);
          assert(/ਸਮਤੁੱਲ/u.test(question.solution.answerText), `${label}: Punjabi equivalent resource-time wording missing`);
        }
      }

      if (qlId === "TMW-QL-139") {
        assert(!/(?:^|[^A-Za-z])(?:R_\d|e_[A-Za-z]|xe|ye|x\+y)(?:[^A-Za-z]|$)/.test(learner), `${label}: algebraic solver trace remains in learner explanation`);
        assert(!/positive-integer composition|धनात्मक पूर्णांक संरचना|ਧਨਾਤਮਕ ਪੂਰਨ-ਅੰਕ ਬਣਤਰ/i.test(question.stem), `${label}: mechanical integer-composition wording remains`);
      }

      if (qlId === "TMW-QL-140") {
        assert(!/का ऑर्डर को/u.test(question.stem), `${label}: Hindi order-object grammar remains`);
        assert(!/मशीन अकेले वही काम [^।]+ करता है/u.test(question.stem), `${label}: Hindi feminine machine verb is wrong`);
        assert(!/मशीन अकेले कितना समय लेगा/u.test(question.stem), `${label}: Hindi feminine machine future verb is wrong`);
        assert(!/मशीनें मिलकर [^।]+ पूरा करते हैं/u.test(question.stem), `${label}: Hindi all-machine plural agreement is wrong`);
        const firstWorking = question.learnerExplanation.solution[0] ?? "";
        assert(!/(\\frac\{\d+\}\{\d+\})\s*=\s*\1/.test(firstWorking), `${label}: redundant rate identity remains`);
      }

      if (qlId === "TMW-QL-141") {
        assert(!/का ऑर्डर पर/u.test(question.stem), `${label}: Hindi order-postposition grammar remains`);
        assert(!/ਦਾ ਆਰਡਰ ਉੱਤੇ/u.test(question.stem), `${label}: Punjabi order-postposition grammar remains`);
        assert(!/मशीनें कुल काम का कितना भाग करते हैं/u.test(question.stem), `${label}: Hindi machine plural agreement remains`);
        assert(!/ਮਸ਼ੀਨਾਂ ਕੁੱਲ ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਕਰਦੇ ਹਨ/u.test(question.stem), `${label}: Punjabi machine plural agreement remains`);
        const fractionStep = question.learnerExplanation.solution.at(-2) ?? "";
        assert(!/(\\frac\{\d+\}\{\d+\})\s*=\s*\1/.test(fractionStep), `${label}: redundant fraction identity remains`);
      }

      if (qlId === "TMW-QL-142") {
        const ratioStep = question.learnerExplanation.solution.at(-2) ?? "";
        assert(!/(\d+)\s*:\s*(\d+)\s*=\s*\1\s*:\s*\2/.test(ratioStep), `${label}: redundant crew-ratio identity remains`);
      }

      if (qlId === "TMW-QL-143") {
        assert(!/(?:^|[^A-Za-z])(?:R_\d|e_[A-Za-z]|xe|ye|x\+y)(?:[^A-Za-z]|$)/.test(learner), `${label}: algebraic solver trace remains in learner explanation`);
      }
    }
  }
}

assert(checked === 384, `Expected 384 CP007 editorial cases, got ${checked}`);
assert(modes.size === 16, `Expected 16 CP007 solve modes, got ${modes.size}`);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-007",
  qls: qls.length,
  languages: languages.length,
  seedsPerQlLanguage: seeds.length,
  checked,
  solveModes: modes.size,
  publicationLocked: true,
  verdict: "PASS",
}, null, 2));
