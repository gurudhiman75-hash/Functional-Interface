import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const qls = Array.from({ length: 16 }, (_, index) => `TMW-QL-${String(index + 128).padStart(3, "0")}`);
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
        assert(question.options[question.correctIndex] === question.solution.answerText, `${label}: answer-option mismatch`);

        const learner = [
          question.learnerExplanation.method,
          ...question.learnerExplanation.solution,
          question.learnerExplanation.answer,
        ].join(" ");

        assert(!/[\u0000-\u001F\u007F]/.test(learner), `${label}: control character leaked into learner explanation`);
        assert(!learner.includes(`${String.fromCharCode(9)}imes`), `${label}: tab-corrupted \\times remains`);
        assert(!learner.includes(`${String.fromCharCode(12)}rac`), `${label}: form-feed-corrupted \\frac remains`);
        assert(!/\\\(([^=]+)=\1\\\)/.test(learner), `${label}: redundant exact MathJax identity remains`);
      }
    }
  }
}

assert(checked === 768, `Expected 768 CP007 MathJax integrity cases, got ${checked}`);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-007",
  qls: qls.length,
  languages: languages.length,
  seedNamespaces: namespaces.length,
  seedsPerNamespace: seeds.length,
  checked,
  controlCharacters: 0,
  redundantExactIdentities: 0,
  publicationLocked: true,
  verdict: "PASS",
}, null, 2));
