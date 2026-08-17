import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function answerScalar(answer: string): string | null {
  const math = /\\\(([\s\S]*?)\\\)/.exec(answer)?.[1]?.trim();
  if (math) {
    const mixed = /(\d+)\\frac\{(\d+)\}\{(\d+)\}/.exec(math);
    if (mixed) return null;
    const fraction = /\\frac\{(-?\d+)\}\{(\d+)\}/.exec(math);
    if (fraction) return `\\frac{${fraction[1]}}{${fraction[2]}}`;
    const number = /-?\d+(?:\.\d+)?/.exec(math)?.[0];
    if (number) return number;
  }
  const fraction = /(-?\d+)\s*\/\s*(\d+)/.exec(answer);
  if (fraction) return `\\frac{${fraction[1]}}{${fraction[2]}}`;
  return /-?\d+(?:\.\d+)?/.exec(answer)?.[0] ?? null;
}

const qls = Array.from({ length: 22 }, (_, index) => `TMW-QL-${String(index + 106).padStart(3, "0")}`);
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const seeds = ["0", "1", "2", "3", "4", "5", "6", "7"] as const;

let checked = 0;
const modes = new Set<string>();

for (const qlId of qls) {
  for (const language of languages) {
    for (const seedSuffix of seeds) {
      const seed = `tmw-cp006-editorial:${qlId}:${language}:${seedSuffix}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      const label = `${qlId}:${language}:${seedSuffix}`;
      checked += 1;
      modes.add(question.solveMode);

      assert(question.canonicalProblemId === "TMW-CP-006", `${label}: wrong checkpoint`);
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
      const working = question.learnerExplanation.solution.slice(0, -1).join(" ");

      assert(!/समतुल्य संसाधन-काम संबंध लिखें|बदले संसाधन और समय के मान रखें|आवश्यक राशि निकालें|ਸਮਤੁੱਲ ਸਰੋਤ-ਕੰਮ ਸੰਬੰਧ ਲਿਖੋ|ਬਦਲੇ ਸਰੋਤ ਅਤੇ ਸਮੇਂ ਦੇ ਮੁੱਲ ਰੱਖੋ|ਲੋੜੀਂਦੀ ਮਾਤਰਾ ਕੱਢੋ|equivalent resource-work relation|changed resource and time values|evaluate the required quantity/i.test(learner), `${label}: generic R4 learner labels remain`);
      assert(!/N_|D_|H_|E_|W_|Q_|r_|t_|\\text\{|\\propto/.test(learner), `${label}: internal solver notation or prose-in-MathJax leaked`);

      if (language === "hi") assert(/[\u0900-\u097F]/u.test(learner), `${label}: Hindi learner text lacks Devanagari`);
      if (language === "pa") assert(/[\u0A00-\u0A7F]/u.test(learner), `${label}: Punjabi learner text lacks Gurmukhi`);

      if (qlId === "TMW-QL-108") {
        assert(!/दैनिक कार्य-समय प्रतिदिन/u.test(learner), `${label}: Hindi daily-time wording is repetitive`);
        assert(!/ਰੋਜ਼ਾਨਾ ਕੰਮ-ਸਮਾਂ ਹਰ ਦਿਨ/u.test(learner), `${label}: Punjabi daily-time wording is repetitive`);
      }

      if (qlId === "TMW-QL-115") {
        assert(!/का (?:काम|कार्य|निर्माण) का केवल/u.test(question.stem), `${label}: duplicated Hindi genitive remains in progress stem`);
        assert(!/ਦਾ (?:ਕੰਮ|ਨਿਰਮਾਣ) ਦਾ ਸਿਰਫ਼/u.test(question.stem), `${label}: duplicated Punjabi genitive remains in progress stem`);
      }

      if (qlId === "TMW-QL-116") {
        const scalar = answerScalar(question.solution.answerText);
        assert(scalar, `${label}: cannot read extra-workforce answer`);
        assert(working.includes(`=${scalar}`), `${label}: extra-workforce subtraction is not shown to the solved answer`);
        const required = language === "hi" ? /कुल आवश्यक कर्मचारी/u : language === "pa" ? /ਕੁੱਲ ਲੋੜੀਂਦੇ ਕਰਮਚਾਰੀ/u : /total workforce required/i;
        assert(required.test(learner), `${label}: total-versus-extra workforce distinction is not explicit`);
        assert(!/वर्तमान प्रति-[^ ]+ गति/u.test(question.stem), `${label}: unnatural Hindi per-worker speed wording remains`);
        assert(!/ਮੌਜੂਦਾ ਪ੍ਰਤੀ-[^ ]+ ਗਤੀ/u.test(question.stem), `${label}: unnatural Punjabi per-worker speed wording remains`);
      }

      if (qlId === "TMW-QL-119") {
        assert(!/ओवरटाइम प्रतिदिन/u.test(question.learnerExplanation.answer), `${label}: Hindi overtime conclusion is repetitive`);
        assert(!/ਓਵਰਟਾਈਮ ਹਰ ਦਿਨ/u.test(question.learnerExplanation.answer), `${label}: Punjabi overtime conclusion is repetitive`);
      }

      if (qlId === "TMW-QL-121") {
        const dimensionality = question.parameters?.dimensionsA?.length;
        assert(dimensionality === 2 || dimensionality === 3, `${label}: unexpected dimensionality`);
        const expected = language === "hi"
          ? dimensionality === 2 ? /क्षेत्रफल/u : /आयतन/u
          : language === "pa"
            ? dimensionality === 2 ? /ਖੇਤਰਫਲ/u : /ਆਇਤਨ/u
            : dimensionality === 2 ? /area/i : /volume/i;
        assert(expected.test(question.stem), `${label}: dimensional stem does not name the exact 2D/3D measure`);
        assert(!/क्षेत्रफल या आयतन|ਖੇਤਰਫਲ ਜਾਂ ਆਇਤਨ|area or volume/i.test(question.stem), `${label}: dimensional stem still hedges between area and volume`);
      }

      if (qlId === "TMW-QL-122" || qlId === "TMW-QL-123") {
        assert(!/खुदाई का गड्ढा को/u.test(question.stem), `${label}: Hindi excavation object case is ungrammatical`);
        assert(!/ਖੁਦਾਈ ਦਾ ਖੱਡਾ ਨੂੰ/u.test(question.stem), `${label}: Punjabi excavation object case is ungrammatical`);
      }

      if (qlId === "TMW-QL-126") {
        const scalar = Number(answerScalar(question.solution.answerText));
        assert(Number.isInteger(scalar) && scalar > 0, `${label}: batch completion answer is not an integer day count`);
        const sequenceStep = question.learnerExplanation.solution.at(-2) ?? "";
        const inner = /\\\(([\s\S]*?)\\\)/.exec(sequenceStep)?.[1] ?? "";
        const lhs = inner.split("=")[0] ?? "";
        const terms = lhs.split("+").filter((part: string) => part.trim()).length;
        assert(terms === scalar, `${label}: batch explanation does not show one workforce term for each of the ${scalar} days`);
        assert(!/(?:^|[^A-Za-z])n\s*=|\(n-1\)/.test(learner), `${label}: batch explanation leaks algebraic day symbol instead of the actual daily sequence`);
      }

      if (qlId === "TMW-QL-127") {
        const required = language === "hi" ? /संसाधन-समय/u : language === "pa" ? /ਸਰੋਤ-ਸਮਾਂ/u : /resource-time/i;
        assert(required.test(question.learnerExplanation.method), `${label}: equivalent resource-time method is still a generic capacity rule`);
        const answerLead = language === "hi" ? /समतुल्य कुल/u : language === "pa" ? /ਸਮਤੁੱਲ ਕੁੱਲ/u : /equivalent total/i;
        assert(answerLead.test(question.learnerExplanation.answer), `${label}: equivalent resource-time conclusion is not naturalized`);
      }
    }
  }
}

assert(checked === 528, `Expected 528 CP006 editorial cases, got ${checked}`);
assert(modes.size === 22, `Expected 22 CP006 solve modes, got ${modes.size}`);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-006",
  qls: qls.length,
  languages: languages.length,
  seedsPerQlLanguage: seeds.length,
  checked,
  solveModes: modes.size,
  publicationLocked: true,
  verdict: "PASS",
}, null, 2));
