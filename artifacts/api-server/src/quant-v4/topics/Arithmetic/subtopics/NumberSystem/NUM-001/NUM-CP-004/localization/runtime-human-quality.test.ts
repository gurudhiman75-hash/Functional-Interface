import { NUM_CP004_PERMANENT_QL_IDS } from "../permanent/allocation";
import { runNumCp004LocalizedReviewFinalForQl } from "./runtime-review-human-final";
import type { NumCp004TranslatedLanguage } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const LANGUAGES = ["hi", "pa"] as const satisfies readonly NumCp004TranslatedLanguage[];
const RESIDUAL_ENGLISH_AND = /\band\b/iu;
const KNOWN_MECHANICAL = /(?:से सख़्ती से बड़ी|ਤੋਂ ਸਖ਼ਤੀ ਨਾਲ ਵੱਡੀ|दिए हैं। में किस|ਦਿੱਤੇ ਹਨ। ਵਿੱਚੋਂ ਕਿਸ|कौन-सा पर्याप्त जानकारी निष्कर्ष सही है|ਕਿਹੜਾ ਕਾਫ਼ੀ ਜਾਣਕਾਰੀ ਨਤੀਜਾ ਸਹੀ ਹੈ|पूर्ण अभाज्य गुणनखंड क्या है|ਪੂਰਾ ਅਭਾਜ ਗੁਣਨਖੰਡ ਕੀ ਹੈ)/u;
const DOUBLE_COPULA = /(?:।\s*है।|।\s*ਹੈ।)/u;
const META_CONCEPT = /(?:यह प्रश्न|ਇਹ ਪ੍ਰਸ਼ਨ|की जाँच करता है|ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ)/u;
const GENERATOR_EVIDENCE = /(?:निर्णायक मान मिलते हैं|ਨਿਰਣਾਇਕ ਮੁੱਲ ਮਿਲਦੇ ਹਨ|गणना से .* मिलता है|ਗਣਨਾ ਤੋਂ .* ਮਿਲਦਾ ਹੈ)/u;

let audited = 0;
let hindi = 0;
let punjabi = 0;

for (const qlId of NUM_CP004_PERMANENT_QL_IDS) {
  for (let seed = 1; seed <= 80; seed += 1) {
    for (const language of LANGUAGES) {
      const q = runNumCp004LocalizedReviewFinalForQl(qlId, seed, language);
      const label = `${qlId}/${seed}/${language}`;
      const learner = [q.stem, ...q.options.map((option) => option.value), q.explanation.concept, ...q.explanation.solution, q.explanation.finalAnswer].join("\n");

      assert(!RESIDUAL_ENGLISH_AND.test(learner), `${label}: residual English 'and' leaked`);
      assert(!KNOWN_MECHANICAL.test(learner), `${label}: known mechanical learner wording leaked`);
      assert(!DOUBLE_COPULA.test(learner), `${label}: duplicated copula ending leaked`);
      assert(!META_CONCEPT.test(q.explanation.concept), `${label}: meta/robotic concept wording leaked`);
      assert(!GENERATOR_EVIDENCE.test(q.explanation.solution[1] ?? ""), `${label}: generator-style evidence wording leaked`);
      assert(q.explanation.finalAnswer === q.answer, `${label}: final answer differs from localized answer`);
      assert(q.options[q.correctIndex]?.value === q.answer, `${label}: answer no longer matches correct option`);
      assert(new Set(q.options.map((option) => option.value)).size === q.options.length, `${label}: human polish collapsed distinct options`);

      const expectedPrefix = language === "hi" ? "अतः सही उत्तर:" : "ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ:";
      assert(q.explanation.solution[2]?.startsWith(expectedPrefix), `${label}: human conclusion prefix missing`);
      assert(q.explanation.solution[2]?.includes(q.answer), `${label}: human conclusion omits answer`);
      assert((q.explanation.solution[1]?.length ?? 0) >= 24, `${label}: worked evidence is too short`);

      if (qlId === "NUM-QL-021") {
        const state = q.hiddenState as Readonly<Record<string, unknown>>;
        const direction = String(state.direction ?? "");
        if (direction === "LEAST" || direction === "GREATEST") {
          assert(q.explanation.solution[1]!.includes(language === "hi" ? "अभाज्य संख्याएँ" : "ਅਭਾਜ ਸੰਖਿਆਵਾਂ"), `${label}: interval-prime list missing`);
          assert(q.explanation.solution[1]!.includes(language === "hi" ? (direction === "LEAST" ? "सबसे छोटी" : "सबसे बड़ी") : (direction === "LEAST" ? "ਸਭ ਤੋਂ ਛੋਟੀ" : "ਸਭ ਤੋਂ ਵੱਡੀ")), `${label}: interval extremum conclusion missing`);
        }
      }
      if (qlId === "NUM-QL-023") assert(!/\band\b/iu.test(q.stem), `${label}: QL023 conjunction remains English`);
      if (qlId === "NUM-QL-029" && language === "hi") assert(q.stem.includes("दिए हैं। इनमें किस"), `${label}: QL029 Hindi comparison grammar not repaired`);
      if (qlId === "NUM-QL-029" && language === "pa") assert(q.stem.includes("ਦਿੱਤੇ ਹਨ। ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕਿਸ"), `${label}: QL029 Punjabi comparison grammar not repaired`);
      if (qlId === "NUM-QL-044") assert(language === "hi" ? q.stem.includes("कौन-सा निष्कर्ष सही है?") : q.stem.includes("ਕਿਹੜਾ ਨਤੀਜਾ ਸਹੀ ਹੈ?"), `${label}: DS question remains mechanical`);

      audited += 1;
      if (language === "hi") hindi += 1;
      else punjabi += 1;
    }
  }
}

assert(audited === 4480, `Unexpected human-quality audit count ${audited}`);
assert(hindi === 2240, `Unexpected Hindi audit count ${hindi}`);
assert(punjabi === 2240, `Unexpected Punjabi audit count ${punjabi}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP004_HI_PA_HUMAN_QUALITY_V2",
  audited,
  hindi,
  punjabi,
  residualEnglishAnd: 0,
  knownMechanicalWording: 0,
  duplicatedCopulaEndings: 0,
  metaConceptWording: 0,
  generatorEvidenceWording: 0,
  answerBindingViolations: 0,
  optionCollapseViolations: 0,
  intervalPrimeEvidenceViolations: 0,
  comparisonGrammarViolations: 0,
}, null, 2));
