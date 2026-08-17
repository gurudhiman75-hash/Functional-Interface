import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function numericMath(answerText: string): string | null {
  const inner = /\\\(([\s\S]*?)\\\)/.exec(answerText)?.[1];
  if (!inner) return null;
  const cleaned = inner.replace(/\\text\{[^}]*\}/g, "").trim();
  return cleaned ? `\\(${cleaned}\\)` : null;
}

const qls = ["TMW-QL-108", "TMW-QL-116", "TMW-QL-119", "TMW-QL-121", "TMW-QL-127"] as const;
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const namespaces = ["tmw-cp006-editorial", "tmw-cp006-editorial-review"] as const;
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
        assert(question.options[question.correctIndex] === question.solution.answerText, `${label}: answer-option mismatch`);

        if (qlId === "TMW-QL-108") {
          const learner = question.learnerExplanation.answer;
          assert(!/दैनिक कार्य-समय प्रतिदिन/u.test(learner), `${label}: repetitive Hindi daily-time conclusion`);
          assert(!/ਰੋਜ਼ਾਨਾ ਕੰਮ-ਸਮਾਂ ਹਰ ਦਿਨ/u.test(learner), `${label}: repetitive Punjabi daily-time conclusion`);
        }

        if (qlId === "TMW-QL-116") {
          assert(!/वर्तमान प्रति-(.+?) गति समान रहे/u.test(question.stem), `${label}: awkward Hindi per-resource speed phrase remains`);
          assert(!/ਮੌਜੂਦਾ ਪ੍ਰਤੀ-(.+?) ਗਤੀ ਇੱਕੋ ਰਹੇ/u.test(question.stem), `${label}: awkward Punjabi per-resource speed phrase remains`);
          if (language === "hi") assert(/वर्तमान उत्पादकता/u.test(question.stem), `${label}: Hindi productivity wording missing`);
          if (language === "pa") assert(/ਮੌਜੂਦਾ ਉਤਪਾਦਕਤਾ/u.test(question.stem), `${label}: Punjabi productivity wording missing`);
        }

        if (qlId === "TMW-QL-119") {
          const sourceMath = numericMath(question.solution.answerText);
          if (sourceMath) assert(question.learnerExplanation.answer.includes(sourceMath), `${label}: overtime conclusion does not preserve student-friendly numeric answer formatting`);
          assert(!/\\text\{/.test(question.learnerExplanation.answer), `${label}: overtime conclusion puts prose inside MathJax`);
          assert(!/ओवरटाइम प्रतिदिन/u.test(question.learnerExplanation.answer), `${label}: repetitive Hindi overtime wording`);
          assert(!/ਓਵਰਟਾਈਮ ਹਰ ਦਿਨ/u.test(question.learnerExplanation.answer), `${label}: repetitive Punjabi overtime wording`);
        }

        if (qlId === "TMW-QL-121") {
          const dimensions = question.parameters?.dimensionsA?.length;
          assert(dimensions === 2 || dimensions === 3, `${label}: unexpected dimensionality`);
          const expected = language === "hi"
            ? dimensions === 2 ? /क्षेत्रफल/u : /आयतन/u
            : language === "pa"
              ? dimensions === 2 ? /ਖੇਤਰਫਲ/u : /ਆਇਤਨ/u
              : dimensions === 2 ? /area/i : /volume/i;
          assert(expected.test(question.stem), `${label}: exact dimensional measure missing from stem`);
          assert(expected.test(question.learnerExplanation.method), `${label}: exact dimensional measure missing from method`);
          assert(!/क्षेत्रफल या आयतन|ਖੇਤਰਫਲ ਜਾਂ ਆਇਤਨ|area or volume/i.test(question.stem), `${label}: stem still hedges between 2D and 3D measures`);
        }

        if (qlId === "TMW-QL-127") {
          const expected = language === "hi" ? /समतुल्य कुल/u : language === "pa" ? /ਸਮਤੁੱਲ ਕੁੱਲ/u : /equivalent total/i;
          assert(expected.test(question.learnerExplanation.answer), `${label}: resource-time conclusion is not naturalized`);
        }
      }
    }
  }
}

assert(checked === 240, `Expected 240 targeted CP006 manual-review cases, got ${checked}`);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-006",
  targetedQls: qls.length,
  languages: languages.length,
  seedNamespaces: namespaces.length,
  seedsPerNamespace: seeds.length,
  checked,
  publicationLocked: true,
  verdict: "PASS",
}, null, 2));
